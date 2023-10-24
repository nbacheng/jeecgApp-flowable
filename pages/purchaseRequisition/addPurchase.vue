<template>
	<view class="bg-gray">
		<cu-custom :bgColor="NavBarColor" :isBack="true" backFlag="navigate">
			<block slot="backText">返回</block>
			<block slot="content">{{titlea}}</block>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top" v-if="titlea == '采购单详情' ">
				<view class="title">申请单号</view>
				<input placeholder="请输入申请单号" v-model="item.purchaseNo" name="input" disabled=""></input>
			</view>
			<view class="cu-form-group align-center">
				<view class="title">提报人</view>
				<input placeholder="请输入提报人" v-model="item.createBy" name="input" disabled=""></input>
			</view>
			<view class="cu-form-group align-center" v-if="titlea == '采购单详情' ">
				<view class="title">申请部门</view>
				<input placeholder="请输入申请部门" v-model="item.deptName" name="input"></input>
			</view>

			<view class="cu-form-group align-center" v-if="titlea=='采购单详情'">
				<view class="title">提报时间</view>
				<input placeholder="请输入提报时间" v-model="item.createTime" name="input" type="number"></input>
			</view>
			<view class="cu-form-group align-center">
				<view class="title">备注</view>
				<input placeholder="请输入备注" v-model="item.remark" name="input" type="text"></input>
			</view>
			<view class="cu-form-group margin-top" v-if="titlea=='新增采购单' || titlea=='修改采购单'"
				@click.stop="changeSparePart()">
				<view class="title">选择物料</view>
				<button class="bg-blue lgs  shadow" style="width: 50%; ">选择</button>
			</view>
			<block v-if="item.epPurchaseSubList.length > 0">
				<view v-for="(i,index) in item.epPurchaseSubList" :key="index"
					:class="item.epPurchaseSubList.length == index+1 ? 'container' : ''">
					<view class="cu-form-group margin-top">
						<view class="title">物料名称</view>
						<input placeholder="无" v-model="i.goodsName" name="input" disabled=""></input>
						<u-icon v-if="titlea=='新增采购单' || titlea=='修改采购单'" name="trash" size="28"
							@click="deletes(index)"></u-icon>
					</view>
					<view class="cu-form-group align-center">
						<view class="title">物料编码</view>
						<input placeholder="无" v-model="i.goodsCode" name="input" disabled=""></input>
					</view>
					<view class="cu-form-group align-center">
						<view class="title">规格</view>
						<input placeholder="无" v-model="i.specs" name="input" disabled=""></input>
					</view>
					<view class="cu-form-group align-center">
						<view class="title">型号</view>
						<input placeholder="无" v-model="i.model" name="input" disabled=""></input>
					</view>
					<view class="cu-form-group align-center">
						<view class="title">数量</view>
						<input placeholder="请填写数量" v-model="i.number" name="input" type="text"
							:disabled="titlea == '采购单详情' ? true :false"></input>
					</view>
					<view class="cu-form-group align-center">
						<view class="title">单价</view>
						<input placeholder="请填写单价" v-model="i.unitPrice" name="input" type="text"
							:disabled="titlea == '采购单详情' ? true :false"></input>
					</view>
				</view>
			</block>
		</form>

		<view class="btnsfixed" v-if="titlea=='新增采购单' || titlea=='修改采购单'">
			<button class=" bg-blues lgs  shadow" :class="[shape=='round'?'round':'']" @tap="submits"><text
					space="emsp">确定</text>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		USER_INFO
	} from "@/common/util/constants"
	export default {
		data() {
			return {
				NavBarColor: this.NavBarColor,
				item: {
					epPurchaseSubList: [],
					createBy: '',
					remark: '',
				},
				titlea: '新增采购单',
				urls: '/ep/epPurchaseReq/queryEpPurchaseSubByMainId',
				checked: [],
			}
		},

		onLoad: function(option) {
			console.log("this.$Route.query", this.$Route.query);
			let query = this.$Route.query
			if (query.id != undefined) {
				this.item = query;
				if (this.item.define01 == '0') {
					this.titlea = '修改采购单'
				} else {
					this.titlea = '采购单详情'
				}

				this.queryEpPurchaseSubByMainId(this.item.id)
			} else {
				this.titlea = '新增采购单'
				this.item.createBy = uni.getStorageSync(USER_INFO).realname
			}
		},
		methods: {
			queryEpPurchaseSubByMainId(id) {
				this.$http.get(this.urls, {
					params: {
						id: id
					}
				}).then(res => {
					if (res.data.success) {
						this.$set(this.item, 'epPurchaseSubList', res.data.result.records)
						this.checked = []
						res.data.result.records.forEach((item, index) => {
							this.checked.push({
								"checked": true,
								"id": item.id,
								"spareCode": item.goodsCode,
								"spec": item.specs,
								"model": item.model,
								"categoryName": item.categoryName,
								"categoryId": item.categoryId,
								"spareName": item.goodsName,
								"unitPrice": item.unitPrice,
								"number": item.number,
								"unitName": item.unit,
							})
						})
					}
				})
			},
			//选择物料
			changeSparePart() {
				this.$Router.push({
					name: 'changeMaterial',
					params: {
						checked: this.checked
					}
				})
			},
			sparePartSure(options) {
				console.log(options)
				this.checked = options.deliverys
				let arr = []
				options.deliverys.forEach((item, index) => {
					arr.push({
						"id": item.id,
						"goodsCode": item.spareCode,
						"specs": item.spec,
						"model": item.model,
						"categoryName": item.categoryName,
						"categoryId": item.categoryId,
						"goodsName": item.spareName,
						"unitPrice": item.unitPrice,
						"number": item.number,
						"unit": item.unitName,

					})
				})
				this.item.epPurchaseSubList = arr
			},
			deletes(index) {
				this.item.epPurchaseSubList.splice(index, 1)
				this.checked.splice(index, 1)
			},
			submits() {

				if (this.item.epPurchaseSubList.length == 0) {
					this.$tip.toast('请选择物料!');
					return;
				}
				var ref = /^([\-\+]?[0-9]+[\d]*(.[0-9]{1,10})?)$/
				var flag = true

				if (this.item.epPurchaseSubList.length > 0) {
					this.item.epPurchaseSubList.forEach((item, index) => {
						if (!ref.test(item.unitPrice)) {
							flag = false
							uni.$u.toast('请输入正确的单价!')
							return
						}
						if (!ref.test(item.number)) {
							flag = false
							uni.$u.toast('请输入正确的数量!')
							return
						}
					})
				}
				if (flag) {
					uni.showLoading({
						title: '操作中..',
						mask: true
					});
					var parm = JSON.parse(JSON.stringify(this.item))
					if (this.titlea == '修改采购单') {
						this.$http.put('/ep/epPurchaseReq/edit', parm).then(res => {
							console.log(res)
							uni.hideLoading()
							if (res.data.code == 200) {
								this.$tip.success('操作成功');
								setTimeout(() => {
									uni.navigateBack({})
								}, 1000)
							} else {
								this.$tip.toast(res.data.message);
								return
							}

						})
					} else if (this.titlea == '新增采购单') {
						this.$http.post('/ep/epPurchaseReq/add', parm).then(res => {
							console.log(res)
							uni.hideLoading()
							if (res.data.code == 200) {
								this.$tip.success('操作成功');
								setTimeout(() => {
									uni.navigateBack({})
								}, 1000)
							} else {
								this.$tip.toast(res.data.message);
								return
							}

						})
					}
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 0 160rpx 0;

	}

	.btnsfixed {
		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 130rpx;
		background-color: #f0f0f0;
		z-index: 100;

	}


	.bg-blues {
		// background: linear-gradient(to right, #36C7DE, #79EDB0, #36C7DE);
		background-color: #4884fc;
		color: white
	}
</style>
