<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true" backRouterName="index">
				<block slot="backText">返回</block>
				<block slot="content">添加记录</block>
			</cu-custom>
			<view class="con-2">
				<view class="title">
					吸放灰地点
				</view>
				<view class="input">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<input type="text" disabled="" v-model="array[index]" placeholder="点击选择地点">
					</picker>
				</view>
			</view>
			<view class="con-2">
				<view class="title">
					开始时间
				</view>
				<view @click="goTime()" class="input">

					<input type="text" disabled="true" v-model="startTime" placeholder="请输入开始时间">

				</view>
			</view>
			<view class="con-2">
				<view class="title">
					结束时间
				</view>
				<view @click="goTimes()" class="input">
					<input type="text" disabled="true" v-model="endTime" placeholder="请输入结束时间">
				</view>
			</view>
			<u-datetime-picker :minDate='NowDate' :show="show1" v-model="value1" mode="datetime" closeOnClickOverlay
				@confirm="confirm" @cancel="cancel" @change="change" @close="close">

			</u-datetime-picker>
			<u-datetime-picker :minDate='NowDates' :show="show2" v-model="value2" mode="datetime" closeOnClickOverlay
				@confirm="confirms" @cancel="cancels" @change="change" @close="closes">

			</u-datetime-picker>
			
			<view class="con-2">
				<view class="title">
					车辆编号
				</view>
				<view class="input">
					<input type="text" v-model="parmas.vehicleNo" placeholder="请输入车辆编号">
				</view>
			</view>
			<view class="con-2">
				<view class="title">
					记录类型
				</view>
				<view class="radio">
					<radio-group @change="radioChange">
						<view :class="index === current?'blue':''" class="radio-list" v-for="(item, index) in items"
							:key="item.value">
							<label class="radios">
								<radio :value="item.value" color='red' :checked="index === current" />
								<text>{{item.name}}</text>
							</label>
						</view>
					</radio-group>
				</view>
			</view>
			<view class="con-3">
				<view class="title">
					备注
				</view>
				<view class="textarea">
					<textarea @input='content' placeholder="请输入" name="" id="" cols="30" rows="10">

					</textarea>
				</view>
			</view>
			<view @click="add()" class="btn">
				提交
			</view>


		</scroll-view>
	</view>

</template>

<script>
	import appSelect from '@/components/my-componets/appSelect.vue'
	import myImageUpload from '@/components/my-componets/my-image-upload.vue'
	import myDate from '@/components/my-componets/my-date.vue'


	export default {
		components: {
			appSelect,
			myImageUpload,
			myDate
		},
		data() {
			const d = new Date()
			const year = d.getFullYear()
			let month = uni.$u.padZero(d.getMonth() + 1)
			const date = d.getDate()
			return {
				NowDate: new Date(),
				NowDates: new Date(),
				date: "",
				value1: new Date(),
				show1: false,
				value2: new Date(),
				show2: false,
				array: [

				],
				modalName: null,
				item: {
					msg: '退出成功'
				},
				type: "1",
				selected: [],
				beginTime: '',
				id: "",
				urls: "/ep/epStandard/queryBySystemId",
				listUrl: '/ep/epEquSystem/queryPageListChildren',
				addUrl: "/ep/epCleardust/add",
				imgList: [],
				proList: [],
				NavBarColor: this.NavBarColor,
				items: [{
					"name": "吸灰",
					"value": "0"
				}, {
					"name": "放灰",
					"value": "1"
				}],
				current: 0,
				index: 0,
				parmas: {
					"cleardustPlace": "",
					"type": "0",
					"vehicleNo": "",
					"remark": ""
				},
				endTime :"",
				startTime:""
			}
		},
		onLoad() {
			this.getClass()
		},
		methods: {
			content(e) {
				this.parmas.remark = e.detail.value
			},
			radioChange(e) {
				console.log(e)
				this.parmas.type = e.detail.value
			},
			closes() {
				this.show2 = false
			},
			cancels() {
				this.show2 = false
			},
			close() {
				this.show1 = false
			},
			cancel() {
				this.show1 = false
			},
			confirm(e) {
				this.show1 = false
				console.log(e)
				const timeFormat = uni.$u.timeFormat
				console.log(timeFormat(e.value, 'yyyy-mm-dd hh:MM'))
				this.startTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
				console.log(this.value1)
			},
			confirms(e) {
				this.show2 = false
				console.log(e)
				const timeFormat = uni.$u.timeFormat
				console.log(timeFormat(e.value, 'yyyy-mm-dd hh:MM'))
				this.endTime  = timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
				console.log(this.value1)
			},
			change(e) {
				// console.log('change', e)
			},
			goTime() {
				this.show1 = true;
			},
			goTimes() {
				this.show2 = true;
			},
			add() {
				this.parmas.endTime = this.endTime
				this.parmas.startTime = this.startTime
				if (!this.parmas.cleardustPlace) {
					this.parmas.cleardustPlace = this.array[0]
				}
				this.$http.post(this.addUrl, this.parmas).then(res => {
					console.log(res)
					var res = res.data;
					if (res.code != 500) {
						this.$tip.success(res.message);
						this.$Router.push({
							name: 'dustAbsorption',
							params: {}
						})
					} else {
						this.$tip.alert(res.message);
					}

				}).catch(() => {
					//联网失败, 结束加载
					console.log(res.data.message)
				})
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getClass() {
				this.$http.get(this.listUrl, {
					params: {

					}
				}).then(res => {
					console.log(res)
					var res = res.data;
					if (res.code != 500) {
						res.result.forEach(item => {
							this.array.push(item.name)
						})
					} else {
						this.$tip.alert(res.message);
					}

				}).catch(() => {
					//联网失败, 结束加载
					console.log(res.data.message)
				})
			},
			bindPickerChange(e) {
				this.parmas.cleardustPlace = this.array[e.detail.value]
			},
			bindDateChange(e) {
				console.log(e)
			},
			getInfo() {
				this.$http.get(this.urls, {
					params: {
						systemId: this.id
					}
				}).then(res => {
					console.log(res)
					var res = res.data;
					if (res.code != 500) {
						this.proList = res.result
					} else {
						this.$tip.alert(res.message);
					}

				}).catch(() => {
					//联网失败, 结束加载
					console.log(res.data.message)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.btn {
		width: 90%;
		height: 94upx;
		line-height: 94upx;
		background: #3874F6;
		border-radius: 47upx;
		font-size: 34upx;
		font-family: PingFang SC;
		font-weight: 300;
		color: #FFFFFF;
		margin: 100upx auto 200upx auto;
		text-align: center;
	}

	.tip {
		height: 100upx;
		width: 100%;
		padding: 0 10upx;
		font-size: 40upx;
		line-height: 100upx;
		font-weight: bolder;
		color: #3172BE;
	}

	.title {
		font-size: 35upx;
		color: #383838;
		height: 80upx;
		line-height: 80upx;
		font-weight: bolder;

	}

	.titles {
		width: 100%;
		padding: 0 10upx;
		font-size: 30upx;
		color: #979797;
		height: 60upx;
		line-height: 50upx;
	}

	.con-2 {
		width: 100%;
		padding: 0 10upx;

		.input {
			height: 80upx;
			line-height: 80upx;

			input {
				padding-left: 20upx;
				height: 80upx;
				line-height: 80upx;
				border: 1upx solid #e3e3e3;
				border-radius: 10upx;
				width: 100%;
				font-size: 30upx;
				color: #979797;
			}
		}

		.radio {
			height: 60upx;

			radio-group {
				width: 50%;
				display: flex;
				justify-content: space-around;
			}

			.radio-list {
				margin-right: 20upx;

				text {
					margin-left: 10upx;
				}
			}
		}
	}

	.con-3 {
		width: 100%;
		padding: 0 10upx;

		.titles {
			font-size: 30upx;
			color: #979797;
			height: 60upx;
			line-height: 50upx;
		}

		.textarea {
			min-height: 200upx;
			padding: 20upx 20upx;
			border: 1upx solid #e3e3e3;
			border-radius: 10upx;

			textarea {
				width: 100% !important;
				font-size: 30upx;
				color: #979797;
			}
		}
	}

	.con-1 {
		width: 100%;
		padding: 0 10upx;
	}
</style>
