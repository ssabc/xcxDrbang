let app = getApp()
let rocker = require('../../../utils/util.js')
let mta = require('../../../libs/mta_analysis.js')
let WxParse = require('../../../libs/wxParse/wxParse.js')
let self = null

Page({
  data: {
    infos: {},
    kx: '',
    sx: '',
    kxName: '',
    sxName: '',
    commentText: '',
    windowHeight: 570,
    windowWidth: 375,
    text: '',
    pmName: '',
    imgPath: '',
    marginTop: 418,
    dianzan: false,
    preNum: 0
  },
  openImg:function(e) {
      let pathArrys = []
      pathArrys.push(e.currentTarget.id)
      wx.previewImage({
          current: '',
          urls: pathArrys // 需要预览的图片http链接列表
      })
  },
  onPullDownRefresh: function() {
    self.loadFun()
  },
  onShareAppMessage: function() {
     return {
        title: '多肉邦-' + self.shareTitle,
        path: self.sharePath
      }
   },
  onLoad: function (options) {
    mta.Page.init()
    self = this

    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    self.setData({
      kx: options.kx,
      sx: options.sx,
      kxName: options.kxName,
      sxName: options.sxName,
      pmName: options.pmName || '',
      marginTop: options.isFromSearch ? 0 : self.data.windowHeight - 152,
      imgPath: options.imgPath || ''
    })
    wx.setNavigationBarTitle({
      title: options.pmName || '多肉邦'
    })

    self.shareTitle = options.pmName
    self.sharePath = 'pages/common/tujian/index?kx=' + options.kx + '&sx=' + options.sx + '&kxName=' + options.kxName + '&sxName=' + options.sxName + '&pm=' + options.pm + '&pmName=' + options.pmName + '&imgPath=' + options.imgPath

    if (options.isFromSearch) {
      self.sharePath = self.sharePath + '&isFromSearch=true'
    }
    self.path = 'drBang2/cats/' + options.kx + '/list/' + options.sx + '/list/' + options.pm
    self.loadFun()
  },
  bindKeyInput:function(e) {
    wx.navigateTo({
      url: '/pages/comment/index?path='+ self.path
    })
  },
  loadFun () {
    rocker.showLoading()
    app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
      let key = snapshot.key(), text = snapshot.val()
        self.data.infos[key] = text
        if (key == 'desc') {
            app.globalData.imgDomain = 'http://w.bw9.org/'
            text.replace('"/file', '"'+app.globalData.imgDomain + '/file')
            WxParse.wxParse('text', 'html', text, self, 5);
        }
        let preNum = self.data.infos.preNum ? self.data.infos.preNum.num : 0
        self.setData({
          infos: self.data.infos,
          preNum: ++preNum
        })
        let path = self.path + '/preNum', yun = {}
        yun.num = self.data.preNum
        self.refPreNum = app.getRefBypath(path)
        self.refPreNum.set(yun)

       app.getUserInfo( function(userInfo) {
          for (let key in self.data.infos.zans) {
            if (self.data.infos.zans[key].username == userInfo.nickName) {
              self.setData({
                dianzan: true
              })
              break
            }
          }
        })
       wx.hideLoading()
       wx.stopPullDownRefresh()
       app.globalData.isNeedRefrushTujian = false
       app.globalData.isNeedRefrushSX = true
    }, self)
  },
  onShow: function(){
    if(app.globalData.isNeedRefrushTujian) {
      self.updateInfos()
    }
  },
  init () {
      app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
      let key = snapshot.key(), text = snapshot.val()
        self.data.infos[key] = text
        self.setData({
          infos: self.data.infos
        })
    }, self)
  },
  updateInfos () {
    app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
        let key = snapshot.key(), text = snapshot.val()
        self.data.infos[key] = text
        self.setData({ infos: self.data.infos })
    }, self)
  },
  dianzan () {
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
              self.data.infos[key] = text
              self.setData({ infos: self.data.infos })
          }, self)
          self.updateInfos()
      })
    }
  }
})