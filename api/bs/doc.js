import {request} from '@/utils/request.js';

// 获取md文档
export function getMdDocByDocKey(docKey) {
    return request({
        header: {
            "Content-Type": 'application/x-www-form-urlencoded',
        },
        url: '/tb/doc/queryByDocKey',
        method: 'GET',
        data: {'docKey': docKey}
    })
}
