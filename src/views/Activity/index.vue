<template>
	<div id="Activity">
		<div class="Activity_box">
			<div class="Title">
				<p>福利箱</p>
			</div>
			<div class="Activity_list">
				<div class="Activity_list_item" v-for="(item,index) in Welfare_Arr" :key="index" @click="ToOpen(item.type,item.box_id,item.id)">
					<div class="ceng"></div>
					<div class="Type">{{item.type | GL_type}}</div>
					<div class="pic">
						<img v-lazy="item.box.intact_cover">
					</div>
					<div class="name">
						<p>{{item.box.name}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		Welfare
	} from '@/network/api.js'
	export default {
		name: 'Activity',
		data() {
			return {
				Welfare_Arr: []
			}
		},

		created() {
			this.GetWelfare()
		},
		
		
		filters:{
			GL_type(str){
				if(str == '1'){
					return '新人福利箱'
				}else if(str == '2'){
					return '推广活动箱'
				}else if(str == '3'){
					return '充值活动箱'
				}else if(str == '4'){
					return 'CDK活动箱'
				}
			}
		},
		
		methods: {
			//福利列表
			GetWelfare() {
				Welfare().then((res) => {
					this.Welfare_Arr = res.data.data
					// console.log(res.data.data)
				})
			},
			
			//路由跳转开箱
			ToOpen(type,activityid,id){
				this.$router.push({
					path:'/Activity_open',
					query:{
						type:type,
						activityid:activityid,
						id:id
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.Activity_box {
		width: 100%;
		padding-top: 0.4rem;

		.Activity_list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.Activity_list_item {
				width: 2.4rem;
				cursor: pointer;
				margin: 0.4rem 0 0.2rem;
				box-sizing: border-box;
				margin-right: 0.5rem;
				border-radius: 0.04rem;
				padding: 0.2rem 0;
				border: 1px solid transparent;
				position: relative;
				&:nth-child(5n){
					margin-right: 0;
				}
				
				
				
				.Type{
					width: 100%;
					height: 0.3rem;
					text-align: center;
					line-height: 0.3rem;
					font-size: 0.22rem;
					color: white;
				}
				
				.pic {
					width: 2rem;
					height: 2rem;
					margin: 0 auto;
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 10;

					img {
						max-width: 100%;
						max-height: 100%;
						transition: .3s;
					}
				}

				.name {
					width: 100%;
					height: 0.4rem;
					display: flex;
					justify-content: center;
					margin-top: 0.1rem;
					
					p {
						display: inline-block;
						margin: 0 auto;
						padding: 0 0.2rem;
						height: 0.4rem;
						line-height: 0.4rem;
						font-size: 0.16rem;
						border:1px solid #ffba2e;
						color: #ffba2e;
						text-align: center;
						border-radius: 8px;
					}
				}

			}
		}
	}
</style>
