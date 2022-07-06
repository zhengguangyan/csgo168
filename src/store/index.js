import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(Vuex)

const state = {
  user: {
    email: "",        		//邮箱
    pass: "",         		//密码
    name: "",         		//用户名
    avatar: "",             //头像
    bean: 0,          		//m豆
    invite: "",       		//邀请码
    level: 0,         		//等级
    steam: "",        		//steam 链接
	promotion_level:"", 	//推广等级
	promotion_level_name:"",//等级名称
	total_recharge:"",      //累计充值金豆
	Rebate:"",              //总返利
	reg_freeze_bean:"",     //注册冻结金豆
	recharge_level:"",      //用户充值等级
	charge_rebate:"",       //个人累计充值返佣
	integral:"",            //个人积分
	
    state: false      		//登录状态
  },
  
  roundNum:0,
  
  VsKaiShi:{},
  
  VsJieShu:{},
  
  RegisterShow: false,//注册弹框
  SignInShow: false,//登录弹框
  
  KaiShiVsData:{},
  JieShuVsData:{},
  
  
  AddInformation:{},
  
  //未登录显示
  IndividualsShow:false
  
}


const getters = {

}


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
