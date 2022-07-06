<template>
	<div id="PrizeDetails">
		<div class="PrizeDetails-box">
			<div class="Title">
				<p style="font-size: 0.22rem;">活动奖品</p>
				<div class="Title-lower"></div>
			</div>
			<div class="WinAPrize" v-if="status == 1">
				<p>幸运玩家</p>
				<div class="Winner">
					<div class="pic">
						<img :src="user.avatar" alt="">
					</div>
					<p>{{user.name}}</p>
				</div>
			</div>
			<div class="goods">
				<div class="goods-box">
					<div class="pic">
						<img :src="JiangPin_Img" alt="">
					</div>
				</div>
				<p>{{ JiangPin_name }}</p>
			</div>
			<div class="user-box">
				<div class="user-info">
					<p>参与用户</p>
					<p style="font-size: 0.26rem;">{{snatch_players.length}} / {{user_max_num}}</p>
				</div>
				<div class="user-list">
					<div class="user-item" v-for="(item,index) in snatch_players">
						<div class="pic">
							<img :src="item.user_info.avatar" alt="">
						</div>
						<p>{{item.user_info.name}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		Snatch_Detail
	} from '@/network/api.js'
	export default {
		name: 'PrizeDetails',
		data() {
			return {
				id: '',
				JiangPin_Img: '',
				snatch_players: [],
				user_max_num: '',
				status: 0,
				user: {},
				timer: null,
				JiangPin_name:''
			}
		},

		activated() {
			this.id = this.$route.query.id
		},

		methods: {
			GetSnatch_Detail(id) {
				Snatch_Detail(id).then((res) => {
					// console.log(res.data.data)
					this.user_max_num = res.data.data.user_max_num
					this.JiangPin_Img = res.data.data.awards[0].award_info.cover
					this.snatch_players = res.data.data.snatch_players
					this.status = res.data.data.status
					this.user = res.data.data.awards[0].user
					this.JiangPin_name = res.data.data.awards[0].award_info.name
				})
			},
			DingShi(id) {
				this.timer = setInterval(() => {
					// console.log(id)
					this.GetSnatch_Detail(id)
				}, 20000)
			},
		},
		beforeRouteLeave (to, from, next) {
		    clearInterval(this.timer)
			next()
		},

		watch: {
			id(val) {
				// console.log(val)
				this.GetSnatch_Detail(val)
				this.DingShi(val)
			}
		}
	}
</script>

<style lang="scss">
	.PrizeDetails-box{
		width: 100%;
		padding-top: 0.4rem;
		@keyframes rotate{
		    0%{
		        transform: rotate(0);
		      }
		    100%{
		          transform: rotate(360deg);
		    	}
			}
		.WinAPrize{
			width: 100%;
			margin-top: 0.2rem;
			box-sizing: border-box;
			text-align: center;
			p{
				font-size: 0.22rem;
			}
			.Winner{
				width: 2rem;
				margin: 0 auto;
				.pic{
					width: 1rem;
					height: 1rem;
					margin: 0.3rem auto;
					position: relative;
					&::after{
						display: block;
						content: "";
						width: 2rem;
						height: 1.5rem;
						position: absolute;
						left: -0.49rem;
						top: -0.2rem;
						background: url(../../assets/images/Rank/border.png) no-repeat center;
						background-size: 100%;
					}
					&::before{
						display: block;
						content: "";
						width: 1.8rem;
						height: 1.8rem;
						position: absolute;
						left: -0.3rem;
						top: -0.3rem;
						background: url(../../assets/images/Rank/light.png) no-repeat center;
						background-size: cover;
						transition: 0.05s;
						animation: rotate 3s linear infinite;
					}
					img{
						width: 100%;
						height: 100%;
						border-radius: 50%;
						position: relative;
						z-index: 10;
					}
				}
			}
		}
		
		.goods{
			margin-top: 0.2rem;
			width: 100%;
			.goods-box{
				width: 5rem;
				height: 5rem;
				margin: 0 auto;
				background: url(../../assets/images/PublicImg/H6K.png) no-repeat center;
				background-size: 100%;
				.pic{
					width: 4.5rem;
					height: 4.5rem;
					margin: 0 auto;
					display: flex;
					justify-content: center;
					align-items: center;
					img{
						vertical-align: middle;
						max-width: 100%;
						max-height: 100%;
					}
				}
			}
			p{
				width: 100%;
				height: 0.5rem;
				text-align: center;
				line-height: 0.5rem;
				font-size: 0.22rem;
				margin-bottom: 0.3rem;
			}
		}
		
		.user-box{
			width: 100%;
			background-color: #20222b;
			background-size: cover;
			padding: 0.2rem;
			box-sizing: border-box;
			.user-info{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				p{
					font-size: 0.20rem;
					color: #fff;
				}
			}
			.user-list{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.user-item{
					width: 1rem;
					margin: 0.3rem 0.14rem 0 0;
					&:nth-child(12n){
						margin-right: 0;
					}
					.pic{
						width: .8rem;
						height: .8rem;
						margin: 0 auto;
						border-radius: 50%;
						overflow: hidden;
						border: 1px solid rgb(255, 211, 34);
						img{
							width: 100%;
							height: 100%;
							vertical-align: middle;
						}
					}
					p{
						font-size: 0.12rem;
						color: #fff;
						text-align: center;
						margin-top: 0.02rem;
					}
				}
				
			}
		}
	}
</style>
