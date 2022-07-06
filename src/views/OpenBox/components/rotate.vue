<template>
    <div id="rotate-box" >
        <div class="rotate-box" :style="'width:'+width+'rem;'">
            <Item ref="item" v-for="k in active" :key="k" :list="GetList(k)" :num="num" :line="width" />
        </div>
        <div class="line"></div>
    </div>
</template>

<script>
import Item from "./item";
import myMixin from "../mixins/random";
export default {
    name: "rotate",
    components: {
        Item,
    },
    props: {
        active: {
            type: Number,
            default: 1,
        },
        data: {
            type: Array,
            default: [],
        },
        awards: {
            type: Array,
            default: [],
        },
        width: {
            type: Number,
            default: 14,
        }
    },
    mixins: [myMixin],
    data() {
        return {
            num: 60,
            list: [],
            mp3: new Audio(require('@/assets/audios/open.mp3'))
        };
    },

    methods: {
        Pay() {
            this.mp3.play()
            for (let i = 0; i < this.active; i++) {
                this.$refs.item[i].TestRotate();
            }
        },
        Open() {
            this.award = this.data[0];
        },
    },
};
</script>

<style lang="scss" scoped>
.rotate-box {
     width: 100%;
     overflow-x: hidden;

}
 .line {
     width: 3.6rem;
     height: 0.2rem;
     margin: 0 auto;
     @include url("OpenBox/line.png");
     background-size: 100% 100%;
}
 
</style>
