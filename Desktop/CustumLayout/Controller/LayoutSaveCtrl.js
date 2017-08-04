(function () {
    var app = angular.module('MyTimeApp');
    var ConfirmLayoutSaveCtrl = function ($rootScope, $scope, $modalInstance, selectedData, $timeout, $filter, gridLayoutService, openPopUpWindowFactory,constantService) {
        $scope.popUpName = 'ConfirmMessage';
        $scope.layoutName = "";

        $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
        $scope.okBtnTxt = selectedData.okBtnText === undefined ? $filter('translate')('btn_Ok') : selectedData.okBtnText;
        $scope.noBtnTxt = selectedData.noBtnTxt === undefined ? $filter('translate')('btn_Cancel') : selectedData.noBtnTxt;
        $scope.selectedBtn = 1;
        var loginDetail = $rootScope.GetLoginDetail(false, true);

        
        var updateLayoutNameOnInit = function (layoutNames, mode) {
            $rootScope.errorLogMethod("LayoutSaveCtrl.updateLayoutNameOnInit");
            var populateNameOnInit = "";
            if (mode == constantService.LAYOUTMODE.Daily) {
                selectedData.layoutName = layoutNames.Weekly;
                populateNameOnInit = layoutNames.Daily;
            }
            else if (mode == constantService.LAYOUTMODE.Weekly) {
                selectedData.layoutName = layoutNames.Daily;
                populateNameOnInit = layoutNames.Weekly;
            }
            if (populateNameOnInit != "")
                $scope.layoutName = populateNameOnInit;
        }
        $scope.saveLayout = function () {
            $rootScope.errorLogMethod("LayoutSaveCtrl.$scope.saveLayout");
            if ($scope.layoutName===undefined || $scope.layoutName.length > 20 || $scope.layoutName.length < 1) {
                var sendData = {
                    errorList: [$filter('translate')('msg_layoutSaveMoreChar')]

                };
                $scope.openModalCtrl = 'showMessagePopUp';
                openPopUpWindowFactory.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                //$scope.message = "Custom Layout name must  be between 1 and 200 characters";
            }
            else if ($scope.layoutName == selectedData.layoutName) {
                var sendData = {
                    errorList: [$filter('translate')('msg_cstmNameExsts')]

                };
                $scope.openModalCtrl = 'showMessagePopUp';
                openPopUpWindowFactory.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
            else {
                /*API call to save layout*/
                var layout = selectedData.layout;
                var changePref = 1;
                layout.name = $scope.layoutName;
                gridLayoutService.saveCustomLayout(loginDetail.SESKEY, loginDetail.EMPLID, layout, selectedData.mode, selectedData.parentId,$scope.layoutName, changePref).then(function (resp) {
                    if (resp.SAVEGRIDLAYOUT_OUT_OBJ.RETCD === "0") {
                        if (selectedData.mode == constantService.LAYOUTMODE.Daily) {
                            $rootScope.dailyCustomFlag = true;
                            selectedData.layOutNames.Daily = $scope.layoutName;
                        }
                        else if (selectedData.mode == constantService.LAYOUTMODE.Weekly) {
                            $rootScope.weeklyCustomFlag = true;
                            selectedData.layOutNames.Weekly = $scope.layoutName;
                        }
                        var sendData = {
                            errorList: [$filter('translate')('msg_layoutSave')]

                        };
                        $scope.openModalCtrl = 'showMessagePopUp';
                        openPopUpWindowFactory.openModalPopUp('Desktop/CustumLayout/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                        $modalInstance.close();
                        localStorage.setItem('isMainGridLayoutChange', "0");
                        $rootScope.enableSaveLayout = false;
                    }
                    else {
                        //show the pop up for error massage
                    }
                });
            }
        };
        $scope.cancel = function (changeFocus) {
            $rootScope.errorLogMethod("LayoutSaveCtrl.$scope.cancel");
            if (changeFocus)
                $scope.selectedBtn = 2;
            
            $modalInstance.dismiss('cancel');
        };
        $scope.init = function () {
            $rootScope.errorLogMethod("LayoutSaveCtrl.$scope.init");
            
            updateLayoutNameOnInit(selectedData.layOutNames, selectedData.mode);
            setTimeout(function () { document.getElementById("txt_LayoutName").focus(); }, 500);
            bindDraggable();
        }
        var bindDraggable = function () {
            $rootScope.errorLogMethod("LayoutSaveCtrl.bindDraggable");
            $timeout(function () {
                $("#layoutSave, #layoutSaveInnerBox").draggable({
                    start: function (event, ui) {
                        if (event.target.id == "layoutSaveInnerBox")
                            return false;
                        else
                            $("#layoutSave").css('cursor', 'move');
                    },
                    stop: function () { $("#layoutSave").css('cursor', 'default'); }
                });
            }, 100);
        }
    }
    app.controller('LayoutSaveCtrl', ['$rootScope', '$scope', '$modalInstance',  'arguments', '$timeout', '$filter','gridLayoutService','openPopUpWindowFactory','constantService', ConfirmLayoutSaveCtrl]);
}());