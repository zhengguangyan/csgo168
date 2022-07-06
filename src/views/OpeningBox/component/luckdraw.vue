<template>
	<div id="luckdraw">
		<div class="prize_box">
			<i v-for="v of 6" :key="v"></i>
			<div class="out">
				<div class="prize_box_roll" :class="{'active' : StyBk == true}" :style="Topstyle" v-for="(i,index) of active" :key="index">
					<div class="item" :style="'height:' + HeigHt + 'rem'" v-for="(item,index) in J_Arr[i-1]" :key="index">
						<img class="item_Back" :src="item.lv_bg_image" alt="">
						<div class="pic">
							<img :src="item.cover" alt="">
						</div>
						<p>{{item.name}}</p>
						<div class="odds_percent">{{item.bean}}</div>
						<div class="dura_alias">{{item.dura_alias}}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="ZhiZhen"></div> -->

		<!-- 开奖遮罩层 -->
		<van-overlay :show="show" v-if="show">
			<div class="wrapper">
				<div class="Show_box">
					<div class="Show_title">您已获得以下物品</div>
					<div class="Show_list">
						<div class="Show_item" :class="'lv_'+item.lv" v-for="(item,index) in ItemArr" :key="index" @click="SelectItem(item,index)" ref="Select">
							<div class="Show_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
								<img :src="item.cover" alt="">
							</div>
							<p>{{item.name}}</p>
							<p style="font-size:12px;color:#d2a9fd">{{item.dura_alias}}</p>
							<span><img src="@/assets/images/public/Gold.png" alt=""> {{item.bean}}</span>
						</div>
					</div>
					<div class="Show_btns">
						<van-button type="info" @click="GuanBi">继续开箱</van-button>
						<van-button type="info" @click="Postcash">回收<span class="Gold"><img src="@/assets/images/public/Gold.png" alt="">{{JiaZhi.toFixed(2)}}</span></van-button>
					</div>
				</div>
			</div>
		</van-overlay>
		


	</div>
</template>

<script>
	import { cash, PersonalInfo } from '@/network/api.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: 'luckdraw',
		props: {
			List: {
				type: Array
			},
			ItemData: {
				type: Array
			},
			active:{
				type:Number
			},
			CSnum:{
				type:Number
			}
		},
		data() {
			return {
				J_Arr: [],
				
				Num: 0,
				mp3: new Audio(require('@/assets/audios/open.mp3')), //开箱过程声音
				boom: new Audio(require('@/assets/audios/boom.mp3')), //开箱结束声音
				show: false,
				ItemArr:[],
				JiaZhi:0,
				StyBk:true,
				KeyArr:[1,2,3,4,5],
				HeigHt:1.65,
			}
		},

		filters: {
			GuoLv(val) {
				if (val == '1') {
					return 'color:#e6ba1c'
				} else if (val == '2') {
					return 'color:#d32ce6'
				} else if (val == '3') {
					return 'color:#834fff'
				} else if (val == '4') {
					return 'color:#4b69ff'
				} else {
					return 'color:#bbbbbb'
				}
			},
			GuoLvTwo(val){
				if (val == '1') {
					return require('@/assets/images/Swiper/Lv1.png')
				} else if (val == '2') {
					return require('@/assets/images/Swiper/Lv2.png')
				} else if (val == '3') {
					return require('@/assets/images/Swiper/Lv3.png')
				} else if (val == '4') {
					return require('@/assets/images/Swiper/Lv4.png')
				} else {
					return require('@/assets/images/Swiper/Lv5.png')
				}
			}
		},
		
		computed: {
			Topstyle() {
				return 'transform: translateY('+ this.Num + 'rem);'; 
			}
		},
		

		methods: {
			//拼接奖品并打乱
			SplicingArr(val) {
				this.J_Arr = []
				let arr = ''
				let _len = val.length
				for(let k = 0;k < this.active; k++){
					if(_len<10){
						const _count = 10 - _len;
						for(let j = 0;j < _count; j++){
							if(arr == ''){
								arr = val.concat(val.concat(val.concat(val.concat(val))))
							}else{
								arr = arr.concat(val.concat(val.concat(val.concat(val))))
							}
						}
					}else{
						arr = val.concat(val.concat(val.concat(val.concat(val))))
					}
					function randSort1(arr) {
						for (let i = 0, len = arr.length; i < len; i++) {
							let rand = parseInt(Math.random() * len)
							let temp = arr[rand]
							arr[rand] = arr[i]
							arr[i] = temp
						}
						return arr
					}
					this.J_Arr.push(randSort1(arr)) 
				}
				
			},
			
			// 确定中将
			ZhongJiang(){
				this.ItemArr = []
				for(let j = 0; j < this.ItemData.length; j++){
					this.J_Arr[j][30] = this.ItemData[j]
					let key = "Select";
					let value = true
					this.ItemData[j][key] = value
					this.ItemArr.push(this.ItemData[j])
				}
				
				this.Num = -(this.HeigHt * 30)
				this.mp3.play()
				setTimeout(() => {
					this.boom.play()
					this.show = true
				}, 5300)
			},
					
			
			//默认全部选中
			Select_All(){
				for (let i = 0; i < this.ItemArr.length; i++) {
					let key = "Select"
					let value = true
					this.ItemArr[i][key] = value
					setTimeout(() => {
						this.$refs.Select[i].style.border = "1px solid #E9B10E"
					},10)
					
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
				let A_Arr = this.ItemArr.filter((v) => {
					return v.Select == true
				})
			
				for (let k = 0; k < A_Arr.length; k++) {
					this.JiaZhi += Number(A_Arr[k].bean)
				}
			
			},	
			
			//关闭遮罩层
			GuanBi(){
				this.show = false
				this.StyBk = false
				this.Num = 0
				 this.$emit('fromChild', false)
				for(let i = 0 ;i < this.J_Arr.length; i++){
					this.J_Arr[i].unshift(this.ItemData[i])
				}
				setTimeout(() => {
					this.StyBk = true
				},500)
			},
			
			
			//筛选
			IsCover(item,index){
				if(this.ItemData[index].Select == true){
					this.ItemData[index].Select = false
				}else{
					this.ItemData[index].Select = true
				}
				this.KeyArr = this.KeyArr.map((item) => {
					return item + 1
				})
				
				this.JiaZhi = 0
				
				let ZJArr = this.ItemData.filter((i) => {
					return i.Select == true
				})
				for(let i = 0;i < ZJArr.length; i++){
					this.JiaZhi = this.JiaZhi + Number(ZJArr[i].bean)
				}
			},
			
			
			//回收
			Postcash(ItemData){
				// console.log(ItemData)
				
				let HSArr = this.ItemData.filter((i) => {
					return i.Select == true
				})
				let data = []
				for(let i = 0;i < HSArr.length; i++){
					data[i] = {
						id:HSArr[i].id,
						uuid:HSArr[i].uuid	
					}
					
				}
				
				// console.log(data)
				
				cash(JSON.stringify(data)).then((res) => {
					// console.log(res)
					this.$message({
						message: '回收成功',
						type: 'success',
					})
					this.GetPersonalInfo()
					this.GuanBi()
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

		watch: {
			List(val) {
				this.SplicingArr(this.List)
			},

			ItemData(val) {
				// console.log(val)
				this.ItemData = val
			},
			
			ItemArr(val){
				this.JiaZhi = 0
				for(let i = 0;i < val.length; i++){
					this.JiaZhi = this.JiaZhi + Number(val[i].bean)
				}
				// console.log(this.JiaZhi)
			},
			
			active(num){
				// console.log(num)
				this.SplicingArr(this.List)
			},
			
			J_Arr(val){
				// console.log(val)
				this.J_Arr = val
			},
			
			CSnum(num){
				this.SplicingArr(this.List)
				this.ZhongJiang()
			}
			
		}
	}
</script>

<style lang="scss">
	#luckdraw {
		width: 14rem;
		height: 2rem;
		text-align: center;
		position:absolute;
		top:2.4rem;
		.prize_box {
			display: inline-block;
			
			height: 1.7rem;
			padding: .2rem;
			overflow: hidden;
			position: relative;
			i{
				display: block;
				width: .1rem;
				height: .1rem;
				background: #884cd1;
				border-radius: 50%;
				position: absolute;
				&:nth-child(1){
					left: .1rem;
					top: .06rem;
				}
				&:nth-child(2){
					left: .1rem;
					bottom: .06rem;
				}
				&:nth-child(3){
					left: 50%;
					top: .06rem;
					width: .14rem;
					height: .14rem;
					clip-path:polygon(0px 50%,50% 0px,100% 50%,50%
					100%,0px 50%);
					transform: translateX(-50%);
					display:none;
				}
				&:nth-child(4){
					left: 50%;
					bottom: .06rem;
					width: .14rem;
					height: .14rem;
					clip-path:polygon(0px 50%,50% 0px,100% 50%,50%
					 100%,0px 50%);
					 transform: translateX(-50%);
					display:none;
				}
				&:nth-child(5){
					right: .1rem;
					top: .06rem;
				}
				&:nth-child(6){
					right: .1rem;
					bottom: .06rem;
				}
			}
			.out{
				width: 100%;
				height: 100%;
				border: 1px solid #d3a9fd;
				border-radius: 6px;
				box-sizing: border-box;
				display: flex;
				overflow: hidden;
				.prize_box_roll {
					height: 100%;
					// display: flex;
					&.active{
						transition: 5s cubic-bezier(0, 0, 0.28, 1);
					}
					.odds_percent {
						position: absolute;
						left: 5px;
						top: 5px;
						font-size: 12px;
						text-align: left;
						padding: 2px 8px;
						border-radius:10px;
						box-sizing: border-box;
						color: #fff;
						z-index:10
					}

					.dura_alias {
						position: absolute;
						right: 0;
						top: 0;
						font-size: 10px;
						margin: 5px 0;
						text-align: left;
						padding-right: 10px;
						box-sizing: border-box;
						color: #fff;
						z-index:1
					}
					.item {
						width: 100%;
						position: relative;
						overflow: hidden;
						background-color: #7b2bbf;
						box-shadow: 0 0 50px rgba($color: #000, $alpha: 0.8) inset;
						box-sizing: border-box;
						padding:5px 0 0;
						.item_Back{
							position: absolute;
							left: 0;
							top: 0;
							bottom: 20px;
							right: 0;
							margin: auto;
							width: 60%;
							height: 60%;
							z-index: 1;
						}
				
						.pic {
							width: 1.6rem;
							height:1.3rem;
							margin: 0 auto;
							display: flex;
							justify-content: center;
							align-items: center;
							position: relative;
							z-index: 2;
				
							img {
								max-width: 100%;
								max-height: 100%;
								vertical-align: middle;
							}
						}
				
						p {
							width: 100%;
							height: .3rem;
							font-size: .14rem;
							text-align: center;
							line-height: .3rem;
							position: relative;
							z-index: 2;
							// overflow: hidden;
						}
					}
				}
			}
			
		}

		.ZhiZhen {
			width: 3.6rem;
			height: 0.2rem;
			margin: 0 auto;
			// background: url(../../../assets/images/OpenBox/line.png) no-repeat center;
			background-size: 100% 100%;
		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
		.Show_box {
			width: 800px;
			padding: 10px;
			box-sizing: border-box;
			border-radius: 10px;
			margin: 0 auto 0;
			position: relative;
			text-align: center;
			background: none;
			.Show_title{
				text-align: center;
				font-size: 18px;
			}
			
			.Show_list {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top:10px;
				.Show_item {
					width: 150px;
					margin: 0 5px;
					margin-top: 10px;
					background-size: cover;
					// border-radius: 6px;
					box-sizing: border-box;
					cursor: pointer;
					background:#716778;
					border:none;
					&.lv_1{
						background:#915f4d;
					}
					&.lv_2{
						background:#99358a;
					}
					&.lv_3{
						background:#8551ab;
					}
					&.lv_4{
						background:#4948b8;
					}
		
					.Show_pic {
						width: 120px;
						height: 120px;
						margin: 0 auto;
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
						color: #ffd926;
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
				margin-top: 30px;
		
				.van-button {
					width: 160px;
					height: 30px;
					padding: 0;
					margin-right: 20px;
					font-size: 14px;
					background:none;
					color: #d2a9fd;
					border: none;
					border-radius:100px;
					border:1px #d2a9fd solid;
					transition: .3s;
					&:last-child {
						margin-right: 0;
					}
					&:hover{
						background-color: #7c44a7;
						border-color:#7c44a7;
						color:#fff;
					}
		
					.Gold {
						margin-left: 5px;
						color: #ffd926;
		
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
		
		.out_box{
			width: 6.8rem;
			padding:0 0;
		}
		
		.item-list {
			width: 6.8rem;
			padding:0 0;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			// background: url(../../../assets/images/Roll/ROLL_boxBack.png) no-repeat center;
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
		
		.btns {
		     width: 100%;
		     height: 40px;
			
		     margin: 0.1rem auto;
		     display: flex;
		     justify-content: center;
			 box-sizing: border-box;
		     .block{
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
				 span{
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
