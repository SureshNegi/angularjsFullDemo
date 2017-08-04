(function () {
    var app = angular.module('MyTimeApp');
    var staticGridHeaderOrder = ['&nbsp;', 'Cep Code', 'Billable', 'Global/Sub-Business', 'Company', 'Relationship Manager', 'Program Name', 'Engagement Consultant', 'Engagement Office', 'Engagement Name', 'Project Manager', 'Project Office', 'Project Name'];
    var traslationColVar = ["","lbl_CepCode", "msg_BillableVar", "lbl_glblSubBsns", "lbl_cmpny", "msg_relnMngr", "msg_ProgNm", "msg_EngCons", "lbl_engOffc", "msg_EngNm", "msg_PrjMgr", "lbl_ProjectOffc", "msg_prjNm"];
    function getTranslations($filter) {
        for (var i = 1; i < staticGridHeaderOrder.length; i++) {
            staticGridHeaderOrder[i] = $filter('translate')(traslationColVar[i]);
        }
    }
    var FavCEPCodeCtrlFun = function ($rootScope, $filter, cepService, uiGridConstants, $timeout, $scope, $modalInstance, arguments, broadcastService, cepSharedService, appConstants, gridLayoutService, sharedService) {
        var staticDataFieldOrder = ['CEPFAV', 'CEPCODE', 'CHARBASIS', 'GLOBBUSI', 'OCOMP', 'RMGR', 'PROG', 'ENGCON', 'ENGO', 'ENGNAME', 'PRJM', 'PRJO', 'PRJNAME'];
        var staticHeaderWidthAr = [50, 100, 65, 128, 75, 135, 100, 145, 125, 120, 120, 115, 105];
        var gridStaticHeaderObj = {};
        var gridStaticColSortMapObj = {};
        var gridStaticColWidthMapObj = {};
        var maxSearchResult = 500;
        var pageSize = 50;
        var colSortMapping = ["38", "2,5,8", "lower(cacc_charge_basis)", "lower(GLOBAL_BUSINESS)", "lower(comp_no)", "lower(rmgr_name)", "lower(Program_name)", "lower(BCON_NAME)", "lower(cacc_offi_name)", "lower(cacc_name)", "lower(PMGR_NAME)", "lower(proj_offi_name)", "lower(proj_name)"];
        var cepSortDescValForAPI = "2 DESC,5 DESC,8 DESC";
        var headersObjOnLoad = [];
        $scope.popUpName = 'FavCEPDesktp';
        $scope.msg_srchCEPVar = $filter('translate')('msg_srchCEP');        
        $scope.isMinimize = false;
        $scope.isDefaultLayout = true;
        $scope.isResetLayoutBtnOff = true;
        getTranslations($filter);
        $scope.config = { heads: staticGridHeaderOrder, fields: staticDataFieldOrder };
        var blankGridMsg = {
            wind2Msg1: $scope.msg_srchCEPVar, wind2Msg2: $filter('translate')('msg_nodsplyRslt')
        };
        $scope.noRecordMsg = blankGridMsg.wind2Msg1;
        if (appConstants.CURRENTLANGUAGE == 'fr')
            staticHeaderWidthAr = [60 ,100, 82, 140, 65, 125, 125, 150, 160, 130, 130, 130, 100];
       
        for (var i = 0; i < staticDataFieldOrder.length; i++) {
            gridStaticHeaderObj[staticDataFieldOrder[i]] = staticGridHeaderOrder[i];
            gridStaticColSortMapObj[staticDataFieldOrder[i]] = colSortMapping[i];
            gridStaticColWidthMapObj[staticDataFieldOrder[i]] = staticHeaderWidthAr[i];
        }

        var createHeaders = function (mode) {
            var headers = [];
            if (mode == 1) {
                for (var i = 0; i < staticDataFieldOrder.length; i++) {
                    headers[i] = { index: i, field: staticDataFieldOrder[i], displayName: staticGridHeaderOrder[i], sortVal: colSortMapping[i], width: staticHeaderWidthAr[i] };
                }
            }
            else {
                var layout = localStorage.getItem('searchLayout');               
                layout = (JSON.parse(layout));
                
                layout.GCOLUMNS = $filter('filter')(layout.GCOLUMNS, function (d) { return d.CVISIBLE === "Y"; });
                for (var i = 0; i < layout.GCOLUMNS.length; i++) {                   
                    var hField = (layout.GCOLUMNS[i].CNAME == "Delete" ? "CEPFAV" : (layout.GCOLUMNS[i].CNAME == "cepCode") ? "CEPCODE" : layout.GCOLUMNS[i].CNAME)
                    hField = (hField == "isBillable" ? "CHARBASIS" : hField)
                    headers[i] = { index: i, field: hField, displayName: gridStaticHeaderObj[hField], sortVal: gridStaticColSortMapObj[hField], width: gridStaticColWidthMapObj[hField] };
                   
                }

            }
            headersObjOnLoad = JSON.parse(JSON.stringify(headers));
            $scope.config.heads = headers;
        }
        
        $scope.maxMode = {
            topHeader: 52,
            section1Hgt: 28,
            isRendered: true,
            gridWidth: '100%',
            tab1PageNumber: 1, tab1TtlItem: 0, tab2ttlItem: 0, searchFavCepStr: "",
            width: window.innerWidth - 5,
            height: window.innerHeight - 10, left: 0, top: 0, margin: 0
        };
        $scope.maxMode.innerHeight = $scope.maxMode.height - $scope.maxMode.topHeader;
        $scope.maxMode.gridHeight = $scope.maxMode.innerHeight - $scope.maxMode.section1Hgt - 20;       

        $scope.minMode = {
            topHeader: 52,
            isRendered: true,
            section1Hgt: 28,
            tab1PageNumber: 1, tab1TtlItem: 0, tab2ttlItem: 0, searchFavCepStr: "",
            width: 800,
            height: 318, overflow: 'hidden', left: '25%', top: '30%', margin: 10,
            gridWidth: '100%',
            pagerPanelHeight: 35
        };
        $scope.minMode.innerHeight = $scope.minMode.height - $scope.minMode.topHeader;
        $scope.minMode.gridHeight = $scope.minMode.innerHeight - $scope.minMode.section1Hgt - 20;
       
        $scope.windowConfig = $scope.maxMode;
       
        $scope.arguments = arguments;
        $scope.listFavCep = [];
        $scope.listSearchCEP = [];
        $scope.ok = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.ok");
            $modalInstance.close();
        };

        $scope.$on("SaveSearchGridLayout", function (event, result) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.$on.SaveSearchGridLayout");
            if (result.args.isSave) {
                $scope.saveLayout();
                localStorage.setItem('isSearchGridLayoutChange', 0);
                if (result.args.methodName == "RowClick") {
                    $scope.onSelectCep(result.args.data);
                }
                else if (result.args.methodName != "TabSearch" && result.args.methodName != "TabFav")
                    $modalInstance.dismiss('cancel');
            }
            else {
                localStorage.setItem('isSearchGridLayoutChange', 0);
                $scope.isDefaultLayout = false;
                if (result.args.methodName == "close")
                    $scope.cancel();
                if (result.args.methodName == "RowClick")
                    $scope.onSelectCep(result.args.data);

            }
            var layout = localStorage.getItem('searchLayout');
            layout = (JSON.parse(layout));
            if (result.args.methodName == "TabSearch") {
                localStorage.setItem('isSearchGridLayoutChange', 0);
                $scope.isDefaultLayout = true;
                if (layout === null)
                    $scope.isResetLayoutBtnOff = true;
                else $scope.isResetLayoutBtnOff = false;
                if (!result.args.isSave) {
                    enableDisableLayoutBtn("#saveLayoutBtn", false);
                    checkCustomLayoutOnLoad();
                }
                $scope.showSearchCEPTab();
            }
            if (result.args.methodName == "TabFav") {
                localStorage.setItem('isSearchGridLayoutChange', 0);
                $scope.isDefaultLayout = true;
                if (layout === null)
                    $scope.isResetLayoutBtnOff = true;
                else $scope.isResetLayoutBtnOff = false;
                if (!result.args.isSave) {
                    enableDisableLayoutBtn("#saveLayoutBtn", false);
                    checkCustomLayoutOnLoad();
                }
                $scope.showFavCEPTab();
            }
        });


        $scope.cancel = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.cancel");
            if (localStorage.getItem('isSearchGridLayoutChange') == "1") {
                var sendData = {
                    msgList: [$filter('translate')('lbl_saveCnfrmSearch')],
                    isCancelBtnOn: true,
                    okBtnText: $filter('translate')('btn_Yes'),
                    noBtnTxt: $filter('translate')('btn_No'),
                    popUpName: 'ConfrmSaveSearchGrdLayout',
                    methodName: 'close'
                };
                sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
            }
            else {
                var windowElem = $('.cepSearchWindow').parents().eq(2);               
                $modalInstance.dismiss('cancel');
                windowElem.addClass('my-cloak');
            }
        };       
        
        var widthAr = [];      

        
        var updateWithSettings = function () {
            var availableWidth = $scope.windowConfig.width;
            var ttlColsWith = staticHeaderWidthAr.reduce(add, 0);            
            if (ttlColsWith <= availableWidth) {
                staticHeaderWidthAr[staticHeaderWidthAr.length - 1] = parseInt(staticHeaderWidthAr[staticHeaderWidthAr.length - 1]) + (availableWidth - ttlColsWith) + 100;

            }
            $scope.config.availableWidth = staticHeaderWidthAr.reduce(add, 0);
        }
        function add(a, b) {
            return a + b;
        }
       // $scope.config.colWidthAr = [120, 100, 65, 128, 75, 135, 100, 145, 125, 120, 120, 115, 105];        
       
        updateWithSettings();        
        var customLayout = null;
        var isLayoutCanBeSaved = function (grid, gridColumns) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.isLayoutCanBeSaved");
            var canBeSaved = true;             
            $scope.isDefaultLayout = false;           
            return canBeSaved;
        }       
       
        $scope.saveLayout = function () {
            if ($("#saveLayoutBtn").hasClass('disabled-ctrl'))
                return false;
            else $scope.isDefaultLayout = false;
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.saveLayout");
            if ($scope.isDefaultLayout == false) {
                var customLayout = {};
                var columnDetails = [];                
                customLayout = createCustomLayout();
                customLayout.GCOLUMNS = JSON.parse(customLayout.columns);
                customLayout.name = 'searchLayout';
                gridLayoutService.saveCustomLayout($scope.arguments.sessionKey, $scope.arguments.empId, customLayout.columns, appConstants.LAYOUTMODE.Search, 0, customLayout.name, 1).then(function (resp) {
                    if (resp.SAVEGRIDLAYOUT_OUT_OBJ.RETCD === "0") {
                        localStorage.setItem('isSearchGridLayoutChange', 0);
                        localStorage.setItem('searchLayout', JSON.stringify(customLayout));                        
                        enableDisableLayoutBtn("#saveLayoutBtn",false);
                        $scope.isDefaultLayout = true;
                        $scope.isResetLayoutBtnOff = false;
                    }
                    else {
                        //show the pop up for error massage
                    }
                });
            }
        }

        var createCustomLayout = function () {
            var tblHdOrder = [];
            var customLayout = {};
            var columnDetails = [];            
            $('#cepFavTblGrid thead th').each(function () {
                var id = $(this).attr("id");
                tblHdOrder.push(id);
                
            });
            $.each(tblHdOrder, function (index, item) {                
                var header = $filter('filter')($scope.config.heads, function (hd) { return hd.index.toString() === item })[0];
                columnDetails.push({
                    CORDER: index.toString(), CNAME: header.field, CVISIBLE: "Y"
                });
            });
            
            customLayout.columns = JSON.stringify(columnDetails);
            return customLayout

        }

        $scope.resetToDefaultLayout = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.resetToDefaultLayout");
            if (!$("#resetLayoutBtn").hasClass("disabled-ctrl")) $scope.isResetLayoutBtnOff = false;
            if ($scope.isResetLayoutBtnOff == false) {
                var layout = localStorage.getItem('searchLayout');
                layout = (JSON.parse(layout));
                if (layout === null) {
                    $scope.isDefaultLayout = true;
                    enableDisableLayoutBtn("#resetLayoutBtn", false);
                    enableDisableLayoutBtn("#saveLayoutBtn", false);
                    localStorage.setItem('isSearchGridLayoutChange', 0);
                    resetLayout();
                }
                else {
                    gridLayoutService.removeGridLayout($scope.arguments.sessionKey, $scope.arguments.empId, appConstants.LAYOUTMODE.Search).then(function (resp) {
                        if (resp.REMOVEGRIDLAYOUT_OUT_OBJ.RETCD === "0") {
                            localStorage.removeItem('searchLayout');
                            $scope.isDefaultLayout = true;
                            localStorage.setItem('isSearchGridLayoutChange', 0);
                            enableDisableLayoutBtn("#resetLayoutBtn", false);
                            enableDisableLayoutBtn("#saveLayoutBtn", false);
                            resetLayout();
                        }
                        else {
                            //show the pop up for error massage
                        }
                    });
                }
            }
        }

        var isDesignateEmployee = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.isDesignateEmployee");
            var isDesignate = false;
            if ($rootScope.designateOfEmp.EMPLID !== "0" && $rootScope.designateOfEmp.EMPLID != $rootScope.designateOfEmp.loginEmpId) {
                isDesignate = true;
            }
            return isDesignate;
        }

        $scope.onColumnMove = function () {
            if (!isDesignateEmployee()) {              
                isLayoutCanBeSaved();
                $("#saveLayoutBtn").removeClass('disabled-ctrl');
                $("#resetLayoutBtn").removeClass('disabled-ctrl');
                localStorage.setItem('isSearchGridLayoutChange', 1);
                $scope.isResetLayoutBtnOff = false;
            }
        }
        $scope.sortGridData = function (sortBy) {
            updateDataOnSorting(sortBy);            
        }        
       
        var findSortValPassToAPI = function (sortCol, isReverse) {
            var orderByForAPI = sortCol.sortVal;
            //$scope.gridApi.grid.orderByField = sortCol.field;
            //var colSortMapping = ["38", "2,5,8", "lower(cacc_charge_basis)", "lower(GLOBAL_BUSINESS)", "lower(comp_no)", "lower(rmgr_name)", "lower(Program_name)", "lower(BCON_NAME)", "lower(cacc_offi_name)", "lower(cacc_name)", "lower(PMGR_NAME)", "lower(proj_offi_name)", "lower(proj_name)"];
            if (isReverse) {
                orderByForAPI = (sortCol.field === "CEPCODE" ? cepSortDescValForAPI : orderByForAPI + " DESC ");
                orderByForAPI = (sortCol.field == "CEPFAV" ? (orderByForAPI + "," + colSortMapping[1]) : orderByForAPI);
                //$scope.gridApi.grid.orderByField = "-" + sortCol.field;
            }
            else if (sortCol.field == "CEPFAV")
                orderByForAPI = orderByForAPI + "," + cepSortDescValForAPI;
            if (sortCol.field !== "CEPFAV" && sortCol.field !== "CEPCODE") {
                orderByForAPI = orderByForAPI + "," + colSortMapping[1];
            }
            return orderByForAPI;

        }

        var updateDataOnSorting = function (sortCol,isOnPageInit) {           
            var data = [];
            var isReverse = !sortCol.sortDirection;
            isReverse = (sortCol.field == "CEPFAV") ? !isReverse : isReverse;
            var orderByForAPI = findSortValPassToAPI(sortCol, isReverse);
           
            $scope.arguments.sorOrder = orderByForAPI;
            console.log($scope.arguments);
            if ($scope.windowConfig.isFavMode) {
                getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);
            } else {
                searchCEP($scope.arguments, $scope.windowConfig.searchCepStr, isOnPageInit);
            }
        }
        
        $scope.loadPageData = function (newPage, isFavMode) {
            $scope.arguments.pageNumber = newPage;
            if (isFavMode) {               
                getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);
            }
            else {
                searchCEP($scope.arguments, $scope.windowConfig.searchCepStr);
            }
        }

        $scope.onSelectCep = function (cepRecord) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.onGridRowDblClick");
            if (localStorage.getItem('isSearchGridLayoutChange') == "1") {
                var sendData = {
                    msgList: [$filter('translate')('lbl_saveCnfrmSearch')],
                    isCancelBtnOn: true,
                    okBtnText: $filter('translate')('btn_Yes'),
                    noBtnTxt: $filter('translate')('btn_No'),
                    popUpName: 'ConfrmSaveSearchGrdLayout',
                    methodName: 'RowClick',
                    dataRow: cepRecord
                };
                sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
            }
            else {
                var windowElem = $('.cepSearchWindow').parents().eq(2);
                windowElem.addClass('my-cloak');
                if ($scope.arguments.isCepFavoriteRightPanel) {
                    $modalInstance.close(cepRecord);
                    broadcastService.notifyRightPanelCEPCodefavourite(cepRecord);
                }
                else {
                    cepRecord.cepCodeWithMask = cepRecord.CEPCODE;
                    cepRecord.cepCodeWithOutMask = cepRecord.CEPCODE.replace(/\-/g, '');
                    if ($scope.arguments.isBroadcast) {
                        $modalInstance.close(cepRecord);
                        $rootScope.IsshowCEPCodefavourite = true;
                        broadcastService.notifyCEPCodefavourite(cepRecord);
                    }
                    $modalInstance.close(cepRecord);
                }
            }
        }
        
        var bindDraggable = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.bindDraggable");
            $timeout(function () {
                $(".cepSearchWindow, #innerCepFavCont").draggable({
                    start: function (event, ui) {
                        if (event.target.id == "innerCepFavCont")
                            return false;
                        else
                            $(".cepSearchWindow").css('cursor', 'move');
                    },
                    stop: function () {
                        $(".cepSearchWindow").css('cursor', 'default');
                    }
                });
            }, 100).then(
                    function () {
                        $(".cepSearchWindow").draggable({
                            disabled: true
                        });
                    });
        }
        
        var resetLayout = function (isSetToDefault) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.resetLayout");
            if (isSetToDefault) {
                var headObj = JSON.parse(JSON.stringify(headersObjOnLoad));
                $scope.config.heads = headObj;
            }
            else {
                $scope.isResetLayoutBtnOff = true;
                enableDisableLayoutBtn("#resetLayoutBtn", false);
                $scope.windowConfig.isRendered = false;
                createHeaders(1);
                $timeout(function () { $scope.windowConfig.isRendered = true; }, 100);
            }
        }

        var checkCustomLayoutOnLoad = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.checkCustomLayoutOnLoad");
            var parentColumnDef = [];
            var layout = localStorage.getItem('searchLayout');
            layout = (JSON.parse(layout));
            if (layout === null) {
                $scope.isResetLayoutBtnOff = true;
                enableDisableLayoutBtn("#resetLayoutBtn", false);
                createHeaders(1);
            }
            else {
                if (!isDesignateEmployee()) {
                    $scope.isResetLayoutBtnOff = false;
                }
                //reset button disable for designate employee
                else {
                    enableDisableLayoutBtn("#resetLayoutBtn", false);
                }
                createHeaders(2);
            }
        }

        var setGridDefaultSorting = function (isFavMode) {
            if (isFavMode) {
                $scope.config.sortField = staticDataFieldOrder[1];
                $scope.arguments.sorOrder = colSortMapping[1];
            }
            else {
                $scope.config.sortField = staticDataFieldOrder[0];
                $scope.arguments.sorOrder = colSortMapping[0] + " DESC " + "," + colSortMapping[1];
            }
        }

        var enableDisableLayoutBtn = function (btnId, isEnable) {
            if (isEnable) {
                //enable the button
            }
            else {
                $(btnId).prop('disabled', 'disabled');
                $(btnId).addClass('disabled-ctrl');
            }

        }

        $scope.init = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.init");            
            $scope.config.dataHeight = $scope.windowConfig.gridHeight-30;            
            $scope.config.reordPerPage = $scope.arguments.reordPerPage;
            if (!arguments.sorOrder || arguments.sorOrder == "") {
                arguments.sorOrder = colSortMapping[1];
            }
            //save layout button disabled on pageload
            enableDisableLayoutBtn("#saveLayoutBtn");           
            $scope.arguments.sorOrder = arguments.sorOrder;
            checkCustomLayoutOnLoad();            
            $scope.windowConfig.isFavMode = true;
            $scope.windowConfig.searchFavCepStr = "";
            $scope.windowConfig.searchCepStr = "";
            bindDraggable();
            $scope.arguments.pageNumber = 1;                        
            $scope.arguments.cepCodeWithMask = maskCep($scope.arguments.cepCode);
            if ($scope.arguments.isSearchMode || ($scope.arguments.cepCode != null && $scope.arguments.cepCode != undefined && $scope.arguments.cepCode.trim() != "")) {
                $scope.windowConfig.isFavMode = false;
                $scope.windowConfig.searchCepStr = $scope.arguments.cepCode;
                if (!$scope.arguments.isSearchMode)
                    $scope.windowConfig.searchCepStr = $scope.arguments.cepCodeWithMask;
            }
           
            //get favourite cep
            if ($scope.windowConfig.isFavMode) {
                getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);
            }
            //search for cep 
            else {
                $scope.config.sortField = staticDataFieldOrder[0];
                //search cep code, fav on top 
                updateDataOnSorting({ field: $scope.config.sortField, sortDirection: true, sortVal: colSortMapping[0] },true);
            }
          
        }       

        $scope.addToFavCEP = function (cepObj) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.addToFavCEP");
            var data = {
                "NUMBER": [cepObj.PRJID]
            };
            var prj_arr = JSON.stringify(data);
            cepService.addCEPFavorites($scope.arguments.sessionKey, $scope.arguments.empId, prj_arr).then(function (response) {
                if (parseInt(response.ADDCEPFAV_OUT_OBJ.RETCD) == 0) {
                    cepObj.CEPFAV = "Y";
                    broadcastService.updateDataSource(appConstants.BroadCastUpdate.updateFavCep);
                }
            });
        }        
       
        $scope.updateCepFavRecord = function (cepObj, isFavMode, isDelete) {           
            if (isDelete) {
                $scope.removeFrmFavCEP(cepObj, isFavMode);
            }
            else {
                $scope.addToFavCEP(cepObj);
            }

        }

        $scope.removeFrmFavCEP = function (cepObj, isFavMode) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.removeFrmFavCEP");
            var data = {
                "NUMBER": [cepObj.PRJID]
            };
            var prj_arr = JSON.stringify(data);
            cepService.removeCEPFavorites($scope.arguments.sessionKey, $scope.arguments.empId, prj_arr).then(function (response) {
                if (parseInt(response.REMCEPFAV_OUT_OBJ.RETCD) == 0) {
                    broadcastService.updateDataSource(appConstants.BroadCastUpdate.updateFavCep);
                    cepObj.CEPFAV = "N";
                    if (isFavMode) {                        
                        getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);                       
                    }
                    else {

                        cepObj.CEPFAV = "N";
                    }
                }
            });

        }

        var maskCep = function (cepStr) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.maskCep");
            if (cepStr === null || cepStr === undefined)
                return "";
            var resp = cepSharedService.isExcepCepCode(cepStr);
            if (resp.isExpCep) {
                return resp.cepWithMask;
            }
            else {
                var cepWithMask = cepStr;
                if (cepStr.length == 12) {
                    cepWithMask = cepStr.substring(0, 6) + '-' + cepStr.substring(6, 9) + '-' + cepStr.substring(9, 12);
                }
                else if (cepStr.length > 6 && cepStr.length > 9) {
                    cepWithMask = cepStr.substring(0, 6) + '-' + cepStr.substring(6, 9) + '-' + cepStr.substring(9);
                }
                else if (cepStr.length > 6 && cepStr.length <= 9) {
                    cepWithMask = cepStr.substring(0, 6) + '-' + cepStr.substring(6)
                }
                return cepWithMask;
            }

        }

        var showBtmMsgDiv = function (item) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.showBtmMsgDiv");
            $.growl({
                title: item.title, message: item.msg
            });
        }

        var searchCEP = function (arguments, search, isNewRequest) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.searchCEP");
            //cepService.getFavCEP(arguments.sessionKey, arguments.empId, arguments.cepCode, arguments.pageNumber, arguments.reordPerPage, arguments.sorOrder)
            if (search.length > 0)
                cepService.searchCEPCode(arguments.sessionKey, arguments.empId, search, arguments.pageNumber, arguments.reordPerPage, arguments.sorOrder, arguments.companyId, arguments.domainURL).then(function (response) {
                    if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                        if (Object.prototype.toString.call(response.LOOKCEP_OUT_OBJ.CEP_ARR) != '[object Array]') {
                            var data = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            response.LOOKCEP_OUT_OBJ.CEP_ARR = [];
                            if (data != null)
                                response.LOOKCEP_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                        }
                        var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;
                        if (leg > 0) {
                            var items = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            items = items.filter(function (item) {
                                return item.CLIENO !== '000000';
                            });

                            items.forEach(function (cep) {
                                cep.CEPCODE = cep.CLIENO + '-' + ("00" + cep.ENGNO).slice(-3).toString() + '-' + ("00" + cep.PRJNO).slice(-3).toString();
                            });
                            $scope.listSearchCEP = items;
                            $scope.noRecordMsg = $scope.listSearchCEP.length == 0 ? blankGridMsg.wind2Msg2 : '';
                            //localStorage.GroupingCalledCEPFav = "1";
                            //$scope.gridApi.grouping.groupColumn('clientName');
                            var ttlAvail = parseInt(response.LOOKCEP_OUT_OBJ.TOTAVAIL);
                            var ttlFound = 0;
                            if (!response.LOOKCEP_OUT_OBJ.TOTFOUND !== undefined && response.LOOKCEP_OUT_OBJ.TOTFOUND !== '')
                                ttlFound = parseInt(response.LOOKCEP_OUT_OBJ.TOTFOUND);

                            $scope.windowConfig.tab2TtlItem = ttlAvail;
                            //if ($scope.gridApi.grid.orderByField !== undefined)
                            //    $scope.listSearchCEP = $filter('orderBy')($scope.listSearchCEP, [$scope.gridApi.grid.orderByField, "CLIENO"]);
                            bindGridData($scope.listSearchCEP, ttlAvail);
                            if (ttlFound > maxSearchResult && isNewRequest == true)
                                $timeout(function () {
                                    showBtmMsgDiv({
                                        title: "Message", msg: $filter('translate')('msg_Gt500Records')
                                    });                                    
                                }, 100);
                        } else {
                            $scope.noRecordMsg = blankGridMsg.wind2Msg2;
                        }

                    }
                    //else {
                    //    alert('error');
                    //}
                });
            else {
                clearSrchGrid();
            }
        }

        var getFavCEPCodes = function (arguments, search) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.getFavCEPCodes");
            cepService.getFavCEP(arguments.sessionKey, arguments.empId, search, arguments.pageNumber, arguments.reordPerPage, arguments.sorOrder)
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
                        var ttlAvail = parseInt(response.RETCEPFAV_OUT_OBJ.TOTAVAIL);                       
                        bindGridData(items, ttlAvail);
                    }

                });

        }

        $scope.resizeWindow = function (isMinimize) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.resizeWindow");
            var windowElem = $('.cepSearchWindow').parents().eq(2);
            $scope.windowLayout = {};            
            var srchInputFav = $scope.windowConfig.searchFavCepStr;
            var srchInputAll = $scope.windowConfig.searchCepStr;
            
            $scope.isMinimize = isMinimize;
            if ($scope.isMinimize) {
                $scope.minMode.isFavMode = $scope.windowConfig.isFavMode;
                $scope.minMode.isRendered = true;
                $scope.windowConfig = $scope.minMode;
                $(".cepSearchWindow").draggable("enable");
            }
            else {
                $scope.maxMode.isRendered = true;
                $scope.maxMode.isFavMode = $scope.windowConfig.isFavMode;
                $(".cepSearchWindow").draggable({
                    disabled: true
                });
                $scope.windowConfig = $scope.maxMode;
            }
            $scope.windowConfig.searchFavCepStr = (srchInputFav === undefined || srchInputFav === null) ? "" : srchInputFav;
            $scope.windowConfig.searchCepStr = (srchInputAll === undefined || srchInputAll === null) ? "" : srchInputAll;            
            windowElem.addClass('my-cloak');
            $scope.config.dataHeight = $scope.windowConfig.gridHeight - 30;
            $timeout(function () {               
                $timeout(function () {
                    windowElem.removeClass('my-cloak');                   
                });
            });

        }        
        
        var bindGridData = function (gridDataAr, ttlItem) {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.bindGridData");
            if ($scope.windowConfig.isFavMode) {
                $scope.config.totalItems = ttlItem;
                $scope.config.currentPageNo = $scope.arguments.pageNumber;
                $scope.config.myData = gridDataAr;
            }
            else {
                $scope.config.totalItems = ttlItem;
                $scope.config.currentPageNo = $scope.arguments.pageNumber;                
                $scope.config.myData = gridDataAr;
            }
        }

        $scope.clearSearch = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.clearSearch");
            if ($scope.windowConfig.isFavMode) {
                $scope.windowConfig.searchFavCepStr = "";                
                getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);
                angular.element(document.getElementById('searchFavCepInput')).trigger('blur');
            }
        }

        $scope.searchBtnClick = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.searchBtnClick");           
            if (!$scope.windowConfig.isFavMode) {                
                $scope.searchInAllCEP();
            }
            else if ($scope.windowConfig.isFavMode) {
                $scope.searchInFavCEP();
            }
        }

        var clearSrchGrid = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.clearSrchGrid");
            $scope.config.currentPageNo = 1;
            $scope.config.totalItems = 0;            
            $scope.noRecordMsg = blankGridMsg.wind2Msg1;
            $scope.config.myData = [];
            bindGridData([], 0);
        }

        var updateGridSortByCol = function (colName) {
            $scope.arguments.pageNumber = 1;            
            $scope.config.sortField = staticDataFieldOrder[0];
            updateDataOnSorting({ field: $scope.config.sortField, sortDirection: true, sortVal: colSortMapping[0] },true);
        }
        $scope.searchInAllCEP = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.searchInAllCEP");
            //blank search
            if ($scope.windowConfig.searchCepStr.trim().length == 0) {
                clearSrchGrid();
            }
            else {
                $scope.arguments.pageNumber = 1;
                val = angular.element(document.getElementById("searchCepInput")).val();
                if (val != $scope.windowConfig.searchCepStr)
                    $scope.windowConfig.searchCepStr = val;
                if ($scope.windowConfig.searchCepStr.trim() != "")
                    updateGridSortByCol();
                else {
                    clearSrchGrid();
                }
            }
        }


        $scope.searchInFavCEP = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.searchInFavCEP");
            $scope.arguments.pageNumber = 1;
            val = angular.element(document.getElementById("searchFavCepInput")).val();
            if (val != $scope.windowConfig.searchFavCepStr)
                $scope.windowConfig.searchFavCepStr = val;
            getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);
        }

        $scope.showFavCEPTab = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.showFavCEPTab");
            if (localStorage.getItem('isSearchGridLayoutChange') == "1") {
                var sendData = {
                    msgList: [$filter('translate')('lbl_saveCnfrmSearch')],
                    isCancelBtnOn: true,
                    okBtnText: $filter('translate')('btn_Yes'),
                    noBtnTxt: $filter('translate')('btn_No'),
                    popUpName: 'ConfrmSaveSearchGrdLayout',
                    methodName: 'TabFav'
                };
                sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
            }
            else {
                $scope.windowConfig.isFavMode = true;
                $scope.config.currentPageNo = 1;
                $scope.config.myData = [];
                $scope.config.totalItems = 0;
                $scope.arguments.pageNumber = 1;                
                val = angular.element(document.getElementById("searchFavCepInput")).val();
                if (val != $scope.windowConfig.searchFavCepStr)
                    $scope.windowConfig.searchFavCepStr = val;
                setGridDefaultSorting(true);
                if (isDesignateEmployee())
                    resetLayout(true);
                getFavCEPCodes($scope.arguments, $scope.windowConfig.searchFavCepStr);
            }
        }

        $scope.showSearchCEPTab = function () {
            $rootScope.errorLogMethod("CEPCodeFavDesktopCtrl.$scope.showSearchCEPTab");
            if (localStorage.getItem('isSearchGridLayoutChange') == "1") {
                var sendData = {
                    msgList: [$filter('translate')('lbl_saveCnfrmSearch')],
                    isCancelBtnOn: true,
                    okBtnText: $filter('translate')('btn_Yes'),
                    noBtnTxt: $filter('translate')('btn_No'),
                    popUpName: 'ConfrmSaveSearchGrdLayout',
                    methodName: 'TabSearch'
                };
                sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
            }
            else {
                $scope.windowConfig.isFavMode = false;
                $scope.config.currentPageNo = 1;
                $scope.config.myData = [];
                $scope.config.totalItems = 0;
                $scope.arguments.pageNumber = 1;
                setGridDefaultSorting();
                if (isDesignateEmployee())
                    resetLayout(true);
                searchCEP($scope.arguments, $scope.windowConfig.searchCepStr,true);
            }
        }

    }

    app.controller('CEPCodeFavDesktopCtrl', ['$rootScope', '$filter', 'cepService', 'uiGridConstants', '$timeout', '$scope', '$modalInstance', 'arguments', 'broadcastService', 'cepSharedService', 'constantService', 'gridLayoutService', 'openPopUpWindowFactory', FavCEPCodeCtrlFun]);
}());