<template>
  <view class="container" @click="clickContainer">
    <!-- 顶部 -->
    <view class="top">
      <!-- 取消按钮 -->
      <view class="canel">取消</view>
      <!-- 上副标题 -->
      <view class="title">发布活动</view>
      <!-- 发布按钮 -->
      <view class="btn">
        <u-button shape="circle" type="primary" size="normal" :disabled="btnEnable" @click="postActivity">发布</u-button>
      </view>
    </view>
    <view class="main">
      <!-- 表单 -->
      <u--form labelPosition="left" :model="form" :rules="rules" ref="form" :labelStyle="{ fontSize: '30rpx' }">
        <u-form-item label="活动标题" labelWidth="200rpx" prop="title" borderBottom>
          <u--input v-model="form.title" border="none"></u--input>
        </u-form-item>
        <u-form-item label="活动形式" labelWidth="200rpx" prop="way" borderBottom>
          <u-radio-group :value="form.way" shape="circle">
            <u-radio label="线上" name="线上" :customStyle="{ marginRight: '10px' }"></u-radio>
            <u-radio label="线下" name="线下"></u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="活动基本信息" labelWidth="200rpx" borderBottom></u-form-item>

        <u-form-item label="活动时间" labelWidth="200rpx" prop="date" borderBottom>
          <view class="item">
            <picker class="picker date" mode="date" :value="dateStart" :start="startDate" :end="endDate"
              @change="bindDateStart">
              <view>{{ dateStart }}</view>
            </picker>
            <picker mode="time" :value="timeStart" start="09:01" end="21:01" @change="bindTimeStart">
              <view class="uni-input">{{ timeStart }}</view>
            </picker>
          </view>
          <p style="text-align: center;">至</p>
          <view class="item">
            <picker class="picker date" mode="date" :value="dateEnd" :start="startDate" :end="endDate"
              @change="bindDateEnd">
              <view>{{ dateEnd }}</view>
            </picker>
            <picker mode="time" :value="timeEnd" start="09:01" end="21:01" @change="bindTimeEnd">
              <view class="uni-input">{{ timeEnd }}</view>
            </picker>
          </view>
        </u-form-item>
        <u-form-item label="活动地点" labelWidth="200rpx" prop="place" borderBottom @click="getLocation">
          <!-- <u--input v-model="place" border="none" @click="getLocation">{{this.form.place}}</u--input> -->
          <u--input placeholder="▼ 点击获取位置" border="none" v-model="form.place">{{form.place}}
          </u--input>
        </u-form-item>
        <u-form-item label="活动人数" labelWidth="200rpx" prop="num" borderBottom>
          <u--input placeholder="选填" v-model="form.num" border="none"></u--input>
        </u-form-item>
        <u-form-item label="活动须知" labelWidth="200rpx" prop="notice" borderBottom>
          <u--input placeholder="选填" v-model="form.notice" border="none"></u--input>
        </u-form-item>
        <u-form-item>
          <u--text text="活动详情" Width="200rpx" style="margin: 5rpx;"></u--text>

          <!-- 图片和表情icon -->
          <!-- 上传图片 -->
          <view class="comment-icon">
            <view>
              <u-upload @afterRead="afterRead" multiple :maxCount="9" width="25" height="15">
                <image src="@/static/img.png" mode="widthFix" style="width:45rpx;height:40rpx"></image>
              </u-upload>
            </view>
            <view @click.stop="
          			show.emoji = !show.emoji;
          			show.anonymous = false;
          			this.focus = true;
          			this.$emit('show', true);
          		">
              <image src="@/static/face.png" mode="widthFix" style="width:45rpx;height:40rpx"></image>
            </view>
          </view>

          <!-- 表情弹窗 -->
          <view>
            <view class="emoji" v-show="show.emoji">
              <swiper class="slider" :current="0" indicator-dots circular acceleration>
                <swiper-item v-for="(item, key) in emojiData" :key="key" class="slider-emoji"
                  :class="[key == emojiData.length - 1 ? 'lastbox' : '']">
                  <text v-for="(emoji, index) in item" :key="index" @click.stop="selemoji(emoji)"
                    class="slider-emoji-icon">{{ emoji }}</text>
                </swiper-item>
              </swiper>
            </view>
          </view>


          <u--textarea v-model="form.content" prop="content" placeholder="请输入内容" height="400rpx" :value="form.content"
            @input="setFormContent" adjustPosition disableDefaultPaddingcount>

          </u--textarea>
        </u-form-item>

      </u--form>

      <!-- 详情文本域 -->


    </view>
  </view>
</template>

<script>
  import emoji from '@/js_sdk/m-emoji/m-emoji_2.0.0/emoji.js';
  import {
    policy
  } from '@/api/bs/file.js';
  // 上传图片
  import upload from '../../../mixin/upload.js';
  import {
    postActivity
  } from '@/api/bbs/activity.js';

  export default {
    mixins: [upload],

    data() {
      const currentDate = this.getDate({
        format: true
      });
      return {
        // show: false,

        show: {
          //是否显示输入法上方的完成
          confirm: false,
          //匿名选择框
          anonymous: false,
          //表情弹框
          emoji: false
        },
        //输入框焦点
        focus: true,

        fileList: [], //上传图片数组
        emojiData: [], //表情包
        //上传服务器图片地址
        uploadFileList: [],
        //上传图片所需参数
        upload: {
          accessKeyId: '',
          policy: '',
          signature: '',
          host: '',
          dir: ''
        },

        // 日期数据
        dateStart: currentDate,
        dateEnd: currentDate,
        date: currentDate,
        timeStart: '14:00',
        timeEnd: '16:00',
        // 表单数据
        form: {
          title: '', // 活动标题
          way: '线上', // 活动形式
          // 活动详情
          date: '2022-01-01', // 时间
          place: '', // 地点
          slogan: '', // 标语
          num: '', //人数
          notice: '', //注意
          content: '', //内容
        },

        // 发布活动测试数据
        postQuery: {
          activityTopic: "http://dummyimage.com/400x400",
          activityForm: 1,
          activityTime: "2013-02-15 00:20:52",
          activityLocal: "eiusmod id sit",
          activityNumberOfPeople: "95",
          activityNotice: "reprehenderit occaecat non",
          activityContent: "nisi laborum voluptate do",
          mediaPath: "dolore reprehenderit ut adipisicing qui",
        },
        // 表单规则
        rules: {
          title: [
            // 必填规则
            {
              required: true,
              message: '此为必填字段',
              // blur和change事件触发检验
              trigger: ['blur', 'change']
            }
          ],
          place: [{
            required: true,
            message: '此为必填字段',
            // blur和change事件触发检验
            trigger: ['blur', 'change']
          }]
        }
      };
    },

    onReady() {},

    computed: {
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      }
    },


    methods: {
      // 选择时间 日期
      bindDateChange: function(e) {
        this.date = e.target.value;
      },

      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year - 60;
        } else if (type === 'end') {
          year = year + 2;
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      //开始日期
      bindDateStart: function(e) {
        this.dateStart = e.target.value;
      },
      //结束日期
      bindDateEnd: function(e) {
        this.dateEnd = e.target.value;
      },
      // 开始时间
      bindTimeStart: function(e) {
        this.timeStart = e.target.value;
      },
      // 结束时间
      bindTimeEnd: function(e) {
        this.timeEnd = e.target.value;
      },

      // 时间picker绑定事件
      bindTimeChange: function(e) {
        this.form.detail.date = e.detail.value;
      },

      //点击最外层
      clickContainer() {
        //将所有show都变为false
        for (let index in this.show) {
          this.show[index] = false;
        }
      },
      //选择表情
      selemoji(m) {
        this.form.content += m;
        //this.show.emoji=false
        this.focus = true;
      },

      // 获取当前定位
      getLocation() {
        var _this = this;
        wx.chooseLocation({
          success: function(res) {
            console.log(res);

            var place = res.name;
            _this.form.place = place;

            // _this.form.default.place = place,

            //this.form.default.place = res.name;
          }
        })
      },


      // 发布活动
      postActivity() {
        postActivity(this.postQuery).then((res) => {
          console.log(res)
        })
      },
    },

    mounted() {
      //表情库划分
      var page = Math.ceil(emoji.length / 69); //页数
      for (let i = 0; i < page - 5; i++) {
        this.emojiData[i] = [];
        for (let k = 0; k < 69; k++) {
          emoji[i * 69 + k] ? this.emojiData[i].push(emoji[i * 69 + k]) : '';
        }
      }
      //console.log(this.emojiData);
    },

  };
</script>

<style lang="less" scoped>
  .item {
    display: flex;
    justify-content: space-around;
    margin: 10rpx;
  }

  .pickerDate {
    width: 40%;
  }

  .container {
    width: 90%;
    margin: 0 auto;
  }

  .top {
    margin-top: 20rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .comment-icon {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 25%;
    height: 60rpx;
  }

  //表情弹窗
  .emoji {
    left: 2%;
    //bottom: 11.5%;
    bottom: 35rpx;
    position: fixed;
    margin-top: 100rpx;
    // margin-bottom: 20rpx;
    background-color: white;
    width: 100%;
    height: 25%;
    border-top: 2rpx solid gainsboro;
    padding: 1% 0 0 0;
    z-index: 300;
    opacity: 0.8;

    .slider {
      height: 100%;
      background-color: white;

      &-emoji {
        &-icon {
          width: 12%;
          font-size: 36rpx;
          text-align: center;
          padding: 0rpx 10rpx;
          opacity: 1;
        }
      }
    }

    //设置最后一列左靠齐
    .lastbox {
      justify-content: flex-start;
    }
  }
</style>