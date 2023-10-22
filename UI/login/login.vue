<template>
	<!-- 登录弹框 自定义头像和昵称-->
	<u-popup :show="loginPopupShow" :round="20" mode="bottom" @close="closePopup" @open="openPopup" :closeOnClickOverlay='false'
	adjust-position auto-focus>
		<!-- 提示信息一行 -->
		<view class="row tipsRow">
			<view class="logo">
			<!-- mp-avatar -->
				<!-- <u-avatar :src="projectInfo.logo" size="30"></u-avatar> -->
				<u-avatar text="校" randomBgColor size="40"></u-avatar>
				<view class="shenqing">{{projectInfo.name}} 登录</view>
			</view>
		</view>
		<!-- <u-line color="#959595" ></u-line> -->
		<!-- 头像一行 -->
		<view class="avatarRow row">
			<button plain open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<view class="avatarContent">
					<view class="text">头像</view>
					<u-avatar v-if="loginInfo.avatarUrl == ''" icon="weixin-fill" fontSize="40" size="50"></u-avatar>
					<u-avatar v-else :src="loginInfo.avatarUrl" shape="square" size="50"></u-avatar>
				</view>
				<view class="rightArrow">
					<u-icon name="arrow-right" size="20" color="#999"></u-icon>
				</view>
			</button>
		</view>
		<!-- 昵称一行 -->
		<view class="nameRow row">
				<view class="text">昵称</view>
				<input type="nickname" @blur="adjustPosition" @change="inputChange" placeholder="请输入昵称" style="border-bottom: solid 1px;"/>
		</view>
		<!-- 提交按钮 -->
		<view class="confirmRow" :style="{height: `${keyboardHeight+300}rpx`}">
			<u-button text="确定" type="primary" shape="circle" @click="confirmUserInfo"></u-button>
		</view>
	</u-popup>
</template>
<script>
import {policy} from "@/api/bs/file.js";
import {weChatRegister} from "../../api/user/user";

export default {
	data() {
		return {
			 keyboardHeight: 0,
			loginInfo: {avatarUrl: '', nickName: ''},		// 登录弹窗信息
			loginPopupShow: false, // 登录弹窗的显示
			projectInfo: {name: '', logo: ''}
		}
	},
	props: ["show", "timer"],
	watch: {
		timer: {
			handler(n) {
				if (this.show) {
					this.openPopup();
				}
			}
		}
	},
	methods: {
		 onKeyboardHeightChange(e) {
		        this.keyboardHeight = e.height;
		    },
		adjustPosition(e) {
		        const {height} = e.detail;
		        this.position = this.initialPosition - height;
		    },
		// 弹出登录弹窗
		openPopup() {
			this.loginPopupShow = true;
		},
		// 关闭登录弹窗
		closePopup() {
			this.loginPopupShow = false;
		},
		confirmUserInfo() {
			if (this.loginInfo.avatarUrl === '') {
				uni.showToast({
					title: '请选择头像',
					icon: 'none',
					mask:true
				})
				return
			}
			if (this.loginInfo.nickName === '') {
				uni.showToast({
					title: '请输入昵称',
					icon: 'none'
				})
				return
			}
			this.handleLogin();
		},
		handleLogin() {
			// 展示加载框
			uni.showLoading({
				title: '登录中',
			});
			uni.login({
				success: res => {
					if (res.code) {
						weChatRegister({
							code: res.code,
							userName: this.loginInfo.nickName,
							avatar: this.loginInfo.avatarUrl
						}).then(res => {
							if (res.data.code === 'SUCCESS') {
								uni.setStorageSync('token', res.header.Authorization);
								uni.navigateBack(1)
							}

							this.logined = true;
							this.loginPopupShow = false;
							// if (this.show) {
							// 	this.$parent.isLogined();
							// }
							uni.hideLoading();
						})
					}
				}
			});
		},
		// 昵称填写
		inputChange(e){
			this.loginInfo.nickName = e.detail.value;
		},
		// 头像填写
		onChooseAvatar(e){
			const {avatarUrl} = e.detail;
			console.log(avatarUrl)
			// 上传头像
			this.uploadAvatar(avatarUrl)
		},
		// 上传到服务器
		uploadAvatar(tempUrl){
			const uploadParams = this.$store.state.uploadParams;
			const fileName = uploadParams.dir + tempUrl.slice(12);
			uni.uploadFile({
				url:uploadParams.host,
				filePath:tempUrl,
				name:'file',
				formData:{
					key:fileName,
					policy:uploadParams.policy,
					OSSAccessKeyId:uploadParams.accessKeyId,
					signature:uploadParams.signature
				},
				success: res => {
					if(res.statusCode == 204){
						this.loginInfo.avatarUrl = uploadParams.host + '/' + fileName;
					}
				},
				fail: res =>{
					uni.showToast({
						title: '上传失败',
						icon: 'error'
					});
				}
			})
		},
		// 获取项目login和name
		getProjectInfo(){
			uni.getSystemInfo({
				success: (res) => {
					this.projectInfo.name = res.appName;
				}
			})
			// this.projectInfo.logo = __wxConfig.accountInfo.icon;
		},
		// 判断是否登录
		isLogined(){
			let token = uni.getStorageSync('token');
			let userInfo = uni.getStorageSync('userInfo');
			if(!token || userInfo.id === 0){
				this.loginPopupShow = true;
			}
		},
		
	},
	created() {
		// 重新加载啦
	},
	mounted() {
		uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
		//获取上传图片的参数
		policy().then(res => {
			this.$store.commit("setUploadParams",res.data.data);
		});
		this.getProjectInfo();
		// console.log("show:",this.show)
		if(this.show !== false){
			this.isLogined();
		}
	},
	beforeDestroy(){
		uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
	}
};
</script>

<style lang="scss" scoped>
.row{
		height: 140rpx;
		padding: 20rpx;
		box-sizing: border-box;

		.text{
			font-size: 32rpx;
			margin-right: 20rpx;
		}
	}
	.avatarRow{
		.avatarContent{
			display:flex;
			align-items: center;
			justify-content: left;
		}
		.rightArrow{
			position: absolute;
			right: 90rpx;
			top: 30rpx;
		}
	}
	.nameRow{
		height: 350rpx;
		padding: 20rpx 48rpx;
		padding-top: 50rpx;
		display: flex;
		align-items: flex-start;
		.text {
			height: 100rpx;
			padding-top: 28rpx;
		}
		input{
			width: 500rpx;
			height: 100rpx;
		}
	}
	.tipsRow{
		height: 200rpx;

		.logo{
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			.shenqing{
				margin-left: 20rpx;
				font-size: 38rpx;
			}
		}
		.show-tips{
			font-size: 32rpx;
			// color: #5e5e5e;
			padding: 10rpx;
			color: #888;

		}
	}
	.confirmRow{
		padding: 30rpx 100rpx 30rpx;
		font-size: 40rpx;
		box-sizing: border-box;
		align-items: flex-start;
		/deep/.u-button{
			height: 100rpx;

		}
	}
	button[plain]{
		border:none
	}
	button::after{
		border: 0 solid rgba(0,0,0,0.2);
	}
</style>

