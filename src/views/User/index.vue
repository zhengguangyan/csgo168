<template>
	<div id="User">
		<div class="User">
			<div class="User_nav" style="display: none">
				<div class="User_top">
					<img src="@/assets/images/NavHeader/logo.png" alt="">
				</div>
				<p :class="{'active' : this.$route.name == 'About'}" @click="ToRoute('/About')"><img src="@/assets/images/NavHeader/GeR.png" alt="">个人中心</p>
				<p :class="{'active' : this.$route.name == 'Warehouse'}" @click="ToRoute('/Warehouse')"><img src="@/assets/images/NavHeader/BeiB.png" alt="">个人背包</p>
				<p :class="{'active' : this.$route.name == 'Extension'}" @click="ToRoute('/Extension')" style="color: #73d171"><img src="@/assets/images/NavHeader/ZZ.png" alt="">战队建设</p>
				<p v-if="salesman" :class="{'active' : this.$route.name == 'Rebate'}" @click="ToRoute('/Rebate')"><img src="@/assets/images/NavHeader/TuiG.png" alt="">流水佣金</p>
        <p :class="{'active' : this.$route.name == 'Information'}" @click="ToRoute('/Information')"><img src="@/assets/images/NavHeader/email.png" alt="">消息通知</p>
				<p :class="{'active' : this.$route.name == 'ChangePassword'}" @click="ToRoute('/ChangePassword')"><img src="@/assets/images/NavHeader/XiuG.png" alt="">修改密码</p>
				<p @click="SignOut"><img src="../../assets/images/NavHeader/TuiC.png" alt="">退出登录</p>
			</div>
			<div class="user_container">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script>
	import {
		PersonalInfo,
	} from '@/network/api.js'
	import {
		mapMutations
	} from 'vuex'
	export default{
		name:'User',
		data(){
			return{
				salesman:false
			}
		},
		created() {
			this.GetPersonalInfo()
		},
		methods:{
			//获取个人信息
			GetPersonalInfo() {
				PersonalInfo().then((res) => {
					const _data = res.data.message
					this.salesman = _data.salesman
				})
			},
			ToRoute(str){
				// console.log(str)
				this.$router.push(str)
			},
			//退出
			SignOut() {
				this.GetIndividualsShow(false)
				this.Leave()
				this.$router.push('/Home')
			},
			
			...mapMutations([
				'GetIndividualsShow',
				'Leave'
			])
		}
	}
</script>

<style lang="scss">
	.User{
		width: 100%;
		overflow: hidden;
		padding-top: 40px;
		//.User_nav{
		//	width: 20%;
		//	background: rgba($color: #000000, $alpha: .2);
		//	border-radius: 4px;
		//	padding: 20px 0;
		//	float: left;
		//	position: relative;
		//	.User_top{
		//		width: 100%;
		//		padding: 0 20px;
		//		box-sizing: border-box;
		//		margin-bottom: 20px;
		//		img{
		//			width: 100%;
		//		}
		//	}
		//	p{
		//		width: 100%;
		//		height: 50px;
		//		line-height: 50px;
		//		padding-left: 30px;
		//		box-sizing: border-box;
		//		font-size: 14px;
		//		cursor: pointer;
		//		&.active{
		//			background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
		//		}
		//		img{
		//			width: 25px;
		//			vertical-align: middle;
		//			margin-bottom: 2px;
		//			margin-right: 10px;
		//		}
		//	}
		//}
		.user_container{
			float: right;
			width: 98%;
			background: rgba($color: #000000, $alpha: .2);
			border-radius: 6px;
			position: relative;
		}
	}
</style>
