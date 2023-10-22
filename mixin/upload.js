//图片上传，配合u-upload组件使用
import {
	policy
} from '@/api/bs/file.js';

export default {
	data() {
		return {
			// 图片列表
			fileList: [],
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
			maxSize: 1024 * 1024 * 3
		}
	},
	onLoad() {},
	methods: {
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1);
			this.uploadFileList.splice(event.index, 1);
		},

		// 新增图片
		afterRead(event) {
			
			// 用户信息修改页
			let pages = getCurrentPages()
			if(pages[pages.length - 1].$page.fullPath == "/pages/mine_subPackage1/info/edit/index"){
				this.msg.avatar = event.file.url
				this.isEdit = true
			}
			
			//获取上传图片的参数
			policy().then(res => {
				const {
					accessKeyId,
					policy,
					signature,
					host,
					dir
				} = res.data.data;
				this.upload.accessKeyId = accessKeyId;
				this.upload.policy = policy;
				this.upload.signature = signature;
				this.upload.host = host;
				this.upload.dir = dir;

				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式s
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
				this.uploadFile(fileListLen, lists, event)
			});
		},
		async uploadFile(fileListLen, lists, event) {
			for (let i = 0; i < lists.length; i++) {
				if (this.maxSize < lists[i].size) {
					let res = await uni.compressImage({
						src: lists[i].url,
						quality: parseInt((this.maxSize / lists[i].size) * 100) <= 50 ? 50 : parseInt((this.maxSize / lists[i].size) * 100),
					})
					lists[i].url =res[1].tempFilePath
				}
				const fileName = this.upload.dir + lists[i].url.slice(12);
				//上传图片到服务器

				// 先确定每一个img的index，这样异步上传可以保证最终顺序不变
				// 默认404图片
				this.uploadFileList.push('https://mat1.gtimg.com/www/mobi/2017/image/404.png');
				let index = this.uploadFileList.length - 1;
				uni.uploadFile({
					url: this.upload.host, // 接口地址
					filePath: lists[i].url,
					name: 'file',
					formData: {
						key: fileName, //存放图片命名格式 ,自定义不重复就行,在上面的准备数据
						policy: this.upload.policy, //包含失效时间和文件上传大小限制等信息
						OSSAccessKeyId: this.upload.accessKeyId, //AccessKey ID用于标识用户（后台接口提供）
						signature: this.upload.signature, //accessKeySecret加密秘钥(后台接口提供)
						"Cache-Control": "public, max-age=86400"
					},
					success: res => {
						if (res.statusCode === 204) {
							this.uploadFileList[index] = (this.upload.host + '/' + fileName);
							this[`fileList${event.name}`][fileListLen + i].status = 'success';
							this[`fileList${event.name}`][fileListLen + i].message = '上传成功';
						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'error'
							});
							this[`fileList${event.name}`].splice(event.index, 1);
						}
					},
					fail: err => {
						uni.showToast({
							title: '上传失败',
							icon: 'error'
						});
						this[`fileList${event.name}`].splice(event.index, 1);
					}
				});
			}
		}
	}
}