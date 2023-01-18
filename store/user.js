export default {
	// 开启命名空间
	namespaced: true,
	// state数据
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
	}),
	// 方法
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address
			// 将更新后的地址持久化存储至本地
			this.commit('m_user/saveAddressToStorage')
		},
		// 持久化存储地址的方法
		saveAddressToStorage(state) {
			uni.setStorageSync('address',JSON.stringify(state.address))
		}
	},
	// 数据包装器
	getters: {
		// 地址信息拼接
		addressAtr(state) {
			if(!state.address.provinceName) return ''
			const {provinceName, cityName, countyName, detailInfo} = state.address
			return provinceName+cityName+countyName+detailInfo
		}
	}
} 