(function () {
    angular.module('CepFavModule', ['ui.router', 'ngSanitize', 'ui.select', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.bootstrap', 'ui.bootstrap.multidatepicker', 'ui.bootstrap.datepicker', 'gm.datepickerMultiSelect', 'ngStorage', 'infinite-scroll', 'ui.mask', 'ngMessages', 'ng.deviceDetector', 'ngRoute', 'ngCookies', 'pascalprecht.translate', 'treeControl', 'ui.grid.saveState']);
}());
(function () {
    var app = angular.module('CepFavModule');
    app.directive('cepFav', [function () {
        var myContrl = ['$scope', '$rootScope', 'uiGridConstants', 'cepService', 'constantService', 'activityFavService', 'openPopUpWindowFactory', '$filter', '$timeout', 'broadcastService', function ($scope, $rootScope, uiGridConstants, cepService, appConstants, activityFavService, sharedService, $filter, $timeout, broadcastService) {
            $scope.dltTitle = $filter('translate')('btn_Delete');
            var recordPerPage = 50;
            var init = function () {
                $rootScope.errorLogMethod("CepFavModule.init");
                $scope.isFavGridRender = false;
                $scope.gridCepFavoriteOptions.data = [];               
                $scope.apiArguments = {
                    sessionKey: $scope.loginDetail.SESKEY,
                    empId: $scope.loginDetail.EMPLID,
                    companyId: $scope.initialDetail.COMP_REC.COMPID,
                    domainURL: $scope.domainURL,
                    sorOrder: '2',
                    reordPerPage: recordPerPage,
                    pageNumber: 1,
                    sorOrder: '2'
                }               
                $scope.loadEmpFavCepData();
            }
            var getFavCEPCodes = function (arguments) {
                $rootScope.errorLogMethod("CepFavModule.getFavCEPCodes");
                cepService.getFavCEP(arguments.sessionKey, arguments.empId, "", arguments.pageNumber, arguments.reordPerPage, "")
                    .then(function (response) {
                        if (response.RETCEPFAV_OUT_OBJ.CEP_ARR == undefined || response.RETCEPFAV_OUT_OBJ.CEP_ARR.length == 0) {
                            return;
                        }
                        if (Object.prototype.toString.call(response.RETCEPFAV_OUT_OBJ.CEP_ARR) != '[object Array]') {
                            var data = response.RETCEPFAV_OUT_OBJ.CEP_ARR;
                            response.RETCEPFAV_OUT_OBJ.CEP_ARR = [];
                            response.RETCEPFAV_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                        }
                        var items = response.RETCEPFAV_OUT_OBJ.CEP_ARR;
                        if ((items.length > 0)) {
                            items = items.filter(function (item) {
                                return (item.CLIEID != 0)
                            });
                            items.forEach(function (cep) {
                                cep.CEPCODE = cep.CLIENO + '-' + ("00" + cep.ENGNO).slice(-3).toString() + '-' + ("00" + cep.PRJNO).slice(-3).toString();
                            });
                            $scope.listFavCep = items;
                            localStorage.GroupingCalledCEPFav = "1";
                            var ttlAvail = parseInt(response.RETCEPFAV_OUT_OBJ.TOTAVAIL);
                            $scope.tab1TtlItem = ttlAvail;
                            localStorage.removeItem('CEPFav');
                            localStorage.removeItem('TOTFavAVAIL');
                            localStorage.setItem('CEPFav', JSON.stringify(items));
                            localStorage.setItem('TOTFavAVAIL', (response.RETCEPFAV_OUT_OBJ.TOTAVAIL));
                            bindGridData(items, $scope.tab1TtlItem);
                        }

                    });

            }

            var bindGridData = function (gridDataAr, ttlItem) {
                $rootScope.errorLogMethod("CepFavModule.bindGridData");
                $scope.gridCepFavoriteOptions.totalItems = ttlItem;
                //localStorage.GroupingCalledCEPFav = "1";
                $scope.gridCepFavoriteOptions.data = gridDataAr;
                $scope.gridCepFavoriteOptions.enableHorizontalScrollbar = 1;
            }

            $scope.removeFrmFavCEP = function (cepObj) {
                $rootScope.errorLogMethod("CepFavModule.$scope.removeFrmFavCEP");
                    var data = {
                        "NUMBER": [cepObj.PRJID]
                    };
                    var prj_arr = JSON.stringify(data);
                    cepService.removeCEPFavorites($scope.apiArguments.sessionKey, $scope.apiArguments.empId, prj_arr).then(function (response) {
                        if (parseInt(response.REMCEPFAV_OUT_OBJ.RETCD) == 0) {
                            $scope.listFavCep = $scope.listFavCep.filter(function (cep) {
                                return cep.PRJID !== cepObj.PRJID
                            });
                            var ttlItem = $scope.gridCepFavoriteOptions.totalItems;
                            $scope.tab1TtlItem = ((ttlItem - 1) < 0 ? 0 : ttlItem -1);
                            bindGridData($scope.listFavCep, $scope.tab1TtlItem);
                        }
                    });                
            }
            //$scope.openCepFavTab = function () {
            //    if ($scope.isFavGridRender === false) {
            //        $timeout(function () { $scope.isFavGridRender = true;});
            //    }
            //}
            $scope.$on("updateEmployeeData", function (event, args) {
                $rootScope.errorLogMethod("CepFavModule.$scope.$on.updateEmployeeData");
               //refresh grid on designate change or add/remove cep code.
                if (args.value === appConstants.BroadCastUpdate.updateFavCep || args.value === appConstants.BroadCastUpdate.updateAll) {
                    var loginDetail = $rootScope.GetLoginDetail(false, true);
                    $scope.apiArguments.empId = loginDetail.EMPLID;
                    //on designate change set the page no=1 
                    if (args.value === appConstants.BroadCastUpdate.updateAll) {
                        $scope.gridCepFavoriteOptions.inputPageNo=1;
                        $scope.apiArguments.pageNumber = 1;
                    }
                    $scope.loadEmpFavCepData();
                }

            });
            $scope.triggerNewEntryWindow = function (row) {
                $rootScope.errorLogMethod("CepFavModule.$scope.triggerNewEntryWindow");
                if (!$rootScope.columnBlank) {
                    row.entity.cepCodeWithMask = row.entity.CEPCODE;
                    row.entity.cepCodeWithOutMask = row.entity.CEPCODE.replace(/\-/g, '');
                    broadcastService.notifyRightPanelCEPCodefavourite(row.entity);
                }
                else {
                    var sendData = {
                        errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                    };
                    $scope.openModalCtrl = 'showValidationMsg';
                    sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                }
            }
            $scope.loadCepFavWindow = function (event) {
                $rootScope.errorLogMethod("CepFavModule.$scope.loadCepFavWindow");
                 event.stopPropagation();
                var sendData = {
                    sessionKey: $scope.apiArguments.sessionKey,
                    empId: $scope.apiArguments.empId,
                    cepCode: "",                    
                    reordPerPage: 50,
                    popUpName: "CEPFavPopUp",
                    isSearchMode: false,
                    companyId: $scope.initialDetail.COMP_REC.COMPID,
                    domainURL: $scope.domainURL,
                    isBroadcast: true,
                    rowDetail: null,
                    isCepFavoriteRightPanel: true

                }
                sharedService.openModalPopUp('Desktop/NewEntry/templates/CEPCodeFavorites.html', 'CEPCodeFavDesktopCtrl', sendData);
            }
            $scope.loadEmpFavCepData = function () {
                $rootScope.errorLogMethod("CepFavModule.$scope.loadEmpFavCepData");
                getFavCEPCodes($scope.apiArguments);
            }
            $scope.billableVar = $filter('translate')('msg_BillableVar');
            $scope.nonbillableVar = "Non " + $filter('translate')('msg_BillableVar');
            var columnDefs = [
                               {
                                   enableSorting: false, cellClass: "gridRightPaneFav", name: 'Delete', displayName: '', width: 45, enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" style="max-width:45px"  value={{row.entity}} title="{{ ::grid.appScope.dltTitle}}" class="icon-delete ui-grid-cell-contents"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.removeFrmFavCEP(row.entity)" type="image" id="myimage" /></div>', visible: true
                               },
                                 
                                {
                                    width: 100, sort: { direction: uiGridConstants.ASC, priority: 0, }, suppressRemoveSort: true, name: 'cepCode', field: 'CEPCODE', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>'
                                }, {
                                    width: 70, suppressRemoveSort: true, name: 'isBillable', field: 'CHARBASIS', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: $filter('translate')('msg_BillableVar'), enableCellEdit: false, cellTemplate: '<span>{{(COL_FIELD==="S" || COL_FIELD==="C")?("Chargeable"):(COL_FIELD==="T"?(grid.appScope.billableVar):(COL_FIELD==="N"?(grid.appScope.nonbillableVar):COL_FIELD))}}</span>',
                                },
                                 {
                                     width: 130, suppressRemoveSort: true, name: 'GLOBBUSI', field: 'GLOBBUSI', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_glblSubBsns'), enableCellEdit: false,
                                     cellTemplate: '<span class="ui-grid-cell" title="{{(row.entity.GLOBBUSI)}}">{{(row.entity.GLOBBUSI)}}</span>'
                                 }
                                 ,
                                 {
                                     width: 80, suppressRemoveSort: true, name: 'OCOMP', field: 'OCOMP', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_cmpny'), enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>',
                                 },
                                 {
                                     width: 140, suppressRemoveSort: true, name: 'RMGR', field: 'RMGR', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_relnMngr'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.RMGR)}}">{{(row.entity.RMGR)}}</span>'
                                 }
                                 ,
                                 {
                                     width: 100, suppressRemoveSort: true, name: 'PROG', field: 'PROG', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_ProgNm'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.PROG)}}">{{(row.entity.PROG)}}</span>'
                                 }
                                 ,
                                 {
                                     width: 150, suppressRemoveSort: true, name: 'ENGCON', field: 'ENGCON', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_EngCons'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.ENGCON)}}">{{(row.entity.ENGCON)}}</span>'
                                 }
                                 ,
                                 {
                                     width: 150, suppressRemoveSort: true, name: 'ENGO', field: 'ENGO', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_engOffc'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.ENGO)}}">{{(row.entity.ENGO)}}</span>'
                                 }
                                  ,
                                 {
                                     width: 150, suppressRemoveSort: true, name: 'ENGNAME', field: 'ENGNAME', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_EngNm'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.ENGNAME)}}">{{(row.entity.ENGNAME)}}</span>'
                                 }
                                 ,
                                 {
                                     width: 120, suppressRemoveSort: true, name: 'PRJM', field: 'PRJM', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_PrjMgr'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.PRJM)}}">{{(row.entity.PRJM)}}</span>'
                                 }
                                 ,
                                 {
                                     width: 100, suppressRemoveSort: true, name: 'PRJO', field: 'PRJO', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_ProjectOffc'), enableCellEdit: false,
                                     cellTemplate: '<span class="" title="{{(row.entity.PRJO)}}">{{(row.entity.PRJO)}}</span>'
                                 },
                                 {
                                     width: 180, suppressRemoveSort: true, name: 'PRJNAME', field: 'PRJNAME', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_prjNm'), enableCellEdit: false,
                                     cellTemplate: '<span class=""  title="{{(row.entity.PRJNAME)}}">{{(row.entity.PRJNAME)}}</span>'
                                 }
            ];

            $scope.gridCepFavoriteOptions = {
                showHeader: true,
                excessRows: 100,
                excessColumns: 20,
                pagingMsg:"",
                inputPageNo: 1,
                rowHeight: 19,
                enableColumnMenus: false,
                paginationPageSizes: [recordPerPage],
                paginationPageSize: recordPerPage,
                useExternalPagination: true,
                enableVerticalScrollbar: 1,
                enableHorizontalScrollbar: uiGridConstants.ALWAYS,
                totalItems: 0,
                enableGridMenu: false,
                enableCellSelection: true,
                enableCellEditOnFocus: false,
                enableFiltering: false,
                enableRowSelection: true,
                treeRowHeaderAlwaysVisible: false,
                enableRowHeaderSelection: false,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                columnDefs: columnDefs,
                canSelectRows: true,
                onRegisterApi: function (gridApi) {
                    $rootScope.errorLogMethod("CepFavModule.$scope.gridCepFavoriteOptions.onRegisterApi");
                    $scope.gridCepFavApi = gridApi;
                    $timeout(function () {
                        if ($scope.isRefreshGrid) {
                            localStorage.GroupingCalledCEPFav = "1";
                            $scope.gridCepFavApi.saveState.restore($scope, $scope.windowLayout);
                            $scope.isRefreshGrid = false;
                        }
                    });
                   
                    gridApi.core.on.rowsRendered($scope, function () {
                        //expand rows if grouping
                    });
                    gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                        $rootScope.errorLogMethod("CepFavModule.gridApi.core.on.columnVisibilityChanged");
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $rootScope.errorLogMethod("CepFavModule.gridApi.pagination.on.paginationChanged");
                        $scope.apiArguments.pageNumber = newPage;
                        getFavCEPCodes($scope.apiArguments);
                    });
                    gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        $rootScope.errorLogMethod("CepFavModule.gridApi.core.on.sortChanged");
                        if (sortColumns.length > 1) {
                            sortColumns[0].unsort();
                        }
                    });
                },
                rowTemplate: "<div  ng-dblclick=\"grid.appScope.triggerNewEntryWindow(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"
            };
            init();
        }]
    return {       
        controller: myContrl,        
        templateUrl: 'Desktop/ManageFavourites/CepFav/CepFav.html'
    }
}])
}());