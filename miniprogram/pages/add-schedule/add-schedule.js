// pages/addlog/addlog.js
const db = wx.cloud.database()
let content = ''
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		currentdate: '',
		content: ''
	},
	getContent(event) {
		content = event.detail.value
	},
	addNewLog() {
		if (content === '') {
			wx.showToast({
				title: '日程内容不能为空',
				icon: 'none',
				duration: 1000
			})
			return
		}
		db.collection('schedule').add({
			data: {
				currentdate: this.data.currentdate,
				content: content,
				creatTime: db.serverDate() //服务端时间
			}
		}).then((res) => {
			wx.showToast({
				title: '操作成功',
			})
			// 500毫秒后
			setTimeout(() => {
				// 返回上一页面，并且刷新上一页的onLoad
				wx.navigateBack()
				const pages = getCurrentPages()
				const prevPage = pages[pages.length - 2]
				prevPage.getCurrentDateLogList()
			}, 500);
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			currentdate: options.currentdate,
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})