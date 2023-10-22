<template>
	<view class="container">
		<view class="main">
			<u--form labelPosition="top" :model="form">
				<u-form-item label="举报理由(可多选)" labelWidth="250rpx" required="true">
					<u-checkbox-group v-model="form.checkboxValue1" placement="column" iconPlacement="right"
						border-bottom="true" @change="checkboxChange" >
						<u-checkbox :customStyle="{marginBottom: '16px'}" v-for="(item, index) in checkboxList1"
							:key="index" :label="item.name" :name="item.name" shape="circle" size="40rpx">
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				<u-form-item label="图片证据" labelWidth="150rpx" required="true">
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple width="200rpx"
						height="200rpx" uploadIcon="photo" maxCount="3" deletable previewImage></u-upload>
				</u-form-item>
				<u-form-item label="举报描述" labelWidth="150rpx">
					<u-textarea placeholder="请填写文字说明"></u-textarea>
				</u-form-item>
				<u-form-item class="btn">
					<u-button size="primary" type="primary" :disabled="btnEnable">提交</u-button>
				</u-form-item>
			</u--form>
		</view>
	</view>
</template>

<script>
	import upload from '@/mixin/upload.js'
	export default {
		mixins:[upload],
		data() {
			return {
				form: {
					checkboxValue1: [],
					imageValue: []
				},
				// 基本案列数据
				checkboxList1: [{
						name: '广告行为',
						disabled: false
					},
					{
						name: '色情、淫秽内容',
						disabled: false
					},
					{
						name: '政治敏感、有害内容',
						disabled: false
					},
					{
						name: '版权侵害行为',
						disabled: false
					},
					{
						name: '信息作假行为',
						disabled: false
					},
					{
						name: '侮辱、谩骂等故意伤害行为',
						disabled: false
					},
					{
						name: '其他',
						disabled: false
					},
				],
			}
		},
		methods: {
			checkboxChange(e) {
				console.log(e)
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1);
				this.uploadFileList.splice(event.index, 1);
			},
			// 新增图片
			afterRead(event) {
				console.log(event);
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file);
				let fileListLen = this[`fileList${event.name}`].length; //目前fileList的长度
				//给每个图片加上状态信息
				lists.map(item => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					});
				});
				for (let i = 0; i < lists.length; i++) {
					//console.log('上传到服务器')
					const fileName = this.upload.dir + lists[i].url.slice(12);
					//上传图片到服务器
					uni.uploadFile({
						url: this.upload.host, // 接口地址
						filePath: lists[i].url,
						name: 'file',
						formData: {
							key: fileName, //存放图片命名格式 ,自定义不重复就行,在上面的准备数据
							policy: this.upload.policy, //包含失效时间和文件上传大小限制等信息
							OSSAccessKeyId: this.upload.accessKeyId, //AccessKey ID用于标识用户（后台接口提供）
							signature: this.upload.signature //accessKeySecret加密秘钥(后台接口提供)
						},
						success: res => {
							console.log(res);
							if (res.statusCode === 204) {
								console.log('上传成功');
								this.uploadFileList.push(this.upload.host + '/' + fileName);
								this[`fileList${event.name}`][fileListLen + i].status = 'success';
								this[`fileList${event.name}`][fileListLen + i].message = '上传成功';
							} else {
								console.log('上传失败');
								uni.showToast({
									title: '上传失败',
									icon: 'error'
								});
								this[`fileList${event.name}`].splice(event.index, 1);
							}
						},
						fail: err=>{
							console.log('上传失败',err)
							uni.showToast({
								title: '上传失败',
								icon: 'error'
							});
							this[`fileList${event.name}`].splice(event.index, 1);
						}
					});
				}
			},
		}
	};
</script>

<style scoped>
	.container {
		position: relative;
		width: 100%;
	}

	.navBarBox {
		position: relative;
	}

	.main {
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.top {
		margin-top: 20rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.top-text {
		font-size: 26rpx;
		color: #a2a2a2;
	}
</style>