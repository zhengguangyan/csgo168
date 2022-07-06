<template>
	<div id="Activity_open">
		<div class="Activity_open_box">
			<div class="Title">
				<p>{{DetailData.name}}</p>
			</div>
			<Details :DetailData="DetailData" :NumIdx="NumIdx" v-show="AnimationShow == '0'"></Details>
			<Dynamic :DetailList="DetailList" :Awardlist="Awardlist" :Dynamic_checked="Dynamic_checked" :Dynamic_num="Dynamic_num"
			 @setAnimation="setAnimation" @setEquipment="setEquipment" v-show="AnimationShow == '1'"></Dynamic>
			<div class="open_btn" v-show="AnimationShow == '0'">
				<van-field center clearable v-model="cdk_code" type="text" label="CDK" v-show="this.$route.query.type == '4'">
					<template #button>
						<van-button size="small" type="info" @click="PostOpen">开启箱子</van-button>
					</template>
				</van-field>
				<van-button type="info" size="small" @click="PostOpen" v-show="this.$route.query.type != '4'">开启箱子</van-button>
				<div class="Animation_switch">
					<p>跳过动画</p>
					<van-switch v-model="Animation_checked" size="24px" />
				</div>
			</div>
      <div id="Goods">
        <div class="Goods_box">
          <div class="Goods_nav">
            <p>箱内物品</p>
          </div>
          <div class="Goods_list">
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
			<Equipment :Dynamic_num="Dynamic_num" :EquipmentItem="EquipmentItem" v-show="EquipmentShow == '1'" :key="EquipmentShow"></Equipment>
			<Goods :DetailList="DetailList" :id="Number(this.id)"></Goods>
			<Show v-show="WinningShow" :WinningShow="WinningShow" @setShow="setShow" :Awardlist="Awardlist"></Show>
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
		WelfareOpen,
		PersonalInfo
	} from '@/network/api.js'
	import {
		mapMutations
	} from 'vuex'
	export default {
		name: 'Open',
		data() {
			return {
				id:'',
				DetailData: {}, //箱子信息
				NumIdx: 1, //开箱数量
				DetailList: [], //箱内物品
				cdk_code: '', //cdk编码
				Animation_checked: false, //动画开关
				WinningShow: false, //奖品遮罩层
				Awardlist: [], //获得奖品数据
				Dynamic_checked: '0', //播放动画('0':不播放,'1':播放)
				Dynamic_num: 0, //奖品数量
				AnimationShow: '0', //动画显示隐藏'0':不显示,'1':显示)
				EquipmentItem: {}, //下方奖品栏子级
				EquipmentShow: '0', //下方奖品栏显示
			}
		},
		activated() {
			this.id = this.$route.query.activityid
			this.GetBoxDetail()
		},
		methods: {
			//宝箱详情
			GetBoxDetail() {
				BoxDetail(this.id).then((res) => {
					// console.log(res.data.data)
					this.DetailData = res.data.data
					this.DetailList = res.data.data.box_awards
					// console.log(this.DetailList)
				})
			},
			//开箱
			PostOpen() {
				if (this.$route.query.type == '4') {
					WelfareOpen(this.$route.query.id, this.cdk_code).then((res) => {
						// console.log(res.data.data.awardlist)
						this.Subsidiary(res.data.data.awardlist)
					})
				} else {
					WelfareOpen(this.$route.query.id).then((res) => {
						this.Subsidiary(res.data.data.awardlist)
					})
				}

			},

			//开箱附属
			Subsidiary(list) {
				this.GetPersonalInfo()
				this.Awardlist = list
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
	.Activity_open_box {
		padding-top: 40px;
		.box_num {
			width: 220px;
			padding: 15px 0;
			margin: -20px auto 0;
			background: rgba($color: #000000, $alpha: .2);
			display: flex;
			justify-content: center;
			border-radius: 6px;
			margin-bottom: 10px;

			p {
				width: 30px;
				height: 30px;
				background: #fff;
				color: #000;
				text-align: center;
				line-height: 30px;
				border-radius: 4px;
				margin: 0 5px;

				&.active {
					background: #ffba2e;
					color: #fff;
				}
			}
		}

		.open_btn {
			text-align: center;

			.van-button {
				font-size: 16px;
				padding-left: 30px;
				padding-right: 30px;
			}

			.van-cell {
				background: none;
				width: 400px;
				margin: 10px auto;
				.van-field__label {
					width: 32px;
					font-size: 14px;
					color: #fff;
				}

				.van-field__control {
					color: #fff;
				}

				.van-button {
					margin-top: 0;
				}
			}

			.van-cell::after {
				background: #fff;
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
	}
</style>
