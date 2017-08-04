(function () {
    angular.module('ActivityModule', ['ui.router', 'ngSanitize', 'ui.select', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.bootstrap', 'ui.bootstrap.multidatepicker', 'ui.bootstrap.datepicker', 'gm.datepickerMultiSelect', 'ngStorage', 'infinite-scroll', 'ui.mask', 'ngMessages', 'ng.deviceDetector', 'ngRoute', 'ngCookies', 'pascalprecht.translate', 'treeControl', 'ui.grid.saveState']);
}());
(function () {
    var app = angular.module('ActivityModule');
    app.directive('activityFav', [function () {

        var myContrl = ['$scope', '$rootScope', 'uiGridConstants', 'activityService', 'constantService', 'activityFavService', 'openPopUpWindowFactory', '$filter', function ($scope, $rootScope, uiGridConstants, activityService, appConstants, activityFavService, sharedService, $filter) {
            $scope.dltTitle = $filter('translate')('btn_Delete');
            $scope.gridActivityOptions = {
            showHeader: true,
            excessRows: 100,
            enableColumnMenus: false,
            enableVerticalScrollbar: uiGridConstants.ALWAYS,
            enableHorizontalScrollbar: uiGridConstants.ALWAYS,
            showGridFooter: false,
            rowHeight: 19,
            showColumnFooter: false,
            enableGridMenu: true,
            enableCellSelection: true,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: true,
            treeRowHeaderAlwaysVisible: false,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: true,
            gridFooterTemplate: '<div></div>',
            columnDefs: [
                {
                    enableColumnMoving: false, enableSorting: false, name: 'Delete', displayName: '', maxWidth: '45', width: '5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: true, cellTemplate: '<div style="max-width:45px"  value={{row.entity}} title="{{ ::grid.appScope.dltTitle}}" class="icon-delete ui-grid-cell-contents"><input class="entry-delete" ng-click="grid.appScope.removeFrmFavActivity(row.entity)" type="image" id="myimage" /></div>', visible: true
                },

        {
            //   name: 'ACTICD', field: 'ACTICD', sort: { direction: 'asc', priority: 1 }, enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Code', enableCellEdit: false, 
            enableColumnMoving: false,  name: 'ACTICD', sort: { direction: uiGridConstants.ASC, priority: 0, }, suppressRemoveSort: true, field: 'ACTICD', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: 'Code', maxWidth: '55', enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>'
        },
                 {
                     enableColumnMoving: false,  name: 'DES', suppressRemoveSort: true, field: 'DES', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: 'Description', width: '70%', enableCellEdit: false, cellTemplate: '<span ng-attr-title="{{COL_FIELD}}">{{COL_FIELD}}</span>'
                 }
            ],
            //sortInfo: { fields: ['ACTICD'], directions: ['asc'] },
            canSelectRows: false,
            onRegisterApi: function (gridApi) {
                $rootScope.errorLogMethod("ActivityModule.onRegisterApi");
                $scope.gridActivityApi = gridApi;
                gridApi.selection.selectRow($scope.gridActivityOptions.data[0]);
                gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                    $scope.columnChanged = {
                        name: changedColumn.colDef.name, visible: changedColumn.colDef.visible
                    };
                });
                gridApi.core.on.rowsRendered($scope, function () {
                   
                });
                $scope.gridActivityApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length > 1) {
                        sortColumns[0].unsort();
                    }
                });
            },
            rowTemplate: "<div ng-dblclick=\"grid.appScope.onGridRowDblClick(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

            //appScopeProvider: $scope.myAppScopeProvider,

        };

        $scope.favDataList = [];
        function init() {
            $rootScope.errorLogMethod("ActivityModule.init");
           // $scope.items = angular.copy($scope.datasource);
            bindGridData();
        }
        var bindGridData = function () {           
            $rootScope.errorLogMethod("ActivityModule.bindGridData");
            checkLclStorage();
            $scope.gridActivityOptions.enableHorizontalScrollbar = 1;
            $scope.gridActivityOptions.enableVerticalScrollbar = 1;
        }
        $scope.$on("updateEmployeeData", function (event, args) {
            $rootScope.errorLogMethod("ActivityModule.$scope.$on.updateEmployeeData");
            if (args.value === appConstants.BroadCastUpdate.updateFavActivity || args.value === appConstants.BroadCastUpdate.updateAll)
            bindGridData();

        });
        var pushDataToList = function (items) {            
            $rootScope.errorLogMethod("ActivityModule.pushDataToList");
            var list = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].STAT == 'Y') {
                    items[i].fav = true;
                    list.push(items[i]);
                }
            }
            if (!sessionStorage.FavActivityArray || sessionStorage.FavActivityArray.length == 0) {
                sessionStorage.setItem('FavActivityArray', JSON.stringify(list));
            }
            $scope.gridActivityOptions.data = list;
        }
        var checkLclStorage = function () {
            $rootScope.errorLogMethod("ActivityModule.checkLclStorage");
            //$scope.favDataList = [];
            var list = JSON.parse(sessionStorage.getItem('FavActivityArray'));
            if (list != null) {
                pushDataToList(list);
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                getFavActivityFrmAPI(loginDetail);
            }           
          
            
        }
        $scope.openActivityFavWindow = function (event) {
            $rootScope.errorLogMethod("ActivityModule.$scope.openActivityFavWindow");
            event.stopPropagation();
            var sendData = {
            activtyObj: null, isSameCompany: true, cepCompId : $scope.initialDetail.COMP_REC.COMPID, isCepValid: true, compRecCompId : $scope.initialDetail.COMP_REC.COMPID, isBroadcast: false, isActivityFavoriteRightPanel: true
                        }
                    $scope.openModalCtrl = 'ActivityCtrl';
                    sendData.popUpName = 'ActivityCtrl';
                    $scope.open('Desktop/NewEntry/templates/Activity.html', 'ActivityDesktopCtrl', sendData);
                      
        }
        $scope.removeFrmFavActivity = function (activity) {
            $rootScope.errorLogMethod("ActivityModule.$scope.removeFrmFavActivity");
            //if (($scope.isSameCompany)) {
                var data = {
                    VARCHAR2: []
                };
                data.VARCHAR2 = [activity.ACTICD];
                var act_arr = JSON.stringify(data);
                activityService.removeActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                    if (response.REMACTIFAV_OUT_OBJ.RETCD == 0) {
                        activity.IsFav = false;
                        activityFavService.updateFavActLclStorage(false, [activity], 1);
                    }
                });
            //}
        }
        var getFavActivityFrmAPI = function (loginDetail) {
            $rootScope.errorLogMethod("ActivityModule.getFavActivityFrmAPI");            
            var list = [];
            activityService.retrieveActivityFavorites(loginDetail.SESKEY, loginDetail.EMPLID)
               .then(function (response) {
                   if (response.RETACTIFAV_OUT_OBJ.RETCD == 0) {
                       list = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                   }
                   if (response.RETACTIFAV_OUT_OBJ.ACTI_ARR != null) {
                       if (Object.prototype.toString.call(response.RETACTIFAV_OUT_OBJ.ACTI_ARR) != '[object Array]') {
                           var data = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                           response.RETACTIFAV_OUT_OBJ.ACTI_ARR = [];
                           if (data != null)
                               response.RETACTIFAV_OUT_OBJ.ACTI_ARR.push(data.ACTI_OBJ);
                       }
                   }


                   var items = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;                   
                   if (items === null)
                       items = [];
                   pushDataToList(items);                                    
               });
        }
        init();
    }]
    return {
        //controllerAs: 'ctrl',
        controller: myContrl,
        //controllerAs: 'vm',
        //bindToController: true,
        templateUrl: 'Desktop/ManageFavourites/Activity/Activity.html'

    }
}])
}());