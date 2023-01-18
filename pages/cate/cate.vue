<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<!-- <my-search :backgroudColor="'#fba414'" :radius="30"></my-search> -->
		<!-- 向子组件传递自定义事件 -->
		<my-search @myClick="goToSearchPage"></my-search>

		<view class="scrollViewContainer">
			<!-- 左侧滑动区 -->
			<scroll-view scroll-y="true" :style="{height: screenHeight - 50 + 'px'}" class="leftScrollView">
				<block v-for="(item, i) in cateList" :key="i">
					<!-- 一级分类列表 -->
					<view :class="['leftScrollViewItem', i === active ? 'active' : '']" @click="updateActive(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区 -->
			<scroll-view scroll-y="true" :style="{height: screenHeight - 50 + 'px'}" class="rightScrollView"
				:scroll-top="scrollTop">
				<view class="cateLv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<!-- 二级分类标题 -->
					<view class="cateLv2Title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级分类 -->
					<view class="cateLv3List">
						<view class="cateLv3Item" v-for="(item3, i3) in item2.children" :key="i3"
							@click="goToGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
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
				// 当前设备可用的高度
				screenHeight: 0,
				// 分类数据列表
				cateList: [],
				// 一级分类列表的选中索引值
				active: 0,
				// 需要展示的二级分类列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync()
			this.screenHeight = systemInfo.windowHeight
			// 调用获取分类列表数据的方法
			this.getCateList()
		},
		methods: {
			// 获取分类列表数据的方法
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 请求成功，向data中写入数据
				this.cateList = res.message
				// 为初始的二级分类列表赋值
				this.cateLevel2 = res.message[0].children
			},
			// 一级列表的点击事件
			updateActive(i) {
				this.active = i
				// 更新展示的二级分类列表
				this.cateLevel2 = this.cateList[i].children
				// 让scrollTop的值在0和1之间切换，因为一直为同一个值不会进行切换
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
				// 简写：this.scrollTop = this.scrollTop ? 0 : 1
			},
			// 三级列表的点击事件
			goToGoodsList(item) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${item.cat_id}`
				})
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
	// 多级列表
	.scrollViewContainer {
		display: flex;

		// 左侧展示区
		.leftScrollView {
			width: 120px;

			.leftScrollViewItem {
				background-color: #F7F7F7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #FFFFFF;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #fba414;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}

		// 右侧展示区
		.rightScrollView {
			.cateLv2 {
				.cateLv2Title {
					font-size: 12px;
					font-weight: bold;
					text-align: center;
					padding: 15px 0;
				}

				.cateLv3List {
					display: flex;
					flex-wrap: wrap;

					.cateLv3Item {
						width: 33.3%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-bottom: 10px;

						image {
							width: 60px;
							height: 60px;
						}

						text {
							font-size: 12px;
						}
					}
				}
			}
		}
	}
</style>
