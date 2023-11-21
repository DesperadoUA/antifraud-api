const { Router } = require('express')
const router = Router()
const Service = require('./service')
const DateTime = require('../../helpers/dateTime')
router.post('/tournament/visit', async (req, res) => {
	const result = await Service.insertVisit({
		userID: String(req.body.id),
		date: DateTime.currentDate()
	})
	res.status(200).json({ status: result })
})
router.post('/tournament/click', async (req, res) => {
	const result = await Service.insertAction({
		userID: String(req.body.id),
		date: DateTime.currentDate()
	})
	res.status(200).json({ status: result })
})
/*
router.get('/tournament/test', async (req, res) => {
	const result = await Service.insertAction({
		userID: 'testId2',
		date: DateTime.currentDate()
	})
	res.status(200).json({ status: result })
})
*/
router.get('/tournament', async (req, res) => {
	const result = await Service.index()
	res.status(200).json(result)
})
module.exports = router
