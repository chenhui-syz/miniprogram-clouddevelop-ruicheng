//index.js
const app = getApp()
// 更新后的日程信息
let newLogText = ''
let keyword = ''
Page({
  data: {
    // 当前选择的时间
    currentdate: '',
    // 当前选择日期的日程信息
    currentdata: [],
    // 是否已经获得用户信息
    getUserInfoFlag: false,
    // 用户信息
    userInfo: {},
    // 编辑和删除日程信息的弹窗
    updateDialog: false,
    // 编辑后的日程信息
    newLogText: 'dsadsadsa',
    // 当前要编辑或者删除的日程id
    currentLogId: '',
    // 当前日历类型选择，0=>我的日历，1=>我的日历，2=>我的日历
    logdata: [],

  },
  getKeyWord(e) {
    keyword = e.detail.value
  },
  searchLog() {
    // if(keyword.trim()==''){
    // 	console.log('请输入搜索关键词再进行操作')
    // 	return
    // }
    wx.cloud.callFunction({
      name: 'schedule',
      data: {
        $url: 'searchlog',
        content: keyword
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        logdata: res.result.data,
      })
    })
  },
  // 长按编辑或者删除指定日程信息
  cacalOrUpadteLog(e) {
    this.setData({
      updateDialog: true,
      newLogText: e.currentTarget.dataset.content,
      currentLogId: e.currentTarget.dataset._id
    })
  },
  // 关闭编辑或者删除日程信息弹窗
  closeUpdate() {
    this.setData({
      updateDialog: false
    })
  },
  // 获取输入的新日程信息
  getNewLogText(e) {
    newLogText = e.detail.value
    console.log(newLogText)
  },
  // 删除日程信息
  cancelLog() {
    wx.cloud.callFunction({
      name: 'schedule',
      data: {
        $url: 'cancellog',
        _id: this.data.currentLogId
      }
    }).then((res) => {
      console.log(res)
      wx.showToast({
        title: '删除成功',
      })
      this.closeUpdate()
      this.getCurrentDateLogList()
    })
  },
  // 确定更新日程信息
  sureUpdateLog(e) {
    wx.cloud.callFunction({
      name: 'schedule',
      data: {
        $url: 'updatelog',
        content: newLogText,
        _id: this.data.currentLogId
      }
    }).then((res) => {
      console.log(res)
      wx.showToast({
        title: '编辑成功',
      })
      this.closeUpdate()
      this.getCurrentDateLogList()
    })
  },
  // 更新当前日期的日程信息
  getCurrentDateLogList() {
    wx.cloud.callFunction({
      name: 'schedule',
      data: {
        $url: 'searchlogtime',
        currentdate: this.data.currentdate
      }
    }).then((res) => {
      this.setData({
        currentdata: res.result.data
      })
    })
  },
  onLoad: function () {
    // wx.getSetting({
    //   success: (res) => {
    //     // 如果用户授权过，我们就去获取用户的信息
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: (res) => {
    //           this.setData({
    //             userInfo: res.userInfo
    //           })
    //           console.log(res)
    //         }
    //       })
    //     } else {
    //       this.setData({
    //         getUserInfoFlag: true
    //       })
    //     }
    //   }
    // })
  },
  //组件监听事件:选择日期
  select(e) {
    let date = ''
    // 第一次加载的时候，设置currentdate为当天，并过滤出当天的日程
    if (this.data.currentdate == '') {
      const year = new Date().getFullYear()
      const zeroMonth = new Date().getMonth() + 1
      const month = zeroMonth < 10 ? '0' + zeroMonth : zeroMonth
      const zeroday = new Date().getDate()
      const day = zeroday < 10 ? '0' + zeroday : zeroday
      date = `${year}-${month}-${day}`
      // 已经选择过日期的，则过滤出当前日期的日程
    } else {
      date = e.detail
    }
    wx.cloud.callFunction({
      name: 'schedule',
      data: {
        $url: 'searchlogtime',
        currentdate: date
      }
    }).then((res) => {
      console.log('onload里的res', res)
      this.setData({
        currentdata: res.result.data,
        currentdate: e.detail
      })
    })
  },
  // 组件监听事件:选择日历
  changeCalendar(e) {
    console.log(e.detail)
  },
  // 添加纪录
  goAddLog() {
    wx.navigateTo({
      url: `../add-schedule/add-schedule?currentdate=${this.data.currentdate}`,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 拿去缓存中的日程信息
    // wx.getStorage({
    // 	key: 'logdata',
    // 	success: (res) => {
    // 		this.setData({
    // 			logdata: res.data
    // 		});
    // 		console.log(this.data.logdata)
    // 	},
    // })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
})