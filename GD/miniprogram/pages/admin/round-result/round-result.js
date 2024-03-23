Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentRound: null,
    contestNumber: null,
    rounds: [],
    pickerArray: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    NSShowPicker: false,
    WEShowPicker: false,
    currentIndex: null,
    showRounds: false,
  },
  onNSShowPopup(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      NSShowPicker: true,
    });
  },
  onWEShowPopup(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      WEShowPicker: true,
    });
  },
  onClosePopup() {
    this.setData({
      NSShowPicker: false,
      WEShowPicker: false,
    })
  },
  onCancel() {
    this.setData({
      NSShowPicker: false,
      WEShowPicker: false,
    })
  },
  onConfirm(e) {
    const value = e.detail.value;
    if (this.data.NSShowPicker == true) {
      let rounds = this.data.rounds;
      rounds[this.data.currentIndex].north_south_card = value;
      this.setData({
        rounds: rounds,
        NSShowPicker: false,
        WEShowPicker: false,
      });
    }
    if (this.data.WEShowPicker == true) {
      let rounds = this.data.rounds;
      rounds[this.data.currentIndex].west_east_card = value;
      this.setData({
        rounds: rounds,
        NSShowPicker: false,
        WEShowPicker: false,
      });
    }
  },
  submit() {
    const rounds = this.data.rounds;
    for(let r of rounds){
      if(r.north_south_card=="暂无"||r.west_east_card=="暂无"){
        wx.showModal({
          title: '未填写完整',
          content: '请仔细检查是否有数据尚未填写，请填写好再提交',
        })
        return;
      }
    }
    
    wx.cloud.callFunction({
      name: "updateRoundResult",
      data: {
        rounds:rounds
      },
      success: (res) => {
        if(res.result.code==1){
          wx.showToast({
            title: res.result.msg,
          });
        }
        else{
          wx.showToast({
            title: res.result.errmsg,
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contestNumber: options.contestNumber,
      currentRound: options.roundNumber,
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
            showRounds: true
          });
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
      if (r.contest_number == this.data.contestNumber && r.round == this.data.currentRound) {
        resultRounds.push(r);
      }
    });
    resultRounds.sort((a, b) => {
      return a.table - b.table; // 升序排列
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