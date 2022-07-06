<template>
	<div id="Goods">
		<div class="Goods_box">
			<div class="chance_box">
				<div class="item">掉落概率</div>
				<div class="item gold" v-if="ItemInfo.chance_gold>0">
					<i></i> {{ItemInfo.chance_gold}}%
				</div>
				<div class="item red" v-if="ItemInfo.chance_red>0">
					<i></i> {{ItemInfo.chance_red}}%
				</div>
				<div class="item purple" v-if="ItemInfo.chance_purple>0">
					<i></i> {{ItemInfo.chance_purple}}%
				</div>
				<div class="item blue" v-if="ItemInfo.chance_blue>0">
					<i></i> {{ItemInfo.chance_blue}}%
				</div>
				<div class="item grey" v-if="ItemInfo.chance_grey>0">
					<i></i> {{ItemInfo.chance_grey}}%
				</div>
			</div>
			<div class="Goods_nav">
				<p :class="{'active' : Switch == '1'}" @click="Switch = '1'">箱内物品</p>
				<p :class="{'active' : Switch == '2'}" @click="GetUnpackingRecord()">最近掉落</p>
			</div>
			<div class="history_list" v-show="Switch == '2'">
				<div class="history_item" :class="'lv_'+item.lv" v-for="(item,index) in historylist" :key="index">
					<div class="ceng">
						<div class="C_pic">
							<img :src="item.user.avatar" alt="">
						</div>
						<p>{{item.user.name}}</p>
					</div>
					<div class="history_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
						<img :src="item.cover" alt="">
					</div>
					<p>{{item.name}}</p>
				</div>
			</div>
			<div class="Goods_list" v-show="Switch == '1'">
				<div class="Goods_item" :class="'lv_'+item.lv" v-for="(item,index) in DetailList" :key="index">
					<div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt=""> {{item.bean}}</div>
					<div class="dura_alias">{{item.dura_alias}}</div>
					<div class="Goods_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
						<img :src="item.cover" alt="">
					</div>
					<p>{{item.name}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		UnpackingRecord
	} from '@/network/api.js'
	export default {
		name: 'Goods',
		props: {
			DetailList: { //箱内物品列表
				type: Array
			},
			ItemInfo:{
				type: Array
			},
			id: { //宝箱id
				type: String
			}
		},
		data() {
			return {
				Switch: '1', //掉落/物品
				historylist: [], //历史掉落列表
				timer:null
			}
		},
		activated() {
			this.GetUnpackingRecord()
			// this.SetUnpackingRecord()
		},
		methods: {
			//历史掉落
			GetUnpackingRecord() {
        this.Switch = '2'
				UnpackingRecord(this.id).then((res) => {
					// console.log(this.id)
					// console.log(res.data.data.historylist)
					this.historylist = res.data.data.historylist
				})
			},
			SetUnpackingRecord() {
				setInterval(() => {
					this.GetUnpackingRecord()
				}, 5000)
			},
		},
		
		watch: {
			id(v) {
				this.GetUnpackingRecord()	
			},
			DetailList(v) {
				// console.log(this.DetailList)
			},
			ItemInfo(v) {
				// console.log(this.DetailList)
			}
		}
	}
</script>

<style lang="scss">
	#Goods {
		padding: 10px;
		box-sizing: border-box;
		margin-top: 40px;

		.Goods_box {
			width: 100%;
			position: relative;

			.chance_box{
				position: absolute;
				top:0px;
				right:1%;
				line-height:40px;

				.item{
					float: left;
					margin-right:20px;

					i{
						float: left;
						width:37px;
						height:13px;
						margin:14px 10px 0 0;
						border-radius:10px;
					}
				}
				.gold{
					color:#e29929;
					i{
						background-color: #e29929;
					}
				}
				.red{
					color:#dd4849;
					i{
						background-color: #dd4849;
					}
				}
				.purple{
					color:#7741dd;
					i{
						background-color: #7741dd;
					}
				}
				.blue{
					color:#2281ee;
					i{
						background-color: #2281ee;
					}
				}
				.grey{
					color:#4d4b49;
					i{
						background-color: #4d4b49;
					}
				}
			}

			.Goods_nav {
				width: 100%;
				display: flex;
				color: #fff;

				p {
					width: 120px;
					height: 40px;
					background: #fff;
					color: #000;
					text-align: center;
					line-height: 40px;
					font-size: 16px;
					cursor: pointer;
					border:1px #d3a9fd solid;
					background: none;
					color:#d3a9fd;
					margin-right:5px;

					&.active {
					background-color:rgba($color: #fc63cf, $alpha: .5);
					border:1px #fc63cf solid;
					color:#fff;
					}
				}
			}

			.history_list {
				width: 100%;
				display: flex;
				padding: 5px 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				margin-top: 20px;

				.history_item {
					width: 19%;
					text-align: center;
					color: #fff;
					margin-bottom: 10px;
					margin-right: 1%;
					padding-bottom: 20px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					background-color:#716778;
					&.lv_1{
						background-color: rgba(145, 95, 77, 0.5);
					}
					&.lv_2{
						background-color: rgba(153, 53, 138, 0.5);
					}
					&.lv_3{
						background-color: rgba(133, 81, 171, 0.5);
					}
					&.lv_4{
						background-color: rgba(73, 72, 184, 0.5);
					}

					.ceng {
						position: absolute;
						left: 0;
						top: -100%;
						width: 100%;
						height: 100%;
						background: rgba($color: #000000, $alpha: .6);
						text-align: center;
						transition: .3s;

						.C_pic {
							width: 50px;
							height: 50px;
							border-radius: 50%;
							overflow: hidden;
							margin: 40px auto 10px;

							img {
								width: 100%;
								height: 100%;
							}

							p {
								font-size: 14px;
								color: #fff;
							}
						}
					}

					&:hover {
						.ceng {
							top: 0
						}
					}

					.history_pic {
						width: 80%;
						height: 160px;
						margin: 0 auto;
						display: flex;
						padding: 10px 0 10px;
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
					}
				}
			}

			.Goods_list {
				width: 100%;
				display: flex;
				padding: 5px 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				margin-top: 20px;

				.Goods_item {
					width: 19%;
					text-align: center;
					color: #fff;
					margin-bottom: 10px;
					margin-right: 1%;
					padding: 20px 0 10px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					position: relative;
					background-color: rgba(113, 103, 120, 0.5);
					&.lv_1{
						background-color: rgba(145, 95, 77, 0.5);
					}
					&.lv_2{
						background-color: rgba(153, 53, 138, 0.5);
					}
					&.lv_3{
						background-color: rgba(133, 81, 171, 0.5);
					}
					&.lv_4{
						background-color: rgba(73, 72, 184, 0.5);
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
						width: 50%;
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
			@media screen and(min-width:1920px) {
				.Goods_list {
				width: 100%;
				display: flex;
				padding: 5px 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				margin-top: 20px;

				.Goods_item {
					width: 19%;
					text-align: center;
					color: #fff;
					margin-bottom: 10px;
					margin-right: 1%;
					padding: 20px 0 10px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					position: relative;
					background-color: rgba(113, 103, 120, 0.5);
					&.lv_1{
						background-color: rgba(145, 95, 77, 0.5);
					}
					&.lv_2{
						background-color: rgba(153, 53, 138, 0.5);
					}
					&.lv_3{
						background-color: rgba(133, 81, 171, 0.5);
					}
					&.lv_4{
						background-color: rgba(73, 72, 184, 0.5);
					}

					.odds_percent {
						position: absolute;
						left: 5px;
						top: 10px;
						font-size: 16px;
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
						font-size: 16px;
						text-align: left;
						padding-right: 10px;
						box-sizing: border-box;
						color: #fff;
						line-height:20px;
					}

					.Goods_pic {
						width: 60%;
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
						font-size: 16px;
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
			}
			@media screen and(min-width:2560px) {
				.Goods_list {
				width: 100%;
				display: flex;
				padding: 5px 0;
				flex-wrap: wrap;
				border-radius: 0 4px 4px 4px;
				margin-top: 20px;

				.Goods_item {
					width: 19%;
					text-align: center;
					color: #fff;
					margin-bottom: 10px;
					margin-right: 1%;
					padding: 20px 0 10px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					position: relative;
					background-color: rgba(113, 103, 120, 0.5);
					&.lv_1{
						background-color: rgba(145, 95, 77, 0.5);
					}
					&.lv_2{
						background-color: rgba(153, 53, 138, 0.5);
					}
					&.lv_3{
						background-color: rgba(133, 81, 171, 0.5);
					}
					&.lv_4{
						background-color: rgba(73, 72, 184, 0.5);
					}

					.odds_percent {
						position: absolute;
						left: 5px;
						top: 10px;
						font-size: 18px;
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
						font-size: 18px;
						text-align: left;
						padding-right: 10px;
						box-sizing: border-box;
						color: #fff;
						line-height:20px;
					}

					.Goods_pic {
						width: 70%;
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
						font-size: 18px;
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
			}
		}
	}
</style>
