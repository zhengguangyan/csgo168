<template>
	<div id="GameHistory">
		<div class="GameHistory-box">
			<div class="Title">
				<p>历史记录</p>
			</div>
			<div class="Navigation">
				<p @click="HistoryAdd(true)" :class="{ 'active' : HistorySwitch == true }">所有对战记录</p>
				<p @click="HistoryAdd(false)" :class="{ 'active' : HistorySwitch == false }">我的对战记录</p>
			</div>
			<div class="History-box">
				<div class="MBX">
					<div class="time">时间</div>
					<div class="code">编号</div>
					<div class="gameplayer">玩家</div>
					<div class="Blind">盲盒信息</div>
					<div class="total">总额</div>
					<!-- <div class="state">状态</div> -->
				</div>
				<div class="History-list">
					<div class="History-item" v-for="(item,index) in QBLiShi" :key="index">
						<div class="time">{{item.created_at}}</div>
						<div class="code">{{item.draw_code}}</div>
						<div class="gameplayer">
							<div class="pic" v-for="(v,index) in item.game_arena_player" :key="index" :class="v.user_id ,item.win_user_id | GuoLvTwo ">
								<img :src="v.avatar | ImgRoute" alt="">
							</div>
							
						</div>
						<div class="Blind">
							<div class="pic" v-for="(item,index) in item.game_arena_box" :key="index">
								<img :src="item.cover | ImgRoute" alt="">
							</div>
							
						</div>
						<div class="total">
							<img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.total_bean}}
						</div>
						<!-- <div class="state">失败</div> -->
					</div>
				</div>
				<div class="page">
					<el-pagination background layout="prev, pager, next" :key="totalNum" @current-change="PickChange" :page-size="9"
					 :total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Arena_History, Arena_Me_History } from '@/network/api.js'
	export default{
		name:"GameHistory",
		data(){
			return{
				HistorySwitch:true,
				QBLiShi:[],
				total:0,
				totalNum:0
			}
		},
		
		filters:{
			
			
			ImgRoute(str) {
				if (str.indexOf('http://') != -1 || str.indexOf('https://') != -1) {
					return str
				} else {
					return localStorage.getItem('static_file_url') + str
				}
			},
			
			GuoLvTwo(id,Zid){
				let A_Arr = Zid.find((i) => {
					return i == id
				})
				if(A_Arr != undefined){
					return 'active'
				}
			}
		},
		methods:{
			//全部历史记录
			GetArena_History(page){
				Arena_History(page).then((res) => {
					// console.log(res.data.data)
					this.total = Number(res.data.data.total)
					this.QBLiShi = res.data.data.data
				})
			},
			
			//我的历史记录
			GetArena_Me_History(page){
				Arena_Me_History(page).then((res) => {
					this.total = Number(res.data.data.total)
					this.QBLiShi = res.data.data.data
				})
			},
			
			HistoryAdd(v){
				this.HistorySwitch = v
				if(v == true){
					this.totalNum = 0
					this.GetArena_History('1')
				}else{
					this.GetArena_Me_History('1')
					this.totalNum = 1
				}
			},
			
			//分页
			PickChange(val){
				console.log(val)
				this.GetArena_History(val)
			},
		},
		
		created() {
			this.GetArena_History(1)
		}
	}
</script>

<style lang="scss">
	.GameHistory-box{
		width: 100%;
		padding-top: 0.4rem;
		.Navigation{
			width: 100%;
			height: 0.5rem;
			display: flex;
			align-items: center;
			p{
				width: 1.4rem;
				height: 0.5rem;
				color: #fff;
				border:1px #d3a9fd solid;
				color: #d3a9fd;
				text-align: center;
				line-height: 0.5rem;
				font-size: 0.14rem;
				margin-right: 0.05rem;
				cursor: pointer;
				&.active{
					color:#fff;
					border-color:#fc63cf;
					background: rgba($color: #fc63cf, $alpha: 0.5);
				}
			}
		}
		.History-box{
			width: 100%;
			height: 8rem;
			margin-top: 0.2rem;
			background-size: cover;
			box-sizing: border-box;
			position: relative;
			.History-box-T{
				width: 100%;
				height: 0.75rem;
				display: flex;
				justify-content: space-between;
				.History-info{
					width: 4rem;
					height: 100%;
					background: #222222;
					border-radius: 0.04rem;
					text-align: center;
					font-size: 0.16rem;
					p{
						margin-top: 0.12rem;
					}
					.XinXi{
						display: flex;
						justify-content: center;
						align-items: center;
						margin-top: 0.05rem;
						color: #75cd66;
						img{
							vertical-align: middle;
							width: 0.25rem;
							height: 0.25rem;
							margin-right: 0.05rem;
						}
					}
				}
				
			}
			
			.MBX{
				width: 100%;
				display: flex;
				align-items: center;
				height: 0.5rem;
				font-size: 0.14rem;
				padding:0 0.2rem;
				background: rgba(110, 44, 155, 0.6);
				box-sizing: border-box;
				color: #fff;
				.time{
					width: 2rem;
				}
				.code{
					width: 3.5rem;
				}
				.gameplayer{
					width: 2.5rem;
				}
				.Blind{
					width: 4rem;
				}
				.ShengZhe{
					width: 1rem;
				}
				.total{
					width: 1.8rem;
				}
				.state{
					width: 1.8rem;
				}
			}
			.History-list{
				width: 100%;
				height: 5.5rem;
				.History-item{
					width: 100%;
					height: 0.68rem;
					border-top: 1px solid #a160c0;
					display: flex;
					align-items: center;
					font-size: 0.14rem;
					color: #e2c7ff;
					.time{
						width: 2rem;
					}
					.code{
						width: 3.5rem;
					}
					.gameplayer{
						width: 2.5rem;
						display: flex;
						align-items: center;
						.pic{
							position: relative;
							img{
								width: 0.3rem;
								height: 0.3rem;
								vertical-align: middle;
								border-radius: 50%;
								margin-right: 0.05rem;
							}
							&.active{
								img{
									border: 2px solid #E9B10E;
								}
								&::after{
									display: block;
									content: '';
									width: 0.15rem;
									height: 0.15rem;
									background: url(../../assets/images/PublicImg/HuangGuan.png) no-repeat center;
									background-size: cover;
									transform: rotate(45deg);
									position: absolute;
									right: 0rem;
									top: -0.05rem;
								}
							}
						}
						
					}
					.Blind{
						width: 4rem;
						display: flex;
						align-items: center;
						img{
							width: 0.4rem;
							height: 0.4rem;
							vertical-align: middle;
							border-radius: 50%;
							margin-right: 0.05rem;
						}
					}
					.total{
						width: 1.8rem;
						display: flex;
						align-items: center;
						color:#ffd728;
						font-size:0.2rem;
						img{
							width: 0.3rem;
							height: 0.3rem;
							vertical-align: middle;
							margin-right: 0.05rem;
						}
					}
					.state{
						width: 1.8rem;
					}
				}
			}
			.page{
				position: absolute;
				left: 0.2rem;
				bottom: 0.3rem;
				width: 100%;
				border-top: 1px solid #525aa5;
				padding-top: 0.33rem;
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
</style>
