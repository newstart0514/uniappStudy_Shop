<template>
	<view v-if="goods_info.goods_name" class="goodsDetailContainer">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item ,i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goodsInfoBox">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goodsInfoBody">
				<!-- 商品名称 -->
				<view class="goodsName">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品介绍 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航 -->
		<view class="goodsNav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				// 左侧按钮组的配置对象
				options: [
					{
						icon: 'shop',
						text: '店铺'
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 2
					}
				],
				// 右侧按钮组的配置对象
				buttonGroup: [
					{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		onLoad(options) {
			// 获取商品的id
			const goods_id = options.goods_id
			// 调用请求商品详情数据的方法
			this.getGoodsDetail(goods_id)
		},
		methods: {
			// 请求商品详情数据的方法
			async getGoodsDetail(goods_id) {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				})
				// 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 使用字符串的replace方法，为img标签添加行内的style样式，从而解决图片底部空白间隙的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp /g, 'jpg')
				// 请求成功，将数据存入data
				this.goods_info = res.message
			},
			// 图片点击放大处理事件
			preview(i) {
				// 调用previewImage方法预览图片
				uni.previewImage({
					// 所有图片的url地址的数组
					urls: this.goods_info.pics.map(x => x.pics_big),
					// 预览时，默认显示图片的索引
					current: i
				})
			},
			// 导航栏的点击事件
			onClick(e) {
				// 判断是否为购物车
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	// 轮播图
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
	// 商品信息
	.goodsInfoBox {
		padding: 10px;
		padding-right: 0;
		
		.price {
			color: #C00000;
			font-size: 18px;
			margin: 10px 0;
		}
		.goodsInfoBody {
			display: flex;
			justify-content: space-between;
			
			.goodsName {
				font-size: 13px;
				margin-right: 10px;
			}
			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}
		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}
	
	// 商品导航
	.goodsNav {
		// 固定到底部
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	// 解决导航栏固定在下方导则部分信息被遮挡的问题
	.goodsDetailContainer {
		padding-bottom: 50px;
	}
</style>
