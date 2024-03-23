// pages/contestant/records/records.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rounds: [],
    contestNumber: null,
    contestantNumber: null,
    showData:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      contestNumber: options.contestNumber,
      contestantNumber: options.contestantNumber
    });
    this.queryRounds(0);
  },
  queryRounds: function (skip) {
    const db = wx.cloud.database();
    const collection = db.collection('rounds'); // 替换为实际的集合名称

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
            rounds: this.data.rounds.concat(data),
          });
          // 继续查询下一页数据
          this.queryRounds(skip + pageSize);
        } else {
          console.log('所有数据查询完毕');
          this.filterRounds();
          this.setData({
            showData:true
          })
        }
      },
      fail: (err) => {
        console.error('查询失败', err);
      }
    });
  },
  filterRounds() {
    const rounds = this.data.rounds;
    let resultRounds = []
    rounds.forEach(r => {
      if (r.contest_number == this.data.contestNumber) {
        if (r.north_south_contestant_number == this.data.contestantNumber || r.west_east_contestant_number == this.data.contestantNumber) {
          resultRounds.push(r);
        }
      }
    });
    resultRounds.sort((a, b) => {
      return a.round - b.round; // 升序排列
    });
    this.setData({
      rounds: resultRounds
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