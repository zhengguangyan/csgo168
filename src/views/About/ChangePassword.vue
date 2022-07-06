<template>
  <div id="ChangePassword">
    <div class="ChangePassword-box">
      <div class="Title">
        <p>修改密码</p>
      </div>
      <div class="Wrapper-box">
        <div class="DZ-box">
          <el-form :model="RegisterForm" status-icon :rules="RegisterRules" ref="RegisterForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="手机号" prop="email">
              <el-input v-model="RegisterForm.email"></el-input>
            </el-form-item>
            <el-form-item label="验证码" class="YZM-box" prop="verify">
              <el-input v-model="RegisterForm.verify"></el-input>
              <div class="YZM" @click="openCaptcha" v-show="VerificationShow == false">发送验证码</div>
              <div class="DJS" v-show="VerificationShow == true">
                <div class="XXX">已发送</div>
                <van-count-down :time="time" class="CLR" format="ss" :auto-start="false" @finish="finish" ref="countDown" />
              </div>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="RegisterForm.pass"></el-input>
            </el-form-item>

            <el-form-item>
              <div class="btn-box">
                <div class="btn" @click="QvXiao">取消</div>
                <div class="btn" @click="ConfirmModification">确定</div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 图形验证码 -->
    <van-popup v-model="captchaShow" style="width: 300px; padding: 20px; border-radius: 4px; font-size: 13px; color: #333">
      <label style="float: left; width: 100%; padding-bottom: 5px; font-size: 16px; font-weight: bold">请输入验证码</label>
      <input type="text" style="width: 160px; padding: 9px 5px; float: left; border: 1px #999 solid" placeholder="请输入验证码" v-model="RegisterForm.captcha" />
      <img style="float: right; cursor: pointer; width: 120px; height: 36px" :src="captchaUrl" @click="getCaptcha()" />
      <span style="float: right; color: #000; cursor: pointer; padding: 10px 0" @click="getCaptcha()">看不清，换一张</span>
      <div style="width: 100%; float: left">
        <span @click="GetYanZhengMa()" style="width: 48%; height: 36px; line-height: 36px; float: left; background: #ffd322; border-radius: 4px; text-align: center; color: #000; cursor: pointer">确定</span>
        <span @click="captchaShow = false" style="width: 48%; height: 36px; line-height: 36px; float: right; background: #ffd322; border-radius: 4px; text-align: center; color: #000; cursor: pointer">取消</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  mapMutations
} from 'vuex'
import { PostEmail, Reset_password, captcha } from '@/network/api.js'
export default {
  name: 'ChangePassword',
  data () {
    return {
      VerificationShow: false,
      time: 60 * 1000,
      RegisterForm: {
        email: '',
        pass: '',
        verify: '',
        captcha: '',
        captchaKey: ''
      },
      RegisterRules: {
        email: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }
        ],
        pass: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
        ],
        verify: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      },

      captchaShow: false,
      captchaUrl: '',
    }
  },
  methods: {

    //图形验证框
    openCaptcha () {
      if (this.RegisterForm.email) {
        this.captchaShow = true
        this.getCaptcha()
      } else {
        this.$message({
          message: '请输入手机号',
          type: 'error'
        })
      }
    },

    //获取图形验证器
    getCaptcha () {
      captcha().then((res) => {
        this.captchaUrl = res.data.url.img
        this.RegisterForm.captchaKey = res.data.url.key
      })
    },

    //发送验证码
    GetYanZhengMa () {
      if (this.RegisterForm.captcha == '') {
        this.$message({
          message: '请输入验证码',
          type: 'error'
        })
        return;
      }
      if (this.RegisterForm.email) {
        this.VerificationShow = true
        this.$refs.countDown.start();
        PostEmail(this.RegisterForm.email, this.RegisterForm.captcha, this.RegisterForm.captchaKey, 2).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          this.finish()
        })
      } else {
        this.$message({
          message: '请输入手机号',
          type: 'error'
        })
      }

    },

    //修改密码
    ConfirmModification () {
      Reset_password(this.RegisterForm.email, this.RegisterForm.pass, this.RegisterForm.verify).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: '修改成功,请重新登录',
            type: 'success'
          })
          this.GetIndividualsShow(false)
          this.$router.push('/')
          this.Leave()
          this.QingChu()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },


    // 取消更改
    QvXiao () {
      this.QingChu()
    },

    //清除表单
    QingChu () {
      this.RegisterForm.email = ''
      this.RegisterForm.pass = ''
      this.RegisterForm.verify = ''
    },

    finish () {
      //重置倒计时
      this.VerificationShow = false
      this.$refs.countDown.reset();
    },
    ...mapMutations([
      'Leave',
      'GetIndividualsShow'
    ])
  }
}
</script>

<style lang="scss">
.ChangePassword-box {
  width: 100%;
  padding-top: 0.4rem;
  .Wrapper-box {
    width: 10rem;
    margin: 0.2rem auto 0;
    display: flex;
    justify-content: center;
  }
  .DZ-box {
    width: 5rem;
    p {
      font-size: 0.22rem;
      text-align: center;
      margin-top: 0.2rem;
    }
    .Steam {
      width: 100%;
      padding-left: 0.9rem;
      text-align: center;
      box-sizing: border-box;
      margin-bottom: 0.2rem;
      p {
        font-size: 0.14rem;
        margin: 0;
      }
    }
    .el-form {
      width: 90%;
      margin-top: 0.2rem;
      .remember_box {
        width: 100%;
        height: 0.2rem;
        display: flex;
        padding-left: 0.9rem;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
        p {
          line-height: 0;
          margin-top: 0;
          font-size: 0.14rem;
          cursor: pointer;
          &:hover {
            color: #ffd322;
          }
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #ffd322;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border-color: #ffd322;
          background: #ffd322;
        }
        .el-checkbox {
          color: #fff;
          font-size: 0.14rem;
        }
      }
      .el-form-item__label {
        color: #fff;
        font-size: 0.14rem;
      }
      .el-input {
        .el-input__inner {
          background: #111111;
          border: none;
          color: #fff;
        }
      }
    }
    .YZM-box {
      .el-form-item__content {
        display: flex;
        align-items: center;
        .el-input {
          width: 70%;
        }
        .YZM {
          width: 1.2rem;
          height: 0.38rem;
          margin-left: 0.3rem;
          font-size: 0.12rem;
          line-height: 0.38rem;
          text-align: center;
          background: #ffd322;
          cursor: pointer;
          color: #000;
        }
        .DJS {
          width: 1rem;
          height: 0.38rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.3rem;
          background: #ffd322;
          .XXX {
            height: 0.38rem;
            font-size: 0.14rem;
            margin-right: 0.05rem;
            box-sizing: border-box;
            margin-bottom: 0.02rem;
          }
          .CLR {
            font-size: 0.14rem;
            color: #000;
          }
        }
      }
    }
    .btn-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn {
        width: 50%;
        height: 0.45rem;
        background: #ffd322;
        color: #000;
        text-align: center;
        line-height: 0.45rem;
        margin: 0 0.1rem;
        border-radius: 0.04rem;
        cursor: pointer;
      }
    }
  }
  .DZ-box {
    width: 5rem;
    p {
      font-size: 0.22rem;
      text-align: center;
      margin-top: 0.2rem;
    }
    .Steam {
      width: 100%;
      padding-left: 0.9rem;
      text-align: center;
      box-sizing: border-box;
      margin-bottom: 0.2rem;
      p {
        font-size: 0.14rem;
        margin: 0;
      }
    }
    .el-form {
      width: 90%;
      margin-top: 0.2rem;
      .remember_box {
        width: 100%;
        height: 0.2rem;
        display: flex;
        padding-left: 0.9rem;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
        p {
          line-height: 0;
          margin-top: 0;
          font-size: 0.14rem;
          cursor: pointer;
          &:hover {
            color: #ffd322;
          }
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #ffd322;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border-color: #ffd322;
          background: #ffd322;
        }
        .el-checkbox {
          color: #fff;
          font-size: 0.14rem;
        }
      }
      .el-form-item__label {
        color: #fff;
        font-size: 0.19rem;
      }
      .el-input {
        .el-input__inner {
          background: #111111;
          border: none;
          color: #fff;
          font-size: 18px;
        }
      }
    }
    .YZM-box {
      .el-form-item__content {
        display: flex;
        align-items: center;
        .el-input {
          width: 70%;
        }
        .YZM {
          width: 1.2rem;
          height: 0.38rem;
          margin-left: 0.3rem;
          font-size: 0.14rem;
          line-height: 0.38rem;
          text-align: center;
          background: #ffd322;
          cursor: pointer;
          color: #000;
        }
        .DJS {
          width: 1rem;
          height: 0.38rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.3rem;
          background: #ffd322;
          .XXX {
            height: 0.38rem;
            font-size: 0.14rem;
            margin-right: 0.05rem;
            box-sizing: border-box;
            margin-bottom: 0.02rem;
          }
          .CLR {
            font-size: 0.14rem;
            color: #000;
          }
        }
      }
    }
    .btn-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn {
        width: 50%;
        height: 0.45rem;
        background: #ffd322;
        color: #000;
        text-align: center;
        line-height: 0.45rem;
        margin: 0 0.1rem;
        border-radius: 0.04rem;
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
  @media screen and(min-width:1920px) {
    .DZ-box {
      width: 5rem;
      p {
        font-size: 0.22rem;
        text-align: center;
        margin-top: 0.2rem;
      }
      .Steam {
        width: 100%;
        padding-left: 0.9rem;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
        p {
          font-size: 0.14rem;
          margin: 0;
        }
      }
      .el-form {
        width: 90%;
        margin-top: 0.2rem;
        .remember_box {
          width: 100%;
          height: 0.2rem;
          display: flex;
          padding-left: 0.9rem;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          margin-bottom: 0.2rem;
          p {
            line-height: 0;
            margin-top: 0;
            font-size: 0.14rem;
            cursor: pointer;
            &:hover {
              color: #ffd322;
            }
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #ffd322;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner,
          .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            border-color: #ffd322;
            background: #ffd322;
          }
          .el-checkbox {
            color: #fff;
            font-size: 0.14rem;
          }
        }
        .el-form-item__label {
          color: #fff;
          font-size: 0.19rem;
        }
        .el-input {
          .el-input__inner {
            background: #111111;
            border: none;
            color: #fff;
            font-size: 18px;
          }
        }
      }
      .YZM-box {
        .el-form-item__content {
          display: flex;
          align-items: center;
          .el-input {
            width: 70%;
          }
          .YZM {
            width: 1rem;
            height: 0.38rem;
            margin-left: 0.3rem;
            font-size: 0.14rem;
            line-height: 0.38rem;
            text-align: center;
            background: #ffd322;
            cursor: pointer;
            color: #000;
          }
          .DJS {
            width: 1rem;
            height: 0.38rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0.3rem;
            background: #ffd322;
            .XXX {
              height: 0.38rem;
              font-size: 0.14rem;
              margin-right: 0.05rem;
              box-sizing: border-box;
              margin-bottom: 0.02rem;
            }
            .CLR {
              font-size: 0.14rem;
              color: #000;
            }
          }
        }
      }
      .btn-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 50%;
          height: 0.45rem;
          background: #ffd322;
          color: #000;
          text-align: center;
          line-height: 0.45rem;
          margin: 0 0.1rem;
          border-radius: 0.04rem;
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
  }
  @media screen and(min-width:2560px) {
    .DZ-box {
      width: 5rem;
      p {
        font-size: 0.22rem;
        text-align: center;
        margin-top: 0.2rem;
      }
      .Steam {
        width: 100%;
        padding-left: 0.9rem;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
        p {
          font-size: 0.14rem;
          margin: 0;
        }
      }
      .el-form {
        width: 90%;
        margin-top: 0.2rem;
        .remember_box {
          width: 100%;
          height: 0.2rem;
          display: flex;
          padding-left: 0.9rem;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          margin-bottom: 0.2rem;
          p {
            line-height: 0;
            margin-top: 0;
            font-size: 0.14rem;
            cursor: pointer;
            &:hover {
              color: #ffd322;
            }
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #ffd322;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner,
          .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            border-color: #ffd322;
            background: #ffd322;
          }
          .el-checkbox {
            color: #fff;
            font-size: 0.14rem;
          }
        }
        .el-form-item__label {
          color: #fff;
          font-size: 0.19rem;
        }
        .el-input {
          .el-input__inner {
            background: #111111;
            border: none;
            color: #fff;
            font-size: 18px;
          }
        }
      }
      .YZM-box {
        .el-form-item__content {
          display: flex;
          align-items: center;
          .el-input {
            width: 70%;
          }
          .YZM {
            width: 1rem;
            height: 0.38rem;
            margin-left: 0.3rem;
            font-size: 0.14rem;
            line-height: 0.38rem;
            text-align: center;
            background: #ffd322;
            cursor: pointer;
            color: #000;
          }
          .DJS {
            width: 1rem;
            height: 0.38rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0.3rem;
            background: #ffd322;
            .XXX {
              height: 0.38rem;
              font-size: 0.14rem;
              margin-right: 0.05rem;
              box-sizing: border-box;
              margin-bottom: 0.02rem;
            }
            .CLR {
              font-size: 0.14rem;
              color: #000;
            }
          }
        }
      }
      .btn-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 50%;
          height: 0.45rem;
          background: #ffd322;
          color: #000;
          text-align: center;
          line-height: 0.45rem;
          margin: 0 0.1rem;
          border-radius: 0.04rem;
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
