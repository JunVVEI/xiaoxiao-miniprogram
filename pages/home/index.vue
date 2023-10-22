<template>
	<view class="container" @click="clickContainer()">
		<!-- 头部 -->
		<view class="header">
			<!-- 校徽 -->
			<view style="border-radius: 50%; overflow: hidden">
				<u--image src="/static/school.jpg" width="60rpx" height="60rpx" mode="widthFix"
					:fade="false"></u--image>
			</view>
			<!-- 搜索框 -->
			<view class="search">
				<u-search placeholder="搜索校园新鲜事" :clearabled="true" bgColor="white" borderColor="#55aaff" focus
					:showAction="false" v-model="searchKeyword" height="60rpx" @click="gonavigate_search"
					:disabled="true"></u-search>
			</view>
			<view class="edit" @click.stop="show.createPop = true">
				<u--image src="/static/edit.jpg" width="52rpx" height="52rpx" :fade="false" mode="widthFix"></u--image>
			</view>
		</view>
		<!-- tab -->
		<view class="tab">
			<u-tabs ref="uTabs" name="name" :list="tabsList" :is-scroll="false" :current="current" scrollable
				active-color="#0e5aff" inactive-color="#606266" font-size="30" @change="tabsChange">
				<view slot="right" style="width: 180rpx;"
					v-if="swiperCurrent !== 0 && swiperCurrent !== 2 && swiperCurrent !== 3">
					<!-- 排序 -->
					<view style="margin-left: 10px;">
						<u-subsection bold activeColor="#333" inactiveColor="#767676" mode="button" :list="sortList"
							:current="currentTab" @change="switchTab"></u-subsection>
					</view>
				</view>
			</u-tabs>
		</view>
		<!-- 主体 -->
		<view class="main">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
				:height="scrollHeight">
				<!-- 轮播窗体 -->
				<swiper :current="swiperCurrent" @change="onChange" :style="{ height: scrollHeight }">
					<swiper-item key="0">
						<!-- 存放关注页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<explore v-if="isNull"></explore>
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in followList" :key="item.id">
								<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index"></post>
								<view style="height: 260rpx" v-if="index === followList.length - 1"><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
					<swiper-item key="1">
						<!-- 存放推荐页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in postList" :key="item.id">
								<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index"></post>
								<view style="height: 260rpx" v-if="index === postList.length - 1"><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
					<swiper-item key="2">
						<!-- 存放悬赏页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in helpList" :key="item.id">
								<help v-if="isOnline" @help="getHelpId" :helpItem="item" :helpIndex="index" type="1">
								</help>
								<view style="height: 260rpx" v-if="index === helpList.length - 1"><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
					<swiper-item key="3">
						<!-- 存放二手页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in secondHandList" :key="item.id">
								<help v-if="isOnline" @help="getSecondHandId" :helpItem="item" :helpIndex="index"
									type="2"></help>
								<view style="height: 260rpx" v-if="index == secondHandList.length - 1 "><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
					<swiper-item key="4">
						<!-- 存放新生标签页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in newStuPostList" :key="item.id">
								<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index"></post>
								<view style="height: 260rpx" v-if="index === newStuPostList.length - 1"><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
					<swiper-item key="5">
						<!-- 存放考研标签页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in tag1PostList" :key="item.id">
								<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index"></post>
								<view style="height: 260rpx" v-if="index === tag1PostList.length - 1"><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
					<swiper-item key="6">
						<!-- 存放求职标签页面 -->
						<u-list @scrolltolower.stop="scrolltolower_post">
							<error v-if="!isOnline"></error>
							<u-list-item v-for="(item, index) in tag2PostList" :key="item.id">
								<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index"></post>
								<view style="height: 260rpx" v-if="index === tag2PostList.length - 1"><u-loadmore
										:status="postStatus" /></view>
							</u-list-item>
						</u-list>
					</swiper-item>
				</swiper>
			</mescroll-body>
			<view>

			</view>
		</view>
		<!-- 发帖弹出层 -->
		<u-popup :show="show.createPop" :round="10" mode="bottom" :customStyle='{bottom: "20rpx"}' bgColor="transparent"
			:safeAreaInsetBottom="false">
			<view class="createPop-container">
				<view class="item" @click="gonavigate_createPost"
					style="background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
					<view style="background-color: #2b7cff; border-radius: 50%; padding: 10rpx;margin-left: 20rpx">
						<u-icon name="edit-pen" color="#fff" size="75rpx"></u-icon>
					</view>
					<view style="width: 230rpx;margin-right: 100rpx;text-align: center">
						<p class="title">发布帖子</p>
						<p class="description">记录你的校园生活</p>
					</view>
				</view>
				<view class="item" @click="toCreateHelp"
					style="background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);">
					<view style="background-color: #e99e42;border-radius: 50%;padding: 10rpx;margin-left: 20rpx">
						<u-icon name="red-packet" color="#fff" size="75rpx"></u-icon>
					</view>
					<view style="width: 230rpx;margin-right: 100rpx;text-align: center">
						<p class="title">发布悬赏</p>
						<p class="description">校友一起来帮忙</p>
					</view>
				</view>
				<view class="item" @click="toCreateSecondHand"
					style="background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);">
					<view
						style="background-color:rgb(249, 241, 9);border-radius: 50%;padding: 10rpx;margin-left: 20rpx">
						<u-icon name="rmb-circle" color="#000" size="75rpx"></u-icon>
					</view>
					<view style="width: 230rpx;margin-right: 100rpx; text-align: center">
						<p class="title">二手交易</p>
						<p class="description">发布你的闲置物品</p>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import post from '@/UI/post/post';
	import error from '@/UI/404/index';
	import explore from '@/UI/explore/explore';
	import help from '@/UI/help/index';
	import {
		listAll,
		getPostsByFollow,
		delPost,
		listPin
	} from '@/api/bbs/post.js';
	import {
		getTaskList,
		removeTask,
		taskAccept,
		taskUnAccept
	} from '@/api/help/index.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		report
	} from '@/api/bbs/report';
	import {
		listHot
	} from '@/api/bbs/post';
	import {
		getMyPosts
	} from '@/api/user/user.js';

	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			post,
			error,
			// activity,
			explore,
			help
		},
		data() {
			return {
				userInfo: {},
				//post区域高度
				height: 0,
				//搜索输入框
				searchKeyword: '',
				//判断是否有网络
				isOnline: true,
				// 帖子操作弹窗
				sheetShow: false,
				// 悬赏帖子操作弹窗
				helpSheetShow: false,
				// tab列表
				tabsList: [{
						name: '关注'
					},
					{
						name: '推荐'
					},
					{
						name: '悬赏'
					},
					{
						name: '二手'
					},
					{
						name: '闲聊'
					},
					{
						name: '考研'
					},
					{
						name: '求职'
					}
				],
				// 帖子操作弹窗
				sheetList: [{
					name: '举报帖子',
					id: 2
				}],

				// 操作弹窗
				helpSheetList: [{
					name: '举报',
					id: 1
				}, ],
				// 悬赏
				// 当前tab下标
				current: 1,
				// 当前轮播页下标
				swiperCurrent: 1,
				//判断是否正在获取列表数据
				isloading: false,
				show: {
					//活动弹出框
					activity: false,
					//排序选择框
					option: '',
					//搜索控件
					showAction: false,
					//发帖弹出窗
					createPop: false
				},
				//排序默认值
				optionVal: '1',
				// 排序列表数据
				sortList: ['综合', '最新'],
				// 当前tab
				currentTab: 0,
				//分页请求数据
				params: {
					orderFlag: 1,
					currentPage: 1,
					pageSize: 10
				},
				//关注列表请求数据
				followParams: {
					orderFlag: 1,
					currentPage: 1,
					pageSize: 10
				},
				//活动列表请求数据
				atvParams: {
					order: 0,
					currentPage: 1,
					pageSize: 10
				},
				//关注列表
				followList: [],
				//帖子列表
				postList: [],
				// 活动帖子本地模拟数据
				activityList: [],
				//加载提示
				postStatus: 'nomore',
				// 选中的帖子id
				postItemId: null,
				// 选中的帖子下标
				postIndex: null,

				// 选中的悬赏帖子id
				helpItemId: null,
				// 选中的二手贴id
				secondHandId: null,
				// 选中的悬赏帖子下标
				helpIndex: null,
				// 选中的二手贴下标
				secondHandIndex: null,

				// 悬赏页
				helpList: [],
				// 悬赏请求参数
				helpParams: {
					type: 1,
					currentPage: 1,
					pageSize: 10,
				},
				secondHandList: [],
				// 二手请求参数
				seconHandParams: {
					type: 2,
					currentPage: 1,
					pageSize: 10,
				},
				tag1PostList: [],
				//新生页请求数据
				newStuParams: {
					orderFlag: 1,
					currentPage: 1,
					pageSize: 10,
					tagId: 3
				},
				newStuPostList: [],
				//分页请求数据
				tag1Params: {
					orderFlag: 1,
					currentPage: 1,
					pageSize: 10,
					tagId: 1
				},
				tag2PostList: [],
				//分页请求数据
				tag2Params: {
					orderFlag: 1,
					currentPage: 1,
					pageSize: 10,
					tagId: 2
				}
			};
		},
		computed: {
			//判断关注列表是否空
			isNull() {
				return this.followList.length === 0 && this.isOnline === true;
			},
			//计算主体高度
			scrollHeight() {
				let systemInfo = wx.getSystemInfoSync();
				return systemInfo.windowHeight - (60 + 100 + 15) / this.RATE + 'px';
			}
		},
		onLoad() {
			let that = this;
			//判断网络状态
			uni.getNetworkType({
				success: function(res) {
					res.networkType === 'none' ? (that.isOnline = false) : (that.isOnline = true);
				}
			});
		},
		onReady() {
			//初始化加载数据
			this.getFollowList(true);
			this.getPostList(true);
			// this.getNewStuPostList(true);
			// this.getTag1PostList(true);
			// this.getTag2PostList(true);
			// this.getHelpList(true);
			this.getSecondHandList(true);
		},
		onShow() {
			this.getUserLatestPost();
		},
		methods: {

			// 获取个人最近的一个发帖信息
			async getUserLatestPost() {
				const params = {
					currentPage: 1,
					pageSize: 10,
					orderFlag: 2,
					type: 1
				};
				const {
					data: {
						data: {
							data
						}
					}
				} = await getMyPosts(params);
				if (data.length === 0) {
					return;
				}
				if (data[0].createTime + 10 * 60 * 1000 < Date.now()) {
					return;
				}
				let inPostList = false;
				for (let i = 0; i < this.postList.length; i++) {
					if (this.postList[i].id == data[0].id) {
						inPostList = true;
						break;
					}
				}
				if (inPostList) {
					return;
				}
				this.postList.unshift(data[0]);
			},
			//点击最外层
			clickContainer() {
				//将所有show都变为false
				for (let index in this.show) {
					this.show[index] = false;
				}
			},
			// tabs通知swiper切换
			tabsChange(e) {
				this.swiperCurrent = e.index;
			},
			// swiper通知tab切换
			onChange(e) {
				this.current = e.detail.current;
				this.swiperCurrent = e.detail.current
				if (this.tabsList[this.current].name === "推荐") {
					this.sortList = ['综合', '最新']
					if (this.params.orderFlag === 1) {
						this.currentTab = 0;
					} else {
						this.currentTab = 1;
					}
				} else if (this.tabsList[this.current].name === "闲聊") {
					if (!this.newStuPostList.length) {
						this.getNewStuPostList(true);
					}
					this.sortList = ['综合', '最新']
					if (this.newStuParams.orderFlag === 1) {
						this.currentTab = 0;
					} else {
						this.currentTab = 1;
					}
				} else if (this.tabsList[this.current].name === "考研") {
					if (!this.tag1PostList.length) {
						this.getTag1PostList(true);
					}
					this.sortList = ['综合', '最新']
					if (this.tag1Params.orderFlag === 1) {
						this.currentTab = 0;
					} else {
						this.currentTab = 1;
					}
				} else if (this.tabsList[this.current].name === "求职") {
					if (!this.tag2PostList.length) {
						this.getTag2PostList(true);
					}
					this.sortList = ['综合', '最新']
					if (this.tag2Params.orderFlag === 1) {
						this.currentTab = 0;
					} else {
						this.currentTab = 1;
					}
				} else if(this.tabsList[this.current].name === "悬赏"){
					if (!this.helpList.length) {
						this.getHelpList(true);
					}
				}else if(this.tabsList[this.current].name === "二手"){
					if (!this.secondHandList.length) {
						this.getSecondHandList(true);
					}
				}
			},
			//分页查询
			async getPostList(isRefresh = false) {
				let res = await listAll(this.params);
				if (res.data.data.data.length) {
					let arr = res.data.data.data;
					if (isRefresh) {
						// 如果是刷新操作，则请求一一次置顶帖子列表
						listPin().then(res => {
							// 将置顶帖子与帖子列表listAll的数据合在一起
							arr = [...res.data.data, ...arr];
							// 由于，帖子列表中的帖子可能包含了置顶帖子，需要做去重
							arr = arr.filter((item, index, array) => {
								return array.map(mapItem => mapItem.id).indexOf(item.id) === index;
							});
							this.postList.splice(0, this.postList.length, ...arr);
						})
					} else {
						this.postList = [...this.postList, ...arr]
					}
					// await this.getUserLatestPost();
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},
			// 新生tag
			async getNewStuPostList(isRefresh = false) {
				let res = await listAll(this.newStuParams);
				if (res.data.data.data.length) {
					const arr = res.data.data.data;
					//如果是下拉刷新则不拼接数组
					isRefresh ? this.newStuPostList.splice(0, this.newStuPostList.length, ...arr) : (this
						.newStuPostList = [...this.newStuPostList, ...arr]);
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},

			// 悬赏
			async getHelpList(isRefresh = false) {
				let res = await getTaskList(this.helpParams);
				if (res.data.data.data.length) {
					const arr = res.data.data.data;
					//如果是下拉刷新则不拼接数组
					isRefresh ? this.helpList.splice(0, this.helpList.length, ...arr) : (this
						.helpList = [...this.helpList, ...arr]);
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},

			// 二手
			async getSecondHandList(isRefresh = false) {
				let res = await getTaskList(this.seconHandParams);
				if (res.data.data.data.length) {
					const arr = res.data.data.data;
					//如果是下拉刷新则不拼接数组
					isRefresh ? this.secondHandList.splice(0, this.secondHandList.length, ...arr) : (this
						.secondHandList = [...this.secondHandList, ...arr]);
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},



			//分页查询
			async getTag1PostList(isRefresh = false) {
				let res = await listAll(this.tag1Params);
				if (res.data.data.data.length) {
					const arr = res.data.data.data;
					//如果是下拉刷新则不拼接数组
					isRefresh ? this.tag1PostList.splice(0, this.postList.length, ...arr) : (this.tag1PostList = [...
						this.tag1PostList, ...arr
					]);
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},
			//分页查询
			async getTag2PostList(isRefresh = false) {
				let res = await listAll(this.tag2Params);
				if (res.data.data.data.length) {
					const arr = res.data.data.data;
					//如果是下拉刷新则不拼接数组
					isRefresh ? this.tag2PostList.splice(0, this.tag2PostList.length, ...arr) : (this.tag2PostList = [
						...this.tag2PostList, ...arr
					]);
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},


			//查询关注列表
			getFollowList(isRefresh = false) {
				getPostsByFollow(this.followParams)
					.then((res) => {
						if (res.data.data.data.length) {
							const arr = res.data.data.data;
							//如果是下拉刷新则不拼接数组
							isRefresh ? (this.followList = arr) : (this.followList = [...this.followList, ...arr]);
						}
					})
					.finally((res) => {
						this.isloading = false;
					});
			},

			//监听帖子上拉触底
			scrolltolower_post() {
				//如果正在加载则不获取数据
				if (!this.isloading) {
					this.isloading = true; //正在加载
					if (this.tabsList[this.current].name === "关注") {
						this.followParams.currentPage++;
						this.getFollowList(); //获取关注列表
					} else if (this.tabsList[this.current].name === "推荐") {
						this.params.currentPage++;
						this.getPostList(); //分页查询
					} else if (this.tabsList[this.current].name === "悬赏") {
						this.helpParams.currentPage++;
						this.getHelpList()
					} else if (this.tabsList[this.current].name === "闲聊") {
						this.newStuParams.currentPage++;
						this.getNewStuPostList(); //分页查询
					} else if (this.tabsList[this.current].name === "考研") {
						this.tag1Params.currentPage++;
						this.getTag1PostList(); //分页查询
					} else if (this.tabsList[this.current].name === "求职") {
						this.tag2Params.currentPage++;
						this.getTag2PostList(); //分页查询
					} else if (this.tabsList[this.current].name === "二手") {
						this.seconHandParams.currentPage++;
						this.getSecondHandList(); //分页查询
					}
				}
			},

			// 排序切换
			switchTab(e) {
				if (this.currentTab === e) return;
				this.currentTab = e
				if (this.tabsList[this.current].name === "推荐") {
					this.params.orderFlag = e + 1;
					this.params.currentPage = 1;
					this.mescroll.triggerDownScroll();
				} else if (this.tabsList[this.current].name === "悬赏") {
					this.helpParams.currentPage = 1;
					this.mescroll.triggerDownScroll();
				} else if (this.tabsList[this.current].name === "闲聊") {
					this.newStuParams.orderFlag = e + 1;
					this.newStuParams.currentPage = 1;
					this.mescroll.triggerDownScroll();
				} else if (this.tabsList[this.current].name === "考研") {
					this.tag1Params.orderFlag = e + 1;
					this.tag1Params.currentPage = 1;
					this.mescroll.triggerDownScroll();
				} else if (this.tabsList[this.current].name = "求职") {
					this.tag2Params.orderFlag = e + 1;
					this.tag2Params.currentPage = 1;
					this.mescroll.triggerDownScroll();
				} else if (this.tabsList[this.current].name = "二手") {
					this.seconHandParams.currentPage = 1;
					this.mescroll.triggerDownScroll();
				}
			},

			// 悬赏区获取help组件传过来的值
			getHelpId(e) {
				this.helpItemId = e.id;
				this.helpIndex = e.helpIndex;
				let sheetList = []
				let that = this
				if (e.isCreator) {
					if (e.statusName === '已接单') {
						sheetList = ['改为未接单', '删除悬赏']
					} else {
						sheetList = ['改为已接单', '删除悬赏']
					}
				} else {
					sheetList = ['举报']
				}
				uni.showActionSheet({
					itemList: sheetList,
					success: function(res) {
						that.helpSelectClick(sheetList[res.tapIndex])
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},

			// 二手区获取help组件传过来的值
			getSecondHandId(e) {
				this.secondHandId = e.id;
				this.secondHandIndex = e.helpIndex;
				let sheetList = []
				let that = this
				if (e.isCreator) {
					if (e.statusName === '已出售') {
						sheetList = ['改为未出售', '删除闲置']
					} else {
						sheetList = ['改为已出售', '删除闲置']
					}
				} else {
					sheetList = ['举报']
				}
				uni.showActionSheet({
					itemList: sheetList,
					success: function(res) {
						that.secondHandSelectClick(sheetList[res.tapIndex])
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},

			// 获取post组件传过来的值
			getPostId(e) {
				this.postItemId = e.id;
				this.postIndex = e.postIndex;
				let sheetList = [];
				let that = this;
				if (e.isCreator) {
					sheetList = ['删除帖子'];
				} else {
					sheetList = ['举报帖子'];
				}
				uni.showActionSheet({
					itemList: sheetList,
					success(res) {
						that.handlePostAction(sheetList[res.tapIndex]);
					},
					fail(res) {
						console.log(res.errMsg);
					}
				})
			},

			// 点击帖子更多弹窗框选项
			handlePostAction(e) {
				if (e === '举报帖子') {
					let param = {
						reportType: '帖子',
						targetId: this.postItemId,
						reason: JSON.stringify(this.postList[this.postIndex])
					};
					report(param).then((res) => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							});
						}
					});
				} else if (e === '删除帖子') {
					delPost(this.postItemId).then((res) => {
						if (res.data.data) {
							this.postList.splice(this.postIndex, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '删除失败，系统错误',
								icon: 'none'
							});
						}
					});
				}
			},

			//悬赏帖子点击更多弹窗框选项
			helpSelectClick(e) {
				if (e === '举报') {
					let params = {
						reportType: '悬赏帖',
						targetId: this.helpItemId,
						reason: JSON.stringify(this.helpList[this.helpIndex].content)
					}
					report(params).then((res) => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							});
						}
					});
				} else if (e === '改为已接单') {
					this.$set(this.helpList[this.helpIndex], "statusName", "已接单")
					taskAccept(this.helpItemId).then(res => {
						if (res.data.code === "SUCCESS") {
							uni.showToast({
								title: '任务状态修改为已接单',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							});
						}
					})
				} else if (e === '改为未接单') {
					this.$set(this.helpList[this.helpIndex], "statusName", "未接单")
					taskUnAccept(this.helpItemId).then(res => {
						if (res.data.code === "SUCCESS") {
							uni.showToast({
								title: '任务状态修改为未接单',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							});
						}
					})
				} else {
					removeTask(this.helpItemId).then(res => {
						if (res.data.code === "SUCCESS") {
							this.helpList.splice(this.helpIndex, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '删除失败，系统错误',
								icon: 'none'
							});
						}
					})
				}
			},

			//二手帖子点击更多弹窗框选项
			secondHandSelectClick(e) {
				if (e === '举报') {
					let params = {
						reportType: '二手帖',
						targetId: this.secondHandId,
						reason: JSON.stringify(this.secondHandList[this.secondHandIndex].content)
					}
					report(params).then((res) => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							});
						}
					});
				} else if (e === '改为已出售') {
					this.$set(this.secondHandList[this.secondHandIndex], "statusName", "已出售")
					taskAccept(this.secondHandId).then(res => {
						if (res.data.code === "SUCCESS") {
							uni.showToast({
								title: '闲置物品修改为已出售',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							});
						}
					})
				} else if (e === '改为未出售') {
					this.$set(this.secondHandList[this.secondHandIndex], "statusName", "未出售")
					taskUnAccept(this.secondHandId).then(res => {
						if (res.data.code === "SUCCESS") {
							uni.showToast({
								title: '闲置物品修改为未出售',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							});
						}
					})
				} else {
					removeTask(this.secondHandId).then(res => {
						if (res.data.code === "SUCCESS") {
							this.secondHandList.splice(this.secondHandIndex, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '删除失败，系统错误',
								icon: 'none'
							});
						}
					})
				}
			},

			//自定义下拉刷新
			upCallback() {
				//判断当前处于那个区块
				if (this.tabsList[this.swiperCurrent].name == "关注") {
					this.followParams.currentPage = 1;
					this.followList = [];
					this.getFollowList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.followParams.currentPage, true); //结束下拉
					}, 500);
				} else if (this.tabsList[this.swiperCurrent].name == "推荐") {
					this.params.currentPage = 1;
					this.postList = [];
					this.getPostList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.params.currentPage, true); //结束下拉
					}, 500);
				} else if (this.tabsList[this.swiperCurrent].name == "悬赏") {
					this.helpParams.currentPage = 1;
					this.helpList = [];
					this.getHelpList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.tag1Params.currentPage, true); //结束下拉
					}, 500);
				} else if (this.tabsList[this.swiperCurrent].name == "闲聊") {
					this.newStuParams.currentPage = 1;
					this.newStuPostList = [];
					this.getNewStuPostList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.newStuParams.currentPage, true); //结束下拉
					}, 500);
				} else if (this.tabsList[this.swiperCurrent].name == "考研") {
					this.tag1Params.currentPage = 1;
					this.tag1PostList = [];
					this.getTag1PostList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.tag1Params.currentPage, true); //结束下拉
					}, 500);
				} else if (this.tabsList[this.swiperCurrent].name == "求职") {
					this.tag2Params.currentPage = 1;
					this.tag2PostList = [];
					this.getTag2PostList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.tag1Params.currentPage, true); //结束下拉
					}, 500);
				} else if (this.tabsList[this.swiperCurrent].name == "二手") {
					this.seconHandParams.currentPage = 1;
					this.secondHandList = [];
					this.getSecondHandList(true);
					setTimeout(() => {
						this.mescroll.endByPage(this.tag1Params.currentPage, true); //结束下拉
					}, 500);
				}
			},
			//前往搜索页
			gonavigate_search() {
				uni.navigateTo({
					//保留当前页面，跳转到应用内的某个页面
					url: '/pages/home/search/index'
				});
			},
			//前往发帖页
			gonavigate_createPost() {
				uni.navigateTo({
					//保留当前页面，跳转到应用内的某个页面
					url: '/pages/home/createPost/index'
				});
				this.show.createPop = false;
			},
			// 跳转发布活动页
			toCreateHelp() {
				uni.navigateTo({
					//保留当前页面，跳转到应用内的某个页面
					url: '/pages/help_subPackage/createHelp/index?type=1'
				});
				this.show.createPop = false;
			},
			// 跳转发布活动页 
			toCreateSecondHand() {
				uni.navigateTo({
					//保留当前页面，跳转到应用内的某个页面
					url: '/pages/help_subPackage/createHelp/index?type=2'
				});
				this.show.createPop = false;
			},

		}
	};
</script>

<style scoped lang="scss">
	.container {
		position: relative;
		width: 100%;
		overflow: hidden;
		background-color: #f5f6fa;

		.header {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			height: 75rpx;
			padding: 15rpx;

			.search {
				flex: 1;
				margin: 0 15rpx;
			}
		}

		.tab {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 95%;
			margin: 0 auto;
			height: 100rpx;

			/deep/.u-tabs {
				width: 100%;
			}

			/deep/.u-tabs__wrapper {
				width: 100%;
			}

			/deep/.u-subsection {
				border-radius: 40rpx;

				&__bar {
					border-radius: 40rpx;
				}
			}
		}

		.main {}

		.activity {
			height: auto;
			width: 130rpx;
			position: absolute;
			z-index: 2;
			right: 50%;
			top: 160rpx;
			background-color: #fff;
			font-size: 24rpx;
			box-shadow: 0 0 15rpx #a3a3a3;
			border-radius: 25rpx;

			.activity_item {
				display: flex;
				padding: 10rpx;
				align-items: center;
				height: 50rpx;
			}
		}

		.createPop-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;

			.item {
				display: flex;
				justify-content: space-around;
				align-items: center;
				width: 70%;
				height: 130rpx;
				margin: 15rpx;
				border-radius: 70rpx;
				padding-left: 10rpx;
				background-color: #fff;
				color: #444;
				font-family: "Microsoft Yahei";

				.title {
					font-size: 34rpx;
					font-weight: bold;
				}

				.description {
					font-size: 26rpx;
					margin-top: 10rpx;
				}
			}

		}
	}
</style>