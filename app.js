let wilddog = require('./libs/wilddog-weapp-all')
let baseConfig = require("./config.js")
let mta = require('./libs/mta_analysis.js')
let appSelf = null

App({
  onLaunch: function (options) {
    appSelf = this
    // 腾讯统计事件
    mta.App.init({
      'appID': baseConfig.mtaInfo.mta_appid,
      'eventID': baseConfig.mtaInfo.mta_eventid,
      'statPullDownFresh': baseConfig.mtaInfo.mta_statPullDownFresh,
      'statShareApp': baseConfig.mtaInfo.mta_statShareApp,
      'statReachBottom': baseConfig.mtaInfo.mta_statReachBottom
    });

    // 野狗服务器
    let config = {
      syncURL: 'https://drbang.wilddogio.com/',
      authDomain: 'drzwbang.wilddog.com'
    }
    wilddog.initializeApp(config)
    appSelf.ref = wilddog.sync().ref('/')
    appSelf.globalData.ref = appSelf.ref
    // 这个地方使用野狗登录微信小程序的方法,可以获得微信返回的openId,用户名称等等信息,这些信息会存在野狗的控制台的身份人认证部分。
    wilddog.auth().signInWeapp().then(function(user){
    }).catch(function(err){
      console.log(err);
    })
  },
  getRefBypath (str) {
    return appSelf.ref.child(str)
  },
  getUserInfo (cb) {
    if (appSelf.globalData.userInfo) {
      typeof cb == "function" && cb(appSelf.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              appSelf.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(appSelf.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getTabPagePathArr () {
    return JSON.parse(appSelf.globalData.tabBarPagePathArr)
  },
  getAppId () {
    return appSelf.globalData.appId
  },
  getSessionKey () {
    return appSelf.globalData.sessionKey;
  },
  setSessionKey (session_key) {
    appSelf.globalData.sessionKey = session_key;
    wx.setStorage({
      key: 'session_key',
      data: session_key
    })
  },
  turnToPage (url, isRedirect) {
    let tabBarPagePathArr = appSelf.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if (tabBarPagePathArr.indexOf(url) != -1) {
      appSelf.switchToTab(url);
      return
    }
    if (!isRedirect) {
      wx.navigateTo({
        url: url
      })
    } else {
      wx.redirectTo({
        url: url
      })
    }
  },
  modifyPostParam (obj) {
    let query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += appSelf.modifyPostParam(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += appSelf.modifyPostParam(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  globalData:{
    isNeedRefrushhome: false, // 是否刷新首页
    isNeedRefrushTujian: false, // 是否刷新图鉴页面
    isNeedRefrushSX: false, // 是否刷新sxDetail页面
    imgDomain: 'http://w.bw9.org/',
    appId: 'Z3Qj0zZR0r',
    sessionKey: '',
    notBindXcxAppId: false,
    userInfo: null,
    ref: null,
    siteBaseUrl: 'https://xcx.yingyonghao8.com',
    tabBarPagePathArr: '["/pages/index/index", "/pages/category/index", "/pages/aboutMe/index"]'
  }
})