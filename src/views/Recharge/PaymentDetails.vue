<template>
	<div id="PaymentDetails">
		<div class="PaymentDetails-box">
			<div class="Title">
				<p>订单详情</p>
			</div>
			<div class="PaymentDetails-info">
				<div class="PaymentDetails-info-title">
					<div class="amount">金豆</div>
					<div class="Rmb">价格</div>
					<div class="orderNumber">订单号</div>
					<div class="ZhiFuTime">支付时间</div>
				</div>

				<div class="PaymentDetails-info-item">
					<div class="amount">{{item.bean}}</div>
					<div class="Rmb">{{item.price}}</div>
					<div class="orderNumber">{{item.code}}</div>
					<div class="ZhiFuTime">{{item.created_at}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { BeansDetail } from '@/network/api.js'
	export default {
		name: 'PaymentDetails',
		data() {
			return {
				item:{}
			}
		},
		activated() {
			this.GetBeansDetail(this.$route.query.code)
		},
		
		methods:{
			GetBeansDetail(code){
				BeansDetail(code).then((res) => {
					this.item = res.data.data
					// console.log(this.item)
				})
			}
		}
	}
</script>

<style lang="scss">
	.PaymentDetails-box {
	     width: 10rem;
	     margin: 0 auto;
	     padding-top: 0.4rem;
	     .PaymentDetails-info {
	         width: 100%;
	         margin-top: 0.4rem;
	         padding: 0 0.75rem;
	         box-sizing: border-box;
	         .PaymentDetails-info-title {
	             width: 100%;
	             display: flex;
	             height: 0.5rem;
	             line-height: 0.5rem;
	             font-size: 0.22rem;
	             background: linear-gradient(90deg, rgba(255, 162, 24, 0) 0%, rgba(255, 162, 24, 0.19) 52%, rgba(255, 162, 24, 0) 100%);
	             .amount {
	                 width: 1.5rem;
	            }
	             .Rmb {
	                 width: 1.5rem;
	            }
	             .orderNumber {
	                 width: 2.75rem;
	            }
	             .ZhiFuTime {
	                 width: 2.75rem;
	            }
	        }
	         .PaymentDetails-info-item{
	             width: 100%;
	             display: flex;
	             height: 0.5rem;
	             line-height: 0.5rem;
	             font-size: 0.16rem;
	             margin-top: 0.2rem;
	             .amount {
	                 width: 1.5rem;
	            }
	             .Rmb {
	                 width: 1.5rem;
	            }
	             .orderNumber {
	                 width: 2.75rem;
	            }
	             .state {
	                 width: 1.5rem;
	            }
	             .ZhiFuTime {
	                 width: 2.75rem;
	            }
	        }
	    }
	}
</style>
