<template>
	<view class="bg-gray">
		<cu-custom :bgColor="NavBarColor" :isBack="true" backFlag="navigate">
			<block slot="backText">返回</block>
			<block slot="content">{{titlea}}</block>
		</cu-custom>
			<form>
				<view class="cu-form-group margin-top" v-if="titlea == '领用申请详情' ">
					<view class="title">领用单据号</view>
					<input placeholder="请输入领用单据号" v-model="item.useNo" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group align-center">
					<view class="title">领用人</view>
					<input placeholder="请输入领用人" v-model="item.createName" name="input" disabled="disabled"></input>
				</view>
				<view class="cu-form-group align-center" v-if="titlea == '领用申请详情' ">
					<view class="title">领用部门</view>
					<input placeholder="请输入领用部门" v-model="item.deptName" name="input"></input>
				</view>
				<view class="cu-form-group " @click="showTree()">
					<view class="title">使用车间/产线</view>
					<input placeholder="请选择车间/产线" v-model="item.usrProject" name="input" disabled=""></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">备注</view>
					<input placeholder="请填写备注" v-model="item.usrSquads" name="input" ></input>
				</view>
				<view class="cu-form-group align-center" v-if="titlea=='领用申请详情'">
					<view class="title">创建日期</view>
					<input placeholder="请输入创建日期" v-model="item.createTime" name="input" type="number"></input>
				</view>
				<view class="cu-form-group margin-top" v-if="titlea=='领用申请'" @click.stop="changeSparePart()">
					<view class="title">选择备件</view>
					<button class="bg-blue lgs  shadow" style="width: 50%; ">选择</button>
				</view>
				<block v-if="item.epUserApplicationSubList.length > 0" >
					<view v-for="(i,index) in item.epUserApplicationSubList" :key="index" :class="item.epUserApplicationSubList.length == index+1 ? 'container' : ''">
						<view class="cu-form-group margin-top">
							<view class="title">物料名称</view>
							<input placeholder="无" v-model="i.goodsName" name="input" disabled=""></input>
							<u-icon name="trash"  size="28" @click="deletes(index)"></u-icon>
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
							<view class="title">单位</view>
							<input placeholder="无" v-model="i.goodsUnit" name="input" disabled=""></input>
						</view>
						<view class="cu-form-group align-center" >
							<view class="title">领用数量</view>
							<input placeholder="请填写领用数量" v-model="i.useNumber" name="input" type="text" :disabled="titlea == '领用申请详情' ? true :false"></input>
						</view>
					</view>
				</block>
			</form>

		<view class="btnsfixed" v-if="titlea=='领用申请'">
			<button class=" bg-blues lgs  shadow" :class="[shape=='round'?'round':'']" @tap="submits"><text
					space="emsp">确定</text>
			</button>
		</view>
		<peng-tree ref="pengTree" :range="range" idKey="id" nameKey="name" allKey="value" :multiple="true"
			:cascade="false" :selectParent="false" :foldAll="false" confirmColor="#007aff" cancelColor="#757575"
			title="请选择车间/产线" titleColor="#757575" @cancel="treeCancel" @confirm="treeConfirm">
		</peng-tree>
	</view>
</template>

<script>
	import pengTree from '@/components/peng-tree/components/peng-tree/peng-tree.vue'
	import {
		USER_INFO
	} from "@/common/util/constants"
	export default {
		components: {
			pengTree
		},
		data() {
			return {
				range:[],
				NavBarColor: this.NavBarColor,
				item: {
					epUserApplicationSubList: [],
					createName:'',
				},
				titlea: '领用申请',
				urls:'/ep/epUserApplication/queryEpUserApplicationSubByMainId',
				checked:[],
			}
		},

		onLoad: function(option) {
			console.log("this.$Route.query", this.$Route.query);
			let query = this.$Route.query
			if (query.id != undefined) {
				this.item = query;
				this.titlea = '领用申请详情'
				this.queryEpUserApplicationSubByMainId(this.item.id)
			} else {
				this.titlea = '领用申请'
				this.item.createName = uni.getStorageSync(USER_INFO).realname
				this.getList()
			}


		},

		methods: {
			getList() {
				this.$http.get('/ep/epEquSystem/queryPageListChildrens', {}).then(res => {
					console.log(res)
					var res = res.data;
					if (res.code == 200) {
						for (let i = 0; i < res.result.length; i++) {
							let temp = res.result[i];
							temp.name = res.result[i].name;
							temp.value = res.result[i].id;
							if (temp.children.length > 0) {
								temp.children.forEach((item, index) => {
									item.name = item.name;
									item.value = item.id;
								});
							}
							this.range.push(temp)
						}
						console.log(this.range)
						
					} else {
						this.$tip.alert(res.message);
					}
			
				}).catch(() => {
					//联网失败, 结束加载
			
				})
			},
			showTree() {
				//打开选择器
				this.$refs.pengTree._show();
				//关闭选择器
				//this.$refs.pengTree._hide();
			},
			treeCancel(e) {
				console.log("你点击了取消")
				console.log(e)
			},
			treeConfirm(e) {
				console.log(e)
				let name=[]
				e.forEach(item=>{
					name.push(`${item.source.pname}${item.name}`)
				})
				console.log(name.toString())
				this.$set(this.item, 'usrProject',name.toString())
			},
			queryEpUserApplicationSubByMainId(id){
				this.$http.get(this.urls, {
					params: {
						id: id
					}
				}).then(res => {
					if(res.data.success){

						this.$set(this.item, 'epUserApplicationSubList', res.data.result.records)
					}
				})
			},
			//选择备件
			changeSparePart() {
				// this.$Router.push({
				// 	name: 'changeSparePart'
				// })
				this.$Router.push({name:'changeSparePart', params:{checked:this.checked}})
			},
			sparePartSure(options) {
				console.log(options)
				this.checked = options.deliverys
				let arr = []
				options.deliverys.forEach((item,index)=>{
					arr.push({
						"id":item.id,
						"goodsCode":item.code,
						"specs":item.specs,
						"model":item.model,
						"useNumber":item.useNumber,
						"goodsName":item.name,
						"goodsUnit":item.unit
					})
				})
				this.item.epUserApplicationSubList = arr
			},
			deletes(index){
				this.item.epUserApplicationSubList.splice(index,1)
				this.checked.splice(index,1)
			},
			submits() {
				if (this.item.usrProject == '') {
					this.$tip.toast('请选择车间/产线!');
					return;
				}
				if (this.item.epUserApplicationSubList.length == 0) {
					this.$tip.toast('请选择备件!');
					return;
				}
				var ref = /^([\-\+]?[0-9]+[\d]*(.[0-9]{1,10})?)$/
				var flag = true
				
				if(this.item.epUserApplicationSubList.length > 0){
					this.item.epUserApplicationSubList.forEach((item,index)=>{
						if(!ref.test(item.useNumber)){
							flag = false
							uni.$u.toast('请输入正确的数量!')
							return
						}
					})
				}
				if(flag){
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
		// background: linear-gradient(to right, #36C7DE, #79EDB0, #36C7DE);
		background-color: #4884fc;
		color: white
	}
</style>
