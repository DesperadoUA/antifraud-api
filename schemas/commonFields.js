module.exports = [
	{
		type: 'enu',
		params: ['status', ['public', 'hide', 'basket']],
		fn: [],
		default: 'hide'
	},
	{
		type: 'string',
		params: ['permalink'],
		fn: ['unique'],
		default: ''
	},
	{
		type: 'string',
		params: ['title', 300],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['thumbnail', 300],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['short_desc', 500],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['h1'],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['meta_title'],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['description'],
		fn: [],
		default: null
	},
	{
		type: 'string',
		params: ['keywords'],
		fn: [],
		default: null
	},
	{
		type: 'longtext',
		params: ['content'],
		fn: [],
		default: null
	},
	{
		type: 'integer',
		params: ['lang'],
		fn: [],
		default: 1
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
