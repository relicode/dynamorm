export default class Field {
  constructor(validators, options={}) {
    
    // Disabled since doesn't work with uglify
    /*
    if (new.target === Field) {
      throw new Error('Cannot construct Field instances directly')
    }
    */

    const { initialValue } = options
    
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
      return (
        typeof rule === 'function' ?
        ((value) => rule(value)) :
        ((value) => new RegExp(rule).test(value))
      )
    })
    if (!this.validators.length) {
      throw new Error('This class has no validators!')
    }

    this.value = initialValue
  }
  
  validate() {
    return this.validators.reduce((acc, validator) => (
      validator(this.value) && acc
    ), true)
  }

}

