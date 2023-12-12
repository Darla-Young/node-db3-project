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
        scheme_name: arr[0].scheme_name,
        steps: [],
      })
  }
}

async function findSteps(scheme_id) {
  const scheme = await findById(scheme_id)
  const name = scheme.scheme_name
  const steps = scheme.steps
  const ordered = []

  for (let i = 0; i < steps.length; i++) {
    ordered.splice(steps[i].step_number - 1,0,{
      step_id: steps[i].step_id,
      step_number: steps[i].step_number,
      instructions: steps[i].instructions,
      scheme_name: name
    })
  }
  return ordered
}

async function add(scheme) {
  const id = await db('schemes')
    .insert(scheme)
  const newScheme = await findById(id[0])
  return newScheme
}

async function addStep(scheme_id, step) {
  await db('steps')
    .insert({step_number: step.step_number, instructions: step.instructions, scheme_id: scheme_id})
  const updatedScheme = await findSteps(scheme_id)
  return updatedScheme
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
