<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true" backRouterName="index">
				<block slot="backText">返回</block>
				<block slot="content">设备</block>
			</cu-custom>
			<view class="wrap">
				<view class="search">
					<u-search v-model="keyword" @search="myLists()" shape="square" border-color="#DDDDDD"
						:show-action="false" bg-color="#FEFEFE" placeholder="请输入设备名称" height="70"></u-search>
				</view>
				<view class="chongz">
					<u-button type="success" size="medium" shape="square" @click="changes()">重置</u-button>
				</view>
			</view>
			
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="top" @down="downCallback" @up="upCallback">

				<view class="equipmentList">

					<view :class="current==index?'active':''" class="equipmentList-list"
						:style="[{animationDelay: (index + 1)*0.05 + 's'}]" v-for="(item,index) in equipmentList"
						:key="index" @tap="toAddressDetail(index,item)">
						<view v-if="item.type=='2'" class="left">
							<text>特种设备</text>
						</view>
						<view v-else class="lefts">
							<text>非特种设备</text>
						</view>
						<view class="center">
							<view class="top-1">
								<text>{{item.name}}</text>
								<text>{{item.level_dictText}}</text>
							</view>
							<view class="top-2">
								编号：{{item.code||'-'}}
							</view>
							<view class="top-3">
								型号：{{item.model||'-'}}
							</view>
							<view class="top-4">
								供应商：{{item.supplier}}
							</view>
						</view>
						<view class="right">
							<!-- <u-icon name="arrow-right" size="20"></u-icon> -->
						</view>
					</view>

				</view>
			</mescroll-uni>
		</scroll-view>
		<view @click="add()" class="btn">
			选择
		</view>
	</view>

</template>

<script>
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			HMfilterDropdown
		},
		data() {
			return {
				urls: "/ep/epEquipInfo/rootList",
				modalName: "",
				menuTop: 250,
				defaultSelected: [],
				filterData: [{
					"name": '设备分类',
					"type": 'hierarchy',
					"submenu": [],
				}],
				listUrl: 'ep/epEquSystem/queryPageListChildren',
				equipmentList: [],
				keyword: "",
				systemId: "",
				current: -1,
				equ: '',
				id:""
			}
		},
		onLoad() {
			this.id = this.$Route.query
		},
		computed: {
			top() {
				return uni.getWindowInfo().statusBarHeight + 220

			},
		},
		methods: {
			add() {
				if (!this.equ) {
					this.$tip.alert("请选择设备");
					return
				}
				let pages = getCurrentPages();
				
				// 当前页页面实例
				let nowPage = pages[ pages.length - 1]; 
				 
				// 上一页页面实例
				let prevPage = pages[ pages.length - 2 ];  
				
				prevPage.$vm.parmas.equName = this.equ.name;
				prevPage.$vm.parmas.equId = this.equ.id;   
				
				//uni.navigateTo跳转的返回，默认1为返回上一级
				uni.navigateBack({  
				    delta: 1
				});
			},
			toAddressDetail(index, item) {
				this.current = index
				this.equ = item
			},
			changes() {
				this.equipmentList = [];
				this.keyword = ''
				this.systemId = ''
				this.upCallback({
					"num": "1",
					"pageSize": "10"
				})
			},
			myLists() {
				this.systemId = ''
				this.equipmentList = [];
				this.upCallback({
					"num": "1",
					"pageSize": "10"
				})
			},
			upCallback(page) {
				//联网加载数据
				let params = {
					pageNo: page.num,
					pageSize: page.size,
					column: 'createTime',
					order: 'asc',
					name: this.keyword,
					systemId: this.id
				}

				this.$http.get(this.urls, {
					params: params,
				}).then(res => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					console.log(res)
					this.announcement1 = res.data.result.records
					this.mescroll.endSuccess(this.announcement1.length);
					console.log("url", res)
					//设置列表数据
					if (res.data.success) {
						console.log("res666", res.data)
						this.msg1Count = res.data.result.total
						this.msg1Title = "通知(" + res.data.result.total + ")";
						for (let annItem of this.announcement1) {
							this.equipmentList.push(annItem)
						}
					}
					if (page.num == 1) {
						this.equipmentList = []; //如果是第一页需手动制空列表
						this.equipmentList = this.equipmentList.concat(this.announcement1); //追加新数据
					}

				}).catch(() => {
					//联网失败, 结束加载

					this.mescroll.endErr();
				})
			},
			
			confirms(e) {
				console.log(e)
				this.keyword = ''
				this.equipmentList = [];
				this.systemId = e.value[2]
				this.upCallback({
					"num": "1",
					"pageSize": "10"
				})
			},
		}
	}
</script>

<style lang="scss">
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
		text-align: center;
		position: fixed;
		bottom: 20upx;
		left: 5%;
		z-index: 9999;
	}

	.all {}

	.active {
		background-color: #3874F6 !important;

		view {
			color: white !important;
		}
	}

	.search {
		padding: 20rpx 10rpx 0rpx 30rpx;
		width: 78%;

		input {
			height: 60upx !important;
			line-height: 60rpx !important;

		}
	}

	.chongz {

		padding-top: 20rpx;
		width: 21%;

		button {
			width: 125upx !important;
			height: 60upx !important;
			font-size: 27upx;
			font-family: PingFang SC;
			font-weight: 400;
			background: #3E78F6 !important;
			border-color: #3E78F6 !important;
			color: #FFFFFF;
			border-radius: 30upx !important;
		}
	}

	.wrap {
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
	}

	.content {

		padding-top: 60rpx;
	}

	.u-size-medium {
		padding: 0 40rpx !important;
	}

	.equipmentList {
		width: 100%;
		padding: 10upx;

		.equipmentList-list {
			width: 98%;
			height: 202upx;
			background: #FFFFFF;
			border-radius: 20upx;
			display: flex;
			justify-content: space-around;
			margin: 10upx auto;

			.lefts {

				width: 15%;
				background: #A8C3FF;

				text-align: center;
				font-size: 27upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				border-top-left-radius: 10upx;
				border-bottom-left-radius: 10upx;

				text {
					display: inline-block;
					height: 100%;
					writing-mode: vertical-lr;
				}


			}

			.left {

				width: 15%;
				background: #3E78F6;

				text-align: center;
				font-size: 27upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				border-top-left-radius: 10upx;
				border-bottom-left-radius: 10upx;

				text {
					display: inline-block;
					height: 100%;
					writing-mode: vertical-lr;
				}


			}

			.center {
				width: 75%;
				padding-top: 20upx;
				padding: 30upx 0upx 0 30upx;

				.top-1 {
					height: 40upx;
					line-height: 40upx;
					font-size: 27upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #333333;

					text:nth-child(1) {
						font-weight: bolder;
					}

					text:nth-child(2) {
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
					color: #666666;
				}

				.top-4 {
					height: 40upx;
					line-height: 40upx;
					font-size: 25upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #666666;
				}
			}

			.right {
				width: 10%;
				padding-top: 90rpx;
				float: right;

				view {
					text-align: center;
					line-height: 202upx;
				}
			}
		}
	}
</style>
