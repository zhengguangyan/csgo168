<template>
  <div id="Lucky">
    <div id="Lucky-box">
      <div class="Title">
        <p>幸运开箱</p>
        <div class="my_record" @click="Jump('/MyRecord')">我的记录</div>
      </div>
      <div class="search">
        <input type="text" placeholder="请输入饰品关键字" maxlength="60" v-model="SoName" />
        <div class="btn" @click="GetSoList"></div>
      </div>
      <div class="Lucky-out">
        <div class="Lucky-top">
          <div class="Lucky-top-item" v-for="(item, index) in outlist" :key="index" :class="{ active: index == outidx }" @click="outSelect(index, item.id)">
            <i></i>
            <img :src="item.cover" alt="" />
          </div>
        </div>
        <!-- 				<div class="smll-list">
					<div class="smll-list-title">武器的类型</div>
					<div class="smll-list-box">
						<div class="smll-list-item" v-for="(item,index) in smlllist" :key="index" :class="{'active' : index == smllidx}" @click="smllSelect(index)">{{item.name}}</div>
					</div>
				</div> -->
      </div>
      <div class="Lucky-list-box">
        <div class="Lucky-list-out">
          <van-loading class="vant-load" v-show="loadingShow == true" color="#000000" size="60" />
          <div class="Goods_list">
            <div class="Goods_item" :class="'lv_' + item.lv" v-for="(item, index) in equipmentlist" :key="index" @click="ToOpen(item.id)">
              <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ item.bean }}</div>
              <div class="dura_alias">{{ item.dura_alias }}</div>
              <div class="Goods_pic" :style="{ 'background-image': 'url(' + item.lv_bg_image + ')' }">
                <img :src="item.cover" alt="" />
              </div>
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { luckyType, luckyList, luckySo } from '@/network/api.js'
export default {
  name: 'Lucky',
  data () {
    return {
      outidx: 0,
      smllidx: 0,

      loadingShow: true,

      outlist: [],
      SoName: '',

      smlllist: [
        {
          name: '全部'
        },
        {
          name: '雪猎手套'
        },
        {
          name: '驾驶手套'
        },
        {
          name: '手部手套'
        },
        {
          name: '摩托手套'
        },
        {
          name: '专业手套'
        },
        {
          name: '运动手套'
        },
        {
          name: '九头蛇手套'
        }
      ],

      equipmentlist: []
    }
  },

  filters: {
    GuoLvOne (str) {
      return str.length > 15 ? str.substr(0, 15) + '...' : str
    }
  },

  created () {
    this.GetluckyType()
  },

  methods: {
    //装备类型
    GetluckyType () {
      luckyType().then((res) => {
        // console.log(res.data)
        this.outlist = res.data.data
        this.GetluckyList(this.outlist[0]['id'])
      })
    },

    //主分类选中
    outSelect (index, id) {
      this.outidx = index
      // console.log(id)
      this.GetluckyList(id)
    },


    //装备列表
    GetluckyList (id) {
      this.loadingShow = true
      luckyList(id).then((res) => {
        // console.log(res.data.data)
        this.equipmentlist = res.data.data

      })
    },

    //搜索
    GetSoList () {
      this.loadingShow = true
      luckySo(this.SoName).then((res) => {
        // console.log(res.data.data)
        this.equipmentlist = res.data.data
      })
    },
    //路由跳转
    Jump (str) {
      this.$router.push(str)
    },
    //路由跳转开箱
    ToOpen (id) {
      this.$router.push({
        path: '/Lucky_open',
        query: {
          id: id
        }
      })
    },

    //副分类选中
    smllSelect (index) {
      this.smllidx = index
    }
  },
  watch: {
    equipmentlist (val) {
      this.loadingShow = false
    }
  }
}
</script>
<style lang="scss">
@media screen and(min-width:1024px) {
  #Lucky-box {
    width: 14rem;
    padding-top: 0.4rem;
    .my_record {
      cursor: pointer;
      float: right;
      margin-top: 20px;
      color: #d3a9fd;
      border: 1px #d3a9fd solid;
      transition: 0.3s;
      font-size: 16px;
      height: 30px;
      padding: 0 26px;
      text-align: center;
      line-height: 30px;
    }
    .search {
      margin-top: 0.2rem;
      width: 100%;
      height: 0.7rem;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0 1rem 0 0.2rem;
        border: 1px solid #9e67d5;
        background: none;
        box-sizing: border-box;
        font-size: 0.22rem;
        overflow: hidden;
        &:focus {
          background-color: #9e67d5;
          border: 1px solid #9e67d5;
        }
        &::placeholder {
          color: rgba($color: #9e67d5, $alpha: 0.5);
        }
      }
      .btn {
        width: 1rem;
        height: 0.7rem;
        position: absolute;
        right: 0;
        top: 0;
        background: #fc63cf;
        cursor: pointer;
        background-image: url(../../assets/images/PublicImg/serch.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 40%;
      }
    }
    .Goods_list {
      width: 100%;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      margin-top: 20px;

      .Goods_item {
        width: 19%;
        text-align: center;
        color: #fff;
        margin-bottom: 15px;
        margin-right: 1.25%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &:nth-child(5n) {
          margin-right: 0px;
        }
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.5);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.5);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.5);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.5);
        }

        .odds_percent {
          position: absolute;
          left: 0px;
          top: 10px;
          font-size: 15px;
          text-align: left;
          padding: 2px 2px;
          border-radius: 10px;
          box-sizing: border-box;
          color: #ffd926;
          line-height: 20px;
          img {
            width: 20px;
            float: left;
          }
        }

        .dura_alias {
          position: absolute;
          right: 0;
          top: 12px;
          font-size: 14px;
          text-align: left;
          padding-right: 10px;
          box-sizing: border-box;
          color: #fff;
          line-height: 20px;
        }

        .Goods_pic {
          width: 80%;
          height: 160px;
          margin: 10px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;

          img {
            max-width: 100%;
            vertical-align: middle;
          }
        }

        p {
          width: 100%;
          padding: 0 3px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: -10px 0 10px;
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #75cd66;
          font-size: 16px;
          margin: 5px 0 0;

          img {
            width: 20px;
          }
        }
      }
    }
    .Lucky-out {
      margin-top: 0.4rem;
      width: 100%;
      background-size: cover;
      .Lucky-top {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .Lucky-top-item {
          width: 16%;
          height: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: pointer;
          border: 1px #d3a9fd solid;
          img {
            max-width: 65%;
            max-height: 100%;
            filter: grayscale(1);
            position: relative;
            z-index: 10;
          }
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0.02rem;
            content: '';
            height: 0.02rem;
            border-radius: 50%;
            background: none;
            box-shadow: none;
          }
          &.active {
            border: 1px #fc63cf solid;
            background: rgba($color: #fc63cf, $alpha: 0.5);
          }
        }
      }
      .smll-list {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
        box-sizing: border-box;
        .smll-list-title {
          width: 0.8rem;
          height: 0.4rem;
          font-size: 0.16rem;
          color: #8e908c;
          line-height: 0.4rem;
          margin-right: 0.2rem;
        }
        .smll-list-box {
          flex: 1;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .smll-list-item {
            height: 0.4rem;
            padding: 0 0.15rem;
            border-radius: 0.04rem;

            border: 0.01rem solid #e00000;

            border: 1px solid #e00000;
            box-sizing: border-box;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.14rem;
            margin-right: 0.15rem;
            color: #e00000;
            cursor: pointer;
            &.active {
              background: #e00000;
              color: #fff;
            }
          }
        }
      }
    }
    .Lucky-list-box {
      margin-top: 0.4rem;
      width: 100%;
      border-radius: 0.04rem 0.04rem 0.1rem 0.1rem;
      .Lucky-list-out {
        width: 100%;
        min-height: 4.5rem;
        background-size: cover;
        .vant-load {
          text-align: center;
          padding-top: 1.6rem;
        }
        .Lucky-list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .Lucky-list-item {
            width: 2.2rem;
            margin-top: 0.2rem;
            padding: 0.1rem 0.05rem;
            cursor: pointer;
            border: 1px solid transparent;
            box-sizing: border-box;
            transition: 0.2s;
            background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
            background-size: cover;
            margin-right: 0.16rem;
            border-radius: 0.04rem;
            overflow: hidden;
            position: relative;
            &:nth-child(6n) {
              margin-right: 0;
            }
            .ceng {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              background: rgba(233, 177, 14, 0.1);
              z-index: 2;
              opacity: 0;
            }
            .top {
              width: 100%;
              height: 0.3rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 0.2rem;
              box-sizing: border-box;
              p {
                width: 50%;
                height: 0.3rem;
                text-align: right;
                font-size: 0.14rem;
                color: #75dc9e;
                display: flex;
                align-items: center;
                img {
                  width: 0.15rem;
                }
              }
              span {
                font-size: 0.14rem;
                color: #e08902;
              }
            }

            .pic {
              width: 1.5rem;
              height: 1.5rem;
              margin: 0 auto;
              display: flex;
              justify-content: space-between;
              align-items: center;
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
            .name {
              text-align: center;
              line-height: 1.75em;
              font-size: 0.12rem;
              padding: 0.1rem 0.2rem;
              box-sizing: border-box;
            }
            &:hover {
              border-color: #e9b10e;
              .ceng {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and(min-width:1920px) {
  #Lucky-box {
    width: 14rem;
    padding-top: 0.4rem;
    .my_record {
      cursor: pointer;
      float: right;
      margin-top: 20px;
      color: #d3a9fd;
      border: 1px #d3a9fd solid;
      transition: 0.3s;
      font-size: 22px;
      height: 30px;
      padding: 0 26px;
      text-align: center;
      line-height: 30px;
    }
    .search {
      margin-top: 0.2rem;
      width: 100%;
      height: 0.7rem;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0 1rem 0 0.2rem;
        border: 1px solid #9e67d5;
        background: none;
        box-sizing: border-box;
        font-size: 0.22rem;
        overflow: hidden;
        &:focus {
          background-color: #9e67d5;
          border: 1px solid #9e67d5;
        }
        &::placeholder {
          color: rgba($color: #9e67d5, $alpha: 0.5);
        }
      }
      .btn {
        width: 1rem;
        height: 0.7rem;
        position: absolute;
        right: 0;
        top: 0;
        background: #fc63cf;
        cursor: pointer;
        background-image: url(../../assets/images/PublicImg/serch.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 40%;
      }
    }
    .Goods_list {
      width: 100%;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      margin-top: 20px;

      .Goods_item {
        width: 19%;
        text-align: center;
        color: #fff;
        margin-bottom: 15px;
        margin-right: 1.25%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &:nth-child(5n) {
          margin-right: 0px;
        }
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.5);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.5);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.5);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.5);
        }

        .odds_percent {
          position: absolute;
          left: 5px;
          top: 10px;
          font-size: 20px;
          text-align: left;
          padding: 2px 8px;
          border-radius: 10px;
          box-sizing: border-box;
          color: #ffd926;
          line-height: 20px;
          img {
            width: 20px;
            float: left;
          }
        }

        .dura_alias {
          position: absolute;
          right: 0;
          top: 12px;
          font-size: 20px;
          text-align: left;
          padding-right: 10px;
          box-sizing: border-box;
          color: #fff;
          line-height: 20px;
        }

        .Goods_pic {
          width: 80%;
          height: 160px;
          margin: 10px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;

          img {
            max-width: 100%;
            vertical-align: middle;
          }
        }

        p {
          width: 100%;
          padding: 0 3px;
          box-sizing: border-box;
          font-size: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: -10px 0 10px;
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #75cd66;
          font-size: 16px;
          margin: 5px 0 0;

          img {
            width: 20px;
          }
        }
      }
    }
    .Lucky-out {
      margin-top: 0.4rem;
      width: 100%;
      background-size: cover;
      .Lucky-top {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .Lucky-top-item {
          width: 16%;
          height: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: pointer;
          border: 1px #d3a9fd solid;
          img {
            max-width: 65%;
            max-height: 100%;
            filter: grayscale(1);
            position: relative;
            z-index: 10;
          }
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0.02rem;
            content: '';
            height: 0.02rem;
            border-radius: 50%;
            background: none;
            box-shadow: none;
          }
          &.active {
            border: 1px #fc63cf solid;
            background: rgba($color: #fc63cf, $alpha: 0.5);
          }
        }
      }
      .smll-list {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
        box-sizing: border-box;
        .smll-list-title {
          width: 0.8rem;
          height: 0.4rem;
          font-size: 0.16rem;
          color: #8e908c;
          line-height: 0.4rem;
          margin-right: 0.2rem;
        }
        .smll-list-box {
          flex: 1;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .smll-list-item {
            height: 0.4rem;
            padding: 0 0.15rem;
            border-radius: 0.04rem;

            border: 0.01rem solid #e00000;

            border: 1px solid #e00000;
            box-sizing: border-box;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.14rem;
            margin-right: 0.15rem;
            color: #e00000;
            cursor: pointer;
            &.active {
              background: #e00000;
              color: #fff;
            }
          }
        }
      }
    }
    .Lucky-list-box {
      margin-top: 0.4rem;
      width: 100%;
      border-radius: 0.04rem 0.04rem 0.1rem 0.1rem;
      .Lucky-list-out {
        width: 100%;
        min-height: 4.5rem;
        background-size: cover;
        .vant-load {
          text-align: center;
          padding-top: 1.6rem;
        }
        .Lucky-list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .Lucky-list-item {
            width: 2.2rem;
            margin-top: 0.2rem;
            padding: 0.1rem 0.05rem;
            cursor: pointer;
            border: 1px solid transparent;
            box-sizing: border-box;
            transition: 0.2s;
            background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
            background-size: cover;
            margin-right: 0.16rem;
            border-radius: 0.04rem;
            overflow: hidden;
            position: relative;
            &:nth-child(6n) {
              margin-right: 0;
            }
            .ceng {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              background: rgba(233, 177, 14, 0.1);
              z-index: 2;
              opacity: 0;
            }
            .top {
              width: 100%;
              height: 0.3rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 0.2rem;
              box-sizing: border-box;
              p {
                width: 50%;
                height: 0.3rem;
                text-align: right;
                font-size: 0.14rem;
                color: #75dc9e;
                display: flex;
                align-items: center;
                img {
                  width: 0.15rem;
                }
              }
              span {
                font-size: 0.14rem;
                color: #e08902;
              }
            }

            .pic {
              width: 1.5rem;
              height: 1.5rem;
              margin: 0 auto;
              display: flex;
              justify-content: space-between;
              align-items: center;
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
            .name {
              text-align: center;
              line-height: 1.75em;
              font-size: 0.12rem;
              padding: 0.1rem 0.2rem;
              box-sizing: border-box;
            }
            &:hover {
              border-color: #e9b10e;
              .ceng {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and(min-width:2560px) {
  #Lucky-box {
    width: 14rem;
    padding-top: 0.4rem;
    .my_record {
      cursor: pointer;
      float: right;
      margin-top: 20px;
      color: #d3a9fd;
      border: 1px #d3a9fd solid;
      transition: 0.3s;
      font-size: 22px;
      height: 30px;
      padding: 0 26px;
      text-align: center;
      line-height: 30px;
    }
    .search {
      margin-top: 0.2rem;
      width: 100%;
      height: 0.7rem;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0 1rem 0 0.2rem;
        border: 1px solid #9e67d5;
        background: none;
        box-sizing: border-box;
        font-size: 0.22rem;
        overflow: hidden;
        &:focus {
          background-color: #9e67d5;
          border: 1px solid #9e67d5;
        }
        &::placeholder {
          color: rgba($color: #9e67d5, $alpha: 0.5);
        }
      }
      .btn {
        width: 1rem;
        height: 0.7rem;
        position: absolute;
        right: 0;
        top: 0;
        background: #fc63cf;
        cursor: pointer;
        background-image: url(../../assets/images/PublicImg/serch.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 40%;
      }
    }
    .Goods_list {
      width: 100%;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      margin-top: 20px;

      .Goods_item {
        width: 19%;
        text-align: center;
        color: #fff;
        margin-bottom: 15px;
        margin-right: 1.25%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &:nth-child(5n) {
          margin-right: 0px;
        }
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.5);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.5);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.5);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.5);
        }

        .odds_percent {
          position: absolute;
          left: 5px;
          top: 10px;
          font-size: 20px;
          text-align: left;
          padding: 2px 8px;
          border-radius: 10px;
          box-sizing: border-box;
          color: #ffd926;
          line-height: 20px;
          img {
            width: 20px;
            float: left;
          }
        }

        .dura_alias {
          position: absolute;
          right: 0;
          top: 12px;
          font-size: 20px;
          text-align: left;
          padding-right: 10px;
          box-sizing: border-box;
          color: #fff;
          line-height: 20px;
        }

        .Goods_pic {
          width: 80%;
          height: 160px;
          margin: 10px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;

          img {
            max-width: 100%;
            vertical-align: middle;
          }
        }

        p {
          width: 100%;
          padding: 0 3px;
          box-sizing: border-box;
          font-size: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: -10px 0 10px;
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #75cd66;
          font-size: 16px;
          margin: 5px 0 0;

          img {
            width: 20px;
          }
        }
      }
    }
    .Lucky-out {
      margin-top: 0.4rem;
      width: 100%;
      background-size: cover;
      .Lucky-top {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .Lucky-top-item {
          width: 16%;
          height: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: pointer;
          border: 1px #d3a9fd solid;
          img {
            max-width: 65%;
            max-height: 100%;
            filter: grayscale(1);
            position: relative;
            z-index: 10;
          }
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0.02rem;
            content: '';
            height: 0.02rem;
            border-radius: 50%;
            background: none;
            box-shadow: none;
          }
          &.active {
            border: 1px #fc63cf solid;
            background: rgba($color: #fc63cf, $alpha: 0.5);
          }
        }
      }
      .smll-list {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
        box-sizing: border-box;
        .smll-list-title {
          width: 0.8rem;
          height: 0.4rem;
          font-size: 0.16rem;
          color: #8e908c;
          line-height: 0.4rem;
          margin-right: 0.2rem;
        }
        .smll-list-box {
          flex: 1;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .smll-list-item {
            height: 0.4rem;
            padding: 0 0.15rem;
            border-radius: 0.04rem;

            border: 0.01rem solid #e00000;

            border: 1px solid #e00000;
            box-sizing: border-box;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.14rem;
            margin-right: 0.15rem;
            color: #e00000;
            cursor: pointer;
            &.active {
              background: #e00000;
              color: #fff;
            }
          }
        }
      }
    }
    .Lucky-list-box {
      margin-top: 0.4rem;
      width: 100%;
      border-radius: 0.04rem 0.04rem 0.1rem 0.1rem;
      .Lucky-list-out {
        width: 100%;
        min-height: 4.5rem;
        background-size: cover;
        .vant-load {
          text-align: center;
          padding-top: 1.6rem;
        }
        .Lucky-list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .Lucky-list-item {
            width: 2.2rem;
            margin-top: 0.2rem;
            padding: 0.1rem 0.05rem;
            cursor: pointer;
            border: 1px solid transparent;
            box-sizing: border-box;
            transition: 0.2s;
            background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
            background-size: cover;
            margin-right: 0.16rem;
            border-radius: 0.04rem;
            overflow: hidden;
            position: relative;
            &:nth-child(6n) {
              margin-right: 0;
            }
            .ceng {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              background: rgba(233, 177, 14, 0.1);
              z-index: 2;
              opacity: 0;
            }
            .top {
              width: 100%;
              height: 0.3rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 0.2rem;
              box-sizing: border-box;
              p {
                width: 50%;
                height: 0.3rem;
                text-align: right;
                font-size: 0.14rem;
                color: #75dc9e;
                display: flex;
                align-items: center;
                img {
                  width: 0.15rem;
                }
              }
              span {
                font-size: 0.14rem;
                color: #e08902;
              }
            }

            .pic {
              width: 1.5rem;
              height: 1.5rem;
              margin: 0 auto;
              display: flex;
              justify-content: space-between;
              align-items: center;
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
            .name {
              text-align: center;
              line-height: 1.75em;
              font-size: 0.12rem;
              padding: 0.1rem 0.2rem;
              box-sizing: border-box;
            }
            &:hover {
              border-color: #e9b10e;
              .ceng {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style> 