<template name="home">
	<view>
		<scroll-view>
			<!-- 轮播 -->
			<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true"
				interval="5000" duration="500" :style="[{animation: 'show 0.2s 1'}]">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false"
						objectFit="cover" v-if="item.type=='video'"></video>
				</swiper-item>
			</swiper>
			
			<view class="cu-bar bg-white solid-bottom" :style="[{animation: 'show 0.5s 1'}]">
				<view class="action">
					<text class='cuIcon-title text-blue'></text>我的工作
				</view>
			</view>
			
			<view class="cu-list grid col-4 text-sm">
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: (index + 1)*0.05 + 's'}]"
					v-for="(item,index) in workList" :key="index" @tap="goPage(item.page)">
					<view class="padding text-center">
						<image :src="item.icon" style="width:28px;height:28px;">
							<view class="cu-tag badge margin-top-sm" style="margin-left:1.2em"
								v-if="getTtemDotInfo(item)">
								<block v-if="getTtemDotInfo(item)">{{getTtemDotInfo(item)}}</block>
							</view>
						</image>
						<view class="margin-top-xs">{{item.title}}</view>
					</view>
				</view>
			</view>
			<!-- 常用服务 -->
			<view class="cu-bar bg-white solid-bottom margin-top" :style="[{animation: 'show 0.5s 1'}]">
				<view class="action">
					<text class='cuIcon-title text-blue'></text>生产
				</view>
			</view>

			<view class="cu-list grid col-4 text-sm">
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: (index + 1)*0.05 + 's'}]"
					v-for="(item,index) in usList" :key="index" @tap="goPage(item.page)">
					<view class="padding text-center">
						<image :src="item.icon" style="width:28px;height:28px;">
							<view class="cu-tag badge margin-top-sm" style="margin-left:1.2em"
								v-if="getTtemDotInfo(item)">
								<block v-if="getTtemDotInfo(item)">{{getTtemDotInfo(item)}}</block>
							</view>
						</image>
						<view class="margin-top-xs">{{item.title}}</view>
					</view>
				</view>
			</view>

			<!-- 其他服务 -->
			<view class="cu-bar bg-white solid-bottom margin-top" :style="[{animation: 'show 0.6s 1'}]">
				<view class="action">
					<text class='cuIcon-title text-yellow'></text>仓管
				</view>
			</view>
			<view class="cu-list grid col-4 text-sm">
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: (index + 1)*0.1 + 's'}]"
					v-for="(item,index) in osList" :key="index" @tap="goPage(item.page)">
					<view class="padding text-center">
						<image :src="item.icon" style="width:28px;height:28px;" />
						<view class="margin-top-xs">{{item.title}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="cu-tabbar-height margin-top"></view>
	</view>
</template>

<script>
	import {
		us,
		os,
		work
	} from '@/common/util/work.js'
	import socket from '@/common/js-sdk/socket/socket.js'
	export default {
		name: 'home',
		props: {
			cur: String,
		},
		watch: {
			cur: {
				immediate: true,
				handler: function(val, oldVal) {
					console.log('cur', val, oldVal)
					//this.initMenu()
					const menu = uni.getStorageSync("menu")
					console.log(menu)
					const icon_prefix = "/static/home/128/"
					var type1 = false;
					menu.forEach(item => {
						if (item.children) {
							item.children.forEach(items => {
								/*if (items.meta.title == "待办任务") {
									this.workList.push({
										title: "待办流程",
										icon: icon_prefix + "dblc.png",
										description: "记录每天的工作经验和心得",
										useCount: 1000,
										page: 'toDoProcess',
										sort: 1
									})
								} else if (items.meta.title == "已办任务") {
									this.workList.push({
										title: "已办流程",
										icon: icon_prefix + "yblc.png",
										description: "查看部门，组员",
										useCount: 10000,
										page: 'processed',
										sort: 2
									})		
								} else */if (items.meta.title == "领用申请") {
									this.osList.push({
										title: "领用申请",
										icon: icon_prefix + "index-5.png",
										description: "查看部门，组员",
										useCount: 10000,
										page: 'collectingApplication',
										sort: 1
									})	
								}else if (items.meta.title == "备件台账") {
									// this.osList.push({
									// 	title: "备件台账",
									// 	icon: icon_prefix + "index-3.png",
									// 	description: "",
									// 	useCount: 10000,
									// 	page: 'sparePartsAccount',
									// 	sort: 2
									// })	
								}else if (items.meta.title == "采购申请") {
									this.osList.push({
										title: "采购申请",
										icon: icon_prefix + "index-3.png",
										description: "",
										useCount: 10000,
										page: 'purchaseRequisition',
										sort: 3
									})	
								}
							})
						}
					})
					this.osList = this.osList.sort(this.compare("sort"))
					this.workList = this.workList.sort(this.compare("sort"))
				},
			},
		},
		data() {
			return {
				swiperList: [{
						id: 1,
						type: 'image',
						url: 'http://122.227.135.243:9888/h5/static/applogo.png',
						link: ''
					},

				],
				middleApps: [{
						icon: 'line2_icon1.png',
						title: '审批',
						'text': '个人审批'
					},
					{
						icon: 'line2_icon2.png',
						title: '审批稿',
						'text': '审批草稿箱'
					},
				],
				usList: us.data,
				osList: [],
				workList:work.data,
				msgCount: 0,
				dot: {
					mailHome: false
				}
			}
		},
		methods: {
			compare(prop) {
				return function(obj1, obj2) {
					var val1 = obj1[prop];
					var val2 = obj2[prop];
					if (val1 < val2) {
						return -1;
					} else if (val1 > val2) {
						return 1;
					} else {
						return 0;
					}
				}
			},
			initMenu() {
				console.log("-----------home------------")
				this.onSocketOpen()
				this.onSocketReceive()
				this.loadCount(0);
			},
			goPage(page) {
				if (!page) {
					return false;
				}
				if( page == 'helloWorld'){
					this.$tip.alert("暂未开放");
					return
				}else{
					if (page === 'annotationList') {
						this.msgCount = 0
					}
					this.dot[page] = false
					this.$Router.push({
						name: page
					})
				}
				
			},
			// 启动webSocket
			onSocketOpen() {
				socket.init('websocket');
			},
			onSocketReceive() {
				var _this = this
				socket.acceptMessage = function(res) {
					// console.log("页面收到的消息", res);
					if (res.cmd == "topic") {
						//系统通知
						_this.loadCount('1')
					} else if (res.cmd == "user") {
						//用户消息
						_this.loadCount('2')
					} else if (res.cmd == 'email') {
						//邮件消息
						_this.loadEmailCount()
					}
				}
			},
			loadCount(flag) {
				console.log("loadCount::flag", flag)
				let url = '/sys/annountCement/listByUser';
				this.$http.get(url).then(res => {
					console.log("res::", res)
					if (res.data.success) {
						let msg1Count = res.data.result.anntMsgTotal;
						let msg2Count = res.data.result.sysMsgTotal;
						this.msgCount = msg1Count + msg2Count
						console.log("this.msgCount", this.msgCount)
					}
				})
			},
			loadEmailCount() {
				this.dot.mailHome = true
			},
			getTtemDotInfo(item) {
				if (item.page === 'annotationList' && this.msgCount > 0) {
					return this.msgCount
				}
				return '';
			}
		}
	}
</script>

<style scoped>
	.cu-list.grid>.cu-item {
		padding: 0px 0px;
	}

	.line2-icon {
		width: 60px;
		height: 60px;
	}
</style>
