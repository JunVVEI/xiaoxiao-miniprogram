import {
	request
} from '@/utils/request.js'

// 获取社团列表
export const getClubs = (data) => {
	return request({
		url: '/bbs/association/queries',
		method: 'POST',
		data: data
	})
}

// 获取社团
export const getClub = (data) => {
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded',
		},
		url: '/bbs/association/association',
		method: 'POST',
		data: data
	})
}

// 删除社团
export const removeClub = (data) => {
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded',
		},
		url: '/bbs/association/del',
		method: 'POST',
		data: data
	})
}

// 编辑社团
export const addOrEdit = (data) => {
	return request({
		url: '/bbs/association/addOrEdit',
		method: 'POST',
		data: data
	})
}

// 获取社团类型选项
export const getAssociationTypeOptions = () => {
	return request({
		url: '/bbs/association/getAssociationTypeOptions',
		method: 'GET'
	})
}

// 获取社团级别选项
export const getAssociationLevelOptions = () => {
	return request({
		url: '/bbs/association/getAssociationLevelOptions',
		method: 'GET'
	})
}
