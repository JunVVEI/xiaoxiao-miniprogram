// 将时间戳转换为时间
export function changeToDate(timestamp) {
    // 转换为Date对象
    let date = new Date(timestamp);
    // 默认这个参数是毫秒级别的时间戳
    let newDate = date.toLocaleDateString().replace(/\//g, "-");
    // 这个时间在开发者工具的形式是：2023-1-1
    // 在手机上预览时出现 Sun Jan 01 2023
    // newDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    let month = date.getMonth() >= 9 ? date.getMonth() + 1 + "-" : "0" + (date.getMonth() + 1) + "-";
    let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    newDate = date.getFullYear() + "-" + month + day;
    return newDate;
}

// 判断是否属于一月之内的时间戳,只需相差时间戳即可
export function oneMonth(timestamp) {
    return Date.now() - timestamp < 60 * 60 * 24 * 30 * 1000;
}

// 判断三天之内和之外的不同时间描述
// 同一天：new Date().toDateString() === new Date(timestamp).toDateString()
export function diffDays(timestamp) {
    const diff = Date.now() - timestamp;
    const diffDays = diff / (60 * 60 * 24 * 1000);
    let decription = "";
    if (diffDays < 1) {
        decription = "今天 "
    } else if (diffDays < 2) {
        decription = "昨天 "
    } else if (diffDays < 3) {
        decription = "前天 "
    } else {
        // decription = new Date(timestamp).toLocaleDateString().replace(/\//g, "-")+" "
        decription = changeToDate(timestamp) + " ";
    }
    return decription + new Date(timestamp).toTimeString().substr(0, 8);
}

// 社区主页时间信息流
//	信息流：①一小时内：显示N分钟前；②1-24小时：显示N小时前；③7天内：显示N天前；④7天后：显示具体时间
export function diffPostDate(timestamp) {
    //得到当前的时间戳
    const now = +new Date()
    //得到剩余时间戳，转化为秒数
    const count = (now - timestamp) / 1000
    //转化时间戳为天，时，分
    let d = parseInt(count / 60 / 60 / 24)
    let h = parseInt(count / 60 / 60 % 24)
    let m = parseInt(count / 60 % 60)
    let decription
    if (d > 7) {
        decription = changeToDate(timestamp) + " "
    } else if (d >= 1) {
        decription = `${d}天前`
    } else if (h >= 1) {
        decription = `${h}小时前`
    } else if (m >= 1) {
        decription = `${m}分钟前`
    } else {
        decription = `刚刚`
    }
    return decription
}
