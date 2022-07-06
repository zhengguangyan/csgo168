<template>
  <div id="Extension">
    <div class="Extension-box" style="color: white">
      <div class="Title">
        <p>战队详情</p>
      </div>

      <div class="Extension_copy">
        <div class="link">
          <p>邀请链接</p>
          <div class="link_box">
            <div class="Ipt">{{ Invite_connect }}</div>
            <span v-clipboard:copy="Invite_connect" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
          </div>
          <p class="MX">新战友通过您的邀请链接进入网站注册并充值成功，您便可与新站友共同分享平台福利。</p>
        </div>
        <div class="code">
          <p>邀请码</p>
          <div class="code_box">
            <input type="text" v-model="invite_code" />
            <span class="XG" v-clipboard:copy="invite_code" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
          </div>
          <p class="MX"><span @click="ChangeRuleShow">福利说明</span></p>
        </div>
      </div>

      <div class="Extension_banner">
        <img src="../../assets/images/public/banner.png" alt="" />
      </div>

      <!-- <div class="Title">
				<p>邀请福利</p>
			</div> -->
      <!-- <div class="key_box">
				<div class="key_tit">
					你累积通过活动获得了<span>{{welfare_key_total}}</span>把钥匙<br />
					<p v-for="(item,index) in welfare_promotion" :key="index">{{item.box.name}}钥匙<span>{{item.my_times}}</span>把{{index | indexGL}}</p>
				</div>
				<div class="key_list">
					<div class="key_item" v-for="(item,index) in welfare_promotion" :key="index">
						<p style="width: 290px;">{{item.description}}</p> 每邀请一个用户充值达到<img src="@/assets/images/PublicImg/JinBi.png" alt=""><span>{{item.promotion_level}}</span>
						<i style=" margin-left: 50px;">------------------------</i>
						<span style="display: block; width: 200px;">+1🔑{{item.box.name}}箱子钥匙</span><img src="http://m9skins.com/static/img/cold-iron-key.ffe07f05.png"alt="">
					</div>
					<div class="key_item">
						<p style="width: 260px;">每消费<img src="@/assets/images/PublicImg/JinBi.png" alt=""><span>1000</span>获得钥匙</p>
						<i>------------------------</i>
						<span style="display: block; width: 220px;">+1<img src="http://m9skins.com/static/img/cold-iron-key.ffe07f05.png"
							 alt="">狂牙大行动箱子钥匙</span>
					</div>

				</div>
			</div> -->
      <div class="Extension_data">
        <div class="data_tit">
          <p>战队职务<img style="width: 20px; cursor: pointer; margin-bottom: 4px; margin-left: 4px" src="@/assets/images/Vs/Wen.png" alt="" @click="ChangePromotionLevelShow" /></p>
          <p>有效下级</p>
          <p>下级首充返利</p>
          <p>战队战力值</p>
        </div>
        <div class="data_info">
          <p>{{ user.promotion_level_name }}</p>
          <p>{{ invitation }}人</p>
          <p>{{ rebate }}%</p>
          <p><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ gain }}</p>
        </div>
      </div>

      <div class="RankAndsub">
        <div class="Rank" v-show="PromotionLevelShow">
          <div class="Rank_item">
            <p>级别</p>
            <p>首充返利比例</p>
            <p style="padding-top: 0px">说明</p>
          </div>
          <div class="Rank_item" v-for="(item, index) in GradeList" :key="index">
            <p><img :src="'http://m9skins.com/images/partner/' + item.id + '.png'" alt="" />{{ item.name }}</p>
            <p>{{ item.rebate }}%</p>
            <p>{{ item.description }}</p>
          </div>
        </div>
        <div class="sub">
          <div>
            <div>
              <div class="sub_item">
                <div class="sub_user">战友名称</div>
                <div class="time">加入时间</div>
                <div class="amount">战友战力(充值)</div>
                <div class="income">获得C币</div>
              </div>
              <div class="sub_item" v-for="(item, index) in UserList" :key="index">
                <div class="sub_user">{{ item.name }}</div>
                <div class="time" style="font-size: 12px">{{ item.created_at }}</div>
                <div class="amount"><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.charge_bean }}</div>
                <div class="income"><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.bean }}</div>
              </div>
            </div>
          </div>
          <div class="PageNum">
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page" :total="total"> </el-pagination>
          </div>
        </div>
      </div>
      <!-- 警告 -->
      <van-overlay :show="WarnShow" style="color: white">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="ChangeWarnShow" />
            </div>
            <span>警告</span>
            <p>用户禁止恶意刷注册获取不当盈利，我们有权不通知封号</p>
          </div>
        </div>
      </van-overlay>

      <!-- 邀请规则遮罩层 -->
      <van-overlay :show="RuleShow">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="ChangeRuleShow" />
            </div>
            <span>邀请规则</span>
            <p>1.每个新用户通过邀请链接进入充值成功，可根据邀请人的等级，获得固定比例、数额的官方C包奖励。</p>
            <p>2.如果用户通过你的邀请链接进入网站充值并未给你带来佣金返利，代表此用户不是新用户。</p>
            <p>3.严禁通过不正当方式刷取本活动奖励，任何作弊行为一经发现，将直接扣除作弊用户获得的所有佣金返利；情节严重的，将直接采取封号等处理方式。</p>
            <p style="margin-top: 30px">声明：CSGO168将根据实际运营情况保留随时调整返佣比例的权利，以上活动最终解释权归CSGO168所有!</p>
          </div>
        </div>
      </van-overlay>
      <!-- 升级遮罩层 -->
      <van-overlay :show="ShengJiShow">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="ShengJiShow = false" />
            </div>
            <span>升级规则</span>
            <p>1、用户个人以及下级充值都会计算进入升级经验</p>
            <p style="margin-top: 30px">声明：CSGO168将根据实际运营情况保留随时调整返佣比例的权利，以上活动最终解释权归CSGO168所有!</p>
          </div>
        </div>
      </van-overlay>

      <!-- 教程遮罩层 -->
      <van-overlay :show="TutorialShow">
        <div class="wrapper">
          <div class="wrapper-box" style="height: 330px">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="ViewTutorial" />
            </div>
            <div class="Tutorial">
              <div class="title">邀请教程</div>
              <div class="Tutorial-box">
                <div class="Tutorial-item">
                  <div class="pic">
                    <img src="@/assets/images/PublicImg/FenXiang.svg" alt="" />
                  </div>
                  <p>分享邀请链接</p>
                  <div class="info">QQ 群分享邀请链接</div>
                </div>
                <div class="JianTou">
                  <img src="@/assets/images/PublicImg/HongJianTou.svg" alt="" />
                </div>
                <div class="Tutorial-item">
                  <div class="pic">
                    <img src="@/assets/images/PublicImg/ShouYao.svg" alt="" />
                  </div>
                  <p>受邀好友充值成功</p>
                  <div class="info">gameskins新注册的账号<br />成功充值</div>
                </div>
                <div class="JianTou">
                  <img src="@/assets/images/PublicImg/HongJianTou.svg" alt="" />
                </div>
                <div class="Tutorial-item">
                  <div class="pic">
                    <img src="@/assets/images/PublicImg/FanYong.svg" alt="" />
                  </div>
                  <p>获得返佣奖励</p>
                  <div class="info">受邀好友成功充值<br />佣金奖励立即到账</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {
  Be_inviter,
  Promote,
  Set_invite_code
} from '@/network/api.js'
import {
  mapState
} from 'vuex'
export default {
  name: 'Extension',
  data () {
    return {
      UserList: [],
      total: 0,
      per_page: 5,
      loadingShow: true,

      describe: '',
      invitation: '',
      rebate: '',
      gain: '',

      GradeList: [],
      Invite_connect: '',
      invite_code: '',
      ShengJiShow: false,

      RuleShow: false,
      PromotionLevelShow: false,
      TutorialShow: false,
      welfare_promotion: [],
      welfare_key_total: 0,
      WarnShow: true,
    }
  },

  created () {
    this.GetBe_inviter(1)
    this.GetPromote()
    if (this.getCookie('popped') == '') { //cookie 中没有 popped 则赋给他一个值（此时弹框显示）
      document.cookie = "popped = yes";
    } else {
      this.WarnShow = false; //若cookie 中已经有 popped 值，则弹框再不会显示
    }
    // console.log(this.user)
  },

  filters: {
    indexGL (v) {
      if (v == 4) {
        return '。'
      } else {
        return ','
      }
    }
  },

  methods: {
    //合作推广信息
    GetPromote () {
      Promote().then((res) => {
        // console.log(res.data.data.user.welfare_key_total)
        this.welfare_key_total = res.data.data.user.welfare_key_total
        this.welfare_promotion = res.data.data.welfare_promotion
        this.invite_code = res.data.data.user.invite_code
        this.Invite_connect = window.location.origin + '/?ref=' + res.data.data.user.invite_code

        this.GradeList = res.data.data.list
        this.describe = res.data.data.user.promotion.description
        this.invitation = res.data.data.user.be_invite_number
        this.rebate = res.data.data.user.promotion.rebate
        this.gain = res.data.data.user.gain


      })
    },


    Get_set_invite_code () {
      if (this.invite_code.length == 6) {
        Set_invite_code(this.invite_code).then((res) => {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.Invite_connect = window.location.origin + '/?ref=' + this.invite_code
        })
      } else {
        this.$message({
          message: '请输入长度为6位字符的邀请码',
          type: 'error'
        })
      }

    },


    // 下线列表分页
    handleCurrentChange (val) {
      this.GetBe_inviter(val)
    },

    //下线列表
    GetBe_inviter (val) {
      this.loadingShow = true
      Be_inviter(val).then((res) => {
        this.UserList = res.data.data[0].data
        this.total = res.data.data[0].total
        this.per_page = res.data.data[0].per_page
        // console.log(this.total)
        // console.log(this.UserList)
      })
    },

    //规则遮罩层
    ChangeRuleShow () {
      this.RuleShow = !this.RuleShow
    },

    //警告遮罩层
    ChangeWarnShow () {
      this.WarnShow = false;
    },

    getCookie (Name) { //cookie
      var search = Name + "=";
      var returnValue = "";
      if (document.cookie.length > 0) {
        var offset = document.cookie.indexOf(search);
        if (offset !== -1) {
          offset += search.length;
          var end = document.cookie.indexOf(";", offset);
          if (end == -1) {
            end = document.cookie.length;
          }
          returnValue = decodeURIComponent(document.cookie.substring(offset, end));
        }
      }
      return returnValue;
    },

    //教程遮罩层
    ViewTutorial () {
      this.TutorialShow = !this.TutorialShow
    },

    //职务显示隐藏
    ChangePromotionLevelShow () {
      this.PromotionLevelShow = !this.PromotionLevelShow
    },

    onCopy (e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError () {
      this.$message({
        message: '复制失败',
        type: 'error'
      })
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    UserList (val) {
      this.loadingShow = false
    }
  }
}
</script>

<style lang="scss">
.Extension-box {
  width: 100%;
  padding: 0.4rem 0.2rem;
  box-sizing: border-box;
  margin: 0 auto;

  .Extension_copy {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;

    .link {
      width: 500px;
      height: 100%;

      p {
        font-size: 14px;
        color: #fff;
        margin-bottom: 5px;
      }

      .link_box {
        height: 40px;
        display: flex;
        align-items: center;

        .Ipt {
          width: 420px;
          height: 40px;
          font-size: 20px;
          color: #fff;
          line-height: 40px;
          padding-left: 10px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid hsla(0, 0%, 100%, 0.2);
        }

        span {
          width: 100px;
          height: 40px;
          font-size: 14px;
          background: #ffd322;
          border-radius: 4px;
          color: #fff;
          text-align: center;
          line-height: 40px;
          margin-left: 10px;
          cursor: pointer;
          color: #000;
        }
      }

      .MX {
        font-size: 12px;
        color: #ccc;
        margin-top: 10px;

        span {
          color: #ffd322;
          cursor: pointer;
        }
      }
    }

    .code {
      width: 350px;
      height: 100%;
      margin-left: 20px;

      p {
        font-size: 14px;
        color: #fff;
        margin-bottom: 5px;
      }

      .code_box {
        height: 40px;
        display: flex;
        align-items: center;

        input {
          width: 420px;
          height: 40px;
          font-size: 22px;
          color: #fff;
          line-height: 40px;
          padding-left: 10px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid hsla(0, 0%, 100%, 0.2);
          background: none;
        }

        span {
          width: 100px;
          height: 40px;
          font-size: 14px;
          background: #ffd322;
          border-radius: 4px;
          color: #000;
          text-align: center;
          line-height: 40px;
          margin-left: 10px;
          cursor: pointer;
        }
      }

      .MX {
        font-size: 14px;
        color: #ccc;
        margin-top: 10px;

        span {
          color: #ffd322;
          cursor: pointer;
        }
      }
    }
  }

  .Extension_banner {
    width: 100%;
    margin: 40px 0;

    img {
      width: 100%;
    }
  }

  .key_box {
    width: 100%;

    .key_tit {
      text-align: center;
      line-height: 1.75em;
      font-size: 18px;
      color: #c6c4d8;
      padding: 0 30px;
      box-sizing: border-box;
      p {
        display: inline;
      }
      span {
        color: rgb(255, 211, 34);
      }
    }

    .key_list {
      width: 100%;
      margin-top: 20px;

      .key_item {
        width: 100%;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;

        p {
          font-size: 16px;
          color: #fff;

          span {
            color: rgb(255, 211, 34);
            font-weight: bold;
          }

          img {
            width: 18px;
            vertical-align: middle;
            margin-bottom: 2px;
            margin-left: 2px;
            margin-right: 2px;
          }
        }

        i {
          font-style: normal;
          margin-right: 50px;
        }

        span {
          color: rgb(255, 211, 34);
          font-size: 18px;

          img {
            width: 26px;
            vertical-align: middle;
            margin-bottom: 2px;
            margin-left: 2px;
            margin-right: 2px;
          }
        }
      }
    }
  }

  .Extension_data {
    width: 100%;
    margin-top: 20px;

    .data_tit {
      width: 100%;
      margin: 0 auto;
      height: 60px;
      line-height: 60px;
      display: flex;
      font-size: 14px;
    }

    .data_info {
      width: 100%;
      margin: 0 auto;
      height: 112px;
      background: rgba($color: #fff, $alpha: 0.05);
      display: flex;
      line-height: 112px;

      p {
        border-right: 1px solid rgba($color: #000000, $alpha: 0.3);
        font-size: 15px;
      }
    }

    p {
      flex: 1;
      padding-left: 20px;
      box-sizing: border-box;

      img {
        width: 26px;
        vertical-align: middle;
        margin-bottom: 6px;
      }
    }
  }

  .RankAndsub {
    width: 100%;
    margin-top: 20px;

    .Rank {
      width: 100%;
      background: rgba($color: #fff, $alpha: 0.03);

      .Rank_item {
        width: 100%;
        height: 80px;
        display: flex;
        border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);

        p {
          flex: 1;
          text-align: center;
          line-height: 80px;
          font-size: 16px;
          color: #fff;

          img {
            width: 15px;
            vertical-align: middle;
            margin-bottom: 2px;
            margin: 0 4px;
          }

          &:last-child {
            border: none;
            flex: 6;
            font-size: 14px;
            line-height: 24px;
            padding-top: 16px;
          }
        }

        &:first-child {
          height: 60px;
          background: rgba(0, 0, 0, 0.4);

          p {
            line-height: 60px;
            font-size: 14px;
          }
        }

        &:last-child {
          border: none;
        }
      }
    }

    .sub {
      width: 100%;
      background: rgba($color: #fff, $alpha: 0.03);

      img {
        width: 20px;
        vertical-align: middle;
        margin-bottom: 2px;
      }

      .sub_item {
        width: 100%;
        height: 80px;
        display: flex;
        border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);
        font-size: 16px;
        line-height: 80px;

        .time {
          width: 200px;
          height: 100%;
          padding-left: 20px;
          box-sizing: border-box;
        }

        .amount {
          width: 140px;
          height: 100%;
          padding-left: 20px;
          box-sizing: border-box;
        }

        .sub_user {
          width: 190px;
          height: 100%;
          padding-left: 20px;
          box-sizing: border-box;
        }

        .income {
          width: 130px;
          height: 100%;
          padding-left: 20px;
          box-sizing: border-box;
        }

        &:first-child {
          height: 60px;
          background: rgba(0, 0, 0, 0.4);
          line-height: 60px;
          font-size: 14px;
        }

        &:last-child {
          border: none;
        }
      }

      .PageNum {
        width: 100%;
        text-align: center;
        margin: 20px 0;

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
@media screen and (min-width: 1920px) {
  .Extension-box {
    width: 100%;
    padding: 0.4rem 0.2rem;
    box-sizing: border-box;
    margin: 0 auto;

    .Extension_copy {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;

      .link {
        width: 500px;
        height: 100%;

        p {
          font-size: 20px;
          color: #fff;
          margin-bottom: 5px;
        }

        .link_box {
          height: 40px;
          display: flex;
          align-items: center;

          .Ipt {
            width: 420px;
            height: 40px;
            font-size: 20px;
            color: #fff;
            line-height: 40px;
            padding-left: 10px;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid hsla(0, 0%, 100%, 0.2);
          }

          span {
            width: 100px;
            height: 40px;
            font-size: 18px;
            background: #ffd322;
            border-radius: 4px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            margin-left: 10px;
            cursor: pointer;
            color: #000;
          }
        }

        .MX {
          font-size: 16px;
          color: #ccc;
          margin-top: 10px;

          span {
            color: #ffd322;
            cursor: pointer;
          }
        }
      }

      .code {
        width: 350px;
        height: 100%;
        margin-left: 20px;

        p {
          font-size: 20px;
          color: #fff;
          margin-bottom: 5px;
        }

        .code_box {
          height: 40px;
          display: flex;
          align-items: center;

          input {
            width: 420px;
            height: 40px;
            font-size: 22px;
            color: #fff;
            line-height: 40px;
            padding-left: 10px;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid hsla(0, 0%, 100%, 0.2);
            background: none;
          }

          span {
            width: 100px;
            height: 40px;
            font-size: 20px;
            background: #ffd322;
            border-radius: 4px;
            color: #000;
            text-align: center;
            line-height: 40px;
            margin-left: 10px;
            cursor: pointer;
          }
        }

        .MX {
          font-size: 14px;
          color: #ccc;
          margin-top: 10px;

          span {
            color: #ffd322;
            cursor: pointer;
            font-size: 16px;
          }
        }
      }
    }

    .Extension_banner {
      width: 100%;
      margin: 40px 0;

      img {
        width: 100%;
      }
    }

    .key_box {
      width: 100%;

      .key_tit {
        text-align: center;
        line-height: 1.75em;
        font-size: 18px;
        color: #c6c4d8;
        padding: 0 30px;
        box-sizing: border-box;
        p {
          display: inline;
        }
        span {
          color: rgb(255, 211, 34);
        }
      }

      .key_list {
        width: 100%;
        margin-top: 20px;

        .key_item {
          width: 100%;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;

          p {
            font-size: 16px;
            color: #fff;

            span {
              color: rgb(255, 211, 34);
              font-weight: bold;
            }

            img {
              width: 18px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin-left: 2px;
              margin-right: 2px;
            }
          }

          i {
            font-style: normal;
            margin-right: 50px;
          }

          span {
            color: rgb(255, 211, 34);
            font-size: 18px;

            img {
              width: 26px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin-left: 2px;
              margin-right: 2px;
            }
          }
        }
      }
    }

    .Extension_data {
      width: 100%;
      margin-top: 20px;

      .data_tit {
        width: 100%;
        margin: 0 auto;
        height: 60px;
        line-height: 60px;
        display: flex;
        font-size: 18px;
      }

      .data_info {
        width: 100%;
        margin: 0 auto;
        height: 112px;
        background: rgba($color: #fff, $alpha: 0.05);
        display: flex;
        line-height: 112px;

        p {
          border-right: 1px solid rgba($color: #000000, $alpha: 0.3);
          font-size: 16px;
        }
      }

      p {
        flex: 1;
        padding-left: 20px;
        box-sizing: border-box;

        img {
          width: 30px;
          vertical-align: middle;
          margin-bottom: 6px;
        }
      }
    }

    .RankAndsub {
      width: 100%;
      margin-top: 20px;

      .Rank {
        width: 100%;
        background: rgba($color: #fff, $alpha: 0.03);

        .Rank_item {
          width: 100%;
          height: 80px;
          display: flex;
          border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);

          p {
            flex: 1;
            text-align: center;
            line-height: 80px;
            font-size: 16px;
            color: #fff;

            img {
              width: 15px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin: 0 4px;
            }

            &:last-child {
              border: none;
              flex: 6;
              font-size: 14px;
              line-height: 24px;
              padding-top: 16px;
            }
          }

          &:first-child {
            height: 60px;
            background: rgba(0, 0, 0, 0.4);

            p {
              line-height: 60px;
              font-size: 14px;
            }
          }

          &:last-child {
            border: none;
          }
        }
      }

      .sub {
        width: 100%;
        background: rgba($color: #fff, $alpha: 0.03);

        img {
          width: 20px;
          vertical-align: middle;
          margin-bottom: 2px;
        }

        .sub_item {
          width: 100%;
          height: 80px;
          display: flex;
          border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);
          font-size: 20px;
          line-height: 80px;

          .time {
            width: 200px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          .amount {
            width: 140px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          .sub_user {
            width: 190px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          .income {
            width: 130px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          &:first-child {
            height: 60px;
            background: rgba(0, 0, 0, 0.4);
            line-height: 60px;
            font-size: 14px;
          }

          &:last-child {
            border: none;
          }
        }

        .PageNum {
          width: 100%;
          text-align: center;
          margin: 20px 0;

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
@media screen and (min-width: 2560px) {
  .Extension-box {
    width: 100%;
    padding: 0.4rem 0.2rem;
    box-sizing: border-box;
    margin: 0 auto;

    .Extension_copy {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;

      .link {
        width: 500px;
        height: 100%;

        p {
          font-size: 20px;
          color: #fff;
          margin-bottom: 5px;
        }

        .link_box {
          height: 40px;
          display: flex;
          align-items: center;

          .Ipt {
            width: 420px;
            height: 40px;
            font-size: 20px;
            color: #fff;
            line-height: 40px;
            padding-left: 10px;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid hsla(0, 0%, 100%, 0.2);
          }

          span {
            width: 100px;
            height: 40px;
            font-size: 18px;
            background: #ffd322;
            border-radius: 4px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            margin-left: 10px;
            cursor: pointer;
            color: #000;
          }
        }

        .MX {
          font-size: 16px;
          color: #ccc;
          margin-top: 10px;

          span {
            color: #ffd322;
            cursor: pointer;
          }
        }
      }

      .code {
        width: 350px;
        height: 100%;
        margin-left: 20px;

        p {
          font-size: 20px;
          color: #fff;
          margin-bottom: 5px;
        }

        .code_box {
          height: 40px;
          display: flex;
          align-items: center;

          input {
            width: 420px;
            height: 40px;
            font-size: 22px;
            color: #fff;
            line-height: 40px;
            padding-left: 10px;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid hsla(0, 0%, 100%, 0.2);
            background: none;
          }

          span {
            width: 100px;
            height: 40px;
            font-size: 20px;
            background: #ffd322;
            border-radius: 4px;
            color: #000;
            text-align: center;
            line-height: 40px;
            margin-left: 10px;
            cursor: pointer;
          }
        }

        .MX {
          font-size: 14px;
          color: #ccc;
          margin-top: 10px;

          span {
            color: #ffd322;
            cursor: pointer;
            font-size: 16px;
          }
        }
      }
    }

    .Extension_banner {
      width: 100%;
      margin: 40px 0;

      img {
        width: 100%;
      }
    }

    .key_box {
      width: 100%;

      .key_tit {
        text-align: center;
        line-height: 1.75em;
        font-size: 18px;
        color: #c6c4d8;
        padding: 0 30px;
        box-sizing: border-box;
        p {
          display: inline;
        }
        span {
          color: rgb(255, 211, 34);
        }
      }

      .key_list {
        width: 100%;
        margin-top: 20px;

        .key_item {
          width: 100%;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;

          p {
            font-size: 16px;
            color: #fff;

            span {
              color: rgb(255, 211, 34);
              font-weight: bold;
            }

            img {
              width: 18px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin-left: 2px;
              margin-right: 2px;
            }
          }

          i {
            font-style: normal;
            margin-right: 50px;
          }

          span {
            color: rgb(255, 211, 34);
            font-size: 18px;

            img {
              width: 26px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin-left: 2px;
              margin-right: 2px;
            }
          }
        }
      }
    }

    .Extension_data {
      width: 100%;
      margin-top: 20px;

      .data_tit {
        width: 100%;
        margin: 0 auto;
        height: 60px;
        line-height: 60px;
        display: flex;
        font-size: 20px;
      }

      .data_info {
        width: 100%;
        margin: 0 auto;
        height: 112px;
        background: rgba($color: #fff, $alpha: 0.05);
        display: flex;
        line-height: 112px;

        p {
          border-right: 1px solid rgba($color: #000000, $alpha: 0.3);
          font-size: 22px;
        }
      }

      p {
        flex: 1;
        padding-left: 20px;
        box-sizing: border-box;

        img {
          width: 30px;
          vertical-align: middle;
          margin-bottom: 6px;
        }
      }
    }

    .RankAndsub {
      width: 100%;
      margin-top: 20px;

      .Rank {
        width: 100%;
        background: rgba($color: #fff, $alpha: 0.03);

        .Rank_item {
          width: 100%;
          height: 80px;
          display: flex;
          border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);

          p {
            flex: 1;
            text-align: center;
            line-height: 80px;
            font-size: 16px;
            color: #fff;

            img {
              width: 15px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin: 0 4px;
            }

            &:last-child {
              border: none;
              flex: 6;
              font-size: 14px;
              line-height: 24px;
              padding-top: 16px;
            }
          }

          &:first-child {
            height: 60px;
            background: rgba(0, 0, 0, 0.4);

            p {
              line-height: 60px;
              font-size: 14px;
            }
          }

          &:last-child {
            border: none;
          }
        }
      }

      .sub {
        width: 100%;
        background: rgba($color: #fff, $alpha: 0.03);

        img {
          width: 20px;
          vertical-align: middle;
          margin-bottom: 2px;
        }

        .sub_item {
          width: 100%;
          height: 80px;
          display: flex;
          border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);
          font-size: 20px;
          line-height: 80px;

          .time {
            width: 200px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          .amount {
            width: 140px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          .sub_user {
            width: 190px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          .income {
            width: 130px;
            height: 100%;
            font-size: 20px;
            padding-left: 20px;
            box-sizing: border-box;
          }

          &:first-child {
            height: 60px;
            background: rgba(0, 0, 0, 0.4);
            line-height: 60px;
            font-size: 14px;
          }

          &:last-child {
            border: none;
          }
        }

        .PageNum {
          width: 100%;
          text-align: center;
          margin: 20px 0;

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
