const dataTable = [
	['Aff.ID', 'Btag', 'Id', 'Username', 'Country', 'Reg.Date', 'Status'],
	[
		'50636312',
		'50636312_299516-654f900d8d67a400017a4237',
		'8922222',
		'kaushalmishra4847@gmail.com',
		'India',
		'11/11/2023',
		''
	],
	[
		'50636312',
		'50636312_283441-6544b71f8d67a40001fcf897',
		'8841640',
		'dd3031990@gmail.com',
		'India',
		'11/3/2023',
		'active'
	],
	[
		'50636312',
		'50636312_299516-6552511ae79eb00001deaf39',
		'8946964',
		'durgarao9490@gmail.com',
		'India',
		'11/13/2023',
		''
	],
	[
		'50636312',
		'50636312_289355-65471309067ca00001d8d352',
		'8858789',
		'singhjoginder0738@gmail.com',
		'India',
		'05/13/2023',
		''
	],
	[
		'50636312',
		'50636312_283441-65377aa645798700011fd372',
		'8737725',
		'arunasalam00081@gmail.com',
		'India',
		'10/24/2023',
		'hide'
	],
	[
		'50636312',
		'50636312_289355-6544f7cb2aba9c00014eeb79',
		'8843453',
		'saurabhrane904@gmail.com',
		'India',
		'03/11/2023',
		''
	],
	[
		'50636312',
		'50636312_299121-655422be48e70a000173bd03',
		'8965909',
		'sudamapraja8957@gmail.com',
		'India',
		'15/11/2023',
		''
	],
	['50636312', '50636312_287694-654a5075ce0e7d0001b73989', '8882095', 'p236147@gmail.com', 'India', '07/11/2023', '']
]
const result = new Map()
result.set('8922222', { Username: 'kaushalmishra4847@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8841640', { Username: 'dd3031990@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8946964', { Username: 'durgarao9490@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8858789', { Username: 'singhjoginder0738@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8737725', { Username: 'arunasalam00081@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8843453', { Username: 'saurabhrane904@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8965909', { Username: 'sudamapraja8957@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
result.set('8882095', { Username: 'p236147@gmail.com', Country: 'India', 'Aff.ID': '50636312' })
const MockData = { dataTable, fieldId: 'Id', rows: ['Username', 'Country', 'Aff.ID'], result }
module.exports = {
	MockData
}
