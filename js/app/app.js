/**
 * Created by leroy on 2017/8/1.
 */
var app = angular.module('myApp', ['ui.bootstrap','ui.router','ngAnimate','myApp.services','ngFileUpload','ui.grid','ui.grid.selection','ui.grid.resizeColumns','ui.grid.autoResize','ui.grid.edit','ui.grid.exporter','ui.grid.pagination','ui.grid.cellNav'])
    .config(["$stateProvider","$urlRouterProvider","$httpProvider",  function ($stateProvider,$urlRouterProvider,$httpProvider) {
    $urlRouterProvider.when("", "/login");
    $stateProvider
        .state("login", {
            url: '/login',
            templateUrl:'login.html',
            controller:'loginCtrl'
        })
        .state("main", {
            url: '/main',
            templateUrl:'main.html',
            controller:'mainCtrl'
        })
        .state("main.Cust", {
            url: '/cust',
            templateUrl:'templates/emp/cust.html',
            controller:'custCtrl'
        })
        .state("main.FundOut", {
            url: '/fundOut',
            templateUrl:'templates/fund/fundOut.html',
            controller:'fundOutCtrl'
        })
        .state("main.FundDetail", {
            url: '/fundDetail',
            templateUrl:'templates/emp/employee.html',
            controller:'FundDetailCtrl'
        })
        .state("main.OrderList", {
            url: '/orderList',
            templateUrl:'templates/order/orderlist.html',
            controller:'orderCtrl'
        })
        .state("main.UserQueryView", {
            url: '/user',
            templateUrl:'templates/sys/user.html',
            controller:'userCtrl'
        })
        .state("main.Dictionary", {
            url: '/dictionary',
            templateUrl:'templates/sys/dictionary.html',
            controller:'configCtrl'
        })
        .state("main.Activities", {
            url: '/activities',
            templateUrl:'templates/sys/activities.html',
            controller:'actCtrl'
        })
        .state("main.SearchLog", {
            url: '/searchLog',
            templateUrl:'templates/sys/searchLog.html',
            controller:'searchLogCtrl'
        })
        .state("main.OperLog", {
            url: '/operLog',
            templateUrl:'templates/sys/operLog.html',
            controller:'operLogCtrl'
        })
        .state("main.Banner", {
            url: '/banner',
            templateUrl:'templates/sys/banner.html',
            controller:'bannerCtrl'
        })
        .state("main.CarePickGoods", {
            url: '/carePickGoods',
            templateUrl:'templates/goods/carePickGoods.html',
            controller:'carePickGoodsCtrl'
        })
        .state("main.TogetherBuyGoods", {
            url: '/togetherBuyGoods',
            templateUrl:'templates/goods/togetherBuyGoods.html',
            controller:'togetherBuyGoodsCtrl'
        })
        .state("main.FansJDCarePickGoods", {
            url: '/fansJDCarePickGoods',
            templateUrl:'templates/goods/fansJDCarePickGoods.html',
            controller:'fansJDCarePickGoodsCtrl'
        })
        .state("main.KplJDSecKill", {
            url: '/kplJDSecKill',
            templateUrl:'templates/goods/kplJDSecKill.html',
            controller:'kplJDSecKillCtrl'
        })
        .state("main.SecKillActivity", {
            url: '/secKillActivity',
            templateUrl:'templates/goods/secKillActivity.html',
            controller:'secKillActivityCtrl'
        })
        .state("main.RankInfo", {
            url: '/rankInfo',
            templateUrl:'templates/goods/rankInfo.html',
            controller:'rankInfoCtrl'
        })
    $urlRouterProvider.otherwise('/login');
    $httpProvider.interceptors.push('timestampMarker');
}]);
app .run(['$rootScope','$state', '$http','$stateParams','$q','BusiServ','UtilService','$location', function($rootScope, $state,$http,$stateParams,$q,BusiServ,UtilService,$location){
    $rootScope.islogin = getCookie("islogin")=='true'?true:false;
    $rootScope.sessionId = getCookie("sessionId");
    //alert($rootScope.sessionId);
    //$rootScope.loginUser={}; //会员信息

    $rootScope.pageSize = 15;   //默认每页显示的条数
    $rootScope.pageSizeOps =  [{id:"10",value:"10"},{id:"20",value:"20"},{id:"50",value:50},{id:"100",value:"100"}];
    $rootScope.sexs = [{id:1,value:"男"},{id:2,value:"女"}];
    //console.log($rootScope.loginUser);
    if($location.url()!='/login' && $location.url() !='/enroll'){
        if(!$rootScope.islogin){    //未登录的情况直接跳转到登录页面,判断是否是报名页面
            $location.url("/login");
        }else{
            /*UtilService.getData("sys/getLoginInfo.action", {}).then(function (data) {
                console.log(data,"data");
                if (data.success == '0000') {
                    $rootScope.loginUser = data.loginUser;
                    // $state.go("main");
                } else {
                    $rootScope.islogin=false;
                    document.cookie = "islogin=false";
                    $location.url("/login");
                }
            });*/
            //TODO 校验登录信息
        }
    }

    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        if(toState.name=='login')return;// 如果是进入登录界面则允许
        // 如果用户不存在
        if(!$rootScope.user || !$rootScope.islogin){
            event.preventDefault();// 取消默认跳转行为
            $state.go("login");//跳转到登录界面
        }
    });

    //BusiServ.dict();
    $rootScope.open=false;
    $rootScope.msAlertModalConfig={
        sureText:'确定',
        titleText:'标题',
        contentText:'提示内容'
    }
    $rootScope.menus =[
        //雇员信息管理
        {   "code": "emp", "name": "会员账户管理", "level": "0", "parentcode": "" },
        {   "code": "Cust", "name": "会员信息查询", "level": "1", "parentcode": "emp" },
        {   "code": "FundOut", "name": "提现管理", "level": "1", "parentcode": "emp" },
        //{   "code": "fundDetail", "name": "资金明细查询", "level": "1", "parentcode": "emp" },
        {   "code": "order", "name": "订单管理", "level": "0", "parentcode": "" },
        {   "code": "OrderList", "name": "订单列表", "level": "1", "parentcode": "order" },
        //系统管理
        {   "code": "sys", "name": "系统管理", "level": "0", "parentcode": "" },
        {   "code": "UserQueryView", "name": "用户管理", "level": "1", "parentcode": "sys" },
        {   "code": "Dictionary", "name": "系统配置", "level": "1", "parentcode": "sys" },
        {   "code": "Activities", "name": "活动配置", "level": "1", "parentcode": "sys" },
        {   "code": "Banner", "name": "轮播图配置", "level": "1", "parentcode": "sys" },
        {   "code": "SearchLog", "name": "搜索记录", "level": "1", "parentcode": "sys" },
        {   "code": "OperLog", "name": "用户操作记录", "level": "1", "parentcode": "sys" },
        //商品管理
        {   "code": "goods", "name": "商品管理", "level": "0", "parentcode": "" },
        {   "code": "CarePickGoods", "name": "精选商品池查询", "level": "1", "parentcode": "goods" },
        {   "code": "TogetherBuyGoods", "name": "拼购商品池查询", "level": "1", "parentcode": "goods" },
        {   "code": "FansJDCarePickGoods", "name": "京粉精选商品查询", "level": "1", "parentcode": "goods" },
        {   "code": "KplJDSecKill", "name": "开普勒京东秒杀查询", "level": "1", "parentcode": "goods" },
        {   "code": "SecKillActivity", "name": "京东秒杀活动查询", "level": "1", "parentcode": "goods" },
        {   "code": "RankInfo", "name": "根据id获取排行榜数据", "level": "1", "parentcode": "goods" }

    ]
}]);
