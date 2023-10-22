<template>
    <view>
        <view style="padding:0 16px;">
            <u--form labelPosition="top" :model="form">
                <u-form-item label="联系邮箱" labelWidth="150rpx">
                    <u-input v-model="form.email" placeholder="请输入邮箱"></u-input>
                </u-form-item>
                <u-form-item label="反馈内容" labelWidth="150rpx">
                    <u-textarea v-model="form.content" placeholder="请填写文字说明"></u-textarea>
                </u-form-item>
                <u-form-item class="btn">
                    <u-button size="primary" type="primary" :disabled="btnEnable" @click="submitFeedback">提交
                    </u-button>
                </u-form-item>
            </u--form>
        </view>
    </view>
</template>

<script>
import {report} from "../../../api/bbs/report";

export default {
    data() {
        return {
            form: {
                email: undefined,
                content: undefined,
            },
            showSuccess: false
        }
    },
    computed: {
        btnEnable() {
            return false
        }
    },
    methods: {
        submitFeedback() {
            if (this.form.email && this.form.content) {
                let param = {
                    "reportType": "意见反馈",
                    // "targetId": this.selectComment.commentId,
                    "reason": JSON.stringify(this.form)
                }
                report(param).then(res => {
                    if (res.data.code === 'SUCCESS') {
                        uni.showToast({
                            title: '反馈成功',
                            icon: 'none'
                        })
                        uni.navigateBack(1)
                    }
                })
            } else {
                uni.showToast({
                    title: '请完整填写表单',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    }
}
</script>


<style scoped>

</style>
