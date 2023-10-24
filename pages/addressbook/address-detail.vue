<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page">
			<cu-custom :bgColor="NavBarColor" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">个人信息</block>
			</cu-custom>
			<view class="cu-list menu-avatar margin-top">
				<view class="cu-item">
					<view class="cu-avatar round lg" v-if="infoList.avatar"  :style="[{backgroundImage:'url('+ infoList.avatar +')'}]"></view>
					<view class="cu-avatar round lg" v-else :style="[{backgroundImage:'url('+ avatar +')'}]"></view>
					<view class="content">
						<view class="text-grey text-lg">{{infoList.staffName?infoList.staffName:infoList.username}}<text class="cuIcon-peoplefill margin-left-sm" :class="infoList.sex=='2'?'text-pink':'text-blue'"></text></view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{infoList.jobNo}}
							</view>
						</view> 
					</view>
				</view>	
			</view>
			
			<view class="cu-list menu margin-top">
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.2s'}]">
					<view class="content">
						<text class="text-grey">手机</text>
					</view>
					<view class="action">
						<text class="text-grey">{{infoList.staffPhone?infoList.staffPhone:phone}}</text>
					</view>
				</view>
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.3s'}]">
					<view class="content">
						<text class="text-grey">学历</text>
					</view>
					<view class="action">
						<text class="text-grey">{{infoList.educatBackground?infoList.educatBackground:email}}</text>
					</view>
				</view>
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.3s'}]">
					<view class="content">
						<text class="text-grey">学校</text>
					</view>
					<view class="action">
						<text class="text-grey">{{infoList.gradSchool?infoList.gradSchool:email}}</text>
					</view>
				</view>
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.4s'}]">
					<view class="content">
						<text class="text-grey">部门</text>
					</view>
					<view class="action">
						<text class="text-grey">{{infoList.workPlace?infoList.workPlace:company}}</text>
					</view>
				</view>
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
	import {phone,email,company} from "@/common/util/constants"
	export default {
		data() {
			return {
				phone,
				email,
				company,
				NavBarColor:this.NavBarColor,
				avatar:'/static/login4.png',
				modalName: null,
				infoList:{
					realname:'',
					post:'',
					avatar:'',
					phone:null,
					email:'',
					department:'',
					title:''
				},
			};
		},
		onLoad() {
			 this.infoList = this.$Route.query;
			 console.log("this.infoList>>>",this.infoList)
		},
		methods: {
			backRoute() {
				//通讯录个人信息页面返回问题
				if(this.infoList.page){
					this.$Router.push({name:this.infoList.page})
				}else{
					let parmas={
						title:this.$Route.query.departName,
						orgCode:this.$Route.query.orgCode
					}
					this.$Router.push({name: 'member',params:parmas})
				}
			},
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}
</style>
