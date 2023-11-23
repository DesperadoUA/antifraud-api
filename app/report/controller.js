const { Router } = require('express')
const router = Router()
const Service = require('./service')
router.get('/report', async (req, res) => {
	const schema = {
		main: {
			tableName: 'Sheet14',
			rows: ['Reg.Date', 'Btag', 'Status'],
			fieldId: 'Id'
		},
		relatives: [
			{
				tableName: 'Sheet4',
				rows: ['BetAmount', 'BetCount'],
				fieldId: 'PlayerId'
			},
			{
				tableName: 'Sheet3',
				rows: ['TotalDepositCount', 'TotalDepositAmount'],
				fieldId: 'PlayerId'
			},
			{
				tableName: 'Sheet2',
				rows: ['CountMulti'],
				fieldId: 'ClientId'
			}
		],
		total: {
			tableName: 'total'
		}
	}
	const response = await Service.index(schema)
	if (response) res.status(200).json({ status: 'ok', body: response })
	else res.status(404).json({ status: 'error' })
})
router.post('/admin/report/all-tabs', async (req, res) => {
	const response = await Service.getAllTabs()
	if (response.confirm === 'ok') res.status(200).json({ status: 'ok', body: response.body })
	else res.status(404).json({ status: 'error' })
})
router.post('/admin/report/tab-column', async (req, res) => {
	const { tabName } = req.body
	const response = await Service.getNameColumnForTab(tabName)
	if (response.confirm === 'ok') res.status(200).json({ status: 'ok', body: response.body })
	else res.status(404).json({ status: 'error' })
})
router.post('/admin/report/result', async (req, res) => {
	const { schema } = req.body
	const response = await Service.result(schema)
	if (response) res.status(200).json(response)
	else res.status(404).json({ status: 'error' })
})
router.get('/test', async (req, res) => {
	const response = await Service.test()
	res.status(200).json(response)
})
module.exports = router
