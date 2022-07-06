<template>
	<div class="rotate-show" v-show="awards.length > 0">
		<div class="box">
			<div class="item-list">
				<div v-for="(value, key) in awards" :key="key" class="item">
					<div class="pic_bj">
						<img :src="value.lv | filter2" alt="">
					</div>
					<div class="pic">
						<img :src="value.cover" alt="" />
					</div>
					<div class="Di">
						<div class="bean"><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{ parseInt(value.bean*100)/100 }}</div>
						<div class="name">{{ value.name }}</div>
					</div>
					<div class="cover active" @click.passive="Click(key, value)" ref="item"></div>
				</div>
			</div>

			<div class="btns">
				<div class="block">
					<el-button type="danger" @click.passive="ToOpen" round>继续开箱</el-button>
				</div>
				<div class="block">
					<el-button type="danger" @click.passive="ToBean" round :loading="tobean">回收(${{ price }})</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		SToBean,
		SToSteam
	} from "@/network/server";
	import myMixin from "@/utils/mixin";
	import {
		mapActions
	} from 'vuex'
	import Vue from 'vue'
	export default {
		name: "rotate-show",
		mixins: [myMixin],
		data() {
			return {
				awards: [],
				active: "active",
				tobean: false,
				tosteam: false,
				mp3: new Audio(require('@/assets/audios/boom.mp3')),
				price: 0
			};
		},

		filters: {
			filter2(val) {
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

		methods: {
			...mapActions({
				MyInfo: 'Refresh'
			}),
			SetAwards(arr) {
				this.mp3.play()
				let temp = []
				this.price = 0
				for (let i = 0; i < arr.length; i++) {
					temp[i] = {}
					temp[i].active = true;
					temp[i].cover = arr[i].cover;
					temp[i].lv = arr[i].lv;
					temp[i].bean = arr[i].bean;
					temp[i].name = arr[i].name;
					temp[i].id = arr[i].id;
					temp[i].uuid = arr[i].uuid;
					this.price += parseFloat(temp[i].bean)
				}
				this.price = parseInt(this.price * 100) / 100
				this.awards = temp
			},
			Click(key, value) {
				value.active = !value.active;
				this.Refresh()
			},
			//兑换 m豆
			ToBean() {
				if (this.loading) return
				this.tobean = true
				let arr = []
				this.Handler(key => {
					arr[arr.length] = this.awards[key]
				})
				SToBean(arr).then(data => {
					this.Success('兑换成功')
					this.Handler(key => {
						Vue.delete(this.awards, key)
					})
					this.Refresh()
					this.MyInfo()
					this.tobean = false
				}).catch(err => {
					this.Err(err.message)
					this.tobean = false
				})
			},
			//继续开箱
			ToOpen() {
				this.awards = []
			},
			//提取到 Steam
			ToSteam() {
				if (this.tosteam) return
				this.tosteam = true
				let arr = []
				this.Handler(key => {
					arr[arr.length] = this.awards[key]
				})
				SToSteam(arr).then(data => {
					this.Success('提取成功')
					this.Handler(key => {
						Vue.delete(this.awards, key)
					})
					this.Refresh()
					this.tosteam = false
				}).catch(err => {
					this.Err(err.message)
					this.tosteam = false
				})
			},
			Handler(action) {
				for (let i = this.awards.length - 1; i >= 0; i--) {
					if (this.awards[i].active) action(i)
				}
			},
			Refresh() {
				this.price = 0
				for (let i = 0; i < this.awards.length; i++) {
					const value = this.awards[i]
					if (value.active) {
						this.price += parseFloat(value.bean)
						this.$refs.item[i].className = "cover active";
					} else {
						this.$refs.item[i].className = "cover";
					}
					this.price = parseInt(this.price * 100) / 100
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.rotate-show {
		@keyframes rotate {
			0% {
				transform: rotate(0);
			}

			100% {
				transform: rotate(360deg);
			}
		}

		@include flex(100);

		.box {
			@include center;
			width: 8rem;

			.btns {
				width: 80%;
				height: 40px;
				margin: 0.1rem auto;
				display: flex;
				justify-content: center;

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
				}
			}

			.item-list {
				width: 100%;
				height: 100%;
				padding: 2rem 0 0.2rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				background: url(../../../assets/images/OpenBox/GongXin.png) no-repeat center -18px;
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
					background: url(../../../assets/images/Rank/light.png) no-repeat center;
					background-size: contain;
					z-index: -1;
					transition: 0.05s;
					animation: rotate 3s linear infinite;
				}

				.item {
					position: relative;
					z-index: 3;
					font-size: 0.0.05rem;
					width: 2.5rem;
					height: 2rem;
					text-align: center;
					margin: 0.05rem;
					background: url(../../../assets/images/PublicImg/stock_2.png) no-repeat center;
					border-radius: 0.04rem;
					overflow: hidden;
					box-sizing: border-box;
					position: relative;

					.pic_bj {
						position: absolute;
						width: 100%;
						height: 1.4rem;
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							max-width: 90%;
							max-height: 90%;
							vertical-align: middle;
						}

					}

					.pic {
						width: 100%;
						height: 1.4rem;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						z-index: 1;

						img {
							max-width: 100%;
							max-height: 100%;
							vertical-align: middle;
						}

					}

					.Di {
						width: 100%;
						height: 1.1rem;
						background: rgba(55, 67, 98, 1.0);
						border-top: 1px solid #49587e;
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
							font-size: 0.18rem;
						}
					}



					.cover {
						position: absolute;
						left: -0.1rem;
						top: 0.1rem;
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

				@for $i from 1 through 5 {
					.show-lv#{
 $i
				}

					{
					color: lv-color($i);
				}
			}
		}
	}
	}
</style>
