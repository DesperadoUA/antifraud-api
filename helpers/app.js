const fs = require('fs')
class Helper {
	static getAppDir() {
		return fs
			.readdirSync(_APP_DIR, { withFileTypes: true })
			.filter(d => d.isDirectory())
			.map(d => d.name)
	}
}
module.exports = Helper
