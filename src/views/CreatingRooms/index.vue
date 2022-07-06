<template>
  <div id="CreatingRooms">
    <div style="width: 100%; height: 0.4rem"></div>
    <div class="CreatingRooms-box">
      <div class="Title">
        <p>创建房间</p>
        <div class="Title-lower"></div>
      </div>
      <div class="Creating-box">
        <div class="room-box">
          <el-form :model="SaveForm" status-icon :rules="SaveRules" ref="SaveForm" label-width="1.4rem" class="demo-ruleForm">
            <div class="one">
              <el-form-item label="房间名称" prop="name">
                <el-input v-model="SaveForm.name" :maxLength="30" style="width: 4red"></el-input>
              </el-form-item>
              <el-form-item label="结束时间">
                <div class="Draw-box">
                  <el-date-picker v-model="DrawDate" type="date" :editable="false" style="width: 3.35rem; margin-right: 0.4rem"> </el-date-picker>

                  <el-time-select v-model="DrawTime" :picker-options="{ start: '01:00', step: '00:30', end: '24:00' }" :editable="false" style="width: 3.35rem"> </el-time-select>
                </div>
              </el-form-item>
            </div>
            <div class="two">
              <el-form-item label="最大人数" prop="NumberPeople">
                <el-input type="number" v-model="SaveForm.NumberPeople"></el-input>
              </el-form-item>
              <el-form-item label="房间密码">
                <el-input type="password" v-model="SaveForm.pass"></el-input>
              </el-form-item>
              <el-form-item label="最小充值金额" style="margin-left: 40px">
                <el-input v-model="SaveForm.money"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="房间描述" style="margin-top: 10px; margin-bottom: 30px">
              <el-input type="text" v-model="SaveForm.describe" :maxLength="255" :rows="3" style="width: 86%"></el-input>
            </el-form-item>
            <div class="Prize-selection">
              <div class="SelectedPrizes-title">选择奖品</div>
              <div class="SelectedPrizes-list">
                <div class="SelectedPrizes-item" v-for="(item, index) in PrizeLists" :key="index">
                  <p class="btn" @click="DeletePrize(index)">删除奖品</p>
                  <div class="pic">
                    <img v-lazy="item.img" alt="" />
                  </div>
                  <p>{{ item.name | GuoLvOne }}</p>
                </div>
              </div>
              <div class="KCK" @click="Changedrawer">个人背包</div>
            </div>

            <div class="subordinate" style="margin-top: 20px">
              <div class="Press" :class="{ active: this.me_inviter == '1' }" @click="PostMe_inviter"></div>
              <p>仅限个人推广下级用户参与本房间</p>
            </div>
          </el-form>
        </div>

        <div class="btns">
          <span @click="QvXiao">取消创建</span>
          <span class="btn-two" @click="ConfirmCreation">确定创建</span>
        </div>
      </div>
    </div>

    <el-drawer :visible.sync="drawer" close-on-press-escape direction="rtl" :with-header="false">
      <div class="title">个人背包</div>
      <van-loading class="vant-load WD650" v-show="loadingShow == true" color="#000000" size="60" />
      <div class="CK-list" v-show="loadingShow == false">
        <div class="CK-item" v-for="(item, index) in WarehouseLists" :key="index">
          <div class="top">
            <p><img src="@/assets/images/public/Gold.png" alt="" />{{ item.bean }}</p>
            <div class="btn" @click="SelectPrize(item)">选择</div>
          </div>
          <div class="pic">
            <img v-lazy="item.cover" alt="" />
          </div>
          <div class="name">{{ item.name | GuoLvOne }}</div>
        </div>
      </div>
      <div class="PageNum">
        <el-pagination background layout="prev,pager, next" @current-change="handleCurrentChange" small :page-size="per_page" :total="PageNum"> </el-pagination>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  Storage,
  RoomSave
} from '@/network/api.js'
export default {
  name: 'CreatingRooms',
  data () {
    return {
      //抽屉开关
      drawer: false,

      determine: false,

      //仓库列表
      WarehouseLists: [],
      PageNum: 0,
      per_page: 10,
      loadingShow: false,

      //奖品列表
      PrizeLists: [],
      repeat: [],

      //开奖日期+时间
      DrawDate: '',
      DrawTime: '',

      //仅下级参与
      me_inviter: '0',

      //表单信息
      SaveForm: {
        name: '',
        NumberPeople: '',
        describe: '',
        pass: '',
        money: ''
      },
      box_record_ids: [],
      realTime: '',
      //表单验证
      SaveRules: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],

        NumberPeople: [{
          required: true,
          message: '请输入人数上限',
          trigger: 'blur'
        }],

        time: [{
          required: true,
          message: '请选择时间',
          trigger: 'blur'
        }]
      }
    }
  },

  created () {
    this.GetStorage('1')
  },

  filters: {
    GuoLvOne (val) {
      if (val.length > 12) {
        return val.substr(0, 11)
      } else {
        return val
      }
    }
  },

  methods: {
    //是否启用仅下级参与
    PostMe_inviter () {
      this.me_inviter == '0' ? this.me_inviter = '1' : this.me_inviter = '0'
    },

    //确认创建
    ConfirmCreation () {
      this.determine = true
      if (this.DrawDate != '' && this.DrawTime != '') {
        let Year = this.DrawDate.getFullYear()
        let Month = (this.DrawDate.getMonth() + 1) < 10 ? '0' + (this.DrawDate.getMonth() + 1) : this.DrawDate.getMonth() + 1
        let Day = this.DrawDate.getDate() < 10 ? '0' + this.DrawDate.getDate() : this.DrawDate.getDate()
        this.realTime = Year + '-' + Month + '-' + Day + ' ' + this.DrawTime + ':00'

        // console.log(this.realTime)

        for (let i = 0; i < this.PrizeLists.length; i++) {
          this.box_record_ids.push(this.PrizeLists[i].id)
        }
        if (this.box_record_ids.length >= 1) {
          RoomSave(this.SaveForm.name, this.realTime, Number(this.SaveForm.NumberPeople), this.box_record_ids, this.SaveForm.describe, this.SaveForm.pass, Number(this.SaveForm.money), this.me_inviter).then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "创建成功!",
                type: 'success'
              })

              this.determine = false
              this.emptyForm()
              this.$router.replace('/Roll')
            } else {
              this.$message({
                message: res.data.code.message,
                type: 'error'
              })

              this.determine = false
              this.emptyForm()
            }
            this.GetStorage('1')
          })
        } else {
          this.$message({
            message: "最选择奖品!",
            type: 'error'
          })
          this.determine = false
        }


      } else {
        this.$message({
          message: "请选择开奖日期!",
          type: 'error'
        })
        this.determine = false
      }
    },

    //取消
    QvXiao () {
      this.emptyForm()
      this.$router.go(-1)
    },

    //清空表单信息
    emptyForm () {
      this.SaveForm.name = ''
      this.SaveForm.NumberPeople = ''
      this.SaveForm.describe = ''
      this.SaveForm.pass = ''
      this.SaveForm.money = ''
      this.box_record_ids = []
      this.realTime = ''
      this.PrizeLists = []
    },

    //获取仓库列表(第一页)
    GetStorage (num) {
      this.loadingShow = true
      Storage(num).then((res) => {
        this.WarehouseLists = res.data.data.data
        this.PageNum = Number(res.data.data.total)
        this.per_page = Number(res.data.data.per_page)
      })
    },

    // 仓库列表分页
    handleCurrentChange (val) {
      this.GetStorage(val)
    },

    //打开抽屉
    Changedrawer () {
      this.drawer = true
    },

    //选中奖品
    SelectPrize (item) {
      this.repeat = this.PrizeLists.filter((i) => {
        return i.id == item.id
      })


      if (this.repeat.length == 0) {
        this.PrizeLists.push({
          "id": item.id,
          "img": item.cover,
          "name": item.name
        })
        this.repeat = []
      } else {
        this.$message({
          message: "奖品不可重复!",
          type: 'error'
        })
        this.repeat = []
      }
    },

    //删除奖品
    DeletePrize (index) {
      this.PrizeLists.splice(index, 1)
    }
  },
  watch: {
    WarehouseLists (val) {
      this.loadingShow = false
    }
  }
}
</script>

<style lang="scss">
.CreatingRooms-box {
  width: 14rem;
  background-color: #6e2c9b !important;
  background-size: cover;
  padding: 0.4rem 0.2rem 0.4rem;
  box-sizing: border-box;
  input {
    background-color: #d2a9fd;
    color: #3b0065;
  }
  .Draw-box {
    display: flex;
  }
  .Creating-box {
    width: 100%;
    margin-top: 0.6rem;
    padding-bottom: 0.1rem;
    .el-textarea__inner {
      line-height: 0.8;
    }
    .el-form-item__label {
      color: #fff !important;
    }
    .el-input__icon {
      color: #3b0065;
    }
    .room-box {
      width: 100%;
      .one {
        display: flex;
      }
      .two {
        display: flex;
      }
      .Prize-selection {
        width: 100%;
        display: flex;
        align-items: center;
        .SelectedPrizes-title {
          font-size: 0.18rem;
          width: 1.4rem;
          padding-left: 0.54rem;
          color: #fff;
          box-sizing: border-box;
        }
        .SelectedPrizes-list {
          width: 10.2rem;
          min-height: 1rem;
          border: 4px solid #d2a9fd;
          box-sizing: border-box;
          padding: 0.1rem;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          .SelectedPrizes-item {
            width: 1.56rem;
            margin: 0.05rem 0.1rem 0.05rem 0;
            background: rgba(0, 0, 0, 0.2);
            &:nth-child(6n) {
              margin-right: 0;
            }
            p {
              width: 100%;
              height: 0.3rem;
              text-align: center;
              line-height: 0.3rem;
              font-size: 0.14rem;
              color: #fff;
              border-bottom: 0.01rem solid #5a2a93;
              &:first-child {
                cursor: pointer;
              }
              &:last-child {
                border-top: 0.01rem solid #5a2a93;
                border-bottom: none;
              }
            }
            .pic {
              width: 1rem;
              height: 1rem;
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                max-width: 100%;
                max-width: 100%;
              }
            }
          }
        }
        .KCK {
          margin-left: 0.2rem;
          width: 1rem;
          height: 0.4rem;
          text-align: center;
          line-height: 0.4rem;
          font-size: 0.14rem;
          color: #fff;
          background: #a160c0;
          border-radius: 100px;
          cursor: pointer;
        }
      }

      .subordinate {
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 1.4rem;
        box-sizing: border-box;
        p {
          height: 0.2rem;
          font-size: 0.24rem;
          color: #d2a9fd;
          line-height: 0.2rem;
        }
        .Press {
          width: 0.2rem;
          height: 0.2rem;
          margin-right: 0.05rem;
          background: rgba(255, 255, 255, 0.06);
          border: 4px solid #d2a9fd;
          border-radius: 50%;
          box-sizing: border-box;
          cursor: pointer;
          &.active {
            background: #ff38b6;
            border: 4px solid #d2a9fd;
          }
        }
      }
    }
    .btns {
      width: 100%;
      height: 0.6rem;
      display: flex;
      justify-content: center;
      margin-top: 0.2rem;
      span {
        display: block;
        width: 1.85rem;
        height: 0.6rem;
        background: hsla(0, 0%, 100%, 0.06);
        border: 1px solid hsla(0, 0%, 100%, 0.2);
        color: #e4e4e4;
        border-radius: 0.04rem;
        text-align: center;
        line-height: 0.6rem;
        font-size: 0.18rem;
        margin-right: 1rem;
        cursor: pointer;
      }
      .btn-two {
        margin-right: 0;
        background: #a160c0;
        border-color: #a160c0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        img {
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.05rem;
        }
      }
    }
  }
}
.el-drawer__body {
  background: #6e2c9b !important;
  .WD650 {
    position: absolute;
    top: 45%;
    left: 45%;
  }
  .PageNum {
    width: 2rem;
    text-align: center;
    position: absolute;
    bottom: 0.8rem;
    right: 1.8rem;
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
  .title {
    width: 100%;
    text-align: center;
    line-height: 0.6rem;
    color: #fff;
    font-size: 0.22rem;
  }
  .CK-list {
    width: 100%;
    padding: 0 0.2rem;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .CK-item {
      width: 1.7rem;
      margin-right: 0.1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.02rem;
      margin-top: 0.25rem;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.3rem;
        border-bottom: 0.01rem solid #5a2a93 !important;
        p {
          width: 50%;
          height: 0.3rem;
          color: #fff;
          font-size: 0.14rem;
          text-align: center;
          line-height: 0.3rem;
          border-right: 0.01rem solid #5a2a93;
          box-sizing: border-box;
          color: #ffd728;
          img {
            width: 20px;
            transform: translateY(5px);
          }
        }
        .btn {
          color: #fff;
          font-size: 0.14rem;
          line-height: 0.3rem;
          text-align: center;
          width: 50%;
          cursor: pointer;
          &:hover {
            background: #a160c0;
          }
        }
      }
      .pic {
        width: 1rem;
        height: 1rem;
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
        width: 100%;
        height: 0.5rem;
        border-top: 0.01rem solid #5a2a93;
        text-align: center;
        line-height: 0.5rem;
        color: #d2a9fd;
        font-size: 0.14rem;
      }
    }
  }
}

@media screen and (min-width: 1920px) {
  .CreatingRooms-box {
    width: 14rem;
    background-color: #6e2c9b !important;
    background-size: cover;
    padding: 0.4rem 0.2rem 0.4rem;
    box-sizing: border-box;
    input {
      background-color: #d2a9fd;
      color: #3b0065;
    }
    .Draw-box {
      display: flex;
    }
    .Creating-box {
      width: 100%;
      margin-top: 0.6rem;
      padding-bottom: 0.1rem;
      .el-textarea__inner {
        line-height: 0.8;
      }
      .el-form-item__label {
        color: #fff !important;
      }
      .el-input__icon {
        color: #3b0065;
      }
      .room-box {
        width: 100%;
        .one {
          display: flex;
        }
        .two {
          display: flex;
        }
        .Prize-selection {
          width: 100%;
          display: flex;
          align-items: center;
          .SelectedPrizes-title {
            font-size: 0.18rem;
            width: 1.4rem;
            padding-left: 0.54rem;
            color: #fff;
            box-sizing: border-box;
          }
          .SelectedPrizes-list {
            width: 10.2rem;
            min-height: 1rem;
            border: 4px solid #d2a9fd;
            box-sizing: border-box;
            padding: 0.1rem;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            .SelectedPrizes-item {
              width: 1.56rem;
              margin: 0.05rem 0.1rem 0.05rem 0;
              background: rgba(0, 0, 0, 0.2);
              &:nth-child(6n) {
                margin-right: 0;
              }
              p {
                width: 100%;
                height: 0.3rem;
                text-align: center;
                line-height: 0.3rem;
                font-size: 0.14rem;
                color: #fff;
                border-bottom: 0.01rem solid #5a2a93;
                &:first-child {
                  cursor: pointer;
                }
                &:last-child {
                  border-top: 0.01rem solid #5a2a93;
                  border-bottom: none;
                }
              }
              .pic {
                width: 1rem;
                height: 1rem;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                  max-width: 100%;
                  max-width: 100%;
                }
              }
            }
          }
          .KCK {
            margin-left: 0.2rem;
            width: 1rem;
            height: 0.4rem;
            text-align: center;
            line-height: 0.4rem;
            font-size: 0.14rem;
            color: #fff;
            background: #a160c0;
            border-radius: 100px;
            cursor: pointer;
          }
        }

        .subordinate {
          width: 100%;
          display: flex;
          align-items: center;
          padding-left: 1.4rem;
          box-sizing: border-box;
          p {
            height: 0.2rem;
            font-size: 0.24rem;
            color: #d2a9fd;
            line-height: 0.2rem;
          }
          .Press {
            width: 0.2rem;
            height: 0.2rem;
            margin-right: 0.05rem;
            background: rgba(255, 255, 255, 0.06);
            border: 4px solid #d2a9fd;
            border-radius: 50%;
            box-sizing: border-box;
            cursor: pointer;
            &.active {
              background: #ff38b6;
              border: 4px solid #d2a9fd;
            }
          }
        }
      }
      .btns {
        width: 100%;
        height: 0.6rem;
        display: flex;
        justify-content: center;
        margin-top: 0.2rem;
        span {
          display: block;
          width: 1.85rem;
          height: 0.6rem;
          background: hsla(0, 0%, 100%, 0.06);
          border: 1px solid hsla(0, 0%, 100%, 0.2);
          color: #e4e4e4;
          border-radius: 0.04rem;
          text-align: center;
          line-height: 0.6rem;
          font-size: 0.18rem;
          margin-right: 1rem;
          cursor: pointer;
        }
        .btn-two {
          margin-right: 0;
          background: #a160c0;
          border-color: #a160c0;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          img {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.05rem;
          }
        }
      }
    }
  }
  .el-drawer__body {
    background: #6e2c9b !important;
    .WD650 {
      position: absolute;
      top: 45%;
      left: 45%;
    }
    .PageNum {
      width: 2rem;
      text-align: center;
      position: absolute;
      bottom: 0.8rem;
      right: 1.8rem;
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
    .title {
      width: 100%;
      text-align: center;
      line-height: 0.6rem;
      color: #fff;
      font-size: 0.22rem;
    }
    .CK-list {
      width: 100%;
      padding: 0 0.2rem;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .CK-item {
        width: 1.7rem;
        margin-right: 0.1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 0.02rem;
        margin-top: 0.25rem;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 0.3rem;
          border-bottom: 0.01rem solid #5a2a93 !important;
          p {
            width: 50%;
            height: 0.3rem;
            color: #fff;
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.3rem;
            border-right: 0.01rem solid #5a2a93;
            box-sizing: border-box;
            color: #ffd728;
            img {
              width: 20px;
              transform: translateY(5px);
            }
          }
          .btn {
            color: #fff;
            font-size: 0.14rem;
            line-height: 0.3rem;
            text-align: center;
            width: 50%;
            cursor: pointer;
            &:hover {
              background: #a160c0;
            }
          }
        }
        .pic {
          width: 1rem;
          height: 1rem;
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
          width: 100%;
          height: 0.5rem;
          border-top: 0.01rem solid #5a2a93;
          text-align: center;
          line-height: 0.5rem;
          color: #d2a9fd;
          font-size: 0.14rem;
        }
      }
    }
  }
}
</style>
