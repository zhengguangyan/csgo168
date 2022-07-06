<template>
  <div id="NavHeader">
    <div class="flex-row section_3">
      <img src="@/assets/images/home/headertitle.png" class="logo" @click="jump('/')" />

      <div class="flex-row group_title" @click="jump('/')" :class="{ active: this.$route.path == '/Home' }">
        <img v-if="this.$route.path == '/Home'" src="@/assets/images/home/home.png" class="group_image" />
        <img v-else src="@/assets/images/home/home1.png" class="group_image" />
        <span class="group_text">首页</span>
      </div>
      <div class="flex-row group_title" @click="jump('/ROLL')" :class="{ active: this.$route.path == '/ROLL' }">
        <img v-if="this.$route.path == '/ROLL'" src="@/assets/images/home/rool.png" class="group_image" />
        <img v-else src="@/assets/images/home/rool1.png" class="group_image" />
        <span class="group_text">ROLL房</span>
      </div>
      <div class="flex-row group_title" @click="jump('/Lucky')" :class="{ active: this.$route.path == '/Lucky' }">
        <img v-if="this.$route.path == '/Lucky'" src="../../../assets/images/home/luck.png" class="group_image" />
        <img v-else src="../../../assets/images/home/luck1.png" class="group_image" />
        <span class="group_text">幸运开箱</span>
      </div>
      <div class="flex-row group_title" @click="jump('/Replacement')" :class="{ active: this.$route.path == '/Replacement' }">
        <img v-if="this.$route.path == '/Replacement'" src="../../../assets/images/home/replacement.png" class="group_image" />
        <img v-else src="../../../assets/images/home/replacement1.png" class="group_image" />
        <span class="group_text">饰品升级</span>
      </div>
      <div class="flex-row group_title" @click="jump('/Activity')" :class="{ active: this.$route.path == '/Activity' }">
        <img v-if="this.$route.path == '/Activity'" src="../../../assets/images/home/activity.png" class="group_image" />
        <img v-else src="../../../assets/images/home/activity1.png" class="group_image" />
        <span class="group_text">福利箱</span>
      </div>
      <div class="flex-row group_title" @click="jump('/BoxFight')" :class="{ active: this.$route.path == '/BoxFight' }">
        <img v-if="this.$route.path == '/BoxFight'" src="../../../assets/images/home/box_fight.png" class="group_image" />
        <img v-else src="../../../assets/images/home/box_fight1.png" class="group_image" />
        <span class="group_text">盲盒对战</span>
      </div>
      <!--      <div class="flex-row group_title" @click="jump('/Shop')" :class="{'active' : this.$route.path == '/Shop'}">-->
      <!--        <img src="../../../assets/images/test/shop.png" class="group_image">-->
      <!--        <span class="group_text">饰品商城</span>-->
      <!--      </div>-->
      <!--      <div class="item" @click="jump('/RushPurchase')" :class="{'active' : this.$route.path == '/RushPurchase'}">-->
      <!--        <p>抢卡</p>-->
      <!--        <i></i>-->
      <!--      </div>-->
      <div class="flex-row group_title" @click="jump('/Recharge')" :class="{ active: this.$route.path == '/Recharge' }">
        <img v-if="this.$route.path == '/Recharge'" src="../../../assets/images/home/recharge.png" class="group_image" />
        <img v-else src="../../../assets/images/home/recharge1.png" class="group_image" />
        <span class="group_text">在线充值</span>
      </div>

      <div class="flex-col items-end group_user" v-show="this.IndividualsShow == false">
        <div class="flex-col register">
          <span class="text_9" @click="PostRegisterShow">注册</span>
          <img src="../../../assets/images/home/Backlight.png" class="image_8" />
        </div>
        <div class="flex-col items-center login">
          <span class="text_8" @click="PostSignInShow">登录</span>
          <img src="../../../assets/images/home/Backlight.png" class="image_9" />
        </div>
      </div>

      <div class="flex-row pre1" v-show="this.IndividualsShow == true">
        <div class="text_user" @click="jump('/Recharge')">
          <img src="@/assets/images/home/jinbi.png" alt="" /><span>{{ user.bean }}</span>
        </div>
        <div class="text_user" @click="jump('/Extension')">
          <img src="@/assets/images/home/vip.png" alt="" /><span>{{ user.promotion_level_name }}</span>
        </div>
        <div class="text_user" @click="MenuShow">
          <img :src="user.avatar" style="border-radius: 50%; border: 1px solid #ffba2e" class="image_user" />
          <span>{{ user.name }}</span>
        </div>
      </div>
    </div>
    <swiper></swiper>

    <div class="flex-col banner">
      <banner v-if="this.$route.path == '/Home'"></banner>
      <div v-if="this.$route.path == '/Home'" class="image_container">
        <div class="image_box" v-for="(item, index) in Headlines" :key="index" @click="toWelfareInfo(item.id)">
          <div class="image_link">
            <!-- <img class="img_one" src="@/assets/images/home/back_img.png" alt="" /> -->
            <img class="img_two" src="@/assets/images/home/bg_shiping.png" alt="" />
            <!-- <img class="img_three" src="@/assets/images/home/black.png" alt="" /> -->
            <!-- <img class="img_four" src="@/assets/images/home/btn.png" alt="" /> -->
            <img v-if="index == 0" class="img_six" src="@/assets/images/home/img_4.png" alt="" />
            <img v-else-if="index == 1" class="img_six" src="@/assets/images/home/img_5.png" alt="" />
            <img v-else class="img_six" src="@/assets/images/home/img_6.png" alt="" />

            <img v-if="empty(item.box_records[0])" class="img_five" :src="item.box_records[0].cover" alt="" />
            <img v-else class="img_five" :src="''" alt="" />

            <van-count-down :time="new Date(item.end_time).getTime() - new Date().getTime()" format="DD 天 HH 时 mm 分">
              <template #default="timeData">
                <button>
                  <span class="block" v-text="timeData.days < 10 ? '0' + timeData.days : timeData.days"></span>
                  <span class="colon">:</span>
                  <span class="block" v-text="timeData.hours < 10 ? '0' + timeData.hours : timeData.hours"></span>
                  <span class="colon">:</span>
                  <span class="block" v-text="timeData.minutes < 10 ? '0' + timeData.minutes : timeData.minutes"></span>
                </button>
              </template>
            </van-count-down>
            <span class="fs">{{ item.name | GuoLvOne }}</span>
            <span class="jb">
            <img class="img_sevenno" src="@/assets/images/home/money.png" alt="" />
              {{ item.award_bean }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="XiangZi_Box" v-if="false">
      <div class="XiangZi_item" v-for="(item, index) in Box_Arr" :key="index" @click="ShowNeiRong(item)">
        <div class="pic">
          <img :src="item.cover" alt="" />
        </div>
        <span><img src="@/assets/images/PublicImg/JinBi.png" alt="" />{{ item.game_bean }}</span>
        <p>{{ item.name }}</p>
      </div>
    </div>
    <!-- 		<div class="data_info">-->
    <!--			<div class="data_info_item">-->
    <!--				<img src="@/assets/images/NavHeader/ZX.png" alt="">-->
    <!--				<p><span style="color:#00d5c6;">{{SuiJiNum}}</span>在线</p>-->
    <!--			</div>-->
    <!--			<div class="data_info_item">-->
    <!--				<img src="@/assets/images/NavHeader/YH.png" alt="">-->
    <!--				<p><span>{{info.user_number}}</span>用户</p>-->
    <!--			</div>-->
    <!--			<div class="data_info_item">-->
    <!--				<img src="@/assets/images/NavHeader/XZ.png" alt="">-->
    <!--				<p><span>{{info.open_box_number}}</span>武器箱</p>-->
    <!--			</div>-->
    <!--		</div>-->

    <!-- 注册弹框 -->
    <van-overlay :show="RegisterShow">
      <div class="Wrapper">
        <div class="out">
          <div class="Ren"></div>
          <div class="DZ-box" :style="W_BL | STY">
            <p>注册</p>
            <div style="text-align: center; color: #ffd322; margin-top: 5px" v-show="noSignin">微信授权登录成功，请先绑定手机号</div>
            <el-form :model="RegisterForm" status-icon :rules="RegisterRules" ref="RegisterForm" label-width="90px" class="demo-ruleForm">
              <el-form-item label="手机号" prop="email">
                <el-input v-model="RegisterForm.email"></el-input>
              </el-form-item>
              <el-form-item label="验证码" class="YZM-box" prop="verify">
                <el-input v-model="RegisterForm.verify"></el-input>
                <div class="YZM" @click="openCaptcha" v-show="!VerificationShow">发送验证码</div>
                <div class="DJS" v-show="VerificationShow">
                  <div class="XXX">已发送</div>
                  <van-count-down :time="time" class="CLR" format="ss" :auto-start="false" @finish="finish" ref="countDown" />
                </div>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="RegisterForm.pass"></el-input>
              </el-form-item>
              <el-form-item label="昵称" prop="name">
                <el-input v-model="RegisterForm.name"></el-input>
              </el-form-item>
              <el-form-item label="邀请码">
                <el-input v-model="RegisterForm.invite"></el-input>
              </el-form-item>

              <div class="XY_box">
                <el-checkbox v-model="XYchecked">我接受《用户条款和隐私政策》</el-checkbox>
              </div>

              <el-form-item>
                <div class="btn-box">
                  <div class="btn" @click="RegisterQX">取消</div>
                  <div class="btn" @click="PostRegister">注册</div>
                </div>
              </el-form-item>
              <div class="Steam">
                <p>-其他方式-</p>
                <!-- <div class="img_box" @click="OpenWechatQrcode"></div> -->
                <div class="img_box steam_icon" @click="OpenSteam"></div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 登录弹框 -->
    <van-overlay :show="SignInShow">
      <div class="Wrapper">
        <div class="out">
          <div class="Ren"></div>
          <div class="DZ-box" :style="W_BL | STY" style="padding-top: 20px">
            <p>登录</p>
            <el-form :model="SignInForm" status-icon :rules="SignInRules" ref="SignInForm" label-width="90px" class="demo-ruleForm">
              <el-form-item prop="email" label="手机号">
                <el-input v-model="SignInForm.email"></el-input>
              </el-form-item>
              <el-form-item prop="pass" label="密码">
                <el-input type="password" v-model="SignInForm.pass"></el-input>
              </el-form-item>
              <div class="remember_box">
                <el-checkbox v-model="checked">记住密码</el-checkbox>
                <p @click="GetChangePassword">忘记密码</p>
              </div>
              <el-form-item>
                <div class="btn-box">
                  <div class="btn" @click="SignInQX">取消</div>
                  <div class="btn" @click="PostSignIn">登录</div>
                </div>
              </el-form-item>
              <div class="Steam">
                <p>-其他方式-</p>
                <!-- <div class="img_box" @click="OpenWechatQrcode"></div> -->
                <div class="img_box steam_icon" @click="OpenSteam"></div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 箱子遮罩层 -->
    <van-overlay :show="XZshow">
      <div class="wrapper">
        <div class="block">
          <div class="block-T">
            <p>{{ Box_Name }}</p>
            <span @click="CloseXZshow">×</span>
          </div>
          <div class="Box-List">
            <div class="Box-List-item" v-for="(item, index) in JiangPin_Arr" :key="index">
              <div class="pic">
                <div class="zhao">
                  <img :src="item.lv_bg_image" alt="" />
                </div>
                <img :src="item.cover" alt="" />
              </div>
              <div class="name">{{ item.name | GuoLv }}</div>
              <div class="money">
                <img src="@/assets/images/PublicImg/JinBi.png" alt="" /><span>{{ item.bean }}</span>
              </div>
            </div>
          </div>
          <div class="boxbtn">
            <p @click="CloseXZshow">确定</p>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 排行 -->
    <Rank v-show="true" />

    <van-overlay :show="PopUpsShow">
      <div aria-expanded="true" class="v--modal-overlay">
        <div class="v--modal-box v--modal" style="max-width: 900px; margin-top: 120px">
          <div class="close">
            <i class="icon-close" @click="close_pop">
              <img style="width: 0.4rem; height: 0.4rem" src="../../../assets/images/public/close.png" alt="" />
            </i>
          </div>
          <div class="news-wrap" @click="return_pop">
            <img src="../../../assets/images/public/img.png" class="bg" />
            <div class="check-wrap"></div>
          </div>
        </div>
      </div>
    </van-overlay>

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

    <van-overlay style="position: absolute" :show="menuShow" @click="MenuCloseShow">
      <div class="wrap">
        <div class="nav-menu-main">
          <div class="nav-menu" @click="jump('/About')"><img src="../../../assets/images/home/menu1.png" alt="logo" /><span>个人中心</span></div>
          <div class="nav-menu" @click="jump('/Warehouse')"><img src="../../../assets/images/home/menu2.png" alt="logo" /><span>个人背包</span></div>
          <div class="nav-menu" @click="jump('/Extension')"><img src="../../../assets/images/home/menu3.png" alt="logo" /><span>战队建设</span></div>
          <div v-if="salesman" class="nav-menu" @click="jump('/Rebate')"><img src="../../../assets/images/home/menu7.png" alt="logo" /><span>流水佣金</span></div>
          <div class="nav-menu" @click="jump('/Information')"><img src="../../../assets/images/home/menu4.png" alt="logo" /><span>消息通知</span></div>
          <div class="nav-menu" @click="jump('/ChangePassword')"><img src="../../../assets/images/home/menu5.png" alt="logo" /><span>修改密码</span></div>
          <button class="recharge" @click="jump('/Recharge')">在线充值</button>
          <div class="nav-menu logout" @click="SignOut"><img src="../../../assets/images/home/menu6.png" alt="logo" /><span>退出登录</span></div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {
  Register,
  PostEmail,
  SignIn,
  PersonalInfo,
  Arena_Box_List,
  Info,
  captcha,
  Rooms
} from '@/network/api.js'
import {
  mapState,
  mapMutations
} from 'vuex'
import Swiper from '@/components/common/NavHeader/Swiper.vue'
import Banner from '@/components/common/NavHeader/Banner.vue'
import Rank from '@/views/Rank/index.vue'
export default {
  name: 'NavHeader',
  data () {
    return {
      W_BL: false,
      Box_Name: '',
      time: 60 * 1000,
      VerificationShow: false,
      Box_Arr: [],
      checked: true,
      XYchecked: true,
      JiangPin_Arr: [],

      Box_Arr_Show: false,
      PopUpsShow: false,
      XZshow: false,

      RegisterForm: {
        email: '',
        pass: '',
        name: '',
        verify: '',
        invite: '',
        agent: '',
        captcha: '',
        captchaKey: ''
      },

      captchaShow: false,
      menuShow: false,
      salesman: false,
      captchaUrl: '',

      SignInForm: {
        email: '',
        pass: ''
      },
      SignInRules: {
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
        },
        {
          pattern: /^[A-Za-z0-9]{2,14}$/,
          message: '密码格式错误',
          trigger: 'blur'
        }
        ]
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
        },
        {
          pattern: /^[A-Za-z0-9]{2,14}$/,
          message: '密码格式错误',
          trigger: 'blur'
        }
        ],
        name: [{
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        },
        {
          pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{2,14}$/,
          message: '昵称格式错误',
          trigger: 'blur'
        }
        ],
        verify: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      },
      SuiJiNum: 0,
      info: {},
      wechatUserInfo: sessionStorage.wechatUserInfo ? JSON.parse(sessionStorage.wechatUserInfo) : { 'nickname': '', 'openid': '', 'unionid': '', 'headimgurl': '' },
      noSignin: false,
      Headlines: []
    }
  },

  created () {

    // console.log(this.$route)
    if (window.screen.width < 750) {
      this.W_BL = true
    } else {
      this.W_BL = false
    }

    if (this.$route.path == '/BoxFight' || this.$route.path == '/vsbox' || this.$route.path == '/CreateAConfrontation') {
      this.Box_Arr_Show = true
    }
    sessionStorage.invite = this.getQueryString('ref') != null ? this.getQueryString('ref') : ''
    sessionStorage.agent = this.getQueryString('agent') != null ? this.getQueryString('agent') : ''
    this.RegisterForm.agent = sessionStorage.agent
    this.RegisterForm.invite = sessionStorage.invite
    this.RegisterForm.name = this.wechatUserInfo.nickname
    this.PanDuanDengLu()
    this.Get_Arena_Box_List()
    this.GetInfo()
    this.getCaptcha()
    window.addEventListener('message', this.closeWrchatQrcode, true)

    if (this.getCookie('Popups') == '') { //cookie 中没有 Popups 则赋给他一个值（此时弹框显示）
      document.cookie = "Popups = yes";
    } else {
      this.PopUpsShow = false; //若cookie 中已经有 Popups 值，则弹框再不会显示
    }

    this.GetRooms()
  },
  destroyed () {
    window.removeEventListener('message', this.closeWrchatQrcode, true)
  },


  filters: {
    GuoLv (str) {
      return str.length > 12 ? str.substr(0, 10) + '...' : str
    },
    STY (val) {
      // console.log(val)
      if (val == true) {
        return 'width:80%;'
      } else {
        return 'width:5rem;'
      }
    },
    GuoLvOne (val) {
      return val.length > 13 ? val.substr(0, 12) + '...' : val
    },
  },

  activated () {

  },



  methods: {
    empty (v) {
      if (v != undefined) {
        return true;
      }
    },
    //微信登录成功
    closeWrchatQrcode (e) {
      const _userInfo = e.data
      if (_userInfo['code'] == 1) {
        sessionStorage.wechatUserInfo = JSON.stringify(_userInfo)
        this.wechatUserInfo = _userInfo
        this.RegisterForm.name = this.wechatUserInfo.nickname
        this.GetSignInShow(false)
        this.EmptySignInForm()
        this.GetRegisterShow(true)
        this.EmptyForm()
        this.noSignin = true
      } else if (_userInfo['code'] == 200) {
        if (this.checked == true) {
          localStorage.setItem('token', 'Bearer' + ' ' + _userInfo.data.access_token)
          sessionStorage.setItem('token', 'Bearer' + ' ' + _userInfo.data.access_token)
        } else {
          sessionStorage.setItem('token', 'Bearer' + ' ' + _userInfo.data.access_token)
        }
        this.GetPersonalInfo()
        this.GetRegisterShow(false)
        this.EmptyForm()
        this.GetSignInShow(false)
        this.EmptySignInForm()
        this.noSignin = false
      }
    },

    //打开微信登录二维码
    OpenWechatQrcode () {
      const _open = process.env.VUE_APP_BASE_URL
      const _top = 200
      const _left = document.body.clientWidth / 2 - 250
      window.open(_open + 'wechatLoginQrcode', '_blank', 'status=no,location=no,menubar=no,resizable=no,scrollbars=no,toolbar=no,width=500,height=500,top=' + _top + ',left=' + _left);
    },

    //Steam
    OpenSteam () {
      this.$message({
        message: '即将上线',
        type: 'info'
      })
    },

    //获取浏览器参数
    getQueryString (name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      };
      return null;
    },

    //初次进入判断是否记住登录
    PanDuanDengLu () {
      if (sessionStorage.getItem('token')) {
        this.GetPersonalInfo()
      } else {
        if (localStorage.getItem('token')) {
          sessionStorage.setItem('token', localStorage.getItem('token'))
          this.GetPersonalInfo()
        } else {
          this.GetIndividualsShow(false)
        }
      }

    },

    //站点信息
    GetInfo () {
      Info().then((res) => {
        this.info = res.data.data
        // console.log(res.data.data)
        localStorage.setItem('static_file_url', res.data.data.static_file_url)
        this.GetSuiJi()
      })
    },

    GetSuiJi () {
      this.SuiJiNum = Math.floor(Math.random() * (50 - Number(this.info.user_number))) + Number(this.info.user_number)
    },


    CloseXZshow () {
      this.XZshow = false
    },
    close_pop () {
      this.PopUpsShow = false
    },
    return_pop () {
      this.PopUpsShow = false
      this.PostSignInShow()
    },
    //暂未开放
    WuKaiFang () {
      this.$message({
        message: '暂未开放,敬请期待!',
        type: 'error'
      })
    },

    //查看箱子内容
    ShowNeiRong (item) {
      // console.log(item)
      this.JiangPin_Arr = item.box_awards
      this.Box_Name = item.name
      this.XZshow = true

    },

    //获取宝箱列表
    Get_Arena_Box_List () {
      Arena_Box_List().then((res) => {
        // console.log(res)
        this.Box_Arr = res.data.data
      })
    },

    //路由跳转
    jump (str) {
      this.$router.push({
        path: str
      }).catch(err => {
        this.$router.go(0)
      })
    },

    //修改密码
    GetChangePassword () {
      this.$router.push('/ChangePassword')
      this.GetSignInShow(false)
    },

    //注册
    PostRegisterShow () {
      this.GetRegisterShow(true)
    },
    //注册操作
    PostRegister () {
      if (this.XYchecked) {
        Register(this.RegisterForm.email, this.RegisterForm.pass, this.RegisterForm.name, this.RegisterForm.verify, this.RegisterForm.invite, this.wechatUserInfo.openid, this.wechatUserInfo.unionid, this.wechatUserInfo.headimgurl, this.RegisterForm.agent
        ).then((res) => {
          // console.log(res)
          if (res.data.code == 200) {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            if (this.checked == true) {
              localStorage.setItem('token', 'Bearer' + ' ' + res.data.data.access_token)
              sessionStorage.setItem('token', 'Bearer' + ' ' + res.data.data.access_token)
            } else {
              sessionStorage.setItem('token', 'Bearer' + ' ' + res.data.data.access_token)
            }
            this.GetPersonalInfo()
            this.GetRegisterShow(false)
            this.EmptyForm()
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请先勾选用户协议',
          type: 'error'
        })
      }

    },

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

    //发送手机号验证码
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
        PostEmail(this.RegisterForm.email, this.RegisterForm.captcha, this.RegisterForm.captchaKey, '1').then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
            this.captchaShow = false;
            this.$refs.countDown.start();
            this.captchaShow = false
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.finish()
          }
        }).catch(() => {
          this.finish()
          this.getCaptcha()
          this.RegisterForm.captcha = ''
        })
      } else {
        this.$message({
          message: '请输入手机号',
          type: 'error'
        })
      }

    },

    finish () {
      //重置倒计时
      this.VerificationShow = false
      this.$refs.countDown.reset();
    },

    //取消注册
    RegisterQX () {
      this.GetRegisterShow(false)
      this.EmptyForm()
    },


    //登录
    PostSignInShow () {
      this.GetSignInShow(true)
    },

    MenuShow () {
      this.menuShow = true
    },
    MenuCloseShow () {
      this.menuShow = false
    },

    //登录操作
    PostSignIn () {
      SignIn(this.SignInForm.email, this.SignInForm.pass).then((res) => {
        // console.log(res)
        if (res.data.code == 200) {
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          if (this.checked == true) {
            localStorage.setItem('token', 'Bearer' + ' ' + res.data.data.access_token)
            sessionStorage.setItem('token', 'Bearer' + ' ' + res.data.data.access_token)
          } else {
            sessionStorage.setItem('token', 'Bearer' + ' ' + res.data.data.access_token)
          }
          this.GetPersonalInfo()
          this.GetSignInShow(false)
          this.EmptySignInForm()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })

    },

    //个人信息
    GetPersonalInfo () {
      PersonalInfo().then((res) => {
        // console.log(res.data.message)
        this.User(res.data.message)
        this.GetIndividualsShow(true)
        // console.log(res.data.message)
        this.salesman = res.data.message.salesman
      })
    },

    //取消登录
    SignInQX () {
      this.EmptySignInForm()
      this.GetSignInShow(false)
    },


    //个人下拉菜单
    handleCommand (command) {
      switch (command) {
        case 'out':
          this.SignOut()
          break;
        default:
          this.$router.push(command)
      }

    },

    //退出
    SignOut () {
      this.GetIndividualsShow(false)
      this.Leave()
      this.$router.push('/Home')
      window.location.reload();
    },

    //清空注册表单
    EmptyForm () {
      this.RegisterForm.email = ''
      this.RegisterForm.verify = ''
      this.RegisterForm.pass = ''
      this.RegisterForm.name = this.wechatUserInfo.nickname
      this.RegisterForm.invite = sessionStorage.invite
      this.noSignin = false
    },

    //清空登录表单
    EmptySignInForm () {
      this.SignInForm.email = ''
      this.SignInForm.pass = ''
      this.noSignin = false
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

    //路由跳转充值
    ToRecharge () {
      this.$router.push('/Recharge')
    },

    //房间
    GetRooms () {
      Rooms('1', '1', '1').then((res) => {

        let RoomList = res.data.data.data
        // console.log(RoomList)
        // function compare(property) {
        // 	return function(a, b) {
        // 		let value1 = Number(a[property]);
        // 		let value2 = Number(b[property]);
        // 		return value1 - value2
        // 	}
        // }
        let haveHand = RoomList.filter((item) => {
          return item.status_alias == '进行中'
        })
        // console.log(haveHand)
        this.Headlines = haveHand.slice(0, 3)
        // console.log(this.Headlines)

      })
    },
    //前往房间
    toWelfareInfo (id) {
      this.$router.push({
        path: '/room',
        query: {
          id: id
        }
      })
    },

    ...mapMutations([
      'User',
      'GetIndividualsShow',
      'Leave',
      'GetRegisterShow',
      'GetSignInShow'
    ])

  },

  computed: {
    ...mapState([
      'user',
      'IndividualsShow',
      'RegisterShow',
      'SignInShow'
    ])
  },

  watch: {
    Email_Name (val) {
      this.Email_Name = val
    },

    $route (to, from) {
      // console.log(to.path)
      if (to.path == '/BoxFight' || to.path == '/vsbox' || to.path == '/CreateAConfrontation') {
        this.Box_Arr_Show = true
      } else {
        this.Box_Arr_Show = false
      }
    }
  },

  components: {
    Swiper,
    Banner,
    Rank
  }
}
</script>

<style lang="scss">
#NavHeader {
  .section_3 {
    padding: 0.68vw 6.67vw 0.63vw;
    background: url('../../../assets/images/home/headerbg.png');
    position: relative;

    .logo {
      width: 8.85vw;
      height: 2.86vw;
    }

    .group_title {
      margin-left: 3vw;
      align-self: center;
      cursor: pointer;

      &:hover {
        .group_text {
          margin-left: 0.52vw;
          color: #fff;
          font-size: 1.04vw;
          font-family: PingFang;
          font-weight: 700;
          line-height: 0.99vw;
        }
      }

      &.active {
        .group_text {
          margin-left: 0.52vw;
          color: #ff6c00;
          font-size: 1.04vw;
          font-family: PingFang;
          font-weight: 700;
          line-height: 0.99vw;
        }
      }

      .group_image {
        flex-shrink: 0;
        width: 1.04vw;
        height: 0.94vw;
      }

      .group_text {
        margin-left: 0.52vw;
        color: #fff;
        font-size: 1.04vw;
        font-family: PingFang;
        font-weight: 700;
        line-height: 0.99vw;
      }
    }

    .group_user {
      margin-left: 3vw;
      width: 8.85vw;
      position: relative;
      cursor: pointer;

      .text_8,
      .text_9 {
        color: #fff;
        font-size: 0.94vw;
        align-self: center;
        font-family: PingFang;
        font-weight: 700;
        line-height: 0.89vw;
        letter-spacing: 0.094vw;
      }

      .register {
        padding-top: 0.68vw;
        background-image: url('../../../assets/images/home/img_2.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 4.48vw;
        position: absolute;
        left: 0;
        top: 0;

        .image_8 {
          margin-top: 0.21vw;
          align-self: flex-start;
          width: 3.91vw;
          height: 0.52vw;
        }
      }

      .login {
        padding: 0.68vw 0 0.78vw;
        background-image: url('../../../assets/images/home/img_3.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 5.05vw;

        .image_9 {
          width: 3.91vw;
          height: 0.52vw;
          position: absolute;
          right: 0.63vw;
          bottom: 0;
        }
      }
    }

    .pre1 {
        margin-left: 4vw;
        width: 5.85vw;
        cursor: pointer;
        position: absolute;
        right: 2.4rem;

      span {
        // width: 20px;
        height: 10px;
        font-size: 0.9vw;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        margin-top: -0.1rem;
        background: linear-gradient(182deg, #fff494 0%, #fb9e3b 88.0859375%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .text_user {
        width: 1rem;
        height: 100%;
        text-align: center;
        margin-top: -0.25rem;
        margin-right: 0.3rem;

        img {
          display: block;
          margin: 0.2rem auto 0.05rem;
          width: 0.4rem;
          height: 0.4rem;
        }
      }
    }
  }

  .banner {
    margin-left: 19.73vw;
    margin-top: 1.82vw;
    width: 63vw;
      .image_container {
        width: 800px;
        height: 290px;
        // background: #ffd926;
        margin: 0 auto;

        .image_box {
          width: 200px;
          height: 275px;
          float: left;
          margin-right: 40px;
          // background: pink;
          position: relative;

          a {
            display: block;
            cursor: pointer;
          }
          .image_link {
            width: 200px;
            height: 275px;

            .img_one {
              display: block;
              width: 197px;
              height: 200px;
              position: absolute;
              top: 0;
              left: 0;
            }

            .img_two {
              display: block;
              width: 200px;
              height: 275px;
            }
            .img_three {
              display: block;
              width: 200px;
              height: 130px;
              position: absolute;
              bottom: 0;
              right: 0;
            }
            .img_four {
              display: block;
              width: 140px;
              height: 110px;
              position: absolute;
              bottom: 10px;
              right: 35px;
              cursor: pointer;
            }
            .img_five {
              position: absolute;
              bottom: 135px;
              right: 40px;
              width: 170px;
            }
            .img_six {
              display: block;
              width: 200px;
              height: 140px;
              position: absolute;
              bottom: 91px;
              right: -1px;
              cursor: pointer;
            }
            .img_seven {
              position: absolute;
              bottom: 3px;
              right: 70px;
              width: 23px;
            }
            button {
              position: absolute;
              bottom: 60px;
              left: 57px;
              background: transparent;
              border: none;
              color: #fff;
              font-size: 16px;
              font-weight: bold;

              a {
                color: #fff;
              }
            }
            .fs {
              color: #ffffff;
              font-size: 18px;
              font-weight: bold;
              position: absolute;
              left: 27px;
              top: 20px;
              text-shadow: 1px 1px 0px #a57500;
            }
            .jb {
              color: #ffffff;
              font-size: 14px;
              font-weight: bold;
              position: absolute;
              // left: 135px;
              bottom: 3px;
              text-shadow: 1px 1px 0px #db0c0c;
            }
          }
        }
      }
    
  }


  .XiangZi_Box {
    width: 100%;
    display: flex;

    .XiangZi_item {
      width: 1.92rem;
      height: 2.3rem;
      background: rgba(25, 25, 25, 0.6);
      border: 1px solid #2b2b2b;
      margin-left: -1px;
      cursor: pointer;
      text-align: center;
      position: relative;
      box-sizing: border-box;

      .pic {
        width: 1.6rem;
        height: 1.6rem;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          vertical-align: middle;
          max-width: 80%;
          max-height: 80%;
        }
      }

      span {
        img {
          width: 0.2rem;
          height: 0.2rem;
          vertical-align: middle;
        }

        font-size: 0.14rem;
        color: #ffd300;
      }

      p {
        margin-top: 0.08rem;
        font-size: 0.14rem;
      }

      &:hover {
        border-color: #ffd300;
        z-index: 5;

        p {
          color: #ffd300;
        }
      }
    }
  }

  .data_info {
    width: 100%;
    padding: 0 0.6rem 0.2rem;
    box-sizing: border-box;
    height: 0.6rem;
    display: flex;
    align-items: center;

    .data_info_item {
      display: flex;
      align-items: center;
      height: 0.6rem;
      margin-right: 0.2rem;

      img {
        height: 0.4rem;
        margin-right: 0.05rem;
      }

      p {
        font-size: 0.22rem;
        color: #a99bc5;

        span {
          color: #ea4391;
          margin-right: 0.04rem;
        }
      }
    }
  }

  .Wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
    color: white;
    .out {
      display: flex;
      width: 8rem;

      .Ren {
        flex: 1;
        background: url(../../../assets/images/public/back_dl.jpg) no-repeat;
        background-size: cover;
      }
    }

    .DZ-box {
      width: 4.5rem !important;
      background: #20222b;
      position: relative;
      // &::after{
      // 	display: block;
      // 	content: "";
      // 	width: 3rem;
      // 	height: 100%;
      // 	position: absolute;
      // 	left: -2.5rem;
      // 	top: 0;
      // 	background: url(../../../assets/images/public/name.webp) no-repeat center;
      // 	background-size: contain;
      // }

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

        .img_box {
          width: 0.4rem;
          height: 0.4rem;
          margin: 0.2rem auto 0;
          background: url(../../../assets/images/NavHeader/wechatClick.png) no-repeat center;
          background-size: cover;
          cursor: pointer;

          &:hover {
            background: url(../../../assets/images/NavHeader/wechat.png) no-repeat center;
            background-size: cover;
          }

          &.steam_icon {
            background-image: url(../../../assets/images/NavHeader/steamClick.png);

            &:hover {
              background-image: url(../../../assets/images/NavHeader/steam.png);
            }
          }
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
              color: red;
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
            color: #000;
            font-size: 0.14rem;
          }
        }

        .el-form-item__label {
          color: #fff;
          font-size: 0.14rem;
        }

        .el-input {
          .el-input__inner {
            background: #fff;
            border: none;
            color: #000;
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
          height: 0.4rem;
          background: #ffd322;
          color: #000;
          text-align: center;
          line-height: 0.4rem;
          margin: 0 0.1rem;
          border-radius: 0.04rem;
          cursor: pointer;
        }
      }

      .XY_box {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

        .el-checkbox__label {
          color: #ffd322;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border-color: #ffd322;
          background: #ffd322;
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

  .colon {
    font-family: PingFang SC;
    color:  #FB9E3B ;
  }
  .block {
    font-family: PingFang SC;
    // font-weight: 300;
    // color: #FFFFFF;
    // line-height: 439px;
    color:  #FB9E3B ;
    // -webkit-text-fill-color: transparent;
    width: 8rem;
    height: 6.7rem;
    border-radius: 0.06rem;
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
        color: rgba($color: #ffffff, $alpha: 0.6);
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
        background: rgba(0, 0, 0, 0.2);
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
              max-width: 100%;
              max-height: 100%;
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
            color: #ffd300;
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
        background: red;
        font-size: 0.14rem;
        color: #fff;
        text-align: center;
        line-height: 0.35rem;
        cursor: pointer;
      }
    }
  }

  .v--modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 999;
    animation-duration: 0.45s;
    overflow: scroll;

    .v--modal-box {
      position: relative;
      overflow: visible;
      box-sizing: border-box;
      animation-duration: 0.45s;

      .close {
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        position: absolute;
        right: -40px;
        top: 0;
        cursor: pointer;
        color: #ffd99e;

        .icon-close {
          font-size: 18px;
        }
      }

      .news-wrap {
        overflow: hidden;
        position: relative;
        cursor: pointer;

        .bg {
          max-width: 100%;
          max-height: 700px;
        }

        .check-wrap {
          display: flex;
          justify-content: right;
          align-items: center;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }

    .v--modal {
      max-width: 830px;
      max-height: calc(100% - 50px);
      margin: 60px auto 0;
      position: relative;
    }
  }

  .wrap {
    width: 17rem;
    max-width: 1492px;
    margin: 0 auto;
    top: 0.85rem;
    z-index: 9999;

    @media screen and (min-width: 1024px) {
      .nav-menu-main {
        top: 52px;
        position: absolute;
        z-index: 10000;
        right: 0;
        display: flex;
        flex-flow: column;
        border-bottom-right-radius: 0.05em;
        border-bottom-left-radius: 0.05em;
        color: #848492;
        width: 200px;
        background: #2c3c4d;
        border-radius: 0 0 11px 11px;

        .nav-menu {
          cursor: pointer;
          height: 0.6rem;
          box-sizing: border-box;
          padding-left: 0.28rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #fff;

          img {
            width: 0.23rem;
            height: 0.23rem;
            margin-right: 0.1rem;
          }

          span {
            font-size: 0.18rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
        }

        .recharge {
          margin: 0.1rem auto;
          height: 0.44rem;
          background: #d3610f;
          border-radius: 0.08rem;
          font-family: Microsoft YaHei;
          font-weight: 700;
          color: #20212b;
          font-weight: 600;
          padding: 0.08rem 0.22rem;
          font-size: 0.18rem;
          position: relative;
          width: 80%;
          box-shadow: none;
          line-height: 1.75;
          border: 0;
          cursor: pointer;
        }
      }
    }
    @media screen and (min-width: 1366px) {
      .nav-menu-main {
        top: 60px;
        position: absolute;
        z-index: 10000;
        right: 0;
        display: flex;
        flex-flow: column;
        border-bottom-right-radius: 0.05em;
        border-bottom-left-radius: 0.05em;
        color: #848492;
        width: 230px;
        background: #2c3c4d;
        border-radius: 0 0 11px 11px;

        .nav-menu {
          cursor: pointer;
          height: 0.8rem;
          box-sizing: border-box;
          padding-left: 0.43rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #fff;

          img {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.1rem;
          }

          span {
            font-size: 0.2rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
        }

        .recharge {
          margin: 0.1rem auto;
          height: 0.44rem;
          background: #d3610f;
          border-radius: 0.08rem;
          font-family: Microsoft YaHei;
          font-weight: 700;
          color: #20212b;
          font-weight: 600;
          padding: 0.08rem 0.22rem;
          font-size: 0.2rem;
          position: relative;
          width: 80%;
          box-shadow: none;
          line-height: 1.75;
          border: 0;
          cursor: pointer;
        }
      }
    }
     @media screen and (min-width: 1440px) {
      .nav-menu-main {
        top: 66px;
        position: absolute;
        z-index: 10000;
        right: 0;
        display: flex;
        flex-flow: column;
        border-bottom-right-radius: 0.05em;
        border-bottom-left-radius: 0.05em;
        color: #848492;
        width: 230px;
        background: #2c3c4d;
        border-radius: 0 0 11px 11px;

        .nav-menu {
          cursor: pointer;
          height: 0.6rem;
          box-sizing: border-box;
          padding-left: 0.43rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #fff;

          img {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.1rem;
          }

          span {
            font-size: 0.2rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
        }

        .recharge {
          margin: 0.1rem auto;
          height: 0.44rem;
          background: #d3610f;
          border-radius: 0.08rem;
          font-family: Microsoft YaHei;
          font-weight: 700;
          color: #20212b;
          font-weight: 600;
          padding: 0.08rem 0.22rem;
          font-size: 0.2rem;
          position: relative;
          width: 80%;
          box-shadow: none;
          line-height: 1.75;
          border: 0;
          cursor: pointer;
        }
      }
    }
    @media screen and (min-width: 1920px) {
      .nav-menu-main {
        top: 78px;
        position: absolute;
        z-index: 10000;
        right: 0;
        display: flex;
        flex-flow: column;
        border-bottom-right-radius: 0.05em;
        border-bottom-left-radius: 0.05em;
        color: #848492;
        width: 250px;
        background: #2c3c4d;
        border-radius: 0 0 11px 11px;

        .nav-menu {
          cursor: pointer;
          height: 0.6rem;
          box-sizing: border-box;
          padding-left: 0.43rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #fff;

          img {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.1rem;
          }

          span {
            font-size: 0.18rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
        }

        .recharge {
          margin: 0.1rem auto;
          height: 0.44rem;
          background: #d3610f;
          border-radius: 0.08rem;
          font-family: Microsoft YaHei;
          font-weight: 700;
          color: #20212b;
          font-weight: 600;
          padding: 0.08rem 0.22rem;
          font-size: 0.2rem;
          position: relative;
          width: 80%;
          box-shadow: none;
          line-height: 1.75;
          border: 0;
          cursor: pointer;
        }
      }
    }
    @media screen and (min-width: 2560px) {
      .nav-menu-main {
        top: 60px;
        position: absolute;
        z-index: 10000;
        right: 0;
        display: flex;
        flex-flow: column;
        border-bottom-right-radius: 0.05em;
        border-bottom-left-radius: 0.05em;
        color: #848492;
        width: 300px;
        background: #2c3c4d;
        border-radius: 0 0 11px 11px;

        .nav-menu {
          cursor: pointer;
          height: 0.8rem;
          box-sizing: border-box;
          padding-left: 0.43rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #fff;

          img {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.1rem;
          }

          span {
            font-size: 0.3rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
        }

        .recharge {
          margin: 0.1rem auto;
          height: 0.44rem;
          background: #d3610f;
          border-radius: 0.08rem;
          font-family: Microsoft YaHei;
          font-weight: 700;
          color: #20212b;
          font-weight: 600;
          padding: 0.08rem 0.22rem;
          font-size: 0.2rem;
          position: relative;
          width: 80%;
          box-shadow: none;
          line-height: 1.75;
          border: 0;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
