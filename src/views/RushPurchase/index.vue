<template>
	<div id="RushPurchase">
		<div id="RushPurchase-box">
			<div class="Title">
				<p>抢卡</p>
			</div>
			<div class="Navigation">
				<p @click="getJinXing" :class="{ 'active' : this.active == '0' }">进行中</p>
				<p @click="getJieShu" :class="{ 'active' : this.active == '1' }">已结束</p>
			</div>
			
			<div class="TreasureList">
				<div class="TreasureList-Item" v-for="(item,index) in JinXingArr" :key="index">
					<p class="title_box">{{item.name}}</p>
					<div class="People"><p>{{item.user_max_num}}</p></div>
					<div class="Price">
						<img src="@/assets/images/PublicImg/JinBi.png" alt="">
						<p>{{item.total_bean}}</p>
					</div>
					<div class="core">
						<!-- <img class="BJ" src="@/assets/images/PublicImg/H6K.png" alt=""> -->
						<div class="pic">
							<img :src="item.awards[0].award_info.cover" alt="">
						</div>
						
					</div>
					<div class="info">
						<p>{{item.awards[0].award_info.name}}</p>
						<span>{{'(' +item.awards[0].award_info.dura_alias + ')'}}</span>
					</div>
					<div class="ChaKan" v-if="item.status == 1" @click="ChaKan(item.id)">查看</div>
					<div class="TreasureBtn" @click="getInto(item.id,item.expend_bean)" v-else>
						点击加入 ${{item.expend_bean}}
					</div>
					<p class="RenShu">当前人数: {{item.players_number}}</p>
				</div>
			</div>
			
			<div class="PageNum">
				<el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page"
				 :total="total">
				</el-pagination>
			</div>
			
			<!-- 确认加入弹框 -->
			<van-overlay :show="JoinShow">
				<div class="wrapper">
					<div class="wrapper-box">
						<div class="wrapper-box-top"></div>
						<div class="num_box">
							<el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
						</div>
						 
						<p>加入本房间将扣除个人${{(Number(Expend_Bean)*Number(num)).toFixed(2)}},是否继续</p>
						<div class="btns">
							<span @click="cancel">取消</span>
							<span class="btn-two" @click="determine()">确定</span>
						</div>
					</div>
				</div>
			</van-overlay>
			
		</div>
	</div>
</template>

<script>
	import { Snatch, Snatch_Join } from '@/network/api.js'
	export default {
		name: "RushPurchase",
		data() {
			return {
				JoinShow:false,
				JinXingArr:[],
				active:'0',
				id:'',
				per_page:0,
				total:0,
				page:'1',
				timer: null,
				Expend_Bean:'',
				num:1,
			}
		},
		
		activated() {
			this.getSnatch()
		},
		
		
		
		methods:{
			 handleChange(value) {
			      },
			
			//列表
			getSnatch(){
				Snatch(this.page,this.status).then((res) => {
					this.total = res.data.data.total
					this.per_page = res.data.data.per_page
					this.JinXingArr = res.data.data.data
				})
			},
			
			//进行中列表
			getJinXing(){
				this.active = 0
				this.status = 0
				this.page = '1'
				this.getSnatch()
			},
			
			//结束列表
			getJieShu(){
				this.active = 1
				this.status = 1
				this.page = '1'
				this.getSnatch()
			},
			
			//分页
			handleCurrentChange(page){
				this.page = page
				this.getSnatch()
				
			},
			//定时刷新
			DingShi() {
				this.timer = setInterval(() => {
					this.getSnatch()
				}, 20000)
			},
			
			//查看规则
			GetRule(){
				this.$router.push('/Snatch')
			},
			
			//加入
			getInto(id,Expend_Bean){
				this.id = id
				this.Expend_Bean = Expend_Bean
				this.JoinShow = true
			},
			
			//确定加入
			determine(){
				// console.log(this.id)
				Snatch_Join(this.id,this.num).then((res) => {
					if(res.data.code == 200){
						this.JoinShow = false
						this.$message({
							message: '加入成功!',
							type: 'success'
						})
						this.$router.push({
							path:'/PrizeDetails',
							query:{
								id:this.id
							}
						})
					}
				})
				
			},
			
			//查看已结束
			ChaKan(id){
				this.$router.push({
					path:'/PrizeDetails',
					query:{
						id:id
					}
				})
			},
			
			//取消加入
			cancel(){
				this.JoinShow = false
				this.id = ''
				this.Expend_Bean = ''
			}
		},
		
		beforeRouteLeave (to, from, next) {
		    clearInterval(this.timer)
			next()
		},
		
		watch:{
			JinXingArr(val){
				clearInterval(this.timer)
				setTimeout(() => {
					this.DingShi()
				},5000)
			}
		}
	}
</script>

<style lang="scss">
	#RushPurchase-box {
		width: 14rem;
		padding-top: 0.4rem;
		
		.PageNum {
			width: 100%;
			text-align: center;
			margin-top: 0.5rem;
		
			li {
				background: #111111 !important;
		
				&.active {
					background: #ffd322 !important;
					color: #000;
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
		
		.RuleTips {
			margin-top: 0.3rem;
			text-align: center;
			font-size: 0.16rem;
			color: #2a9fd6;
			cursor: pointer;
			&:hover{
				color: red;
			}
		}

		.Navigation {
			width: 100%;
			height: 0.36rem;
			margin-top: 0.4rem;
			display: flex;
			justify-content: center;
			p {
				height: 100%;
				padding: 0 0.5rem;
				background: #bbb;
				line-height: 0.36rem;
				text-align: center;
				margin-right: 0.2rem;
				font-size: 0.16rem;
				cursor: pointer;
				border-radius: 0.02rem;
				color: #000;
				&.active{
					background: #ffd322;
				}
			}
		}
		
		.TreasureList{
			width: 12rem;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			.TreasureList-Item{
				position: relative;
				width: 3.7rem;
				background: url(../../assets/images/PublicImg/duobao.png) no-repeat center;
				background-size: 100% 100%;
				margin: 0.4rem 0.3rem 0 0;
				border-radius: 0.1rem;
				padding:0.2rem 0 0.1rem;
				// box-shadow: 0.02rem 0.03rem 0.1rem black;
				box-sizing: border-box;
				overflow: hidden;
				&:nth-child(3n){
					margin-right: 0;
				}
				
				.title_box{
					width: 100%;
					height: 0.4rem;
					text-align: center;
					line-height: 0.4rem;
					font-size: 0.2rem;
					margin-bottom: 0.1rem;
				}
				.People{
					width: 1rem;
					height: 1rem;
					background-color: #ffd322;
					border-radius: 50%;
					position: absolute;
					right: -0.5rem;
					top: -0.5rem;
					box-sizing: border-box;
					color: #000;
					p{
						width: 0.4rem;
						height: 0.2rem;
						text-align: center;
						line-height: 0.2rem;
						position: absolute;
						bottom: 0.18rem;
						left: 0.1rem;
					}
				}
				.Price{
					width: 100%;
					height: 0.3rem;
					display: flex;
					align-items: center;
					justify-content: center;
					img{
						width: 0.3rem;
						vertical-align: middle;
						margin-right: 0.05rem;
					}
					p{
						font-size: 0.2rem;
						color: #fff;
					}
				}
				.RenShu{
					margin-top: 0.1rem;
					width: 100%;
					height: 0.3rem;
					text-align: center;
					line-height: 0.3rem;
					font-size: 0.14rem;
				}
				
				.core{
					width: 2.8rem;
					height: 2.5rem;
					margin: 0.1rem auto 0;
					position: relative;
					.BJ{
						position: absolute;
						width: 100%;
						height: 100%;
					}
					.pic{
						width: 100%;
						height: 100%;
						position: relative;
						// z-index: 10;
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
				
				.info{
					width: 100%;
					margin-top: 0.1rem;
					text-align: center;
					p{
						font-size: 0.16rem;
						color: #fff;
						line-height: 0.3rem;
					}
					span{
						font-size: 0.14rem;
						color: #CCCCCC;
					}
				}
				
				.TreasureBtn{
					width: 2.4rem;
					height: 0.4rem;
					background: #ffd322;
					margin: 0.1rem auto 0;
					text-align: center;
					line-height: 0.4rem;
					color: #fff;
					font-size: 0.16rem;
					border-radius: 0.2rem;
					cursor: pointer;
					color: #000;
				}
				.ChaKan{
					width: 2.4rem;
					height: 0.4rem;
					background: #ffd322;
					margin: 0.1rem auto 0;
					text-align: center;
					line-height: 0.4rem;
					color: #fff;
					font-size: 0.16rem;
					border-radius: 0.2rem;
					cursor: pointer;
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
		             background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
		        }
		         width: 5rem;
		         position: relative;
		         border: 1px solid rgba(255, 255, 255, 0.6);
		         background-color: rgba(0, 0, 0, 0.7);
		         border-radius: 0.08rem;
		         overflow: hidden;
		         padding: 0 0.35rem 0.2rem;
		         box-sizing: border-box;
				 .num_box{
					 text-align: center;
					 margin-top: 20px;
				 }
		         p {
		             width: 100%;
		             font-size: 0.18rem;
		             margin-top: 0.2rem;
		             color: #fff;
		             display: flex;
		             justify-content: center;
		             align-items: center;
		        }
		         .btns {
					 margin-top: 0.1rem;
		             width: 100%;
		             height: 0.4rem;
		             display: flex;
		             justify-content: center;
		             span {
		                 display: block;
		                 width: 1.3rem;
		                 height: 0.4rem;
		                 background: hsla(0, 0%, 100%, .06);
		                 border: 1px solid hsla(0, 0%, 100%, .2);
		                 color: #e4e4e4;
		                 border-radius: 0.04rem;
		                 text-align: center;
		                 line-height: 0.4rem;
		                 font-size: 0.16rem;
		                 margin-right: 0.2rem;
		                 cursor: pointer;
		            }
		             .btn-two {
		                 margin-right: 0;
		                 background: #ffd322;
		                 border-color: #ffd322;
						 color: #000;
		            }
		        }
		    }
		}
	}
</style>
