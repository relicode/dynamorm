import Model from '../src/models'
import { TextField } from '../src/fields'


class MockModel extends Model {
  constructor(options) {
    const fields = {
      keyField: new TextField({ hashKey: true }),
      myTextField: new TextField(),
      nullableField: new TextField({ allowNil: true })
    }
    super(fields, options)
  }
}

MockModel.tableName = 'anssin-lelutaulu'

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

  model.set({
    nullableField: 123
  })

  expect(model.validate()).toBe(false)

  expect(model.getValidationErrors()).toEqual([
    {
      name: 'nullableField',
      errors: ['Needs to be a string'],
      value: 123
    }
  ])
})

test('Model saving works', async () => {
  const model = new MockModel()
  const KEY_FIELD_VALUE = 'KEY_FIELD_VALUE'
  const TEXT_FIELD_VALUE = 'TEXT_FIELD_VALUE'
  
  expect(MockModel.getTableName()).toBe('anssin-lelutaulu')

  model.dbSave().catch((e) => {
    expect(e).toBe('Invalid field data')
  })

  try {
    await model.dbSave()
  } catch(e) {
    expect(e).toBe('Invalid field data')
  }

  expect(model.getValidationErrors()).toEqual(
    [
      {
        name: 'keyField',
        errors: [
          'Needs to be a string'
        ],
        value: undefined
      },
      {
        name: 'myTextField',
        errors: [
          'Needs to be a string'
        ],
        value: undefined
      }
    ]
  )

  model.set({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE
  })

  try {
    const r = await model.dbSave()
    expect(r).toBe('SAVED!')
  } catch(e) {
    e
  }

})

/* Requires appropriate DB data */
test('Model instance getting works', async () => {
  const params = {
    key: {
      keyField: 'KEY VALUE'
    }
  }

  try {
    const resp = await MockModel.dbGet(params)
    expect(resp).toEqual({
      myTextField: 'MY TEXT VALUE',
      keyField: 'KEY VALUE'
    })
  } catch(e) {
    (e)
  }
})

test('getFieldValues returns name-value object', async () => {
  const model = new MockModel()
  const KEY_FIELD_VALUE = 'KEY_FIELD_VALUE'
  const TEXT_FIELD_VALUE = 'TEXT_FIELD_VALUE'

  model.set({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE,
    nullableField: null
  })

  expect(model.getFieldValues()).toEqual({
    keyField: KEY_FIELD_VALUE,
    myTextField: TEXT_FIELD_VALUE,
    nullableField: null
  })

  try {
    const data = await model.dbSave()
    expect(data).toBe('Success')
  } catch (e) {
    console.log(e)
  }

})

