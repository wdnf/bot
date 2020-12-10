const discord = require('discord.js');
const currency = require('../../util/currency.js');
const embed = require('../../util/embed.js');

module.exports = {
	name: '',
	aliases: [ 'jsc', 'js' ],
	usage: 'jscode <code>',
	category: 'development',
	description: 'idk',
	run: (client, message, args) => {
		let clientMember = message.guild.members.cache.get(client.user.id);
		msg = args.join(' ');
		msg.replace(/```+/g, "'''");
        message.delete();
        clientMember.setNickname(message.member.displayName);
		message.channel.send('```js\n' + msg + '```');
		clientMember.setNickname('');
	}
};
