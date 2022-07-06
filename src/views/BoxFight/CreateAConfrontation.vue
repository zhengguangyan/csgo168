<template>
	<div id="CreateAConfrontation">
		<div class="CreateAConfrontation-box">
			<div class="Title">
				<p>创建对战</p>
			</div>
			<div class="Navigation">
				<div class="Navigation-F">
					<div class="round">
						{{choiceList.length}}回合
					</div>
					<div class="PeopleNum">
						<p @click="ControlPeople('2')" :class="{ 'active' : PeopleNum == '2' }">双人模式</p>
						<p @click="ControlPeople('3')" :class="{ 'active' : PeopleNum == '3' }">三人模式</p>
						<p @click="ControlPeople('4')" :class="{ 'active' : PeopleNum == '4' }">四人模式</p>
					</div>
				</div>
				<div class="Navigation-R">
					箱子总价：<p><img src="@/assets/images/PublicImg/JinBi.png" alt=""><span>{{TotalPrice}}</span></p>
				</div>
			</div>
			<div class="BoxList">
				<div class="AddTo" v-show="choiceList.length == 0">
					<div class="XZ" @click="OpenXZshow">
						+
					</div>
					<p>添加箱子</p>
				</div>
				<div class="BoxList-item" v-for="(item,index) in choiceList" :key="index">
					<div class="item-T">
						<p @click="deleteItem(item,index)">-</p>
					</div>
					<div class="pic">
						<img :src="item.cover" alt="">
					</div>
					<div class="name">{{item.name}}</div>
					<div class="money"><img src="@/assets/images/PublicImg/JinBi.png" alt=""><span>{{item.game_bean}}</span></div>
				</div>
				<div class="AddToBox" @click="OpenXZshow" v-show="choiceList.length < 6 && choiceList.length > 0">
					<p>添加箱子</p>
				</div>
			</div>
			<div class="btn" @click="Establish">创建对战</div>

			<!-- 添加箱子遮罩层 -->
			<van-overlay :show="XZshow">
				<div class="wrapper">
					<div class="block">
						<div class="block-T">
							<p>添加箱子</p>
							<span @click="CloseXZshow">×</span>
						</div>
						<div class="Info">
							<p>单击选择盲盒 <span>你能选择最多6件盲盒</span></p>
							
						</div>
						<div class="Box-List">
							<div class="Box-List-item" v-for="(item,index) in hotboxlist" :key="index" @click="choice(item,index)" ref="Active">
								<div class="ceng">
									<p>+</p>
								</div>
								<div class="pic">
									<img :src="item.cover" alt="">
								</div>
								<div class="name">{{item.name}}</div>
								<div class="money"><img src="@/assets/images/PublicImg/JinBi.png" alt=""><span>{{item.game_bean}}</span></div>
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
	import { Arena_Box_List, Arena_Create } from '@/network/api.js'
	export default {
		name: 'CreateAConfrontation',
		data() {
			return {
				XZshow: false,
				PeopleNum:'2',
				TotalPrice:0,
				hotboxlist:[],
				choiceList:[],
			}
		},
		
		created() {
			
		},
		
		methods:{
			//打开箱子弹框
			OpenXZshow(){
				this.XZshow = true
			},
			//关闭箱子弹框
			CloseXZshow(){
				this.XZshow = false
			},
			//人数选择
			ControlPeople(str){
				this.PeopleNum = str
			},
			
			//箱子选择
			choice(item,index){
				let key = "Select";
				let value = true
				item[key] = value
				
				this.$refs.Active[index].style = 'border: 1px solid #E9B10E;'
				this.choiceList.push(item)
			},
			
			//删除选中箱子
			deleteItem(item,index){
				let A_Arr = this.choiceList.filter((i) => {
					return i.id == item.id
				})
				
				if(A_Arr.length < 2){
					let K = this.hotboxlist.findIndex((value)=>value.id == A_Arr[0].id)
					this.$refs.Active[K].style = 'border: 1px solid transparent;'
				}
				
				this.choiceList.splice(index,1)
			},
			
			//创建对战
			Establish(){
				this.$socket.Event(id => {
					let box = []
					for(let i = 0; i < this.choiceList.length; i++){
						box.push(this.choiceList[i].id)
					}
					Arena_Create(this.PeopleNum,box).then((res) => {
						this.$message({
							message: '创建成功',
							type: 'success'
						})
						this.seeShare(res.data.data.id)
					})
				})
				
			},
			
			
			seeShare(id){
			     let routeUrl = this.$router.resolve({
			          path: "/vsbox",
			          query: {
						  id: id,
						  Code:0
					  }
			     });
			     window.open(routeUrl .href,'_self');
			}
			
		},
		
		created() {
			Arena_Box_List().then(res => {
				this.hotboxlist = res.data.data
			})
		},
		
		watch:{
			choiceList(Arr){
				if(Arr.length > 6){
					this.$message({
						message: "最多选择6个宝箱!",
						type: 'error'
					})
				this.choiceList.splice(Arr.length - 1,1)
				}
				
				let ArrAy = []
				for(let i = 0; i < Arr.length; i++){
					ArrAy.push(Number(Arr[i].game_bean))
				}
				
				let Price = 0
				for(let k = 0;k < ArrAy.length; k++){
				    Price = Price +ArrAy[k]
				} 
				
				this.TotalPrice = Price.toFixed(2)
			}
		}
		
	}
</script>

<style lang="scss">
	.CreateAConfrontation-box {
		width: 100%;
		padding-top: 0.4rem;

		.Navigation {
			width: 100%;
			height: 0.9rem;
			display: flex;
			justify-content: space-between;
			margin-top: 0.4rem;
			background: url(../../assets/images/PublicImg/stock_2.png) no-repeat center;
			background-size: cover;
			box-sizing: 0.01rem 0.01rem 0.03rem #1f2341;

			.Navigation-F {
				display: flex;
				height: 100%;

				.round {
					width: 1.4rem;
					height: 100%;
					text-align: center;
					line-height: 0.9rem;
					font-size: 0.24rem;
					color: #fff;
				}

				.PeopleNum {
					width: 4.2rem;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					border-left: 1px solid rgba(255, 255, 255, 0.1);
					border-right: 1px solid rgba(255, 255, 255, 0.1);
					box-sizing: border-box;

					p {
						width: 1.2rem;
						height: 0.4rem;
						border: 1px solid #4854c9;
						background: transparent;
						color: #4854c9;
						border-radius: .06rem;
						text-align: center;
						line-height: 0.4rem;
						margin: 0 0.05rem;
						font-size: 0.16rem;
						cursor: pointer;

						&.active {
							background: #4854c9;
							color: #fff;
						}
					}
				}
			}

			.Navigation-R {
				width: 2.2rem;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 0.2rem;
				color: #fff;

				p {
					display: block;
					display: flex;
					justify-content: center;
					align-items: center;
					

					img {
						width: 0.25rem;
						height: 0.25rem;
						vertical-align: middle;
					}

					span {
						color: #75cd66;;
						margin-left: 0.05rem;
					}
				}
			}
		}

		.BoxList {
			width: 100%;
			height: 3.1rem;
			margin-top: 0.3rem;
			background: url(../../assets/images/PublicImg/stock_2.png) no-repeat center;
			background-size: cover;
			box-shadow: 0.01rem 0.01rem 0.03rem #111111;
			padding: 0 0.1rem;
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.BoxList-item {
				width: 2.21rem;
				height: 2.9rem;
				background: #1B1D36;
				border: 1px solid #525aa5;
				border-radius: 0.06rem;
				padding: 0.2rem;
				box-sizing: border-box;
				margin-right: 0.12rem;
				
	
				.item-T {
					width: 100%;
					height: 0.2rem;

					p {
						width: 0.2rem;
						height: 0.2rem;
						border: 1px solid rgba(255, 255, 255, .6);
						border-radius: 0.06rem;
						text-align: center;
						line-height: 0.18rem;
						font-size: 0.14rem;
						color: rgba(255, 255, 255, .6);
						cursor: pointer;
					}
				}

				.pic {
					width: 1.8rem;
					height: 1.5rem;
					margin: 0.05rem auto;
					display: flex;
					justify-content: center;
					align-items: center;

					img {
						vertical-align: middle;
						max-width: 100%;
						max-height: 100%;
					}
				}

				.name {
					width: 100%;
					margin-top: 0.05rem;
					text-align: center;
					color: #9e9e9e;
					font-size: 0.16rem;
				}

				.money {
					width: 100%;
					margin-top: 0.1rem;
					display: flex;
					justify-content: center;
					align-items: center;

					img {
						width: 0.25rem;
						height: 0.25rem;
						vertical-align: middle;
					}

					span {
						font-size: 0.16rem;
						color: #75cd66;
					}
				}
			}
			.AddToBox{
				width: 2.21rem;
				height: 2.9rem;
				background: #1B1D36;
				border: 1px solid #525aa5;
				border-radius: 0.06rem;
				padding: 0.2rem;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				p{
					font-size: 0.18rem;
				}
			}

			.AddTo {
				width: 100%;

				.XZ {
					width: 0.45rem;
					height: 0.45rem;
					margin: 0 auto;
					border: 1px solid #adafae;
					color: #adafae;
					font-size: 0.14rem;
					text-align: center;
					line-height: 0.45rem;
					border-radius: 0.04rem;
					cursor: pointer;
					transition: .3s;

					&:hover {
						background: #adafae;
						color: #fff;
					}
				}

				p {
					margin-top: 0.05rem;
					text-align: center;
					color: #adafae;
					font-size: 0.14rem;
				}
			}
		}

		.btn {
			width: 1rem;
			height: 0.4rem;
			margin: 0.2rem auto 0;
			background: #4854c9;
			font-size: 0.16rem;
			border-radius: 0.04rem;
			color: #fff;
			text-align: center;
			line-height: 0.4rem;
			cursor: pointer;
		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		.block {
			width: 8rem;
			height: 6.7rem;
			background-color: #1f2341;
			border-radius: 0.06rem;
			padding: 0.2rem;
			box-sizing: border-box;
			
			.Info{
				margin: 0.05rem 0;
				p{
					font-size: 0.2rem;
					color: #c3c3e2;
				}
				span{
					font-size: 0.16rem;
					color: #848492;
				}
			}
			
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
					color: rgba($color: #ffffff, $alpha: .6);
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
					border: 1px solid transparent;
					box-sizing: border-box;
					&:nth-child(4n) {
						margin-right: 0;
					}
					
					&:hover{
						.ceng{
							opacity: 1;
						}
					}
					
					.ceng{
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						background: rgba($color: #000000, $alpha: .6);
						display: flex;
						justify-content: center;
						align-items: center;
						opacity: 0;
						transition: 0.3s;
						p{
							width: 0.6rem;
							height: 0.6rem;
							border-radius: 50%;
							background: rgba($color: #ffffff, $alpha: .1);
							color: #fff;
							text-align: center;
							line-height: 0.6rem;
							font-size: 0.18rem;
						}
					}
					
					.pic {
						width: 1.8rem;
						height: 1.5rem;
						margin: 0.1rem auto 0;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							max-width: 100%;
							max-height: 100%;
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
							color: #75cd66;
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
			
			.boxbtn{
				width: 100%;
				height: 0.35rem;
				display: flex;
				justify-content: flex-end;
				p{
					width: .7rem;
					height: .35rem;
					background: #4854c9;
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
