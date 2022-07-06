<template>
	<div id="Activity_open">
		<div class="Activity_open_box">
			<div class="Title center" style="position:relative;">
				<p>{{ItemInfo.name}}</p>
				<div class="Dh_box">
					<span>跳过动画</span>
					<van-switch v-model="checked" size="24px" />
				</div>
			</div>
			<goods :pic="ItemInfo.weapon_cover"></goods>

			<luckdraw :ItemData="ItemData" :CSnum="CSnum" :active='active' :List="List" v-show="luckdrawShow == true" @fromChild="fromChild"></luckdraw>

			<div class="box_bean">
				<img src="@/assets/images/PublicImg/JinBi.png" alt="">
				{{ ((ItemInfo.bean*active)).toFixed(2) }}
			</div>

			<div class="check-box">
				<div class="box">
					<span v-for="(k,index) in 5" :key="k" :class="active == k ? 'active' : ''" @click="checkBoxNum(k)">{{ index + 1 }}</span>
				</div>
			</div>
			<el-button @click="Open" :disabled="disabled">
				<div class="Yuan">OPEN</div>
			</el-button>
			<!-- <div class="Title">
				<p>箱内宝贝</p>
			</div>
			<div class="Ttem_List">
				<div v-for="(value, key) in List" :key="key" class="item">
					<span><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{value.bean}}</span>
					<div class="pic" :style="'background-image: url('+value.lv_bg_image+')'">
						<img :src="value.cover" alt="" />
					</div>
					<div class="name">{{ value.name }}</div>
					<p>概率:{{value.odds_percent}}</p>
				</div>
			</div> -->

			<!-- 开奖遮罩层 -->
			<van-overlay :show="Tshow">
				<div class="wrapper">
					<!-- <div class="out_box">
						<div class="item-list">
							<div class="item" v-for="(value,index) in ItemShuJv" :key="KeyArr[index]">
								<div class="pic" :style="value.lv">
									<img :src="value.cover" alt="" />
								</div>
								<div class="Di">
									<div class="bean"><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{ parseInt(value.bean*100)/100 }}</div>
									<div class="name">{{ value.name }}</div>
								</div>
								<div class="cover" :class="{'active' : value.Select == true}" @click="IsCover(value,index)"></div>
							</div>
						</div>
						<div class="btns">
							<div class="block">
								<el-button type="danger" @click="GuanBi()">放入背包</el-button>
							</div>
							<div class="block">
								<el-button type="danger" @click="Postcash()">回收(${{JiaZhi.toFixed(2)}})</el-button>
							</div>
						</div>
					</div> -->
					<div class="Show_box">
						<div class="Show_title">您已获得以下物品</div>
						<div class="Show_list">
							<div class="Show_item" v-for="(item,index) in ItemShuJv" :key="index" @click="SelectItem(item,index)" ref="Select">
								<div class="Show_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
									<img :src="item.cover" alt="">
								</div>
								<p>{{item.name}}</p>
								<span><img src="@/assets/images/public/Gold.png" alt="">{{item.bean}}</span>
							</div>
						</div>
						<div class="Show_btns">
							<van-button type="info" @click="GuanBi">继续开箱</van-button>
							<van-button type="info" @click="Postcash">回收<span class="Gold"><img src="@/assets/images/public/Gold.png" alt="">{{JiaZhi.toFixed(2)}}</span></van-button>

						</div>
					</div>
				</div>
			</van-overlay>

			<!-- <div class="Box_History" :style="ShowOrHide">
				<div class="An_btn" @click="Open_History">历史记录</div>
				<div class="Box_History_title">
					<p>最近开奖记录</p>
				</div>
				<div class="Box_History_item" v-for="(item,index) in HistoryList">
					<img class="D_BJ" :src="item.lv | GuolvTwo" alt="">
					<div class="ceng">
						<div class="pic">
							<img :src="item.user.avatar" alt="">
						</div>
						<p>{{item.user.name}}</p>
					</div>
					<div class="pic">
						<div class="pic_bj">
							<img :src="item.lv_bg_image" alt="">
						</div>
						
						<img :src="item.cover" alt="">
					</div>
					<div class="Box_info">
						<p>{{item.name | GuoLvOne}}</p>
						<span>{{item.dura_alias}}</span>
					</div>
				</div>
			</div> -->
			<goods-mian :DetailList="List" :ItemInfo="ItemInfo" :id="this.$route.query.id"></goods-mian>

		</div>
	</div>
</template>

<script>
	import {
		Box_detail,
		Open,
		cash,
		PersonalInfo,
		UnpackingRecord
	} from '@/network/api.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import goodsMian from '@/components/PubOpen/Goods.vue'
	import goods from './component/goods_box.vue'
	import luckdraw from './component/luckdraw.vue'
	export default {
		name: 'Activity_open',
		data() {
			return {
				box_type: "", //宝箱type
				ItemInfo: {}, //宝箱信息(不完整)
				ItemData: [], //奖品信息
				ItemShuJv: [], //奖品信息
				List: [], //宝箱内物品
				luckdrawShow: false, //开奖列表显示
				show: false, //CDK遮罩层
				CDK_Data: '', //CDK
				CDK_Show: false, //按钮替换
				ItemData_CDK: {}, //CDk宝箱信息
				active: 1,
				CSnum: 0,
				checked: false,
				Tshow: false,
				JiaZhi: 0,
				KeyArr: [1, 2, 3, 4, 5],
				boom: new Audio(require('@/assets/audios/boom.mp3')), //开箱结束声音
				disabled: false,
				HistoryList: [],
				left: '-5.52',
				time: null,
				checkBoxActive:true
			}
		},

		activated() {
			this.box_type = this.$route.query.type
			this.GetBox_detail()
			this.GetUnpackingRecord()
			// this.SetGetUnpackingRecord()
			this.Box_detail()
			this.luckdrawShow = false
			this.disabled = false
			// this.Set_Box_detail()
		},

		methods: {
			checkBoxNum(k){
				if(this.checkBoxActive){
					this.active = k
				}
			},
			checkBoxTrue(){
				this.checkBoxActive = false
				setTimeout(() => {
					this.checkBoxActive = true
				}, 5300)
			},
			GetBox_detail() {
				Box_detail(this.$route.query.id).then((res) => {
					this.ItemInfo = res.data.data
				})
			},


			Box_detail() {
				Box_detail(this.$route.query.id).then((res) => {
					this.List = res.data.data.box_awards
				})
			},

			Set_Box_detail() {
				setInterval(() => {
					this.Box_detail()
				}, 3000)
			},

			Open_History() {
				if (this.left == '-2.5') {
					this.left = '-5.52'
				} else if (this.left == '-5.52') {
					this.left = '-2.5'
				}

			},

			GetUnpackingRecord() {
				UnpackingRecord(this.$route.query.id).then((res) => {
					// console.log(res.data.data.historylist)
					this.HistoryList = res.data.data.historylist.slice(0, 10)
					// console.log(this.HistoryList)

				})
			},
			
			
			SetGetUnpackingRecord() {
				this.time = setInterval(() => {
					this.GetUnpackingRecord()
				}, 10000)
			},

			//关闭CDK弹框
			GBCDK() {
				this.show = false
				this.CDK_Data = ''
			},

			//开箱
			Open() {
				if (this.checked == true) {
					this.luckdrawShow = false
					this.disabled = true
					Open(this.$route.query.id, this.active).then((res) => {
						this.ItemShuJv = res.data.data.awardlist
						this.GetPersonalInfo()
						this.ZhongJiang()
						this.Select_All()
					})
				} else {
					this.luckdrawShow = true
					this.disabled = true
					Open(this.$route.query.id, this.active).then((res) => {
						this.ItemData = res.data.data.awardlist
						this.CSnum += 1
						this.GetPersonalInfo()
						this.Select_All()
						this.checkBoxTrue()
					})
				}

			},

			//默认全部选中
			Select_All() {
				for (let i = 0; i < this.ItemShuJv.length; i++) {
					let key = "Select"
					let value = true
					this.ItemShuJv[i][key] = value
					setTimeout(() => {
						this.$refs.Select[i].style.border = "1px solid #E9B10E"
					}, 10)

				}
				// console.log(this.Awardlist)
				this.TotalPriceCal()
			},

			//选中
			SelectItem(item, index) {
				// console.log(item)
				// console.log(index)
				if (item.Select) {
					delete item.Select
					this.$refs.Select[index].style.border = "1px solid transparent";
				} else {
					let key = "Select";
					let value = true
					item[key] = value
					this.$refs.Select[index].style.border = "1px solid #E9B10E"
				}
				this.TotalPriceCal()
			},

			// 计算回收总价
			TotalPriceCal() {
				this.JiaZhi = 0
				let A_Arr = this.ItemShuJv.filter((v) => {
					return v.Select == true
				})

				for (let k = 0; k < A_Arr.length; k++) {
					this.JiaZhi += Number(A_Arr[k].bean)
				}

			},


			fromChild(v) {
				// console.log(v)
				this.disabled = false
			},

			//zhongj
			ZhongJiang() {
				for (let j = 0; j < this.ItemShuJv.length; j++) {
					let key = "Select";
					let value = true
					this.ItemShuJv[j][key] = value
					this.JiaZhi = 0
					for (let i = 0; i < this.ItemShuJv.length; i++) {
						this.JiaZhi = this.JiaZhi + Number(this.ItemShuJv[i].bean)
					}
					this.Tshow = true
					this.boom.play()
				}
			},

			//关闭遮罩层
			GuanBi() {
				this.disabled = false
				this.Tshow = false
			},
			//筛选
			IsCover(item, index) {
				if (this.ItemShuJv[index].Select == true) {
					this.ItemShuJv[index].Select = false
				} else {
					this.ItemShuJv[index].Select = true
				}
				this.KeyArr = this.KeyArr.map((item) => {
					return item + 1
				})

				this.JiaZhi = 0

				let ZJArr = this.ItemShuJv.filter((i) => {
					return i.Select == true
				})
				for (let i = 0; i < ZJArr.length; i++) {
					this.JiaZhi = this.JiaZhi + Number(ZJArr[i].bean)
				}
			},
			//回收
			Postcash() {
				// console.log(ItemData)

				let HSArr = this.ItemShuJv.filter((i) => {
					return i.Select == true
				})
				let data = []
				for (let i = 0; i < HSArr.length; i++) {
					data[i] = {
						id: HSArr[i].id,
						uuid: HSArr[i].uuid
					}

				}

				// console.log(data)

				cash(JSON.stringify(data)).then((res) => {
					// console.log(res)
					this.$message({
						message: '回收成功',
						type: 'success'
					})
					this.GetPersonalInfo()
					this.GuanBi()
				})
			},

			//切换组件与按钮
			childByValue(val) {
				// console.log(val)
				this.luckdrawShow = val
				this.CDK_Show = val
				this.CDK_Data = ''
				
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

		beforeRouteLeave:function(to, from, next){
			// console.log(this)
			clearInterval(this.time)
			this.time = null
			
			next();
		},

		filters: {
			filter2(val) {
				if (val == '1') {
					// return require('@/assets/images/PublicImg/LV1.png')
				} else if (val == '2') {
					// return require('@/assets/images/PublicImg/LV2.png')
				} else if (val == '3') {
					// return require('@/assets/images/PublicImg/LV3.png')
				} else if (val == '4') {
					// return require('@/assets/images/PublicImg/LV4.png')
				} else {
					// return require('@/assets/images/PublicImg/LV5.png')
				}
			},
			GuoLvOne(val) {
				if (val.length > 11) {
					return val.substr(0, 10) + '...'
				} else {
					return val
				}
			},

			GuolvTwo(val) {
				// if (val == '1') {
				// 	return require('@/assets/images/Swiper/Lv1.png')
				// } else if (val == '2') {
				// 	return require('@/assets/images/Swiper/Lv2.png')
				// } else if (val == '3') {
				// 	return require('@/assets/images/Swiper/Lv3.png')
				// } else if (val == '4') {
				// 	return require('@/assets/images/Swiper/Lv4.png')
				// } else {
				// 	return require('@/assets/images/Swiper/Lv5.png')
				// }
			},
		},

		computed: {
			ShowOrHide() {
				return 'left:' + this.left + 'rem'
			}
		},

		components: {
			goods,
			luckdraw,
			goodsMian
		}
	}
</script>

<style lang="scss">
	.Activity_open_box {
		width: 100%;
		padding-top: 0.4rem;
		position: relative;

		.box_bean{
			text-align: center;
			font-size:24px;
			font-weight: 500;
			color:#ffd322;
			img{width:44px;transform: translateY(12px);}
		}

		.Box_History {
			width: 3rem;
			box-sizing: border-box;
			position: absolute;
			top: 0;
			transition: .3s;

			.An_btn {
				position: absolute;
				right: -0.4rem;
				top: 3rem;
				width: 0.4rem;
				height: 1.3rem;
				writing-mode: vertical-rl;
				background: #ffd300;
				text-align: center;
				line-height: 0.45rem;
				letter-spacing: 4px;
				font-size: 0.22rem;
				border-radius: 0 0.04rem 0.04rem 0;
				color: #000;
				cursor: pointer;
			}

			.Box_History_title {
				width: 3rem;
				height: 0.7rem;
				text-align: center;
				line-height: 0.7rem;
				font-size: 0.22rem;
			}

			.Box_History_item {
				width: 3rem;
				height: 1.1rem;
				box-sizing: border-box;
				display: flex;
				cursor: pointer;
				position: relative;

				.D_BJ {
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					z-index: 1;
					top: 0;
				}

				.ceng {
					position: absolute;
					width: 100%;
					height: 100%;
					left: -3rem;
					top: 0;
					background: rgba($color: #000000, $alpha: .7);
					display: flex;
					align-items: center;
					border: 2px solid #ffd300;
					box-sizing: border-box;
					z-index: 11;
					transition: .3s;
					border-radius: .06rem;

					.pic {
						width: 0.8rem;
						height: 0.8rem;
						border-radius: 50%;
						overflow: hidden;
						margin-left: 0.2rem;

						img {
							width: 100%;
							height: 100%;
						}
					}

					p {
						font-size: 0.18rem;
						color: #fff;
						margin-left: 0.2rem;
					}
				}

				.pic {
					width: 1.1rem;
					height: 1.1rem;
					margin-left: 0.2rem;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					z-index: 2;

					.pic_bj {
						position: absolute;
						width: 100%;
						height: 100%;
						left: 0;
						top: 0;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							max-width: 80%;
							max-height: 80%;
						}
					}

					img {
						position: relative;
						z-index: 10;
						max-width: 100%;
						max-height: 100%;
					}
				}

				.Box_info {
					width: 1.7rem;
					height: 1.1rem;
					margin-left: 0.2rem;
					position: relative;
					z-index: 2;

					p {
						width: 100%;
						height: 0.4rem;
						margin-top: 0.2rem;
						line-height: 0.4rem;
						font-size: 0.16rem;
						color: #fff;
					}

					span {
						font-size: 0.14rem;
						color: #d4d4d4;
					}
				}

				&:hover {
					.ceng {
						left: 0;
					}
				}
			}
		}

		.Dh_box {
			width: 4rem;
			position: absolute;
			top:0.7rem;
			right:0px;
			display: flex;
			justify-content: center;
			align-items: center;

			span {
				font-size: 0.18rem;
				margin-right: .1rem;
			}
			.van-switch--on{
				background-color: #ff3691;
			}
		}

		.check-box {
			max-width: 6rem;
			border-radius: 0.1rem;
			padding: 0.2rem;
			margin: 0 auto;

			.box {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.14rem;

				span {
					display: block;
					color: rgb(255, 255, 255);
					cursor: pointer;
					width: 0.5rem;
					height: 0.5rem;
					line-height: 0.5rem;
					font-size: 0.22rem;
					text-align: center;
					transition: all 0.1s ease 0s;
					margin: 0.05rem;
					border:1px #d3a9fd solid;
				}

				.active {
					border-color:#fc63cf;
					background: rgba($color: #fc63cf, $alpha: .5);
				}
			}
		}

		.el-button {
			display: block;
			margin: 0 auto;
			height: 0.6rem;
			font-size: 0.3rem;
			border-radius: 0.04rem;
			background: none;
			border-style: none;
			transition: all 0.15s ease-in-out 0s;
			border-radius: 0.3rem;
			padding: 0;
			overflow: hidden;

			span {
				display: block;
				width: 100%;
				height: 0.6rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #E9B10E;
				box-sizing: border-box;

				img {
					width: 0.4rem;
				}

				.Yuan {
					width: 2rem;
					height: 0.5rem;
					border-radius: 0.3rem;
					background: linear-gradient(90deg, #815de5,#d72aa4);
					text-align: center;
					line-height: 0.5rem;
					font-size: 0.2rem;
					color: #fff;

					&:hover {
					background: linear-gradient(180deg, #815de5,#d72aa4);
					}
				}
			}
		}

		.el-button.is-loading:before {
			pointer-events: none;
			content: "";
			position: absolute;
			left: -0.01rem;
			top: -0.01rem;
			right: -0.01rem;
			bottom: -0.01rem;
			border-radius: inherit;
			background: rgba(255, 2, 17, 0.2);
		}

		.el-button.is-disabled,
		.el-button.is-disabled:focus,
		.el-button.is-disabled:hover {
			background: none !important;
			border-color: #ffd300 !important;
		}

		.Ttem_List {
			display: flex;
			flex-wrap: wrap;
			margin: .3rem auto 0;
			width: 12rem;

			.item {
				position: relative;
				width: 2.32rem;
				padding: 0.1rem 0;
				font-size: 0.5em;
				text-align: center;
				background-repeat: no-repeat;
				background-position: top center;
				background-size: .9rem .9rem;
				margin-right: 0.1rem;
				margin-bottom: 0.1rem;
				background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
				background-size: cover;
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 0.04rem;

				&:nth-child(5n) {
					margin-right: 0;
				}

				span {
					display: block;
					width: 100%;
					height: 0.3rem;
					display: flex;
					align-items: center;
					padding-left: 0.1rem;
					box-sizing: border-box;
					font-size: 0.2rem;
					color: #E9B10E;

					img {
						width: 0.25rem;
						height: 0.25rem;
						margin-right: 0.05rem;

					}
				}

				.pic {
					width: 2rem;
					height: 2rem;
					margin: 0 auto;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					z-index: 10;
					background-position: center;
					background-repeat: no-repeat;
					background-size: 70%;

					img {
						max-width: 80%;
						max-height: 80%;
						vertical-align: middle;
						transition: .3s;
					}
				}

				.name {
					width: 100%;
					height: 0.4rem;
					font-size: 0.16rem;
				}

				p {
					width: 100%;
					height: 0.3rem;
					line-height: 0.3rem;
					font-size: 0.14rem;
					color: #969696;
				}

			}

		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.CDK_block {
				width: 7rem;
				background-color: #1e2355;
				border: 1px solid #4854c9;
				border-radius: 0.08rem;
				position: relative;

				.block-top {
					width: 100%;
					height: 0.03rem;
					background: linear-gradient(90deg, transparent, rgba(72, 84, 201, 0.8), transparent);
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

				.tit {
					width: 100%;
					font-size: 0.24rem;
					text-align: center;
					line-height: 0.8rem;
				}

				input {
					display: block;
					width: 6rem;
					height: 0.5rem;
					margin: 0 auto;
					background: #fff;
					border: none;
					border-radius: 0.04rem;
					color: #4854c9;
					font-size: 0.22rem;
					padding: 0 0.2rem;
					box-sizing: border-box;
				}

				.btn {
					width: 2.2rem;
					height: 0.5rem;
					background: #4854c9;
					text-align: center;
					line-height: 0.5rem;
					color: #fff;
					font-size: 0.2rem;
					margin: 0.3rem auto;
					border-radius: 0.04rem;
					cursor: pointer;
				}
			}
		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		.out_box {
			width: 6.8rem;
			padding: 0 0;

			.item-list {
				width: 6.8rem;
				padding: 0 0;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				// background: url(../../assets/images/Roll/ROLL_boxBack.png) no-repeat center;
				background: rgba(255, 255, 255, 0.2);
				background-size: cover;
				border-radius: 0.08rem;
				box-shadow: 0.02rem 0.02rem 0.1rem black;
				position: relative;

				&::before {
					display: block;
					content: "";
					width: 100%;
					height: 4rem;
					position: absolute;
					left: 0;
					top: -1rem;
					// background: url(../../../assets/images/Rank/light.png) no-repeat center;
					background-size: contain;
					z-index: -1;
					transition: 0.05s;
					animation: rotate 3s linear infinite;
				}

				.item {
					position: relative;
					z-index: 3;
					font-size: 0.0.05rem;
					width: 2rem;
					height: 2rem;
					text-align: center;
					margin: 0.05rem;
					margin-bottom: 0.2rem;
					margin-left: 0.2rem;
					border-radius: 0.04rem;
					overflow: hidden;
					box-sizing: border-box;

					.pic {
						width: 100%;
						height: 1.4rem;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							max-width: 100%;
							max-height: 100%;
							vertical-align: middle;
						}

					}

					.Di {
						width: 100%;
						height: 1.1rem;
						box-sizing: border-box;
						text-align: center;

						.bean {
							width: 100%;
							height: 0.3rem;
							display: flex;
							font-size: 0.2rem;
							justify-content: center;
							align-items: center;
							color: #75cd66;

							img {
								width: 0.25rem;
								height: 0.25rem;
								vertical-align: middle;
								margin-right: 0.03rem;
							}
						}

						.name {
							font-size: 0.14rem;
							background: none;
						}
					}

					.cover {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						@include url("OpenBox/active2.png");
						background-repeat: no-repeat;
						background-position: right top;
						background-size: 0.3rem 0.3rem;
					}

					.active {
						@include url("OpenBox/active.png");
					}

				}
			}
		}

		.Show_box {
			width: 800px;
			padding: 10px;
			box-sizing: border-box;
			border-radius: 10px;
			margin: 0 auto 0;
			position: relative;
			text-align: center;
			background: rgba($color: #fff, $alpha: .3);

			.Show_title {
				text-align: center;
				font-size: 18px;
			}

			.Show_list {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.Show_item {
					width: 150px;
					margin: 0 5px;
					margin-top: 10px;
					background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
					background-size: cover;
					// border-radius: 6px;
					border: 1px solid #E9B10E;
					box-sizing: border-box;
					cursor: pointer;

					.Show_pic {
						width: 120px;
						height: 120px;
						margin: 0 auto;
						background-image: url(http://www.gameskins.cn/img/LV4.9815642e.png);
						background-position: center;
						background-size: 80%;
						background-repeat: no-repeat;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							max-width: 90%;
							max-height: 90%;
							vertical-align: middle;
						}
					}

					p {
						width: 100%;
						padding: 0 5px;
						box-sizing: border-box;
						font-size: 14px;
						color: #fff;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					span {
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 16px;
						color: #75cd66;
						margin: 10px 0 10px;

						img {
							width: 20px;
							height: 20px;
							vertical-align: middle;
						}
					}
				}

			}

			.Show_btns {
				margin-top: 10px;

				.van-button {
					width: 160px;
					height: 40px;
					padding: 0;
					margin-right: 20px;
					font-size: 16px;
					background-color: #ffd322;
					color: #000;
					border: none;

					&:last-child {
						margin-right: 0;
					}

					.Gold {
						margin-left: 5px;
						color: #000;

						img {
							width: 18px;
							height: 18px;
							vertical-align: middle;
							margin-bottom: 2px;
							margin-right: 2px;
						}
					}
				}
			}
		}


		.btns {
			width: 100%;
			height: 40px;

			margin: 0.1rem auto;
			display: flex;
			justify-content: center;
			box-sizing: border-box;

			.block {
				width: 10rem;
				padding: 0 rem(20);
				box-sizing: border-box;
			}

			/deep/.el-button {
				margin: 0 auto;
				width: 80%;
				height: 100%;
				font-size: 0.8em;
				background: #ffd300;

				span {
					color: #000;
					font-size: .22rem;
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0;
				}
			}
		}
	}
</style>
