const discord = require('discord.js');
const currency = require('../../util/currency.js');
const embed = require('../../util/embed.js');

module.exports = {
    name:"balance",
    aliases:["bal"],
    usage: "balance (user)",
    category:"economy",
    description:"Will display your account balance or balance of a specified user.",
    run: async (client, message, args) =>{
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(member){
            let amount = await currency.getBalance(member.user.id);
            amount = parseFloat(amount.toFixed(2)); 
            return embed.InformationEmbed(message,null,member.displayName+`'s Balance: **${amount} WDNF**`,member);

        }
        let bal = await currency.getBalance(message.author.id);
        bal = parseFloat(bal.toFixed(2));
        embed.InformationEmbed(message,null,`Your Balance: **${bal} WDNF**`,null);
        
        
    }
}