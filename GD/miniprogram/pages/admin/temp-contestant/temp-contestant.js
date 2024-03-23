const XLSX = require('../../../utils/xlsx.mini.min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestNumber:"",
    tempContestants:[],
    contest:null,
    showData:false,
  },
  saveFile() {
    let sheet = [];
    let title = ['比赛编号', '队员一','队员二'];
    sheet.push(title);
    this.data.tempContestants.forEach(element => {
      let data = [this.data.contestNumber];
      element.name.forEach(n => {
        data.push(n);
      });
      sheet.push(data);
    });
    // XLSX插件使用
    var ws = XLSX.utils.aoa_to_sheet(sheet);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "报名人员名单");
    var fileData = XLSX.write(wb, {
      bookType: "xlsx",
      type: 'base64'
    });
    let contestTitle=this.data.contest.title;
    let fileName = contestTitle.replace(/"/g, '');
    let filePath = `${wx.env.USER_DATA_PATH}/` + fileName+'报名人员名单.xlsx';
    // 写文件
    const fs = wx.getFileSystemManager()
    fs.writeFile({
      filePath: filePath,
      data: fileData,
      encoding: 'base64',
      bookSST: true,
      success(res) {
        console.log(res)
        const sysInfo = wx.getSystemInfoSync()
        // 导出
        if (sysInfo.platform.toLowerCase().indexOf('windows') >= 0) {
          // 电脑PC端导出
          wx.saveFileToDisk({
            filePath: filePath,
            success(res) {
              console.log(res)
            },
            fail(res) {
              console.error(res)
              util.tips("导出失败")
            }
          })
        } else {
          // 手机端导出
          // 打开文档
          wx.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      },
      fail(res) {
        console.error(res)
        if (res.errMsg.indexOf('locked')) {
          wx.showModal({
            title: '提示',
            content: '文档已打开，请先关闭',
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contestNumber:options.contestNumber
    });
    const db=wx.cloud.database();
    db.collection("contest").where({
      number:parseInt(this.data.contestNumber,10)
    }).get({
      success:(res)=>{
        console.log(res.data);
        this.setData({
          contest:res.data[0]
        });
      }
    })
    this.queryTempContestants(0);
  },
  queryTempContestants: function (skip) {
    const db = wx.cloud.database();
    const collection = db.collection('temp_contestant'); // 替换为实际的集合名称
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
            tempContestants: this.data.tempContestants.concat(data),
          });
          // 继续查询下一页数据
          this.queryTempContestants(skip + pageSize);
        } else {
          console.log('所有数据查询完毕');
          this.filterTempContestants();
          this.setData({
            showData:true,
          });
        }
      },
      fail: (err) => {
        console.error('查询失败', err);
      }
    });
  },
  filterTempContestants() {
    const tempContestants = this.data.tempContestants;
    let filteredContestants = [];
    tempContestants.forEach(c => {
      if (c.contest_number == this.data.contestNumber) {
        filteredContestants.push(c);
      }
    });
    this.setData({
      tempContestants: filteredContestants
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