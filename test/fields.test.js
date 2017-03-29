import Field from '../src/fields'


// Disabled since this is not supported by uglify
/*
test('Field cannot be directly instantiated', () => {
  const instantiateField = () => ( new Field() )
  expect(instantiateField).toThrowError('Cannot construct Field instances directly')
})
*/

test('Validation working with a single non-array validator', () => {
  class MockTextField extends Field {
    constructor(options) {
      const validators = { description: 'needs to contain an "x"', rule: 'x' }
      super(validators, options)
    }
  }

  const textField = new MockTextField({ initialValue: 'OExEH' })
  expect(textField.validate()).toBe(true)

  textField.value = 'OEEH'
  expect(textField.validate()).toBe(false)
})

test('Validation working with a function validator', () => {
  class MockTextField extends Field {
    constructor(options) {
      const validators = [
        { description: 'needs to be typeof "string"', rule: (val) => typeof val === 'string' },
      ]
      super(validators, options)
    }
  }

  const textField = new MockTextField({ initialValue: 'myString' })
  expect(textField.validate()).toBe(true)

  textField.value = 33
  expect(textField.validate()).toBe(false)
})


test('Validation working with an array validator', () => {
  class MockTextField extends Field {
    constructor(options) {
      const validators = [
        { description: 'needs to contain an "x"', rule: 'x' },
        { description: 'connot contain a "y"', rule: /^[^y]+$/ },
      ]
      super(validators, options)
    }
  }

  const textField = new MockTextField({ initialValue: 'OExEH' })
  expect(textField.validate()).toBe(true)

  textField.value = 'OExyEH'
  expect(textField.validate()).toBe(false)
})

test('Validation passes with an undefined value if allowed explicitly', () => {
  class MockTextField extends Field {
    constructor(options) {
      const validators = [
        { description: 'needs to contain an "x"', rule: 'x' },
      ]
      super(validators, options)
    }
  }

  const textField = new MockTextField({ initialValue: undefined, allowNull: true })
  expect(textField.validate()).toBe(true)

  textField.value = 'OExyEH'
  expect(textField.validate()).toBe(true)
})

test('Validation fails with a null value', () => {
  class MockTextField extends Field {
    constructor(options) {
      const validators = [
        { description: 'needs to contain an "x"', rule: 'x' },
      ]
      super(validators, options)
    }
  }

  const textField = new MockTextField({ initialValue: null })
  expect(textField.validate()).toBe(false)

  textField.value = 'OExyEH'
  expect(textField.validate()).toBe(true)
})

