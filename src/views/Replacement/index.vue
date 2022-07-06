<template>
  <div id="Replacement" style="width: 16.5rem">
    <div class="Replacement_box">
      <div class="Replacement_item">
        <i></i>
        <div class="Title" style="margin-top: 0.4rem; width: 21%">
          <p>饰品升级</p>
          <div class="c_btn" style="cursor: pointer" @click="gameshow = true">玩法说明</div>
        </div>

        <div class="inner">
          <div class="point">
            <div class="b_box">
              <div class="b_box_nav">
                <b>目标饰品</b>
              </div>
              <div class="b_list">
                <div class="Goods_list">
                  <div class="Goods_item" :class="'lv_' + item.lv" v-for="(item, index) in SynthesisList" :key="index" @click="ADitem(item, index)" ref="Add">
                    <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ item.bean }}</div>
                    <div class="dura_alias">{{ item.dura_alias }}</div>
                    <div class="Goods_pic" :style="{ 'background-image': 'url(' + item.lv_bgImage + ')' }">
                      <img :src="item.cover" alt="" />
                    </div>
                    <p>{{ item.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="point">
            <div class="Top_box">
              <div class="Top_list" style="white-space: pre-wrap">
                <div class="Top_item_t">
                  <div class="T_pic">
                    <img :src="AdItem.cover" alt="" />
                  </div>
                  <div class="T_right" v-show="AdItem.name">
                    <p>{{ AdItem.name }}</p>
                    <span v-show="show"><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ AdItem.bean }}</span>
                  </div>
                </div>
              </div>

              <div class="Q_center" v-show="AdItem.name">
                <div class="yuan" style="color: white">
                  <div class="Zhi" :style="sty">
                    <div class="dian"></div>
                  </div>
                  {{ Bili }}<span>%</span>
                  <div class="dian"><i></i></div>
                </div>
                <div class="Q_btn" @click="postSynthesis">确认升级</div>
              </div>
            </div>
          </div>

          <div class="point">
            <div class="Top_box" style="display: none">
              <div class="Top_list">
                <div class="Top_item" v-for="(item, index) in XZlist" :key="index" @click="SCitem(item, index)">
                  <span><img src="@/assets/images/mall/JiFen.png" alt="" />{{ item.bean }}</span>
                  <div class="Top_pic" :style="'background-image: url(' + item.lv_bg_image + ')'">
                    <img :src="item.cover" alt="" />
                  </div>
                  <p>{{ item.name }}</p>
                </div>
              </div>
            </div>
            <div class="b_box">
              <div class="b_box_nav">
                <b class="w">我的饰品</b>
                <div class="right">
                  <p>
                    已选饰品：<span>{{ XZlist.length }}</span>
                  </p>

                  <div class="JG">
                    <img src="@/assets/images/PublicImg/JinBi.png" alt="" />
                    材料总价
                    <span>{{ ZongJia.toFixed(2) }}</span>
                  </div>

                  <div class="b_btn" @click="YiJian" style="cursor: pointer">一键添加</div>
                </div>
              </div>
              <div class="b_list">
                <div class="Goods_list height_auto">
                  <div class="Goods_item" :class="'lv_' + item.lv" v-for="(item, index) in StorageList" :key="index" @click="XZitem(item, index)" ref="Item">
                    <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ item.bean }}</div>
                    <div class="dura_alias">{{ item.dura_alias }}</div>
                    <div class="Goods_pic" :style="{ 'background-image': 'url(' + item.lv_bgImage + ')' }">
                      <img :src="item.cover" alt="" />
                    </div>
                    <p>{{ item.name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="PageNum">
              <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page" :total="PageNum"> </el-pagination>
            </div>
          </div>
        </div>
      </div>

      <van-overlay :show="isShow">
        <div class="wrapper" v-if="isShow">
          <div class="Show_box">
            <div class="Show_title">合成成功</div>

            <div class="Goods_list height_auto" style="justify-content: center">
              <div class="Goods_item" style="width: 30%" :class="'lv_' + HCitem.lv">
                <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ HCitem.bean }}</div>
                <div class="dura_alias">{{ HCitem.dura_alias }}</div>
                <div class="Goods_pic" :style="{ 'background-image': 'url(' + HCitem.lv_bgImage + ')' }">
                  <img :src="HCitem.cover" alt="" />
                </div>
                <p>{{ HCitem.name }}</p>
              </div>
            </div>

            <div class="Show_btns">
              <van-button type="info" @click="GetIshow">继续合成</van-button>
            </div>
          </div>
        </div>
      </van-overlay>

      <van-overlay :show="netShow">
        <div class="wrapper">
          <div class="Show_box">
            <img class="Img" src="@/assets/images/heyue/ZZ.png" alt="" />
            <div class="Show_btns">
              <van-button type="info" @click="GetIshow">继续合成</van-button>
            </div>
          </div>
        </div>
      </van-overlay>

      <!-- 玩法说明 -->
      <van-overlay :show="gameshow">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="gameshow = false" />
            </div>
            <span>玩法说明</span>
            <p>1.选择一个目标饰品，用您的背包已有的饰品或购买我们提供的材料饰品进行升级。</p>
            <p>2.升级成功则直接获得目标饰品，升级失败则失去材料饰品。</p>
            <p>3.升级成功的概率是依据您提供材料饰品的价值而定的。</p>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import { Storage, Synthesis_list, Synthesis } from '@/network/api.js'
export default {
  name: 'Replacement',
  data () {
    return {
      StorageList: [],
      PageNum: 0,
      per_page: 0,
      page: 1,

      SynthesisList: [],
      SynthesisNum: 0,
      Synthesis_page: 0,
      S_page: 1,

      XZlist: [],

      AdItem: {},
      show: false,

      ZongJia: 0,
      Bili: 0,

      HCitem: {},
      isShow: false,
      sty: '',
      gameshow: false,
      netShow: false,
      Z_key: false
    }
  },

  created () {
    this.GetStorage(),
      this.GetSynthesis_list()
  },

  methods: {
    //装备列表
    GetStorage () {
      Storage(this.page, '0', 1).then((res) => {
        // console.log(res.data.data)
        this.StorageList = res.data.data.data
        this.PageNum = Number(res.data.data.total)
        this.per_page = Number(res.data.data.per_page)
      })
    },
    //装备列表分页
    handleCurrentChange (val) {
      // console.log(val)
      this.page = val
      this.GetStorage()
      setTimeout(() => {
        for (let i = 0; i < this.StorageList.length; i++) {
          this.$refs.Item[i].style.border = "3px solid transparent"
        }
      }, 300)

    },
    //合成装备列表
    GetSynthesis_list () {
      Synthesis_list(this.S_page).then((res) => {
        // console.log(res)
        // console.log(res.data.data.data)
        this.SynthesisList = res.data.data
      })
    },
    //合成装备列表分页
    Changepage (val) {
      this.S_page = val
    },

    // 选中
    XZitem (item, index) {
      // console.log(item,index)
      if (item.Select) {
        delete item.Select
        this.$refs.Item[index].style.border = "3px solid transparent"
        let Index = this.XZlist.findIndex((v) => {
          return v.id == item.id
        })
        // console.log(index)
        this.XZlist.splice(Index, 1)
      } else {
        let key = "Select";
        let value = true
        item[key] = value
        this.$refs.Item[index].style.border = "3px solid #E9B10E"
        this.XZlist.push(item)
      }
    },
    //删除选中
    SCitem (item, index) {
      // console.log(item)
      // this.XZlist.splice(index,1)
      let Index = this.StorageList.findIndex((v) => {
        return v.id == item.id
      })
      // console.log(index)
      this.$refs.Item[Index].style.border = "3px solid transparent"
      // console.log(this.$refs.Item[Index])

    },

    // 选中
    ADitem (item, index) {
      if (item.Select) {
        delete item.Select
        this.$refs.Add[index].style.border = "3px solid transparent"
        this.AdItem = {}
      } else {
        for (let i = 0; i < this.SynthesisList.length; i++) {
          this.$refs.Add[i].style.border = "3px solid transparent"
          delete this.SynthesisList[i].Select
        }
        let key = "Select";
        let value = true
        item[key] = value
        this.$refs.Add[index].style.border = "3px solid #E9B10E"
        this.AdItem = item
        // console.log(item)
      }



    },

    //删除
    SCAditem () {
      let Index = this.SynthesisList.findIndex((v) => {
        return v.id == this.AdItem.id
      })
      this.$refs.Add[Index].style.border = "3px solid transparent"
      this.AdItem = {}
    },

    //合成
    postSynthesis () {

      // console.log(this.XZlist)
      let AdArr = this.XZlist.filter((v) => {
        return v.dura_alias == '无'
      })
      // console.log(AdArr.length)
      if (AdArr.length == 0) {

        let data = []

        for (let i = 0; i < this.XZlist.length; i++) {
          data.push({
            id: this.XZlist[i].id
          })
        }



        // console.log(data)

        Synthesis(data, this.AdItem.id).then((res) => {
          this.sty = 'animation: zhuan 1s linear; animation-iteration-count:3;'
          // console.log(res)
          if (res.data.data) {
            this.HCitem = res.data.data
            setTimeout(() => {
              this.isShow = true
              this.XZlist = []
              this.GetStorage()
              this.AdItem = {}
              for (let i = 0; i < this.StorageList.length; i++) {
                this.$refs.Item[i].style.border = "3px solid transparent"
              }
              for (let i = 0; i < this.SynthesisList.length; i++) {
                this.$refs.Add[i].style.border = "3px solid transparent"
                delete this.SynthesisList[i].Select
              }
              this.sty = ''
              this.Bili = 0
            }, 3000)
          } else if (res.data.code == 500) {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          } else {
            setTimeout(() => {
              this.netShow = true
              this.XZlist = []
              this.GetStorage()
              this.AdItem = {}
              for (let i = 0; i < this.StorageList.length; i++) {
                this.$refs.Item[i].style.border = "3px solid transparent"
              }
              for (let i = 0; i < this.SynthesisList.length; i++) {
                this.$refs.Add[i].style.border = "3px solid transparent"
                delete this.SynthesisList[i].Select
              }
              this.sty = ''
            }, 3000)
          }

        })
      } else {
        this.$message({
          message: '已选饰品磨损度不能为无!',
          type: 'error'
        })
      }

    },

    GetIshow () {
      this.isShow = false
      this.netShow = false
    },

    YiJian () {
      if (this.Z_key == false) {
        let key = "Select";
        let value = true
        this.XZlist = []
        for (let i = 0; i < this.StorageList.length; i++) {
          this.StorageList[i][key] = value
          this.$refs.Item[i].style.border = "3px solid #E9B10E"
          this.XZlist.push(this.StorageList[i])
        }
        this.Z_key = true
      } else {
        for (let i = 0; i < this.StorageList.length; i++) {
          delete this.StorageList[i].Select
          this.$refs.Item[i].style.border = "3px solid transparent"
          this.XZlist = []
        }
        this.Z_key = false
      }


    }
  },
  watch: {
    AdItem (v) {
      if (v.bean == undefined) {
        this.show = false
      } else {
        this.show = true
        if (this.ZongJia != 0) {
          let add = 0
          add = (this.ZongJia / Number(v.bean)) * 100
          this.Bili = add.toFixed(0)
        }
      }
    },
    XZlist (v) {
      this.ZongJia = 0
      // console.log(v)
      for (let i = 0; i < v.length; i++) {
        this.ZongJia += Number(v[i].bean)
      }
    },
    ZongJia (v) {
      if (this.AdItem.bean != undefined) {
        let add = 0
        add = (v / Number(this.AdItem.bean)) * 100
        this.Bili = add.toFixed(0)
      }

    },
  }
}
</script>

<style lang="scss">
.output {
  width: 16rem;
  padding-bottom: 0.75rem;
  margin: 0 auto;
}

.inner {
  width: 100%;
  margin: 0px auto;
  text-align: center;
}
.point {
  width: 33%;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}

.Replacement_box {
  padding-top: 0.6rem;

  @media screen and(min-width:1024px) {
    .Goods_list {
      width: 100%;
      height: 540px;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      &.height_auto {
        height: auto;
        max-height: 540px;
      }

      .Goods_item {
        box-sizing: border-box;
        border: 3px solid transparent;
        width: 32%;
        text-align: center;
        color: #fff;
        margin-bottom: 10px;
        margin-right: 0.5%;
        padding: 20px 0 0;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.6);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.6);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.6);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.6);
        }

        .user {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0.12rem;
          .header {
            width: 0.3rem;
            height: 0.3rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.05rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .name {
            font-size: 0.5em;
          }
        }

        .odds_percent {
          position: absolute;
          left: 0px;
          top: 10px;
          font-size: 13px;
          text-align: left;
          padding: 2px 0px;
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
          right: -5px;
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
          height: 100px;
          margin: 10px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;

          img {
            max-width: 90%;
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
          margin: 10px 0;
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
  @media screen and(min-width:1920px) {
    .Goods_list {
      width: 100%;
      height: 540px;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      &.height_auto {
        height: auto;
        max-height: 540px;
      }

      .Goods_item {
        box-sizing: border-box;
        border: 3px solid transparent;
        width: 32%;
        text-align: center;
        color: #fff;
        margin-bottom: 10px;
        margin-right: 0.5%;
        padding: 20px 0 0;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.6);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.6);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.6);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.6);
        }

        .user {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0.12rem;
          .header {
            width: 0.3rem;
            height: 0.3rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.05rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .name {
            font-size: 0.5em;
          }
        }

        .odds_percent {
          position: absolute;
          left: 0px;
          top: 10px;
          font-size: 16px;
          text-align: left;
          padding: 2px 0px;
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
          right: -5px;
          top: 12px;
          font-size: 16px;
          text-align: left;
          padding-right: 10px;
          box-sizing: border-box;
          color: #fff;
          line-height: 20px;
        }

        .Goods_pic {
          width: 80%;
          height: 100px;
          margin: 10px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;

          img {
            max-width: 90%;
            vertical-align: middle;
          }
        }

        p {
          width: 100%;
          padding: 0 3px;
          box-sizing: border-box;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 8px 0;
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
  @media screen and(min-width:2560px) {
    .Goods_list {
      width: 100%;
      height: 540px;
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      border-radius: 0 4px 4px 4px;
      &.height_auto {
        height: auto;
        max-height: 540px;
      }

      .Goods_item {
        box-sizing: border-box;
        border: 3px solid transparent;
        width: 32%;
        text-align: center;
        color: #fff;
        margin-bottom: 10px;
        margin-right: 0.5%;
        padding: 20px 0 0;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background-color: #716778;
        &.lv_1 {
          background-color: rgba(145, 95, 77, 0.6);
        }
        &.lv_2 {
          background-color: rgba(153, 53, 138, 0.6);
        }
        &.lv_3 {
          background-color: rgba(133, 81, 171, 0.6);
        }
        &.lv_4 {
          background-color: rgba(73, 72, 184, 0.6);
        }

        .user {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0.12rem;
          .header {
            width: 0.3rem;
            height: 0.3rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.05rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .name {
            font-size: 0.5em;
          }
        }

        .odds_percent {
          position: absolute;
          left: 0px;
          top: 10px;
          font-size: 18px;
          text-align: left;
          padding: 2px 0px;
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
          right: -5px;
          top: 12px;
          font-size: 18px;
          text-align: left;
          padding-right: 10px;
          box-sizing: border-box;
          color: #fff;
          line-height: 20px;
        }

        .Goods_pic {
          width: 80%;
          height: 100px;
          margin: 10px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url(http://csgo.api.gameskins.cn/uploads/images/baeef9d5696b72118858f87ff955bee7.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;

          img {
            max-width: 90%;
            vertical-align: middle;
          }
        }

        p {
          width: 100%;
          padding: 0 3px;
          box-sizing: border-box;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 8px 0;
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

  .Replacement_item {
    width: 100%;

    .II {
      display: block;
      width: 1.8rem;
      height: 0.1rem;
      background: url(../../assets/images/heyue/Zui.png) no-repeat center;
      background-size: contain;
    }
    .c_btn {
      width: 0.88rem;
      height: 0.38rem;
      border: 2px solid #5e5529;
      font-size: 0.14rem;
      text-align: center;
      line-height: 0.38rem;
      border-radius: 0.08rem;
      color: #5e5529;
      float: right;
    }
    @media screen and(min-width:1920px) {
      .c_btn {
        width: 0.88rem;
        height: 0.38rem;
        border: 2px solid #5e5529;
        font-size: 0.18rem;
        text-align: center;
        line-height: 0.38rem;
        border-radius: 0.08rem;
        color: #5e5529;
        float: right;
      }
    }

    .Replacement_tit {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.4rem;

      p {
        font-size: 0.19rem;
        color: #fff;
      }
    }
    .PageNum {
      width: 100%;
      text-align: center;
      margin-top: 20px;

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
    .Top_box {
      width: 100%;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url(../../assets/images/PublicImg/replacement.png) no-repeat center;
      background-size: auto 80%;
      position: relative;

      .Top_list {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;

        .Top_item {
          width: 1.1rem;
          display: inline-block;

          span {
            display: flex;
            width: 100%;
            justify-content: center;
            font-size: 0.16rem;
            margin-top: 0.1rem;

            img {
              width: 0.18rem;
              margin-bottom: 0.04rem;
              margin-right: 0.05rem;
            }
          }

          .Top_pic {
            width: 1rem;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            margin: 0.1rem auto;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              max-width: 100%;
              max-height: 100%;
            }
          }

          p {
            font-size: 0.16rem;
            padding: 0 0.1rem;
            box-sizing: border-box;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .Top_item_t {
          width: 5rem;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 0.1rem;
          box-sizing: border-box;

          .T_pic {
            width: 35%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 0.2rem;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          .T_right {
            width: 1.6rem;
            padding: 10px;
            border-radius: 10px;
            background: linear-gradient(-90deg, #a249cc, #d03fb5);
            span {
              margin-top: 3px;
              font-size: 0.22rem;
              color: #ffd926;
              text-align: right;
              display: flex;
              img {
                width: 0.3rem;
                margin-right: 0.05rem;
                margin-bottom: -0.02rem;
              }
            }
            p {
              width: 1.5rem;
              font-size: 0.2rem;
              word-wrap: break-word;
            }
            img {
              width: 20px;
            }
          }
        }
      }
    }

    .b_box {
      width: 100%;
      background-size: contain;
      overflow: hidden;

      .b_box_nav {
        width: 100%;
        height: 0.4rem;
        display: flex;
        align-items: center;

        .right {
          width: 80%;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: right;
          P {
            color: #545454;
          }
        }

        .JG {
          display: flex;
          align-items: center;
          font-size: 0.16rem;
          color: #545454;
          margin-left: 0.1rem;

          img {
            width: 0.24rem;
            height: 0.24rem;
          }

          span {
            font-size: 0.16rem;
            color: #ffd926;
            margin-left: 0.05rem;
          }
        }

        p {
          font-size: 0.16rem;
          color: #ccc;
          span {
            color: #ffd926;
          }
        }

        b {
          font-size: 0.22rem;
          color: #929292;
          &.w {
            width: 50%;
          }
        }

        .b_btn {
          width: 1rem;
          height: 0.32rem;
          border-radius: 0.16rem;
          font-size: 0.16rem;
          background: #ffae00;
          color: #000;
          text-align: center;
          line-height: 0.32rem;
          margin-left: 0.1rem;
        }
      }
      @media screen and(min-width:1920px) {
        .b_box_nav {
          width: 100%;
          height: 0.4rem;
          display: flex;
          align-items: center;

          .right {
            width: 80%;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: right;
            P {
              color: #545454;
            }
          }

          .JG {
            display: flex;
            align-items: center;
            font-size: 0.16rem;
            color: #545454;
            margin-left: 0.1rem;

            img {
              width: 0.24rem;
              height: 0.24rem;
            }

            span {
              font-size: 0.16rem;
              color: #ffd926;
              margin-left: 0.05rem;
            }
          }

          p {
            font-size: 0.16rem;
            color: #ccc;
            span {
              color: #ffd926;
            }
          }

          b {
            font-size: 0.22rem;
            color: #929292;
            &.w {
              width: 50%;
            }
          }

          .b_btn {
            width: 1rem;
            height: 0.32rem;
            border-radius: 0.16rem;
            font-size: 0.16rem;
            background: #ffae00;
            color: #000;
            text-align: center;
            line-height: 0.32rem;
            margin-left: 0.1rem;
          }
        }
      }
      @media screen and(min-width:2560px) {
        .b_box_nav {
          width: 100%;
          height: 0.4rem;
          display: flex;
          align-items: center;

          .right {
            width: 80%;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: right;
            P {
              color: #545454;
            }
          }

          .JG {
            display: flex;
            align-items: center;
            font-size: 0.16rem;
            color: #545454;
            margin-left: 0.1rem;

            img {
              width: 0.24rem;
              height: 0.24rem;
            }

            span {
              font-size: 0.16rem;
              color: #ffd926;
              margin-left: 0.05rem;
            }
          }

          p {
            font-size: 0.16rem;
            color: #ccc;
            span {
              color: #ffd926;
            }
          }

          b {
            font-size: 0.22rem;
            color: #929292;
            &.w {
              width: 50%;
            }
          }

          .b_btn {
            width: 1rem;
            height: 0.32rem;
            border-radius: 0.16rem;
            font-size: 0.16rem;
            background: #ffae00;
            color: #000;
            text-align: center;
            line-height: 0.32rem;
            margin-left: 0.1rem;
          }
        }
      }
      .b_list {
        margin: 0.1rem auto 0;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
      }
    }
  }

  @keyframes zhuan {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .Q_center {
    width: 4rem;
    position: absolute;
    top: 230px;
    right: 20px;
    .yuan {
      width: 1.6rem;
      height: 1.6rem;
      background: url(../../assets/images/heyue/yuan.png) no-repeat center;
      background-size: contain;
      margin: 1rem auto 0;
      text-align: center;
      line-height: 1.6rem;
      font-size: 0.44rem;
      position: relative;

      .Zhi {
        width: 0.15rem;
        height: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -0.075rem;
        padding-top: 0.14rem;
        box-sizing: border-box;
        .dian {
          width: 0.15rem;
          height: 0.15rem;
          border-radius: 50%;
          background-color: #7cdffe;
          box-shadow: 0 0 6px 3px #7cdffe;
        }
      }
      span {
        font-size: 0.22rem;
      }
    }
    img {
      display: block;
      margin: 0.8rem auto 0;
      width: 1rem;
    }
    .Q_btn {
      width: 1.4rem;
      height: 0.4rem;
      background: linear-gradient(-90deg, #a249cc, #d03fb5);
      text-align: center;
      line-height: 0.4rem;
      font-size: 0.18rem;
      color: #fff;
      border-radius: 1rem;
      margin: 0.6rem auto 0;
      cursor: pointer;
    }
  }

  .Show_box {
    width: 500px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 10px auto 0;
    position: relative;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    .Img {
      width: 60%;
    }
    .Show_title {
      text-align: center;
      font-size: 18px;
    }

    .Show_list {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .Show_item {
        width: 150px;
        margin: 0 5px;
        margin-top: 10px;
        background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
        background-size: cover;
        border-radius: 6px;
        border: 1px solid #e9b10e;
        box-sizing: border-box;
        cursor: pointer;

        .Show_pic {
          width: 120px;
          height: 120px;
          margin: 0 auto;
          background-image: url(http://www.gameskins.cn/img/LV4.9815642e.png);
          background-position: center;
          background-size: 80%;
          background-repeat: no-repeat;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            max-width: 90%;
            max-height: 90%;
            vertical-align: middle;
          }
        }

        p {
          width: 100%;
          padding: 0 5px;
          box-sizing: border-box;
          font-size: 14px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          color: #75cd66;
          margin: 10px 0 10px;

          img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
          }
        }
      }
    }

    .Show_btns {
      margin-top: 10px;

      .van-button {
        width: 1.4rem;
        height: 0.4rem;
        background: #a249cc;
        text-align: center;
        line-height: 0.4rem;
        font-size: 0.18rem;
        color: #fff;
        border-radius: 1rem;
        margin: 0.6rem auto 0;
        cursor: pointer;
        border: none;
        &:last-child {
          margin-right: 0;
        }

        .Gold {
          margin-left: 5px;
          color: #000;

          img {
            width: 18px;
            height: 18px;
            vertical-align: middle;
            margin-bottom: 2px;
            margin-right: 2px;
          }
        }
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .wrapper-box {
    .wrapper-box-top {
      width: 100%;
      height: 0.03rem;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    }
    color: white;
    width: 7.5rem;
    height: 2.5rem;
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

.Top_list::-webkit-scrollbar {
  width: 04rem;
  height: 0.03rem;
}

.Top_list::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.Top_list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

.b_list::-webkit-scrollbar {
  width: 4px;
}

.b_list::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.b_list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
