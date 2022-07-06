<template>
	<div class="roll-info">
		<div class="block roll-head">
			<h4 class="time" v-show="data.type == '1'">{{ data.start_time || data.end_time }}</h4>
			<h4 class="time" v-show="data.type == '2'">当前玩家数量: {{data.join_number}}/{{data.people_number}}</h4>
			<div class="header" :style="'background-image: url(' + data.user.avatar + ');'"></div>
			<div style="margin-left:1rem;">
				<h2 class="name">{{ data.name }}</h2>
				<div style="line-height:28px;">
					{{data.describe}}<br>
					要求：{{data.pay_start_time}} 时间后充值{{data.min_recharge}}C币以上用户<br>
					开奖时间：{{ data.start_time || data.end_time }}
				</div>
			</div>

			
			<div class="btn" v-show="data.status == 1" @click="JoinHome()">我要加入</div>
		</div>
		<div class="block item-box" v-show="data.status == 2">
			<div class="Title" style="margin-top: .4rem;">
				<p>获奖用户</p>
				<div class="info">
					共有{{ data.box_records.length }}件
				</div>
			</div>
			<div class="Goods_list">
				<div class="Goods_item" :class="'lv_'+item.lv" v-for="(item,index) in data.box_records" :key="index">
					<div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt=""> {{item.bean}}</div>
					<div class="dura_alias">{{item.dura_alias}}</div>
					<div class="Goods_pic" :style="{'background-image': 'url('+item.lv_bgImage+')'}">
						<img :src="item.cover" alt="">
					</div>
					<p>{{item.name}}</p>
					<div class="user">
						<div class="header">
							<img :src="item.user? item.user.avatar : ''" alt="" />
						</div>
						<div class="name">{{ item.user?item.user.name:"" }}</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="block item-box">
			<div class="Title" style="margin-top: .4rem;">
				<p>活动奖池</p>
				<div class="info">
					共有{{ data.box_records.length }}件，总价值：${{
						data.award_bean
					}}
				</div>
			</div>
			<div class="Goods_list">
				<div class="Goods_item" :class="'lv_'+item.lv" v-for="(item,index) in data.box_records" :key="index">
					<div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt=""> {{item.bean}}</div>
					<div class="dura_alias">{{item.dura_alias}}</div>
					<div class="Goods_pic" :style="{'background-image': 'url('+item.lv_bgImage+')'}">
						<img :src="item.cover" alt="">
					</div>
					<p>{{item.name}}</p>
				</div>
			</div>
		</div>
		<div class="block item-box">
			<div class="Title" style="margin-top: .4rem;">
				<p>参与玩家</p>
			<div class="info">共{{ data.join_number }}人</div>
			</div>
			<div class="user-list">
				<div class="item" v-for="(value, key) in data.room_users" :key="key">
					<div class="header">
						<img :src="value.avatar" alt="" />
					</div>
					<div class="name">{{ value.name }}</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="input-box" v-show="input">
				<div class="box">
					<div class="pwd">
						<el-input placeholder="请输入密码" v-model="pwd" show-password></el-input>
					</div>
					<div class="btn close" @click="input = false">取消</div>
					<div class="btn verify" @click="JoinHome(pwd)">确认</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import {
		SRollInfo,
		SJoinHome
	} from "@/network/server";
	import myMixin from "@/utils/mixin";
	export default {
		mixins: [myMixin],
		data() {
			return {
				data: {
					name: "",
					start_time: "",
					end_time: "",
					status: 0,
					box_records: [],
					user: {
						avarar: "",
					},
					room_users: [],
					join_number: 0,
					award_bean: 0,
				},
				input: false,
				pwd: "",
			};
		},
		
		created() {
			this.RollInfo();
		},
		watch: {
			$route(to, from) {
				if (to.name == "room") {
					this.RollInfo();
				}
			},
		},
		methods: {
			RollInfo() {
				SRollInfo(this.$route.query.id).then((data) => {
					this.data = data;
					// console.log(data);
				});
			},
			JoinHome(pwd) {
				if (this.data.is_pwd && !pwd) {
					this.input = true;
					return;
				}
				SJoinHome(this.$route.query.id, pwd)
					.then((data) => {
						this.Success("加入成功");
						this.input = false;
					})
					.catch((err) => {
						this.Err(err.message);
						this.input = false;
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s;
	}

	.fade-enter,
	.fade-leave-to {
		transform: translateX(3rem);
		opacity: 0;
	}

	.roll-info {
		.Goods_list {
				width: 100%;
				display: flex;
				padding: 5px 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				margin-top: 20px;

				.Goods_item {
					width: 19%;
					text-align: center;
					color: #fff;
					margin-bottom: 10px;
					margin-right: 1%;
					padding: 20px 0 10px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					position: relative;
					background-color:#716778;
					&.lv_1{
						background-color: rgba(145, 95, 77, 0.5);
					}
					&.lv_2{
						background-color: rgba(153, 53, 138, 0.5);
					}
					&.lv_3{
						background-color: rgba(133, 81, 171, 0.5);
					}
					&.lv_4{
						background-color: rgba(73, 72, 184, 0.3);
					}

					.user {
						width: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: .12rem;
						.header {
							width: 0.3rem;
							height: 0.3rem;
							border-radius: 50%;
							overflow: hidden;
							margin-right: .05rem;

							img {
								width: 100%;
								height: 100%;
							}
						}

						.name {
							font-size: 0.5em;
						}
					}

					.odds_percent {
						position: absolute;
						left: 5px;
						top: 10px;
						font-size: 13px;
						text-align: left;
						padding: 2px 8px;
						border-radius:10px;
						box-sizing: border-box;
						color: #ffd926;
						line-height:20px;
						img{width:20px;float:left;}
					}

					.dura_alias {
						position: absolute;
						right: 0;
						top: 12px;
						font-size: 10px;
						text-align: left;
						padding-right: 10px;
						box-sizing: border-box;
						color: #fff;
						line-height:20px;
					}

					.Goods_pic {
						width: 80%;
						height: 160px;
						margin: 10px auto 0;
						display: flex;
						justify-content: center;
						align-items: center;
						background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
						background-position: center;
						background-size: 80%;
						background-repeat: no-repeat;

						img {
							max-width: 90%;
							vertical-align: middle;
						}
					}

					p {
						width: 100%;
						padding: 0 3px;
						box-sizing: border-box;
						font-size: 14px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin: 10px 0;
					}

					span {
						display: flex;
						justify-content: center;
						align-items: center;
						color: #75cd66;
						font-size: 16px;
						margin: 5px 0 0;

						img {
							width: 20px;
						}
					}
				}
			}
		.Title{
			margin:0.4rem 0 0.2rem;
			p{
				padding-left:40px;
				&::before{
					left:-30px;
				}
			}
		}
		padding-top: .4rem;
		.block {
			position: relative;
			// background: url(../../assets/images/Roll/ROLL_boxBack.png) no-repeat center;
			background-size: cover;
			margin: 0.3rem 0 0.2rem;
			padding: 0.02rem;
			overflow: hidden;

			.info {
				color:#d2a9fd;
				display:inline-block;
			}
		}

		.roll-head {
			border:5px #d2a9fd solid;
			box-sizing: border-box;
			padding:25px;
			color:#d2a9fd;

			.header {
				width: 0.8rem;
				height: 0.8rem;
				background-color: rgb(80, 80, 80);
				background-size: 100% 100%;
				border-radius: 50%;
				text-align: center;
				line-height: 1.2rem;
				float:left;
				margin-right:0.2rem;
			}

			.name {
				font-size:0.2rem;
				color:#fff;
			}

			.limit {
				font-size: 0.16rem;
			}

			.MiaoShu {
				height: 0.3rem;
				line-height: 0.3rem;
				font-size: 0.16rem;
				white-space: nowrap; //不换行
				overflow: hidden; //超出隐藏
				text-overflow: ellipsis; //变成...
				margin: .2rem 0;
			}

			.time {

				font-size: 0.2rem;
				margin-bottom: .2rem;
			}

			.btn {
				width: 2rem;
				height: .4rem;
				background:#a160c0;
				border-radius: 100px;
				text-align: center;
				line-height: .4rem;
				color: #fff;
				cursor: pointer;
				position:absolute;
				right:25px;
				bottom:25px;
			}
		}

		.item-box {
			.awards-list {
				display: flex;
				flex-wrap: wrap;
				position: relative;
				.line {
					position: relative;
					width: 2rem;
					overflow: hidden;
					margin-right: .39rem;
					background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
					background-size: 100% 100%;
					margin-bottom: .3rem;
					&:nth-child(6n){
						margin-right: 0;
					}
					.award {
						width: 2rem;
						
						text-align: center;
						background-size: 100% 100%;

						.pic{
							width: 100%;
							height: 1.2rem;
							background-repeat: no-repeat;
							background-size: 60%;
							background-position: center;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-bottom: .1rem;
							img {
								max-width: 80%;
								max-height: 80%;
							}
						}

						.name {
							width: 100%;
							padding: 0 .05rem;
							box-sizing: border-box;
							margin-bottom: .16rem;
							font-size: 0.5em;
						}

						.quality {
							width: 100%;
							font-size: 0.5em;
						}

						.price {
							font-size: 0.14rem;
							margin: 0.1rem;
							display: flex;
							justify-content: center;
							align-items: center;
							img{
								width: .2rem;
								height: .2rem;
								vertical-align: middle;
								margin: 0;
								margin-right: 0.03rem;
							}
						}
					}
				}
			}

			@for $i from 1 through 5 {
				.roll-lv#{$i} {
					background-image: url(lv-img($i));
				}
			}

			.item-list {
				display: flex;
				flex-wrap: wrap;

				.item {
					width:2rem;
					margin-right: 0.39rem;
					text-align: center;
					background-size: 100% 100%;
					background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
					background-size: 100% 100%;
					padding: .1rem 0;
					&:nth-child(6n){
						margin-right: 0;
					}
					margin-bottom: .39rem;
					.pic{
						width: 100%;
						height: 1.4rem;
						background-repeat: no-repeat;
						background-size: 60%;
						background-position: center;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: .1rem;
						img {
							max-width: 90%;
							max-height: 90%;
						}
					}
					

					.name {
						width: 100%;
						font-size: 0.5em;
						padding: 0 .05rem;
						box-sizing: border-box;
						margin-bottom: .16rem;
						margin-top: .1rem;
					}

					.quality {
						width: 100%;
						font-size: 0.5em;
					}

					.price {
						font-size: 0.14rem;
						margin: 0.1rem;
						display: flex;
						justify-content: center;
						align-items: center;
						img{
							width: .2rem;
							height: .2rem;
							vertical-align: middle;
							margin: 0;
							margin-right: .03rem;
						}
					}
				}
			}

			.user-list {
				display: flex;
				flex-wrap: wrap;

				.item {
					width: 1rem;
					margin: 0.19rem;
					text-align: center;

					.header {
						width: 0.8rem;
						height: 0.8rem;
						margin: 0.1rem;
						border-radius: 50%;
						overflow: hidden;

						img {
							width: 0.8rem;
							height: 0.8rem;
						}
					}

					.name {
						width: 100%;
						font-size: 0.5em;
						color:#d2a9fd;
					}
				}
			}
		}

		.input-box {
			position: fixed;
			top: 3rem;
			right: 1rem;
			box-shadow: 0.02rem 0.02rem 0.1rem rgba(0, 0, 0, 0.5);
			z-index: 200;

			.box {
				width: 2.8rem;
				height: 1.3rem;
				background: rgba($color:#211111, $alpha:0.95);
				border-radius: 0.03rem;

				.pwd {
					position: absolute;
					width: 2.4rem;
					height: 0.4rem;
					margin: 0.2rem;
				}

				@include input(rgb(218, 218, 218));

				.btn {
					position: absolute;
					box-sizing: border-box;
					@include btn(1.1rem,
					0.4rem,
					rgb(218, 218, 218));
				}

				.close {
					left: 0.2rem;
					top: 0.7rem;
				}

				.verify {
					right: 0.2rem;
					top: 0.7rem;
				}
			}
		}
	}
</style>
