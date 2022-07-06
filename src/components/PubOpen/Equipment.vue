<template>
	<div id="Equipment">
		<div class="Equipment_nav">
			<div class="Equipment_tit">已获得物品</div>
			<p><span>{{EquipmentArr.length}}</span> / {{Dynamic_num}}</p>
		</div>
		<div class="Equipment_list">
			<transition-group name="list" tag="i">
				<div class="Equipment_item" v-for="(item,index) in EquipmentArr" :key="index">
					<div class="Equipment_pic" :style="{'background-image': 'url('+item.lv_bg_image+')'}">
						<img :src="item.cover" alt="">
					</div>
					<p>{{item.name}}</p>
					<span><img src="@/assets/images/public/Gold.png" alt="">{{item.bean}}</span>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Equipment',
		props: {
			Dynamic_num: { //总数
				type: Number
			},
			EquipmentItem: { //获奖列表子对象
				type: Object
			}
		},
		data() {
			return {
				EquipmentArr: [], //获得物品
			}
		},

		watch: {
			EquipmentItem(v) {
				// console.log(v)
				this.EquipmentArr.push(v)
			}
		}
	}
</script>

<style lang="scss">
	#Equipment {
		width: 940px;
		padding: 10px;
		min-height: 260px;
		margin: 15px auto 0;
		box-sizing: border-box;
		background: rgba($color: #000000, $alpha: .4);
		border-radius: 10px;

		.list-item {
			display: inline-block;
			transform:scale(1) ;
		}

		.list-enter-active,
		.list-leave-active {
			transition: all .5s;
		}

		.list-enter,
		.list-leave-to

		/* .list-leave-active for below version 2.1.8 */
			{
			opacity: 0;
			transform:scale(.1) ;
		}

		.Equipment_nav {
			width: 100%;
			height: 20px;
			margin-top: 4px;
			text-align: center;
			line-height: 20px;
			font-size: 16px;
			font-weight: bold;
			color: #fff;
			position: relative;

			p {
				position: absolute;
				right: 0;
				top: 0;
				width: 100px;
				height: 20px;
				line-height: 20px;
				text-align: right;
				padding-right: 5px;
				box-sizing: border-box;

				span {
					color: #75cd66;
				}

			}
		}

		.Equipment_list {
			width: 100%;
			padding: 0 20px 20px;
			box-sizing: border-box;
			i {
				width: 100%;
				display: flex;
				font-style: normal;

				.Equipment_item {
					width: 160px;
					background: rgba($color: #fff, $alpha: .05);
					border-radius: 4px;
					text-align: center;
					margin-top: 10px;
					margin-right: 20px;
					&:nth-child(5n){
						margin-right: 0;
					}
					.Equipment_pic {
						width: 110px;
						height: 110px;
						margin: 5px auto 0;
						display: flex;
						justify-content: center;
						align-items: center;
						background-position: center;
						background-size: 80%;
						background-repeat: no-repeat;

						img {
							vertical-align: middle;
							max-width: 100%;
							max-height: 100%;
						}
					}

					p {
						padding: 0 5px;
						box-sizing: border-box;
						font-size: 14px;
						margin: 10px 0;
						color: #fff;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					span {
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 5px 0 10px;
						font-size: 14px;
						font-weight: bold;
						color: #75cd66;

						img {
							width: 18px;
							height: 18px;
							vertical-align: middle;
						}
					}

				}
			}

		}
	}
</style>
