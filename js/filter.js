
angular.module('myApp')
    //使用模块的filter()接口注册过滤器

/************START BY LESQ************************************/

    .filter("timeFilter",function(){
        //过滤时间，只保留日期
        return function(input) {
            if (input != null && input != "") {
                var ss = input.substring(0,10);
                return ss;
            }
        }
    }).filter("fixed",function(){
        var filter = function(num) {
            var s=num.toString();
            var len=s.length;
            for (i = 0; i < len; i++)
                if (s.charAt(len - 1 - i) != '0')   break;
            if (s.charAt(len - i - 1) == '.') return s.substring(0, len - i - 1);
            return s.substring(0, len - i);
        };
        return filter;
    }).filter("fen2yuan",function(){
        var filter = function(num) {
            return num/100;
        };
        return filter;
    }).filter("rate",function(){
        var filter = function(num) {
            return (num/1000)+"%";
        };
        return filter;
    }).filter("inoutFilter",function(){
        var filter = function(id) {
            if(id=='1'){
                return '待审核'
            }else if(id=='2'){
                return  '驳回'
            }else if(id=='10'){
                return  '已完成'
            }
        };
        return filter;
    }).filter("stateFilter",function(){
        var filter = function(id) {
            if(id=='1'){
                return '有效'
            }else if(id=='2'||id=='0'){
                return  '无效'
            }else if(id=='-1'){
                return  '删除'
            }
        };
        return filter;
    })
    .filter("accountTypeFilter",function(){
        var filter = function(id) {
            if(id=='1'){
                return '微信'
            }else if(id=='2'){
                return  '支付宝'
            }else{
                return  '其他'
            }
        };
        return filter;
    })
    .filter("sexFilter",function(){
        var filter = function(id) {
            if(id=='1'){
                return '男'
            }else if(id=='2'){
                return  '女'
            }
        };
        return filter;
    })
    .filter("configType",function(){
        var filter = function(id) {
            if(id=='1'){
                return '佣金比例分成'
            }else if(id=='2'){
                return  '京东账号配置'
            }else if(id=='3'){
                return  '微信小程序配置'
            }else if(id=='4'){
                return  '提现配置'
            }
        };
        return filter;
    })
    .filter("actType",function(){
        var filter = function(id) {
            if(id=='1'){
                return '京东618活动'
            }else if(id=='2'){
                return  '京粉活动'
            }else if(id=='3'){
                return  '开普勒活动'
            }else if(id=='4'){
                return  '双11活动'
            }
        };
        return filter;
    })
    .filter("operTypeFilter",function(){
        var filter = function(id) {
            if(id=='1'){
                return '登录'
            }else if(id=='2'){
                return  '查看商品'
            }else if(id=='3'){
                return  '分享商品'
            }else if(id=='4'){
                return  '分享小程序'
            }else if(id=='5'){
                return  '转链'
            }
        };
        return filter;
    })
    .filter("dateFilter",function(){
        //过滤器对象返回的是一个过滤函数
        var filter = function(input) {
            var ss = [];
            if (input != null && input != "") {
                ss = input.split(" ");
                return ss[0];
            }
        }
        return filter;
    })
    .filter("dict",function($rootScope){
        /*
         * id:状态值
         * key:值表类型（SEX	性别
                         ）
         * */
        var filter = function(id,key) {
            var ss =$rootScope.dictionarys[key];
            if(key=='DICT'){
                for(var i=0;i< ss.length;i++ ){
                    if(ss[i].typeCode==id){
                        return ss[i].typeName;
                    }
                }
            }
            if(typeof(id)=='string'){
                var tempArr = id.split(",");
                if(tempArr.length>1){   //逗号分组过滤返回
                    var str = "";
                    for(var i=0;i<tempArr.length;i++){
                        for(var i=0;i< ss.length;i++ ){
                            if(ss[i].dataKey==tempArr[i]){
                                str = str+ss[i].dataValue;
                                if(i<tempArr.length-1){
                                    str = str+",";
                                }
                                continue;
                            }
                        }
                    }
                    return str;
                }else{
                    for(var i=0;i< ss.length;i++ ){
                        if(ss[i].id==id){
                            return ss[i].dataValue;
                        }
                    }
                }
            }else{
                for(var i=0;i< ss.length;i++ ){
                    if(ss[i].id==id){
                        return ss[i].dataValue;
                    }
                }
            }
        };
        return filter;
    })
    .filter("pageType",function(){
        var filter = function(id) {
            if(id=='1'){
                return '页面链接'
            }else if(id=='2'){
                return  '商品列表'
            }else if(id=='3'){
                return  '内容详情'
            }else if(id=='4'){
                return  '微信小程序'
            }
        };
        return filter;
    })
    .filter("goodsPkg",function($rootScope){
         var filter = function(id) {
                var tmp;
                angular.forEach($rootScope.rgoodsPackages, function(item){
                    if(id==item.id){
                        tmp= item.name;
                        return;
                    }
                });
                return tmp;
        };
        return filter;
    })
    .filter("hasOrNot",function(){
        var filter = function(id) {
            if(0==id){
                return "无";
            }else if(1==id){
                return "有";
            }
        };
        return filter;
    })
    .filter("isOrNot",function(){
        var filter = function(id) {
            if(0==id){
                return "否";
            }else if(1==id){
                return "是";
            }
        };
        return filter;
    })
    .filter("seeChildList",function(){
        var filter = function(id) {
            if('unionCouponList'==id){
                return '<a>查看</a>';
            }
        };
        return filter;
    })
    .filter("trueOrFalse",function(){
        var filter = function(id) {
            if('true'==id){
                return "是";
            }else if('false'==id){
                return "否";
            }
        };
        return filter;
    })
    .filter("oneArray",function(){
        var filter = function(id,key) {
            if(id!=null){
                if('couponKind'==key){
                    return bindTypeTransLate(id[0][key]);
                }
                return id[0][key];
            }else{
                return id;
            }

        };
        return filter;
    })
    .filter("twoLayerArray",function(){
        var filter = function(id,key,key2) {
            if('bindType'==key2){
                return bindTypeTransLate(id[0][key][0][key2]);
            }else if('platformType'==key2){
                return platformTypeTransLate(id[0][key][0][key2]);
            }else if('isBest'==key2){
                return isOrNotTransLate(id[0][key][0][key2]);
            }else if('getStartTime'==key2){
                // console.log(new Date(id[0][key][0][key2]).toLocaleDateString(),new Date(id[0][key][0][key2]).toLocaleTimeString(),new Date(id[0][key][0][key2]).toLocaleString())
                // return new Date(id[0][key][0][key2]).toLocaleDateString();
            }
            return id[0][key][0][key2];
        };
        return filter;
    })
    .filter("oneMap",function(){
        var filter = function(id,key) {

            return id[key];
        };
        return filter;
    })
    .filter("twoLayerMap",function(){
        var filter = function(id,key,key2) {
            // console.log(id,key,key2);
            if('bindType'==key2){
                return bindTypeTransLate(id[key][0][key2]);
            }else if('platformType'==key2){
                return platformTypeTransLate(id[key][0][key2]);
            }else if('isBest'==key2){
                return isOrNotTransLate(id[key][0][key2]);
            }else if('getStartTime'==key2){
                return new Date(id[key][0][key2]).toLocaleString();
            }else if('getEndTime'==key2){
                return new Date(id[key][0][key2]).toLocaleString();
            }else if('useStartTime'==key2){
                return new Date(id[key][0][key2]).toLocaleString();
            }else if('useEndTime'==key2){
                return new Date(id[key][0][key2]).toLocaleString();
            }
            return id[key][0][key2];
        };
        return filter;
    })
    .filter("ownerFilter",function(){
        var filter = function(id) {
            if("p"==id){
                return "开放平台";
            }else if("g"==id){
                return "自营";
            }
            return id;
        };
        return filter;
    })
    .filter("dateLongFilter",function(){
        var filter = function(id) {
            return new Date(id).toLocaleString();;
        };
        return filter;
    })
    .filter("promoTagList",function(){
        var filter = function(id) {
            console.log(id,id.length);
            console.log(id==false);
            if(id==false){
                return "";
            }
            return id.join();
        };
        return filter;
    });


    //----自定义方法---------
    function  bindTypeTransLate(key2) {
        if(0==key2){
            return "全品类";
            // '0 - '全品类，1 - 限品类（自营商品），2 - 限店铺，3 - 店铺限商品券)
        }else if(1==key2){
            return "限品类（自营商品）";
        }else if(2==key2){
            return "限店铺";
        }else if(3==key2){
            return "店铺限商品券";
        }
    }
    function  platformTypeTransLate(key2) {
        if(0==key2){
            return "全平台券";
            // 	券使用平台 (平台类型：0 - 全平台券，1 - 限平台券)
        }else if(1==key2){
            return "限平台券";
        }
    }
    function  isOrNotTransLate(key2) {
        if(0==key2){
            return "否";
            // 	1：是；0：否
        }else if(1==key2){
            return "是";
        }
    }
Date.prototype.toLocaleString = function() {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};







