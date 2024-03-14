// pages/admin/contest-list/contest-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contests:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryContests(0);
  },
  queryContests: function (skip) {
    const db = wx.cloud.database();
    const collection = db.collection('contest'); // 替换为实际的集合名称

    // 每页显示的条数
    const pageSize = 20;

    // 查询数据
    collection.skip(skip).limit(pageSize).get({
      success: (res) => {
        const data = res.data;

        if (data.length > 0) {
          console.log(`第 ${skip / pageSize + 1} 页数据:`, data);
          // 处理当前页的数据
          // 将当前页的数据追加到数组中
          this.setData({
            contests: this.data.contests.concat(data),
          });
          // 继续查询下一页数据
          this.queryContests(skip + pageSize);
        } else {
          console.log('所有数据查询完毕');
          console.log(this.data.contests[0].date);
        }
      },
      fail: (err) => {
        console.error('查询失败', err);
      }
    });
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