const discord = require('discord.js');
const config = require("../../config.json");
const embed = require('../../util/embed.js');

module.exports = {
    name:"help",
    aliases:["h"],
    usage: "help (command)",
    category:"general",
    description:"Nahh",
    cooldown: 10,
    run: (client, message, args) =>{
        if(args[0]){
            let helpEmbed = new discord.MessageEmbed().setColor("#f0db4f").setAuthor("Help Menu","https://cdn.glitch.com/db5c7276-a9b5-4d33-a477-01d5bd11362d%2Fhelp%20(2).png?v=1594751208228");
            let cmd = getCommand(message,client);
            if(cmd){
                let aliases = "**Aliases: **";
                if(cmd.aliases){
                    cmd.aliases.forEach(al => {
                        aliases += "`"+ al +"` ";
                    })
                }
                line1 = "**"+config.prefix+cmd.usage+"** - "+cmd.description;
                helpEmbed.setDescription("Command arguments `<>` = Required, `()` = optional");
                helpEmbed.setTitle(line1+"\n"+aliases)
                message.channel.send(helpEmbed)
            }
            else{
                return embed.CustomError(message,null,"Command not Found!")
            }
            return
        }
        let categories = [];
        client.commands.forEach(element => {
            if(!categories.includes(element.category)){
                categories.push(element.category)
            }
        });
        let helpEmbed = new discord.MessageEmbed().setColor("#f0db4f").setAuthor("Help Menu","https://cdn.glitch.com/db5c7276-a9b5-4d33-a477-01d5bd11362d%2Fhelp%20(2).png?v=1594751208228");
        categories.forEach(cat => {

            let commands = ""
            client.commands.forEach(com => {
                if(com.category == cat){
                    commands += "`"+com.name +"`, ";
                }
            });

            helpEmbed.addField(cat.charAt(0).toUpperCase() + cat.substr(1),commands.trim().slice(0,-1))
        });
        helpEmbed.setDescription("Command arguments `<>` = Required, `()` = optional");
        message.channel.send(helpEmbed)
    }
}
function getCommand(message,client){
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(args[0]); 
    if(!command ) command = client.commands.get(client.aliases.get(args[0]));
    if(command) return command
    else return false
}