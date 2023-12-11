const { Client } = require('@elastic/elasticsearch')
const elasticSecret = require('../../../elasticSecret.json')
const elasticClient = new Client({
	cloud: {
		id: elasticSecret.cloudId
	},
	auth: {
		username: elasticSecret.username,
		password: elasticSecret.password
	}
})
class ElasticModel {
	static async insert(data, tableName) {
		try {
			await elasticClient.helpers.bulk({
				datasource: data,
				onDocument(doc) {
					return {
						index: { _index: tableName }
					}
				}
			})
			return { status: 'ok', body: '' }
		} catch (error) {
			console.log(error)
			return { status: 'error', body: '' }
		}
	}
	static async search(body, tableName) {
		try {
			const response = await elasticClient.search({ index: tableName, body })
			return { status: 'ok', body: response }
		} catch (error) {
			return { status: 'error', body: '' }
		}
	}
	static async clear(tableName) {
		try {
			await elasticClient.indices.delete({ index: tableName })
			return { status: 'ok', body: '' }
		} catch (error) {
			return { status: 'error', body: '' }
		}
	}
}
module.exports = ElasticModel
