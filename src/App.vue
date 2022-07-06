<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'
import {
  Blind_box_channel,Views
} from '@/network/api.js'

export default {
  name: '',
  data() {
    return {}
  },


  created() {

    if (this._isMobile()) {
      window.location.href = process.env.VUE_APP_TO_SIZE + window.location.search
    }
    this.$socket.Event(e => {
      sessionStorage.setItem('C_id', e)
      this.PostBlind_box_channel(e)
    }).Start()

    this.$socket.Add('joinGroup', this.JoinGroup)
    this.$socket.Add('endGroup', this.AddEndGroup)
    if (this.getCookie('access_k') == ''){ //cookie 中没有 popped 则赋给他一个值（此时弹框显示）
      document.cookie = "access_k = yes";
      //访问量
      Views()
    }
  },

  methods: {

    //判断访问设备
    _isMobile() {
      let flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },

    PostBlind_box_channel(e) {
      Blind_box_channel(e).then(res => {
      })
    },

    //加入房间
    JoinGroup(data) {
      this.AddInformation(data)
    },

    //对战结束
    AddEndGroup(data) {
      this.GetJieShuVsData(data)
    },

    getCookie(Name) { //cookie
      var search = Name + "=";
      var returnValue = "";
      if (document.cookie.length > 0) {
        var offset = document.cookie.indexOf(search);
        if (offset !== -1) {
          offset += search.length;
          var end = document.cookie.indexOf(";", offset);
          if (end == -1){
            end = document.cookie.length;
          }
          returnValue = decodeURIComponent(document.cookie.substring(offset, end));
        }
      }
      return returnValue;
    },

    ...mapActions([
      'AddInformation',
      'GetJieShuVsData'
    ])
  }
}
</script>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
  // background: url(/iconfont.svg);
}

#app {
  //width: 100vw;
  //height: 100vh;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
}

.van-overlay {
  z-index: 100 !important;
}

body {
  // background: linear-gradient(-45deg, #23a6d5, #702960, #4d288a, #311442);
  // background-size: 100% 100%;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
  'Droid Sans', 'Helvetica Neue', 'Microsoft Yahei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &::before {
    content: '';
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: rgba($color: #000000, $alpha: 1);
    z-index: -1;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.Title {
  text-align: left;

  p {
    display: inline-block;
    margin: 0 auto;
    color: #fff;
    font-size: 0.2rem;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    padding: 20px 56px;
    position: relative;

    &::before {
      display: block;
      content: "";
      position: absolute;
      top: 0px;
      left: -13px;
      height: 80%;
      width: 100px;
      background: url(./assets/images/PublicImg/title.png) no-repeat center;
      background-size: contain;
      transform: scale(0.8);
    }
  }

  &.center {
    text-align: center;

    p {
      margin: 0.7rem auto 0;
      font-size: 0.26rem;
      color: #fff;

      &::before {
        display: block;
        content: "";
        position: absolute;
        top: 75%;
        left: 25%;
        height: 80%;
        width: 100px;
        background: url(./assets/images/PublicImg/title.png) no-repeat center;
        background-size: contain;
        transform: scale(0.8);
      }

      &::after {
        display: block;
        content: "";
        position: absolute;
        top: -55%;
        right: 16%;
        height: 80%;
        width: 100px;
        background: url(./assets/images/PublicImg/title.png) no-repeat center;
        background-size: contain;
        transform: scale(0.8) rotate(180deg);
      }
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.justify-start {
  display: flex;
  justify-content: flex-start;
}

.justify-center {
  display: flex;
  justify-content: center;
}

.justify-end {
  display: flex;
  justify-content: flex-end;
}

.justify-evenly {
  display: flex;
  justify-content: space-evenly;
}

.justify-around {
  display: flex;
  justify-content: space-around;
}

.justify-between {
  display: flex;
  justify-content: space-between;
}

.items-start {
  display: flex;
  align-items: flex-start;
}

.items-center {
  display: flex;
  align-items: center;
}

.items-end {
  display: flex;
  align-items: flex-end;
}
</style>
