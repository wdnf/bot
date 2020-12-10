const discord = require("discord.js");
const currency = require("../../util/currency.js");
const embed = require("../../util/embed.js");

module.exports = {
  name: "top",
  aliases: ["rich"],
  usage: "top",
  category: "economy",
  description: "Work",
  cooldown: 3,
  run: async (client, message, args) => {
    let topX = 3;
    let usersAll = await currency.getAllUser();
    let top10 = [];
    let users = [];
    usersAll.forEach(auser => {
      let member = message.guild.members.cache.get(auser.userid);
      if (member != undefined) users.push(auser);
      });
    users.forEach(user => {
      top10.push(user.amount);
    });
    top10.sort(function(a, b) {
      return b - a;
    });
    console.log(top10)
    top = [];
    for (let i = 0; i < topX; i++) {
      if (top10[i]) {
        users.forEach(user => {
          if (user.amount == top10[i] && !top.includes(user)) {
            top.push(user);
          }
        });
      }
    }
    let msg = "";
    let d = 0;
    console.log("TOP ONES: " + top);
    top.forEach(user => {
      console.log(user);
      d++;
      if (user == undefined) return;
      let muser = message.guild.members.cache.get(user.userid);
      let musertag = muser.user.tag;
      if (muser == message.member) {
        msg += "**" + d + "# " + musertag + " - " + user.amount + " WDNF **\n";
      } else {
        msg += d + "# " + musertag + " - " + user.amount + " WDNF \n";
      }
    });
    embed.CustomEmbed(message, "TOP " + topX, msg, "#f0db4f");
  }
};
