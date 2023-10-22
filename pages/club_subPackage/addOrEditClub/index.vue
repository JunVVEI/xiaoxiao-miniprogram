<template>
    <view class="container">
        <view class="warpper">
            <view class="avatar">
                <u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" :maxCount="1" width="250rpx"
                          height="250rpx" uploadIcon="photo" uploadText='社团头像'>
                </u-upload>
            </view>
            <view class="form">
                <u--form labelPosition="left" :model="clubModel" ref="uForm" labelWidth='80'>
                    <u-form-item label="社团名称 :" prop="clubName" borderBottom ref="clubName" :borderBottom='true'>
                        <u--input v-model="clubModel.clubName" border="none" fontSize='18'></u--input>
                    </u-form-item>
                    <u-form-item label="社团类型 :" prop="clubType" borderBottom ref="clubType" :borderBottom='true'
                                 @click="showType = true">
                        <u--input v-model="clubModel.clubType" border="none" disabled disabledColor="#ffffff"></u--input>
                    </u-form-item>
                    <u-form-item label="社团级别 :" prop="clubLevel" borderBottom ref="clubLevel" :borderBottom='true' @click="showLevel = true">
                        <u--input v-model="clubModel.clubLevel" border="none" disabled disabledColor="#ffffff"></u--input>
                    </u-form-item>
                    <u-form-item label="联系邮箱 :" prop="clubContact" borderBottom ref="clubContact" :borderBottom='true'>
                        <u--input v-model="clubModel.clubContact" border="none"></u--input>
                    </u-form-item>
                    <u-form-item label="社团简介 :" prop="clubIntro"  ref="clubIntro"  labelPosition="top">
                        <u--textarea v-model="clubModel.clubIntro" maxlength="4096" height="200" :showConfirmBar='false' confirmType="return"></u--textarea>
                    </u-form-item>
                </u--form>
            </view>
            <view class="code">
                <view>
                    <u-upload :fileList="clubImgs" @afterRead="afterReadClubImg" @delete="deleteClubImg" :maxCount="20"
                              width="200rpx" height="200rpx" uploadIcon="plus" uploadText='招新与风采 (可选)'></u-upload>
                </view>
            </view>
            <view class="commit">
                <u-button type="primary" text="提交" size="large" shape='circle' @click="submit"></u-button>
            </view>
        </view>
        <u-action-sheet :show="showType" :actions="typeActions" title="请选择社团类型" @close="showType = false"
                        @select="typeSelect">
        </u-action-sheet>
        <u-action-sheet :show="showLevel" :actions="levelActions" title="请选择社团等级" @close="showLevel = false"
                        @select="levelSelect">
        </u-action-sheet>
    </view>
</template>

<script>
import upload from '@/mixin/upload.js';
import {
    policy
} from '@/api/bs/file.js';
import {
    addClub
} from '@/api/club/index.js';
import {addOrEdit, getAssociationLevelOptions, getAssociationTypeOptions, getClub} from "../../../api/club";
export default {
    mixins: [upload],
    data() {
        return {
            clubModel: {
                id: undefined,
                clubName: '',
                clubType: '',
                clubLevel: '',
                clubIntro: '',
                clubContact: '',
            },
            clubImgs: [],
            uploadClubImgList: [],
            //上传图片所需参数
            uploadCode: {
                accessKeyId: '',
                policy: '',
                signature: '',
                host: '',
                dir: ''
            },
            showRemove: false,
            rules: {
                clubName: {
                    type: 'string',
                    required: true,
                    message: '请填写社团名称',
                    trigger: ['blur']
                },
                clubType: {
                    type: 'string',
                    required: true,
                    message: '请填写社团类型',
                    trigger: ['blur']
                },
                clubLevel: {
                    type: 'string',
                    required: true,
                    message: '请填写社团级别',
                    trigger: ['blur']
                },
                clubIntro: {
                    type: 'string',
                    required: true,
                    message: '请填写社团简介',
                    trigger: ['blur']
                },
                clubContact: {
                    type: 'string',
                    required: true,
                    message: '请填写社团邮箱',
                    trigger: ['blur']
                },
            },
            showType: false,
            typeActions: [],
            showLevel: false,
            levelActions: [],
        }
    },
    onLoad(option) {
        if (option.id !== undefined) {
            this.clubModel.id = option.id
            this.getDetail({id: this.clubModel.id})
        }
    },
    onReady() {
        //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
        this.$refs.uForm.setRules(this.rules)
        // 拉取选项数据
        this.getAssociationTypeOptions()
        this.getAssociationLevelOptions()
    },
    methods: {
        getDetail(prams) {
            getClub(prams).then(res => {
                let data = res.data.data
                this.clubModel.id = data.id
                this.clubModel.clubName = data.clubName
                this.clubModel.clubType = data.clubType
                this.clubModel.clubLevel = data.clubLevel
                this.clubModel.clubIntro = data.clubIntro
                this.clubModel.clubContact = data.clubContact

                this.fileList = [{url: data.clubAvatar}]
                this.uploadFileList = [data.clubAvatar]

                this.clubImgs = data.clubImgs.map(item => {
                    return {url: item}
                })
                this.uploadClubImgList = data.clubImgs
            })
        },

        getAssociationTypeOptions() {
            getAssociationTypeOptions().then(res=>{
                console.log(res.data.data)
                this.typeActions = res.data.data.map(item => {
                    return {'name': item}
                })
            })
        },
        getAssociationLevelOptions() {
            getAssociationLevelOptions().then(res=>{
                console.log(res.data.data)
                this.levelActions = res.data.data.map(item => {
                    return {'name': item}
                })
            })
        },

        afterReadClubImg(event) {
            policy().then(res => {
                const {
                    accessKeyId,
                    policy,
                    signature,
                    host,
                    dir
                } = res.data.data;
                this.uploadCode.accessKeyId = accessKeyId;
                this.uploadCode.policy = policy;
                this.uploadCode.signature = signature;
                this.uploadCode.host = host;
                this.uploadCode.dir = dir;
                // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
                let lists = [].concat(event.file);
                let fileListLen = this[`clubImgs${event.name}`].length; //目前clubImgs的长度
                //给每个图片加上状态信息
                lists.map(item => {
                    this[`clubImgs${event.name}`].push({
                        ...item,
                        status: 'uploading',
                        message: '上传中'
                    });
                });
                for (let i = 0; i < lists.length; i++) {
                    if (2000000 < lists[i].size) {
                        uni.showToast({
                            title: '上传失败, 图片超出20M',
                            icon: 'none',
                            duration: 3000
                        });
                        this[`clubImgs${event.name}`].splice(event.index, 1);
                        continue
                    }

                    const fileName = this.uploadCode.dir + lists[i].url.slice(12);
                    //上传图片到服务器

                    // 先确定每一个img的index，这样异步上传可以保证最终顺序不变
                    // 默认404图片
                    this.uploadClubImgList.push('https://mat1.gtimg.com/www/mobi/2017/image/404.png');
                    let index = this.uploadClubImgList.length - 1;
                    uni.uploadFile({
                        url: this.uploadCode.host, // 接口地址
                        filePath: lists[i].url,
                        name: 'file',
                        formData: {
                            key: fileName, //存放图片命名格式 ,自定义不重复就行,在上面的准备数据
                            policy: this.uploadCode.policy, //包含失效时间和文件上传大小限制等信息
                            OSSAccessKeyId: this.uploadCode.accessKeyId, //AccessKey ID用于标识用户（后台接口提供）
                            signature: this.uploadCode.signature //accessKeySecret加密秘钥(后台接口提供)
                        },
                        success: res => {
                            if (res.statusCode === 204) {
                                this.uploadClubImgList[index] = (this.uploadCode.host + '/' +
                                    fileName);
                                this[`clubImgs${event.name}`][fileListLen + i].status = 'success';
                                this[`clubImgs${event.name}`][fileListLen + i].message = '上传成功';
                            } else {
                                uni.showToast({
                                    title: '上传失败',
                                    icon: 'error'
                                });
                                this[`clubImgs${event.name}`].splice(event.index, 1);
                            }
                        },
                        fail: err => {
                            uni.showToast({
                                title: '上传失败',
                                icon: 'error'
                            });
                            this[`clubImgs${event.name}`].splice(event.index, 1);
                        }
                    });
                }
            })
        },
        // 删除图片
        deleteClubImg(event) {
            this[`clubImgs${event.name}`].splice(event.index, 1);
            this.uploadClubImgList.splice(event.index, 1);
        },
        // 选择社团类型
        typeSelect(e) {
            this.clubModel.clubType = e.name
            this.$refs.uForm.validateField('clubType')
        },
        levelSelect(e){
            this.clubModel.clubLevel = e.name
            this.$refs.uForm.validateField('clubLevel')
        },
        // 提交
        submit() {
            let that = this
            if (this.uploadFileList.length == 0) {
                uni.$u.toast('请上传社团头像')
                return
            }

            this.$refs.uForm.validate().then(result => {
                addOrEdit(Object.assign(that.clubModel, {
                    clubAvatar: that.uploadFileList[0],
                    clubImgs: that.uploadClubImgList
                })).then(res => {
                    uni.$u.toast('已提交')
                    setTimeout(() => {
                        uni.navigateBack(1)
                    }, 1000)
                })
            }).catch(errors => {
                uni.$u.toast('请补全信息')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 20rpx 0;
  background-color: #f5f6fa;
}

.warpper {
  box-sizing: border-box;
  background-color: #fff;
  width: 95%;
  margin: 0 auto;
  border-radius: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 30rpx;

  .avatar {
    margin-top: 30rpx;
    border-radius: 50%;

    /deep/.u-upload__button {
      margin: 0;
      border-radius: 50%;
    }

    /deep/.u-upload__wrap__preview__image {
      border-radius: 50%;
    }
  }

  .form {
    width: 100%;

    /deep/.u-form-item__body {
      margin: 10rpx 0;
    }
  }

  .code {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40rpx;
  }

  .commit {
    width: 100%;
    margin: 20rpx 0;
  }
}
</style>
