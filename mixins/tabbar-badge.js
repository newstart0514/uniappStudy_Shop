import {mapGetters} from 'vuex'

// 导出一个mixin对象
export default {
	computed: {
		// 引入购物车总数
		...mapGetters('m_cart', ['total'])
	},
	watch: {
		// 监听total，数据改变时需要重新设置徽标
		total() {
			// 重新设置徽标值
			this.setBadge()
		}
	},
	onShow() {
		// 在页面刚渲染完毕就调用设置数字徽标的方法
		this.setBadge()
	},
	
	methods: {
		// 设置购物车数字徽标的方法
		setBadge() {
			uni.setTabBarBadge({
				index: 2,
				// text值必须为字符串
				text: this.total + ''
			})
		}
	}
}