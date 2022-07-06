<template>
	<div id="BoxItem" :class="item.status | GuoLv" @click="ToVsBox(item)">
		<div class="box_ceng" v-show="item.status == '2' || item.status == '3'"></div>
		<div class="Left">
			<div class="top">
				<p :style="item.status_alias | STYSC">{{item.status_alias}}</p><div><font>{{item.box_num}} </font>回合</div>
			</div>
			<div class="D_box">
				<div class="PeadPortrait" v-for="(item,index) in ItemArr" :key="Num[index]">
					<img class="kong" v-if="item == undefined " src="@/assets/images/PublicImg/Kong.png" alt="">
					<img v-else :src="item.avatar | ImgRoute" alt="">					
				</div>
			</div>
			
			<div class="Price">
				<p><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.total_bean}}</p>
			</div>
			
			<div class="txt_wm">
				<p>{{item.status | GuoLvTwo}}</p>
			</div>
		</div>
		<div class="Right">
			<div class="case" v-for="(item,index) in item.game_arena_box" :key='index'>
				<div class="pic"><img :src="item.cover | ImgRoute" alt=""></div>
			</div>
		</div>
	</div>

</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'BoxItem',
		props: {
			item: {
				type: Object,
			},
			VsStart:{
				type:Object
			}
		},
		data() {
			return {
				Num: [
					0, 1, 2, 3
				],
				ItemArr:[]
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
			GuoLv(val){
				if(val == 0){
					return 'DengDai'
				}else if(val == 1){
					return 'JinXing'
				}else if(val == 2||val == 3){
					return ' '
				}
				
			},
			
			GuoLvTwo(val){
				if(val == 0){
					return '我要参加'
				}else if(val == 1){
					return '观战比赛'
				}else{
					return '查看结果'
				}
			},
			STYSC(str){
				// console.log(str)
				if(str == '等待中'){
					return 'color: #FFFFFF'
				}else if(str == '进行中'){
					return 'color: #FFFFFF'
				}else if(str == '已结束'){
					return 'color: #FFFFFF'
				}
			},
			STYImg(str){
				if(str == '等待中'){
					return require('@/assets/images/Vs/DengDai.png')
				}else if(str == '进行中'){
					return require('@/assets/images/Vs/Jinxing.png')
				}else if(str == '已结束'){
					return require('@/assets/images/Vs/Jieshu.png')
				}
			}
		},

		created() {	
			let Arr = []
			for(let i = 0; i < Number(this.item.user_num); i++){
				Arr[i] = undefined
			}
			for(let k = 0; k < this.item.game_arena_player.length; k++){
				Arr[Number(this.item.game_arena_player[k].seat)] = this.item.game_arena_player[k]
			}					
			this.ItemArr = Arr
		},

		methods: {
			Refresh() {
				this.Num = this.Num.map((item) => {
					return item + 1
				})
			},
			
			//对战
			ToVsBox(item){
				if(item.status!=3){			
					this.seeShare()
				}
				
			},			
			seeShare(){
			     let routeUrl = this.$router.resolve({
			          path: "/vsbox",
			          query: {
						  id: this.item.id,
						  Code:this.item.status
					  }
			     });
			     window.open(routeUrl.href,'_self');
			}
			
		},

		computed: {
			...mapState([
				'AddInformation',
				'VsKaiShi',
				'VsJieShu',
				'KaiShiVsData',
				'JieShuVsData'
			])
		},

		watch: {
			AddInformation(val) {
				if (val.game_arena_id == this.item.id) {
					this.ItemArr[Number(val.seat)] = val
					this.Refresh()
				}
			},
			
			VsKaiShi(val){
				if(val.game_arena_id == this.item.id){
					this.item.status = val.status
					this.item.status_alias = val.status_alias
				}
			},
			VsJieShu(val){
				if(val.id == this.item.id){
					this.item.status = val.status
					this.item.status_alias = val.status_alias
				}
			},
			
			KaiShiVsData(val){
				// console.log('对战开始')
				if(val.game_arena_id == this.item.id){
					// console.log(val)
					this.item.status = val.status
					this.item.status_alias = val.status_alias
				}
			},
			JieShuVsData(val){
				if(val.id == this.item.id){
					let i = 11 * Number(this.item.box_num)
					let k = Number(String(i) + '000')
					setTimeout(() => {
						this.item.status = val.status
						this.item.status_alias = val.status_alias
					},k)
				}
			}
		}
	}
</script>

<style lang="scss">
	#BoxItem {
		width: 3.4rem;
    background: linear-gradient(146deg, #52759A, #144273);
		overflow: hidden;
		cursor: pointer;
		margin-bottom: 0.26rem;
		margin-right: .26rem;
		padding: .1rem;
		box-sizing: border-box;
		justify-content: space-between;
		position: relative;
		border:3px; 
		&:nth-child(3n){
			margin-right: 0;
		}
		&.DengDai{
      background: linear-gradient(146deg, #52759A, #144273);
		}
		&.JinXing{
      background: linear-gradient(146deg, #52759A, #144273);
		}
		.box_ceng{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba($color: #000, $alpha: .3);
		}
		.Left{
			width: 100%;
			box-sizing: border-box;
			.top{
				width: 100%;
				height: .4rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
        color: #FFFFFF;
				p{
          color: #FFFFFF;
					font-size: 16px;
				}
				div{
					font-size: 16px;

					font{
						color:#fed926;
					}
				}
			}
			.D_box{
				
				width: 100%;
				margin: .2rem auto;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;

				.PeadPortrait {
					width: 0.6rem;
					height: 0.6rem;
					border-radius: 50%;
					margin: 0.02rem 0.04rem;
					overflow: hidden;

					.kong{
						opacity: 0.7;
					}
				
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
		
			.Price{
				width: 100%;
				height: .3rem;
				p{
					width: 100%;
					text-align: center;
					line-height: .3rem;
					font-size: .22rem;
					color: #ffd322;
					img{
						vertical-align: middle;
						margin-bottom: 4px;
						margin-right: 2px;
						width: 30px;
					}
				}
			}
			.txt_wm{
				width: 100%;
				height: .4rem;
				margin-top: .1rem;
				p{
					width: 1.4rem;
					height: .4rem;
					margin: 0 auto;
					background: #003B59;
					border-radius: .4rem;
					text-align: center;
					line-height: .4rem;
					font-size: .16rem;
          color: white;
				}
			}
		}
		
		.Right{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			border-top:1px rgba($color: #fff, $alpha: .3) dashed;
			margin-top: 20px;
			.case{
				width: 30%;
				margin: 0 auto;
				display: flex;
				justify-content: center;
				align-items: center;
				img{
					max-width: 100%;
					max-height: 100%;
				}
			}
		}

	}
</style>
