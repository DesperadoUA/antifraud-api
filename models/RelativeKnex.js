const knex = require('../db')
class RelativeModelKnex {
	constructor(schema) {
		this.schema = schema
	}
	async getRelativeByPostId(id, relativeType) {
		const table = this.schema.relatives[relativeType].tableName
		const result = await knex(table).select().where({ post_id: id })
		return result.length ? result.map(item => item.relative_id) : []
	}
	async getPostIdByRelative(id, relativeType) {
		const table = this.schema.relatives[relativeType].tableName
		const result = await knex(table).select().where({ relative_id: id })
		return result.length ? result.map(item => item.post_id) : []
	}
	async insert(data, relativeType) {
		if (data.length) {
			const table = this.schema.relatives[relativeType].tableName
			await this.delete(data[0].post_id, relativeType)
			await knex(table).insert(data)
		}
	}
	async delete(id, relativeType) {
		const table = this.schema.relatives[relativeType].tableName
		await knex(table).where({ post_id: id }).del()
	}
}
module.exports = RelativeModelKnex
