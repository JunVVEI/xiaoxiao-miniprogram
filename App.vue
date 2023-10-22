<style lang="scss">
@import 'uni_modules/uview-ui/index.scss';
</style>
<script>
import {weChatLogin} from "./api/user/user";

export default {
    globalData: {
        userType: 1,
        identityType: 2,
    },
    methods: {
        autoUpdate() {
            // 获取小程序更新机制兼容
            if (uni.canIUse('getUpdateManager')) {
                const updateManager = uni.getUpdateManager()
                // 检查是否有新版本发布
                updateManager.onCheckForUpdate(function (res) {
                    if (res.hasUpdate) {
                        //小程序有新版本，则静默下载新版本，做好更新准备
                        updateManager.onUpdateReady(function () {
                            uni.showModal({
                                title: '更新提示',
                                content: '新版本已经准备好，是否重启应用？',
                                success: function (res) {
                                    if (res.confirm) {
                                        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                        updateManager.applyUpdate()
                                    } else if (res.cancel) {
                                        //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                                        uni.showModal({
                                            title: '温馨提示',
                                            content: '小程序已经做了新的优化，请及时更新~',
                                            showCancel: false, //隐藏取消按钮，也可显示，取消会走res.cancel，然后从新开始提示
                                            success: function (res) {
                                                //第二次提示后，强制更新
                                                if (res.confirm) {
                                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                                    updateManager.applyUpdate()
                                                } else if (res.cancel) {
                                                    //重新回到版本更新提示
                                                    autoUpdate()
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        })
                        // 新的版本下载失败
                        updateManager.onUpdateFailed(function () {
                            uni.showModal({
                                title: '温馨提示',
                                content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
                            })
                        })
                    }
                })
            } else {
                // 提示用户在最新版本的客户端上体验
                uni.showModal({
                    title: '温馨提示',
                    content: '当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试。'
                })
            }
        }
    },
    onLaunch: function () {
        this.autoUpdate()

        // 启动小程序 重新登录获取token
        uni.login({
            success: (res) => {
                weChatLogin({
                    code: res.code
                }).then(res => {
                    if (res.data.data) {
                        uni.setStorageSync('token', res.header.Authorization);
                    }
                })
            }
        })
    },
    onShow: function () {

    },
    onHide: function () {

    }
};
</script>
<style>
page {
    height: 100%;
}
</style>
