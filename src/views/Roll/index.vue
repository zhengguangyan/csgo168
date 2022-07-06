<template>
  <div id="Roll">
    <div class="Roll_box">
      <div class="Roll_Nav">
        <p :class="{ active: Status == '1' }" @click="ChangeRolls('1')">进行中</p>
        <p :class="{ active: Status == '2' }" @click="ChangeRolls('2')">已结束</p>
        <p :class="{ active: Status == '3' }" @click="ChangeRolls('3')">我参加的</p>
        <p class="created" @click="ToCreatingRooms">创建房间 +</p>
      </div>
      <div class="Roll_List">
        <div class="Roll_item" v-for="(item, index) in RoomList" :key="index">
          <div class="Roll_pic">
            <img :src="item.user.avatar" alt="" />
          </div>
          <div class="Roll_tit">{{ item.name }}</div>
          <div class="Roll_time">开奖时间：{{ item.end_time }}</div>
          <div class="Roll_Data">
            <div class="Roll_data_box">
              <p>奖池</p>
              <span style="color: #ffd728"><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.award_bean }}</span>
            </div>
            <div class="Roll_data_box">
              <p>件数</p>
              <span>{{ item.box_records.length }}</span>
            </div>
            <div class="Roll_data_box">
              <p>人数</p>
              <span>{{ item.join_number }}</span>
            </div>
          </div>
          <div class="Roll_Goods">
            <div class="Roll_Goods_item" :class="'lv_' + value.lv" v-for="(value, index) in item.box_records" :key="index" v-if="index < 5">
              <div class="pic">
                <img :src="value.cover" alt="" />
              </div>
            </div>
          </div>
          <div class="Roll_btn" @click="toRoom(item.id)">{{ item.status == '1' ? '我要参加' : '查看详情' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Rooms,
  UserRooms
} from '@/network/api.js'
export default {
  name: 'Roll',
  data () {
    return {
      RoomList: [], //房间列表
      Status: '1', //房间状态
    }
  },
  filters: {
    StyChoice (val) {
      // console.log(val)
      if (val == '1') {
        return 'border-bottom-color:#e6ba1c;'
      } else if (val == '2') {
        return 'border-bottom-color:#d32ce6;'
      } else if (val == '3') {
        return 'border-bottom-color:#834fff;'
      } else if (val == '4') {
        return 'border-bottom-color:#4b69ff;'
      } else {
        return 'border-bottom-color:#bbbbbb;'
      }
    }
  },
  created () {
    this.GetRooms()
  },

  methods: {
    //获取房间列表(初始)
    GetRooms () {
      Rooms('1', this.Status).then((res) => {
        // console.log(res.data.data.data)
        this.RoomList = res.data.data.data
      })
    },

    //参加房间记录(我参与的)
    GetUserRooms () {
      UserRooms().then((res) => {
        this.RoomList = res.data.data.data
      })
    },

    //改变房间列表
    ChangeRolls (v) {
      this.Status = v
      switch (v) {
        case '1':
          this.GetRooms()
          break;
        case '2':
          this.GetRooms()
          break;
        default:
          this.GetUserRooms()
      }
    },

    //路由跳转房间详情
    toRoom (id) {
      // console.log(id)
      this.$router.push({
        path: '/room',
        query: {
          id: id
        }
      })
    },

    ToCreatingRooms () {
      this.$router.push('/CreatingRooms')
    }
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 1024px) {
  .Roll_box {
    padding-top: 40px;
    width: 100%;
    .Roll_Nav {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      cursor: pointer;
      p {
        height: 30px;
        padding: 0 26px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        margin: 0 5px;
        border: 1px #000 solid;
        transition: 0.3s;

        &.active {
          color: #fff;
          border-color: #000;
          background: rgba($color: #000, $alpha: 0.5);
        }
        &.created {
          border-style: dashed;
        }
        &:hover {
          color: #fff;
          background: rgba($color: #d3a9fd, $alpha: 0.5);
        }
      }
    }
  }
  @media screen and(min-width:1920px) {
    .Roll_box {
      padding-top: 40px;
      width: 100%;
      .Roll_Nav {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        cursor: pointer;
        p {
          height: 50px;
          padding: 0 26px;
          text-align: center;
          line-height: 50px;
          font-size: 18px;
          color: #fff;
          margin: 0 5px;
          border: 1px #000 solid;
          transition: 0.3s;

          &.active {
            color: #fff;
            border-color: #000;
            background: rgba($color: #000, $alpha: 0.5);
          }
          &.created {
            border-style: dashed;
          }
          &:hover {
            color: #fff;
            background: rgba($color: #d3a9fd, $alpha: 0.5);
          }
        }
      }
    }
  }
  @media screen and (min-width: 1024px) {
    .Roll_List {
      width: 100%;
      // border: 1px solid red;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      margin-top: 50px;
      .Roll_item {
        width: 30%;
        position: relative;
        padding: 20px;
        margin-bottom: 40px;
        margin-right: 3%;
        box-sizing: border-box;
        cursor: pointer;
        /*background-color: rgba($color: #000000, $alpha: 0.3);
				border:4px rgba($color: #000000, $alpha: 0.3) solid;*/
        transition: 0.3s;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:hover {
          background: rgba($color: #000000, $alpha: 0.5);
        }
        .Roll_pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #000;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          margin-right: 15px;

          img {
            width: 130%;
            height: 130%;
          }
        }

        .Roll_tit {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          margin-top: 5px;
        }

        .Roll_Data {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;

          .Roll_data_box {
            width: 30%;
            text-align: center;

            p {
              color: #fff;
              font-size: 12px;
            }

            span {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              color: #fff;
              font-weight: bold;
              margin-top: 5px;

              img {
                width: 22px;
                margin-right: 1px;
              }
            }
          }
        }

        .Roll_Goods {
          width: 100%;
          height: 70px;
          margin-top: 20px;
          display: flex;
          padding: 0 12px;
          box-sizing: border-box;
          justify-content: space-around;
          flex-wrap: wrap;
          overflow: hidden;

          .Roll_Goods_item {
            width: 70px;
            height: 70px;
            box-sizing: border-box;
            background: #716778;
            border: none;
            &.lv_1 {
              background: #915f4d;
            }
            &.lv_2 {
              background: #99358a;
            }
            &.lv_3 {
              background: #8551ab;
            }
            &.lv_4 {
              background: #4948b8;
            }

            .pic {
              width: 90%;
              height: 90%;
              margin: 2px auto 0;
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

        .Roll_btn {
          width: 150px;
          height: 32px;
          margin: 20px auto 0;
          border-radius: 100px;
          text-align: center;
          line-height: 32px;
          color: #fff;
          font-size: 14px;
          background-color: #8d44af;
          transition: 0.3s;
          &:hover {
            background-color: #8938af;
          }
        }

        .Roll_time {
          color: #fff;
          font-size: 13px;
        }
      }
    }
  }
  @media screen and (min-width: 1920px) {
    .Roll_List {
      width: 100%;
      // border: 1px solid red;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      margin-top: 50px;
      .Roll_item {
        width: 30%;
        position: relative;
        padding: 20px;
        margin-bottom: 40px;
        margin-right: 3%;
        box-sizing: border-box;
        cursor: pointer;
        /*background-color: rgba($color: #000000, $alpha: 0.3);
				border:4px rgba($color: #000000, $alpha: 0.3) solid;*/
        transition: 0.3s;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:hover {
          background: rgba($color: #000000, $alpha: 0.5);
        }
        .Roll_pic {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #000;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          margin-right: 15px;

          img {
            width: 130%;
            height: 130%;
          }
        }

        .Roll_tit {
          color: #fff;
          font-size: 18px;
          font-weight: 500;
          margin-top: 5px;
        }

        .Roll_Data {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;

          .Roll_data_box {
            width: 30%;
            text-align: center;

            p {
              color: #fff;
              font-size: 16px;
            }

            span {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 18px;
              color: #fff;
              font-weight: bold;
              margin-top: 5px;

              img {
                width: 22px;
                margin-right: 1px;
              }
            }
          }
        }

        .Roll_Goods {
          width: 100%;
          height: 70px;
          margin-top: 20px;
          display: flex;
          padding: 0 12px;
          box-sizing: border-box;
          justify-content: space-around;
          flex-wrap: wrap;
          overflow: hidden;

          .Roll_Goods_item {
            width: 90px;
            height: 90px;
            box-sizing: border-box;
            background: #716778;
            border: none;
            &.lv_1 {
              background: #915f4d;
            }
            &.lv_2 {
              background: #99358a;
            }
            &.lv_3 {
              background: #8551ab;
            }
            &.lv_4 {
              background: #4948b8;
            }

            .pic {
              width: 90%;
              height: 90%;
              margin: 2px auto 0;
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

        .Roll_btn {
          width: 150px;
          height: 32px;
          margin: 20px auto 0;
          border-radius: 100px;
          text-align: center;
          line-height: 32px;
          color: #fff;
          font-size: 20px;
          background-color: #8d44af;
          transition: 0.3s;
          &:hover {
            background-color: #8938af;
          }
        }

        .Roll_time {
          color: #fff;
          font-size: 18px;
        }
      }
    }
  }
  @media screen and (min-width:2560px) {
    .Roll_List {
      width: 100%;
      // border: 1px solid red;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      margin-top: 50px;
      .Roll_item {
        width: 30%;
        position: relative;
        padding: 20px;
        margin-bottom: 40px;
        margin-right: 3%;
        box-sizing: border-box;
        cursor: pointer;
        /*background-color: rgba($color: #000000, $alpha: 0.3);
				border:4px rgba($color: #000000, $alpha: 0.3) solid;*/
        transition: 0.3s;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:hover {
          background: rgba($color: #000000, $alpha: 0.5);
        }
        .Roll_pic {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #000;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          margin-right: 15px;

          img {
            width: 130%;
            height: 130%;
          }
        }

        .Roll_tit {
          color: #fff;
          font-size: 23px;
          font-weight: 500;
          margin-top: 5px;
        }

        .Roll_Data {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;

          .Roll_data_box {
            width: 30%;
            text-align: center;

            p {
              color: #fff;
              font-size: 18px;
            }

            span {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 18px;
              color: #fff;
              font-weight: bold;
              margin-top: 5px;

              img {
                width: 22px;
                margin-right: 1px;
              }
            }
          }
        }

        .Roll_Goods {
          width: 100%;
          height: 70px;
          margin-top: 20px;
          display: flex;
          padding: 0 12px;
          box-sizing: border-box;
          justify-content: space-around;
          flex-wrap: wrap;
          overflow: hidden;

          .Roll_Goods_item {
            width: 90px;
            height: 90px;
            box-sizing: border-box;
            background: #716778;
            border: none;
            &.lv_1 {
              background: #915f4d;
            }
            &.lv_2 {
              background: #99358a;
            }
            &.lv_3 {
              background: #8551ab;
            }
            &.lv_4 {
              background: #4948b8;
            }

            .pic {
              width: 90%;
              height: 90%;
              margin: 2px auto 0;
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

        .Roll_btn {
          width: 150px;
          height: 32px;
          margin: 20px auto 0;
          border-radius: 100px;
          text-align: center;
          line-height: 32px;
          color: #fff;
          font-size: 20px;
          background-color: #8d44af;
          transition: 0.3s;
          &:hover {
            background-color: #8938af;
          }
        }

        .Roll_time {
          color: #fff;
          font-size: 22px;
        }
      }
    }
  }
}
</style>
