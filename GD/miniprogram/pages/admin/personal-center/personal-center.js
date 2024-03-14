// pages/admin/personal-center/personal-center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    active: 1,
  },

  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    console.log(this.data.active);
    if(!this.data.active){
      wx.navigateBack({
        url: '../index/index',
      })
    }
  },
  goToAddContest(){
    wx.navigateTo({
      url: '../add-contest/add-contest',
    })
  },
  goToContestList(){
    wx.navigateTo({
      url: '../contest-list/contest-list',
    })
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