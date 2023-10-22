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
