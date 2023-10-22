<template>
	<view class="suspension" :style="'right: ' + right + 'px;bottom: ' + bottom + 'px;'">
		<view :class="showsever == true ? 'topon' : 'top'" v-if="serveShow">
			<view class="serve" v-for="(item, index) in iconList" :key="index">
				<view class="iconfont" @click="itemClick(item.name)">
					<u-icon :name="item.icon.name" :custom-prefix="item.icon.customprefix" color="#ffffff" size="30"></u-icon>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="serve" :style="'background-color:' + color" @tap="onshowsever" v-if="serveShow">
				<view class="iconfont">
					<u-icon name="grid-fill" color="#ffffff" size="30" v-if="serveText == ''"></u-icon>
					<text style="font-size: 30rpx;" v-if="serveText != ''">{{ serveText }}</text>
				</view>
			</view>
			<!-- <view class="ontop" :style="'opacity: ' + (scrollShow == true ? '1':'0')" @tap="goTop">
				<image src="../../static/TOP.png" class="top_img"></image>
			</view>
			<u-popup v-model="popshow" mode="center" width="500rpx" height="650rpx" :closeable='true'>
					<view style="padding: 10rpx;width: 100%;height: 100%;" class="u-flex-col u-col-center u-row-center">
						<image :src="imageurl" mode="aspectFill" style="width: 400rpx;height:400rpx"></image>
						<text style="margin-top: 35rpx;">{{title}}</text>
						<text style="margin-top: 5rpx;">{{content}}</text>
					</view>
				</u-popup> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showsever: false,
			iconList: [],
			popshow: false,
			imageurl: '',
			title: '',
			content: ''
		};
	},
	computed: {
		scrollShow() {
			if (this.scrollTop) {
				if (this.scrollTop >= this.totop) {
					return true;
				}
			} else {
				return false;
			}
		}
	},
	props: {
		scrollTop: {
			//传入到滚动数据
			type: Number,
			default: null
		},
		totop: {
			type: Number,
			default: 50
		},
		list: {
			//显示的图标列表
			type: Array,
			default: function() {
				return [
					{
						icon: { name: 'search', customprefix: 'uicon' },
						name: '搜索',
						url: '',
						type: 'navigate'
					},
					{
						icon: { name: 'server-fill', customprefix: 'uicon' },
						name: '客服',
						url: '',
						tel: '13988888888',
						type: 'tel'
					},
					{
						icon: { name: 'weixin-fill', customprefix: 'uicon' },
						name: '二维码',
						type: 'weixin',
						src: '',
						title: '客服微信',
						content: '长按识别二维码'
					}
				];
			}
		},
		serveShow: {
			//是否显示悬浮图标
			type: Boolean,
			default: true
		},
		serveText: {
			type: String,
			default: ''
		},
		color: {
			type: String
		},
		type: {
			type: String,
			default: 'view'
		},
		right: {
			type: Number,
			default: 20
		},
		bottom: {
			type: Number,
			default: 30
		}
	},
	created() {
		// console.log('list',typeof(this.list));
		if (typeof this.list !== 'undefined') {
			this.iconList = this.list;
		}
	},
	methods: {
		itemClick(e) {
			let that = this;
			switch (e) {
				case '分享':
					uni.showToast({
						title: '点击右上角的更多"发送给朋友"即可分享课表',
						duration: 1500,
						icon: 'none'
					});
					break;
			}
		},
		onshowsever() {
			//控制top按钮的显示
			let shows = !this.showsever;
			this.showsever = shows;
		},
		
		showweixin(item) {
			this.imageurl = item.src;
			this.title = item.title;
			this.content = item.content;
			if (this.imageurl != '') {
				this.popshow = true;
			}
		}
	}
};
</script>
<style scoped lang="scss">
.suspension {
	position: fixed;
	width: 80upx;
	z-index: 200;
}

.suspension .top {
	width: 100%;
	padding-bottom: 20upx;
	transform: scale(0.1) translateY(80%);
	opacity: 0;
	z-index: -100;
	.serve {
		width: 0upx;
		height: 0upx;
		background-color: #3c9cff;
		color: #fff;
		border-radius: 50%;
		margin-bottom: 20upx;
	}
}

.topon {
	width: 100%;
	transition: all 0.2s;
	opacity: 1;
	transform: none;
	z-index: 100;
	.serve {
		width: 100upx;
		height: 100upx;
		background-color: #3c9cff;
		color: #fff;
		border-radius: 50%;
		margin-bottom: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.suspension .bottom .serve {
	width: 100upx;
	height: 100upx;
	background-color: rgba(0, 0, 0, 0.5);
	color: #fff;
	border-radius: 50%;
	margin-bottom: 30upx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.suspension .serve:active {
	opacity: 0.8;
}

.serve .iconfont {
	font-size: 32upx;
	display: block;
	text-align: center;
	line-height: 100upx;
}

.ontop {
	width: 80upx;
	height: 80upx;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
	transition: all 0.3s;
}

.ontop:active {
	opacity: 0.8;
}

.ontop .top_img {
	width: 55upx;
	height: 60upx;
	display: block;
	margin: 0 auto;
	padding-top: 12upx;
	overflow: hidden;
}
</style>
