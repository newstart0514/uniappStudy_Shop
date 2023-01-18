<template>
	<view>
		<!-- 自定义的搜索组件 -->
		<view class="searchBox">
			<my-search @myClick="goToSearchPage"></my-search>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的item项 -->
			<swiper-item v-for="(item, i) in swiperList" :key="i" class="swiper-item">
				<!-- 展示图片 -->
				<navigator :url="`/subpkg/goods_details/goods_details?goods_id=${item.goods_id}`">
					<!-- 动态绑定图片的src -->
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="navBox">
			<view v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor">
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor_title"></image>
				<!-- 楼层图片盒子 -->
				<view class="floorImgBox">
					<!-- 左侧的大盒子 -->
					<navigator class="leftImgBox" :url="item.product_list[0].url">
						<image 
							:src="item.product_list[0].image_src" 
							:style="{width: item.product_list[0].image_width + 'rpx'}" 
							mode="widthFix"
						>
						</image>
					</navigator>
					<!-- 右侧的四个小盒子 -->
					<view class="rightImgBox">
						<navigator 
							class="rightImgBoxItem" 
							v-for="(item2, i2) in item.product_list" 
							:key="i2" 
							v-if="i2 !== 0" 
							:url="item2.url"
						>
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入设置购物车徽标的模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	export default {
		// 将封装的模块混入到当前页面
		mixins: [badgeMix],
		data() {
			return {
				// 这是轮播图的数据列表
				swiperList: [],
				// 分类导航数据列表
				navList: [],
				// 楼层数据列表
				floorList: []
			};
		},
		onLoad() {
			// 调用方法，获取轮播图的数据
			this.getSwiperList()
			// 调用方法获取分类导航的数据
			this.getNavList()
			// 调用方法获取楼层数据
			this.getFloorList()
		},
		methods: {
			// 获取轮播图数据的方法
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 请求失败
				if (res.meta.status !== 200) return uni.showMsg()
				// 请求成功将数据转移到data
				this.swiperList = res.message
			},
			// 获取分类导航的数据的方法
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				// 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 请求成功，将数据存入data
				this.navList = res.message
			},
			// 获取楼层区域的数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				// 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 请求成功，将数据存入data
				// 通过双层的循环，处理url地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			// 导航栏上的图标的点击事件
			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 搜索框点击事件
			goToSearchPage() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	// 轮播图
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 330rpx;
		}
	}
	// 导航
	.navBox {
		display: flex;
		margin: 15px 0;
		justify-content: space-around;

		image {
			width: 128rpx;
			height: 140rpx;
		}
	}
	// 楼层
	.floor_title {
		width: 100%;
		height: 60rpx;
		display: flex;
	}
	.rightImgBox {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.floorImgBox {
		display: flex;
		padding-left: 10rpx;
	}
	// 搜索组件
	.searchBox {
		// 设置定位效果为“吸顶”
		position: sticky;
		// “吸顶”的位置
		top: 0;
		// 提高层级，防止被覆盖
		z-index: 999;
	}
</style>
