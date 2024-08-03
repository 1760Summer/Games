<!--原神抽卡-->
<template>
	<view>
		<u-subsection :list="list" :current="current" @change="changePool"></u-subsection>
		<view v-if="current==0" class="wrap">
			<view>
				<view>距离下次出金还有：{{90-this.accNoGoldenCount}}次</view>
				<view>距离下次出紫还有：{{10-this.accNoVioletCount}}次</view>
				<u-parse :content="content" style="height: 300px;overflow-y: auto;"></u-parse>
			</view>
			<u-button @click="clickGoodLuck(1)" type="primary" :plain="true" style="margin-bottom: 10px;">抽一次</u-button>
			<u-button @click="clickGoodLuck(10)" type="primary" :plain="true">抽十次</u-button>
			<view>
				<u-parse :content="content2" style="height: 300px;overflow-y: auto;"></u-parse>
			</view>
		</view>
		<view v-else-if="current==1" class="wrap">
			<view>
				<view>定轨：
					<u-radio-group v-for="(item,index) in up_role_5" :key="index" v-model="up_determine" @change="ChangeDetermine">
						<u-radio :name="up_role_5[index]" :label="up_role_5[index]"></u-radio>
					</u-radio-group>
				</view>
				<view>距离下次出金还有：{{90-this.up_accNoGoldenCount}}次</view>
				<view>距离下次出紫还有：{{10-this.up_accNoVioletCount}}次</view>
				<u-parse :content="up_content" style="height: 300px;overflow-y: auto;"></u-parse>
			</view>
			<u-button @click="clickGoodLuckUP(1)" type="primary" :plain="true" style="margin-bottom: 10px;">抽一次</u-button>
			<u-button @click="clickGoodLuckUP(10)" type="primary" :plain="true">抽十次</u-button>
			<view>
				<u-parse :content="up_content2" style="height: 300px;overflow-y: auto;"></u-parse>
			</view>
		</view>
		<view v-else-if="current==2" class="wrap">
			<view>
				<view>定轨：
					<u-radio-group v-for="(item,index) in up_arms_5" :key="index" v-model="upa_determine" @change="ChangeDetermine2">
						<u-radio :name="up_arms_5[index]" :label="up_arms_5[index]"></u-radio>
					</u-radio-group>
				</view>
				<view>距离下次出金还有：{{90-this.upa_accNoGoldenCount}}次</view>
				<view>距离下次出紫还有：{{10-this.upa_accNoVioletCount}}次</view>
				<u-parse :content="upa_content" style="height: 300px;overflow-y: auto;"></u-parse>
			</view>
			<u-button @click="clickGoodLuckUP2(1)" type="primary" :plain="true" style="margin-bottom: 10px;">抽一次</u-button>
			<u-button @click="clickGoodLuckUP2(10)" type="primary" :plain="true">抽十次</u-button>
			<view>
				<u-parse :content="upa_content2" style="height: 300px;overflow-y: auto;"></u-parse>
			</view>
		</view>
	</view>
	
</template>
<script>
	export default{
		data(){
			return{
				//卡池属性
				list:[{name: '常驻祈愿'},{name: '限定祈愿'},{name: '武器祈愿'}],  //卡池类型
				current: 0,                                   //选中的当前卡池
				//卡池内容
				arms_3:[],                      //常驻3星武器池
				arms_4:[],                      //常驻4星武器池
				arms_5:[],                      //常驻5星武器池
				role_4:[],                      //常驻4星角色池
				role_5:[],                      //常驻5星角色池
				up_arms_4:[],                   //限定4星武器池
				up_arms_5:[],                   //限定5星武器池
				up_role_4:[],                   //限定4星角色池
				up_role_5:[],                   //限定5星角色池
				//常驻抽卡概率属性
				p_golden: 0.6,	                //金卡基础概率
				p_violet: 5.1,	                //紫卡基础概率
				totoalCount: 0,				    //总抽卡次数
				accNoGoldenCount: 0, 		    //不出金次数
				accNoVioletCount: 0, 		    //不出紫次数
				awardColor: "blue",			    //出啥颜色卡
				content:'',                     //文本
				content2:'',                    //文本
				//限定角色抽卡概率属性
				up_determine:'',                //定轨
				up_p_golden: 0.6,	            //金卡基础概率
				up_p_violet: 5.1,	           //紫卡基础概率
				up_p_askew_golden: 50,         //金卡不歪概率
				up_p_askew_violet: 50,         //紫卡不歪概率
				up_totoalCount: 0,		      //总抽卡次数
				up_accNoGoldenCount: 0,       //不出金次数
				up_accNoVioletCount: 0, 	 //不出紫次数
				up_askew_golden_count: 0,    //金卡歪卡次数
				up_askew_violet_count: 0,    //紫卡歪卡次数
				up_awardColor: "blue",		 //出啥颜色卡
				up_content:'',               //文本
				up_content2:'',              //文本
				//限定武器抽卡概率属性
				upa_determine:'',              //定轨武器
				upa_ndetermine:'',             //非定轨武器
				upa_p_golden: 0.6,	          //金卡基础概率
				upa_p_violet: 5.1,	          //紫卡基础概率
				upa_p_askew_golden: 50,       //金卡不歪概率
				upa_p_askew_violet: 50,       //紫卡不歪概率
				upa_totoalCount: 0,		      //总抽卡次数
				upa_accNoGoldenCount: 0,      //不出金次数
				upa_accNoVioletCount: 0, 	//不出紫次数
				upa_askew_golden_count: 0,   //金卡歪卡次数
				upa_askew_golden_limit: '',  //第一次歪卡是否限定
				upa_askew_violet_count: 0,   //紫卡歪卡次数
				upa_awardColor: "blue",		//出啥颜色卡
				upa_content:'',                //文本
				upa_content2:'',                //文本
			}
		},
		onLoad() {
			this.GetPool()
		},
		methods:{
			//获取卡池信息
			GetPool(){
				uniCloud.callFunction({
					name:'G_ALL',
					data:{
						type: 'GetG_ALL',
					}
				}).then(res=>{
					var arr = res.result;
					for(var i=0;i<arr.length;i++){
						if(arr[i].G_TYPE=="角色"){
							if(arr[i].G_GRADE==4){
								if(arr[i].G_UP=="Y"){
									this.up_role_4.push(arr[i].G_NAME)
								}else if(arr[i].G_LIMIT=="N"){
									this.role_4.push(arr[i].G_NAME)
								}
							}else if(arr[i].G_GRADE==5){
								if(arr[i].G_UP=="Y"){
									this.up_role_5.push(arr[i].G_NAME)
								}else if(arr[i].G_LIMIT=="N"){
									this.role_5.push(arr[i].G_NAME)
								}
							}
						}else if(arr[i].G_TYPE=="武器"){
							if(arr[i].G_GRADE==3){
								this.arms_3.push(arr[i].G_NAME)
							}else if(arr[i].G_GRADE==4){
								if(arr[i].G_UP=="Y"){
									this.up_arms_4.push(arr[i].G_NAME)
								}else if(arr[i].G_LIMIT=="N"){
									this.arms_4.push(arr[i].G_NAME)
								}
							}else if(arr[i].G_GRADE==5){
								if(arr[i].G_UP=="Y"){
									this.up_arms_5.push(arr[i].G_NAME)
								}else if(arr[i].G_LIMIT=="N"){
									this.arms_5.push(arr[i].G_NAME)
								}
							}
						}
					}
					//默认选中
					this.up_determine = this.up_role_5[0]
					this.upa_determine = this.up_arms_5[0]
					this.upa_ndetermine = this.up_arms_5[1]
					console.log(this.upa_determine)
					console.log(this.upa_ndetermine)
				}).catch(err =>{
					console.log(err)
				})
			},
			//切换卡池
			changePool(index){
				this.current = index
			},
			//切换角色定轨
			ChangeDetermine(e){
				this.up_determine=e
			},
			//切换武器定轨
			ChangeDetermine2(e){
				if(this.upa_askew_golden_count>0){
					uni.showModal({
						content:"切换定轨会清空定轨值，您确定要切换吗？",
						showCancel: true,
						success:(res)=>{
							if(res.confirm){
								this.upa_determine=e
								this.upa_askew_golden_count=0
								this.upa_askew_golden_limit=''
								//非定轨赋值
								for(var i=0;i<this.up_arms_5.length;i++){
									if(this.upa_determine!=this.up_arms_5[i]){
										this.upa_ndetermine = this.up_arms_5[i]
									}
								}
							}else if(res.cancel){
								this.upa_ndetermine = e
								//定轨赋值
								for(var i=0;i<this.up_arms_5.length;i++){
									if(this.upa_ndetermine!=this.up_arms_5[i]){
										this.upa_determine = this.up_arms_5[i]
									}
								}
							}
						},
					})
				}
			},
			// 常驻抽卡 1次 or 10次
			clickGoodLuck(times) {
				if (times == 1) {
					this.computeProOne();
				} else {
					this.computeProTen();
				}
			},
			// 限定角色抽卡 1次 or 10次
			clickGoodLuckUP(times) {
				if (times == 1) {
					this.computeProOneUP();
				} else {
					this.computeProTenUP();
				}
			},
			// 限定武器抽卡 1次 or 10次
			clickGoodLuckUP2(times) {
				if (times == 1) {
					this.computeProOneUP2();
				} else {
					this.computeProTenUP2();
				}
			},
			// 常驻抽中金卡，重新初始化
			initAwardedGolden(){
				this.p_golden = 0.6;
				this.accNoGoldenCount = 0;
				this.awardColor = "golden";
			},
			// 限定角色抽中金卡，重新初始化
			initAwardedGoldenUP(){
				this.up_p_golden = 0.6;
				this.up_accNoGoldenCount = 0;
				this.up_awardColor = "golden";
			},
			// 限定武器抽中金卡，重新初始化
			initAwardedGoldenUP2(){
				this.upa_p_golden = 0.6;
				this.upa_accNoGoldenCount = 0;
				this.upa_awardColor = "golden";
			},
			// 常驻抽中紫卡，重新初始化
			initAwardedViolet(){
				this.p_violet = 5.1;
				this.accNoVioletCount = 0;
				this.awardColor = "violet";
			},
			// 限定角色抽中紫卡，重新初始化
			initAwardedVioletUP(){
				this.up_p_violet = 5.1;
				this.up_accNoVioletCount = 0;
				this.up_awardColor = "violet";
			},
			// 限定武器抽中紫卡，重新初始化
			initAwardedVioletUP2(){
				this.upa_p_violet = 5.1;
				this.upa_accNoVioletCount = 0;
				this.upa_awardColor = "violet";
			},
			//常驻单抽概率计算(基础概率大于随机数则出货)
			computeProOne(){
				this.totoalCount++;
				let randomGolden = (Math.random() * 100).toFixed(2);
				let randomViolet = (Math.random() * 100).toFixed(2);
				//是否出金 出金小保低
				if(this.accNoGoldenCount>73){
					if (this.p_golden >= randomGolden) {
					    let ship = this.shipment("golden");
						this.content+="<p style='background-color: #f9ff80'>保底获得:"+ship+",抽卡次数:"+this.totoalCount+"</p>";
						this.content2+="<p>"+ship+":"+Number(this.accNoGoldenCount+1)+"抽</p>"
						this.initAwardedGolden();
						return;
					}else{
						this.p_golden += 6;//出金概率加大
					}
				}
				//是否出金  出金小欧皇
				if(this.accNoGoldenCount<=73){
					if (this.p_golden >= randomGolden) {
						let ship = this.shipment("golden");
						this.content+="<p style='background-color: #f9ff80'>恭喜欧皇获得:"+ship+",抽卡次数:"+this.totoalCount+"</p>";
						this.content2+="<p>"+ship+":"+Number(this.accNoGoldenCount+1)+"抽</p>"
						this.initAwardedGolden();
						return;
					}
				}
				//是否出紫 
				if(this.p_violet >= randomViolet){
					let ship = this.shipment("violet");
					this.content+="<p style='background-color: #f499ff'>获得:"+ship+",抽卡次数:"+this.totoalCount+"</p>";
					this.initAwardedViolet();
				}else{
					this.accNoVioletCount++;
					if(this.accNoVioletCount==8){
						this.p_violet += 51;
					}
					if(this.accNoVioletCount==9){
						this.p_violet = 100;
					}
					// 出蓝
					this.awardColor = "blue";
					let ship = this.shipment("blue");
					this.content+="<p style='background-color: #8cfffc'>获得:"+ship+",抽卡次数:"+this.totoalCount+"</p>";
				}
				this.accNoGoldenCount++;
			},
			//限定角色单抽概率计算(基础概率大于随机数则出货)
			computeProOneUP(){
				this.up_totoalCount++;
				let randomGolden = (Math.random() * 100).toFixed(2);
				let randomViolet = (Math.random() * 100).toFixed(2);
				//是否出金 出金大保低
				if(this.up_p_golden >= randomGolden&&this.up_askew_golden_count>=1){
					let ship = this.shipmentUP("golden","N");
					this.up_content+="<p style='background-color: #f9ff80'>大保底获得:"+ship+",抽卡次数："+this.up_totoalCount+"</p>";
					this.up_content2+="<p>"+ship+":"+Number(this.up_accNoGoldenCount+1)+"抽</p>"
					this.up_askew_golden_count = 0;
					this.initAwardedGoldenUP();
					return;
				}
				//是否出金 出金小保低
				if(this.up_accNoGoldenCount>73){
					if (this.up_p_golden >= randomGolden) {
						let randomAskew = (Math.random() * 100).toFixed(2);
						if(this.up_p_askew_golden >= randomAskew){//不歪
						    let ship = this.shipmentUP("golden","N");
							this.up_content+="<p style='background-color: #f9ff80'>小保底获得:"+ship+",抽卡次数:"+this.up_totoalCount+"</p>";
							this.up_content2+="<p>"+ship+":"+Number(this.up_accNoGoldenCount+1)+"抽</p>"
							this.initAwardedGoldenUP();
							return;
						}else{
							this.up_askew_golden_count++
							let ship = this.shipmentUP("golden","Y");
							this.up_content+="<p style='background-color: #f9ff80'>小保底获得:"+ship+"(歪),抽卡次数:"+this.up_totoalCount+"</p>";
							this.up_content2+="<p>"+ship+":"+Number(this.up_accNoGoldenCount+1)+"抽</p>"
							this.initAwardedGoldenUP();
							return;
						}
					}else{
						this.up_p_golden += 6;//出金概率加大
					}
				}
				//是否出金  出金小欧皇
				if(this.up_accNoGoldenCount<=73){
					if (this.up_p_golden >= randomGolden) {
						let randomAskew = (Math.random() * 100).toFixed(2);
						if(this.up_p_askew_golden >= randomAskew){//不歪
						    let ship = this.shipmentUP("golden","N");
							this.up_content+="<p style='background-color: #f9ff80'>恭喜欧皇获得:"+ship+",抽卡次数:"+this.up_totoalCount+"</p>";
							this.up_content2+="<p>"+ship+":"+Number(this.up_accNoGoldenCount+1)+"抽</p>"
							this.initAwardedGoldenUP();
							return;
						}else{
							this.up_askew_golden_count++
							let ship = this.shipmentUP("golden","Y");
							this.up_content+="<p style='background-color: #f9ff80'>恭喜欧皇获得:"+ship+"(歪),抽卡次数:"+this.up_totoalCount+"</p>";
							this.up_content2+="<p>"+ship+":"+Number(this.up_accNoGoldenCount+1)+"抽</p>"
							this.initAwardedGoldenUP();
							return;
						}
					}
				}
				//是否出紫 
				if(this.up_p_violet >= randomViolet){
					let randomAskew = (Math.random() * 100).toFixed(2);
					//保底不歪紫卡
					if(this.up_askew_violet_count>=1){
						let ship = this.shipmentUP("violet","N");
						this.up_content+="<p style='background-color: #f499ff'>获得:"+ship+",抽卡次数："+this.up_totoalCount+"</p>";
						this.up_askew_violet_count = 0;
						this.initAwardedVioletUP();
					}else {
						if(this.up_p_askew_violet >= randomAskew){//不歪
						    let ship = this.shipmentUP("violet","N");
							this.up_content+="<p style='background-color: #f499ff'>获得:"+ship+",抽卡次数："+this.up_totoalCount+"</p>";
							this.initAwardedVioletUP();
						}else{
						    this.up_askew_violet_count++
							let ship = this.shipmentUP("violet","Y");
							this.up_content+="<p style='background-color: #f499ff'>获得:"+ship+"(歪),抽卡次数："+this.up_totoalCount+"</p>";
							this.initAwardedVioletUP();
						}
					}
				}else{
					this.up_accNoVioletCount++;
					if(this.up_accNoVioletCount==8){
						this.up_p_violet += 51;
					}
					if(this.up_accNoVioletCount==9){
						this.up_p_violet = 100;
					}
					// 出蓝
					this.up_awardColor = "blue";
					let ship = this.shipmentUP("blue","N");
					this.up_content+="<p style='background-color: #8cfffc'>获得:"+ship+",抽卡次数："+this.up_totoalCount+'</p>';
				}
				this.up_accNoGoldenCount++;
			},
			//限定武器单抽概率计算(基础概率大于随机数则出货)
			computeProOneUP2(){
				this.upa_totoalCount++;
				let randomGolden = (Math.random() * 100).toFixed(2);
				let randomViolet = (Math.random() * 100).toFixed(2);
				//是否出金 出金大保低
				if(this.upa_p_golden >= randomGolden&&this.upa_askew_golden_count>=2){
					let ship = this.shipmentUP2("golden","N",0);
					this.upa_content+="<p style='background-color: #f9ff80'>大保底获得:"+ship+",抽卡次数："+this.upa_totoalCount+"</p>";
					this.upa_content2+="<p>"+ship+":"+Number(this.upa_accNoGoldenCount+1)+"抽</p>"
					this.upa_askew_golden_count = 0;
					this.initAwardedGoldenUP2();
					return;
				}
				//是否出金 出金小保低
				if(this.upa_accNoGoldenCount>73){
					if (this.upa_p_golden >= randomGolden) {
						let randomAskew = (Math.random() * 100).toFixed(2);
						if(this.upa_p_askew_golden >= randomAskew){//不歪
						    let ship = this.shipmentUP2("golden","N",0);
							this.upa_content+="<p style='background-color: #f9ff80'>小保底获得:"+ship+",抽卡次数:"+this.upa_totoalCount+"</p>";
							this.upa_content2+="<p>"+ship+":"+Number(this.upa_accNoGoldenCount+1)+"抽</p>"
							this.upa_askew_golden_count = 0;
							this.initAwardedGoldenUP2();
							return;
						}else{
							this.upa_askew_golden_count++
							let ship = '';
							if(this.upa_askew_golden_count==2&&this.upa_askew_golden_limit=='N'){//第一次歪常驻，第二次歪，必限定
								ship = this.shipmentUP2("golden","Y",2);
							}else{
								ship = this.shipmentUP2("golden","Y",1);
							}
							if(this.upa_askew_golden_count==1&&this.arms_5.includes(ship)){//出常驻武器
								this.upa_askew_golden_limit='N'
							}
							this.upa_content+="<p style='background-color: #f9ff80'>小保底获得:"+ship+"(歪),抽卡次数:"+this.upa_totoalCount+"</p>";
							this.upa_content2+="<p>"+ship+":"+Number(this.upa_accNoGoldenCount+1)+"抽</p>"
							this.initAwardedGoldenUP2();
							return;
						}
					}else{
						this.upa_p_golden += 6;//出金概率加大
					}
				}
				//是否出金  出金小欧皇
				if(this.upa_accNoGoldenCount<=73){
					if (this.upa_p_golden >= randomGolden) {
						let randomAskew = (Math.random() * 100).toFixed(2);
						if(this.upa_p_askew_golden >= randomAskew){//不歪
						    let ship = this.shipmentUP2("golden","N",0);
							this.upa_content+="<p style='background-color: #f9ff80'>恭喜欧皇获得:"+ship+",抽卡次数:"+this.upa_totoalCount+"</p>";
							this.upa_content2+="<p>"+ship+":"+Number(this.upa_accNoGoldenCount+1)+"抽</p>"
							this.upa_askew_golden_count = 0;
							this.initAwardedGoldenUP2();
							return;
						}else{
							this.upa_askew_golden_count++
							let ship = '';
							if(this.upa_askew_golden_count==2&&this.upa_askew_golden_limit=='N'){//第一次歪常驻，第二次歪，必限定
								ship = this.shipmentUP2("golden","Y",2);
							}else{
								ship = this.shipmentUP2("golden","Y",1);
							}
							if(this.upa_askew_golden_count==1&&this.arms_5.includes(ship)){//出常驻武器
								this.upa_askew_golden_limit='N'
							}
							this.upa_content+="<p style='background-color: #f9ff80'>恭喜欧皇获得:"+ship+"(歪),抽卡次数:"+this.upa_totoalCount+"</p>";
							this.upa_content2+="<p>"+ship+":"+Number(this.upa_accNoGoldenCount+1)+"抽</p>"
							this.initAwardedGoldenUP2();
							return;
						}
					}
				}
				//是否出紫 
				if(this.upa_p_violet >= randomViolet){
					let randomAskew = (Math.random() * 100).toFixed(2);
					//保底不歪紫卡
					if(this.upa_askew_violet_count>=1){
						let ship = this.shipmentUP2("violet","N",0);
						this.upa_content+="<p style='background-color: #f499ff'>获得:"+ship+",抽卡次数："+this.upa_totoalCount+"</p>";
						this.upa_askew_violet_count = 0;
						this.initAwardedVioletUP2();
					}else {
						if(this.upa_p_askew_violet >= randomAskew){//不歪
						    let ship = this.shipmentUP2("violet","N",0);
							this.upa_content+="<p style='background-color: #f499ff'>获得:"+ship+",抽卡次数："+this.upa_totoalCount+"</p>";
							this.initAwardedVioletUP2();
						}else{
						    this.upa_askew_violet_count++
							let ship = this.shipmentUP2("violet","Y",0);
							this.upa_content+="<p style='background-color: #f499ff'>获得:"+ship+"(歪),抽卡次数："+this.upa_totoalCount+"</p>";
							this.initAwardedVioletUP2();
						}
					}
				}else{
					this.upa_accNoVioletCount++;
					if(this.upa_accNoVioletCount==8){
						this.upa_p_violet += 51;
					}
					if(this.upa_accNoVioletCount==9){
						this.upa_p_violet = 100;
					}
					// 出蓝
					this.upa_awardColor = "blue";
					let ship = this.shipmentUP2("blue","N",0);
					this.upa_content+="<p style='background-color: #8cfffc'>获得:"+ship+",抽卡次数："+this.upa_totoalCount+'</p>';
				}
				this.upa_accNoGoldenCount++;
			},
		    //常驻池随机出货
			shipment(type){
				if(type=="blue"){//3星
					let shipment = this.arms_3
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="violet"){//4星
					let shipment = [...this.arms_4,...this.role_4]
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="golden"){//5星
					let shipment = [...this.arms_5,...this.role_5]
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}
			},
			//限定池随机出货(角色池)
			shipmentUP(type,askew){
				if(type=="blue"){//3星
					let shipment = this.arms_3
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="violet"&&askew=="Y"){//4星歪
					let shipment = [...this.arms_4,...this.role_4]
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="violet"&&askew=="N"){//4星不歪
					let shipment = this.up_role_4
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="golden"&&askew=="Y"){//5星歪
					let shipment = this.role_5
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="golden"&&askew=="N"){//5星不歪
					return this.up_determine
				}
			},
			//限定池随机出货(武器池)
			shipmentUP2(type,askew,time){
				if(type=="blue"){//3星
					let shipment = this.arms_3
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="violet"&&askew=="Y"){//4星歪
					let shipment = [...this.arms_4,...this.role_4]
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="violet"&&askew=="N"){//4星不歪
					let shipment = this.up_arms_4
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="golden"&&askew=="Y"&&time==1){//5星歪（常驻加非定轨）
					let shipment = [...this.arms_5]
					shipment.push(this.upa_ndetermine)
					const randomIndex = Math.floor(Math.random()*shipment.length)
					return shipment[randomIndex]
				}else if(type=="golden"&&askew=="Y"&&time==2){//5星歪（非定轨限定）
					return this.upa_ndetermine
				}else if(type=="golden"&&askew=="N"){//5星不歪
					return this.upa_determine
				}
			},
			//常驻10连概率计算
			computeProTen(){
				for (let i = 0; i < 10; i++) {
					this.computeProOne();
				}
			},
			//限定角色10连概率计算
			computeProTenUP(){
				for (let i = 0; i < 10; i++) {
					this.computeProOneUP();
				}
			},
			//限定武器10连概率计算
			computeProTenUP2(){
				for (let i = 0; i < 10; i++) {
					this.computeProOneUP2();
				}
			},
		}
	}
</script>
<style lang="scss">
	.wrap {
		padding: 30rpx;
		background-color: #ffcdcd;
	}
</style>