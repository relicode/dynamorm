import Field from '../src/fields.js'


const AWESOME = 'awesome'

// Disabled since this is not supported by uglify
/*
test('Field cannot be directly instantiated', () => {
  const instantiateField = () => ( new Field() )
  expect(instantiateField).toThrowError('Cannot construct Field instances directly')
})
*/

test('Validation working with a single non-array validator', () => {
  class MockTextField extends Field {
    constructor(params) {
      const validators = { description: 'needs to contain an "x"', rule: 'x' }
      super(validators, params)
    }
  }

  const textField = new MockTextField({ initialValue: 'OExEH' })
  expect(textField.validate()).toBe(true)

  textField.value = 'OEEH'
  expect(textField.validate()).toBe(false)
})

test('Validation working with an array validator', () => {
  class MockTextField extends Field {
    constructor(params) {
      const validators = [
        { description: 'needs to contain an "x"', rule: 'x' },
        { description: 'connot contain a "y"', rule: /^[^y]+$/ },
      ]
      super(validators, params)
    }
  }

  const textField = new MockTextField({ initialValue: 'OExEH' })
  expect(textField.validate()).toBe(true)

  textField.value = 'OExyEH'
  expect(textField.validate()).toBe(false)
})

