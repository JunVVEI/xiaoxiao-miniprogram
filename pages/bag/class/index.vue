<template>
	<view class="container">
		<!-- 导航栏-->
		<view :style="{ paddingTop: systemBarHeight + 'px'}" class="navBarBox">
			<uni-nav-bar height="44px" >
				<!-- 更新课表按钮 -->
				<view class="update">
					<view class="btn" @click="updateClass"><uni-icons type="refreshempty" size="25"></uni-icons></view>
				</view>

				<!-- 选择周 -->
				<view class="selectWeek" v-if="weekList.length">
					<picker @change="weekChange" :value="weekIndex" :range="weekList" selector-type="auto">
						<view style="display: flex;">
							<uni-icons type="bars" size="19" color="#a6a6a6"></uni-icons>
							<view style="padding-left: 5rpx;line-height: 20px;">{{ weekList[weekIndex] }}</view>
						</view>
					</picker>
				</view>
			</uni-nav-bar>
		</view>
		<!-- 顶部星期几 -->
		<view class="week">
			<!-- 选择学期 -->
			<view class="selectTerm" v-if="termList.length">
				<picker @change="termChange" :value="termIndex" :range="termList" selector-type="auto">
					<view>
						<view>{{ termDetail[termIndex] }}</view>
					</view>
				</picker>
			</view>
			<view v-for="(item, index) in week" :key="index" class="day"
				:style="{ backgroundColor: isToday(weekTimeList[weekIndex][index]), color: isToday(weekTimeList[weekIndex][index]) !== 'none' ? '#fff' : '#333' }"
				v-if="item.length">
				<view>
					<view>周{{ item }}</view>
					<view v-if="termIndex == termListLength - 1 && weekIndex != 0" style="font-size: 9pt;">
						{{ weekTimeList[weekIndex][index] }}
					</view>
				</view>
			</view>
		</view>

		<view class="main" :style="{ height: classHeight + 'rpx' }">
			<!-- 课表主体 -->
			<view class="classContainer" >
				<!-- 节次 -->
				<view class="sectionList">
					<view class="section-item" v-for="(item, index) in section" :key="index">
						<view>
							<view style="font-size: 28rpx;">{{ item.section }}</view>
							<view class="">{{ item.time }}</view>
						</view>
						<view style="position: absolute; bottom: 0;"><u-line length="1000" :dashed="true"
								color="#000"></u-line></view>
					</view>
				</view>
				<!-- 课程列表 -->
				<swiper :duration="300" @change="onChange" :current="weekIndex" v-if="courseList.length"
					:style="{ height: '1125px', paddingLeft: '85rpx' }">
					<!-- 每周的课程 -->
					<swiper-item v-for="(weekData, index) in courseList" :key="index" :style="{ display: 'flex' }">
						<!-- 每天的课程列 -->
						<view class="courses" v-for="(dayList, dayIndex) in weekData.daysCourses" :key="dayIndex">
							<!-- 每个时间段的课程 -->
							<view class="courses-item" v-for="(course, courseIndex) in dayList" :key="courseIndex"
								
								:style="{ backgroundColor: toHash(course.courseName), height: setHeight(course.courseTime) + 'px', top: setTop(course.courseTime) + 'px' }"
								@click="editCourse(courseList[weekIndex].daysCourses[dayIndex][courseIndex])">
								<view class="detail">
									<view>{{ course.courseName }}</view>
									<view>{{ course.location ? course.location : '' }}</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<view style="font-size: 10pt; padding: 10rpx 5rpx 40rpx 10rpx; display: flex;align-items: flex-start;"
					v-if="courseNotes.length">
					<u-icon name="info-circle-fill" size="25px" color="#3c9cff"></u-icon>
					<view style="padding-left: 5rpx;">
						<view class="" v-for="(item, index) in courseNotes" :key="index">{{ item }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 悬浮球 -->
		<!-- <zetank-suspension :scrollTop="scrollTop" :color="fabColor" :list="fabList"></zetank-suspension> -->
		<!-- 课程信息弹窗 -->
		<u-popup :show="popupShow" @close="closePopup" mode="center" closeOnClickOverlay :round="10" :duration="200"
			:customStyle="{ padding: '15px', width: '450rpx' }">
			<view>
				<u--form labelPosition="left" :model="courseForm" ref="courseForm">
					<u-form-item label="课程名称:" prop="courseForm.courseName" labelWidth="140rpx">
						<u--input :disabled="true" shape="circle" v-model="courseForm.courseName"
							border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="上课教室:" prop="courseForm.location" labelWidth="140rpx">
						<u--input :disabled="true" shape="circle" v-model="courseForm.location"
							border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="任课老师:" prop="courseForm.teacher" labelWidth="140rpx">
						<u--input :disabled="true" shape="circle" v-model="courseForm.teacher"
							border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="上课周次:" prop="courseForm.week" labelWidth="140rpx">
						<u--input :disabled="true" shape="circle" v-model="courseForm.week" border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="星期:" prop="courseForm.day" labelWidth="140rpx">
						<u--input :disabled="true" shape="circle" v-model="courseForm.day" border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="时间段:" prop="courseForm.time" labelWidth="140rpx">
						<u--input :disabled="true" shape="circle" v-model="courseForm.time" border="bottom"></u--input>
					</u-form-item>
				</u--form>
				<view style="padding-top: 10px;"><u-button text="确定" type="primary" shape="circle" size="normal"
						@click="confirmEdit"></u-button></view>
			</view>
		</u-popup>
		<!-- 首次登录弹窗 -->
		<u-modal width="500rpx" :show="loginShow" title="提示" content="请先登录教务系统" confirmText="去登录"
			@confirm="toLogin"></u-modal>
	</view>
</template>

<script>
	import {
		getCourse,
		getTerm,
		getWeek
	} from '@/api/course/index.js';
	export default {
		data() {
			return {
				RATE: this.RATE,
				pH: this.pH,
				isOnline: true,
				loginShow: false, //登录弹窗
				lineLength: wx.getSystemInfoSync().screenWidth * this.RATE + 'px',
				systemBarHeight: 0, // 顶部状态栏高度
				classHeight: 0, //元素的所需高度
				popupShow: false, //备注课程弹窗显示参数
				weekIndex: 0, // 当前周下标
				termIndex: this.$store.state.termIndex, //学期下标
				weekList: this.$store.state.weekList, // 存放本学期的周数
				termList: [], //存放每个学期
				termListLength: 0,
				termDetail: ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'],
				week: ['一', '二', '三', '四', '五', '六', '日'],
				section: [{
						section: '①',
						time: '08:00 08:40'
					},
					{
						section: '②',
						time: '08:45 09:25'
					},
					{
						section: '③',
						time: '09:55 10:35'
					},
					{
						section: '④',
						time: '10:40 11:20'
					},
					{
						section: '⑤',
						time: '11:25 12:05'
					},
					{
						section: '⑥',
						time: '12:40 13:20'
					},
					{
						section: '⑦',
						time: '13:25 14:05'
					},
					{
						section: '⑧',
						time: '14:30 15:10'
					},
					{
						section: '⑨',
						time: '15:15 15:55'
					},
					{
						section: '⑩',
						time: '16:25 17:05'
					},
					{
						section: '⑪',
						time: '17:10 17:50'
					},
					{
						section: '⑫',
						time: '17:55 18:35'
					},
					{
						section: '⑬',
						time: '19:30 20:10'
					},
					{
						section: '⑭',
						time: '20:15 20:55'
					},
					{
						section: '⑮',
						time: '21:00 21:40'
					}
				],
				// 学号
				studentNo: '',
				// 课程块颜色列表
				colorList: [
					'#CCB69B',
					'#3c9cff',
					'#ea8cc1',
					'#5DADE2',
					'#7C83FD',
					'#764AF1',
					'#f9ae3d',
					'#5ac725',
					'#008F7A',
					'#D09E80',
					'#f56c6c',
					'#845EC2',
					'#7d8396',
					'#008F7A',
					'#a7a1e5',
					'#e34977',
					'#b18ad0',
					'#FF8066',
					'#28839F',
					'#6ed6d6',
					'#0ec9ee',
					'#71A1ED',
					'#FFD38B',
					'#a0b8b1',
					'#6771b6',
					'#00ABB3',
					'#9cddbb',
					'#3E4784',
					'#088AB2'
				],

				// 学期全部课程信息
				courseList: [],
				// 学期的课程备注
				courseNotes: this.$store.state.courseNotes ? this.$store.state.courseNotes : '',
				// 每周日期的列表
				weekTimeList: this.$store.state.weekTimeList ? this.$store.state.weekTimeList : [],
				// 悬浮导航栏参数
				fabColor: '#3c9cff',
				fabList: [{
					icon: {
						name: 'share',
						customprefix: 'uicon'
					},
					name: '分享'
				}],

				// 弹窗表单
				courseForm: {
					courseName: '',
					location: '',
					teacher: '',
					week: '',
					day: '',
					time: ''
				}
			};
		},
		onShareAppMessage() {
			return {
				title: '查看我的课表', //分享标题
				path: 'pages/bag/class/index', //分享页面路径
				imageUrl: '', //分享图标
				desc: '' //自定义分享描述
			};
		},
		onLoad: function() {
			let that = this;

			// 获取手机顶部状态栏高度
			this.systemBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

			// 课表元素高度
			uni.getSystemInfo({
				success: res => {
					this.classHeight = (res.windowHeight - this.systemBarHeight - 90) * that.RATE;
				}
			});

			// 获取本地存储的学号
			this.studentNo = uni.getStorageSync('studentNo');

			if (!this.studentNo) {
				this.studentNo = ''
				this.loginShow = false;
				this.getTerm();
			} else {
				this.loginShow = false;
				/* 以下是有网络且本地存有学号的情况 */
				this.getTerm();
			}
		},
		methods: {
			// 登录弹窗		
			toLogin() {
				uni.navigateTo({
					url: '/pages/bag/class/login/index'
				});
			},
			// 获取学期
			getTerm() {
				getTerm({
					studentNo: this.studentNo,
					uid: '',
					wechatId: '',
					deviceId: ''
				}).then(res => {
					if (res.data.data.length === 0) {
						this.loginShow = true;
					} else {
						this.termList = res.data.data.sort();
						this.termListLength = this.termList.length;
						this.termIndex = this.termListLength - 1;
						this.getCourseData();
					}

				});
			},

			// 获取课表
			getCourseData() {
				let that = this;
				getCourse({
					studentNo: this.studentNo,
					uid: '',
					wechatId: '',
					deviceId: '',
					term: this.termList[this.termIndex]
				}).then(res => {
					that.weekList = ['全部']
					for (let i = 1; i < res.data.data.termCourses.length; i++) {
						that.weekList.push('第' + i + '周');
					}
					that.courseList = res.data.data.termCourses;
					that.courseNotes = res.data.data.notes;

					if (this.termIndex != this.termListLength - 1) {
						this.weekIndex = 0;
					} else {
						// 获取周
						getWeek().then(res => {
							that.weekIndex = res.data.data.currentWeek;
							if(that.weekIndex + 1 > this.weekList.length) that.weekIndex = this.weekList.length - 1
							if (!that.weekTimeList.length) {
								// 顶部日期的数组
								that.weekTimeList.unshift([]);
								for (let i = 0; i < that.weekList.length; i++) {
									let time = new Date(res.data.data.termStartTime);
									let date1 = new Date(time.setDate(time.getDate() + 7 * i));
									let arr = new Array();
									for (let j = 0; j < 7; j++) {
										let date2 = new Date(date1);
										arr.push(that.timestampToTime(date2.setDate(date2.getDate() + j)));
									}
									that.weekTimeList.push(arr);
								}
							}
						});
					}
				});
			},
			// 时间戳转换为时间
			timestampToTime(timestamp) {
				timestamp = timestamp ? timestamp : null;
				let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let M = date.getMonth() + 1 < 10 ? +(date.getMonth() + 1) : date.getMonth() + 1;
				let D = date.getDate() < 10 ? +date.getDate() : date.getDate();
				return M + '/' + D;
			},

			// 判断今天是周几
			isToday(date) {
				if (this.termIndex != this.termListLength - 1) return 'none';
				let today = Date.parse(new Date());
				if (date === this.timestampToTime(today)) return '#3c9cff';
				else return 'none';
			},
			// 导航栏返回上一页事件
			backPage() {
				uni.navigateBack(1);
			},
			// 更新课表事件
			updateClass() {
				uni.showModal({
					title: '确认更新课表吗？',
					success: (e) => {
						if (e.confirm) {
							uni.navigateTo({
								url: '/pages/bag/class/login/index'
							});
						}
					}
				})
			},
			// 周数改变监听事件
			weekChange(e) {
				if (e.detail.value === '全部') {
					this.weekIndex = 0;
					return;
				}
				this.weekIndex = e.detail.value;
			},
			// 学期改变事件
			termChange(e) {
				if (this.termIndex != e.detail.value) {
					this.termIndex = e.detail.value;
					this.getCourseData();
				}
			},
			// 设置课程卡片高度
			setHeight(s) {
				const len = s.length;
				const start = s[1] + s[2];
				const end = s[len - 2] + s[len - 1];
				return (Number(end) - Number(start) + 1) * 75;
			},
			// 设置课程卡片的位置
			setTop(s) {
				let start = s[1] + s[2];
				return (Number(start) - 1) * 75;
			},
			// 设置课程名转hash获取颜色
			toHash(courseId) {
				let hascode = 0;
				for (let i = 0; i < courseId.length; i++) {
					//37为质数
					//通过这种算法可以满足比较大的hashcode值
					hascode = 41 * hascode + courseId.charCodeAt(i);
				}
				//通过取余操作可以将hascode压缩到数组大小范围中
				let index = hascode % this.colorList.length;
				return this.colorList[index];
			},
			// 分享课表
			shareCourse() {
				uni.showToast({
					title: '点击右上角的更多"发送给朋友"即可分享课表',
					duration: 1500,
					icon: 'none'
				});
			},
			// 悬浮球触发事件
			trigger(e) {
				if (e.index === 0) {
					this.fab.content[e.index].active = true;
					uni.showToast({
						title: '点击右上角的更多"发送给朋友"即可分享课表',
						duration: 1500,
						icon: 'none'
					});
				} else {
					false;
				}
			},
			// swiper事件
			onChange(e) {
				this.weekIndex = e.detail.current;
				if (this.weekIndex === 0) {
					uni.showToast({
						title: '全部',
						duration: 600,
						icon: 'none'
					});
					return;
				}
				uni.showToast({
					title: '第' + this.weekIndex + '周',
					duration: 600,
					icon: 'none'
				});
			},
			// 点击课程卡片事件
			editCourse(e) {
				this.popupShow = true;
				this.courseForm.courseName = e.courseName;
				this.courseForm.location = e.location;
				this.courseForm.teacher = e.teacherNames;
				this.courseForm.week = e.weeks;
				this.courseForm.day = e.courseTimeShow[1];
				this.courseForm.time = e.startTime + '-' + e.endTime;
			},
			// 确认修改课程事件
			confirmEdit() {
				this.popupShow = false;
			},
			// 弹窗取消事件
			closePopup() {
				this.popupShow = false;
			}
		}
	};
</script>

<style scoped>
	.container {
		position: relative;
		width: 100%;
	}

	.update {
		position: absolute;
		height: 100%;
		left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.navBarBox {
		position: relative;
	}

	.selectWeek {
		position: absolute;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		margin-top: 12px;
		margin-right: 10rpx;
	}

	.selectWeek {
		right: 200rpx;
	}

	.selectTerm picker,
	.selectWeek picker {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10pt;
		text-align: center;
	}

	.selectTerm picker {
		padding: 0;
		background-color: #19be6b;
		color: #fff;
		width: 80rpx;
		height: 100rpx;
		font-size: 9pt;
		border-radius: 5px;
	}

	.week {
		display: flex;
		text-align: center;
		background-color: #f5f5f5;
		color: #777;
	}

	.day {
		display: flex;
		width: 100rpx;
		height: 100rpx;
		font-size: 10pt;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
	}

	/* 课表主体 */
	.main {
		position: relative;
		width: 100%;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overflow-x: hidden;
	}

	.classContainer {
		width: 100%;
	}

	.sectionList {
		display: flex;
		flex-direction: column;
		position: absolute;
		width: 80rpx;
		background-color: #f5f5f5;
		left: 0;
	}

	.section-item {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 75px;
		text-align: center;
		font-size: 8pt;
		color: #777;
	}

	.courses {
		position: relative;
		height: 1125px;
		width: 100rpx;
		margin: 0 auto;
	}

	.courses-item {
		position: absolute;
		left: 2rpx;
		width: 90%;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 9pt;
		color: #fff;
	}

	.detail {
		width: 90%;
		text-align: center;
	}
</style>