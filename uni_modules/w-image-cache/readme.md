<h1 align="center" style="margin: 30px 0 30px;font-weight: bold;font-size:40px;">image-cache</h1>
<h1 align="center">UniApp图片本地缓存及性能优化</h1>

## 说明

`image-cache`组件是对`image`组件封装，在第一次加载图片后缓存图片到本地，下次加载时如果存在缓存则读取缓存图片，否则加载网络图片，目前支持微信小程序和APP，其它平台自行测试。

## 快速上手

1、从插件市场导入`image-cache`插件，或下载插件压缩包

2、在需要使用`image-cache`的页面注册组件

## 使用方法

### <a name="image-cache">image-cache</a>

|       参数名        |    类型     |    默认值    | 说明                                                         |
| :-----------------: | :---------: | :----------: | ------------------------------------------------------------ |
|         src         |   String    |      ""      | 图片资源地址                                                 |
|        mode         |   String    | "aspectFill" | 图片裁剪、缩放的模式                                         |
|      lazyLoad       |   Boolean   |    false     | 图片懒加载。只针对page与scroll-view下的image有效             |
|      fadeShow       |   Boolean   |     true     | 图片显示动画效果                                             |
|        webp         |   Boolean   |    false     | 在系统不支持webp的情况下是否单独启用webp。默认false，只支持网络资源。webp支持详见下面说明 |
| showMenuByLongpress |   Boolean   |    false     | 开启长按图片显示识别小程序码菜单                             |
|      draggable      |   Boolean   |     true     | 是否能拖动图片                                               |
|        @load        | HandleEvent |              | 当图片载入完毕时，发布到 AppService 的事件名，事件对象event.detail = {height:'图片高度px', width:'图片宽度px'} |
|       @error        | HandleEvent |              | 当错误发生时，发布到 AppService 的事件名，事件对象event.detail = {errMsg: 'something wrong'} |
|       @click        | HandleEvent |              |                                                              |

```html
<template>
    <!-- image-cache组件的props可参考uniapp的image组件 -->
    <image-cache src="图片网络地址"></image-cache>
</template>
```

## 代码编写

### 1、包装image标签

`uniapp`使用`image`标签来显示和渲染图片，以下代码对`image`标签进行包装，使用`image-cache`组件代替`image`组件。

> image-cache.vue

```html
<template>
	<image :src="cacheImgUrl" :mode="mode" :lazy-load="lazyLoad" :fade-show="fadeShow"
		:show-menu-by-longpress="showMenuByLongpress" :webp="webp" :draggable="draggable"
		@load="sendEvent('load', $event)" @error="sendEvent('error', $event)" @click="sendEvent('click', $event)">
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
```

### 2、缓存逻辑

以下代码，如果直接用图片的网络地址链接来作为缓存文件命名的话，会显得图片名称很长，而且如果里面有中文，可能导致路径读取错误。所以在`imgCache.js`中引用`md5.js`，用`md5`加密算法来对图片链接进行加密，得到一个等长不重复的文本，以此来作为文件名。

> imgCache.js

```javascript
import md5 from "./md5.min.js";
import downLoadQueue from './download.js';

/**
 * 图片缓存操作类
 */
export class ImgCache {
	/**
	 * 设置图片缓存
	 * @param {String} imgUrl 网络图片地址
	 */
	static async setCache(imgUrl) {
		// 创建图片下载任务
		let task = {
			// 图片路径
			filePath: ImgCache.createFilePath(imgUrl),
			url: imgUrl
		}
		// 添加图片下载任务
		downLoadQueue.add(task);
	}
	/**
	 * 获取图片缓存
	 * @param {String} imgUrl 网络图片地址
	 */
	static getCache(imgUrl) {
		// 创建文件key值
		let filePath = ImgCache.createFilePath(imgUrl);
		return ImgCache.isExistFile(filePath);
	}
	/**
	 * 拼接图片文件缓存路径
	 * @param {String} imgUrl 网络图片地址
	 */
	static createFilePath(imgUrl) {
		let fileName = md5(imgUrl);
		// #ifdef MP-WEIXIN
		return `${wx.env.USER_DATA_PATH}/${fileName}`;
		// #endif
		// #ifdef APP-PLUS
		return return `_doc/imgCache/${fileName}`;
		// #endif
	}
	/**
	 * 根据文件路径判断文件是否存在
	 * @param {String} filePath 文件路径
	 */
	static isExistFile(filePath) {
		return new Promise(resolve => {
			// #ifdef APP-PLUS
			plus.io.resolveLocalFileSystemURL(filePath, () => resolve(filePath), () => resolve(null));
			// #endif
			// #ifdef MP-WEIXIN
			uni.getFileSystemManager().readFile({
				filePath: filePath,
				success: (res) => {
					resolve(filePath)
				},
				fail: (res) => {
					resolve(null)
				}
			})
			// #endif
		})
	}
}
```

### 3、图片下载逻辑

在图片下载的逻辑代码中，用到了`队列`，主要是为了解决下列 2 个问题。

如果一个页面中的图片很多，由于下载任务是异步的，会出现一次性下载太多图片，导致页面渲染会比较慢。

如果一个页面中的两个标签引用了同一个图片链接，图片缓存会执行两次，可能会导致这个链接重复下载，这样及其浪费手机资源。

由于队列结构是先进先出的，图片下载任务会一个接着一个按顺序执行，并且在其中加入了判断图片是否已经下载过的判断，避免图片重复下载。

> download.js

```javascript
import {
	ImgCache
} from './imgCache.js';

/**
 * 图片下载任务队列
 */
class DownLoadQueue {
	constructor() {
		// 初始化任务队列
		this.taskList = [];
	}
	/**
	 * 添加图片下载任务
	 * @param {Object} task 图片下载任务
	 */
	add(task) {
		task.isDownload = false;
		this.taskList.push(task);
		this.consume();
	}
	/**
	 * 任务消费方法
	 */
	async consume() {
		if (this.taskList.length <= 0) {
			return;
		}
		// 从下载队列中获取第 1 条数据
		const task = this.taskList[0];
		// 判断是否正在下载
		if (task.isDownload) {
			return;
		}
		// 状态修改为正在下载
		task.isDownload = true;
		// 判断是否已经下载过该图片
		if (await ImgCache.isExistFile(task.filePath)) {
			// 已经存在，无需重复下载, 进行下一个任务下载
			this.taskList.shift();
			return this.consume();
		}
		// 创建文件下载任务
		// #ifdef MP-WEIXIN
		uni.downloadFile({
			url: task.url,
			success: (res) => {
				if (res.statusCode === 200) {
					// 下载成功，保存文件
					uni.getFileSystemManager().saveFile({
						tempFilePath: res.tempFilePath,
						filePath: task.filePath
					});
				}
			},
			complete: () => {
				// 进行下一个任务下载
				this.taskList.shift();
				this.consume();
			}
		})
		// #endif
		// #ifdef APP-PLUS
		const downloadTask = plus.downloader.createDownload(task.url, {
			filename: task.filePath
		}, (download, status) => {
			// 进行下一个任务下载
			this.taskList.shift();
			this.consume();
		})
		// 开始执行下载任务
		downloadTask.start()
		// #endif
	}
}

// 创建图片缓存下载队列
let downLoadQueue = new DownLoadQueue();

export default downLoadQueue;
```

