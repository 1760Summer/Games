<template>
	<view class="content">
		<image class="banner" src="@/static/index/xy1.jpg" mode="widthFix"></image>
		<view class="list">
			<view class="game-item" v-for="item in gameBox" @tap="goInfo(item.path)">
				<image class="face" :src="item.faceImg" mode="aspectFit"></image>
				<view class="name">{{item.name}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameBox: [
					{
						name: '原神抽卡',
						path: '/pages/game/GenShin/index',
						faceImg: '../../static/index/lr1.jpg'
					},
					{
						name: '俄罗斯方块',
						path: '/pages/game/Tetris/index',
						faceImg: '../../static/index/lr2.jpg'
					},
					{
						name: '2048',
						path: '/pages/game/2048/index',
						faceImg: '../../static/index/lr3.jpg'
					},
					{
						name: '华容道',
						path: '/pages/game/Klotski/index',
						faceImg: '../../static/index/lr4.jpg'
					},
					{
						name: '测试专区',
						path: '/pages/game/test/index',
						faceImg: '../../static/index/lr4.jpg'
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			goInfo(path) {
				if (path) {
					uni.navigateTo({
						url: path
					})
				} else {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '敬请期待...'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100vw;
		height: 100vh;
		position: relative;

		.banner {
			width: 100%;
		}

		.list {
			width: 94%;
			padding: 3%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.game-item {
				width: 48%;
				text-align: center;

				.face {
					width: 100%;
				}

				.name {
					position: relative;
					left: 0;
					bottom: 35rpx;
					height: 50rpx;
					line-height: 50rpx;
					background-color: #fff;
					opacity: 0.6;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #0084ff;
				}
			}
		}
	}
</style>