<template>
	<div id="Explosion">
		<div class="Explosion">
			<div class="Title">
				<p>爆率公平性</p>
				<div class="Title-lower"></div>
			</div>
			<div class="UnpackingRules-box-info">
				<p>本网站秉持着公平，公正，公开的原则来为大家提供开箱服务。</p>
				<p>
					在每次开箱开始时，服务会生成一个介于 0 到 1 间的长随机数（例如 0.296792743），并通过 SHA-2 算法进行加密。回合结束时，服务会将此数字乘以活动总数，进而获得最终结果的编号。加密方式和加密码我们会在回合之后公布，保证活动的公平性。这样保证了用户每次开箱时掉落完全随机，且后台不可操控。PS：回合结束时，活动为C1000（活动中有 100000 张票），生成的数字 0.
					296792743。服务将 0.296792743 乘以 100000，进而得到将在抽奖时显示的编号 29679。

					我们会在之后的更新中加入公平性验证功能。用户可以设置自己的随机数种子，并且可以在开箱后通过提供的脚本来验证此次开箱的有效性。具体的内容会在后续更新实装，敬请期待。</p>

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Explosion',
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">
	.Explosion-box {
		width: 10rem;
		margin: 0 auto;
		padding-top: 0.4rem;

		.UnpackingRules-box-info {
			margin-top: 0.3rem;

			.title {
				font-size: 0.18rem;
				color: #73d171;
				height: 0.5rem;
				line-height: 0.5rem;
			}

			p {
				font-size: 0.16rem;
				color: #fff;
				line-height: 1.75em;
			}
		}
	}
</style>
