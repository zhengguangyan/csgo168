<template>
  <div id="Warehouse">
    <div class="Warehouse-box">
      <div class="Title">
        <p>个人背包</p>
      </div>
      <div class="StatusBar">
        <div class="GoodsAndDelivery">
          <p @click="GetGoodsList" :class="{ active: SwitchState == true }">背包</p>
          <p @click="GetExtractList" :class="{ active: SwitchState == false }">提货列表</p>
        </div>
        <div class="operation" v-show="SwitchState == true">
          <p @click="WholeCash">回收</p>
          <p @click="WholeExtract">提货</p>
          <p @click="SelectAll">全选</p>
          <div v-if="selectPrice > 0" style="line-height: 0.36rem; color: #75cd66; margin-right: 20px">所选物品总价：{{ selectPrice }}</div>
        </div>

        <div class="DeliverBar" v-show="SwitchState == false">
          <!-- <p @click="PickTHZ(1)" :class="{ 'active' : PickSwitch == 1 }">提货完成</p>
					<p @click="PickTHZ(6)" :class="{ 'active' : PickSwitch == 6 }">等待收货</p>
					<p @click="PickTHZ(5)" :class="{ 'active' : PickSwitch == 5 }">正在发货</p>
					<p @click="PickTHZ(4)" :class="{ 'active' : PickSwitch == 4 }">申请提货</p> -->

          <el-select v-model="TakeValue" placeholder="请选择">
            <el-option v-for="item in TakeOption" :key="item.value" :label="item.text" :value="item.value"> </el-option>
          </el-select>
        </div>
      </div>

      <div class="ExtractList" v-show="SwitchState == false">
        <van-loading class="vant-load WD650" v-show="PickShow == true" color="#000000" size="60" />

        <div class="Goods_list" v-show="PickShow == false">
          <div class="Goods_item" :class="'lv_' + item.lv" v-for="(item, index) in TakingLists" :key="index">
            <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ item.bean }}</div>
            <div class="dura_alias">{{ item.dura_alias }}</div>
            <div class="Goods_pic" :style="{ 'background-image': 'url(' + item.lv_bg_image + ')' }">
              <img :src="item.cover" alt="" />
            </div>
            <p>{{ item.name }}</p>
            <div class="btn" style="padding-top: 10px">
              <p :style="{ color: item.status == '1' ? '#77b300' : '#fc63cf' }">{{ item.status_alias == '申请提货' ? '提货中' : item.status_alias }}</p>
            </div>
          </div>
        </div>

        <div class="PageNum" :key="this.PickCode">
          <el-pagination background layout="prev, pager, next" @current-change="PickChange" :page-size="TakingListper_page" :total="TakingListPageNum"> </el-pagination>
        </div>
      </div>

      <div class="GoodsList" v-show="SwitchState == true">
        <van-loading class="vant-load WD650" v-show="loadingShow == true" color="#000000" size="60" />
        <div class="Goods_list" v-show="loadingShow == false">
          <div class="Goods_item" :class="'lv_' + item.lv" v-for="(item, index) in WarehouseLists" :key="index" ref="Select" @click="Select(item, index)">
            <div class="odds_percent"><img src="@/assets/images/public/Gold.png" alt="" /> {{ item.bean }}</div>
            <div class="dura_alias">{{ item.dura_alias }}</div>
            <div class="Goods_pic" :style="{ 'background-image': 'url(' + item.lv_bg_image + ')' }">
              <img :src="item.cover" alt="" />
            </div>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="PageNum">
          <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="per_page" :total="PageNum"> </el-pagination>
        </div>
      </div>

      <!-- 赠送 -->
      <van-overlay :show="GiveShow">
        <div class="wrapper">
          <div class="wrapper-box">
            <div class="wrapper-box-top"></div>
            <div class="cancel">
              <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="CloseGiveShow" />
            </div>
            <div class="tit">赠送好友</div>
            <div class="pic">
              <img :src="GiveImg" alt="" />
            </div>
            <form>
              <div class="other">
                <p>请输入对方邀请码</p>
                <input type="text" v-model="Invitation_code" />
              </div>
            </form>
            <div class="btns">
              <span @click="CloseGiveShow">取消赠送</span>
              <span class="btn-two" @click="GetGive">确定赠送</span>
            </div>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {
  Storage,
  Extract,
  Cash,
  Give,
  PersonalInfo
} from '@/network/api.js'
import {
  mapMutations
} from 'vuex'
export default {
  name: '',
  data () {
    return {
      WarehouseLists: [],
      loadingShow: true,
      PageNum: 0,
      Select_All: false,
      GiveShow: false,
      GiveImg: null,
      GiveId: '',
      Invitation_code: '',
      per_page: 10,
      page_Num: 1,


      TakeOption: [{
        text: '提货中',
        value: 4
      }, {
        text: '正在发货',
        value: 5
      }, {
        text: '等待收货',
        value: 6
      }, {
        text: '提货完成',
        value: 1
      }],
      TakeValue: 4,

      SwitchState: true,

      //提货
      TakingLists: [],
      TakingListPageNum: 0,
      TakingListper_page: 0,

      PickSwitch: 1,

      PickCode: '4', //提货状态相关
      PickShow: true,

      selectPrice: 0

    }
  },

  created () {
    this.GetStorage(1)
  },


  methods: {
    //仓库与提货列表选项卡
    GetGoodsList () {
      this.loadingShow = true
      this.SwitchState = true
      this.GetStorage(1)
    },

    GetExtractList () {
      this.SwitchState = false
      this.PickSwitch = 4
      this.GetTakingList(1, 4)
    },


    //提货过程列表
    PickTHZ (num) {
      this.PickShow = true
      this.PickSwitch = num
      this.PickCode = num
      this.GetTakingList(1, num)
    },

    //提货列表
    GetTakingList (num, code) {
      Storage(num, code).then((res) => {
        // console.log(res)
        this.TakingLists = res.data.data.data
        this.TakingListPageNum = Number(res.data.data.total)
        this.TakingListper_page = Number(res.data.data.per_page)
      })
    },

    //提货列表分页
    PickChange (val) {
      // console.log(val)
      this.PickShow = true
      this.GetTakingList(val, this.PickCode)
    },

    //获取仓库列表(第一页)
    GetStorage (num) {
      // console.log(num == '1')
      this.loadingShow = true
      Storage(num).then((res) => {
        // console.log(res)
        if (res.data.data.data.length > 0) {
          this.WarehouseLists = res.data.data.data
          this.PageNum = Number(res.data.data.total)
          this.per_page = Number(res.data.data.per_page)
        } else {
          if (num == '1') {
            this.WarehouseLists = res.data.data.data
            this.PageNum = Number(res.data.data.total)
            this.per_page = Number(res.data.data.per_page)
            this.loadingShow = false
          } else {
            this.GetStorage('1')
          }

        }


      })
    },

    // 仓库列表分页
    handleCurrentChange (val) {
      this.GetStorage(val)
      this.page_Num = val
      // console.log(this.page_Num)
    },

    //赠送弹框
    OpenGetGive (item) {
      // console.log(item)
      this.GiveImg = item.cover
      this.GiveId = item.id
      this.GiveShow = true
    },

    // 赠送
    GetGive () {
      Give(this.GiveId, this.Invitation_code).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.GiveShow = false
          this.GetStorage(this.page_Num)

        }
      })
    },

    //关闭赠送弹框
    CloseGiveShow () {
      this.GiveImg = null
      this.GiveId = ''
      this.GiveShow = false
    },


    //多选提取
    WholeExtract () {
      if (this.WarehouseLists.length <= 0) {
        this.$message({
          message: '背包已空空如也，前往开箱赢取更多装备吧。',
          type: 'error'
        })
        return false;
      }
      let arr = this.WarehouseLists.filter((item) => {
        return item.Select == true
      })

      let data = []
      for (let i = 0; i < arr.length; i++) {
        data.push({
          "id": arr[i].id
        })
      }
      Extract(JSON.stringify(data)).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.GetStorage(this.page_Num)
          this.GetPersonalInfo()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },


    //单次回收
    GetCash (id) {
      let data = [{
        "id": id
      }]
      Cash(JSON.stringify(data)).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.GetPersonalInfo()
          this.GetStorage(this.page_Num)
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },

    //多选回收
    WholeCash () {
      if (this.WarehouseLists.length <= 0) {
        this.$message({
          message: '背包已空空如也，前往开箱赢取更多装备吧。',
          type: 'error'
        })
        return false;
      }
      let arr = this.WarehouseLists.filter((item) => {
        return item.Select == true
      })

      let data = []
      for (let i = 0; i < arr.length; i++) {
        data.push({
          "id": arr[i].id
        })
      }
      Cash(JSON.stringify(data)).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.GetPersonalInfo()
          this.GetStorage(this.page_Num)
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },

    //选中
    Select (item, index) {
      if (item.Select) {
        delete item.Select
        this.$refs.Select[index].style.border = "1px solid #1b1f36"
        this.selectPrice = Number((this.selectPrice - Number(item.bean)).toFixed(2))
      } else {
        let key = "Select";
        let value = true
        item[key] = value
        this.$refs.Select[index].style.border = "1px solid #E9B10E"
        this.selectPrice = Number((this.selectPrice + Number(item.bean)).toFixed(2))
      }
      // console.log(this.selectPrice)
    },

    //全选
    SelectAll () {
      this.selectPrice = 0
      if (this.Select_All == false) {
        for (let i = 0; i < this.WarehouseLists.length; i++) {
          let key = "Select";
          let value = true
          this.WarehouseLists[i][key] = value
          this.$refs.Select[i].style.border = "1px solid #E9B10E"
          this.selectPrice = Number((this.selectPrice + Number(this.WarehouseLists[i]['bean'])).toFixed(2))
        }
        this.Select_All = true
      } else {
        for (let i = 0; i < this.WarehouseLists.length; i++) {
          delete this.WarehouseLists[i].Select
          this.$refs.Select[i].style.border = "1px solid #1b1f36"
        }
        this.Select_All = false
      }
    },

    //个人信息
    GetPersonalInfo () {
      PersonalInfo().then((res) => {
        this.User(res.data.message)
      })
    },


    ...mapMutations([
      'User'
    ])

  },

  watch: {
    WarehouseLists (val) {
      for (let i = 0; i < this.WarehouseLists.length; i++) {
        delete this.WarehouseLists[i].Select
        setTimeout(() => {
          if (this.$refs.Select) {
            this.$refs.Select[i].style.border = "1px solid #1b1f36"
          }
          this.loadingShow = false
        }, 100)
      }
      this.Select_All = false
    },

    TakingLists (val) {
      this.PickShow = false
    },

    TakeValue (v) {
      // console.log(v)
      this.PickCode = String(v)
      this.GetTakingList(1, String(v))
    }
  }
}
</script>

<style lang="scss">
.Warehouse-box {
  width: 100%;
  padding: 0.4rem 0.2rem;
  box-sizing: border-box;

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
      margin-bottom: 10px;
      margin-right: 1%;
      padding: 20px 0 10px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
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

    .operation {
      width: 50%;
      height: 0.36rem;
      display: flex;
      flex-direction: row-reverse;

      p {
        height: 100%;
        padding: 0 0.3rem;
        border-color: #fb63d0;
        background: rgba($color: #fb63d0, $alpha: 0.5);
        color: #fff;
        line-height: 0.36rem;
        text-align: center;
        margin-left: 0.1rem;
        font-size: 0.16rem;
        cursor: pointer;
      }
    }

    .DeliverBar {
      width: 50%;
      height: 0.36rem;
      display: flex;
      flex-direction: row-reverse;

      p {
        height: 100%;
        padding: 0 0.3rem;
        background: #bbb;
        line-height: 0.36rem;
        text-align: center;
        margin-left: 0.1rem;
        font-size: 0.16rem;
        cursor: pointer;
        border-radius: 0.02rem;
        color: #000;

        &.active {
          background: #ffd322;
        }
      }
    }
  }

  .WD650 {
    width: 100%;
    height: 7.28rem;
    text-align: center;
    line-height: 7.3rem;
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

  .ExtractList-List {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.4rem;

    .ExtractList-List-item {
      width: 2rem;
      background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
      background-size: cover;
      border-radius: 0.08rem;
      overflow: hidden;
      color: #ccc;
      margin-right: 0.26rem;
      margin-bottom: 0.26rem;
      cursor: pointer;
      box-sizing: border-box;

      &:nth-child(5n) {
        margin-right: 0;
      }

      &.active {
        border: 1px solid red;
      }

      .MBX {
        width: 100%;
        height: 0.4rem;
        padding: 0 0.2rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 0.4rem;

        p {
          font-size: 0.16rem;
          color: #fff;
          font-weight: bold;
          display: flex;
          align-items: center;

          img {
            width: 0.2rem;
            margin-right: 0.03rem;
          }
        }

        span {
          font-size: 0.14rem;
          color: #e08902;
          border: none;
        }
      }

      .pic {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0.1rem auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      p {
        text-align: center;
        font-size: 0.12rem;
      }
    }
  }

  .Warehouse-List {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.4rem;

    .Warehouse-List-item {
      width: 2rem;
      background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
      background-size: cover;
      border-radius: 0.08rem;
      overflow: hidden;
      color: #ccc;
      margin-right: 0.13rem;
      margin-bottom: 0.26rem;
      padding: 0.2rem 0;
      cursor: pointer;
      box-sizing: border-box;
      border: 1px solid #1b1f36;

      &:nth-child(5n) {
        margin-right: 0;
      }

      &.active {
        border: 1px solid red;
      }

      .MBX {
        width: 100%;
        height: 0.3rem;
        padding: 0 0.2rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 0.3rem;

        p {
          font-size: 0.16rem;
          color: #fff;
          font-weight: bold;
          display: flex;
          align-items: center;

          img {
            width: 0.2rem;
            margin-right: 0.03rem;
          }

          span {
            color: #fff;
            margin: 0;
          }
        }

        span {
          font-size: 0.12rem;
          color: #e08902;
          border: none;
          margin: 0;
        }
      }

      .pic {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0.1rem auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      p {
        text-align: center;
        font-size: 0.12rem;
      }

      span {
        display: block;
        text-align: center;
        font-size: 0.12rem;
        color: #e08902;
        margin: 0.1rem auto 0;
      }
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .wrapper-box {
      z-index: 2001;

      .wrapper-box-top {
        width: 100%;
        height: 0.03rem;
        background: linear-gradient(90deg, transparent, rgba(72, 84, 201, 0.8), transparent);
      }

      width: 5rem;
      height: 5.5rem;
      position: relative;
      border: 1px solid #4854c9;
      background-color: #1e2355;
      border-radius: 0.08rem;
      overflow: hidden;
      padding: 0 0.35rem;
      box-sizing: border-box;

      .tit {
        width: 100%;
        font-size: 0.24rem;
        text-align: center;
        line-height: 0.8rem;
      }

      .other {
        width: 100%;
        height: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.2rem;

        p {
          font-size: 0.18rem;
          margin-right: 0.2rem;
        }

        input {
          height: 0.4rem;
          width: 1rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.6);
          color: #e52131;
          border-radius: 0.04rem;
          line-height: 0.4rem;
          text-align: center;
          font-size: 0.18rem;
        }
      }

      .pic {
        width: 2.75rem;
        height: 2.75rem;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.04rem;
        overflow: hidden;

        img {
          max-width: 80%;
          max-height: 80%;
        }
      }

      .btns {
        width: 100%;
        height: 0.5rem;
        display: flex;
        justify-content: center;
        margin-top: 0.2rem;

        span {
          display: block;
          width: 1.65rem;
          height: 0.5rem;
          background: hsla(0, 0%, 100%, 0.06);
          border: 1px solid hsla(0, 0%, 100%, 0.2);
          color: #e4e4e4;
          border-radius: 0.04rem;
          text-align: center;
          line-height: 0.5rem;
          font-size: 0.14rem;
          margin-right: 0.2rem;
          cursor: pointer;
        }

        .btn-two {
          margin-right: 0;
          background: #4854c9;
          border-color: #4854c9;
        }
      }

      .info {
        margin-top: 0.3rem;
        text-align: center;
        font-size: 0.12rem;
        color: rgba(255, 255, 255, 0.53);
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
  .Warehouse-box {
    width: 100%;
    padding: 0.4rem 0.2rem;
    box-sizing: border-box;

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
        margin-bottom: 10px;
        margin-right: 1%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
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

      .operation {
        width: 50%;
        height: 0.36rem;
        display: flex;
        flex-direction: row-reverse;

        p {
          height: 100%;
          padding: 0 0.3rem;
          border-color: #fb63d0;
          background: rgba($color: #fb63d0, $alpha: 0.5);
          color: #fff;
          line-height: 0.36rem;
          text-align: center;
          margin-left: 0.1rem;
          font-size: 0.16rem;
          cursor: pointer;
        }
      }

      .DeliverBar {
        width: 50%;
        height: 0.36rem;
        display: flex;
        flex-direction: row-reverse;

        p {
          height: 100%;
          padding: 0 0.3rem;
          background: #bbb;
          line-height: 0.36rem;
          text-align: center;
          margin-left: 0.1rem;
          font-size: 0.16rem;
          cursor: pointer;
          border-radius: 0.02rem;
          color: #000;

          &.active {
            background: #ffd322;
          }
        }
      }
    }

    .WD650 {
      width: 100%;
      height: 7.28rem;
      text-align: center;
      line-height: 7.3rem;
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

    .ExtractList-List {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.4rem;

      .ExtractList-List-item {
        width: 2rem;
        background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
        background-size: cover;
        border-radius: 0.08rem;
        overflow: hidden;
        color: #ccc;
        margin-right: 0.26rem;
        margin-bottom: 0.26rem;
        cursor: pointer;
        box-sizing: border-box;

        &:nth-child(5n) {
          margin-right: 0;
        }

        &.active {
          border: 1px solid red;
        }

        .MBX {
          width: 100%;
          height: 0.4rem;
          padding: 0 0.2rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 0.4rem;

          p {
            font-size: 0.16rem;
            color: #fff;
            font-weight: bold;
            display: flex;
            align-items: center;

            img {
              width: 0.2rem;
              margin-right: 0.03rem;
            }
          }

          span {
            font-size: 0.14rem;
            color: #e08902;
            border: none;
          }
        }

        .pic {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0.1rem auto;
          display: flex;
          justify-content: center;
          align-items: center;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        p {
          text-align: center;
          font-size: 0.12rem;
        }
      }
    }

    .Warehouse-List {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.4rem;

      .Warehouse-List-item {
        width: 2rem;
        background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
        background-size: cover;
        border-radius: 0.08rem;
        overflow: hidden;
        color: #ccc;
        margin-right: 0.13rem;
        margin-bottom: 0.26rem;
        padding: 0.2rem 0;
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid #1b1f36;

        &:nth-child(5n) {
          margin-right: 0;
        }

        &.active {
          border: 1px solid red;
        }

        .MBX {
          width: 100%;
          height: 0.3rem;
          padding: 0 0.2rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 0.3rem;

          p {
            font-size: 0.16rem;
            color: #fff;
            font-weight: bold;
            display: flex;
            align-items: center;

            img {
              width: 0.2rem;
              margin-right: 0.03rem;
            }

            span {
              color: #fff;
              margin: 0;
            }
          }

          span {
            font-size: 0.12rem;
            color: #e08902;
            border: none;
            margin: 0;
          }
        }

        .pic {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0.1rem auto;
          display: flex;
          justify-content: center;
          align-items: center;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        p {
          text-align: center;
          font-size: 0.12rem;
        }

        span {
          display: block;
          text-align: center;
          font-size: 0.12rem;
          color: #e08902;
          margin: 0.1rem auto 0;
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .wrapper-box {
        z-index: 2001;

        .wrapper-box-top {
          width: 100%;
          height: 0.03rem;
          background: linear-gradient(90deg, transparent, rgba(72, 84, 201, 0.8), transparent);
        }

        width: 5rem;
        height: 5.5rem;
        position: relative;
        border: 1px solid #4854c9;
        background-color: #1e2355;
        border-radius: 0.08rem;
        overflow: hidden;
        padding: 0 0.35rem;
        box-sizing: border-box;

        .tit {
          width: 100%;
          font-size: 0.24rem;
          text-align: center;
          line-height: 0.8rem;
        }

        .other {
          width: 100%;
          height: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.2rem;

          p {
            font-size: 0.18rem;
            margin-right: 0.2rem;
          }

          input {
            height: 0.4rem;
            width: 1rem;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.6);
            color: #e52131;
            border-radius: 0.04rem;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.18rem;
          }
        }

        .pic {
          width: 2.75rem;
          height: 2.75rem;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.04rem;
          overflow: hidden;

          img {
            max-width: 80%;
            max-height: 80%;
          }
        }

        .btns {
          width: 100%;
          height: 0.5rem;
          display: flex;
          justify-content: center;
          margin-top: 0.2rem;

          span {
            display: block;
            width: 1.65rem;
            height: 0.5rem;
            background: hsla(0, 0%, 100%, 0.06);
            border: 1px solid hsla(0, 0%, 100%, 0.2);
            color: #e4e4e4;
            border-radius: 0.04rem;
            text-align: center;
            line-height: 0.5rem;
            font-size: 0.14rem;
            margin-right: 0.2rem;
            cursor: pointer;
          }

          .btn-two {
            margin-right: 0;
            background: #4854c9;
            border-color: #4854c9;
          }
        }

        .info {
          margin-top: 0.3rem;
          text-align: center;
          font-size: 0.12rem;
          color: rgba(255, 255, 255, 0.53);
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
  .Warehouse-box {
    width: 100%;
    padding: 0.4rem 0.2rem;
    box-sizing: border-box;

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
        margin-bottom: 10px;
        margin-right: 1%;
        padding: 20px 0 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
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

      .operation {
        width: 50%;
        height: 0.36rem;
        display: flex;
        flex-direction: row-reverse;

        p {
          height: 100%;
          padding: 0 0.3rem;
          border-color: #fb63d0;
          background: rgba($color: #fb63d0, $alpha: 0.5);
          color: #fff;
          line-height: 0.36rem;
          text-align: center;
          margin-left: 0.1rem;
          font-size: 0.16rem;
          cursor: pointer;
        }
      }

      .DeliverBar {
        width: 50%;
        height: 0.36rem;
        display: flex;
        flex-direction: row-reverse;

        p {
          height: 100%;
          padding: 0 0.3rem;
          background: #bbb;
          line-height: 0.36rem;
          text-align: center;
          margin-left: 0.1rem;
          font-size: 0.16rem;
          cursor: pointer;
          border-radius: 0.02rem;
          color: #000;

          &.active {
            background: #ffd322;
          }
        }
      }
    }

    .WD650 {
      width: 100%;
      height: 7.28rem;
      text-align: center;
      line-height: 7.3rem;
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

    .ExtractList-List {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.4rem;

      .ExtractList-List-item {
        width: 2rem;
        background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
        background-size: cover;
        border-radius: 0.08rem;
        overflow: hidden;
        color: #ccc;
        margin-right: 0.26rem;
        margin-bottom: 0.26rem;
        cursor: pointer;
        box-sizing: border-box;

        &:nth-child(5n) {
          margin-right: 0;
        }

        &.active {
          border: 1px solid red;
        }

        .MBX {
          width: 100%;
          height: 0.4rem;
          padding: 0 0.2rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 0.4rem;

          p {
            font-size: 0.16rem;
            color: #fff;
            font-weight: bold;
            display: flex;
            align-items: center;

            img {
              width: 0.2rem;
              margin-right: 0.03rem;
            }
          }

          span {
            font-size: 0.14rem;
            color: #e08902;
            border: none;
          }
        }

        .pic {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0.1rem auto;
          display: flex;
          justify-content: center;
          align-items: center;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        p {
          text-align: center;
          font-size: 0.12rem;
        }
      }
    }

    .Warehouse-List {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.4rem;

      .Warehouse-List-item {
        width: 2rem;
        background: url(../../assets/images/public/back_pub.jpg) no-repeat center;
        background-size: cover;
        border-radius: 0.08rem;
        overflow: hidden;
        color: #ccc;
        margin-right: 0.13rem;
        margin-bottom: 0.26rem;
        padding: 0.2rem 0;
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid #1b1f36;

        &:nth-child(5n) {
          margin-right: 0;
        }

        &.active {
          border: 1px solid red;
        }

        .MBX {
          width: 100%;
          height: 0.3rem;
          padding: 0 0.2rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 0.3rem;

          p {
            font-size: 0.16rem;
            color: #fff;
            font-weight: bold;
            display: flex;
            align-items: center;

            img {
              width: 0.2rem;
              margin-right: 0.03rem;
            }

            span {
              color: #fff;
              margin: 0;
            }
          }

          span {
            font-size: 0.12rem;
            color: #e08902;
            border: none;
            margin: 0;
          }
        }

        .pic {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0.1rem auto;
          display: flex;
          justify-content: center;
          align-items: center;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        p {
          text-align: center;
          font-size: 0.12rem;
        }

        span {
          display: block;
          text-align: center;
          font-size: 0.12rem;
          color: #e08902;
          margin: 0.1rem auto 0;
        }
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .wrapper-box {
        z-index: 2001;

        .wrapper-box-top {
          width: 100%;
          height: 0.03rem;
          background: linear-gradient(90deg, transparent, rgba(72, 84, 201, 0.8), transparent);
        }

        width: 5rem;
        height: 5.5rem;
        position: relative;
        border: 1px solid #4854c9;
        background-color: #1e2355;
        border-radius: 0.08rem;
        overflow: hidden;
        padding: 0 0.35rem;
        box-sizing: border-box;

        .tit {
          width: 100%;
          font-size: 0.24rem;
          text-align: center;
          line-height: 0.8rem;
        }

        .other {
          width: 100%;
          height: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.2rem;

          p {
            font-size: 0.18rem;
            margin-right: 0.2rem;
          }

          input {
            height: 0.4rem;
            width: 1rem;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.6);
            color: #e52131;
            border-radius: 0.04rem;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.18rem;
          }
        }

        .pic {
          width: 2.75rem;
          height: 2.75rem;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.04rem;
          overflow: hidden;

          img {
            max-width: 80%;
            max-height: 80%;
          }
        }

        .btns {
          width: 100%;
          height: 0.5rem;
          display: flex;
          justify-content: center;
          margin-top: 0.2rem;

          span {
            display: block;
            width: 1.65rem;
            height: 0.5rem;
            background: hsla(0, 0%, 100%, 0.06);
            border: 1px solid hsla(0, 0%, 100%, 0.2);
            color: #e4e4e4;
            border-radius: 0.04rem;
            text-align: center;
            line-height: 0.5rem;
            font-size: 0.14rem;
            margin-right: 0.2rem;
            cursor: pointer;
          }

          .btn-two {
            margin-right: 0;
            background: #4854c9;
            border-color: #4854c9;
          }
        }

        .info {
          margin-top: 0.3rem;
          text-align: center;
          font-size: 0.12rem;
          color: rgba(255, 255, 255, 0.53);
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
