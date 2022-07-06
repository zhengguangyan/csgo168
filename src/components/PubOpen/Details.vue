<template>
	<div id="Details">
		<div class="Details_box">
			<div class="num_Size">
				  <transition name="slide-fade">
					<img v-if="show" :src="NumIdx | ImgShow" alt="">
				  </transition>
				
			</div>
			<div class="Details_box_pic" :style="{'background-image': 'url('+DetailData.weapon_cover+')'}"  :class="this.$route.name == 'Lucky_open' ? 'active' : ''">
				<img v-show="this.$route.name != 'Activity_open'" :src="DetailData.cover" alt="">
			</div>
			<p v-show="this.$route.name != 'Activity_open'" class="Details_Price"><img src="@/assets/images/public/Gold.png" alt="">{{(DetailData.bean * NumIdx).toFixed(2)}}</p>
		</div>
	</div>
</template>

<script> 
	export default{
		name:'Details',
		props:{
			DetailData:{//宝箱数据
				type:Object
			},
			NumIdx:{//开启数量
				type:Number
			}
		},		
		data(){
			return{		
				show:true
			}
		},
		filters:{
			ImgShow(v){
				// console.log(v)
				if(v == 1){
					return require('@/assets/images/open/num1.png')
				}else if(v == 2){
					return require('@/assets/images/open/num2.png')
				}else if(v == 3){
					return require('@/assets/images/open/num3.png')
				}else if(v == 4){
					return require('@/assets/images/open/num4.png')
				}else if(v == 5){
					return require('@/assets/images/open/num5.png')
				}
			}
		},
		
		watch:{
			NumIdx(v){
				// console.log(v)
				this.show = false
				setTimeout(() => {
					this.show = true
				},300)
			}
		}
	}
</script>

<style lang="scss">
	#Details{
		padding: 10px;
		margin-top: -15px;
		box-sizing: border-box;
		
		.slide-fade-enter-active {
		  transition: all .3s ease;
		}
		.slide-fade-leave-active {
		  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
		}
		.slide-fade-enter, .slide-fade-leave-to
		/* .slide-fade-leave-active for below version 2.1.8 */ {
		  transform: translateX(10px);
		  opacity: 0;
		}
		
		.Details_box{
			width: 800px;
			height: 280px;
			margin: 0 auto;
			background: url(../../assets/images/open/box_back.png) no-repeat center;
			background-size: contain;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.num_Size{
				position: absolute;
				top: 0;
				right: 100px;
				width: 200px;
				height: 100px;
				img{
					max-width: 100%;
					max-height: 100%;
				}
			}
			.Details_box_pic{
				width: 230px;
				height: 230px;
				margin-right: 15px;
				background-position: center 10px;
				background-size: contain;
				background-repeat: no-repeat;
				&.active{
					display: flex;
					justify-content: center;
					align-items: center;
				}
				img{
					max-width: 80%;
					vertical-align: middle;
				}
			}
			.Details_Price{
				font-size: 24px;
				color: #75cd66;
				img{
					width: 24px;
					height: 24px;
					vertical-align: middle;
					margin-bottom: 2px;
				}
			}
		}
	}
</style>
