<template>
	<div id="Rebate">
		<div class="Rebate-box">
			<div class="Title">
				<p>流水佣金</p>
			</div>
			<div class="Extension_data">
				<div class="data_tit">
					<p>您的有效下级</p>
					<p>您的返佣收益</p>
					<p>您的推广总盈利</p>
				</div>
				<div class="data_info">
					<p>{{info.totalInvite}}人</p>
					<p>{{info.bonus}}%</p>
					<p><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{info.totalRebate}}</p>
				</div>
			</div>


			<div class="RankAndsub" style="color: white">
				<div class="sub">
					<div>
						<div>
							<div class="sub_item">
								<div class="time">时间</div>
								<div class="amount">金额</div>
								<div class="sub_user">用户</div>
								<div class="income">收入</div>
							</div>
							<div class="sub_item" v-for="(item,index) in UserList" :key="index">
								<div class="time" style="font-size: 12px;">{{item.created_at}}</div>
								<div class="amount"><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.charge_bean}}</div>
								<div class="sub_user">{{item.name}}</div>
								<div class="income"><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.bean}}</div>
							</div>
						</div>
					</div>
					<div class="PageNum">
						<el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page"
						 :total="total">
						</el-pagination>
					</div>
				</div>


			</div>
		</div>
	</div>
</template>

<script>
	import {
		Bonus,
		Rebate
	} from '@/network/api.js'
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'Rebate',
		data() {
			return {
				info:'',
				UserList:''
			}
		},

		created() {
			this.GetRebate(1)
			this.GetBonus()
		},
		
		methods: {
			//合作推广信息
			GetBonus() {
				Bonus().then((res) => {
					this.info = res.data.data;
				})
			},
			// 下线列表分页
			handleCurrentChange(val) {
				this.GetRebate(val)
			},
			//下线列表
			GetRebate(val) {
				this.loadingShow = true
				Rebate(val).then((res) => {
					this.UserList = res.data.data[0].data
					this.total = res.data.data[0].total
					this.per_page = res.data.data[0].per_page
				})
			},
		},
		computed: {
		},
		watch: {
		}
	}
</script>

<style lang="scss">
	.Rebate-box {
		width: 100%;
		padding: .4rem .2rem;
		box-sizing: border-box;
		margin: 0 auto;

		.Extension_copy {
			width: 100%;
			height: 80px;
			display: flex;
			align-items: center;

			.link {
				width: 500px;
				height: 100%;

				p {
					font-size: 14px;
					color: #fff;
					margin-bottom: 5px;
				}

				.link_box {
					height: 40px;
					display: flex;
					align-items: center;

					.Ipt {
						width: 420px;
						height: 40px;
						font-size: 20px;
						color: #fff;
						line-height: 40px;
						padding-left: 10px;
						border-radius: 4px;
						box-sizing: border-box;
						border: 1px solid hsla(0, 0%, 100%, .2);
					}

					span {
						width: 100px;
						height: 40px;
						font-size: 14px;
						background: #ffd322;
						border-radius: 4px;
						color: #fff;
						text-align: center;
						line-height: 40px;
						margin-left: 10px;
						cursor: pointer;
						color: #000;
					}
				}

				.MX {
					font-size: 12px;
					color: #ccc;
					margin-top: 10px;

					span {
						color: #ffd322;
						cursor: pointer;
					}
				}
			}

			.code {
				width: 350px;
				height: 100%;
				margin-left:20px;

				p {
					font-size: 14px;
					color: #fff;
					margin-bottom: 5px;
				}

				.code_box {
					height: 40px;
					display: flex;
					align-items: center;

					input {
						width: 420px;
						height: 40px;
						font-size: 22px;
						color: #fff;
						line-height: 40px;
						padding-left: 10px;
						border-radius: 4px;
						box-sizing: border-box;
						border: 1px solid hsla(0, 0%, 100%, .2);
					}

					span {
						width: 100px;
						height: 40px;
						font-size: 14px;
						background: #ffd322;
						border-radius: 4px;
						color: #000;
						text-align: center;
						line-height: 40px;
						margin-left: 10px;
						cursor: pointer;
					}
				}
			}
		}


		.Extension_banner {
			width: 100%;
			margin: 40px 0;

			img {
				width: 100%;
			}
		}

		.key_box {
			width: 100%;

			.key_tit {
				text-align: center;
				line-height: 1.75em;
				font-size: 18px;
				color: #c6c4d8;
				padding: 0 30px;
				box-sizing: border-box;
				p{
					display: inline;
				}
				span {
					color: rgb(255, 211, 34);
				}
			}

			.key_list {
				width: 100%;
				margin-top: 20px;

				.key_item {
					width: 100%;
					height: 45px;
					display: flex;
					justify-content: center;
					align-items: center;

					p {
						font-size: 16px;
						color: #fff;

						span {
							color: rgb(255, 211, 34);
							font-weight: bold;
						}

						img {
							width: 18px;
							vertical-align: middle;
							margin-bottom: 2px;
							margin-left: 2px;
							margin-right: 2px;
						}
					}

					i {
						font-style: normal;
						margin-right: 50px;
					}

					span {
						color: rgb(255, 211, 34);
						font-size: 18px;

						img {
							width: 26px;
							vertical-align: middle;
							margin-bottom: 2px;
							margin-left: 2px;
							margin-right: 2px;
						}
					}
				}
			}
		}

		.Extension_data {
			width: 100%;
			margin-top: 20px;

			.data_tit {
				width: 100%;
				margin: 0 auto;
				height: 60px;
				line-height: 60px;
				display: flex;
				font-size: 14px;
			}

			.data_info {
				width: 100%;
				margin: 0 auto;
				height: 112px;
				background: rgba($color: #fff, $alpha: .05);
				display: flex;
				line-height: 112px;

				p {
					border-right: 1px solid rgba($color: #000000, $alpha: .3);
					font-size: 22px;
				}
			}

			p {
				flex: 1;
				padding-left: 20px;
				box-sizing: border-box;

				img {
					width: 26px;
					vertical-align: middle;
					margin-bottom: 6px;
				}
			}
		}

		.RankAndsub {
			width: 100%;
			margin-top: 20px;
			display: flex;
			justify-content: space-between;

			.Rank {
				width: 4rem;
				background: rgba($color: #fff, $alpha: .03);

				.Rank_item {
					width: 100%;
					height: 80px;
					display: flex;
					border-bottom: 1px solid rgba($color: #fff, $alpha: .1);

					p {
						flex: 1;
						text-align: center;
						line-height: 80px;
						font-size: 16px;
						color: #fff;

						img {
							width: 15px;
							vertical-align: middle;
							margin-bottom: 2px;
							margin:0 4px;
						}
					}

					&:first-child {
						height: 60px;
						background: rgba(0, 0, 0, .4);

						p {
							line-height: 60px;
							font-size: 14px;
						}
					}

					&:last-child {
						border: none;
					}
				}
			}

			.sub {
				width: 100%;
				background: rgba($color: #fff, $alpha: .03);

				img {
					width: 20px;
					vertical-align: middle;
					margin-bottom: 2px;
				}

				.sub_item {
					width: 100%;
					height: 80px;
					display: flex;
					border-bottom: 1px solid rgba($color: #fff, $alpha: .1);
					font-size: 16px;
					line-height: 80px;

					.time {
						width: 30%;
						height: 100%;
						padding-left: 20px;
						box-sizing: border-box;
					}

					.amount {
						width: 20%;
						height: 100%;
						padding-left: 20px;
						box-sizing: border-box;
					}

					.sub_user {
						width: 20%;
						height: 100%;
						padding-left: 20px;
						box-sizing: border-box;
					}

					.income {
						width: 30%;
						height: 100%;
						padding-left: 20px;
						box-sizing: border-box;
					}

					&:first-child {
						height: 60px;
						background: rgba(0, 0, 0, .4);
						line-height: 60px;
						font-size: 14px;
					}

					&:last-child {
						border: none;
					}
				}
				
				.PageNum {
					width: 100%;
					text-align: center;
					margin: 20px 0;
				
					li {
						background: #111111 !important;
				
						&.active {
							background: #4854c9 !important;
						}
				
						&:hover {
							color: #fff !important;
						}
					}
				
					.btn-prev,
					.btn-next {
						background: #111111;
					}
				}
			}
		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.wrapper-box {
				.wrapper-box-top {
					width: 100%;
					height: 0.03rem;
					background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
				}

				width: 7.5rem;
				height: 3rem;
				position: relative;
				border: 1px solid rgba($color: #fff, $alpha: .6);
				background-color: rgba($color: #000, $alpha: .7);
				border-radius: 0.08rem;
				overflow: hidden;
				padding: 0 0.35rem;
				box-sizing: border-box;

				span {
					display: block;
					text-align: center;
					font-size: 0.24rem;
					margin: 0.2rem 0 0.2rem;
				}

				p {
					font-size: 0.14rem;
					margin-bottom: 0.1rem;
					line-height: 1.75em;
				}

				.Tutorial {
					width: 100%;
					height: 100%;
					box-sizing: border-box;

					.title {
						width: 100%;
						height: 0.95rem;
						line-height: 0.95rem;
						text-align: center;
						font-size: 0.26rem;
					}

					.Tutorial-box {
						width: 100%;
						display: flex;
						justify-content: space-between;

						.JianTou {
							margin-top: 0.2rem;
						}

						.Tutorial-item {
							width: 1.6rem;
							text-align: center;

							.pic {
								width: 0.8rem;
								height: 0.8rem;
								margin: 0 auto;

								img {
									width: 100%;
									height: 100%;
								}
							}

							p {
								font-size: 0.16rem;
								color: #fff;
								margin-top: 0.1rem;
							}

							.info {
								color: rgba(255, 255, 255, 0.6);
								font-size: 0.14rem;
								line-height: 1.75em;
							}
						}
					}
				}

				.cancel {
					width: 0.5rem;
					height: 0.5rem;
					position: absolute;
					top: 0;
					right: 0;
					text-align: center;
					line-height: 0.5rem;

					img {
						width: 0.15rem;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>
