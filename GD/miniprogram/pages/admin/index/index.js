// pages/admin/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    players: [],
    playerIndex: 0,
    active: 0,
    leaderboard :[
      { id: 1, name: '小明', points: 100, age: 25, gender: '男' },
      { id: 2, name: '小红', points: 90, age: 22, gender: '女' },
      { id: 3, name: '小刚', points: 80, age: 27, gender: '男' },
    ],
  },

  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({
      active: event.detail
    });
    if (this.data.active) {
      this.setData({ active: 0 });
      wx.navigateTo({
        url: '../personal-center/personal-center',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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