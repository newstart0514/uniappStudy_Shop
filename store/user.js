export default {
	// 开启命名空间
	namespaced: true,
	// state数据
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 用户登录凭证
		// token: uni.getStorageSync('token') || '',
		token: uni.getStorageSync('token') || '',
		// 用户的基本信息
		userInfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 登录后的重定向信息
		redirectInfo: null
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
		},
		// 更新用户信息
		updateUserInfo(state, userinfo) {
			state.userInfo = userinfo
			// 将用户信息持久化存储到本地
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 持久化存储用户信息的方法
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo',JSON.stringify(state.userInfo))
		},
		// 更新token字符串
		updateToken(state, token) {
			state.token = token
			// 持久化存储至本地
			this.commit('m_user/saveTokenToStorage')
		},
		// 持久化存储至本地
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向信息
		updateRedirectInfo(state, info) {
			state.redirectInfo = info
			console.log(state.redirectInfo)
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