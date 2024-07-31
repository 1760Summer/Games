<!--华容道-->
<template>
	<view class="container">
		<view class="title">
			<span @click="init">重新开始</span>
			<span @click="ChangeType">{{type}}*{{type}}</span>
		</view>
		<view class="puzzle" :class="'puzzle-'+type">
			<view v-for="(num,index) in numbers" :key="index" 
			:class="{ piece : num !== type * type }" @click="MovePiece(index)">
				{{num !== type * type ? num : ''}}
			</view>
		</view>
	</view>
</template>
<script>

	export default{
		data(){
			return{
				numbers:[],//游戏数组
				type: 3//难度（3、4宫格）
			}
		},
		onLoad() {
			this.init()
		},
		created() {
		},
		methods:{
			//重新开始
			init(){
				this.GenerateRandomPuzzle()
				do{
					this.numbers = this.GenerateRandomPuzzle();
				}while (!this.IsSolvable(this.numbers));
			},
			//切换难度
			ChangeType(){
				var maxType = 4;//最高难度
				if(this.type < maxType){
					this.type++;
				}else{
					this.type = 3;//最低难度
				}
				this.init()
			},
			//打乱顺序
			GenerateRandomPuzzle() {
				let puzzle = [...Array(this.type*this.type).keys()].map(i => i + 1);
				for (let i = puzzle.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];//随机交换位置
				}
				return puzzle;
			},
			//移动方块
			MovePiece(index){
				const emptyIndex = this.numbers.indexOf(this.type*this.type);
				if(this.IsValidMove(index,emptyIndex)){
					[this.numbers[index],this.numbers[emptyIndex]] = [this.numbers[emptyIndex],this.numbers[index]]
				}
				this.GameOver()
			},
			//只能移动相邻的方块判定方法
			IsValidMove(index,emptyIndex){
				const row = Math.floor(index / this.type);
				const col = index % this.type;
				const emptyRow = Math.floor(emptyIndex / this.type);
				const emptyCol = emptyIndex % this.type;
				return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
				(Math.abs(col - emptyCol) === 1 && row === emptyRow);
			},
			//游戏有解
			IsSolvable(puzzle) {
			    let inversionCount = 0;
			    const flattened = puzzle.slice(0, -1); 
			    for (let i = 0; i < flattened.length - 1; i++) {
				    for (let j = i + 1; j < flattened.length; j++) {
				        if (flattened[i] > flattened[j]) {
					        inversionCount++;
				        }
				    }
			    }
				const emptyIndex = puzzle.indexOf(0);
				const row = Math.floor(emptyIndex / this.type) + 1;
			    return (inversionCount % 2 === 0 && row % 2 === 0) || (inversionCount % 2 === 1 && row % 2 === 1);
			},
			//游戏结束
			GameOver(){
				const target = [...Array(this.type*this.type).keys()].map(i => i + 1);
				if(JSON.stringify(this.numbers) === JSON.stringify(target)){
					uni.showModal({
						content: "游戏结束！恭喜您成功通关！",
						showCancel: false
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	.container {
	  display: flex;
	  flex-direction: column; 
	  margin: 0 auto; 
	  padding: 1vw;
	  background-color: #bbada0; 
	}
	.title {
		display: flex;
		justify-content: space-between;
	}
	.puzzle{
	    display: grid;
	    gap: 1vw;
	    width: 84vw;
	    margin: 0 auto;
	}
	.puzzle-3{
	    grid-template-columns: repeat(3, 25vw);
	    grid-template-rows: repeat(3, 25vw);
	}
	.puzzle-4{
	    grid-template-columns: repeat(4, 20vw);
	    grid-template-rows: repeat(4, 20vw);
	}
	.piece {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    font-size: 4vw;
	    border: 0.2vw solid #333;
	    cursor: pointer;
		background-color: #cdc1b4;
	}
</style>

