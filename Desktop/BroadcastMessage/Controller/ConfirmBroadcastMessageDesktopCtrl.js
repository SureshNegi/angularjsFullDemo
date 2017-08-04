(function () {
var app = angular.module('MyTimeApp')
var ConfirmBroadcastMsgCtrlFun = function ($rootScope, $scope, $modalInstance, $state, selectedData, broadcastMessageServices, broadcastService) {
    //alert("hi");
    $scope.popUpName = 'ConfirmBroadcastMessage';

    $scope.selectedData = selectedData;
    $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
    $scope.ok = function () {
        $rootScope.errorLogMethod("ConfirmBroadcastMessageDesktopCtrl.$scope.ok");
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        broadcastMessageServices.dismissBroadcastMessage(loginDetail.SESKEY, selectedData.messageid)
               .then(function (response) {
                   if (parseInt(response.DISBROADM_OUT_OBJ.RETCD == 0)) {
                   }


               });
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $rootScope.errorLogMethod("ConfirmBroadcastMessageDesktopCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
        if ($scope.selectedData.isProjectTaskInvalid) {
            broadcastService.notifyloadDesktopActivityProject();
        }
    };
    $scope.isError = false;
    $scope.message = '';
    $scope.init = function () {
        $rootScope.errorLogMethod("ConfirmBroadcastMessageDesktopCtrl.$scope.init");
        $scope.isError = $scope.selectedData.isError;
        $scope.message = $scope.selectedData.message;

    }
}
app.controller('ConfirmBroadcastMessageDesktopCtrl', ['$rootScope', '$scope', '$modalInstance', '$state', 'arguments', 'broadcastMessageServices', 'broadcastService', ConfirmBroadcastMsgCtrlFun]);
}());

