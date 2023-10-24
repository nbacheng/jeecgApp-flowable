<template>
	<view>
		<web-view :webview-styles="webviewStyles"  :src="urls"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#2A3745'
				},
				content: '<h1>Hello world!</h1>',
				urls: '',
				webviewStyles: {
					progress: {
						color: '#FF3333',
						width:'100%',
					},
					top: 15
				},
				type:""
			}
		},
		onBackPress(e){
			console.log(e)
			this.$Router.replaceAll({
				name: 'toDoProcess'
			})
		},
		onLoad(options) {
			console.log(unescape(options.urls))
			// let query = this.$Route.query
			// console.log(unescape(query))
			// this.urls = unescape(query)
			this.urls = unescape(options.urls)

		},
		methods: {
			back(e){
				console.log(e)
			},
		}
	}
</script>

<style>
page{
	width:100% !important;
	overflow-x: hidden;
}
</style>
