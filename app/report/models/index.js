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
	static async insert(data, tableName) {
		try {
			await sheets.spreadsheets.values.append({
				spreadsheetId: SHEET_ID,
				range: tableName,
				insertDataOption: 'INSERT_ROWS',
				valueInputOption: 'RAW',
				requestBody: {
					values: data
				}
			})
			return 'ok'
		} catch (error) {
			console.log(error)
			return 'error'
		}
	}
	static async clear(tableName) {
		await sheets.spreadsheets.values.clear({
			spreadsheetId: SHEET_ID,
			range: tableName
		})
	}
	static async getAllTabs() {
		try {
			const result = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID })
			return result.data.sheets.map(table => table.properties.title)
		} catch (error) {
			console.log(error)
			return 'error'
		}
	}
	static async getNameColumnForTab(tabName) {
		try {
			const result = await sheets.spreadsheets.values.get({
				spreadsheetId: SHEET_ID,
				range: tabName
			})
			return result.data.values && result.data.values.length ? result.data.values[0] : []
		} catch (error) {
			console.log(error)
			return 'error'
		}
	}
}
module.exports = Model
