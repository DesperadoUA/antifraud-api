const { getMapFromTableData, joinTables } = require('../../app/report/adapter')
const { MockData } = require('./data')
test('Test fn getMapFromTableData', () => {
	const mainDataTable = getMapFromTableData(MockData.dataTable, MockData.fieldId, MockData.rows)
	expect(mainDataTable).toEqual(MockData.result)
	expect(joinTables(mainDataTable, MockData.relatives)).toEqual(MockData.joinTableResult)
})
