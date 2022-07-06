<template>
	<div id="VsBox">
		<audio id="music" src="@/assets/audios/open.mp3"></audio>
		<div class="VsBox-box">
			<div class="Title">
				<p>对战</p>
			</div>
			<div class="Navigation">
				<div class="Navigation-F">
					<div class="round">{{ChangCiNum +1 }} / {{itemInfo.box_num}} 回合</div>
					<div class="box-list">
						<div class="box-item" v-for="(item,index) in itemInfo.game_arena_box" :key="index" :class="{ 'active' : index == ChangCiNum }" @click="OpenXZshow(item)">
							<div class="pic"><img :src="item.cover | ImgRoute" alt=""></div>
							<p><span>{{index + 1}}</span></p>
						</div>
					</div>
				</div>
				<div class="Navigation-R">
					箱子总价格<p><img src="@/assets/images/PublicImg/JinBi.png" alt="" /><span>{{itemInfo.total_bean}}</span></p>
            <div v-if="CloseShow == 2" class="Show_btns">
              <van-button type="info" style="background-color: #db57d3;border-radius: 50px;margin: 0.3rem" @click="CloseMatch">关闭对战</van-button>
            </div>
				</div>
			</div>
			
			<div class="VS-core">
				<open-case v-for="(item,index) in ItemArr" @childByValue='childByValue' @fromChild="getChild" :itemInfo="itemInfo" :status="itemInfo.status" :key="ArrIndex[index]" :InDex="index" :game_arena_id="$route.query.id" :content="item" :game_arena_data='game_arena_data'></open-case>
			</div>


			<!-- 箱子遮罩层 -->
			<van-overlay :show="XZshow">
				<div class="wrapper">
					<div class="block">
						<div class="block-T">
							<p>{{TreasureName}}</p>
							<span @click="CloseXZshow">×</span>
						</div>
						<div class="Goods_list">
							<div class="Goods_item" :class="'lv_'+item.lv" v-for="(item,index) in Treasure_box_prize" :key="index">
								<div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt=""> {{item.bean}}</div>
								<div class="dura_alias">{{item.dura_alias}}</div>
								<div class="Goods_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
									<img :src="item.cover" alt="">
								</div>
								<p>{{item.name}}</p>
							</div>
						</div>
						<div class="boxbtn">
							<p @click="CloseXZshow">确定</p>
						</div>
					</div>
				</div>
			</van-overlay>

		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {
		Arena_Detail,CloseMatchOperation
	} from "@/network/api.js"
	import OpenCase from './components/OpenCase.vue'
	export default {
		name: 'VsBox',
		data() {
			return {
				XZshow: false,
        CloseShow: 1,
				itemInfo: {}, //详情数据
				Treasure_box_prize: [], //宝箱奖品数据
				TreasureName: '',
				ItemArr: [],
				ArrIndex:[0,1,2,3],
				ChangCiNum:0,//场次
				
				RouterId:0,
				JieShuData:{},
				
				JieShu:'',
				
				GameState:'0',
				game_arena_data:{},//对战	
			}
		},
		created() {
			this.RouterId = this.$route.query.id
			this.GetArena_Detail()
		},

		filters: {
			ImgRoute(str) {
				if (str.indexOf(localStorage.getItem('static_file_url')) != -1) {
					return str
				} else {
					return localStorage.getItem('static_file_url') + str
				}
			}
		},
		methods: {
			//获取对战详情
			GetArena_Detail() {
				// console.log(this.$route.query.id)
				Arena_Detail(this.$route.query.id).then((res) => {
					// console.log(res.data.data)
          var timestamp1 = new Date(res.data.data.created_at).getTime()  / 1000;
          var timestamp2 = Date.parse(new Date()) / 1000;

          if(timestamp2 - timestamp1 > 3600 && res.data.data.status == 0){
              this.CloseShow = 2;
          }
					if(res.data.data.status == 0){
						this.GameState = '0'
						this.itemInfo = res.data.data

						let Arr = []
						for (let i = 0; i < Number(this.itemInfo.user_num); i++) {
							Arr[i] = undefined
						}
						for (let k = 0; k < this.itemInfo.game_arena_player.length; k++) {
							Arr[Number(this.itemInfo.game_arena_player[k].seat)] = this.itemInfo.game_arena_player[k]
						}
						this.ItemArr = Arr
		
					}else if(res.data.data.status == 1){
						
					}else if(res.data.data.status == 2){
						if(this.$route.query.Code == 2){
							this.GameState = '2'
							this.itemInfo = res.data.data

							let Arr = []
							for (let i = 0; i < Number(this.itemInfo.user_num); i++) {
								Arr[i] = undefined
							}
							for (let k = 0; k < this.itemInfo.game_arena_player.length; k++) {
								Arr[Number(this.itemInfo.game_arena_player[k].seat)] = this.itemInfo.game_arena_player[k]
							}
							
							this.ItemArr = Arr
							this.ChangCiNum = Number(res.data.data.box_num) - 1

						}else if(this.$route.query.Code == 1){
							this.GameState = '1'
							this.itemInfo.box_num = res.data.data.box_num
							this.itemInfo.total_bean = res.data.data.total_bean
							let Arr = []
							
							for (let i = 0; i < Number(res.data.data.user_num); i++) {
								Arr[i] = undefined
							}
							
							for (let k = 0; k < res.data.data.game_arena_player.length; k++) {
								Arr[Number(res.data.data.game_arena_player[k].seat)] = res.data.data.game_arena_player[k]
							}

							this.ItemArr = Arr
							this.ChangCiNum = Number(res.data.data.box_num) - 1

							
							this.game_arena_data = res.data.data
							this.itemInfo.status = res.data.data.status
							this.itemInfo.game_arena_box = res.data.data.game_arena_box

						}
					}
				})
			},

      CloseMatch(){
        CloseMatchOperation(this.$route.query.id).then((res) =>{
          if (res.data.code == 200) {
            this.$message({
              message: '关闭成功',
              type: 'success',
            })
            this.$router.push('/BoxFight')
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      },
			
			getChild(val){
				if(val.id == this.$route.query.id){
					this.ChangCiNum = val.Draw_times
					this.GetMusic()
				}
			},
			
			//音频播放
			GetMusic() {
				let music = document.getElementById("music")
				music.play()	
			},
			
			//结束_接收
			childByValue(val){
				this.JieShu = val
			},
			

			//对战开始
			StartGroup(data){
				this.GetVsKaiShi(data)
				if(data.game_arena_id == this.itemInfo.id){
					this.itemInfo.status = data.status
				}
				
			},
			

			//打开箱子弹框
			OpenXZshow(item) {
				this.XZshow = true
				this.TreasureName = item.name
				this.Treasure_box_prize = item.box_award
			},

			//关闭箱子弹框
			CloseXZshow() {
				this.XZshow = false
			},
			
			
			//刷新
			Refresh(){
				this.ArrIndex = this.ArrIndex.map( item => {
					return item +1 
				})
			},
			
			...mapActions([
				'GetVsKaiShi',
				'GetVsJieShu',
				'GetJieShuVsData'
			])
		},

		computed: {
			...mapState([
				'AddInformation',
				'roundNum',
				'JieShuVsData'
			])
		},

		watch: {
			RouterId(val){
				this.GetArena_Detail()
			},
			
			JieShu(val){
				if(val == '结束'){
					// console.log('结束了')
					this.$route.query.Code = 2
					this.GetArena_Detail()
				}
			},
			
			AddInformation(val) {
				if (val.game_arena_id == this.$route.query.id) {
					this.ItemArr[Number(val.seat)] = val
					this.Refresh()
				}
			},
			
			JieShuVsData(val){
				if(val.id == this.$route.query.id){
					this.GameState = '1'
					this.game_arena_data = val
					this.itemInfo.status = val.status
				}
			}
		},

		components: {
			OpenCase
		}
	}
</script>

<style lang="scss">
	.VsBox-box {
		width: 100%;
		padding-top: 0.4rem;

		.Goods_list {
				width: 100%;
				display: flex;
				padding: 5px 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				margin-top: 20px;
				overflow: hidden;
				overflow-y: auto;
				height:6rem;
				margin-bottom:0.2rem;
				&::-webkit-scrollbar {
					width: 2px;
					background:rgba($color: #000, $alpha: .2)
				}
				&::-webkit-scrollbar-thumb{
					width: 2px;
					background:#000
				}
				.Goods_item {
					width: 24%;
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

		.Navigation {
			margin-top: 0.4rem;
			width: 100%;
			height: 1.5rem;
			background: #7f3eac;
			box-sizing: 0 24px 31px rgba(15, 16, 31, 0.71) !important;
			display: flex;
			justify-content: space-between;

			.Navigation-F {
				height: 100%;
				display: flex;
				.round {
					width: 1.6rem;
					height: 100%;
					text-align: center;
					line-height: 1.5rem;
					font-size: 0.24rem;
				}

				.box-list {
					height: 100%;	
					display: flex;
					align-items: center;
					.box-item {
						width: 1rem;
						height: 1.5rem;
						margin-right: 0.3rem;
						position: relative;
						.pic{
							width: 0.6rem;
							height: 0.6rem;
							margin: 0.15rem auto 0;
							display: flex;
							justify-content: center;
							align-items: center;
							cursor: pointer;
							img {
								max-width: 100%;
								max-height: 100%;
								vertical-align: middle;
								filter: brightness(50%)
							}
						}
						p{
							width: 0.2rem;
							height: 0.2rem;
							margin: 0.3rem auto 0;
							text-align: center;
							line-height: 0.2rem;
							border: 1px solid #ffd300;
							transform: rotate(45deg);
							span{
								display: block;
								width: 100%;
								height: 100%;
								transform: rotate(-45deg);
								font-size: 0.14rem;
								color: #ffd300;
							}
						}
						
						&::after{
							display: block;
							content: "";
							width: 0.4rem;
							height: 1px;
							background:#ffd300;
							position: absolute;
							left: 0.9rem;
							top: 1.15rem;
						}
						
						&:last-child::after{
							display: none;
						}
						
						&.active {
							img {
								filter: none;
								transform: scale(1.6);
							}
							p{
								transform: scale(1.6) rotate(45deg);
							}
						}
					}
				}
			}

			.Navigation-R {
				width: 4rem;
				height: 100%;
				display: flex;
				align-items: center;
				font-size: 0.22rem;
				color: #fff;

				p {
					display: flex;
					margin-left: 0.1rem;
					align-items: center;

					img {
						width: 0.35rem;
						height: 0.35rem;
						vertical-align: middle;
						margin-right: 0.05rem;
					}

					span {
						color: #ffd728;
					}
				}
			}
		}

		.VS-core {
			width: 100%;
			margin-top: 0.2rem;
			display: flex;
			position: relative;
			overflow: hidden;
			.Xian{
				width: 13.8rem;
				height: 0.03rem;
				background: rgb(255,211,0);
				position: absolute;
				top: 1.61rem;
				left: 0.1rem;
				z-index: 100;
			}

			#OpenCase {
				&:last-child {
					margin-right:0px;
					.OpenCase-B {
						border: none;
					}
				}
			}
		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			z-index: 15;
		}

		.block {
			width: 8rem;
			background-color: #6e2c9a !important;
			padding: 0.2rem;
			box-sizing: border-box;

			.block-T {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				p {
					font-size: 0.24rem;
					color: #fff;
				}

				span {
					font-size: 0.28rem;
					color: rgba($color: #ffffff, $alpha: 1);
					cursor: pointer;
				}
			}

			.Box-List {
				width: 100%;
				height: 5rem;
				margin: 0.2rem 0 0.4rem;
				overflow: auto;
				display: flex;
				flex-wrap: wrap;

				.Box-List-item {
					width: 1.8rem;
					height: 2.3rem;
					position: relative;
					background: rgba(0, 0, 0, .2);
					border-radius: 0.04rem;
					margin-right: 0.1rem;
					margin-bottom: 0.1rem;
					cursor: pointer;
					overflow: hidden;

					&:nth-child(4n) {
						margin-right: 0;
					}

					&:hover {
						.ceng {
							opacity: 1;
						}
					}

					.pic {
						width: 1.8rem;
						height: 1.5rem;
						margin: 0.1rem auto 0;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;

						.zhao {
							width: 100%;
							height: 100%;
							position: absolute;
							left: 0;
							top: 0;
							display: flex;
							justify-content: center;
							align-items: center;

							img {
								max-width: 100%;
								max-height: 100%;
							}
						}

						img {
							max-width: 100%;
							max-height: 100%;
							position: relative;
							z-index: 10;
						}
					}

					.name {
						width: 100%;
						text-align: center;
						color: #9e9e9e;
						font-size: 0.14rem;
					}

					.money {
						width: 100%;
						margin-top: 0.1rem;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							width: 0.2rem;
							height: 0.2rem;
							vertical-align: middle;
						}

						span {
							font-size: 0.14rem;
							color: #ffd728;
						}
					}
				}
			}

			.Box-List::-webkit-scrollbar {
				/*滚动条整体样式*/
				width: 4px;
				/*高宽分别对应横竖滚动条的尺寸*/
				height: 4px;
				scrollbar-arrow-color: red;

			}

			.Box-List::-webkit-scrollbar-thumb {
				/*滚动条里面小方块*/
				border-radius: 5px;
				-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
				background: rgba(0, 0, 0, 0.6);
				scrollbar-arrow-color: red;
			}

			.Box-List::-webkit-scrollbar-track {
				/*滚动条里面轨道*/
				-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
				border-radius: 0;
				background: rgba(0, 0, 0, 0.1);
			}

			.boxbtn {
				width: 100%;
				height: 0.35rem;
				display: flex;
				justify-content: flex-end;

				p {
					width: .7rem;
					height: .35rem;
					background: rgba(252, 99, 207, 0.5);
					font-size: 0.14rem;
					color: #fff;
					text-align: center;
					line-height: 0.35rem;
					cursor: pointer;
				}

			}
		}
	}
</style>
