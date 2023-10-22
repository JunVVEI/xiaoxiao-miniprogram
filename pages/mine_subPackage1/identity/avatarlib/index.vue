<template>
    <view>
        <view class="container">
            <view class="item" v-for="(item, index) in avatarList" :key="index">
                <image :src="item" @click="choose(item)"></image>
            </view>
        </view>
    </view>
</template>

<script>
import {getIdentityAvatarLibrary} from "../../../../api/user/identity";

export default {
    data() {
        return {
            avatarList: [
                // 'https://tupian.qqw21.com/article/UploadPic/2020-3/202031522292042080.jpg',
                // 'https://img.99tu.com:9988/uploads/allimg/c201208/160I612a21520-129440.jpg',
                // 'http://pic.imeitou.com/uploads/allimg/221117/7-22111G11119-50-lp.jpg',
                // 'http://pic.imeitou.com/uploads/allimg/221229/8-221229110T9.jpg',
                // 'http://pic.imeitou.com/uploads/allimg/230204/3-230204144611-lp.jpg',
                // 'http://pic.imeitou.com/uploads/allimg/230115/8-230115150050-50-lp.jpg',
                // 'http://pic.imeitou.com/uploads/allimg/221225/8-221225150S9-lp.jpg',
                // 'http://pic.imeitou.com/uploads/allimg/230122/3-230122145207-lp.jpg',
            ],
        }
    },
    onShow() {
        getIdentityAvatarLibrary().then(res => {
            this.avatarList = res.data.data
            console.log(this.avatarList)
        })
    },
    methods: {
        choose(url) {
            uni.showModal({
                content: "是否选择该图片作为头像",
                success: res => {
                    if (res.confirm) {
                        // 页面传递：
                        let pages = getCurrentPages();
                        let identityPage = pages[pages.length - 2]; //上一个页面
                        identityPage.data.sheetShow = false;
                        identityPage.$vm.getAvatarUrl(url);
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                    uni.navigateBack();
                }
            });
        }
    }
}
</script>

<style lang="scss">
	.container {
		padding: 20rpx;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
		grid-auto-rows: minmax(200rpx, auto);
		grid-gap: 40rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
