import axios from './axios'
//注册
export function Register(email,pass,name,verify,invite,openid,unionid,headimgurl,agent) {
  return axios({
    url:'/register',
	method: 'post',
	data: {
	  email,
	  pass,
	  name,
	  verify,
	  invite,
	  openid,
	  unionid,
	  headimgurl,
	  agent
	}
  })
}
//获取图形验证器
export function captcha(){
	return axios({
		url:'/captcha'
	})
}
//箱子数据及物品数据
export function Box_detail(id){
  return axios({
    url:'/box/detail',
	params:{
		id
	}
  })
}

export function set_inviter(invite_code){
  return axios({
    url:'set_inviter',
	method: 'post',
	data: {
		invite_code
	}
  })
}
//发送邮箱验证码
export function PostEmail(email,captcha,captchaKey,usage) {
  return axios({
    url:'/send_email',
	method: 'post',
	data: {
		email,
		captcha,
		captchaKey,
		usage
	}
  })
}


//登录
export function SignIn(email,pass) {
  return axios({
    url:'/login',
	method: 'post',
	data: {
		email,
		pass
	}
  })
}

//个人信息
export function PersonalInfo() {
  return axios({
    url: '/me'
  })
}


//设置steam连接
export function SteamUrl(steam_url) {
  return axios({
    url:'/set_steam_url',
	method: 'post',
	data: {
		steam_url
	}
  })
}


//仓库
export function Storage(page,status,type) {
  return axios({
    url:'/storage',
	params: {
		page,
		status,
		type
	}
  })
}


//提取
export function Extract(data) {
  return axios({
    url:'/extract',
	method: 'post',
	data: {
		data
	}
  })
}

//回收
export function Cash(data) {
  return axios({
    url:'/cash',
	method: 'post',
	data: {
		data
	}
  })
}

//赠送
export function Give(id,invite_code) {
  return axios({
    url:'/give',
	method: 'post',
	data: {
		id,
		invite_code
	}
  })
}


// 金豆列表
export function Beans() {
  return axios({
    url:'/beans'
  })
}

// 充值列表
export function Channels() {
	return axios({
		url:'/channels'
	})
}

//充值接口
export function Recharge(id,pay_way) {
  return axios({
    url:'/recharge',
	method: 'post',
	data: {
		id,
		pay_way
	}
  })
}

//充值记录
export function Recharge_record(page) {
  return axios({
    url:'/recharge_record',
	params:{
		page
	}
  })
}

//订单详情
export function BeansDetail(code) {
  return axios({
    url:'/bean/detail',
	params:{
		code
	}
  })
}


//创建房间
export function RoomSave(name,end_time,people_number,box_record_ids,describe,password,min_recharge,me_inviter) {
  return axios({
    url:'room/save',
	method: 'post',
	data:{
		name,
		end_time,
		people_number,
		box_record_ids,
		describe,
		password,
		min_recharge,
		me_inviter
	}
  })
}
//合作推广
export function Promote() {
  return axios({
    url:'/promote'
  })
}

//下线
export function Be_inviter(page) {
  return axios({
    url:'/be_inviter',
	params:{
		page
	}
  })
}
//佣金信息
export function Bonus() {
  return axios({
    url:'/bonus'
  })
}
//佣金记录
export function Rebate(page) {
  return axios({
    url:'/rebate',
	params:{
		page
	}
  })
}

//开箱记录
export function UnpackingRecord(id) {
  return axios({
    url:'/openhistory',
	params: {
		id
	}
  })
}

//幸运开箱记录
export function LickRecord(id) {
	return axios({
		url:'/myrecordlist',
		params: {
			id
		}
	})
}

//获取Banner
export function BannerList() {
	return axios({
		url:'/banner'
	})
}

//热门宝箱
export function GetHotBox() {
  return axios({
    url:'/hotbox'
  })
}


// Roll房列表
export function Rooms(page,status,sort) {
  return axios({
    url:'/rooms',
	params:{
		page,
		status,
		sort
	}
  })
}

//Roll房详情
export function RoomDetail(id) {
  return axios({
    url:'/room/detail',
	params:{
		id
	}
  })
}

//加入Roll房
export function RoomJoin(id,password) {
  return axios({
    url:'/room/join',
	method: 'post',
	data: {
		id,
		password
	}
  })
}


//参加房间记录
export function UserRooms(page) {
  return axios({
    url:'/user/rooms',
	params:{
		page
	}
  })
}

//首冲奖励
export function BeansFirst() {
  return axios({
    url:'/beans/first'
  })
}
//累计充值
export function BeansTotal() {
  return axios({
    url:'/beans/total'
  })
}
//修改验证码
export function Set_invite_code(code) {
  return axios({
    url:'/set_invite_code',
	method: 'post',
	data:{
		code
	}
  })
}

//头像上传
export function base64(data) {
  return axios({
    url:'/image/base64',
	method: 'post',
	data:{
		data
	}
  })
}

//头像更新
export function Set_avatar(path) {
  return axios({
    url:'/set_avatar',
	method: 'post',
	data:{
		path
	}
  })
}

//装备类型
export function luckyType() {
  return axios({
    url:'/lucky/type'
  })
}

//装备列表
export function luckyList(type_id) {
  return axios({
    url:'lucky/list',
	params:{
		type_id
	}
  })
}
//装备搜索
export function luckySo(name) {
  return axios({
    url:'/lucky/so',
	params:{
		name
	}
  })
}

//修改密码
export function Reset_password(email,password,verify) {
  return axios({
    url:'/reset_password',
	method: 'post',
	data:{
		email,
		password,
		verify
	}
  })
}

//站点信息
export function Info() {
  return axios({
    url:'/info'
  })
}

//访问量
export function Views() {
	return axios({
		url:'/views',
	})
}

//进入房间盲盒频道
export function Blind_box_channel(client_id) {
  return axios({
    url:'/arena/join-channel',
	method: 'post',
	data:{
		client_id
	}
  })
}

//卡密支付
export function Card_recharge(card) {
  return axios({
    url:'/card-recharge',
	method: 'post',
	data:{
		card
	}
  })
}

//更改用户名称
export function Set_Name(name) {
  return axios({
    url:'/set_name',
	method: 'post',
	data:{
		name
	}
  })
}

//创建对战
export function Arena_Create(user_num,box) {
  return axios({
    url:'/arena/create',
	method: 'post',
	data:{
		user_num,
		box
	}
  })
}

//宝箱列表(盲盒对战)
export function Arena_Box_List() {
  return axios({
    url:'/arena/box-list',
  })
}

//对战列表
export function Arena_List(page) {
  return axios({
    url:'/arena/list',
	params:{
		page
	}
  })
}

//对战详情
export function Arena_Detail(game_arena_id) {
  return axios({
    url:'/arena/detail',
	params:{
		game_arena_id
	}
  })
}

//关闭对战
export function CloseMatchOperation(id) {
	return axios({
		url:'/arena/close-match',
		params:{
			id
		}
	})
}

//加入房间
export function Arena_Join(game_arena_id,seat) {
  return axios({
    url:'/arena/join',
	method: 'post',
	data:{
		game_arena_id,
		seat
	}
  })
}

//历史记录
export function Arena_History(page){
  return axios({
    url:'/arena/history',
	params:{
		page
	}
  })
}

//我的历史记录
export function Arena_Me_History(page){
  return axios({
    url:'/arena/me-history',
	params:{
		page
	}
  })
}

//对战榜单
export function BattleList(page,type){
	return axios({
		url:'/arena/battle-list',
		params:{
			page,
			type
		}
	})
}

//夺宝房间列表
export function Snatch(page,status){
  return axios({
    url:'/snatch',
	params:{
		page,
		status
	}
  })
}

//加入夺宝房间
export function Snatch_Join(id,num){
  return axios({
    url:'/snatch/join',
	method: 'post',
	data:{
		id,
		num
	}
  })
}

//夺宝详情
export function Snatch_Detail(id){
  return axios({
    url:'/snatch/detail',
	params:{
		id
	}
  })
}

//饰品列表
export function GetShop(min_integral ,max_integral ,sort,page,durable,type,props_name){
  return axios({
    url:'/shop',
	params:{
		min_integral,
		max_integral ,
		sort,
		page,
		durable,
		type,
		props_name
	}
  })
}

//饰品购买
export function Shop_Buy(id,num){
	return axios({
		url:'/shop/buy',
		method: 'post',
		data:{
			id,
			num
		}
	})
}

//饰品购买
export function Shop_Exchange(id,num){
  return axios({
    url:'/shop/exchange',
	method: 'post',
	data:{
		id,
		num
	}
  })
}

//福利宝箱列表
export function Welfare() {
  return axios({
    url:'/welfare'
  })
}


//福利宝箱开箱
export function WelfareOpen(id,cdk){
  return axios({
    url:'/welfare/open',
	method: 'post',
	data:{
		id,
		cdk
	}
  })
}

//装备查询
export function AwardGet(id){
  return axios({
    url:'/award/get',
	params:{
		id
	}
  })
}

//幸运开箱(开箱)
export function LuckyOpen(id,percent){
  return axios({
    url:'/lucky/open',
	method: 'post',
	data:{
		id,
		percent
	}
  })
}

//回收
export function cash(data){
  return axios({
    url:'/cash',
	method: 'post',
	data:{
		data
	}
  })
}

//宝箱详情
export function BoxDetail(id) {
  return axios({
    url:'/box/detail',
	params:{
		id
	}
  })
}

//开箱
export function Open(id,num) {
  return axios({
    url:'/open',
	method: 'post',
	data: {
		id,
		num
	}
  })
}

//红包
export function Red(id,num) {
  return axios({
    url:'/red'
  })
}

//开红包
export function RedOpen(type,id,key) {
  return axios({
    url:'/red/open',
	method: 'post',
	data: {
		type,
		id,
		key
	}
  })
}

//批量赠送
export function AGive(data,invite_code) {
  return axios({
    url:'/give',
	method: 'post',
	data: {
		data,
		invite_code
	}
  })
}

//装备合成
export function Synthesis(data,out_id) {
  return axios({
    url:'/synthesis',
	method: 'post',
	data: {
		data,
		out_id
	}
  })
}

//合成装备列表
export function Synthesis_list(page){
  return axios({
    url:'/synthesis/list',
	params:{
		page
	}
  })
}

//信息列表
export function Message_List(page) {
	return axios({
		url:'/message/list',
		params:{
			page
		}
	})
}

//信息详情
export function Message_Detail(id) {
	return axios({
		url:'/message/detail',
		params:{
			id
		}
	})
}

//删除信息
export function Delete_Read(id) {
	return axios({
		url:'/message/delete',
		params:{
			id
		}
	})
}