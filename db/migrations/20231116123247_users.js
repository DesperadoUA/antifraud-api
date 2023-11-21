/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const schema = require('../../schemas/users')
exports.up = function (knex) {
	return knex.schema.createTable('users', table => {
		table.increments('id')
		table.primary(['id'])
		table.enum('role', ['admin', 'editor', 'guest']).defaultTo('editor')
		table.string('email').unique()
		table.text('name')
		table.text('password')
		table.text('remember_token')
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {}
