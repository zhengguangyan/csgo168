<template>
	<div id="Show">
		<van-overlay :show="true">
			<div class="wrapper">
				<div class="Show_box">
					<div class="Show_title">您已获得以下物品</div>
					<div class="Show_list">
						<div class="Show_item" v-for="(item,index) in Awardlist" :key="index" @click="SelectItem(item,index)" ref="Select">
							<div class="Show_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
								<img :src="item.cover" alt="">
							</div>
							<p>{{item.name}}</p>
							<span><img src="@/assets/images/public/Gold.png" alt="">{{item.bean}}</span>
						</div>
					</div>
					<div class="Show_btns">
						<van-button type="info" @click="setShow">继续开箱</van-button>
						<van-button type="info" @click="PostCash">回收<span class="Gold"><img src="@/assets/images/public/Gold.png" alt="">{{TotalPrice.toFixed(2)}}</span></van-button>
					</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		Cash, PersonalInfo
	} from '@/network/api.js'
	import {
		mapMutations
	} from 'vuex'
	export default {
		name: 'Show',
		props: {
			Awardlist: { //奖品列表
				type: Array
			},
			WinningShow: { //控制声音
				type: Boolean
			}
		},
		data() {
			return {
				boom: new Audio(require('@/assets/audio/boom.aac')), //奖品展示声音
				TotalPrice: 0, //回收总价格
			}
		},
		methods: {
			//默认全部选中
			Select_All(){
				for (let i = 0; i < this.Awardlist.length; i++) {
					let key = "Select"
					let value = true
					this.Awardlist[i][key] = value
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
				this.TotalPrice = 0
				let A_Arr = this.Awardlist.filter((v) => {
					return v.Select == true
				})

				for (let k = 0; k < A_Arr.length; k++) {
					this.TotalPrice += Number(A_Arr[k].bean)
				}

			},

			//兑换金币(回收)
			PostCash() {
				let arr = this.Awardlist.filter((item) => {
					return item.Select == true
				})
				let data = []
				for (let i = 0; i < arr.length; i++) {
					data.push({
						"id": arr[i].id,
						"uuid": arr[i].uuid
					})
				}
				Cash(JSON.stringify(data)).then((res) => {
					// console.log(res)
					this.RefreshData(res.data.message)
					this.setShow()
				})
			},

			//刷新数据
			RefreshData(message) {
				this.$notify({
					type: 'success',
					message: message
				})
				this.GetPersonalInfo()
			},

			//个人信息
			GetPersonalInfo() {
				PersonalInfo().then((res) => {
					this.User(res.data.message)
				})
			},

			
			//子传父(关闭奖品遮罩层)
			setShow() {
				this.$emit('setShow', false)
			},
			
			...mapMutations([
				'User'
			])
		},
		watch: {
			//播放声音并且调用Select_All方法
			WinningShow(v) {		
				if (v == true) this.boom.play() && this.Select_All()				
			}
		}
	}
</script>

<style lang="scss">
	#Show {
		.Show_box {
			width: 800px;
			padding: 10px;
			box-sizing: border-box;
			border-radius: 10px;
			margin: 250px auto 0;
			position: relative;
			text-align: center;
			background: rgba($color: #fff, $alpha: .3);
			.Show_title{
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
	}
</style>
