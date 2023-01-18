<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="addressChooseBox" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">选择收货地址+</button>
		</view>

		<!-- 渲染收货地址的盒子 -->
		<view class="addressInfoBox" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1Left">
					<view class="username">收货人：{{address.userName}}</view>
				</view>
				<view class="row1Right">
					<view class="phone">电话：{{address.telNumber}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2Left">收货地址：</view>
				<view class="row2Right">{{addressAtr}}</view>
			</view>
		</view>

		<!-- 底部的边框线 -->
		<image src="../../static/cart_border@2x.png" class="addressBorder"></image>
	</view>
</template>

<script>
	import {mapState, mapMutations,mapGetters} from 'vuex'
	export default {
		name: "my-address",
		data() {
			return {
				// 收货地址信息
				// address: {}
			};
		},
		computed: {
			// 将地址信息映射到页面上
			...mapState('m_user',['address']),
			// 将地址拼接后的信息映射到页面上
			...mapGetters('m_user',['addressAtr'])
		},
		methods: {
			// 将更新地址的方法映射到页面上
			...mapMutations('m_user', ['updateAddress']),
			// 选择收货地址
			async chooseAddress() {
				// 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能，返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
				const [err, succ] = await uni.chooseAddress().catch(err => err)
				// 用户成功的选择了收货地址
				if (err === null && succ.errMsg === 'chooseAddress:ok') {
					// 为 data 里面的收货地址对象赋值
					// this.address = succ
					// 持久化存储地址信息
					this.updateAddress(succ)
				}
				// 用户没有授权
				if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
				    this.reAuth()
				  }
			},
			// 用户重新授权的方法
			async reAuth() {
				// 提示用户进行授权
				const [err2, confirmResult] = await uni.showModal({
					content: '检测到您未开启地址权限，是否开启地址权限?',
					confirmText: '确认',
					cancelText: '取消'
				})
				// 如果弹窗异常，则直接退出
				if(err2) return
				// 如果点击了取消按钮，则提示用户
				if(confirmResult.cancel) return uni.$showMsg('您取消了地址授权')
				// 如果点击了确认按钮，则调用设置方法进入授权页面，让用户重新授权
				if(confirmResult.confirm) return uni.openSetting({
					// 授权结束，对结果进行进一步判断
					success: (settingResult) => {
						// 地址授权值为true，提示授权成功
						if(settingResult.authSetting[scope.address]) return uni.$showMsg('授权成功！请选择地址')
						// 地址授权值为false，则提示授权失败
						if(!settingResult.authSetting[scope.address]) return uni.$showMsg('授权失败！您取消了授权')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	// 选择地址
	.addressChooseBox {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	// 地址展示
	.addressInfoBox {
		font-size: 12px;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;

		.row1 {
			display: flex;
			justify-content: space-between;

			.row1Left {
				.username {}
			}

			.row1Right {
				display: flex;
				justify-content: space-between;

				.phone {}
			}
		}

		.row2 {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			margin-top: 10px;

			.row2Left {
				white-space: nowrap;
			}

			.row2Right {}
		}
	}

	// 底部边框线
	.addressBorder {
		display: block;
		width: 100%;
		height: 5px;
	}
</style>
