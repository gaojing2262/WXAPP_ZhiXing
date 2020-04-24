// miniprogram/pages/train/train.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers: [
      '/images/haibao/1.jpg',
      '/images/haibao/2.jpg',
      '/images/haibao/3.jpg'
    ],
    currentId: 1,
    cities: [
      "石家庄", "乌鲁木齐", "北京", "上海", "广州", "深圳", "天津", "重庆", "武汉", "长沙", "太原",
      "兰州", "西宁", "南京", "郑州", "沈阳",
    ],
    srcCityIndex: 1,
    desCityIndex: 2,
    date: [
      "2019-11-13"
    ],
    week: '周四'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.query()
    this.test()
    var currentDate = new Date()
    var weekString = '周四'

    this.setData({
      date: currentDate.getMonth() + 1 + '月' + currentDate.getDate() + '日',
      week: weekString,
    })

  },
  test: function() {
    const db = wx.cloud.database()
    db.collection('flight').where({
      出发城市: "上海",
      到达城市: "北京"
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功123: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  query: function(e) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('swipers').get({
      success: res => {
        this.setData({
          swipers: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    db.collection('cities').get({
      success: res => {
        this.setData({
          cities: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },
  switchChange: function(e) {
    var id = e.currentTarget.id;
    this.setData({
      currentId: id
    })
    
  },
  /**
   * 出发地
   */
  bindSrcCityChange: function(e) {
    this.setData({
      srcCityIndex: e.detail.value
    })
  },
  /**
   * 目的地
   */
  bindDesCityChange: function(e) {
    this.setData({
      desCityIndex: e.detail.value
    })
  },

  /**
   * 交换地址
   */
  switchCity: function(e) {
    var i = this.data.srcCityIndex
    var j = this.data.desCityIndex
    this.setData({
      srcCityIndex: j,
      desCityIndex: i

    })

  },
  /**
   * 星期切换
   */
  bindDateChange: function(e) {
    var currentDate = new Date(e.detail.value)
    var weekString = '周三'
    switch (currentDate.getDay()) {
      case 1:
        weekString = '周一'
        break
      case 2:
        weekString = '周二'
        break
      case 3:
        weekString = '周三'
        break
      case 4:
        weekString = '周四'
        break
      case 5:
        weekString = '周五'
        break
      case 6:
        weekString = '周六'
        break
      default:
        weekString = '周日'
    }

    this.setData({
      date: currentDate.getMonth() + 1 + '月' + currentDate.getDate() + '日',
      week: weekString,
      currentDate: currentDate

    })
  },
  Select: function(e) {
    wx.navigateTo({
      url: '/pages/tickets/tickets?srcStation=' + this.data.cities[this.data.srcCityIndex].name +
        "&desStation=" + this.data.cities[this.data.desCityIndex].name + "&date=" + this.data.date + "&week=" + this.data.week + "&currentDate=" + this.data.currentDate
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})