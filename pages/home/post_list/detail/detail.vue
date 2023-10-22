<template>
  <view style="background-color: #f5f6fa">
    <u-list>
      <error v-if="!isOnline"></error>
      <u-list-item v-for="(item, index) in postList" :key="item.id" >
        <post v-if="isOnline" @post="getPostId" :postList="item" :postIndex="index" class="post-item"></post>
        <view style="height: 160rpx;" v-if="index === postList.length-1">
        </view>
      </u-list-item>
      <u-loadmore bgColor="#f5f6fa" :status="postStatus"/>
    </u-list>
    <!-- 帖子操作菜单 -->
    <view>
      <u-action-sheet @select="selectClick" :show="sheetShow" @close="sheetShow = false" :actions="sheetList" closeOnClickOverlay closeOnClickAction :round="10" cancelText="取消"></u-action-sheet>
    </view>
  </view>
</template>

<script>
import post from '../../../../UI/post/post';
import error from '../../../../UI/404/index';
import {
  listAll,
  getPostsByFollow,
  reportPost,
  delPost,
  search
} from '@/api/bbs/post.js';

export default {
  components: {
    post,
    error,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      //判断是否有网络
      isOnline: true,
      //帖子列表
      postList: [],
      // 活动帖子本地模拟数据
      activityList: [],
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
    }
  },
  onLoad(query) {
    if (query.keyword) {
      let params = {
        currentPage: 1,
        pageSize: 10,
        keyword: query.keyword,
        type: 1,
      }
      search(params).then(res => {
		  this.postList = res.data.data.data
      })
    }

  },
  methods: {
    //获取post传来的show值
    getPostId(e) {
      this.postItemId = e.id;
      this.postIndex = e.postIndex
      if (e.isCreator) {
        this.$set(this.sheetList, 0, {
          name: '删除帖子',
          id: 1
        })
      } else {
        this.$set(this.sheetList, 0, {
          name: '举报帖子',
          id: 2
        })
      }
      this.sheetShow = !this.sheetShow;
    },
    //点击更多弹窗框选项
    selectClick(e) {
      if (e.name === '举报帖子') {
        let param = {
          "reportType": "帖子",
          "targetId": this.postItemId,
          "reason": JSON.stringify(this.postList)
        }
        report(param).then(res => {
          if (res.data.code === 'SUCCESS') {
            uni.showToast({
              title: '举报成功',
              icon: 'none'
            })
          }
        })
      } else {
        delPost(this.postItemId).then(res => {
          if (res.data.data) {
            this.postList.splice(this.postIndex, 1)
            uni.showToast({
              title: '删除成功',
              icon: 'none'
            })
          }
        })
      }
    }
  }
}
</script>

<style>
.post-item {
  border-radius: 15rpx; /* 你可以根据需要修改这个值 */
}
</style>
