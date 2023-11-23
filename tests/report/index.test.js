const { getMapFromTableData } = require('../../app/report/adapter')
const { MockData } = require('./data')
test('Test fn getMapFromTableData', () => {
	expect(getMapFromTableData(MockData.dataTable, MockData.fieldId, MockData.rows)).toEqual(MockData.result)
})
