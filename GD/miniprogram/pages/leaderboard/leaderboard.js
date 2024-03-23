// pages/contestant/leaderboard/leaderboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestants: [],
    contestNumber: null,
    showData: false,
  },
  changeShowDetail(event) {
    const index = event.currentTarget.dataset.index;
    let contestants = this.data.contestants;
    if (contestants[index].showDetail === false) {
      contestants[index].showDetail = true;
    }
    else {
      contestants[index].showDetail = false;
    }
    this.setData({
      contestants: contestants
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      contestNumber: options.contestNumber,
    });
    this.queryContestants(0);
  },
  queryContestants: function (skip) {
    const db = wx.cloud.database();
    const collection = db.collection('contestant'); // 替换为实际的集合名称

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
            contestants: this.data.contestants.concat(data),
          });
          console.log("1111111");
          // 继续查询下一页数据
          this.queryContestants(skip + pageSize);
        } else {
          console.log('所有数据查询完毕');
          this.filterContestants();
          this.setData({
            showData: true,
          })
        }
      },
      fail: (err) => {
        console.error('查询失败', err);
      }
    });
  },
  filterContestants() {
    const contestants = this.data.contestants;
    let filteredContestants = [];
    contestants.forEach(c => {
      if (c.contest_number == this.data.contestNumber) {
        c.showDetail = false;
        filteredContestants.push(c);
      }
    });
    //排行，依次按照各个积分比较
    filteredContestants.sort((a, b) => {
      // 按照第一个属性进行比较
      if (a.total_points !== b.total_points) {
        return b.total_points - a.total_points; // 降序排列
      }
      // 如果第一个属性相同，则比较第二个属性
      if (a.win_round_points !== b.win_round_points) {
        return b.win_round_points - a.win_round_points; // 降序排列
      }
      // 以此类推，比较第三个、第四个和第五个属性
      if (a.level_different_points !== b.level_different_points) {
        return b.level_different_points - a.level_different_points; // 降序排列
      }
      if (a.promotion_points !== b.promotion_points) {
        return b.promotion_points - a.promotion_points; // 降序排列
      }
      if (a.opponent_level_different_points !== b.opponent_level_different_points) {
        return b.opponent_level_different_points - a.opponent_level_different_points; // 降序排列
      }
      // 如果五个属性都相同，则返回 0，表示相等并列
      return 0;
    });
    this.setData({
      contestants: filteredContestants
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