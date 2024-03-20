// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init(); // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 循环插入数据
    let areadyInDBData=[];
    for (let data of event.data) {
      // 查询是否已存在该数据
      const queryResult = await db.collection('contestant').where({
         contest_number:data.contest_number,
         number:data.number
        }).get();

      // 如果查询结果中没有数据，则执行插入操作
      if (queryResult.data.length === 0) {
        await db.collection('contestant').add({
          data: data
        });
      } else {
        areadyInDBData.push(data);
        console.log(`数据 ${data} 已存在，无需插入`);
      }
    }

    return {
      success: true,
      message: '批量插入数据成功',
      data:areadyInDBData,
    };
  } catch (err) {
    return {
      success: false,
      message: '批量插入数据失败: ' + err.errMsg
    };
  }
};