<template>
  <div id="Index">
    <div class="section">
      <div class="group">
        <div class="group_1">
          <img src="../../assets/images/home/backgrond.jpg" class="image">
          <div class="section_2">
            <nav-header></nav-header>
            <div class="out-bj">
              <keep-alive>
                <router-view class="output" v-if="!$route.meta.keepAlive"></router-view>
              </keep-alive>
              <router-view class="output" v-if="$route.meta.keepAlive"></router-view>
            </div>
            <public-footer></public-footer>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>

<script>
import NavHeader from '@/components/common/NavHeader/NavHeader.vue'
import PublicFooter from '@/components/common/PublicFooter/PublicFooter.vue'

export default {
  name: 'Index',
  data() {
    return {}
  },

  methods: {},

  components: {
    NavHeader,
    PublicFooter
  }
}
</script>

<style lang="scss">
#Index {
  //padding-top: 3vw;
  background-color: #ffffff;
  width: 100%;

  .section {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 45.94vw;

    .group {
      position: relative;
    }

    .group_1 {
      padding: 5.21vw 0 11.46vw;
      width: 100%;
      position: absolute;
      left: 0;
      right: 7.03vw;
      top: 0;

      .image {
        //margin-left: 2vw;
        width: 99vw;
        height: 41.51vw;
      }

      .section_2 {
        background-image: url("../../assets/images/home/Background@2x.png");
        //background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }
    }

  }

  .out-bj {
    width: 100%;
    background-attachment: fixed;
    background-size: 60%;
  }

  .el-backtop {
    background: #4854c9;

    i {
      color: #fff;
    }
  }

  #output, .output {
    width: 15rem;
    padding-bottom: 0.75rem;
    margin: 0 auto;
  }

  .Tips {
    text-align: center;
    color: #2a9fd6;
    font-size: 0.14rem;
    line-height: 0.5rem;
    cursor: pointer;

    &:hover {
      color: #2fc8ff;
    }
  }
}
</style>
