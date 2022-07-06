<template>
	<div id="PublicFooter">
		<div class="PublicFooter-box">
				<div class="main">
					<div class="left">
						<div class="XY-box">
							<p @click="Toxx('/UnpackingRules')">提货规则</p>
							<p @click="Toxx('/UserAgreement')">用户协议</p>
							<p @click="Toxx('/Privacy')">隐私协议</p>
							<p @click="Toxx('/Explosion')">概率公平性</p>
						</div>
						<div class="Copyright">
							版权所有 ©2022 湖北荣亿盈网络科技有限公司 <a href="https://beian.miit.gov.cn/" style="color: rgb(255, 255, 255);">鄂ICP备2021019875号-1</a>
						</div>
						<div class="ZandW">
							<img src="@/assets/images/PublicFooter/footerZandW.png" alt="">
						</div>
					</div>
				</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'PublicFooter',
		data(){
			return{
				
			}
		},
		
		created() {
			
		},
		
		methods:{
			
			
			//查看规则
			Toxx(val){
				this.$router.push(val)
			},
		}
	}
</script>

<style lang="scss">
	#PublicFooter{
	     width: 100%;
	     padding-bottom: 0rem;
		 border-top:1px #b17ee7 solid;
		 .main{
			 width: 14rem;
			 margin: 0 auto;
			 padding: .2rem 0;
			 display: flex;
			 justify-content: space-between;
			 align-items: center;
			 .left{
				 width:50%;
				 box-sizing: border-box;
				 p{
					 font-size: 0.2rem;
					 color: #fff;
				 }
				 .logo_Zbt{
					 width: 1.2rem;
					 height: 0.3rem;
					 margin-top: 0.2rem;
					 img{
						 width: 100%;
						 height: 100%;
						 vertical-align: middle;
					 }
				 }
				 .left_txt{
					font-size: 0.18rem;
					margin-top: 0.2rem;
					color: #c6c6c6;
					line-height: 1.7em;
				 }
				 .XY-box{
					 display: flex;
					 margin-top: 0.2rem;
					 p{
						 width: 1rem;
						 height: 0.25rem;
						 border-right: 1px solid #fff;
						 padding-left: 0.1rem;
						 box-sizing: border-box;
						 margin-left: -1px;
						 font-size: 0.18rem;
						 line-height: 0.25rem;
						 cursor: pointer;
						 &:hover{
							 color: #5b6bff;
						 }
						 &:first-child{
							 padding-left: 0;
							 width: 0.9rem;
						 }
						 &:last-child{
							 border-right: none;
						 }
					 }
				 }
			 }
			 .right{
				 box-sizing: border-box;
				 .right_logo{
					 text-align: center;
					img{
						height: 1rem;
					} 
				 }
				 
			 }
			 .ZandW{
				 margin-top:0.2rem;
				 display: flex;
				 align-items: center;
				 a{
					 color: #ccc;
					 font-size: 12px;
				 }
			 }
		 }
		.Copyright{
			margin-top: .2rem;
			font-size: 0.16rem;
			color: #fff;
		}
	}
	 
</style>
