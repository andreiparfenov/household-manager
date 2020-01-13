const { GraphQLScalarType } = require('graphql')
const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Family, Message } = require('./models')
const { getUserId } = require('./utils')

const JWT_SECRET = process.env.JWT_SECRET

const nodeMailer = require('nodemailer')
const { welcomeEmail } = require('./emails')

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
})

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())]
}

const avatarColors = [
  "D81B60","F06292","F48FB1","FFB74D","FF9800","F57C00","00897B","4DB6AC","80CBC4",
  "80DEEA","4DD0E1","00ACC1","9FA8DA","7986CB","3949AB","8E24AA","BA68C8","CE93D8"
]

const resolvers = {
  Query: {
    async getFamily (_, args, context) {
      const userId = getUserId(context);
      const user = await User.findById(userId);
      return await Family.findById(user.family).populate('members');
    },

    async getMessages (_, args, context) {
      const userId = getUserId(context);
      const user = await User.findById(userId);
      const family = await Family.findById(user.family).populate({
        path: 'messages', model: 'Message',
        populate: { path: 'author', model: 'User'}
      })
      return await family.messages
    }
    /*
    async getFolders (_, {parent}, context) {
      const userId = getUserId(context)
      if (parent) {
        return await Folder.find({parent})
      } else {
        const user = await User.findById(userId)
        const groups = await Group.find({users: ObjectId(userId)}, '_id')
        const ids = groups.map(o => o._id).concat(
          ['External User', 'Collaborator'].includes(user.role)
          ? [ObjectId(userId)]
          : [ObjectId(userId), user.family]
        )
        return await Folder.find({ 'shareWith.item': ids }).populate('shareWith')
      }
    },
    async getFolder (_, {id}, context) {
      const userId = getUserId(context)
      return await Folder.findById(id).populate('shareWith')
    },
    */
  },
  Mutation: {
    async captureEmail (_, {email}) {
      const isEmailTaken = await User.findOne({email})
      if (isEmailTaken) {
        throw new Error('This email is already taken')
      }
      const user = await User.create({
        email,
        role: 'Owner',
        status: 'Pending'
      })
      transporter.sendMail(welcomeEmail(email, user))
      return user
    },

    async inviteMember (_, {email, familyId}) {
      const user = await User.create({
        email,
        role: 'Member',
        status: 'Pending',
        family: familyId
      })
      //add new member to household
      Family.findById(familyId, function (err, fam) {
        if (err) { console.log(err) };
        fam.members.push(user.id);
        fam.save();
      })
      transporter.sendMail(welcomeEmail(email, user))
      return user
    },
    
    async signup (_, {id, firstname, lastname, password}) {
      const user = await User.findById(id)
      const common = {
        firstname,
        lastname,
        name: `${firstname} ${lastname}`,
        avatarColor: randomChoice(avatarColors),
        password: await bcrypt.hash(password, 10),
        status: 'Active'
      }
      if (user.role === 'Owner') {
        const family = await Family.create({
          familyName: common.lastname,
          members: [user.id]
        })
        user.set({
          ...common,
          family: family.id,
          jobTitle: ''
        })
      } else {
        user.set(common)
      }
      await user.save()
      const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET)
      return {token, user}
    },

    async login (_, {email, password}) {
      const user = await User.findOne({email})
      if (!user) {
        throw new Error('No user with that email')
      }
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Incorrect password')
      }
      const token = jwt.sign({id: user.id, email}, JWT_SECRET)
      return {token, user}
    },
    
    async createMessage (_, {content}, context) {
      const userId = getUserId(context);
      const user = await User.findById(userId);
      const familyId = user.family;
      const message = await Message.create({
        content,
        author: userId,
        chat: familyId
      })
      //add message to family chat
      Family.findById(familyId, function (err, fam) {
        if (err) { console.log(err) };
        fam.messages.push(message.id);
        fam.save();
      })
      return message
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: (value) => moment(value).toDate(), // value from the client
    serialize: (value) => value.getTime(), // value sent to the client
    parseLiteral: (ast) => ast
  })
}

 module.exports = resolvers