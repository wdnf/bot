const discord = require('discord.js');
const currency = require('../../util/currency.js');
const embed = require('../../util/embed.js');

module.exports = {
    name:"pay",
    aliases:["transfer", "send", "donate"],
    usage: "pay <user> <amount>",
    category:"economy",
    description:"Will transfer crypto to a specified user.",
    run: async (client, message, args) =>{
        if(!args[1]){
            return embed.InvalidUsage(message);
        }
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member){
            return embed.UserNotFound(message);
        }
        if(member.user.id === message.author.id){
            return embed.CustomError(message,"Ummm?","Are you trying to send yourself money? lol")
        }
        amount = parseFloat(args[1]);
        amount = amount.toFixed(2);
        amount = parseFloat(amount);
        if(amount == NaN){
            return embed.InvalidParms(message);
        }
        if(amount < 0){
            return embed.CustomError(message,"Invalid Payment","Negative numbers aren't allowed.")
        }
        let payingMember = message.member;
        let payingMemberCash = await currency.getBalance(payingMember.user.id);
        let memberCash = await currency.getBalance(member.user.id);
        if(amount > payingMemberCash){
            return embed.CustomError(message,"Transaction invalid","You don't have enough WDNF to complete this transaction.")
        }
        //transaction
        payingMemberCash = payingMemberCash - amount;
        let totalWDNF = await currency.getAllMoney();
        let totalUser = getLength(await currency.getAllUser());
        amount = ((amount / 100) * 99)
        amount = parseFloat(amount.toFixed(4));
        memberCash = memberCash + amount;
        await currency.setBalance(payingMember.user.id,payingMemberCash);
        await currency.setBalance(member.user.id,memberCash);
        return embed.Successfull(message,"Transaction successful", `**${amount} WDNF** has been added to ${member}'s account.`);

        
        
        
    }
}
function getLength(array){
    n = 0;
    array.forEach(a => {
        n++;
    });
    return n;
}