// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init(); // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let resultRounds=[];
    let rounds = event.rounds;
    for (let r of rounds) {
      delete r._id;
      await db.collection("rounds").where({
        table: r.table,
        round: r.round,
        contest_number: r.contest_number,
      }).update({
        data: r,
      });
      resultRounds.push(r);
    }
    return {
      code:1,
      data:resultRounds,
      msg:"更新成功"
    }
  } catch (error) {
    return{
      code:0,
      errmsg:"更新失败"
    }
  }

}