<template>
	<image
			:src="cacheImgUrl"
			:mode="mode"
			:lazy-load="lazyLoad"
			:fade-show="fadeShow"
			:show-menu-by-longpress="showMenuByLongpress"
			:webp="webp"
			:draggable="draggable"
			:style="style"
			@load="sendEvent('load', $event)"
			@error="sendEvent('error', $event)"
			@click="sendEvent('click', $event)">
	</image>
</template>

<script>
	import {
		ImgCache
	} from './imgCache.js';
	export default {
		name: "ImgCache",
		props: {
			// 图片资源地址
			src: {
				type: String,
				default: ""
			},
			// 图片裁剪、缩放的模式
			mode: {
				type: String,
				default: 'aspectFill'
			},
			// 图片懒加载。只针对page与scroll-view下的image有效
			lazyLoad: {
				type: Boolean,
				default: false
			},
			// 图片显示动画效果
			fadeShow: {
				type: Boolean,
				default: true
			},
			// 在系统不支持webp的情况下是否单独启用webp。默认false，只支持网络资源。webp支持详见下面说明
			webp: {
				type: Boolean,
				default: false
			},
			// 开启长按图片显示识别小程序码菜单
			showMenuByLongpress: {
				type: Boolean,
				default: false
			},
			// 是否能拖动图片
			draggable: {
				type: Boolean,
				default: true
			},
			style: {
				type: Object
			}
		},
		watch: {
			// 监听URL变化
			src: {
				handler(src) {
					this.handleCache(src);
				},
				immediate: true
			}
		},
		data() {
			return {
				// 缓存图片地址
				cacheImgUrl: ''
			};
		},
		methods: {
			/**
			 * 处理缓存
			 * @param {String} imgUrl 网络图片地址
			 */
			async handleCache(imgUrl) {
				// #ifdef H5
				this.cacheImgUrl = imgUrl;
				return;
				// #endif
				// 判断图片是否存在缓存
				let localUrl = await ImgCache.getCache(imgUrl);
				if (localUrl) {
					// 存在缓存，直接用本地图片地址
					this.cacheImgUrl = localUrl;
				} else {
					// 不存在缓存，用网络地址
					this.cacheImgUrl = imgUrl;
					// 并且设置缓存
					ImgCache.setCache(imgUrl);
				}
			},
			/**
			 * 向父级发送事件
			 * @param {String} emit 事件名称
			 * @param {Object} event 事件回调
			 */
			sendEvent(emit, event) {
				this.$emit(emit, event);
			}
		}
	}
</script>
