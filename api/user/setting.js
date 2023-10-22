import {request} from "../../utils/request";

export function toggleConf(data) {
    return request({
        header: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        url: '/user/userConf/toggleConf',
        method: 'POST',
        data: data
    })
}

export function getUserConf() {
    return request({
        url: '/user/userConf/getUserConf',
        method: 'GET'
    })
}