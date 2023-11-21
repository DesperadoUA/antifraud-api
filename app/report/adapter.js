function getMapFromTableData(dataTable, fieldId, rows) {
	const data = new Map()
	const tableRow = dataTable.shift()
	const indexFieldId = tableRow.indexOf(fieldId)
	const indexRow = {}
	rows.forEach(row => (indexRow[row] = tableRow.indexOf(row)))
	dataTable.forEach(item => {
		const body = {}
		Object.keys(indexRow).forEach(row => {
			body[row] = item[indexRow[row]]
		})
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
module.exports = {
	getMapFromTableData,
	joinTables
}
