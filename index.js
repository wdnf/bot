const discord = require("discord.js");
const client = new discord.Client();

const fs = require("fs");
const Database = require('better-sqlite3');

const currency = require("./util/currency.js");
const embed = require("./util/embed.js");

const config = require("./config.json");
const prefix = config.prefix;

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

let cooldowns = new discord.Collection();
client.ttt = new discord.Collection();

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(client.user.tag + " is ready! Bot Prefix: " + prefix);
  let db = new Database("./wdnf.db");
  db.prepare("CREATE TABLE IF NOT EXISTS ledger(userid TEXT NOT NULL, amount INTEGER NOT NULL)").run();
  db.close();
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if(!command) return embed.CustomError(message,"Aghh","Command not found");
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const duration = expirationTime - now;
      let seconds = Math.floor((duration / 1000) % 60);
      let minutes = Math.floor((duration / (1000 * 60)) % 60);
      let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      let waitMessage = "You can not use this command for another ";
      if (hours > 1) waitMessage += hours + " hours, ";
      else if (hours == 1) waitMessage += hours + " hour,";
      if (minutes > 1) waitMessage += minutes + " minutes, ";
      else if (minutes == 1) waitMessage += minutes + " minute,";
      if (seconds > 1) waitMessage += seconds + " seconds";
      else if (seconds < 2) waitMessage += seconds + " second";
      return embed.CustomError(message, null, waitMessage);
    }
  }
  timestamps.set(message.author.id, now);
  if(command.admin == true){
    if(!message.member.hasPermission("ADMINISTRATOR")){
      return embed.CustomError(message,"Permission Error","Insufficient Permissions")
    }
  }
  if (command) {
    if (args[0] === "?") {
      const usage = command.usage;
      const description = command.description;
      return embed.CustomEmbed(
        message,
        "Syntax: " + usage,
        description,
        "RANDOM"
      );
    } else {
      command.run(client, message, args);
    }
  }
});

function saveConfigFile() {
  fs.writeFile("./config", JSON.stringify(config), err => {
    if (err) console.log(err);
  });
}
//Command Handler
client.commands = new discord.Collection();
client.aliases = new discord.Collection();

["command"].forEach(handler => {
  require(`./handler/${handler}`)(client);
});
