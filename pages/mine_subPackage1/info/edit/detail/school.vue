<template>
	<view class="container">
		<view class="title"></view>
		<u-form class="form" :model="form" ref="uForm" :rules="rules">
			<u-form-item label="姓名" label-position="left" label-width="240rpx" prop="realName" border-bottom="true">
				<u-input v-model="form.realName" border="none" placeholder="您的姓名" />
			</u-form-item>
			<u-form-item label="学号" label-position="left" label-width="240rpx" prop="schoolNo" border-bottom="true">
				<u-input v-model="form.schoolNo" border="none" placeholder="您的学号" />
			</u-form-item>
			<u-form-item label="学校" label-position="left" label-width="240rpx" prop="schoolName" border-bottom="true">
				<u-input v-model="form.schoolName" border="none" placeholder="您的学校全称" />
			</u-form-item>
			<u-form-item label="专业" label-position="left" label-width="240rpx" prop="major" border-bottom="true">
				<u-input v-model="form.major" border="none" placeholder="您的专业全称" />
			</u-form-item>
			<u-form-item label="入学时间" label-position="left" label-width="240rpx" prop="enrollmentYear"
				border-bottom="true">
				<view class="uni-list-cell-db">
					<picker mode="date" :value="form.enrollmentYear" @change="bindDateChange">
						<!--fields="year"-->
						<view class="uni-input">{{ form.enrollmentYear }}</view>
					</picker>
				</view>
			</u-form-item>
			<u-form-item label="身份" label-position="left" label-width="240rpx" border-bottom="true">
				<picker mode="selector" :range="range" @change="bindStatusChange">
					<view>{{ form.campus_identity }}</view>
				</picker>
			</u-form-item>
		</u-form>
		<view class="upload">
			点击上传证明材料
			<u-upload :auto-upload="false" width="100%" height="300rpx" @afterRead="afterRead">
				<view v-if="form.photoUrl === ''">
					<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<u-icon name="photo" size="30" :color="$u.color['lightColor']"></u-icon>
					</view>
				</view>
				<view v-else>
					<image :src="form.photoUrl" mode="aspectFill"
						style="width: 480rpx;height: 280rpx;margin-top: 20rpx;">
					</image>
				</view>
			</u-upload>
		</view>
		<u-button type="primary" shape="circle" @click="handleSubmit">提交</u-button>
	</view>
</template>

<script>
	import {
		identitySchool
	} from '@/api/user/user.js';
	import {
		changeToDate
	} from '@/utils/timestamp.js'
	import upload from '@/mixin/upload.js';
	export default {
		mixins: [upload],
		data() {
			return {
				show: false,
				form: {
					id: this.$store.state.user.userInfo.id, // 用户id
					schoolNo: null, // 学号
					realName: '', // 真实姓名
					schoolName: '', // 学校名
					major: '', // 专业
					enrollmentYear: changeToDate(Date.now()), // 入学年份 yy-mm-dd 00:00:00
					campus_identity: '本科生', // 身份 0：本科 1：研究生
					photoUrl: '', // 认证图片
					identification: 0 // 学校认证 0：未认证 1：审核中 2：已认证

				},
				range: ['本科生', '研究生'],
				// 校验
				rules: {
					schoolNo: [{
						required: true,
						message: '请输入学号',
						trigger: ['blur', 'change']
					}],
					realName: [{
						required: true,
						message: '请输入真实姓名',
						trigger: ['blur', 'change']
					}],
					schoolName: [{
						required: true,
						message: '注意要学校全称',
						trigger: ['blur', 'change']
					}],
					major: [{
						required: true,
						message: '请输入专业全称',
						trigger: ['blur', 'change']
					}],
					enrollmentYear: [{
						required: true,
						message: '请输入入学年份',
						trigger: ['blur', 'change']
					}],
					campus_identity: [{
						required: true,
						message: '请输入您的身份：本科生还是研究生',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		// onReady() {
		// 	// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
		// 	this.$refs.uForm.setRules(this.rules)
		// },
		methods: {
			//日期选择器事件
			bindDateChange(e) {
				this.form.enrollmentYear = e.detail.value;
			},
			//身份选择器事件
			bindStatusChange(e) {
				this.form.campus_identity = this.range[e.detail.value];
			},
			// 提交证明材料
			afterRead(event) {
				let imgObj = event.file;
				//给图片加上状态信息
				imgObj.status = 'uploading'
				imgObj.message = '上传中'
				// 上传图片 返回一个新的url
				this.uploadAvatar(imgObj.url);
				// imgObj.status = 'success';
				// imgObj.message = ''
				// imgObj.url = newUrl;
				// this.form.photoUrl = newUrl;
			},
			// 提交认证
			handleSubmit() {
				this.$refs.uForm.validate().then(res => {
					if(this.form.photoUrl === ''){
						uni.$u.toast('请上传认证材料如学生证或校园卡');
					}else{
						uni.$u.toast('校验通过，正在提交');
						this.identitySchool();
					}
				}).catch(errors => {
					console.log(this.form);
					console.log(errors)
					uni.$u.toast('请将认证信息填写完毕')
				})
			},
			// 提交认证接口
			async identitySchool(){
				let obj  = Object.assign({},this.form);
				obj.enrollmentYear += " 00:00:00";
				obj.campus_identity = this.form.campus_identity === '本科生' ? 0 : 1;
				obj.schoolNo = Number(this.form.schoolNo);
				console.log(obj)
				const { data } = await identitySchool(obj);
				console.log(data);
			},
			uploadAvatar(tempUrl) {
				const uploadParams = this.$store.state.uploadParams;
				const fileName = uploadParams.dir + tempUrl.slice(12);
				console.log(fileName);
				uni.uploadFile({
					url: uploadParams.host,
					filePath: tempUrl,
					name: 'file',
					formData: {
						key: fileName,
						policy: uploadParams.policy,
						OSSAccessKeyId: uploadParams.accessKeyId,
						signature: uploadParams.signature
					},
					success: res => {
						console.log(res);
						if (res.statusCode == 204) {
							let uploadedUrl = uploadParams.host + '/' + fileName;
							this.form.photoUrl = uploadedUrl;
							uni.showToast({
								title: '上传成功',
								icon: 'success'
							});
						}
					},
					fail: res => {
						uni.showToast({
							title: '上传失败',
							icon: 'error'
						});
						console.log(res)
					},
					complete: (res) => {
						console.log(res);
					}
				})
			},
		}
	};
</script>

<style scoped>
	.container {
		width: 90%;
		margin: 0 auto;
	}

	.title {
		padding: 20rpx;
	}

	.upload {
		width: 70%;
		height: 300rpx;
		margin: 40rpx auto;
		padding: 30rpx 60rpx 60rpx;
		text-align: center;
		color: #aaabac;
		border: 2rpx dashed #aaabac;
		border-radius: 20rpx;
	}

	.slot-btn {
		/* 	width: 329rpx;
	height: 140rpx; */
		width: 480rpx;
		height: 280rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(244, 245, 246);
		border-radius: 10rpx;
		margin-top: 20rpx;
	}

	.slot-btn__hover {
		background-color: rgb(235, 236, 238);
	}
</style>
