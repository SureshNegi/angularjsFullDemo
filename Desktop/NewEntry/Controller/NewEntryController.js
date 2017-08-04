/*
reference:
https://docs.angularjs.org/api/ng/filter/filter
*/
angular.module('MyTimeApp')
.controller('ErrorDesktopPopupCtrl', ['$scope', '$rootScope', '$modalInstance', 'arguments', '$filter', '$timeout', 'broadcastService', function ($scope, $rootScope, $modalInstance, arguments, $filter, $timeout, broadcastService) {
    $scope.windowConfig = { title: "Message", isWarning: true, errorTitle: $filter('translate')('lbl_Error')}
    $scope.popUpName = 'ErrorPopup';
    $scope.arguments = arguments;
    $scope.errList = [];
    $scope.isDailyMode = true;
    var bindDraggable = function () {
        $rootScope.errorLogMethod("ErrorDesktopPopupCtrl.bindDraggable");
            $("#alertDivDesktop, #innerAlertDiv").draggable({
                start: function (event, ui) {                    
                    if (event.target.id == "innerAlertDiv")
                        return false;
                    else
                        $("#alertDivDesktop").css('cursor', 'move');
                },
                stop: function () { $("#alertDivDesktop").css('cursor', 'default'); }
            });     
    }
    $scope.close = function () {
        $rootScope.errorLogMethod("ErrorDesktopPopupCtrl.$scope.close");
        localStorage.isReportPopUpOpen = "false";
         $timeout(function () {
                    if ($(".modal").css("display") != "block")
                        angular.element('#divdatepicker').focus();
                    }, 100);
         $modalInstance.close();
         if ($scope.arguments.isProjectTaskInvalid) {
             broadcastService.notifyloadDesktopActivityProject();
         }
    };

    $scope.init = function () {
        $rootScope.errorLogMethod("ErrorDesktopPopupCtrl.$scope.init");
        $timeout(function () { $("#closeBtn").focus(); }, 300);
        $timeout(function () { $("#closeBtn").focus(); }, 400);
        $timeout(function () { $("#closeBtn").focus(); }, 500);
        $timeout(function () { $("#closeBtn").focus(); }, 2500);
        $timeout(function () { $("#closeBtn").focus(); }, 3500);
        $timeout(function () { $("#closeBtn").focus(); }, 4500);
        bindDraggable();
        var errlist = $scope.arguments.errorList;
        $scope.errList = $scope.arguments.errorList;
        if ($scope.arguments.title != undefined && $scope.arguments.title != "") {
            $scope.windowConfig.title = $scope.arguments.title;
        }
        if ($scope.arguments.isWarning != undefined) {
            $scope.windowConfig.isWarning = $scope.arguments.isWarning;
        }
        if ($scope.windowConfig.isWarning === false) {
            $scope.windowConfig.title = $scope.windowConfig.errorTitle;
    }
    }
}])

.controller('importExchangeErrorCtrl', ['$scope', '$rootScope', '$modalInstance', 'arguments', '$filter', '$timeout', function ($scope, $rootScope, $modalInstance, arguments, $filter, $timeout) {
        $scope.windowConfig = { title: "Message", isWarning: true, errorTitle: $filter('translate')('lbl_Error') }
        $scope.popUpName = 'ExchngPopup';
        $scope.arguments = arguments;
        $scope.errList = [];
        $scope.isDailyMode = true;
        $scope.close = function () {
            $rootScope.errorLogMethod("importExchangeErrorCtrl.$scope.close");
            $timeout(function () {
                if ($(".modal").css("display") != "block")
                    angular.element('#divdatepicker').focus();
            }, 400);
            $modalInstance.close();
        };

        $scope.init = function () {
            $rootScope.errorLogMethod("importExchangeErrorCtrl.$scope.init");
            setTimeout(function () { document.getElementById("closeBtn").focus(); }, 100);
            var errlist = $scope.arguments.errorList;
            $scope.errList = $scope.arguments.errorList;
            
        }
    }])

    .controller('MaintenanceDesktopPopupCtrl', ['$scope', '$rootScope', '$modalInstance', 'arguments', '$filter', '$window', function ($scope, $rootScope, $modalInstance, arguments, $filter, window) {
        $scope.windowConfig = { title: "", isWarning: true }
        $scope.popUpName = 'MaintenancePopup';
        $scope.arguments = arguments;
        $scope.errList = [];
        $scope.close = function () {
            $rootScope.errorLogMethod("MaintenanceDesktopPopupCtrl.$scope.close");
            window.open('', '_self', ''); window.close();
        };

        $scope.init = function () {
            $rootScope.errorLogMethod("MaintenanceDesktopPopupCtrl.$scope.init");
            $('.modal-backdrop.in').attr("opacity", "0.2");
            var errlist = $scope.arguments.errorList;

            $scope.errList = $scope.arguments.errorList;
            if ($scope.arguments.title != undefined && $scope.arguments.title != "") {
                $scope.windowConfig.title = $scope.arguments.title;
            }
            if ($scope.arguments.isWarning != undefined) {
                $scope.windowConfig.isWarning = $scope.arguments.isWarning;
            }
        }
    }])


.controller('ActivityDesktopCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'activityService', '$state', '$timeout', 'arguments', 'activityFavService', 'broadcastService', '$document', 'uiGridConstants', 'openPopUpWindowFactory', 'resizeWindowService', function ($rootScope, $filter, $scope, $modalInstance, activityService, $state, $timeout, selectedData, activityFavService, broadcastService, $document, uiGridConstants, sharedService, resizeWindowService) {
    $scope.dltTitle = $filter('translate')('btn_Delete');
    $scope.isRendered = true;
    $scope.popUpName = 'Activity';
    $scope.isFilterByCode = true;
    $scope.isFilterByDesc = true;
    $scope.isLoaded = false;
    $scope.noRecordMsg = "";
    $scope.domainURL = "";
    $scope.loginDetail = null;
    $scope.initialDetail = null;
    $scope.activityList = [];
    $scope.favActivityObj = [];
    $scope.selectedData = selectedData;
    $scope.isCepValid = selectedData.isCepValid;
    $scope.isSameCompany = selectedData.isSameCompany;
    $scope.allActivityList = [];
    $scope.showSrchSelection = false;
    $scope.searchText = '';
    $scope.isSet = false;
    $scope.isMinimize = true;
    $scope.maxMode = null;
    $scope.minMode = null;
    $scope.srchTxtVar = $filter('translate')('lbl_srchTxt');
    $scope.dltAllVar = $filter('translate')('lbl_dltAll');
    var settings = resizeWindowService.getMaxMinSettings(10, 23, 28, 800, 293);
    $scope.maxMode = settings[1];    
    $scope.maxMode.innerHeight = $scope.maxMode.height - $scope.maxMode.topHeader+4;   
    $scope.maxMode.gridHeight = $scope.maxMode.innerHeight - $scope.maxMode.section1Hgt - 10;
    $scope.maxMode.gridWidth = $scope.maxMode.width - 10;
    $scope.maxMode.gridViewPortHeight = $scope.maxMode.gridHeight - 24;
    $scope.maxMode.innerHeight1 = $scope.maxMode.innerHeight;

    $scope.minMode = settings[0];
    $scope.minMode.innerHeight = $scope.minMode.height - $scope.minMode.topHeader - 5; 
    $scope.minMode.gridHeight = $scope.minMode.innerHeight - $scope.minMode.section1Hgt-10;
    $scope.minMode.gridWidth = $scope.minMode.width - 10;
    $scope.minMode.gridViewPortHeight = $scope.minMode.gridHeight - 24;
    $scope.minMode.innerHeight1 = $scope.minMode.innerHeight + 5;
   
    $scope.windowConfig = angular.copy($scope.minMode);
    localStorage.gridActivityViewportHeight = $scope.windowConfig.gridViewPortHeight; 
    var validCepMsg = $filter('translate')('msg_ValidCep') + "...";
    var noFavCepMsg = $filter('translate')('msg_noFav');

    $scope.resizeWindow = function (mode) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.resizeWindow");
        $scope.windowLayout = {};
        var data = $scope.gridOptions.data;
        if ($scope.gridApi !== undefined) {          
            $scope.windowLayout = $scope.gridApi.saveState.save();
        }
        if (mode == 0) {
            $scope.isMinimize = true;
        }
        else {
                $scope.isMinimize = false;
        }
        if ($scope.isMinimize) {
            $timeout(function () { $("#activityPopUp").draggable("enable"); }, 100);
            $scope.minMode.isRenderGrid = false;
            $scope.windowConfig = angular.copy($scope.minMode);
        }
        else {
            $scope.maxMode.isRenderGrid = false;
            $scope.windowConfig = angular.copy($scope.maxMode);
            $("#activityPopUp").draggable({ disabled: true });
        }
        localStorage.gridActivityViewportHeight = $scope.windowConfig.gridViewPortHeight;
        $timeout(function () {
            if ($scope.isCepValid) {
                $scope.windowConfig.isRenderGrid = true;
                $scope.windowConfig.isRefreshGrid = true;
            }

        }, 10)//.then($timeout(function () {  }));

    }
    $scope.toggleSrchSelection = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.toggleSrchSelection");
        $scope.showSrchSelection = !$scope.showSrchSelection;
        $scope.isSet = $scope.showSrchSelection;
    }

    var bindDraggable = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.bindDraggable");
    $timeout(function () {
        $("#activityPopUp, #innerActivityCont").draggable({
            start: function (event, ui) {
                if (event.target.id == "innerActivityCont")
                    return false;
                else
                    $("#activityPopUp").css('cursor', 'move');
            },
            stop: function () { $("#activityPopUp").css('cursor', 'default'); }
        });
        }, 100);
    }

    bindDraggable();

    $document.on('click', function (event) {        
        if (!$scope.isSet) {
            $scope.$apply(function () {
                $scope.showSrchSelection = false;
            });
        }
        $scope.isSet = false;
    });
    $scope.srchSelChange = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.srchSelChange");
        $scope.isSet = true;
    }
    $scope.ok = function (selectedItem) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.ok");
        if (selectedData.isBroadcast) {
            $rootScope.popupload = true;
            broadcastService.notifyRefreshGrid(selectedItem);
        }
        $modalInstance.close(selectedItem);

    };

    $scope.cancel = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.cancel");
        if (selectedData.isBroadcast) {
            broadcastService.notifyGridFocus("Activity");
        }
        $modalInstance.dismiss('cancel');

    };
    $scope.clearSearch = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.clearSearch");
        $scope.searchText = "";
        $scope.refreshData();
    }
    $scope.refreshData = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.refreshData");
        if ($scope.isShowAllActivity)
            $scope.allActivityList = JSON.parse(sessionStorage.getItem('FavActivityArray'));

        if (($scope.isFilterByCode == true && $scope.isFilterByDesc == true) || ($scope.searchText.trim() == "")) {           
            var serchStr = $scope.searchText.toLowerCase().trim();
            $scope.favActivityObj = $scope.allActivityList.filter(function (item) {
                return ((item.ACTICD.indexOf(serchStr) > -1) || (item.DES.toLowerCase().indexOf(serchStr) > -1))
            });
        }
        else if ($scope.isFilterByCode)
            $scope.favActivityObj = $filter('filter')($scope.allActivityList, { ACTICD: $scope.searchText }, undefined);
        else if ($scope.isFilterByDesc)
            $scope.favActivityObj = $filter('filter')($scope.allActivityList, { DES: $scope.searchText }, undefined);
        else if ($scope.isFilterByCode == false && $scope.isFilterByDesc == false)
            $scope.favActivityObj = [];
        $scope.gridOptions.data = $scope.favActivityObj;
    }

    $scope.onGridRowDblClick = function (row) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.onGridRowDblClick");
        if (!selectedData.isActivityFavoriteRightPanel) {
            $scope.ok(row);
        }
    }

    $scope.closeDropdown = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.closeDropdown");
        $scope.showSrchSelection = false;
    }

    $scope.gridOptions1 = {
        showHeader: true,
        enableColumnMenus: false,
        enableVerticalScrollbar: uiGridConstants.ALWAYS,
        enableHorizontalScrollbar: uiGridConstants.ALWAYS,
        showGridFooter: false,
        rowHeight: 19,
        excessRows: 100,
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
                enableColumnMoving: false, cellClass: 'gridActivityWindow', enableSorting: false, name: 'Delete', displayName: '', maxWidth: '45', headerCellClass: 'activityHeaderFav', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div style="max-width:45px"  title="{{grid.appScope.dltTitle}}" value={{row.entity}} class="icon-delete ui-grid-cell-contents"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.removeFrmFavActivity(row.entity)" type="image" id="myimage" /></div>', visible: false
            },
    {
        enableColumnMoving: false, cellClass: 'gridActivityWindow', enableSorting: false, name: 'Favr', displayName: '', suppressRemoveSort: true, maxWidth: '55', headerCellClass: 'activityHeaderFav', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div style="max-width:45px"><span class="star-fav ui-grid-cell-contents" ng-click="grid.appScope.removeFrmFavActivity(row.entity)" ng-show=(row.entity.fav)> <i class="fa fa-star"></i></span><span class="ui-grid-cell-contents star-no-fav" ng-click="grid.appScope.addToFavActivity(row.entity)" ng-show=(!row.entity.fav)> <i class="fa fa-star-o"></i></span></div>', visible: false
    },

{
    enableColumnMoving: false, cellClass: 'gridActivityWindow', name: 'ACTICD', sort: { direction: uiGridConstants.ASC, priority: 0, }, suppressRemoveSort: true, field: 'ACTICD', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Code', maxWidth: '55', headerCellClass: 'activityHeader', enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>'
},
             {
                 enableColumnMoving: false, cellClass: 'gridActivityWindow', name: 'DES', suppressRemoveSort: true, field: 'DES', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Description', width: '70%', enableCellEdit: false, cellTemplate: '<span ng-attr-title="{{COL_FIELD}}">{{COL_FIELD}}</span>'
             }
        ],
        canSelectRows: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.selectRow($scope.gridOptions.data[0]);
            gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                $scope.columnChanged = {
                    name: changedColumn.colDef.name, visible: changedColumn.colDef.visible
                };
            });
            gridApi.core.on.rowsRendered($scope, function () {
                if ($scope.windowConfig.isRefreshGrid) {
                    $scope.gridApi.saveState.restore($scope, $scope.windowLayout);
                    $scope.windowConfig.isRefreshGrid = false;
                }
            });
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length > 1) {
                    sortColumns[0].unsort();
                }
            });
        },
        rowTemplate: "<div ng-dblclick=\"grid.appScope.onGridRowDblClick(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"
    };

    // Add Activity Fav
    $scope.addToFavActivity = function (row) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.addToFavActivity");
        var activityAr = [row.ACTICD];
        var data = {
            "VARCHAR2": activityAr
        };
        var act_arr = JSON.stringify(data);
        if (($scope.isSameCompany)) {
            activityService.addActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.ADDACTIFAV_OUT_OBJ.RETCD == 0) {
                    row.fav = true;
                    activityFavService.updateFavActLclStorage(true, [row],1);
                }

            });
        }
    }

    $scope.removeAllActivity = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.removeAllActivity");
        if ($scope.favActivityObj.length > 0) {
            deleteConfirm();
        }
    }
    var deleteConfirm = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.deleteConfirm");
        var sendData = {
            msgList: [$filter('translate')('msg_dltFav')],
            isCancelBtnOn: true,
            okBtnText: $filter('translate')('btn_Yes'),
            noBtnTxt: $filter('translate')('btn_No'),
            popUpName: 'DeleteFavActPopUp'
        };
        sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
    }
    $scope.$on("deleteAllFavActConfirm", function (event, respoObj) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.$on.deleteAllFavActConfirm");
        if (respoObj.args.isConfirm) {
            $scope.removeFrmFavActivity(null);
        }
    });
    $scope.removeFrmFavActivity = function (row) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.removeFrmFavActivity");
        var data = {
            VARCHAR2: []
        };
        //remove the activity from the favourite list
        if (row != null) {
            data.VARCHAR2 = [row.ACTICD]
        }
            //remove all activity from favourite list while showing favourites only
        else if ($scope.isShowAllActivity) {
            var actIdArr = [];
            $scope.favActivityObj.forEach(function (activity) {
                actIdArr.push(activity.ACTICD);
            });
            data.VARCHAR2 = actIdArr;
        }
        else {
            return;
        }
        var act_arr = JSON.stringify(data);
        if (($scope.isSameCompany)) {
            activityService.removeActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.REMACTIFAV_OUT_OBJ.RETCD == 0) {
                    //remove the activity from the favourite list when showing only favourite activity
                    if ($scope.isShowAllActivity) {
                        //delete all
                        if (row == null) {
                            activityFavService.updateFavActLclStorage(false, $scope.favActivityObj,1);
                            $scope.favActivityObj = [];
                        }
                        else {
                            $scope.favActivityObj = $scope.favActivityObj.filter(function (activity) {
                                return activity.ACTICD !== row.ACTICD
                            });
                            activityFavService.updateFavActLclStorage(false, [row],1);                            
                        }
                        $scope.gridOptions.data = $scope.favActivityObj;

                    }                    
                    else {
                        activityFavService.updateFavActLclStorage(false, [row],1);
                        row.fav = false;
                    }
                }
            });
        }
    }

    $scope.init = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.init");
        $scope.isShowAllActivity = false;
        $scope.domainURL = $rootScope.domainURL;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.gridOptions = angular.copy($scope.gridOptions1);
        if ($scope.selectedData.cepCompId === null) {
            $scope.isCepValid = false;
        }
        if ($scope.isCepValid) {
            if ($scope.isSameCompany)
                $scope.getFavActivity(true);
            else
            $scope.getAllActivity();        
        }
        else {
            $scope.isLoaded = true;
        }
    }

    $scope.sendFavDataBack = function (index) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.sendFavDataBack");
        $scope.ok(($scope.favActivityObj[index]));
    }
    $scope.btnShowAllClick = function () {
        $scope.windowConfig.isRenderGrid = false;
        $scope.getAllActivity();
    }

    $scope.btnFavOnlyClick = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.btnFavOnlyClick");
        $scope.windowConfig.isRenderGrid = false;
        $scope.getFavActivity();
    }
    //Get the favourite cep code from API
    $scope.getFavActivity = function (isOnPageLoad) {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.getFavActivity");
        $scope.searchText = '';
        $scope.isLoaded = false;
        if ($scope.isSameCompany) {
            try {
                $scope.gridOptions.columnDefs[1].visible = false;
                $scope.gridOptions.columnDefs[0].visible = true;
                $scope.isShowAllActivity = true;
                $scope.favActivityObj = [];
                activityService.retrieveActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
                    .then(function (response) {
                        if (response.RETACTIFAV_OUT_OBJ.RETCD == 0) {
                            $scope.activityList = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
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
                        if (items != null) {
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].STAT == 'Y') {
                                    items[i].fav = true;
                                    $scope.favActivityObj.push(items[i]);
                                }
                            }
                        }
                        if ($scope.favActivityObj.length === 0 && isOnPageLoad) {
                            $scope.getAllActivity();
                        }
                        else {
                            $scope.gridOptions.data = $scope.favActivityObj;
                            $scope.allActivityList = $scope.favActivityObj;
                            sessionStorage.setItem('FavActivityArray', JSON.stringify($scope.favActivityObj));
                            $scope.isLoaded = true;
                            $scope.gridOptions.columnDefs[2].sort.direction = "asc";
                            $timeout(function () { $scope.windowConfig.isRenderGrid = true; });
                        }
                    });

            } catch (ex) { console.log("error in getFavActivity()"); $scope.isLoaded = true; $scope.windowConfig.isRenderGrid = true; }
        }
        else {
            $scope.isLoaded = true;
            $scope.isShowAllActivity = false;
        }

    };

    $scope.getAllActivity = function () {
        $rootScope.errorLogMethod("ActivityDesktopCtrl.$scope.getAllActivity");
        try {
        $scope.searchText = '';
        if ($scope.isSameCompany) {
            $scope.gridOptions.columnDefs[1].visible = true;
            $scope.gridOptions.columnDefs[0].visible = false;
        }
        $scope.isShowAllActivity = false;
        $scope.isLoaded = false;
        activityService.searchActivityCode($scope.loginDetail.SESKEY, $scope.selectedData.cepCompId, $scope.domainURL).then(function (response) {
            if (response.LOADACTI_OUT_OBJ.RETCD == 0) {

                if (response.LOADACTI_OUT_OBJ.ACTI_ARR != null) {
                    if (Object.prototype.toString.call(response.LOADACTI_OUT_OBJ.ACTI_ARR) != '[object Array]') {
                        var data = response.LOADACTI_OUT_OBJ.ACTI_ARR;
                        response.LOADACTI_OUT_OBJ.ACTI_ARR = [];
                        if (data != null)
                            response.LOADACTI_OUT_OBJ.ACTI_ARR.push(data.ACTI_OBJ);
                    }
                }
                var items = response.LOADACTI_OUT_OBJ.ACTI_ARR;
                items = $filter('orderBy')(items, ['ACTICD', 'DES']);
                $scope.favActivityObj = [];

                for (var i = 0; i < items.length; i++) {
                    if (items[i].STAT == 'Y') {
                        if ($scope.isSameCompany)
                            items[i].fav = activityFavService.isActivityInFavList(items[i], JSON.parse(sessionStorage.getItem('FavActivityArray')));
                        $scope.favActivityObj.push(items[i]);
                    }
                }
                $scope.allActivityList = $scope.favActivityObj;
                $scope.gridOptions.data = $scope.favActivityObj;
                $scope.isLoaded = true;
            }
            else {
                $scope.isLoaded = true;
            }
            $scope.gridOptions.columnDefs[2].sort.direction = "asc";
            $timeout(function () { $scope.windowConfig.isRenderGrid = true; });
        });
        } catch (ex) { console.log("error in getAllActivity()"); $scope.isLoaded = true; $scope.windowConfig.isRenderGrid = true; }

    }

}])

.controller('NewEntryCtrl', ['$rootScope', '$filter', '$scope', '$modal', 'cepService', 'projectComponetService', 'activityService', 'loadICRates', '$state', '$rootScope', '$timeout', '$window', 'loadRevenueMonthsServices', 'gridDataService', 'dateService', 'arguments', '$modalInstance', 'broadcastService', 'descFavService', 'addRemoveFavMsgs', 'activityFavService', 'constantService', 'arrService', '$document', 'openPopUpWindowFactory', 'loginService', 'cepSharedService', 'empSharedService', 'futureEntryService', 'commonUtilityService', function ($rootScope, $filter, $scope, $modal, cepService, projectComponetService, activityService, loadICRates, $state, $rootScope, $timeout, $window, loadRevenueMonthsServices, gridDataService, dateService, selectedData, popUp, broadcastService, descFavService, addRemoveFavMsgs, activityFavService, appConstants, arrService, $document, openPopUpService, loginService, cepSharedService, empSharedService, futureEntryService, commonUtilityService) {
    /*scope variables*/
    $scope.isTabKeyPress = false;
    $scope.timeEntry = {};
    $scope.isDuplicateMode = false;
    $scope.isSrchChkd = false;
    $scope.undoClass = "";
    $scope.cepSearList = [];
    $scope.stateprovlist = [];
    $scope.revenueCurrentMonth = null;
    $scope.isValidHrs = false;
    $scope.isValidCharge = false;
    $scope.weeklyOld = [null, null, null, null, null, null, null]
    $scope.dailyHour = null;
    $scope.ICCharge = null;
    $scope.description = '';
    $scope.cepEnterText = null;
    $scope.maskTest = '';
    $scope.isPartitionErr = false;
    $scope.is24HourMsgShown = false;
    $scope.isRoundingMsgShown = false;
    $scope.isSearchClick = false;
    $scope.wkHrsEntered = 0;
    $scope.isEditMode = false;
    $scope.isRegulated = false;
    $scope.isRegulatedChkd = false;
    $scope.isUpdPro = false;
    $scope.isScopeReq = false;
    $scope.favDesc = false;
    $scope.AcivityFev = false;
    $scope.ldingData = '';
    $scope.isSameCompany = false;
    $scope.isCepValdMsgOn = false;
    $scope.isDesValMsgOn = false;
    $scope.isCompoValMsgOn = false;
    $scope.isTaskValdMsgOn = false;
    $scope.isScopeValdMsgOn = false;
    $scope.isEditMenuOn = false;
    $scope.icListData = [];
   $scope.PageNumber = 1;
    $scope.DataPerPage = 10;
    $scope.TotalPages = 0;
    $scope.cepEnter = '';
    $scope.weeklyHours = [null, null, null, null, null, null, null];
    $scope.IsActivity = true;
    $scope.IsSearchDropdown = true;
    $scope.select = '';
    $scope.state = {
        selected: null,
        stateprovlist: []
    };
    $scope.lastSaveEtry = null;
    $scope.task = {
        selected: null
    };
    $scope.activity = {
        selected: {},
    };
    $scope.ICItem = {
        selected: {},
    };
    $scope.scopeObj = {
        selected: null
    };

    $scope.component = {
        text: '',
        selected: null
    };
    $scope.animationsEnabled = true;
    $scope.revStartDate = null;
    $scope.revEndDate = null;
    $scope.domainURL = "";
    $scope.frmParm = {
        isDesReq: false, desMsg: '', cepMsg: '', noMatchFoundMsg: $filter('translate')('msg_noMatch'),
        exHour1: '', exHour2: '', invalidHrs: '', msgTitle: 'Message',
        cnfrmSubmit: true, compoMsg: '', projectMsg: '', activityMsg: '',
        isProjectSelected: false, IsCepSelected: false, isActivitySel: false, activityTitle: '',
        scopeMsg: '', isTaskSelected: false, invalidCEPMsg: '', titleDes: '', isICItemSelected: false, ICPlaceHolder: $filter('translate')('msg_intCapitalItem'),
        icValdationMsg: $filter('translate')('msg_intCapitalItem'), icChargeValMsg: $filter('translate')('msg_invalidChrg'), isActivityPopUpOpen: false, isProRenewPopUpOn: false

    }

    /*local variables*/
    var sortOrderFavCepFirst = "38 DESC,2,5,8";
    var errrList = [];
    var dateArrStatus = [true, true, true, true, true, true, true];
    var menuFlag = false;
    var disabledCls = "disabled-ctrl";
    var arrFlagRound = [false, false, false, false, false, false, false];
    var weekOldData = [null, null, null, null, null, null, null];
    /*new code*/
    var bindProvStateDropDown = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.bindProvStateDropDown");
        var st = JSON.parse(localStorage.getItem('StateProv_Data'));
        $scope.state.selected = null;
        $scope.state.stateprovlist = [];
        st.forEach(function (item) {
            $scope.state.stateprovlist.push({
                PTXCODE: item.PTXCODE,
                PTXNAME: item.PTXNAME,
                PRSTID: item.PRSTID,
                DEF: item.DEF
            })
        });

        var stateAr = $scope.state.stateprovlist.filter(function (state) {
            return state.DEF === 'Y'
        });
        if (stateAr.length > 0) {
            $scope.state.selected = stateAr[0];
        }

    }
    var updateLclStrageForProvState = function (sataeProvArr) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateLclStrageForProvState");
        if (Object.prototype.toString.call(sataeProvArr) != '[object Array]') {
            var data = sataeProvArr;
            sataeProvArr = [];
            sataeProvArr.push(data.STATPROV_OBJ);
        }
        localStorage.setItem('StateProv_Data', JSON.stringify(sataeProvArr));
     }
    function convertWeekNumberToName(weekNo) {
        $rootScope.errorLogMethod("NewEntryCtrl.convertWeekNumberToName");
         var weekday = {
             0: $filter('translate')('lbl_FulWkDy1'), 1: $filter('translate')('lbl_FulWkDy2'), 2: $filter('translate')('lbl_FulWkDy3'), 3: $filter('translate')('lbl_FulWkDy4'), 4: $filter('translate')('lbl_FulWkDy5'), 5: $filter('translate')('lbl_FulWkDy6'), 6: $filter('translate')('lbl_FulWkDy7')
         };
         return weekday[weekNo];
     }

    function convertMonthNumberToName(monthNo) {
        $rootScope.errorLogMethod("NewEntryCtrl.convertMonthNumberToName");
         var weekMonth = {
             0: $filter('translate')('lbl_Mnth1'), 1: $filter('translate')('lbl_Mnth2'), 2: $filter('translate')('lbl_Mnth3'),
             3: $filter('translate')('lbl_Mnth4'), 4: $filter('translate')('lbl_Mnth5'), 5: $filter('translate')('lbl_Mnth6'),
             6: $filter('translate')('lbl_Mnth7'),
             7: $filter('translate')('lbl_Mnth8'), 8: $filter('translate')('lbl_Mnth9'), 9: $filter('translate')('lbl_Mnth10'),
             10: $filter('translate')('lbl_Mnth11'), 11: $filter('translate')('lbl_Mnth12')
         };
         return weekMonth[monthNo];
     }
    $scope.init = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.init");       
        addRemoveFavMsgs.duplicateDesc = $filter('translate')('msg_DuplicateDescription');
        $scope.RMTitle = $filter('translate')('msg_RMTitle');
        $scope.EMTitle = $filter('translate')('msg_EMTitle');
        $scope.PMTitle = $filter('translate')('msg_PMTitle');
        $scope.domainURL = appConstants.DOMAINURL;
        $scope.isTEPopUpOn = true;        
        $scope.isHourChange = true;
        $scope.isSaving = false;       
        $scope.hourSumDetail = selectedData.hoursTotalDetail;
        $scope.editMenu = {
            title: "", isTime: true, titles: [$filter('translate')('lbl_editTime'), $filter('translate')('lbl_editIC')]
        }
        $scope.editMenu.title = $scope.editMenu.titles[0];
        $scope.isFocusOnHrs = false;
        $scope.rndMsg = "";
        $scope.focusHrsObj = { index: 0, id: '' };
        $scope.parameters = selectedData;
        $scope.isActivityActive = true;
        $scope.frmParm.exHour1 = $filter('translate')('msg_ExHrs');
        $scope.frmParm.exHour2 = $filter('translate')('msg_ExMinusHrs');
        $scope.frmParm.activityTitle = $filter('translate')('activity_Title');
        $scope.frmParm.invalidCEPMsg = $filter('translate')('msg_ValidCep');
        $scope.frmParm.titleDes = $filter('translate')('title_Description');
        $scope.ldingData = $filter('translate')('msg_LdingData');
        $scope.excHrs = $filter('translate')('msg_ExHrs');
        $scope.excNegHrs = $filter('translate')('msg_ExMinusHrs');
        $scope.maskTest = String('?*?*?*?*?*?*?-?9?9?9?-?9?9?9');       
        $scope.undoTitle = $filter('translate')('msg_undoTitle');
        $scope.closeTitle = $filter('translate')('msg_close');
        $scope.newSearchHelp = $filter('translate')('msg_tipSrch') + "MFIN01- :  " + $filter('translate')('msg_rtrnPrj') + "MFIN01- : " + $filter('translate')('msg_rtrnPrj') + $filter('translate')('msg_rtrnPrj2') + "MFIN01-701- : " + $filter('translate')('msg_rtrnPrjClient') + "MFIN01-701-0 : " + $filter('translate')('msg_rtrnPrjClient') + $filter('translate')('msg_rtrnPrjClient2');
        $scope.descriptionText = '';
        $scope.isSubmit = false;
        $scope.isPageLoad = true;
        $scope.isPostback = true;
        $scope.isMonthClosed = $scope.parameters.isClosedRevMonth;        
        $scope.startDate = $scope.parameters.startDate;       
        $scope.weekName = convertWeekNumberToName(new Date($scope.startDate.valueOf()).getDay());
        $scope.monthName = convertMonthNumberToName(new Date($scope.startDate.valueOf()).getMonth());
        $scope.isEditMode = $scope.parameters.editTEObj == null ? false : true;
        $scope.isDailyMode = $scope.parameters.isDailyMode == null ? true : $scope.parameters.isDailyMode;
        $scope.currentDate = $scope.parameters.currentDate;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.cpeListData = [];
        $scope.cpeDataItem = {};
        $scope.undoClass = disabledCls;
        $scope.cepObj = { selected: null };
        selectedData.defaultHrsIndex = -1;
        if ($scope.initialDetail.COMP_REC.RGLW === 'Y') { $scope.isRegulated = true; }
        if ($scope.initialDetail.COMP_REC.UPST === 'Y') { $scope.isUpdPro = true; }
        
        /*show hide inline validation*/
        $scope.isCepValdMsgOn = true;
        $scope.isFormLoading = false;
        
        setRevenueDte();
        loadRevenueMonth();
        // getCEPFav();
        InitializeValidationMsg();
        if (angular.element('.changenewentry').hasClass("bgActive")) {
            angular.element('.changenewentry').removeClass("bgActive");
        }
        /*set favourite data*/
        $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
        /*Prov/State*/
        
        loginService.loadStateProv($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, $scope.domainURL).then(function (response) {
            if (parseInt(response.LOADSTATPROV_OUT_OBJ.RETCD) == 0) {
                updateLclStrageForProvState(response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR);
                bindProvStateDropDown();
                $scope.timeEntry = JSON.parse(JSON.stringify($scope.parameters.editTEObj));
                if ($scope.isEditMode && ($scope.timeEntry.populateCepOnly === undefined || $scope.timeEntry.populateCepOnly === false)) {                    
                    if ($scope.timeEntry.isImportCal == undefined)
                        $scope.timeEntry.isImportCal = false;
                    if ($scope.timeEntry.isImportCal === true) {
                        $scope.isEditMode = false;
                        $scope.timeEntry.CTDESC = $scope.timeEntry.DES;
                    }
                    loadTEDataInEditMode($scope.timeEntry);

                    $scope.undoClass = ($scope.isSubmit || $scope.isMonthClosed || $scope.isEditMode === false) ? disabledCls : "";
                }
                else if ($scope.isEditMode && $scope.timeEntry.populateCepOnly === true) {
                    $scope.isEditMode = false;
                    updateCepField($scope.timeEntry);
                    updateActivityOrCompTaskField();
                }
            }
             if(!$scope.isEditMode)            
                $('#cepTextBox').focus();
            
            $("#newEnteryWindow, #innerNewEntryDiv").draggable({
                start: function (event, ui) {
                    if (event.target.id == "innerNewEntryDiv")
                        return false;
                }
            });
        });
        //for closed revenue undo disabled
        $scope.revDisable(0);
        $scope.checkRevMonthTime($scope.currentDate);
        //set for new entry,editmode but not for import calandar
        if (selectedData.defaultHrsIndex == -1 && ($scope.timeEntry.isImportCal === undefined || $scope.timeEntry.isImportCal == false)) {
            selectedData.defaultHrsIndex = !$scope.isDailyMode ? setDefaultHrsIndexForFocus(selectedData.currentDate, selectedData.startDate) : 0;
        }       
           

    }
    var setDefaultHrsIndexForFocus = function (firstDate, secondDate) {
        $rootScope.errorLogMethod("NewEntryCtrl.setDefaultHrsIndexForFocus");
        try {
            var oneDay = 24 * 60 * 60 * 1000;
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            return (diffDays + 1);
        } catch (ex) { return 1; }
    }
        
    $scope.getWeeklyDayDate = function (numDay) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.getWeeklyDayDate");
        var resDate = new Date($scope.currentDate.valueOf());
        resDate.setDate(resDate.getDate() + 1);
        resDate.setDate(resDate.getDate() - 7);
        for (var i = 0; i < 7; i++) {
            if (resDate.getDay() == 0)
                break;
            resDate.setDate(resDate.getDate() + 1);
        }
        $scope.weeklyStartDate = new Date(resDate.valueOf());
        var tempDate = new Date($scope.weeklyStartDate.valueOf());
        tempDate.setDate(tempDate.getDate() + numDay);
        return $filter('date')(tempDate, 'MMMM dd,yyyy');
    }
    $scope.checkRevMonthTime = function (dateval) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.checkRevMonthTime");
        var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, false);
        if (jsonSFromloginDetail == undefined || jsonSFromloginDetail == null) return;
        var revStrDteAr = jsonSFromloginDetail.REVM_REC.STRTDTE.split("-");
        var revEndDteAr = jsonSFromloginDetail.REVM_REC.ENDDTE.valueOf().split("-");

        //revenue start and end date
        var revSDte = null;
        if (revStrDteAr != undefined && revEndDteAr != undefined) {
            revSDte = new Date(revStrDteAr[0], revStrDteAr[1] - 1, revStrDteAr[2].split(" ")[0]);
            var revEDte = new Date(revEndDteAr[0], revEndDteAr[1] - 1, revEndDteAr[2].split(" ")[0]);
    }
        var selDte = new Date(dateval.valueOf());
        selDte.setHours(0, 0, 0, 0);
        if (selDte < revSDte)
            $scope.checkRevMonthFlag = false;
        else
            $scope.checkRevMonthFlag = true;

    }
    $scope.uiSelectTxtBoxVal="";
    $scope.$on("uiSelectCepChange", function (event, args) {
        $scope.uiSelectTxtBoxVal=args.value;
        if ($scope.frmParm.IsCepSelected) {
            if (($scope.cepEnter.toLowerCase().replace(/\-/g, '')) != (args.value.toLowerCase().replace(/\-/g, ''))) {
                $scope.cepObj.selected = null;
                $scope.frmParm.IsCepSelected = false;
            }
        }
    });

    $scope.cepIsSrchChkBoxClick = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.cepIsSrchChkBoxClick");
        if ($scope.isSubmit) return;
        $scope.cepSearList = [];
        if ($scope.isSrchChkd) {
            $scope.IsSearchDropdown = true;
           $scope.PageNumber = 1;
            $scope.CurrentPageNumber = 1;
            var cepCodeWithMask = "";
            if (($scope.cepEnterText != '') && ($scope.cepEnterText != null)) {               
                var resp = cepSharedService.isExcepCepCode($scope.cepEnterText);
                if (resp.isExpCep) {
                    cepCodeWithMask = resp.cepWithMask;
                }
                else {
                    cepCodeWithMask = $scope.cepEnterText;
                    if ($scope.cepEnterText.length > 9) {
                        cepCodeWithMask = $scope.cepEnterText.substring(0, 6) + '-' + $scope.cepEnterText.substring(6, 9) + '-' + $scope.cepEnterText.substring(9);
                    }
                    else if ($scope.cepEnterText.length > 6)
                        cepCodeWithMask = $scope.cepEnterText.substring(0, 6) + '-' + $scope.cepEnterText.substring(6);                    
                }
            }

            $timeout(function () { broadcastService.updateUiSelectSrchStr(cepCodeWithMask.toUpperCase()); });
            $scope.cpeDataItem.selected = cepCodeWithMask;
        }
        else {
            var uiSelectSrchStr = $('#ui-select-txt-box').val();
            if (uiSelectSrchStr == undefined || uiSelectSrchStr == null)
                uiSelectSrchStr = "";           
            uiSelectSrchStr= cepSharedService.convertToMask(uiSelectSrchStr, $scope.maskTest);            
            uiSelectSrchStr = uiSelectSrchStr.toLowerCase();
            if ($scope.cepEnterText===null || $scope.cepEnterText.toLowerCase()!= uiSelectSrchStr) {
                $scope.cepEnterText = uiSelectSrchStr;
                $scope.frmParm.IsCepSelected = false;
                clear();
            }           
        }
    }

    $scope.showEditMenuDropDown = function (event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.showEditMenuDropDown");
        event.stopPropagation();
        $scope.showSaveMenu = $scope.showCancelMenu = false;
        $scope.isEditMenuOn = !$scope.isEditMenuOn;
        menuFlag = $scope.isEditMenuOn;
        var fucusedItemName = angular.element(window.document.activeElement).attr('id');
        if ((fucusedItemName !== undefined) && (fucusedItemName == "cepTextBox" || fucusedItemName == "dailyHours" || fucusedItemName.indexOf("wkHrs") > 0)) {
            angular.element('#newEnteryWindow').focus();
    }
    }
    $scope.updateEditMenu = function (isTime) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.updateEditMenu");
        if (isTime)
            $scope.editMenu.title = $scope.editMenu.titles[0];
        else
            $scope.editMenu.title = $scope.editMenu.titles[1];
        $scope.editMenu.isTime = isTime;        
        $timeout(function () {
            angular.element('#cepTextBox').focus();
        }, 0);
    }
    var getCutoffDate = function () {
        var result = $rootScope.GetInitialDetail(false, true);
        return result.REVM_REC;
    }

    $scope.revDisable = function (rowNo) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.revDisable");
        var isDisable = false;
        var currentDate = new Date($scope.startDate.valueOf());
        var date = currentDate.setDate(currentDate.getDate() + rowNo);
        var currentRevObj = getCutoffDate();
        var weekDate = dateService.createDate($filter('date') (date, 'yyyy-MM-dd'));
        var revStartDate = dateService.createDate(currentRevObj.STRTDTE);
        if (weekDate < revStartDate) {
            dateArrStatus[rowNo] = true;
            isDisable = true;
        }
        else {
            dateArrStatus[rowNo] = false;
            isDisable = false;
    }

        if (isDisable === false && $scope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
            isDisable = !(empSharedService.checkTerminationDate($scope.initialDetail.EMPL_REC.TERMDTE, new Date(date.valueOf())));
            dateArrStatus[rowNo] = isDisable;
    }
        //check billing date
        if (isDisable === false) {
            var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
            isDisable = $rootScope.isDatePriorToBillingDate(billingDate, date);
            dateArrStatus[rowNo] = isDisable;
    }
        return isDisable;
    }
        //on cutoff disable the window if in edit mode
    $scope.$on("cutoffBroadcast", function (event, args) {
        if ($scope.isEditMode === true) {
            var currentRevObj = getCutoffDate();
            var weekDate = dateService.createDate($filter('date')($scope.startDate, 'yyyy-MM-dd'));
            var revStartDate = dateService.createDate(currentRevObj.STRTDTE);
            if (weekDate < revStartDate) {
                $scope.isSubmit = true;
                $scope.isMonthClosed = true;
        }
    }
    });
        /*methods for edit mode only*/
    var loadTEDataInEditMode = function (timeEntery) {
        $rootScope.errorLogMethod("NewEntryCtrl.loadTEDataInEditMode");
            $scope.isFormLoading = true;
        //$scope.isSaving = false;
                clear();
                if ($scope.timeEntry.isImportCal == false) {
                    if (!$scope.isDailyMode && $scope.timeEntry.isImportCal == false) {
                        if ($scope.timeEntry.CEP_REC == undefined) {
                            $scope.timeEntry.CEP_REC = $scope.timeEntry.data.CEP_REC;
                        }
                        if ($scope.timeEntry.ACTI_REC == undefined) {
                            $scope.timeEntry.ACTI_REC = $scope.timeEntry.data.ACTI_REC;
                        }
                        if ($scope.timeEntry.CMPTID == undefined) {
                            $scope.timeEntry.CMPTID = $scope.timeEntry.data.CMPTID;
                        }
                        if ($scope.timeEntry.TSKID == undefined) {
                            $scope.timeEntry.TSKID = $scope.timeEntry.data.TSKID;
                        }
                        if ($scope.timeEntry.CTSDESC == undefined) {
                            $scope.timeEntry.CTSDESC = $scope.timeEntry.data.CTSDESC;
                        }
                        if ($scope.timeEntry.SCOID == undefined) {
                            $scope.timeEntry.SCOID = $scope.timeEntry.data.SCOID;
                        }
                        if ($scope.timeEntry.TIMSUB == undefined) {
                            $scope.timeEntry.TIMSUB = $scope.timeEntry.data.TIMSUB;
                        }
                        if ($scope.timeEntry.REGFLAG == undefined) {
                            $scope.timeEntry.REGFLAG = $scope.timeEntry.data.REGFLAG;
                        }
                        if ($scope.timeEntry.PRSTCD == undefined) {
                            $scope.timeEntry.PRSTCD = $scope.timeEntry.data.PRSTCD;
                        }

                    }

                    $scope.isSubmit = ($scope.isMonthClosed || timeEntery.TIMSUB == 'Y') ? true : false;
                    $scope.isRegulatedChkd = (timeEntery.REGFLAG == 'Y') ? true : false;
                    updateCepField(timeEntery);
                    updateActivityOrCompTaskField();
                    if (timeEntery.isICEntry && $scope.isDailyMode) {
                        $scope.editMenu.isTime = false;
                        try {
                            $scope.dailyHour = Number(parseFloat(0).toFixed(2));
                            /*on edit mode convert hour correct to 2 decimal place*/
                            var unbindWatch = $scope.$watch("dailyHours", function () {
                                roundHrsOnEdit("dailyHours", $scope.dailyHour);
                            });
                        } catch (err) {
                            console.log(err.message);
                        }
                        $scope.editMenu.title = $scope.editMenu.titles[1];
                        updateICField(timeEntery);
                    }
                    updateStateProvc(timeEntery);
                }
                else {
                    timeEntery.DES = timeEntery.DES == null ? "" : timeEntery.DES;
                    timeEntery.DES = timeEntery.DES.replace(/\n/g, " ");
                    timeEntery.DES = timeEntery.DES.replace(/\t/g, " ");
                    if (timeEntery.CTDESC !== null && timeEntery.CTDESC !== undefined) {
                        timeEntery.CTDESC = timeEntery.CTDESC.replace(/\n/g, " ");
                        timeEntery.CTDESC = timeEntery.CTDESC.replace(/\t/g, " ");
                    }
                }
        updateDescriptionField(timeEntery);
        updateHrsField(timeEntery, $scope.isDailyMode);
        if ($scope.timeEntry.isImportCal) {
            $timeout(function () { $scope.isFormLoading = false; });
    }
    }

    var updateCepField = function (timeEntery) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateCepField");
        var clientNo = '', engNo = '', prjNo = '', cep_rec = null;
        if (timeEntery.populateCepOnly === true) {
            $scope.cpeDataItem.selected = {
                    CLIENO: timeEntery.CLIENO, ENGNO: ("00" + timeEntery.ENGNO).slice(-3).toString(), PRJNO: ("00" + timeEntery.PRJNO).slice(-3).toString()
        }
            $scope.cpeListData.push((timeEntery));
            $scope.cepObj.selected = ($scope.cpeListData[0]);
            $scope.cepEnter = timeEntery.CEPCODE;
            $scope.cepEnterText = timeEntery.CEPCODE.replace(/[^a-zA-Z0-9]/g, "");
        }
        else {
            var index = timeEntery.CEP_REC.CLIENO.indexOf("-");
            if (index > 0)
                clientNo = timeEntery.CEP_REC.CLIENO.substring(0, index);
            else
                clientNo = timeEntery.CEP_REC.CLIENO;
            $scope.cpeDataItem.selected = {
                    CLIENO: clientNo, ENGNO: timeEntery.CEP_REC.ENGNO, PRJNO: timeEntery.CEP_REC.PRJNO
        }
            $scope.cpeListData.push((timeEntery.CEP_REC));
            $scope.cepObj.selected = ($scope.cpeListData[0]);
            var eng = parseInt($scope.cepObj.selected.ENGNO) > 99 ? (parseInt($scope.cepObj.selected.ENGNO)).toString() : parseInt($scope.cepObj.selected.ENGNO) > 9 ? '0' + (parseInt($scope.cepObj.selected.ENGNO)).toString() : '00' + (parseInt($scope.cepObj.selected.ENGNO)).toString();
            var pro = parseInt($scope.cepObj.selected.PRJNO) > 99 ? (parseInt($scope.cepObj.selected.PRJNO)).toString() : parseInt($scope.cepObj.selected.PRJNO) > 9 ? '0' + (parseInt($scope.cepObj.selected.PRJNO)).toString() : '00' + (parseInt($scope.cepObj.selected.PRJNO)).toString();
            $scope.cepEnter = $scope.cepObj.selected.CLIENO.toString();
            $scope.cepEnterText = $scope.cepObj.selected.CLIENO.replace(/[^a-zA-Z0-9]/g, "");
    }
        var resp = cepSharedService.isExcepCepCode($scope.cepEnterText);
        if (resp.isExpCep) {
            $scope.maskTest = resp.masking;
    }
    }

    var updateActivityOrCompTaskField = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.updateActivityOrCompTaskField");
        try {
            if (parseInt($scope.timeEntry.CATID) > 0)
                $scope.component.text = $scope.timeEntry.CTSDESC;
            else
                $scope.activity.selected = $scope.timeEntry.ACTI_REC;

        }catch (err) {
            console.log(err.message);
    }

        $scope.loadCEPCode($scope.isEditMode);
    }

    var updateICField = function (timeEntery) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateICField");
        $scope.isValidCharge = true;
        $scope.ICCharge = Number(parseFloat(timeEntery.ICCHRGE).toFixed(2));
        /*on edit mode convert hour correct to 2 decimal place*/
        var unbindWatch = $scope.$watch("icCharge", function () {
            roundHrsOnEdit("icCharge", $scope.ICCharge);
        });
        var icItem = {
    };
        icItem = {
                CHRG: timeEntery.ICCHRGE, DES: timeEntery.ICDESC, ICRTCD: timeEntery.ICRTCD
    }
        $scope.ICItem.selected = icItem;
        $scope.frmParm.isICItemSelected = true;
    }
    var updateHrsField = function (timeEntery, isDailyMode) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateHrsField");
        if (isDailyMode && !timeEntery.isICEntry) {
            selectedData.defaultHrsIndex = 0;
            $scope.isValidHrs = true;
            $scope.dailyHour = Number(parseFloat(timeEntery.HRS).toFixed(2));
            /*on edit mode convert hour correct to 2 decimal place*/
            var unbindWatch = $scope.$watch("dailyHours", function () {
                roundHrsOnEdit("dailyHours", $scope.dailyHour);
            });
        }
        else if (isDailyMode == false) {
            $scope.weeklyHours = timeEntery.weeklyHour.slice(0);
            /*convert hour correct to 2 decimal place*/
            var unbindWatch = $scope.$watch("weeklyHours", function () {
                var eleId = "wkHrs";
                for (var i = 0; i < 7; i++) {
                    if ($scope.weeklyHours[i] != null) {
                        if (timeEntery.isImportCal)
                            selectedData.defaultHrsIndex = i +1;
                        roundHrsOnEdit(eleId + (i + 1), $scope.weeklyHours[i]);
                }
            }
            });
    }
    }

    var roundHrsOnEdit = function (eleId, val) {
        $rootScope.errorLogMethod("NewEntryCtrl.roundHrsOnEdit");
        angular.element(document.getElementById(eleId)).val(parseFloat(val).toFixed(2)).trigger('input');
        angular.element(document.getElementById(eleId)).trigger('blur');
    }

    var updateDescriptionField = function (timeEntery) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateDescriptionField");
        // $scope.setFav($scope.description);
        try {
            if (timeEntery.DES !== null && timeEntery.DES !== undefined)
            $scope.description = timeEntery.DES.trim();
            if (timeEntery.CTDESC !== null && timeEntery.CTDESC !==undefined)
             $scope.descriptionText = timeEntery.CTDESC.trim();
        $scope.isFavDescription($scope.description, JSON.parse(sessionStorage.getItem('DescFav')));
    } catch (ex) { console.log('error in updateDescriptionField');
    }
    }

    var updateStateProvc = function (timeEntry) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateStateProvc");
        var stateAr = $scope.state.stateprovlist.filter(function (state) {
            return state.PTXCODE == timeEntry.PRSTCD
        });
        if (stateAr.length > 0) {
            var data = {
                    PTXCODE: stateAr[0].PTXCODE,
                    PTXNAME: stateAr[0].PTXNAME,
                    PRSTID: stateAr[0].PRSTID,
                    DEF: stateAr[0].DEF
        };
             $scope.state.selected = data;
    }
    }
        /*end*/

        //add-remove favourite  
    $scope.addToFavActivity = function (activity) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.addToFavActivity");
        if (($scope.isSameCompany)) {
            var activityAr = [activity.ACTICD];
            var data = {
                "VARCHAR2": activityAr
        };
            var act_arr = JSON.stringify(data);
            activityService.addActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.ADDACTIFAV_OUT_OBJ.RETCD == 0) {
                    activity.IsFav = true;
                    activityFavService.updateFavActLclStorage(true, [activity], 1);
            }
            });
    }
    }

    $scope.removeFrmFavActivity = function (activity) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.removeFrmFavActivity");
        if (($scope.isSameCompany)) {
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
    }
    }

    $scope.addToFavCEP = function (cepObj) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.addToFavCEP");
        var data = {
            "NUMBER": [cepObj.PRJID]
    };
        var prj_arr = JSON.stringify(data);
        cepService.addCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
            if (parseInt(response.ADDCEPFAV_OUT_OBJ.RETCD) == 0) {
                cepObj.CEPFAV = true;
                broadcastService.updateDataSource(appConstants.BroadCastUpdate.updateFavCep);
        }
        });

    }

    $scope.removeFrmFavCEP = function (cepObj) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.removeFrmFavCEP");
        var data = {
            "NUMBER": [cepObj.PRJID]
    };
        var prj_arr = JSON.stringify(data);
        cepService.removeCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
            if (parseInt(response.REMCEPFAV_OUT_OBJ.RETCD) == 0) {
                cepObj.CEPFAV = false;
                broadcastService.updateDataSource(appConstants.BroadCastUpdate.updateFavCep);
        }
        });
    }

    var triggerFocusToHrs = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.triggerFocusToHrs");
        if ($scope.isDailyMode) {
            $timeout(function () { angular.element('#dailyHours').focus(); });
        }
        else {
            $timeout(function () {
                //date is disabled
                if (!dateArrStatus[selectedData.defaultHrsIndex -1])
                    angular.element('#wkHrs' + selectedData.defaultHrsIndex).focus();
            });

    }
    }
    $scope.open = function (template, controller, sendData) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.open");
        var modalInstance = $modal.open({
                animation: true,
                templateUrl: template,
                controller: controller,
                resolve: {
                        arguments: function () {
                    return sendData;
                }
        }
        });
        modalInstance.result.then(function (selectedItem) {
            //close open drop down list
            $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
            switch (sendData.popUpName) {
                case 'saveValidationAlert':
                    $scope.frmParm.isErrorPopUpOn = false;
                    //if ($scope.frmParm.IsCepSelected && $scope.cepObj.selected.IsProjRenewd===true)
                    focusToNewEntryWindow();
                    break;
                case 'ActivityCtrl':
                    $scope.activity.selected = {
                            ACTICD: selectedItem.ACTICD,
                            DES: selectedItem.DES,
                            STAT: selectedItem.STAT,
                            COMPID: selectedItem.COMPID,
                            IsFav: selectedItem.fav
                }
                    $scope.oldCepDetail.isActSel = true;
                    $scope.cepObj.selected.activity = JSON.parse(JSON.stringify($scope.activity.selected));
                    $scope.isActivityActive = $scope.activity.selected.STAT == 'Y' ? true : false;
                    $scope.frmParm.isActivitySel = true;
                    $scope.isSrchChkd = false;
                    $scope.frmParm.isActivityPopOpen = false;
                    if (!$scope.editMenu.isTime) {
                        $timeout(function () {
                            $scope.loadICItems();
                        }, 500);
                    }
                    else {
                        triggerFocusToHrs();
                }
                    break;
                case 'ICItemCtrl':
                    angular.element('#icCharge').focus();
                    $scope.ICItem.selected = selectedItem;
                    $scope.ICCharge = Number(parseFloat($scope.ICItem.selected.CHRG).toFixed(2));
                    $scope.isValidCharge = true;
                    $scope.frmParm.isICItemSelected = true;
                    $scope.description = $scope.ICItem.selected.DES;
                    $scope.isFavDescription($scope.description, JSON.parse(sessionStorage.getItem('DescFav')));
                    $timeout(function () { angular.element('#description').focus(); }, 500);
                    break;
                case 'DescriptionCtrl':
                    $scope.favDesc = (selectedItem.fav);
                    if ((selectedItem.data != '') && (selectedItem.data != null)) {
                        $scope.description = selectedItem.data;
                }
                    $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
                    $('#description').trigger('focus');
                    break;
                case 'ProjectComponentCtrl':
                    $scope.oldCepDetail.isActSel = true;
                    $scope.isSrchChkd = false;
                    $scope.component = selectedItem.component;// {"ACTIVE":"Y", "ACTICD": selectedItem.ACTICD, "CMPTID": selectedItem.CMPTID };
                    $scope.task = selectedItem.task;//{"ACTIVE":"Y", "TSKID": selectedItem.TSKID };
                    $scope.component.text = selectedItem.componentTaskText;
                    $scope.descriptionText = selectedItem.descriptionText;
                    $scope.frmParm.isProjectSelected = true;
                    $scope.frmParm.isActivitySel = true;
                    $scope.frmParm.isCompoProPopOpen = false;
                    $scope.scopeObj.selected = selectedItem.scopeObj;
                    $scope.description = selectedItem.componentTaskText.trim();
                    if ($scope.descriptionText != null && $scope.descriptionText.trim() != '')
                        $scope.description = ($scope.description + ": " + $scope.descriptionText.trim());
                    if (!$scope.editMenu.isTime) {
                        $timeout(function () {
                            $scope.loadICItems();
                        }, 500);
                    }
                    else {
                        triggerFocusToHrs();
                }
                    $scope.isFavDescription($scope.description);
                    break;
        }
        }, function () {
            $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
            switch (sendData.popUpName) {

                case 'saveValidationAlert':
                    $scope.frmParm.isErrorPopUpOn = false;
                    break;
                case 'ProjectComponentCtrl':
                    $scope.frmParm.isCompoProPopOpen = false;
                    $scope.isFavDescription($scope.description.trim());
                    break;
                case 'ActivityCtrl':
                    if ($scope.frmParm.isActivitySel && !$.isEmptyObject($scope.activity.selected)) {
                        $scope.activity.selected.IsFav = activityFavService.isActivityInFavList($scope.activity.selected, JSON.parse(sessionStorage.getItem('FavActivityArray')));
                }
                    $scope.frmParm.isActivityPopOpen = false;
                    break;
                case 'DescriptionCtrl':
                    $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
                    $scope.favDesc = false;
                    if ($scope.description != null && $scope.description.trim().length > 0) {
                        $scope.isFavDescription($scope.description, $scope.favDescriptionList);
                }
                    break;
                case 'ICItemCtrl':
                    angular.element('#newEnteryWindow').focus();
                    break;
        }
            $scope.openModalCtrl = '';
        });
    };

    $scope.cepKeyPress = function ($event) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.cepKeyPress");
        if ($event.keyCode == 9) {
            $scope.isTabKeyPress = true;
    }
    }
    var isProcessCepCode = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.isProcessCepCode");
        if (!$scope.isTEPopUpOn || $scope.isCepFavWindowLoading == true) {
            return false;
    }
        var fucusedItemName = angular.element(window.document.activeElement).attr('id');
        if (fucusedItemName !== undefined && fucusedItemName === "srchChkbox") {
            return false;
    }
        return true;
    }
    $scope.onCepCodeBlur = function (isCepSelected) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.onCepCodeBlur");
        $scope.isCEPFocusDownImg = false;
        if (isProcessCepCode()) {
            //cep code is already set and user has not change the cep
            if ($scope.oldCepDetail.cep == $scope.cepEnterText && $scope.oldCepDetail.isCepSel) {
                $scope.frmParm.IsCepSelected = true;
                //if user press the tab key or user has type something
                if (($scope.isTabKeyPress) || ($scope.oldCepDetail.isEdited) || isCepSelected ===true) {
                    if ($scope.cepObj.selected.IsProjRenewd) {
                        showProjectRenewdMsg($scope.cepObj.selected);
                }
                    $scope.frmParm.isActivitySel = $scope.oldCepDetail.isActSel;
                    if ($scope.cepObj.selected.isActivity) {
                        $scope.IsActivity = true;
                        if ($scope.cepObj.selected.activity !==undefined)
                        $scope.activity.selected = JSON.parse(JSON.stringify($scope.cepObj.selected.activity));
                        $scope.loadActivity();
                    }
                    else {
                        $scope.IsActivity = false;
                        $scope.showProjComponentPopup();
                }

                }
                else
                    return false;
            }
            else {
                $scope.onCEPEnter(false, false);
        }

    }

    }
        //validate the user input is a valid cep or not
        // call only if not input is not validated already
    $scope.onCEPEnter = function (isFromLoadActivity, isFromSave) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.onCEPEnter");
        $scope.oldCepDetail.isActSel = false;
        $scope.oldCepDetail.isCepSel = false;
        $scope.oldCepDetail.cep = $scope.cepEnterText;
        var fucusedItemName = angular.element(window.document.activeElement).attr('id');
        //if user check searchbox after typing cep then do not check for cep

        if ($scope.frmParm.isActivityPopOpen == true) {
            return;
    }

        $scope.frmParm.isProRenewPopUpOn = false;
        if ((typeof $scope.cepEnterText != 'undefined') && ($scope.cepEnterText != '') && ($scope.cepEnterText != null)) {
            $scope.frmParm.isActivitySel = false;
            if ($scope.cepEnterText.length == 12) {
                $scope.cepEnter = $scope.cepEnterText.substring(0, 6) + '-' + $scope.cepEnterText.substring(6, 9) + '-' + $scope.cepEnterText.substring(9, 12);
            }
            else
                $scope.cepEnter = $scope.cepEnterText;
        }
        else {
            $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
            $scope.frmParm.IsCepSelected = false;
            //$scope.frmParm.isActivitySel = false;
            $scope.cepEnter = '';
            $scope.IsActivity = true;
            if ($scope.isTabKeyPress) {
                $scope.loadActivity();
                $scope.isTabKeyPress = false;
        }
            return;
    }
        $scope.frmParm.isDesReq = false;
        if ($scope.cepEnter != 'undefined') {
            //$scope.isTabKeyPress = false;
            var len = $scope.cepEnter.length;
            if (len == 14) {
                $scope.loadCEPCode(false, isFromLoadActivity);
            }
            else {
                var resp =cepSharedService.isExcepCepCode($scope.cepEnterText);
                if (!resp.isExpCep) {
                    $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
                    clear();
                    $scope.frmParm.IsCepSelected = false;
                    if (isFromSave === false || isFromSave === undefined)
                        showBtmMsgDiv({
                                title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg
                        });
                    if ($scope.isTabKeyPress) {
                        //$scope.loadActivity();
                        $scope.isTabKeyPress = false;
                    }
                    else if (isFromSave) {
                        showValidationMsg($scope.saveErrorList);
                }
                }
                else {
                    $scope.maskTest = resp.masking;
                    $scope.cepEnter = resp.cepWithMask;
                    $scope.loadCEPCode(false, isFromLoadActivity);
            }
        }
        }
        else {
            $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
            clear();
    }

    }
    $scope.EditMode = function (isCheckForEditMode, search) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.EditMode");
        var isSameCep = false;
        if ($scope.timeEntry !== undefined) {
            var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
            var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
            var clientNo = $scope.timeEntry.CEP_REC.CLIENO;
            var index = clientNo.indexOf("-");
            if (index > 0)
                clientNo = clientNo.substring(0, index);
            var timeCEP = clientNo + '-' + eng + '-' +pro;
            if (search.toUpperCase().trim() == timeCEP.toUpperCase()) {
                $scope.cpeListData = [];
                isSameCep = true;
                $scope.cpeListData.push(($scope.timeEntry.CEP_REC));
                $scope.cepObj.selected = ($scope.cpeListData[0]);
                $scope.onSelectCEPCode($scope.cepObj.selected, isCheckForEditMode);

        }
    }
        return isSameCep;
    }

    var showBtmMsgDiv = function (item) {
        $rootScope.errorLogMethod("NewEntryCtrl.showBtmMsgDiv");
        $.growl({
                title: item.title, message: item.msg
        });
    }
    $scope.loadCEPCode = function (isCheckForEditMode, isLoadActivity) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.loadCEPCode");
        var search = $scope.cepEnter;
        cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, 1, $scope.DataPerPage, '', $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
            if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                /*if no result is returned from api*/
                if ((response.LOOKCEP_OUT_OBJ.TOTAVAIL === '0')) {
                    $scope.cepObj.isValidCep = false;
                    //show activity popup if after entering cep activity is click.
                    if (isLoadActivity) {
                        $scope.loadActivity();
                        showBtmMsgDiv({ title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg });
                        return;
                }
                    if (!$scope.isEditMode) {
                        $scope.frmParm.IsCepSelected = false;
                        showBtmMsgDiv({ title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg });
                        return;
                    }
                    else {
                        if (!$scope.isFormLoading)
                            clear();
                        var isSameCep = $scope.EditMode(isCheckForEditMode, search);
                        if (!isSameCep) {
                            $scope.frmParm.IsCepSelected = false;
                            showBtmMsgDiv({ title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg });
                            clear();
                    }
                }
            }
                //convert object to array
                if (Object.prototype.toString.call(response.LOOKCEP_OUT_OBJ.CEP_ARR) != '[object Array]') {
                    var data = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                    response.LOOKCEP_OUT_OBJ.CEP_ARR = [];
                    response.LOOKCEP_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
            }
                //remove CLIEID =0 record
                for (var i = 0; i < response.LOOKCEP_OUT_OBJ.CEP_ARR.length; i++) {
                    if (response.LOOKCEP_OUT_OBJ.CEP_ARR[i].CLIEID == 0) {
                        response.LOOKCEP_OUT_OBJ.CEP_ARR.splice(i, 1);
                        i--;
                }
            }
                if (response.LOOKCEP_OUT_OBJ.CEP_ARR.length > 0) {
                    var cepDetail = response.LOOKCEP_OUT_OBJ.CEP_ARR[0];
                    cepService.loadCEPDetail($scope.loginDetail.SESKEY, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].CLIEID, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].ENGID, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].PRJID, $scope.domainURL).then(function (response) {
                        if (parseInt(response.LOADCEP_OUT_OBJ.RETCD) == 0) {
                            $scope.frmParm.IsCepSelected = true;
                            $scope.oldCepDetail.cep = $scope.cepEnterText;
                            $scope.oldCepDetail.isCepSel = true;
                            if (!$scope.isFormLoading)
                                clear();
                            if (validateCEPCode(response.LOADCEP_OUT_OBJ.CEP_REC, true)) {
                                $scope.cpeListData = [];

                                $scope.cpeListData.push(response.LOADCEP_OUT_OBJ.CEP_REC);
                                $scope.cepObj.selected = $scope.cpeListData[0];
                                $scope.cepObj.isValidCep = true;
                                // CEP Fev section
                                if (cepDetail.CEPFAV == 'Y') {
                                    $scope.cepObj.selected.CEPFAV = true;
                                }
                                else {
                                    $scope.cepObj.selected.CEPFAV = false;
                            }
                                $scope.onSelectCEPCode($scope.cepObj.selected, isCheckForEditMode);
                                if (isCheckForEditMode) {
                                    $scope.descriptionText = $scope.timeEntry.CTDESC;
                            }
                            }
                            else {
                                $scope.cpeListData = [];
                                $scope.cepObj.selected = null;
                                $scope.cepObj.isValidCep = false;
                                $scope.IsActivity = true;
                        }
                        }
                        else {
                            $scope.cepObj.isValidCep = false;
                            if ($scope.isEditMode) {
                                if (!$scope.isFormLoading)
                                    clear();
                                var isSameCep = $scope.EditMode(isCheckForEditMode, search);
                                if (!isSameCep) {
                                    $scope.frmParm.IsCepSelected = false;
                                    showBtmMsgDiv({ title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg });
                                    clear();
                            }
                            }
                            else {
                                $scope.frmParm.IsCepSelected = false;
                                showBtmMsgDiv({ title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg });
                                clear();
                        }

                    }

                    });
            }
        }

        });
    }

    $scope.projectListData = null;
    var updateActivity = function (c) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateActivity");
        activityService.searchActivityCode($scope.loginDetail.SESKEY, c.COMPID, $scope.domainURL).then(function (response) {
            if (parseInt(response.LOADACTI_OUT_OBJ.RETCD) == 0) {
                for (var i = 0; i < response.LOADACTI_OUT_OBJ.ACTI_ARR.length; i++) {
                    if ((response.LOADACTI_OUT_OBJ.ACTI_ARR[i].ACTICD == $scope.timeEntry.ACTI_REC.ACTICD)) {
                        $scope.oldCepDetail.isActSel = true;
                        $scope.activity.selected = (response.LOADACTI_OUT_OBJ.ACTI_ARR[i]);
                        $scope.cepObj.selected.activity =JSON.parse(JSON.stringify($scope.activity.selected));
                        if ($scope.isSameCompany) {
                            var activityArr = JSON.parse(sessionStorage.getItem('FavActivityArray'))
                            $scope.activity.selected.IsFav = activityFavService.isActivityInFavList($scope.activity.selected, activityArr);
                    }
                        $scope.frmParm.isActivitySel = true;
                        $scope.isActivityActive = $scope.activity.selected.STAT == 'Y' ? true : false;
                }
            }
        }
        });

    }
    $scope.onSelectCEPCode = function (c, isCheckForEditMode) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.onSelectCEPCode");
        try {
            $scope.isScopeReq = false;
            $scope.frmParm.IsCepSelected = true;
            if ($scope.cepObj.selected != null && $scope.cepObj.selected.COMPID == $scope.initialDetail.COMP_REC.COMPID) {
                $scope.isSameCompany = true;
        }

            if ((typeof c.CATID !== 'undefined')) {
                if (parseInt(c.CATID) > 0) {
                    $scope.IsActivity = false;
                    $scope.cepObj.selected.isActivity = false;
                    projectComponetService.searchPRCCode($scope.loginDetail.SESKEY, c.CATID, c.PRJID).then(function (response) {
                        if (parseInt(response.LOADPCOMTSK_OUT_OBJ.RETCD) == 0) {
                            if (Object.prototype.toString.call(response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM) != '[object Array]') {
                                var data = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM;
                                response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM = [];
                                response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM.push(data.PCOM_OBJ);
                        }

                            response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM.sort(function (a, b) {
                                return a.ORD - b.ORD
                            });

                            var comArr = [];
                            $scope.projectListData = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR;
                            for (var j = 0; j < $scope.projectListData.PCAT_OBJ.ARR_PCOM.length; j++) {
                                var data = {
                                        CMPTID: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].CMPTID,
                                        CMPTCD: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].CMPTCD,
                                        DES: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].DES,
                                        ACTIVE: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTIVE,
                                        DESREQ: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].DESREQ,
                                        DEFDES: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].DEFDES,
                                        ACTICD: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTICD,
                                        ORD: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ORD,
                                        ARR_PTSK: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ARR_PTSK

                            };

                                comArr.push(data);
                        }

                            $scope.projectListData.PCAT_OBJ.ARR_PCOM = comArr;
                            $scope.projectListData.PCAT_OBJ.ARR_PCOM.sort(function (a, b) {
                                return a.ORD - b.ORD
                            });

                            if (($scope.isEditMode && isCheckForEditMode) || $scope.undoTEFlag) {
                                $scope.isScopeReq = (response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.SCOREQ === 'Y') ? true : false;
                                $scope.oldCepDetail.isActSel = true;
                                bindComponentTask(comArr);
                                if ($scope.isScopeReq) {
                                    bindScope(response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ);
                            }
                            }
                            else {
                                $scope.showProjComponentPopup();
                        }
                            $scope.undoTEFlag = false;
                            /*---------end-------*/
                    }
                    });
                }
                else {
                    $scope.IsActivity = true;
                    $scope.cepObj.selected.isActivity = $scope.IsActivity;
                    if (($scope.undoTEFlag) || (isCheckForEditMode && ($scope.isEditMode) && (($scope.timeEntry.CEP_REC.CLIEID == c.CLIEID) && ($scope.timeEntry.CEP_REC.ENGID == c.ENGID) && ($scope.timeEntry.CEP_REC.PRJID == c.PRJID)))) {
                        updateActivity(c);
                }
                    if (!isCheckForEditMode)
                        $scope.loadActivity();
                    $scope.undoTEFlag = false;
            }
            }
            else {
                $scope.IsActivity = true;
                $scope.cepObj.selected.isActivity = $scope.IsActivity;
                if (($scope.undoTEFlag) || (isCheckForEditMode && ($scope.isEditMode) && (($scope.timeEntry.CEP_REC.CLIEID == c.CLIEID) && ($scope.timeEntry.CEP_REC.ENGID == c.ENGID) && ($scope.timeEntry.CEP_REC.PRJID == c.PRJID)))) {
                    updateActivity(c);
            }
                if (!isCheckForEditMode)
                    $scope.loadActivity();
                $scope.undoTEFlag = false;
        }
            $scope.isFormLoading = false;
    } catch (ex) {
            $scope.undoTEFlag = false;
    }
    }

    var bindComponentTask = function (comArr) {
        $rootScope.errorLogMethod("NewEntryCtrl.bindComponentTask");
        $scope.descriptionText = $scope.timeEntry.CTDESC;
        var isFind = false;
        for (var i = 0; i < comArr.length; i++) {
            if (comArr[i].CMPTID == $scope.timeEntry.CMPTID) {
                isFind = true;
                $scope.component.selected = comArr[i];
                $scope.component.text = $scope.timeEntry.CTSDESC;
                $rootScope.componentIndex = i;
                $rootScope.taskIndex = 0;
                if (Object.prototype.toString.call($scope.component.selected.ARR_PTSK) != '[object Array]') {
                    var data = $scope.component.selected.ARR_PTSK;
                    $scope.component.selected.ARR_PTSK = [];
                    $scope.component.selected.ARR_PTSK.push(data.PTSK_OBJ);
            }
                for (var j = 0; j < $scope.component.selected.ARR_PTSK.length; j++) {
                    if ($scope.timeEntry.TSKID == $scope.component.selected.ARR_PTSK[j].TSKID) {
                        $rootScope.taskIndex = j;
                        $scope.task.selected = $scope.component.selected.ARR_PTSK[j];
                        $scope.frmParm.isActivitySel = true;
                        break;
                }
            }
                break;
        }
    }

    }

    var bindScope = function (resObj) {
        $rootScope.errorLogMethod("NewEntryCtrl.bindScope");
        var scopeList = {
                PSCOP_OBJ: []
    }
        if (Object.prototype.toString.call(resObj.ARR_PSCOP) != '[object Array]') {
            var data = resObj.ARR_PSCOP;
            resObj.ARR_PSCOP = [];
            resObj.ARR_PSCOP.push(data.PSCOP_OBJ);
    }
        var activeList = [];
        var inactiveList = [];
        for (var i = 0; i < resObj.ARR_PSCOP.length; i++) {
            var data = {
                    SCOPID: resObj.ARR_PSCOP[i].SCOPID,
                    SCOPCD: resObj.ARR_PSCOP[i].SCOPCD,
                    DES: resObj.ARR_PSCOP[i].DES,
                    ACTIVE: resObj.ARR_PSCOP[i].ACTIVE,
                    DESREQ: resObj.ARR_PSCOP[i].DESREQ
        };
            if (resObj.ARR_PSCOP[i].ACTIVE == 'Y') {
                activeList.push(data);
            }
            else
                inactiveList.push(data);
    }
        $scope.scopeObj.scopeListData = activeList;
        var isFind = false;
        for (var i = 0; i < activeList.length; i++) {
            if (activeList[i].SCOPID == $scope.timeEntry.SCOID) {
                isFind = true;
                $scope.scopeObj.selected = activeList[i];
                $rootScope.scopeSelected = {
                        SCOPID: activeList[i].SCOPID
            };
        }
    }
        if (!isFind) {
            for (var i = 0; i < inactiveList.length; i++) {
                if (inactiveList[i].SCOPID == $scope.timeEntry.SCOID) {
                    $scope.scopeObj.selected = inactiveList[i];
                    $rootScope.scopeSelected = {
                            SCOPID: inactiveList[i].SCOPID
                };
            }
        }
    }

    }
    $scope.onSelectCepFrmUiSelect = function (selectedItem, search) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.onSelectCepFrmUiSelect");
        $scope.isSrchChkd = false;
        $scope.cepEnter = search;//with mask
        $scope.cepEnterText = search.replace(/\-/g, '');//without mask
        var resp = cepSharedService.isExcepCepCode($scope.cepEnterText);
        if (resp.isExpCep) {
            $scope.maskTest = resp.masking;
    }
        $scope.isTabKeyPress = true;
        $scope.onCepCodeBlur();
    }


    $scope.loadActivity = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.loadActivity");
        try {
            if ($scope.frmParm.isActivityPopOpen)
                return;
            $timeout(function () {
                $('#newEnteryWindow').trigger('focus');
            }, 0);
            var activty = null;
            $scope.isSameCompany = false;
            if ($scope.frmParm.IsCepSelected == true && $scope.cepObj.selected != null && $scope.cepObj.selected.COMPID == $scope.initialDetail.COMP_REC.COMPID) {
                $scope.isSameCompany = true;
        }
            if ($scope.frmParm.IsCepSelected)
                activty = $scope.activity.selected;
            var sendData = {
                    activtyObj: activty, isSameCompany: $scope.isSameCompany, cepCompId: $scope.cepObj.selected == null ? null : $scope.cepObj.selected.COMPID, isCepValid: $scope.frmParm.IsCepSelected, compRecCompId: $scope.initialDetail.COMP_REC.COMPID, isBroadcast: false
        }
            $scope.openModalCtrl = 'ActivityCtrl';
            sendData.popUpName = 'ActivityCtrl';
            var timeOut = 0;
            $scope.frmParm.isActivityPopOpen = true;
            if ($scope.frmParm.isProRenewPopUpOn) {
                timeOut = 1000;
        }
            $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
            $timeout(function () {
                $scope.open('Desktop/NewEntry/templates/Activity.html', 'ActivityDesktopCtrl', sendData);
            }, timeOut);
            $scope.frmParm.isProRenewPopUpOn = false;
    } catch (ex) {
        // $scope.frmParm.isActivityPopUpOpen =false;
    }
    }

    $scope.loadActivityClick = function ($event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.loadActivityClick");
        try {
            if ($scope.isSubmit || $scope.frmParm.isActivityPopOpen) return false;
            var fucusedItemName = angular.element(window.document.activeElement).attr('id');
            if (fucusedItemName == "cepTextBox") {
                $scope.isTabKeyPress = true;
                angular.element('#newEnteryWindow').focus();
                return false;
        }
            $scope.loadActivity();
    } catch (ex) {
        // $scope.frmParm.isActivityPopUpOpen =false;
    }
    }

    $scope.loadICItems = function (event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.loadICItems");
        if ($scope.isSubmit) return false;
        var sendData = {
                sessionKey: $scope.loginDetail.SESKEY,
                compId: $scope.initialDetail.COMP_REC.COMPID,
                domainURL: $scope.domainURL,
                selectedICItem: $scope.frmParm.isICItemSelected ? $scope.ICItem.selected : null
    }
        $scope.openModalCtrl = 'ICItemCtrl';
        sendData.popUpName = 'ICItemCtrl';
        $scope.open('Desktop/NewEntry/templates/ICItem.html', 'ICItemCtrl', sendData);
    }

    var updateTEIdToDelete = function (teid, isIncludeAll) {
        $rootScope.errorLogMethod("NewEntryCtrl.updateTEIdToDelete");
        var dataAr = [];
        var idStr = null;
        var maxTeId = 0;
        var idArray = teid.toString().split(',');
        if (!isIncludeAll && !$rootScope.isPasteClicked) {
            idArray.sort().map(Number);
            maxTeId = idArray[idArray.length -1];
            idArray.splice(idArray.length -1, 1);
            idStr = "";
    }
        if (idArray.length > 1) {
            var idStr = idArray[0].toString();
            for (var j = 1; j < idArray.length; j++) {
                idStr = idStr + "," + idArray[j].toString();
        }
        }
        else {
            if (idArray.length == 1) {
                idStr = idArray[0].toString();
        }
    }
        if (idStr != null) {
            teid = maxTeId;
    }
        dataAr = [teid, idStr];
        return dataAr;
    }
    var validateForOldData = function (cepSelected) {
        $rootScope.errorLogMethod("NewEntryCtrl.validateForOldData");
        var isContinue = false;
        $scope.isHourChange = false;
        if (($scope.isEditMode)) {
            var cep_rec = cepSelected;
            if (($scope.timeEntry.CEP_REC.CLIEID != cep_rec.CLIEID) || ($scope.timeEntry.CEP_REC.ENGID != cep_rec.ENGID) || ($scope.timeEntry.CEP_REC.PRJID != cep_rec.PRJID)) {
                isContinue = true;
                return;
        }
            // if ($scope.timeEntry.CMPTID == 0) {
            if ($scope.timeEntry.CEP_REC.CATID == 0) {
                if ($scope.timeEntry.ACTI_REC.ACTICD != $scope.activity.selected.ACTICD) {
                    isContinue = true;
                    return;
            }
            }
            else {
                if (($scope.timeEntry.CMPTID != $scope.component.selected.CMPTID) || ($scope.timeEntry.TSKID != $scope.task.selected.TSKID)) {
                    isContinue = true; return;
            }
                if ($scope.isScopeReq === true) {
                    if ($scope.timeEntry.SCOID != $scope.scopeObj.selected.SCOPID) {
                        isContinue = true;
                        return;
                };
            }
        }
            if ((!$scope.isDailyMode)) {
                for (var i = 0; i < 7; i++) {
                    if (($scope.timeEntry.weeklyHour[i] != null) && ($scope.weeklyHours[i] != null)) {
                        if ($scope.weeklyHours[i] != $scope.timeEntry.weeklyHour[i]) {
                            $scope.isHourChange = true;
                            isContinue = true; return;

                    }
                }
                    if (($scope.timeEntry.weeklyHour[i] == null) && ($scope.weeklyHours[i] != null)) {
                        $scope.isHourChange = true;
                        isContinue = true; return;
                }
                    if (($scope.timeEntry.weeklyHour[i] != null) && ($scope.weeklyHours[i] == null)) {
                        $scope.isHourChange = true;
                        isContinue = true; return;
                }
            }
            }
            else {
                var isIcEntry = !$scope.editMenu.isTime;
                if (isIcEntry != $scope.timeEntry.isICEntry) {
                    return true;
            }
                if (!$scope.timeEntry.isICEntry && $scope.timeEntry.HRS != parseFloat($scope.dailyHour)) {
                    $scope.isHourChange = true;
                    return true;
                }
                else if ($scope.timeEntry.isICEntry) {
                    var n1 = Number(parseFloat($scope.ICCharge).toFixed(2));
                    var n2 = Number(parseFloat($scope.timeEntry.ICCHRGE).toFixed(2));
                    if (($scope.ICItem.selected.DES != $scope.timeEntry.ICDESC) || (n1 != n2)) {
                        return true;
                }
            }
        }
            if ($scope.timeEntry.DES != $scope.description) {
                isContinue = true; return;
        }
            if ($scope.timeEntry.CTDESC != $scope.descriptionText) {
                isContinue = true; return;
        }
            var r = $scope.isRegulatedChkd === true ? "Y" : "N";
            if ($scope.timeEntry.REGFLAG != r) {
                isContinue = true; return;
        }
            if ($scope.timeEntry.PRSTCD.toString().trim() == '') {
                if ($scope.state.selected != null) {
                    isContinue = true; return;
            }
            }
            else {
                if ($scope.timeEntry.PRSTCD != $scope.state.selected.PTXCODE) {
                    isContinue = true; return;
            }
        }
            return isContinue;

    }
    }

    $scope.saveTEBtnClick = function (fromUi, event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.saveTEBtnClick");
        try {
            localStorage.currentdtForGetData = undefined;
            if ($scope.isSaving) return;
            $scope.isSaving = true;
            $scope.duplicate = $scope.newTE = false;
            var fucusedItemName = angular.element(window.document.activeElement).attr('id');
            if (fucusedItemName == "description") {
                var val = angular.element(document.getElementById('description')).val();
                if ($scope.description !== val) {
                    $scope.description = val;
            }
            }
            else if (fucusedItemName !== undefined && fucusedItemName.indexOf("wkHrs") >= 0) {
               angular.element('#newEnteryWindow').focus();
        }
            $scope.saveTE(fromUi, event);
        }catch (ex) {$scope.isSaving =false;
    }
    }
    $scope.saveTE = function (fromUi, event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.saveTE");
        $scope.saveErrorList = [];
        if (event !== undefined) {
            event.stopPropagation();
    }
        var fucusedItemName = angular.element(window.document.activeElement).attr('id');

        //save button click while focus on hours field
        if (fromUi && $scope.isFocusOnHrs && $scope.editMenu.isTime) {
            var isHrsGt24 = $scope.checkHours($scope.focusHrsObj.id, $scope.focusHrsObj.index);

            if (isHrsGt24) {
                $scope.isFocusOnHrs = false;
                $scope.isSaving = false;
                angular.element('#newEnteryWindow').focus();
                return;
        }
    }

        try {
            var isValid = validateForm();
            if (isValid) {

                //set the date in the api formate 
                var startDate = $filter('date')($scope.startDate, 'yyyy-MM-dd');
                var taskSelected = ($scope.task.selected);
                var componentSelected = ($scope.component.selected);
                var scopeId = '0';
                if ($scope.scopeObj.selected != null) {
                    scopeId = $scope.scopeObj.selected.SCOPID;
            }
                var deleteEntry = '', activity = { }, json = [], teid_data = [], enteries = $scope.isDailyMode ? 1 : 7;
                //Entry is not duplicate entry and in editmode
                if ($scope.isEditMode && !$scope.isDuplicateMode && validateForOldData($scope.cepObj.selected) == false) {
                    $scope.undoClass = disabledCls;
                    if ($scope.newTE == true) {
                        resetWindow();
                        $scope.isSaving = false;
                        return;
                    }
                    else if ($scope.duplicate == true) {
                        $scope.lastSaveEtry = JSON.stringify($scope.timeEntry);
                        $scope.isSubmit = $scope.isSaving = $scope.isEditMode = $scope.duplicate = false;
                        $scope.isDuplicateMode = true;
                        return;
                    }
                    else {
                        $scope.cancelTE();
                        $scope.isSaving = false;
                        return;
                }
            }

                cepService.loadCEPDetail($scope.loginDetail.SESKEY, $scope.cepObj.selected.CLIEID, $scope.cepObj.selected.ENGID, $scope.cepObj.selected.PRJID, $scope.domainURL).then(function (response) {
                    if (parseInt(response.LOADCEP_OUT_OBJ.RETCD) == 0) {
                        var tempTodayDate = new Date();
                        var currentTimezone = tempTodayDate.getTimezoneOffset();
                        tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
                        tempTodayDate.setHours(0, 0, 0, 0);
                        var dateToCompare = dateService.createDate($scope.revEndDate.substring(0, 10));
                        dateToCompare.setHours(0, 0, 0, 0);
                        if (tempTodayDate > dateToCompare) {
                            var selObj = $rootScope.chekRevDateInLocalStorage(tempTodayDate, $filter('translate')('msg_invalidSession'), true); //chekRevDateInLocalStorage(tempTodayDate);
                            $scope.newRevEndDate = dateService.createDate(selObj.STRTDTE);
                            $scope.newRevStartDate = dateService.createDate(selObj.ENDDTE);
                    }
                        // selecetd cep has the componenet and task
                        if (response.LOADCEP_OUT_OBJ.CEP_REC.CATID != 0) {
                            activity = {
                                    ACTICD: componentSelected.ACTICD,
                                    DES: '',
                                    STAT: 'Y',
                                    COMPID: 0
                        }
                        }
                            // selecetd cep has the activity
                        else {
                            activity = {
                                    ACTICD: $scope.activity.selected.ACTICD,
                                    DES: $scope.activity.selected.DES,
                                    STAT: $scope.activity.selected.STAT,
                                    COMPID: $scope.activity.selected.COMPID
                        }
                    }
                        for (var i = 0; i < enteries; i++) {
                            var currentDate = new Date($scope.startDate.valueOf());
                            var date = currentDate.setDate(currentDate.getDate() +i);
                            date = $filter('date')(date, 'yyyy-MM-dd');
                            var time;
                            var teid = $scope.isEditMode ? $scope.timeEntry.TEID : 0;
                            if ($scope.isDailyMode) { time = parseFloat($scope.dailyHour); }
                            else {
                                if ($scope.isEditMode) {
                                    var dataAr = updateTEIdToDelete($scope.timeEntry.teIdData[i], ($scope.weeklyHours[i] == null));
                                    teid = dataAr[0];
                                    if (dataAr[1] != "")
                                        deleteEntry = ((deleteEntry == '') ? dataAr[1] : deleteEntry + ',' + dataAr[1]);

                            }
                                if ($scope.weeklyHours[i] == null)
                                    continue;
                                else {
                                    time = parseFloat($scope.weeklyHours[i]);
                            }
                        }
                            var time_obj = {
                                    TEID: teid,
                                    DTE: date,
                                    CEP_REC: response.LOADCEP_OUT_OBJ.CEP_REC,
                                    ACTI_REC: activity,
                                    ICRTCD: !$scope.editMenu.isTime ? $scope.ICItem.selected.ICRTCD : "",
                                    ICDESC: !$scope.editMenu.isTime ? $scope.ICItem.selected.DES : "",
                                    ICCHRGE: !$scope.editMenu.isTime ? $scope.ICCharge : 0,
                                    HRS: !$scope.editMenu.isTime ? 0 : time,
                                    DES: $scope.description, //$scope.IsActivity ? activityData.DES + ':' + $scope.description : componentSelected.DES + '/ ' + taskSelected.DES + ': ' + $scope.description,
                                    CTDESC: $scope.descriptionText,// $scope.IsActivity ? activityData.DES + ':' + $scope.description : componentSelected.DES + '/ ' + taskSelected.DES + ': ' + $scope.description,
                                    CMPTID: $scope.IsActivity ? 0 : componentSelected.CMPTID,
                                    CATID: $scope.IsActivity ? 0 : $scope.cepObj.selected.CATID,
                                    TSKID: $scope.IsActivity ? 0 : taskSelected.TSKID,
                                    SCOID: scopeId,
                                    REGFLAG: (($scope.isRegulatedChkd === true && $scope.editMenu.isTime) ? "Y" : "N"),//"N",
                                    PRSTCD: ($scope.state.selected == null) || ($scope.state.selected == '') ? '' : $scope.state.selected.PTXCODE

                        }
                            var j = JSON.stringify(time_obj);
                            json.push(j);
                    }
                        var isContinue = true;
                        //for (var i = 0; i < json.length; i++) {
                        isContinue = validateTEBeforeFinalSave(json, response.LOADCEP_OUT_OBJ.CEP_REC);
                            //if (!isContinue)
                               // break;
                    //}
                        /*save to DB if form is valid*/
                        if ((isContinue) && (json.length > 0)) {
                            $scope.lastSaveEtry = json.slice(0);
                            finalSave(json, deleteEntry, $scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, $scope.domainURL);
                        }
                        else {
                            $scope.isSaving = false;
                            $scope.duplicate = $scope.newTE = false;
                    }
                    }
                    else {
                        $scope.duplicate = $scope.newTE = false;
                        $scope.isSaving = false;
                }
                });
            }
            else {
                //case : cursor is on cep field and save click
                if (fucusedItemName == "cepTextBox") {
                    //if (($scope.cepEnterText != '') && ($scope.cepEnterText != null) && $scope.frmParm.is)
                    angular.element('#newEnteryWindow').focus();
                    $timeout(function () { $scope.isSaving = false; });
                    // return;
            }
                $scope.duplicate = $scope.newTE = false;
                showValidationMsg(errrList,false, $filter('translate')('lbl_Error'));
                $scope.isSaving = false;

        }
    } catch (err) {
            $scope.duplicate = $scope.newTE = false;
            $scope.isSaving = false; console.log(err.message);
    }
    }

    var finalSave = function (json, deleteEntry, ssKey, empId, domainUrl) {
        $rootScope.errorLogMethod("NewEntryCtrl.finalSave");
        if (!$scope.isDailyMode) {
            var isRouding = showRoundPopUp();
            if (isRouding) {
                $scope.json = json;
                $scope.deleteEntry = deleteEntry;
                //alert($scope.rndMsg);                
                var sendData = {
                        errorList: [$scope.rndMsg],
                        popUpName: 'SaveTEConfirmPopUp'
            };
                openPopUpService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                $scope.rndMsg = "";

            }
            else {
                callSaveTEApi(json, deleteEntry, ssKey, empId, domainUrl);
        }
        }
        else {
            callSaveTEApi(json, deleteEntry, ssKey, empId, domainUrl);
    }
    }
    $scope.$on("saveTEConfirm", function (event, respoObj) {
        if (respoObj.args.isConfirm) {
            callSaveTEApi($scope.json, $scope.deleteEntry, $scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, $scope.domainURL);
    }
    });
    var showRoundPopUp = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.showRoundPopUp");
        var isRouding = false;
        var tintVal = $scope.initialDetail.COMP_REC.TINT;
        for (var i = 0; i < arrFlagRound.length; i++) {
            if (arrFlagRound[i] == true) {
                $scope.rndMsg = $filter('translate')('msg_HoursRound', { TINT: tintVal });
                $scope.isRoundingMsgShown = true;
                isRouding = true;
                //$scope.loadErrorPopup(false, msg);
                break;
        }
    }
        $scope.isRoundingMsgShown = true;
        return isRouding;
    }
    var callSaveTEApi = function (json, deleteEntry, ssKey, empId, domainUrl) {
        $rootScope.errorLogMethod("NewEntryCtrl.callSaveTEApi");
        var isDelte = false;
        cepService.saveTimeSheet(ssKey, empId, json[0], domainUrl).then(function (response) {
            $rootScope.countmove = 0;
            if (parseInt(response.SAVTIM_OUT_OBJ.RETCD) == 0) {
                if (JSON.parse(json[0]).TEID == 0)
                $rootScope.pastedRecords = true;
                json.splice(0, 1);
                if (json.length > 0) {
                    callSaveTEApi(json, deleteEntry, ssKey, empId, domainUrl);
                }
                else {
                    $scope.undoClass = disabledCls;
                    if (deleteEntry != null && deleteEntry.trim().length > 0) {
                        isDelte = true;
                        gridDataService.deleteTimeEntries($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, deleteEntry).then(function (response) {
                            if (parseInt(response.DELTIM_OUT_OBJ.RETCD) == 0) {
                                //broadcastService.notifyDateTimeSlider($scope.currentDate);
                                //broadcastService.notifyRefreshCalendar();
                                broadcastService.notifyUiGrid($scope.currentDate)
                                arrFlagRound = [false, false, false, false, false, false, false];
                                if (!$scope.newTE && !$scope.duplicate) {
                                    popUp.close(null);
                                }
                                else {
                                    $scope.isHourChange = true;
                                    $scope.isDuplicateMode = $scope.duplicate;
                                    $scope.isSaving = $scope.isEditMode = $scope.duplicate = false;
                            }
                                //if new selected from drop down
                                if ($scope.newTE == true) {
                                    resetWindow();
                            }
                                var isShow24HrsMsg = isDayHourSumExceed24Hour();

                            }
                            else {
                                //$scope.loadErrorPopup(true, response.DELTIM_OUT_OBJ.ERRMSG);
                                showValidationMsg([response.DELTIM_OUT_OBJ.ERRMSG]);
                        }
                        })
                    }
                    else {
                        if (!$scope.newTE && !$scope.duplicate) {
                            popUp.close(null);
                    }
                        var isShow24HrsMsg = isDayHourSumExceed24Hour();
                        arrFlagRound = [false, false, false, false, false, false, false];
                        //broadcastService.notifyDateTimeSlider($scope.currentDate);
                        //broadcastService.notifyRefreshCalendar();
                        broadcastService.notifyUiGrid($scope.currentDate);
                        $scope.isDuplicateMode = $scope.duplicate;
                        $scope.isSaving = $scope.isEditMode = $scope.duplicate = false;
                }
            }
            }

                //error on save API   
            else {
                $scope.frmParm.isErrorPopUpOn = false;
                if (!chekForDBPartitionError(response.SAVTIM_OUT_OBJ.ERRMSG, json, deleteEntry))
                    showValidationMsg([response.SAVTIM_OUT_OBJ.ERRMSG], false);
                $scope.isSaving = false;
        }

            if (json.length == 0 && isDelte == false) {
                $scope.isHourChange = true;
                $scope.isEditMode = $scope.duplicate = false;
                if ($scope.newTE == true) {
                    resetWindow();
            }
        }
        });
    }

    var isDayHourSumExceed24Hour = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.isDayHourSumExceed24Hour");
        if (!$scope.editMenu.isTime)
            return false;
        var weeklyHrsArr = [0, 0, 0, 0, 0, 0, 0];
        if ($scope.isDailyMode) {
            weeklyHrsArr[0] = $scope.dailyHour;
        }
        else {
            weeklyHrsArr = $scope.weeklyHours.slice(0);
            for (var i = 0; i < weeklyHrsArr.length; i++) {
                if (weeklyHrsArr[i] === undefined || weeklyHrsArr[i] === null) {
                    weeklyHrsArr[i] = 0;
            }
        }
    }
        var isExceed = false;
        var noOfDays = 1, hrsPerDay = 0;
        if (!$scope.isDailyMode) {
            noOfDays = 7;
    }

        for (var i = 0; i < noOfDays; i++) {
            hrsPerDay = parseFloat(weeklyHrsArr[i]);

            $scope.hourSumDetail.weeklyHrsSumDayWise[i] = $scope.hourSumDetail.weeklyHrsSumDayWise[i] - $scope.hourSumDetail.editEntryHrs[i] +hrsPerDay;
            if (!$scope.isEditMode) {
                if ($scope.hourSumDetail.weeklyHrsSumDayWise[i] > 24) {
                    isExceed = true;
            }
            }
            else {
                if ($scope.hourSumDetail.weeklyHrsSumDayWise[i] > 24) {
                    isExceed = true;
            }
        }
    }
        selectedData.hoursTotalDetail.weeklyHrsSumDayWise = $scope.hourSumDetail.weeklyHrsSumDayWise;
        selectedData.hoursTotalDetail.editEntryHrs = [0, 0, 0, 0, 0, 0, 0];
        return isExceed;
    }
    var resetWindow = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.resetWindow");
        $timeout(function () { angular.element(document.getElementById("cepTextBox")).trigger('focus'); }, 0);
        $scope.oldCepDetail.isCepSel = false;
        arrFlagRound = [false, false, false, false, false, false, false];
        weekOldData = [null, null, null, null, null, null, null];
        $scope.undoClass = disabledCls;
        $scope.isHourChange = true;
        $scope.isDuplicateMode = false;
        $scope.isValidCharge = $scope.ICCharge = $scope.isSrchChkd = $scope.frmParm.isICItemSelected = false;
        $scope.ICItem = {
                selected: {
        }
    };
        $scope.newTE = $scope.isSubmit = $scope.isSaving = $scope.isEditMode = false;
        $scope.cpeDataItem.selected = null;
        $scope.cepEnterText = "";
        $scope.cepObj.selected = {
    }
        $scope.cpeListData = [];
        $scope.frmParm.IsCepSelected = false;
        $scope.IsActivity = true;
        $scope.frmParm.isActivitySel = false;
        $scope.activity.selected = {
    }
        $scope.component.text = '';
        $scope.dailyHour = null;
        $scope.ICCharge = "";
        $scope.weeklyHours = [null, null, null, null, null, null, null];
        $scope.description = "";
        $scope.descriptionText = '';
        $scope.component = {
    };
        $scope.task = {
    };
        $scope.scopeObj.selected = {
    };
    }
    $scope.cancelTE = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.cancelTE");
        $scope.isProjectTask = null;
        $rootScope.newEntryOpened = false;
        $scope.isTEPopUpOn = false;
        popUp.close(null);
        // broadcastService.notifyDateTimeSlider($scope.currentDate);
        // broadcastService.notifyRefreshCalendar();
    }

    $scope.showSaveMenu = false;

    $scope.showCancelMenu = false;

    $scope.elementClick = function (event, isDiv) {
        //$rootScope.errorLogMethod("NewEntryCtrl.elementClick");
        event.stopPropagation();
        $scope.isStateProvDrpOpen = $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
        if (isDiv) {
            var fucusedItemName = angular.element(window.document.activeElement).attr('id');
            if (fucusedItemName !== undefined)
                if (fucusedItemName == "cepTextBox" || fucusedItemName == "dailyHours" || fucusedItemName.indexOf("wkHrs") > 0) {
                    angular.element('#newEnteryWindow').focus();
        }
    }
    }
    $document.on('click', function (event) {

        $timeout(function () { $scope.isStateProvDrpOpen = false; });
        if ($scope.showsavemenu || $scope.showcancelmenu || $scope.iseditmenuon) {
            if (!menuflag) {
                $scope.$apply(function () {
                    $scope.showsavemenu = false;
                    $scope.showcancelmenu = false;
                    $scope.iseditmenuon = false;
                });
        }
            menuflag = false;
    }
    });

    var menuSelected = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.menuSelected");
        $scope.isSet = true;
    }
    $scope.colEntryShowMenu = function (event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.colEntryShowMenu");
        event.stopPropagation();
        $scope.showCancelMenu = $scope.isEditMenuOn = false;
        var fucusedItemName = angular.element(window.document.activeElement).attr('id');
        if ((fucusedItemName !== undefined) && (fucusedItemName == "ui-select-txt-box" || fucusedItemName == "cepTextBox" || fucusedItemName == "dailyHours" || fucusedItemName.indexOf("wkHrs") > 0)) {
            angular.element('#newEnteryWindow').focus();
    }
        $scope.showSaveMenu = !$scope.showSaveMenu;
        menuFlag = $scope.showSaveMenu;
        if (angular.element('.changenewentry').hasClass("bgActive")) {
            angular.element('.changenewentry').removeClass("bgActive");
        }
        else {
            angular.element('.changenewentry').addClass("bgActive");
    }
    }

    $scope.isStateProvDrpOpen = false;
    $scope.showStateDrp = function (event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.showStateDrp");
        if ($scope.isUpdPro == false || $scope.isSubmit == true) {
            $scope.isStateProvDrpOpen = false;
            return;
    }
        event.stopPropagation();
        angular.element('#newEnteryWindow').focus();
        $scope.isStateProvDrpOpen = !$scope.isStateProvDrpOpen;
    }
    $scope.selectStateProv = function (state) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.selectStateProv");
        $scope.state.selected = state;
        $scope.isStateProvDrpOpen = false;
    }
    $scope.descriptionFocus = function () {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.descriptionFocus");
        $scope.isStateProvDrpOpen = false;
    }
    $scope.colCancelMenu = function (event) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.colCancelMenu");
        event.stopPropagation();
        $scope.showSaveMenu = $scope.isEditMenuOn = false;
        var fucusedItemName = angular.element(window.document.activeElement).attr('id');
        if ((fucusedItemName !== undefined) && (fucusedItemName == "ui-select-txt-box" || fucusedItemName == "cepTextBox" || fucusedItemName == "dailyHours" || fucusedItemName.indexOf("wkHrs") > 0)) {
            angular.element('#newEnteryWindow').focus();
    }
        $scope.showCancelMenu = !$scope.showCancelMenu;
        menuFlag = $scope.showCancelMenu;
        if (angular.element('.changenewentry').hasClass("bgActive")) {
            angular.element('.changenewentry').removeClass("bgActive");
        }
        else {
            angular.element('.changenewentry').addClass("bgActive");
    }
    }

    $scope.onHrsFocus = function (id, weekDay) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.onHrsFocus");
        $scope.focusHrsObj.index = weekDay;
        $scope.focusHrsObj.id = id;
        $scope.isFocusOnHrs = true;
    }
    $scope.checkCharge = function (id) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.checkCharge");
        var a = angular.element(document.getElementById(id))[0];
        if (a.validity.badInput) {
            $scope.isValidCharge = false; return;
    }
        var val = angular.element(document.getElementById(id)).val();

        if (val != null && val != "") {
            var result = 0;
            $scope.isValidCharge = true;
            Number(val);
            result = parseFloat(val).toFixed(2);
            angular.element(document.getElementById(id)).val(result).trigger('input');
        }
        else {
            $scope.isValidCharge = false;
    }
    }
    $scope.checkHoursOnPaste = function ($event, id, weekDay) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.checkHoursOnPaste");
        $timeout(function () {
            var val = angular.element($event.currentTarget).val();
            if (val == "") {
                if (!$scope.isDailyMode) {
                    $scope.weeklyHours[weekDay] = null;
                }
                else {
                    $scope.dailyHour = null
            }
                angular.element(document.getElementById(id)).val(val).trigger('input');
        }
        });
    }
    $scope.checkHours = function (id, weekDay) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.checkHours");
        var isRounded = false;
        var msgList = [];
        if ($scope.isFocusOnHrs == false && !$scope.isFormLoading)
            return;
        $scope.isFocusOnHrs = false;
        var isHrsGt24 = false, sep = "-";
        $scope.isValidHrs = false;
        var entryDate = $scope.startDate;
        var val = angular.element(document.getElementById(id)).val();
        var a = angular.element(document.getElementById(id))[0];
        if (a.validity.badInput) {
            $scope.isValidHrs = false; return;
        }
        else if (a.validity.badInput == undefined) {
            try {
                var hrsVal = $scope.isDailyMode ? $scope.dailyHour : $scope.weeklyHours[weekDay];
                if (hrsVal === null || hrsVal === undefined) {
                    $scope.isValidHrs = false; return;
            }
        } catch (ex) {
                $scope.isValidHrs = false; return;
        };
    }

        if (!$scope.isDailyMode) {
            var entryDate = new Date($scope.startDate.valueOf());
            entryDate = entryDate.setDate(entryDate.getDate() +weekDay);
    }
        if ((val != null) && (val != '')) {
            $scope.isValidHrs = true;
            Number(val);
            var tintVal = $scope.initialDetail.COMP_REC.TINT;
            val = getNearestMultple(val, tintVal, weekDay);
            try {
            if (!$scope.isDailyMode) {
                weekOldData[weekDay] = val;
                    $scope.weeklyHours[weekDay] = val;
            }
            else {
                    $scope.dailyHour = val;
            }
            angular.element(document.getElementById(id)).val(val).trigger('input');
        } catch (ex) {
        }
            if (!$scope.isFormLoading) {
                var msg = "";
                if ($scope.isDailyMode) {
                    weekDay = 0;
                    var date = $filter('date')(entryDate, 'dd-MMM-yyyy');
                    msg = get24HrsMassage(sep, date);
                }
                else {
                    var weekDate = $scope.startDate;
                    var dateStr = $filter('date')(weekDate, 'dd-MMM-yyyy');
                    msg = get24HrsMassage(sep, dateStr);
            }
                if ($scope.rndMsg != "" && $scope.isDailyMode) {
                    isRounded = true;
                    msgList.push(sep + $scope.rndMsg);
            }
                if (val > 24) {
                    msgList.push(msg);
                    isHrsGt24 = true;
                }
                else {
                    //console.log("checking total hrs of the day==" +val);
                    if (isTotalHrsExceed24(val, weekDay)) {
                        isHrsGt24 = true;
                        msgList.push(msg);
                }
            }
                if (msgList.length > 0) {
                    if (msgList.length == 1) {
                        msgList[0] = msgList[0].substring(1);
                }
                    showValidationMsg(msgList);
            }
        }
    }
        if (isHrsGt24) {
            $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
    }
        if (isHrsGt24 == false) {
            isHrsGt24 = isRounded;
    }
        return isHrsGt24;
    }
    var get24HrsMassage = function (sep, dateStr) {
        $rootScope.errorLogMethod("NewEntryCtrl.get24HrsMassage");
        var msg = "";
        if ($scope.isDailyMode) {
            msg = sep + $filter('translate')('msg_24HrsDay', {
                    dateVal: dateStr
            });
        }
        else {
            msg = sep + $filter('translate')('msg_24HrsWeek', {
                    dateVal: dateStr
            });
    }
        return msg;
    }

    var isTotalHrsExceed24 = function (hrsVal, weekDayIndex) {
        $rootScope.errorLogMethod("NewEntryCtrl.isTotalHrsExceed24");
        var isExceed = false, hrsPerDay = 0, ttlHrs = 0;
        if (!$scope.editMenu.isTime)
            return false;
        hrsPerDay = parseFloat(hrsVal);//parseFloat(weeklyHrsArr[i]);
        ttlHrs = $scope.hourSumDetail.weeklyHrsSumDayWise[weekDayIndex] - $scope.hourSumDetail.editEntryHrs[weekDayIndex] +hrsPerDay;
        if (ttlHrs > 24) {
            isExceed = true;
    }
        return isExceed;
    }
    $scope.showProjComponentPopup = function () {
        try {
            $rootScope.errorLogMethod("NewEntryCtrl.$scope.showProjComponentPopup");
            if ($scope.frmParm.isCompoProPopOpen)
                return;
            $timeout(function () {
                $('#newEnteryWindow').trigger('focus');
            }, 0);
            var isSelected = ($scope.component.selected == null) ? false : true;
            var defaultDesc = getDefaultDesc();
            var timeEntery = null;
            //if component and taks is already selected
            if ($scope.frmParm.IsCepSelected && $scope.frmParm.isActivitySel) {
                timeEntery = { CMPTID: $scope.component.selected.CMPTID, TSKID: $scope.task.selected.TSKID
            }
                if ($scope.scopeObj.selected != null) {
                    timeEntery.SCOPID = $scope.scopeObj.selected.SCOPID;
            }
        }
            var sendData = {
                    components: $scope.projectListData, isSelected: isSelected, defaultDesc: defaultDesc, isEditMode: false, timeEntery: timeEntery, isBroadcast: false, isImportCal: ($scope.timeEntry === null) ? false : $scope.timeEntry.isImportCal
        }
            sendData.popUpName = 'ProjectComponentCtrl';
            $scope.openModalCtrl = 'ProjectComponentCtrl';
            var timeOut = 0;
            $scope.frmParm.isCompoProPopOpen = true;
            if ($scope.frmParm.isProRenewPopUpOn) {
                timeOut = 1000;
        }
            $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
            $timeout(function () {
                $scope.open('Desktop/NewEntry/templates/ComponentTask.html', 'ProjectComponentCtrl', sendData);
            }, timeOut);
            $scope.frmParm.isProRenewPopUpOn = false;
    } catch (ex) {
            console.log('error on  showProjComponentPopup');
    }
    }

    $scope.showProComClick = function () {
        try {
            $rootScope.errorLogMethod("NewEntryCtrl.$scope.showProComClick");
            if ($scope.isSubmit || $scope.frmParm.isCompoProPopOpen) return false;
            var fucusedItemName = angular.element(window.document.activeElement).attr('id');
            if (fucusedItemName == "cepTextBox") {
                $scope.isTabKeyPress = true;
                angular.element('#newEnteryWindow').focus();
                return false;
        }
            $scope.showProjComponentPopup();
    } catch (ex) {
            console.log('error on  showProjComponentPopup');
    }
    }

    $scope.loadDescription = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.loadDescription");
        if ($scope.isSubmit) return false;
        var defaultDesc = $scope.description;
        var sendData = {
                IsActivity: $scope.IsActivity,
                desc: defaultDesc
    }
        sendData.popUpName = 'DescriptionCtrl';
        $scope.openModalCtrl = 'DescriptionCtrl';
        $scope.open('Desktop/NewEntry/templates//Description.html', 'DescriptionDesktopCtrl', sendData);
    }

    var getDefaultDesc = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.getDefaultDesc");
        var text = '';
        if (($scope.descriptionText != null) && ($scope.descriptionText != ''))
            text = $scope.descriptionText.trim();
        return text;
    }

    var showValidationMsg = function (msgList, isWarning, title) {
        $rootScope.errorLogMethod("NewEntryCtrl.showValidationMsg");
        $scope.showSaveMenu = $scope.showCancelMenu = $scope.isEditMenuOn = false;
        if ($scope.frmParm.isErrorPopUpOn == true || $scope.isTEPopUpOn === false)
            return;
        var sendData = {
                errorList: msgList
    };
        if (isWarning !== undefined && isWarning !== null) {
            sendData.isWarning = isWarning;
    }
        if (title !== undefined && title !== null) {
            sendData.title = title;
    }
        sendData.popUpName = 'saveValidationAlert';
        $scope.openModalCtrl = 'saveValidationAlert';
        $scope.frmParm.isErrorPopUpOn = true;
        $scope.open('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
    };

    var InitializeValidationMsg = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.InitializeValidationMsg");
        $scope.frmParm.cepMsg = $filter('translate')('msg_ValidCep');
        $scope.frmParm.activityMsg = $filter('translate')('msg_activity');
        $scope.frmParm.invalidHrs = $filter('translate')('msg_InvalidHrs');
        $scope.frmParm.desMsg = $filter('translate')('msg_Description');
        $scope.frmParm.compoMsg = $filter('translate')('msg_Task');
        $scope.frmParm.projectMsg = $filter('translate')('msg_Component');
        $scope.frmParm.scopeMsg = $filter('translate')('msg_Scope');
        $scope.frmParm.compTaskMsg = $filter('translate')('msg_invalidProjectComponent');
    }

    var validateForm = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.validateForm");
        var hyphenStr = "- ";
        errrList = [];
        var isContinue = true;
        if (!$scope.frmParm.IsCepSelected) {
            errrList.push(hyphenStr + $scope.frmParm.cepMsg + '...');
            isContinue = false;
    }
        if ($scope.IsActivity) {
            if ($scope.activity.selected === null || $scope.activity.selected.DES == null || $scope.activity.selected.DES.trim().length == 0) {
                errrList.push(hyphenStr + $scope.frmParm.activityMsg + '...');
                isContinue = false;
        }
        }
            //check component/task/scope
        else {
            if (!$scope.frmParm.isActivitySel) {
                errrList.push(hyphenStr + $scope.frmParm.compTaskMsg);
                isContinue = false;
        }
    }
        var isDescBlank = ($scope.description == null || $scope.description.trim().length == 0);
        if ($scope.isDailyMode) {
            if ($scope.editMenu.isTime) {
                var time = parseFloat($scope.dailyHour);
                if (isNaN(time)) {
                    isContinue = false;
                    errrList.push(hyphenStr + $scope.frmParm.invalidHrs);
                }
                else if (errrList.length > 0 || isDescBlank) {
                 if (time > appConstants.EXCESSIVEHRS) { errrList.push(hyphenStr + $scope.frmParm.exHour1); isContinue = false; }
                 else if (time < appConstants.EXCESSIVENEGHRS) {
                     errrList.push(hyphenStr + $scope.frmParm.exHour2); isContinue = false;
                 }
                }
            }
            else {
                if ($scope.ICItem.selected.DES == null || $scope.ICItem.selected.DES.trim().length == 0) {
                    errrList.push(hyphenStr + $scope.frmParm.icValdationMsg);
                    isContinue = false;
            }
                var icCharge = parseFloat($scope.ICCharge);
                if (isNaN(icCharge)) {
                    isContinue = false;
                    errrList.push(hyphenStr + $scope.frmParm.icChargeValMsg);
            }

        }
        }
        else {
            var isInvalidHrs = arrService.isBlankArray($scope.weeklyHours, [null]);
            if (isInvalidHrs) {
                isContinue = false;
                errrList.push(hyphenStr + $scope.frmParm.invalidHrs);
            }
            else if (errrList.length > 0 || isDescBlank) {
                var exessiveHrsAr = $scope.weeklyHours.filter(function (hrs) {
                    return hrs < appConstants.EXCESSIVENEGHRS
                });
                if (exessiveHrsAr.length > 0) {
                    errrList.push(hyphenStr + $scope.frmParm.exHour2);
                    isContinue = false;
                    exessiveHrsAr = [];
            }
                var exessiveHrsAr = $scope.weeklyHours.filter(function (hrs) {
                    return hrs > appConstants.EXCESSIVEHRS
                });
                if (exessiveHrsAr.length > 0) {
                    errrList.push(hyphenStr + $scope.frmParm.exHour1);
                    isContinue = false;
                    exessiveHrsAr = [];
            }
        }
    }
        /*for description*/
        if ($scope.description == null || $scope.description.trim().length == 0) {
            errrList.push(hyphenStr + $scope.frmParm.desMsg);
            isContinue = false;
    }

        if (errrList.length === 1) {
            errrList[0] = errrList[0].substring(1);
    }
        return isContinue;
    }

    var loadHomePage = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.loadHomePage");
        $state.go('MainDesktop', {
            "loadDate": $scope.startDate,
            "isDailyMode": $scope.isDailyMode,
            "currentDate": $scope.currentDate
        }, {
                reload: true
        });
    }

    var getNearestMultple = function (hrsVal, tintVal, addDay) {
        $rootScope.errorLogMethod("NewEntryCtrl.getNearestMultple");
        $scope.rndMsg = "";
        //tintVal = '0';     
        var result = 0;
        if (tintVal == '0') {
            result = parseFloat(hrsVal).toFixed(2);
            return result;
    }
        var val1 = (hrsVal % tintVal)
        if (val1 != 0) {
            $scope.rndMsg = $filter('translate')('msg_HoursRound', {
                    TINT: tintVal
            });

            if (!$scope.isDailyMode) {
                arrFlagRound[addDay] = true;
        }
        }
        else {
            if ((!$scope.isDailyMode)) {
                if ((weekOldData[addDay] == null)) {
                    arrFlagRound[addDay] = false;
                }
                else {
                    if (weekOldData[addDay] != hrsVal) {
                        arrFlagRound[addDay] = false;
                }
            }
        }

    }
        if (hrsVal > 0) {
            return (Math.ceil(hrsVal / tintVal) * tintVal).toFixed(2);
        }
        else if (hrsVal < 0) {
            return (Math.floor(hrsVal / tintVal) * tintVal).toFixed(2);
        }
        else return parseFloat(hrsVal).toFixed(2);;
    }

    var isInvalidFutureEntry = function (time_Obj) {
        $rootScope.errorLogMethod("NewEntryCtrl.isInvalidFutureEntry");
        var isFutureEntry = futureEntryService.futureEntry(time_Obj);
        return isFutureEntry;
    }

    var checkEachTEFrmJson = function (json, msgAr) {
        var erObj = { bilingDteEr: "", inValidFutureTEEr: "", negHrsMsg: "", excHrsMsg: "", excNegHrsMsg: "" };
        var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
        var parts = billingDate.split("-");
        var day = parts[2].split(' ');
        var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
        for (var i = 0; i < json.length; i++) {
            var time_Obj = JSON.parse(json[i]);
            if (erObj.bilingDteEr == "") {
                var timeDate = dateService.createDate(time_Obj.DTE);
                if (new Date(timeDate.valueOf()) < new Date(nstartDate.valueOf())) {
                    var show = nstartDate.toString().split(' ');
                    var date = show[2] + '-' + show[1] + '-' + show[3];
                    //showValidationMsg([$filter('translate')('msg_TimePriorToBillingStartDate', {
                    //    dateVal: date
                    //})], false, $filter('translate')('lbl_Error'));
                    erObj.bilingDteEr = $filter('translate')('msg_TimePriorToBillingStartDate', {
                        dateVal: date
                    });
                }
            }
            if (erObj.inValidFutureTEEr == "") {
                if (isInvalidFutureEntry(time_Obj))
                    erObj.inValidFutureTEEr = $filter('translate')('msg_FutureTimeEntry');
            }
            if (erObj.negHrsMsg == "" && (($scope.editMenu.isTime && parseFloat(time_Obj.HRS) < 0) || (!$scope.editMenu.isTime && parseFloat(time_Obj.ICCHRGE) < 0))) {
                var msg = '';
                erObj.negHrsMsg = commonUtilityService.validateTENegValue(time_Obj, $scope.initialDetail, $scope.editMenu.isTime);
            }
        }

        /*Excessive hours validation*/
        if ($scope.isDailyMode) {
            if ($scope.editMenu.isTime) {
                var time = parseFloat($scope.dailyHour);
                if (time > appConstants.EXCESSIVEHRS)
                    erObj.excHrsMsg = $scope.frmParm.exHour1;
                else if (time < appConstants.EXCESSIVENEGHRS)
                    erObj.excHrsMsg = $scope.frmParm.exHour2;
            }
        }
        else {
            var exessiveHrsAr = $scope.weeklyHours.filter(function (hrs) {
                return hrs > appConstants.EXCESSIVEHRS
            });
            if (exessiveHrsAr.length > 0) {
                erObj.excHrsMsg = $scope.frmParm.exHour1;
                exessiveHrsAr = [];
            }
            var exessiveHrsAr = $scope.weeklyHours.filter(function (hrs) {
                return hrs < appConstants.EXCESSIVENEGHRS
            });
            if (exessiveHrsAr.length > 0) {
                erObj.excNegHrsMsg = $scope.frmParm.exHour2;
            }
        }
        if (erObj.bilingDteEr != "") {
            msgAr.push(erObj.bilingDteEr);
        }
        if (erObj.inValidFutureTEEr !== "") {
            msgAr.push(erObj.inValidFutureTEEr);
        }
        if (erObj.negHrsMsg !== "") {
            msgAr.push(erObj.negHrsMsg);
        }
        if (erObj.excHrsMsg !== "") {
            msgAr.push(erObj.excHrsMsg);
        }
        if (erObj.excNegHrsMsg !== "") {
            msgAr.push(erObj.excNegHrsMsg);
        }
        return erObj;
    }

   // validate time entery before save when form is filled by user 
    var validateTEBeforeFinalSave = function (json, cep_detail) {
        $rootScope.errorLogMethod("NewEntryCtrl.validateTEBeforeFinalSave");
        var time_Obj = JSON.parse(json[0]);
        var blockcharges = $scope.initialDetail.COMP_REC.BCHB;
        var msgEr = [];
        
        if (cep_detail.CLIEACTIVE != 'Y' || cep_detail.ENGACTIVE != 'Y' || cep_detail.PRJACTIVE != 'Y') {
            //msgEr.push($filter('translate')('msg_InActiveCep'));
            showValidationMsg([$filter('translate')('msg_InActiveCep')], false);
            return false;
        }
        
        if (cep_detail.ENGTIMFLAG != 'Y') {
            msgEr.push($filter('translate')('msg_SelectAnotherEng'));                        
        }
        
        if ((cep_detail.PRJTIMFLAG != 'Y')) {
            msgEr.push($filter('translate')('msg_SelectAnotherPrj'));
        }

        if (blockcharges !== undefined && (blockcharges !== null) && (blockcharges != '') && blockcharges.toUpperCase() != "NO" && blockcharges.toUpperCase() != "N") {
            for (var i = 0; i < blockcharges.length; i++) {
                if (cep_detail.CHARBASIS == blockcharges.charAt(i)) {
                    msgEr.push($filter('translate')('msg_CEPChargeBasisErr'));
                }
            }
        }

        if ((time_Obj.ACTI_REC.STAT != 'Y') && (time_Obj.ACTI_REC.ACTICD != null) && ((time_Obj.ACTI_REC.ACTICD != ''))) {
            msgEr.push($filter('translate')('msg_InActiveActivity'));
        }

        var errObj = checkEachTEFrmJson(json, msgEr);
        
        if (($scope.component.selected != null) && ($scope.component.selected != '') && ($scope.task.selected != null) && ($scope.task.selected != '')) {
            if (($scope.component.selected.ACTIVE != 'Y') || ($scope.task.selected.ACTIVE != 'Y')) {                
                msgEr.push($filter('translate')('msg_invalidProjectComponent')); 
            }
        }
        if (($scope.scopeObj.selected != null)) {
            if (($scope.scopeObj.selected.ACTIVE != 'Y')) {
                msgEr.push($filter('translate')('msg_PrjScopNotValid'));
            }
        }
        if (msgEr.length > 0) {
            if (msgEr.length > 2) {
                msgEr = msgEr.slice(0, 2);
                msgEr[2] = $filter('translate')('msg_TEMultipleErr');
            }
            if (msgEr.length > 1) {
                msgEr[0] = "<span class=\"floatLeftSide\">- </span>" + "<span class=\"floatRightSide\">" + msgEr[0] + "</span>";
                msgEr[1] = "<span class=\"floatLeftSide\">- </span>" + "<span class=\"floatRightSide\">" + msgEr[1] + "</span>";
            }
            showValidationMsg(msgEr, false);
            return false;
        }
        if (((cep_detail.RENPRJNO != null) && (cep_detail.RENPRJNO != ' ')) && (typeof cep_detail.RENPRJNO != 'undefined') && (!$scope.isSubmit)) {
            showProjectRenewdMsg(cep_detail);
            cep_detail.IsProjRenewd = true;
            $scope.frmParm.isProRenewPopUpOn = true;
            return true;
        }
        return true;
    }
    
    var validateCEPCode = function (cep_detail, isLoadCEP) {
        $rootScope.errorLogMethod("NewEntryCtrl.validateCEPCode");
        // Charge Bases to block 
        var blockcharges = $scope.initialDetail.COMP_REC.BCHB;
        var isContinue = true;

        if (($scope.isEditMode) && (isLoadCEP)) {
            if (($scope.timeEntry.CEP_REC.CLIEID == cep_detail.CLIEID) && ($scope.timeEntry.CEP_REC.ENGID == cep_detail.ENGID) && ($scope.timeEntry.CEP_REC.PRJID == cep_detail.PRJID)) {
                isContinue = false;
        }
    }

        if (isContinue) {

        if (blockcharges !== undefined && (blockcharges !== null) && (blockcharges != '') && blockcharges.toUpperCase() != "NO" && blockcharges.toUpperCase() != "N") {
                for (var i = 0; i < blockcharges.length; i++) {
                    if (cep_detail.CHARBASIS == blockcharges.charAt(i)) {
                        showValidationMsg([$filter('translate')('msg_CEPChargeBasisErr', {
                                values: blockcharges
                        })], false);
                        return false;
                }
            }
        }
            if (cep_detail.CLIEACTIVE != 'Y' || cep_detail.ENGACTIVE != 'Y' || cep_detail.PRJACTIVE != 'Y') {
                showValidationMsg([$filter('translate')('msg_InActiveCep')], false);
                return false;
        }
            if (cep_detail.ENGTIMFLAG != 'Y') {
                showValidationMsg([$filter('translate')('msg_SelectAnotherEng')], false, $filter('translate')('lbl_Error'));
                return false;
        }

           if ((cep_detail.PRJTIMFLAG != 'Y')) {
               showValidationMsg([$filter('translate')('msg_SelectAnotherPrj')], false, $filter('translate')('lbl_Error'));
                return false;
        }
    }
        if (((cep_detail.RENPRJNO != null) && (cep_detail.RENPRJNO != ' ')) && (typeof cep_detail.RENPRJNO != 'undefined') && (!$scope.isSubmit)) {
            showProjectRenewdMsg(cep_detail);
            cep_detail.IsProjRenewd = true;
            $scope.frmParm.isProRenewPopUpOn = true;
            return true;
    }
        return true;
    }
    var showProjectRenewdMsg = function (cep_detail) {
        $rootScope.errorLogMethod("NewEntryCtrl.showProjectRenewdMsg");
        var pro = parseInt(cep_detail.RENPRJNO) > 99 ? (parseInt(cep_detail.RENPRJNO)).toString() : parseInt(cep_detail.RENPRJNO) > 9 ? '0' + (parseInt(cep_detail.RENPRJNO)).toString() : '00' + (parseInt(cep_detail.RENPRJNO)).toString();
        var cepcode = cep_detail.CLIENO + '-' + cep_detail.ENGNO + '-' + cep_detail.PRJNO;
        showValidationMsg([$filter('translate')('msg_ProjectRenewedPaste', {
                pName: pro, cepProject: cepcode
        })], 'z', "Warning");
        $scope.frmParm.isProRenewPopUpOn = true;
    }
    var showHrsAlertBeforeSave = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.showHrsAlertBeforeSave");
        var msgList = [];
        if ($scope.isDailyMode) {
            var date = $filter('date')($scope.startDate, 'dd-MMM-yyyy');
            msgList.push($filter('translate')('msg_24HrsDay', {
                    dateVal: date
            }));
            showValidationMsg(msgList);
        }
        else {
            var weekDate = $scope.startDate;
            var dateStr = $filter('date')(weekDate, 'dd-MMM-yyyy');
            msgList.push($filter('translate')('msg_24HrsWeek', {
                    dateVal: dateStr
            }));
            showValidationMsg(msgList);
    }
    }

    var chekForDBPartitionError = function (errMsg, json, deleteEntry) {
        $rootScope.errorLogMethod("NewEntryCtrl.chekForDBPartitionError");
        if (errMsg != null && errMsg != '') {
            errMsg = errMsg.toLowerCase();
            var index = (errMsg.indexOf("database partition"));

            if (index > 0) {
                var dates = '';
                for (var i = 0; i < json.length; i++) {
                    var jsonData = JSON.parse(json[i]);
                    var dte = dateService.createDate(jsonData.DTE);
                    dte = $filter('date')(dte, "dd-MMM-yyyy");
                    dates = (dates == '' ? dte : dates + ',' + dte);
            }
                if (dates != '') {
                    $scope.isPartitionErr = true;
                    var msg = $filter('translate')('msg_DBParttionEr', {
                            dateValue: dates
                    });
                    if ($rootScope.$stateParams.isDailyMode)
                        showValidationMsg([msg], false);
                    else
                        showValidationMsg([msg], false);
                    $scope.callDeleteAPI(deleteEntry, false, false)

            }

        }
    }
        return $scope.isPartitionErr;
    }

        /*performance improvement : loadRevenueMonths API call*/
    var setRevenueDte = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.setRevenueDte");
        var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months'));
        var revRangeDate = null;
        if (revMnthRange != null) {
            var updDate = new Date();
            updDate = new Date(updDate.getTime() - (updDate.getTimezoneOffset() * 60 * 1000));
            updDate.setHours(0, 0, 0, 0);
            revRangeDate = angular.fromJson(revMnthRange).filter(function (item) {
                if (item != null) {
                    if (updDate >= dateService.createDate(item.STRTDTE) && updDate <= dateService.createDate(item.ENDDTE)) {
                        return true;
                }
            }
            });
    }
        if (revRangeDate != null && revRangeDate != undefined && revRangeDate.length != 0) {
            $scope.revStartDate = revRangeDate[0].STRTDTE;
            $scope.revEndDate = revRangeDate[0].ENDDTE;
    }
    }

    $scope.undoTimeEntry = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.undoTimeEntry");
        $scope.showCancelMenu = !$scope.showCancelMenu;
        $scope.undoTEFlag = false;
        $scope.isSrchChkd = false;
        if ($scope.isEditMode && !$scope.isDuplicateMode) {
            $scope.undoTEFlag = true;
            $scope.init();
    }
        if (angular.element('.changenewentry').hasClass("bgActive")) {
            angular.element('.changenewentry').removeClass("bgActive");
    }
    }
    $scope.newTimeEntry = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.newTimeEntry");
        $scope.showSaveMenu = !$scope.showSaveMenu
        if (angular.element('.changenewentry').hasClass("bgActive")) {
            angular.element('.changenewentry').removeClass("bgActive");
    }
        $scope.newTE = true;
        $scope.saveTE(true);
    }
    $scope.duplicateTimeEnrty = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.duplicateTimeEnrty");
        $scope.isSrchChkd = false;
        $scope.showSaveMenu = !$scope.showSaveMenu
        if (angular.element('.changenewentry').hasClass("bgActive")) {
            angular.element('.changenewentry').removeClass("bgActive");
    }
        $scope.duplicate = true;
        $scope.saveTE(true);
    }
    $scope.showSaveMenu = false;
    $scope.showCancelMenu = false;

    var clear = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.clear");
        $scope.cpeListData = [];
        $scope.frmParm.isProjectSelected = false;
        $scope.activity.activityListData = [];
        $scope.activity.selected = {
    };
        $scope.component.text = '';
        //$scope.descriptionText = '';
        $scope.component.selected = null;
        $scope.task.selected = null;
        $scope.scopeObj.selected = null;
        $scope.frmParm.isActivitySel = false;
    }

    $scope.descriptionBlur = function () {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.descriptionBlur");
        if ($scope.description != null) {
            $scope.description = $scope.description.replace(/\n/g, " ");
            $scope.description = $scope.description.replace(/\t/g, " ");
            if ($scope.description.length > 0) {
                $scope.description = removeEmoji();
                $scope.isFavDescription($scope.description.trim(), JSON.parse(sessionStorage.getItem('DescFav')));
        }
    }

    }
    $scope.removeTabKey = function () {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.removeTabKey");
        $timeout(function () {
            $scope.description = $scope.description.replace(/\n/g, " ");
            $scope.description = $scope.description.replace(/\t/g, " ");
        });
    }
        /*add-remove favourites*/
    $scope.isFavDescription = function (val, favList) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.isFavDescription");
        var userInput = val;
        val = val.replace(/\t/g, " ");
        if (favList == undefined) {
            favList = JSON.parse(sessionStorage.getItem('DescFav'));
    }
        $scope.favDesc = false;
        var decodedStr = descFavService.getUTF8ByteLength(val, 600);
        val = decodedStr.trim();
        $scope.description = decodedStr;
        if (val.length > 0) {
            var isExist = descFavService.isDescInFavList(val, favList);
            if (isExist) {
                $scope.favDesc = true;
        }
    }
    }


    var refreshDescFavourites = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.refreshDescFavourites");
        cepService.retrieveDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
            .then(function (response) {
                if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                    if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                        var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                        response.RETDESCFAV_OUT_OBJ.DESTXT_ARR = [];
                        if (data != null && data.VARCHAR2 != undefined)
                            response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                }

                    var descFav = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
            }
                sessionStorage.removeItem('DescFav');
                sessionStorage.setItem('DescFav', JSON.stringify(descFav));
                $scope.favDescriptionList = descFav;
                broadcastService.updateDataSource(appConstants.BroadCastUpdate.updateFavDesc);
        });

    }
        // Add description
    $scope.addToFavDescription = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.addToFavDescription");
        $scope.description = $scope.description.trim();
        var isExist = descFavService.isDescInFavList($scope.description, $scope.favDescriptionList);
        if (isExist) {
            showValidationMsg([addRemoveFavMsgs.duplicateDesc])
        }
        else if ($scope.description.length > 0) {
            cepService.addDescriptionFavorite($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify($scope.description)).then(function (response) {
                if (response.ADDDESCFAV_OUT_OBJ.RETCD == 0) {
                    $scope.description = response.ADDDESCFAV_OUT_OBJ.DESCOUT;
                    refreshDescFavourites();
                    $scope.favDesc = true;
            }
            });
    }
    };

    $scope.removeFromFavDescription = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.removeFromFavDescription");
        $scope.description = $scope.description.trim();
        var data = {
            "VARCHAR2": [$scope.description]
    };
        var destxt_arr = JSON.stringify(data);
        var isExist = descFavService.isDescInFavList($scope.description, $scope.favDescriptionList);
        if ($scope.description.length > 0 && isExist) {
            cepService.removeDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, destxt_arr).then(function (response) {
                if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                    refreshDescFavourites();
                    $scope.favDesc = false;
            }
            });
        }
        else {
            $scope.favDesc = false;
    }
    };
        /*end*/

    $scope.keyPress = function ($event) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.keyPress");
        if ($event.keyCode == 13) {
            $event.preventDefault();
    }
    }

    var removeEmoji = function () {
        //$rootScope.errorLogMethod("NewEntryCtrl.removeEmoji");
        var arr = [];
        var char = '';
        var val = angular.element(document.getElementById('description')).val();
        val = val.replace(/\t/g, " ");
        val = val.replace(/\n/g, " ")
        try {
            val = val.replace('⛔', '');
            val = val.replace('☺️', '');
            val = val.replace('☹️', '');
            val = val.replace('✊', '');
            val = val.replace('✌️', '');
            val = val.replace('✋', '');
            val = val.replace('☝️', '');
            val = val.replace(/✍️|❤️|✍|⛹|⚓️|⛪️|⛴|⛺️|✈️|☹/g, '');
            var split = val.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
            val = '';
            for (var i = 0; i < split.length; i++) {
                char = split[i]
                if (char !== "") {
                    var c = char.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
                    if (c.length == 1) {
                        val = val + c[0];
                }
            }
        }
            val = val.replace(/\n/g, " ");
            return val.trim();
    }
        catch (err) {
            console.log(err.message); return val;
    }
    }

    $scope.cpeList = function ($select) {
        $rootScope.errorLogMethod("NewEntryCtrl.cpelist");
        return $scope.cpecodeList;
    }

    var loadRevenueMonth = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.loadRevenueMonth");
        $scope.revenueCurrentMonth = $scope.initialDetail.REVM_REC;
    }
    $scope.CurrentPageNumber = 1;


    var updateButtons = function (mode,ttlPage) {
        if (mode == 1) {
            $('#pageNumber').val(1);
            $('#pageNumber').trigger('input'); // Use for Chrome/Firefox/Edge
            $('#hdnPgNum').val(1);
            $('#hdnPgNum').trigger('input'); // Use for Chrome/Firefox/Edge
            $('#firstPage').addClass("fa-step-backward-disabled");
            $('#prevPage').addClass("fa-angle-left-disabled");
        }
        else {
            if (ttlPage > 1) {
                $('#nextPage').removeClass("fa-angle-right-disabled");
                $('#lastPage').removeClass("fa-step-forward-disabled");
            }
            else {               
                $('#nextPage').addClass("fa-angle-right-disabled");
                $('#lastPage').addClass("fa-step-forward-disabled");
               
            }
        }

    }
    var isBtnDisable = function (btnNo, id) {
        var flag=false;
        if ((btnNo == 3 || btnNo == 4) && ($('#' + id).hasClass("fa-angle-right-disabled") || $('#' + id).hasClass("fa-step-forward-disabled"))) {
            flag=true;
        }
        if ((btnNo == 1 || btnNo == 2) && ($('#' + id).hasClass("fa-step-backward-disabled") || $('#' + id).hasClass("fa-angle-left-disabled"))) {
            flag=true;
        }
        return flag;
    }
    $scope.setCurrent = function (pageNumber, btnNo, id, ttlPages) {
        //console.log("setCurrent");
        var pNo = pageNumber;
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.setCurrent");
        var isDisable = false;// isBtnDisable(btnNo, id);
        if (!isDisable) {
            $scope.PageNumber = $scope.IsSearchDropdown ? 1 : parseInt(pageNumber);
            if (!$scope.IsSearchDropdown) {
                $scope.refreshResults($scope.select, $scope.uiSlectItem);
            }
           
        }
        else {
            //if (btnNo == 3 && pNo!=ttlPages) {
            //   // pNo = pNo - 1;
            //}
        }
        $scope.IsSearchDropdown = false;
        return pNo;
    }
    $scope.oldSearch = "";
    var passToApi = "";
    $scope.refreshResults = function (search, $select) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.refreshResults");
        $scope.uiSlectItem = $select;
        $scope.cepSearList = [];
        passToApi = search;
        if ($scope.isSrchChkd) {
            if (search != $scope.oldSearch) {
                $scope.IsSearchDropdown = true;
        }
            $scope.select = search.trim();//.replace("-", " ").trim();
            if (search.length > 0) {
                var pNo = $scope.PageNumber;
                if ($scope.IsSearchDropdown) {
                    pNo = 1;

                }
                cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, pNo, $scope.DataPerPage, sortOrderFavCepFirst, $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
                    if ($scope.IsSearchDropdown) {                      
                        updateButtons(1);
                    }
                    if (passToApi != response.srchFor) {
                        return;
                }

                    if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                        $('#growls').css('display', 'none');
                        if (Object.prototype.toString.call(response.LOOKCEP_OUT_OBJ.CEP_ARR) != '[object Array]') {
                            var data = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            response.LOOKCEP_OUT_OBJ.CEP_ARR = [];
                            if (data != null)
                                response.LOOKCEP_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                    }
                        var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;
                        if (leg > 0) {
                            $scope.cepSearList = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            $scope.cepSearList = $scope.cepSearList.filter(function (item) {
                                return item.CLIENO !== '000000';
                            });
                            var ttlAvail = parseInt(response.LOOKCEP_OUT_OBJ.TOTAVAIL);
                            if (ttlAvail > 0) {
                                $scope.TotalPages = Math.ceil(ttlAvail / $scope.DataPerPage);                               
                                if (ttlAvail > 1 && $scope.IsSearchDropdown) {
                                    $timeout(function () {
                                        angular.element('#firstPage').trigger('click');
                                    });
                            }
                            }
                            else {
                                showBtmMsgDiv({
                                        title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg
                                });
                                $scope.TotalPages = 0;
                        }
                            try {
                                $scope.uiSlectItem.activeIndex = 0;
                                $timeout(function () { angular.element('.ui-select-choices-group')[0].scrollTop = 0; });
                        } catch (ex) {
                        }
                        }
                        else {
                            $scope.TotalPages = 0;
                            showBtmMsgDiv({ title: $scope.frmParm.msgTitle, msg: $scope.frmParm.noMatchFoundMsg });
                    }
                }
                    if ($scope.IsSearchDropdown) {
                        updateButtons(2, $scope.TotalPages);
                    }
                });
                //});
                $scope.oldSearch = search;               
            }
            else {
                if (!$rootScope.$stateParams.IsSearch) {
                    $scope.cepSearList = [];
            }
        }
    }
    }

        /*Hide validation message on focus*/
    $scope.oldCepDetail = { cep: '', isCepSel: false, isEdited: false
    };
    $scope.onFocusCep = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.onFocusCep");
        $scope.oldCepDetail.isEdited = false;
        $scope.frmParm.isCepFocus = true;
        $scope.oldCepDetail.cep = $scope.cepEnterText;
        $scope.isTabKeyPress = false;
        $scope.isCEPFocusDownImg = true;
    }


    $scope.cepdelete = function ($event) {
        //$rootScope.errorLogMethod("NewEntryCtrl.$scope.cepdelete");
        if ($scope.cepEnterText != null && $scope.cepEnterText.length == 0) {
            $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
            $scope.selectCEPFev = $scope.selectCEPNonFev = false;
        }
        else {
            $scope.isClear = false;
    }
        if ($scope.oldCepDetail.cep != $scope.cepEnterText) {
            $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
            $scope.oldCepDetail.isEdited = true;
            $scope.frmParm.IsCepSelected = false;
            $scope.frmParm.isActivitySel = false;

            $scope.IsActivity = true;
            $scope.activity.selected = null;
            if ($scope.cepObj.selected != null && $scope.cepObj.selected != undefined)
                $scope.cepObj.isValidCep = false;
    }
    }
    $scope.clearCep = function () {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.clearCep");
        $scope.IsActivity = true;
        $scope.isClear = true;
        $scope.cepEnterText = '';
        $scope.cepEnter = '';
        $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
        $scope.frmParm.IsCepSelected = false;
        clear();
    }
    $scope.callDeleteAPI = function (deleteEntry, isGoToHome, isShowErr) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.callDeleteAPI");
        if (deleteEntry != null && deleteEntry.trim().length > 0) {
            gridDataService.deleteTimeEntries($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, deleteEntry).then(function (response) {
                if (parseInt(response.DELTIM_OUT_OBJ.RETCD) == 0) {
                    //if (isGoToHome)
                    //    broadcastService.notifyDateTimeSlider($scope.currentDate);
                        //broadcastService.notifyRefreshCalendar();                        
                        broadcastService.notifyUiGrid($scope.currentDate)
                }
                else {
                    if (isShowErr)
                        // $scope.loadErrorPopup(true, response.DELTIM_OUT_OBJ.ERRMSG);                     
                        showValidationMsg([response.DELTIM_OUT_OBJ.ERRMSG], false);
            }

            })
    }
    }
    $scope.$on("updateCEPOnSelFrmCEPFav", function (event, result) {
        //$scope.isSrchChkd = false;
        angular.element('#newEnteryWindow').focus();
        $scope.isCepFavWindowLoading = false;
        //on selecting cep from fav window
        if (result.args.cepObj !== null) {
            $scope.isSrchChkd = false;
            var fucusedItemName = angular.element(window.document.activeElement).attr('id');
            $scope.cepEnter = result.args.cepObj.cepCodeWithMask;
            $scope.cepEnterText = result.args.cepObj.cepCodeWithOutMask;
            $scope.onCepCodeBlur(true);
        }
            //cancel event of cep fav window   
        else {
            //decide call blur event of cep or not
            if (!$scope.isSrchChkd && result.args.isOpenFrmCep) {
                if ($scope.oldCepDetail.isEdited) {
                    $scope.onCepCodeBlur();
            }
        }

    }
    });
    var focusToNewEntryWindow = function () {
        angular.element('#newEnteryWindow').focus();
    }
    $scope.isCepFavWindowLoading = false;
    $scope.openCepFavWindow = function (isSearch) {
        $rootScope.errorLogMethod("NewEntryCtrl.$scope.openCepFavWindow");
        if ($scope.isSubmit) return false;
        var isClickFrmCep = false;
        var id = angular.element(window.document.activeElement).attr('id');
        if (id === "cepTextBox") {
            isClickFrmCep = true;
    }
        angular.element('#newEnteryWindow').focus();
        $scope.isCepFavWindowLoading = true;
        var cepSrchStr = "";
        // var cepSrchStr = isSearch ? angular.element(document.getElementById('ui-select-txt-box'))[0].value: $scope.cepEnterText
        if (isSearch) {
            cepSrchStr = angular.element(document.getElementById('ui-select-txt-box'))[0].value;
        }
        else if (!$scope.frmParm.IsCepSelected) {
            cepSrchStr = $scope.cepEnterText;
    }
        var sendData = {
                sessionKey: $scope.loginDetail.SESKEY,
                empId: $scope.loginDetail.EMPLID,
                cepCode: cepSrchStr === null ? "" : cepSrchStr,
                reordPerPage: 50,
                popUpName: "CEPFavPopUp",
                isSearchMode: isSearch,
                companyId: $scope.initialDetail.COMP_REC.COMPID,
                domainURL: $scope.domainURL,
                isOpenFrmCep: isClickFrmCep
    }
        openPopUpService.openModalPopUp('Desktop/NewEntry/templates/CEPCodeFavorites.html', 'CEPCodeFavDesktopCtrl', sendData);

    }
    var validateHrsBeforeLdingDes = function (id) {
        $rootScope.errorLogMethod("NewEntryCtrl.validateHrsBeforeLdingDes");
        var val = angular.element(document.getElementById(id)).val();
        if ((val != null) && (val != '')) {
            Number(val);
            var tintVal = $scope.initialDetail.COMP_REC.TINT;
            var valAftrRounding = findNearestMultiple(val, tintVal);
            if (valAftrRounding < - 200 || valAftrRounding > 200) {
                return false;
            }
            else if ((valAftrRounding > 24) && (valAftrRounding < 200))
                return false;
            else if ($scope.isDailyMode) {
                if (valAftrRounding != parseFloat(val).toFixed(2))
                    return false;
        }
    }
        return true;
    }

    var findNearestMultiple = function (hrsVal, tintVal) {
        $rootScope.errorLogMethod("NewEntryCtrl.findNearestMultiple");
        var result = 0;
        if (tintVal == '0') {
            result = parseFloat(hrsVal).toFixed(2);
            return result;
    }
        if (hrsVal > 0) {
            return (Math.ceil(hrsVal / tintVal) * tintVal).toFixed(2);
        }
        else if (hrsVal < 0) {
            return (Math.floor(hrsVal / tintVal) * tintVal).toFixed(2);
        }
        else return parseFloat(hrsVal).toFixed(2);;
    }


        // handle local storage in case of CEP fav

}])