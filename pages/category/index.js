let app = getApp()
let rocker = require('../../utils/util.js')
let mta = require('../../libs/mta_analysis.js')
let self = null

Page({
  data: {
    cats: [],
    kxInfo: {},
    now: -1,
    wHeight: 634
  },
  onShareAppMessage: function() {
     return {
        title: '多肉邦-分类',
        path: '/pages/category/index'
      }
   },
  onPullDownRefresh: function() {
    self.init()
  },
  init() {
    rocker.showLoading()
    self.setData({cats: []})
    wx.getSystemInfo({
      success: function(res) {
          self.setData({
            wHeight: res.windowHeight
          })
      }
    })
    app.ref.child('drBang2/catsBrief').on('child_added', function(snapshot, prKey) {
          let key = snapshot.key()
          let item = snapshot.val()
          if (key == 'kxEnd') {
            wx.hideLoading()
            wx.stopPullDownRefresh()
          } else {
              item['key'] = key
              self.data.cats.push(item)
              self.setData({
                cats: self.data.cats
              })
          }
    }, self)
  },
  onLoad: function () {
    mta.Page.init()
    self = this
    self.init()
  },
    
  showShutypes: function(e) {
    let index = e.currentTarget.id.split(',')[0], kx = e.currentTarget.id.split(',')[1]
    self.setData({
        now: self.data.now == index ? -1 : index
    })
  }
})