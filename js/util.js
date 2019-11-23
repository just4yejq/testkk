/**
 * Created by leroy on 2017/8/7.
 */
var baseUrl = '192.168.1.1/';
var getCookie = function (name){
    console.log(document.cookie);
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    var coo= decodeURI(document.cookie);
    if(arr=coo.match(reg)) return arr[2];
    else return null;
};
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
var getCacheUser = function (cookie_str) {
    if(getCookie("islogin")=='true'){
        return angular.fromJson(getCookie("_user"));
    }else{
        return null;
    }

}
var getNowFormatDate = function() {

    var date = new Date();

    var seperator1 = "-";

    var seperator2 = ":";

    var month = date.getMonth() + 1;

    var strDate = date.getDate();

    if (month >= 1 && month <= 9) {

        month = "0" + month;

    }

    if (strDate >= 0 && strDate <= 9) {

        strDate = "0" + strDate;

    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

        + " " + date.getHours() + seperator2 + date.getMinutes()

        + seperator2 + date.getSeconds();

    return currentdate;

}
var getOffDay = function(n){

    var date = new Date;

    date.setDate(date.getDate() - n);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;

}
//删除数组指定元素
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    } return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
/**
 * 获取下前N个月的日期 返回格式yyyy-mm-dd
 * *
 */
function getOffMonth(offNum) {
    var date = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - offNum;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }else if (month2 < 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12 + month2;
    }

    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}
