<template>
  <view class="container">
    <view class="card">
      <!-- 头像 -->
      <view class="portrait">
        <view class="portrait-img">
          <u-avatar :src="atvItem.portrait" shape="circle" size="80rpx"
            default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png"
            @click="goToUser">
          </u-avatar>
        </view>
      </view>
      <!-- 内容 -->
      <view class="content" >
        <view class="title">
          <!-- 活动标题 -->
          <p style="font-size: 30rpx;color: #303133;font-weight: bold;">{{ atvItem.activityContent }}</p>
          <!-- 活动形式 -->
          <p style="font-size: 26rpx;color: #8080FF;">{{ atvItem.activityForm }}</p>
          <!-- 点赞 -->
          <view>
            <image style="width:30px" mode="widthFix" :src="atvItem.cheerUrl" @click="cheer"></image>
            <p style="font-size: 20rpx;color:#606266;text-align: center;">{{ atvItem.cheer }}</p>
          </view>
        </view>
        <!-- 活动计划 -->

        <view class="plan">
          <p>活动时间：{{ atvItem.activityTime }}</p>
          <p>活动地点：{{ atvItem.activityLocal }}</p>
          <!-- <p>活动标语：{{ atvItem.slogan }}</p> -->
        </view>
        <view class="time">
          <!-- 创建时间 -->
          <p style="font-size: 26rpx;color: #606266;">{{ atvItem.activityTime }}</p>
          <p style="font-size: 26rpx;" @click="goToDetail">查看详情</p>
          <!-- 图片-->
        </view>
        <view class="img-warpper" v-if="!atvItem.activityTopic">
          <u-album :urls="atvItem.activityTopic" multipleSize="100rpx" previewFullImage maxCount="3" space="25rpx">
          </u-album>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    listAllActivity,
    cheerActivity,
    cancelCheerActivity
  } from '@/api/bbs/activity.js';
  export default {
    props: ['activityList'],


    data() {
      return {
        //未打气图标
        cheerIcon: '../../../static/cheers.png',
        //已打气图标
        cheeronIcon: '../../../static/cheers_on.png',
        //活动列表
        atvItem: this.activityList,
        // atvItem: [],
        // atvList: [],
        // atvItem: JSON.parse(JSON.stringify(atvList)),


        // 卡片背景色列表
        // cardColList: JSON.parse(JSON.stringify(this.cardColorList)),
        cardColorList: [
          '#e6d6d7', '#d0eaf6', '#d1ede7', '#daddc0', '#c2ddcb', '#dae1ed'
        ],

        // 活动点赞请求参数
        atvQuery: {
          activityId: 6
        },
      };
    },

    created() {
      this.atvItem = JSON.parse(JSON.stringify(this.activityList));
      // console.log(this.atvItem);
    },

    onLoad() {
      // 预加载活动详情页
      uni.preloadPage({
        url: '/pages/home/activityDetailPage/activityDetailPage'
      });

    },

    onReady() {
      this.getActivityList();
      // this.cardColor();

      //console.log(this.atvItem);
    },

    methods: {
      // 获取活动列表
      getActivityList() {
        listAllActivity(this.params).then(res => {
          // console.log(res, '查询活动列表');
        })
      },
      //跳转至活动详情页
      goToDetail() {
        uni.navigateTo({
          url: '/pages/home/activityDetailPage/activityDetailPage'
        });
      },

      // 跳转至个人主页
      goToUser() {
        uni.navigateTo({
          url: '/pages/mine_subPackage1/info/index'
        });
      },

      // 测试打气
      cheerText() {
        cheerActivity(7).then((res) => {
          console.log(res);
        })
      },

      // // 随机背景颜色
      // cardColor(index) {
      //   const i = Math.floor(Math.random() * index);
      //   return this.cardColorList[i];

      // },

      //打气
      cheer() {
        // const curItem = JSON.parse(JSON.stringify(this.atvItem));
        //打气
        if (this.atvItem.cheerUrl === this.cheerIcon) {

          cheerActivity(this.atvQuery).then((res) => {
            console.log(res);
            //console.log('点赞活动成功');

            this.atvItem.cheerUrl = this.cheeronIcon;
            this.atvItem.likeNum++;
          })
          // console.log(this.atvItem.likeNum)
        }

        //取消打气
        else if (this.atvItem.cheerUrl === this.cheeronIcon) {
          cheerActivity(this.atvQuery).then((res) => {
            console.log(res);
            //console.log('点赞活动成功');

            this.atvItem.cheerUrl = this.cheerIcon;
            this.atvItem.likeNum--;
          })

          // this.atvItem.cheerUrl = this.cheerIcon;
          // item--,
          // console.log(this.atvItem.likeNum)
        }

      },


    }
  };
</script>

<style scoped lang="less">
  .container {
    width: 90%;
    margin: 0 auto;
    padding: 5rpx;

    .card {
      display: flex;
      height: 350rpx;
      //margin: 50rpx 5rpx 50rpx 10rpx;
      border: 5rpx black;
      margin: 0rpx 5rpx 75rpx 10rpx;

      .portrait {
        height: 100%;
        flex: 1;

        .portrait-img {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          overflow: hidden;
        }
      }

      .content {
        flex: 5;
        height: 100%;
        // background-color: antiquewhite;
        border-radius: 20rpx;
        // padding: 10rpx;

        .title {
          margin-top: 5rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 5rpx;
        }

        .plan {
          font-size: 26rpx;
          color: 303133;
          margin-left: 10rpx;
        }

        .img-warpper {
          display: flex;
          margin: 10rpx 0rpx 10rpx 10rpx;
          // margin-top: 20rpx;
          // margin-left: 10rpx;
        }

        .time {
          display: flex;
          justify-content: space-between;
          font-size: 16rpx;
          color: skyblue;
          margin-top: 5rpx;
        }
      }
    }
  }
</style>
