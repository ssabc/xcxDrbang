let calendar = require('../../utils/calendar/calendar.js')
let rocker = require('../../utils/util.js')
let mta = require('../../libs/mta_analysis.js')
let app = getApp()
let self = null

Page({
  data: {
    activeIndex: '0',
    sliderOffset: 0,
    sliderLeft: 0,
    cal1: {
      calendar: { 
        weeks: [
          ['1', ' 2', '3', ' 4', ' 5', ' 6', ' 7'],
          [' 8', ' 9', '10', '11', '12', '13', '14'],
          [15, 16, 17, 18, 19, 20, 21],
          [22, 23, 24, 25, 26, 27, 28],
        ]
      }
    },
    sx12arrys: ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'],
    sxIndex: 1

  },
  onShareAppMessage: function() {
     return {
        title: '多肉邦-简单日历',
        path: '/pages/calendar/index'
      }
   },
  onLoad: function (options) {
    mta.Page.init()
    self = this

    self.nowDate = new Date()
    self.cal = new calendar.Calendar()
    let dates = self.cal.monthdayscalendar(self.nowDate.getFullYear(), self.nowDate.getMonth() + 1, self, function(isSucces, errMsg) {
        if (!isSucces) {
          rocker.setTopErrMsg(self, errMsg)
        } else {
          self.getSXByYear(self, self.data.cal1.year)
        }
    })
  },
  change_calendar_view: function (year, month) {
      self.cal.monthdayscalendar(year, month,self, function(isSucces, errMsg) {
        if (!isSucces) {
            rocker.setTopErrMsg(self, errMsg)
        } else {
          self.getSXByYear(self, self.data.cal1.year)
        }
    })
  },
  getSXByYear(self, year) {
    let t = year -  2007, endT = 0
    if (t >0) {
        self.setData({
          sxIndex: t % 12
        })
    } else {
        self.setData({
           sxIndex: 12 - (( t * -1 ) % 12)
        })
    }
  },
  premonth: function (e) { 
    let month = (self.data.cal1.month - 1)
    let year_diff = (month == 0) ? -1 : 0
    month = (month == 0) ? 12 : month
    self.change_calendar_view(self.data.cal1.year + year_diff, month)
  },
  nextmonth: function (e) {
    let year_diff = parseInt(self.data.cal1.month / 12)
    let month = (self.data.cal1.month + 1)
    month = (self.data.cal1.month % 12) + 1

    self.change_calendar_view(self.data.cal1.year + year_diff, month)
  },
  daytap: function (e) {
    let pos = e.currentTarget.dataset.idx.split(',')
    let week = pos[0], day = pos[1]
    let dat = self.data.cal1.calendar.weeks[week][day]
  }
})