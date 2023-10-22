<template>
    <view class="container">
        <!-- 内容 -->
        <view v-if="helpList.length">
            <u-list @scrolltolower.stop="scrollToBottom">
                <u-list-item v-for="(item, index) in helpList" :key="item.id">
                    <help @help="getHelpId" :helpItem="item" :helpIndex="index"></help>
                </u-list-item>
                <u-loadmore bgColor="#f5f6fa" status="nomore" />
            </u-list>

            <!-- 操作菜单 -->
            <view>
                <u-action-sheet @select="selectClick" :show="sheetShow" @close="sheetShow = false" :actions="sheetList"
                                closeOnClickOverlay closeOnClickAction :round="10" cancelText="取消" />
            </view>
        </view>
        <!-- 无内容 -->
        <view class="blank" v-if="!helpList.length" :style="{ height: pageHeight }">
            <explore :tipsTitle="tips.title" :tipsName="tips.name"></explore>
        </view>
    </view>
</template>

<script>
import explore from '@/UI/explore/explore.vue';
import { report } from "@/api/bbs/report";
import { getMyTask, removeTask } from "@/api/help/index";
import help from "@/UI/help/index.vue";

export default {
    data() {
        return {
            headerTop: '',
            tips: {
                title: '暂时还找不到您发布的悬赏任务呢~',
                name: '尝试发布新的悬赏任务吧~'
            },
            query: {
                currentPage: 0,
                pageSize: 10
            },
            helpList: [],
            // 选中的帖子id
            helpItemId: null,
            // 选中的帖子下表
            helpIndex: null,
            // 帖子操作弹窗
            sheetShow: false,
            // 帖子操作弹窗
            sheetList: [{
                name: '举报悬赏任务',
                id: 2
            }],
            // 判断是否正在获取列表数据
            isloading: false,
        }
    },
    onLoad() {
        this.getMyHelp();
    },
    methods: {
        // 滑动到页面底部触发加载
        scrollToBottom() {
            // 如果正在加载则不获取数据
            if (!this.isloading) {
                // 正在加载
                this.isloading = true;
                // 当前页码 +1
                this.query.currentPage++;
                // 请求下一页数据
                this.getMyHelp();
            }
        },
        // 获取点赞历史
        getMyHelp() {
            getMyTask(this.query).then(res => {
                console.log(res.data)
                // 追加新页面数据到现有列表
                this.helpList = [...this.helpList, ...res.data.data.data];
                // 加载完成
                this.isloading = false;
            })
        },
        //获取help传来的show值
        getHelpId(e) {
            this.helpItemId = e.id;
            this.helpIndex = e.helpIndex
            if (e.isCreator) {
                this.$set(this.sheetList, 0, {
                    name: '删除悬赏任务',
                    id: 1
                })
            } else {
                this.$set(this.sheetList, 0, {
                    name: '举报悬赏任务',
                    id: 2
                })
            }
            this.sheetShow = !this.sheetShow;
        },
        //点击更多弹窗框选项
        selectClick(e) {
            if (e.name === '举报悬赏任务') {
                let param = {
                    "reportType": "帖子",
                    "targetId": this.helpItemId,
                    "reason": JSON.stringify(this.helpList[this.helpIndex])
                }
                report(param).then(res => {
                    if (res.data.code === 'SUCCESS') {
                        uni.showToast({
                            title: '举报成功',
                            icon: 'none'
                        })
                    }
                })
            } else {
                removeTask(this.helpItemId).then(res => {
                    if (res.data.data) {
                        this.helpList.splice(this.helpIndex, 1)
                        uni.showToast({
                            title: '删除成功',
                            icon: 'none'
                        })
                    }
                })
            }
        }
    },
    components: {
        explore,
        help
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #f5f6fa;
    height: 100%;

    .blank {
        margin-top: 20rpx;
        text-align: center;

        .u-button {
            margin-top: 30rpx;
            width: 160rpx !important;
            height: 70rpx !important;
        }
    }

    .edit {
        padding: 20rpx 0;
        width: 100%;
        height: 130rpx;
        box-sizing: border-box;
        position: fixed;
        bottom: var(--window-bottom);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
