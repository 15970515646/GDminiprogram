Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestNumber: null,
    contest: null,
    contestants:[],
    contestStart:false,
  },
  changeShowContestants(){
    if(this.data.showContestants===false){
      this.setData({
        showContestants:true,
        contestantsArrowDirection:"up"
      });
    }
    else{
      this.setData({
        showContestants:false,
        contestantsArrowDirection:"down"
      });
    }
  },
  
  nextRound() {
    wx.showModal({
      title: '请确认',
      content: '确认进入下一轮,将自动分组',
      complete: (res) => {
        if (res.confirm) {
          let contest = this.data.contest;
          contest.current_round = contest.current_round + 1;
          this.setData({
            contest: contest
          });
          const db = wx.cloud.database();
          db.collection("contest").where({
            number: parseInt(this.data.contestNumber, 10)
          }).update({
            data: {
              current_round:this.data.contest.current_round
            },
            success: (res) => {
              this.setData({
                contestStart:true
              });
              wx.cloud.callFunction({
                name:"groupByRound",
                data:{
                  contest_number:this.data.contestNumber,
                  current_round:this.data.contest.current_round
                },
                success:(res)=>{
                  if(res.result.data.code==1){
                    wx.showToast({
                    title: res.result.data.msg,
                  });
                  }
                  else{
                    wx.showModal({
                      title: '分组失败',
                      content: res.result.data.msg,
                      complete: (res) => {
                        if (res.cancel) {
                          
                        }
                        if (res.confirm) {
                          
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  lastRound() {
    if (this.data.contest.current_round > 0) {
      wx.showModal({
        title: '请确认',
        content: '确认回退到上一轮（用于撤销进入下一轮的误操作）',
        complete: (res) => {
          if (res.confirm) {
            let contest = this.data.contest;
            contest.current_round = contest.current_round - 1;
            this.setData({
              contest: contest
            });
            const db = wx.cloud.database();
            db.collection("contest").where({
              number: parseInt(this.data.contestNumber, 10)
            }).update({
              data: {
                current_round:this.data.contest.current_round
              },
              success: (res) => {
                //TODO：清除当前轮次的分组数据
                if(this.data.contest.current_round==0){
                  this.setData({
                    contestStart:false
                  });
                }
                wx.cloud.callFunction({
                  name:"clearRound",
                  data:{
                    contest_number:this.data.contestNumber,
                    clear_round:this.data.contest.current_round+1
                  },
                  success:(res)=>{
                    wx.showToast({
                      title: '回退成功',
                    });
                  }
                })
              }
            })
          }
        }
      })
    }
    else{
      wx.showToast({
        title: '无法执行！',
        icon:"error",
        duration:1000
      })
    }

  },
  goToAddContestants(){
    wx.navigateTo({
      url: '../add-contestant/add-contestant?contestNumber='+this.data.contestNumber,
    })
  },
  goToManageContestants(){
    wx.navigateTo({
      url: '../manage-contestant/manage-contestant?contestNumber='+this.data.contestNumber,
    })
  },
  goToTempContestants(){
    wx.navigateTo({
      url: '../temp-contestant/temp-contestant?contestNumber='+this.data.contestNumber,
    })
  },
  goToRoundSeat(){
    wx.navigateTo({
      url: '../round-seat/round-seat?contestNumber='+this.data.contestNumber+"&roundNumber="+this.data.contest.current_round,
    })
  },
  goToRoundResult(){
    wx.navigateTo({
      url: '../round-result/round-result?contestNumber='+this.data.contestNumber+"&roundNumber="+this.data.contest.current_round,
    })
  },
  goToLeaderBoard(){
    wx.navigateTo({
      url: '../../leaderboard/leaderboard?contestNumber='+this.data.contestNumber,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contestNumber: options.contestNumber
    });
    const db = wx.cloud.database();
    db.collection("contest").where({
      number: parseInt(this.data.contestNumber, 10)
    }).get({
      success: (res) => {
        this.setData({
          contest: res.data[0]
        });
        if(this.data.contest.current_round>0){
          this.setData({
            contestStart:true
          });
        }
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