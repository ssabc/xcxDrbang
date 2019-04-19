
let formatPhone =(phoneCell) => {
    let t = phoneCell.toString()
    if(t.length == 11)
      t = phoneCell.substring(0,3)+"-"+phoneCell.substring(3,7)+"-"+phoneCell.substring(7,phoneCell.length)

  return t
}

let dateFormat = data =>{
      let fmt = "yyyy-MM-dd";
      let o = {
            "M+": data.getMonth() + 1, //月份 
            "d+": data.getDate(), //日 
            "h+": data.getHours(), //小时 
            "m+": data.getMinutes(), //分 
            "s+": data.getSeconds(), //秒 
            "q+": Math.floor((data.getMonth() + 3) / 3), //季度 
            "S": data.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
  let range = ( start, end, step = 0 ) => {
    let ary = []
    if( step > 0 ) {
        let distance = end - start
        let _end = parseInt( distance / step )
        for( let i = start;i < _end;i++ ) {
        ary.push( start + ( i * step ) )
        }
        if( distance % step > 0 ) { ary.push( end ) }
    }else if(start>-1&& end>0){
        for (let i = start;i<end;i++){
        ary.push(i)
        }
    } else {
        for( let i = 0;i < start;i++ ) {
        ary.push( i + step )
        }
    }
    return ary
}

 let setTopErrMsg = (that,errMsg) =>{
    that.setData({
        topHidden: false,
        topTipContent:errMsg || '系统异常'
      })
      setTimeout(function(){
          that.setData({
            topHidden: true
          })
      },3000)
  }
  let showLoading = ()=>{
      wx.showLoading({
        title: '加载中',
      })
   }
   let  callMe = phoneCell => {
        let phone_t = formatPhone(phoneCell)
        wx.showModal({
            title: '联系我们',
            content:phone_t,
            success: function(res) {
                if (res.confirm) {
                wx.makePhoneCall({
                    phoneNumber:phoneCell
                })
                }
            }
        })
    }

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hour >= 1 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minute >= 1 && minute <= 9) {
            minute = "0" + minute;
        }
        if (second >= 0 && second <= 9) {
            second = "0" + second;
        }
        var currentdate = date.getYear().toString().substr(-2) + seperator1 + month + seperator1 + strDate
                + " " + hour + seperator2 + minute
                + seperator2 + second;
        return currentdate;
    }

module.exports = { 
    callMe, 
    range, 
    dateFormat, 
    showLoading,
    formatPhone, 
    setTopErrMsg,
    getNowFormatDate
}
