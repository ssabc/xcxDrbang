  // 引入SDK核心类

//   日调用量：1万次 / Key
//   并发数：5次 / key / 秒 。
var baseConfig = require("../config.js");
let QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
    key: baseConfig.mapKey
});
  let openPosition = (name,cb) => {
      let [isSuccess, errMsg] =[true, '']

      // 调用接口
      qqmapsdk.geocoder({
          address: name,
          success: function(res) {
          if(res.status == 0){
            let latitude = res.result.location.lat
            let longitude = res.result.location.lng
            wx.openLocation({
              latitude: latitude,
              longitude: longitude,
              scale: 18,
              name: name
            })
          }else{
              isSuccess = false
              errMsg =  res.msg
          }
         console.log("【打开相应地址的地图】: "+"city: "+name+"经纬度： "+res.result.location.lat+", "+res.result.location.lng)
          },
          fail: function(res) {
              isSuccess = false
              errMsg = '服务器异常!'
          },
          complete: function(res) {
              typeof cb == "function" && cb(isSuccess,errMsg || '系统异常')
          }
      });
    };

  let getCityByJW = (latitude, longitude,cb) => {
      let [isSuccess, errMsg, city] =[true, '', '']
      // 调用接口
      qqmapsdk.reverseGeocoder({
          location: {
              latitude: latitude,
              longitude: longitude
          },
          success: function(res) {
              // console.log("getCityByJW="+JSON.stringify(res));
              if(res.status == 0){
                  city = res.result.address_component.city.substring(0,res.result.address_component.city.length-1)
                //   console.log(city)
              }else{
                isSuccess = false
                errMsg = res.msg
              }        
             console.log("【通过经纬度得到城市名】：city"+city+" latitude="+latitude+", longitude="+longitude)
          },
          fail: function(res) {
              isSuccess = false
              errMsg = '服务器异常!'
          },
          complete: function(res) {
              typeof cb == "function" && cb(city,isSuccess,errMsg || '系统异常')
          }
      });
    };

  let  getJWByCity = (city,cb) => {
      let [isSuccess, errMsg, latitude, longitude] =[true, '', '', '']
      // 调用接口
      qqmapsdk.geocoder({
          address:city,
          success: function(res) {
          if(res.status == 0){
            latitude = res.result.location.lat
            longitude = res.result.location.lng
          }else{
              isSuccess = false
              errMsg =  res.msg
          }
          },
          fail: function(res) {
              isSuccess = false
              errMsg = '服务器异常!'
          },
          complete: function(res) {
              console.log("【通过城市名得到经纬度】：city: "+city+" latitude="+latitude+", longitude="+longitude)
              typeof cb == "function" && cb(latitude, longitude, isSuccess,errMsg || '系统异常')
          }
      });
    };

module.exports = {openPosition,getCityByJW,getJWByCity}