<template>
	<view class="settleContainer">
		<!-- 全选 -->
		<label class="radio">
			<radio color="#fba414" :checked="isFullCheck" @click="updateAllState()"/><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amountBox">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btnSettle">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex'
	
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		computed: {
			// 将已勾选的商品总数量渲染出来
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			// 判断是否为全选状态
			isFullCheck() {
				return this.total === this.checkedCount
			}
		},
		methods: {
			// 将更新所有商品选中状态加载到组件上
			...mapMutations('m_cart',['updateAllGoodsState']),
			// 全选radio框的点击事件
			updateAllState() {
				// 将isFullCheck取反获取到新的状态传入更新
				this.updateAllGoodsState(!this.isFullCheck)
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