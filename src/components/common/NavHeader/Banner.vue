<template>
	<div id="Banner">
    <div class="justify-between banner_body"  v-if="img.length > 0">
        <img style="height: 100%;width: 100%" v-for="(v,i) in img " :key="i" :src="v.cover" v-show="i==n"/>
        <div class="banner-circle">
          <ul v-if="img.length > 1">
            <li  v-for="(v,i) in img " :key="i" :class="i==n ?'selected':''" @click="clickImg(i)"></li>
          </ul>
        </div>
    </div>

  </div>
</template>

<script>
	import {
    BannerList
	} from '@/network/api.js'

	export default {
		name: 'Banner',
		data() {
			return {
        img:[],
        n:0
			}
		},

    created() {
      this.GetBanner()
    },
		
		methods: {
      //获取Banner
      GetBanner() {
        BannerList().then((res) => {
          this.img = res.data.data.merchant
          this.banner_time = res.data.data.banner_time
          this.fun()
        })
      },

      fun:function(){
        //setInterval(函数体,时间)
        setInterval(this.play,this.banner_time)
      },
      play:function(){
        this.n++;
        if(this.n == this.img.length){
          this.n = 0;
        }
      },
      clickImg(index){
        this.n = index   //显示当前点击的图片
      },
		},
	}
</script>

<style lang="scss">

.banner_body {
  padding-bottom: 0.8vw;
  margin-right: 2.45vw;
  width: 60vw;
  height: 19.54vw;
  position: relative;
  .banner-circle {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    color: #fff;
    li{
      display:inline-block;
      background: #fff;
      border-radius: 50%;
      padding:5px;
      margin:2px;
      cursor: pointer;
    }
    ul {
      text-align: center;
    }
    .selected {
      background: rgb(0, 0, 0);
    }
  }
}
</style>
