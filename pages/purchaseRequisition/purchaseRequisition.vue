<template>
	<view class="bg-white">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" backRouterName="indexs">
			<block slot="backText">返回</block>
			<block slot="content">采购申请</block>
		</cu-custom>
		<view class="container">
			<view class="search-box margin-bottom-20">
				<view class="tabs-wrap">
					<uni-search-bar placeholder="请输入申请单号" bgColor="#EEEEEE" v-model="purchaseNo" @confirm="search" />
				</view>
				<view class="tabs-right" @click="adds">新增</view>
			</view>
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="top" @down="downCallback" @up="upCallback">
				<view class="pro-recorder">
					<view class="pro-list" :style="[{animationDelay: (index + 1)*0.05 + 's'}]"
						v-for="(item,index) in msgList" :key="index" @click="goInfo(index)">
						<view class="pro-top">
							<view class="topleft">{{item.purchaseNo}}</view>
							<view class="topright" v-if="item.define01 == '0'" @click.stop="goApply(item)"><text>提交申请</text>
			</button></view>
						</view>
						<view class="proItem">
							<view class="itemleft">状态</view>
							<view class="itemright" :class="item.actStatus == '启动' ? 'red' :'green'">{{item.actStatus || '' }}</view>
						</view>
						<view class="proItem">
							<view class="itemleft">提报人</view>
							<view class="itemright">{{item.createBy || '无'}}</view>
						</view>
						<view class="proItem">
							<view class="itemleft">申请部门名称</view>
							<view class="itemright">{{ item.deptName }}</view>
						</view>
						<view class="proItem">
							<view class="itemleft">提报时间</view>
							<view class="itemright">{{ item.createTime }}</view>
						</view>
					</view>

				</view>
			</mescroll-uni>
		</view>

	</view>
</template>

<script>
	const tabs = [{
		title: '运输中',
		value: 0
	}, {
		title: '已收货',
		value: 1
	}];
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

	import uniSearchBar from '@/components/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
	import configService from '@/common/service/config.service.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			uniSearchBar
		},
		data() {
			return {
				tabs,
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
				purchaseNo: '',
				read: "all",
				announcement1: [],
				msg1Count: "",
				msg1Title: "",
				announcement2: [],
				msg2Count: "",
				msg2Title: "",
				urls: "/ep/epPurchaseReq/list",
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
				return this.CustomBar * 2.2 + 95
			},
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			},
		},
		onHide() {

		},
		onBackPress() {
			console.log("手势返回")
			this.$Router.replaceAll({
				name: 'index'
			})
		},
		methods: {
			adds() {
				this.$Router.push({
					name: 'addPurchase'
				})
			},

			goInfo(index) {
				console.log(index)
				this.$Router.push({
					name: 'addPurchase',
					params: this.msgList[index]
				})
			},
			goApply(item){
				uni.showModal({
					title: '提示',
					content: '确定要提交申请么？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.$http.post('/flowable/definition/startByDataId/'+item.id+'/epPurchaseReqService', {
								params: {
									dataId: item.id
								}
							}).then(res => {
								console.log(res.data.code)
								if(res.data.code == 200){
									this.$tip.success('操作成功');
									setTimeout(() => {
										this.mescroll.resetUpScroll()
									}, 1000)
								}else{
									this.$tip.toast(res.data.message);
									return
								}
							})
						}
					}
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
							pageSize: page.size,
							purchaseNo: this.purchaseNo
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

		}
	}
</script>

<style scoped lang="scss">
	.bg-blues {
		background-color: #4884fc;
		color: white;
		padding: 0 5rpx !important;
		text-align: center;
		border-radius: 10%;
	}
	.search-box {
		display: flex;
		height: 100rpx;
		align-items: center;

		.margin-bottom-20 {
			margin-bottom: 20rpx;
		}

		.tabs-wrap {
			width: 100%;
		}

		.tabs-right {
			width: 15%;
			text-align: center;
			font-size: 32rpx;
		}

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
			border-bottom: 1rpx solid #E8E8E8;

			.pro-top {
				height: 70rpx;
				line-height: 70rpx;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.topleft {
					width: 72%;
					font-size: 36rpx;
					font-weight: bold;
					overflow: hidden; //超出的文本隐藏
					text-overflow: ellipsis; //用省略号显示
					white-space: nowrap; //不换行


				}

				.topright {
					width: 25%;
					text {
						display: inline-block;
						width: 160rpx;
						height: 40rpx;
						text-align: center;
						line-height: 40rpx;
						background-color: red;
						border-radius: 25rpx;
						color: white;
						padding: 5rpx 10rpx;
					}

				}
				.red{
					color:red;
				}
				.green{
					color:green;
				}
			}

			.proItem {
				height: 55rpx;
				line-height: 55rpx;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.itemleft {
					color: #999999;
				}

				.itemright {
					color: black;
				}
			}


		}
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
