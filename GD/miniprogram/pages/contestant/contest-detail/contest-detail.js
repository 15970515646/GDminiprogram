// pages/contestant/contest-detail/contest-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempContestant: null,
    isTempContestant: false,
    contestStarted: false,
    isRegistered: false,
    singleShow: false,
    playOne: "",
    playTwo: "",
    doubleShow: false,
    contestNumber: null,
    contest: null,
    inputName: null,
    isContestant: false,
    contestant: null,
  },
  playOneInput(e) {
    this.setData({
      playOne: e.detail
    })
  },
  playTwoInput(e) {
    this.setData({
      playTwo: e.detail
    })
  },
  singleRegister() {
    if (this.data.singleShow === false) {
      this.setData({
        playOne: "",
        playTwo: "",
        singleShow: true,
        doubleShow: false,
      });
    }
  },
  doubleRegister() {
    if (this.data.doubleShow === false) {
      this.setData({
        playOne: "",
        playTwo: "",
        singleShow: false,
        doubleShow: true,
      });
    }
  },
  //组队报名
  doubleRegisterSubmit() {
    const playOne = this.data.playOne;
    const playTwo = this.data.playTwo;
    //字段检查
    if (playOne && playTwo && playOne != playTwo) {
      //查询数据库
      const db = wx.cloud.database();
      db.collection("temp_contestant").where({
        contest_number: parseInt(this.data.contestNumber, 10),
      }).get({
        success: (res) => {
          //遍历，比较报名的两个人中是否有人已经报名过了
          if (res.data.length > 0) {
            const list = res.data;
            const play1 = this.data.playOne;
            const play2 = this.data.playTwo;
            let flag = false;
            list.forEach(e => {
              e.name.forEach(name => {
                if (name == play1 || name == play2) {
                  flag = true;
                  this.setData({
                    tempContestant: e,
                    isTempContestant: true,
                  });
                  wx.showToast({
                    title: "不可重复报名",
                    icon: "error",
                    duration: 1000,
                  });
                }
              });
            });
            //确定两人都未曾报名
            if (!flag) {
              db.collection("temp_contestant").add({
                data: {
                  contest_number: parseInt(this.data.contestNumber, 10),
                  name: [play1, play2],
                },
                success: (res) => {
                  let c = {
                    name: [play1, play2]
                  };
                  this.setData({
                    tempContestant: c,
                    isTempContestant: true,
                  });
                  wx.showToast({
                    title: "报名成功",
                    icon: "success",
                    duration: 1000
                  });
                }
              })
            }
          }
          //数据库暂无报名数据
          else {
            const play1 = this.data.playOne;
            const play2 = this.data.playTwo;
            db.collection("temp_contestant").add({
              data: {
                contest_number: parseInt(this.data.contestNumber, 10),
                name: [play1, play2],
              },
              success: (res) => {
                let c = {
                  name: [play1, play2]
                };
                this.setData({
                  tempContestant: c,
                  isTempContestant: true,
                  playOne:"",
                  playTwo:"",
                });
                wx.showToast({
                  title: "报名成功",
                  icon: "success",
                  duration: 1000
                });
              }
            })
          }
        }
      })
    }
    //字段填写提示
    else {
      wx.showToast({
        title: '填写错误',
        icon: "error",
        duration: 1000
      })
    }
  },
  //单人报名
  singleRegisterSubmit() {
    const playOne = this.data.playOne;
    //字段检查
    if (playOne) {
      //数据库查询
      const db = wx.cloud.database();
      db.collection("temp_contestant").where({
        contest_number: parseInt(this.data.contestNumber, 10),
        name: playOne
      }).get({
        success: (res) => {
          //未报名过
          if (res.data.length == 0) {
            db.collection("temp_contestant").add({
              data: {
                contest_number: parseInt(this.data.contestNumber, 10),
                name: [playOne],
              },
              success: (res) => {
                let c = {
                  name: [playOne]
                };
                this.setData({
                  tempContestant: c,
                  isTempContestant: true
                });
                wx.showToast({
                  title: "报名成功",
                  icon: "success",
                  duration: 1000
                });
              }
            })
          }
          //重复报名
          else {
            this.setData({
              isTempContestant: true,
              tempContestant: res.data[0],
            })
            wx.showToast({
              title: "重复报名",
              icon: "none"
            });
          }
        }
      })
    }
    //字段不完整提示
    else {
      wx.showToast({
        title: '填写不完整',
        icon: "error",
        duration: 1000
      })
    }
  },
  //查询参赛信息
  onSearchContestant(event) {
    if (this.data.inputName === null) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "error",
        duration: 3000
      });
      this.setData({
        isContestant: false,
      });
      return;
    }
    const db = wx.cloud.database();
    db.collection("contestant").where({
      name: this.data.inputName,
      contest_number: parseInt(this.data.contestNumber, 10)
    }).get({
      success: (res) => {
        if (res.data.length > 0) {
          wx.showToast({
            title: this.data.inputName,
          });
          this.setData({
            isContestant: true,
            contestant: res.data[0],
          });
        }
        else {
          wx.showToast({
            title: "查无此人",
            icon: "none",
            duration: 3000
          });
          this.setData({
            isContestant: false,
          });
        }
      }
    })
  },
  onInputChange(e) {
    this.setData({
      inputName: e.detail,
    });
  },
  //查看排行榜
  goToLeaderboard() {
    wx.navigateTo({
      url: '../../leaderboard/leaderboard?contestNumber=' + this.data.contestNumber,
    })
  },
  //查看每轮得分
  goToRecords() {
    wx.navigateTo({
      url: '../records/records?contestNumber=' + this.data.contestNumber + "&contestantNumber=" + this.data.contestant.number,
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
        if (res.data[0].current_round == 0) {
          this.setData({
            contestStarted: false
          });
        }
        else {
          this.setData({
            contestStarted: true
          });
        }
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