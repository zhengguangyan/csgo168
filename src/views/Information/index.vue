<template>
  <div class="information">
    <div class="information-box">
      <div class="Title">
        <p>消息通知</p>
      </div>
      <div class="StatusBar">
        <div class="GoodsAndDelivery">
          <p @click="DeleteRead()">删除已读</p>
        </div>

        <div>
          <p style="margin-right: 20px">您有{{ this.total }}条消息</p>
        </div>
      </div>

      <div class="BattleList-box">
        <div class="MBX">
          <div class="title">标题</div>
          <div class="body">内容</div>
          <div class="time">时间</div>
        </div>
        <div class="BattleList-list">
          <div class="BattleList-item" v-for="(item, index) in this.Message_list" :key="index" @click="CheckShow(item.id)">
            <div class="title"><span v-if="item.have_read == 0" style="margin: 0 10px; font-size: 36px; color: red">•</span>{{ item.title }}</div>
            <div class="body">{{ item.body | ellipsis }}</div>
            <div class="time">
              <div class="code">{{ item.created_at }}</div>
            </div>
          </div>
        </div>
        <div class="PageNum">
          <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page" :total="PageNum"> </el-pagination>
        </div>
      </div>

      <van-overlay :show="WarnShow">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel" @click="CloseShow">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" />
            </div>
            <span>{{ this.Message_detail_title }}</span>
            <p>{{ this.Message_detail_body }}</p>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>
<script>
import {
  Message_Detail,
  Message_List,
  Delete_Read,
} from '@/network/api.js'
import {
  mapState,
  mapMutations
} from 'vuex'
import myUpload from 'vue-image-crop-upload';
export default {
  name: 'information',
  data () {
    return {
      PageNum: 0,
      per_page: 10,
      page_Num: 1,
      WarnShow: false,
      total: 0,
      Message_detail_title: '',
      Message_detail_body: '',
      Message_list: [],
      Message_detail: []
    }
  },

  created () {
    this.GetMassageList()
  },
  filters: {
    //文字数超出时，超出部分使用...
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 40) {
        return value.slice(0, 40) + '...'
      }
      return value
    }
  },

  components: {
    "my-upload": myUpload
  },
  methods: {

    //警告遮罩层
    CheckShow (id) {
      this.WarnShow = true;
      Message_Detail(id).then((res) => {
        this.Message_detail_title = res.data.data.title
        this.Message_detail_body = res.data.data.body
      })
    },

    //警告遮罩层
    CloseShow () {
      this.WarnShow = false;
      this.GetMassageList();
    },

    //获取对战列表
    GetMassageList () {
      Message_List().then((res) => {
        this.Message_list = res.data.data.data
        this.total = res.data.data.total
      })
    },

    //删除已读
    DeleteRead () {
      Delete_Read().then((res) => {

      })
      this.GetMassageList();
    },

    ...mapMutations([
      'User'
    ])

  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    user (v) {
    }

  }
}
</script>
<style lang="scss">
.information-box {
  width: 100%;
  padding-top: 0.4rem;

  .StatusBar {
    width: 100%;
    height: 0.36rem;
    margin-top: 0.36rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .GoodsAndDelivery {
      width: 50%;
      height: 0.36rem;
      display: flex;
      padding: 0 20px;
      p {
        height: 100%;
        padding: 0 0.3rem;
        line-height: 0.36rem;
        text-align: center;
        margin-right: 0.1rem;
        font-size: 0.16rem;
        cursor: pointer;
        color: #d3a9fd;
        border: 1px #fb63d0 solid;

        &.active {
          border-color: #fb63d0;
          background: rgba($color: #fb63d0, $alpha: 0.5);
          color: #fff;
        }
      }
    }
  }

  .BattleList-box {
    width: 100%;
    height: 7rem;
    margin-top: 0.2rem;
    background-size: cover;
    box-sizing: border-box;
    position: relative;

    .MBX {
      width: 100%;
      display: flex;
      align-items: center;
      height: 0.5rem;
      font-size: 0.14rem;
      padding: 0 0.2rem;
      background: rgba(110, 44, 155, 0.6);
      box-sizing: border-box;
      color: #fff;
      text-align: center;
      .title {
        width: 2rem;
        .point {
          color: red;
        }
      }
      .body {
        width: 5.5rem;
      }
      .time {
        width: 2.5rem;
      }
    }
    .BattleList-list {
      width: 100%;
      height: 5.5rem;
      .BattleList-item {
        width: 100%;
        height: 0.68rem;
        border-top: 1px solid #a160c0;
        display: flex;
        align-items: center;
        font-size: 0.2rem;
        color: #e2c7ff;
        text-align: center;
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
        .title {
          width: 2rem;
        }
        .body {
          width: 6rem;
        }
        .time {
          width: 2.5rem;
        }
      }
    }
    .PageNum {
      width: 100%;
      text-align: center;

      li {
        background: #111111 !important;

        &.active {
          background: #4854c9 !important;
        }

        &:hover {
          color: #fff !important;
        }
      }

      .btn-prev,
      .btn-next {
        background: #111111;
      }
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .wrapper-box {
      .wrapper-box-top {
        width: 100%;
        height: 0.03rem;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      }

      width: 7.5rem;
      height: 3rem;
      position: relative;
      border: 1px solid rgba($color: #fff, $alpha: 0.6);
      background-color: rgba($color: #000, $alpha: 0.7);
      border-radius: 0.08rem;
      overflow: hidden;
      padding: 0 0.35rem;
      box-sizing: border-box;

      span {
        display: block;
        text-align: center;
        font-size: 0.24rem;
        margin: 0.2rem 0 0.2rem;
      }

      p {
        font-size: 0.14rem;
        margin-bottom: 0.1rem;
        line-height: 1.75em;
      }

      .Tutorial {
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        .title {
          width: 100%;
          height: 0.95rem;
          line-height: 0.95rem;
          text-align: center;
          font-size: 0.26rem;
        }

        .Tutorial-box {
          width: 100%;
          display: flex;
          justify-content: space-between;

          .JianTou {
            margin-top: 0.2rem;
          }

          .Tutorial-item {
            width: 1.6rem;
            text-align: center;

            .pic {
              width: 0.8rem;
              height: 0.8rem;
              margin: 0 auto;

              img {
                width: 100%;
                height: 100%;
              }
            }

            p {
              font-size: 0.16rem;
              color: #fff;
              margin-top: 0.1rem;
            }

            .info {
              color: rgba(255, 255, 255, 0.6);
              font-size: 0.14rem;
              line-height: 1.75em;
            }
          }
        }
      }

      .cancel {
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        top: 0;
        right: 0;
        text-align: center;
        line-height: 0.5rem;

        img {
          width: 0.15rem;
          cursor: pointer;
        }
      }
    }
  }
}
@media screen and(min-width:1920px) {
  .information-box {
    width: 100%;
    padding-top: 0.4rem;

    .StatusBar {
      width: 100%;
      height: 0.36rem;
      margin-top: 0.36rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .GoodsAndDelivery {
        width: 50%;
        height: 0.36rem;
        display: flex;
        padding: 0 20px;
        p {
          height: 100%;
          padding: 0 0.3rem;
          line-height: 0.36rem;
          text-align: center;
          margin-right: 0.1rem;
          font-size: 0.2rem;
          cursor: pointer;
          color: #d3a9fd;
          border: 1px #fb63d0 solid;

          &.active {
            border-color: #fb63d0;
            background: rgba($color: #fb63d0, $alpha: 0.5);
            color: #fff;
          }
        }
      }
    }

    .BattleList-box {
      width: 100%;
      height: 7rem;
      margin-top: 0.2rem;
      background-size: cover;
      box-sizing: border-box;
      position: relative;

      .MBX {
        width: 100%;
        display: flex;
        align-items: center;
        height: 0.5rem;
        font-size: 0.2rem;
        padding: 0 0.2rem;
        background: rgba(110, 44, 155, 0.6);
        box-sizing: border-box;
        color: #fff;
        text-align: center;
        .title {
          width: 2rem;
          .point {
            color: red;
          }
        }
        .body {
          width: 5.5rem;
        }
        .time {
          width: 2.5rem;
        }
      }
      .BattleList-list {
        width: 100%;
        height: 5.5rem;
        .BattleList-item {
          width: 100%;
          height: 0.68rem;
          border-top: 1px solid #a160c0;
          display: flex;
          align-items: center;
          font-size: 0.2rem;
          color: #e2c7ff;
          text-align: center;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
          .title {
            width: 2rem;
          }
          .body {
            width: 6rem;
          }
          .time {
            width: 2.5rem;
          }
        }
      }
      .PageNum {
        width: 100%;
        text-align: center;

        li {
          background: #111111 !important;

          &.active {
            background: #4854c9 !important;
          }

          &:hover {
            color: #fff !important;
          }
        }

        .btn-prev,
        .btn-next {
          background: #111111;
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .wrapper-box {
        .wrapper-box-top {
          width: 100%;
          height: 0.03rem;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        width: 7.5rem;
        height: 3rem;
        position: relative;
        border: 1px solid rgba($color: #fff, $alpha: 0.6);
        background-color: rgba($color: #000, $alpha: 0.7);
        border-radius: 0.08rem;
        overflow: hidden;
        padding: 0 0.35rem;
        box-sizing: border-box;

        span {
          display: block;
          text-align: center;
          font-size: 0.24rem;
          margin: 0.2rem 0 0.2rem;
        }

        p {
          font-size: 0.14rem;
          margin-bottom: 0.1rem;
          line-height: 1.75em;
        }

        .Tutorial {
          width: 100%;
          height: 100%;
          box-sizing: border-box;

          .title {
            width: 100%;
            height: 0.95rem;
            line-height: 0.95rem;
            text-align: center;
            font-size: 0.26rem;
          }

          .Tutorial-box {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .JianTou {
              margin-top: 0.2rem;
            }

            .Tutorial-item {
              width: 1.6rem;
              text-align: center;

              .pic {
                width: 0.8rem;
                height: 0.8rem;
                margin: 0 auto;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              p {
                font-size: 0.16rem;
                color: #fff;
                margin-top: 0.1rem;
              }

              .info {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.14rem;
                line-height: 1.75em;
              }
            }
          }
        }

        .cancel {
          width: 0.5rem;
          height: 0.5rem;
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          line-height: 0.5rem;

          img {
            width: 0.15rem;
            cursor: pointer;
          }
        }
      }
    }
  }
}
@media screen and(min-width:2560px) {
  .information-box {
    width: 100%;
    padding-top: 0.4rem;

    .StatusBar {
      width: 100%;
      height: 0.36rem;
      margin-top: 0.36rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .GoodsAndDelivery {
        width: 50%;
        height: 0.36rem;
        display: flex;
        padding: 0 20px;
        p {
          height: 100%;
          padding: 0 0.3rem;
          line-height: 0.36rem;
          text-align: center;
          margin-right: 0.1rem;
          font-size: 0.2rem;
          cursor: pointer;
          color: #d3a9fd;
          border: 1px #fb63d0 solid;

          &.active {
            border-color: #fb63d0;
            background: rgba($color: #fb63d0, $alpha: 0.5);
            color: #fff;
          }
        }
      }
    }

    .BattleList-box {
      width: 100%;
      height: 7rem;
      margin-top: 0.2rem;
      background-size: cover;
      box-sizing: border-box;
      position: relative;

      .MBX {
        width: 100%;
        display: flex;
        align-items: center;
        height: 0.5rem;
        font-size: 0.2rem;
        padding: 0 0.2rem;
        background: rgba(110, 44, 155, 0.6);
        box-sizing: border-box;
        color: #fff;
        text-align: center;
        .title {
          width: 2rem;
          .point {
            color: red;
          }
        }
        .body {
          width: 5.5rem;
        }
        .time {
          width: 2.5rem;
        }
      }
      .BattleList-list {
        width: 100%;
        height: 5.5rem;
        .BattleList-item {
          width: 100%;
          height: 0.68rem;
          border-top: 1px solid #a160c0;
          display: flex;
          align-items: center;
          font-size: 0.2rem;
          color: #e2c7ff;
          text-align: center;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
          .title {
            width: 2rem;
          }
          .body {
            width: 6rem;
          }
          .time {
            width: 2.5rem;
          }
        }
      }
      .PageNum {
        width: 100%;
        text-align: center;

        li {
          background: #111111 !important;

          &.active {
            background: #4854c9 !important;
          }

          &:hover {
            color: #fff !important;
          }
        }

        .btn-prev,
        .btn-next {
          background: #111111;
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .wrapper-box {
        .wrapper-box-top {
          width: 100%;
          height: 0.03rem;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        width: 7.5rem;
        height: 3rem;
        position: relative;
        border: 1px solid rgba($color: #fff, $alpha: 0.6);
        background-color: rgba($color: #000, $alpha: 0.7);
        border-radius: 0.08rem;
        overflow: hidden;
        padding: 0 0.35rem;
        box-sizing: border-box;

        span {
          display: block;
          text-align: center;
          font-size: 0.24rem;
          margin: 0.2rem 0 0.2rem;
        }

        p {
          font-size: 0.14rem;
          margin-bottom: 0.1rem;
          line-height: 1.75em;
        }

        .Tutorial {
          width: 100%;
          height: 100%;
          box-sizing: border-box;

          .title {
            width: 100%;
            height: 0.95rem;
            line-height: 0.95rem;
            text-align: center;
            font-size: 0.26rem;
          }

          .Tutorial-box {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .JianTou {
              margin-top: 0.2rem;
            }

            .Tutorial-item {
              width: 1.6rem;
              text-align: center;

              .pic {
                width: 0.8rem;
                height: 0.8rem;
                margin: 0 auto;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              p {
                font-size: 0.16rem;
                color: #fff;
                margin-top: 0.1rem;
              }

              .info {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.14rem;
                line-height: 1.75em;
              }
            }
          }
        }

        .cancel {
          width: 0.5rem;
          height: 0.5rem;
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          line-height: 0.5rem;

          img {
            width: 0.15rem;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
