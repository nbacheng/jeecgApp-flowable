<template>
	<view>
		<home :cur="PageCur" v-if="PageCur=='home'" :key="commponent1Key"></home>
		<people v-if="PageCur=='people'" :key="commponent2Key"></people>
		<annotationList v-if="PageCur=='annotationList'" :key="commponent3Key"></annotationList>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view :class="PageCur=='home'?'action text-blue':'action text-gray'" @click="NavChange" data-cur="home">
				<view class='cuIcon-homefill'></view>首页
			</view>
<!--			<view :class="PageCur=='annotationList'?'action text-blue':'action text-gray'" @click="NavChange" data-cur="annotationList">
				<view class='cuIcon-peoplelist'></view>通知
			</view>-->
			<view :class="PageCur=='people'?'action text-blue':'action text-gray'" @click="NavChange" data-cur="people">
				<view class='cuIcon-people'></view>个人
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'home',
				commponent1Key: 0,
				commponent2Key: 0,
				commponent3Key: 0,
			}
		},
		onLoad:function(){
			wx.showShareMenu({
				withShareTicket: true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
			this.PageCur='home'
			++this.commponent1Key
			++this.commponent2Key
			++this.commponent3Key
		},
		methods: {

			NavChange: function(e) {
				console.log(e.currentTarget.dataset.cur)
				this.PageCur = e.currentTarget.dataset.cur
			}

		}
	}
</script>

<style>
.text-blue{
	color: #3F86FF;
}
</style>
