function getMapFromTableData(dataTable, fieldId, rows) {
	const data = new Map()
	const tableRow = dataTable.shift()
	const indexFieldId = tableRow.indexOf(fieldId)
	const indexRow = {}
	rows.forEach(row => (indexRow[row] = tableRow.indexOf(row)))
	const keys = Object.keys(indexRow)
	dataTable.forEach(item => {
		const body = {}
		keys.forEach(row => (body[row] = item[indexRow[row]]))
		data.set(item[indexFieldId], body)
	})
	return data
}
function joinTables(main, relatives) {
	const result = []
	const ids = Array.from(main.keys())
	const lengthRelativeColumn = {}
	for (key in relatives) {
		const [firstKey] = relatives[key].keys()
		lengthRelativeColumn[key] = Object.values(relatives[key].get(firstKey)).length
	}
	ids.forEach(idMainTable => {
		const rowData = []
		rowData.push(idMainTable)
		rowData.push(...Object.values(main.get(idMainTable)))
		for (key in relatives) {
			if (relatives[key].has(idMainTable)) {
				rowData.push(...Object.values(relatives[key].get(idMainTable)))
			} else {
				const arr = []
				arr[lengthRelativeColumn[key] - 1] = 'NULL'
				arr.fill('NULL', 0, lengthRelativeColumn[key])
				rowData.push(...arr)
			}
		}
		result.push(rowData)
	})
	return result
}
function filterTableData(dataTable, equalRows, numberCharacters) {
	const [firstColumn, secondColumn] = equalRows
	const result = []
	for (let [key, value] of dataTable) {
		const value1 = value[firstColumn] ? value[firstColumn].trim().substring(0, numberCharacters) : ''
		const value2 = value[secondColumn] ? value[secondColumn].trim().substring(0, numberCharacters) : ''
		value[firstColumn] = value1
		value[secondColumn] = value2
		if (value1 !== '' && value2 !== '') {
			if (value1 === value2) result.push([key, ...Object.values(value)])
		}
	}
	return result
}
module.exports = {
	getMapFromTableData,
	joinTables,
	filterTableData
}
