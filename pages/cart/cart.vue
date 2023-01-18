<template>
	<view class="cartContainer" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cartTitle">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cartTitleText">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swiperActionClickHandler(goods)">
					<my-goods :goods="goods" :showRadio="true" :showNum="true" @radioChange="radioChangeHandler"
						@numChange=numberChangeHandler></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	</view>
	<!-- 空白购物车区域 -->
	<view class="emptyCart" v-else>
		<image src="../../static/cart_empty@2x.png" class="emptyImg"></image>
		<text class="tipText">这里空空如也，快去购物吧~</text>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from "vuex"
	// 引入设置购物车徽标的模块
	import badgeMix from '@/mixins/tabbar-badge.js'

	export default {
		// 将封装的模块混入到当前页面
		mixins: [badgeMix],
		computed: {
			// 将购物车里面的数据取出来
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				options: [{
					// 删除文本内容
					text: '删除',
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}]
			};
		},
		methods: {
			// 将修改商品状态的方法映射到页面上
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount','removeGoodsById']),
			// 勾选框的自定义事件
			radioChangeHandler(goodsObj) {
				this.updateGoodsState(goodsObj)
			},
			// 商品数量修改的自定义事件
			numberChangeHandler(goodsObj) {
				this.updateGoodsCount(goodsObj)
			},
			// 删除按钮的点击事件
			swiperActionClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
	// 解决结算组件的遮挡部分信息
	.cartContainer {
		padding-bottom: 50px;
	}
	// 标题区域
	.cartTitle {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cartTitleText {
			margin-left: 10px;
		}
	}
	// 空白购物车
	.emptyCart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		
		.emptyImg {
			width: 90px;
			height: 90px;
		}
		.tipText {
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
