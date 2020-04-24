// miniprogram/pages/tickets/tickets.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcCity: '',
    desCity: '',
    date: '',
    week: '',
    currentDate: '',
    currentWeek: '',
    datetime: null,
    // srcTime: '', //起飞时间
    // desTime: '', //到达时间
    // srcPlane: '', //起飞机场
    // desPlane: '', //到达机场
    // flyTime: '', //飞行时间
    // airPlane: '', //航空公司
    // airNo: '', //航空班次
    // airType: '', //机型
    // airTimeRight: ''//准点率
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      srcCity: options.srcStation,
      desCity: options.desStation,
      date: options.date,
      datetime: options.currentDate,
      currentDate: options.date,
      week: options.week,
      //查询列表
      srcTime: options.srcTime,
      desTime: options.desTime,
      srcPlane: options.srcPlane,
      desPlane: options.srcPlane

    })
    wx.setNavigationBarTitle({
      title: options.srcStation + "——" + options.desStation,
    })
    wx.setNavigationBarColor({
      backgroundColor: "#1e90ff",
      frontColor: "#ffffff"
    })

    console.log(options)
    this.search();

  },

  next: function(e) {
    var datetime = new Date(this.data.datetime);
    var milliTime = datetime.getTime();
    milliTime += 24 * 60 * 60 * 1000;
    datetime.setTime(milliTime);
    
    

    this.setData({
      datetime: datetime,
      currentDate: (datetime.getMonth() + 1) + "月" + datetime.getDate() + "日",
     
    })
    var weekString = this.getWeek(datetime)
    this.setData({ week: weekString })
    this.search()
  },

  prev: function(e) {
    var datetime = new Date(this.data.datetime);
    var milliTime = datetime.getTime();
    milliTime -= 24 * 60 * 60 * 1000;
    datetime.setTime(milliTime);
   
    
    this.setData({
      datetime: datetime,
      currentDate: (datetime.getMonth() + 1) + "月" + datetime.getDate() + "日",
     
    })
    var weekString = this.getWeek(datetime)
    this.setData({week:weekString})
    this.search()
  },
  getWeek:function(datetime){
    var weekString;
    switch (datetime.getDay()) {
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
    return weekString;

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

  },
  search: function() {
    const db = wx.cloud.database()

    var condition = {
      出发城市: this.data.srcCity,
      到达城市: this.data.desCity
    };
    switch (this.data.week) {
      case "周一":
        condition.周一班期 = '周一有班期'
        break
      case "周二":
        condition.周二班期 = '周二有班期'
        break
      case "周三":
        condition.周三班期 = '周三有班期'
        break
      case "周四":
        condition.周四班期 = '周四有班期'
        break
      case "周五":
        condition.周五班期 = '周五有班期'
        break
      case "周六":
        condition.周六班期 = '周六有班期'
        break
      default:
        condition.周日班期 = '周日有班期'
    }

    db.collection('flight')
      .where(condition)
      .get({
        success: res => {
          var flightList = new Array();
          var i;
          for (i = 0; i < res.data.length; i++) {
            var flightInfo = new Object();
            flightInfo.id = res.data[i]._id;
            flightInfo.srcPlane = res.data[i].起飞机场;
            flightInfo.desPlane = res.data[i].降落机场;
            flightInfo.srcTime = res.data[i].起飞时间;
            flightInfo.desTime = res.data[i].降落时间;
            flightInfo.airPlane = res.data[i].航空公司;
            flightInfo.airNo = res.data[i].航空班次;
            flightInfo.airType = res.data[i].机型;
            flightInfo.airTimeRight = res.data[i].准点率;
            flightInfo.km = res.data[i]["里程（公里）"];
            var srcTime = flightInfo.srcTime.split(":");
            var srcHour = srcTime[0];
            var srcMinute = srcTime[1];

            srcHour = parseInt(srcHour);
            srcMinute = parseInt(srcMinute);

            var desTime = flightInfo.desTime.split(":");
            var desHour = desTime[0];
            var desMinute = desTime[1];
            desHour = parseInt(desHour);
            desMinute = parseInt(desMinute);

            if (desHour < srcHour) {
              desHour += 24;
            }
            if (desMinute < srcMinute) {
              desMinute += 60;
              desHour--;
            }

            flightInfo.flyTime = (desHour - srcHour) + "小时" + (desMinute - srcMinute) + "分";
            flightList[i] = flightInfo;

          }
          this.setData({
            flight: flightList
          })
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

  }
})