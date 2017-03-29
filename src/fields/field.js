export default class Field {
  constructor(validators, options={}) {
    
    // Disabled since doesn't work with uglify
    /*
    if (new.target === Field) {
      throw new Error('Cannot construct Field instances directly')
    }
    */

    const { initialValue, allowNull } = options
    
    // Constructs the fields' validator functions
    this.validators = [].concat(validators).map((v) => {
      if (typeof v !== 'object' || v === null) {
        throw new Error('Validator needs to be an object with rule and description properties.')
      }
      
      const { description, rule } = v
      if (typeof rule !== 'function' && !(rule instanceof RegExp) && !(typeof rule === 'string')) {
        throw new Error('Validator rule needs to be either a function, a RegExp or a string')
      }
      if (typeof description !== 'string' || !description.length) {
        throw new Error('Validator description needs to be a non-empty string')
      }

      // If the rule is a function, then apply the function with value
      // If the rule is a RegExp or a string, then test value against generated RegExp
      return ({
        test: (
          typeof rule === 'function' ?
          ((value) => rule(value)) :
          ((value) => new RegExp(rule).test(value))
        ),
        errorMessage: description
      })
    })
    if (!this.validators.length) {
      throw new Error('This class has no validators!')
    }

    this.value = initialValue
    this.allowNull = allowNull
  }

  directValidate() {
    // Allow both null and undefined values
    if (this.allowNull && this.value == null) {
      return true
    }
    return false
  }

  getValidationErrors() {
    return this.validators.map((v) => (
      v.test(this.value) ? null : v.errorMessage
    ))
    .filter((errorMessage) => errorMessage !== null)
  }

  validate() {
    return (
      this.directValidate() ||
      this.validators.reduce((acc, validator) => (
        validator.test(this.value) && acc
      ), true)
    )
  }

}

