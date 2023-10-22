<template>
	<u-button :customStyle="followBtn.btnStyle" :type="followBtn.type" :icon="followBtn.icon" shape="circle"
		:text="followBtn.text" @click="followHim">
	</u-button>
</template>

<script>
	import {
		follow,
		unfollow
	} from '@/api/user/follow.js';
	export default {
		computed: {
			// 修改relType
			status() {
				return this.relType;
			},
			// 定义初始关注状态
			followBtn() {
				// 未关注状态
				let unfollowStatus = {
					type: 'primary',
					icon: 'plus-people-fill',
					text: '关注',
					btnStyle: {
						border: 'none',
						background: this.unfollowBgColor,
						width: '130rpx !important',
						height: '58rpx !important',
						color: '#fff',
					}
				}
				// 已关注状态
				let followedStatus = {
					type: 'default',
					icon: '',
					text: '已关注',
					btnStyle: {
						border: 'none',
						background: '#9e9e9e',
						width: '130rpx !important',
						height: '58rpx !important',
						color: '#fff',
					}
				}
				// 回关状态
				let refollowedStatus = {
					type: 'default',
					icon: '',
					text: '回关',
					btnStyle: {
						border: 'none',
						background: this.unfollowBgColor,
						width: '130rpx !important',
						height: '58rpx !important',
						color: '#fff',
					}
				}
				// 相互关注状态
				let followToEach = {
					type: 'warning',
					icon: '',
					text: '已互关',
					btnStyle: {
						width: '130rpx !important',
						height: '58rpx !important',
						color: '#fff',
					}
				}
				// 判断当前属于的状态
				switch (this.status) {
					case 0:
						return unfollowStatus; //未关注
					case 1:
						return refollowedStatus; //回关
					case 2:
						return followedStatus;  //已关注
					case 3:
						return followToEach     //已互关
					default:
						return unfollowStatus;
				}
			}
		},
		props: {
			// 对关注状态的传递,此时是other的2
			relType: {
				type: Number
			},
			unfollowBgColor: {
				type: String,
				default () {
					return 'transparent'
				}
			},
			// 判断是粉丝页面
			fromFansPage: {
				type: Boolean
			},
			// 当前用户
			query: {
				type: Object
			}
		},
		methods: {
			// 关注
			followHim() {
				console.log(this.fromFansPage, this.status)
				if (this.status === 0 || this.status === 1) {
					// 目前是未关注状态：新增关注接口
					follow(this.query).then((res) => {
						if (res.data) {
							if (this.fromFansPage) {
								this.$emit("update:relType", 3);
							} else {
								this.$emit("update:relType", 2);
							}
						}
					})

				} else {
					// 目前是已关注状态|相互关注状态：取消关注
					uni.showModal({
						content: '你要取消关注Ta吗？',
						success: (res) => {
							if (res.confirm) {
								unfollow(this.query).then(res => {
									if (res.data.data ) {
										if(this.fromFansPage){
											// 修改按钮状态
											this.$emit("update:relType", 1)
										}else{
											this.$emit("update:relType", 0)
										}
									}
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style scoped>

</style>