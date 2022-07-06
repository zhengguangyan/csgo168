<template>
	<div id="BattleList">
		<div class="GameBattleList-box">
			<div class="Title">
				<p>对战榜</p>
			</div>
			<div class="Navigation">
				<p @click="BattleListAdd(true)" :class="{ 'active' : BattleListSwitch == true }">对战日榜</p>
				<p @click="BattleListAdd(false)" :class="{ 'active' : BattleListSwitch == false }">对战周榜</p>
			</div>
			<div class="BattleList-box">
				<div class="MBX">
					<div class="ranking">排行榜</div>
					<div class="player">玩家</div>
					<div class="win">对战次数</div>
					<div class="total">赢得饰品价值</div>
				</div>
				<div class="BattleList-list">
					<div class="BattleList-item" v-for="(item,index) in BattleList" :key="index">
						<div class="ranking">{{index + 1}}</div>
						<div class="player">
							<div class="pic">
								<img :src="item.avatar" alt="">
							</div>
              <div class="code">{{item.name}}</div>
						</div>
						<div class="win">
              <div class="code">{{item.count}}次</div>
						</div>
						<div class="total">
							<img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.win_worth}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { BattleList } from '@/network/api.js'
	export default{
		name:"BattleList",
		data(){
			return{
        BattleListSwitch:true,
        BattleList:[],
				type: 'day'
			}
		},
		
		filters:{

		},
		methods:{
			//排行榜
      GetBattleList(page,type){
        BattleList(page,type).then((res) => {
					this.BattleList = res.data.data
				})
			},

      BattleListAdd(v){
				this.BattleListSwitch = v
				if(v == true){
					this.type = 'day'
					this.GetBattleList(1,this.type)
				}else{
          this.type = 'week'
					this.GetBattleList(1,this.type)
				}
			},
			
			//分页
			PickChange(val){
				console.log(val)
				this.GetArena_History(val)
			},
		},
		
		created() {
			this.GetBattleList(1,'day')
		}
	}
</script>

<style lang="scss">
	.GameBattleList-box{
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
		.BattleList-box{
			width: 100%;
			height: 8rem;
			margin-top: 0.2rem;
			background-size: cover;
			box-sizing: border-box;
			position: relative;
			
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
        text-align: center;
				.ranking{
					width: 2rem;
				}
				.player{
					width: 3.5rem;
				}
				.win{
					width: 3.5rem;
				}
				.total{
					width: 2rem;
				}
			}
			.BattleList-list{
				width: 100%;
				height: 5.5rem;
				.BattleList-item{
					width: 100%;
					height: 0.68rem;
					border-top: 1px solid #a160c0;
					display: flex;
					align-items: center;
					font-size: 0.2rem;
					color: #e2c7ff;
          text-align: center;
					.ranking{
						width: 3rem;
					}
					.player{
						width: 4rem;
						display: flex;
						align-items: center;
						.pic{
							position: relative;
							img{
								width: 0.4rem;
								height: 0.4rem;
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
					.win{
						width: 3rem;
						display: flex;
						align-items: center;
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
