<template>
	<div class="about">
		<div class="about-box" style="color: white">
			<div class="Title">
				<p>个人中心</p>
			</div>

			<van-overlay class="out-box" :show="ZheZhaoShow">
				<van-loading v-show="loadingShow" color="red" size="100" />
			</van-overlay>

			<div class="Me-box">
				<div class="headportrait-box">
					<div class="headportrait">
						<img :src="user.avatar">
					</div>


					<my-upload :key="menuKey" @crop-success="cropSuccess" v-model="show" :width="200" :height="200" img-format="png"
					 :size="size" langType='zh' :noRotate='false' field="Avatar1"></my-upload>


					<button class="btn" @click="toggleShow">设置头像</button>
				</div>
				<div class="Me-item">
					<p>Steam_id</p>
					<div class="box-item-info">{{steam_id}}</div>
				</div>
				<div class="Me-item">
					<p>Steam交易链接</p>
					<input type="text" v-model="steam_url">
					<div class="btn" @click="GetSteamUrl">保存</div>
				</div>
				<div class="Me-item">
					<p>昵称</p>
					<input type="text" v-model="Name">
					<div class="btn" @click="PostName">保存</div>
				</div>
				<div class="Me-item">
					<p>我的邀请码</p>
					<div class="box-item-info">{{invite_code}}</div>
				</div>
				<div class="Me-item">
					<p>绑定邀请码</p>
					
					<input type="text" v-if="inviter_id == 0" v-model="invite_code_bangding" placeholder="请输入绑定邀请码，绑定邀请码只可修改一次">
					<div class="btn" @click="setinvite_code" v-if="inviter_id == 0">保存</div>
					
					<div class="box-item-info" v-if="inviter_id !== 0">{{inviter.invite_code}}</div>
					
					<!-- <div class="tip" v-if="inviter_id == 0">绑定邀请码只可修改一次</div> -->
				</div>
				<div class="Me-item">
					<p>手机号</p>
					<div class="box-item-info">{{Email}}</div>
				</div>
				<div class="Me-item">
					<p>注册时间</p>
					<div class="box-item-info">{{created_at}}</div>
				</div>
				<div class="Me-item">
					<p>上次活动时间</p>
					<div class="box-item-info">{{updated_at}}</div>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	import {
		PersonalInfo,
		SteamUrl,
		Set_avatar,
		base64,
		Set_Name,
		set_inviter
	} from '@/network/api.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import myUpload from 'vue-image-crop-upload';
	export default {
		name: 'about',
		data() {
			return {
				menuKey: 1,
				show: false,
				size: 2.1,

				ZheZhaoShow: false,
				loadingShow: true,

				Name: '',
				invite_code: '',
				Email: '',
				created_at: '',
				updated_at: '',

				steam_url: '',
				steam_id:'',
				invite_code_bangding:'',
				inviter_id:0,
				inviter:null
			}
		},

		created() {
			this.GetPersonalInfo()
		},
		components: {
			"my-upload": myUpload
		},
		methods: {
			//获取个人信息
			GetPersonalInfo() {
				PersonalInfo().then((res) => {
					this.steam_id = res.data.message.steam_id
					this.Name = res.data.message.name
					this.invite_code = res.data.message.invite_code
					this.Email = res.data.message.email
					this.created_at = res.data.message.created_at
					this.updated_at = res.data.message.updated_at
					this.steam_url = res.data.message.steam_url
					this.inviter_id = res.data.message.inviter_id
					this.inviter = res.data.message.inviter
				})
			},

			// 更改名称
			PostName() {
				Set_Name(this.Name).then((res) => {
					this.$message({
						message: res.data.message,
						type: 'success'
					})

					PersonalInfo().then((res) => {
						this.User(res.data.message)
					})
				})
			},
			
			setinvite_code(){
				set_inviter(this.invite_code_bangding).then(res => {
					this.$message({
						message: res.data.message,
						type: 'success'
					})
					this.GetPersonalInfo()
				})
			},
			
			//设置Steam连接
			GetSteamUrl() {
				SteamUrl(this.steam_url).then((res) => {
					// console.log(res)
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
				})
			},

			//头像上传

			toggleShow() {
				this.show = !this.show;
			},

			cropSuccess(imgDataUrl, field) {
				this.ZheZhaoShow = true
				// console.log('-------- crop success --------', imgDataUrl)
				base64(imgDataUrl).then((res) => {
						Set_avatar(res.data.data.url).then((res) => {
							PersonalInfo().then((res) => {
								this.User(res.data.message)
								this.ZheZhaoShow = false
								this.$message({
									message: '修改成功',
									type: 'success'
								})
							})
						})
					})
					++this.menuKey
				this.show = false
			},

			...mapMutations([
				'User'
			])

		},
		computed: {
			...mapState([
				'user'
			])
		},
		watch:{
			user(v){
			}
			
		}
	}
</script>
<style lang="scss">
	.about-box {
		width: 100%;
		padding-top: 0.4rem;

		.out-box {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.Me-box {
			width: 10rem;
			margin: 0.4rem auto 0;

			.headportrait-box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.btn {
					width: 1rem;
					height: 0.4rem;
					background: #a15fc0;
					border-radius: 100px;
					text-align: center;
					line-height: 0.4rem;
					border:none;
					font-size:0.15rem;
					cursor: pointer;
				}

				.vicp-wrap {
					background: #353535;

					.vicp-icon4 {
						display: none;
					}

					.vicp-drop-area {
						background: #2f2f2f;
					}

					.vicp-operate {
						width: 100%;
						height: 0.4rem;
						display: flex;
						justify-content: flex-end;

						a {
							float: none;
							margin: 0 0 0 0.2rem;
							display: block;
							width: 1rem;
							height: 0.4rem;
							background: rgba($color: #fff, $alpha: .1);
							border: 1px solid #fff;
							border-radius: 0.04rem;
							text-align: center;
							line-height: 0.4rem;
							cursor: pointer;
							color: #fff;
							font-size: 0.16rem;
						}

					}
				}

				.headportrait {
					width: 0.8rem;
					height: 0.8rem;
					margin-bottom:0.1rem;
					border-radius: 50%;
					background: rgba($color: #fff, $alpha: .1);
					border: 1px solid #fff;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}
			}

			.Me-item {
				width: 100%;
				height: 0.95rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 0.15rem;
				position: relative;
				.tip{
					position: absolute;
					bottom: 0px;
					font-size: 14px;
					left: 0px;
					color: rgb(255, 211, 34);
				}

				p {
					width: 1.2rem;
				}

				input {
					width: 5.3rem;
					height: 0.4rem;
					
					border: none;
					outline: red;
					padding: 0 0.15rem;
					box-sizing: border-box;
					font-size: 0.13rem;
					color: #3b0249;
					border: 1px solid #d3a9fd;
					background-color:#d3a9fd;
					&::placeholder{
						color: rgba($color: #3b0249, $alpha: 0.5);
					}
				}

				.btn {
					width: 1rem;
					height: 0.4rem;
					background: #a15fc0;
					border-radius: 100px;
					text-align: center;
					line-height: 0.4rem;
					border:none;
					font-size:0.15rem;
					cursor: pointer;
				}

				.box-item-info {
					width: 7.4rem;
					height: 0.4rem;

					line-height: 0.4rem;
					padding-left: 0.2rem;
					box-sizing: border-box;
					font-size: 0.13rem;
				}
			}
		}
	}
</style>
