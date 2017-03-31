import { TextField } from '../src/fields'
import Model from '../src/models'


class MockModel extends Model {
  constructor(options) {
    const fields = {
      keyField: new TextField({ hashKey: true }),
      myTextField: new TextField(),
      nullableField: new TextField({ allowNull: true })
    }
    super(fields, options)
  }
}

test('Model field value setting and changing works', () => {
  const model = new MockModel()
  const KEY_FIELD_VALUE = 'KEY_FIELD_VALUE'
  const TEXT_FIELD_VALUE = 'TEXT_FIELD_VALUE'

  model.set({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE,
    nullableField: null
  })
 
  expect(model.get()).toEqual({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE,
    nullableField: null
  })

  expect(model.get('nullableField', 'myTextField')).toEqual({
    myTextField: TEXT_FIELD_VALUE,
    nullableField: null
  })

  expect(model.get('nullableField')).toBe(null)

  expect(() => {
    model.get('A FIELD THAT DOESN\'T EXIST!')
  }).toThrowError('Field A FIELD THAT DOESN\'T EXIST! not found.')

  expect(() => {
    model.set({ nonExistantField: true })
  }).toThrowError('No such field: nonExistantField')

  model.set({
    keyField: TEXT_FIELD_VALUE,
    myTextField: KEY_FIELD_VALUE
  })

  expect(model.get()).toEqual({
    keyField: TEXT_FIELD_VALUE,
    myTextField: KEY_FIELD_VALUE,
    nullableField: null
  })
})

/*
test('Model validation works', () => {
  const model = new MockModel()
  const KEY_FIELD_VALUE = 'KEY_FIELD_VALUE'
  const TEXT_FIELD_VALUE = 'TEXT_FIELD_VALUE'

  model.set({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE,
    nullableField: null
  })
 
  expect(model.validate()).toBe(true)
})
*/

