/**
 * Created by leroy on 2017/7/31.
 */
app.controller('loginCtrl', function($rootScope,$scope,$state,$location, UtilService,modalService) {
        $scope.params = {userName: '', passWord: ''};
        $scope.msg = "请输入用户名和密码.";
        $scope.login = function () {
            UtilService.getData("sys/login", $scope.params).then(function (res) {
                console.log("res",res);
                if (res.meta.code == '0') {
                    $rootScope.islogin = true;
                    document.cookie = "islogin=true;sessionId="+res.data;
                    $scope.cookie_user = {
                        userName:'系统管理员'
                    }
                    document.cookie = "sessionId="+res.data;
                    $rootScope.sessionId = res.data;
                    $state.go("main");
                } else {
                    $scope.msg =res.meta.msg;
                    layer.msg(res.meta.msg, {icon: 5});//哭脸
                }
            });
        }
    })
    .controller('mainCtrl', function($rootScope,$scope,$state,$uibModal,$interval, UtilService) {
        $scope.loginUser = $rootScope.loginUser;
        // 打开树形菜单，定义一个函数navFunc， 接受一个参数
        $scope.navFunc = function (arg) {
            if($scope.navAction ==arg) {
                $scope.navAction="";
            } else{
                // 让navAction变量等于函数传入过来的值arg
                $scope.navAction = arg;
            }
        };
        $scope.loginOut = function () {
            $rootScope.islogin = false;
            document.cookie = "islogin=false";
            $state.go("login");
           /* UtilService.getData("sys/loginOut.action", $scope.params).then(function (data) {
                // if (data.success == '0000') {
                    $rootScope.loginUser = {};

            }, function (data) {
                alert(data.msg)//错误时走这儿
            });*/
        }
        $state.go("main.Employee");
        //页面跳转
        $scope.uiSerf = function (str) {
            var state = "main."+str;
            $state.go(state);
        }
        $scope.checkFlag = null;
        $scope.pwd = {oldPwd:'',newPwd:'',rempPwd:''};
        $scope.checkPwd = function () {
            UtilService.getData("sys/checkOldPwd.action", {inputPwd:$scope.pwd.oldPwd}).then(function (data) {
                if (data.success == '0000') {
                    $scope.checkFlag = true;
                }else{
                    $scope.checkFlag = false;
                }
                layer.msg(data.msg);
            });
        }
        $scope.updPwd = function () {
            if($scope.checkFlag==true){
                UtilService.getData("sys/updPwd.action", {newPwd:$scope.pwd.newPwd}).then(function (data) {
                    if (data.success == '0000') {
                        $scope.checkFlag = true;
                        var colseButton=document.getElementById('pwd_colseButton');
                        console.log(document);
                        colseButton.click();
                        layer.alert('修改成功，请重新登录', function(index){
                            layer.close(index);
                            $state.go("login");
                        });
                    }else{
                        layer.msg(data.msg,{icon:5});
                    }
                });
            }else{
                layer.alert('请先校验原密码');
                return;
            }
        }
        $scope.window_close = function () {
            layer.confirm('确认关闭窗口？',{
                yes:function(){
                    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
                            window.location.href="about:blank";
                            window.close();
                        } else {
                            window.opener = null;
                            window.open("", "_self");
                            window.close();
                        }

                }
            });
        }
    })
    .controller('orderCtrl', function($rootScope,$scope, UtilService,GridService) {
        $scope.statusTypes = [{"id":0,"value":"全部"},{"id":1,"value":"待结算"},{"id":2,"value":"已结算"},{"id":3,"value":"已失效"}];
        $scope.params = {
            pageSize:15,
            pageNum:1,
            orderId:'',
            nickName:'',
            orderTime:'',
            statusType:0
        }
        //操作接口
        $scope.operations = {
            "query":"sys/getOrderList"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
        console.log($scope.gridOptions.data,"scope.gridOptions.data");

        $scope.gridOptions.columnDefs = [{ field:'index',name:'id',
            displayName: '序号',
            width: '70',
            enableColumnMenu: true,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: false,
            enableCellEdit: false,// 是否可编辑
            cellTemplate : '<div ng-bind="(grid.appScope.params.pageNum-1)*grid.appScope.params.pageSize+rowRenderIndex+1" style="padding-left: 20px;"> </div>'
        },
            { field: "nickName", displayName: '会员名称'},
            { field: "orderId", displayName: '订单id'},
            { field: "skuName", displayName: '订单商品信息'},
            //{ field: "skuNum", width:'60',displayName: '数量'},
            { field: "skuAmt", displayName: '计价金额',cellFilter:'fen2yuan'},
            { field: "orderTime", displayName: '下单时间'},
            { field: "estimateFee", displayName: '订单预计佣金',cellFilter:'fen2yuan'},
            { field: "actualFee", displayName: '订单实际佣金',cellFilter:'fen2yuan'},
            { field: "userActualFee", displayName: '会员佣金',cellFilter:'fen2yuan'},
            { field: "commissionRate", displayName: '会员佣金比例',cellFilter:'rate'},
            { field: "spreadEstimateFee", displayName: '推荐人预计佣金',cellFilter:'fen2yuan'},
            { field: "spreadActualFee", displayName: '推荐人实际佣金',cellFilter:'fen2yuan'},
            // { field: "userId", displayName: '会员id'},
            { field: "orderStatusView", displayName: '订单状态'},
            /*{
                width: '130',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: true,// 是否显示列头部菜单按钮
                enableHiding: true,
                enableCellEdit: false,
                // cellTemplate : '<div class="container-fluid"><div class="row cell-action-style"><div class="col-xs-3 text-center"><div class="div-click"  ng-click="grid.appScope.update(row)"><span class="glyphicon glyphicon-edit" aria-hidden="true">保存</span></div></div><div class="col-xs-3 text-center" ><div class="div-click"  ng-click="grid.appScope.del(row)"><span class="glyphicon glyphicon-remove" >删除</span></div></div><div></div></div></div>'
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.updateRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>修改 </a>' +
                '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'
            }*/
        ];

    })

    .controller('fundOutCtrl', function($rootScope,$scope, UtilService,GridService) {
        $scope.fundInoutStates =  [{id:1,value:"待审核"},{id:2,value:"驳回"},{id:10,value:"已完成"}];
        $scope.params = {
            pageSize:15,
            pageNum:1,
            state:null,
            inorout:2,
            accountNo:'',  //提现账号
            nickName:''
        }
        //操作接口
        $scope.operations = {
            "query":"sys/queryFundInoutList"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
        console.log($scope.gridOptions.data,"scope.gridOptions.data");

        $scope.gridOptions.columnDefs = [{ field:'index',name:'id',
            displayName: '序号',
            width: '70',
            enableColumnMenu: true,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: false,
            enableCellEdit: false,// 是否可编辑
            cellTemplate : '<div ng-bind="(grid.appScope.params.pageNum-1)*grid.appScope.params.pageSize+rowRenderIndex+1" style="padding-left: 20px;"> </div>'
        },
            { field: "nickName", displayName: '会员名称'},
            { field: "amount", displayName: '金额(元)',cellFilter:'fen2yuan'},
            { field: "accountType", displayName: '账号类型',cellFilter:'accountTypeFilter'},
            { field: "accountName", displayName: '收款人名称'},
            { field: "accountNo", displayName: '账号'},
            { field: "createTime", displayName: '申请时间'},
            { field: "remark", displayName: '备注'},
            { field: "state", displayName: '状态',cellFilter:'inoutFilter'},
            {
                width: '100',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: true,// 是否显示列头部菜单按钮
                enableHiding: true,
                enableCellEdit: false,
                // cellTemplate : '<div class="container-fluid"><div class="row cell-action-style"><div class="col-xs-3 text-center"><div class="div-click"  ng-click="grid.appScope.update(row)"><span class="glyphicon glyphicon-edit" aria-hidden="true">保存</span></div></div><div class="col-xs-3 text-center" ><div class="div-click"  ng-click="grid.appScope.del(row)"><span class="glyphicon glyphicon-remove" >删除</span></div></div><div></div></div></div>'
                cellTemplate : '<a ng-if="row.entity.state==1" class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.audit(row.entity)"> <i class="glyphicon glyphicon-edit icon-white"></i>审核 {{state}} </a>'
                    /*+
                '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'*/
            }
        ];
        $scope.audit = function (model) {
            $scope.model = model
        }
        $scope.auditFund = function (id,state,remark) {
            $scope.auditParams = {"id":id,"state":state,"remark":remark};
            console.log($scope.auditParams);
            UtilService.getData("sys/auditFundOut", $scope.auditParams).then(function (res) {
                console.log("res",res);
                if (res.meta.code == '0') {
                    layer.msg("操作成功")
                    var modalId = "#myModal";
                    $(modalId).modal("hide");
                } else {
                    layer.msg(res.meta.message, {icon: 5});//哭脸
                }
            });
        }

    })
    .controller('userCtrl', function($rootScope,$scope, UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1,
            userCode:'',
            userName:'',
            ids:[]
        }
        //操作接口
        $scope.operations = {
            "add":"sys/saveUser.action",
            "upd":"sys/saveUser.action",
            "del":"sys/deleteUser.action",
            "query":"sys/syslist"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
        console.log($scope.gridOptions.data,"scope.gridOptions.data");

        $scope.gridOptions.columnDefs = [{ field:'index',name:'id',
            displayName: '序号',
            width: '70',
            enableColumnMenu: true,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: false,
            enableCellEdit: false,// 是否可编辑
            cellTemplate : '<div ng-bind="(grid.appScope.params.pageNum-1)*grid.appScope.params.pageSize+rowRenderIndex+1" style="padding-left: 20px;"> </div>'
        },
            { field: "userCode", displayName: '用户名'},
            { field: "userName", displayName: '姓名'},
            { field: "departmentName", displayName: '部门'},
            { field: "userDuties", displayName: '职务'},
            { field: "telephone", displayName: '电话号码'},
            {
                width: '130',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: true,// 是否显示列头部菜单按钮
                enableHiding: true,
                enableCellEdit: false,
                // cellTemplate : '<div class="container-fluid"><div class="row cell-action-style"><div class="col-xs-3 text-center"><div class="div-click"  ng-click="grid.appScope.update(row)"><span class="glyphicon glyphicon-edit" aria-hidden="true">保存</span></div></div><div class="col-xs-3 text-center" ><div class="div-click"  ng-click="grid.appScope.del(row)"><span class="glyphicon glyphicon-remove" >删除</span></div></div><div></div></div></div>'
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.updateRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>修改 </a>' +
                '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'
            }
        ];
        $scope.changePwd = function () {
            $scope.model.pwdFlag=true;
        }
    })
    .controller('dictionaryCtrl', function($rootScope,$scope, UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1,
            typeCode:''
        }
        $scope.enabledArr = [{id:1,value:'有效'},{id:2,value:'无效'}];
        //操作接口
        $scope.operations = {
            "add":"sys/saveDict.action",
            "upd":"sys/saveDict.action",
            "del":"sys/deleteDict.action",
            "query":"sys/queryDictionary.action"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
        console.log($scope.gridOptions.data,"scope.gridOptions.data");

        $scope.gridOptions.columnDefs = [
            { field:'id',
                displayName: 'id',
                width: '70'
            },
            { field: "typeCode", displayName: '配置类型',cellFilter:'dict:"DICT"'},
            // { field: "dataKey", displayName: '数据库值'},
            { field: "dataValue", displayName: '配置描述'},
            { field: "dataRemark", displayName: '备注'},
            { field: "enabled", displayName: '状态',cellFilter:'stateFilter'},
            { field: "extend1", displayName: '属性1'},
            { field: "extend2", displayName: '属性2'},
            { field: "extend3", displayName: '属性3',cellFilter:'dict:"SITE_NUMBER"'},
            {
                width: '130',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: true,// 是否显示列头部菜单按钮
                enableHiding: true,
                enableCellEdit: false,
                // cellTemplate : '<div class="container-fluid"><div class="row cell-action-style"><div class="col-xs-3 text-center"><div class="div-click"  ng-click="grid.appScope.update(row)"><span class="glyphicon glyphicon-edit" aria-hidden="true">保存</span></div></div><div class="col-xs-3 text-center" ><div class="div-click"  ng-click="grid.appScope.del(row)"><span class="glyphicon glyphicon-remove" >删除</span></div></div><div></div></div></div>'
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.updateRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>修改 </a>' +
                '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'
            }
        ];

        $scope.callControll = function(obj){
            console.log(obj,"obj");
            if(obj.id ==null || obj.id ==undefined){
                $rootScope.dictionarys.SITE_NUMBER.push(obj);
            }else{
                for(var i=0;i<$rootScope.dictionarys.SITE_NUMBER.length;i++){
                    if($rootScope.dictionarys.SITE_NUMBER[i].id == obj.id){
                        $rootScope.dictionarys.SITE_NUMBER.splice(i,1);
                    }
                }
                $rootScope.dictionarys.SITE_NUMBER.push(obj);
            }
            console.log($rootScope.dictionarys,"$rootScope.dictionarys");
        }
    })
    .controller('custCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1,
            nickName:'',
            parentNickName:''
        }
        //操作接口
        $scope.operations = {
            "query":"sys/queryCustList.action"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
        $scope.getUserFund = function (value) {
            $scope.userIdParams = {"keyStr":value};
            UtilService.getData("sys/queryUserFundByUserId", $scope.userIdParams).then(function (res) {
                console.log("res",res);
                if (res.meta.code == '0') {
                    $scope.userFund = res.data;
                } else {
                    $scope.msg =res.meta.msg;
                    layer.msg(res.meta.msg, {icon: 5});//哭脸
                }
            });
        }

        $scope.gridOptions.columnDefs = [{ name:'id',
            displayName: '序号',
            width: '70',
            enableColumnMenu: true,// 是否显示列头部菜单按钮
            enableHiding: false,
            suppressRemoveSort: false,
            enableCellEdit: false,// 是否可编辑
            cellTemplate : '<div ng-bind="(grid.appScope.params.pageNum-1)*grid.appScope.params.pageSize+rowRenderIndex+1" style="padding-left: 20px;"> </div>'
        },
            { field: "userId",width: '80', displayName: 'userId'},
            { field: "nickName", displayName: '用户昵称'},
            { field: "parentName", displayName: '推荐人'},
            { field: "sex", width: '50',displayName: '性别',cellFilter:'sexFilter'},
            { field: "nativePlace", displayName: '所在地'},
            //{ field: "phone", displayName: '电话号'},
            { field: "referralCode", displayName: '推广码'},
            //{ field: "state", displayName: '状态',cellFilter:'stateFilter'},
            { field: "createTime", displayName: '注册时间'},

            // { field: "applyPost", displayName: '应聘职位'},
            {
                width: '100',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.getUserFund(row.entity.userId)"> <i class="glyphicon glyphicon-edit icon-white"></i>资金余额 </a>'/* +
                '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'*/
            }
        ];
    }).controller('configCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.dictTypes = [{"typeId":1,"typeName":"佣金比例分成"},{"typeId":2,"typeName":"京东账号配置"},{"typeId":3,"typeName":"微信小程序配置"},{"typeId":4,"typeName":"提现配置"}];
        $scope.params = {
            pageSize:15,
            pageNum:1,
            classifyId:0
        },
        //操作接口
        $scope.operations = {
            "query":"config/list",
            "add":"config/save",
            "save":"config/save"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
       /* $scope.getUserFund = function (value) {
            $scope.userIdParams = {"keyStr":value};
            UtilService.getData("sys/queryUserFundByUserId", $scope.userIdParams).then(function (res) {
                console.log("res",res);
                if (res.meta.code == '0') {
                    $scope.userFund = res.data;
                } else {
                    $scope.msg =res.meta.msg;
                    layer.msg(res.meta.msg, {icon: 5});//哭脸
                }
            });
        }*/

        $scope.gridOptions.columnDefs = [
            { field: "id",width: '80', displayName: 'id'},
            { field: "type", displayName: '类型',cellFilter:'configType'},
            { field: "key", displayName: '配置变量名'},
            { field: "value", displayName: '配置变量值'},
            { field: "remark", displayName: '配置说明'},
            {
                width: '100',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.updateRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>修改 </a>' /* +
                    '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'*/
            }
        ];
    })
    .controller('actCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.actTypes = [{"typeId":1,"typeName":"京东618活动"},{"typeId":2,"typeName":"京粉活动"},{"typeId":3,"typeName":"开普勒活动"},{"typeId":4,"typeName":"双11活动"}];
        $scope.params = {
            pageSize:15,
            pageNum:1,
            classifyId:0
        },
            //操作接口
            $scope.operations = {
                "query":"config/getActInfoList",
                "add":"config/updateActivityInfo",
                "save":"config/updateActivityInfo"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
         $scope.addIndex = function () {
             if($scope.model.detailList==undefined ||$scope.model.detailList=='undefined'){
                 $scope.model.detailList = [];
             }

             $scope.model.detailList.push({"actId":$scope.model.id});
         }

        $scope.gridOptions.columnDefs = [
            { field: "id",width: '80', displayName: 'id'},
            { field: "actType", displayName: '类型',cellFilter:'actType'},
            { field: "webTitle", displayName: '页面标题'},
            { field: "actTitle", displayName: '活动标题'},
            { field: "actContent", displayName: '活动内容'},
            { field: "state", displayName: '状态',cellFilter:'stateFilter'},
            {
                width: '100',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.updateRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>修改 </a>' /* +
                    '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'*/
            }
        ];
    })
    .controller('searchLogCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1
        },
            //操作接口
            $scope.operations = {
                "query":"sys/getSearchLogList",
                "add":"sys/getSearchLogList",
                "save":"sys/getSearchLogList"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "id",width: '80', displayName: 'id'},
            { field: "nickName", displayName: '用户昵称'},
            { field: "searchKey", displayName: '搜索关键字'},
            { field: "searchResult", displayName: '搜索结果'},
            { field: "createTime", displayName: '搜索时间'},

        ];
    })
    .controller('operLogCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1,
            operType:0,
            nickName:''
        };
        $scope.operTypes = [{"typeId":1,"typeName":"登录"},{"typeId":2,"typeName":"查看商品"},{"typeId":3,"typeName":"分享商品"},{"typeId":4,"typeName":"分享小程序"},{"typeId":5,"typeName":"转链"}];
            //操作接口
            $scope.operations = {
                "query":"sys/getOperLogList"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "id",width: '80', displayName: 'id'},
            { field: "nickName", displayName: '用户昵称'},
            { field: "operType", displayName: '操作类型',cellFilter:'operTypeFilter'},
            { field: "info", displayName: '操作信息'},
            { field: "resultInfo", displayName: '操作结果'},
            { field: "createTime", displayName: '操作时间'}
        ];
    })
    //-------------------------轮播图配置----start----------------------------------------------
    .controller('bannerCtrl', function($rootScope,$scope,$http,UtilService,GridService) {
        //操作接口
        $scope.operations = {
            "query":"sys/listBannerInfo",
            "add":"sys/addBannerInfo",
            "save":"sys/updateBannerInfo",
            "del":"sys/delBannerInfo",
            "pkgs":"sys/getGoodsPackages"
        }
        //页面类型
        $scope.pageTypes = [
            {"typeId":1,"typeName":"页面链接"},
            {"typeId":2,"typeName":"商品列表"},
            {"typeId":3,"typeName":"内容详情"},
            {"typeId":4,"typeName":"微信小程序"}];

        var pgk_param={"mode":0};
        $scope.goodsPackages=[];
        //商品包
        $.ajax({
            url:baseUrl+$scope.operations.pkgs,
            async: false,
            data:JSON.stringify(pgk_param),
            dataType:"json",
            contentType: 'application/json',
            type:"post",
            headers:{"sessionId":$rootScope.sessionId},
            success:function(res){
                $scope.goodsPackages=res.data;
                $rootScope.rgoodsPackages=res.data;
            },
            error:function(data){
            }
        });

        $scope.params = {
            pageSize:15,
            pageNum:1,
            classifyId:0
        };

        //判空
        function isEmpty(obj){
            if(typeof obj == "undefined" || obj == null || obj == ""){
                return true;
            }else{
                return false;
            }
        }
        //检查时间格式
        function checkTime(str){
            var pattern = /\d{4}(-)\d{2}\1\d{2} \d{2}:\d{2}/;
            return pattern.test(str)&& str.length==16;
        }

        //上传
        $scope.myupload=function(){
            //检查参数
            if(isEmpty($scope.model.pageType)){
                layer.msg("页面类型为空");
                return false;
            }
            if(1==$scope.model.pageType||2==$scope.model.pageType
                ||3==$scope.model.pageType){
                if(isEmpty($scope.model.pageName)){
                    layer.msg("网页标题为空");
                    return false;
                }
            }
            var bannerImgFile =angular.element("#bannerImgAttach")[0].files[0];
            if(null==bannerImgFile){
                layer.msg("轮播图为空");
                return false;
            }else{
                //检查轮播图文件类型

            }
            if(isEmpty($scope.model.bannerPriority)){
                layer.msg("优先级为空");
                return false;
            }else{
                if($scope.model.bannerPriority>=0 && $scope.model.bannerPriority<=255){
                }else{
                    layer.msg("优先级范围:0-255");
                    return false;
                }
            }
            if(4==$scope.model.pageType||1==$scope.model.pageType){
                if(isEmpty($scope.model.bannerImgLinkUrl)){
                    layer.msg("轮播图跳转页面链接为空");
                    return false;
                }
            }
            if(isEmpty($scope.model.validBeginTime)){
                layer.msg("开始时间为空");
                return false;
            }else{
                if(!checkTime($scope.model.validBeginTime)){
                    layer.msg("开始时间格式不正确(yyyy-MM-dd HH:mm)");
                    return false;
                }
            }
            if(isEmpty($scope.model.validEndTime)){
                layer.msg("结束时间为空");
                return false;
            }else{
                if(!checkTime($scope.model.validEndTime)){
                    layer.msg("结束时间格式不正确(yyyy-MM-dd HH:mm)");
                    return false;
                }
            }
            //准备后台接口地址
            var reqUrl=baseUrl+$scope.operations.add;
            //准备公共部分数据
            var form = new FormData();
            form.append("bannerImgAttach",bannerImgFile);//轮播图
            form.append("pageType",$scope.model.pageType);//页面类型
            form.append("priority",$scope.model.bannerPriority);//优先级
            form.append("beginTime",$scope.model.validBeginTime);//开始时间
            form.append("endTime",$scope.model.validEndTime);//结束时间

            //页面类型-第三方页面链接
            if(1==$scope.model.pageType){
                form.append("pageName",$scope.model.pageName);//网页标题
                form.append("bannerImgLinkUrl",$scope.model.bannerImgLinkUrl);//轮播图跳转页面链接
            }

            //页面类型-商品包
            if(2==$scope.model.pageType){
                if(isEmpty($scope.model.goodsPkgId)){
                    layer.msg("须选择一个商品包");
                    return false;
                }
                var topMediaFile=angular.element("#topMediaAttach")[0].files[0];
                if(isEmpty(topMediaFile)){
                    layer.msg("顶图媒体为空");
                    return false;
                }
                var placardFile=angular.element("#placardAttach")[0].files[0];
                if(isEmpty(placardFile)){
                    layer.msg("海报图为空");
                    return false;
                }
                form.append("pageName",$scope.model.pageName);//网页标题
                form.append("goodsPkgId",$scope.model.goodsPkgId);//商品包
                form.append("mediaAttach",topMediaFile);//顶图(多媒体)
                form.append("placardAttach",placardFile);//海报图
            }
            //页面类型-内容详情
            if(3==$scope.model.pageType){
                if(isEmpty($scope.model.title1)){
                    layer.msg("板块1标题为空");
                    return false;
                }
                if(isEmpty($scope.model.content1)){
                    layer.msg("板块1内容为空");
                    return false;
                }
                if(isEmpty($scope.model.title2)){
                    layer.msg("板块2标题为空");
                    return false;
                }
                if(isEmpty($scope.model.content2)){
                    layer.msg("板块2内容为空");
                    return false;
                }
                var bottomMediaFile=angular.element("#bottomMediaAttach")[0].files[0];
                if(isEmpty(bottomMediaFile)){
                    layer.msg("底图媒体为空");
                    return false;
                }
                form.append("pageName",$scope.model.pageName);//网页标题
                form.append("title1",$scope.model.title1);//板块1标题
                form.append("content1",$scope.model.content1);//板块1内容
                form.append("title2",$scope.model.title2);//板块2标题
                form.append("content2",$scope.model.content2);//板块2内容
                form.append("mediaAttach",bottomMediaFile);//顶图(多媒体)
            }
            //页面类型-微信小程序
            if(4==$scope.model.pageType){
                form.append("bannerImgLinkUrl",$scope.model.bannerImgLinkUrl);//轮播图跳转页面链接
            }
            //发送请求
            $http.post(reqUrl,form,{
                transformRequest: angular.identity,
                headers:{
                    'Content-Type': undefined,
                    'sessionId':$rootScope.sessionId
                }
            }).then(function successCallback(res) {
                var code=res.data.meta.code;
                var message=res.data.meta.message;
                if(code==0){
                    layer.msg("保存成功");
                }else{
                    if(typeof(message) == undefined){
                        layer.msg("保存失败");
                    }else{
                        layer.msg(message);
                    }
                }
            },function errorCallback(res){
                var message=res.data.message;
                if(typeof(message) == undefined){
                    layer.msg("保存失败");
                }else{
                    layer.msg(message);
                }
            });
        }

        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();
        $scope.addIndex = function () {
            if($scope.model.detailList==undefined ||$scope.model.detailList=='undefined'){
                $scope.model.detailList = [];
            }

            $scope.model.detailList.push({"actId":$scope.model.id});
        }

        $scope.gridOptions.columnDefs = [
            { field: "id",width: '70', displayName: 'id'},
            { field: "pageType", displayName: '页面类型',cellFilter:'pageType'},
            { field: "pageName", displayName: '页面标题'},
            { field: "bannerImgUrl", displayName: '轮播图'},
            { field: "bannerImgLinkUrl", displayName: '页面链接'},
            { field: "goodsPkgId", displayName: '商品包',cellFilter:'goodsPkg'},
            { field: "priority", displayName: '优先级'},
            { field: "title1", displayName: '标题一'},
            { field: "content1", displayName: '内容一'},
            { field: "title2", displayName: '标题二'},
            { field: "content2", displayName: '内容二'},
            { field: "beginTime", displayName: '开始时间'},
            { field: "endTime", displayName: '结束时间'},
            {
                width: '130',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.updateRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>修改 </a>'+
                               '<a class="btn btn-xs btn-danger" ng-click="grid.appScope.del(row)"> <i class="glyphicon glyphicon-trash icon-white"></i>删除 </a>'
            }
        ];
    })
    //-------------------------轮播图配置----end----------------------------------------------
    //-------------------------商品管理----satrt----------------------------------------------
    .controller('carePickGoodsCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.sortTypes = [
            {"typeId":"asc","typeName":"升序"},
            {"typeId":"desc","typeName":"降序"}
        ];
        $scope.sortNameTypes = [
            {"typeId":"price","typeName":"单价"},
            {"typeId":"commissionShare","typeName":"佣金比例"},
            {"typeId":"commission","typeName":"佣金"},
            {"typeId":"inOrderCount30DaysSku","typeName":"sku维度30天引单量"},
            {"typeId":"comments","typeName":"评论数"},
            {"typeId":"goodComments","typeName":"好评数"}
        ];

        $scope.channelTypes = [
            {"typeId":1,"typeName":"1-好券商品"},
            {"typeId":2,"typeName":"2-京粉APP-jingdong.大咖推荐"},
            {"typeId":3,"typeName":"3-小程序-jingdong.好券商品"},
            {"typeId":4,"typeName":"4-京粉APP-jingdong.主题街1-jingdong.服装运动"},
            {"typeId":5,"typeName":"5-京粉APP-jingdong.主题街2-jingdong.精选家电"},
            {"typeId":6,"typeName":"6-京粉APP-jingdong.主题街3-jingdong.超市"},
            {"typeId":7,"typeName":"7-京粉APP-jingdong.主题街4-jingdong.居家生活"},
            {"typeId":10,"typeName":"10-9.9专区"},
            {"typeId":11,"typeName":"11-品牌好货-jingdong.潮流范儿"},
            {"typeId":12,"typeName"  :"12-品牌好货-jingdong.精致生活"},
            {"typeId":13,"typeName"  :"13-品牌好货-jingdong.数码先锋"},
            {"typeId":14,"typeName"  :"14-品牌好货-jingdong.品质家电"},
            {"typeId":15,"typeName"  :"15-京仓配送"},
            {"typeId":16,"typeName"  :"16-公众号-jingdong.好券商品"},
            {"typeId":17,"typeName"  :"17-公众号-jingdong.9.9"},
            {"typeId":18,"typeName"  :"18-公众号-jingdong.京仓京配"}
            ];

        $scope.params = {
            pageSize:15,
            pageNum:1
        },
        //操作接口
        $scope.operations = {
            "query":"sys/carePickGoodsPoolQuery"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        // $scope.query();
        $scope.gridOptions.columnDefs = [
            { field: "skuId", displayName: '商品Id'},
            { field: "skuName", displayName: '商品名称'},
            { field: "cid1Name", displayName: '一级类目名称'},
            { field: "cid2Name", displayName: '二级类目名称'},
            { field: "cid3Name", displayName: '三级类目名称'},
            { field: "brandName", displayName: '品牌名称'},
            { field: "venderName", displayName: '店铺名称'},
            { field: "owner", displayName: '是否自营',cellFilter:'ownerFilter'},
            { field: "pcPrice", displayName: 'pc价格'},
            { field: "wlPrice", displayName: '无线价格'},
            { field: "pcCommissionShare", displayName: 'PC佣金比例'},
            { field: "wlCommissionShare", displayName: '无线佣金比例'},
            { field: "pcCommission", displayName: 'PC佣金'},
            { field: "wlCommission", displayName: '无线佣金'},
            { field: "hasCoupon", displayName: '是否有优惠券',cellFilter:'hasOrNot'},
            { field: "isHot", displayName: '是否爆品',cellFilter:'isOrNot'},
            { field: "couponLink", displayName: '通用计划优惠券链接'},
            { field: "comments", displayName: '评论数'},
            { field: "goodComments", displayName: '好评数'},
            { field: "goodCommentsShare", displayName: '好评率'},
            { field: "inOrderCount30Days", displayName: 'SPU维度-30天联盟引入订单量'},
            { field: "inOrderCount30DaysSku", displayName: 'sku维度-30联盟天引入订单'},
            { field: "isPinGou", displayName: '是否参与拼购',cellFilter:'isOrNot'},
            { field: "pingouTmCount", displayName: '成团人数'},
            { field: "pingouPrice", displayName: '拼购价格'},
            { field: "unionCoupon", displayName: '券链接',cellFilter:'oneArray:"link"'},
            { field: "unionCoupon", displayName: '券种类',cellFilter:'oneArray:"couponKind"'},
            { field: "unionCoupon", displayName: '消费限额',cellFilter:'oneArray:"quota"'},
            { field: "unionCoupon", displayName: '优惠券面额',cellFilter:'oneArray:"discount"'},
            { field: "unionCoupon", displayName: '券领取开始时间',cellFilter:'oneArray:"beginTime"'},
            { field: "unionCoupon", displayName: '券领取开始时间',cellFilter:'oneArray:"endTime"'},
            { field: "unionCoupon", displayName: '券使用开始时间',cellFilter:'oneArray:"useStartTime"'},
            { field: "unionCoupon", displayName: '券使用结束时间',cellFilter:'oneArray:"useEndTime"'}
            /*,
            {
                width: '65',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.seeDetailRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>详情 </a>'
            }*/
        ];
    })
    .controller('togetherBuyGoodsCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.poolTypes = [
            {"typeId":"20190415001","typeName":"1元福利新带新商品池"},
            {"typeId":"20190415002","typeName":"1元福利老带新商品池"},
            {"typeId":"20190415003","typeName":"9.9元包邮商品池"},
            {"typeId":"20190415004","typeName":"自营优选商品池"},
            {"typeId":"20190415005","typeName":"拼购居家 电子文娱精选商品池"},
            {"typeId":"20190415006","typeName":"拼购快消精选商品池"},
            {"typeId":"20190415007","typeName":"拼购时尚日常精选商品池"},
            {"typeId":"20190415008","typeName":"拼购名品特卖精选商品池"}
        ];
        $scope.params = {
            pageSize:15,
            pageNum:1
        },
        //操作接口
        $scope.operations = {
            "query":"sys/togetherBuyGoodsPoolQuery"
        }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        // $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "skuId", displayName: '商品id'},
            { field: "beginTime", displayName: '开始时间'},
            { field: "endTime", displayName: '结束时间'},
            { field: "commission", displayName: '佣金'},
            { field: "commissionRate", displayName: '佣金比率'},
            { field: "couponLink", displayName: '券链接'},
            { field: "discount", displayName: '优惠额'},
            { field: "goodComments", displayName: '评价数'},
            { field: "groupNum", displayName: '成团人数'},
            { field: "hasCoupon", displayName: '有无券',cellFilter:'hasOrNot'},
            { field: "inOrderCount30Days", displayName: '30天订单量'},
            { field: "isPinGou", displayName: '是否拼购',cellFilter:'isOrNot'},
            { field: "pcPrice", displayName: 'pc价'},
            { field: "pgPrice", displayName: '拼购价'},
            { field: "quota", displayName: '券消费限额'},
            { field: "skuName", displayName: '商品名称'},
            { field: "url", displayName: '商品链接'}/*,
            {
                width: '35',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.seeDetailRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>详情 </a>'
            }*/
        ];
    })
    .controller('fansJDCarePickGoodsCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.sortTypes = [
            {"typeId":"asc","typeName":"升序"},
            {"typeId":"desc","typeName":"降序"}
        ];
        $scope.sortNameTypes = [
            {"typeId":"price","typeName":"单价"},
            {"typeId":"commissionShare","typeName":"佣金比例"},
            {"typeId":"commission","typeName":"佣金"},
            {"typeId":"inOrderCount30DaysSku","typeName":"sku维度30天引单量"},
            {"typeId":"comments","typeName":"评论数"},
            {"typeId":"goodComments","typeName":"好评数"}
        ];
        $scope.channelTypes = [
            {"typeId":1,"typeName":"1-好券商品"},
            {"typeId":2,"typeName":"2-超级大卖场"},
            {"typeId":10,"typeName":"10-9.9专区"},
            {"typeId":22,"typeName":"22-热销爆品"},
            {"typeId":24,"typeName":"24-数码家电"},
            {"typeId":25,"typeName":"25-超市"},
            {"typeId":26,"typeName":"26-母婴玩具"},
            {"typeId":27,"typeName":"27-家具日用"},
            {"typeId":28,"typeName":"28-美妆穿搭"},
            {"typeId":29,"typeName":"29-医药保健"},
            {"typeId":30,"typeName":"30-图书文具"},
            {"typeId":31,"typeName":"31-今日必推"},
            {"typeId":32,"typeName":"32-王牌好货"}
        ];
        $scope.params = {
            pageSize:15,
            pageNum:1
        },
            //操作接口
            $scope.operations = {
                "query":"sys/fansJDCarePickGoodsQuery"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        // $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "skuId", displayName: '商品Id'},
            { field: "skuName", displayName: '商品名称'},
            { field: "categoryInfo", displayName: '一级类目名称',cellFilter:'oneMap:"cid1Name"'},
            { field: "categoryInfo", displayName: '二级类目名称',cellFilter:'oneMap:"cid2Name"'},
            { field: "categoryInfo", displayName: '三级类目名称',cellFilter:'oneMap:"cid3Name"'},
            { field: "comments", displayName: '评论数'},
            { field: "commissionInfo", displayName: '佣金',cellFilter:'oneMap:"commission"'},
            { field: "commissionInfo", displayName: '佣金比例',cellFilter:'oneMap:"commissionShare"'},
            { field: "couponInfo", displayName: '优惠券种类',cellFilter:'twoLayerMap:"couponList":"bindType"'},
            { field: "couponInfo", displayName: '券面额',cellFilter:'twoLayerMap:"couponList":"discount"'},
            { field: "couponInfo", displayName: '券链接',cellFilter:'twoLayerMap:"couponList":"link"'},
            { field: "couponInfo", displayName: '券使用平台',cellFilter:'twoLayerMap:"couponList":"platformType"'},
            { field: "couponInfo", displayName: '券消费限额',cellFilter:'twoLayerMap:"couponList":"quota"'},
            { field: "couponInfo", displayName: '券领取开始时间',cellFilter:'twoLayerMap:"couponList":"getStartTime"'},
            { field: "couponInfo", displayName: '券领取结束时间',cellFilter:'twoLayerMap:"couponList":"getEndTime"'},
            { field: "couponInfo", displayName: '券有效使用开始时间',cellFilter:'twoLayerMap:"couponList":"useStartTime"'},
            { field: "couponInfo", displayName: '券有效使用结束时间',cellFilter:'twoLayerMap:"couponList":"useEndTime"'},
            { field: "couponInfo", displayName: '是最优优惠券',cellFilter:'twoLayerMap:"couponList":"isBest"'},
            { field: "goodCommentsShare", displayName: '商品好评率'},
            { field: "inOrderCount30Days", displayName: '30天引单数量'},
            { field: "inOrderCount30DaysSku", displayName: '30天引单数量(sku维度)'},
            { field: "materialUrl", displayName: '商品落地页'},
            { field: "priceInfo", displayName: '无线价格',cellFilter:'oneMap:"price"'},
            { field: "shopInfo", displayName: '店铺名称',cellFilter:'oneMap:"shopName"'},
            { field: "isHot", displayName: '是否爆款',cellFilter:'isOrNot'},
            { field: "brandName", displayName: '品牌名'},
            { field: "owner", displayName: '是否自营',cellFilter:'ownerFilter'},
            { field: "pinGouInfo", displayName: '拼购价格',cellFilter:'oneMap:"pingouPrice"'},
            { field: "pinGouInfo", displayName: '拼购成团所需人数',cellFilter:'oneMap:"pingouTmCount"'},
            { field: "pinGouInfo", displayName: '拼购落地页url',cellFilter:'oneMap:"pingouUrl"'},
            { field: "resourceInfo", displayName: '频道名称',cellFilter:'oneMap:"eliteName"'}/*,
            {
                width: '35',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.seeDetailRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>详情 </a>'
            }*/
        ];
    })
    .controller('kplJDSecKillCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1
        },
            //操作接口
            $scope.operations = {
                "query":"sys/kplJDSecKillQuery"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "wareId", displayName: '商品id'},
            { field: "wname", displayName: '商品标题'},
            { field: "jdPrice", displayName: '京东价'},
            { field: "book", displayName: '是否为图书',cellFilter:'trueOrFalse'},
            { field: "promotion", displayName: '是否正在促销',cellFilter:'trueOrFalse'},
            { field: "adword", displayName: '商品广告词'},
            { field: "canBuy", displayName: '能否购买',cellFilter:'trueOrFalse'},
            { field: "miaoSha", displayName: '是否为秒杀商品',cellFilter:'trueOrFalse'},
            { field: "rate", displayName: '折扣'},
            { field: "startRemainTime", displayName: '促销开始时间减去当前时间(秒)'},
            { field: "endRemainTime", displayName: '促销结束时间减去当前时间(秒)'},
            { field: "miaoShaPrice", displayName: '商品秒杀价格'},
            { field: "discount", displayName: '折扣'},
            { field: "canFreeRead", displayName: '能否免费阅读',cellFilter:'trueOrFalse'},
            { field: "discountNew", displayName: '折扣率'},
            { field: "startTimeShow", displayName: '曝光时间'},
            { field: "operateWord", displayName: '操作词'},
            { field: "seckillNum", displayName: '商品剩余数量'}/*,
            {
                width: '35',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.seeDetailRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>详情 </a>'
            }*/
        ];
    })
    .controller('secKillActivityCtrl', function($rootScope,$scope,UtilService,GridService) {
        $scope.params = {
            pageSize:15,
            pageNum:1
        },
            //操作接口
            $scope.operations = {
                "query":"sys/secKillActivityQuery"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "wareId", displayName: '商品id'},
            { field: "wname", displayName: '商品名称'},
            { field: "shortWname", displayName: '商品简称'},
            { field: "startTimeMills", displayName: '开始时间',cellFilter:'dateLongFilter'},
            { field: "canFreeRead", displayName: '是否免费读',cellFilter:'trueOrFalse'},
            { field: "book", displayName: '是否为图书',cellFilter:'trueOrFalse'},
            { field: "lowestPriceDaysInfo", displayName: '最低价信息'},
            { field: "discount", displayName: '折扣'},
            { field: "rate", displayName: '打折'},
            { field: "jdPrice", displayName: '京东价（原价）'},
            { field: "miaoSha", displayName: '是否有货',cellFilter:'trueOrFalse'},
            { field: "startRemainTime", displayName: '促销结束时间减去当前时间，负数表示已经开始'},
            { field: "endRemainTime", displayName: '促销结束时间减去当前时间'},
            { field: "promotionId", displayName: '商品促销id'},
            { field: "soldRate", displayName: '售卖进度(%)'}/*,
            { field: "displayTime", displayName: '场次展示时间'},
            { field: "name", displayName: '场次名称'},
            { field: "timeRemain", displayName: '切场时间'},
            { field: "groupTime", displayName: '场次展示时间'},
            { field: "startTime", displayName: '场次开始时间'},
            { field: "endTime", displayName: '场次结束时间'}*//*,
            {
                width: '35',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.seeDetailRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>详情 </a>'
            }*/
        ];
    })
    .controller('rankInfoCtrl', function($rootScope,$scope,UtilService,GridService) {

        $scope.rankIdsTypes = [
            {"typeId":"266","typeName":"3C：266"},
            {"typeId":"83","typeName":"家电：83"},
            {"typeId":"243","typeName":"居家：243"},
            {"typeId":"109","typeName":"生活服务：109"},
            {"typeId":"505","typeName":"时尚：505"},
            {"typeId":"239","typeName":"消费品： 239"},
            {"typeId":"41","typeName":"生鲜：41"},
            {"typeId":"36","typeName":"宠物生活：36"},
            {"typeId":"49","typeName":"厨具：49"},
            {"typeId":"80","typeName":"电脑、办公：80"},
            {"typeId":"87","typeName":"服饰内衣：87"},
            {"typeId":"49","typeName":"个人护理：49"},
            {"typeId":"40","typeName":"家纺：40"},
            {"typeId":"23","typeName":"家居日用：23"},
            {"typeId":"45","typeName":"家具：45"},
            {"typeId":"28","typeName":"家庭清洁/纸品：28"},
            {"typeId":"83","typeName":"家用电器：83"},
            {"typeId":"62","typeName":"家装建材：62"},
            {"typeId":"15","typeName":"酒类：15"},
            {"typeId":"24","typeName":"礼品：24"},
            {"typeId":"52","typeName":"美妆护肤：52"},
            {"typeId":"26","typeName":"母婴：26"},
            {"typeId":"21","typeName":"农资园艺：21"},
            {"typeId":"71","typeName":"汽车用品：71"},
            {"typeId":"48","typeName":"食品饮料：48"},
            {"typeId":"19","typeName":"手机通讯：19"},
            {"typeId":"47","typeName":"数码：47"},
            {"typeId":"115","typeName":"图书：115"},
            {"typeId":"37","typeName":"玩具乐器：37"},
            {"typeId":"5","typeName":"文娱：5"},
            {"typeId":"28","typeName":"箱包皮具 ：28"},
            {"typeId":"27","typeName":"鞋靴：27"},
            {"typeId":"17","typeName":"医药保健：17"},
            {"typeId":"239","typeName":"运动户外：239"},
            {"typeId":"9","typeName":"钟表：9"},
            {"typeId":"63","typeName":"珠宝首饰：63"}
        ];
        $scope.params = {
            pageSize:15,
            pageNum:1
        },
            //操作接口
            $scope.operations = {
                "query":"sys/rankInfoGatherQuery"
            }
        GridService.initGrid($scope,$scope.operations.query,$scope.params);
        // $scope.query();

        $scope.gridOptions.columnDefs = [
            { field: "skuId", displayName: '商品id'},
            { field: "name", displayName: '商品名'},
            { field: "jdPrice", displayName: '京东价'},
            { field: "lineationPrice", displayName: '划线价'},
            { field: "hotSaleDesc", displayName: '热卖描述'},
            { field: "lowestDesc", displayName: '最低描述'},
            { field: "promoTagList", displayName: '促销标签列表',cellFilter:'promoTagList'},
            /*,
            {
                width: '35',
                field : 'action',
                displayName : "操作",
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate : '<a class="btn btn-xs btn-info" data-toggle="modal" data-target="#myModal2" style="margin-left: 5px;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;" ng-click="grid.appScope.seeDetailRow(row)"> <i class="glyphicon glyphicon-edit icon-white"></i>详情 </a>'
            }*/
        ];
    })
//-------------------------商品管理----end----------------------------------------------
;
