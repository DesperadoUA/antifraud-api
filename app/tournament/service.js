const Model = require('./models')
class Service {
	static async insertVisit(data) {
		const result = await Model.insertVisit(data)
		return { status: result }
	}
	static async insertAction(data) {
		const result = await Model.insertAction(data)
		return { status: result }
	}
	static async index() {
		const result = await Model.getAllByTableName('Visits')
		if (result !== 'error') return { status: 'ok', body: result }
		else return { status: 'error' }
	}
}
module.exports = Service
