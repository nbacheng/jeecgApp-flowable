<template>

	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true" backRouterName="index">
			<block slot="backText">返回</block>
			<block slot="content">选择人</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" v-model="keyword" placeholder="输入搜索的关键词" confirm-type="search"
					@confirm="searchUserByKey"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-blue shadow-blur round" @tap="searchUserByKey">搜索</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes margin-top-xl" :scroll-into-view="'indexes-'" :scroll-with-animation="true"
			:enable-back-to-top="true">
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="top" @down="downCallback" @up="upCallback">

				<view class="cu-list menu-avatar no-padding">
					<view :class="current==sub?'active':''" class="cu-item" v-for="(items,sub) in userList" :key="sub"
						v-if="items.szm==item.name" @tap="toAddressDetail(sub,items)">
						<view class="cu-avatar round lg">
							<img :src="items.avatar" alt="">
						</view>
						<view class="content">
							<view class="text-grey">{{items.staffName}}</view>
							<view class="text-gray text-sm">
								{{items.jobNo}}
							</view>
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
	import vPinyin from '@/common/util/vue-py.js';
	import {
		getFileAccessHttpUrl
	} from '@/api/api.js';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				hidden: true,
				listCurID: '',
				list: [],
				userList: [],
				listCur: '',
				keyword: '',
				queryUserByKeyWord: '/ep/epCompanyStaff/list',
				parmas: {
					id: ""
				},
				addUrl: "/ep/epFaultInfo/add",
				current: -1,
				people: "",
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

			};
		},
		onLoad(options) {
			this.type = this.$Route.query
			//this.loadInfo()
		},
		computed: {

			top() {
				return uni.getWindowInfo().statusBarHeight + 260

			},
		},
		methods: {
			backTap() {
				this.$Router.replace({
					name: 'index'
				})
			},
			add() {
				if (!this.people) {
					this.$tip.alert("请选择对应人");
					return
				}
				let pages = getCurrentPages();

				// 当前页页面实例
				let nowPage = pages[pages.length - 1];

				// 上一页页面实例
				let prevPage = pages[pages.length - 2];

				// 修改上一页data里面的times参数值为100
				if (this.type == 1) {
					prevPage.$vm.parmas.handleBy = this.people.staffName;
					prevPage.$vm.parmas.handleId = this.people.id;
				} else if (this.type == 2) {
					prevPage.$vm.parmas.collectName = this.people.staffName;
					prevPage.$vm.parmas.collectId = this.people.id;
				}

				//uni.navigateTo跳转的返回，默认1为返回上一级
				uni.navigateBack({
					delta: 1
				});
			},
			toAddressDetail(index, item) {
				this.current = index
				this.people = item


			},
			searchUserByKey() {
				console.log(this.keyword)
				this.userList = []
				this.upOption.page.num = 0
				this.upCallback(this.upOption.page)

			},
			upCallback(page) {
				//联网加载数据
				let params = {
					pageNo: page.num,
					pageSize: page.size,
					"staffName": this.keyword
				}
				console.log(params)
				this.$http.get(this.queryUserByKeyWord, {
					params: params,
				}).then(res => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;

					this.announcement1 = res.data.result.records
					this.mescroll.endSuccess(this.announcement1.length);
					console.log("url", res)
					//设置列表数据
					if (res.data.success) {
						console.log("res666", res.data)
						this.msg1Count = res.data.result.total
						this.msg1Title = "通知(" + res.data.result.total + ")";
						for (let annItem of this.announcement1) {
							this.userList.push(annItem)
						}
					}
					if (page.num == 1) {
						this.userList = []; //如果是第一页需手动制空列表
						this.userList = this.userList.concat(this.announcement1); //追加新数据
					}

				}).catch(() => {
					//联网失败, 结束加载
					console.log(res.data.message)
					this.mescroll.endErr();
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
		z-index: 999;
	}

	.cu-avatar {
		img {
			height: 100%;
			width: 100%;
		}
	}

	page {
		padding-top: 100upx;
	}

	.active {
		background-color: #3874F6 !important;
		border-radius: 90upx !important;

		.content {
			view {
				color: white !important;
			}

		}
	}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
