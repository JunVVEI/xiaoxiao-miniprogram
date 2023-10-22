<template>
	<view class="container">
		<!-- 搜索框 -->
		<view class="search">
				<u-search placeholder="查找您感兴趣的社团" :clearabled="true" bgColor="white" borderColor="#55aaff" 
				 :showAction="false" v-model="searchKeyword" @change="getClubsSearch" height="60rpx" />
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
			:height="scrollHeight">
			<u-list @scrolltolower.stop="scrolltolower">
				<u-list-item v-for="(item, index) in clubList" :key="item.id">
					<clubItem :club="item"></clubItem>
					<view style="height: 160rpx" v-if="index === clubList.length - 1"><u-loadmore
							:status="postStatus" /></view>
				</u-list-item>
			</u-list>
		</mescroll-body>
		<view class="add" @click="toAddNewClub">
			<u-icon name="plus" color="#2979ff" size="28"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		clubItem
	} from '@/UI/clubItem/index.vue'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getClubs
	} from '@/api/club/index.js'
	export default {
		components: {
			clubItem
		},
		mixins: [MescrollMixin], // 使用mixin

		data() {
			return {
				clubList: [],
				//加载提示
				postStatus: 'nomore',
				isloading: true,
				// 请求参数
				params: {
					currentPage: 1,
					pageSize: 10,
					keyWords: []
				},
				//搜索输入框
				searchKeyword: ''
			}
		},
		computed:{
			scrollHeight() {
				let systemInfo = wx.getSystemInfoSync();
				return systemInfo.windowHeight + 'px';
			}
		},
		onShow() {
			this.getClubList(true)
		},
		methods: {
			// mescroll对象
			mescrollInit(e) {
				this.mescroll = e;
			},
			// 获取社团列表
			async getClubList(isRefresh = false) {
				let res = await getClubs(this.params);
				if (res.data.data.data.length) {
					const arr = res.data.data.data;
					//如果是下拉刷新则不拼接数组
					isRefresh ? this.clubList.splice(0, this.clubList.length, ...arr) : (this.clubList = [...this.clubList, ...arr]);
					this.isloading = false;
				} else {
					this.isloading = false;
				}
			},

			// 下拉事件
			upCallback() {
				this.params.currentPage = 1;
				this.clubList = [];
				this.getClubList(true);
				setTimeout(() => {
					this.mescroll.endByPage(this.params.currentPage,true); //结束下拉
				}, 500);
			},
			// 触底事件
			scrolltolower() {
				if (!this.isloading) {
					this.isloading = true
					this.params.currentPage++
					this.getClubList(); //获取关注列表sss
				}
			},
			toAddNewClub() {
				uni.navigateTo({
					url: '/pages/club_subPackage/addOrEditClub/index'
				})
			},
			// 搜索社团
			getClubsSearch() {
				this.params.keyWords = [this.searchKeyword];
				this.clubList = [];
				this.getClubList(true);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		height: 100%;
		width: 100%;
		background-color: #f5f6fa;

		.add {
			position: absolute;
			bottom: 120rpx;
			right: 40rpx;
			height: 120rpx;
			width: 120rpx;
			border-radius: 50%;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 2px 3px #cecece;

		}
	}

	// 搜索框样式
	.search {
		padding: 20rpx 15rpx; 
    	background-color: #f8f8f8; /* 轻微的背景色 */
	}
</style>