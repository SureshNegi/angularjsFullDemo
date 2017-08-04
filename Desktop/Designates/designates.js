angular.module('MyTimeApp')
.controller('designatesCtrl', ['$scope','uiGridConstants', 'designateService', '$window', '$filter', '$rootScope', '$timeout', function ($scope,uiGridConstants, designateService, $window, $filter, $rootScope, $timeout) {
$scope.globalCordSrchHeader ="";
var initialDetail = "";
var noMatchFoundMsg = $filter('translate')('msg_noMatch');
var msgTitle = "Message";

var loadDesignates = function () {
    $rootScope.errorLogMethod("designatesCtrl.loadDesignates");
     designateService.loadDesignates($scope.loginDetail.SESKEY, manageDesignateOf.empId).then(function (response) {
        
         var data = response.LOADDESIG_OUT_OBJ.EMPL_ARR;
            if (Object.prototype.toString.call(response.LOADDESIG_OUT_OBJ.EMPL_ARR) != '[object Array]') {
                response.LOADDESIG_OUT_OBJ.EMPL_ARR = [];
                if (data != null)
                    response.LOADDESIG_OUT_OBJ.EMPL_ARR.push(data.EMPL_OBJ);
                data = response.LOADDESIG_OUT_OBJ.EMPL_ARR;
            }
            if (data == null || data == undefined)
                $scope.gridDesignateList.data = [];
            if (data.length > 6)
                $scope.gridDesignateList.enableVerticalScrollbar = uiGridConstants.scrollbars.ALWAYS;
            else
                $scope.gridDesignateList.enableVerticalScrollbar = uiGridConstants.scrollbars.NEVER;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                if (data[i].GOCMAIL == "Y")
                    data[i].GOCMAIL = true;
                else
                    data[i].GOCMAIL = false;
            }
                $scope.gridDesignateList.data = data;
                $timeout(function () {
                    $scope.isgridDesignateListRendered = true;
                    if($scope.gridDesignateList.data.length > 6)
                        $scope.gridDesignateList.enableVerticalScrollbar = uiGridConstants.scrollbars.ALWAYS;
                    else
                        $scope.gridDesignateList.enableVerticalScrollbar = uiGridConstants.scrollbars.NEVER;
            });
            }
            else {
                $scope.gridDesignateList.data =[];
                $scope.blankgridDesignateListmessage = $filter('translate') ('msg_notDsgntSet');
                //$scope.gridDesignateList.rowHeight = 19;
            }

        });
    }
   var manageDesignateOf = null;
    $scope.loginUser = null;  
    $scope.globalCordSrchInput = "";
    $scope.isDesignateEntrySection = true; $scope.isDesignateViewSection = false;
    

    
    $scope.init = function () {
        $rootScope.errorLogMethod("designatesCtrl.$scope.init");
        $scope.isgridDesignateListRendered = true;
        $scope.loginUser = { empId: $scope.loginDetail.EMPLID, name: $scope.loginDetail.loginUsrDisplayName }
        manageDesignateOf = JSON.parse(JSON.stringify($scope.loginUser));
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        loadDesignates();
        $scope.isGloCordinate = false;
        $scope.isShowSearch = false;
        initialDetail = $rootScope.GetInitialDetail(false, true);
        //if login user is global cordinator then show the search panel
        // alert(initialDetail.loginUsrInitialDetail.EMPL_REC.HASCDA);        
        if (initialDetail.loginUsrInitialDetail.EMPL_REC.HASGCRL === "Y")
        $scope.isGloCordinate = true;
        //alert(JSON.stringify($scope.loginUser));
        $scope.gloCordHeader = initialDetail.EMPL_REC.FNAME + " " + (initialDetail.EMPL_REC.LNAME !== undefined ? initialDetail.EMPL_REC.LNAME : "");
        clearAll();
    }
    $scope.globalCordSrchInputChange = function (userInput) {
        $rootScope.errorLogMethod("designatesCtrl.$scope.globalCordSrchInputChange");
        $scope.glCordDesSrchRslt = [];
        var lookUpObj = { empFind: "", psid: "", firstname: "", lastname: "" };
        lookUpObj.empFind = userInput;
        designateService.lookupEmployees($scope.loginDetail.SESKEY, lookUpObj).then(function (response) {
            if (response.LOOKEMPL_OUT_OBJ.RETCD == 0) {
                if (response.LOOKEMPL_OUT_OBJ.EMPL_ARR !== null) {
                    var data = response.LOOKEMPL_OUT_OBJ.EMPL_ARR;
                    if (Object.prototype.toString.call(response.LOOKEMPL_OUT_OBJ.EMPL_ARR) != '[object Array]') {
                        response.LOOKEMPL_OUT_OBJ.EMPL_ARR = [];
                        if (data != null)
                            response.LOOKEMPL_OUT_OBJ.EMPL_ARR.push(data.EMPL_OBJ);
                        data = response.LOOKEMPL_OUT_OBJ.EMPL_ARR;
                    }
                    $scope.glCordDesSrchRslt = data;
                }
                else {
                    showBtmMsgDiv({ title: msgTitle, msg: noMatchFoundMsg });
                }
            }
            else {
                $scope.glCordDesSrchRslt =[];
            }
        });
    }
    $scope.empSelectByGlocord = function (empSelected) {
        $rootScope.errorLogMethod("designatesCtrl.$scope.empSelectByGlocord");
        empSelected.displayName = empSelected.FNAME +" "+ (empSelected.LNAME === undefined ? "" : empSelected.LNAME);
        $scope.isShowSearch = false;
        $scope.glCordDesSrchRslt = [];
        $scope.gloCordHeader = empSelected.displayName;
        if (empSelected.EMPLID === $scope.loginDetail.empLoggedInId) {
            manageDesignateOf = JSON.parse(JSON.stringify($scope.loginUser));
        }
        else {
            manageDesignateOf = { empId: empSelected.EMPLID, name: empSelected.displayName };
        }
       $scope.btnNewSearch();
        loadDesignates();
    }
    $scope.showHideInputText = function () {
        $rootScope.errorLogMethod("designatesCtrl.$scope.showHideInputText");
        $scope.isShowSearch = !$scope.isShowSearch;
        $scope.glCordDesSrchRslt=[];
    }
    var filterLookUpData = function (apiData) {
        $rootScope.errorLogMethod("designatesCtrl.filterLookUpData");
        if (apiData.length == 0)
            return [];
        var data =apiData;
        var employeeAdded = $scope.gridDesignateList.data;       
        if (employeeAdded.length > 0) {
            for (var i = 0; i < employeeAdded.length; i++) {
                apiData = apiData.filter(function (item) {
                    return item.EMPLID !==employeeAdded[i].EMPLID
        });
        }
        data =apiData;
        }
    if (manageDesignateOf.empId == $scope.loginUser.empId) {
        data = data.filter(function (item) {
            return item.EMPLID !== manageDesignateOf.empId
            });

        }
        return data;
    }

    var showBtmMsgDiv = function (item) {
        $rootScope.errorLogMethod("designatesCtrl.showBtmMsgDiv");
        $.growl({
            title: item.title, message: item.msg
        });
    }
    var lookupEmployees = function () {
        $rootScope.errorLogMethod("designatesCtrl.lookupEmployees");
        $scope.gridDesignateOptions.data = [];
        var lookUpObj = { empFind: null, psid: "", firstname: "", lastname:"" };
        if($scope.psNumber != null)
            lookUpObj.psid = $scope.psNumber;
        if($scope.firstName != null)
            lookUpObj.firstname = $scope.firstName;
        if($scope.lastName != null)
            lookUpObj.lastname = $scope.lastName;
        designateService.lookupEmployees($scope.loginDetail.SESKEY, lookUpObj).then(function (response) {
            if (response.LOOKEMPL_OUT_OBJ.RETCD == 0) {
                $scope.isDesignateEntrySection = false;
                $scope.isDesignateViewSection = true;
                var data = response.LOOKEMPL_OUT_OBJ.EMPL_ARR;
                if (Object.prototype.toString.call(response.LOOKEMPL_OUT_OBJ.EMPL_ARR) != '[object Array]') {
                    response.LOOKEMPL_OUT_OBJ.EMPL_ARR =[];
                    if (data != null)
                        response.LOOKEMPL_OUT_OBJ.EMPL_ARR.push(data.EMPL_OBJ);
                    data = response.LOOKEMPL_OUT_OBJ.EMPL_ARR;
            }

                data = filterLookUpData(data);
                if (data.length > 6)
                    $scope.gridDesignateOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.ALWAYS;
                else
                    $scope.gridDesignateOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.NEVER;
                if (data.length != 0) {
                    $scope.gridDesignateOptions.data = data;
                }
                else
                    $scope.blankgridDesignatemessage = $filter('translate')('msg_nodsplyRslt');
        }
        });

    }
    var clearAll = function () {
        $rootScope.errorLogMethod("designatesCtrl.clearAll");
        $scope.psNumber = "";
        $scope.firstName = "";
        $scope.lastName = "";
    }
    $scope.isDesignateEntrySection = true; $scope.isDesignateViewSection = false;
    $scope.btnSearch = function () {
        $rootScope.errorLogMethod("designatesCtrl.$scope.btnSearch");
        if($scope.firstName.trim().length>0 || $scope.lastName.trim().length>0  || $scope.psNumber.toString().trim().length>0)
            lookupEmployees();
        setTimeout(function () { $(".reportingBtn").focus(); }, 100);
    }
    $scope.btnNewSearch = function () {
        $rootScope.errorLogMethod("designatesCtrl.$scope.btnNewSearch");
        clearAll();
        $scope.isDesignateEntrySection = true;
        $scope.isDesignateViewSection = false;
        $scope.gridDesignateOptions.data = [];
    }
    $scope.sendEmail = function (checkMail, desgId) {
        $rootScope.errorLogMethod("designatesCtrl.$scope.sendEmail");
        var gocFlag="N";
        if (checkMail) {
            gocFlag = "Y";
        }
        designateService.setGocMail($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, desgId, gocFlag).then(function (response) {
            if (response.SETGOCMAIL_OUT_OBJ.RETCD == 0) {    
                }
        });
    }
    $scope.wfEmailTitle = $filter('translate')('msg_wfEmail');
    $scope.dltTitle = $filter('translate')('btn_Delete');
    var columnDesignates =[
                 {
                     field: 'Delete', cellClass: "gridDesignatesOptions", enableSorting: false, enableColumnMenu: false, displayName: '', enableColumnResizing: false, enableFiltering: false, width: '19', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, cellTemplate: '<div class="icon-edit ui-grid-cell-contents" title="{{grid.appScope.dltTitle}}"><input class="entry-edit" ng-click="grid.appScope.DeleteDesignate(row.entity)"/></div>'
    },
             {
                 field: 'EMPID', name: 'EMPID', groupingShowAggregationMenu: false, enableColumnMenu: false, displayName: 'EMPID', enableCellEdit: false, width: '0',
                 cellTemplate: '<div class="ui-grid-cell">{{(row.entity.EMPID)}}</div>', allowCellFocus: true,

    },
             {
                 field: 'DESGID', name: 'DESGID', groupingShowAggregationMenu: false, enableColumnMenu: false, displayName: 'DESGID', enableCellEdit: false, width: '0',
                 cellTemplate: '<div class="ui-grid-cell">{{(row.entity.DESGID)}}</div>',
                 //cellTemplate: '<div class="ui-grid-cell-nav" style="width:100%;height:100%"><span ng-if="!row.groupHeader">{{row.entity.CEP_REC.CHARBASIS}}</span></div>',
                 allowCellFocus: true,
    },
             {
                 field: 'FNAME', name: 'FNAME', width: '71', suppressRemoveSort: true, groupingShowAggregationMenu: false, enableColumnMenu: false, visible: true, displayName: $filter('translate')('lbl_frstNm') , enableCellEdit: false,
                 cellTemplate: '<div class="ui-grid-cell" title="{{(row.entity.FNAME)}}">{{(row.entity.FNAME)}}</div>',
                 allowCellFocus: true,

    },
                    {
                        field: 'LNAME', name: 'LNAME', sort: { direction: uiGridConstants.ASC, priority: 0, }, groupingShowAggregationMenu: false, enableColumnMenu: false, width: '70', suppressRemoveSort: true, displayName: $filter('translate')('lbl_lstNm'), enableCellEdit: false,
                        cellTemplate: '<div class="ui-grid-cell" title="{{(row.entity.LNAME)}}">{{(row.entity.LNAME)}}</div>', allowCellFocus: true,

    }
                     ,
         {
             name: 'PSID',type:'number', groupingShowAggregationMenu: false, enableColumnMenu: false, width: '51', suppressRemoveSort: true, displayName: $filter('translate')('msg_PsNum') , enableCellEdit: false,
             cellTemplate: '<div  class="ui-grid-cell rightAlig" title="{{row.entity.PSID}}">{{row.entity.PSID}}</div>', allowCellFocus: true,
    },
                {
                    suppressRemoveSort: true, field: 'GOCMAIL', enableSorting: true, name: 'email', enableCellEdit: false, enableColumnMenu: false, displayName: $filter('translate')('lbl_email'), width: '55', cellTemplate: '<div  class="ui-grid-cell"><input type="checkbox" ng-model="row.entity.GOCMAIL" title="{{grid.appScope.wfEmailTitle}}" ng-click="grid.appScope.sendEmail(row.entity.GOCMAIL, row.entity.EMPLID)"></div>'
                },

    ];
    var columnDesignatesOptions = [
             {
                 field: 'Add', cellClass: "gridDesignatesOptions", enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '0.5%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div class="icon-edit ui-grid-cell-contents" title="Add"><input class="entry-edit" ng-click="grid.appScope.AddDesignate(row.entity)"/></div>'
             },
         {
             field: 'EMPID', name: 'FNAME', groupingShowAggregationMenu: false, enableColumnMenu: false, displayName: 'EMPID', enableCellEdit: false, width: '0',
             cellTemplate: '<div  class="ui-grid-cell">{{(row.entity.EMPID)}}</div>', allowCellFocus: true,

         },
         {
             field: 'DESGID', name: 'FNAME', groupingShowAggregationMenu: false, enableColumnMenu: false, displayName: 'DESGID', enableCellEdit: false, width: '0',
             cellTemplate: '<div  class="ui-grid-cell">{{(row.entity.DESGID)}}</div>', allowCellFocus: true,

         },
         {
             field: 'FNAME', name: 'FNAME', width: '*', suppressRemoveSort: true, groupingShowAggregationMenu: false, enableColumnMenu: false, visible: true, displayName: $filter('translate')('lbl_frstNm') , enableCellEdit: false,
             cellTemplate: '<div  class="ui-grid-cell" title="{{(row.entity.FNAME)}}">{{(row.entity.FNAME)}}</div>', allowCellFocus: true,

         },
                {
                    field: 'LNAME', name: 'LNAME', sort: { direction: uiGridConstants.ASC, priority: 0, }, groupingShowAggregationMenu: false, enableColumnMenu: false, width: '*', suppressRemoveSort: true, displayName: $filter('translate')('lbl_lstNm'), enableCellEdit: false,
                    cellTemplate: '<div  class="ui-grid-cell" class="ui-grid-cell" title="{{(row.entity.LNAME)}}">{{(row.entity.LNAME)}}</div>', allowCellFocus: true,

                }
                 ,
     {
         name: 'PSID', groupingShowAggregationMenu: false, enableColumnMenu: false, width: '*', suppressRemoveSort: true, displayName: $filter('translate')('msg_PsNum') , enableCellEdit: false,
         cellTemplate: '<div  class="ui-grid-cell rightAlig" title="{{row.entity.PSID}}">{{row.entity.PSID}}</div>', allowCellFocus: true,
     },
    ];
    $scope.gridDesignateOptions = {
            rowHeight: 19,
            enableColumnMoving: false,
            enableColumnResizing: true,
            showHeader: true,
            enableGridMenu: false,
            enableCellSelection: true,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: true,
            treeRowHeaderAlwaysVisible: false,
            rowTemplate: "<div   ng-mousedown=\"grid.appScope.onGridRowMouseDown(row,grid,$event)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            canSelectRows: false,
            columnDefs: columnDesignatesOptions,
            onRegisterApi: function (gridApi) {
            $rootScope.errorLogMethod("designatesCtrl.$scope.gridDesignateOptions.onRegisterApi");
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length > 1) {
                    sortColumns[0].unsort();
                }
            });
    }
    }

    $scope.gridDesignateList = {
            enableColumnMoving: false,
            enableColumnResizing: true,
            rowHeight: 19,
            showHeader: true,
            enableGridMenu: false,
            enableCellSelection: true,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: true,
            treeRowHeaderAlwaysVisible: false,
            rowTemplate: "<div   ng-mousedown=\"grid.appScope.onGridRowMouseDown(row,grid,$event)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: true,
            canSelectRows: false,
            columnDefs: columnDesignates,
            onRegisterApi: function (gridApi) {
            $rootScope.errorLogMethod("designatesCtrl.$scope.gridDesignateList.onRegisterApi");
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length > 1) {
                    sortColumns[0].unsort();
                }
            });
    }
    }
    $scope.AddDesignate = function (gridData) {
        $rootScope.errorLogMethod("designatesCtrl.$scope.AddDesignate");
        var designateName = gridData.FNAME + ' ' +gridData.LNAME;
        var loginName = manageDesignateOf.name;
        AddDesignate($scope.loginDetail.SESKEY, manageDesignateOf.empId, gridData.EMPLID, loginName, designateName);
    }
    var AddDesignate = function (sessKey, loginId, designateId, loginName, designateName) {
        $rootScope.errorLogMethod("designatesCtrl.AddDesignate");
        designateService.addDesignate(sessKey, loginId, designateId).then(function (response) {
            if (response.ADDDESIG_OUT_OBJ.RETCD == 0) {
                loadDesignates();
                showMessagePopUp([$filter('translate')('msg_addedDsgnt') + ' ' + designateName + $filter('translate')('msg_For') + loginName]);
                $scope.isDesignateEntrySection = true;
                $scope.isDesignateViewSection = false;
                clearAll();
        }
        });

    }
    $scope.DeleteDesignate = function (gridData) {
        $rootScope.errorLogMethod("designatesCtrl.$scope.DeleteDesignate");
        var designame = gridData.FNAME + ' ' +gridData.LNAME;
        var loginName = manageDesignateOf.name;
        DeleteDesignate($scope.loginDetail.SESKEY, manageDesignateOf.empId, [gridData.EMPLID], loginName, designame)
    }
    $scope.onGridRowMouseDown = function (item, grid, event) {
        $rootScope.errorLogMethod("designatesCtrl.$scope.onGridRowMouseDown");
        $(".edit_Menu").css("display", "none");
        if (item.groupHeader === undefined && event.which != 3) {
            grid.api.selection.clearSelectedRows();
            item.isSelected = true;
        }
    }
    var DeleteDesignate = function (sessKey, empId, desigIdArr, loginName, designateName) {
        $rootScope.errorLogMethod("designatesCtrl.DeleteDesignate");
        designateService.removeDesignates(sessKey, empId, desigIdArr).then(function (response) {
            if (response.REMDESIG_OUT_OBJ.RETCD == 0) {
                loadDesignates();
                showMessagePopUp([$filter('translate')('msg_dltdDsgnt') + ' ' + designateName + $filter('translate')('msg_For') + loginName]);
        }
        });
    }
    var showMessagePopUp = function (msgList, title, isWarning) {
        $rootScope.errorLogMethod("designatesCtrl.showMessagePopUp");
        var sendData = {
                errorList: msgList,
                title: title,
                isWarning: isWarning

    };
        $scope.openModalCtrl = 'showMessagePopUp';
        $scope.open('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
    };
}]);