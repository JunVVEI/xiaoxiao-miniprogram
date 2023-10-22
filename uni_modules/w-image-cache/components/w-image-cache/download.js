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
