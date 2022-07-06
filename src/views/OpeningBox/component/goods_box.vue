<template>
	<div id="goods_box">
		<div class="pic">
			<img :src="pic" alt="">
		</div>
	</div>
</template>

<script>
	export default{
		name:'goods_box',
		props:{
			pic:{
				type:String
			}
		},
		
		filters:{

		},
		data(){
			return{
				Wpic:''
			}
		},
		
		watch:{
			pic(v){
				// this.Wpic = localStorage.getItem('static_file_url') + v
			}
		}
	}
</script>

<style lang="scss">
	#goods_box{
		width: 8rem;
		height:2.5rem;
		// background: url(../../../assets/images/OpenBox/openbox.png) no-repeat center;
		background-size: 100% 100%;
		margin: 0.2rem auto 0;
		.pic{
			width: 100%;
			height: 100%;
			text-align:center;
			// margin: 0 auto;
			// display: flex;
			// justify-content: center;
			// align-items: center;
			img{
				height:100%;
				vertical-align: middle;
			}
		}
	}
</style>
