<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true" backFlag="navigate">
			<block slot="backText">返回</block>
			<block slot="content">修改密码</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<view class="title">旧密码</view>
				<input placeholder="请输入旧密码" type="password" name="input" v-model="myFormData.oldpassword"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新密码</view>
				<input placeholder="请输入新密码"  type="password" name="input" v-model="myFormData.password" ></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认新密码</view>
				<input placeholder="请输入新密码"  type="password" name="input" v-model="myFormData.confirmpassword" ></input>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg"  @click="onSubmit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: -1,
				switchC: true,
				imgList: [],
				NavBarColor: this.NavBarColor,
				uploadUrl:"/sys/user/updatePassword",
				myFormData:{
					oldpassword:'',
					password:'',
					confirmpassword:'',
					username:uni.getStorageSync("name"),
				},
			};
		},
		onLoad: function (option) {
			console.log("this.$Route.query",this.$Route.query);
			let query=this.$Route.query
			if(query){
			}
		},
		methods: {
			onSubmit() {
			  let myForm = this.myFormData
			  let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
			  let checkEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
			  console.log("myForm",myForm)
			  if(myForm.oldpassword == ''){
				  this.$tip.alert('请输入旧密码');
				  return false
			  }
			  if(myForm.password == ''){
					this.$tip.alert('请输入新密码');
					return false
			  }
			  if(myForm.confirmpassword == ''){
					this.$tip.alert('请输入确认密码');
					return false
			  }
			
			 if(myForm.confirmpassword != myForm.password){
				 this.$tip.alert('两次输入的密码不一样，请重新输入');
				 return false
			 }
				console.log('myform',myForm)
				this.$tip.loading();
				this.$http.put(this.uploadUrl,myForm).then(res=>{
					console.log(res)
					this.$tip.loaded();
					if (res.data.success){
						this.$tip.toast('提交成功')
						uni.setStorage({
							key: 'password',
							data: myForm.password,
						});
						setTimeout(()=>{
							this.$Router.replace({name:'index'})
						},500)
						
					}else{
						this.$tip.toast(res.data.message)
					}
				}).catch(()=>{
					this.$tip.loaded();
					this.$tip.error('提交失败')
				});
			},
			DateChange(e) {
				this.myFormData.birthday = e.detail.value
			},
			SwitchC(e) {
				this.switchC = e.detail.value
			},
			
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
