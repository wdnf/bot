const discord = require('discord.js');
const currency = require('../../util/currency.js');
const embed = require('../../util/embed.js');

module.exports = {
    name:"work",
    aliases:["w"],
    usage: "work",
    category:"economy",
    description:"Work",
    cooldown:60*60*3,
    run: async (client, message, args) =>{
        let userid = message.author.id;
        let userbal = await currency.getBalance(userid);
        let workcoins = Math.floor(Math.random()*12) + 6;
        let totalWDNF = await currency.getAllMoney();
        /*let number = (((totalWDNF/2) / client.guilds.cache.size) / 100);
        workcoins = (number / 100) * Math.floor(Math.random() * 99)+2.5;*/
        workcoins = 25/index
        workcoins = workcoins.toFixed(2);
        workcoins = parseFloat(workcoins);
        let newuserbal = userbal + workcoins;
        await currency.setBalance(userid,newuserbal);
        embed.Successfull(message,null,`You've made **${workcoins} WDNF**.`)
    }
}
function getLength(array){
    n = 0;
    array.forEach(a => {
        n++;
    });
    return n;
}