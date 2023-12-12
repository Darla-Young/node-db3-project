const Schemes = require('./scheme-model')


const checkSchemeId = (req, res, next) => {
  Schemes.findById(req.params.scheme_id)
    .then(scheme => {
      if(!scheme) {
        res.status(404).json({message: `scheme with scheme_id ${req.params.scheme_id} not found`})
      }
      else next()
    })

}

const validateScheme = (req, res, next) => {
  const name = req.body.scheme_name
  if (!name || name.toString() !== name) res.status(400).json({message: "invalid scheme_name"})
  else next()
}

const validateStep = (req, res, next) => {
  const { instructions } = req.body
  const step = req.body.step_number
  if (!instructions || step < 1 || parseFloat(step) !== step || instructions.toString() !== instructions) {
    res.status(400).json({message: "invalid step"})
  }
  else next()
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
