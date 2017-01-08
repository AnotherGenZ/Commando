const { Command } = require('discord.js-commando');

const Currency = require('../../currency/Currency');

module.exports = class MoneyInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'money',
			aliases: ['donut', 'donuts', 'doughnut', 'doughnuts'],
			group: 'economy',
			memberName: 'money',
			description: 'Displays the money you have earned.',
			details: 'Display the amount of money you have earned.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: 'which user\'s earnings would you like to view?\n',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const user = args.member || msg.author;

		const balance = await Currency.getBalance(user.id);

		if (args.member) {
			if (!balance) return msg.reply(`${user.displayName} hasn't earned any 🍩s yet.`);

			return msg.reply(`${user.displayName} has earned ${balance} 🍩s so far. Good on them!`);
		} else {
			if (!balance) return msg.reply('you haven\'t earned any 🍩s yet.');

			return msg.reply(`you have earned ${balance} 🍩s so far. Good on you!`);
		}
	}
};
