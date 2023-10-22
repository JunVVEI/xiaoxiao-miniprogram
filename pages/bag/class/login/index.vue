<template>
	<!-- 课表登录页 -->
	<!-- 背景图片 -->
	<!-- <view style="width: 100vw; height: 100vh; background-image: url(); background-size: 100% 100%;"> -->
	<view style="position: absolute;height: 100%;width: 100%;">
		<view class="container">
			<view class="title">登录教务系统</view>
			<!-- 表单主体 -->
			<u-form :model="form" ref="uForm" border-bottom="false">
				<u-form-item label-position="top" labelWidth="120rpx" prop="studentNo">
					<view class="studentNo"><u-input v-model="form.studentNo" clearable placeholder="学号" height="40rpx" adjustPosition prefixIcon="account-fill" /></view>
				</u-form-item>
				<u-form-item label-position="top" labelWidth="120rpx" prop="password">
					<view class="password"><u-input v-model="form.password" type="password" password-icon clearable placeholder="原始密码为身份证后六位" height="40rpx" adjustPosition
						prefixIcon="lock-fill" /></view>
				</u-form-item>
				<view class="privacySecurity">
					<u-icon name="info-circle-fill" color="#666" size="12" />
					<view class="textContainer">
						<text user-select="true">您的密码仅一次性使用，后台从不保存</text>
					</view>
				</view>
				<view class="privacySecurity">
					<u-icon name="info-circle-fill" color="#666" size="12" />
					<view class="textContainer">
						<text user-select="true">如出现拉取课表失败，可尝试登录学校教务系统后再返回重试。<text style="color: blue;text-decoration: underline;" @click="copyURL">{{ jwxtUrl }}</text></text>
					</view>
				</view>
				<u-form-item label="验证码" label-position="top" labelWidth="120rpx" prop="kaptcha" v-if='loginError'>
					<!-- 验证码框 -->
					<u-input v-model="form.kaptcha" type="select" clearable height="40rpx" border="bottom"
						:custom-style="style" :adjustPosition="true" cursorSpacing="50" />
					<!-- 验证码图片 -->
					<view @click="getCode" style="position: absolute; left: 65%;">
						<img :src="path" alt="" style="width: 170rpx; height: 70rpx;margin-top: 10rpx;"
							v-show="path !== ''" />
					</view>
				</u-form-item>
				<u-form-item prop="btn">
					<u-button size="primary" shape="circle" :loading="btnLoading" @click="loginCourse" color="linear-gradient(to right, #43CBFF, #9708CC)">
						<view class="login">登录</view>
					</u-button>
				</u-form-item>
			</u-form>
		</view>
	</view>
	<!-- </view> -->
</template>

<script>
import { getCode, login } from '@/api/course/index.js';
export default {
	data() {
		return {
			// 第一次登录是否成功
			loginError: false,
			// 点击按钮后是否loading状态
			btnLoading: false,
			// 表单
			form: {
				studentNo: '',
				password: '',
				kaptcha: null,
				cookie: null,
				deviceId: this.$store.state.deviceId,
				wechatId: null,
				uid: this.$store.state.uid
			},
			// 验证码输入框样式
			style: {
				width: '60%',
				marginRight: '20rpx',
				marginTop: '10rpx',
			},
			// 验证码图片地址
			path: '',
			// 表单规则
			rules: {
				studentNo: [
					{
						required: true,
						message: '学号不能为空',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}
				],
			},
			jwxtUrl: 'https://jwxt.scau.edu.cn/'
		};
	},
	methods: {
		//获取验证码
		getCode() {
			getCode().then(res => {
				this.path = res.data.data.base64;
				this.form.cookie = res.data.data.session;
			});
		},
		// 登录
		loginCourse() {
			if (this.loginError && this.form.kaptcha === '') {
				uni.showToast({
					icon: 'error',
					title: '请输入验证码',
					duration: 800
				})
				return
			}
			this.$refs.uForm.validate().then(() => {
				uni.showToast({
					icon: 'loading',
					title: '拉取课表中',
					duration: 10000
				});
				login(this.form).then(res => {
					if (res.data.code === 'SUCCESS') {
						uni.hideToast();
						uni.setStorageSync('studentNo', this.form.studentNo);
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 上一页
						uni.removeStorage({
							key: 'courseList',
							success: () => {
								beforePage.onLoad();
								uni.switchTab({
									url: '/pages/bag/class/index'
								});
							}
						});
					} else {
						uni.hideToast();
						uni.showToast({
							icon: 'none',
							title: res.data.message,
							duration: 2000,
							width: '200px'
						});
						this.loginError = true
						this.getCode();
					}
				});
			}).catch(err => {
				uni.hideToast();
				uni.showToast({
					icon: 'error',
					title: '输入有误捏',
					duration: 500
				});
			});

		},
		copyURL(){
			uni.setClipboardData({
				data: this.jwxtUrl,
				success: res => {
				}
			});
		},
	},
	onUnload() {
		let pages = getCurrentPages(); // 当前页面
		let beforePage = pages[pages.length - 2]; // 上一页
		beforePage.onLoad();
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>

<style lang="scss" scoped>
.container {
	width: 600rpx;
	margin: 0 auto;
	margin-top: 20%;
}

.title {
	text-align: center;
	padding: 20rpx 0;
	color: #7d7d7d;
	font-size: 40rpx;
}

.form {
	padding: 20rpx 40rpx;
}

.studentNo,
.password {
	background-color: #f7f7f7;
	border: 1px solid #eaeaea;
	border-radius: 4px;
	margin: 5px 10px;
}

.studentNo.focus,
.password:focus {
	border-color: #ccc;
	outline: none;
}
.login {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	text-align: center;
}

.privacySecurity {
    display: flex; 
    align-items: center;
}

.textContainer {
    font-size: 10px; 
    color: #666; 
    padding: 2px 4px; 
    background-color: #f9f9f9; 
    border-radius: 3px; 
    display: inline-block; 
    margin: 10rpx;
		display: inline-block;
    align-items: center;
}

u-icon {
    display: inline-block; 
    margin-right: 1px; 
}

</style>
