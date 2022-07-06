<template>
  <div id="Recharge">
    <div class="Recharge_box" style="color: white">
      <div class="Title">
        <p>个人充值</p>
      </div>
      <div class="payment_box">
        <div class="payment_tit">请选择你要购买的支付数量</div>
        <div class="payment_list">
          <div class="payment_item" v-for="(item, index) in BeansArr" :key="index" :class="{ active: Idx == index }" @click="choose(item, index)">
            <div class="ceng"></div>
            <p>金币充值</p>
            <div class="pic"></div>
            <div class="face"><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.bean }}</div>
            <span>≈￥{{ item.price }}</span>
          </div>
        </div>
        <div class="payment_btns">
          <div v-for="(v, index) in ChannelsArr" :key="index">
            <p @click="PostRecharge_Code(v.type)"><img :src="v.cover" alt="" />{{ v.title }}</p>
            <!-- <p @click="PostRecharge_Code('11')"><img src="@/assets/images/public/kami.png" alt="">易支付</p>-->
            <!-- <p @click="PostRecharge_Code('7')"><img src="@/assets/images/public/weixin.png" alt="">微信</p> -->
            <!-- <p @click="Carmichael"><img src="@/assets/images/public/kami.png" alt="">卡密支付</p> -->
          </div>
        </div>
        <div class="" v-html="payFrom"></div>
        <div class="Ipt">
          <input type="text" placeholder="请输入卡密兑换码" v-model="card" />
          <p @click="PostCard_recharge">卡密兑换</p>
        </div>
      </div>
      <div class="order_box">
        <div class="order_tit">充值记录</div>
        <div class="order_list">
          <div class="order_item">
            <div class="Gold">金币</div>
            <div class="Price">价格</div>
            <div class="Code">订单号</div>
            <div class="state">状态</div>
            <div class="btn"></div>
          </div>
          <div class="order_item" v-for="(item, index) in RecordArr" :key="index">
            <div class="Gold">{{ item.bean }}</div>
            <div class="Price">{{ item.price }}</div>
            <div class="Code">{{ item.code }}</div>
            <div class="state">{{ item.status_alias }}</div>
            <div class="btn">
              <p @click="ToPaymentDetails(item)">查看</p>
            </div>
          </div>
        </div>

        <div class="PageNum">
          <el-pagination background layout="prev, pager, next" @current-change="change" :page-size="per_page" :total="total"> </el-pagination>
        </div>
      </div>

      <van-overlay :show="Code_Show">
        <div class="wrapper">
          <div class="QR_code">
            <div class="QR_title" v-if="mk == '6' || mk == '11'"><img src="@/assets/images/public/zhifubao.png" alt="" />支付宝</div>
            <div class="QR_title" v-else=""><img src="@/assets/images/public/weixin.png" alt="" />微信</div>
            <div class="QR_img">
              <img :src="Code_Img" alt="" />
            </div>
            <div class="QR_btn" @click="Gb_Code_Show">支付完成</div>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {
  Beans,
  Recharge,
  Recharge_record,
  BeansFirst,
  BeansTotal,
  PersonalInfo,
  Card_recharge, Channels
} from '@/network/api.js'

import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'Recharge',
  data () {
    return {
      BeansArr: [], //金豆列表
      ChannelsArr: [], //支付列表
      Idx: 0, //样式选择
      BeanId: '',
      card_link: '',//卡密链接
      card: '',//卡密

      RecordArr: [],//记录
      total: 0,//总数据
      per_page: 0,//一页数据
      pagenum: '1',//页码
      Code_Img: null,
      Code_Show: false,
      mk: '',
      payFrom: ''
    }
  },

  created () {
    this.GetBeans()
    this.GetRecharge_record()
    this.GetChannel()
  },

  methods: {
    //金豆列表
    GetBeans () {
      Beans().then((res) => {
        // console.log(res.data.data)
        this.BeansArr = res.data.data
        this.BeanId = res.data.data[0].id
        this.card_link = res.data.data[0].card_link
      })
    },

    GetChannel () {
      Channels().then((res) => {
        this.ChannelsArr = res.data.data
      })
    },

    //金豆选择
    choose (item, index) {
      // console.log(item)
      this.Idx = index
      this.BeanId = item.id
      this.card_link = item.card_link
    },

    //支付(二维码)
    PostRecharge_Code (v) {
      // console.log(v)
      this.$toast.loading({
        message: '正在生成订单',
        overlay: true,
        forbidClick: true,
        duration: 0
      });
      this.mk = v
      Recharge(this.BeanId, v).then((res) => {
        // console.log(res.data)
        this.$toast.clear()
        const _data = res.data
        if (_data.type == 'qr') {
          this.Code_Img = _data.list.qr_url
          this.Code_Show = true
        } else if (_data.type == 'from') {
          this.payFrom = _data.list
          setTimeout(function () {
            document.forms['alipay_submit'].submit()
          }, 500)
        } else if (_data.type == 'base64') {
          const img = "data:image/png;base64," + _data.list.qr_url;
          this.file = this.base64ImgtoFile(img);
          this.Code_Img =
            window.webkitURL.createObjectURL(this.file) ||
            window.URL.createObjectURL(this.file);
          this.Code_Show = true
        }
      })
    },
    base64ImgtoFile (dataurl, filename = "file") {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const suffix = mime.split("/")[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    },
    //支付(链接)
    PostRecharge (type) {
      const newRoute = this.$router.resolve({
        path: '/Payment',
        query: {
          type: type,
          id: this.BeanId,
        }
      })
      window.open(newRoute.href, '_blank')
    },

    //支付结束
    Gb_Code_Show () {
      this.Code_Show = false
      window.location.reload()
    },

    //卡密购买
    Carmichael () {
      window.open(this.card_link, '_blank')
    },



    //卡密支付
    PostCard_recharge () {
      Card_recharge(this.card).then((res) => {
        // console.log(res)
        this.$message({
          message: '兑换成功',
          type: 'success'
        })
      })
    },

    //充值记录
    GetRecharge_record () {
      Recharge_record(this.pagenum).then((res) => {
        // console.log(res.data.data)
        this.RecordArr = res.data.data.data
        this.total = res.data.data.total
        this.per_page = res.data.data.per_page
      })
    },

    //记录分页
    change (v) {
      // console.log(v)
      this.pagenum = v
      this.GetRecharge_record()
    },

    //跳转详情
    ToPaymentDetails (item) {
      this.$router.push({
        path: '/PaymentDetails',
        query: {
          code: item.code
        }
      })
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

  }

}
</script>

<style lang="scss">
.Recharge_box {
  width: 12rem;
  margin: 0 auto;
  padding-top: 40px;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .QR_code {
      width: 360px;
      border: 1px solid #4854c9;
      background-color: #1e2355;
      border-radius: 6px;
      .QR_title {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        margin-top: 10px;
        img {
          width: 40px;
          margin-right: 5px;
        }
      }
      .QR_img {
        width: 205px;
        height: 205px;
        margin: 10px auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .QR_btn {
        width: 160px;
        height: 40px;
        border: 1px solid #ffd322;
        margin: 20px auto 30px;
        text-align: center;
        line-height: 40px;
        border-radius: 6px;
        font-size: 20px;
        color: #ffd322;
        cursor: pointer;
      }
    }
  }
  .payment_box {
    width: 100%;
    border-radius: 6px;
    margin-top: 40px;
    overflow: hidden;
    padding: 0 20px;
    box-sizing: border-box;

    .payment_tit {
      text-align: center;
      font-size: 22px;
      color: #fff;
      margin: 20px 0;
    }

    .payment_list {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .payment_item {
        width: 2.2rem;
        margin: 0 0.05rem;
        background: #6e2c9b;
        overflow: hidden;
        position: relative;
        border: 2px solid transparent;
        box-sizing: border-box;
        cursor: pointer;

        .ceng {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #6e2c9b;
          opacity: 0;
        }

        p {
          width: 100%;
          height: 0.5rem;
          background: #3d1b50;
          color: #d3a9fd;
          text-align: center;
          line-height: 0.5rem;
          font-size: 22px;
        }

        .pic {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0.1rem auto;
          background: url(../../assets/images/PublicImg/JB6.png) no-repeat center;
          background-size: contain;
        }

        .face {
          width: 100%;
          height: 0.3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffd300;
          font-size: 0.22rem;

          img {
            width: 0.28rem;
            height: 0.28rem;
            vertical-align: middle;
            margin-bottom: 2px;
          }
        }

        span {
          display: block;
          text-align: center;
          color: #ccc;
          font-size: 0.16rem;
          margin-bottom: 0.1rem;
        }

        &:nth-child(1) {
          .pic {
            background: url(../../assets/images/PublicImg/JB1.png) no-repeat center;
            background-size: contain;
          }
        }

        &:nth-child(2) {
          .pic {
            background: url(../../assets/images/PublicImg/JB2.png) no-repeat center;
            background-size: contain;
          }
        }

        &:nth-child(3) {
          .pic {
            background: url(../../assets/images/PublicImg/JB3.png) no-repeat center;
            background-size: contain;
          }
        }

        &:nth-child(4) {
          .pic {
            background: url(../../assets/images/PublicImg/JB4.png) no-repeat center;
            background-size: contain;
          }
        }

        &:nth-child(5) {
          .pic {
            background: url(../../assets/images/PublicImg/JB5.png) no-repeat center;
            background-size: contain;
          }
        }
        &:nth-child(6) {
          .pic {
            background: url(../../assets/images/PublicImg/JB6.png) no-repeat center;
            background-size: contain;
          }
        }

        &.active {
          border-color: #edc300;

          .ceng {
            opacity: 0.1;
          }
          p {
            color: #3e146f;
            background-color: #edc300;
          }
        }
      }
    }

    .payment_btns {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      margin-top: 20px;

      p {
        width: 240px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        background: none;
        margin: 0 10px;
        font-size: 22px;
        border: 2px solid #d3a9fd;
        position: relative;
        cursor: pointer;

        img {
          width: 30px;
          height: 30px;
          vertical-align: middle;
          margin-bottom: 2px;
          margin-right: 5px;
        }

        &::after {
          display: block;
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: #e9b10e;
          opacity: 0;
          left: 0;
          top: 0;
        }

        &:hover {
          border-color: #fc63cf;
          background: rgba($color: #fc63cf, $alpha: 0.5);

          &::after {
            opacity: 0.1;
          }
        }
      }
    }

    .Ipt {
      width: 100%;
      height: 40px;
      position: relative;
      margin: 20px 0;

      input {
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        padding-left: 20px;
        padding-right: 120px;
        box-sizing: border-box;
        background: rgba($color: #000, $alpha: 0.5);
        transition: 0.3s;

        &:focus {
          background: rgba($color: #000, $alpha: 0.8);
        }
      }

      p {
        width: 100px;
        height: 40px;
        background: #000;
        text-align: center;
        line-height: 40px;
        color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
    }
  }

  .order_box {
    width: 100%;
    // background:rgba(26,29,36,.8);
    border-radius: 6px;
    margin-top: 40px;
    overflow: hidden;
    box-sizing: border-box;

    .order_tit {
      width: 100%;
      height: 70px;
      background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
      line-height: 70px;
      font-size: 24px;
      font-weight: bold;
      padding-left: 20px;
      box-sizing: border-box;
    }

    .order_list {
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;

      .order_item {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        font-size: 18px;

        .Gold {
          width: 120px;
        }

        .Price {
          width: 150px;
        }

        .Code {
          width: 250px;
        }

        .state {
          width: 150px;
        }

        .btn {
          p {
            width: 60px;
            height: 30px;
            background: #ffd300;
            color: #000;
            font-size: 14px;
            text-align: center;
            line-height: 30px;
            border-radius: 4px;
            cursor: pointer;
          }
        }

        &:first-child {
          font-size: 22px;
        }

        &:nth-child(2n) {
          background-image: linear-gradient(90deg, rgba(255, 162, 24, 0) 0%, rgba(255, 162, 24, 0.19) 52%, rgba(255, 162, 24, 0) 100%);
        }
      }
    }

    .PageNum {
      width: 100%;
      margin-left: 25px;
      margin-top: 20px;
      margin-bottom: 20px;

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
}
@media screen and (min-width: 1920px) {
  .Recharge_box {
    width: 12rem;
    margin: 0 auto;
    padding-top: 40px;
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .QR_code {
        width: 360px;
        border: 1px solid #4854c9;
        background-color: #1e2355;
        border-radius: 6px;
        .QR_title {
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          margin-top: 10px;
          img {
            width: 40px;
            margin-right: 5px;
          }
        }
        .QR_img {
          width: 205px;
          height: 205px;
          margin: 10px auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .QR_btn {
          width: 160px;
          height: 40px;
          border: 1px solid #ffd322;
          margin: 20px auto 30px;
          text-align: center;
          line-height: 40px;
          border-radius: 6px;
          font-size: 20px;
          color: #ffd322;
          cursor: pointer;
        }
      }
    }
    .payment_box {
      width: 100%;
      border-radius: 6px;
      margin-top: 40px;
      overflow: hidden;
      padding: 0 20px;
      box-sizing: border-box;

      .payment_tit {
        text-align: center;
        font-size: 22px;
        color: #fff;
        margin: 20px 0;
      }

      .payment_list {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .payment_item {
          width: 2.2rem;
          margin: 0 0.05rem;
          background: #6e2c9b;
          overflow: hidden;
          position: relative;
          border: 2px solid transparent;
          box-sizing: border-box;
          cursor: pointer;

          .ceng {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: #6e2c9b;
            opacity: 0;
          }

          p {
            font-size: 20px;
            width: 100%;
            height: 0.5rem;
            background: #3d1b50;
            color: #d3a9fd;
            text-align: center;
            line-height: 0.5rem;
          }

          .pic {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0.1rem auto;
            background: url(../../assets/images/PublicImg/JB6.png) no-repeat center;
            background-size: contain;
          }

          .face {
            width: 100%;
            height: 0.3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffd300;
            font-size: 0.22rem;

            img {
              width: 0.28rem;
              height: 0.28rem;
              vertical-align: middle;
              margin-bottom: 2px;
            }
          }

          span {
            display: block;
            text-align: center;
            color: #ccc;
            font-size: 0.16rem;
            margin-bottom: 0.1rem;
          }

          &:nth-child(1) {
            .pic {
              background: url(../../assets/images/PublicImg/JB1.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(2) {
            .pic {
              background: url(../../assets/images/PublicImg/JB2.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(3) {
            .pic {
              background: url(../../assets/images/PublicImg/JB3.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(4) {
            .pic {
              background: url(../../assets/images/PublicImg/JB4.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(5) {
            .pic {
              background: url(../../assets/images/PublicImg/JB5.png) no-repeat center;
              background-size: contain;
            }
          }
          &:nth-child(6) {
            .pic {
              background: url(../../assets/images/PublicImg/JB6.png) no-repeat center;
              background-size: contain;
            }
          }

          &.active {
            border-color: #edc300;

            .ceng {
              opacity: 0.1;
            }
            p {
              color: #3e146f;
              background-color: #edc300;
            }
          }
        }
      }

      .payment_btns {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        margin-top: 20px;

        p {
          width: 240px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          background: none;
          margin: 0 10px;
          font-size: 22px;
          border: 2px solid #d3a9fd;
          position: relative;
          cursor: pointer;

          img {
            width: 50px;
            height: 50px;
            vertical-align: middle;
            margin-bottom: 2px;
            margin-right: 5px;
          }

          &::after {
            display: block;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: #e9b10e;
            opacity: 0;
            left: 0;
            top: 0;
          }

          &:hover {
            border-color: #fc63cf;
            background: rgba($color: #fc63cf, $alpha: 0.5);

            &::after {
              opacity: 0.1;
            }
          }
        }
      }

      .Ipt {
        width: 100%;
        height: 40px;
        position: relative;
        margin: 20px 0;

        input {
          font-size: 20px;
          width: 100%;
          height: 100%;
          border: 1px solid #000;
          padding-left: 20px;
          padding-right: 120px;
          box-sizing: border-box;
          background: rgba($color: #000, $alpha: 0.5);
          transition: 0.3s;

          &:focus {
            background: rgba($color: #000, $alpha: 0.8);
          }
        }

        p {
          font-size: 20px;
          width: 100px;
          height: 40px;
          background: #000;
          text-align: center;
          line-height: 40px;
          color: #fff;
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
        }
      }
    }

    .order_box {
      width: 100%;
      // background:rgba(26,29,36,.8);
      border-radius: 6px;
      margin-top: 40px;
      overflow: hidden;
      box-sizing: border-box;

      .order_tit {
        width: 100%;
        height: 70px;
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
        line-height: 70px;
        font-size: 24px;
        font-weight: bold;
        padding-left: 20px;
        box-sizing: border-box;
      }

      .order_list {
        width: 100%;
        padding: 0 40px;
        box-sizing: border-box;

        .order_item {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          font-size: 20px;

          .Gold {
            width: 120px;
          }

          .Price {
            width: 150px;
          }

          .Code {
            width: 250px;
          }

          .state {
            width: 150px;
          }

          .btn {
            p {
              width: 60px;
              height: 30px;
              background: #ffd300;
              color: #000;
              font-size: 20px;
              text-align: center;
              line-height: 30px;
              border-radius: 4px;
              cursor: pointer;
            }
          }

          &:first-child {
            font-size: 22px;
          }

          &:nth-child(2n) {
            background-image: linear-gradient(90deg, rgba(255, 162, 24, 0) 0%, rgba(255, 162, 24, 0.19) 52%, rgba(255, 162, 24, 0) 100%);
          }
        }
      }

      .PageNum {
        width: 100%;
        margin-left: 25px;
        margin-top: 20px;
        margin-bottom: 20px;

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
  }
}
@media screen and (min-width: 2560px) {
  .Recharge_box {
    width: 12rem;
    margin: 0 auto;
    padding-top: 40px;
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .QR_code {
        width: 360px;
        border: 1px solid #4854c9;
        background-color: #1e2355;
        border-radius: 6px;
        .QR_title {
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          margin-top: 10px;
          img {
            width: 40px;
            margin-right: 5px;
          }
        }
        .QR_img {
          width: 205px;
          height: 205px;
          margin: 10px auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .QR_btn {
          width: 160px;
          height: 40px;
          border: 1px solid #ffd322;
          margin: 20px auto 30px;
          text-align: center;
          line-height: 40px;
          border-radius: 6px;
          font-size: 20px;
          color: #ffd322;
          cursor: pointer;
        }
      }
    }
    .payment_box {
      width: 100%;
      border-radius: 6px;
      margin-top: 40px;
      overflow: hidden;
      padding: 0 20px;
      box-sizing: border-box;

      .payment_tit {
        text-align: center;
        font-size: 22px;
        color: #fff;
        margin: 20px 0;
      }

      .payment_list {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .payment_item {
          width: 2.2rem;
          margin: 0 0.05rem;
          background: #6e2c9b;
          overflow: hidden;
          position: relative;
          border: 2px solid transparent;
          box-sizing: border-box;
          cursor: pointer;

          .ceng {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: #6e2c9b;
            opacity: 0;
          }

          p {
            font-size: 20px;
            width: 100%;
            height: 0.5rem;
            background: #3d1b50;
            color: #d3a9fd;
            text-align: center;
            line-height: 0.5rem;
          }

          .pic {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0.1rem auto;
            background: url(../../assets/images/PublicImg/JB6.png) no-repeat center;
            background-size: contain;
          }

          .face {
            width: 100%;
            height: 0.3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffd300;
            font-size: 0.22rem;

            img {
              width: 0.28rem;
              height: 0.28rem;
              vertical-align: middle;
              margin-bottom: 2px;
            }
          }

          span {
            display: block;
            text-align: center;
            color: #ccc;
            font-size: 0.16rem;
            margin-bottom: 0.1rem;
          }

          &:nth-child(1) {
            .pic {
              background: url(../../assets/images/PublicImg/JB1.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(2) {
            .pic {
              background: url(../../assets/images/PublicImg/JB2.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(3) {
            .pic {
              background: url(../../assets/images/PublicImg/JB3.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(4) {
            .pic {
              background: url(../../assets/images/PublicImg/JB4.png) no-repeat center;
              background-size: contain;
            }
          }

          &:nth-child(5) {
            .pic {
              background: url(../../assets/images/PublicImg/JB5.png) no-repeat center;
              background-size: contain;
            }
          }
          &:nth-child(6) {
            .pic {
              background: url(../../assets/images/PublicImg/JB6.png) no-repeat center;
              background-size: contain;
            }
          }

          &.active {
            border-color: #edc300;

            .ceng {
              opacity: 0.1;
            }
            p {
              color: #3e146f;
              background-color: #edc300;
            }
          }
        }
      }

      .payment_btns {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        margin-top: 20px;

        p {
          width: 240px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          background: none;
          margin: 0 10px;
          font-size: 22px;
          border: 2px solid #d3a9fd;
          position: relative;
          cursor: pointer;

          img {
            width: 30px;
            height: 30px;
            vertical-align: middle;
            margin-bottom: 2px;
            margin-right: 5px;
          }

          &::after {
            display: block;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: #e9b10e;
            opacity: 0;
            left: 0;
            top: 0;
          }

          &:hover {
            border-color: #fc63cf;
            background: rgba($color: #fc63cf, $alpha: 0.5);

            &::after {
              opacity: 0.1;
            }
          }
        }
      }

      .Ipt {
        width: 100%;
        height: 40px;
        position: relative;
        margin: 20px 0;

        input {
          font-size: 20px;
          width: 100%;
          height: 100%;
          border: 1px solid #000;
          padding-left: 20px;
          padding-right: 120px;
          box-sizing: border-box;
          background: rgba($color: #000, $alpha: 0.5);
          transition: 0.3s;

          &:focus {
            background: rgba($color: #000, $alpha: 0.8);
          }
        }

        p {
          font-size: 20px;
          width: 100px;
          height: 40px;
          background: #000;
          text-align: center;
          line-height: 40px;
          color: #fff;
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
        }
      }
    }

    .order_box {
      width: 100%;
      // background:rgba(26,29,36,.8);
      border-radius: 6px;
      margin-top: 40px;
      overflow: hidden;
      box-sizing: border-box;

      .order_tit {
        width: 100%;
        height: 70px;
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
        line-height: 70px;
        font-size: 24px;
        font-weight: bold;
        padding-left: 20px;
        box-sizing: border-box;
      }

      .order_list {
        width: 100%;
        padding: 0 40px;
        box-sizing: border-box;

        .order_item {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          font-size: 20px;

          .Gold {
            width: 120px;
          }

          .Price {
            width: 150px;
          }

          .Code {
            width: 250px;
          }

          .state {
            width: 150px;
          }

          .btn {
            p {
              width: 60px;
              height: 30px;
              background: #ffd300;
              color: #000;
              font-size: 20px;
              text-align: center;
              line-height: 30px;
              border-radius: 4px;
              cursor: pointer;
            }
          }

          &:first-child {
            font-size: 22px;
          }

          &:nth-child(2n) {
            background-image: linear-gradient(90deg, rgba(255, 162, 24, 0) 0%, rgba(255, 162, 24, 0.19) 52%, rgba(255, 162, 24, 0) 100%);
          }
        }
      }

      .PageNum {
        width: 100%;
        margin-left: 25px;
        margin-top: 20px;
        margin-bottom: 20px;

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
  }
}
</style>
