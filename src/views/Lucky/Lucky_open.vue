<template>
	<div id="Lucky_open">
		<div class="Lucky_open_box">
			<div class="Title">
				<p>{{DetailData.name}}</p>
			</div>
			<!-- <Details :DetailData="DetailData" :NumIdx="NumIdx/100" v-show="AnimationShow == '0'"></Details> -->
			<div class="lucky_details" v-show="AnimationShow == '0'">
				<div class="random">
					<div class="random_box">
						<p>随机饰品</p>
						<div class="pic">
							<img src="@/assets/images/Lucky/A.png" alt="">
						</div>
						<div class="pic_D">
							<img src="@/assets/images/Lucky/left_pic.png" alt="">
						</div>
					</div>
				</div>
				<div class="WaterBall">
					<div id="WaterBall" style="width:400px;height:400px;"></div>
				</div>
				<div class="wantto">
					<div class="wantto_box">
						<p>幸运饰品</p>
						<div class="pic">
							<img :src="DetailData.cover" alt="">
						</div>
						<div class="pic_D">
							<img src="@/assets/images/Lucky/right_pic.png" alt="">
						</div>
					</div>
				</div>
			</div>
			<Dynamic :DetailList="DetailList" :Awardlist="AwardArr" :Dynamic_checked="Dynamic_checked" :Dynamic_num="Dynamic_num"
			 @setAnimation="setAnimation" @setEquipment="setEquipment" v-show="AnimationShow == '1'"></Dynamic>

			<div class="box_proportion">
				<div class="proportion_item min">
					<div class="shadow"></div>
					{{100 - NumIdx}}%
				</div>
				<div class="proportion_out">
					<el-slider v-model="NumIdx" :min="5" :max="75" @change="onChange"></el-slider>
				</div>


				<div class="proportion_item max">
					<div class="shadow"></div>
					{{NumIdx}}%
				</div>
			</div>


			<div class="price_box" v-show="AnimationShow == '0'">
				<img src="@/assets/images/public/Gold.png" alt="">{{(DetailData.bean * (NumIdx/100)).toFixed(2)}}
			</div>
			<div class="open_btn" v-show="AnimationShow == '0'">
				<van-button type="info" size="small" @click="PostOpen">OPEN</van-button>
				<div class="Animation_switch">
					<p>跳过动画</p>
					<van-switch v-model="Animation_checked" size="24px" />
				</div>
			</div>
			<Equipment :Dynamic_num="Dynamic_num" :EquipmentItem="EquipmentItem" v-show="EquipmentShow == '1'" :key="EquipmentShow"></Equipment>
			<Show v-show="WinningShow" :WinningShow="WinningShow" @setShow="setShow" :Awardlist="Awardlist"></Show>
		</div>

	</div>
</template>

<script>
	import Details from '@/components/PubOpen/Details.vue'
	import Dynamic from '@/components/PubOpen/Dynamic.vue'
	import Equipment from '@/components/PubOpen/Equipment.vue'
	import Show from '@/components/PubOpen/Show.vue'
	import {
		AwardGet,
		LuckyOpen,
		PersonalInfo
	} from '@/network/api.js'
	import {
		mapMutations
	} from 'vuex'
	import 'echarts-liquidfill/src/liquidFill.js';
	export default {
		name: 'Open',
		data() {
			return {
				DetailData: {}, //箱子信息
				NumIdx: 5, //箱子比列
				DetailList: [], //箱内物品
				Animation_checked: false, //动画开关
				WinningShow: false, //奖品遮罩层
				Awardlist: [], //获得奖品数据
				AwardArr: [], //获得奖品数据(操作后)
				Dynamic_checked: '0', //播放动画('0':不播放,'1':播放)
				Dynamic_num: 0, //奖品数量
				AnimationShow: '0', //动画显示隐藏'0':不显示,'1':显示)
				EquipmentItem: {}, //下方奖品栏子级
				EquipmentShow: '0', //下方奖品栏显示
				WaterBallArr: [.05, .04, .03]
			}
		},

		activated() {
			this.GetAwardGet()
		},
		mounted() {
			this.echartsMit()
		},

		methods: {
			//宝箱详情
			GetAwardGet() {
				AwardGet(this.$route.query.id).then((res) => {
					// console.log(res.data.data)
					this.DetailData = res.data.data[0]
					// console.log(this.DetailData)
					let Arr = []
					Arr.push(res.data.data[0], {
						cover: require('@/assets/images/Lucky/cheap.png')
					})
					this.DetailList = Arr.concat(Arr)
					// console.log(this.DetailList)
				})
			},

			//开箱
			PostOpen() {
				LuckyOpen(this.$route.query.id, (this.NumIdx / 100)).then((res) => {
					// console.log(this.NumIdx/100)
					// console.log(res.data.data.awardlist)
					this.GetPersonalInfo()
					this.Awardlist = res.data.data.awardlist
					// if(res.data.data.awardlist)

					if (res.data.data.awardlist[0].name == this.DetailData.name) {
						this.AwardArr = res.data.data.awardlist
					} else {
						this.AwardArr = [{
							cover: require('@/assets/images/Lucky/cheap.png')
						}]
					}

					if (this.Animation_checked == true) {
						this.WinningShow = true
					} else {
						this.AnimationShow = '1'
						this.EquipmentShow = '1'
						// console.log('false')
						setTimeout(() => {
							this.Dynamic_checked = '1'
							this.Dynamic_num = this.Awardlist.length
						}, 100)
					}
				})
			},

			//水型球
			echartsMit() {
				let dom = document.getElementById('WaterBall')
				// console.log(dom);
				let myChart = this.$echarts.init(dom);
				myChart.setOption({
					series: [{
						type: 'liquidFill',
						data: this.WaterBallArr,
						color: ['#ff348e', '#fe74d4', '#db38b7'],
						backgroundStyle: {
							borderWidth: 1,
							color: '#6b3ba8'
						},
						itemStyle: {
							shadowBlur: 0,
						},
						outline: {
							borderDistance: 0,
							itemStyle: {
								borderWidth: 3,
								borderColor: '#6c3ba8',
								shadowBlur: 20,
							}
						},
						label: {
							normal: {
								textStyle: {
									color: '#fff',
									insideColor: 'yellow',
									fontSize: 40
								}
							}
						},
					}]
				});

			},

			//
			onChange(val) {
				// console.log(val)
			},

			//个人信息
			GetPersonalInfo() {
				PersonalInfo().then((res) => {
					this.User(res.data.message)
				})
			},

			//接收子级(关闭奖品遮罩层)
			setShow(v) {
				// console.log(v)
				this.WinningShow = v
				this.EquipmentShow = '0'
			},

			//接收子级(动画结束)
			setAnimation(v) {
				this.WinningShow = v
				this.AnimationShow = '0'
				this.Dynamic_checked = '0'
			},

			//接收子级(下方奖品栏)
			setEquipment(v) {
				// console.log(v)
				this.EquipmentItem = this.Awardlist[v - 1]
			},

			...mapMutations([
				'User'
			])
		},
		
		watch:{
			NumIdx(v){
				// console.log(v)
				this.WaterBallArr[0] = (v/100).toFixed(2)
				this.WaterBallArr[1] = (v/100 - .01).toFixed(2)
				this.WaterBallArr[2] = (v/100 - .02).toFixed(2)
				// console.log(this.WaterBallArr)
				this.echartsMit()
			}
		},
		
		components: {
			Details,
			Dynamic,
			Equipment,
			Show
		}
	}
</script>

<style lang="scss">
	.Lucky_open_box {
		padding-top: 40px;
		.el-slider__button{
			border-color:#ffd926;
			background-color: #ffd926;
		}
		.el-slider__bar{
			background-color: #ffd926;
		}
		.el-slider__runway{
			background:none;
			border:1px #fff solid;
		}
		@keyframes myfirst
		{
		0%   {transform: translateY(0)}
		100%   {transform: translateY(.3rem)}
		}
		.lucky_details {
			width: 100%;
			height: 280px;
			display: flex;
			margin-top: 1rem;
			.random {
				flex: 1;
				background: url(../../assets/images/Lucky/left_back.png) no-repeat center;
				background-size: contain;

				.random_box {
					width: 100%;
					height: 100%;
					padding: .4rem 0;
					box-sizing: border-box;

					p {
						text-align: center;
						font-size: .22rem;
						color: #fff;
						margin-bottom: .05rem;
					}

					.pic {
						width: 70%;
						height: 1rem;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0 auto;
						position: relative;
						z-index: 3;

						img {
							max-width: 80%;
							max-height: 80%;
							animation: myfirst 3s infinite alternate;
						}
					}

					.pic_D {
						width: 100%;
						height: 2rem;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: -.7rem auto;
						position: relative;
						z-index: 1;

						img {
							max-width: 100%;
							max-height: 100%;
						}
					}
				}
			}

			.WaterBall {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.wantto {
				flex: 1;
				background: url(../../assets/images/Lucky/right_back.png) no-repeat center;
				background-size: contain;

				.wantto_box {
					width: 100%;
					height: 100%;
					padding: .4rem 0;
					box-sizing: border-box;

					p {
						text-align: center;
						font-size: .22rem;
						color: #fff;
						margin-bottom: .05rem;
					}

					.pic {
						width: 70%;
						height: 1rem;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0 auto;
						position: relative;
						z-index: 3;

						img {
							max-width: 100%;
							max-height: 100%;
							animation: myfirst 3s infinite alternate;
						}
					}

					.pic_D {
						width: 100%;
						height: 2rem;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: -.7rem auto;
						position: relative;
						z-index: 1;

						img {
							max-width: 100%;
							max-height: 100%;
						}
					}
				}

			}

		}

		.box_proportion {
			width: 800px;
			padding: 0 18px;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 6px;
			box-sizing: border-box;

			.proportion_item {
				width: 100px;
				height: 100px;
				background: red;
				text-align: center;
				line-height: 100px;
				font-size: 24px;
				position: relative;

				.shadow {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translateX(-50%);
					transform: translateY(-50%);
				}

				&.min {
					background: url(../../assets/images/Lucky/min.svg) no-repeat center;
					background-size: contain;
					color: rgb(170, 240, 143);

					.shadow {
						box-shadow: rgb(6, 128, 54) 0px 0px 30px 12px;
					}
				}

				&.max {
					background: url(../../assets/images/Lucky/max.svg) no-repeat center;
					background-size: contain;
					color: rgb(240, 179, 143);

					.shadow {
						box-shadow: rgb(240, 179, 143) 0px 0px 30px 12px;
					}
				}

			}

			.proportion_out {
				width: 400px;

				.custom-button {
					width: 34px;
					font-size: 10px;
					line-height: 20px;
					text-align: center;
					background-color: #fff;
					border-radius: 100px;
					color: #1989fa;
				}
			}


		}
		
		.price_box{
			text-align: center;
			font-size: 24px;
			color: #ffd728;
			margin-bottom: .1rem;
			img{
				width: 30px;
				vertical-align: middle;
				margin-bottom: 5px;
			}
		}
		
		.open_btn {
			text-align: center;
			margin-bottom: 10px;

			.van-button {
					width: 2rem;
					height: 0.5rem;
					border-radius: 0.3rem;
					background: linear-gradient(90deg, #815de5,#d72aa4);
					text-align: center;
					line-height: 0.5rem;
					font-size: 0.2rem;
					color: #fff;
					border:none;

					&:hover {
					background: linear-gradient(180deg, #815de5,#d72aa4);
					}

			}

			.Animation_switch {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-right: 10px;
				margin-top: 20px;
				box-sizing: border-box;
				font-size: 16px;
				color: #fff;

				p {
					margin-right: 5px;
				}
			}
		}
	}
</style>
