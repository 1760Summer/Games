'use strict';
//创建连接(jql写法)
var db = uniCloud.databaseForJQL()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	var type = event.type;
	switch (type){
		case "GetG_ALL"://查询原神所有角色和武器
		    try{
				//云函数一次最多返回100条数据
				//统计条数
				let count = await db.collection('G_ALL').count()
				count = count.total
				//循环，多次请求，并一次性返回数据
				let all = [];
				for(let i=0;i<count;i+=100){
					let list = await db.collection('G_ALL').skip(i).get()
					all = all.concat(list.data);
				}
		    	return all
		    }catch(e){
		    	console.log(e)
		    }
			break;
		default:
			console.log("方法名不对，请检查！")
			break;
	}
};
