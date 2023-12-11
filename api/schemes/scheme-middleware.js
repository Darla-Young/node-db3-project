const db = require('../../data/db-config')


const checkSchemeId = (req, res, next) => {
  db('schemes').where('scheme_id', req.params.id).first()
    .then(scheme => {
      if(!scheme) {
        res.status(404).json({message: `scheme with scheme_id ${req.params.id} not found`})
      }
      else next()
    })

}

  // If `scheme_name` is missing, empty string or not a string
const validateScheme = (req, res, next) => {
  const name = req.body.scheme_name
  if (!name) res.status(400).json({message: "invalid scheme_name"})
  else next()
}

  // If `instructions` is missing, empty string or not a string
const validateStep = (req, res, next) => {
  const { instructions } = req.body
  const step = req.body.step_number
  if (!instructions || step < 1 || parseFloat(step) !== step) {
    res.status(400).json({message: "invalid step"})
  }
  else next()
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
