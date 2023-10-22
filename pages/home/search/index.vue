<template>
	<view class="container">
		<view class="warpper">
			<u-modal
				:show="modalShow"
				content="是否删除搜索历史？"
				@confirm="empty"
				@close="modalShow = false"
				:closeOnClickOverlay="true"
				@cancel="modalShow = false"
				width="500rpx"
				:showCancelButton="true"
			></u-modal>
			<!-- 搜索框 -->
			<view class="searchContainer">
				<u-search
					placeholder="请输入关键字"
					:focus="true"
					:clearabled="true"
					:show-action="true"
					@custom="handleSearch()"
					v-model="params.keyword"
					height="60rpx"
					@change="handleChange"
					@search="handleSearch"
				></u-search>
			</view>
			<!-- 搜索历史 -->
			<view class="searchGroup" v-if="!isSearch">
				<view class="history">
					<h1 style="color: #303133; font-size: 28rpx; font-weight: bold; margin-top: 30rpx">搜索历史</h1>
					<!-- 删除历史按钮 -->
					<view class="trash" @click="modalShow = true"><u-icon name="trash-fill" color="#606266" size="20"></u-icon></view>
					<!-- 存放tag -->
					<view class="tagWarpper" v-if="historyList.length">
						<view v-for="(item, index) in historyList" :key="index" style="margin-right: 15rpx; margin-bottom: 15rpx">
							<u-tag
								type="info"
								bg-color="#e0e0e1"
								border-color="#f4f4f5"
								size="large"
								color="#5c5e62"
								:text="item"
								:closable="true"
								:show="show"
								shape="circle"
								@click="handleTag(index)"
								@close="delTag(index)"
							/>
						</view>
					</view>
					<view style="text-align: center; color: #666" v-else>暂无搜索记录</view>
				</view>
				<!-- 推荐 -->
				<!-- <view class="recommend">
					<h1>大家都在搜</h1> -->
				<!-- 存放tag -->
				<!-- <view class="tagWarpper">
						<view v-for="item in recommendList" :key="item.id" style="margin-right: 15rpx;margin-bottom: 15rpx;">
							<u-tag
								type="info"
								bg-color="#f4f4f5"
								border-color="#f4f4f5"
								color="#606266"
								:text="item.text"
								:show="show"
								shape="circle"
								@close="tagClick"
							/>
						</view>
					</view>
				</view> -->
				<!-- 热榜 -->
				<!-- <view class="hot">
					<h1>校校热榜</h1> -->
				<!-- 存放tag -->
				<!-- <view class="hotWarpper">
						<view class="hotList" v-for="item in hotList" :key="item.rank">
							<span :style="{ color: item.color, flex: 1 }">{{ item.rank }}</span>
							<p style="flex: 15;font-size: 26rpx;">{{ item.text }}</p>
							<u-icon name="arrow-up-fill" color="#82848a" size="16"></u-icon>
							<p style="font-size:26rpx;">{{ item.interest }}</p>
						</view>
					</view>
				</view> -->
			</view>
			<view v-if="isSearch">
				<u-list @scrolltolower="scrollBottom">
					<error v-if="!isOnline"></error>
					<u-list-item v-for="(item, index) in postList" :key="item.id">
						<post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index" class="post-item"></post>
					</u-list-item>
					<u-loadmore bgColor="#f5f6fa" :status="postStatus" />
				</u-list>
				<!-- 帖子操作菜单 -->
				<view>
					<u-action-sheet
						@select="selectClick"
						:show="sheetShow"
						@close="sheetShow = false"
						:actions="sheetList"
						closeOnClickOverlay
						closeOnClickAction
						:round="10"
						cancelText="取消"
					></u-action-sheet>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import post from '@/UI/post/post';
import { listAll, getPostsByFollow, reportPost, delPost, search } from '@/api/bbs/post.js';
import { report } from '../../../api/bbs/report';
export default {
	components: {
		post
	},
	data() {
		return {
			// 确认框
			modalShow: false,
			// 搜索历史
			historyList: [],
			// 推荐
			recommendList: [],
			// 热榜
			hotList: [],
			show: true,
			status: false,
			// 是否点击搜索
			isSearch: false,
			currentPage: 1,
			pageSize: 10,
			//判断是否有网络
			isOnline: true,
			//帖子列表
			postList: [],
			//加载提示
			postStatus: 'nomore',
			// 选中的帖子id
			postItemId: null,
			// 选中的帖子下表
			postIndex: null,
			// 帖子操作弹窗
			sheetShow: false,
			// 帖子操作弹窗
			sheetList: [
				{
					name: '举报帖子',
					id: 2
				}
			],
			// 请求参数
			params: {
				currentPage: 1,
				pageSize: 30,
				keyword: '',
				type: 1
			}
		};
	},
	// 将本地缓存加载到历史记录中，没有内容则提供一个空数组
	onLoad() {
		this.historyList = JSON.parse(uni.getStorageSync('history') || '[]');
	},
	methods: {
		// tag点击事件
		handleTag(index) {
			this.params.keyword = this.historyList[index];
			uni.showToast({
				title: '搜索中',
				icon: 'loading',
				duration: 400
			});
			search(this.params).then((res) => {
				this.postList = res.data.data.data;
				this.isSearch = true;
			});
		},
		// 搜索节流函数
		handleChange() {
			if (this.status) return;
			this.status = true;
			setTimeout(() => {
				this.status = false;
			}, 1000);
		},
		// 删除历史tag
		delTag(e) {
			this.historyList.splice(e, 1);
			uni.setStorageSync('history', JSON.stringify(this.historyList));
		},
		// 搜索确认函数
		handleSearch() {
			uni.showToast({
				title: '搜索中',
				icon: 'loading',
				duration: 400
			});
			if (this.params.keyword.trim()) {
				this.postList = [];
				search(this.params).then((res) => {
					this.postList = res.data.data.data;
					this.isSearch = true;
				});
			}

			// 添加keyword到历史记录中
			if (this.params.keyword.trim()) {
				this.historyList.unshift(this.params.keyword.toString());
				this.historyList = [...new Set(this.historyList)];
			}
			// 限制历史记录的条数
			if (this.historyList.length >= 8) {
				this.historyList = this.historyList.slice(0, 6);
			}
			// 历史记录存放到本地缓存
			uni.setStorageSync('history', JSON.stringify(this.historyList));
		},

		//删除列表
		empty() {
			this.historyList = [];
			uni.setStorageSync('history', ['']);
			this.modalShow = false;
		},
		//获取post传来的show值
		getPostId(e) {
			this.postItemId = e.id;
			this.postIndex = e.postIndex;
			if (e.isCreator) {
				this.$set(this.sheetList, 0, {
					name: '删除帖子',
					id: 1
				});
			} else {
				this.$set(this.sheetList, 0, {
					name: '举报帖子',
					id: 2
				});
			}
			this.sheetShow = !this.sheetShow;
		},
		// 滑动到底部事件
		scrollBottom() {
			this.params.currentPage += 1;
			search(this.params).then((res) => {
				this.postList.push(...res.data.data.data);
			});
		},
		//点击更多弹窗框选项
		selectClick(e) {
			if (e.name === '举报帖子') {
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
			} else {
				delPost(this.postItemId).then((res) => {
					if (res.data.data) {
						this.postList.splice(this.postIndex, 1);
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						});
					}
				});
			}
		}
	}
};
</script>

<style>
.container {
	width: 100%;
	height: 100%;
	background-color: #f2f6fa;
}

.warpper {
	width: 100%;
	margin: 0 auto;
}

.searchContainer {
	box-sizing: border-box;
	padding: 20rpx;
	width: 100%;
	background-color: #f5f6fa;
}

.searchGroup {
	height: 95%;
	margin: 0 auto;
}

.history {
	width: 95%;
	position: relative;
	margin: 0 auto;
}

.tagWarpper {
	width: 95%;
	display: flex;
	margin-top: 20rpx;
	flex-wrap: wrap;
}

.trash {
	position: absolute;
	right: 0;
	top: 0;
}

.hotList {
	display: flex;
	margin: 20rpx 0;
}
</style>
