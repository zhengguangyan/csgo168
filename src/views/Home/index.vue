<template>
  <div id="home">
    <div class="home-box">
      <div class="home-List-box">
        <div v-for="(type, key) in HotList" :key="key">
          <div class="flex-col items-center group_35">
            <img src="../../assets/images/home/tou1.png" class="image_58" />
            <span class="text_68">{{ type.name }}</span>
          </div>
          <div class="home-List">
            <div class="home-list-item" v-for="(item, index) in type.list" :key="index" @click="ToOpen(item.id)">
              <div class="weapon_cover">
                <div class="pic">
                  <img v-lazy="item.cover" />
                </div>
                <img :src="item.weapon_cover" alt="" />
              </div>
              <p>{{ item.name }}</p>
              <div class="Blind_btn"><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.bean }}</div>
              <div class="open_btn"><img src="@/assets/images/PublicImg/box.png" alt="" /><br />OPEN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import {
  GetHotBox,
  Rooms,
  PersonalInfo
} from '@/network/api.js'

export default {
  name: 'Home',
  data () {
    return {

      HotList: [],
      BladeList: [],
      recruitList: [],
      classicList: [],
      vitalityList: [],

      hotboxlist: [],
      time: 10000,
      Headlines: [],
      soulList: [],
      XyList: []
    }
  },


  created () {
    this.ObtainHotBox()
    this.GetRooms()
  },


  filters: {
    GuoLvOne (val) {
      if (val.length > 14) {
        return val.substr(0, 14) + '...'
      } else {
        return val
      }
    },
    StyChoice (val) {
      if (val == '1') {
        // return 'border-bottom-color:#e6ba1c;background-image: linear-gradient(to top, rgba(230, 186, 28,.5), transparent)'
        return 'background: url(' + require('@/assets/images/Roll/back_huang.png') + ') no-repeat center bottom;background-size: contain;'
      } else if (val == '2') {
        // return 'border-bottom-color:#d32ce6;background-image: linear-gradient(to top, rgba(211, 44, 230,.5), transparent)'
        return 'background: url(' + require('@/assets/images/Roll/back_fen.png') + ') no-repeat center bottom;background-size: contain;'
      } else if (val == '3') {
        // return 'border-bottom-color:#834fff;background-image: linear-gradient(to top, rgba(131, 79, 255,.5), transparent)'
        return 'background: url(' + require('@/assets/images/Roll/back_lan.png') + ') no-repeat center bottom;background-size: contain;'
      } else if (val == '4') {
        // return 'border-bottom-color:#4b69ff;background-image: linear-gradient(to top, rgba(75, 105, 255,.5), transparent)'
        return 'background: url(' + require('@/assets/images/Roll/back_hui.png') + ') no-repeat center bottom;background-size: contain;'
      } else {
        // return 'border-bottom-color:#bbbbbb;background-image: linear-gradient(to top, rgba(187, 187, 187,.5), transparent)'
        return 'background: url(' + require('@/assets/images/Roll/back_hui.png') + ') no-repeat center bottom;background-size: contain;'
      }
    }
  },

  methods: {

    //热门宝箱
    ObtainHotBox () {
      GetHotBox().then((res) => {
        this.HotList = res.data.data.hotboxlist
      })
    },
    //开箱
    ToOpen (id) {
      this.$router.push({
        path: '/OpeningBox',
        query: {
          id: id
        }
      })
    },

    //房间
    GetRooms () {
      Rooms('1', '1', '1').then((res) => {

        let RoomList = res.data.data.data
        // console.log(RoomList)
        // function compare(property) {
        // 	return function(a, b) {
        // 		let value1 = Number(a[property]);
        // 		let value2 = Number(b[property]);
        // 		return value1 - value2
        // 	}
        // }
        let haveHand = RoomList.filter((item) => {
          return item.status_alias == '进行中'
        })
        // console.log(haveHand)
        this.Headlines = haveHand.slice(0, 3)
        // console.log(this.Headlines)

      })
    },

    //前往房间
    toWelfareInfo (id) {
      this.$router.push({
        path: '/room',
        query: {
          id: id
        }
      })
    },

    ...mapMutations([
      'User',
      'GetIndividualsShow',
      'GetRegisterShow',
      'GetSignInShow'
    ])
  },

  computed: {
    ...mapState([
      'user',
      'IndividualsShow',
      'RegisterShow',
      'SignInShow'
    ])
  }

}
</script>
<style lang="scss">
.clearfix::after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.home-box {
  width: 16rem;
  margin: 0 auto;
  .home_top {
    width: 100%;
    height: 2.25rem;
    display: flex;
    justify-content: space-between;

    .swiper {
      width: 4.8rem;
      height: 2.25rem;
      border-radius: 6px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }

    .Headlines-list {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .Headlines-item {
        width: 3.6rem;
        height: 2.25rem;
        cursor: pointer;
        background: url(../../assets/images/public/back_pub.jpg) no-repeat;
        background-size: cover;
        border-radius: 0.1rem;
        padding: 0.1rem;
        box-sizing: border-box;
        position: relative;

        .top {
          display: flex;
          align-items: center;

          img {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            margin-right: 0.1rem;
          }

          .describe {
            .name {
              font-size: 0.16rem;
              font-weight: bold;
            }

            p {
              font-size: 0.14rem;
            }
          }
        }

        .Roll_Goods {
          width: 100%;
          height: 0.8rem;
          margin-top: 10px;
          display: flex;
          box-sizing: border-box;
          justify-content: space-around;
          flex-wrap: wrap;
          overflow: hidden;

          .Roll_Goods_item {
            width: 30%;
            height: 0.8rem;
            border-bottom: 2px solid transparent;
            box-sizing: border-box;

            .pic {
              width: 90%;
              height: 90%;
              margin: 0.02rem auto 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background-position: center;
              background-repeat: no-repeat;
              background-size: contain;

              img {
                max-width: 90%;
                max-width: 90%;
              }
            }
          }
        }

        .countDown {
          margin-top: -0.15rem;
          text-align: center;

          .colon {
            display: inline-block;
            width: 0.4rem;
            height: 0.3rem;
            text-align: center;
            color: #fff;
            font-size: 0.44rem;
            line-height: 1rem;
          }

          .block {
            display: inline-block;
            width: 0.6rem;
            height: 0.4rem;
            background: rgba(48, 57, 81, 0.8);
            border-top: 1px solid #49587e;
            color: #fff;
            font-size: 0.22rem;
            line-height: 0.4rem;
            letter-spacing: 0.4em;
            padding-left: 0.08rem;
            text-align: center;
            background-size: cover;
            box-sizing: border-box;
            border-radius: 0.04rem;
          }
        }
      }
    }
  }

  .home-List-box {
    .group_35 {
      margin-top: 20.5px;
      padding-bottom: 168px;
      position: relative;

      .image_58 {
        width: 15rem;
        position: absolute;
        left: 12.5px;
        right: 22px;
        top: 25.5px;
      }
      @media screen and (min-width: 1024px) {
        .text_68 {
          color: #ffffff;
          font-size: 20px;
          font-family: SweiSpikeSansCJKsc;
          font-weight: 900;
          line-height: 1px;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: absolute;
          top: 50px;
          left: 48%;
          transform: translateX(-50%);
        }
      }
      @media screen and (min-width: 1280px) {
        .text_68 {
          color: #ffffff;
          font-size: 20px;
          font-family: SweiSpikeSansCJKsc;
          font-weight: 900;
          line-height: 1px;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: absolute;
          top: 55px;
          left: 48%;
          transform: translateX(-50%);
        }
      }
      @media screen and (min-width: 1440px) {
        .text_68 {
          color: #ffffff;
          font-size: 25px;
          font-family: SweiSpikeSansCJKsc;
          font-weight: 900;
          line-height: 7px;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: absolute;
          top: 60px;
          left: 48%;
          transform: translateX(-50%);
        }
      }
      @media screen and (min-width: 1920px) {
        .text_68 {
          color: #ffffff;
          font-size: 25px;
          font-family: SweiSpikeSansCJKsc;
          font-weight: 900;
          line-height: 15px;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: absolute;
          top: 60px;
          left: 48%;
          transform: translateX(-50%);
        }
      }
    }

    .home-List {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .home-list-item {
        width: 18%;
        cursor: pointer;
        margin: 0.1rem 1%;
        position: relative;
        // background: rgba($color: #000000, $alpha: 0.5);
        padding: 0.2rem 0;

        .weapon_cover {
          width: 2.3rem;
          height: 2rem;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          img {
            max-width: 100%;
            max-height: 100%;
            transition: 0.3s;
          }
        }

        .pic {
          width: 2rem;
          height: 2rem;
          position: absolute;
          left: 0.35rem;
          top: -0.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;

          img {
            max-width: 100%;
            max-height: 100%;
            transition: 0.3s;
          }
        }

        p {
          height: 20px;
          font-size: 0.2rem;
          line-height: 25px;
          color: #ddd;
          text-align: center;
        }

        .Blind_btn {
          margin: 0.1rem 0 0;
          text-align: center;
          font-size: 0.18rem;
          color: #ffd926;
          line-height: 0.36rem;
          font-weight: 500;

          img {
            width: 0.3rem;
            transform: translateY(0.08rem);
          }
        }

        .open_btn {
          text-align: center;
          font-weight: 500;
          display: none;

          img {
            width: 0.45rem;
          }
        }

        &:hover {
          background: url(../../assets/images/box-bg.png) no-repeat center;
          background-size: cover;

          p {
            display: none;
          }

          .pic {
            img {
              transform: translateY(-20px);
            }
          }

          .Blind_btn {
            display: none;
          }

          .open_btn {
            display: block;
          }
        }
      }
    }
  }
}
</style>
