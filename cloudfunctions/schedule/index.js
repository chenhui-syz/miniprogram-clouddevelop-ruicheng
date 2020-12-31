// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
// 对数据库进行初始化
const db = cloud.database()
const loglistCollection = db.collection('schedule')



// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const app = new TcbRouter({
		event
	})
	// 关键词模糊查询功能
	app.router('searchlog', async (ctx, next) => {
		console.log(event.content)
		ctx.body = await loglistCollection
			.where({
				// 利用正则表达式实现模糊查询
				// 缺点：关键词为空的时候，查询功能会报错
				content: cloud.database().RegExp({
					regexp: event.content || '',
					//模式
					options: 'i'
				})
			})
			.get()
			.then((res) => {
				return res
			})
	})
	// 按时间查询功能
	app.router('searchlogtime', async (ctx, next) => {
		console.log(event.content)
		ctx.body = await loglistCollection
			.where({
				currentdate: event.currentdate
			})
			.get()
			.then((res) => {
				return res
			})
	})
	// 更新功能
	app.router('updatelog', async (ctx, next) => {
		console.log(event.content)
		ctx.body = await loglistCollection.where({
				_id: event._id
			}).update({
				data: {
					content: event.content
				}
			})
			.then((res) => {
				return res
			})
	})
	// 删除功能
	app.router('cancellog', async (ctx, next) => {
		console.log(event.content)
		ctx.body = await loglistCollection.where({
				_id: event._id
			})
			.remove()
			.then((res) => {
				return res
			})
	})
	return app.serve()
	// return {
	// 	event,
	// 	openid: wxContext.OPENID,
	// 	appid: wxContext.APPID,
	// 	unionid: wxContext.UNIONID,
	// }
}