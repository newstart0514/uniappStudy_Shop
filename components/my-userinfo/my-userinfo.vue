<template>
	<view class="userInfoContainer">
		<!-- 头像昵称区域 -->
		<view class="topBox">
			<image :src="userInfo.avatarUrl" class="avatar"></image>
			<view class="nickName">{{userInfo.nickName}}</view>
		</view>
		<!-- 面板的列表区域 -->
		<view class="panelList">
			<!-- 第一个面板 -->
			<view class="panel">
				<!-- 第一个面板的主体区域 -->
				<view class="panelBody">
					<!-- panel的item项 -->
					<view class="panelItem">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panelItem">
						<text>14</text>
						<text>收藏的商品</text>
					</view>
					<view class="panelItem">
						<text>84</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 -->
			<view class="panel">
				<view class="panelTitle">
					我的订单
				</view>
				<view class="panelBody">
					<view class="panelItem">
						<image src="../../static/my-icons/icon1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panelItem">
						<image src="../../static/my-icons/icon2.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panelItem">
						<image src="../../static/my-icons/icon3.png" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="panelItem">
						<image src="../../static/my-icons/icon4.png" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<view class="panel">
				<view class="panelListItem">
					<text>收货地址</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panelListItem">
					<text>联系客服</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panelListItem" @click="logout">
					<text>退出登录</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		name:"my-userinfo",
		data() {
			return {
				
			};
		},
		computed: {
			// 将身份信息映射到组件中
			...mapState('m_user',['userInfo'])
		},
		methods: {
			// 导入更新数据的方法
			...mapMutations('m_user',['updateAddress','updateUserInfo','updateToken']),
			// 退出登录事件
			async logout() {
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '是否退出登录？',
					confirmText: '是',
					cancelText: '否'
				}).catch(err => err)
				if(succ && succ.confirm) {
					this.updateAddress({})
					this.updateUserInfo({})
					this.updateToken('')
				}
			}
		}
	}
</script>

<style lang="scss">
	// 头像以及用户名区域
	.userInfoContainer {
		height: 100%;
		// 为整个组件添加浅灰色的背景
		background-color: #f4f4f4;
		
		.topBox {
			height: 400rpx;
			background-color: #fba414;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
			.avatar {
				width: 90px;
				height: 90px;
				border-radius: 45px;
				border: 2px solid #FFF;
				box-shadow: 0 1px 5px black;
			}
			.nickName {
				font-size: 16px;
				color: #FFF;
				font-weight: bold;
				margin-top: 10px;
			}
		}
	}
	// 面板区域
	.panelList {
		padding: 0 10px;
		position: relative;
		top: -10px;
		
		.panel {
			background-color: white;
			border-radius: 3px;
			margin-bottom: 8px;
			
			.panelListItem {
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 45px;
				padding: 0 10px;
				font-size: 15px;
			}
			.panelTitle {
				line-height: 45px;
				padding-left: 10px;
				font-size: 15px;
				border-bottom: 1px solid #efefef;
			}
			.panelBody {
				display: flex;
				justify-content: space-around;
				
				.panelItem {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					padding: 10px 0;
					font-size: 13px;
					
					.icon {
						width: 35px;
						height: 35px;
					}
				}
			}
		}
	}
</style>