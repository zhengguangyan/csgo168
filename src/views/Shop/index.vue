<template>
  <div id="Shop">
    <div id="Shop-box">
      <div class="Title">
        <p>饰品商城</p>
      </div>

<!--      <div class="Shop_out">-->
<!--        <div class="Shop_top">-->
<!--          <div style="width: 100%;display: flex;align-items: center;justify-content: space-between;">-->
<!--            <div class="conent_left">-->
<!--              <div class="ChooseBar">-->
<!--                <el-select v-model="TakeValue" placeholder="请选择">-->
<!--                  <el-option v-for="item in DurableOption" :key="item.value" :label="item.text" :value="item.value">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </div>-->
<!--              <div class="ChooseBar">-->
<!--                <el-select v-model="TypeValue" placeholder="请选择">-->
<!--                  <el-option v-for="item in TypeOption" :key="item.value" :label="item.text" :value="item.value">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </div>-->
<!--&lt;!&ndash;              <div class="content_amount_search">&ndash;&gt;-->
<!--&lt;!&ndash;                <span class="content_buttons">&ndash;&gt;-->
<!--&lt;!&ndash;                  <input type="text" v-model="min_num" placeholder="最低金额" class="content_input1" style="color: #999ba5">&ndash;&gt;-->
<!--&lt;!&ndash;                </span>&ndash;&gt;-->
<!--&lt;!&ndash;                <span class="content_button1">~</span>&ndash;&gt;-->
<!--&lt;!&ndash;                <span class="content_buttons">&ndash;&gt;-->
<!--&lt;!&ndash;                  <input type="text" v-model="max_num" placeholder="最高金额" class="content_input1" style="color: #999ba5">&ndash;&gt;-->
<!--&lt;!&ndash;                </span>&ndash;&gt;-->
<!--&lt;!&ndash;                <span class="content_button2" @click="GetSerch">&ndash;&gt;-->
<!--&lt;!&ndash;                  <img style="width: 0.16rem;margin-right: 0.04rem;" src="@/assets/images/PublicImg/serch.png">搜索</span>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;              <span class="content_sort" @click="GetSort" style="color: #33e5cc">&ndash;&gt;-->
<!--&lt;!&ndash;                {{sortTxt}}&ndash;&gt;-->
<!--&lt;!&ndash;              </span>&ndash;&gt;-->
<!--            </div>-->

<!--            <div class="content_right">-->
<!--              <span class="content_sortRight">-->
<!--                <div class="content_input3">-->
<!--                  <div class="content_input3Div">-->
<!--                    <input type="text" v-model="props_name" placeholder="请输入道具名称" class="content_input"></div>-->
<!--                </div>-->
<!--                <div class="content_search" @click="GetSerch"><img style="width: 0.16rem;margin-right: 0.04rem;" src="@/assets/images/PublicImg/serch.png">搜索</div>-->
<!--              </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="Shop_body">-->
<!--          <div class="Shop-list-box">-->
<!--            <div class="home-List">-->
<!--              <div class="home-list-item" v-for="(item,index) in ShopArr" :key="index">-->
<!--                <div class="info">-->
<!--                  <div class="quality" style="color: #1ed989;margin-right: 0.14rem;">库存 {{item.shop_inventory}}</div>-->
<!--                  <div class="quality">{{item.dura_alias}}</div>-->
<!--                </div>-->
<!--                <div class="weapon_cover">-->
<!--                  <div class="pic">-->
<!--                    <img v-lazy="item.cover">-->
<!--                  </div>-->
<!--                </div>-->
<!--                <p>{{item.name}}</p>-->
<!--                <div class="Blind_btn">-->
<!--                    <img src="@/assets/images/PublicImg/JinBi.png" alt="">{{item.bean}}-->
<!--                </div>-->
<!--                <div class="open_btn" @click="GouMaiShiPin(item)">-->
<!--                  <img src="@/assets/images/PublicImg/box.png" alt=""><br>购买-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="PageNum">-->
<!--          <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page_size" :total="total" :key="total">-->
<!--          </el-pagination>-->
<!--        </div>-->

<!--        &lt;!&ndash; 购买 &ndash;&gt;-->
<!--        <van-overlay :show="GouMaiShow">-->
<!--          <div class="wrapper">-->
<!--            <div class="wrapper-box">-->
<!--              <div class="wrapper-box-top"></div>-->
<!--              <div class="cancel">-->
<!--                <img src="@/assets/images/PublicImg/GuanBi.png" alt="" @click="CloseGiveShow">-->
<!--              </div>-->
<!--              <div class="tit">{{GiveName}}</div>-->
<!--              <div class="pic">-->
<!--                <img :src="GiveImg" alt="">-->
<!--              </div>-->
<!--              <form>-->
<!--                <div class="other">-->
<!--                  <div class="ShuLiang">-->
<!--                    <p @click="GaiBianSPinNum('-')">-</p>-->
<!--                    <p>{{SPinNum}}</p>-->
<!--                    <p @click="GaiBianSPinNum('+')">+</p>-->
<!--                  </div>-->
<!--                  <div class="ZongJiaGe">-->
<!--                    <p>C币：</p>-->
<!--                    <span><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{JiaGeNum}}</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </form>-->
<!--              <div class="btns">-->
<!--                <span @click="CloseGiveShow">取消购买</span>-->
<!--                <span class="btn-two" @click="GetGive">确定购买</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </van-overlay>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import {GetShop, PersonalInfo, Shop_Buy} from '@/network/api.js'
import {mapMutations, mapState} from "vuex";
export default {
  name: 'Shop',
  data() {
    return {
      GouMaiShow: false, 			//购买弹框
      GiveImg: null,     			//购买物品图片
      GiveName: '',   			//购物物品名称

      SPinNum: 1,    				//购买物品数量
      GiveId:'',					//购买物品id

      GiveJiaGe: 0,  				//购买价格

      ShopArr: [],

      total:0,       				//列表总数
      page_size:0,   				//一页条数

      DurableOption: [{
        text: '请选择耐久',
        value: -1
      },{
        text: '无',
        value: 0
      }, {
        text: '崭新出厂',
        value: 1
      }, {
        text: '略有磨损',
        value: 2
      }, {
        text: '久经沙场',
        value: 3
      }, {
        text: '破损不堪',
        value: 4
      }, {
        text: '战痕累累',
        value: 5
      }],
      TakeValue: -1,

      TypeOption: [{
        text: '请选择类型',
        value: -1
      },{
        text: '手套',
        value: 1
      }, {
        text: '匕首',
        value: 2
      }, {
        text: '手枪',
        value: 3
      }, {
        text: '步枪',
        value: 4
      }, {
        text: '冲锋枪',
        value: 5
      }, {
        text: '狙击枪',
        value: 6
      }],
      TypeValue: -1,

      props_name:'',      //道具名称
      sort:'1',       			//排序
      sortTxt:'价格从高到低',
      min_num:'0',				 //价格区间(开始)
      max_num:'1000000',           //价格区间(结束)
      page_num:'1',                 //页码
      durable:-1,               //耐久
      type:-1,               //类型
    }
  },

  created() {
    this.Shop()
  },

  methods: {
    //获取列表
    Shop(page){
      GetShop(this.min_num,this.max_num,this.sort,this.page_num,this.durable,this.type,this.props_name).then((res) => {
        // console.log(res.data.data)
        this.ShopArr = res.data.data.data
        this.total = res.data.data.total
        this.page_size = res.data.data.per_page
      })
    },

    //排序
    GetSort(){
      if(this.sort == '0'){
        this.sort = '1'
        this.sortTxt = '价格从高到低'
        this.Shop(this.min_num,this.max_num,this.sort,this.page_num)
      }else if(this.sort == '1'){
        this.sort = '0'
        this.sortTxt = '价格从低到高'
        this.Shop(this.min_num,this.max_num,this.sort,this.page_num)
      }
    },

    //筛选
    GetSerch(){
      this.page_num = '1'
      this.Shop()
    },

    //商品列表分页
    handleCurrentChange(val) {
      // console.log(val)
      this.page_num = val
      this.Shop()
    },

    //购买操作
    GouMaiShiPin(item) {
      // console.log(item)
      this.GiveId = item.id
      this.GiveImg = item.cover
      this.GiveName = item.name
      this.GiveJiaGe = Number(item.bean)
      this.GouMaiShow = true
    },

    //改变购买数量
    GaiBianSPinNum(v) {
      if (v == '-') {
        if (this.SPinNum <= 1) {
          this.$message({
            message: '最少选择一件商品!',
            type: 'error'
          })
        } else {
          this.SPinNum = this.SPinNum - 1
        }
      } else if (v == '+') {
        if (this.SPinNum >= 10) {
          this.$message({
            message: '单次购买上限10件!',
            type: 'error'
          })
        } else {
          this.SPinNum = this.SPinNum + 1
        }
      }
    },

    //关闭购买弹框
    CloseGiveShow() {
      this.GouMaiShow = false
      setTimeout(() => {
        this.GiveJiaGe = 0
        this.SPinNum = 1
      }, 500)
    },

    //支付操作
    GetGive() {
      Shop_Buy(this.GiveId,this.SPinNum).then((res) => {
        // console.log(res.data)
        this.$message({
          message: '购买成功',
          type: 'success'
        })
        this.GetPersonalInfo()
        this.GiveId = ''
        this.GouMaiShow = false
        this.GouMaiShow = false
        setTimeout(() => {
          this.GiveJiaGe = 0
          this.SPinNum = 1
          this.Shop()
        }, 500)
      })


    },


    //个人信息
    GetPersonalInfo() {
      PersonalInfo().then((res) => {
        this.User(res.data.message)
      })
    },

    ...mapMutations([
      'User'
    ])
  },
  computed: {
    JiaGeNum() {
      return (this.GiveJiaGe * this.SPinNum).toFixed(2)
    }
  },
  watch:{
    TakeValue(v){
      this.durable = v
      this.Shop()
    },
    TypeValue(v){
      this.type = v
      this.Shop()
    }
  }
}
</script>

<style lang="scss">
#Shop-box {
  width: 14rem;
  padding-top: 0.4rem;

  .Shop_out {
    width: 100%;
    justify-content: space-between;

    .Shop_top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      border-bottom: 0.02rem solid #f9e315;
      padding: 0.2rem 0;

      .conent_left {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .ChooseBar {
          margin-right: 0.1rem;
          background-color: transparent;
          width: 1.5rem;
        }
        .el-input--suffix .el-input__inner {
          padding-right: 30px;
          height: 0.46rem!important;
          background: transparent!important;
          border: 1px solid #999ba5!important;
          border-radius: 0!important;
          font-size: .16rem;
          color: #efd983;
        }
        .content_amount_search {
          display: flex;
          align-items: center;

          .content_buttons {
            display: inline-flex;
            width: 1.52rem;
            height: 0.44rem;
            border: 1px solid #999ba5;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #6d6e7d;
            font-size: .16rem;
            align-items: center;
            justify-content: center;

            .content_input1 {
              background-color: transparent;
              border: 0;
              width: 1.3rem;
              color: #fff;
              text-align: center;
            }
          }

          .content_button1 {
            font-size: .16rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #767a93;
            margin: 0 0.09rem;
          }

          .content_button2 {
            margin-left: 0.1rem;
            width: 0.98rem;
            height: 0.47rem;
            background: #f9e315;
            cursor: pointer;
            font-size: .16rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #121720;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .content_sort {
          font-size: .14rem;
          font-family: Microsoft YaHei;
          color: #fff;
          cursor: pointer;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.2rem;
        }
      }

      .content_right {
        height: 0.46rem;
        overflow: hidden;
        .content_sortRight{
          display: flex;
          align-items: center;
          height: 100%;
          .content_input3{
            width: 2.96rem;
            height: 0.44rem;
            border: 0.01rem solid #464853;
            box-sizing: border-box;
            .content_input3Div{
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              border: 1px solid #999ba5;
              .content_input{
                width: 2.7rem;
                background-color: transparent;
                border: 0;
              }
            }
          }
          .content_search{
            margin-left: 0.1rem;
            width: 0.98rem;
            height: 0.47rem;
            background: rgba(227, 201, 101, 0.9);
            cursor: pointer;
            font-size: .16rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #121720;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .Shop_body {
      margin-top: 0.4rem;
      width: 100%;
      border-radius: 0.04rem 0.04rem 0.1rem 0.1rem;
      .Shop-list-box{
        width: 100%;
        min-height: 4.5rem;
        background-size: cover;

        .home-List {
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          .home-list-item {
            width: 18%;
            cursor: pointer;
            margin: 0.1rem 1%;
            position: relative;
            // background: rgba($color: #000000, $alpha: 0.5);
            padding:0.2rem 0;

            .info {
              width: 100%;
              height: 0.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 0.1rem;
              box-sizing: border-box;

              .quality {
                font-size: 0.14rem;
                line-height: 0.5rem;
              }
            }

            .weapon_cover {
              width: 2.3rem;
              height: 2rem;
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              img {
                max-width: 100%;
                max-height: 100%;
                transition: .3s;
              }
            }

            .pic {
              width: 2rem;
              height: 2rem;
              position: absolute;
              left: 0.35rem;
              top: -0.4rem;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 10;

              img {
                max-width: 100%;
                max-height: 100%;
                transition: .3s;
              }
            }

            p {
              height: 20px;
              font-size: 0.2rem;
              line-height: 25px;
              color: #ddd;
              text-align: center;
            }

            .Blind_btn {
              margin:0.1rem 0 0;
              text-align: center;
              font-size:0.18rem;
              color:#ffd926;
              line-height:0.36rem;
              font-weight: 500;
              img{width:0.3rem;transform: translateY(0.08rem);}
            }
            .open_btn{
              text-align: center;
              font-weight: 500;
              display:none;
              img{width:0.45rem;}
            }

            &:hover {
              background: url(../../assets/images/box-bg.png) no-repeat center;
              background-size:300px;
              p{
                display:none;
              }
              .pic {
                img {
                  transform: translateY(-20px);
                }
              }
              .Blind_btn{
                display:none;
              }
              .open_btn{
                display:block;
              }
            }
          }
        }
      }
    }

    .PageNum {
      width: 100%;

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
          font-size: 0.2rem;
          text-align: center;
          line-height: 0.8rem;
        }

        .other {
          width: 100%;
          height: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-top: 0.2rem;

          .ShuLiang {
            display: flex;
            justify-content: center;
            align-items: center;

            p {
              width: 0.3rem;
              height: 0.3rem;
              background: rgba(255, 255, 255, 0.08);
              text-align: center;
              line-height: 0.3rem;
              font-size: 0.16rem;
              cursor: pointer;

              &:nth-child(2) {
                width: 0.5rem;
                margin: 0 0.1rem;
              }
            }
          }

          .ZongJiaGe {
            display: flex;
            align-items: center;

            p {
              font-size: 0.18rem;
            }

            span {
              margin-top: 0.03rem;
              width: 0.7rem;
              display: flex;

              img {
                vertical-align: middle;
                width: 0.2rem;
                height: 0.2rem;
                margin-bottom: 0.02rem;
              }

              font-size: 0.18rem;
              color: #75cd66;
            }
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
          background: url(../../assets/images/PublicImg/item-bg.jpg) no-repeat center;
          background-size: cover;

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
            background: hsla(0, 0%, 100%, .06);
            border: 1px solid hsla(0, 0%, 100%, .2);
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
            background: #ffd322;
            border-color: #ffd322;
            color: #000;
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
