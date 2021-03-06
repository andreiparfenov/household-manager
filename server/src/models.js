const mongoose = require("mongoose")
const moment = require('moment')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

function buildModel(name, schema) {
  return mongoose.model(name, new Schema(schema, {timestamps: true}))
}
/*
const Folder = buildModel('Folder', {
  name: String,
  description: String,
  shareWith: [{
    kind: String,
    item: { type: ObjectId, refPath: 'shareWith.kind' }
  }],
  parent: { type: ObjectId, ref: 'Folder' },
})

module.exports.Folder = Folder

module.exports.Family = Folder.discriminator('Family', new Schema({
}, {timestamps: true}))
*/
module.exports.User = buildModel('User', {
  name: {
    type: String,
    default: ''
  },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  jobTitle: {
    type: String,
    default: ''
  },
  avatarColor: String,
  family: { type: ObjectId, ref: 'Family' },
  role: String,
  status: String
})

module.exports.Family = buildModel('Family', {
  familyName: {
    type: String
  },
  members: [{ type: ObjectId, ref: 'User' }],
  messages: [{ type: ObjectId, ref: 'Message' }]
})

module.exports.Message = buildModel('Message', {
  content: {
    type: String,
  },
  author: {type: ObjectId, ref: 'User'},
  chat: {type: ObjectId, ref: 'Family'}
})

/*
module.exports.Group = buildModel('Group', {
  family: { type: ObjectId, ref: 'Family' },
  name: String,
  initials: String,
  avatarColor: String,
  users: [{ type: ObjectId, ref: 'User' }],
})
*/