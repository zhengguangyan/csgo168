<template>
	<div id="Open">
		<div class="open_box">
			<div class="Title">
				<p>{{DetailData.name}}</p>
			</div>
			<Details :DetailData="DetailData" :NumIdx="NumIdx" v-show="AnimationShow == '0'"></Details>
			<Dynamic :DetailList="DetailList" :Awardlist="Awardlist" :Dynamic_checked="Dynamic_checked" :Dynamic_num="Dynamic_num"
			 @setAnimation="setAnimation" @setEquipment="setEquipment" v-show="AnimationShow == '1'"></Dynamic>
			<div class="box_num" v-show="AnimationShow == '0'">
				<p v-for="(i,index) in 5" :class="{'active' : NumIdx == index + 1}" @click="NumIdx = index + 1">{{i}}</p>
			</div>
			<div class="open_btn" v-show="AnimationShow == '0'">
				<van-button type="info" size="small" @click="PostOpen">开启箱子</van-button>
				<div class="Animation_switch">
					<p>跳过动画</p>
					<van-switch v-model="Animation_checked" size="24px" />
				</div>
			</div>
			<Equipment :Dynamic_num="Dynamic_num" :EquipmentItem="EquipmentItem" v-show="EquipmentShow == '1'" :key="EquipmentShow"></Equipment>
			<Goods :DetailList="DetailList" :id="DetailData.id"></Goods>
			<Show v-show="WinningShow" :WinningShow="WinningShow" @setShow="setShow" :Awardlist="Awardlist"></Show>
			
			
			<!-- <div class="left_box" :style="'left:'+ leftSize + 'px;'">
				<div class="Left_btn" @click="BiHe">箱内物品</div>
				<div class="left_tit">
					箱内物品
				</div>
				<div class="left_list">
					<a href="javascript:;" :title="item.name + '(' + item.dura_alias + ')'" class="left_item" v-for="(item,index) in DetailList" :key="index" :class="item.lv | LvGuoLv">
						<div class="left_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
							<img :src="item.cover" alt="">
						</div>
						<div class="left_data">
							<p>{{item.name}}</p>
							<span>爆率:{{item.odds_percent}}</span>
						</div>
					</a>
				</div>
			</div> -->
			
			
		</div>

	</div>
</template>

<script>
	import Details from '@/components/PubOpen/Details.vue'
	import Dynamic from '@/components/PubOpen/Dynamic.vue'
	import Equipment from '@/components/PubOpen/Equipment.vue'
	import Goods from '@/components/PubOpen/Goods.vue'
	import Show from '@/components/PubOpen/Show.vue'
	import {
		BoxDetail,
		Open,
		PersonalInfo
	} from '@/network/api.js'
	import {
		mapMutations
	} from 'vuex'
	export default {
		name: 'Open',
		data() {
			return {
				DetailData: {}, //箱子信息
				NumIdx: 1, //开箱数量
				DetailList: [], //箱内物品
				Animation_checked: false, //动画开关
				WinningShow: false, //奖品遮罩层
				Awardlist: [], //获得奖品数据
				Dynamic_checked: '0', //播放动画('0':不播放,'1':播放)
				Dynamic_num: 0, //奖品数量
				AnimationShow: '0', //动画显示隐藏'0':不显示,'1':显示)
				EquipmentItem: {}, //下方奖品栏子级
				EquipmentShow: '0', //下方奖品栏显示
				leftSize:'0',//-240
			}
		},
		
		filters:{
			LvGuoLv(val){
				if (val == '1') {
					return 'lv1'
				} else if (val == '2') {
					return 'lv2'
				} else if (val == '3') {
					return 'lv3'
				} else if (val == '4') {
					return 'lv4'
				}
			},
		},		
		activated() {
			this.GetBoxDetail()
		},

		methods: {
			BiHe(){
				if(this.leftSize == '0'){
					this.leftSize = '-240'
				}else{
					this.leftSize = '0'
				}
			},
			
			//宝箱详情
			GetBoxDetail() {
				BoxDetail(this.$route.query.id).then((res) => {
					// console.log(res.data.data)
					this.DetailData = res.data.data
					this.DetailList = res.data.data.box_awards
					// console.log(this.DetailList)
				})
			},

			//开箱
			PostOpen() {
				Open(this.$route.query.id, this.NumIdx).then((res) => {
					// console.log(res.data.data.awardlist)
					this.GetPersonalInfo()
					this.Awardlist = res.data.data.awardlist
					if (this.Animation_checked == true) {
						this.WinningShow = true
					} else {
						this.AnimationShow = '1'
						this.EquipmentShow = '1'
						// console.log('false')
						setTimeout(() => {
							this.Dynamic_checked = '1'
							this.Dynamic_num = this.Awardlist.length
						}, 100)
					}
				})
			},

			//个人信息
			GetPersonalInfo() {
				PersonalInfo().then((res) => {
					this.User(res.data.message)
				})
			},

			//接收子级(关闭奖品遮罩层)
			setShow(v) {
				// console.log(v)
				this.WinningShow = v
				this.EquipmentShow = '0'
			},

			//接收子级(动画结束)
			setAnimation(v) {
				this.WinningShow = v
				this.AnimationShow = '0'
				this.Dynamic_checked = '0'
			},

			//接收子级(下方奖品栏)
			setEquipment(v) {
				// console.log(v)
				this.EquipmentItem = this.Awardlist[v - 1]
			},

			...mapMutations([
				'User'
			])
		},

		components: {
			Details,
			Dynamic,
			Equipment,
			Goods,
			Show
		}
	}
</script>

<style lang="scss">
	.open_box {
		min-height:1200px;
		padding-top: 40px;
		.box_num {
			width: 300px;
			padding: 15px 0;
			margin: -20px auto 0;
			background: rgba($color: #000000, $alpha: .2);
			display: flex;
			justify-content: center;
			border-radius: 6px;
			margin-bottom: 10px;

			p {
				width: 40px;
				height: 40px;
				background: #fff;
				color: #000;
				text-align: center;
				line-height: 40px;
				border-radius: 4px;
				margin: 0 5px;
				cursor: pointer;

				&.active {
					background: #ffba2e;
					color: #fff;
				}
			}
		}

		.open_btn {
			text-align: center;

			.van-button {
				font-size: 20px;
				padding-left: 40px;
				padding-right: 40px;
				padding-top: 18px;
				padding-bottom: 18px;
				background: rgb(255, 211, 34);
				border: 2px solid rgb(255, 211, 34);
				border-radius: 10px;
				color: #000;
				
			}

			.Animation_switch {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-right: 10px;
				margin-top: 10px;
				box-sizing: border-box;
				font-size: 16px;
				color: #fff;

				p {
					margin-right: 5px;
				}
			}
		}
		
		.left_box{
			position: absolute;
			top: 50px;
			width: 240px;
			height: 1220px;
			padding-top: 180px;
			transition: .3s;
			.Left_btn{
				position: absolute;
				right: -40px;
				top: 400px;
				width: 40px;
				height: 130px;
				background: #ffd322;
				writing-mode: vertical-rl;
				color: #000;
				font-size: 24px;
				line-height: 40px;
				text-align: center;
				border-radius: 0 4px 4px 0;
				cursor: pointer;
			}
			.left_tit{
				width: 100%;
				height: 40px;
				text-align: center;
				line-height: 40px;
				font-size: 22px;
				color: #fff;
				overflow-y: auto;
			}
			.left_list{
				width: 100%;
				height: 1180px;
				overflow-y: auto;
				&::-webkit-scrollbar {
					/*滚动条整体样式*/
					width: 4px;
					/*高宽分别对应横竖滚动条的尺寸*/
					height: 4px;
					scrollbar-arrow-color: red;
				
				}
				
				&::-webkit-scrollbar-thumb {
					/*滚动条里面小方块*/
					border-radius: 5px;
					-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
					background: rgba(0, 0, 0, 0.6);
					scrollbar-arrow-color: red;
				}
				
				&::-webkit-scrollbar-track {
					/*滚动条里面轨道*/
					-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
					border-radius: 0;
					background: rgba(0, 0, 0, 0.1);
				}
				.left_item{
					display: block;
					width: 100%;
					height:90px;
					border-top: 1px solid #000;
					background: url(../../assets/images/NavHeader/LV1.png) no-repeat center;
					background-size: 100% 100%;
					display: flex;
					cursor: pointer;
	
					&.lv1{
						background: url(../../assets/images/NavHeader/LV1.png) no-repeat center;
						background-size: 100% 100%;
					}
					&.lv2{
						background: url(../../assets/images/NavHeader/LV2.png) no-repeat center;
						background-size: 100% 100%;
					}
					&.lv3{
						background: url(../../assets/images/NavHeader/LV3.png) no-repeat center;
						background-size: 100% 100%;
					}
					&.lv4{
						background: url(../../assets/images/NavHeader/LV4.png) no-repeat center;
						background-size: 100% 100%;
					}
					.left_pic{
						width: 90px;
						height: 90px;
						display: flex;
						justify-content: center;
						align-items: center;
						background-image: url(http://csgo.api.gameskins.cn/uploads/images/7dc133fc74bd280345be495313901a2e.png);
						background-position: center;
						background-repeat: no-repeat;
						background-size: 70%;
						img{
							max-width: 100%;
							max-height: 100%;
							vertical-align: middle;
						}
					}
					.left_data{
						width: 150px;
						padding-left: 10px;
						box-sizing: border-box;
						p{
							font-size: 16px;
							margin-top: 24px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							padding-right: 10px;
							box-sizing: border-box;
							color: #fff;
						}
						span{
							font-size: 14px;
							color: #ccc;
						}
					}
				}
			}
			
		}
	
	}
</style>
