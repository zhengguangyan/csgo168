import { PersonalInfo } from '@/network/api'

export default {
	
	//加入房间推送
	AddInformation(context,val){
		 context.commit('AddInformation',val)
	},
	
	//回合
	GetroundNum(context,val){
		context.commit('GetroundNum',val)
	},
	
	//开始
	GetVsKaiShi(context,val){
		context.commit('GetVsKaiShi',val)
	},
	
	//结束
	GetVsJieShu(context,val){
		context.commit('GetVsJieShu',val)
	},
	
	//开始对战数据
	GetKaiShiVsData(context,val){
		context.commit('GetKaiShiVsData',val)
	},
	
	//结束对战数据
	GetJieShuVsData(context,val){
		context.commit('GetJieShuVsData',val)
	},
	
	//注册弹框
	GetRegisterShow(context,val){
		context.commit('GetRegisterShow',val)
	},
	
	//登录弹框
	GetSignInShow(context,val){
		context.commit('GetSignInShow',val)
	},
	
  //获取 刷新用户信息
  Refresh(context) {
    PersonalInfo().then(res => {
      context.commit('User', res.data.message)
    })
  }
}