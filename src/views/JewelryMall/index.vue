<template>
	<div id="JewelryMall">
		<div class="JewelryMall-box">
			<div class="Title">
				<p>积分商城</p>
			</div>
			
			<div class="mall_title">
				我的积分<span><img src="@/assets/images/mall/JiFen.png" alt="">{{user.integral}}</span>
			</div>
			<div class="JewelryMall-nav">
				<div class="CSGO-Tu">
					<img src="@/assets/images/PublicImg/csgoimg.png" alt="">
					<p>CSGO</p>
				</div>
				<div class="PaiXv" @click="GetSort">
					{{sortTxt}}
				</div>

				<div class="Serch">
					<div class="Serch-item">
						<div class="JinQian">
							<img src="@/assets/images/PublicImg/JinBi.png" alt="">
						</div>
						<input type="number" v-model="min_num" v-show="false">
						<input type="number" v-model="min_txt">
					</div>
					<p>—</p>
					<div class="Serch-item">
						<div class="JinQian">
							<img src="@/assets/images/PublicImg/JinBi.png" alt="">
						</div>
						<input type="number" v-model="max_num" v-show="false">
						<input type="number" v-model="max_txt">
					</div>
					<div class="Serch-item" @click="GetSerch">
						查询
					</div>
				</div>
			</div>

			<div class="JewelryMall-list">
				<div class="JewelryMall-list-item" v-for="(item,index) in ShopArr" :key="index" @click="GouMaiShiPin(item)">
					<div class="ceng"></div>
					<div class="info">
						<div class="jiage">
							<img src="@/assets/images/mall/JiFen.png" alt="">
							<p>{{item.integral}}</p>
						</div>
						<div class="kucun">
							<p class="PinZhi">{{item.dura_alias}}</p>
						</div>
					</div>
					<div class="pic_bj">
						<!-- <img :src="item.lv | filter2" alt=""> -->
					</div>
					<div class="pic">
						<img :src="item.cover" alt="">
					</div>
					<div class="item-data">
						<p class="name">{{item.name}}</p>
						<span><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.bean}}</span>
					</div>
				</div>
			</div>
			<div class="PageNum">
				<el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page_size" :total="total" :key="total">
				</el-pagination>
			</div>

			<!-- 购买 -->
			<van-overlay :show="GouMaiShow">
				<div class="wrapper">
					<div class="wrapper-box">
						<div class="wrapper-box-top"></div>
						<div class="cancel">
							<img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="CloseGiveShow">
						</div>
						<div class="tit">{{GiveName}}</div>
						<div class="pic">
							<img :src="GiveImg" alt="">
						</div>
						<form>
							<div class="other">
								<div class="ShuLiang">
									<p @click="GaiBianSPinNum('-')">-</p>
									<p>{{SPinNum}}</p>
									<p @click="GaiBianSPinNum('+')">+</p>
								</div>
								<div class="ZongJiaGe">
									<p>积分：</p>
									<span><img src="@/assets/images/mall/JiFen.png" alt="">{{JiaGeNum}}</span>
								</div>
							</div>
						</form>
						<div class="btns">
							<span @click="CloseGiveShow">取消兑换</span>
							<span class="btn-two" @click="GetGive">确定兑换</span>
						</div>
					</div>
				</div>
			</van-overlay>

		</div>
	</div>
</template>

<script>
	import { GetShop, Shop_Buy,PersonalInfo } from '@/network/api.js'
	import { mapState, mapMutations } from 'vuex'
	export default {
		name: 'JewelryMall',
		data() {
			return {
				GouMaiShow: false, 			//购买弹框
				GiveImg: null,     			//购买物品图片
				GiveName: '',   			//购物物品名称

				SPinNum: 1,    				//购买物品数量
				GiveId:'',					//购买物品id

				GiveJiaGe: 0,  				//购买价格

				ShopArr: [],   				//列表
				
				total:0,       				//列表总数
				page_size:0,   				//一页条数
				
				sort:'1',       			//排序
				sortTxt:'价格从高到低',      //排序显示
				
				min_num:'0',				 //价格区间(开始)
				max_num:'1000000',           //价格区间(结束)
				min_txt:'',					 //价格开始(可见)
				max_txt:'',					 //价格结束(可见)
				page_num:'1'                 //页码
			}
		},
		
		filters:{
			filter1(val) {
				if (val == '1') {
					return 'background:#e6ba1c'
				} else if (val == '2') {
					return 'background:#d32ce6'
				} else if (val == '3') {
					return 'background:#834fff'
				} else if (val == '4') {
					return 'background:#4b69ff'
				} else {
					return 'background:#bbbbbb'
				}
			},
			
			filter2(val){
				if (val == '1') {
					return require('@/assets/images/PublicImg/LV1.png')
				} else if (val == '2') {
					return require('@/assets/images/PublicImg/LV2.png')
				} else if (val == '3') {
					return require('@/assets/images/PublicImg/LV3.png')
				} else if (val == '4') {
					return require('@/assets/images/PublicImg/LV4.png')
				} else {
					return require('@/assets/images/PublicImg/LV5.png')
				}
			},
		},
		
		created() {
			this.Shop()
		},
		
		methods: {
			//获取列表
			Shop(page){
				GetShop(this.min_num,this.max_num,this.sort,this.page_num).then((res) => {
					// console.log(res.data.data)
					this.ShopArr = res.data.data.data
					this.total = res.data.data.total
					this.page_size = res.data.data.per_page
				})
			},
			
			//排序
			GetSort(){
				if(this.sort == '0'){
					this.sort = '1'
					this.sortTxt = '价格从高到低'
					this.Shop(this.min_num,this.max_num,this.sort,this.page_num)
				}else if(this.sort == '1'){
					this.sort = '0'
					this.sortTxt = '价格从低到高'
					this.Shop(this.min_num,this.max_num,this.sort,this.page_num)
				}
			},
			
			//筛选
			GetSerch(){
				this.page_num = '1'
				this.Shop()
			},
			
			//商品列表分页
			handleCurrentChange(val) {
				// console.log(val)
				this.page_num = val
				this.Shop()
			},

			//购买操作
			GouMaiShiPin(item) {
				// console.log(item)
				this.GiveId = item.id
				this.GiveImg = item.cover
				this.GiveName = item.name
				this.GiveJiaGe = Number(item.integral)
				this.GouMaiShow = true
			},

			//改变购买数量
			GaiBianSPinNum(v) {
				if (v == '-') {
					if (this.SPinNum <= 1) {
						this.$message({
							message: '最少选择一件商品!',
							type: 'error'
						})
					} else {
						this.SPinNum = this.SPinNum - 1
					}
				} else if (v == '+') {
					if (this.SPinNum >= 10) {
						this.$message({
							message: '单次购买上限10件!',
							type: 'error'
						})
					} else {
						this.SPinNum = this.SPinNum + 1
					}
				}
			},

			//关闭购买弹框
			CloseGiveShow() {
				this.GouMaiShow = false
				setTimeout(() => {
					this.GiveJiaGe = 0
					this.SPinNum = 1
				}, 500)
			},

			//支付操作
			GetGive() {
				Shop_Buy(this.GiveId,this.SPinNum).then((res) => {
					// console.log(res.data)
					this.$message({
						message: '兑换成功',
						type: 'success'
					})
					this.GetPersonalInfo()
					this.GiveId = ''
					this.GouMaiShow = false
					this.GouMaiShow = false
					setTimeout(() => {
						this.GiveJiaGe = 0
						this.SPinNum = 1
					}, 500)
				})
			},
			
			
			//个人信息
			GetPersonalInfo() {
				PersonalInfo().then((res) => {
					this.User(res.data.message)
				})
			},
			
			...mapMutations([
				'User'
			])
		},

		computed: {
			JiaGeNum() {
				return (this.GiveJiaGe * this.SPinNum).toFixed(2)
			},
			...mapState([
				'user'
			])
		},
		
		
		watch:{
			min_txt(val){
				if(val == ''){
					this.min_num = '0'
				}else{
					this.min_num = val
				}
			},
			max_txt(val){
				if(val == ''){
					this.max_num = '1000000'
				}else{
					this.max_num = val
				}
			}
		}
	}
</script>

<style lang="scss">
	.JewelryMall-box {
		width: 12.5rem;
		margin: 0 auto;
		overflow: hidden;
		padding-top: 0.4rem;
		
		.mall_title{
			font-size: 22px;
			color: #fff;
			span{
				margin-left: 10px;
				img{
					width: 20px;
					vertical-align: middle;
					margin: 0 2px 2px 0;
				}
			}
		}
		
		.JewelryMall-nav {
			position: relative;
			background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
			background-size: cover;
			width: 100%;
			height: 0.7rem;
			margin-top: 0.3rem;
			display: flex;
			align-items: center;
			padding: 0 0.2rem;
			box-sizing: border-box;

			.CSGO-Tu {
				width: 1.2rem;
				height: 0.44rem;
				background: #ffd322;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 0.04rem;
				overflow: hidden;

				img {
					width: 0.22rem;
					height: 0.22rem;
					vertical-align: middle;
					margin-right: 0.05rem;
				}

				p {
					font-size: 0.16rem;
				}
			}

			.PaiXv {
				font-size: 0.16rem;
				color: #fff;
				margin-left: 0.2rem;
				cursor: pointer;
			}


			.Serch {
				position: absolute;
				right: 0.2rem;
				top: 0;
				height: 100%;
				display: flex;
				align-items: center;

				.Serch-item {
					width: 1.2rem;
					height: 0.44rem;
					border: 1px solid #ffd322;

					border-radius: 0.05rem;
					display: flex;
					justify-content: center;
					align-items: center;

					.JinQian {
						width: 0.38rem;
						height: 0.4rem;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							width: 0.2rem;
							height: 0.2rem;
						}
					}

					input {
						width: 0.56rem;
						height: 0.32rem;
						border: none;

						&::-webkit-inner-spin-button {
							-webkit-appearance: none !important;
							margin: 0;
						}
					}

					&:last-child {
						background: #ffd322;
						color: #fff;
						font-size: 0.16rem;
						border: 1px solid #ffd322;
						margin-left: 0.3rem;
						line-height: 0.44rem;
						cursor: pointer;
						color: #000;

					}
				}

				p {
					margin: 0 0.1rem;
					color: #ffd322;
				}
			}
		}

		.JewelryMall-list {
			width: 100%;
			margin-top: 0.3rem;
			display: flex;
			flex-wrap: wrap;

			.JewelryMall-list-item {
				width: 2rem;
				margin-right: 0.1rem;
				background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
				background-size: cover;
				border: 1px solid transparent;
				border-radius: 0.04rem;
				overflow: hidden;
				margin-bottom: 0.1rem;
				box-sizing: border-box;
				cursor: pointer;
				position: relative;
				padding-bottom: 0.1rem;
				.ceng {
					width: 100%;
					height: 100%;
					background: rgba(233, 177, 14, .1);
					position: absolute;
					left: 0;
					top: 0;
					z-index: 2;
					opacity: 0;
				}

				.info {
					width: 100%;
					height: 0.5rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 0.1rem;
					box-sizing: border-box;

					.jiage {
						width: 50%;
						height: 100%;
						display: flex;
						align-items: center;

						img {
							width: 0.25rem;
							height: 0.25rem;
							vertical-align: middle;
							margin-right: 0.02rem;
						}

						p {
							font-size: 0.18rem;
							color: #75cd66;
						}
					}

					.kucun {
						font-size: 0.14rem;
						line-height: 0.5rem;
					}
				}
				.pic_bj{
					position: absolute;					
					width: 1.7rem;
					height: 1.5rem;
					display: flex;
					justify-content: center;
					align-items: center;
					background-size: cover;
					left: 0.15rem;
					top: 0.5rem;
					img {
						vertical-align: middle;
						max-width: 80%;
						max-height: 80%;
					}
				}
				.pic {
					width: 1.7rem;
					height: 1.5rem;
					margin: 0 auto;
					display: flex;
					justify-content: center;
					align-items: center;
					background-size: cover;
					position: relative;
					z-index: 1;
					img {
						vertical-align: middle;
						max-width: 80%;
						max-height: 80%;
					}
				}

				.item-data {
					width: 100%;
					padding: 0.05rem;
					box-sizing: border-box;
					text-align: center;
					.name {
						font-size: 0.14rem;
						color: #fff;
					}
					span{
						display: block;
						margin: 10px 0 0;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #fff;
						font-size: 14px;
						img{
							width: 18px;
						}
					}

				}
				.box_xian{
					width: 0.77rem;
					height: 0.04rem;
					background: transparent;
					margin: 0.2rem auto 0;
				}


				&:nth-child(6n) {
					margin-right: 0;
				}

				&:hover {
					border-color: #E9B10E;

					.ceng {
						opacity: 1;
					}
				}
			}
		}

		.PageNum {
			width: 100%;

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

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.wrapper-box {
				z-index: 2001;

				.wrapper-box-top {
					width: 100%;
					height: 0.03rem;
					background: linear-gradient(90deg, transparent, rgba(72, 84, 201, 0.8), transparent);
				}

				width: 5rem;
				height: 5.5rem;
				position: relative;
				border: 1px solid #4854c9;
				background-color: #1e2355;
				border-radius: 0.08rem;
				overflow: hidden;
				padding: 0 0.35rem;
				box-sizing: border-box;

				.tit {
					width: 100%;
					font-size: 0.24rem;
					text-align: center;
					line-height: 0.8rem;
				}

				.other {
					width: 100%;
					height: 0.5rem;
					display: flex;
					align-items: center;
					justify-content: space-around;
					margin-top: 0.2rem;

					.ShuLiang {
						display: flex;
						justify-content: center;
						align-items: center;

						p {
							width: 0.3rem;
							height: 0.3rem;
							background: rgba(255, 255, 255, 0.08);
							text-align: center;
							line-height: 0.3rem;
							font-size: 0.16rem;
							cursor: pointer;

							&:nth-child(2) {
								width: 0.5rem;
								margin: 0 0.1rem;
							}
						}
					}

					.ZongJiaGe {
						display: flex;
						align-items: center;

						p {
							font-size: 0.18rem;
						}

						span {
							margin-top: 0.03rem;
							width: 0.7rem;
							display: flex;

							img {
								vertical-align: middle;
								width: 0.2rem;
								height: 0.2rem;
								margin-bottom: 0.02rem;
							}

							font-size: 0.18rem;
							color: #75cd66;
						}
					}
				}

				.pic {
					width: 2.75rem;
					height: 2.75rem;
					margin: 0 auto;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 0.04rem;
					overflow: hidden;
					background: url(../../assets/images/PublicImg/item-bg.jpg) no-repeat center;
					background-size: cover;

					img {
						max-width: 80%;
						max-height: 80%;
					}
				}

				.btns {
					width: 100%;
					height: 0.5rem;
					display: flex;
					justify-content: center;
					margin-top: 0.2rem;

					span {
						display: block;
						width: 1.65rem;
						height: 0.5rem;
						background: hsla(0, 0%, 100%, .06);
						border: 1px solid hsla(0, 0%, 100%, .2);
						color: #e4e4e4;
						border-radius: 0.04rem;
						text-align: center;
						line-height: 0.5rem;
						font-size: 0.14rem;
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

				.info {
					margin-top: 0.3rem;
					text-align: center;
					font-size: 0.12rem;
					color: rgba(255, 255, 255, 0.53);
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
