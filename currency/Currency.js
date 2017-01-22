const Redis = require('../redis/Redis');
const UserProfile = require('../postgreSQL/models/UserProfile');

const redis = new Redis();

setInterval(() => Currency.leaderboard(), 30 * 60 * 1000);

redis.db.hgetAsync('money', 'bank').then(balance => {
	if (!balance) redis.db.hsetAsync('money', 'bank', 5000);
});

class Currency {
	static _changeBalance(user, amount) {
		redis.db.hgetAsync('money', user).then(balance => {
			balance = parseInt(balance) || 0;
			redis.db.hsetAsync('money', user, amount + parseInt(balance));
		});
	}

	static changeBalance(user, amount) {
		Currency._changeBalance(user, amount);
		Currency._changeBalance('bank', -amount);
	}

	static addBalance(user, amount) {
		Currency.changeBalance(user, amount);
	}

	static removeBalance(user, amount) {
		Currency.changeBalance(user, -amount);
	}

	static async getBalance(user) {
		const money = await redis.db.hgetAsync('money', user) || 0;

		return money;
	}

	static leaderboard() {
		redis.db.hgetallAsync('money').then(balances => {
			const ids = Object.keys(balances || {});

			for (const id of ids) {
				UserProfile.findOne({ where: { userID: id } }).then(user => {
					if (!user) {
						UserProfile.create({
							userID: id,
							money: balances[id]
						});
					} else {
						user.update({ money: balances[id] });
					}
				});
			}
		});

		redis.db.setAsync('moneyleaderboardreset', Date.now());
		redis.db.expire('moneyleaderboardreset', 30 * 60 * 1000);
	}

	static convert(amount, text = false) {
		if (!text) return `${amount} ${Math.abs(amount) === 1 ? Currency.singular : Currency.plural}`;

		return `${amount} ${Math.abs(amount) === 1 ? Currency.textSingular : Currency.textPlural}`;
	}

	static get singular() {
		return '🍩';
	}

	static get plural() {
		return '🍩s';
	}

	static get textSingular() {
		return 'donut';
	}

	static get textPlural() {
		return 'donuts';
	}
}

module.exports = Currency;
