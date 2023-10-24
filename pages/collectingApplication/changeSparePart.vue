<template>
	<view class="bg-white">
		<cu-custom :bgColor="NavBarColor" :isBack="true" backRouterName="index">
			<block slot="backText">返回</block>
			<block slot="content">选择备件</block>
		</cu-custom>
		<view class="container">
			<view class="search-box margin-bottom-20">
				<view class="tabs-wrap">
					<uni-search-bar placeholder="请输入物料名称/编码/规格" bgColor="#EEEEEE" v-model="name" @confirm="search" />
				</view>
			</view>
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="top" @down="downCallback" @up="upCallback">
				<!-- 数据列表 -->
				<view class="al-list" style="margin-bottom: 160rpx;">
					<view class="message_text bg-white cu-item   solid-bottom " style="width: 100vw;"
						v-for="(item,index) in msgList" :key="index"
						:class="modalName=='move-box-'+ index?'move-cur':''" :data-target="'move-box-' + index">
						<view class="items flex-between">
							<view class="item-center">
								<checkbox class="round" :data-currentindex="index" :checked="item.checked" color="white" @click="deliverCheck(item)" />
							</view>
							<view class="item-Left">
								<view class="centerOne">{{item.name||'无'}}</view>
								<view><text
										style="color:#999;display: inline-block;margin-right: 20rpx;">物料编码:</text>{{item.code||'无'}}
								</view>
								<view><text
										style="color:#999;display: inline-block;margin-right: 20rpx;">规格:</text>{{item.specs||'无'}}
								</view>
								<view ><text style="color:#999;display: inline-block;margin-right: 20rpx;">型号:</text>
									{{item.model||'无'}}</view>
								<view ><text style="color:#999;display: inline-block;margin-right: 20rpx;">单位:</text>
									{{item.unit||'无'}}</view>
								<view class="flex-between">
									<view><text style="color:#999;display: inline-block;margin-right: 20rpx;">库存:</text>{{item.number||'无'}}</view>
									<view class="float-right">
<!-- 										<uni-number-box :min="1" :max="item.number" v-model="item.useNumber" background="#4884fc" color="#fff"></uni-number-box>
 -->				<input placeholder="请填写领用数量" class="inputs" v-model="item.useNumber" name="input" type="text" ></input>

 </view>
								</view>
							</view>
									
						</view>

					</view>
				</view>
			</mescroll-uni>
		</view>
		<view class="btnsfixed">
			<button class=" bg-blues lgs  shadow" @tap="submits"><text space="emsp">确定</text>
			</button>
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
	}, {
		title: '全部',
		value: 2
	}, ];
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {
		USER_INFO
	} from "@/common/util/constants"
	import uniSearchBar from '@/components/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
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
				read: "all",
				announcement1: [],
				msg1Count: "",
				msg1Title: "",
				announcement2: [],
				listTouchStart: 0,
				modalName: null,
				listTouchDirection: null,
				name: '',
				typeof: '',
				deliverys:[],

			}
		},
		onShow() {

		},
		onLoad(options) {
			console.log("this.$Route.query", this.$Route.query);
			let query = this.$Route.query

			this.deliverys = query.checked
			if (this.mescroll) {
				this.mescroll.resetUpScroll()
			}
		},
		computed: {
			top() {
				console.log(this.CustomBar)
				return this.CustomBar * 2 + 95
			},
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			},
		},
		methods: {
			deliverCheck(item) {
				this.deliverys = [];
				item.checked = !item.checked;
				this.msgList.forEach(val => {
					if (val.checked) {
						this.deliverys.push(val);
					}
				});
			},
			search(res) {
				this.upOption.page.num = 1
				uni.showLoading({
					title: '查询中..',
					mask: true
				});
				this.deliverys = []
				this.msgList.forEach((item,index)=>{
					if(item.checked){
						this.deliverys.push(item)
					}
				})
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				//联网加载数据
				console.log("tabindex", this.TabCur)
				let keyword = this.TabCur

				this.$http.get('/ep/epStock/listNcc', {
					params: {
						pageNo: page.num,
						pageSize: page.size,
						value:this.name
					},
				}).then(res => {
					if (res.data.success) {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						res.data.result.records.forEach((item, index) => {
							item.checked = false
							item.useNumber = 1
						})
						this.announcement1 = res.data.result.records
						this.mescroll.endSuccess(this.announcement1.length);
						//console.log("url", res)
						//设置列表数据
						console.log(res.data.success)
						console.log("res", res.data)
						uni.hideLoading()
						this.msg1Count = res.data.result.total
						this.msg1Title = "通知(" + res.data.result.total + ")";
						this.deliverys.forEach((items,indexs)=>{
							this.announcement1.forEach((item,index)=>{
								if(item.id == items.id){
									this.announcement1.splice(index,1)
								}
							})
						})
						for (let annItem of this.announcement1) {
							this.msgList.push(annItem)
						}
						if (page.num == 1) {
							this.msgList = []
							this.msgList = this.msgList.concat(this.deliverys);
							var arr = []
							
							console.log(this.announcement1)
							this.msgList = this.msgList.concat(this.announcement1); //追加新数据
						}
					}else{
						uni.hideLoading()
						this.$tip.toast(res.data.message);
						return
					}
					

				}).catch(() => {
					
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},

			submits() {
				if(this.deliverys.length <= 0 ){
					this.$tip.toast('请选择物料');
					return;
				}else{
					var ref = /^([\-\+]?[0-9]+[\d]*(.[0-9]{1,10})?)$/
					var flag = true
					this.deliverys.forEach((item,index)=>{
						if(!ref.test(item.useNumber)){
							flag = false
							uni.$u.toast('请输入正确的数量!')
							return
						}
					})
					if(flag){
						let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
						let nowPage = pages[pages.length - 1]; //当前页页面实例
						let prevPage = pages[pages.length - 2]; //上一页页面实例
						console.log(prevPage, nowPage)
						prevPage.$vm.sparePartSure({
							deliverys: this.deliverys,
						}); // 給上一頁綁定方法otherFun,傳參object
						
						uni.navigateBack()
					}
					
				}

			},

		}
	}
</script>

<style lang="scss" >
	checkbox .wx-checkbox-input {
		border-radius: 50% !important;
	}
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		color: #fff !important;
		background: #4884fc !important;
		border: 1rpx solid #ffffff !important;
	}
	.btnsfixed {
		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 180rpx;
		background-color: white;
		padding-top: 50rpx;
		z-index: 1;

	}
	.inputs{
		border-width: 0.5px !important;
		border-color: #dadbde !important;
		border-style: solid;
		width: 250rpx;
		height: 55rpx;
		line-height: 55rpx;
		padding-left: 9px;
		
		
	}
	.bg-blues {
		// background: linear-gradient(to right, #36C7DE, #79EDB0, #36C7DE);
		background-color: #4884fc;
		color: white
	}
	.float-right{
		float:right;
	}
	.e-btn {
		margin-bottom: 1rem;
	}

	.titlePad {
		margin-top: 0.6rem;
	}

	// .cu-list>.move-cur {
	// 	transform: translateX(-150rpx);

	// }

	.nav .cu-item.cur {
		position: flex;
		z-index: 9;
		border-bottom: 4upx solid;
	}

	.search-box {
		display: flex;
		height: 100rpx;

		.margin-bottom-20 {
			margin-bottom: 20rpx;
		}

		.tabs-wrap {
			width: 100%;
		}


	}



	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: red;
		display: inline-block;
		margin-right: 10px;
	}

	.dot2 {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: green;
		display: inline-block;
		margin-right: 10px;
	}

	.content {
		width: 95%;
		margin: 0 auto;
		padding-left: 10px;
		font-size: 28rpx;
	}

	.renderItem {
		border-bottom: 1px solid #ccc;
	}

	.goods {
		margin-top: 10px;
		color: #1890ff;
	}

	.address1 {
		margin-bottom: 10px;
		line-height: 45rpx;
	}

	.drivers text:nth-child(2) {
		margin: 0 20px;
	}

	.drivers {
		width: 95%;
		margin: 0 auto;
		line-height: 80rpx;
		font-size: 28rpx;
	}

	.remark {
		line-height: 30px;

		text:nth-child(1) {
			margin-right: 20px;
		}
	}

	.total {
		line-height: 20px;
		font-size: 18px;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.items {
		min-height: 110rpx;
		padding: 15rpx 0;
		width: 95%;
		margin: 0 auto;
		font-size: 30rpx;

		.item-Left {
			width: 86%;


			.centerOne {
				line-height: 55rpx;
				font-size: 36rpx;
				font-weight: bold;
				display: flex;
				align-items: center;

				text {
					font-weight: 400;
					color: #666666;
					font-size: 28rpx;
					display: inline-block;
					margin-left: 10rpx;
				}
			}

		}

		.item-center {
			width: 10%;
			margin-right: 1%;
			.centerTwo {
				display: flex;
				align-items: center;
				line-height: 50rpx;
				height: 50rpx;
				width: 100%;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //用省略号显示
				white-space: nowrap; //不换行


				image {
					width: 34rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
			}

			.centerThree {
				color: rgba(102, 102, 102, 1);
				font-size: 26rpx;
			}
		}

		.item-Right {
			width: 18%;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FF8338;
			text-align: right;

			.rightOne {
				position: relative;
				top: -48rpx;

			}

		}

		.red {
			color: #d9001b;
			font-size: 30rpx;
		}
	}

	.source-center-item {
		flex: 1;
		// display: flex;
		// justify-content: space-between;
		// align-items: center;


		.name {
			line-height: 45rpx;
			font-size: 24rpx;
		}

		.symbol {
			line-height: 45rpx;
			font-size: 24rpx;

			.red {
				color: #d9001b;
				font-size: 30rpx;
			}

			.dw {
				color: #aeaeae;
			}
		}
	}

	.item-Detail {
		width: 90%;
		margin: 0 auto;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

		.itemDeLeft {
			width: 10%;
		}

		.itemDeRight {
			width: 90%;

			.item-con {
				height: 50rpx;
				line-height: 50rpx;
				display: flex;

				.con-left {
					color: #999;
					margin-right: 10rpx;
				}

				.con-right {
					color: black;
				}
			}
		}

	}
</style>
