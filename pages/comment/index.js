let app = getApp()
let rocker = require("../../utils/util.js")
let mta = require('../../libs/mta_analysis.js')
let self = null

Page({
  data: {
    commentText: '',
    imgList: [
        // 'http://oopa8ayey.bkt.clouddn.com/banner1.jpg','http://oopa8ayey.bkt.clouddn.com/banner2.jpg','http://oopa8ayey.bkt.clouddn.com/banner3.jpg'
    ]
  },
  bindTextAreaBlur: function(e) {
    self.setData({
      commentText: e.detail.value
    })
  },
  openImg:function(e) {
        let pathArrys = []
        pathArrys.push(e.currentTarget.id)
        wx.previewImage({
            current: '',
            urls: pathArrys // 需要预览的图片http链接列表
        })
  },
  addImgFn() {
    self.uploadImg(function (res) {
        self.data.imgList.push(res)
        self.setData({
            imgList: self.data.imgList
        })
    })
  },
  uploadImg(cb) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success: function(res) {
            var savedFilePath = res.savedFilePath
            cb(savedFilePath)
          }
        })
      }
  })
},
sendComment (e) {
    let text = e.detail.value.textarea, yun = {}
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
            if (self.data.imgList.length > 0){
                yun.imgs = self.data.imgList
            }
            // console.log(yun)
            let path = self.path + '/coment'
            self.refComent = app.getRefBypath(path)
            self.refComent.push(yun)
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
            app.globalData.isNeedRefrushTujian = true
            wx.navigateBack()
        })
      }
  },
  delImgFn(e){
    let index = parseInt(e.currentTarget.id), tmp = JSON.parse( JSON.stringify(self.data.imgList) )
    tmp.splice(index, 1)
    self.setData({ 
        imgList: tmp
    })
  },
  onLoad: function (options) {
    mta.Page.init()
    self = this
    self.path = options.path
  }
})
