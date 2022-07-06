export default {
  //设置用户信息
  User(state, u) {
    state.user.email = u.email
    state.user.pass = u.pass
    state.user.name = u.name
    state.user.avatar = u.avatar
    state.user.level = u.level
    state.user.bean = u.bean
    state.user.steam = u.steam_url
    state.user.invite = u.invite_code
	state.user.promotion_level = u.promotion_level
	state.user.promotion_level_name = u.promotion_level_name
	state.user.total_recharge = u.total_recharge
	state.user.Rebate = u.Rebate
	state.user.reg_freeze_bean = u.reg_freeze_bean
	state.user.recharge_level = u.recharge_level
	state.user.charge_rebate = u.charge_rebate
	state.user.integral = u.integral
    state.user.state = true
  },
  
  //加入房间信息
  AddInformation(store,val){
	  store.AddInformation = val
  },
  
  GetIndividualsShow(state,val){
	  state.IndividualsShow = val
  },
  
  //回合
  GetroundNum(state,val){
	   state.roundNum = val
  },
  
  //开始
  GetVsKaiShi(state,val){
	  state.VsKaiShi = val
  },
  
  //开始对战数据
  GetKaiShiVsData(state,val){
	   state.KaiShiVsData = val
  },
  
  //结束对战数据
  GetJieShuVsData(state,val){
	  state.JieShuVsData = val
  },
  
  //结束
  GetVsJieShu(state,val){
  	  state.VsJieShu = val
  },
  
  //注册弹框
  GetRegisterShow(state,val){
	  state.RegisterShow = val
  },
  
  //登录弹框
  GetSignInShow(state,val){
  	  state.SignInShow = val
  },
  
  //退出登录
  Leave(state) {
    state.user.state = false
    window.localStorage.clear()
	window.sessionStorage.clear()
  },
}