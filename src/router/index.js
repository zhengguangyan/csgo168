import Vue from 'vue'
import VueRouter from 'vue-router'
import myMixin from './mixin'
import myParate from './parate'
import { Message } from 'element-ui'
Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Index',
		component: () => import('@/views/OutIndex/index.vue'),
		redirect: '/Home',
		children: [
			...myMixin,
			...myParate,
			{	//CSGO
				path: '/Home',
				name: 'Home',
				component: () => import('@/views/Home/index.vue')
			},

			{ //福利房
				path: '/Roll',
				name: 'Roll',
				component: () => import('@/views/Roll/index.vue'),
				meta:{
				  keepAlive: true
				}
			},

			{//幸运开箱
				path: '/Lucky',
				name: 'Lucky',
				component: () => import('@/views/Lucky/index.vue')
			},

			{//商店
				path: '/Shop',
				name: 'Shop',
				component: () => import('@/views/Shop/index.vue')
			},

			{//合作伙伴
				path: '/Cooperation',
				name: 'Cooperation',
				component: () => import('@/views/Cooperation/index.vue')
			},

			{//箱子对战
				path: '/BoxFight',
				name: 'BoxFight',
				component: () => import('@/views/BoxFight/index.vue')
			},
			{//活动页面
				path: '/Activity',
				name: 'Activity',
				component: () => import('@/views/Activity/index.vue')
			},
			{//活动页面(开箱)
				path: '/Activity_open',
				name: 'Activity_open',
				component: () => import('@/views/Activity/Activity_open.vue')
			},
			{//合约
				path: '/Replacement',
				name: 'Replacement',
				component: () => import('@/views/Replacement/index.vue')
			},
			{//正常开箱
				path: '/OpeningBox',
				name: 'OpeningBox',
				component: () => import('@/views/OpeningBox/index.vue')
			},

		]
	},
	{
	    path: '/NotOpen',
	    name: 'NotOpen',
	    component: () => import('@/views/NotOpen/index.vue')
	},
	{
		path: '/Payment',
		name: 'Payment',
		component: () => import('@/views/Payment/index.vue')
	}

]

const router = new VueRouter({
	mode: 'history',
	routes
})


// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/Warehouse' || to.path === '/about' || to.path === '/Extension' || to.path === '/Rebate' || to.path === '/Recharge' || to.path === '/CreatingRooms' || to.path === '/WelfareInfo') {
    let token = sessionStorage.getItem('token')
	if (token === null || token === '') {
	  next('/Home')
	  Message({
	    message:"您还未登陆，请先登陆!",
	    type:'error'
	  })
	} else {
	  next();
	}
  } else {
	 next();
  }
})

export default router
