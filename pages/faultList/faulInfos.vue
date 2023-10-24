<template>
	<view v-if="info">
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true" backRouterName="index">
				<block slot="backText">返回</block>
				<block slot="content">详情</block>
			</cu-custom>
			<view class="tip">
				({{info.systemName}})故障报修
			</view>
			<view class="titles">
				维修人填写
			</view>
			<view class="con-3">
				<view class="title">
					故障描述
				</view>
				<view class="textarea">
					<textarea @input='content' v-model="info.remarks" placeholder="请输入" name="" id="" cols="30"
						rows="10">

					</textarea>
				</view>
			</view>
			<view class="con-3">
				<view class="title">
					故障等级
				</view>
				<view class="input">
					<input type="text" v-model='info.levelName' placeholder="" disabled="true">
				</view>
			</view>
			<view class="con-5">
				<view class="title">
					图片{{imgList.length}}/4
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view @click="clickImg()" class="bg-img" v-for="(item,index) in imgList" :key="index"
							@tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>

						</view>
					</view>
				</view>
			</view>
			<view class="con-3">
				<view class="title">
					审核意见
				</view>
				<view class="textarea">
					<textarea :display="true" v-model='parmas.trialOpinion' placeholder="" name="" id="" cols="30"
						rows="10">

					</textarea>
				</view>
			</view>
			<view class="con-3">
				<view class="title">
					治理整改人
				</view>
				<view class="input">
					<input type="text" v-model='parmas.handleBy' placeholder="" disabled="true">
				</view>
			</view>
			<view v-if="parmas.status!='0'" class="con-3">
				<view class="title">
					故障原因
				</view>
				<view class="input">
					<input :display="true" type="text" v-model='parmas.reason' placeholder="">
				</view>
			</view>
			<view v-if="parmas.status!='0'" class="con-5">
				<view class="title">
					处理后图片{{imgLists.length}}/4
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgLists" :key="index" @tap="ViewImage"
							:data-url="imgLists[index]">
							<image :src="imgLists[index]" mode="aspectFill"></image>

						</view>

					</view>
				</view>
			</view>
			<view v-if="parmas.status!='0'" class="con-3">
				<view class="title">
					验收人
				</view>
				<view class="input">
					<input type="text" v-model='parmas.collectName' placeholder="" disabled="true">
				</view>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	import appSelect from '@/components/my-componets/appSelect.vue'
	import myImageUpload from '@/components/my-componets/my-image-upload.vue'
	import myDate from '@/components/my-componets/my-date.vue'
	import configService from '@/common/service/config.service.js'
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'

	export default {
		components: {
			appSelect,
			myImageUpload,
			myDate
		},
		data() {
			return {
				modalName: null,
				item: {
					msg: '退出成功'
				},
				current: 0,
				items: [{
					"name": "待处理",
					"value": "0"
				}, {
					"name": "待验收",
					"value": "1"
				}, {
					"name": "验收完成",
					"value": "1"
				}],
				type: "1",
				selected: [],
				beginTime: '',
				id: "",
				infoUrl: 'ep/epFaultInfo/queryById',
				urls: "/ep/epFaultInfo/add",
				edit: "/ep/epFaultInfo/edit",
				imgUpload: "/sys/common/upload",
				imgList: [],
				imgLists: [],
				proList: [],
				NavBarColor: this.NavBarColor,
				parmas: {
					systemName: "",
					systemId: "",
					remarks: "",
					photo: "",
					handleBy: "",
					handleId: "",
					updateBy: "",
					collectName: "",
					collectId: "",
				},
				info: "",
				id: "",
				disType: false
			}
		},
		onLoad(options) {
			console.log(this.$Route.query)
			this.disType = this.$Route.query.type
			this.id = this.$Route.query.id
			if (this.$Route.query.type == 1) {
				this.parmas.handleBy = this.$Route.query.name
				this.parmas.handleId = this.$Route.query.ids
			}
			if (this.$Route.query.type == 2) {
				this.parmas.collectId = this.$Route.query.ids
				this.parmas.collectName = this.$Route.query.name
			}
			this.getInfo()
		},
		methods: {
			select() {
				this.$Router.push({
					name: 'selectPeoples',
					params: 1
				})
			},
			ChooseImage() {
				console.log(uni.getStorageSync(ACCESS_TOKEN))
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res)
						var tempFilePaths = res.tempFilePaths
						uni.showLoading({
							title: '正在上传中..',
							mask: true
						});
						uni.uploadFile({
							url: configService.apiUrl + this.imgUpload,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								file: tempFilePaths[0]
							},
							header: {
								'X-Access-Token': uni.getStorageSync(ACCESS_TOKEN)
							},
							success: (resa) => {
								console.log(resa, 666)
								console.log(JSON.parse(resa.data), 777)
								uni.hideLoading()
								let img = configService.apiUrl + '/sys/common/static/' + JSON
									.parse(resa.data).message
								this.imgLists = this.imgLists.concat(img)
								// console.log(this.fileList)
								uni.showToast({
									title: "上传成功",
									icon: 'success',
									duration: 1000
								});
							}
						})
					}
				});
			},
			DelImg(e) {
				this.imgLists.splice(e.currentTarget.dataset.index, 1)
			},
			add() {
				console.log("提交了")
				if (this.parmas.status == '0') {
					this.parmas.status = '1'
				} else if (this.parmas.status == '1') {
					this.parmas.status = '2'
				} else if (this.parmas.status == 2) {
					this.parmas.status = '3'
				}
				this.parmas.photoHandle = this.imgLists.toString()
				this.$http.post(this.edit, this.parmas).then(res => {
					var res = res.data;
					if (res.code != 500) {
						this.$tip.success(res.message);
						this.$Router.push({
							name: 'faultList',
							params: {}
						})
					} else {
						this.$tip.alert(res.message);
					}
				}).catch(() => {
					//联网失败, 结束加载
					console.log(res.data.message)
				})
			},
			selects() {
				this.$Router.push({
					name: 'selectPeoples',
					params: 2
				})
			},
			clickImg() {
				wx.previewImage({
					urls: this.imgList, //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},
			getInfo() {
				this.$http.get(this.infoUrl, {
					params: {
						id: this.id
					}
				}).then(res => {
					console.log(res.data)
					this.info = res.data.result
					this.parmas = res.data.result
					this.imgList = this.info.photo.split(',')
					this.imgLists = this.info.photoHandle.split(',')
					if (this.info.level == '0') {
						this.info.levelName = 'A级'
					} else if (this.info.level == '1') {
						this.info.levelName = 'B级'
					} else {
						this.info.levelName = 'C级'
					}
				}).catch(() => {
					//联网失败, 结束加载
					console.log(res.data.message)
				})
			},
			content(e) {
				this.parmas.trialOpinion = e.detail.value;
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.btn {
		width: 90%;
		height: 94upx;
		line-height: 94upx;
		background: #3874F6;
		border-radius: 47upx;
		font-size: 34upx;
		font-family: PingFang SC;
		font-weight: 300;
		color: #FFFFFF;
		margin: 20upx auto 200upx auto;
		text-align: center;
	}

	.tip {
		height: 100upx;
		width: 100%;
		padding: 0 10upx;
		font-size: 40upx;
		line-height: 100upx;
		font-weight: bolder;
		color: #3172BE;
	}

	.title {
		font-size: 35upx;
		color: #383838;
		height: 80upx;
		line-height: 80upx;
		font-weight: bolder;

	}

	.titles {
		width: 100%;
		padding: 0 10upx;
		font-size: 30upx;
		color: #979797;
		height: 60upx;
		line-height: 50upx;
	}

	.con-4 {
		width: 100%;
		padding: 0 10upx;

	}

	.con-5 {
		width: 100%;
		padding: 0 10upx;

	}

	.con-6 {
		width: 100%;
		padding: 0 10upx;

	}

	.con-3 {
		width: 100%;
		padding: 0 10upx;

		input {
			height: 80upx;
			line-height: 80upx;
			padding-left: 20upx;
			width: 90%;
			margin: 0 auto;
			border: 1upx solid #e3e3e3;
			border-radius: 10upx;
		}

		.titles {
			font-size: 30upx;
			color: #979797;
			height: 60upx;
			line-height: 50upx;
		}

		.textarea {
			min-height: 200upx;
			padding: 20upx 20upx;
			border: 1upx solid #e3e3e3;
			border-radius: 10upx;

			textarea {
				width: 100% !important;
				font-size: 30upx;
				color: #979797;
			}
		}
	}

	.con-2 {
		width: 100%;
		padding: 0 10upx;

		.radio {
			width: 100%;

			radio-group {
				width: 100%;
			}

			.radio-list {
				width: 100%;
				padding: 0 20upx;
				border: 1upx solid #e3e3e3;
				border-radius: 10upx;
				margin-bottom: 10upx;

				.radios {
					text {
						color: #2B2B2B;
						font-size: 30upx;
						line-height: 100upx;
						margin-left: 20upx;
					}
				}

			}
		}
	}

	.con-1 {
		width: 100%;
		padding: 0 10upx;



		.pro {
			width: 100%;
		}

		.pro-list-1 {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 20upx 25upx;
			border: 1upx solid #e3e3e3;
			border-radius: 10upx;
			margin-bottom: 20upx;
			background-color: #ECF7F1;

			.left {
				font-size: 30upx;
				color: #212121;
				width: 80%;
			}

			.right {
				text-align: center;
				width: 10%;
				position: relative;

				text {
					position: absolute !important;
					top: 50% !important;
					transform: translateY(-50%) !important;
					left: 20upx;
				}
			}
		}

		.pro-list-2 {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 20upx 25upx;
			border: 1upx solid #e3e3e3;
			border-radius: 10upx;
			margin-bottom: 20upx;
			background-color: #FBEDED;

			.left {
				font-size: 30upx;
				color: #212121;
				width: 80%;
			}

			.right {
				text-align: center;
				width: 10%;
				position: relative;

				text {
					position: absolute !important;
					top: 50% !important;
					transform: translateY(-50%) !important;
					left: 20upx;
				}
			}
		}

		.pro-list {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 20upx 25upx;
			border: 1upx solid #e3e3e3;
			border-radius: 10upx;
			margin-bottom: 20upx;

			.left {
				font-size: 30upx;
				color: #212121;
				width: 80%;
			}

			.center {
				text-align: center;
				width: 10%;
				border-right: 2upx solid #e3e3e3;
				position: relative;

				text {
					position: absolute !important;
					top: 50% !important;
					transform: translateY(-50%) !important;

				}
			}

			.right {
				text-align: center;
				width: 10%;
				position: relative;

				text {
					position: absolute !important;
					top: 50% !important;
					transform: translateY(-50%) !important;
					left: 20upx;
				}
			}
		}
	}
</style>
