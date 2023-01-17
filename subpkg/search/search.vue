<template>
	<view>
		<view class="serchBox">
			<!-- 使用uni-ui提供的搜索组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="suggestionLists" v-if="searchResults.length !== 0">
			<view class="suggestionItem" v-for="(item, i) in searchResults" :key="i" @click="goToDetail(item.goods_id)">
				<view class="goodsName">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="historyBox" v-else>
			<!-- 标题区域 -->
			<view class="historyTitle">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistorys"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="historyList">
				<uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="goToGoodList(item)"></uni-tag>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 搜索的关键词
				keywords: '',
				// 延时器的timerID
				timer: null,
				// 搜索结果列表
				searchResults: [],
				// 搜索历史列表
				historyLists: ['a','ap','apple']
			};
		},
		onLoad() {
			this.historyLists = JSON.parse(uni.getStorageSync('keywords') || '[]')
		},
		computed: {
			historys() {
				// 注意：由于数组是引用类型，所以不要基于原数组直接调用reverse方法，以免修改原数组中元素的顺序
				// 而应该是新建一个内存无关的数组，再进行reverse操作
				return [...this.historyLists].reverse()
			}
		},
		methods: {
			// 输入框输入回调函数
			input(e) {
				// 节流处理
				// 清除timer对应的延时器
				clearTimeout(this.timer)
				// 重新启动一个延时器，并把 timerID 赋值给 this.timer
				this.timer = setTimeout(() => {
					// 如果500毫秒内，没有触发新的事件，则搜索关键词就会进行更新
					this.keywords = e
					this.getSearchList()
				}, 500)
			},
			// 根据关键词获取搜索列表
			async getSearchList() {
				// 判断关键词是否为空
				if (this.keywords.length === 0) {
					this.searchResults = []
					return
				}
				// const { data:res } = await uni.$http.get(`/api/public/v1/goods/qsearch?query=${this.keywords}`)
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.keywords
				})
				// 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 请求成功，将数据存入data
				this.searchResults = res.message
				// 查询到搜索建议后，调用saveSearchHistory方法保存搜索关键词
				this.saveSearchHistory()
			},
			// 搜索建议列表点击事件
			goToDetail(id) {
				uni.navigateTo({
					url: `/subpkg/goods_details/goods_details?goods_id=${id}`
				})
			},
			// 保存搜索关键词的方法
			saveSearchHistory() {
				// 将搜索关键词push到historyLists数组中
				// this.historyLists.push(this.keywords)
				// 将array数组转化为set对象
				const set = new Set(this.historyLists)
				// 先删后增，可以保证新的keywords置顶
				// 调用set对象的delete方法，移除对应的元素
				set.delete(this.keywords)
				// 调用Set对象的add方法，向set中添加元素
				set.add(this.keywords)
				// 将set对象转化为array数组
				this.historyLists = Array.from(set)
				// 将搜索历史记录持久化存储至本地
				uni.setStorageSync('keywords',JSON.stringify(this.historyLists))
			},
			// 历史搜索记录的清空回调事件
			cleanHistorys() {
				this.historyLists = []
				uni.setStorageSync('keywords', '[]')
			},
			// 点击历史记录tag的跳转事件
			goToGoodList(keywords) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?query=${keywords}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.serchBox {
		// 实现搜索输入框区域吸顶效果，确保不会被覆盖
		position: sticky;
		top: 0;
		z-index: 999;
	}
	// 搜索建议列表
	.suggestionLists {
		padding: 0 5px;

		.suggestionItem {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goodsName {
				// 文字不允许换行
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用...代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
	// 搜索历史
	.historyBox {
		padding: 0 5px;
		
		.historyTitle {
			display: flex;
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		
		.historyList {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10px;
			
			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
				background-color: #efefef;
				color: #000;
				border: 0;
			}
		}
	}
</style>
