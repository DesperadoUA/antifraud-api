const knex = require('../db')
const CategoryModel = require('./CategoryKnex')
const RelativeModel = require('./RelativeKnex')
class PostsModelKnex {
	#mainTable
	#metaTable
	#defaultLimit
	#defaultOffset
	#orderBy
	#orderKey
	#defaultLang
	#relatives
	#relativeModel
	constructor(schema) {
		this.schema = schema
		this.#mainTable = schema.tableName
		this.#metaTable = schema.metaFields.tableName
		this.#defaultLimit = 8
		this.#defaultOffset = 0
		this.#orderBy = schema.orderBy
		this.#orderKey = 'DESC'
		this.#defaultLang = 1
		this.#relatives = Object.keys(this.schema.relatives)
		this.#relativeModel = new RelativeModel(schema)
	}
	async getPublicPosts(settings) {
		const { limit, offset, orderBy, orderKey, lang } = this.validateSettings(settings)
		const data = await knex(this.#mainTable)
			.select()
			.where({ lang: lang, status: 'public' })
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, orderKey)
		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getPublicRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async getPublicPostsWithOutIds(settings) {
		const { limit, offset, orderBy, orderKey, lang, exclude } = this.validateSettings(settings)
		const data = await knex(this.#mainTable)
			.select()
			.where({ lang: lang, status: 'public' })
			.whereNotIn('id', exclude)
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, orderKey)

		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async getPublicPostByUrl(url) {
		let data = await knex(this.#mainTable)
			.select()
			.where({
				[`${this.#mainTable + '.permalink'}`]: url,
				status: 'public'
			})
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.first()
		if (data) {
			const relative = await this.getPublicRelativesById(data.id)
			data = { ...data, ...relative }
			return data
		} else return
	}
	async insert(commonData, metaData) {
		const insertId = await knex(this.#mainTable).insert(commonData)
		await knex(this.#metaTable).insert({ post_id: insertId, ...metaData })
		return insertId
	}
	async getTotalCountPublicByLang(lang) {
		const result = await knex(this.#mainTable).where({ lang: lang, status: 'public' }).count('id')
		return result[0]['count(`id`)']
	}
	async getPostById(id) {
		let data = await knex(this.#mainTable)
			.select()
			.where({ [`${this.#mainTable + '.id'}`]: id })
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.first()
		if (data) {
			const relative = await this.getRelativesById(id)
			data = { ...data, ...relative }
			return data
		} else return
	}
	async updateById(id, data) {
		return await knex(this.#mainTable).where({ id: id }).update(data)
	}
	async getByPermalink(url) {
		let data = await knex(this.#mainTable)
			.select()
			.where({
				[`${this.#mainTable + '.permalink'}`]: url
			})
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.first()
		if (data) {
			const relative = await this.getRelativesById(data.id)
			data = { ...data, ...relative }
			return data
		} else return
	}
	async getPosts(settings) {
		const { limit, offset, orderBy, orderKey, lang } = this.validateSettings(settings)
		let data = await knex(this.#mainTable)
			.select()
			.where({ lang: lang })
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, orderKey)
		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async getTotalCountByLang(lang) {
		const result = await knex(this.#mainTable).where({ lang: lang }).count('id')
		return result[0]['count(`id`)']
	}
	async updateMetaById(id, data) {
		return await knex(this.#metaTable).where({ post_id: id }).update(data)
	}
	async searchByTitle(lang, str) {
		const data = await knex(this.#mainTable)
			.select()
			.where({ lang: lang })
			.whereILike('title', `%${str}%`)
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async searchPublicByTitle(lang, str) {
		const data = await knex(this.#mainTable)
			.select()
			.where({ lang: lang, status: 'public' })
			.whereILike('title', `%${str}%`)
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async getPublicPostsByArrId(arr) {
		const data = await knex(this.#mainTable)
			.select()
			.where({ status: 'public' })
			.whereIn('id', arr)
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.orderBy(this.#orderBy, this.#orderKey)
		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getPublicRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async getPostsByArrId(arr) {
		const data = await knex(this.#mainTable)
			.select()
			.whereIn('id', arr)
			.join(this.#metaTable, `${this.#mainTable}.id`, '=', `${this.#metaTable}.post_id`)
			.orderBy(this.#orderBy, this.#orderKey)
		if (data) {
			for (const [index, post] of data.entries()) {
				const relative = await this.getRelativesById(post.id)
				data[index] = { ...data[index], ...relative }
			}
			return data
		} else return []
	}
	async deleteById(id) {
		return await knex(this.#mainTable).where({ id: id }).del()
	}
	async getRelativesById(id) {
		const data = {}
		const objRelatives = {}
		for await (const relative of this.#relatives) {
			objRelatives[relative] = await this.#relativeModel.getRelativeByPostId(id, relative)
		}
		for await (const key of Object.keys(objRelatives)) {
			const relativeSchema = require(`./../schemas/${this.schema.relatives[key].relativeSchema}`)
			const model = key === 'category' ? new CategoryModel(relativeSchema) : new PostsModelKnex(relativeSchema)
			data[key] = await model.getPostsByArrId(objRelatives[key])
		}
		return data
	}
	async getPublicRelativesById(id) {
		const data = {}
		const objRelatives = {}
		for await (const relative of this.#relatives) {
			objRelatives[relative] = await this.#relativeModel.getRelativeByPostId(id, relative)
		}
		for await (const key of Object.keys(objRelatives)) {
			const relativeSchema = require(`./../schemas/${this.schema.relatives[key].relativeSchema}`)
			const model = key === 'category' ? new CategoryModel(relativeSchema) : new PostsModelKnex(relativeSchema)
			data[key] = await model.getPublicPostsByArrId(objRelatives[key])
		}
		return data
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
module.exports = PostsModelKnex
