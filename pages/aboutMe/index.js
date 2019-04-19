let app = getApp()
let rocker = require("../../utils/util.js")
let mta = require('../../libs/mta_analysis.js')
let self = null

Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  onShareAppMessage: function() {
     return {
        title: '多肉邦-我',
        path: '/pages/aboutMe/index'
      }
   },
  onPullDownRefresh: function() {
     self.getUserInfo(self)
     wx.stopPullDownRefresh()
  },
  getUserInfo () {
      self.setData({ userInfo: app.globalData.userInfo })
      app.getUserInfo( function(userInfo) {
        self.setData({ userInfo:userInfo })
      })
  },
  onLoad: function () {
    mta.Page.init()
    self = this

    self.getUserInfo()
    self.ref = app.getRefBypath('drBang2/aboutUs/phone')
    self.ref.on('child_added', function(snapshot, prKey) {
        let key = snapshot.key()
        let text = snapshot.val()
        self.data.info[key] = text
        self.setData({ info:self.data.info  })
    },self)
  }
})
