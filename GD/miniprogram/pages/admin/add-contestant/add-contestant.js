const XLSX = require('../../../utils/xlsx.mini.min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestNumber: "",
    contestants: [],
    excelData: [],
    canAddDB: false,
    repeatedData:[],
    showFileData:false,
    showRepeatedData:false,

  },
  //选择xlsx文件
  chooseFile: function () {
    this.setData({
      contestants: [],
      excelData: [],
      canAddDB: false,
      showFileData:true,
      showRepeatedData:false,
    });
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const filePath = res.tempFiles[0].path;
        const fileName = filePath.split('.').pop(); // 获取文件后缀名
        if (fileName.toLowerCase() === 'xlsx') {
          // 使用xlsx库解析文件
          this.readFile(filePath);
        } else {
          wx.showModal({
            title: '格式错误',
            content: '请选择xlsx后缀名的文件',
            complete: (res) => {
              if (res.cancel) {

              }

              if (res.confirm) {

              }
            }
          })
        }
      },
      fail: (err) => {
        console.error('选择文件失败', err);
      },
    });
  },

  //处理上传的文件
  readFile: function (filePath) {
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'binary',
      success: (res) => {
        const data = res.data;
        // 将二进制数据解析为Workbook对象
        const workbook = XLSX.read(data, { type: 'binary' });
        // 获取第一个Sheet的数据
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // 将Sheet的数据转为array格式
        const arrayData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // 更新数据
        this.setData({
          excelData: arrayData
        });
        console.log(arrayData);
        let ready = this.checkDataAllReady()
        if (ready) {
          this.convertToContestant();
          this.setData({
            canAddDB: true,
          })
        }
        else {
          this.setData({
            canAddDB: false,
          });
          wx.showModal({
            title: '数据缺失',
            content: '请检查上传的文件数据是否存在空数据',
            complete: (res) => {
              if (res.cancel) {

              }

              if (res.confirm) {

              }
            }
          })
        }
      },
      fail: (err) => {
        console.error('读取文件失败', err);
      },
    });
  },
  //检查数据完整
  checkDataAllReady() {
    let result = true;
    const excelData = this.data.excelData;
    if (excelData == null) {
      result = false;
    }
    for (let i = 0; i < excelData.length; i++) {
      if (excelData[i] === null || excelData[i] === undefined) {
        result = false;
      }
      else if (excelData[i].length != 3) {
        result = false;
      }
      else {
        for (let j = 0; j < excelData[i].length; j++) {
          if (excelData[i][j] === null || excelData[i][j] === undefined) {
            result = false;
          }
        }
      }
    }
    return result;
  },
  //数据格式转换
  convertToContestant() {
    const excelData = this.data.excelData;
    const title = excelData[0];
    console.log(title);
    let temp = [];
    for (let i = 1; i < excelData.length; i++) {
      let contestant = {
        number: excelData[i][0],
        contest_number: parseInt(this.data.contestNumber, 10),
        status: "正常",
        total_points: 0,
        win_round_points: 0,
        promotion_points: 0,
        level_different_points: 0,
        opponent_level_different_points: 0,
        name: [
          excelData[i][1],
          excelData[i][2]
        ]
      }
      temp.push(contestant);
    }
    this.setData({
      contestants: temp
    });
    console.log(this.data.contestants);
  },
  //插入数据库
  onSubmit() {
    wx.showModal({
      title: '再次确认',
      content: '确认参赛名单以及对应队员姓名队伍编号无误可以导入',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          this.addToDB();
        }
      }
    })
  },
  addToDB() {
    wx.cloud.callFunction({
      name: 'addContestantsToDB', // 云函数名称
      data: {
        data: this.data.contestants
      },
      success: res => {
        console.log('操作成功', res.result);
        this.setData({
          repeatedData:res.result.data,
          showRepeatedData:true,
          showFileData:false
        });
        wx.showModal({
          title: '导入成功',
          content: '已成功导入'+(this.data.contestants.length-this.data.repeatedData.length)+'/'+this.data.contestants.length+"队，如有重复队伍将展示在页面上",
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
        // 在这里处理操作成功的情况
      },
      fail: err => {
        console.error('操作失败', err);
        // 在这里处理操作失败的情况
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      contestNumber: options.contestNumber
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