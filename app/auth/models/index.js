const knex = require('./../../../db')
class Model {
	static async checkLogin(login, password) {
		const response = {
			data: {},
			confirm: 'ok'
		}
		try {
			response.data = await knex('users').select().where({ name: login, password: password }).first()
			return response
		} catch (error) {
			console.log(error)
			response.confirm = 'error'
			return response
		}
	}
	static async setToken(id, token) {
		const response = {
			data: [],
			confirm: 'ok'
		}
		try {
			await knex('users').where({ id: id }).update({ remember_token: token })
			return response
		} catch (error) {
			console.log(error)
			response.confirm = 'error'
			return response
		}
	}
	static async checkSession(id, session) {
		const response = {
			data: {},
			confirm: 'ok'
		}
		try {
			response.data = await knex('users').select().where({ id: id, remember_token: session }).first()
			return response
		} catch (error) {
			console.log(error)
			response.confirm = 'error'
			return response
		}
	}
}
module.exports = Model
