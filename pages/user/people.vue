<template>
	<view>
		<scroll-view scroll-y class="page">
			<!-- 头部logo-->
			<view class="UCenter-bg">
				<image src="https://static.jeecg.com/upload/test/wave_1595818053612.gif" mode="scaleToFill"
					class="gif-wave"></image>
			</view>
			<view class="padding flex text-center text-grey bg-white shadow-warp">
				<view class="flex flex-sub flex-direction solid-right animation-slide-top"
					:style="[{animationDelay: '0.2s'}]">
					<view class="text-xl text-orange">{{personalList.realname}}</view>
					<view class="margin-top-sm"><text class="cuIcon-people"></text> 用户</view>
				</view>

				<view class="flex flex-sub flex-direction animation-slide-top" :style="[{animationDelay: '0.2s'}]">
					<view class="text-xl text-green">{{personalList.post?personalList.post:'员工'}}</view>
					<view class="margin-top-sm"><text class="cuIcon-news"></text> 职务</view>
				</view>
			</view>
			<!-- 列表list-->
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<!--  <view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.1s'}]">
		      <view class="content" >
		        <text class="cuIcon-favorfill text-yellow"></text>
		        <text class="text-grey">收藏</text>
		      </view>
		    </view>
		    <view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.2s'}]">
		      <view class="content">
		        <text class="cuIcon-redpacket_fill text-red"></text>
		        <text class="text-grey">红包</text>
		      </view>
		    </view> -->
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.3s'}]" @tap="scan">
					<view class="content">
						<text class="cuIcon-scan text-red"></text>
						<text class="text-grey">扫码</text>
					</view>
				</view>
				<!-- <navigator class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.4s'}]" url="/pages/user/location" hover-class="none">
				<view class="content" >
				    <text class="cuIcon-location text-cyan"></text>
					<text class="text-grey">定位</text>
				</view>
			</navigator>-->
			<navigator class="cu-item arrow animation-slide-bottom" url="/pages/user/editPassword" :style="[{animationDelay: '0.6s'}]">
			     <view class="content">
				    <text class="cuIcon-settingsfill text-cyan"></text>
					<text class="text-grey">修改密码</text>
			    </view>
			</navigator>

				<navigator class="cu-item arrow animation-slide-bottom" @click="goOut()"
					:style="[{animationDelay: '0.7s'}]" hover-class="none">
					<view class="content">
						<text class="cuIcon-exit text-cyan"></text>
						<text class="text-grey">退出</text>
					</view>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	import api from '@/api/api'
	import {
		USER_INFO
	} from "@/common/util/constants"
	export default {
		name: "people",
		data() {
			return {
				personalList: {
					avatar: '',
					realname: uni.getStorageSync(USER_INFO).realname ,
					post: uni.getStorageSync(USER_INFO).post
				},
				positionUrl: '/sys/position/list',
				departUrl: '/sys/user/userDepartList',
				userUrl: '/sys/user/queryById',
				postUrl: '/sys/position/queryByCode',
				// infoUrl: "/ep/epEquSystem/queryById",
				infoUrl: "/ep/epEquipInfo/codeCallback",
				userId: '',
				id: ''
			};
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log(uni.getStorageSync(USER_INFO))
					this.userId = this.$store.getters.userid;
					//this.load()
				},
			},
		},
		methods: {
			goOut() {
				getApp().globalData.id =''
				api.logout().then(res => {
					uni.clearStorageSync()
				})
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			scan() {
				let that=this;

				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						if (res.result.indexOf('') > -1) {
							let id = res.result.split("?")[1].substr(3);

							that.$http.get(that.infoUrl, {
								params: {
									id: id
								}
							}).then(res => {
								console.log(res)
								var res = res.data;
								if (res.code != 500) {
									that.$Router.push({
										name: 'addEpPointInspection',
										params: res.result
									})
								} else {
									that.$tip.alert(res.message);
								}

							}).catch(() => {
								//联网失败, 结束加载
								console.log(res.data.message)
							})
						} else {
							that.$tip.alert("二维码不正确！");
						}

					}
				});
			},
			load() {
				if (!this.userId) {

					return;
				}
				this.$http.get(this.userUrl, {
					params: {
						id: this.userId
					}
				}).then(res => {
					console.log("res", res)
					if (res.data.success) {
						let perArr = res.data.result
						let avatar = (perArr.avatar && perArr.avatar.length > 0) ? api.getFileAccessHttpUrl(perArr
							.avatar) : '/static/avatar_boy.png'
						this.personalList.avatar = avatar
						this.personalList.realname = perArr.realname
						this.personalList.username = perArr.username
						this.personalList.depart = perArr.departIds
						this.getpost(perArr.post)
					}
				}).catch(err => {
					console.log(err);
				});

			},
			getpost(code) {
				if (!code || code.length == 0) {
					this.personalList.post = '员工'
					return false;
				}
				this.$http.get(this.postUrl, {
					params: {
						code: code
					}
				}).then(res => {
					console.log("postUrl", res)
					if (res.data.success) {
						this.personalList.post = res.data.result.name
					}
				}).catch(err => {
					console.log(err);
				});

			}
		}
	}
</script>

<style>
	.UCenter-bg {
		/* #ifdef MP-WEIXIN */
		background-image: url('https://static.jeecg.com/upload/test/blue_1595818030310.png');
		/* #endif */
		/* #ifndef MP-WEIXIN */
		background-image: url('/static/blue.png');
		/* #endif */
		background-size: cover;
		height: 400rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}
</style>
