<template>
	<view>
		<view class="goodsList">
			<view v-for="(goods, i) in goodsList" :key="i" @click="goToDetail(goods)">
				<!-- 为 mygoods组件动态绑定goods的属性值 -->
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求的参数对象
				queryObj: {
					// 查询的关键词
					query: '',
					// 商品分类的id,
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来分页
				total: 0,
				// 节流阀
				isLoading: false
			};
		},
		onLoad(options) {
			// 将页面参数加载进请求的参数对象里
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表的方法
			this.getGoodList()
		},
		methods: {
			async getGoodList(cb) {
				// 将节流阀打开
				this.isLoading = true
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 关闭节流阀
				this.isLoading = false
				// 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 请求成功，将数据存入data
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				// 停止页面的下拉刷新效果
				cb && cb()
			},
			// 点击跳转到商品详情页面
			goToDetail(item) {
				uni.navigateTo({
					url: `/subpkg/goods_details/goods_details?goods_id=${item.goods_id}`
				})
			}
		},
		// 上拉触底事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 对请求进行节流处理
			if(this.isLoading) return
			// 让页码自增+1
			this.queryObj.pagenum ++
			// 重新获取列表数据
			this.getGoodList()
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []
			// 重新发起请求
			this.getGoodList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	.goodsList {
		
	}
</style>
