<template>
	<view class="container">
		<view style="color: #909399;">
			七天内可修改一次名字
		</view>
		<u-form :model="name" ref="uForm">
				<u-form-item>
					<u-input v-model="name" shape='circle' :placeholder="name" />
				</u-form-item>
				<u-form-item>
					<u-button type="primary" shape="circle">保存</u-button>
				</u-form-item>
		</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				name:'',
			}
		}
	}
</script>

<style>
	.container{
		width: 80%;
		margin: 20rpx auto auto auto;
	}
</style>