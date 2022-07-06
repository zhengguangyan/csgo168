<template>
	<div id="add">
		<div id="echarts" style="width:400px;height:400px;"></div>
	</div>
</template>
<script>
	import 'echarts-liquidfill/src/liquidFill.js';
	export default {
		data() {
			return {
				arr:[.61,.5,.4]
			}
		},
		mounted() {
			this.echartsMit()
		},
		methods: {
			echartsMit() {
				let dom = document.getElementById('echarts')
				// console.log(dom);
				let myChart = this.$echarts.init(dom);
				myChart.setOption({				
					series: [{
						type: 'liquidFill',
						data: this.arr,
						color: ['#e96113', '#e99e1d', '#E9B10E'],
						backgroundStyle: {
							borderWidth: 1,
							color: 'red'
						},
						itemStyle: {
							shadowBlur: 0,
						},
						outline: {
							borderDistance: 0,
							itemStyle: {
								borderWidth: 3,
								borderColor: '#E9B10E',
								shadowBlur: 20,
							}
						},
						label: {
							normal: {
								textStyle: {
									color: '#fff',
									insideColor: 'yellow',
									fontSize: 40
								}
							}
						},
					}]
				});

			}
		}
	}
</script>
