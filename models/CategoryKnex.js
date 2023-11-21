const knex = require('../db')
const RelativeModel = require('./RelativeKnex')
class CategoryModelKnex {
	#mainTable
	#defaultLimit
	#defaultOffset
	#orderBy
	#orderKey
	#defaultLang
	constructor(schema) {
		this.schema = schema
		this.#mainTable = schema.category.tableName
		this.#defaultLimit = 8
		this.#defaultOffset = 0
		this.#orderBy = 'created_at'
		this.#orderKey = 'DESC'
		this.#defaultLang = 1
	}
	async insert(data) {
		const insertId = await knex(this.#mainTable).insert(data)
		return insertId
	}
	async getPublicPosts(settings) {
		const { limit, offset, orderBy, orderKey, lang } = this.validateSettings(settings)
		return await knex(this.#mainTable)
			.select()
			.where({ lang: lang, status: 'public' })
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, orderKey)
	}
	async getPublicPostByUrl(url) {
		return await knex(this.#mainTable)
			.select()
			.where({
				permalink: url,
				status: 'public'
			})
			.first()
	}
	async getPosts(settings) {
		const limit = 'limit' in settings ? settings.limit : this.#defaultLimit
		const offset = 'offset' in settings ? settings.offset : this.#defaultOffset
		const orderBy = 'orderBy' in settings ? settings.orderBy : this.#orderBy
		const orderKey = 'orderKey' in settings ? settings.orderKey : this.#orderKey

		return await knex(this.#mainTable).select().offset(offset).limit(limit).orderBy(orderBy, orderKey)
	}
	async getPostById(id) {
		return await knex(this.#mainTable).select().where({ id: id }).first()
	}
	async updateById(id, data) {
		return await knex(this.#mainTable).where({ id: id }).update(data)
	}
	async getTotalCountByLang(lang) {
		const result = await knex(this.#mainTable).where({ lang: lang }).count('id')
		return result[0]['count(`id`)']
	}
	async getAllPostsByLang(lang) {
		const result = await knex(this.#mainTable).where({ lang: lang })
		return result
	}
	async searchByTitle(lang, str) {
		return await knex(this.#mainTable).select().where({ lang: lang }).whereILike('title', `%${str}%`)
	}
	async getPublicPostsByArrId(arr) {
		return await knex(this.#mainTable).select().where({ status: 'public' }).whereIn('id', arr)
	}
	async getPostsByArrId(arr) {
		return await knex(this.#mainTable).select().whereIn('id', arr)
	}
	validateSettings(settings) {
		return {
			limit: 'limit' in settings ? settings.limit : this.#defaultLimit,
			offset: 'offset' in settings ? settings.offset : this.#defaultOffset,
			orderBy: 'orderBy' in settings ? settings.orderBy : this.#orderBy,
			orderKey: 'orderKey' in settings ? settings.orderKey : this.#orderKey,
			lang: 'lang' in settings ? settings.lang : this.#defaultLang,
			exclude: 'exclude' in settings ? settings.exclude : []
		}
	}
}
module.exports = CategoryModelKnex
