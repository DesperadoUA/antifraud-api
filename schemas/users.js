module.exports = [
	{
		type: 'enu',
		params: ['role', ['admin', 'editor', 'guest']],
		fn: [],
		default: 'editor'
	},
	{
		type: 'string',
		params: ['email'],
		fn: ['unique'],
		default: ''
	},
	{
		type: 'string',
		params: ['name', 300],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['password', 300],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['remember_token', 500],
		fn: [],
		default: null
	},
	{
		type: 'timestamp',
		params: ['created_at'],
		fn: [],
		default: null
	},
	{
		type: 'timestamp',
		params: ['updated_at'],
		fn: [],
		default: null
	}
]
