let app = getApp()
let rocker = require("../../utils/util.js")
let mta = require('../../libs/mta_analysis.js')

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    cats: [],
    rouArrys: [],
    searchResult: [],
    windowHeight: '',
    list: []
  },
  onShareAppMessage: function () {
    return {
      title: '多肉邦-多肉搜索',
      path: '/pages/search/index'
    }
  },
  getNameKS (cats) {
    let item = {}, rouAll = [], subItem =  null
    for (let v of cats) {
      item = {}
      item.kx = v.key
      item.kxName = v.baseInfo.name
      for (let s in v.list) {
        item.sx = v.list[s].baseInfo.sx
        item.sxName = v.list[s].baseInfo.name
        for (let t in v.list[s].list) {
          subItem = {}
          subItem.kx = item.kx
          subItem.kxName = item.kxName
          subItem.sx = item.sx
          subItem.sxName = item.sxName
          subItem.rouSzm = t
          subItem.rouName = v.list[s].list[t].name
          if (item.kx == "kx1" && (item.sx == "shu1")){
            rouAll.unshift(subItem)
          }
          self.data.list.unshift(subItem)
        }
      }
    }
    self.setData({
      rouArrys: rouAll
    })
    return rouAll
  },
  init () {
    rocker.showLoading()
    self.setData({ cats: [] })
    app.ref.child('drBang2/catsBrief').on('child_added', function (snapshot, prKey) {
      let key = snapshot.key()
      let item = snapshot.val()
      if (key == 'kxEnd') {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        self.getNameKS(self.data.cats)
      }else {
        item["key"] = key
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
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    self.init()
  },
  showInput: function () {
    self.setData({
      inputShowed: true
    })
  },
  hideInput: function () {
    self.setData({
      inputVal: "",
      inputShowed: false
    })
  },
  clearInput: function () {
    self.setData({
      inputVal: ""
    })
  },
  inputTyping: function (e) {
    self.setData({
      inputVal: e.detail.value
    })
    self.setData({ searchResult: []})
    let res = [], str = e.detail.value.toLowerCase()
    if (str.length > 0) {
      for (let v of self.data.list) {
        if (v.rouSzm && v.rouSzm.indexOf(str) == 0 || v.rouName && v.rouName.indexOf(str) == 0) {
          res.push(v)
        }
      }
      self.setData({ searchResult: res })
    }
  }
})