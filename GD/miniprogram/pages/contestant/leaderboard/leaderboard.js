// pages/contestant/leaderboard/leaderboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: ["排名", "队名", "队员", "场分", "胜轮次", "级差分", "升级数", "对手级差分"],
    contestants: [],
    contestNumber: null,
    contestantNumber: null,
  },
  changeShowDetail(event){
    const index = event.currentTarget.dataset.index;
    let contestants=this.data.contestants;
    
    if(contestants[index].showDetail===false){
      console.log("111");
      contestants[index].showDetail=true;
    }
    else{
      console.log("222");
      contestants[index].showDetail=false;
    }
    this.setData({
      contestants:contestants
    });
    console.log(this.data.contestants);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      contestNumber: options.contestNumber,
      contestantNumber: options.contestantNumber,
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
          console.log(this.data.contestants);
          this.filterContestants();
        }
      },
      fail: (err) => {
        console.error('查询失败', err);
      }
    });
  },
  filterContestants(){
    console.log("刷选");
    const contestants=this.data.contestants;
    let filteredContestants=[];
    contestants.forEach(c => {
      if(c.contest_number==this.data.contestNumber){
        c.showDetail=false;
        filteredContestants.push(c);
      }
    });
    this.setData({
      contestants:filteredContestants
    });
    console.log("筛选后：",this.data.contestants);
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