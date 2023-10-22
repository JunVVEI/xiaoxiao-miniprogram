import {request} from '@/utils/request.js';

//请求获取上传所需参数
export function policy(data){
	return request({
		url:'/bs/file/policy',
		method:'GET',
	})
}

//查询文件
export function selectFile(data){
	return request({
		url:'/bs/file/selectFile',
		method:'GET',
		data:data
	})
}

