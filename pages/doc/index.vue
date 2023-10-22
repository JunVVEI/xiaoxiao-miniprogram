<template>
    <view class="container">
       <zero-markdown-view :themeColor="themeColor" :markdown="content"></zero-markdown-view>
    </view>
</template>

<script>

import {getMdDocByDocKey} from "../../api/bs/doc";

export default {
    data() {
        return {
            content: '',
            themeColor: '#444'
        }
    },
    onLoad(option) {
        console.log(option)
        let key = option.key
        // let title = option.title
        //
        // if (title) {
        //     uni.setNavigationBarTitle({
        //         title
        //     })
        // }

        getMdDocByDocKey(key).then(res => {
            this.content = res.data.data.mdContent
            let title = res.data.data.title
            uni.setNavigationBarTitle({
                title
            })
        })
    },
    created() {

    }
};
</script>

<style lang="scss" scoped>
.container {
    margin: 45 rpx;
    padding: 30rpx;
}
</style>
