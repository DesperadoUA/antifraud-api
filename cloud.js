const { Client } = require('@elastic/elasticsearch')
const elasticSecret = require('./elasticSecret.json')
const elasticClient = new Client({
	cloud: {
		id: elasticSecret.cloudId
	},
	auth: {
		username: elasticSecret.username,
		password: elasticSecret.password
	}
})

async function run() {
	const data = [
		{ id: 1, name: 'Konstantin' },
		{ id: 2, name: 'Denchick' },
		{ id: 3, name: 'Nikolay' },
		{ id: 4, name: 'Andrey' },
		{ id: 5, name: 'Kanstantin' }
	]
	//await elasticClient.indices.delete({ index: 'demo' })
	/*
	const result = await elasticClient.helpers.bulk({
		datasource: data,
		onDocument(doc) {
			return {
				index: { _index: 'demo' }
			}
		}
	})
*/
	const response = await elasticClient.search({ index: 'demo' })
	/*const response = await elasticClient.search({
		index: 'demo',
		body: {
			query: {
				match: {
					name: {
						query: 'onstntin',
						fuzziness: 2,
						operator: 'and'
					}
				}
			}
		}
	})*/
	console.log(response.hits.hits)
}
run().catch(err => {
	console.log(err)
	process.exit(1)
})
