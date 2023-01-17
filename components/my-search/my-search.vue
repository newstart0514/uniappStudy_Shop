<template>
	<view class="searchContainer" :style="{'background-color':backgroudColor}" @click="searchBoxHandler">
		<!-- 使用view组件模拟输入框的样式 -->
		<view class="searchBox" :style="{'border-radius' : radius + 'px'}">
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-search",
		data() {
			return {

			};
		},
		props: {
			// 背景颜色
			backgroudColor: {
				type: String,
				default: '#fba414'
			},
			// 圆角尺寸
			radius: {
				type: Number,
				default: 30
			}
		},
		methods: {
			searchBoxHandler() {
				// 调用父组件传过来的自定义事件
				this.$emit('myClick')
			}
		}
	}
</script>

<style lang="scss">
	.searchContainer {
		// background-color: #fba414;
		height: 50px;
		padding: 0 10px;
		display: flex;
		align-items: center;
		
		.searchBox {
			display: flex;
			background-color: #FFFFFF;
			width: 100%;
			height: 36px;
			// border-radius: 30px;
			justify-content: center;
			align-items: center;
			
			.placeholder {
				font-size: 15px;
				margin-left: 5px;
			}
		}
	}
</style>
