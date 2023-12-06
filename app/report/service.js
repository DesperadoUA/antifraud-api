const Model = require('./models')
const { getMapFromTableData, joinTables, filterTableData } = require('./adapter')
class Service {
	static async index(schema) {
		const dataTable = await Model.getAllByTableName(schema.main.tableName)
		const dataMainTable = getMapFromTableData(dataTable, schema.main.fieldId, schema.main.rows)
		const relativeTables = {}
		for await (const table of schema.relatives) {
			const data = await Model.getAllByTableName(table.tableName)
			const dataTable = getMapFromTableData(data, table.fieldId, table.rows)
			relativeTables[table.tableName] = dataTable
		}
		const joinTableData = joinTables(dataMainTable, relativeTables)
		if (dataTable !== 'error') {
			const relativeNameRow = []
			schema.relatives.forEach(item => relativeNameRow.push(...item.rows))
			const result = [[schema.main.fieldId, ...schema.main.rows, ...relativeNameRow]]
			await Model.clear(schema.total.tableName)
			await Model.insert(result.concat(joinTableData), schema.total.tableName)
			return { status: 'ok' }
		} else return
	}
	static async getAllTabs() {
		const response = { confirm: 'error', body: {} }
		const result = await Model.getAllTabs()
		if (result !== 'error') {
			response.confirm = 'ok'
			response.body = result
			return response
		}
		return response
	}
	static async getNameColumnForTab(tabName) {
		const response = { confirm: 'error', body: {} }
		const result = await Model.getNameColumnForTab(tabName)
		if (result !== 'error') {
			response.confirm = 'ok'
			response.body = result
			return response
		}
		return response
	}
	static async result(schema) {
		const dataTable = await Model.getAllByTableName(schema.main.tableName)
		const dataMainTable = getMapFromTableData(dataTable, schema.main.fieldId, schema.main.rows)
		const relativeTables = {}
		for await (const table of schema.relatives) {
			const data = await Model.getAllByTableName(table.tableName)
			const dataTable = getMapFromTableData(data, table.fieldId, table.rows)
			relativeTables[table.tableName] = dataTable
		}
		const joinTableData = joinTables(dataMainTable, relativeTables)
		if (dataTable !== 'error') {
			const relativeNameRow = []
			schema.relatives.forEach(item => relativeNameRow.push(...item.rows))
			const result = [[schema.main.fieldId, ...schema.main.rows, ...relativeNameRow]]
			return { status: 'ok', body: result.concat(joinTableData) }
		} else return
	}
	static async myths(schema) {
		const dataTable = await Model.getAllByTableName(schema.main.tableName)
		const dataMainTable = getMapFromTableData(dataTable, schema.main.fieldId, schema.main.rows)
		const filterData = filterTableData(dataMainTable, schema.main.equal.rows, schema.main.equal.numberCharacters)
		const result = [[schema.main.fieldId, ...schema.main.rows]]
		await Model.clear(schema.total.tableName)
		await Model.insert(result.concat(filterData), schema.total.tableName)
		return {
			status: 'ok'
		}
	}
	static async test() {
		return {}
	}
	static async multiplayer(tabName, resultTable, column) {
		const result = []
		const multipleResult = new Set()
		const setData = new Set()
		const [columnsName, ...dataTable] = await Model.getAllByTableName(tabName)
		const columnPosition = columnsName.indexOf(column)
		dataTable.forEach(row => {
			if (setData.has(row[columnPosition])) {
				if (!multipleResult.has(row[columnPosition])) result.push([row[columnPosition]])
				multipleResult.add(row[columnPosition])
			} else setData.add(row[columnPosition])
		})
		await Model.insert(result, resultTable)
		return { status: 'ok', body: 'multiplayer' }
	}
}
module.exports = Service
