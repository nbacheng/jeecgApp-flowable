const routes = [{
		path: "/pages/login/login",
		name: 'login',
		meta: {
			title: '登录',
		},
	},
	{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/index/index',
		name: 'index',
		meta: {
			title: '主页',
		},
	},
	{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/home/home',
		//aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'home',
		meta: {
			title: '首页',
		},
	},
	{
		path: '/pages/user/people',
		name: 'people',
		meta: {
			title: '个人中心',
		},
	},
	{
		path: '/pages/user/userdetail',
		name: 'userdetail',
		meta: {
			title: '个人详情',
		},
	},
	{
		path: '/pages/user/useredit',
		name: 'useredit',
		meta: {
			title: '个人编辑',
		},
	},
	{
		path: '/pages/user/userexit',
		name: 'userexit',
		meta: {
			title: '退出',
		},
	},
	{
		path: '/pages/user/location',
		name: 'location',
		meta: {
			title: '定位',
		},
	},
	{
		path: '/pages/common/exit',
		name: 'exit',
		meta: {
			title: '退出',
		},
	},
	{
		path: '/pages/common/success',
		name: 'success',
		meta: {
			title: 'success',
		},
	}, {
		path: '/pages/addressbook/address-book',
		name: 'addressBook',
		meta: {
			title: 'addressBook',
		},
	},
	{
		path: '/pages/addressbook/level-address-book',
		name: 'levelAddressBook',
		meta: {
			title: 'levelAddressBook',
		},
	},
	{
		path: '/pages/addressbook/member',
		name: 'member',
		meta: {
			title: 'member',
		},
	},
	{
		path: '/pages/addressbook/address-detail',
		name: 'addressDetail',
		meta: {
			title: 'addressDetail',
		},
	},
	{
		path: '/pages/annotation/annotationList',
		name: 'annotationList',
		meta: {
			title: '通知公告',
		},
	},
	{
		path: '/pages/annotation/annotationDetail',
		name: 'annotationDetail',
		meta: {
			title: '通知详情',
		},
	},
	{
		path: '/pages/common/helloWorld',
		name: 'helloWorld',
		meta: {
			title: 'helloWorld',
		},
	},
	{
		path: '/pages/common/selectEquipment',
		name: 'selectEquipment',
		meta: {
			title: 'selectEquipment',
		},
	},
	
	
	{
		path: '/pages/dustAbsorption/dustAbsorption',
		name: 'dustAbsorption',
		meta: {
			title: '记录',
		},
	},
	{
		path: '/pages/dustAbsorption/addDustAbsorption',
		name: 'addDustAbsorption',
		meta: {
			title: '记录',
		},
	},

	{
		path: '/pages/dustAbsorption/dustAbsorptionInfo',
		name: 'dustAbsorptionInfo',
		meta: {
			title: '记录',
		},
	},

	{
		path: '/pages/dustAbsorption/dustAbsorptionList',
		name: 'dustAbsorptionList',
		meta: {
			title: '记录列表',
		},
	},
	
	{
		path: '/pages/common/selectPeople',
		name: 'selectPeople',
		meta: {
			title: '选择人审核',
		},
	},
	{
		path: '/pages/common/selectPeoples',
		name: 'selectPeoples',
		meta: {
			title: '选择人审核',
		},
	},
	{
		path: '/pages/faultList/faultList',
		name: 'faultList',
		meta: {
			title: '故障列表',
		},
	},

	{
		path: '/pages/faultList/faulInfo',
		name: 'faulInfo',
		meta: {
			title: '故障详情',
		},
	},{
		path: '/pages/faultList/faulInfos',
		name: 'faulInfos',
		meta: {
			title: '故障详情',
		},
	},{
		path: '/pages/toDoProcess/toDoProcess',
		name: 'toDoProcess',
		meta: {
			title: '待办流程',
		},
	},{
		path: '/pages/toDoProcess/handleProcess',
		name: 'handleProcess',
		meta: {
			title: '处理流程',
		},
	},{
		path: '/pages/toDoProcess/processed',
		name: 'processed',
		meta: {
			title: '已办流程',
		},
	},{
		path: '/pages/collectingApplication/collectingApplication',
		name: 'collectingApplication',
		meta: {
			title: '领用申请',
		},
	},{
		path: '/pages/collectingApplication/addCollectingApplication',
		name: 'addCollectingApplication',
		meta: {
			title: '申请领用',
		},
	},{
		path: '/pages/collectingApplication/changeSparePart',
		name: 'changeSparePart',
		meta: {
			title: '选择备件',
		},
	},{
		path: '/pages/collectingApplication/sparePartsAccount',
		name: 'sparePartsAccount',
		meta: {
			title: '备件台账',
		},
	},{
		path: '/pages/collectingApplication/sparePartsAccountInfo',
		name: 'sparePartsAccountInfo',
		meta: {
			title: '备件台账详情',
		},
	},{
		path: '/pages/purchaseRequisition/purchaseRequisition',
		name: 'purchaseRequisition',
		meta: {
			title: '采购申请',
		},
	},{
		path: '/pages/purchaseRequisition/addPurchase',
		name: 'addPurchase',
		meta: {
			title: '新增采购',
		},
	},{
		path: '/pages/purchaseRequisition/changeMaterial',
		name: 'changeMaterial',
		meta: {
			title: '选择物料',
		},
	},{
		path: '/pages/user/editPassword',
		name: 'editPassword',
		meta: {
			title: '修改密码',
		},
	}
	

]
export default routes
