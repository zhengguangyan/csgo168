<template>
	<div id="Dynamic">
		<div class="Dynamic_box">
			<div class="layer"></div>
			<div class="Dynamic_out">
				<div class="container" :style="LeftSty" :class="TranSitionSty">
					<div class="contItem" :style="'width:' +WidTh+ 'px;margin-left:' +MarGin+ 'px;margin-right:' +MarGin+ 'px'" v-for="(item,index) in DetailArr" :key="index">
						<div class="cont_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
							<img :src="item.cover" alt="">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Dynamic',
		props: {
			DetailList: { //箱内物品
				type: Array
			},
			Awardlist:{//奖品列表
				type: Array
			},
			Dynamic_checked:{//动画播放
				type:String
			},
			Dynamic_num:{//奖品数量
				type:Number
			}
		},

		data() {
			return {
				LeftSize: '0', //偏移距离
				TranSition:'active',//过度曲线
				DetailArr: [], //箱内物品(重置后)
				also:0,//假数据(判断是否继续处理)
				process: new Audio(require('@/assets/audio/process.mp3')), //开奖过程声音
				WidTh:200,
				MarGin:20,
			}
		},


		methods: {
			//拼接并打乱数组
			Arraysplicing() {
				let A_Arr = []
				for (let i = 0; i < 20; i++) {
					A_Arr = A_Arr.concat(this.DetailList)
				}
				// console.log(A_Arr)
				
				//打乱
				function randSort(A_Arr) {
					for (let i = 0, len = A_Arr.length; i < len; i++) {
						let rand = parseInt(Math.random() * len)
						let temp = A_Arr[rand]
						A_Arr[rand] = A_Arr[i]
						A_Arr[i] = temp
					}
					return A_Arr
				}
				
				this.DetailArr = randSort(A_Arr)
				// console.log(this.DetailArr)
			},
			
			//处理中奖
			Determine(){
				// console.log('Determine调用')
				if(this.also < this.Dynamic_num){
					this.DetailArr[32] = this.Awardlist[this.also]//奖品挪移
					this.TranSition = 'active'//增加过度动画
					this.LeftSize = -((this.WidTh * 31 + (this.MarGin * 2) * 31) - this.MarGin/5)//偏移值
					this.process.play()//播放声音
					this.also += 1//自加1
					setTimeout(() => {
						this.IsRepeat()
					},15300)
				}else{
					//子传父(动画结束)
					this.$emit('setAnimation', true)
				}				
			},
			
			//重复
			IsRepeat(){
				// console.log('Repeat调用')
				this.$emit('setEquipment', this.also)
				let alsoArr = []
				alsoArr.unshift(this.DetailArr[31],this.DetailArr[32],this.DetailArr[33])//上次偏移到最后的三件物品
				this.Arraysplicing()//重新调用打乱
				this.DetailArr = alsoArr.concat(this.DetailArr)//上次最后的三件物品插入新打乱的数组
				this.TranSition = ''//清掉过度动画
        this.LeftSize = '0'//偏移值复原
        this.Determine()
				// setTimeout(() => {
				//
				// },100)

			}
		},

		computed: {
			//偏移样式
			LeftSty() {
				return 'transform: translateX(' + (this.LeftSize) + 'px)'
			},
			//过渡样式
			TranSitionSty(){
				return this.TranSition
			}
		},

		watch: {
			DetailList(arr) {
				// console.log(arr)
				if (arr.length > 0) this.Arraysplicing()
			},
			
			//为'1'处理中奖数据并播放动画
			Dynamic_checked(str){
				this.also = 0
				if(str == '1') this.Determine()
			},
		}
	}
</script>

<style lang="scss">
	#Dynamic {
		padding: 10px;
		margin-top: -15px;
		box-sizing: border-box;
		.Dynamic_box {
			width: 800px;
			height: 280px;
			margin: 0 auto;
			overflow: hidden;
			position: relative;

			.layer {
				position: absolute;
				left: 0;
				right: 0;
				width: 100%;
				height: 100%;
				background: url(../../assets/images/open/Animation_back.png) no-repeat center;
				background-size: contain;
				z-index: 1;
			}

			.Dynamic_out {
				width: 90%;
				height: 90%;
				margin: 14px auto;
				border-radius: 40px;
				overflow: hidden;
				mask-image:linear-gradient(90deg,rgba(25,25,25,0) 4%,#000 50%,rgba(25,25,25,0) 96%);
				-webkit-mask-image:linear-gradient(90deg,rgba(25,25,25,0) 4%,#000 50%,rgba(25,25,25,0) 96%);
				.container {
					height: 100%;
					display: flex;
					&.active{
						transition: 15s ease-in-out;
					}
					.contItem {
						height: 150px;
						margin-top: 50px;
						margin-bottom: 6px;
						background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
						background-size: 100% 100%;
						// border-radius: 6px;
						.cont_pic {
							width: 200px;
							height: 150px;
							background: url(http://www.gameskins.cn/img/LV4.9815642e.png);
							background-repeat: no-repeat;
							background-size: 60%;
							background-position: center;
							display: flex;
							justify-content: center;
							align-items: center;

							img {
								vertical-align: middle;
								max-width: 100%;
								max-height: 100%;
							}
						}
					}
				}
			}
		}


	}
</style>
