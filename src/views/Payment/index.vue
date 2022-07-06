<template>
	<div class="loadingbox">
		<van-loading color="#1989fa" size="80"/>
	</div>
</template>

<script>
	import { Recharge } from '@/network/api.js'
	export default{
		name:'',
		data(){
			return{
				
			}
		},
		created() {
			Recharge(this.$route.query.id,this.$route.query.type ).then((res) => {
				// console.log(res.data)		
				location.replace(res.data.list.qr_url)
				// if(this.$route.query.type == 'alipay'){
				// 	location.replace(res.data.list[0].qr_url)
				// }else{
				// 	location.replace(res.data.list[1].qr_url)
				// }	
			})
		}
	}
</script>

<style lang="scss">
	.loadingbox{
		width: 100%;
		height: 100vh;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		.van-loading{
			margin-bottom: 500px;
		}
	}
	
</style>
