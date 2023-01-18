export default {
	namespaced: true,
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
	}),
	mutations: {
		// 添加购物车的方法
		addToCart(state, goods) {
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if(findResult) {
				// 能在购物车找到该商品
				// 查找出来的商品数量加一
				findResult.goods_count++
			}else {
				// 在购物车里找不到该商品
				// 直接添加即可
				state.cart.push(goods)
			}
			// 存储新的数据到本地
			this.commit('m_cart/saveToStorage')
		},
		// 持久化存储购物车的方法
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 修改商品选中状态的方法
		updateGoodsState(state, goods) {
			// 根据goods_id查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 有对应的商品信息对象
			if(findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				// 持久化存储至本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 修改商品数量的方法
		updateGoodsCount(state, goods) {
			// 根据goods_id查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 有对应的商品信息对象
			if(findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_count = goods.goods_count
				// 持久化存储至本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 根据id删除商品的方法
		removeGoodsById(state, goods_id) {
			// 调用数组的filter方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储至本地
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有的商品选中状态的方法
		updateAllGoodsState(state, newState) {
			// 循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储至本地
			this.commit('m_cart/saveToStorage')
		}
	},
	getters: {
		// 获取购物车商品总数的方法
		total(state) {
			// let count = 0
			// // 循环遍历商品的数量
			// state.cart.forEach(goods => count += goods.goods_count)
			// return count
			return state.cart.reduce((count, item) => count += item.goods_count, 0)
		},
		// 勾选商品的总数量
		checkedCount(state) {
			// 先使用过滤器方法过滤已经勾选的商品，在使用reduce方法将勾选的商品数量进行累加
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 勾选商品的总价格
		checkedGoodsAmount(state) {
			// 先使用过滤器过滤出已勾选的商品，再使用reduce方法将价格进行累加，最后使用toFixed保留小数
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total = total + item.goods_count * item.goods_price,0).toFixed(2)
		}
	}
}
