const { Command } = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;

const Song = require('../../Song');

module.exports = class MusicStatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'status',
			aliases: ['song', 'playing', 'current-song', 'now-playing'],
			group: 'music',
			memberName: 'status',
			description: 'Shows the current status of the music.',
			guildOnly: true
		});
	}

	async run(msg) {
		const queue = this.queue.get(msg.guild.id);
		if (!queue) return msg.say('There isn\'t any music playing right now. You should get on that.');
		const song = queue.songs[0];
		const currentTime = song.dispatcher ? song.dispatcher.time / 1000 : 0;

		const currentSong = {
			color: 3447003,
			author: {
				name: `${song.username}`,
				icon_url: `${song.avatar}` // eslint-disable-line camelcase
			},
			description: stripIndents`🎵 ${song}
				We are ${Song.timeString(currentTime)} into the song, and have ${song.timeLeft(currentTime)} left.
				${!song.playing ? 'The music is paused.' : ''}
			`,
			timestamp: new Date(),
			footer: {
				icon_url: this.client.user.avatarURL, // eslint-disable-line camelcase
				text: 'Currently playing'
			}
		};
		return msg.channel.sendMessage('', { embed: currentSong });
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
};
