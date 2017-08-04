(function () {
    angular.module('DescModule', ['ui.router', 'ngSanitize', 'ui.select', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.bootstrap', 'ui.bootstrap.multidatepicker', 'ui.bootstrap.datepicker', 'gm.datepickerMultiSelect', 'ngStorage', 'infinite-scroll', 'ui.mask', 'ngMessages', 'ng.deviceDetector', 'ngRoute', 'ngCookies', 'pascalprecht.translate', 'treeControl', 'ui.grid.saveState']);
}());
(function () {
    var app = angular.module('DescModule');
    app.directive('descFav', [function () {
        var myContrl = ['$scope', '$rootScope', 'uiGridConstants', 'cepService', 'descFavService', '$timeout', 'constantService', '$filter', function ($scope, $rootScope, uiGridConstants, cepService, descFavService, $timeout, appConstants, $filter) {
            $scope.dltTitle = $filter('translate')('btn_Delete');
            $scope.gridDescOptions = {
            showHeader: true,
            excessRows: 100,
            enableVerticalScrollbar: 1,
            enableHorizontalScrollbar: 0,
            showGridFooter: true,
            headerHeight: 20,
            rowHeight: 19,
            showColumnFooter: false,
            enableGridMenu: true,
            enableColumnMenus: false,
            enableCellSelection: true,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: true,
            treeRowHeaderAlwaysVisible: false,
            enableRowHeaderSelection: false,
            multiSelect: true,
            modifierKeysToMultiSelect: true,
            gridFooterTemplate: '<div></div>',
            columnDefs: [
                { cellClass: 'gridDesFavRghtPane', enableColumnMoving: false, enableSorting: false, width: '36', name: 'Delete', displayName: '', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: true, cellTemplate: '<div   value={{ row.entity}} class="icon-delete ui-grid-cell-contents" title="{{ ::grid.appScope.dltTitle}}"><input class="entry-delete" ng-click="grid.appScope.removeFromFavDescription(row.entity)"  type="image" id="myimage" /></div>' },

                {
                    enableColumnMoving: false, name: 'data', width: '*', field: 'data', sort: { direction: 'asc' }, suppressRemoveSort: true, enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: true, displayName: 'Description', enableCellEdit: false, cellTemplate: '<span   ng-attr-title="{{COL_FIELD}}" style="line-height:20px;display:block;">{{COL_FIELD}}</span>'
                }

            ],
            canSelectRows: false,
            rowTemplate: "<div  ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

            //appScopeProvider: $scope.myAppScopeProvider,

        };       
            $scope.openDescFavWindow = function (event) {
            $rootScope.errorLogMethod("DescModule.$scope.openDescFavWindow");
            event.stopPropagation();
            var sendData = {
                IsActivity: true,
                desc: null, isBroadcast: true, isDesFavoriteRightPanel : true
            }
            $scope.openModalCtrl = 'DescriptionCtrl';
            $scope.open('Desktop/NewEntry/templates//Description.html', 'DescriptionDesktopCtrl', sendData);
            $scope.isDescriptionPopupLoad = true;
        }
            $scope.removeFromFavDescription = function (row) {
            $rootScope.errorLogMethod("DescModule.$scope.removeFromFavDescription");
            //alert(JSON.stringify($scope.loginDetail));
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            var val = [];            
                val[0] = row.data; 
            var data = {
                "VARCHAR2": val
            }
            var destxt_arr = JSON.stringify(data);
            cepService.removeDescriptionFavorites(loginDetail.SESKEY, loginDetail.EMPLID, destxt_arr).then(function (response) {
                if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                    updateGridData( val);
                }
            });
        };
            var updateGridData = function (dataAray) {
         $rootScope.errorLogMethod("DescModule.updateGridData");
         var  allDataList = descFavService.updateFavDescLocalStorage(false, dataAray, false, -1);
           setGridData(allDataList);
        }
            function init() {
            $rootScope.errorLogMethod("DescModule.init");
            updateDataSourse();
        }
            var updateDataSourse = function () {
            $rootScope.errorLogMethod("DescModule.updateDataSourse");           
            checkLclStorage();            
        }

            $scope.$on("updateEmployeeData", function (event, args) {
            $rootScope.errorLogMethod("DescModule.$scope.$on.updateEmployeeData");
            if (args.value === appConstants.BroadCastUpdate.updateFavDesc || args.value=== appConstants.BroadCastUpdate.updateAll)
            updateDataSourse();
        });

            var setGridData = function (list) {
            $rootScope.errorLogMethod("DescModule.setGridData");
            var dataList = [];
            for (var i = 0; i < list.length; i++) {
                var item = {
                    data: list[i],
                    fav: true
                };
                dataList.push(item);
            }
            $scope.gridDescOptions.data = dataList;
        }
            var checkLclStorage = function () {
            $rootScope.errorLogMethod("DescModule.checkLclStorage");
            var list = JSON.parse(sessionStorage.getItem('DescFav'));
            if (list != null) {
                setGridData(list);
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                getFavDescFrmAPI(loginDetail);
            }
        }
            var getFavDescFrmAPI = function (loginDetail) {
                $rootScope.errorLogMethod("DescModule.getFavDescFrmAPI");
                cepService.retrieveDescriptionFavorites(loginDetail.SESKEY, loginDetail.EMPLID)
                        .then(function (response) {
                            if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                                if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                                    var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                                    response.RETDESCFAV_OUT_OBJ.DESTXT_ARR = [];
                                    if (data != null && data.VARCHAR2 != undefined)
                                        response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                                }
                                sessionStorage.setItem('DescFav', JSON.stringify(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR));
                                setGridData(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR);
                            }
                        });           
        }
        init();
    }]
    return {
        //controllerAs: 'ctrl',
        controller: myContrl,
        //controllerAs: 'vm',
        //bindToController: true,
        templateUrl: 'Desktop/ManageFavourites/Description/Desccription.html'

    }
}])
}());