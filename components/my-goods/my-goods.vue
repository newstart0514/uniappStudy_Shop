<template>
	<view>
		<view class="goodsItem">
			<!-- 商品左侧的图片区域 -->
			<view class="goodsItemLeft">
				<radio :checked="goods.goods_state" color="#fba414" v-if="showRadio" @click="radioChangeHandler"></radio>
				<image :src="goods.goods_small_logo || defaultPic" class="goodPic"></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goodsItemRight">
				<!-- 商品标题 -->
				<view class="goodsName">{{goods.goods_name}}</view>
				<view class="goodsInfoBox">
					<!-- 商品价格 -->
					<view class="goodPrice">￥{{goods.goods_price | toFixed}}</view>
					<!-- 商品数量 -->
					<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numberChangeHandler"></uni-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			// 商品信息的对象
			goods: {
				type: Object,
				default: {}
			},
			// 是否展示图片左侧的勾选框
			showRadio: {
				type: Boolean,
				// 如果没有指定默认为不展示
				default: false
			},
			// 是否展示数字盒子组件
			showNum: {
				type: Boolean,
				// 如果没有指定默认为不展示
				default: false
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				
			};
		},
		filters: {
			// 让价格显示为两位小数
			toFixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			// radio组件的点击事件处理函数
			radioChangeHandler() {
				this.$emit('radioChange',{
					// 商品的id
					goods_id: this.goods.goods_id,
					// 商品的最新勾选状态
					goods_state: !this.goods.goods_state
				})
			},
			// numbox组件的修改事件处理函数
			numberChangeHandler(newValue) {
				this.$emit('numChange',{
					// 商品的id
					goods_id: this.goods.goods_id,
					// 商品的最新的数量 使用+确保一直为数字类型
					goods_count: +newValue
				})
			}
		}
	}
</script>

<style lang="scss">
	.goodsItem {
		// 让goodsitem项占满整个容器
		width: 750rpx;
		// 设置盒子模型为border-box
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goodsItemLeft {
			margin-right: 5px;
			display: flex;
			align-items: center;
			justify-content: center;

			.goodPic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goodsItemRight {
			display: flex;
			// 让flex效果占满整个区域
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goodsName {
				font-size: 13px;
			}

			.goodsInfoBox {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.goodPrice {
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>
