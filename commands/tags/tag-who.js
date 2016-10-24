/* eslint-disable no-console */
const { Command } = require('discord.js-commando');
const TagModel = require('../../mongoDB/models/tagModel.js');
const stripIndents = require('common-tags').stripIndents;
const moment = require('moment');

module.exports = class TagWhoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-who',
			group: 'tags',
			memberName: 'tag-who',
			description: 'Displays information about a Tag.',
			format: '<tagname>',
			examples: ['tag-who cat', 'tag-who test'],
			guildOnly: true,

			args: [
				{
					key: 'name',
					label: 'tagname',
					prompt: 'What Tag would you like to have information on?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const name = args.name.toLowerCase();
		return TagModel.get(name, msg.guild.id).then(tag => {
			if (!tag) return msg.say(`A tag with the name **${name}** doesn't exist, ${msg.author}`);
			return msg.say(stripIndents`❯ Info on Tag: **${tag.name}**

											 • Username: ${tag.userName} (ID: ${tag.userID})
											 • Guild: ${tag.guildName}
											 • Channel: <#${tag.channelID}>
											 • Created at: ${moment.utc(tag.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}
											 • Uses: ${tag.uses}`);
		}).catch(error => console.log(error));
	}
};