<template>
    <view>
        <view class="uni-list">
            <view v-for="conf in confList" class="uni-list-cell uni-list-cell-pd">
                <view class="uni-list-cell-db">{{ conf.showContent }}</view>
                <switch :checked="conf.value == '1'" @change="switchChange(conf)" :disabled="disabled"/>
            </view>
        </view>
    </view>
</template>

<script>
import {getUserConf, toggleConf} from "@/api/user/setting";

export default {
    data() {
        return {
            confList: [],
            disabled: false
        }
    },
    onLoad() {
        this.sleep(1000)
        getUserConf().then(res => {
            this.confList = res.data.data
            console.log(res.data.data)
        })
    },
    methods: {
        switchChange(conf) {
            this.disabled = true
            toggleConf({key: conf.key}).then(res => {
                if (res.data.data) {
                    uni.showToast({
                        title: '操作成功',
                        icon: 'success'
                    })
                }
            }).finally(() => {
                this.disabled = false
            })
        },

        //参数n为休眠时间，单位为毫秒:
        sleep(n) {
            let start = new Date().getTime();
            while (true) {
                if (new Date().getTime() - start > n) {
                    break;
                }
            }
        }

    }
}
</script>

<style lang="scss" scoped>
.uni-list {
    background-color: #FFFFFF;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.uni-list-cell {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.uni-list-cell-pd {
    padding: 22rpx 30rpx;
}

.uni-list-cell-db {
    flex: 1;
}
</style>
