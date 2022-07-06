<template>
    <div class="storage">
        <!-- 列表 -->
        <div class="box-list">
            <div
                class="item active"
                v-for="(value, key) in list"
                :key="key"
                :class="'item-lv' + value.lv"
            >
                <div class="top">
                    <div>{{ value.bean || 0 }}</div>
                    <div>{{ value.dura_alias || "" }}</div>
                </div>
                <div class="img">
                    <img :src="value.cover || '#'" />
                </div>
                <div class="name">{{ value.box_name || "" }}</div>
                <div class="cover" v-show="key == 1"><div>已选择</div></div>
            </div>
        </div>
        <!-- 分页 -->
        <div class="page-num">
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="currentPage"
                :total="total"
                hide-on-single-page
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { SStorage } from "@/network/server";
export default {
    data() {
        return {
            list: [],
            total: 11,
            choice: [],
            page: 0,
        };
    },
    created() {
        this.Storage(0);
    },
    watch: {
        $route(to, from) {
            if (to.name == "#") {
                //this.RollInfo();
            }
        },
    },
    methods: {
        currentPage(page) {
            this.page = page;
            this.Storage(page);
        },
        Storage(page) {
            SStorage(page).then((data) => {
                this.total = data.total;
                this.list = data.data;
            });
        },
        Choice(value) {
            !this.choice[this.page] && (this.choice[this.page] = []);
            const arr = this.choice[this.page];
            arr[arr.length] = value
        },
    },
};
</script>

<style lang="scss" scoped>
.storage {
    .box-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .item {
            position: relative;
            width: rem(240);
            margin: rem(10) rem(20);
            background-color: rgba(34, 34, 34, 0.8);
            border-radius: rem(8);
            cursor: pointer;
            .top {
                display: flex;
                justify-content: space-between;
                width: 100%;
                padding: rem(8);
                box-sizing: border-box;
                div {
                    font-size: rem(14);
                    &:nth-child(1) {
                        @include url("PublicImg/JinBi.png");
                        background-size: auto 100%;
                        padding-left: rem(20);
                        background-repeat: no-repeat;
                    }
                }
            }
            .img {
                width: 100%;
                img {
                    display: block;
                    width: 80%;
                    margin: rem(30) auto;
                }
            }
            .name {
                text-align: center;
                margin-bottom: rem(10);
                font-size: rem(16);
            }
            .cover {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(19, 19, 19, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                div {
                    text-align: center;
                    font-weight: bold;
                    font-size: rem(24);
                    text-shadow: 0 0 rem(30) rgba(255, 255, 255, 0.5);
                }
            }
        }
        @for $i from 1 through 5 {
            .item-lv#{ $i } {
                border-top: lv-color($i) 0.01rem solid;
                border-bottom: lv-color($i) 0.01rem solid;
                color: lv-color($i);
            }
        }
    }
    /deep/.page-num {
        width: 100%;
        text-align: center;
        li {
            background: #111111 !important;
            &.active {
                background: red !important;
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
}
</style> 