const { Command } = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;

module.exports = class SaveQueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'save',
			aliases: ['save-songs', 'save-song-list'],
			group: 'music',
			memberName: 'save',
			description: 'Saves the queued songs.',
			guildOnly: true
		});
	}

	async run(msg) {
		const queue = this.queue.get(msg.guild.id);
		if (!queue) return msg.reply('There isn\'t any music playing right now. You should get on that.');
		const song = queue.songs[0];

		msg.reply('✔ Check your inbox!');
		let saveMessage = {
			color: 3447003,
			author: {
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				icon_url: msg.author.avatarURL ? msg.author.avatarURL : this.client.user.avatarURL // eslint-disable-line camelcase
			},
			description: stripIndents`
				**Currently playing:**
				[${song}](${song.url.match(/^https?:\/\/(api.soundcloud.com)\/(.*)$/) ? '' : song.url})
				${song.url.match(/^https?:\/\/(api.soundcloud.com)\/(.*)$/) ? 'A SoundCloud song is currently playing.' : ''}\n\u200B
			`,
			image: { url: song.thumbnail },
			timestamp: new Date(),
			footer: {
				icon_url: this.client.user.avatarURL, // eslint-disable-line camelcase
				text: 'Info request'
			}
		};

		return msg.author.sendMessage('', { embed: saveMessage });
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
};
