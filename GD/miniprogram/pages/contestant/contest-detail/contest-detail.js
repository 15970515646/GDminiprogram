// pages/contestant/contest-detail/contest-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestNumber: null,
    contest: null,
    inputName: null,
    isContestant: false,
    contestant:null,
  },
//查询参赛信息
  onSearchContestant(event) {
    console.log(this.data.inputName);
    if (this.data.inputName === null) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "error",
        duration: 3000
      });
      this.setData({
        isContestant:false,
      });
      return;
    }
    const db = wx.cloud.database();
    db.collection("contestant").where({
      name: this.data.inputName,
      contest_number:parseInt(this.data.contestNumber,10)
    }).get({
      success: (res) => {
        if (res.data.length > 0) {
          wx.showToast({
            title: this.data.inputName,
          });
          this.setData({
            isContestant:true,
            contestant:res.data[0],
          });
          console.log(this.data.contestant);
        }
        else{
          wx.showToast({
            title: "查无此人",
            icon:"none",
            duration:3000
          });
          this.setData({
            isContestant:false,
          });
        }

      }
    })

  },
  onInputChange(e) {
    this.setData({
      inputName: e.detail,
    });
    console.log(this.data.inputName);
  },
  //查看排行榜
  goToLeaderboard(){
    wx.navigateTo({
      url: '../leaderboard/leaderboard?contestNumber='+this.data.contestNumber+"&contestantNumber="+this.data.contestant.number,
    })
  },
  //查看每轮得分
  goToRecords(){
    wx.navigateTo({
      url: '../records/records?contestNumber='+this.data.contestNumber+"&contestantNumber="+this.data.contestant.number,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.contestNumber);
    this.setData({
      contestNumber: options.contestNumber
    });
    const db = wx.cloud.database();
    db.collection("contest").where({
      number: parseInt(this.data.contestNumber, 10),
    }).get({
      success: (res) => {
        console.log(res.data);
        this.setData({
          contest: res.data[0]
        })
      }
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