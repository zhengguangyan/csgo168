<template>
    <div class="open-box">
		<div class="Title">
			<p>{{ boxName }}</p>
		</div>
        <Rotate :active="active" :data="list" :awards="awards" ref="child" v-show="rotate" />
        <div class="box-content" v-show="!rotate">
            <div class="skip" @click="skip = !skip">
                <span :class="skip ? 'red' : 'white'"></span>
                <span>跳过动画</span>
            </div>
			<div class="box-content_pic">
				<img :src="boxImg" alt="" />
			</div>
            
        </div>
        <div class="price">${{ parseInt(boxPrice*active*100)/100 }}</div>
        <el-tooltip
            class="item"
            effect="dark"
            content="登录后才能开箱"
            placement="bottom"
            :disabled="user.state"
        >
            <el-button @click="Open" :loading="loading">开启箱子</el-button>
        </el-tooltip>
        <div class="check-box">
            <div class="text">数量</div>
            <div class="box">
                <span
                    v-for="k in 5"
                    :key="k"
                    :class="active == k ? 'active' : ''"
                    @click="active = k"
                    >{{ k }}</span
                >
            </div>
        </div>
		<div class="Title" style="margin: 0.3rem 0;">
			<p>箱子📦内容</p>
		</div>
        <div class="item-list">
            <div v-for="(value, key) in data" :key="key" class="item">
				<span><img src="@/assets/images/PublicImg/JinBi.png" alt="">{{value.bean}}</span>
				<div class="pic_bj">
					<img :src="value.lv | filter2" alt="">
				</div>
				<div class="pic">
					<img :src="value.cover" alt="" />
				</div>
				<div class="name">{{ value.name }}</div>
				<p>概率:{{value.odds_percent}}</p>
            </div>
        </div>
		
		
		<div class="Box_History" :style="ShowOrHide">
			<div class="An_btn" @click="Open_History">历史记录</div>
			<div class="Box_History_title">
				<p>最近开奖记录</p>
			</div>
			<div class="Box_History_item" v-for="(item,index) in HistoryList">
				<div class="ceng">
					<div class="pic">
						<img :src="item.user.avatar" alt="">
					</div>
					<p>{{item.user.name}}</p>
				</div>
				<div class="box_xian" :style="item.lv | filter1"></div>
				<div class="pic">
					<div class="pic_bj">
						<img :src="item.lv_bg_image" alt="">
					</div>
					
					<img :src="item.cover" alt="">
				</div>
				<div class="Box_info">
					<p>{{item.name | GuoLvOne}}</p>
					<span>{{item.dura_alias}}</span>
				</div>
			</div>
		</div>
        <ShowAwards ref="show" />
    </div>
</template>

<script>
import Rotate from "./components/rotate";
import ShowAwards from "./components/show";
import { SGetAwards, SOpenBox } from "@/network/server";
import { UnpackingRecord } from '@/network/api.js'
import { mapState, mapActions } from 'vuex'
import myMixin from '@/utils/mixin'
export default {
    name: "open",
    mixins: [myMixin],
    data() {
        return {
            data: [],                       //服务器箱子物品列表
            list: [],                       //处理后箱子物品列表
            awards: [],                     //奖品列表
            skip: false,                    //是否跳过动画
            rotate: false,                  //是否显示转盘
            active: 1,                      //转盘显示多少行
            boxImg: '',                     //箱子封面
            boxName: '#',                   //箱子名称
            boxPrice: 0,                    //箱子价格
            loading: false,                 //是否加载中
			HistoryList:[],                 //历史记录
			left:'-2.5'
			
			
        };
    },
    components: {
        Rotate,
        ShowAwards,
    },

    computed: mapState({
        user: 'user',
		ShowOrHide(){
			return 'left:' + this.left + 'rem'
		}
    }),

    created(){
        this.Init()
		this.GetUnpackingRecord()
    },
	
	filters: {
		filter1(val) {
			if (val == '1') {
				return 'background:#e6ba1c'
			} else if (val == '2') {
				return 'background:#d32ce6'
			} else if (val == '3') {
				return 'background:#834fff'
			} else if (val == '4') {
				return 'background:#4b69ff'
			} else {
				return 'background:#bbbbbb'
			}
		},
		
		filter2(val){
			if (val == '1') {
				return require('@/assets/images/PublicImg/LV1.png')
			} else if (val == '2') {
				return require('@/assets/images/PublicImg/LV2.png')
			} else if (val == '3') {
				return require('@/assets/images/PublicImg/LV3.png')
			} else if (val == '4') {
				return require('@/assets/images/PublicImg/LV4.png')
			} else {
				return require('@/assets/images/PublicImg/LV5.png')
			}
		},
		
		GuoLvOne(val){
			if(val.length > 12){
				return val.substr(0,11) + '...'
			}else{
				return val
			}
		}
	},
	
    watch:{
        $route(to,from){
            if (to.name == 'openbox') {
                this.Init()
				this.GetUnpackingRecord()
            }
        }
    },
	
    methods: {
        ...mapActions({
            MyInfo: 'Refresh'
        }),
		
		Open_History(){
			if(this.left == '-2.5'){
				this.left = '-5.52'
			}else if(this.left == '-5.52'){
				this.left = '-2.5'
			}
			
		},
		
        Open() {
            if (this.loading || !this.user.state) return
            this.loading = true
            if (this.rotate || this.skip) {
                SOpenBox(this.$route.query.id, this.active).then(data=>{
                    this.awards = data.awardlist
                    if (this.skip) {
                        this.$refs.show.SetAwards(this.awards)
                        this.loading = false
                    }else {
                        this.$refs.child.Pay()
                        setTimeout(() => {
                            this.$refs.show.SetAwards(this.awards)
                            this.loading = false
                        }, 5500);
                    }
                    this.MyInfo()
                }).catch(err=>{
                    this.Err(err.message)
                    this.loading = false
                })
            }else{
                this.rotate = true;
                this.loading = false
            }
        },
        Init(){
            this.rotate = false
            this.data = []
            SGetAwards(this.$route.query.id).then((data) => {
                // console.log(data)
                this.data = data.box_awards;
                this.list = this.data;
                this.boxImg = data.cover
                this.boxName = data.name
                this.boxPrice = data.bean
            });
        },
		GetUnpackingRecord(){
			UnpackingRecord(this.$route.query.id).then((res) => {
				// console.log(res.data.data.historylist)
				this.HistoryList = res.data.data.historylist.slice(0,10)
				// console.log(this.HistoryList)
				
			})
		}
	},
};
</script>

<style lang="scss" scoped>
.open-box {
	position: relative;
	padding-top: 0.4rem;
     .title {
         @include title;
    }
	.Box_History{
		width: 3rem;
		box-sizing: border-box;
		position: absolute;
		top: 0;
		transition: .3s;
		.An_btn{
			position: absolute;
			right: -0.4rem;
			top: 3rem;
			width: 0.4rem;
			height: 1.3rem;
			writing-mode:vertical-rl;
			background: #4854c9;
			text-align: center;
			line-height: 0.45rem;
			letter-spacing:4px;
			font-size: 0.22rem;
			border-radius: 0 0.04rem 0.04rem 0;
			cursor: pointer;
		}
		.Box_History_title{
			width: 3rem;
			height: 0.7rem;
			text-align: center;
			line-height: 0.7rem;
			font-size: 0.22rem;
		}
		.Box_History_item{
			width: 3rem;
			height: 1.1rem;
			background: rgba(35,42,61,0.8);
			border-top: 1px solid #49587e;
			box-sizing: border-box;
			display: flex;
			cursor: pointer;
			position: relative;
			.ceng{
				position: absolute;
				width: 100%;
				height: 100%;
				left: -3rem;
				top: 0;
				background: rgba(34, 41, 59, .8);
				display: flex;
				align-items: center;
				z-index: 11;
				transition: .3s;
				.pic{
					width: 0.8rem;
					height: 0.8rem;
					border-radius: 50%;
					overflow: hidden;
					margin-left: 0.2rem;
					img{
						width: 100%;
						height: 100%;
					}
				}
				p{
					font-size: 0.18rem;
					color: #fff;
					margin-left: 0.2rem;
				}
			}
			.box_xian{
				width: 3px;
				height: 100%;
				position: relative;
				z-index: 12;
			}
			.pic{
				width: 1.1rem;
				height: 1.1rem;
				margin-left: 0.2rem;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				.pic_bj{
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					img{
						max-width: 80%;
						max-height: 80%;
					}
				}
				img{
					position: relative;
					z-index: 10;
					max-width: 100%;
					max-height: 100%;
				}
			}
			.Box_info{
				width: 1.7rem;
				height: 1.1rem;
				margin-left: 0.2rem;
				p{
					width: 100%;
					height: 0.4rem;
					margin-top: 0.2rem;
					line-height: 0.4rem;
					font-size: 0.16rem;
					color: #d42d4f;
				}
				span{
					font-size: 0.14rem;
					color: #d4d4d4;
				}
			}
			&:hover{
				.ceng{
					left: 0;
				}
			}
		}
	}	
     .box-content {
         width: 8rem;
         height: 2rem;
         margin: 0.2rem auto;
         @include url("OpenBox/openbox.png");
         background-size: 100% 100%;
         position: relative;
         .skip {
             display: flex;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
             align-items: center;
             position: absolute;
             left: 5.9rem;
             top: 3.15rem;
			 width: 1.2rem;
			 height: .33rem;
			 border-radius: 20px;
			 background: rgb(255, 211, 34);
			 display: flex;
			 justify-content: center;
			 align-items: center;
             span {
                 cursor: pointer;
                 &:nth-child(1) {
                     width: 0.15rem;
                     height: 0.15rem;
                     border-radius: 50%;
                }
                 &:nth-child(2) {
                     padding-left: 0.05rem;
                     font-size: 0.8em;
					 color: #000;
                }
            }
             .red {
                 background-color: red;
            }
             .white {
                 background-color: white;
            }
        }
		.box-content_pic{
			width: 2.5rem;
			height: 100%;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			img{
				max-width: 100%;
				max-height: 100%;
				vertical-align: middle;
			}
		}
         
    }
     .price{
         width: 100%;
         text-align: center;
         font-size: 0.24rem;
         color: rgb(117, 220, 158);
         margin-top: 0.3rem;
    }
     /deep/.el-button {
         display: block;
         width: 3.16rem;
         margin: 0.4rem auto;
         color: white;
         font-weight: 700;
		 text-align: center !important;
         height: 0.64rem;                                                                                                                                
         border-radius: 0.04rem;
		 background-image:linear-gradient(to right, #d12d4e 0%, #573460 100%);
         border-style: none;
         transition: all 0.15s ease-in-out 0s;
		 span{
		 			 font-size: 0.22rem !important;
		 }
         &:hover {
             box-shadow: #d12d4e 0rem 0rem 0.1rem;
        }
    }
     /deep/.el-button.is-loading:before {
         pointer-events: none;
         content: '';
         position: absolute;
         left: -0.01rem;
         top: -0.01rem;
         right: -0.01rem;
         bottom: -0.01rem;
         border-radius: inherit;
         background: rgba(255, 2, 17, 0.2);
		 
    }
     .check-box {
         max-width: 4rem;
         background: rgba(255, 255, 255, 0.15);
         border-radius: 0.1rem;
         padding: 0.2rem;
         margin: 0.2rem auto;
         .text {
             text-align: center;
             font-size: 0.16rem;
             height: 0.3rem;
        }
         .box {
             display: flex;
             align-items: center;
             justify-content: center;
             font-size: 0.14rem;
             span {
                 display: block;
                 color: rgb(255, 255, 255);
                 background: rgb(0, 0, 0);
                 cursor: pointer;
                 width: 0.5rem;
                 height: 0.5rem;
                 line-height: 0.5rem;
                 font-size: 0.18rem;
                 text-align: center;
                 transition: all 0.1s ease 0s;
                 margin: 0.05rem;
                 border-radius: 0.05rem;
            }
             .active {
                 box-shadow: #d12d4e 0rem 0rem 0.15rem;
				 background-image:linear-gradient(to bottom, #d12d4e 0%, #573460 100%);
            }
        }
    }
     .item-list {
         display: flex;
         flex-wrap: wrap;
		 margin: 0 auto;
		 width: 12rem;
         .item {
             position: relative;
             width: 2.32rem;
			 padding: 0.1rem 0;
             font-size: 0.5em;
             text-align: center;
             background-repeat: no-repeat;
             background-position: top center;
             background-size: .9rem .9rem;
			 margin-right: 0.1rem;
			 margin-bottom: 0.1rem;
			 background: rgb(22,20,40);
			 box-sizing: border-box;
			 cursor: pointer;
			 border-radius: 0.04rem;
			 &:nth-child(5n){
				 margin-right: 0;
			 } 
			 &:hover{
			 	.pic{
					img{
						transform: translateY(-0.1rem);
					}
				}			 
			 } 
			span{
				display: block;
				width: 100%;
				height: 0.3rem;
				display: flex;
				align-items: center;
				padding-left: 0.1rem;
				box-sizing: border-box;
				font-size: 0.2rem;
				color: #75cd66;
				img{
					width: 0.25rem;
					height: 0.25rem;
					margin-right: 0.05rem;
					
				}
			}
			.pic_bj{
				width: 2rem;
				height: 2rem;
				position: absolute;
				left: 0.15rem;
				display: flex;
				justify-content: center;
				align-items: center;
				img{
					max-width: 80%;
					max-height: 80%;
					vertical-align: middle;
					transition: .3s;
				}
			}
			.pic{
				width: 2rem;
				height: 2rem;
				margin: 0 auto;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				z-index: 10;
				img{
					max-width: 80%;
					max-height: 80%;
					vertical-align: middle;
					transition: .3s;
				}
			}
			.name{
				width: 100%;
				height: 0.4rem;
				font-size: 0.16rem;
				line-height: 0.4rem;
			}
			p{
				width: 100%;
				height: 0.3rem;
				line-height: 0.3rem;
				font-size: 0.14rem;
				color: #969696;
			}



        }
         @for $i from 1 through 5 {
             .open-lv#{
                 $i 
            }
             {
                 border-bottom: lv-color($i) 0.01rem solid;
                 color: lv-color($i);
            }
        }
    }
}
</style>
