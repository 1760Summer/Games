<!--俄罗斯方块-->
<template>
	<view class="content">
		<view class="title">
			<view>分数：{{score[0]}}</view>
			<view class="blockMinMap">
				<view v-for="(line, i) in blocks[nextBlock[0]][nextBlock[1]]" :key="'minimap-line-'+i" class="line">
					<view v-for="(b, j) in line" :key="'minimap-line-'+i+'-block-'+j" :class="{'block':b==1}"></view>
				</view>
			</view>
			<view>等级：{{parseInt(score[0]/score[1])}}</view>
		</view>
		<view class="gameView" :style="{height:gameViewHeight+'px'}">
			<view v-for="(line, i) in getTrueMap()" :key="'map-line-'+i" class="line">
				<view v-for="(b, j) in line" :key="'map-line-'+i+'-block-'+j" :class="{'block':b>0}"
				 :style="{width:getGameViewBlockSize()+'px', height:getGameViewBlockSize()+'px'}"
				></view>
			</view>
		</view>
		<!--手操-->
		<view class="buttonView" id="buttonView">
			<view @tap="moveLeft()">←</view>
			<view @tap="moveDown()">↓</view>
			<view @tap="rotateBlock()">〇</view>
			<view @tap="moveRight()">→</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//地图大小
				mapSize:[18, 10],
				//下降时间:开始，结束，每升一级减少等待时间
				downSpeed: [1500, 200, 100],
				//分数：现在分数，多少分升一级, step
				score: [0, 10, 1],
				//地图
				map: [],
				//7种方块，及其朝向
				blocks: [
					[[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]]],
					[[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]],
					[[[1,1,1,1]],[[1],[1],[1],[1]]],
					[[[1,1],[1,1]]],
					[[[0,1,0],[1,1,1]],[[0,1],[1,1],[0,1]],[[1,1,1],[0,1,0]],[[1,0],[1,1],[1,0]]],
					[[[0,0,1],[1,1,1]],[[1,1],[0,1],[0,1]],[[1,1,1],[1,0,0]],[[1,0],[1,0],[1,1]]],
					[[[1,0,0],[1,1,1]],[[0,1],[0,1],[1,1]],[[1,1,1],[0,0,1]],[[1,1],[1,0],[1,0]]],
				],
				//方块开始位置
				startPosition:[0,4],
				//方块现在位置
				blockPosition:[0,0],
				//当前方块限制：方块种类，方块朝向
				nowBlock:[0,0],
				//下一个方块限制: 方块种类，方块朝向
				nextBlock:[0,0],
				//游戏窗口高度:
				gameViewHeight:450,
				//游戏结束
				gameOver:false,
				//游戏循环体
				gameUpdateFunc:null,
			}
		},
		mounted() {
			this.refreshNextBlock()
			this.refreshNextBlock()
		},
		onLoad() {
			this.initGame()
		},
		methods: {
			//游戏初始化
			initGame(){
				var that = this;
				this.initMap()
				this.score[0] = 0;
				this.refreshNextBlock()
				this.refreshNextBlock()
				this.gameOver = false;
				clearInterval(that.gameUpdateFunc)
				that.gameUpdateFunc = null;
				this.$nextTick(function(){
					that.tryGetGameHeight()
					that.gameUpdate()
				})
			},
			gameUpdate(){
				var that = this;
				that.gameOver = false;
				that.gameUpdateFunc = setInterval(()=>{
					//游戏循环体
					that.moveDown()
					//更新
					clearInterval(that.gameUpdateFunc)
					//游戏未结束时触发
					if(!that.gameOver){
						that.gameUpdate()
					}
					else{
						uni.showModal({
							showCancel:false,
							confirmText:'再来一局',
							title:'游戏结束',
							content:'最终分数:'+this.score[0],
							success:(res)=>{
								if(res.confirm){
									that.initGame()
								}
							}
						})
					}
				}, Math.max(
					(this.downSpeed[0]-this.downSpeed[2]*parseInt(this.score[0]/this.score[1])), 
					this.downSpeed[1]
				))
			},
			//下降
			moveDown(){
				//获取底部砖块情况
				if(this.gameOver) return;
				var bottomPosition = []
				var theBlock = this.blocks[this.nowBlock[0]][this.nowBlock[1]]
				for (var i=0;i<theBlock[0].length;i++){
					bottomPosition.push(0)
				}
				for (var i=0;i<theBlock.length;i++){
					for (var j=0;j<theBlock[i].length;j++){
						if(theBlock[i][j] > 0){
							bottomPosition[j] = Math.max(bottomPosition[j], i)
						}
					}
				}
				// console.log(bottomPosition)
				var canMove = true;
				for (var i=0;i<bottomPosition.length;i++){
					if(this.blockPosition[0]+bottomPosition[i]+1 >= this.mapSize[0]){
						canMove = false;
						break;
					}
					else if(this.map[
							this.blockPosition[0]+bottomPosition[i]+1
						][
							this.blockPosition[1]+i
						] > 0){
						canMove = false;
						break;
					}
				}
				if(canMove){
					this.blockPosition[0]+=1;
					this.$forceUpdate()
				}
				else{
					//如果当前Y坐标依旧是0，游戏结束
					if(this.blockPosition[0]<=0){
						this.gameOver = true;
					}
					//触底不能移动, 锁死方块,将方块的值赋予map
					else{
						for (var i=0;i<theBlock.length;i++){
							for (var j=0;j < theBlock[i].length;j++){
								// console.log(this.blockPosition[0]+i, this.blockPosition[1]+j)
								// console.log(this.map.length, this.map[0].length)
								this.map[this.blockPosition[0]+i][this.blockPosition[1]+j] = 
									Math.max(theBlock[i][j], 
										this.map[this.blockPosition[0]+i][this.blockPosition[1]+j]);
							}
						}
						this.$forceUpdate()
						//判断当前是否有无可能消除行
						this.checkMapScore()
						//更新下个方块
						this.refreshNextBlock()
					}
				}
			},
			//旋转方块
			rotateBlock(){
				if(this.gameOver) return;
				var nextStyle = (this.nowBlock[1]+1) % this.blocks[this.nowBlock[0]].length;
				//判断当前的状态是否存在位置
				var canChange = true;
				var changeBlock = this.blocks[this.nowBlock[0]][nextStyle];
				if(this.blockPosition[1]+changeBlock[0].length > this.mapSize[1]){
					//x超出
					canChange = false;
				}
				else if(this.blockPosition[0]+changeBlock.length > this.mapSize[0]){
					//y超出
					canChange = false;
				}
				else{
					for (var i=0;i<changeBlock.length;i++){
						for (var j=0;j<changeBlock[i].length;j++){
							//旋转后部分和原始map重合
							if (changeBlock[i][j] > 0 && 
								this.map[this.blockPosition[0]+i][this.blockPosition[1]+j] > 0){
									canChange = false;
									break;
								}
						}
					}
				}
				if(canChange){
					this.nowBlock[1] = nextStyle
					this.$forceUpdate()
				}
			},
			//左移
			moveLeft(){
				//判断是否可以左移
				if(this.gameOver) return;
				var theBlock = this.blocks[this.nowBlock[0]][this.nowBlock[1]];
				var leftPosition = [];
				for (var i=0;i<theBlock.length;i++){
					leftPosition.push(-1)
					for (var j=0;j<theBlock[i].length;j++){
						if(leftPosition[i] === -1 && theBlock[i][j] > 0){
							leftPosition[i] = j;
						}
					}
				}
				// console.log(leftPosition)
				var canMove = true;
				for (var i=0;i<leftPosition.length;i++){
					if (this.blockPosition[1]+leftPosition[i] == 0){
						canMove = false;
						break;
					}
					else if (this.map[
								this.blockPosition[0]+i
							][
								this.blockPosition[1]+leftPosition[i]-1
							] > 0){
						canMove = false;
						break;
					}
				}
				if(canMove){
					this.blockPosition[1] -= 1;
					this.$forceUpdate()
				}
			},
			//右移
			moveRight(){
				//判断是否可以左移
				if(this.gameOver) return;
				var theBlock = this.blocks[this.nowBlock[0]][this.nowBlock[1]];
				var rightPosition = [];
				for (var i=0;i<theBlock.length;i++){
					rightPosition.push(0)
					for (var j=0;j<theBlock[i].length;j++){
						if(theBlock[i][j] > 0){
							rightPosition[i] = j;
						}
					}
				}
				// console.log(rightPosition)
				var canMove = true;
				for (var i=0;i<rightPosition.length;i++){
					if (this.blockPosition[1]+rightPosition[i]+1 >= this.mapSize[1]){
						canMove = false;
						break;
					}
					else if (this.map[
								this.blockPosition[0]+i
							][
								this.blockPosition[1]+rightPosition[i]+1
							] > 0){
						canMove = false;
						break;
					}
				}
				if(canMove){
					this.blockPosition[1] += 1;
					this.$forceUpdate()
				}
			},
			checkMapScore(){
				var newMap = []
				// 计算score并消去满足的行
				for (var i=0; i < this.map.length; i++){
					var lineSum = 0;
					for(var j=0; j < this.map[i].length;j++){
						lineSum += Math.min(this.map[i][j], 1);
					}
					// console.log(i, lineSum)
					if(lineSum >= this.map[i].length){
						this.score[0] += this.score[2];
					}
					else{
						newMap.push(JSON.parse(JSON.stringify(this.map[i])))
					}
				}
				//补充缺失的行
				while (newMap.length < this.map.length){
					var aline = []
					for (var i=0;i<this.map[0].length;i++) aline.push(0)
					newMap.unshift(aline)
				}
				this.map = newMap;
				this.$forceUpdate();
			},
			//初始化地图
			initMap(){
				this.map = []
				for (var i=0;i<this.mapSize[0];i++){
					this.map.push([])
					for (var j=0;j<this.mapSize[1];j++){
						this.map[i].push(0)
					}
				}
			},
			tryGetGameHeight(){
				var that = this;
				this.$nextTick(function(){
					that.gameViewHeight = uni.getSystemInfoSync().windowHeight - 170;
				})
			},
			getGameViewBlockSize(){
				var padding = 40
				return Math.min(
					parseInt((this.gameViewHeight-padding)/this.mapSize[0]),
					parseInt((uni.getSystemInfoSync().windowWidth-padding)/this.mapSize[1])
				)
			},
			refreshNextBlock(){
				this.nowBlock = this.nextBlock
				var nextBlock = [
					parseInt(Math.random()*this.blocks.length),
					0
				]
				nextBlock[1] = parseInt(this.blocks[nextBlock[0]].length*Math.random())
				this.nextBlock = nextBlock
				this.blockPosition = JSON.parse(JSON.stringify(this.startPosition));
				// console.log(this.blockPosition)
				this.$forceUpdate()
			},
			getTrueMap(){
				//实际map是原始map+当前方块位置
				if(this.map.length != this.mapSize[0] || this.mapSize[1] != this.map[0].length){
					return this.map;
				}
				var trueMap = JSON.parse(JSON.stringify(this.map))
				var theBlock = this.blocks[this.nowBlock[0]][this.nowBlock[1]]
				// console.log(theBlock)
				for(var i=0; i<theBlock.length; i++){
					for(var j=0; j<theBlock[i].length; j++){
						// console.log(i+this.blockPosition[0], j+this.blockPosition[1])
						trueMap[i+this.blockPosition[0]][j+this.blockPosition[1]] = Math.max(
							theBlock[i][j],
							trueMap[i+this.blockPosition[0]][j+this.blockPosition[1]]
						);
					}
				}
				// console.log(trueMap)
				return trueMap;
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	
	.title{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		width: 90%;
		padding: 5% 5px;
		background-color: #FFFFFF;
		height:58px;
		border-bottom: #d9d9d9 solid 1px;
	}
	
	.blockMinMap{
		display: flex;
		flex-direction: column;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
	}
	
	.blockMinMap .line, .gameView .line{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.blockMinMap .line view{
		width: 12px;
		height: 12px;
	}
	
	.gameView .line view{
		border: 1px solid #e6e6e6;
		width: 40upx;
		height: 40upx;
	}
	
	.blockMinMap .line .block{
		border: 1px solid #333333;
		width: 10px;
		height: 10px;
	}
	
	.gameView .line .block{
		border: 1px solid #333333;
		background-color: #ffcdcd;
		/* width: 40upx;
		height: 40upx; */
	}
	
	.gameView{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.buttonView{
		width: 90%;
		padding: 5% 5px;
		border-top: #C0C0C0 solid 1px;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.buttonView view{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 30%;
		border: #555555 solid 1px;
		border-radius: 10px;
		height: 30px;
		background-color: #FFFFFF;
	}
	
	.buttonView view:active{
		background-color: #C0C0C0;
	}
</style>
