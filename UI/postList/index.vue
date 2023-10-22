<template>
	<!-- 存放新生标签页面 -->
	<u-list @scrolltolower.stop="scrolltolower_post">
		<error v-if="!isOnline"></error>
		<u-list-item v-for="(item, index) in newStuPostList" :key="item.id">
			<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index"></post>
			<view style="height: 260rpx" v-if="index === newStuPostList.length - 1"><u-loadmore :status="postStatus" />
			</view>
		</u-list-item>
	</u-list>
</template>

<script>
	import {
		listAll,
		getPostsByFollow,
		delPost,
		listPin
	} from '@/api/bbs/post.js';
	export default {
		onReady() {
			this.$emit('getListFunc')
		},
		data() {
			return {
			}
		},
		methods: {
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

			// 获取post组件传过来的值
			getPostId(e) {
				this.postItemId = e.id;
				this.postIndex = e.postIndex;
				let sheetList = [];
				let that = this;
				if(e.isCreator) {
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
		}
	}
</script>

<style>
</style>
