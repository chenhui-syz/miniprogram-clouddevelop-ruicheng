// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 对数据库进行初始化
const db = cloud.database()
const loglistCollection = db.collection('schedule')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
	// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
	const wxContext = cloud.getWXContext()
	// 突破100条的条数限制
	const countResult = await loglistCollection.count()
	const total = countResult.total
	const batchTimes = Math.ceil(total / MAX_LIMIT)
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		let promise = loglistCollection.where({
			_openid: wxContext.OPENID
		}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
		tasks.push(promise)
	}
	return (await Promise.all(tasks)).reduce((acc, cur) => {
		return {
			data: acc.data.concat(cur.data),
			errMsg: acc.errMsg,
		}
	})
	// 根据当前OPENID查询数据
	// loglistCollection.skip(0 * MAX_LIMIT).limit(MAX_LIMIT).get()
}