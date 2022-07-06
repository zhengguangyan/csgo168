<template>
	<div id="BoxFight">
		<div id="BoxFight-box">
			<div class="Title">
				<p>箱子对战</p>
				<div class="Title-lower"></div>
			</div>
			<!-- <div class="pic">
				<img src="@/assets/images/PublicImg/xiangzi.png" alt="">
			</div> -->
			<div class="out-box">
				<div class="out" :style="{ 'margin-top': '-' + (this.wdt * this.num + 'px') }">
					<div class="box" v-for="(item,index) in arr" :key = 'index' :style="{ 'background' : item.bj }" :class="{ 'active' : Fangda == true }">
						{{item.txt}}
					</div>
				</div>
			</div>
			
			<p>{{time}}</p>
			
			<div class="btn" @click="add">按钮</div>
			
		</div>
	</div>
</template>

<script>
	export default{
		name:"BoxFight",
		data(){
			return{
				wdt:220,
				num:0,
				clearTimeSet: null,
				time:10,
				Fangda:false,
				
				clearTimeSetTwo:null,
				
				arr:[
					{
						bj:'red',
						txt:'1'
					},
					{
						bj:'blue',
						txt:'2'
					},
					{
						bj:'red',
						txt:'3'
					},
					{
						bj:'blue',
						txt:'1'
					},
					{
						bj:'red',
						txt:'4'
					},
					{
						bj:'blue',
						txt:'5'
					},
					{
						bj:'red',
						txt:'6'
					},
					{
						bj:'blue',
						txt:'7'
					},
					{
						bj:'red',
						txt:'8'
					},
					{
						bj:'blue',
						txt:'9'
					},
					{
						bj:'red',
						txt:'10'
					},
					{
						bj:'blue',
						txt:'11'
					},
					{
						bj:'red',
						txt:'12'
					},
					{
						bj:'blue',
						txt:'13'
					},
					{
						bj:'red',
						txt:'14'
					},
					{
						bj:'blue',
						txt:'15'
					},
					{
						bj:'red',
						txt:'16'
					},
					{
						bj:'blue',
						txt:'17'
					},
					{
						bj:'red',
						txt:'18'
					},
					{
						bj:'blue',
						txt:'19'
					},
					{
						bj:'red',
						txt:'20'
					}
				]
			}
		},
		
		
		created() {
			let a = 10
			let b = (a%1 === 0)
		},
		
		methods:{
			add(){
				this.arr[16] = {
					bj:'#000000',
					txt:'奖品'
				}
				
				this.bdd()	
				
			},
			
			bdd(){
				this.getsetTime()
				this.cdd()
			},
			
			cdd(){
				setTimeout(() => {
					this.Fangda = true
					this.ddd()
				},7000)
			},
			
			ddd(){
				this.getsetTimetwo()
			},
			
			
			getsetTimetwo() {
				this.clearTimeSetTwo = setInterval(() => {
					this.time += 1
				}, 10);
			},
			
			getclearTimetwo(){
				clearTimeout(this.clearTimeSetTwo)
			},
			
			//定时器
			getsetTime() {
				this.clearTimeSet = setInterval(() => {
					this.num += 1
				}, 100);
			},
			
			//清除定时器
			getclearTime() {
				clearTimeout(this.clearTimeSet)
			},
			
		},
		
		watch:{
			num(val){
				// console.log(val)
				if(val == 16){
					this.getclearTime()
				} 
			},
			
			time(num){
				if(num == 50){
					this.getclearTimetwo()
				}
				// console.log(num)
			}
		}
	}
</script>

<style lang="scss">
	#BoxFight-box{
		width: 14rem;
		padding-top: 0.4rem;

		.pic{
			margin-top: 0.2rem;
			width: 100%;
			margin: 0 auto;
			img{
				width: 100%;
			}
		}
		
		.out-box{			
			width: 240px;
			height: 240px;
			overflow: hidden;
			border: 1px solid red;
			.out{
				width: 200px;
				margin: 0 auto;
				transition: 5s cubic-bezier(0, 0, 0.28, 1);
				.box{
					width: 200px;
					height: 200px;
					margin: 20px auto;
					text-align: center;
					line-height: 200px;
					font-size: 24px;
					transition:0.3s;
					
					&.active{
						font-size: 50px;
					}
				}
			}
		}
		
	}
</style>
