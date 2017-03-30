import { TextField } from '../src/fields'
import Model from '../src/models'


class MockModel extends Model {
  constructor(options) {
    const fields = {
      keyField: new TextField({ hashKey: true }),
      myTextField: new TextField()
    }
    super(fields, options)
  }
}

test('Model field value setting and validation working', () => {
  const model = new MockModel()
  const KEY_FIELD_VALUE = 'KEY_FIELD_VALUE'
  const TEXT_FIELD_VALUE = 'TEXT_FIELD_VALUE'

  model.set({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE
  })

  expect(model.validate()).toBe(true)
  expect(model.getValidationErrors()).toEqual([])

  model.set({
    keyField: 1
  })

  console.log(model.fields.keyField.value)
  console.log(model.getValidationErrors())
  expect(model.validate()).toBe(false)
})

