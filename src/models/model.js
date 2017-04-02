import AWS from 'aws-sdk'


const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
})

export default class Model {
  static dbGet(options={}) {
    const key = options.key
    if (!key) {
      throw new Error('No key provided')
    }

    const params = {
      TableName: this.getTableName(),
      Key: options.key,
      ...options
    }

    return docClient.get(params).promise()
      .then((resp) => (
        resp.Item
      ))
  }

  static getTableName() {
    const prefix = 'CONSTRUCTED-FROM-ENV-VARS'
    return this.tableName || `${prefix}-${this.name}`
  }

  constructor(fields) {
    if (typeof fields !== 'object' || fields === null) {
      throw new Error('No fields object provided!')
    }

    this.fields = fields

    const partitionKey = Object.entries(fields).find((f) => (
      f[1].partitionKey || f[1].hashKey
    ))

    const sortKey = Object.entries(fields).find((f) => (
      f[1].sortKey
    ))

    this.primaryKey = { partitionKey, sortKey }
  }

  get(...fields) {
    const fieldNames = fields.length ? fields : Object.keys(this.fields)
    const values = {}

    for (const fieldName of fieldNames) {
      if (!this.fields.hasOwnProperty(fieldName)) {
        throw new Error(`Field ${fieldName} not found.`)
      }
      values[fieldName] = this.fields[fieldName].value
    }

    // Only return the value instead of object when querying for a single value
    return Object.keys(values).length === 1 ? values[fields[0]] : values
  }


  getValidationErrors() {
    return Object.entries(this.fields).map((f) => {
      const name = f[0]
      const field = f[1]
      return (
        field.validate() ?
        null :
        {
          name,
          errors: field.getValidationErrors(),
          value: field.value
        }
      )
    }).filter((f) => f !== null)
  }

  dbSave() {
    return new Promise((resolve, reject) => (
      this.validate() ?
      resolve('SAVED!') :
      reject('CAN\'T BE SAVED')
    ))
  }

  set(fieldValues) {
    for (const fv of Object.entries(fieldValues)) {
      const name = fv[0]
      const value = fv[1]
      if (this.fields.hasOwnProperty(name)) {
        this.fields[name].value = value
      } else {
        throw new Error('No such field: ' + name)
      }
    }
  }

  validate() {
    return this.getValidationErrors().length === 0
  }

}

