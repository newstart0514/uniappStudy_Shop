<template>
	<view>
		<view class="goodsItem">
			<!-- 商品左侧的图片区域 -->
			<view class="goodsItemLeft">
				<image :src="goods.goods_small_logo || defaultPic" class="goodPic"></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goodsItemRight">
				<!-- 商品标题 -->
				<view class="goodsName">{{goods.goods_name}}</view>
				<view class="goodsInfoBox">
					<!-- 商品价格 -->
					<view class="goodPrice">￥{{goods.goods_price | toFixed}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			goods: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				
			};
		},
		filters: {
			toFixed(num) {
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.goodsItem {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goodsItemLeft {
			margin-right: 5px;

			.goodPic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goodsItemRight {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goodsName {
				font-size: 13px;
			}

			.goodsInfoBox {

				.goodPrice {
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>
