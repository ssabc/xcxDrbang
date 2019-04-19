let app = getApp()
let rocker = require('../../../utils/util.js')
let mta = require('../../../libs/mta_analysis.js')
let self = null

Page({
  data: {
    sxInfo: {},
    kx: '',
    sx: '',
    kxName: '',
    sxName: '',
    windowHeight: '',
    windowWeight:'',
    options: {},
    animationData: {},
    animate_interval: null
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
    self.loadFun(self.data.options)
  },
  upper: function(e) {
    // self.loadFun(self.data.options)
  },
  onShareAppMessage: function() {
     return {
        title: '多肉邦-' + self.shareTitle,
        path: self.sharePath
      }
   },
   getSxInfo () {
      rocker.showLoading()
      app.ref.child(self.path).on('child_added', function(snapshot, prKey) {
        let key = snapshot.key()
        let item = snapshot.val()
        item['key'] = key
        self.data.sxInfo[key] = item
        for ( let item in self.data.sxInfo) {
          let comentNum = 0, dianzanNum = 0
          for( let v in  self.data.sxInfo[item].coment){
            comentNum++
          }
          for( let v in self.data.sxInfo[item].zans) {
            dianzanNum++
          }
          self.data.sxInfo[item].comentNum = comentNum
          self.data.sxInfo[item].dianzanNum = dianzanNum
          self.data.sxInfo[item].preNums = self.data.sxInfo[item].preNum ? self.data.sxInfo[item].preNum.num : 0
        } 

        self.setData({
          sxInfo: self.data.sxInfo
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
    }, self)
   },
   loadFun: function(options) {
    self.setData({
      kx: options.kx,
      sx: options.sx,
      kxName: options.kxName,
      sxName: options.sxName
    })
    self.shareTitle = options.kxName + ' ' + options.sxName
    self.sharePath = 'pages/common/sxDetail/index?kx=' + options.kx + '&sx=' + options.sx + '&kxName=' + options.kxName + '&sxName=' + options.sxName

    wx.setNavigationBarTitle({
      title: options.kxName + '  '+options.sxName || '多肉邦'
    })
    self.path = 'drBang2/cats/' + options.kx + '/list/' + options.sx + '/list'
    self.getSxInfo()
    self.msgAnimate()
   },
  /**
   *  消息 左右摆动动画效果
   */
  msgAnimate() {
    let i = 0, animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'linear',
        delay: 0,
        transformOrigin: '50% 50% 0'
    })
    let animate_interval = setInterval(function() {
        animation.rotate(30).step()
        self.setData({ animationData:animation.export()})
        setTimeout(function(){
          animation.rotate(-30).step()
          self.setData({animationData:animation.export()})
        },100)
        setTimeout(function(){
          animation.rotate(30).step()
          self.setData({animationData:animation.export()})
        },200)
        setTimeout(function(){
          animation.rotate(-30).step()
          self.setData({animationData:animation.export()})
        },300)
    }.bind(self), 1000)
    self.setData({animate_interval: animate_interval})
  },
  onHide: function() {
    clearInterval(self.data.animate_interval)
  },
  onShow: function () {
    if (app.globalData.isNeedRefrushSX) { 
      self.getSxInfo()
      app.globalData.isNeedRefrushhome = false
    }
    self.msgAnimate()
  },
  onLoad: function (options) {
    mta.Page.init()
    self = this

    self.setData({
      options: options
    })
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight,
          windowWeight: res.windowWidth
        })
      }
    })
    self.loadFun(options)
  }
})