//微信分享功能
import {
	shareCount
} from '../api/bbs/post.js'
import {
	weChatLogin
} from '../api/user/user.js'
export default {
	onload() {
		wx.showShareMenu({
			withShareTicket: true,
			//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			menus: ["shareAppMessage", "shareTimeline"]
		})

	},
	onShow() {
		let curPage = getCurrentPages();
		let route = curPage[curPage.length - 1].route; //获取当前页面的路由
		if (!uni.getStorageSync('token')) {
			uni.login({
				success: (res) => {
					weChatLogin({
						code: res.code
					}).then(res => {
						if (!res.data.data) {
							if (route !== 'pages/mine_subPackage1/login/index') {
								uni.showModal({
									content: '请先登录(如您已登录请尝试重启小程序)',
									confirmText: '去登陆',
									confirmColor: '#2979ff',
									showCancel: false,
									success: (e) => {
										if (e.confirm) {
											uni.navigateTo({
												url: '/pages/mine_subPackage1/login/index'
											})
										}
									}
								})
							}
						}else{
							uni.setStorageSync('token', res.header.Authorization);
						}
					})
				}
			})

		}
	},
	data() {
		return {
			//在页面data中设置share或者buttonShare对象可以自定义分享参数
			//页面默认分享参数
			share: {
				title: '',
				path: '',
				imageUrl: '',
				postId: '', //帖子id
				content: '',

			},
			//按钮默认分享参数
			buttonShare: {
				title: '',
				path: '',
				imageUrl: '',
				postId: '', //帖子id
				content: '',

			}
		}

	},
	methods: {
		//帖子分享量增加
		addShareCount(id) {
			if (!!id) {
				shareCount(id).then(res => {
					console.log('分享', res)
				})
			}
		}
	},
	onShareAppMessage(res) { //发送给朋友
		console.log(this.buttonShare)
		if (res.from == 'button') {
			this.addShareCount(this.buttonShare.postId)
			return {
				title: this.buttonShare.content,
				path: this.buttonShare.path,
				imageUrl: this.buttonShare.imageUrl,
			}
		} else {
			this.addShareCount(this.share.postId)
			return {
				title: this.share.content,
				path: this.share.path,
				imageUrl: this.share.imageUrl
			}
		}
	},
	onShareTimeline(res) { //分享到朋友圈
		if (res.from == 'button') {
			this.addShareCount(this.buttonShare.postId)
			return {
				title: this.buttonShare.title,
				path: this.buttonShare.path,
				imageUrl: this.buttonShare.imageUrl

			}
		} else {
			this.addShareCount(this.share.postId)
			return {
				title: this.share.title,
				path: this.share.path,
				imageUrl: this.share.imageUrl

			}
		}
	}
}
