angular.module('MyTimeApp')
.controller('DescriptionDesktopCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'cepService', '$state', 'arguments', '$window', 'descFavService', 'openPopUpWindowFactory', 'addRemoveFavMsgs', 'broadcastService', 'uiGridConstants', '$timeout', 'resizeWindowService', function ($rootScope, $filter, $scope, $modalInstance, cepService, $state, selectedData, $window, descFavService, sharedService, addRemoveFavMsgs, broadcastService, uiGridConstants, $timeout, resizeWindowService) {
    $scope.dltTitle = $filter('translate')('btn_Delete');
    $scope.popUpName = 'Description';
    $scope.hideValidation = true;
    $scope.hideLngValidMsg = true;
    $scope.maxCharLen = 600;
    $scope.valdMsg = '';
    $scope.LngvaldMsg = '';
    $scope.domainURL = "";
    $scope.loginDetail = null;
    $scope.initialDetail = null;
    $scope.description = [];
    $scope.txtDescription='';
    $scope.descriptionList = [];
    $scope.defDesc = '';
    $scope.selectedData = selectedData;
    $scope.favDesc = false;
    $scope.searchText = '';
    $scope.isMinimize = true;

    $scope.maxMode = null;
    $scope.minMode = null;
    var settings = resizeWindowService.getMaxMinSettings(5, 23, 28,800,293);    
    //$scope.maxMode = {
    //    isRendered: true,
    //    width: window.innerWidth,
    //    height: window.innerHeight-5, left: 0, top: 0, margin: 0, topHeader:23
    //};
    $scope.maxMode = settings[1];
    $scope.maxMode.innerHeight = $scope.maxMode.height - $scope.maxMode.topHeader;
    $scope.maxMode.innerHeight2 = $scope.maxMode.innerHeight;
   // $scope.maxMode.section1Hgt = 25;
    $scope.maxMode.gridHeight = $scope.maxMode.innerHeight2 - $scope.maxMode.section1Hgt-12;
    $scope.maxMode.gridWidth = $scope.maxMode.width - 10;
    $scope.maxMode.gridViewPortHeight = $scope.maxMode.gridHeight - 24;
    //$scope.minMode = {
    //    isRendered: true,        
    //    width: 800,topHeader:23,
    //    height: 293, overflow: 'hidden', left: '50%', top: '50%', margin: '-146px 0px 0px -400px'
    //};
    $scope.minMode = settings[0];
    $scope.minMode.gridWidth = $scope.minMode.width-10;
    $scope.minMode.innerHeight = $scope.minMode.height - $scope.minMode.topHeader;
    $scope.minMode.innerHeight2 = $scope.minMode.innerHeight-5;    
    $scope.minMode.gridHeight = $scope.minMode.innerHeight2 - $scope.minMode.section1Hgt - 12;
    $scope.minMode.gridViewPortHeight = $scope.minMode.gridHeight - 24;
    
    $scope.windowConfig = $scope.minMode;
    localStorage.gridDescViewportHeight = $scope.windowConfig.gridViewPortHeight;
    $scope.resizeWindow = function (mode) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.resizeWindow");
        $scope.windowLayout = {};
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
            $("#descPopUp").draggable("enable");
            $scope.windowConfig = $scope.minMode;
        }
        else {
            $scope.windowConfig = $scope.maxMode;
            $("#descPopUp").draggable({ disabled: true });
        }
        $scope.windowConfig.isRendered = false;
        localStorage.gridDescViewportHeight = $scope.windowConfig.gridViewPortHeight;
        $scope.windowConfig.isRefreshGrid = true;
        $timeout(function () {
            $scope.windowConfig.isRendered = true;
            //localStorage.gridDescViewportWidth = $scope.windowConfig.gridViewPortHeight;
        },0);
    }

    $scope.checkLength = function () {
        //$rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.checkLength");
        if ($scope.txtDescription !== undefined) {
            var decodedStr = descFavService.getUTF8ByteLength($scope.txtDescription, $scope.maxCharLen);
            $scope.txtDescription = decodedStr.trim();
        }
        else {
             $scope.txtDescription = "";
       }
    }    
    $scope.ok = function (selectedItem) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.ok");
            var item = JSON.parse(selectedItem);
            var selectedItem = {
                    data: item.data,
                    fav: item.fav
    }
            $modalInstance.close(selectedItem);
            if (selectedData.isBroadcast) {
                $rootScope.popupload = true;
                broadcastService.notifyRefreshGrid(selectedItem);
    }
    };
    $timeout(function () {
        $("#descPopUp").draggable();
        $("#descPopUp, #innerDescCont").draggable({
                start: function (event, ui) {

                if (event.target.id == "innerDescCont")
                    return false;
        }
        });

    }
    ,0);
    $scope.cancel = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
        if (selectedData.isBroadcast) {
            $rootScope.popupload = true;
            broadcastService.notifyRefreshGrid(null);
    }
    };
    $scope.clearSearch = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.clearSearch");
        $scope.searchText = "";
        $scope.filterData();
    }
    $scope.filterData = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.filterData");
        setFavDataFromLclStrage($scope.searchText);
        $scope.gridOptions.data = $scope.descriptionList;
    }
    $scope.gridOptions = {
            showHeader: true,
            enableVerticalScrollbar: uiGridConstants.ALWAYS,
            enableHorizontalScrollbar: 0,
            showGridFooter: true,
            headerHeight:20,
            rowHeight:19,
            showColumnFooter: false,
            enableGridMenu: true,
            enableColumnMenus:false,
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
               { enableColumnMoving: false, cellClass: 'gridDescWindow', enableSorting: false, name: 'Delete', displayName: '', width: '1.5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div   value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{ ::grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.removeFromFavDescription(row.entity,false)" type="image" id="myimage" /></div>' },

                {
                        enableColumnMoving: false, cellClass: 'gridDescWindow', name: 'data', field: 'data', sort: { direction: 'asc' }, suppressRemoveSort: true, enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Description', width: '95%', enableCellEdit: false, cellTemplate: '<span  ng-attr-title="{{COL_FIELD}}"  style="line-height:20px;display:block;">{{COL_FIELD}}</span>'
            }

    ],
            canSelectRows: false,
            rowTemplate: "<div  ng-dblclick=\"grid.appScope.onGridRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

        //appScopeProvider: $scope.myAppScopeProvider,

    };
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.gridOptions.onRegisterApi");
        $scope.gridApi = gridApi;
        if ($scope.defDesc.length > 0) {
            var obj = getSelectedDescription();
            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
            $scope.gridApi.selection.selectRow(obj);
    }
        gridApi.core.on.rowsRendered($scope, function () {
            if ($scope.windowConfig.isRefreshGrid) {
                $scope.gridApi.saveState.restore($scope, $scope.windowLayout);
                $scope.windowConfig.isRefreshGrid = false;
        }
        });
        gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
        });
    };

    var getSelectedDescription = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.getSelectedDescription");
        return $filter('filter')($scope.gridOptions.data, function (d) { return d.data === $scope.defDesc; })[0];
    }

    $scope.init = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.init");
        addRemoveFavMsgs.duplicateDesc = $filter('translate')('msg_DuplicateDescription');
        $scope.dltAllVar = $filter('translate')('lbl_dltAll');
        $scope.valdMsg = $filter('translate')('msg_DesRequired');
        $scope.srchTxtVar = $filter('translate')('lbl_srchTxt');
        $scope.LngvaldMsg = $filter('translate')('msg_Desbtwn');
        $scope.addDescFavVar = $filter('translate')('lbl_addDescFav2');        
        $scope.domainURL = $rootScope.domainURL;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);

        $scope.defDesc = $scope.selectedData.desc == null ? '' : $scope.selectedData.desc;

        if ($scope.selectedData.desc != null) {
            //$scope.setFav($scope.selectedData.desc);
    }
        $scope.bindGridData();

    }

    var setFavDataFromLclStrage = function (searchTxt) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.setFavDataFromLclStrage");
        $scope.descriptionList = [];
        $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
        if (searchTxt!=null)
            $scope.favDescriptionList = $filter('filter')($scope.favDescriptionList, $scope.searchText, undefined);
        for (var i = 0; i < $scope.favDescriptionList.length; i++) {
            var item = {
                    data: $scope.favDescriptionList[i],
                    fav: true
        };
            $scope.descriptionList.push(item);
    }
    }
    var deleteConfirm = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.deleteConfirm");       
        var sendData = {
                msgList: [$filter('translate')('msg_dltFav')],
                isCancelBtnOn: true,
                okBtnText: $filter('translate')('btn_Yes'),
                noBtnTxt: $filter('translate')('btn_No'),
                popUpName: 'DeleteFavDescPopUp'
    };
        sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
    }
    $scope.$on("deleteAllFavDescConfirm", function (event, respoObj) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.$on.deleteAllFavDescConfirm");
        if (respoObj.args.isConfirm) {
            $scope.removeFromFavDescription(null, true);
    }
    });
    $scope.bindGridData = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.bindGridData");        
        $scope.searchText = '';
        $scope.descriptionList = [];
        setFavDataFromLclStrage(null);
        $scope.gridOptions.data = $scope.descriptionList;
    }

    $scope.onGridRowDblClick = function (row) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.onGridRowDblClick");
        if (!$scope.selectedData.isDesFavoriteRightPanel) {           
            $scope.favDesc = row.entity.fav;
            $scope.sendDescBack(row.entity);
    }
    }

    $scope.sendDescBack = function (desc) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.sendDescBack");
        if ((desc.data != null) && (desc.data.trim() != "")) {
            $scope.ok(JSON.stringify(desc));
    }
    }

    $scope.sendDesc = function (desc) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.sendDesc");
        if ((desc != null) && (desc.trim() != "")) {
            if (desc.length > 200) {
                $scope.hideLngValidMsg = false;
                $scope.hideValidation = true;
                return;
        }

            var data = {
                    data: desc,
                    fav: $scope.favDesc
        }
            $scope.ok(JSON.stringify(data));
        }
        else {
            $scope.hideValidation = false;
            $scope.hideLngValidMsg = true;
    }
    }
    var removeEmoji = function (str) {
        //$rootScope.errorLogMethod("DescriptionDesktopCtrl.removeEmoji");
        var arr = [];
        var char = '';
        var val = str;
        try {
            //☺️☹️✊ ✌️  ✋   ☝️✍️ ‍❤️‍ ‍❤️‍  ‍❤️‍‍ ‍❤️‍‍ ✍         ⛹
            //   ⛵️   ⛴     ⚓️  ⛽️             ⛲️  ⛰      ⛺️  ⛪️    ⛩

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
        catch (err) { return val; }

    }

    $scope.deleteAllFavDesc = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.deleteAllFavDesc");
        if ($scope.descriptionList.length > 0) {
            deleteConfirm();
    }
    }
        // Remove description
    $scope.removeFromFavDescription = function (row, isDeleteAll) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.removeFromFavDescription");
        var val =[];
        if (!isDeleteAll) {
            val[0] = row.data;
        }
        else {
            var sep = ',';
            for (var i = 0; i < $scope.descriptionList.length; i++) {
                val[i]= $scope.descriptionList[i].data ;
        }
    }
        var data = {
            "VARCHAR2": val
    }
        var destxt_arr = JSON.stringify(data);
        cepService.removeDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, destxt_arr).then(function (response) {
            if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                refreshDescFavourites(false, val, isDeleteAll);
        }
        });
    };

    var updateFavDescLocalStorage = function (isAdded, dataAray, allFavDesc) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.updateFavDescLocalStorage");
        if (isAdded) {
            allFavDesc.push(dataAray[0]);
            sessionStorage.setItem('DescFav', JSON.stringify(allFavDesc));
        }
        else {
            for (var i = 0; i < dataAray.length; i++) {
                allFavDesc = allFavDesc.filter(function (desc) {
                    return desc !== dataAray[i]
                });
        }
            sessionStorage.setItem('DescFav', JSON.stringify(allFavDesc));
    }
        return allFavDesc;
    }
    var refreshDescFavourites = function (isAdded,dataAray, isDeleteAll) {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.refreshDescFavourites");
        if (isAdded) {
            $scope.favDescriptionList = descFavService.updateFavDescLocalStorage(isAdded, dataAray, false, 2);
            $scope.bindGridData();
            // $scope.favDescriptionList.push(dataAray);
        }
        else {
            $scope.favDescriptionList = descFavService.updateFavDescLocalStorage(isAdded, dataAray, isDeleteAll,2);
            if (isDeleteAll)
                $scope.descriptionList = [];
            else {
                $scope.descriptionList = $scope.descriptionList.filter(function (desc) {
                    return desc.data !== dataAray[0]
                });
        }
    }
        $scope.gridOptions.data = $scope.descriptionList;

    }

    $scope.addToFavDescription = function () {
        $rootScope.errorLogMethod("DescriptionDesktopCtrl.$scope.addToFavDescription");
        $('#descText').blur();
        $scope.txtDescription = $scope.txtDescription.replace(/\t/g, " ");
        $scope.txtDescription = $scope.txtDescription.trim();
        $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
        var isExist = descFavService.isDescInFavList($scope.txtDescription, $scope.favDescriptionList);
        if (isExist) {
            var sendData = {
                    errorList: [addRemoveFavMsgs.duplicateDesc]
        };
            sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            $('#descText').focus();
        }
        else if ($scope.txtDescription.length > 0 && !isExist) {
            cepService.addDescriptionFavorite($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify($scope.txtDescription)).then(function (response) {
                if (response.ADDDESCFAV_OUT_OBJ.RETCD == 0) {
                    var savedDesc = response.ADDDESCFAV_OUT_OBJ.DESCOUT;
                    refreshDescFavourites(true, [savedDesc], false);
                    $scope.txtDescription = '';
                    $timeout(function () {
                        var obj = $filter('filter')($scope.gridOptions.data, function (d) { return d.data === savedDesc; })[0];
                        //$scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                        $scope.gridApi.selection.selectRow(obj);
                    });
            }
            });
    }

    };
}])

.controller('ProjectComponentCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'activityService', '$state', '$timeout', 'arguments', 'openPopUpWindowFactory', 'descFavService', 'addRemoveFavMsgs', 'cepService', 'broadcastService', 'uiGridConstants','constantService', function ($rootScope, $filter, $scope, $modalInstance, activityService, $state, $timeout, selectedData, sharedService, descFavService, addRemoveFavMsgs, cepService, broadcastService, uiGridConstants, appConstants) {
    $scope.selectedData = selectedData;
    $scope.expandedNodes = [];
    $scope.isDesRequired = false;
    $scope.isScope = false;
    $scope.timeEntery = selectedData.timeEntery;
    selectedData.isImportCal = selectedData.isImportCal === undefined ? false : selectedData.isImportCal;
    var seprator = " > ";
    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        multiSelect: false,
        allowDeselect: false,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    }
    $scope.selectedItem = {};
    $scope.components = null;
    $scope.maxCharLen = 200;
    $scope.comTaskDblClick = function (event, node) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.comTaskDblClick");
        console.log('dblclick1');
        //$scope.select();
    }
    $scope.showSelected = function (node) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.showSelected");
        if (node.isDataNode) {
            if (selectedData.isImportCal == false) {
                if (node.DEFDES === null || node.DEFDES.trim() == "") {                    
                    if (node.parent.DEFDES !== null && node.parent.DEFDES.trim() !== "") {
                        $scope.defaultDesc = node.parent.DEFDES.trim();
                        $scope.defaultDesc = $scope.defaultDesc.replace(/\n/g, " ");
                        $scope.isFavDescription($scope.defaultDesc);                       
                    }
                }
                else {
                    $scope.defaultDesc = node.DEFDES.trim();
                    $scope.defaultDesc = $scope.defaultDesc.replace(/\n/g, " ");
                    $scope.isFavDescription($scope.defaultDesc);
                }
            }

            if ($scope.isScope && node.DEFSCOPID != null && node.DEFSCOPID.trim() != "") {
                var gridData = $scope.gridOptions.data;
                for (var i = 0; i < gridData.length; i++) {
                    if (gridData[i].SCOPID == node.DEFSCOPID) {
                        $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[i]);
                        break;
                    }
                }
            }
            document.getElementById('txtDesc').focus();
        }
        $scope.selectedItem = node;
        if ($rootScope.isCompTaskDblClick) {
            $scope.select();
        }       
        if (!$scope.isScope) {
            setRedLineForDescription($scope.selectedItem.isDesReq);
        }
    }
    $scope.rowSelect = function ($event) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.rowSelect");
        $('#txtDesc').focus();
        var scopeSelected = $scope.gridApi.selection.getSelectedRows();
        if (scopeSelected.length > 0) {
            setRedLineForDescription(scopeSelected[0].DESREQ);
        }

    }
    var setRedLineForDescription = function (isScopeReq) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.setRedLineForDescription");
        if (isScopeReq == 'Y' && $scope.defaultDesc.trim() == '') {
            $scope.isDesRequired = true;
        }
        else {
        $scope.isDesRequired = false;
    }
    }
    $scope.scopeDblClick = function (row) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.scopeDblClick");
        row.isSelected = true;
        $scope.select();
    }
    $scope.loadDescription = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.loadDescription");
        var sendData = {
                IsActivity: false,
                desc: '',
                popUpName: 'DescriptionPopUp'
    }
        sharedService.openModalPopUp('Desktop/NewEntry/templates/Description.html', 'DescriptionDesktopCtrl', sendData);
    }



    $timeout(function () {
        $("#mainDiv, #innerMainDiv").draggable({
                start: function (event, ui) {
                    if (event.target.id == "innerMainDiv")
                        return false;
                    else
                    $("#mainDiv").css('cursor', 'move');
        },
                stop: function () {
                    $("#mainDiv").css('cursor', 'default');
        }
        });

    }, 0);
    $scope.$on("updateDescription", function (event, descObj) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.$on.updateDescription");
        if (descObj.args.isCancel) {
            $scope.isFavDescription($scope.defaultDesc.trim());
        }
        else {
        $scope.defaultDesc = descObj.args.dataObj.data;
        $scope.isFavDescription($scope.defaultDesc.trim());
    }
    });
    $scope.cancel = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
        if (selectedData.isBroadcast) {
            broadcastService.notifyGridFocus("ProjectComponent");
    }
    };

    $scope.init = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.init");
        $scope.components = selectedData.components;
        $scope.domainURL = $rootScope.domainURL;
        $scope.setDataForTree();
        $scope.defaultDesc = selectedData.defaultDesc;
        $scope.isFavDescription($scope.defaultDesc);
        $scope.titleDescription = $filter('translate')('title_Description');
    }

    var getActiveInactiveComponents = function (com_arr) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.getActiveInactiveComponents");
        var activeList = [], inactiveList = [];
        var activeInactiveObj = {
                active: [], inActive: []
    };
        for (var j = 0; j < com_arr.length; j++) {
            // activeList.push(data);
            if (com_arr[j].ACTIVE == 'Y') {
                activeList.push(com_arr[j]);
            }
            else {
                inactiveList.push(com_arr[j]);
        }
    }
        activeInactiveObj.active = activeList;
        activeInactiveObj.inActive = inactiveList;
        return activeInactiveObj;
    }

    var updateTaskArrForSelCom = function (component, timeEntry) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.updateTaskArrForSelCom");
        var activeList = [];
        var inActiveList = [];
        var taskArr = [];
        if (Object.prototype.toString.call(component.ARR_PTSK) != '[object Array]') {
            var data = component.ARR_PTSK;
            component.ARR_PTSK = [];
            component.ARR_PTSK.push(data.PTSK_OBJ);
    }
        taskArr = component.ARR_PTSK;
        for (var i = 0; i < taskArr.length; i++) {
            if (taskArr[i].ACTIVE == 'Y') {
                activeList.push(taskArr[i]);
            }
            else {
            if (taskArr[i].TSKID == timeEntry.TSKID) {
                    taskArr[i].isValidTask = true;
                    inActiveList.push(taskArr[i]);
            }
        }
    }
        taskArr = activeList;
        if (inActiveList.length > 0) {
            taskArr.push(inActiveList[0]);
    }
        return taskArr;
    }

    var checkForInActiveComponent = function (inActiveList, timeEntery) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.checkForInActiveComponent");
        var inActiveComponent = null;
        for (var i = 0; i < inActiveList.length; i++) {
            if (inActiveList[i].CMPTID == timeEntery.CMPTID) {
                inActiveComponent = inActiveList[i];
                break;
        }
    }
        return inActiveComponent;
    }

    var setIndexOfSelComponent = function (comArr, timeEntery) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.setIndexOfSelComponent");
        for (var i = 0; i < comArr.length; i++) {
            if (comArr[i].CMPTID == timeEntery.CMPTID) {
                $rootScope.componentIndex = i;
                break;
        }
    }
    }
    var setIndexOfSelTask = function (taskArray, timeEntery) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.setIndexOfSelTask");
        $rootScope.taskIndex = 0;
        for (var j = 0; j < taskArray.length; j++) {
            if (timeEntery.TSKID == taskArray[j].TSKID) {
                $rootScope.taskIndex = j;
                break;
        }
    }
    }
    $scope.setDataForTree = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.setDataForTree");
        $scope.dataForTheTree = [{
            "name": "Components", "children": []
        }];
        var components = $scope.components.PCAT_OBJ.ARR_PCOM;
        var activeInactiveObj = getActiveInactiveComponents(components);
        components = activeInactiveObj.active;

        //edit mode consider show also inactive component/task if already saved earlier
        if ($scope.timeEntery != null) {
            var cmpObj = checkForInActiveComponent(activeInactiveObj.inActive, $scope.timeEntery);
            if (cmpObj != null) {
                components.push(cmpObj);
        }
            setIndexOfSelComponent(components, $scope.timeEntery);
            if ($rootScope.componentIndex !== undefined && $rootScope.componentIndex !=="" && $rootScope.componentIndex !==null) {
                var taskArr = updateTaskArrForSelCom(components[$rootScope.componentIndex], $scope.timeEntery);
                if (taskArr.length > 0) {
                    components[$rootScope.componentIndex].ARR_PTSK = taskArr;
                }

                setIndexOfSelTask(components[$rootScope.componentIndex].ARR_PTSK, $scope.timeEntery);
            }
    }
        $scope.isScope = ($filter('uppercase')($scope.components.PCAT_OBJ.SCOREQ) == "Y") ? true : false;
        
        for (var i = 0; i < components.length; i++) {
            var obj = {
                "name": components[i].DES, "children": [], "isDesReq": components[i].DESREQ, "DEFDES": (components[i].DEFDES === undefined ? null : components[i].DEFDES)
        };

            if (components[i].ARR_PTSK === null)
                components[i].ARR_PTSK = [];
            if (Object.prototype.toString.call(components[i].ARR_PTSK) != '[object Array]') {
                var data = components[i].ARR_PTSK;
                components[i].ARR_PTSK = [];
                components[i].ARR_PTSK.push(data.PTSK_OBJ);
        }
            for (var j = 0; j < components[i].ARR_PTSK.length; j++) {
                if (components[i].ARR_PTSK[j].ACTIVE == 'Y' || components[i].ARR_PTSK[j].isValidTask) {
                    var isDesReq = (components[i].ARR_PTSK[j].DESREQ != undefined ? (components[i].ARR_PTSK[j].DESREQ) : (components[i].DESREQ));
                    var obj2 = {
                        "isDataNode": true,
                        "DEFDES": components[i].ARR_PTSK[j].DEFDES,
                        "DEFSCOPID": components[i].ARR_PTSK[j].DEFSCOPID,
                        "ACTICD": components[i].ACTICD,
                        "CMPTCD": components[i].CMPTCD,
                        "CMPTID": components[i].CMPTID,
                        "name": components[i].ARR_PTSK[j].DES,
                        "TSKID": components[i].ARR_PTSK[j].TSKID,
                        "DESC": components[i].DES + seprator + components[i].ARR_PTSK[j].DES,
                        "children": [],
                        "parent": obj,
                        "pIndex": i,
                        "index": j,
                        "isDesReq": isDesReq
                };
                    obj.children.push(obj2);
            }
        }
            $scope.dataForTheTree[0].children.push(obj);
    }
        $scope.expandedNodes = [$scope.dataForTheTree[0]]
        if (selectedData.isSelected && $scope.timeEntery != null) {
            $scope.expandedNodes.push($scope.dataForTheTree[0].children[$rootScope.componentIndex]);
            $scope.selectedNode = $scope.dataForTheTree[0].children[$rootScope.componentIndex].children[$rootScope.taskIndex];
            $scope.selectedItem = $scope.selectedNode;
    }

        if ($scope.isScope) {
            $scope.gridOptions1 = {
                    showHeader: true,
                    rowHeight:19,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                    showGridFooter: false,
                    showColumnFooter: false,
                    enableGridMenu: false,
                    enableCellSelection: false,
                    enableCellEditOnFocus: false,
                    enableFiltering: false,
                    enableRowSelection: true,
                    treeRowHeaderAlwaysVisible: false,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    modifierKeysToMultiSelect: false,
                    columnDefs: [
                {
                    name: "DES", field: 'DES', suppressRemoveSort: true,sort: { direction: uiGridConstants.ASC},
                        enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Description', width: '95%', enableCellEdit: false
                    , cellTemplate: '<span title="{{COL_FIELD}}">{{COL_FIELD}}</span>'
                    }
            ],

                    onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    if (selectedData.isSelected) {
                        $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.selectedIndex]);
                    }
                    gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                        $scope.columnChanged = {
                                name: changedColumn.colDef.name, visible: changedColumn.colDef.visible
                    };
                    });

            },
                    rowTemplate: "<div ng-dblClick=\"grid.appScope.scopeDblClick(row)\" ng-click=\"grid.appScope.rowSelect($event)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

        };
            $scope.gridOptions = angular.copy($scope.gridOptions1);
            bindScope($scope.components.PCAT_OBJ.ARR_PSCOP, selectedData.isEditMode)
    }
    }

    $scope.selectedIndex = -1;
    var bindScope = function (arrScope, isEditMode) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.bindScope");
        var scopeList = {
                PSCOP_OBJ: []
    }
        if (Object.prototype.toString.call(arrScope) != '[object Array]') {
            var data = arrScope;
            arrScope = [];
            arrScope.push(data.PSCOP_OBJ);
    }
        var activeList = [];
        var inactiveList = [];
        //get only active scopes
        arrScope = $filter('orderBy')(arrScope, ['DES']);
        for (var i = 0; i < arrScope.length; i++) {
            var data = {
                    SCOPID: arrScope[i].SCOPID,
                    SCOPCD: arrScope[i].SCOPCD,
                    DES: arrScope[i].DES,
                    ACTIVE: arrScope[i].ACTIVE,
                    DESREQ: arrScope[i].DESREQ
        };
            if (arrScope[i].ACTIVE == 'Y') {
                activeList.push(data);
        }
            if ($scope.timeEntery!=null && selectedData.isSelected && $scope.timeEntery.SCOPID == data.SCOPID) {
                if (arrScope[i].ACTIVE !== 'Y') {
                    activeList.push(data);
            }
            $scope.selectedIndex = activeList.length - 1;;
        }

    }
    $scope.gridOptions.data = activeList;
    }

    $scope.select = function () {
    $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.select");
    var isScopeSelected = true;
    var isDesciptionEntered = true;
    var scopeSelected = null;
    var isCheckForDesc =true;
    if ($scope.isScope) {
        scopeSelected = $scope.gridApi.selection.getSelectedRows();
        var selectedRows = scopeSelected.length;
        if (selectedRows <= 0)
            isScopeSelected = false;
        else {
            if (scopeSelected[0].DESREQ == 'Y' && $scope.defaultDesc.trim() == '') {
                    showValidationMsg($scope.selectedItem.isDataNode, isScopeSelected, $scope.isScope, false);
                return;
            }
            else if (scopeSelected[0].DESREQ == 'N') {
                    isCheckForDesc = false;
        }
    }

}
    //$scope.selectedItem.isDesReq = 'Y';
    if (isCheckForDesc == true && $scope.selectedItem.isDesReq != undefined && ($filter('uppercase')($scope.selectedItem.isDesReq) == "Y")) {
        if ($scope.defaultDesc.trim() == '')
            isDesciptionEntered = false;
}

        if ($scope.selectedItem.isDataNode && isScopeSelected && isDesciptionEntered) {
            if ($scope.defaultDesc.length > $scope.maxCharLen) {
                showValidationMsg($scope.selectedItem.isDataNode, isScopeSelected, $scope.isScope, true);
                return;
        }
            $rootScope.componentIndex = $scope.selectedItem.pIndex;
            $rootScope.taskIndex = $scope.selectedItem.index;
            $rootScope.scopeSelected = ($scope.isScope) ? scopeSelected[0] : null;
            var selectedComTaskObj = {
        };
            selectedComTaskObj.component = {
                    selected: {}
        }
            selectedComTaskObj.task = {
                    selected: {}
        }
            selectedComTaskObj.componentTaskText = $scope.selectedItem.DESC;
            if ($scope.isScope) {
                selectedComTaskObj.componentTaskText = selectedComTaskObj.componentTaskText + seprator + scopeSelected[0].DES;
        }
            selectedComTaskObj.component.selected = {
                "ACTIVE": "Y", "ACTICD": $scope.selectedItem.ACTICD, "CMPTID": $scope.selectedItem.CMPTID
        };
            selectedComTaskObj.task.selected = {
                "ACTIVE": "Y", "TSKID": $scope.selectedItem.TSKID
        };
            selectedComTaskObj.descriptionText = $scope.defaultDesc;
            selectedComTaskObj.scopeObj = ($scope.isScope) ? scopeSelected[0] : null;
            //$rootScope.selectedComTaskObj = selectedComTaskObj;
            //alert('selectedComTaskObj---' + JSON.stringify(selectedComTaskObj));            
            //$rootScope.isProjectTask = true;
            if (selectedData.isBroadcast) {
                $rootScope.popupload = true;
                broadcastService.notifyRefreshGrid(selectedComTaskObj);
        }
            $modalInstance.close(selectedComTaskObj);
        }
        else {
            showValidationMsg($scope.selectedItem.isDataNode, isScopeSelected, $scope.isScope, isDesciptionEntered);
}
    }

    var showValidationMsg = function (isComponentSelected, isScopeSelected, isScope, isDesciptionEntered) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.showValidationMsg");
        var hyphenStr = "- ";
        var errrList = [];
        if (isScope) {
            if (!isComponentSelected)
                errrList.push(hyphenStr+$filter('translate')('msg_missingReqCT') );
            if (!isScopeSelected)
                errrList.push(hyphenStr + $filter('translate')('msg_missingReqScope'));
            if (!isDesciptionEntered)
                errrList.push(hyphenStr + $filter('translate')('msg_DesRequired') );
        }
        else {
            if (!isComponentSelected)
                errrList.push(hyphenStr + $filter('translate')('msg_missingReqCT') );
            if (!isDesciptionEntered)
                errrList.push(hyphenStr + $filter('translate')('msg_DesRequired') );
    }
        if ($scope.defaultDesc.length > $scope.maxCharLen) {
            errrList.push(hyphenStr + $filter('translate')('msg_Desbtwn'));
    }
        if (errrList.length === 1) {
            errrList[0] = errrList[0].substring(1);
    }
        var sendData = {
                errorList: errrList
    };
        $scope.openModalCtrl = 'showValidationMsg';
        sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
    };
    var showMessage = function (msgList, template, controller) {
        $rootScope.errorLogMethod("ProjectComponentCtrl.showMessage");
        if (!template) {
            template = 'Desktop/NewEntry/templates/AlertBoxSave.html'
    }
        if (!controller) {
            controller = 'ErrorDesktopPopupCtrl'
    }
        var sendData = {
                errorList: msgList
    };
        sharedService.openModalPopUp(template, controller, sendData);
    }
        /*add-remove favourites*/
        $scope.isFavDesc = false;
        $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
        $scope.isFavDescription = function (val) {
            //$rootScope.errorLogMethod("ProjectComponentCtrl.$scope.isFavDescription");
            $scope.defaultDesc = $scope.defaultDesc.replace(/\t/g, " ");
            val = val.replace(/\t/g, " ");
            $scope.favDescriptionList = JSON.parse(sessionStorage.getItem('DescFav'));
            $scope.isFavDesc = false;
            if (val.length > 0) {
                var isExist = descFavService.isDescInFavList(val, $scope.favDescriptionList);
                if (isExist) {
                    $scope.isFavDesc = true;
            }
        }
    }

    var refreshDescFavourites = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.refreshDescFavourites");
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
                broadcastService.updateDataSource(appConstants.BroadCastUpdate.updateFavDesc);
            $scope.favDescriptionList = descFav;
        });

    }
        // Add description
    $scope.addToFavDescription = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.addToFavDescription");
            $scope.defaultDesc = $scope.defaultDesc.trim();
            var isExist = descFavService.isDescInFavList($scope.defaultDesc, $scope.favDescriptionList);
            if (isExist) {
                showMessage([addRemoveFavMsgs.duplicateDesc])
            }
            else if ($scope.defaultDesc.length > 0) {
            $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
            cepService.addDescriptionFavorite($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify($scope.defaultDesc)).then(function (response) {
                if (response.ADDDESCFAV_OUT_OBJ.RETCD == 0) {
                    $scope.defaultDesc = response.ADDDESCFAV_OUT_OBJ.DESCOUT;
                    refreshDescFavourites();
                    $scope.isFavDesc = true;
            }
            });
        }
    };

    $scope.removeFromFavDescription = function () {
        $rootScope.errorLogMethod("ProjectComponentCtrl.$scope.removeFromFavDescription");
        if ($scope.defaultDesc.length > 0) {
            $scope.defaultDesc = $scope.defaultDesc.trim();
            var data = {
                "VARCHAR2": [$scope.defaultDesc]
        };
            var destxt_arr = JSON.stringify(data);
            var isExist = descFavService.isDescInFavList($scope.defaultDesc, $scope.favDescriptionList);
            if (isExist) {
                $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
                cepService.removeDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, destxt_arr).then(function (response) {
                    if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                        refreshDescFavourites();
                        $scope.isFavDesc = false;
                }
                });
        }
    }
    };
}])
.controller('ICItemCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'loadICRates', '$state', '$timeout', 'arguments', 'activityFavService', 'broadcastService', '$document', 'uiGridConstants', 'resizeWindowService', function ($rootScope, $filter, $scope, $modalInstance, loadICRates, $state, $timeout, selectedData, activityFavService, broadcastService, $document, uiGridConstants, resizeWindowService) {
    $scope.allICItems = [];
    $scope.filteredICItems = [];
    $scope.popUpName = 'ICItem';
    $scope.isFilterByCode = true;
    $scope.isFilterByDesc = true;
    $scope.isFilterByCharge = true;
    $scope.arguments = selectedData;
    $scope.showSrchSelection = false;
    $scope.searchText = '';
    $scope.isSet = false;
    $scope.isMinimize = true;
    $scope.maxMode = null;
    $scope.minMode = null;
    var settings = resizeWindowService.getMaxMinSettings(10, 23, 23, 800, 300);
    $scope.maxMode = settings[1];
    $scope.maxMode.isRenderGrid = false;
    $scope.maxMode.innerHeight1 = $scope.maxMode.height - $scope.maxMode.topHeader;
    $scope.maxMode.innerHeight = $scope.maxMode.height - $scope.maxMode.topHeader ;
    $scope.maxMode.gridHeight = $scope.maxMode.innerHeight - $scope.maxMode.section1Hgt - 10;
    $scope.maxMode.gridWidth = $scope.maxMode.width - 10;
    $scope.maxMode.gridViewPortHeight = $scope.maxMode.gridHeight - 24;

    $scope.minMode = settings[0];
    $scope.minMode.isRenderGrid = false;
    $scope.minMode.innerHeight1 = $scope.minMode.height - $scope.minMode.topHeader;
    $scope.minMode.innerHeight = $scope.minMode.height - $scope.minMode.topHeader - 5;
    $scope.minMode.gridHeight = $scope.minMode.innerHeight - $scope.minMode.section1Hgt - 10;
    $scope.minMode.gridWidth = $scope.minMode.width - 10;
    $scope.minMode.gridViewPortHeight = $scope.minMode.gridHeight - 24;
    
    $scope.windowConfig = angular.copy($scope.minMode);
    localStorage.gridIcViewportHeight = $scope.windowConfig.gridViewPortHeight;
    $scope.resizeWindow = function (mode) {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.resizeWindow");
        $scope.windowLayout = {};
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
            $timeout(function () { $("#icPopUp").draggable("enable"); }, 100);
            $scope.minMode.isRenderGrid = false;
            $scope.windowConfig = $scope.minMode;
        }
        else {
            $scope.maxMode.isRenderGrid = false;
            $scope.windowConfig = $scope.maxMode;
            $("#icPopUp").draggable({ disabled: true });
        }
        $scope.windowConfig.isRefreshGrid = true;
        localStorage.gridIcViewportHeight = $scope.windowConfig.gridViewPortHeight;
        $timeout(function () {
            $scope.windowConfig.isRenderGrid = true;
        }, 100)
    }
    $scope.toggleSrchSelection = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.toggleSrchSelection");
        $scope.showSrchSelection = !$scope.showSrchSelection;
        $scope.isSet = $scope.showSrchSelection;
    }
    $timeout(function () {
        $("#icPopUp, #innerIcCont").draggable({
            start: function (event, ui) {
                if (event.target.id == "innerIcCont")
                    return false;
                else
                    $("#icPopUp").css('cursor', 'move');
            },
            stop: function () { $("#icPopUp").css('cursor', 'default'); }
        });

    }, 0);
    $document.on('click', function (event) {
        if (!$scope.isSet) {
            $scope.$apply(function () {
                $scope.showSrchSelection = false;
            });
        }
        $scope.isSet = false;
    });
    $scope.srchSelChange = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.srchSelChange");
        $scope.isSet = true;
    }

    $scope.cancel = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };

    $scope.clearSearch = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.clearSearch");
        $scope.searchText = "";
        angular.element('.seachAct').focus();
        $scope.updateGridData();
    }
    $scope.updateGridData = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.updateGridData");
        //if user have no ic items
        if ($scope.allICItems.length == 0) {
            return;
    }
        var searchStr=$scope.searchText.toLowerCase();
        if (searchStr == "")
            $scope.filteredICItems = $scope.allICItems;
        else if ($scope.isFilterByCode == false && $scope.isFilterByDesc == false && $scope.isFilterByCharge == false) {
            $scope.filteredICItems = [];
        }
            //filter by all
        else if ($scope.isFilterByCode == true && $scope.isFilterByDesc == true && $scope.isFilterByCharge == true)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {               
                return ((item.ICRTCD.toLowerCase().toString().indexOf(searchStr) > -1) || (item.DES.toLowerCase().indexOf(searchStr) > -1) || (($filter('decimal')(item.CHRG)).indexOf(searchStr) > -1))
        });
            //filter by code only
        else if ($scope.isFilterByCode == true && $scope.isFilterByDesc == $scope.isFilterByCharge)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {
                return ((item.ICRTCD.toLowerCase().toString().indexOf(searchStr) > -1))
            });
            //filter by desc only
        else if ($scope.isFilterByDesc == true && $scope.isFilterByCode == $scope.isFilterByCharge)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {
                return ((item.DES.toLowerCase().toString().indexOf(searchStr) > -1))
            });
            //filter by charge only
        else if ($scope.isFilterByCharge == true && $scope.isFilterByCode == $scope.isFilterByDesc)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {
                return ((($filter('decimal')(item.CHRG)).indexOf(searchStr) > -1))
            });
            //filter by code and desc only
        else if ($scope.isFilterByCharge == false && $scope.isFilterByCode == $scope.isFilterByDesc)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {
                return (item.ICRTCD.toLowerCase().indexOf(searchStr) > -1 || item.DES.toLowerCase().indexOf(searchStr) > -1)
            });
            //filter by charge and desc only
        else if ($scope.isFilterByCode == false && $scope.isFilterByCharge == $scope.isFilterByDesc)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {
                return (($filter('decimal')(item.CHRG)).indexOf(searchStr) > -1 || item.DES.toLowerCase().indexOf(searchStr) > -1)
            });
            //filter by charge and code only
        else if ($scope.isFilterByDesc == false && $scope.isFilterByCharge == $scope.isFilterByCode)
            $scope.filteredICItems = $scope.allICItems.filter(function (item) {
                return (($filter('decimal')(item.CHRG)).indexOf(searchStr) > -1 || item.ICRTCD.toLowerCase().indexOf(searchStr) > -1)
            });
        $scope.gridOptions.data = $scope.filteredICItems;
    }

    $scope.onGridRowDblClick = function (row) {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.onGridRowDblClick");
        if (!$scope.isPageLoaded) { $scope.isPageLoaded = true; return false; }
        var icItem = {};
        icItem = {
                CHRG: row.CHRG, COMPID: row.COMPID, DES: row.DES, ICRTCD: row.ICRTCD, ICRTID: row.ICRTID
    }
         if (selectedData.isBroadcast) {
                $rootScope.popupload = true;
                broadcastService.notifyRefreshGrid(icItem);
    }
        $modalInstance.close(icItem);
    }

    $scope.closeDropdown = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.closeDropdown");
        $scope.showSrchSelection = false;
    }
   
    $scope.gridOptions1 = {
            showHeader: true,
            enableColumnMenus: false,
            rowHeight:19,
            enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
            showGridFooter: false,
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
        enableColumnMoving: false, name: 'Code', cellClass: 'gridIcWindow', sort: { direction: uiGridConstants.ASC, priority: 0, }, suppressRemoveSort: true, field: 'ICRTCD', enableHiding: false, enableAgg: false, headerCellClass: 'ICCodeHeader', groupingShowAggregationMenu: false, enableColumnResizing: false, headerCellClass: 'activityHeader', width: '20%', displayName: 'Code', maxWidth: '55', enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>'
            },
                 {
                     enableColumnMoving: false, cellClass: 'gridIcWindow', name: 'DES', field: 'DES', suppressRemoveSort: true, enableHiding: false, enableAgg: false, headerCellClass: 'ICDescHeader', groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: 'Description', width: '70%', enableCellEdit: false, cellTemplate: '<span ng-attr-title="{{COL_FIELD}}" style="line-height:20px;display:block;"> {{COL_FIELD}}</span>'
            },
        {
            enableColumnMoving: false, cellClass: 'gridIcWindow', name: 'CHRG', suppressRemoveSort: true, field: 'CHRG', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: $filter('translate')('lbl_Charge'), width: '10%', enableCellEdit: false, cellTemplate: '<span ng-attr-title="{{COL_FIELD|decimal}}" style="line-height:20px;display:block;">{{COL_FIELD|decimal}}</span>'
            }
    ],

            canSelectRows: false,
            onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.arguments.selectedICItem != null) {
                var obj = $scope.gridOptions.data.filter(function (item) {
                    return item.ICRTCD == $scope.arguments.selectedICItem.ICRTCD
                });
                $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                $scope.gridApi.selection.selectRow(obj[0]);
            }
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


    $scope.init = function () {
        $rootScope.errorLogMethod("ICItemCtrl.$scope.init");
        $scope.isPageLoaded = false;        
        $scope.domainURL = $rootScope.domainURL;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.gridOptions = angular.copy($scope.gridOptions1);
        loadICItems($scope.arguments.sessionKey, $scope.arguments.compId, $scope.arguments.domainURL);
    }

    var loadICItems = function (sessionKey, compId, domainURL) {
        $rootScope.errorLogMethod("ICItemCtrl.loadICItems");
        $scope.windowConfig.isRenderGrid =false;
        var icItemCache = sessionStorage.getItem('allICItems');        
        if (icItemCache === null || icItemCache === "" || icItemCache===undefined) {           
            loadICRates.loadICRate(sessionKey, compId, domainURL).then(function (response) {
                $scope.isPageLoaded = true;
                if (parseInt(response.LOADICRT_OUT_OBJ.RETCD) == 0) {
                    if (response.LOADICRT_OUT_OBJ.ICRATE_ARR !== null && response.LOADICRT_OUT_OBJ.ICRATE_ARR !== undefined) {
                        if (Object.prototype.toString.call(response.LOADICRT_OUT_OBJ.ICRATE_ARR) != '[object Array]') {
                            var data = response.LOADICRT_OUT_OBJ.ICRATE_ARR;
                            response.LOADICRT_OUT_OBJ.ICRATE_ARR = [];
                            response.LOADICRT_OUT_OBJ.ICRATE_ARR.push(data.ICRATE_OBJ);
                        }
                        $scope.allICItems = response.LOADICRT_OUT_OBJ.ICRATE_ARR.filter(function (item) { return item.STAT == "Y" });
                        $scope.allICItems = $filter('orderBy')($scope.allICItems, ['ICRTCD']);
                        $scope.filteredICItems = $scope.allICItems;
                        sessionStorage.removeItem('allICItems');
                        sessionStorage.setItem('allICItems', JSON.stringify($scope.allICItems));
                        $scope.windowConfig.isRenderGrid = true;
                        $scope.gridOptions.data = $scope.allICItems;                     
                    }
                    else {
                        $scope.filteredICItems = $scope.allICItems = [];
                        $scope.windowConfig.isRenderGrid = true;
                    }
                }
                else {
                    $scope.windowConfig.isRenderGrid = true;
                }
            });
        }
        else {
            icItemCache = JSON.parse(icItemCache);
            icItemCache = $filter('orderBy')(icItemCache, ['ICRTCD']);
            $scope.allICItems = icItemCache;
            $scope.filteredICItems = icItemCache;
            $scope.gridOptions.data = $scope.filteredICItems;
            $timeout(function () {
                $scope.windowConfig.isRenderGrid = true;               
            }, 10);
            $timeout(function () { $scope.isPageLoaded = true; }, 1000)
    }
    }
}])