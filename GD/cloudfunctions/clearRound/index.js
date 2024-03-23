// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init(); // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  // try {
  //   const contest_number = parseInt(event.contest_number, 10);
  //   const clear_round = parseInt(event.clear_round, 10);

  //   // 查询数据
  //   const toDeleteRounds = await db.collection('rounds').where({
  //     contest_number:contest_number,
  //     round:clear_round
  //   }).get();

  //   // 删除查询到的数据
  //   for(let round of toDeleteRounds){
  //     await db.collection("rounds").doc(round._id).remove();
  //   }
  //   return {
  //     errMsg: "清除成功",
  //     deletedData: toDeleteRounds // 返回已删除的数据数量
  //   };
  // } catch (err) {
  //   return {
  //     errMsg: "清除失败",
  //     error: err
  //   };
  // }
  try {
    const contest_number = parseInt(event.contest_number, 10);
    const clear_round = parseInt(event.clear_round, 10);

    await db.collection('rounds').where({
      contest_number: contest_number,
      round: clear_round
    }).remove();
    return{
      data:"成功"
    }
  } catch (e) {
    console.error(e)
  }
};