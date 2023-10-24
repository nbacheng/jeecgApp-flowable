<template>
	<view class="bg-white">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" backRouterName="index">
			<block slot="backText">返回</block>
			<block slot="content">吸放灰记录</block>
		</cu-custom>
		<view class="container">
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="top" @down="downCallback" @up="upCallback">

				<view class="pro-recorder">

					<view class="pro-list" :style="[{animationDelay: (index + 1)*0.05 + 's'}]"
						v-for="(item,index) in msgList" :key="index" >
						<view class="left">
							<img src="/static/home/128/equipment.png" alt="">
						</view>
						<view class="center">
							<view class="top-1">
								<text>{{item.cleardustPlace}}</text>
								<text>{{item.checkName}}</text>
							</view>
							<view class="top-2">
								车辆编号：{{item.vehicleNo}}
							</view>
							<view class="top-3">
								吸灰时间：{{item.createTime}}
							</view>
							<view class="top-4">
								备注:{{item.remark}}
							</view>
						</view>
						<view class="right">
							<view v-if='item.type==0' class="top">
								吸灰
							</view>
							<view v-else class="top">
								放灰
							</view>
							<view class="down">
								用时：{{item.cleardustHour}}min
							</view>
						</view>
					</view>

				</view>
			</mescroll-uni>
		</view>
		<view @click="goRead()" class="btn">
			添加记录
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";


	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				NavBarColor: this.NavBarColor,
				upOption: {
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 暂无数据 ~', // 提示

					},
					loading: '',
					text: '全部',
					isShowNoMore: false,
					textNoMore: '我是有底线的 >_<'
				},
				msgList: [], //列表数据
				read: "all",
				announcement1: [],
				msg1Count: "",
				msg1Title: "",
				announcement2: [],
				msg2Count: "",
				msg2Title: "",
				urls: "/ep/epCleardust/list",
				listTouchStart: 0,
				modalName: null,
				listTouchDirection: null,
			}
		},
		onShow() {
			if (this.mescroll) {
				this.mescroll.resetUpScroll()
			}
		},
		computed: {
			top() {
				return this.CustomBar * 2.2
			},
		},
		methods: {
			goInfo(index) {
				this.$Router.push({
					name: 'dustAbsorptionInfo',
					params: this.msgList[index]
				})
			},
			upCallback(page) {
				//联网加载数据
				console.log("tabindex", this.TabCur)
				let keyword = this.TabCur
				if (keyword == 0) {
					this.$http.get(this.urls, {
						params: {
							pageNo: page.num,
							pageSize: page.size
						}
					}).then(res => {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;

						this.announcement1 = res.data.result.records
						this.mescroll.endSuccess(this.announcement1.length);
						//console.log("url", res)
						//设置列表数据
						if (res.data.success) {
							console.log("res", res.data)
							this.msg1Count = res.data.result.total
							this.msg1Title = "通知(" + res.data.result.total + ")";
							for (let annItem of this.announcement1) {
								this.msgList.push(annItem)
							}
						}
						if (page.num == 1) {
							this.msgList = []; //如果是第一页需手动制空列表
							this.msgList = this.msgList.concat(this.announcement1); //追加新数据
						}

					}).catch(() => {
						//联网失败, 结束加载
						this.mescroll.endErr();
					})
				}
				if (keyword == 1) {
					this.$http.get(this.url, {
						params: {
							pageNo: page.num,
							pageSize: page.size,
							msgCategory: '2'
						}
					}).then(res => {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						this.announcement2 = res.data.result.records
						this.mescroll.endSuccess(this.announcement2.length, this.msgCount);

						//设置列表数据
						if (res.data.success) {
							console.log("res sys", res.data)
							this.msg2Count = res.data.result.total
							this.msg2Title = "通知(" + res.data.result.total + ")";
							// this.announcement2.filter((item,index) => {
							// // console.log("item",item)
							//  if(item.anntId == this.announcement2[index+1].anntId){
							//   this.announcement2.splice(item,1)
							for (let item of this.announcement2) {
								this.msgList.push(item)
							}
							//   }
							// })
						}
						if (page.num == 1) {
							this.msgList = []; //如果是第一页需手动制空列表
							this.msgList = this.msgList.concat(this.announcement2); //追加新数据
						}
					}).catch(() => {
						//联网失败, 结束加载
						this.mescroll.endErr();
					})
				}

			},
			goRead() {
				this.$Router.push({
					name: 'addDustAbsorption'
				})
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.msgList = [] // 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			goAnnotationDetail(item) {
				//item.readFlag = '1'
				this.mescroll.resetUpScroll()
				if (item.openType == "component" && item.openPage.indexOf('email') >= 0) {
					this.goEmailDetailPage(item)
				} else {
					// console.log("detail",encodeURIComponent(JSON.stringify(item)))
					uni.navigateTo({
						url: '/pages/annotation/annotationDetail?item=' + encodeURIComponent(JSON.stringify(item))
					});
				}
			},
			isEmail(item) {
				if (item.openType == "component" && item.openPage.indexOf('email') >= 0) {
					return true;
				} else {
					return false;
				}
			},
			goEmailDetailPage(item) {
				console.log("go", item.anntId)
				console.log("item", item)
				if (item.readFlag == '0') {
					//item.readFlag = '1'
					this.mescroll.resetUpScroll()
					let readUrl = '/sys/sysAnnouncementSend/editByAnntIdAndUserId';
					this.$http.put(readUrl, {
						anntId: item.anntId
					})
				}
				// console.log("goe",item.busId)

				uni.navigateTo({
					url: '/pages/mail/mailDetail?id=' + item.busId
				});

			},
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			deleteAnnotation(item) {
				this.$http.delete(this.delUrl + '?id=' + item.id).then(res => {
					console.log("结果数据9", res)
					if (res.data.success) {
						this.mescroll.resetUpScroll()
					}
				}).catch(e => {
					console.log("al delUrl请求错误2", e)
					this.mescroll.endErr();
				})
			},
			formatDate(text, len) {
				if (!text || text.length == 0) {
					return ''
				}
				if (text.length < len) {
					return text;
				}
				return text.substr(0, len)
			},
			titleFilter(text, len) {
				if (!text || text.length == 0) {
					return ''
				}
				if (text.length < len) {
					return text;
				}
				return text.substr(0, len) + "..."
			}

		}
	}
</script>

<style scoped lang="scss">
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
		position: fixed;
		text-align: center;
		bottom: 100upx;
		left: 5%;
		z-index: 999;
	}

	.pro-recorder {
		width: 100%;
		background-color: white;
		margin-top: 5upx;
		padding: 0 20upx;

		.pto-tip {
			width: 100%;
			height: 80upx;
			font-size: 29upx;
			font-family: PingFang SC;
			font-weight: 600;
			color: #333333;
			line-height: 80upx;
		}

		.pro-list {
			width: 100%;
			height: 200upx;
			display: flex;
			justify-content: space-around;
			border-bottom: 1rpx solid #E8E8E8;
			padding-top: 20upx;
			.left {
				width: 15%;

				img {
					width: 90upx;
					height: 90upx;
					background: #3874F6;
					border-radius: 50%;
					position: relative;
					top: 30upx;
				}
			}

			.center {
				width: 60%;
				
				.top-1 {
					height: 40upx;
					line-height: 40upx;
					font-size: 27upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #333333;
					text:nth-child(1){
						font-weight: bolder;
					}
					text:nth-child(2){
						display: inline-block;
						margin-left: 20upx;
						padding: 3upx 5upx;
						line-height: 20upx;
						font-size: 23upx;
						background: #FFFFFF;
						border: 1px solid #F47132;
						border-radius: 3px;
						color: #F47132;
					}
				}
				
				.top-2 {
					height: 40upx;
					line-height: 40upx;
					font-size: 25upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #666666;
				}
				
				.top-3 {
					height: 40upx;
					line-height: 40upx;
					font-size: 25upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
				}
				
				.top-4 {
					height: 40upx;
					line-height: 40upx;
					font-size: 25upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
				}
			}

			.right {
				width: 25%;
				.top{
					text-align: right;
					height: 40upx;
					line-height: 40upx;
					font-size: 25upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #3874F6;
				}
				.down{
					text-align: right;
					height: 40upx;
					line-height: 40upx;
					font-size: 25upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FF6600;
				}
			}
		}
	}

	.e-btn {
		margin-bottom: 1rem;
	}

	.titlePad {
		margin-top: 0.6rem;
	}

	.cu-list>.move-cur {
		transform: translateX(-150rpx);

	}

	.nav .cu-item.cur {
		position: flex;
		z-index: 9;
		border-bottom: 4upx solid;
	}
</style>
