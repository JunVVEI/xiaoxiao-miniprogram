<template>
	<view class="container">
		<!-- 信息编辑栏 -->
		<view class="msgList">
			<view class="listItem">
				<view class="picture_warpper">
					<!-- 头像 -->
					<u-avatar :src="msg.avatar" shape="circle" size='120px'
						default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png" @click="preview(msg.avatar)">
					</u-avatar>
					<!-- 编辑图标 -->
					<view class="icon">
						<u-upload :fileList="fileList" @afterRead="afterRead" :action="action" :auto-upload="false"
							:sizeType="['original']" height="80rpx" width="80rpx" :previewFullImage="false"
							:previewImage="false">
							<view slot="addBtn" hover-stay-time="150">
								<u-icon name="camera-fill" color="#ffffff" size="5"></u-icon>
							</view>
						</u-upload>
					</view>
				</view>
			</view>
			<!-- <view class="listItem" @click="toEditName">
				昵称：
				<view class="toEdit" >
					{{ msg.userName }}
				</view>
			</view>
			<view class="listItem"  @click="toEditSex">
				性别：
				<view class="toEdit">
					{{ msg.sex || ' '}}
					<u-icon name="arrow-right" color="#909399" size="16"></u-icon>
				</view>
			</view>
			<view class="listItem" @click="toEditBirth">
				生日：
				<view class="toEdit" >
					{{ msg.birth || ' '}}
					<u-icon name="arrow-right" color="#909399" size="16"></u-icon>
				</view>
			</view>
			<view class="listItem" @click="toEditSchool">
				学校认证：
				<view class="toEdit">
					{{ school || ' '}}
					<u-icon name="arrow-right" color="#909399" size="16"></u-icon>
				</view>
			</view>
			<view class="listItem">
				背景图：
				<view>
					<u-upload @afterRead="afterRead">
						<view class="toEdit" style="width: 120px;height: 60px;">
							<image :src="msg.backgroundImage" mode="aspectFill" style="width: 200rpx;height: 100rpx;"></image>
							<u-icon name="arrow-right" color="#909399" size="16"></u-icon>
						</view>
					</u-upload>
				</view>
			</view> -->
			<view v-show="isEdit">
				<u-button type="primary" shape="circle" @click="updateInfo">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updateUserInfo,
		getCurrentUserInfo
	} from '@/api/user/user.js';
	import upload from '@/mixin/upload.js';
	export default {
		mixins: [upload],
		data() {
			return {
				action: '',
				msg: {},
				school: '',
				isEdit: false
			};
		},
		onLoad() {
			this.getUserInfo()
		},
		onUnload() {
			// 离开页面的时候 将最新userInfo存在store中 
			this.$store.commit('user/setUserInfo', this.msg);
		},
		methods: {
			preview(url){
				uni.previewImage({
					urls:[url],
					index:0
				})
			},
			toEditName() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/info/edit/detail/name'
				});
			},
			// 获取用户信息
			getUserInfo() {
				getCurrentUserInfo().then(res => {
					this.msg = res.data.data
				})
			},
			toEditSex() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/info/edit/detail/sex'
				});
			},
			toEditBirth() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/info/edit/detail/birth'
				});
			},
			toEditSchool() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/info/edit/detail/school'
				});
			},
			// 修改用户信息
			updateInfo() {
				this.msg.avatar = this.uploadFileList.join();
				updateUserInfo(this.msg)
					.then(res => {
						uni.showToast({
							title: '保存成功',
							duration: 1000
						})
						setTimeout(() => {
							uni.navigateBack(1)
						}, 1000)
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.data.message
						});
					})
			},
			// 更换背景图
			// afterRead(event) {
			// 	console.log(event.file.url)
			// 	this.uploadAvatar(event.file.url, '背景')
			// },
			// 图片上传到服务器
			// uploadAvatar(tempUrl, str) {
			// 	const uploadParams = this.$store.state.uploadParams;
			// 	const fileName = uploadParams.dir + tempUrl.slice(12);
			// 	uni.uploadFile({
			// 		url: uploadParams.host,
			// 		filePath: tempUrl,
			// 		name: 'file',
			// 		formData: {
			// 			key: fileName,
			// 			policy: uploadParams.policy,
			// 			OSSAccessKeyId: uploadParams.accessKeyId,
			// 			signature: uploadParams.signature
			// 		},
			// 		success: res => {
			// 			console.log(res);
			// 			if (res.statusCode == 204) {
			// 				let uploadedUrl = uploadParams.host + '/' + fileName;
			// 				if (str === '头像') {
			// 					this.msg.avatar = uploadedUrl;
			// 				} else {
			// 					this.msg.backgroundImage = uploadedUrl;
			// 				}
			// 				// 修改用户信息 换成
			// 				// let result = this.updateUserInfo(this.msg);
			// 				this.$store.dispatch('user/updateUserInfo', this.msg);
			// 				// if (result) {
			// 				// 	uni.showToast({
			// 				// 		title: '更换'+str+'成功',
			// 				// 		icon: 'success'
			// 				// 	});
			// 				// 	if(str === '头像'){
			// 				// 		this.msg.avatar = uploadedUrl;
			// 				// 	}else{
			// 				// 		this.msg.backgroundImage = uploadedUrl;
			// 				// 	}
			// 				// }
			// 			}
			// 		},
			// 		fail: res => {
			// 			uni.showToast({
			// 				title: '上传失败',
			// 				icon: 'error'
			// 			});
			// 			console.log(res);
			// 		},
			// 		complete: (res) => {
			// 			console.log(res);
			// 		}
			// 	})
			// }
		}
	};
</script>

<style scoped lang="scss">
	.container {
		width: 90%;
		margin: 0 auto;

		.listItem {
			padding: 20rpx 0;
			width: 90%;
			margin: 50rpx auto;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #caced6;
			color: #606266;
			align-items: center;

			.picture_warpper {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 300rpx;

				.icon {
					position: absolute;
					border-radius: 50%;
					overflow: hidden;
					top: 200rpx;
					right: 200rpx;

					/deep/.u-upload__button {
						margin: 0;
					}
				}
			}
		}

		.toEdit {
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
	}
</style>