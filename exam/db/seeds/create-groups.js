/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('groups').del()
  const groups = [
    { name: 'group 1'},
    { name: 'group 2'},
    { name: 'group 3'}
  ]

  await knex('groups').insert(groups);
};
