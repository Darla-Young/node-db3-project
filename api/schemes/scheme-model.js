const db = require('../../data/db-config')

function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_name')
    .orderBy('sc.scheme_id', 'asc')
    .select('sc.scheme_id as scheme_id', 'sc.scheme_name as scheme_name', 'st.step_id as number_of_steps')
    .count('st.step_id as number_of_steps')
}

async function findById(scheme_id) {
  const arr = await db('schemes as sc')
    .where('sc.scheme_id', scheme_id)
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id as step_id', 'st.step_number as step_number', 'st.instructions as instructions', 'sc.scheme_id as scheme_id', 'sc.scheme_name as scheme_name')
    .orderBy('st.step_number')

  switch (true) {
    case !arr[0]:
      return null
    case arr[0].step_id !== null:{
      const steps = []
      for (let i = 0; i < arr.length; i++) {
        const step = arr[i]
        steps.push({
          step_id: step.step_id,
          step_number: step.step_number,
          instructions: step.instructions,
        })
      }
      return ({
        scheme_id: arr[0].scheme_id,
        scheme_name: arr[0].scheme_name,
        steps: steps,
      })
    }
    default:
      return ({
        scheme_id: scheme_id,
        scheme_name: arr.scheme_name,
        steps: [],
      })
  }
}

function findSteps(scheme_id) {
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
