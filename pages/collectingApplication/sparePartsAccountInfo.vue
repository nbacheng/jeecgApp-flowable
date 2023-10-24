<template>
	<view class="bg-gray">
		<cu-custom :bgColor="NavBarColor" :isBack="true" backFlag="navigate">
			<block slot="backText">返回</block>
			<block slot="content">{{titlea}}</block>
		</cu-custom>
			<form>
				<view class="cu-form-group margin-top" >
					<view class="title">物料名称</view>
					<input placeholder="无" v-model="item.name" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">物料编码</view>
					<input placeholder="无" v-model="item.code" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center" >
					<view class="title">数量</view>
					<input placeholder="无" v-model="item.number" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">单价(元)</view>
					<input placeholder="无" v-model="item.unitPrice" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">货值</view>
					<input placeholder="无" v-model="item.price" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">规格</view>
					<input placeholder="无" v-model="item.specs" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">型号</view>
					<input placeholder="无" v-model="item.model" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">材质</view>
					<input placeholder="无" v-model="item.texture" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">品牌</view>
					<input placeholder="无" v-model="item.brand" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">计量单位</view>
					<input placeholder="无" v-model="item.unit" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">物料分类名称</view>
					<input placeholder="无" v-model="item.categoryName" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">备注</view>
					<input placeholder="无" v-model="item.remarks" name="input" disabled=""></input>
				</view>
				
				
			</form>
		
		
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
					epUserApplicationSubList: [],
					createName:'',
				},
				titlea: '领用申请',
				urls:'/ep/epUserApplication/queryEpUserApplicationSubByMainId'
			}
		},

		onLoad: function(option) {
			console.log("this.$Route.query", this.$Route.query);
			let query = this.$Route.query
			if (query.id != undefined) {
				this.item = query;
				this.titlea = '备件台账详情'
				
			} else {
				this.titlea = '备件台账详情'
				this.item.createName = uni.getStorageSync(USER_INFO).realname
			}


		},

		methods: {
			
			//选择备件
			changeSparePart() {
				this.$Router.push({
					name: 'changeSparePart'
				})
			},
			sparePartSure(options) {
				console.log(options)
				let arr = []
				options.deliverys.forEach((item,index)=>{
					arr.push({
						"id":item.id,
						"goodsCode":item.code,
						"specs":item.specs,
						"model":item.model,
						"useNumber":1,
						"goodsName":item.goodsName
						
					})
				})
				this.item.epUserApplicationSubList = arr
			},
			submits() {
				if (this.item.usrProject == '') {
					this.$tip.toast('请填写使用工程/项目!');
					return;
				}
				if (this.item.epUserApplicationSubList.length == 0) {
					this.$tip.toast('请选择备件!');
					return;
				}
				uni.showLoading({
					title: '操作中..',
					mask: true
				});
				var parm = JSON.parse(JSON.stringify(this.item))
				this.$http.post('/ep/epUserApplication/add', parm).then(res => {
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
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 0 160rpx 0 ;
		
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
		background: linear-gradient(to right, #36C7DE, #79EDB0, #36C7DE);
		color: white
	}
</style>
