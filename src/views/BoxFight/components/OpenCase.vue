<template>
	<div id="OpenCase" :class="this.ShengFu | GuoLv">
		<div class="Top_KaiXiang" :class="content != undefined?'':'waitjoin'">
			<div class="OpenCase-T">
				<div class="OpenCase-T-box">
					<div class="BoxState" v-show="status == 0">
						<div class="ready" v-show="content != undefined">
							<img src="@/assets/images/PublicImg/Zhuan.gif" alt="">
						</div>

						<div class="wait" v-show="content == undefined">等待</div>
						<div class="AddTo" v-show="content == undefined" @click="PostArena_Join">加入</div>
					</div>
					<div class="LuckDraw" v-show="status !== 0">
						<div class="WinOrLose" v-show="Lieutenant_general == true">
							<p>{{ShengLiOrShiBai}}</p>
						</div>


						<div class="container" :key='Draw_times' v-show="Lieutenant_general == false">
							<div class="Visible" :style="{ 'margin-top': '-' + (this.Height * this.Frequency + 'rem') }">
								<div class="GameBox" v-for="(item,index) in Box_arr" :key='index'>
									<img :src="item.cover" alt="">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="OpenCase-C">
				<div class="user" v-if="content != undefined">
					<div class="Pic" :class="{ 'ShengLi' : ShengFu == 'ShengLi' }"><img :src="content.avatar | ImgRoute" alt=""></div>
					<p>{{content.name}}</p>
				</div>
				<div class="money" v-if="content != undefined">
					<img src="@/assets/images/PublicImg/JinBi.png" alt="">
					<span v-if="this.endValNum != 0">{{endValNum}}</span>
					<countTo v-else :startVal='startVal' :endVal='endVal' :duration='3000' :decimals="2"></countTo>
				</div>
			</div>
		</div>
		<div class="OpenCase-B" v-if="content != undefined">
			<div class="Goods_list">
				<div class="Goods_item" :class="'lv_'+item.lv" v-for="(item,index) in Prize_column" :key="index">
					<div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt=""> {{item.bean}}</div>
					<div class="dura_alias">{{item.dura_alias}}</div>
					<div class="Goods_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
						<img :src="item.cover" alt="">
					</div>
					<p>{{item.name}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import MP3 from '@/assets/audios/open.mp3'
	import {
		Arena_Join
	} from '@/network/api.js'
	import countTo from 'vue-count-to';
	import {
		mapActions,
		mapState
	} from 'vuex'
	export default {
		name: 'OpenCase',
		props: {
			content: {
				type: Object,
			},

			itemInfo: {
				type: Object
			},

			game_arena_id: {
				type: String
			},
			InDex: {
				type: Number
			},
			status: {
				type: Number
			},
			game_arena_data: {
				type: Object
			},
		},
		data() {
			return {
				amount: 0,
				GoldCoin: 0.00,
				prizeShow: false,
				Box_arr: [],
				Height: 2,
				Frequency: 0,

				ShengFu: '',

				Prize_column: [],

				startVal: 0,
				endVal: 0,

				ShengLiOrShiBai: '',

				endValNum: 0,

				clearTimeSet: null,

				Draw_times: 0,

				Lieutenant_general: false,

				ZuiZhongJiangPin_Arr: []
			}
		},


		filters: {
			ImgRoute(str) {
				if (str.indexOf('http://') != -1 || str.indexOf('https://') != -1) {
					return str
				} else {
					return localStorage.getItem('static_file_url') + str
				}
			},

			GuoLv(val) {
				if (val == 'ShengLi') {
					return 'active'
				} else if (val == 'ShiBai') {
					return 'ShiBai'
				} else {
					return ''
				}
			}
		},

		components: {
			countTo
		},

		methods: {
			//结束进入操作
			EndOperation() {
				if (this.content != undefined && this.$route.query.Code != 1) {
					for (let i = 0; i < this.content.game_award.length; i++) {
						this.Prize_column.push(this.content.game_award[i].box_award)
						// console.log(this.content.game_award[i].box_award.bean)
						this.endValNum = this.endValNum + Number(this.content.game_award[i].box_award.bean)
					}
				}
			},



			//确定奖品
			Prize_replacement(val) {
				this.Box_arr[20] = val
				this.getsetTime()
			},

			//开始抽奖
			StartTheDraw() {
				this.toParent()
				this.Frequency = 0
				this.Lieutenant_general = false
				//获取每次奖品数据并且随机打乱
				let arr = this.game_arena_data.game_arena_box[this.Draw_times].box_award.concat(this.game_arena_data.game_arena_box[
					this.Draw_times].box_award.concat(this.game_arena_data.game_arena_box[this.Draw_times].box_award))

				function randSort1(arr) {
					for (let i = 0, len = arr.length; i < len; i++) {
						let rand = parseInt(Math.random() * len)
						let temp = arr[rand]
						arr[rand] = arr[i]
						arr[i] = temp
					}
					return arr
				}

				this.Box_arr = randSort1(arr)

				let JiangPin_Arr = []
				for (let i = 0; i < this.game_arena_data.game_arena_player.length; i++) {
					JiangPin_Arr[i] = undefined
				}

				for (let k = 0; k < this.game_arena_data.game_arena_player.length; k++) {
					JiangPin_Arr[Number(this.game_arena_data.game_arena_player. [k].seat)] = this.game_arena_data.game_arena_player[k]
				}

				// console.log(JiangPin_Arr)

				this.ZuiZhongJiangPin_Arr = JiangPin_Arr

				//确定单次中将数据
				this.Prize_replacement(this.ZuiZhongJiangPin_Arr[this.content.seat].game_award[this.Draw_times].box_award)

				setTimeout(() => {
					this.amount = Number(this.amount) + Number(this.ZuiZhongJiangPin_Arr[this.content.seat].game_award[this.Draw_times]
						.box_award.bean)
					this.Prize_column.push(this.ZuiZhongJiangPin_Arr[this.content.seat].game_award[this.Draw_times].box_award)
				}, 6500)
			},

			//最终页面
			Final_Page() {
				if (this.itemInfo.win_user_id != null) {
					this.Lieutenant_general = true
					if (this.itemInfo.win_user_id.length == 1) {
						//确定是否胜利
						let A_Arr = this.itemInfo.win_user_id.find((v) => {
							return v == this.content.user_id
						})
						if (A_Arr != undefined) {
							//胜利操作
							this.ShengLiOrShiBai = '胜利'
							this.ShengFu = 'ShengLi'
							let B_Arr = []
							for (let a = 0; a < this.itemInfo.game_arena_player.length; a++) {
								B_Arr = B_Arr.concat(this.itemInfo.game_arena_player[a].game_award)
							}

							let C_Arr = []
							let D_Num = 0
							for (let b = 0; b < B_Arr.length; b++) {
								C_Arr.push(B_Arr[b].box_award)
								D_Num = Number(D_Num) + Number(B_Arr[b].box_award.bean)
							}

							// console.log(C_Arr)
							this.Prize_column = C_Arr
							this.endValNum = D_Num.toFixed(2)
						} else {
							//失败操作
							this.ShengLiOrShiBai = '凉凉奖励'
							this.ShengFu = 'ShiBai'
							this.endValNum = 0.01

							this.Prize_column = [{
								cover: require('@/assets/images/PublicImg/LL.png'),
								name: '凉凉奖励',
								bean: '0.01'
							}]
						}
					} else {
						// console.log('双人')
						// console.log(this.itemInfo)
						//多人胜利或平局操作
						//确定是否胜利
						let D_Arr = this.itemInfo.win_user_id.find((v) => {
							return v == this.content.user_id
						})
						if (D_Arr != undefined) {
							//胜利操作
							this.ShengLiOrShiBai = '胜利'
							this.ShengFu = 'ShengLi'

							let E_Arr = []
							// console.log(this.content)
							let Y_Item = this.itemInfo.game_arena_player.filter((v) => {
								return v.id == this.content.id
							})

							for (let d = 0; d < Y_Item[0].game_award.length; d++) {
								E_Arr.push(Y_Item[0].game_award[d].box_award)
							}
							this.Prize_column = E_Arr

							this.WeiZhongJiang(this.itemInfo.win_user_id)

						} else {
							this.ShengLiOrShiBai = '失败'
							this.ShengFu = 'ShiBai'
							this.endValNum = 0.01

							this.Prize_column = [{
								cover: require('@/assets/images/PublicImg/LL.png'),
								name: '凉凉奖励',
								bean: '0.01'
							}]
						}
					}
				}

			},

			//多人胜利金额计算1(拿到未中奖的数据)
			WeiZhongJiang(arr) {
				// console.log(arr)
				// console.log(this.itemInfo)
				let G_Arr = []
				if (arr.length == 2) {
					G_Arr = this.itemInfo.game_arena_player.filter((v) => {
						return v.user_id !== arr[0] && v.user_id !== arr[1]
					})
					this.ZJinE(G_Arr)
				} else if (arr.length == 3) {
					G_Arr = this.itemInfo.game_arena_player.filter((v) => {
						return v.user_id !== arr[0] && v.user_id !== arr[1] && v.user_id !== arr[2]
					})
					this.ZJinE(G_Arr)
				}
			},

			//多人胜利金额计算2(确定中将者金额并且分配)
			ZJinE(arr) {
				let D_Num = 0
				// console.log(arr)
				// console.log(arr[0])
				for (let b = 0; b < arr.length; b++) {
					for (let k = 0; k < arr[b].game_award.length; k++) {
						D_Num = D_Num + Number(arr[b].game_award[k].box_award.bean)
					}
				}

				let Z_Num = D_Num.toFixed(2)
				// console.log(Z_Num)
				let ZhongJiangNum = this.itemInfo.win_user_id.length
				let Qian = Number(Z_Num) / Number(ZhongJiangNum)
				// console.log(Qian)

				let P_Num = 0
				let Y_Item = this.itemInfo.game_arena_player.filter((v) => {
					return v.id == this.content.id
				})


				for (let a = 0; a < Y_Item[0].game_award.length; a++) {
					P_Num = P_Num + Number(Y_Item[0].game_award[a].box_award.bean)
				}

				let H_Num = Number(P_Num) + Qian
				this.endValNum = H_Num.toFixed(2)
			},

			//加入房间
			PostArena_Join() {
				Arena_Join(this.game_arena_id, this.InDex).then((res) => {
					// console.log(res)
				})
			},


			toParent() {
				this.$emit('fromChild', {
					id: this.game_arena_id,
					Draw_times: this.Draw_times
				})
			},

			//定时器(箱子动画)
			getsetTime() {
				this.clearTimeSet = setInterval(() => {
					this.Frequency += 1
				}, 100);
			},

			//清除定时器(箱子动画)
			getclearTime() {
				clearTimeout(this.clearTimeSet)
			},

			//传递父_结束
			childClick(val) {
				this.$emit('childByValue', val)
			},

			...mapActions([
				'GetroundNum'
			])
		},

		computed: {
			...mapState([
				'JieShuVsData'
			])
		},

		watch: {
			Frequency(val) {
				// console.log(val)
				if (val == 20) {
					this.getclearTime()
				}
			},

			endValNum(val) {
				this.endValNum = Number(val).toFixed(2)
			},

			amount(val) {
				this.endVal = Number(val.toFixed(2))
			},

			endVal(val) {
				setTimeout(() => {
					this.startVal = val
					this.Draw_times = this.Draw_times + 1
				}, 3200)
			},

			game_arena_data(val) {
				this.game_arena_data = val
				setTimeout(() => {
					console.log(1);
					this.StartTheDraw()
				}, 200)

			},


			content(val) {
				this.EndOperation()
			},

			Draw_times(val) {
				// console.log(val)
				// console.log(this.game_arena_data.box_num)
				if (val == this.game_arena_data.box_num) {
					this.childClick('结束')
					this.Lieutenant_general = true
				} else {
					this.StartTheDraw()
					this.toParent()
				}

			},

			itemInfo(val) {
				this.itemInfo = val
				this.Final_Page()
			}
		}
	}
</script>

<style lang="scss">
	#OpenCase {
		flex: 1;
		margin-right:10px;
		
		border: 1px solid #985ac0;

		&.ShiBai{
			background:none;
			.Top_KaiXiang{
				background: #3d1b50;
			}
		}

		&.active{
			background-color:#502072;
		}

		.Goods_list {
				width: 100%;
				display: flex;
				padding: 0;
				margin-top: 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				overflow: hidden;
				overflow-y: auto;
				height:auto;
				&::-webkit-scrollbar {
					width: 2px;
					background:rgba($color: #000, $alpha: .2)
				}
				&::-webkit-scrollbar-thumb{
					width: 2px;
					background:#000
				}
				.Goods_item {
					width: 32%;
					text-align: center;
					color: #fff;
					margin-top: 10px;
					margin-right:2%;
					padding: 20px 0 10px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					position: relative;
					height:2rem;
					background-color:#716778;
					&:nth-child(3n){
						margin-right:0px;
					}
					&.lv_1{
						background-color:#915f4d;
					}
					&.lv_2{
						background-color:#99358a;
					}
					&.lv_3{
						background-color:#8551ab;
					}
					&.lv_4{
						background-color:#4948b8;
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
							max-width: 100%;
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
						margin: -10px 0 10px;
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
		
		.Top_KaiXiang{
			background: #8540af;
			&.waitjoin{
				background:none;
			}
		}
		
		.OpenCase-T {
			width: 100%;
			height: 3.3rem;
			padding: 0.2rem 0.05rem;
			box-sizing: border-box;

			.OpenCase-T-box {
				width: 100%;
				height: 100%;
				overflow: hidden;
				position: relative;

				&.active {
					background: linear-gradient(360deg, rgba(255, 255, 0, 0.5) 0%, rgba(43, 44, 55, 0.1) 100%, rgba(43, 44, 55, 0) 100%);
				}

				&.ShiBai {
					background: linear-gradient(360deg, rgba(170, 0, 255, 0.5) 0%, rgba(43, 44, 55, 0.1) 100%, rgba(43, 44, 55, 0) 100%);
				}

				.BoxState {
					width: 100%;
					height: 100%;

					.ready {
						width: 100%;
						height: 0.5rem;
						line-height: 0.5rem;
						margin-top: 1.1rem;
						text-align: center;
					}

					img {
						width: 0.6rem;
						height: 0.6rem;
					}

					.wait {
						width: 100%;
						height: 0.5rem;
						line-height: 0.5rem;
						margin-top: 1.1rem;
						text-align: center;
					}

					.AddTo {
						width: 1rem;
						height: 0.35rem;
						background: #8d44af;
						border-radius: 1rem;
						margin: 0 auto 0;
						text-align: center;
						line-height: 0.35rem;
						font-size: 0.14rem;
						cursor: pointer;
					}
				}

				.LuckDraw {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;

					.WinOrLose {
						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;

						p {
							font-size: 0.28rem;
						}
					}

					.container {
						width: 60%;
						height: 2.8rem;
						padding-top: 0.8rem;
						// overflow: hidden;
						mask-image: linear-gradient(0deg, rgba(25, 25, 25, 0) 4%, #000 60%, rgba(25, 25, 25, 0) 96%);

						.Visible {
							width: 100%;

							transition: 3s cubic-bezier(0, 0, 0.28, 1);
						}

						.GameBox {
							width: 100%;
							height: 2rem;
							// margin: 0.2rem auto;
							display: flex;
							justify-content: center;
							align-items: center;

							img {
								max-width: 80%;
								max-width: 80%;
							}
						}
					}
				}
			}
		}

		.OpenCase-C {
			width: 100%;
			height: 1.3rem;

			.user {
				width: 100%;
				height: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				.Pic {
					padding: 0 0.2rem;

					img {
						margin: 0 auto;
						width: 0.5rem;
						height: 0.5rem;
						border-radius: 50%;
						vertical-align: middle;
						overflow: hidden;
					}

					&.ShengLi {
						background: url(../../../assets/images/Rank/border.png) no-repeat center;
						background-size: 90%;
					}
				}


				p {
					font-size: 0.16rem;
					color: #fff;
				}
			}

			.money {
				width: 100%;
				height: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				img {
					width: 0.34rem;
					height: 0.34rem;
					border-radius: 50%;
					vertical-align: middle;
					overflow: hidden;
					margin-right: 0.05rem;
				}

				span {
					font-size: 0.2rem;
					color: #ffd728;
				}
			}
		}

		.OpenCase-B {
			width: 100%;
			padding: 0 0.1rem;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.reward {
				width: 49.5%;
				background: #20222b !important;
				margin-bottom: 0.05rem;
				border-radius: 0.04rem;
				&:nth-child(2n) {
					margin-right: 0;
				}
				.pic {
					width: 80%;
					margin: 0.1rem auto;
					display: flex;
					justify-content: center;
					align-items: center;

					img {
						width: 80%;
					}
				}

				.reward-info {
					width: 100%;
					display: flex;
					align-items: center;
					font-size: 0.14rem;
					border-top: 0.01rem solid #353847;
				}

				p {
					width: 50%;
					height: 0.5rem;
					text-align: center;
					line-height: 0.5rem;
					padding: 0 0.07rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #fff;
					border-right: 0.01rem solid #353847;
					box-sizing: border-box;
				}

				span {
					display: block;
					width: 50%;
					height: 0.5rem;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #ffd300;

					img {
						width: 0.25rem;
						height: 0.25rem;
						vertical-align: middle;
						margin-right: 0.05rem;
					}

				}
			}
		}
	}
</style>
