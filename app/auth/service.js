const CardBuilder = require('./CardBuilder')
const UsersModel = require('./models')
const crypto = require('crypto')
class Service {
	static async login(login, password) {
		const response = {
			confirm: 'error',
			body: {}
		}
		const err = []
		const candidate = await UsersModel.checkLogin(login, password)
		if (candidate.data && candidate.confirm === 'ok') {
			err.push(candidate.confirm)
			const token = crypto.randomBytes(16).toString('hex')
			const setToken = await UsersModel.setToken(candidate.data.id, token)
			err.push(setToken.confirm)
			candidate.data.remember_token = token
			response.body = CardBuilder.user(candidate.data)
			response.confirm = err.includes('error') ? 'error' : 'ok'
		}
		return response
	}
	static async logout(id, session) {
		const response = {
			confirm: 'error',
			body: {}
		}
		const err = []
		const candidate = await UsersModel.checkSession(id, session)
		if (candidate.data && candidate.confirm === 'ok') {
			err.push(candidate.confirm)
			const setToken = await UsersModel.setToken(candidate.data.id, '')
			err.push(setToken.confirm)
			response.confirm = err.includes('error') ? 'error' : 'ok'
		}
		return response
	}
	static async checkUser(id, session) {
		const response = {
			confirm: 'error',
			body: {}
		}
		const candidate = await UsersModel.checkSession(id, session)
		if (candidate.data && candidate.confirm === 'ok') response.confirm = 'ok'
		return response
	}
}
module.exports = Service
