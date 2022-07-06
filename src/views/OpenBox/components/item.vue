<template>
    <div class="rotate-item">
        <div
            class="lunbo"
            :style="
                'width: ' +
                width * num +
                'rem; margin-left: ' +
                (line%width)/2 +
                'rem;transition: transform ' +
                dur +
                'ms cubic-bezier(0, 0, 0.28, 1); transform: translateX(-' +
                pos +
                'rem);'
            "
        >
            <div v-for="(value, key) in list" :key="key" :style="'width:'+width+'rem'" :class="'item item-lv'+value.lv">
                <img :src="value.cover" alt />
                <p class="prop-name">{{ value.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import myMixin from "../mixins/rotate";
export default {
    name: "rotate-item",
    props: {
        list: {
            type: Array,
            default: [],
        },
        award: {
            type: Object,
            default: null,
        },
        num: {
            type: Number,
            default: 0,
        },
        line: {
            type: Number,
            default: 14,
        },
    },
    mixins: [myMixin],
    data() {
        return {
            width: 2,
            active: 1,
            pos: 0,
            dur: 0,
            canRotate: true,
        };
    },

    methods: {
        //试转
        TestRotate() {
            this.Rotate();
        },
    },
};
</script>

<style lang="scss" scoped>
.rotate-item {
     height: 1.2rem;
     margin: 0 auto;
     background-size: 100% 100%;
     padding: 0.1rem 0;
     position: relative;
     z-index: 98;
     overflow: hidden;
     mask-image: linear-gradient( 90deg, rgba(25, 25, 25, 0) 4%, #000000 50%, rgba(25, 25, 25, 0) 96%);
     mask-size: cover;
     .lunbo {
         display: flex;
         height: 100%;
    }
     .item {
         position: relative;
         background-repeat: no-repeat;
         background-size: 100% 100%;
         img {
             display: block;
             width: 1.2rem;
             margin: 0 auto;
        }
         .prop-name {
             position: absolute;
             width: 100%;
             text-align: center;
             bottom: 0;
             font-size: 0.14rem;
             @include texthide;
        }
    }
     @for $i from 1 through 5 {
         .item-lv#{
             $i 
        }
         {
             color: lv-color($i);
        }
    }
}
 
</style>
