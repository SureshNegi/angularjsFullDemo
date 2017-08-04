angular.module('MyTimeApp')
.controller('favoritesCtrl', ['$scope', 'uiGridConstants', '$window', '$filter', '$rootScope', '$timeout', 'cepService', 'broadcastService', 'openPopUpWindowFactory', function ($scope, uiGridConstants, $window, $filter, $rootScope, $timeout, cepService, broadcastService, sharedService) {
    var recordPerPage = 3;   
    $scope.init = function () {
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
        $scope.isCepFavorite = false;
        $scope.showFavorites();
    }
    var getFavCEPCodes = function (arguments) {
        cepService.getFavCEP(arguments.sessionKey, arguments.empId, "", arguments.pageNumber, arguments.reordPerPage, arguments.sorOrder)
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
                    bindGridData(items);
                }

            });

    }

    var bindGridData = function (gridDataAr) {
        $timeout(function () {           
            $scope.gridCepFavoriteOptions.totalItems = $scope.tab1TtlItem;
            localStorage.GroupingCalledCEPFav = "1";
            $scope.gridCepFavoriteOptions.data = gridDataAr;
            $scope.gridCepFavoriteOptions.enableHorizontalScrollbar = 1;            
        }, 100);
    }

    $scope.removeFrmFavCEP = function (cepObj, isFavMode) {
        var data = {
            "NUMBER": [cepObj.PRJID]
        };
        var prj_arr = JSON.stringify(data);
        cepService.removeCEPFavorites($scope.arguments.sessionKey, $scope.arguments.empId, prj_arr).then(function (response) {
            if (parseInt(response.REMCEPFAV_OUT_OBJ.RETCD) == 0) {
                cepObj.CEPFAV = "N";
            }
        });
        if (isFavMode) {
            $scope.listFavCep = $scope.listFavCep.filter(function (cep) {
                return cep.PRJID !== cepObj.PRJID
            });
            bindGridData($scope.listFavCep);
        }
    }

    $scope.triggerNewEntryWindow = function (row) {
            row.entity.cepCodeWithMask = row.entity.CEPCODE;
            row.entity.cepCodeWithOutMask = row.entity.CEPCODE.replace(/\-/g, '');
            broadcastService.notifyRightPanelCEPCodefavourite(row.entity);      
    }
    $scope.resizeCepFavWindow = function (mode) {
             var sendData = {
             sessionKey: $scope.loginDetail.SESKEY,
              empId: $scope.loginDetail.EMPLID,
              cepCode: "",
              //cepCode: cepSrchStr === null ? "" : cepSrchStr,
              reordPerPage: 25,
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
    $scope.showFavorites = function () {     
        $scope.isCepFavorite = true;
        getFavCEPCodes($scope.apiArguments);
    }

    var columnDefs = [
                       {
                           enableSorting: false, name: 'Delete', displayName: '', maxWidth: '45', headerCellClass: 'activityHeaderFav', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" style="max-width:45px"  value={{row.entity}} class="icon-delete ui-grid-cell-contents"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.removeFrmFavCEP(row.entity,true)" type="image" id="myimage" /></div>', visible: true
                       },
                          {
                              suppressRemoveSort: true, name: 'clientName', field: 'CLIENO', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Client', enableCellEdit: false, visible: false
                          },
                        {
                            sort: { direction: uiGridConstants.ASC, priority: 0, }, suppressRemoveSort: true, name: 'cepCode', field: 'CEPCODE', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: false, cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%"><div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div><div ng-if="!row.groupHeader" class="ui-grid-cell" ng-bind="row.entity.CEPCODE" ></div></div>'
                        }, {
                            suppressRemoveSort: true, name: 'isBillable', field: 'CHARBASIS', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Billable', enableCellEdit: false, cellTemplate: '<div>{{(COL_FIELD==="S" || COL_FIELD==="C")?("Chargeable"):(COL_FIELD==="T"?"Billable":(COL_FIELD==="N"?"Non-billable":COL_FIELD))}}</div>',
                        },
                         {
                             suppressRemoveSort: true, name: 'GLOBBUSI', field: 'GLOBBUSI', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_glblSubBsns'), enableCellEdit: false,
                         }
                         ,
                         {
                             suppressRemoveSort: true, name: 'OCOMP', field: 'OCOMP', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_cmpny'), enableCellEdit: false,
                         },
                         {
                             suppressRemoveSort: true, name: 'RMGR', field: 'RMGR', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_relnMngr') , enableCellEdit: false,
                         }
                         ,
                         {
                             suppressRemoveSort: true, name: 'PROG', field: 'PROG', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_ProjNm'), enableCellEdit: false,
                             cellTemplate: '<div class="ui-grid-cell" title="{{(row.entity.PROG)}}">{{(row.entity.PROG)}}</div>'
                         }
                         ,
                         {
                             suppressRemoveSort: true, name: 'ENGCON', field: 'ENGCON', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_EngCons') , enableCellEdit: false,
                         }
                         ,
                         {
                             suppressRemoveSort: true, name: 'ENGO', field: 'ENGO', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_engOffc'), enableCellEdit: false,
                         }
                          ,
                         {
                             suppressRemoveSort: true, name: 'ENGNAME', field: 'ENGNAME', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_EngNm'), enableCellEdit: false,
                         }
                         ,
                         {
                             suppressRemoveSort: true, name: 'PRJM', field: 'PRJM', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_PrjMgr'), enableCellEdit: false,
                         }
                         ,
                         {
                             suppressRemoveSort: true, name: 'PRJO', field: 'PRJO', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('lbl_ProjectOffc'), enableCellEdit: false,
                         },
                         {
                             suppressRemoveSort: true, name: 'PRJNAME', field: 'PRJNAME', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: $filter('translate')('msg_prjNm'), enableCellEdit: false,
                         }
    ];

    $scope.gridCepFavoriteOptions = {
        showHeader: true,
        inputPageNo: 1,
        enableColumnMenus: false,
        paginationPageSizes: [3],
        paginationPageSize: 3,
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
            $scope.gridApi = gridApi;
            $timeout(function () {
                if ($scope.isRefreshGrid) {
                    localStorage.GroupingCalledCEPFav = "1";
                    $scope.gridApi.saveState.restore($scope, $scope.windowLayout);
                    $scope.isRefreshGrid = false;
                }
            });
           
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length > 2) {
                    sortColumns[1].unsort();
                }
            });
            gridApi.core.on.rowsRendered($scope, function () {
               //expand rows if grouping
            });          
            gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {              
                $scope.apiArguments.pageNumber = newPage;
                getFavCEPCodes($scope.apiArguments);
            });
        },
        rowTemplate: "<div  ng-dblclick=\"grid.appScope.triggerNewEntryWindow(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"
    };

}]);