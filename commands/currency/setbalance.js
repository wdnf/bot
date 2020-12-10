const discord = require('discord.js');
const currency = require('../../util/currency.js');
const embed = require('../../util/embed.js');

module.exports = {
	name: 'setbalance',
	aliases: [ 'setbal' ],
	usage: 'setbalance <user> <amount> or setbalance <amount>',
	category: 'economy',
	admin: true,
	description: 'Sets balance.',
	run: async (client, message, args) => {
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (member) {
			let userID = member.user.id;
			let mamount = parseInt(args[1]);
			if (mamount == NaN || mamount == null) return message.reply('Please enter a valid intenger');
			currency.setBalance(userID, mamount).then((resolve, error) => {
				bal = resolve;
				if (bal) {
					embed.Successfull(
						message,
						'Balance Change',
						'Succesfully set '+member.displayName+"'s balance to **" + mamount + " WDNF**"
					);
				} else {
					return embed.CustomError(message, 'Balance Change Error', 'Error occured');
				}
			});
			return;
		}
		if (!args) return message.reply('Specify amount');
		let userID = message.author.id;
		let amount = parseInt(args[0]);
		if (amount == NaN) return message.reply('Please enter a valid intenger');
		currency.setBalance(userID, amount).then((resolve, error) => {
			bal = resolve;
			if (bal) {
				embed.Successfull(
					message,
					'Balance Change',
					'Succesfully set your ballance to **' + amount + ' WDNF**'
				);
			} else {
				return embed.CustomError(message, 'Balance Change Error', 'Error occured');
			}
		});
	}
};
