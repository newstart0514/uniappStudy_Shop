<template>
	<view class="settleContainer">
		<!-- 全选 -->
		<label class="radio">
			<radio color="#fba414" :checked="isFullCheck" @click="updateAllState()" /><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amountBox">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btnSettle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	} from 'vuex'

	export default {
		name: "my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds: 3,
				// 定时器对象
				timer: null
			};
		},
		computed: {
			// 将购物车里面的数据取出来
			...mapState('m_cart', ['cart']),
			// 将已勾选的商品总数量渲染出来
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			// 获取选择的地址
			...mapGetters('m_user', ['addressAtr']),
			// 获取用户数据
			...mapState('m_user', ['token']),
			// 判断是否为全选状态
			isFullCheck() {
				return this.total === this.checkedCount
			}
		},
		methods: {
			// 将更新所有商品选中状态加载到组件上
			...mapMutations('m_cart', ['updateAllGoodsState']),
			// 将重定向更新方法映射到组件上
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 全选radio框的点击事件
			updateAllState() {
				// 将isFullCheck取反获取到新的状态传入更新
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 结算按钮的点击事件
			settlement() {
				// 判断用户是否勾选了需要结算的商品
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')
				// 判断用户是否选择了地址
				if (!this.addressAtr) return uni.$showMsg('请选择收货地址!')
				// 判断用户是否登录了
				// if(!this.token) return uni.$showMsg('请先登录!')
				if (!this.token) return this.delayNavigate()
				// 调用支付方法
				this.payOrder()
			},
			// 展示倒计时的提示消息
			showTips(n) {
				// 展示提示信息
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示消息
					title: `请登录后再结算!${n}秒后自动跳转到登录页`,
					// 添加遮罩层，防止点击穿透
					mask: true,
					// 1.5秒后自动消失
					duration: 1500
				})
			},
			// 延时跳转页面的事件
			delayNavigate() {
				// 将秒数重置为3
				this.seconds = 3
				// 展示提示信息
				this.showTips(this.seconds)
				// 创建定时器，每隔一秒执行一次
				this.timer = setInterval(() => {
					// 秒数先自减
					this.seconds--
					// 边界处理
					if (this.seconds <= 0) {
						// 清除定时器
						clearInterval(this.timer)
						// 跳转到my页面
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									openType: 'switchTab',
									from: '/pages/cart/cart'
								})
							}
						})
						// 终止后续代码的执行
						return
					}
					// 再根据最新的描述，进行消息提示
					this.showTips(this.seconds)
				}, 1000)
			},
			// 微信支付的方法
			async payOrder() {
				// 创建订单
				// 组织订单的信息对象
				const orderInfo = {
					// 开发期间，注释掉真实的订单价格，
					// order_price: this.checkedGoodsAmount,
					// 写死订单总价为 1 分钱
					order_price: 0.01,
					consignee_addr: this.addressAtr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price
					}))
				}
				// 发起请求获取订单
				const { data:res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 获取到订单编号
				const orderNumber = res.message.order_number
				// 订单预支付
				const { data:res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber})
				// 预支付生成失败
				if(res.meta.status !== 200) return uni.$showError('预支付订单生成失败!')
				// 获取到订单支付所需要的相关参数
				const payInfo = res2.message.pay
				// 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				// 未完成支付
				if(err) return uni.$showMsg('订单未支付!')
				// 完成了支付，进一步查询支付的结果
				const { data:res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderNumber})
				// 检测订单未支付
				if(res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 检测订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon:'success'
				})
			}
		}
	}
</script>

<style lang="scss">
	.settleContainer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amountBox {
			.amount {
				color: #C00000;
				font-weight: bold;
			}
		}

		.btnSettle {
			background-color: #fba414;
			color: white;
			height: 50px;
			line-height: 50px;
			padding: 0 10px;
			min-width: 100px;
			text-align: center;
		}
	}
</style>
