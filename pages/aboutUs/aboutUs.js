let app = getApp()
let rocker = require("../../utils/util.js")
let mta = require('../../libs/mta_analysis.js')
let self = null

Page({
    data:{
        windowWidth: 375,
        info: {}
    },
    callMe: function(e) {
        rocker.callMe(e.currentTarget.id)
    },
    openPosition: function(e) {
        map.openPosition( e.currentTarget.id, function(isSuccess, errMsg) {
            if (!isSuccess) {
                rocker.setTopErrMsg(self,errMsg)
            }
        })
    },
    onLoad: function() {
        mta.Page.init()
        self = this
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    leftHead: (res.windowWidth * 0.95 - 113) / 2,
                    windowWidth:res.windowWidth
                })
            }
        })
        self.ref = app.getRefBypath('drBang2/aboutUs')
        self.ref.on('child_added', function(snapshot, prKey) {
            let key = snapshot.key()
            let text = snapshot.val()
            self.data.info[key] = text
            self.setData({ info: self.data.info })
        },self)
    }
})