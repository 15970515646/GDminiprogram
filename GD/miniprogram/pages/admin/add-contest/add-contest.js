// pages/admin/add-contest/add-contest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: null,
    title: null,
    organizer: null,
    showTimePicker: false,
    selectDate: null,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  onConfirm(event) {
    const date = new Date(event.detail);
    // 使用 Date 对象的方法获取年、月、日等信息
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // 将年月日拼接成字符串，并以 "YYYY-MM-DD" 的格式显示
    const formattedDate = `${year}-${month}-${day}`;
    this.setData({
      selectDate: formattedDate,
      showTimePicker: false,
    });
  },
  onCancel() {
    this.setData({
      showTimePicker: false,
    })
  },
  onShowPopup() {
    this.setData({
      showTimePicker: true,
    })
  },
  onClosePopup() {
    this.setData({
      showTimePicker: false,
    })
  },
  addContest() {
    wx.showModal({
      title: '新建比赛',
      content: '是否确认新建比赛',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          if (this.checkAllFilled()) {
            const db = wx.cloud.database();
            db.collection("contest").where({
              number: parseInt(this.data.number, 10)
            }).get({
              success: (res) => {
                if (res.data.length > 0) {
                  wx.showToast({
                    title: '编号重复',
                    icon: 'error',
                    duration: 3000
                  })
                }
                else {
                  db.collection("contest").add({
                    data: {
                      number: parseInt(this.data.number, 10),
                      title: this.data.title,
                      date: this.data.selectDate,
                      organizer: this.data.organizer,current_round:0,
                    },
                    success: (res) => {
                      wx.showToast({
                        title: '新建成功',
                        icon: 'success',
                        duration: 3000,
                        success: (res) => {
                          wx.reLaunch({
                            url: '../index/index',
                          })
                        }
                      })
                    }
                  })
                }
              }
            })
          }
          else {
            wx.showToast({
              title: '未填写完整',
              icon: 'error',
              duration: 3000
            })
          }
        }
      }
    })
  },
  checkAllFilled() {
    if (this.data.number === null || this.data.title === null || this.data.organizer === null || this.data.selectDate === null) {
      return false;
    }
    return true;
  },
  onLoad(options) {
    this.setData({
      currentDate: new Date().getTime(),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})