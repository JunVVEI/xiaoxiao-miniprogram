<template>
	<view class="container" style="overflow: hidden;">
		<!-- 空教室查询表单 -->
		<view class="topForm">
			<u--form
					labelPosition="left"
					:model="queryFrom"
					ref="queryFrom"
			>
				<!-- 按 日期/周次 查询 -->
				<u--form-item
						prop="queryFrom.date"
				>
					<view class="selectDate">
						<!-- 日期/周次 类别选择 -->
						<view class="selectWeek" v-if="weekList.length">
							<picker @change="weekChange" :value="weekIndex" :range="weekList" selector-type="auto">
								<view style="display: flex;">
									<uni-icons type="bars" size="20" color="#054f74"></uni-icons>
									<view style="padding-left: 5rpx;line-height: 20px;">{{ weekList[weekIndex] }}</view>
								</view>
							</picker>
						</view>
						<!-- 具体日期 -->
						<!-- <view class="dateDetail" v-show="weekIndex == 0">
							<uni-datetime-picker type="date" :clear-icon="false" v-model="single" @maskClick="maskClick" :border="false"/>
						</view> -->
						<!-- 具体星期 weekIndex != 0-->
						<view class="weekDetail" v-show="weekIndex >= 0">
							<view class="weekDetail-span" v-for="(item,index) in week" :key="index" tabindex="index"
									@click="setDayFocus(index)" :class="{weekDetailFocus: index == focusDay }"
							> <text style="padding: 2rpx;">周{{ item }} </text></view>
						</view>
					</view>
				</u--form-item>
				<!-- 按教学楼查询 -->
				<u--form-item>
					<view class="selectBuilding">
						<view class="building" style="display: flex; position: sticky; left: 0;background: transparent;">
							<uni-icons type="home-filled" size="22" color="#054f74"></uni-icons>
							<p style="padding-left: 5rpx;line-height: 22px;">教学楼</p>
						</view>
						<view class="buildings">
							<view class="buildings-span" v-for="(item,index) in buildings" :key="index" tabindex="index"
									@click="setBuildingFocus(item.buildingId)" :class="{buildingFocus: item.buildingId == focusBuilding}"
							> <text style="padding: 4rpx;">{{ item.buildingName }}</text> </view>
						</view>
					</view>
				</u--form-item>
			</u--form>	
		</view>
		
		<!-- 空教室信息展示 -->
		<view class="showRoom" >
			<view class="tagsInfo">
				<view class="showTags">
					<view class="leftTags">
						<uni-icons type="notification-filled" size="20" color="#054f74"></uni-icons>
						<text style="margin-left:10rpx;color: #054f74;">节 次</text>
					</view>
					<view class="rightTags">
						<p style="width: auto">{{classTime[selectedTag]}}</p>
					</view>
				</view>
			</view>
			<view class="tagsInfo">
				<view class="showTags">
					<view class="leftTags">
						<uni-icons type="map-pin-ellipse" size="20" color="#054f74"></uni-icons>
						<text style="margin-left:10rpx;color: #054f74;">教 室</text>
					</view>
					<view class="rightTags">
						<p style="width: 22%">上午</p>
						<p style="width: 19%">中午</p>
						<p style="width: 22%">下午</p>
						<p style="width: 22%">晚上</p>
					</view>
				</view>
			</view>
			<view class="roomDetail">
				<roomItem v-for="(item, index) in rooms" :key="index"
									:roomId='item.classroom'
									:seatNum='item.seatNumber'
									:roomStatus='item.freeList'
									:pointShow='tagIndex'
									:preShow='preShow'
									:selectedTag='selectedTag'
									@setSelectedTag='setSelectedTag'
				>
				</roomItem>
				<view style="margin-bottom: 50rpx"><p>12132323</p></view>
			</view>

		</view>
	</view>
</template>

<script>
	import roomItem from '@/UI/roomItem/roomItem.vue';
	import { getBuildings, getFreeRoom } from '@/api/room/index.js';
	import { getWeek } from '@/api/course/index.js';
	export default {
		components: {
			roomItem
		},
		data() {
			return {
				
				single: '',
				week: ['日','一', '二', '三', '四', '五', '六'],
				weekIndex: 0, // 当前周下标
				weekList: [], // '日期'
				buildings:[],
				queryFrom:{
					date:{ week:0, day:0},
					buildingId:''
				},
				focusDay: 0,
				focusBuilding: 67,
				freeRoomParams:{
					week: 0,
					day: 0,
					buildingId: "string"
				},
				rooms: [],
				tagIndex: 0,
				preShow: 0,
				selectedTag: 0,
				classTime: [
						'第1节 08:00 - 08:40',
						'第2节	08:45 - 09:25',
						'第3节	09:55 - 10:35',
						'第4节	10:40 - 11:20',
						'第5节 11:25 - 12:05',
						'第6节 12:40 - 13:20',
						'第7节 13:25 - 14:05',
						'第8节 14:30 - 15:10',
						'第9节 15:15 - 15:55',
						'第10节 16:25 - 17:05',
						'第11节 17:10 - 17:50',
						'第12节 17:55 - 18:35',
						'第13节 19:30 - 20:10',
						'第14节 20:15 - 20:55',
						'第15节 21:00 - 21:40',
				]
			}
		},
		
		onLoad() {
			this.getWeek();
			this.getBuildings();
			this.getFreeRoom();
			this.getTime();
		},
		
		methods: {
			// 周数改变监听事件
			weekChange(e) {
				// if (e.detail.value === '日期') {
				// 	this.weekIndex = 0;
				// 	return;
				// }
				this.weekIndex = e.detail.value;
				this.getFreeRoom();
			},
			
			getWeek() {
				// const arr = new Array(20).fill(1).map((v,i) => ++i);
				const arr = new Array(20).fill(0).map((v,i) => ++i);
				for (let i of arr) {
					this.weekList.push('第' + i + '周');
				}
				
				getWeek().then(res => {
					if (res.data.data.currentWeek == 0) {
						this.weekIndex = 0;
					}
					else {
						this.weekIndex = parseInt(res.data.data.currentWeek - 1);
					}
				});
				
				let day = new Date().getDay();
				this.focusDay = day;
			},
			
			setDayFocus(data) {
				this.focusDay = data; 
				// console.log(this.focusDay);
				// this.freeRoomParams.day = this.focusDay;
				this.getFreeRoom();
			},
			
			setBuildingFocus(data) {
				this.focusBuilding = data;
				// this.freeRoomParams.buildingId = stringify(this.focusBuilding);
				this.getFreeRoom();
			},
			
			// 获取教学楼信息
			getBuildings() {
				// let that = this;
				getBuildings().then(res => {
					this.buildings = JSON.parse(JSON.stringify(res.data.data)).buildingList;
					// console.log(this.buildings)
				})
			},
			
			getFreeRoom() {
				// let data = { week:this.weekIndex, day:this.focusDay, buildingId:this.focusBuilding }
				let thisWeek = parseInt(this.weekIndex) + 1;
				this.freeRoomParams.week = thisWeek;
				if (this.focusDay == 0){
					this.freeRoomParams.day = 7
				}
				else {
					this.freeRoomParams.day = this.focusDay;
				}
				this.freeRoomParams.buildingId = this.focusBuilding + "";
				if(thisWeek != 0 ) {
					getFreeRoom(this.freeRoomParams).then(res => {
					this.rooms = res.data.data;
					// console.log(res.data.data)
					})
				}
			},

			getTime() {
				const now = new Date();
				const timeSlots = [
					{ start: '00:00', end: '08:40' },
					{ start: '08:40', end: '09:25' },
					{ start: '09:25', end: '10:35' },
					{ start: '10:35', end: '11:20' },
					{ start: '11:20', end: '12:05' },
					{ start: '12:05', end: '13:20' },
					{ start: '13:20', end: '14:05' },
					{ start: '14:05', end: '15:10' },
					{ start: '15:10', end: '15:55' },
					{ start: '15:55', end: '17:05' },
					{ start: '17:05', end: '17:50' },
					{ start: '17:50', end: '18:35' },
					{ start: '18:35', end: '20:10' },
					{ start: '20:10', end: '20:55' },
					{ start: '20:55', end: '23:59' }
				];

				let currentTimeSlot = 0;
				for (let i = 0; i < timeSlots.length; i++) {
					const start = new Date();
					const end = new Date();
					const slot = timeSlots[i];

					start.setHours(parseInt(slot.start.split(':')[0]));
					start.setMinutes(parseInt(slot.start.split(':')[1]));
					end.setHours(parseInt(slot.end.split(':')[0]));
					end.setMinutes(parseInt(slot.end.split(':')[1]));

					if (start <= now && now <= end) {
						currentTimeSlot = i;
					}
				}

				this.tagIndex = currentTimeSlot;
				this.selectedTag = currentTimeSlot;
			},

			setSelectedTag(key) {
				this.selectedTag = key
			}
			
		}
	}
</script>

<style>
.container {
	display: flex;
	/* flex: 1; */
	felx-direction:colum;
	justify-content: center;
	align-items: flex-start;
	position: relative;
	 background-color: #f5f6fa;
	 height: 100%;
	 width: 100%;
	 padding-top: 20rpx;
	/* overflow-y: hidden; */
}	
	.topForm {
		display: flex;
		felx-direction:row;
		justify-items: center;
		align-items: center;
		position: fixed;
		width: 92%;
		height: 150rpx;
		margin: auto;
		left: 0;
		right: 0;
		/* background:linear-gradient(to left, #F3E9E8, #B5D1E2);//#054f74 #4C97E1 #96b9d9 */
		background: transparent;
		color: #f3fafd;
		border-radius: 28rpx;
		/* z-index: -1; */
	}

/* 时间选择栏 */
	.selectDate {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-items: start;
		align-items: center;
		margin:1rpx 10rpx 10rpx;
		}
		
		.selectWeek {
			padding:0 3% 0;
		}
		
		.selectWeek picker {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 11pt;
			text-align: center;
			white-space: nowrap;
			font-weight: bold;
			color: #054f74;
		}
		
		.dateDetail,
		.weekDetail {
			margin:1rpx 3rpx 2rpx;
			width: 494rpx;
		}
		
		.weekDetail {
			overflow-x: auto;
			white-space: nowrap;
		}
		
		.weekDetail::-webkit-scrollbar {
			display: none;
		}
		
		.weekDetail-span {
			display: inline-block;
			width: 76rpx;
			height: 54rpx;
			margin:0rpx 8rpx 0rpx;
			padding: 2rpx;
			border-radius: 12rpx;
			text-align: center;
			line-height: 54rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #054f74;
		}
		/* .weekDetail span:focus */
		.weekDetailFocus {
			background: rgba(18, 130, 182, 0.151); // #f5f5f5
			/* opacity: 0.5; */
			color: #054f74;
			/* font-size: 36rpx; */
			font-weight: bolder;
		}
		
	.selectBuilding {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-items: start;
		align-items: center;
		margin:1rpx 10rpx 10rpx;
	}
	
		.building {
			padding:0 3% 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 11pt;
			text-align: center;
			white-space: nowrap;
			font-weight: bold;
			color: #054f74;
		}
	
		.buildings {
			overflow-x: auto;
			white-space: nowrap;
			width: 494rpx;
		}
	
		.buildings::-webkit-scrollbar {
			display: none;
		}
		
		.buildings-span {
			display: inline-block;
			/* width: 76rpx; */
			height: 54rpx;
			margin:0rpx 8rpx 0rpx;
			border-radius: 12rpx;
			text-align: center;
			line-height: 54rpx;
			font-size: 32rpx;
			padding: 4rpx;
			font-weight: bold;
			color: #054f74;// #054f74 #22406A
		}
		/* .buildings span:focus */
		.buildingFocus {
			background: rgba(18, 130, 182, 0.151);
			color: #054f74; // #333333
			/* font-size: 36rpx; */
			font-weight: bolder;
		}
	
	.showRoom {
		/* display: flex;
		felx-direction:colum;
		justify-content: center;
		align-items: center; */
		position: fixed;
		width: 92%;
		height: 78%;
		margin-top: 160rpx;
		/* margin: auto; */
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		background: #ffffff;
		color: #f3fafd;
		border-radius: 28rpx;
	}
	
		.tagsInfo {
			position: sticky;
			margin: 16rpx;
		}
		
			.showTags {
				margin: auto;
				height: 50rpx;
				width: 100%;
				border-radius: 29rpx;
				background: linear-gradient(to left, white, #E8EAED);
				position: relative;
			}
				.leftTags {
					display: flex;
					felx-direction: column;
					align-items: flex-start;
					justify-content: center;
					width: 20%;
					position: absolute;
					top: 50%;
					left: 13%;
					transform: translate(-50%,-50%);
				}
				
				.rightTags {
					/* display: flex;
					felx-direction: column; */
					/* align-items: flex-start; */
					/* justify-content: start; */
					width: 86%;
					position: absolute;
					top: 50%;
					left: 70%;
					transform: translate(-50%,-50%);
				}
					.rightTags p {
						display: inline-block;
						/*width: 125rpx;*/
						margin-right: 20rpx;
					}
					.showTags p {
						color: #054f74; 
						font-size: 26rpx;
						margin: auto;
					}
					
						.freeTag ,
						.redTag {
							margin: auto;
							border-radius: 30rpx;
							width: 26rpx;
							height: 40rpx;
						}
				
		.roomDetail {
			height: 100%;
			background: white;
			margin: auto;
			overflow-y: auto;
		}
		
</style>
