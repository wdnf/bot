const discord = require('discord.js');

let embed = "Embed Error";

const config = require("../config.json");
const prefix = config.prefix;

module.exports = {
    
    CustomEmbed: (message,Title,Description,Color) => {
        newEmbed(message);
        if(Title != null) embed.setTitle(Title);
        if(Description != null) embed.setDescription(Description);
        embed.setColor(Color);
        send(message.channel);
    },
    InformationEmbed: (message,Title,Description,MemberAuthor) => {
        newEmbed(message);
        if(Title != null) embed.setTitle(Title);
        if(Description != null) embed.setDescription(Description);
        embed.setColor("#f0db4f");
        if(MemberAuthor != null) embed.setAuthor(MemberAuthor.displayName,MemberAuthor.user.displayAvatarURL({dynamic:true}))
        send(message.channel);
    },
    CustomError: (message,Title,Description) =>{
        newEmbed(message);
        if(Title != null) embed.setTitle(Title);
        if(Description != null) embed.setDescription(Description);
        embed.setColor("#A63232");
        send(message.channel);
    },
    UserNotFound: (message)=>{
        newEmbed(message);
        embed.setColor("#A63232").setTitle("User not Found");
        send(message.channel)
    },
    InvalidUsage: (message)=>{
        newEmbed(message);
        embed.setTitle("Invalid Usage");
        embed.setDescription("Syntax: "+getCommandUsageFromMessage(message));
        embed.setColor("#A63232");
        send(message.channel);
    },
    InvalidParms: (message)=>{
        newEmbed(message);
        embed.setTitle("Invalid Parameters");
        embed.setDescription("Syntax: "+getCommandUsageFromMessage(message));
        embed.setColor("#A63232");
        send(message.channel);
    },
    Successfull: (message,Title,Description)=>{
        newEmbed(message);
        if(Title != null) embed.setTitle(Title);
        if(Description != null) embed.setDescription(Description);
        embed.setColor("4BB543");
        send(message.channel);
    },
    SomethingWentWrong: (message)=>{
        newEmbed(message);
        embed.setTitle("Something Went Wrong :/");
        embed.setColor("#A63232");
        send(message.channel);
    }
}
function getCommandUsageFromMessage(message){
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = message.client.commands.get(cmd); 
    if(!command) command = message.client.commands.get(client.aliases.get(cmd));
    return command.usage
}
function newEmbed(message){
    embed = new discord.MessageEmbed().setAuthor(message.member.displayName,message.author.displayAvatarURL({dynamic:true}))
    .setFooter(message.client.user.username,message.client.user.displayAvatarURL())
}
function send(channel){
    channel.send(embed);
}