<!--2048-->
<template>
	<view class="grid-container">
		<view style="display: flex;justify-content: space-between;">
			<span>分数：{{score}}</span>
			<span @click="init">重新开始</span>
		</view>
		<view v-for="(row,rowIndex) in grid" :key="rowIndex" class="grid-row">
			<view v-for="(cell,cellIndex) in row" :key="cellIndex" class="grid-cell" :class="'grid-cell-'+cell "
			@touchstart="handleTouchStart" @touchend="handleTouchEnd">
				{{cell !== 0 ? cell : ''}}
			</view>
		</view>
	</view>
	
</template>
<script>
	export default{
		data(){
			return{
				grid:[],//游戏数组
				gridSize: 4,//游戏面板大小
				score: 0,//游戏分数
				gameOver: false,//游戏结束
				touchStartX: 0,
				touchStartY: 0,
				touchEndX: 0,
				touchEndY: 0,
				slide: '',
			}
		},
		onLoad() {
			this.init()
		},
		created() {
		},
		methods:{
			//开始触摸
			handleTouchStart(event) {
			   this.touchStartX = event.touches[0].clientX;
			   this.touchStartY = event.touches[0].clientY;
			},
			//触摸结束
			handleTouchEnd(event) {
			    event.preventDefault(); // 阻止滚动
			    this.touchEndX = event.changedTouches[0].clientX;
			    this.touchEndY = event.changedTouches[0].clientY;
			    const dx = this.touchEndX - this.touchStartX;
			    const dy = this.touchEndY - this.touchStartY;
			    if (Math.abs(dx) > Math.abs(dy)) {
			        dx > 0 ? this.MoveRight() : this.MoveLeft()
			    } else {
			        dy > 0 ? this.MoveDown() : this.MoveUp()
			    }
			},
			//重新开始
			init(){
				this.grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
				this.FindZeroAndSetTwoOrFour();
				this.FindZeroAndSetTwoOrFour();
			},
			//找数组空白位置，随机赋值2或4
			FindZeroAndSetTwoOrFour(){
				var blankSpace = [];//数组空白的位置
				for(var i = 0; i < this.gridSize; i++){
					for(var j = 0; j < this.gridSize; j++){
						if(this.grid[i][j] === 0){
							blankSpace.push({x:i,y:j})
						}
					}
				}
				if(blankSpace.length>0){//有空白位置，随机赋值2，4
					var {x,y} = blankSpace[Math.floor(Math.random()*blankSpace.length)];//随机取一个空白坐标给x,y赋值
					this.grid[x][y] = Math.random() < 0.9 ? 2 : 4//赋值概率2，90%|4，10%
				}
			},
			//向上移动
			async MoveUp(){
				var moved = false;//是否移动
				for(var j = 0; j < this.gridSize; j++){//列标
					for(var i = 1; i < this.gridSize; i++){//行标
						if(this.grid[i][j] !== 0){//下三行有值
							var k = i - 1;
							while(k >= 0 && this.grid[k][j] === 0){//循环跳过空值
								k--;
							}
							if(k >= 0 && this.grid[k][j] === this.grid[i][j]){//有合并值，合并后上移
								this.grid[k][j] *= 2;
								this.score += this.grid[k][j];
								this.grid[i][j] = 0;
								moved = true;
							}else if(k + 1 !== i){//没有合并值，直接上移
								this.grid[k + 1][j] = this.grid[i][j];
								this.grid[i][j] = 0
								moved = true;
							}
						}
					}
				}
				if(moved){
					this.FindZeroAndSetTwoOrFour();
					//游戏是否结束
					this.GameOver()
				}
			},
			//向下移动
			async MoveDown(){
				var moved = false;//是否移动
				for(var j = 0; j < this.gridSize; j++){
					for(var i = this.gridSize-2; i >= 0; i--){
						if(this.grid[i][j] !== 0){//上三行有值
							var k = i + 1;
							while(k < this.gridSize && this.grid[k][j] === 0){//循环跳过空值
								k++;
							}
							if(k < this.gridSize && this.grid[k][j] === this.grid[i][j]){//有合并值，合并后下移
								this.grid[k][j] *= 2;
								this.score += this.grid[k][j];
								this.grid[i][j] = 0;
								moved = true;
							}else if(k - 1 !== i){//没有合并值，直接下移
								this.grid[k - 1][j] = this.grid[i][j];
								this.grid[i][j] = 0
								moved = true;
							}
						}
					}
				}
				if(moved){
					this.FindZeroAndSetTwoOrFour();
					//游戏是否结束
					this.GameOver()
				}
			},
			//向左移动
			async MoveLeft(){
				var moved = false;//是否移动
				for(var i = 0; i < this.gridSize; i++){
					for(var j = 1; j < this.gridSize; j++){
						if(this.grid[i][j] !== 0){//右三行有值
							var k = j - 1;
							while(k >= 0 && this.grid[i][k] === 0){//循环跳过空值
								k--;
							}
							if(k >= 0 && this.grid[i][k] === this.grid[i][j]){//有合并值，合并后左移
								this.grid[i][k] *= 2;
								this.score += this.grid[i][k];
								this.grid[i][j] = 0;
								moved = true;
							}else if(k + 1 !== j){//没有合并值，直接左移
								this.grid[i][k + 1] = this.grid[i][j];
								this.grid[i][j] = 0
								moved = true;
							}
						}
					}
				}
				if(moved){
					this.FindZeroAndSetTwoOrFour();
					//游戏是否结束
					this.GameOver()
				}
			},
			//向右移动
			async MoveRight(){
				var moved = false;//是否移动
				for(var i = 0; i < this.gridSize; i++){
					for(var j = this.gridSize-2; j >= 0; j--){
						if(this.grid[i][j] !== 0){//上三行有值
							var k = j + 1;
							while(k < this.gridSize && this.grid[i][k] === 0){//循环跳过空值
								k++;
							}
							if(k < this.gridSize && this.grid[i][k] === this.grid[i][j]){//有合并值，合并后上移
								this.grid[i][k] *= 2;
								this.score += this.grid[i][k];
								this.grid[i][j] = 0;
								moved = true;
							}else if(k - 1 !== j){//没有合并值，直接上移
								this.grid[i][k - 1] = this.grid[i][j];
								this.grid[i][j] = 0
								moved = true;
							}
						}
					}
				}
				if(moved){
					this.FindZeroAndSetTwoOrFour();
					//游戏是否结束
					this.GameOver()
				}
			},
			//游戏结束
			GameOver(){
				this.gameOver = true
				for(var i = 0; i < this.gridSize; i++){
					for(var j = 0; j < this.gridSize; j++){
						if(this.grid[i][j] === 0){//还有空值
							this.gameOver = false;
						}else if(i < this.gridSize - 1 && this.grid[i][j] === this.grid[i + 1][j]){//上下还有可合并的值
							this.gameOver = false;
						}else if(j < this.gridSize - 1 && this.grid[i][j] === this.grid[i][j + 1]){//左右还有可合并的值
							this.gameOver = false
						}
					}
				}
				if(this.gameOver){
					uni.showModal({
						content: "游戏结束！\n您的得分为"+this.score,
						showCancel: false
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	/*游戏面板*/
	.grid-container {
	  display: flex;
	  flex-direction: column; /* 垂直方向布局 */
	  width: 100%;
	  max-width: 480px; /* 限制网格容器的最大宽度 */
	  margin: 0 auto; /* 居中显示 */
	  padding: 5px;
	  background-color: #bbada0; /* 2048游戏的背景色 */
	}
	
	.grid-row {
	  display: flex;
	  justify-content: center;
	  margin-bottom: 5px;
	}
	
	.grid-cell {
	  width: 20vw; /* 正方形格子的宽度 */
	  height: 20vw; /* 正方形格子的高度 */
	  margin: 5px; /* 格子之间的间距 */
	  background-color: #cdc1b4; /* 格子的背景色 */
	  border-radius: 6px; /* 圆角边框 */
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  font-size: 4vw; /* 格子中文字的大小 */
	  font-weight: bold;
	}
	
	/*格子颜色*/
	.grid-cell-2 { background-color: #eee; }
	.grid-cell-4 { background-color: #e0f7fa; }
	.grid-cell-8 { background-color: #b3e5fc; }
	.grid-cell-16 { background-color: #81d4fa; }
	.grid-cell-32 { background-color: #4fc3f7; }
	.grid-cell-64 { background-color: #29b6f6; }
	.grid-cell-128 { background-color: #03a9f4; }
	.grid-cell-256 { background-color: #039be5; }
	.grid-cell-512 { background-color: #0288d1; }
	.grid-cell-1024 { background-color: #0277bd; }
	.grid-cell-2048 { background-color: #01579b; }
	
</style>