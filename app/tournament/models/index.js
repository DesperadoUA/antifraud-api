const { SHEET_ID } = require('./config.js')
const { sheets } = require('../../../config/googleTableClient.js')
class Model {
	constructor() {
		schemas = {
			Visits: {
				userId: ['unique'],
				date: ['string']
			},
			Action: {
				userId: ['unique'],
				date: ['string']
			}
		}
	}
	static async insertVisit(data) {
		try {
			const posts = await Model.getAllByTableName('Visits')
			const candidate = posts.filter(item => item.includes(data.userID))
			if (!candidate.length) {
				await sheets.spreadsheets.values.append({
					spreadsheetId: SHEET_ID,
					range: 'Visits',
					insertDataOption: 'INSERT_ROWS',
					valueInputOption: 'RAW',
					requestBody: {
						values: [[data.userID, data.date]]
					}
				})
			}
			return 'ok'
		} catch (error) {
			console.log(error)
			return 'error'
		}
	}
	static async insertAction(data) {
		try {
			const posts = await Model.getAllByTableName('Action')
			const candidate = posts.filter(item => item.includes(data.userID))
			if (!candidate.length) {
				await sheets.spreadsheets.values.append({
					spreadsheetId: SHEET_ID,
					range: 'Action',
					insertDataOption: 'INSERT_ROWS',
					valueInputOption: 'RAW',
					requestBody: {
						values: [[data.userID, data.date]]
					}
				})
			}
			return 'ok'
		} catch (error) {
			console.log(error)
			return 'error'
		}
	}
	static async getAllByTableName(tableName) {
		try {
			const result = await sheets.spreadsheets.values.get({
				spreadsheetId: SHEET_ID,
				range: tableName
			})
			return result.data.values
		} catch (error) {
			console.log(error)
			return 'error'
		}
	}
}
module.exports = Model
