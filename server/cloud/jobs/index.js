const mongoose = require('mongoose')
const github = require('../../github')
mongoose.connect('mongodb://community:Hellocommunity123@47.92.167.24:27017/community')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserSchema = new Schema({
  name: { type: String },
  loginname: { type: String, required: true },
  pass: { type: String },
  email: { type: String },
  url: { type: String },
  profileImageUrl: { type: String },
  location: { type: String },
  signature: { type: String },
  profile: { type: String },
  weixin: { type: String },
  qq: { type: String },
  weibo: { type: String },
  avatar: { type: String },
  githubId: { type: String },
  githubUsername: { type: String },
  githubAccessToken: { type: String },
  isBlock: { type: Boolean, default: false },
  role: { type: String },
  score: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  collectTagCount: { type: Number, default: 0 },
  collectPostCount: { type: Number, default: 0 },
  isStar: { type: Boolean },
  level: { type: String },
  active: { type: Boolean, default: false },
  receiveReplyMail: { type: Boolean, default: false },
  receiveAtMail: { type: Boolean, default: false },
  retrieveTime: { type: Number },
  retrieveKey: { type: String },
  accessToken: { type: String }
})

const User = mongoose.model('User', UserSchema)

const PostSchema = new Schema({
  zoneId: { type: ObjectId, required: true },
  title: { type: String, required: true },
  advertisingMap: { type: String },
  description: { type: String },
  content: { type: String },
  authorId: { type: ObjectId },
  recommendUrl: { type: String },
  top: { type: Boolean, default: false },
  lock: { type: Boolean, default: false },
  replyCount: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
  collectCount: { type: Number, default: 0 },
  lastReply: { type: ObjectId },
  lastReplyAt: { type: Date, default: Date.now },
  contentIsHtml: { type: Boolean },
  status: { type: String },
  mdType: { type: String },
  canReply: { type: Boolean, default: true },
  tags: [String],
  isHtml: { type: Boolean, default: false },
  area: { type: String },
  ups: [Schema.Types.ObjectId],
  updateAt: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', PostSchema)

const ReplySchema = new Schema({
  content: { type: String, requried: true },
  postId: { type: ObjectId },
  authorId: { type: ObjectId },
  replyId: { type: ObjectId },
  ups: [Schema.Types.ObjectId],
  updateAt: { type: Date, default: Date.now }
})

const Reply = mongoose.model('Reply', ReplySchema)

Parse.Cloud.job('health', function() {
  setTimeout(() => {
    console.log('Working properly')
  }, 1000)
})

const _User = Parse.Object.extend('_User')
const ParsePost = Parse.Object.extend('Post')
const ParseReply = Parse.Object.extend('Comment')
const queryUser = new Parse.Query(_User)
const queryPost = new Parse.Query(ParsePost)

Parse.Cloud.job('syncUser', function() {
  try {
    setTimeout(async () => {
      const users = await User.find().sort('createAt')
      for (let i = 0; i < users.length; i++) {
        console.log(users)
        await github.newGitHubUser({
          name: users[i].loginname,
          email: users[i].email,
          avatar_url: users[i].avatar,
          id: users[i].githubId,
          githubLogin: users[i].loginname,
          accessToken: users[i].accessToken
        })
      }
    }, 1000)
  } catch (err) {
    console.log(err)
  }
})

Parse.Cloud.job('syncPost', function() {
  try {
    setTimeout(async () => {
      const posts = await Post.find().sort('createAt')
      console.log(posts)
      for (let i = 0; i < posts.length; i++) {
        let user = await User.findOne({ _id: posts[i].authorId })

        queryUser.equalTo('username', user.loginname)
        let parseUser = await queryUser.find({ useMasterKey: true })

        let post = new ParsePost()
        post.set({
          title: posts[i].title,
          content: posts[i].content,
          description: posts[i].description,
          recommendUrl: posts[i].recommendUrl,
          updateAt2: posts[i].updateAt,
          authorName: parseUser[0].get('username'),
          author: parseUser[0]
        })

        const roleACL = new Parse.ACL()
        roleACL.setPublicReadAccess(true)
        roleACL.setWriteAccess(parseUser[0], true)
        post.setACL(roleACL)
        await post.save()
      }
    }, 1000)
  } catch (err) {
    console.log(err)
  }
})

Parse.Cloud.job('syncComment', function() {
  try {
    setTimeout(async () => {
      const replies = await Reply.find().sort('createAt')
      for (let i = 0; i < replies.length; i++) {
        let post = await Post.findOne({ _id: replies[i].postId })
        let user = await User.findOne({ _id: replies[i].authorId })
        queryPost.equalTo('title', post.title)
        queryUser.equalTo('username', user.loginname)
        let parsePost = await queryPost.find({ useMasterKey: true })
        let parseUser = await queryUser.find({ useMasterKey: true })

        let reply = new ParseReply()
        reply.set({
          content: replies[i].content,
          updateAt2: replies[i].updateAt,
          parent: parsePost[0],
          authorName: parseUser[0].get('username'),
          author: parseUser[0]
        })

        const roleACL = new Parse.ACL()
        roleACL.setPublicReadAccess(true)
        roleACL.setWriteAccess(parseUser[0], true)
        reply.setACL(roleACL)
        await reply.save()
      }
    }, 1000)
  } catch (err) {
    console.log(err)
  }
})
