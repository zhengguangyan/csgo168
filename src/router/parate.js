export default [
	{
		path: '/User',
		name: 'User',
		component: () => import('@/views/User/index.vue'),
		redirect: '/About',
		children:[
			{
				path: '/About',
				name: 'About',
				component: () => import('@/views/About/index.vue')
			},
			{
				path: '/Warehouse',
				name: 'Warehouse',
				component: () => import('@/views/Warehouse/index.vue')
			},
			{
			    path: '/Extension',
			    name: 'Extension',
			    component: () => import('@/views/Extension/index.vue')
			},
			{
			    path: '/Rebate',
			    name: 'Rebate',
			    component: () => import('@/views/Rebate/index.vue')
			},
			{
				path: '/Information',
				name: 'Information',
				component: () => import('@/views/Information/index.vue')
			},
			{
			    path: '/ChangePassword',
			    name: 'ChangePassword',
			    component: () => import('@/views/About/ChangePassword.vue')
			},
		]
	},
	{	//开箱(正常)
		path: '/Open',
		name: 'Open',
		component: () => import('@/views/Open/index.vue')
	},
	{
	    path: '/openbox',
	    name: 'openbox',
	    component: () => import('@/views/OpenBox/index.vue')
	},
	{
	    path: '/Recharge',
	    name: 'Recharge',
	    component: () => import('@/views/Recharge/index.vue')
	},
	
	{
	    path: '/PaymentDetails',
	    name: 'PaymentDetails',
	    component: () => import('@/views/Recharge/PaymentDetails.vue')
	},
	{
	    path: '/UnpackingRules',
	    name: 'UnpackingRules',
	    component: () => import('@/views/UnpackingRules/index.vue')
	},
	{
	    path: '/Snatch',
	    name: 'Snatch',
	    component: () => import('@/views/UnpackingRules/Snatch.vue')
	},
	{
	    path: '/Explosion',
	    name: 'Explosion',
	    component: () => import('@/views/UnpackingRules/Explosion.vue')
	},
	
	{
	    path: '/CreatingRooms',
	    name: 'CreatingRooms',
	    component: () => import('@/views/CreatingRooms/index.vue')
	},
	{
	    path: '/UserAgreement',
	    name: 'UserAgreement',
	    component: () => import('@/views/UnpackingRules/UserAgreement.vue')
	},
	
	{
	    path: '/Privacy',
	    name: 'Privacy',
	    component: () => import('@/views/UnpackingRules/Privacy.vue')
	},
	{
	    path: '/RushPurchase',
	    name: 'RushPurchase',
	    component: () => import('@/views/RushPurchase/index.vue')
	},
	{
		path: '/PrizeDetails',
		name: 'PrizeDetails',
		component: () => import('@/views/RushPurchase/PrizeDetails.vue')
	},
	{
	    path: '/CreateAConfrontation',
	    name: 'CreateAConfrontation',
	    component: () => import('@/views/BoxFight/CreateAConfrontation.vue')
	},
	{
	    path: '/vsbox',
	    name: 'vsbox',
	    component: () => import('@/views/BoxFight/VsBox.vue')
	},
	{
	    path: '/GameHistory',
	    name: 'GameHistory',
	    component: () => import('@/views/BoxFight/GameHistory.vue')
	},
	{
	    path: '/JewelryMall',
	    name: 'JewelryMall',
	    component: () => import('@/views/JewelryMall/index.vue')
	},
	{
		path: '/BattleList',
		name: 'BattleList',
		component: () => import('@/views/BoxFight/BattleList.vue')
	},
	{
		path: '/MyRecord',
		name: 'MyRecord',
		component: () => import('@/views/Lucky/MyRecord.vue')
	},
]









