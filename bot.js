'use strict';

const Discord = require('discord.js');
const fs = require('fs');
const { type } = require('os');
const BOT_TOKEN = `NzMwMDEyNjcxODUxNjI2NTQ3.XwRTgA.Jzk906lm3ybWKsQvsmd9Y19vWk4`;
const client = new Discord.Client();
const prefix = 'wdnf';

const accountsFileName = './accounts.json';

function getBalanceFile () {
    
    console.log("getBalanceFile");

    let accounts = fs.readFileSync(accountsFileName, 'utf8', (err, accounts) => {
        if (err) {
            console.log("File read failed:", err);
        }



        return (accounts);
    });

    return (JSON.parse(accounts));
}

function getBalance(user) {

    let balance = 0;

    const accounts = getBalanceFile();
    
    if(accounts.hasOwnProperty(user)) {
        balance = accounts[user][balance];
    } else {
        balance = 0;
    }


    return balance;

}

function register (user) {
    user = JSON.stringify(user).replace('<@!', '<@');
    return {
        [user]: {
            balance: 0,
            transactions: []
        }
    }
}

function pay (from, to, amount) {

    parseInt(amount);

    if(amount > 0) {

        let accounts = getBalanceFile();

        if(!(accounts.hasOwnProperty(from))) {

            const newuser = register(from);
            accounts.push(newuser);

        }

    
        if(!(accounts.hasOwnProperty(to))) {

            const newuser = register(to);
            accounts.push(newuser);
    
        }


        console.log(accounts);

        accounts[from][balance] = accounts[from][balance] - amount;
        accounts[to][balance] = accounts[to][balance] + amount;


    
        fs.writeFileSync(accountsFileName, JSON.stringify(accounts, null, 4), function writeJSON(err) {
          if (err) return console.log(err);
          console.log(JSON.stringify(accounts));
          console.log('writing to ' + accountsFileName);
        });
    
        return true;

    } else {
        console.log(typeof amount);
        console.log(amount);

        return false;
    }


}

client.once('ready', () => {
	console.log('Bot is ready!');
});
    
client.on('message', message => {
    // client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length + 1).split(' ');
// console.log(args);
    const command = args.shift().toLowerCase();

    if(command == 'pay') {
        const reciever = args[0].replace('<@!', '<@');
        const amount = args[1];
        const from = JSON.stringify(message.author.id).replace('<@!', '<@');

        if((getBalance(from) - amount) <= 0) {

            if(pay(message.author, args[0], args[1])) {

                message.channel.send(`${reciever} + ${amount} WDNF`);
    
            } else {
    
                message.channel.send(`An error occured, the transaction is invalid.`);
    
            }

        } else {

            message.channel.send(`Debt is not allowed, ${message.author}`);

        }


    } else if (command == 'bal') {

        const balance = getBalance(message.author);
        console.log(balance);
        message.channel.send(`${message.author}'s balance is ${balance}`);

    } else if (command == 'help') {

        message.channel.send(`WDNF - the Web Developers & Friends bot \n help / pay / bal / top`);

    } else if (command == 'top') {

        message.channel.send(`This will display the richest members.`);

    }

});

client.login(BOT_TOKEN);