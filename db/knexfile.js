const credential = require('../cloudSecret.json')
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: 'mysql',
		connection: {
			host: credential.host,
			user: credential.user,
			password: credential.password,
			database: credential.database,
			migrations: {
				directory: __dirname + '/migrations'
			},
			seeds: {
				directory: __dirname + '/seeds'
			}
		}
	},
	staging: {},
	production: {}
}
