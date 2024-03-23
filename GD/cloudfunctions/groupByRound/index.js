// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init(); // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let initScore = 0;
    let initCard = "暂无";
    let returnData = {
      code: 1,
      msg: "分组成功",
      data: [],
    };
    const contest_number = event.contest_number;
    const current_round = event.current_round;
    let queryContestants = await db.collection('contestant').where({
      contest_number: parseInt(contest_number, 10),
    }).get();
    if (queryContestants.data.length % 2 != 0) {
      returnData.msg = "队伍数量不匹配，无法分组";
      returnData.code = 0;
    }
    else {
      //第一轮，随机分组
      if (current_round == 1) {
        let contestants = queryContestants.data;
        contestants.sort(() => Math.random() - 0.5);
        let rounds = [];
        for (let i = 0; i < contestants.length; i = i + 2) {
          let round = {
            contest_number: parseInt(contest_number, 10),
            round: parseInt(current_round, 10),
            table: i / 2 + 1,
            north_south_contestant_number: parseInt(contestants[i].number, 10),
            north_south_contestant_name: contestants[i].name,
            north_south_card: initCard,
            north_south_score: initScore,
            west_east_contestant_number: parseInt(contestants[i + 1].number),
            west_east_contestant_name: contestants[i + 1].name,
            west_east_card:initCard,
            west_east_score:initScore,
          };
          rounds.push(round)
        };
        let finishedRounds = [];
        for (let r of rounds) {
          await db.collection("rounds").add({
            data: r
          });
          finishedRounds.push(r);
        }
        returnData.data = finishedRounds;
      }
      else {
        let contestants = queryContestants.data;
        contestants.sort((a, b) => {
          // 按照第一个属性进行比较
          if (a.total_points !== b.total_points) {
            return b.total_points - a.total_points; // 降序排列
          }
          // 如果第一个属性相同，则比较第二个属性
          if (a.win_round_points !== b.win_round_points) {
            return b.win_round_points - a.win_round_points; // 降序排列
          }
          // 以此类推，比较第三个、第四个和第五个属性
          if (a.level_different_points !== b.level_different_points) {
            return b.level_different_points - a.level_different_points; // 降序排列
          }
          if (a.promotion_points !== b.promotion_points) {
            return b.promotion_points - a.promotion_points; // 降序排列
          }
          if (a.opponent_level_different_points !== b.opponent_level_different_points) {
            return b.opponent_level_different_points - a.opponent_level_different_points; // 降序排列
          }
          // 如果五个属性都相同，则返回 0，表示相等并列
          return 0;
        });
        let rounds = [];
        for (let i = 0; i < contestants.length; i = i + 2) {

          let round = {
            contest_number: parseInt(contest_number, 10),
            round: parseInt(current_round, 10),
            table: i / 2 + 1,
            north_south_contestant_number: parseInt(contestants[i].number, 10),
            north_south_contestant_name: contestants[i].name,
            north_south_card: initCard,
            north_south_score: initScore,
            west_east_contestant_number: parseInt(contestants[i + 1].number),
            west_east_contestant_name: contestants[i + 1].name,
            west_east_card: initCard,
            west_east_score: initScore,
          };
          rounds.push(round)
        };
        let finishedRounds = [];
        for (let r of rounds) {
          await db.collection("rounds").add({
            data: r
          });
          finishedRounds.push(r);
        }
        returnData.data = finishedRounds;
      }
    }
    return {
      data: returnData,
    }
  }
  catch (err) {
    return {
      success: false,
      message: '分组失败: ' + err.errMsg
    }
  }
};