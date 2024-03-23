Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestants: [],
    contestNumber: "",
    showData: false,
  },
  deleteContestant(e) {
    const index = e.currentTarget.dataset.index;
    const contestant = this.data.contestants[index];
    wx.showModal({
      title: '确认删除',
      content: '确认删除参赛编号为：' + contestant.number + "，队员：" + contestant.name[0]+"，" + contestant.name[1] + "的队伍？",
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection("contestant").where({
            contest_number: parseInt(this.data.contestNumber),
            number: parseInt(contestant.number),
          }).remove({
            success: (res) => {
              let newContestants = this.data.contestants;
              newContestants.splice(index, 1);
              this.setData({
                contestants: newContestants
              });
              wx.showToast({
                title: '删除成功',
                icon:"success",
              })
            }
          })
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contestNumber: options.contestNumber
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
          // 继续查询下一页数据
          this.queryContestants(skip + pageSize);
        } else {
          console.log('所有数据查询完毕');
          this.filterContestants();
          this.setData({
            showData:true,
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
        filteredContestants.push(c);
      }
    });
    filteredContestants.sort((a, b) => a.number - b.number);
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