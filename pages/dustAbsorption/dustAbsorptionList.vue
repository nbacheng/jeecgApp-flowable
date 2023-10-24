<template>
	<view class="bg-white">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" backRouterName="index">
			<block slot="backText">返回</block>
			<block slot="content">点巡记录</block>
		</cu-custom>
		<view class="container">

			<view @click="gonInfo()" class="nav">
				<view class="top">
					<img src="/static/home/128/index-1.png" alt="">
				</view>
				<view class="title">
					吸放灰记录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onShow() {
			if (this.mescroll) {
				this.mescroll.resetUpScroll()
			}
		},
		computed: {
			top() {
				return this.CustomBar * 2.2
			},
		},
		methods: {
			gonInfo() {
				this.$Router.push({
					name: 'dustAbsorption',
				})
			}

		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}
	.bg-white{
		height: 100%;
	}
	.container {
		background-color: #EBF1FF;
		width: 95%;
		margin: 20upx auto;
		height: 100%;
		display: flex;
		justify-content: space-around;
		padding-top: 50upx;

		.nav {
			width: 33%;

			.top {
				margin: 10upx auto;
				text-align: center;

				img {
					display: inline-block;
					margin: 0 auto;
					width: 86upx;
					height: 86upx;
				}
			}

			.title {
				width: 100%;
				text-align: center;
				height: 40upx;
				line-height: 40upx;
				font-size: 27upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}

	}
</style>
