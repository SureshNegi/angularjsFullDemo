(function () {
    var app=angular.module('MyTimeApp');
    var ConfirmBoxCtrl = function ($rootScope, $scope, $modalInstance, $state, selectedData, $timeout, $filter) {
        $scope.popUpName = 'ConfirmMessage';        
        $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
        $scope.okBtnTxt = selectedData.okBtnText === undefined ? $filter('translate')('btn_Ok') : selectedData.okBtnText;
        $scope.noBtnTxt = selectedData.noBtnTxt === undefined ? $filter('translate')('btn_Cancel') : selectedData.noBtnTxt;
        $scope.selectedBtn = 1;
        $scope.ok = function () {
            $rootScope.errorLogMethod("ConfirmBoxCtrl.$scope.ok");
            $scope.selectedBtn = 1;
            $modalInstance.close();
        };
        $scope.cancel = function (changeFocus) {
            $rootScope.errorLogMethod("ConfirmBoxCtrl.$scope.cancel");
            if (changeFocus)
                $scope.selectedBtn = 2;
            $modalInstance.dismiss('cancel');          
        };
        $scope.init = function () {
            $rootScope.errorLogMethod("ConfirmBoxCtrl.$scope.init");
            $scope.msgList = selectedData.msgList;
            bindDraggable();
        }
        var bindDraggable = function () {
            $rootScope.errorLogMethod("ConfirmBoxCtrl.var.bindDraggable");
            $timeout(function () {
                $("#confirmDesktopBox, #confirmDesktopInnerBox").draggable({
                    start: function (event, ui) {
                        if (event.target.id == "confirmDesktopInnerBox")
                            return false;
                        else
                            $("#confirmDesktopBox").css('cursor', 'move');
                    },
                    stop: function () { $("#confirmDesktopBox").css('cursor', 'default'); }
                });
            }, 100);
        }
    }
    app.controller('ConfirmBoxCtrl',['$rootScope', '$scope', '$modalInstance', '$state', 'arguments','$timeout', '$filter', ConfirmBoxCtrl]);
}());