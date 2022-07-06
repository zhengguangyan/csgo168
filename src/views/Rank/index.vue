<template>
  <div id="Rank">
    <!-- <div class="Rank_btn" @click="Switch = !Switch">
			<van-icon color="#000" size="24px" :name="IconName" />
		</div> -->
    <div class="hongbao" @click="Changeredshow">
      <!-- @click="ChangeRight" @click="WuKaiFang" -->
      <span class="text_4 text_46">红包福利</span>
    </div>
    <div class="help" @click="open_qq()">
      <!-- @click="ChangeRight" @click="WuKaiFang" -->
      <span class="text_4 text_46">联系客服</span>
    </div>

    <!--    <div class="flex-col items-center text-wrapper_5"><span data-v-331c0cfa="" class="text_4 text_46">红包福利</span></div>-->

    <van-overlay :show="redshow" :lock-scroll="false" @click="redshow = false">
      <div class="wrapper">
        <div class="red_box" @click.stop>
          <van-notice-bar background="#b5462c" color="#fff" left-icon="volume-o" scrollable :text="site_bulletin" :key="key" />
          <div class="qq">加群<span>577777481</span>,不定期发放红包福利</div>
          <input type="text" v-model="key_data" placeholder="请输入红包口令" />
          <div class="red_open" @click="Exactly">
            <img src="@/assets/images/BroadSide/open.png" alt="" />
          </div>
          <div class="red_tit"><img src="@/assets/images/BroadSide/red_tit.png" alt="" /></div>
          <div class="red_activity">
            <div class="red_item" v-for="(item, index) in RedData" :key="index">
              <div class="red_item_top">
                <div class="red_img">
                  <p>剩余数量</p>
                  <span>{{ item.remainder }}</span>
                </div>
                <div class="red_data">
                  <b>{{ item.title }}</b>
                  <p>参与条件:{{ item.briefe }}</p>
                  <span>时间:{{ item.end_time }}</span>
                </div>
              </div>
              <div class="red_btn" style="cursor: pointer" @click="PostRedOpen(item)">抢红包</div>
            </div>
          </div>
          <div class="red_rule">口令红包规则</div>
        </div>
      </div>
    </van-overlay>

    <van-dialog v-model="dialog" :showConfirmButton="false">
      <div class="genus">
        <div class="amount">{{ redbean }}</div>
        <div class="genus_btn" @click="dialog = false">确认</div>
      </div>
    </van-dialog>

    <div class="Retrieve_box" :style="'right:' + Right + 'px;'">
      <div class="Retrieve_top">
        <p v-for="(item, index) in merchant" :key="index" @click="IsRetrieve(item.invite_code)">{{ item.name }}</p>
      </div>
    </div>

    <van-overlay :show="QQshow" @click="QQshow = false">
      <div class="wrapper">
        <div style="width: 200px; background-color: #fff; padding: 20px; color: #333">
          客服联系QQ：82040192
          <div class="Sign">
            <a class="Sign-item" href="tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=82040192">
              <p>加为好友</p>
            </a>
            <a class="Sign-item" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=82040192&site=qq:82040192&menu=yes">
              <p>直接对话</p>
            </a>
          </div>
        </div>
      </div>
    </van-overlay>

    <van-overlay :show="RetrieveShow" @click="RetrieveShow = false">
      <div class="wrapper">
        <div class="Retrieve_out" @click.stop>
          <div class="Retrieve_nav">
            <p @click="SelectAll">全选</p>
            <p @click="PostAGive">帮助取回</p>
          </div>
          <div class="Retrieve_list">
            <div class="Retrieve_item" v-for="(item, index) in StorageList" :key="index" @click="Select(item, index)" ref="Item">
              <div class="top">
                <p><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.bean }}</p>
                <span>{{ item.dura_alias }}</span>
              </div>
              <div class="pic" :style="'background-image: url(' + item.lv_bg_image + ')'">
                <img :src="item.cover" alt="" />
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
          <div class="PageNum">
            <el-pagination background layout="prev, pager, next" @current-change="PickChange" :page-size="per_page" :total="PageNum"> </el-pagination>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {
  SGetRank
} from "@/network/server";
import {
  Storage
} from '@/network/api.js'
import {
  Red,
  RedOpen,
  Info,
  AGive
} from '@/network/api.js'
export default {
  name: "Rank",
  data () {
    return {
      show: false,
      jion: false,
      index: 0,
      KeFu: false,

      Switch: true, //切换
      RightSty: 0, //偏移值
      IconName: 'arrow', //vant icon name
      QQshow: false,


      rank: [],
      first: {
        name: " ",
        avatar: "#",
        bean: 0
      },
      title: ["", "昨日之星", "上周排行", "上月排行"],

      redshow: false, //红包内容显示
      key: 0,
      dialog: false, //dialog显示隐藏
      boom: new Audio(require('@/assets/audio/boom.aac')), //红包声音
      RedData: [], //红包
      key_data: '',
      redbean: '',
      site_bulletin: '',
      Right: -350,
      RetrieveShow: false,
      page: 0,
      StorageList: [],
      PageNum: 0,
      per_page: 0,
      Select_All: false,//是否全选状态
      merchant: [],
      invite_code: ''
    };
  },

  created () {
    this.getRed()
    this.GetInfo()
    // this.GetStorage()
  },

  methods: {

    //暂未开放
    WuKaiFang () {
      this.$message({
        message: '暂未开放,敬请期待!',
        type: 'error'
      })
    },
    //红包列表
    getRed () {
      Red().then((res) => {
        // console.log(res.data.data)
        this.RedData = res.data.data
      })
    },


    // 开红包
    PostRedOpen (item) {
      // console.log(item)
      RedOpen('1', item.id).then((res) => {
        // console.log(res)
        this.redbean = res.data.data.bean
        this.boom.play()
        this.dialog = true
      })
    },


    //口令
    Exactly () {
      RedOpen('2', '', this.key_data).then((res) => {
        // console.log(res.data.data)
        this.redbean = res.data.data.bean
        this.boom.play()
        this.dialog = true
      })

    },

    IsRetrieve (v) {
      // console.log(v)
      this.invite_code = v
      this.RetrieveShow = true
      this.Right = -350
    },

    //仓库列表
    GetStorage () {
      Storage(this.page, '0', 0).then((res) => {
        // console.log(res.data.data)
        this.StorageList = res.data.data.data
        this.PageNum = Number(res.data.data.total)
        this.per_page = Number(res.data.data.per_page)
      })
    },

    PickChange (v) {
      // console.log(v)
      this.page = v
      this.GetStorage()
    },

    //单选
    Select (item, index) {
      // console.log(item)
      if (item.Select) {
        delete item.Select
        this.$refs.Item[index].style.border = "1px solid transparent";
      } else {
        let key = "Select";
        let value = true
        item[key] = value
        this.$refs.Item[index].style.border = "1px solid #E9B10E"
      }
    },

    //全选
    SelectAll () {
      if (this.Select_All == false) {
        for (let i = 0; i < this.StorageList.length; i++) {
          let key = "Select";
          let value = true
          this.StorageList[i][key] = value
          this.$refs.Item[i].style.border = "1px solid #E9B10E"
        }
        this.Select_All = true
      } else {
        for (let i = 0; i < this.StorageList.length; i++) {
          delete this.StorageList[i].Select
          this.$refs.Item[i].style.border = "1px solid transparent"
        }
        this.Select_All = false
      }
    },


    //取回			
    PostAGive () {
      let arr = this.StorageList.filter((item) => {
        return item.Select == true
      })

      let data = []
      for (let i = 0; i < arr.length; i++) {
        data.push(arr[i].id)
      }
      // console.log(data)
      AGive(data, this.invite_code).then((res) => {
        // console.log()
        this.$message({
          message: res.data.message,
          type: 'success'
        })
        this.GetStorage()
      })
    },

    GetInfo () {
      Info().then((res) => {
        // console.log(res.data.data)
        this.site_bulletin = res.data.data.site_bulletin
        this.merchant = res.data.data.merchant
      })
    },

    //红包内容显示
    Changeredshow () {
      this.key += 1
      this.redshow = true
    },

    ChangeRight () {
      if (this.Right == 0) {
        this.Right = -350
      } else {
        this.Right = 0
      }
    },


    GetRank (t) {
      if (this.index == t || t == 0) {
        this.index = 0;
        return;
      }
      var str = "";
      switch (t) {
        case 1:
          str = "d";
          break;
        case 2:
          str = "w";
          break;
        case 3:
          str = "m";
          break;
        default:
          break;
      }
      SGetRank(str).then((data) => {
        let that = this;
        let arr = [];
        if (data.length > 0) {
          that.first = data[0];
          that.index = t;
          for (let i = 1; i < data.length; i++) {
            arr[arr.length] = data[i];
          }
        } else {
          that.index = 0;
        }
        that.rank = arr;
      });
    },
    open_qq () {
      this.QQshow = true
    }
  },
  watch: {
    StorageList (val) {
      for (let i = 0; i < this.StorageList.length; i++) {
        delete this.StorageList[i].Select
        setTimeout(() => {
          if (this.$refs.Item) {
            this.$refs.Item[i].style.border = "1px solid transparent"
          }
        }, 10)
      }
      this.Select_All = false
    },
    //切换
    Switch (v) {
      if (v == true) {
        this.RightSty = 0
        this.IconName = 'arrow'
      } else {
        this.RightSty = -0.6
        this.IconName = 'arrow-left'
      }
    },
    key_data (v) {
      // console.log(v)
    }
  }
};
</script>

<style lang="scss">
#Rank {
  position: fixed;
  width: 65px;
  top: 6rem;
  right: 0;
  z-index: 1000;
  // background: url(../../assets/images/PublicImg/stock_2.png) no-repeat center;
  background-size: cover;
  border-radius: 0.04rem 0 0 0.04rem;
  padding-bottom: 0.05rem;
  transition: 0.3s;

  .Retrieve_box {
    width: 350px;
    height: 120px;
    background: rgba($color: #1a1c24, $alpha: 1);
    position: fixed;
    bottom: 100px;
    border-radius: 6px 0 0 6px;
    transition: 0.3s;

    .Retrieve_top {
      width: 100%;
      height: 90px;
      border-bottom: 1px solid #7e7e7e;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 16px;
      box-sizing: border-box;

      p {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #ffd322;
        font-size: 14px;
        border-radius: 4px;
        color: #000;
        cursor: pointer;
      }
    }
  }

  .Rank_btn {
    position: absolute;
    width: 20px;
    height: 60px;
    background: #ffba2e;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    line-height: 73px;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
  }
  @media screen and(min-width:1024px) {
    .hongbao {
     width: 60px;
      height: 60px;
      padding-top: 20px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 495px;
      // transform: translateY(4px);
      // transition: 0.3s;
      background: url('../../assets/images/home/hongbao.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 0.68vw;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      // .text_4 {
      //   text-transform: uppercase;
      // }
    }
    .help {
      width: 60px;
      height: 60px;
      padding-top: 20px;
      margin-top: 2px;
      text-align: center;
      cursor: pointer;
      background-image: url('../../assets/images/home/kefu.png');
      position: fixed;
      right: 0;
      top: 428px;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 0.68vw;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }
  }
  @media screen and (min-width:1280px) {
     .hongbao {
     width: 60px;
      height: 60px;
      padding-top: 10px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 495px;
      // transform: translateY(4px);
      // transition: 0.3s;
      background: url('../../assets/images/home/hongbao.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 0.68vw;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      // .text_4 {
      //   text-transform: uppercase;
      // }
    }
    .help {
      width: 60px;
      height: 60px;
      padding-top: 10px;
      margin-top: 2px;
      text-align: center;
      cursor: pointer;
      background-image: url('../../assets/images/home/kefu.png');
      position: fixed;
      right: 0;
      top: 552px;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 0.68vw;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }
  }
  @media screen and(min-width:1366px) {
    .hongbao {
      width: 60px;
      height: 60px;
      padding-top: 10px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 495px;
      // transform: translateY(4px);
      // transition: 0.3s;
      background: url('../../assets/images/home/hongbao.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 0.88vw;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }

    .help {
       width: 60px;
      height: 60px;
      padding-top: 10px;
      margin-top: 2px;
      text-align: center;
      cursor: pointer;
      background-image: url('../../assets/images/home/kefu.png');
      position: fixed;
      right: 0;
      top: 552px;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 0.88vw;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }
  }
    @media screen and(min-width:1440px) {
    .hongbao {
      width: 60px;
      height: 60px;
      padding-top: 5px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 495px;
      // transform: translateY(4px);
      // transition: 0.3s;
      background: url('../../assets/images/home/hongbao.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 14px;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }

    .help {
       width: 60px;
      height: 60px;
      padding-top: 5px;
      margin-top: 2px;
      text-align: center;
      cursor: pointer;
      background-image: url('../../assets/images/home/kefu.png');
      position: fixed;
      right: 0;
      top: 552px;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 14px;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }
  }
  @media screen and(min-width:1920px) {
    .hongbao {
      width:90px;
      height: 90px;
      padding-top: 20px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 590px;
      // transform: translateY(4px);
      // transition: 0.3s;
      background: url('../../assets/images/home/hongbao.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 17px;
        font-family: SourceHanSansCN;
        font-weight: 700;
        // line-height: 5.68vw;
      }
      // .text_4 {
      //   text-transform: uppercase;
      // }
    }

    .help {
      width: 90px;
      height: 90px;
      padding-top: 8px;
      // margin-top:2px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 678px;
      background: url('../../assets/images/home/kefu.png') no-repeat;
      background-size: 100% 100%;
      .text_46 {
        color: #fff;
        font-size: 17px;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }
  }
  @media screen and(min-width:2560px) {
    .hongbao {
      width: 100px;
      height: 100px;
      padding-top: 10px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 600px;
      // transform: translateY(4px);
      // transition: 0.3s;
      background: url('../../assets/images/home/hongbao.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .text_46 {
        color: #fff;
        font-size: 20px;
        font-family: SourceHanSansCN;
        font-weight: 700;
        // line-height: 5.68vw;
      }
      // .text_4 {
      //   text-transform: uppercase;
      // }
    }

    .help {
      width: 100px;
      height: 100px;
      padding-top: 8px;
      // margin-top:2px;
      text-align: center;
      cursor: pointer;
      position: fixed;
      right: 0;
      top: 700px;
      background: url('../../assets/images/home/kefu.png') no-repeat;
      background-size: 100% 100%;
      .text_46 {
        color: #fff;
        font-size: 20px;
        font-family: SourceHanSansCN;
        font-weight: 700;
        line-height: 5.68vw;
      }
      .text_4 {
        text-transform: uppercase;
      }
    }
  }

  .backtop {
    width: 0.5rem;
    height: 0.5rem;
    margin: 12px auto;
    text-align: center;
    cursor: pointer;
    transform: translateY(4px);
    img {
      width: 0.3rem;
    }

    p {
      font-size: 14px;
    }
  }

  .van-overlay {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .Sign {
        width: 100%;
        height: 100%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .Sign-item {
          width: 0.8rem;
          height: 0.3rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffd322;
          border-radius: 0.04rem;
          text-align: center;
          line-height: 0.3rem;
          color: #000;

          &:first-child {
            margin-right: 0.08rem;
          }

          p {
            font-size: 0.16rem;
          }
        }
      }

      .Retrieve_out {
        width: 940px;
        background: #1f2535;
        border-radius: 6px;
        padding: 10px 20px;
        box-sizing: border-box;

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

        .Retrieve_nav {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          margin-top: 5px;

          p {
            padding: 0 20px;
            height: 30px;
            line-height: 31px;
            text-align: center;
            font-size: 14px;
            color: #000;
            background: #ffd322;
            border-radius: 4px;
            cursor: pointer;
          }
        }

        .Retrieve_list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          .Retrieve_item {
            width: 160px;
            background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
            background-size: cover;
            margin-right: 25px;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 6px;
            margin-bottom: 15px;
            cursor: pointer;
            border: 1px solid transparent;

            &:nth-child(5n) {
              margin-right: 0;
            }

            .top {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;

              p {
                display: flex;
                align-items: center;

                img {
                  width: 18px;
                }

                font-size: 12px;
                font-weight: bold;
              }

              span {
                font-size: 12px;
                color: #e08902;
              }
            }

            .pic {
              width: 120px;
              height: 120px;
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              background: url(http://csgo.api.88roll.com/uploads/images/8bef9bba38aa9a2341132c6b71b4d762.png);
              background-size: 90%;
              background-position: center;
              background-repeat: no-repeat;

              img {
                max-width: 80%;
                max-height: 80%;
                vertical-align: middle;
              }
            }

            .name {
              font-size: 12px;
              text-align: center;
              padding: 0 5px;
              box-sizing: border-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

      .red_box {
        width: 400px;
        padding-bottom: 20px;
        background: #c02932 url(../../assets/images/BroadSide/Red_top.png) no-repeat top;
        background-size: 100%;
        border-radius: 6px;
        position: relative;

        &::after {
          display: block;
          content: '';
          width: 50px;
          height: 200px;
          background: url(../../assets/images/BroadSide/decorateleft.png) no-repeat top;
          background-size: contain;
          position: absolute;
          left: -10px;
          top: -15px;
        }

        &::before {
          display: block;
          content: '';
          width: 50px;
          height: 200px;
          background: url(../../assets/images/BroadSide/decorateright.png) no-repeat top;
          background-size: contain;
          position: absolute;
          right: -10px;
          top: -15px;
        }

        .van-notice-bar {
          height: 40px;
          width: 80%;
          border-radius: 10px;
          margin: 10px auto;
        }

        .qq {
          text-align: center;
          color: #fff;
          font-size: 16px;

          span {
            color: #fcb744;
            font-weight: bold;
          }
        }

        input {
          display: block;
          margin: 10px auto;
          width: 280px;
          height: 38px;
          border-radius: 6px;
          border: none;
          background: #fffad8;
          padding: 0 10px;
          box-sizing: border-box;
          text-align: center;
          font-size: 16px;
          color: #dbb389;
        }

        input::-webkit-input-placeholder {
          color: #dbb389;
        }

        input::-ms-input-placeholder {
          color: #dbb389;
        }

        input::-moz-input-placeholder {
          color: #dbb389;
        }

        .red_open {
          width: 60px;
          height: 60px;
          margin: 0 auto;
          background: #fcb744;
          border-radius: 50%;
          border: 4px solid #fca714;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            max-width: 70%;
            max-height: 70%;
            vertical-align: middle;
          }
        }

        .red_tit {
          text-align: center;
          height: 16px;
          margin: 10px auto;

          img {
            height: 100%;
          }
        }

        .red_activity {
          width: 100%;

          .red_item {
            width: 94%;
            margin: 0 auto 10px;
            background: #ad252c;
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;

            .red_item_top {
              width: 100%;
              height: 90px;
              display: flex;
              justify-content: space-between;

              .red_img {
                width: 90px;
                height: 90px;
                background: url(../../assets/images/BroadSide/activity_img.png) no-repeat center;
                background-size: contain;
                padding-top: 50px;
                box-sizing: border-box;
                text-align: center;
                color: #ff8975;
                font-size: 14px;

                span {
                  color: #f5ba7f;
                }
              }

              .red_data {
                width: 250px;
                color: #ff8975;
                font-size: 14px;

                b {
                  font-size: 16px;
                }

                p {
                  margin-bottom: 2px;
                }

                span {
                  font-size: 14px;
                }
              }
            }

            .red_btn {
              width: 100%;
              height: 40px;
              margin-top: 5px;
              background: #bd3840;
              border-radius: 20px;
              text-align: center;
              line-height: 40px;
              color: #ffc700;
              font-size: 16px;
              font-weight: bold;
            }
          }
        }

        .red_rule {
          text-align: center;
          margin-top: 10px;
          color: #feb5a3;
          font-size: 14px;
        }
      }
    }
  }

  .van-dialog {
    z-index: 10002 !important;
    width: 500px;
    background: none;

    .genus {
      width: 100%;
      height: 500px;
      background: url(../../assets/images/BroadSide/genus.png) no-repeat center;
      background-size: contain;
      padding-top: 400px;

      .amount {
        width: 160px;
        margin: 0 auto;
        height: 90px;
        font-size: 62px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        color: transparent;
        color: #ffcf72;
        text-shadow: 1px 1px 2px #ff0000;
      }

      .genus_btn {
        width: 140px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 20px;
        font-weight: bold;
        margin: 20px auto 0;
        color: #ed3e26;
        border-radius: 20px;
        background-image: linear-gradient(#ebfd01, #fbd31e);
      }
    }
  }
}
</style>
