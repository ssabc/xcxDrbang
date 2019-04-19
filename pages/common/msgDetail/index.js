let app = getApp()
let rocker = require('../../../utils/util.js')
let mta = require('../../../libs/mta_analysis.js')
let WxParse = require('../../../libs/wxParse/wxParse.js')
let self = null

Page({
  data:{
      article: {},
      commentText: '',
      windowHeight: 570,
      text: '',
      dianzan: false,
      preNum: 0
  },
  openImg: function(e) {
      let pathArrys = []
      pathArrys.push(e.currentTarget.id)
      wx.previewImage({
          current: '',
          urls: pathArrys // 需要预览的图片http链接列表
      })
  },
  turnToDetail: function(event) {
    let id = event.currentTarget.dataset.id;
    app.turnToPage('/pages/communityDetail/communityDetail?detail=' + id)
  },
  onShareAppMessage: function() {
     return {
        title: '多肉邦-' + self.shareTitle,
        path: self.sharePath
      }
   },
   onPullDownRefresh: function() {
    self.loadFun()
  },
  updateArticle () {
    app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
        let key = snapshot.key(), text = snapshot.val()
        self.data.article[key] = text
        self.setData({ article: self.data.article })
        app.globalData.isNeedRefrushhome = true
    }, self)
  },
  loadFun () {
    rocker.showLoading()
    // 页面初始化 options为页面跳转所带来的参
    app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
        let key = snapshot.key(), text = snapshot.val()
        app.globalData.imgDomain = ''
        if (key == 'a0') {
            app.globalData.imgDomain = text || ''
        } else if (key == 'article') {
            WxParse.wxParse('text', 'html', text, self, 5);
        }
        self.data.article[key] = text
        let preNum = self.data.article.preNum ? self.data.article.preNum.num : 0
        
        self.setData({
          article: self.data.article,
          preNum: ++preNum
        })
        let path = self.path + '/preNum', yun = {}
        yun.num = self.data.preNum
        self.refPreNum = app.getRefBypath(path)
        self.refPreNum.set(yun)

        app.getUserInfo( function(userInfo) {
          for (let key in self.data.article.zans) {
            if (self.data.article.zans[key].username == userInfo.nickName) {
              self.setData({
                dianzan: true
              })
              break
            }
          }
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
    },self)
  },
  onLoad:function(options) {
    mta.Page.init()
    self = this

    self.path = 'drBang2/msgs/' + options.index
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    self.shareTitle = '文章'
    self.sharePath = '/pages/common/msgDetail/index?index=' + options.index
    self.loadFun()
  },
  bindKeyInput:function(e) {
    self.setData({
      commentText: e.detail.value
    })
},
  dianzan: function() {
    if ( !self.data.dianzan) {
      self.setData({ dianzan: true })
      let yun = {} 
      app.getUserInfo( function(userInfo) {
          yun.userlogo = userInfo.avatarUrl
          yun.username = userInfo.nickName

          let path = self.path + '/zans'
          self.refZans = app.getRefBypath(path)
          self.refZans.push(yun)
        
          app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
              let key = snapshot.key(), text = snapshot.val()
              self.data.article[key] = text
              self.setData({ article: self.data.article })
          }, self)
          self.updateArticle()
      })
    }
  },
  sendComment () {
    let text = self.data.commentText, yun = {}
      if (text == '') {
        wx.showModal({
          title: '提示',
          content: '评论内容不能为空哦~~',
          showCancel: false
        })
      } else {
        app.getUserInfo( function(userInfo) {
            app.globalData.userInfo = userInfo
            let time = rocker.getNowFormatDate()
            yun.content = text
            yun.userlogo = userInfo.avatarUrl
            yun.username = userInfo.nickName
            yun.time = time

            let path = self.path+'/coment'
            self.refComent = app.getRefBypath(path)
            self.refComent.push(yun)
            self.setData({
                commentText: ''
            })
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
            self.updateArticle()
        })
      }
  }
})