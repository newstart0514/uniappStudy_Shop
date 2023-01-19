<template>
	<view class="loginContainer">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btnLogin" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tipsText">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed: {
			// 将重定向信息加载到页面上
			...mapState('m_user',['redirectInfo'])
		},
		methods: {
			// 获取更新用户信息的方法
			...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
			// 获取到用户的登录信息
			getUserInfo(e) {
				// 判断是否获取用户信息成功
				if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权!')
				// 更新vuex中的用户信息
				this.updateUserInfo(e.detail.userInfo)
				// 获取token
				this.getToken(e.detail)
			},
			// 获取token的方法
			async getToken(info) {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				// 判断调用成功状态
				if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				// 获取token
				const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				// this.updateToken(loginResult.message.token)
				this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
				uni.$showMsg('登录成功!')
				// 返回上一页
				this.navigateBack()
			},
			// 返回上一页
			navigateBack() {
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							// 重置重定向信息
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: white;
	}
	
	.loginContainer {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;
		
		&::after {
			content: ' ';
			display: block;
			width: 100%;
			height: 40px;
			background-color: white;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}
		
		.btnLogin {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #fba414;
		}
		
		.tipsText {
			font-size: 12px;
			color: gray;
		}
	}
</style>