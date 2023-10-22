import {
	request
} from '@/utils/request.js';

export const chat = (data)=>{
	return request({
		url: '/tb/oa/chat',
		method: 'POST',
		data:data
	})
}

export const drawing = (data)=>{
	return request({
		url: '/tb/oa/drawing',
		method: 'POST',
		data:data
	})
}
