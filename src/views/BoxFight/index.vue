<template>
  <div id="BoxFight">
    <div id="BoxFight-box">
      <div class="Navigation">
        <div class="Navigation-left">
          <p @click="BattleSwitch(true)" :class="{ active: battle == true }">当前对战</p>
          <p @click="ChangeRuleShow">对战规则</p>
          <p @click="Jump('/GameHistory')">查看记录</p>
          <p @click="Getdrawer" class="created">创建对战</p>
          <!-- Jump('/CreateAConfrontation') -->
          <p @click="Jump('/BattleList')">对战榜</p>
        </div>
      </div>

      <div class="VS_out">
        <div class="BoxList">
          <transition-group name="slide-fade">
            <BoxItem v-for="(item, index) of Ar_List" :key="item.id" :VsStart="VsStart" :item="item"></BoxItem>
          </transition-group>
          <div class="PageNum">
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page" :total="PageNum"> </el-pagination>
          </div>
        </div>
        <div class="VSbox_list" style="color: white">
          <div class="vslist_tit">
            <span>对战宝箱奖池库</span>
          </div>
          <div class="vsbox_item" v-for="(item, index) in hotboxlist" :key="index" @click="OpenXZshow(item)">
            <div class="vsbox_pic">
              <img :src="item.cover" alt="" />
            </div>
            <div class="vsbox_data">
              <span>{{ item.name }}</span>
              <p><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.game_bean }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 箱子遮罩层 -->
      <van-overlay :show="XZshow">
        <div class="wrapper">
          <div class="block">
            <div class="block-T">
              <p>{{ TreasureName }}</p>
              <span @click="CloseXZshow">×</span>
            </div>
            <div class="Goods_list">
              <div class="Goods_item" :class="'lv_' + item.lv" v-for="(item, index) in Treasure_box_prize" :key="index">
                <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ item.bean }}</div>
                <div class="dura_alias">{{ item.dura_alias }}</div>
                <div class="Goods_pic" :style="{ 'background-image': 'url(' + item.lv_bg_image + ')' }">
                  <img :src="item.cover" alt="" />
                </div>
                <p>{{ item.name }}</p>
              </div>
            </div>
            <div class="boxbtn">
              <p @click="CloseXZshow">确定</p>
            </div>
          </div>
        </div>
      </van-overlay>

      <!-- 规则遮罩层 -->
      <van-overlay :show="RuleShow">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="ChangeRuleShow" />
            </div>
            <span>关于对战</span>
            <p>1 创建大乱斗时，可以选择乱斗人数（1V1，3人对战和4人对战），一场乱斗最多可以选择 6 个盲盒。房间一但创建，不可取消。</p>
            <p>2 乱斗入场费用即本场乱斗开启的盲盒价格总和，支付费用后，即视为加入房间，中途退出房间，并不会退还盲盒或入场费。</p>
            <p>3 当一场乱斗有多名赢家均分奖励时，非本人所得饰品将被兑换为硬币发放到赢家的账户余额。</p>
            <p>4 每场游戏的结果受到（创建时间，玩家ID，玩家位置和开始时间等）多方面因素影响，为完全随机产生的结果。任意盲盒奖励均可以验证公平性。</p>
            <p style="margin-top: 30px">声明：CSGO168将根据实际运营情况保留随时调整返佣比例的权利，以上活动最终解释权归CSGO168所有!</p>
          </div>
        </div>
      </van-overlay>

      <!-- 创建对战抽屉 -->
      <el-drawer :visible.sync="drawer" :with-header="false" :key="Key_Vs">
        <div class="Title">
          <p>创建对战</p>
        </div>
        <div class="Num_select">
          <p @click="ControlPeople('4')" :class="{ active: PeopleNum == '4' }">四人对战</p>
          <p @click="ControlPeople('3')" :class="{ active: PeopleNum == '3' }">三人对战</p>
          <p @click="ControlPeople('2')" :class="{ active: PeopleNum == '2' }">双人对战</p>
        </div>
        <div class="case_list_box">
          <div class="small_tit">选择盲盒</div>
          <div class="case_list">
            <div class="case_list_item" v-for="(item, index) in hotboxlist" :key="index" @click="choice(item, index)" ref="Active">
              <div class="ceng">
                <p>+</p>
              </div>
              <div class="pic">
                <img :src="item.cover" alt="" />
              </div>
              <p>{{ item.name }}</p>
              <span><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.game_bean }}</span>
            </div>
          </div>
        </div>
        <div class="Selected_list_box">
          <div class="small_tit">
            已选盲盒
            <p><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ TotalPrice }}</p>
          </div>
          <div class="out_box">
            <div class="below">
              <div class="below_item" v-for="(i, index) of 6"></div>
            </div>
            <div class="Select_list">
              <div class="Select_list_item" v-for="(item, index) in choiceList" :key="index" @click="deleteItem(item, index)">
                <div class="ceng">
                  <p>-</p>
                </div>
                <div class="pic">
                  <img :src="item.cover" alt="" />
                </div>
                <p>{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="batch">
          <div class="small_tit">批量创建</div>
          <div class="radio_box">
            <el-radio v-model="radio" label="1">1个</el-radio>
            <el-radio v-model="radio" label="2">2个</el-radio>
            <el-radio v-model="radio" label="3">3个</el-radio>
            <el-radio v-model="radio" label="5">5个</el-radio>
          </div>
        </div>
        <div class="CJ_btn">
          <p @click="Establish">创建对战</p>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import BoxItem from './components/BoxItem.vue'
import md5 from 'blueimp-md5'
import {
  mapActions
} from 'vuex'
import {
  Arena_List,
  Arena_Box_List,
  Arena_Create
} from '@/network/api.js'
export default {
  name: "BoxFight",
  data () {
    return {
      battle: true, //当前游戏/我的游戏
      RuleShow: false, //规则遮罩层
      //推送相关
      clearTimeSet: null,

      Ar_List: [], //对战列表

      VsStart: {},
      per_page: 0,
      PageNum: 0,

      XZshow: false,
      Treasure_box_prize: [], //宝箱奖品数据
      TreasureName: '',


      //创建对战相关
      drawer: false,
      hotboxlist: [],
      radio: '1',
      PeopleNum: '2',
      choiceList: [],
      TotalPrice: 0,
      Key_Vs: 1,
    }
  },

  activated () {
    // this.GetArena_List()
    this.$socket.Add('CreateGroup', this.Accept)
    this.$socket.Add('startGroup', this.AddStartGroup)
    // this.$socket.Add('endGroup',this.AddEndGroup)
  },

  created () {
    this.GetMangHe_List()
    this.GetArena_List()
  },


  methods: {
    //打开箱子弹框
    OpenXZshow (item) {
      this.XZshow = true
      this.TreasureName = item.name
      this.Treasure_box_prize = item.box_awards
      // console.log(item)
    },
    //关闭箱子弹框
    CloseXZshow () {
      this.XZshow = false
    },
    //获取对战列表
    GetArena_List (page) {
      Arena_List(page).then((res) => {
        // console.log(res.data.data)
        this.per_page = res.data.data.per_page
        this.PageNum = res.data.data.total
        this.Ar_List = res.data.data.data
        // console.log(this.Ar_List)
      })
    },

    //接收房间信息(websocket)
    Accept (data) {
      // console.log('创建')
      // console.log(data)
      this.Ar_List.unshift(data)
    },

    //对战开始
    AddStartGroup (data) {
      // console.log(data)
      // this.VsStart = data
      this.GetKaiShiVsData(data)
    },

    // //对战结束
    // AddEndGroup(data){
    // 	console.log(data)
    // 	this.GetJieShuVsData(data)
    // },			
    //路由跳转
    Jump (str) {
      this.$router.push(str)
    },

    //对战切换
    BattleSwitch (v) {
      this.battle = v
    },
    //对战分页
    handleCurrentChange (val) {
      // console.log(val)
      this.GetArena_List(val)
    },
    //规则遮罩层
    ChangeRuleShow () {
      this.RuleShow = !this.RuleShow
    },



    //创建房间相关
    //打开抽屉
    Getdrawer () {
      this.drawer = true
      this.PeopleNum = '2'
      this.choiceList = []
      setTimeout(() => {
        for (let i = 0; i < 6; i++) {
          this.$refs.Active[i].style = 'border: none;'
        }
      }, 100)

    },

    //盲盒列表
    GetMangHe_List () {
      Arena_Box_List().then(res => {
        this.hotboxlist = res.data.data
      })
    },

    //人数选择
    ControlPeople (str) {
      this.PeopleNum = str
    },


    //箱子选择
    choice (item, index) {
      if (this.choiceList.length < 6) {
        let key = "Select";
        let value = true
        item[key] = value

        this.$refs.Active[index].style = 'border: 2px solid #ffd926;'
        this.choiceList.push(item)
      } else {
        this.$message({
          message: "最多选择6个盲盒!",
          type: 'error'
        })
      }

    },
    //删除选中箱子
    deleteItem (item, index) {
      let A_Arr = this.choiceList.filter((i) => {
        return i.id == item.id
      })

      if (A_Arr.length < 2) {
        let K = this.hotboxlist.findIndex((value) => value.id == A_Arr[0].id)
        this.$refs.Active[K].style = 'border: 1px solid transparent;'
      }

      this.choiceList.splice(index, 1)
    },

    //创建对战
    Establish () {
      for (let i = 0; i < this.radio; i++) {
        this.$socket.Event(id => {
          let box = []
          for (let i = 0; i < this.choiceList.length; i++) {
            box.push(this.choiceList[i].id)
          }
          Arena_Create(this.PeopleNum, box).then((res) => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })

            this.Key_Vs += 1
            this.drawer = false
          })
        })
      }
    },

    ...mapActions([
      // 'GetJieShuVsData',
      'GetKaiShiVsData'
    ])

  },


  watch: {
    choiceList (Arr) {
      let ArrAy = []
      for (let i = 0; i < Arr.length; i++) {
        ArrAy.push(Number(Arr[i].game_bean))
      }
      let Price = 0
      for (let k = 0; k < ArrAy.length; k++) {
        Price = Price + ArrAy[k]
      }

      this.TotalPrice = Price.toFixed(2)
    }
  },

  components: {
    BoxItem
  }
}
</script>

<style lang="scss">
#BoxFight-box {
  width: 14rem;
  padding-top: 0.4rem;

  .Goods_list {
    width: 100%;
    display: flex;
    padding: 5px 0;
    flex-wrap: wrap;
    border-radius: 0 4px 4px 4px;
    margin-top: 20px;
    overflow: hidden;
    overflow-y: auto;
    height: 6rem;
    margin-bottom: 0.2rem;
    &::-webkit-scrollbar {
      width: 2px;
      background: rgba($color: #000, $alpha: 0.2);
    }
    &::-webkit-scrollbar-thumb {
      width: 2px;
      background: #000;
    }
    .Goods_item {
      width: 24%;
      text-align: center;
      color: #fff;
      margin-bottom: 10px;
      margin-right: 1%;
      padding: 20px 0 10px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      background-color: #716778;
      &.lv_1 {
        background-color: rgba(145, 95, 77, 0.8);
      }
      &.lv_2 {
        background-color: rgba(153, 53, 138, 0.8);
      }
      &.lv_3 {
        background-color: rgba(133, 81, 171, 0.8);
      }
      &.lv_4 {
        background-color: rgba(73, 72, 184, 0.8);
      }

      .odds_percent {
        position: absolute;
        left: 5px;
        top: 10px;
        font-size: 13px;
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
        font-size: 10px;
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

  .PageNum {
    width: 100%;
    margin-top: 0.4rem;

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

  .pic {
    margin-top: 0.2rem;
    width: 100%;
    margin: 0 auto;

    img {
      width: 100%;
    }
  }

  //切换动画
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
		.slide-fade-leave-to

		/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .Navigation {
    width: 100%;
    height: 0.4rem;
    margin-top: 0.4rem;
    display: flex;
    justify-content: space-between;

    p {
      height: 0.4rem;
      text-align: center;
      line-height: 0.4rem;
      font-size: 0.14rem;
      cursor: pointer;
    }

    .Navigation-left {
      display: flex;

      p {
        height: 30px;
        padding: 0 26px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #0072ff;
        margin: 0 5px;
        border: 1px #0072ff solid;
        transition: 0.3s;

        &.active {
          color: #fff;
          border-color: #0072ff;
          background: #0072ff;
        }
        &.created {
          border-style: dashed;
        }
      }
    }

    .Navigation-right {
      display: flex;

      p {
        margin-left: 0.05rem;
        background: #bbb;

        &:last-child {
          background: #ffd322;
          color: #000;
        }
      }
    }
  }

  .BoxList-info {
    width: 100%;
    height: 0.5rem;
    margin-top: 0.4rem;
    display: flex;
    align-items: center;
    font-size: 0.14rem;
    color: #777777;

    .XZ {
      width: 8.9rem;
      padding-left: 0.15rem;
      box-sizing: border-box;
    }

    p {
      width: 1.7rem;
      text-align: center;
    }
  }

  .VS_out {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .VSbox_list {
      width: 20%;
      margin-top: 0.4rem;
      background: rgba($color: #000000, $alpha: 0.2);
      background-size: cover;
      border-radius: 4px;
      .vslist_tit {
        width: 100%;
        text-align: center;
        padding: 0.3rem 0;
        background: #0072ff;
        span {
          font-size: 0.22rem;
        }
      }
      .vsbox_item {
        width: 100%;
        padding: 0 0.1rem;
        border-top: 1px dashed rgba($color: #fff, $alpha: 0.1);
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        &:hover {
          background: rgba($color: #fff, $alpha: 0.1);
        }
        .vsbox_pic {
          width: 100px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            max-width: 100%;
            max-height: 100%;
            vertical-align: middle;
          }
        }
        .vsbox_data {
          width: 100px;
          line-height: 24px;
          p {
            font-size: 16px;
            font-weight: 500;
            color: #ffd728;
            img {
              width: 24px;
              height: 24px;
              vertical-align: middle;
              margin-bottom: 2px;
              margin-right: 2px;
            }
          }
          span {
            font-size: 14px;
          }
        }
      }
    }
    .BoxList {
      width: 78%;

      margin-top: 0.4rem;

      span {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .block {
      width: 8rem;
      background-color: #6e2c9a !important;
      padding: 0.2rem;
      box-sizing: border-box;

      .block-T {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
          font-size: 0.24rem;
          color: #fff;
        }

        span {
          font-size: 0.28rem;
          color: rgba($color: #ffffff, $alpha: 1);
          cursor: pointer;
        }
      }

      .Box-List {
        width: 100%;
        height: 5rem;
        margin: 0.2rem 0 0.4rem;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;

        .Box-List-item {
          width: 1.8rem;
          height: 2.3rem;
          position: relative;
          background: rgba($color: #000, $alpha: 0.5);
          border-radius: 0.04rem;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
          cursor: pointer;
          overflow: hidden;

          &:nth-child(4n) {
            margin-right: 0;
          }

          &:hover {
            .ceng {
              opacity: 1;
            }
          }

          .pic {
            width: 1.8rem;
            height: 1.5rem;
            margin: 0.1rem auto 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            .zhao {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                max-width: 60%;
                vertical-align: middle;
              }
            }

            img {
              max-width: 100%;
              max-height: 100%;
              position: relative;
              z-index: 10;
            }
          }

          .name {
            width: 100%;
            text-align: center;
            color: #9e9e9e;
            font-size: 0.14rem;
          }

          .money {
            width: 100%;
            margin-top: 0.1rem;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 0.2rem;
              height: 0.2rem;
              vertical-align: middle;
            }

            span {
              font-size: 0.14rem;
              color: #75dc9e;
            }
          }
        }
      }

      .Box-List::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
        scrollbar-arrow-color: red;
      }

      .Box-List::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.6);
        scrollbar-arrow-color: red;
      }

      .Box-List::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }

      .boxbtn {
        width: 100%;
        height: 0.35rem;
        display: flex;
        justify-content: flex-end;

        p {
          width: 0.7rem;
          height: 0.35rem;
          color: #fff;
          border-color: #fc63cf;
          background: rgba($color: #fc63cf, $alpha: 0.5);
          font-size: 0.14rem;
          text-align: center;
          line-height: 0.35rem;
          cursor: pointer;
        }
      }
    }

    .wrapper-box {
      .wrapper-box-top {
        width: 100%;
        height: 0.03rem;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      }
      color: white;
      width: 7.5rem;
      height: 3.8rem;
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

  .el-drawer {
    width: 50% !important;
  }
  .el-drawer:focus {
    outline: none;
  }
  .el-drawer__body {
    background: url(../../assets/images/public/back_pub1.jpg) no-repeat center;
    background-size: cover;
    padding: 0.05rem 0.2rem;
    box-sizing: border-box;
    color: white;
    .Num_select {
      width: 100%;
      height: 0.5rem;
      border-radius: 0.04rem;
      overflow: hidden;
      align-items: center;

      p {
        width: 1.2rem;
        height: 0.4rem;
        float: right;
        color: #fff;
        border: 1px #ffffff solid;
        text-align: center;
        line-height: 0.4rem;
        margin: 0 0.05rem;
        font-size: 0.16rem;
        cursor: pointer;

        &.active {
          color: #fff;
          border-color: #ffffff;
          background: #0072ff;
        }
      }
    }

    .case_list_box {
      width: 100%;
      background-color: rgba(73, 89, 129, 0.8) !important;
      padding: 0.1rem;
      box-sizing: border-box;
      border-radius: 0.04rem;
      margin-top: 0.1rem;

      .small_tit {
        font-size: 0.22rem;
      }

      .case_list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        height: 2.9rem;
        overflow: auto;
        margin-top: 0.1rem;
        .case_list_item {
          width: 16%;
          background-color: rgba($color: #000, $alpha: 0.2) !important;
          overflow: hidden;
          cursor: pointer;
          margin-bottom: 0.1rem;
          box-sizing: border-box;
          cursor: pointer;
          position: relative;

          &:hover {
            .ceng {
              opacity: 1;
            }
          }

          .ceng {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba($color: #000000, $alpha: 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: 0.3s;
            p {
              width: 0.6rem;
              height: 0.6rem;
              border-radius: 50%;
              background: rgba($color: #ffffff, $alpha: 0.2);
              color: #fff;
              text-align: center;
              line-height: 0.6rem;
              font-size: 0.18rem;
            }
          }

          .pic {
            width: 60%;
            margin: 0.05rem auto 0;

            img {
              max-width: 100%;
            }
          }

          p {
            font-size: 0.14rem;
            color: #fff;
            text-align: center;
          }

          span {
            display: block;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0.05rem 0 0.1rem;

            img {
              width: 0.22rem;
              height: 0.22rem;
            }

            font-size: 0.18rem;
            color: #ffd728;
          }
        }
      }

      .case_list::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
        scrollbar-arrow-color: red;
      }

      .case_list::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.6);
        scrollbar-arrow-color: red;
      }

      .case_list::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
    }

    .Selected_list_box {
      width: 100%;
      background-color: rgba(73, 89, 129, 0.8) !important;
      padding: 0.1rem;
      box-sizing: border-box;
      margin-top: 0.1rem;

      .small_tit {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.22rem;
        p {
          display: inline-block;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 0.1rem;
          color: #ffd728;
          img {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.03rem;
          }
        }
      }
      .out_box {
        position: relative;
        .below {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .below_item {
            width: 16%;
            height: 1.3rem;
            background: rgba($color: #000000, $alpha: 0.1);
            overflow: hidden;
            margin-top: 0.1rem;
            margin-right: 0.666666%;
            box-sizing: border-box;
            float: left;
          }
        }
        .Select_list {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          &::after {
            display: block;
            content: '';
            width: 16%;
          }
          .Select_list_item {
            width: 16%;
            height: 1.3rem;
            overflow: hidden;
            margin-top: 0.1rem;
            margin-right: 0.666666666666%;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;
            &:hover {
              .ceng {
                opacity: 1;
              }
            }

            .ceng {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: rgba($color: #000000, $alpha: 0.1);
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: 0.3s;
              p {
                width: 0.6rem;
                height: 0.6rem;
                border-radius: 50%;
                background: rgba($color: #ffffff, $alpha: 0.2);
                color: #fff;
                text-align: center;
                line-height: 0.6rem;
                font-size: 0.18rem;
              }
            }
            .pic {
              width: 60%;
              img {
                max-width: 100%;
              }
            }
            p {
              font-size: 0.14rem;
              text-align: center;
            }
          }
        }
      }
    }
    .batch {
      width: 100%;
      background-color: rgba(73, 89, 129, 0.8) !important;
      padding: 0.1rem;
      box-sizing: border-box;
      margin-top: 0.1rem;
      display: flex;
      align-items: center;
      .small_tit {
        font-size: 0.22rem;
        margin-right: 0.3rem;
      }
      .radio_box {
        flex: 1;
        .el-radio {
          margin-right: 20px;
          color: #fff;
        }
        .el-radio__label {
          padding-left: 3px;
          color: #ffffff;
        }
        .el-radio__input {
        }
      }
    }
    .CJ_btn {
      width: 100%;
      box-sizing: border-box;
      margin-top: 0.1rem;
      display: flex;
      justify-content: flex-end;
      p {
        width: 1.5rem;
        height: 0.5rem;
        color: #fff;
        border-color: #ffffff;
        background: #0072ff;
        font-size: 0.18rem;
        text-align: center;
        line-height: 0.5rem;
        cursor: pointer;
      }
    }
  }
}
@media screen and(min-width:1920px) {
  #BoxFight-box {
    width: 14rem;
    padding-top: 0.4rem;

    .Goods_list {
      width: 100%;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      margin-top: 20px;
      overflow: hidden;
      overflow-y: auto;
      height: 6rem;
      margin-bottom: 0.2rem;
      &::-webkit-scrollbar {
        width: 2px;
        background: rgba($color: #000, $alpha: 0.2);
      }
      &::-webkit-scrollbar-thumb {
        width: 2px;
        background: #000;
      }
      .Goods_item {
        width: 24%;
        text-align: center;
        color: #fff;
        margin-bottom: 10px;
        margin-right: 1%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.8);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.8);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.8);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.8);
        }

        .odds_percent {
          position: absolute;
          left: 5px;
          top: 10px;
          font-size: 13px;
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
          font-size: 10px;
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

    .PageNum {
      width: 100%;
      margin-top: 0.4rem;

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
        .el-icon {
          font-size: 25px;
        }
      }
    }

    .pic {
      margin-top: 0.2rem;
      width: 100%;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }

    //切换动画
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
      transition: all 0.3s ease;
    }

    .slide-fade-leave-active {
      transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter,
		.slide-fade-leave-to

		/* .slide-fade-leave-active for below version 2.1.8 */ {
      transform: translateX(10px);
      opacity: 0;
    }

    .Navigation {
      width: 100%;
      height: 0.4rem;
      margin-top: 0.4rem;
      display: flex;
      justify-content: space-between;

      p {
        height: 0.4rem;
        text-align: center;
        line-height: 0.4rem;
        font-size: 0.14rem;
        cursor: pointer;
      }

      .Navigation-left {
        display: flex;

        p {
          height: 50px;
          padding: 0 26px;
          text-align: center;
          line-height: 50px;
          font-size: 16px;
          color: #0072ff;
          margin: 0 5px;
          border: 1px #0072ff solid;
          transition: 0.3s;

          &.active {
            color: #fff;
            border-color: #0072ff;
            background: #0072ff;
          }
          &.created {
            border-style: dashed;
          }
        }
      }

      .Navigation-right {
        display: flex;

        p {
          margin-left: 0.05rem;
          background: #bbb;

          &:last-child {
            background: #ffd322;
            color: #000;
          }
        }
      }
    }

    .BoxList-info {
      width: 100%;
      height: 0.5rem;
      margin-top: 0.4rem;
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      color: #777777;

      .XZ {
        width: 8.9rem;
        padding-left: 0.15rem;
        box-sizing: border-box;
      }

      p {
        width: 1.7rem;
        text-align: center;
      }
    }

    .VS_out {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .VSbox_list {
        width: 20%;
        margin-top: 0.4rem;
        background: rgba($color: #000000, $alpha: 0.2);
        background-size: cover;
        border-radius: 4px;
        .vslist_tit {
          width: 100%;
          text-align: center;
          padding: 0.3rem 0;
          background: #0072ff;
          span {
            font-size: 0.18rem;
          }
        }
        .vsbox_item {
          width: 100%;
          padding: 0 0.1rem;
          border-top: 1px dashed rgba($color: #fff, $alpha: 0.1);
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          &:hover {
            background: rgba($color: #fff, $alpha: 0.1);
          }
          .vsbox_pic {
            width: 150px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              max-width: 100%;
              max-height: 100%;
              vertical-align: middle;
            }
          }
          .vsbox_data {
            width: 100px;
            line-height: 24px;
            p {
              font-size: 16px;
              font-weight: 500;
              color: #ffd728;
              img {
                width: 30px;
                height: 30px;
                vertical-align: middle;
                margin-bottom: 2px;
                margin-right: 2px;
              }
            }
            span {
              font-size: 18px;
            }
          }
        }
      }
      .BoxList {
        width: 78%;

        margin-top: 0.4rem;

        span {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .block {
        width: 8rem;
        background-color: #6e2c9a !important;
        padding: 0.2rem;
        box-sizing: border-box;

        .block-T {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          p {
            font-size: 0.24rem;
            color: #fff;
          }

          span {
            font-size: 0.28rem;
            color: rgba($color: #ffffff, $alpha: 1);
            cursor: pointer;
          }
        }

        .Box-List {
          width: 100%;
          height: 5rem;
          margin: 0.2rem 0 0.4rem;
          overflow: auto;
          display: flex;
          flex-wrap: wrap;

          .Box-List-item {
            width: 1.8rem;
            height: 2.3rem;
            position: relative;
            background: rgba($color: #000, $alpha: 0.5);
            border-radius: 0.04rem;
            margin-right: 0.1rem;
            margin-bottom: 0.1rem;
            cursor: pointer;
            overflow: hidden;

            &:nth-child(4n) {
              margin-right: 0;
            }

            &:hover {
              .ceng {
                opacity: 1;
              }
            }

            .pic {
              width: 1.8rem;
              height: 1.5rem;
              margin: 0.1rem auto 0;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;

              .zhao {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                  max-width: 60%;
                  vertical-align: middle;
                }
              }

              img {
                max-width: 100%;
                max-height: 100%;
                position: relative;
                z-index: 10;
              }
            }

            .name {
              width: 100%;
              text-align: center;
              color: #9e9e9e;
              font-size: 0.14rem;
            }

            .money {
              width: 100%;
              margin-top: 0.1rem;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 0.2rem;
                height: 0.2rem;
                vertical-align: middle;
              }

              span {
                font-size: 0.14rem;
                color: #75dc9e;
              }
            }
          }
        }

        .Box-List::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 4px;
          /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
          scrollbar-arrow-color: red;
        }

        .Box-List::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.6);
          scrollbar-arrow-color: red;
        }

        .Box-List::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }

        .boxbtn {
          width: 100%;
          height: 0.35rem;
          display: flex;
          justify-content: flex-end;

          p {
            width: 0.7rem;
            height: 0.35rem;
            color: #fff;
            border-color: #fc63cf;
            background: rgba($color: #fc63cf, $alpha: 0.5);
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.35rem;
            cursor: pointer;
          }
        }
      }

      .wrapper-box {
        .wrapper-box-top {
          width: 100%;
          height: 0.03rem;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }
        color: white;
        width: 7.5rem;
        height: 3.8rem;
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

    .el-drawer {
      width: 50% !important;
    }
    .el-drawer:focus {
      outline: none;
    }
    .el-drawer__body {
      background: url(../../assets/images/public/back_pub1.jpg) no-repeat center;
      background-size: cover;
      padding: 0.05rem 0.2rem;
      box-sizing: border-box;
      color: white;
      .Num_select {
        width: 100%;
        height: 0.5rem;
        border-radius: 0.04rem;
        overflow: hidden;
        align-items: center;

        p {
          width: 1.2rem;
          height: 0.4rem;
          float: right;
          color: #fff;
          border: 1px #ffffff solid;
          text-align: center;
          line-height: 0.4rem;
          margin: 0 0.05rem;
          font-size: 0.16rem;
          cursor: pointer;

          &.active {
            color: #fff;
            border-color: #ffffff;
            background: #0072ff;
          }
        }
      }

      .case_list_box {
        width: 100%;
        background-color: rgba(73, 89, 129, 0.8) !important;
        padding: 0.1rem;
        box-sizing: border-box;
        border-radius: 0.04rem;
        margin-top: 0.1rem;

        .small_tit {
          font-size: 0.22rem;
        }

        .case_list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          height: 2.9rem;
          overflow: auto;
          margin-top: 0.1rem;
          .case_list_item {
            width: 16%;
            background-color: rgba($color: #000, $alpha: 0.2) !important;
            overflow: hidden;
            cursor: pointer;
            margin-bottom: 0.1rem;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;

            &:hover {
              .ceng {
                opacity: 1;
              }
            }

            .ceng {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: rgba($color: #000000, $alpha: 0.1);
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: 0.3s;
              p {
                width: 0.6rem;
                height: 0.6rem;
                border-radius: 50%;
                background: rgba($color: #ffffff, $alpha: 0.2);
                color: #fff;
                text-align: center;
                line-height: 0.6rem;
                font-size: 0.18rem;
              }
            }

            .pic {
              width: 60%;
              margin: 0.05rem auto 0;

              img {
                max-width: 100%;
              }
            }

            p {
              font-size: 0.14rem;
              color: #fff;
              text-align: center;
            }

            span {
              display: block;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0.05rem 0 0.1rem;

              img {
                width: 0.22rem;
                height: 0.22rem;
              }

              font-size: 0.18rem;
              color: #ffd728;
            }
          }
        }

        .case_list::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 4px;
          /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
          scrollbar-arrow-color: red;
        }

        .case_list::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.6);
          scrollbar-arrow-color: red;
        }

        .case_list::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }

      .Selected_list_box {
        width: 100%;
        background-color: rgba(73, 89, 129, 0.8) !important;
        padding: 0.1rem;
        box-sizing: border-box;
        margin-top: 0.1rem;

        .small_tit {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.22rem;
          p {
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 0.1rem;
            color: #ffd728;
            img {
              width: 0.3rem;
              height: 0.3rem;
              margin-right: 0.03rem;
            }
          }
        }
        .out_box {
          position: relative;
          .below {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .below_item {
              width: 16%;
              height: 1.3rem;
              background: rgba($color: #000000, $alpha: 0.1);
              overflow: hidden;
              margin-top: 0.1rem;
              margin-right: 0.666666%;
              box-sizing: border-box;
              float: left;
            }
          }
          .Select_list {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            &::after {
              display: block;
              content: '';
              width: 16%;
            }
            .Select_list_item {
              width: 16%;
              height: 1.3rem;
              overflow: hidden;
              margin-top: 0.1rem;
              margin-right: 0.666666666666%;
              box-sizing: border-box;
              cursor: pointer;
              position: relative;
              &:hover {
                .ceng {
                  opacity: 1;
                }
              }

              .ceng {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba($color: #000000, $alpha: 0.1);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: 0.3s;
                p {
                  width: 0.6rem;
                  height: 0.6rem;
                  border-radius: 50%;
                  background: rgba($color: #ffffff, $alpha: 0.2);
                  color: #fff;
                  text-align: center;
                  line-height: 0.6rem;
                  font-size: 0.18rem;
                }
              }
              .pic {
                width: 60%;
                img {
                  max-width: 100%;
                }
              }
              p {
                font-size: 0.14rem;
                text-align: center;
              }
            }
          }
        }
      }
      .batch {
        width: 100%;
        background-color: rgba(73, 89, 129, 0.8) !important;
        padding: 0.1rem;
        box-sizing: border-box;
        margin-top: 0.1rem;
        display: flex;
        align-items: center;
        .small_tit {
          font-size: 0.22rem;
          margin-right: 0.3rem;
        }
        .radio_box {
          flex: 1;
          .el-radio {
            margin-right: 20px;
            color: #fff;
          }
          .el-radio__label {
            padding-left: 3px;
            color: #ffffff;
          }
          .el-radio__input {
          }
        }
      }
      .CJ_btn {
        width: 100%;
        box-sizing: border-box;
        margin-top: 0.1rem;
        display: flex;
        justify-content: flex-end;
        p {
          width: 1.5rem;
          height: 0.5rem;
          color: #fff;
          border-color: #ffffff;
          background: #0072ff;
          font-size: 0.18rem;
          text-align: center;
          line-height: 0.5rem;
          cursor: pointer;
        }
      }
    }
  }
}
@media screen and(min-width:2560px) {
  #BoxFight-box {
    width: 14rem;
    padding-top: 0.4rem;

    .Goods_list {
      width: 100%;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      margin-top: 20px;
      overflow: hidden;
      overflow-y: auto;
      height: 6rem;
      margin-bottom: 0.2rem;
      &::-webkit-scrollbar {
        width: 2px;
        background: rgba($color: #000, $alpha: 0.2);
      }
      &::-webkit-scrollbar-thumb {
        width: 2px;
        background: #000;
      }
      .Goods_item {
        width: 24%;
        text-align: center;
        color: #fff;
        margin-bottom: 10px;
        margin-right: 1%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.8);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.8);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.8);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.8);
        }

        .odds_percent {
          position: absolute;
          left: 5px;
          top: 10px;
          font-size: 13px;
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
          font-size: 10px;
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

    .PageNum {
      width: 100%;
      margin-top: 0.4rem;

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
        .el-icon {
          font-size: 25px;
        }
      }
    }

    .pic {
      margin-top: 0.2rem;
      width: 100%;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }

    //切换动画
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
      transition: all 0.3s ease;
    }

    .slide-fade-leave-active {
      transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter,
		.slide-fade-leave-to

		/* .slide-fade-leave-active for below version 2.1.8 */ {
      transform: translateX(10px);
      opacity: 0;
    }

    .Navigation {
      width: 100%;
      height: 0.4rem;
      margin-top: 0.4rem;
      display: flex;
      justify-content: space-between;

      p {
        height: 0.4rem;
        text-align: center;
        line-height: 0.4rem;
        font-size: 0.14rem;
        cursor: pointer;
      }

      .Navigation-left {
        display: flex;

        p {
          height: 50px;
          padding: 0 26px;
          text-align: center;
          line-height: 50px;
          font-size: 20px;
          color: #0072ff;
          margin: 0 5px;
          border: 1px #0072ff solid;
          transition: 0.3s;

          &.active {
            color: #fff;
            border-color: #0072ff;
            background: #0072ff;
          }
          &.created {
            border-style: dashed;
          }
        }
      }

      .Navigation-right {
        display: flex;

        p {
          margin-left: 0.05rem;
          background: #bbb;

          &:last-child {
            background: #ffd322;
            color: #000;
          }
        }
      }
    }

    .BoxList-info {
      width: 100%;
      height: 0.5rem;
      margin-top: 0.4rem;
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      color: #777777;

      .XZ {
        width: 8.9rem;
        padding-left: 0.15rem;
        box-sizing: border-box;
      }

      p {
        width: 1.7rem;
        text-align: center;
      }
    }

    .VS_out {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .VSbox_list {
        width: 20%;
        margin-top: 0.4rem;
        background: rgba($color: #000000, $alpha: 0.2);
        background-size: cover;
        border-radius: 4px;
        .vslist_tit {
          width: 100%;
          text-align: center;
          padding: 0.3rem 0;
          background: #0072ff;
          span {
            font-size: 0.22rem;
          }
        }
        .vsbox_item {
          width: 100%;
          padding: 0 0.1rem;
          border-top: 1px dashed rgba($color: #fff, $alpha: 0.1);
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          &:hover {
            background: rgba($color: #fff, $alpha: 0.1);
          }
          .vsbox_pic {
            width: 150px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              max-width: 100%;
              max-height: 100%;
              vertical-align: middle;
            }
          }
          .vsbox_data {
            width: 100px;
            line-height: 24px;
            p {
              font-size: 20px;
              font-weight: 500;
              color: #ffd728;
              img {
                width: 30px;
                height: 30px;
                vertical-align: middle;
                margin-bottom: 2px;
                margin-right: 2px;
              }
            }
            span {
              font-size: 20px;
            }
          }
        }
      }
      .BoxList {
        width: 78%;

        margin-top: 0.4rem;

        span {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .block {
        width: 8rem;
        background-color: #6e2c9a !important;
        padding: 0.2rem;
        box-sizing: border-box;

        .block-T {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          p {
            font-size: 0.24rem;
            color: #fff;
          }

          span {
            font-size: 0.28rem;
            color: rgba($color: #ffffff, $alpha: 1);
            cursor: pointer;
          }
        }

        .Box-List {
          width: 100%;
          height: 5rem;
          margin: 0.2rem 0 0.4rem;
          overflow: auto;
          display: flex;
          flex-wrap: wrap;

          .Box-List-item {
            width: 1.8rem;
            height: 2.3rem;
            position: relative;
            background: rgba($color: #000, $alpha: 0.5);
            border-radius: 0.04rem;
            margin-right: 0.1rem;
            margin-bottom: 0.1rem;
            cursor: pointer;
            overflow: hidden;

            &:nth-child(4n) {
              margin-right: 0;
            }

            &:hover {
              .ceng {
                opacity: 1;
              }
            }

            .pic {
              width: 1.8rem;
              height: 1.5rem;
              margin: 0.1rem auto 0;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;

              .zhao {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                  max-width: 60%;
                  vertical-align: middle;
                }
              }

              img {
                max-width: 100%;
                max-height: 100%;
                position: relative;
                z-index: 10;
              }
            }

            .name {
              width: 100%;
              text-align: center;
              color: #9e9e9e;
              font-size: 0.14rem;
            }

            .money {
              width: 100%;
              margin-top: 0.1rem;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 0.2rem;
                height: 0.2rem;
                vertical-align: middle;
              }

              span {
                font-size: 0.14rem;
                color: #75dc9e;
              }
            }
          }
        }

        .Box-List::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 4px;
          /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
          scrollbar-arrow-color: red;
        }

        .Box-List::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.6);
          scrollbar-arrow-color: red;
        }

        .Box-List::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }

        .boxbtn {
          width: 100%;
          height: 0.35rem;
          display: flex;
          justify-content: flex-end;

          p {
            width: 0.7rem;
            height: 0.35rem;
            color: #fff;
            border-color: #fc63cf;
            background: rgba($color: #fc63cf, $alpha: 0.5);
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.35rem;
            cursor: pointer;
          }
        }
      }

      .wrapper-box {
        .wrapper-box-top {
          width: 100%;
          height: 0.03rem;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }
        color: white;
        width: 7.5rem;
        height: 3.8rem;
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

    .el-drawer {
      width: 50% !important;
    }
    .el-drawer:focus {
      outline: none;
    }
    .el-drawer__body {
      background: url(../../assets/images/public/back_pub1.jpg) no-repeat center;
      background-size: cover;
      padding: 0.05rem 0.2rem;
      box-sizing: border-box;
      color: white;
      .Num_select {
        width: 100%;
        height: 0.5rem;
        border-radius: 0.04rem;
        overflow: hidden;
        align-items: center;

        p {
          width: 1.2rem;
          height: 0.4rem;
          float: right;
          color: #fff;
          border: 1px #ffffff solid;
          text-align: center;
          line-height: 0.4rem;
          margin: 0 0.05rem;
          font-size: 0.16rem;
          cursor: pointer;

          &.active {
            color: #fff;
            border-color: #ffffff;
            background: #0072ff;
          }
        }
      }

      .case_list_box {
        width: 100%;
        background-color: rgba(73, 89, 129, 0.8) !important;
        padding: 0.1rem;
        box-sizing: border-box;
        border-radius: 0.04rem;
        margin-top: 0.1rem;

        .small_tit {
          font-size: 0.22rem;
        }

        .case_list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          height: 2.9rem;
          overflow: auto;
          margin-top: 0.1rem;
          .case_list_item {
            width: 16%;
            background-color: rgba($color: #000, $alpha: 0.2) !important;
            overflow: hidden;
            cursor: pointer;
            margin-bottom: 0.1rem;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;

            &:hover {
              .ceng {
                opacity: 1;
              }
            }

            .ceng {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: rgba($color: #000000, $alpha: 0.1);
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: 0.3s;
              p {
                width: 0.6rem;
                height: 0.6rem;
                border-radius: 50%;
                background: rgba($color: #ffffff, $alpha: 0.2);
                color: #fff;
                text-align: center;
                line-height: 0.6rem;
                font-size: 0.18rem;
              }
            }

            .pic {
              width: 60%;
              margin: 0.05rem auto 0;

              img {
                max-width: 100%;
              }
            }

            p {
              font-size: 0.14rem;
              color: #fff;
              text-align: center;
            }

            span {
              display: block;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0.05rem 0 0.1rem;

              img {
                width: 0.22rem;
                height: 0.22rem;
              }

              font-size: 0.18rem;
              color: #ffd728;
            }
          }
        }

        .case_list::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 4px;
          /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
          scrollbar-arrow-color: red;
        }

        .case_list::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.6);
          scrollbar-arrow-color: red;
        }

        .case_list::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }

      .Selected_list_box {
        width: 100%;
        background-color: rgba(73, 89, 129, 0.8) !important;
        padding: 0.1rem;
        box-sizing: border-box;
        margin-top: 0.1rem;

        .small_tit {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.22rem;
          p {
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 0.1rem;
            color: #ffd728;
            img {
              width: 0.3rem;
              height: 0.3rem;
              margin-right: 0.03rem;
            }
          }
        }
        .out_box {
          position: relative;
          .below {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .below_item {
              width: 16%;
              height: 1.3rem;
              background: rgba($color: #000000, $alpha: 0.1);
              overflow: hidden;
              margin-top: 0.1rem;
              margin-right: 0.666666%;
              box-sizing: border-box;
              float: left;
            }
          }
          .Select_list {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            &::after {
              display: block;
              content: '';
              width: 16%;
            }
            .Select_list_item {
              width: 16%;
              height: 1.3rem;
              overflow: hidden;
              margin-top: 0.1rem;
              margin-right: 0.666666666666%;
              box-sizing: border-box;
              cursor: pointer;
              position: relative;
              &:hover {
                .ceng {
                  opacity: 1;
                }
              }

              .ceng {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba($color: #000000, $alpha: 0.1);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: 0.3s;
                p {
                  width: 0.6rem;
                  height: 0.6rem;
                  border-radius: 50%;
                  background: rgba($color: #ffffff, $alpha: 0.2);
                  color: #fff;
                  text-align: center;
                  line-height: 0.6rem;
                  font-size: 0.18rem;
                }
              }
              .pic {
                width: 60%;
                img {
                  max-width: 100%;
                }
              }
              p {
                font-size: 0.14rem;
                text-align: center;
              }
            }
          }
        }
      }
      .batch {
        width: 100%;
        background-color: rgba(73, 89, 129, 0.8) !important;
        padding: 0.1rem;
        box-sizing: border-box;
        margin-top: 0.1rem;
        display: flex;
        align-items: center;
        .small_tit {
          font-size: 0.22rem;
          margin-right: 0.3rem;
        }
        .radio_box {
          flex: 1;
          .el-radio {
            margin-right: 20px;
            color: #fff;
          }
          .el-radio__label {
            padding-left: 3px;
            color: #ffffff;
          }
          .el-radio__input {
          }
        }
      }
      .CJ_btn {
        width: 100%;
        box-sizing: border-box;
        margin-top: 0.1rem;
        display: flex;
        justify-content: flex-end;
        p {
          width: 1.5rem;
          height: 0.5rem;
          color: #fff;
          border-color: #ffffff;
          background: #0072ff;
          font-size: 0.18rem;
          text-align: center;
          line-height: 0.5rem;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
