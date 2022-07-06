<template>
  <div id="SwiperBox">
    <div class="swiper-box">
      <van-loading class="vant-load" v-show="loadingShow" color="#000000" size="60"/>
      <swiper v-show="loadingShow == false" :options="swiperOption" dir="rtl">
        <swiper-slide class="swiper-slide" v-for="(item,index) in carouselArr" :key="index">
          <a :href="item | RouteLink">
            <div class="flex-col section_4" :class="item.lv | LvGuoLv" dir="ltr">
<!--              <span class="profit_ratio" v-show="item.profit_ratio != null">+{{ item.profit_ratio }}</span>-->
<!--              <div class="batlle" v-show="item.type == 3"><img src="@/assets/images/NavHeader/battle.png" alt=""></div>-->
              <div class="justify-between group_9">
                <img :src="item.cover" class="image_8">
                <div class="flex-col items-center group_10">
                  <img :src="item.user.avatar" class="image_9">
                  <span class="text_5 text_56">{{ item.user.name }}</span></div>
              </div>
              <div class="justify-around section_5">
                <span class="text_5 text_6">{{ item.box_name | ellipsis}}</span>
                <div class="section_6"></div>
                <span class="text_5 text_7">{{ item.name | GuoLvOne}}</span>
              </div>
            </div>
          </a>
        </swiper-slide>
      </swiper>
    </div>

    <div style="margin-top: 15px">
      <van-notice-bar mode="closeable" scrollable style="margin-top: -.1rem;" background="rgba(0,0,0,.2)" color="#fff"
                      left-icon="volume-o">{{ site_bulletin }}
      </van-notice-bar>
    </div>


  </div>
</template>

<script>
import {
  Swiper,
  SwiperSlide
} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {
  UnpackingRecord,
  Info
} from '@/network/api.js'
import yellow_case from '@/assets/images/PublicImg/yellow-case.png'
import red_case from '@/assets/images/PublicImg/red-case.png'
import violet_case from '@/assets/images/PublicImg/violet-case.png'
import blue_case from '@/assets/images/PublicImg/blue-case.png'
import grey_case from '@/assets/images/PublicImg/grey-case.png'

export default {
  name: 'SwiperBox',
  data() {
    return {
      carouselArr: [],

      loadingShow: true,

      swiperOption: {
        // 自动轮播
        autoplay: {
          delay: 3000,
          //当用户滑动图片后继续自动轮播
          disableOnInteraction: true,
        },
        simulateTouch: false,
        //开启循环模式
        loop: true,
        slidesPerView: 10,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },
      site_bulletin: ''
    }

  },

  filters: {
    LvGuoLv(val) {
      if (val == '1') {
        return 'lv1'
      } else if (val == '2') {
        return 'lv2'
      } else if (val == '3') {
        return 'lv3'
      } else if (val == '4') {
        return 'lv4'
      } else if (val == '5') {
        return 'lv4'
      }
    },

    RouteLink(item) {
      // console.log(item)
      if (item.type == '3') {
        return '/BoxFight'
      } else {
        return '/OpeningBox?id=' + item.box_id
      }
    },

    filter2(val) {
      if (val == '黄') {
        return yellow_case
      } else if (val == '红') {
        return red_case
      } else if (val == '紫') {
        return violet_case
      } else if (val == '蓝') {
        return blue_case
      } else {
        return grey_case
      }
    },
    GuoLvOne(val) {
      return val.length > 7 ? val.substr(0, 7) + '...' : val
    },
    //文字数超出时，超出部分使用...
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 4) {
        return value.slice(0, 4) + '...'
      }
      return value
    }
  },

  created() {
    this.GetUnpackingRecord()
    this.TenSeconds()
    this.GetInfo()
  },


  methods: {
    //开奖记录
    GetUnpackingRecord() {
      UnpackingRecord().then((res) => {
        // console.log(res.data.data.historylist)
        this.carouselArr = res.data.data.historylist

      })
    },
    TenSeconds() {
      setInterval(() => {
        if (this.$route.name != 'OpeningBox') {
          this.GetUnpackingRecord()
        }
      }, 10000)
    },

    GetInfo() {
      Info().then((res) => {
        // console.log(res.data.data)
        this.site_bulletin = res.data.data.site_bulletin
      })
    }

  },


  watch: {
    carouselArr: {
      deep: true,
      handler: function (newV, oldV) {
        this.loadingShow = false
        // console.log('watch中：', newV)
        this.carouselArr = newV
      }
    }
  },


  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style lang="scss">
#SwiperBox {
  .group_8 {
    padding: 0.68vw 6.72vw 0.94vw 7.08vw;
    .section_4 {
      padding: 0 0.89vw 0.42vw;
      background-image: url("../../../assets/images/home/img_1.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 11.82vw;
      height: 5.1vw;

      .group_9 {
        padding: 0.83vw 0 0.1vw;

        .image_8 {
          margin: 0.16vw 0;
          width: 5.05vw;
          height: 2.4vw;
        }

        .group_10 {
          margin-right: 1.04vw;

          .image_9 {
            width: 2.14vw;
            height: 2.08vw;
          }

          .text_5 {
            text-transform: uppercase;
          }

          .text_56 {
            color: #fff;
            font-size: .52vw;
            font-family: SourceHanSansCN;
            line-height: .57vw;
          }
        }
      }

      .section_5 {
        align-self: center;
        padding: 0.16vw 0.63vw;
        background-color: #fff;
        background-image: linear-gradient(0deg, #1e93de, #0073c2 55%, #006db8 78%, #0067ad 97%, #0067ad);
        border-radius: 0.1vw;
        width: 7.97vw;

        .text_5 {
          text-transform: uppercase;
        }

        .text_6 {
          margin-top: 0.1vw;
          color: #fff;
          font-size: .73vw;
          font-family: SourceHanSansCN;
          line-height: .57vw;
        }

        .text_7 {
          color: #fff;
          font-size: .73vw;
          font-family: SourceHanSansCN;
          line-height: .73vw;
        }

        .section_6 {
          background-color: hsla(0, 0%, 100%, .8);
          border-radius: 0.026vw;
          width: 0.052vw;
          height: 0.63vw;
        }
      }
    }
  }

  .section_7 {
    background-color: rgba(0, 0, 0, .2);
    border-radius: 0.89vw;
  }

  .swiper-box {
    width: 100%;
    height: 100%;
    position: relative;

    .vant-load {
      text-align: center;
      line-height: 1.4rem;
    }


    .swiper-slide {
      padding: 0 1.87vw 0.42vw;
      background-image: url("../../../assets/images/home/img_1.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 12.82vw;
      height: 5.1vw;

      .section_4 {
        width: 100%;
        height: 1rem;
        cursor: pointer;
        position: relative;
        padding: .05rem;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        color: #fff;

        .batlle {
          width: 20px;
          position: absolute;
          right: 5px;
          top: 5px;

          img {
            width: 100%;
          }
        }

        .profit_ratio {
          width: 50px;
          position: absolute;
          right: 70px;
          top: 5px;
          font-size: 8px;
          color: rgb(255, 211, 34);
        }

        //.left {
        //
        //  height: 100%;
        //  display: flex;
        //  align-items: center;
        //
        //  .pic {
        //    width: .8rem;
        //    height: .8rem;
        //    background-repeat: no-repeat;
        //    background-size: 70%;
        //    background-position: center;
        //    display: flex;
        //    justify-content: center;
        //    align-items: center;
        //
        //    img {
        //      max-width: 70%;
        //      max-height: 70%;
        //    }
        //  }
        //
        //  .data {
        //    width: 1rem;
        //    // background: red;
        //    height: .8rem;
        //
        //    p {
        //      width: .8rem;
        //      font-size: .14rem;
        //      margin-top: .18rem;
        //      overflow: hidden;
        //      text-overflow: ellipsis;
        //      white-space: nowrap;
        //      color: #d42d4f;
        //    }
        //
        //
        //    span {
        //      display: block;
        //      margin-top: .02rem;
        //      width: 100%;
        //      font-size: .12rem;
        //      overflow: hidden;
        //      text-overflow: ellipsis;
        //      white-space: nowrap;
        //    }
        //  }
        //}
        //
        //.right {
        //  width: 1rem;
        //  text-align: center;
        //  padding-top: .1rem;
        //  padding-right: .1rem;
        //  box-sizing: border-box;
        //
        //  img {
        //    width: .3rem;
        //    height: .3rem;
        //    border-radius: 50%;
        //    border: 1px solid rgb(255, 211, 34);
        //    box-sizing: border-box;
        //  }
        //
        //  p {
        //    font-size: .12rem;
        //    overflow: hidden;
        //    text-overflow: ellipsis;
        //    white-space: nowrap;
        //  }
        //}

        .group_9 {
          padding: 0.83vw 0 0.1vw;

          .image_8 {
            margin: 0.16vw 0;
            width: 4vw;
            height: 2.4vw;
          }

          .group_10 {
            margin-right: 1.04vw;

            .image_9 {
              border-radius: 50%;
              width: 2.14vw;
              height: 2.08vw;
            }

            .text_5 {
              text-transform: uppercase;
            }

            .text_56 {
              color: #fff;
              font-size: .52vw;
              font-family: SourceHanSansCN;
              line-height: .57vw;
            }
          }
        }

        .section_5 {
          align-self: center;
          padding: 0.16vw 0.63vw;
          background-color: #fff;
          background-image: linear-gradient(0deg, #1e93de, #0073c2 55%, #006db8 78%, #0067ad 97%, #0067ad);
          border-radius: 0.1vw;
          width: 7.97vw;

          .text_5 {
            text-transform: uppercase;
          }

          .text_6 {
            margin-top: 0.1vw;
            color: #fff;
            font-size: .73vw;
            font-family: SourceHanSansCN;
            line-height: .57vw;
          }

          .text_7 {
            color: #fff;
            font-size: .73vw;
            font-family: SourceHanSansCN;
            line-height: .73vw;
          }

          .section_6 {
            background-color: hsla(0, 0%, 100%, .8);
            border-radius: 0.026vw;
            width: 0.052vw;
            height: 0.63vw;
          }
        }
      }
    }
  }
  .van-notice-bar{
    border-radius: 25px;
    margin: 0 30px;
    height: 25px;
  }

}

</style>