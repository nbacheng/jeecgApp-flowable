<template>

	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true" backRouterName="index">
			<block slot="backText">返回</block>
			<block slot="content">通讯录</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" v-model="keyword" placeholder="请输入员工姓名" confirm-type="search"
					@confirm="searchUserByKey"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-blue shadow-blur round" @tap="searchUserByKey">搜索</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes margin-top-xl" :scroll-into-view="'indexes-'" :scroll-with-animation="true"
			:enable-back-to-top="true">
			<view class="cu-list menu-avatar no-padding">
				<view class="cu-item" v-for="(items,sub) in userList" :key="sub" v-if="items.szm==item.name"
					@tap="toAddressDetail(items)">
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
		</scroll-view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
	</view>
</template>

<script>
	import vPinyin from '@/common/util/vue-py.js';
	import {
		getFileAccessHttpUrl
	} from '@/api/api.js';
	export default {
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
				queryUserByKeyWord: '/ep/epCompanyStaff/list'
			};
		},
		onLoad() {
			let list = [{}];
			for (let i = 0; i < 26; i++) {
				list[i] = {};
				list[i].name = String.fromCharCode(65 + i);
			}
			this.list = list;
			this.listCur = list[0];
			this.loadInfo()
		},
		
		methods: {
			backTap() {
				this.$Router.replace({
					name: 'index'
				})
			},
			toAddressDetail(item) {
				let parmas = {
					...item
				}
				parmas.departName = parmas.orgCode
				this.$Router.push({
					name: 'addressDetail',
					params: parmas
				})
			},
			searchUserByKey() {
				this.loadInfo()
			},
			loadInfo() {
				this.$http.get(this.queryUserByKeyWord, {
					params: {
						"staffName": this.keyword
					}
				}).then(res => {
					if (res.data.success) {
						console.log("res", res)
						this.userList = res.data.result.records;

					}
				}).catch(err => {
					console.log(err);
				});

			},
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].name;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].name
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 100upx;
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
	.cu-avatar{
		img{
			height: 100%;
			width: 100%;
		}
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
