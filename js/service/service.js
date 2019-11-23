/**
 * Created by leroy on 2017/7/31.
 */
var baseUrl = 'https://www.codetheworld.cn/service/';
// var baseUrl = 'http://127.0.0.1:8081/';
angular.module('myApp.services',[])
    .service('UtilService', function($http,$q,$rootScope,modalService) {
    return {
        getData: function (url_model, url_params) {
            //alert($rootScope.sessionId);
            var deferred = $q.defer();
            var url = baseUrl+url_model;
            $.ajax({
                url:url,
                async: false,
                // data:JSON.stringify(url_params),
                data:decodeURI(JSON.stringify(url_params),"utf-8"),
                dataType:"json",
                //processData: false,
                contentType: 'application/json',
                type:"post",
                headers:{"sessionId":$rootScope.sessionId},
                success:function(req){
                    //console.log(req);
                    deferred.resolve(req);
                },
                error:function(req){
                    console.log(req);
                    alert("错误提示","系统出错，请重试！");
                }
            });

           /* $http({
                method:'post',
                url:baseUrl+url_model,
                params:url_params,
                headers:{"Content-Type": "x-www-form-urlencoded"}
            }).then(function(req){
               /!* if(req.data.success=='9999'){   //登录失效，删除本地登录信息
                    $rootScope.islogin = false;
                    document.cookie = "islogin=false";
                }*!/
                deferred.resolve(req.data);
                $rootScope.loading = false;
            })*/
            return deferred.promise;
        },
        getParamsStr:function (objs) {
            var url_params = "";
            var obj_type = typeof(objs);
            if(obj_type=='string'){
                url_params = objs;
            }else if(obj_type=='object'){
                for (var s in objs) {
                    if(typeof(objs[s])=='string'){
                        var ss=objs[s].replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
                        url_params = url_params+"&"+ s+"="+ss;
                    }else{
                        url_params = url_params+"&"+ s+"="+objs[s];
                    }
                }
            }
            return url_params;
        }
    }
}).service('BusiServ',function(UtilService,$rootScope,$q){  //查询列表作为下拉框记录
    this.dict = function () {
        if ($rootScope.dictionarys) {
            return null;
        } else {
            var deferred = $q.defer();
            UtilService.getData("base/getDictionary.action", {}).then(function (result) {
                console.log(result,"service.js.busi");
                $rootScope.dictionarys = result;
                console.log($rootScope.dictionarys,"$rootScope.dictionarys");
            });
            return deferred.promise;
        }
    }
}).service('FileService', function($http,$q,$rootScope,Upload,UtilService,modalService) {
    return {
        init:function(scope,scope_){
            //上传附件
            scope.files = [];
            // scope.fileParamsId = "";
            scope.clearFiles = function () {
                scope.files.splice(0);
                // scope.fileParamsId = id;
            }
            scope.delFile = function (idx) {
                scope.files.splice(idx, 1);
                console.log(scope.files, "files");
            }
            scope.uploadFlag = false;  //是否上传按钮允许点击
            scope.selectFile = function (files) {
                console.log(files);
                Array.prototype.push.apply(scope.files, files);
                for (var i = 0; i < scope.files.length; i++) {
                    if (scope.files[i].succ == undefined) scope.uploadFlag = true;
                }
            }
            //上传方法
            scope.uploadFile = function (paramsData) {
                if(scope.files.length==0){
                    layer.alert("请先选择要上传的文件");
                    return;
                }
                console.log(paramsData,"upload...paramsData");
                try {
                    Upload.upload({
                        //服务端接收
                        url: 'UploadServletServer',
                        //上传的同时带的参数
                        data: paramsData,
                        //上传的文件
                        file: scope.files
                    }).progress(function (evt) {
                        //进度条
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data, status, headers, config) {
                        for (var i = 0; i < scope.files.length; i++) {
                            var file = scope.files[i];
                            file["succ"] = true;
                        }
                        layer.msg("上传成功");

                    }).error(function (data, status, headers, config) {
                        //上传失败
                        console.log('error status: ' + status);
                    });
                } catch (e) {
                    alert(e);
                }
            }
        }
    }
}).service('modalService',
    function ($uibModal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'templates/modal.html'
        };
        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                };
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    })
    .service('GridService', function($http,$q,$rootScope,modalService,i18nService) {
        return {
            getData: function (url_model, url_params) {
                //alert("sessionId="+$rootScope.sessionId);
                if(!$rootScope.sessionId){
                    layer.msg("请求头不存在", {icon: 5});
                    return;
                }
                var deferred = $q.defer();
                var url = baseUrl+url_model;
                $.ajax({
                    url:url,
                    async: false,
                    data:JSON.stringify(url_params),
                    dataType:"json",
                    //processData: false,
                    contentType: 'application/json',
                    type:"post",
                    headers:{"sessionId":$rootScope.sessionId},
                    success:function(req){
                        deferred.resolve(req);
                        $rootScope.loading = false;
                    },
                    error:function(data){
                        alert("错误提示","系统出错，请重试！");
                    }
                });

               /* $http({
                    method:'post',
                    url:url_model,
                    params:url_params,
                    headers:$rootScope.headers
                }).then(function(req){
                    deferred.resolve(req.data);
                    $rootScope.loading = false;
                })*/
                return deferred.promise;
            },

            initGrid:function(scope,url,params,scope_){
                var t=this;
                // 国际化；
                i18nService.setCurrentLang("zh-cn");
                //多个scope的情况
                if (scope_!=null&&scope_!=""){
                    if (!scope.hasOwnProperty(scope_)) scope[scope_]={};
                    scope[scope_].list=[];
                    scope[scope_].rowCount =0;
                    scope[scope_].params={
                        pageSize: 15,
                        pageNum: 1,
                        ids:[]
                    };
                    scope[scope_].gridApi = {};
                    scope[scope_].gridOptions = {
                        data: scope[scope_].list,
                        columnDefs: [],
                        virtualizationThreshold:10,
                        enableSorting: false, //是否排序
                        useExternalSorting: false, //是否使用自定义排序规则
                        enableGridMenu: true, //是否显示grid 菜单
                        showGridFooter: false, //是否显示grid footer
                        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
                        enableVerticalScrollbar : 1, //grid垂直滚动条是否显示, 0-不显示  1-显示

                        //-------- 分页属性 ----------------
                        enablePagination: true, //是否分页，默认为true
                        enablePaginationControls: true, //使用默认的底部分页
                        paginationPageSizes: [10,15,30,50,100], //每页显示个数可选项
                        paginationCurrentPage:1, //当前页码
                        paginationPageSize: scope[scope_].params.pageSize, //每页显示个数
                        //paginationTemplate:"<div></div>", //自定义底部分页代码
                        totalItems : 0, // 总数量
                        useExternalPagination: true,//是否使用分页按钮
                        //--------------导出----------------------------------
                        exporterAllDataFn: function(){
                            return getPage(1,$scope.gridOptions.totalItems);
                        },
                        exporterCsvColumnSeparator: ',',
                        exporterCsvFilename:'download.csv',
                        exporterFieldCallback : function ( grid, row, col, value ){
                            if ( value == 50 ){
                                value = "可以退休";
                            }
                            return value;
                        },
                        exporterHeaderFilter :function( displayName ){
                            return 'col: ' + name;
                        },
                        exporterHeaderFilterUseName : true,
                        exporterMenuCsv : false,
                        exporterMenuLabel : "Export",
                        exporterMenuPdf : true,
                        exporterOlderExcelCompatibility : false,
                        exporterPdfCustomFormatter : function ( docDefinition ) {
                            docDefinition.styles.footerStyle = { bold: true, fontSize: 10 };
                            return docDefinition;
                        },
                        exporterPdfFooter :{
                            text: 'My footer',
                            style: 'footerStyle'
                        },
                        exporterPdfDefaultStyle : {
                            fontSize: 11,font:'simblack' //font 设置自定义字体
                        },
                        exporterPdfFilename:'download.pdf',
                        /* exporterPdfFooter : {
                         columns: [
                         'Left part',
                         { text: 'Right part', alignment: 'right' }
                         ]
                         },
                         或 */
                        exporterPdfFooter: function(currentPage, pageCount) {
                            return currentPage.toString() + ' of ' + pageCount;
                        },
                        exporterPdfHeader : function(currentPage, pageCount) {
                            return currentPage.toString() + ' of ' + pageCount;
                        },
                        exporterPdfMaxGridWidth : 720,
                        exporterPdfOrientation : 'landscape',//  'landscape' 或 'portrait' pdf横向或纵向
                        exporterPdfPageSize : 'A4',// 'A4' or 'LETTER'
                        exporterPdfTableHeaderStyle : {
                            bold: true,
                            fontSize: 12,
                            color: 'black'
                        },
                        exporterPdfTableLayout : null,
                        exporterPdfTableStyle: {
                            margin: [0, 5, 0, 15]
                        },
                        exporterSuppressColumns : ['buttons'],
                        exporterSuppressMenu: false,


                        //----------- 选中 ----------------------
                        enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
                        // enableFullRowSelection : true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                        enableRowHeaderSelection : true, //是否显示选中checkbox框 ,默认为true
                        enableRowSelection : true, // 行选择是否可用，默认为true;
                        enableSelectAll : false, // 选择所有checkbox是否可用，默认为true;
                        enableSelectionBatchEvent : true, //默认true
                        modifierKeysToMultiSelect: false ,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
                        multiSelect: true ,// 是否可以选择多个,默认为true;
                        noUnselect: false,//默认false,选中后是否可以取消选中
                        selectionRowHeaderWidth:30 ,//默认30 ，设置选择列的宽度；
                        //---------------api---------------------
                        onRegisterApi: function(gridApi) {
                            scope.gridApi = gridApi;
                            // console.log(scope[scope_].gridApi,"scope[scope_].gridApi");
                            //分页按钮事件
                            gridApi.pagination.on.paginationChanged(scope,function(newPage, pageSize) {
                                scope[scope_].params.pageNum= newPage;
                                scope[scope_].params.pageSize = pageSize;
                                scope.query(scope_);
                            });
                            //行选中事件
                            gridApi.selection.on.rowSelectionChanged(scope,function(row,event){
                                if( scope[scope_].gridOptions.multiSelect){  //多选
                                    scope[scope_].params.isSingle = false;
                                    if(row.isSelected){
                                        scope[scope_].model = row.entity;
                                        scope[scope_].params.ids.push(scope[scope_].model.id);
                                    }else{
                                        scope[scope_].params.ids.remove(scope[scope_].model.id);
                                    }
                                }else{  //单选
                                    scope[scope_].params.isSingle = true;
                                    scope[scope_].model = row.entity;
                                    scope[scope_].params.id = scope[scope_].model.id;
                                };
                            });
                        }
                    }
                    scope.query = function (scope_) {
                        t.getData(scope[scope_].operations.query,scope[scope_].params).then(function(res){
                            if(res.success=='0000'){
                                //grid使用
                                 scope[scope_].gridOptions.data = res.pagerList.resultList;
                                 scope[scope_].gridOptions.totalItems = res.pagerList.rowCount;
                                scope[scope_].params.id = '';
                                scope[scope_].params.ids.splice(0);
                            }else{
                                layer.msg(res.msg, {icon: 5});//哭脸
                            }

                        }).finally(function(){
                            $rootScope.loading = false;
                        });
                    };
                    scope.add = function (scope_) {
                        scope[scope_].model ={}
                    };
                    //行编辑
                    scope.updateRow = function (row,scope_) {
                        scope[scope_].model = row.entity;
                        console.log(scope[scope_].model,"scope.model");
                    }
                    //单选编辑
                    scope.update = function (scope_) {
                        if (scope[scope_].params.id == undefined || scope[scope_].params.id=='') {
                            layer.alert("请选择要修改的记录");
                            return;
                        }
                        var modalId = "#"+scope_+"Modal";
                        $(modalId).modal("show");
                    }
                    scope.save = function (scope_) {
                         scope[scope_].params.pageNum=1;
                         scope[scope_].gridOptions.paginationCurrentPage =1;
                        t.getData(scope[scope_].operations.save, scope[scope_].model).then(function (res) {
                            console.log("sssssssssss=",res);
                            if (res.meta.code == 0) {
                                scope[scope_].gridOptions.data = res.pagerList.resultList;
                                scope[scope_].gridOptions.totalItems = res.pagerList.rowCount;
                                scope[scope_].model = {};
                                scope[scope_].params.id = "";
                                scope[scope_].params.ids.splice(0);//清空选择数组
                                var modalId = "#"+scope_+"Modal";
                                $(modalId).modal("hide");
                                layer.msg("保存成功");
                            } else {
                                layer.msg(res.msg, {icon: 5});//哭脸
                            }
                        }).finally (function () {
                            $rootScope.loading = false;
                        });
                    }
                    //行删除
                    scope.del = function (scope_) {
                        var rows = scope.gridApi.selection.getSelectedRows();
                        for(var i=0;i<rows.length;i++){
                            scope.params.ids.push(rows[i].id);
                        }
                        if (scope[scope_].params.isSingle&&(scope[scope_].params.id == undefined || scope[scope_].params.id=='')|| (!scope[scope_].params.isSingle && scope[scope_].params.ids.length==0)) {
                            layer.alert("请选择要删除的记录");
                            return;
                        }

                        var modalOptions = {
                            closeButtonText: '取消',
                            actionButtonText: '确认',
                            headerText: '删除',
                            bodyText: '确认删除记录吗?'
                        };
                        //打开弹出提示窗口
                        modalService.showModal({}, modalOptions).then(function (result) {
                            t.getData(scope[scope_].operations.del,scope[scope_].params ).then(function (res) {
                                if (res.success == '0000'||res.meta.code == 0) {
                                    scope[scope_].gridOptions.data = res.pagerList.resultList;
                                    scope[scope_].gridOptions.totalItems = res.pagerList.rowCount;
                                    scope[scope_].params.id = "";
                                    scope[scope_].params.ids.splice(0);//清空选择数组
                                } else {
                                    layer.msg(res.msg, {icon: 5});//哭脸
                                }
                            }).finally (function () {
                                $rootScope.loading = false;
                            });
                        });
                    }
                    //行内删除
                    scope.delRow = function (row,scope_) {
                        scope[scope_].params.isSingle = true;    //是否单条
                        scope[scope_].params.id=row.id;
                        var modalOptions = {
                            closeButtonText: '取消',
                            actionButtonText: '确认',
                            headerText: '删除',
                            bodyText: '确认删除记录吗?'
                        };
                        //打开弹出提示窗口
                        modalService.showModal({}, modalOptions).then(function (result) {
                            t.getData(scope[scope_].operations.del,scope[scope_].params ).then(function (res) {
                                if (res.success == '0000') {
                                     scope[scope_].gridOptions.data = res.pagerList.resultList;
                                     scope[scope_].gridOptions.totalItems = res.pagerList.rowCount;
                                    scope[scope_].params.ids.splice(0);//清空选择数组
                                } else {
                                    layer.msg(res.msg, {icon: 5});//哭脸
                                }
                            }).finally (function () {
                                $rootScope.loading = false;
                            });
                        });
                    }
                }else{
                    scope.list=[];
                    scope.rowCount =0;
                    scope.params.ids=[];
                    scope.params.id='';
                    scope.gridOptions = {
                        data: scope.list,
                        columnDefs: [],
                        virtualizationThreshold:10,
                        enableSorting: false, //是否排序
                        useExternalSorting: true, //是否使用自定义排序规则
                        enableGridMenu: true, //是否显示grid 菜单
                        // showGridFooter: true, //是否显示grid footer
                        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
                        enableVerticalScrollbar : 1, //grid垂直滚动条是否显示, 0-不显示  1-显示

                        //-------- 分页属性 ----------------
                        enablePagination: true, //是否分页，默认为true
                        enablePaginationControls: true, //使用默认的底部分页
                        paginationPageSizes: [15,30,50,100], //每页显示个数可选项
                        paginationCurrentPage:1, //当前页码
                        paginationPageSize: scope.params.pageSize, //每页显示个数
                        //paginationTemplate:"<div></div>", //自定义底部分页代码
                        totalItems : 0, // 总数量
                        useExternalPagination: true,//是否使用分页按钮
                        //--------------导出----------------------------------
                        exporterAllDataFn: function(){
                            return getPage(1,$scope.gridOptions.totalItems);
                        },
                        exporterCsvColumnSeparator: ',',
                        exporterCsvFilename:'download.csv',
                        exporterFieldCallback : function ( grid, row, col, value,index){
                            if(col.field=='index'){
                                return index+1;
                            }
                            if(col.field=='sex'){
                                if(value=='1'){return "男";} else{
                                    return  "女"
                                }
                            }
                            return value;
                        },
                        exporterHeaderFilterUseName : false,
                        exporterMenuCsv : false,
                        exporterMenuLabel : "Export",
                        exporterSelected: true,
                        exporterMenuPdf : false,
                        exporterOlderExcelCompatibility : false,
                        exporterPdfCustomFormatter : function ( docDefinition ) {
                            docDefinition.styles.footerStyle = { bold: true, fontSize: 10 };
                            return docDefinition;
                        },
                        exporterPdfFooter :{
                            text: 'My footer',
                            style: 'footerStyle'
                        },
                        exporterPdfDefaultStyle : {
                            fontSize: 11,font:'simblack' //font 设置自定义字体
                        },
                        exporterPdfFilename:'download.pdf',
                        /* exporterPdfFooter : {
                         columns: [
                         'Left part',
                         { text: 'Right part', alignment: 'right' }
                         ]
                         },
                         或 */
                        exporterPdfFooter: function(currentPage, pageCount) {
                            return currentPage.toString() + ' of ' + pageCount;
                        },
                        exporterPdfHeader : function(currentPage, pageCount) {
                            return currentPage.toString() + ' of ' + pageCount;
                        },
                        exporterPdfMaxGridWidth : 720,
                        exporterPdfOrientation : 'landscape',//  'landscape' 或 'portrait' pdf横向或纵向
                        exporterPdfPageSize : 'A4',// 'A4' or 'LETTER'
                        exporterPdfTableHeaderStyle : {
                            bold: true,
                            fontSize: 12,
                            color: 'black'
                        },
                        exporterPdfTableLayout : null,
                        exporterPdfTableStyle: {
                            margin: [0, 5, 0, 15]
                        },
                        exporterSuppressColumns : ['buttons'],
                        exporterSuppressMenu: false,


                        //----------- 选中 ----------------------
                        enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
                        // enableFullRowSelection : true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                        enableRowHeaderSelection : true, //是否显示选中checkbox框 ,默认为true
                        enableRowSelection : true, // 行选择是否可用，默认为true;
                        enableSelectAll : false, // 选择所有checkbox是否可用，默认为true;
                        enableSelectionBatchEvent : false, //默认true
                        modifierKeysToMultiSelect: false ,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
                        multiSelect: true ,// 是否可以选择多个,默认为true;
                        noUnselect: false,//默认false,选中后是否可以取消选中
                        selectionRowHeaderWidth:30 ,//默认30 ，设置选择列的宽度；
                        //---------------api---------------------
                        onRegisterApi: function(gridApi) {
                            scope.gridApi = gridApi;
                            //分页按钮事件
                            gridApi.pagination.on.paginationChanged(scope,function(newPage, pageSize) {
                                scope.params.pageNum= newPage;
                                scope.params.pageSize = pageSize;
                                scope.query();
                            });
                            //行选中事件
                            scope.gridApi.selection.on.rowSelectionChanged(scope,function(row,event){
                                if(scope.gridOptions.multiSelect){  //多选
                                    if(row.isSelected){
                                        scope.model = row.entity;
                                        scope.params.ids.push(scope.model.id);
                                    }else{
                                        scope.params.ids.remove(row.entity.id);
                                    }
                                }else{  //单选
                                    scope.model = row.entity;
                                    scope.params.id = scope.model.id;
                                };
                                console.log(scope.params.ids,"scope.params.ids");
                            });
                            //行选中事件
                            scope.gridApi.selection.on.rowSelectionChangedBatch(scope,function(rows,event){
                                console.log(scope.params.ids,"scope.params.ids");
                            });
                        }
                    }

                    scope.query = function () {
                        // console.log(params,"params");
                        t.getData(scope.operations.query,scope.params).then(function(res){
                            if(res.meta.code == '0'){
                                //grid使用
                                scope.gridOptions.data = res.data.list;
                                // console.log("scope.gridOptions.data==",scope.gridOptions.data);
                                scope.gridOptions.totalItems = res.data.total;
                                // scope.list = res.pagerList.resultList;
                                scope.params.id = '';
                                scope.params.ids.splice(0);
                            }else{
                                layer.msg(res.meta.message, {icon: 5});//哭脸
                            }

                        }).finally(function(){
                            $rootScope.loading = false;
                        });
                    };
                    scope.add = function () {
                        scope.model ={}
                    };
                    scope.updateRow = function (row) {
                        scope.model = row.entity;
                        console.log(scope.model,"scope.model");
                    }
                    scope.save = function () {
                        scope.params.pageNum=1;
                        scope.gridOptions.paginationCurrentPage =1;
                        t.getData(scope.operations.add, scope.model).then(function (res) {
                            if (res.meta.code == 0) {
                               /* scope.gridOptions.data = res.pagerList.resultList;
                                scope.gridOptions.totalItems = res.pagerList.rowCount;*/
                                /**
                                 * 回调controller中的方法
                                 */
                                if (typeof(eval(scope.callControll)) == "function") {
                                    scope.callControll(scope.model);
                                }
                                scope.model = {};
                                var modalId = "#myModal";
                                $(modalId).modal("hide");
                                /*var colseButton=document.getElementById('colseButton');
                                colseButton.click();*/
                                layer.msg("保存成功");
                                scope.query();
                            } else {
                                layer.msg(res.meta.message, {icon: 5});//哭脸
                            }
                        }).finally (function () {
                            $rootScope.loading = false;
                        });
                    }
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

                    scope.save2 = function (modalId) {
                        //检查参数
                        if(isEmpty(scope.model.pageType)){
                            layer.msg("页面类型为空");
                            return false;
                        }
                        if(isEmpty(scope.model.priority)){
                            layer.msg("优先级为空");
                            return false;
                        }else{
                            if(scope.model.priority>=0 && scope.model.priority<=255){
                            }else{
                                layer.msg("优先级范围:0-255");
                                return false;
                            }
                        }
                        if(isEmpty(scope.model.beginTime)){
                            layer.msg("开始时间为空");
                            return false;
                        }else{
                            if(!checkTime(scope.model.beginTime)){
                                layer.msg("开始时间格式不正确(yyyy-MM-dd HH:mm)");
                                return false;
                            }
                        }
                        if(isEmpty(scope.model.endTime)){
                            layer.msg("结束时间为空");
                            return false;
                        }else{
                            if(!checkTime(scope.model.endTime)){
                                layer.msg("结束时间格式不正确(yyyy-MM-dd HH:mm)");
                                return false;
                            }
                        }
                        //页面类型-第三方页面链接
                        if(1==scope.model.pageType){
                            if(isEmpty(scope.model.pageName)){
                                layer.msg("网页标题为空");
                                return false;
                            }
                            if(isEmpty(scope.model.bannerImgLinkUrl)){
                                layer.msg("轮播图跳转页面链接为空");
                                return false;
                            }
                        }
                        //页面类型-商品包
                        if(2==scope.model.pageType){
                            if(isEmpty(scope.model.pageName)){
                                layer.msg("网页标题为空");
                                return false;
                            }
                            if(isEmpty(scope.model.goodsPkgId)){
                                layer.msg("须选择一个商品包");
                                return false;
                            }
                        }
                        //页面类型-内容详情
                        if(3==scope.model.pageType){
                            if(isEmpty(scope.model.pageName)){
                                layer.msg("网页标题为空");
                                return false;
                            }
                            if(isEmpty(scope.model.title1)){
                                layer.msg("板块1标题为空");
                                return false;
                            }
                            if(isEmpty(scope.model.content1)){
                                layer.msg("板块1内容为空");
                                return false;
                            }
                            if(isEmpty(scope.model.title2)){
                                layer.msg("板块2标题为空");
                                return false;
                            }
                            if(isEmpty(scope.model.content2)){
                                layer.msg("板块2内容为空");
                                return false;
                            }
                        }
                        //页面类型-微信小程序
                        if(4==scope.model.pageType){
                            if(isEmpty(scope.model.bannerImgLinkUrl)){
                                layer.msg("轮播图跳转页面链接为空");
                                return false;
                            }
                        }

                        scope.params.pageNum=1;
                        scope.gridOptions.paginationCurrentPage =1;
                        t.getData(scope.operations.save, scope.model).then(function (res) {
                            if (res.meta.code == 0) {
                                /* scope.gridOptions.data = res.pagerList.resultList;
                                 scope.gridOptions.totalItems = res.pagerList.rowCount;*/
                                /**
                                 * 回调controller中的方法
                                 */
                                /*if (typeof(eval(scope.callControll)) == "function") {
                                    scope.callControll(scope.model);
                                }*/
                                // scope.model = {};
                                // var modalId = "#myModal";
                                // $(modalId).modal("hide");
                                /*var colseButton=document.getElementById('colseButton');
                                colseButton.click();*/
                                layer.msg("修改成功");
                                // scope.query();
                            } else {
                                layer.msg(res.meta.message, {icon: 5});//哭脸
                            }
                        }).finally (function () {
                            $rootScope.loading = false;
                        });
                    }
                    scope.del = function (row) {
                        console.log(row,"row");
                        if(row!=undefined && row!='undefined'){     //单条删除
                            scope.params.isSingle = true;    //是否单条
                            scope.params.id=row.entity.id;
                        }else{
                            scope.params.isSingle = false;
                            scope.params.id = null;
                            var rows = scope.gridApi.selection.getSelectedRows();
                            if(rows.length==0){
                                $rootScope.alertModal=true;
                                $rootScope.msAlertModalConfig={
                                    sureText:'确定',
                                    titleText:'提示',
                                    contentText:'请最少选择一条记录',
                                    isOpen:true
                                }
                                return;
                            }
                            for(var i=0;i<rows.length;i++){
                                scope.params.ids.push(rows[i].id);
                            }
                        }
                        var modalOptions = {
                            closeButtonText: '取消',
                            actionButtonText: '确认',
                            headerText: '删除',
                            bodyText: '确认删除记录吗?'
                        };
                        //打开弹出提示窗口
                        modalService.showModal({}, modalOptions).then(function (result) {
                            /*scope.params.ids = [];
                             for(var i=0;i<scope.checkedList.length;i++){
                             scope.params.ids.push(scope.checkedList[i].id);
                             }*/
                            t.getData(scope.operations.del,scope.params ).then(function (res) {
                                if (res.success == '0000'||res.meta.code == 0) {
                                    layer.msg("删除成功");
                                    scope.query();
                                    scope.params.ids.splice(0);//清空选择数组
                                } else {
                                    layer.msg(res.msg, {icon: 5});//哭脸
                                }
                            }).finally (function () {
                                $rootScope.loading = false;
                            });
                        });
                    }
                    scope.reset =function(){     //列表清空
                        for (x in scope.params){
                            if (x!="pageSize"&&x!="pageNum"&&x!="inorout")scope.params[x]="";
                        }
                    }
                }
            }
        }
    })
    //ng-repeat循环后 可以重新渲染dom元素
    .directive('onFinishRenderFilters', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $(".form_datetime").datetimepicker({
                        language: 'zh-CN',//显示中文
                        format: 'yyyy-mm-dd',
                        autoclose: true,    //选择日期后自动关闭
                        minView:2,  //视图层次数
                        todayBtn:true
                    });
                    /*$timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });*/
                }
            }
        }
    })
;
//loading
app.factory('timestampMarker', ["$rootScope", function ($rootScope) {
    var timestampMarker = {
        request: function (config) {
            $rootScope.loading = true;
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function (response) {
            $rootScope.loading = false;
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timestampMarker;
}]);

angular.module('myApp').constant('msAlertModalConstant',{
        sureText:'Sure',
        backgroundConfig:true,
        sizeConfig:'sm'

    })
    .directive('msAlertModal',['$rootScope','msAlertModalConstant',function($rootScope,msAlertModalConstant){
        return {
            restrict:'EA',
            transclude: true,
            replace: false,
            templateUrl:'templates/alertModal.html',
            scope:{
            },
            link:function(scope,element,attrs,modalController){

                scope.getText=function(key){
                    //return scope[key+'Text']||msAlertModalConfig[key+'Text'];
                    return $rootScope.msAlertModalConfig[key+'Text']||msAlertModalConstant[key+'Text'];
                }

                scope.setConfig=function(key){
                    return $rootScope.msAlertModalConfig[key+'Config']||msAlertModalConstant[key+'Config'];
                }

                var _modalId = attrs.id ? attrs.id : "_modal" + (Date.now());
                scope.modalid=_modalId;
                scope.close=function(type){
                    if(type=='background' && scope.withback=="false"){
                        return false;
                    }
                    $rootScope.msAlertModalConfig.isOpen=false;
                }
            }
        }
    }]);

angular.module('myApp').directive('errorMessage', ['$compile', function($compile) {
    return {
        restrict: 'A',
        scope:{ title:'@' },
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            var parenNode = element.parent();
            parenNode.addClass("has-feedback");
            var subScope = scope.$new(true);
            subScope.errorsText={ required:"此项为必填", pattern:scope.title }
            subScope.hasError=function(){
                var re=(ngModel.$$parentForm.$submitted||ngModel.$dirty)&&ngModel.$invalid;

                if(re){
                    parenNode.addClass("has-error");
                }else{
                    parenNode.removeClass("has-error");
                }
                return re;
            }
            subScope.errors=function(){
                return ngModel.$error;
            }
            // var errorElement = $compile('<div ng-if="hasError()" class="glyphicon glyphicon-warning-sign form-control-feedback" ></div> <ul class="help-block" ng-if="hasError()"> <li ng-repeat="(error,wrong) in errors()" ng-bind="errorsText[error]"> </ul> ')(subScope);
            var errorElement = $compile('<div ng-if="hasError()" class="glyphicon glyphicon-warning-sign form-control-feedback" ></div> ')(subScope);
            element.after(errorElement)
        }
    };
}]);



