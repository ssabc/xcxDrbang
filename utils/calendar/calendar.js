//calendar
var app = getApp()
var util = require( '../util.js' )
var arrow = require( '../arrow.js' )

function isLeapYear( year ) {
    return ( ( ( year % 4 ) == 0 ) && ( ( year % 100 ) != 0 ) || ( ( year % 400 ) == 0 ) )
}
function getDaysInMonth( year,month) {
    var days
    if( month in [ 1, 3, 5, 7, 8, 10, 12 ] ) {
        days = util.range( 31 )
    } else if( month in [ 4, 6, 9, 11 ] ) {
        days = util.range( 30 )
    } else if( month == 2 && isLeapYear( year ) ) {
        days = util.range( 29 );
    } else {
        days = util.range( 28 );
    }
    return days;
}

var week_lang = ['日','一','二','三','四','五','六']

class Calendar {
    constructor( firstweekday = 1) {
         this.firstweekday = firstweekday //# 0 = Sunday, 6 = Saturday
    }
    getweekheader(){
        return this.weekdays().map(function(i){ return week_lang[i]})
    }
    weekdays() {
        var i = null
        return util.range( this.firstweekday, this.firstweekday + 7 ).map( function( i ) {
            return i % 7
        })
    }
    monthdates( year, month ) {
        // console.log( year, month )
        var local_month = month - 1
        var date = new Date( year, local_month, 1 )
        var loop = true
        let days = ( date.getDay() - this.firstweekday ) % 7
        let days_amount = getDaysInMonth( year, month )
        let _max_deep = (days != -1)&&(days < 5 || ( days >= 5 && days_amount < 31 ) )? 35 : 42
       if( days==-1 )
            days =6 
        date = arrow.arrow.get( date ).replace( { days: -days }).get_date()
        var date_queue = []
        let counter = 0
        while( loop ) {
            try {
                if( counter >= _max_deep ) { break }
                date_queue.push( date )
                date = arrow.arrow.get( date ).replace( { days: 1 }).get_date()

            } catch( e ) {
                break
            }
            counter++
        }
        return date_queue      
    }

    monthdayscalendar( year, month, that,cb) {
        var isSucces = true, errMsg=''
        var that_t = this

        app.globalData.nowDate = new Date();

        var date_queue = that_t.monthdates( year, month ).map( function( date ) {

            let dat = [ date.getDay()]
            if( date.getMonth() != month - 1 ) {
                dat.unshift( 0 )
            } else {
                dat.unshift( date.getDate())
            }   
            return dat
        })
        var daysPerMonth = util.range( 0, date_queue.length, 7 ).map( function( x ) {
            return date_queue.slice( x, x + 7 )
        })
            that.setData({
                cal1: {
                    realYear: parseInt(app.globalData.nowDate.getFullYear()),
                    realMonth: parseInt(app.globalData.nowDate.getMonth()+1),
                    realDay: parseInt(app.globalData.nowDate.getDate()),
                    year: parseInt(year),
                    month: parseInt(month),
                    calendar: {
                        days: that.cal.getweekheader(),
                        weeks: daysPerMonth
                    }
                }
            })
            typeof cb == "function" && cb(isSucces,errMsg)
    }
}

module.exports = {
    Calendar: Calendar
}
