import {request} from '@/utils/request.js';

//举报
export function report(data) {
    return request({
        url: '/bbs/report/createReport',
        method: 'POST',
        data: data
    })
}