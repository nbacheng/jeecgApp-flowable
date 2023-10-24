/**
 * 常用服务
 * useful server
 */
const icon_prefix = "/static/home/128/"

export const us = {
	data: [
		// {
		// 	title: "人员信息",
		// 	icon: icon_prefix + "index-1.png",
		// 	description: "",
		// 	useCount: 1000,
		// 	page: 'pages/addressbook/address-book'
		// },
		
		// {
		// 	title: "通知公告",
		// 	icon: icon_prefix + "index-8.png",
		// 	description: "",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// },
	
		{
			title: "通讯录",
			// icon: icon_prefix + "tongxun.png",
			icon: icon_prefix + "index-1.png",
			description: "查看部门，组员",
			useCount: 10000,
			page: 'levelAddressBook'

		}
	]
}
export const work = {
	data: [{
			title: "待办流程",
			icon: icon_prefix + "dblc.png",
			description: "查看部门，组员",
			useCount: 10000,
			page: 'toDoProcess'
		},
		{
			title: "已办流程",
			icon: icon_prefix + "yblc.png",
			description: "查看部门，组员",
			useCount: 10000,
			page: 'processed'
		}
	]
}

/**
 * other server 其他服务
 */
export const os = {
	data: [{
			title: "采购申请",
			icon: icon_prefix + "index-3.png",
			description: "",
			useCount: 10000,
			page: 'purchaseRequisition'
		}
		// 	{
		// 	title: "新闻中心",
		// 	icon: icon_prefix + "xinwen.png",
		// 	description: "新闻中心",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// }, {
		// 	title: "投票中心",
		// 	icon: icon_prefix + "toupiao.png",
		// 	description: "投票中心",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// }, {
		// 	title: "任务中心",
		// 	icon: icon_prefix + "renwu.png",
		// 	description: "任务中心",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// }, {
		// 	title: "文档中心",
		// 	icon: icon_prefix + "wendang.png",
		// 	description: "文档中心",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// }, {
		// 	title: "合同",
		// 	icon: icon_prefix + "hetong.png",
		// 	description: "合同",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// }, {
		// 	title: "会议",
		// 	icon: icon_prefix + "huiyi.png",
		// 	description: "会议",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// }, {
		// 	title: "客户关系",
		// 	icon: icon_prefix + "tongzhi.png",
		// 	description: "客户关系",
		// 	useCount: 10000,
		// 	page: 'helloWorld'
		// },
	]
}
