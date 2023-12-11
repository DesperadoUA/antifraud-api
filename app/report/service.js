const Model = require('./models')
const ElasticModel = require('./models/elasticModel')
const { getMapFromTableData, joinTables, filterTableData, getArrObjects } = require('./adapter')
const { Client } = require('@elastic/elasticsearch')
const elasticSecret = require('./../../elasticSecret.json')
const elasticClient = new Client({
	cloud: {
		id: elasticSecret.cloudId
	},
	auth: {
		username: elasticSecret.username,
		password: elasticSecret.password
	}
})
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
	static async elastic(tabName, indexName, totalTab) {
		console.log('Start elastic service')
		const filterResult = []
		const dataTable = await Model.getAllByTableName(tabName)
		const dataList = getArrObjects(dataTable)
			.map(item => {
				const [str] = item.UserName.split('@')
				return { ...item, UserName: str }
			})
			.map(item => {
				return { ...item, UserName: item.UserName.replace(/[^a-z]/g, '') }
			})
		for await (const rowData of dataList) {
			const body = {
				query: {
					match: {
						UserName: {
							query: rowData.UserName,
							fuzziness: 2,
							operator: 'and'
						}
					}
				}
			}
			const response = await ElasticModel.search(body, indexName)
			if (response.status === 'ok') {
				if (response.body.hits.hits.length > 1) {
					const row = [rowData.PlayerId, rowData.Email]
					response.body.hits.hits.forEach(item => {
						if (parseInt(item._source.TotalDepositCount) && rowData.PlayerId !== item._source.PlayerId) {
							row.push(item._source.PlayerId)
							row.push(item._source.Email)
						}
					})
					if (row.length > 2) filterResult.push(row)
				}
			}
		}
		await Model.insert(filterResult, totalTab)
		console.log('Finish elastic service')
		return { status: 'ok', body: 'elastic' }
	}
	static async elasticClearIndex(index) {
		const result = await ElasticModel.clear(index)
		return { status: result.status, body: 'elasticClear' }
	}
	static async elasticBulkIndex(tableName, indexName) {
		const dataTable = await Model.getAllByTableName(tableName)
		const dataList = getArrObjects(dataTable)
			.map(item => {
				const [str] = item.UserName.split('@')
				return { ...item, UserName: str }
			})
			.map(item => {
				return { ...item, UserName: item.UserName.replace(/[^a-z]/g, '') }
			})
		const result = await ElasticModel.insert(dataList, indexName)
		return { status: result.status, body: 'elasticBulk' }
	}
}
module.exports = Service
