<template>
	<view class="myContainer">
		<my-login v-if="!token"></my-login>
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	// 引入设置购物车徽标的模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState} from 'vuex'
	
	export default {
		// 将封装的模块混入到当前页面
		mixins: [badgeMix],
		data() {
			return {
				
			};
		},
		computed: {
			// 获取到用户的信息
			...mapState('m_user',['token'])
		}
	}
</script>

<style lang="scss">
	page, .myContainer {
		height: 100%;
	}
</style>
