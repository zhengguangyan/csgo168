<template>
  <div id="MyRecord">
    <div class="MyRecord-box">
      <div class="Title">
        <p>我的记录</p>
      </div>
      <div class="Lucky-list-box">
        <div class="Lucky-list-out">
          <div class="Goods_list">
            <div class="Goods_item" :class="'lv_'+item.lv" v-for="(item,index) in myrecordlist" :key="index">
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
    </div>
  </div>
</template>

<script>
import {LickRecord} from '@/network/api.js'
export default{
  name:"GameHistory",
  data(){
    return{
      myrecordlist:[],
    }
  },
  activated() {
    this.GetMyRecord()
  },
  filters:{

  },
  methods:{
    GetMyRecord() {
      LickRecord().then((res) => {
        this.myrecordlist = res.data.data.myrecordlist
      })
    },
  },

  created() {
  }
}
</script>

<style lang="scss">
.MyRecord-box{
  width: 100%;
  padding-top: 0.4rem;
  .Lucky-list-box{
    margin-top: 0.4rem;
    width: 100%;
    border-radius: 0.04rem 0.04rem 0.1rem 0.1rem;
    .Lucky-list-out{
      width: 100%;
      min-height: 4.5rem;
      background-size: cover;
      .vant-load{
        text-align: center;
        padding-top: 1.6rem;
      }
      .Lucky-list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .Lucky-list-item{
          width: 2.2rem;
          margin-top: 0.2rem;
          padding: 0.1rem 0.05rem;
          cursor: pointer;
          border: 1px solid transparent;
          box-sizing: border-box;
          transition: .2s;
          background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
          background-size: cover;
          margin-right: 0.16rem;
          border-radius: 0.04rem;
          overflow: hidden;
          position: relative;
          &:nth-child(6n){
            margin-right: 0;
          }
          .ceng{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(233, 177, 14, 0.1);
            z-index: 2;
            opacity: 0;
          }
          .top{
            width: 100%;
            height: 0.3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.2rem;
            box-sizing: border-box;
            p{
              width: 50%;
              height: 0.3rem;
              text-align: right;
              font-size: 0.14rem;
              color: #75dc9e;
              display: flex;
              align-items: center;
              img{
                width: 0.15rem;
              }
            }
            span{
              font-size: 0.14rem;
              color: #e08902;
            }
          }

          .pic{
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{
              max-width: 100%;
              max-height: 100%;
            }
          }
          .name{
            text-align: center;
            line-height: 1.75em;
            font-size: 0.12rem;
            padding: 0.1rem 0.2rem;
            box-sizing: border-box;
          }
          &:hover{
            border-color: #E9B10E;
            .ceng{
              opacity: 1;
            }
          }
        }
      }
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
      background-color:#716778;
      &:nth-child(5n){
        margin-right:0px;
      }
      &.lv_1{
        background-color:#915f4d;
      }
      &.lv_2{
        background-color:#99358a;
      }
      &.lv_3{
        background-color:#8551ab;
      }
      &.lv_4{
        background-color:#4948b8;
      }

      .odds_percent {
        position: absolute;
        left: 5px;
        top: 10px;
        font-size: 13px;
        text-align: left;
        padding: 2px 8px;
        border-radius:10px;
        box-sizing: border-box;
        color: #ffd926;
        line-height:20px;
        img{width:20px;float:left;}
      }

      .dura_alias {
        position: absolute;
        right: 0;
        top: 12px;
        font-size: 10px;
        text-align: left;
        padding-right: 10px;
        box-sizing: border-box;
        color: #fff;
        line-height:20px;
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
}
</style>
