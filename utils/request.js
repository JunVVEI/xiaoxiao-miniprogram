import {weChatLogin} from "../api/user/user";

const url_all = {
    "local": 'http://127.0.0.1:8501' //本地地址
}
let BASEURL = url_all['test']

export const request = (options = {}) => {
    return new Promise((resolve, reject) => {
        handleRequest(options, resolve, reject)
    })
}

function handleRequest(options, resolve, reject) {
    return uni.request({
        url: BASEURL + options.url,
        method: options.method,
        data: options.data || {},
        header: options.header ? Object.assign({
            'Authorization': uni.getStorageSync('token')
        }, options.header) : {
            'Authorization': uni.getStorageSync('token')
        },
        success: (response) => {
            if (response.data.code !== "SUCCESS") {
                if (response.data.code !== 'UNAUTHORIZED') {
                    uni.showToast({
                        title: response.data.message,
                        duration: 2000,
                        icon: 'none'
                    })
                }
                return reject(response);
            }
            return resolve(response)
        },
        fail: (fail) => {
            console.log('fail', fail)
            return reject(fail);
        }
    })
}
