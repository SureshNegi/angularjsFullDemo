/// <reference path="C:\Release2GOSSMYTIME\Mercer.MyTime\Mercer.MyTime.Web\Scripts/ui-bootstrapmultidatepicker-tpls-0.14.1.js" />
angular.module('MyTimeApp')

.controller('loginCtrl', ['$rootScope', '$scope', 'loginService', '$state', 'loadRevenueMonthsServices', '$filter', 'constantService', '$modal', '$cookieStore', '$interval', 'maintenanceService', '$timeout', function ($rootScope, scope, loginService, $state, loadRevenueMonthsServices, $filter, constantService, $modal, $cookieStore, $interval, maintenanceService, $timeout) {
    scope.username = getCookie("savedUsername");
    scope.password = "";
    scope.message = "";
    scope.previousUsername = "";
    scope.isUsernameSaved = getCookie("savedUsername").length > 0;
    scope.lockMessage = "Your username and password are the same as your network username and password. Your network account will be locked after ##count## more unsuccessful login attempt##s##. If you need assistance please contact the service desk.";
    scope.lockedAccountMessage = "Your username and password are the same as your network username and password. Your network account is now locked. You must wait 10 minutes before you can try to access your account again. If you need assistance please contact the service desk.";
    scope.loginNote = "Login using your network username and password.";
    scope.clientType = "iPhone";
    scope.defaultPassword = "mercer";
    scope.nonADPassError = "Access Denied. Please change your password on the desktop version of myTime.";
    scope.applicationVersion = constantService.APPVERSION;
    if (localStorage.getItem('Initial_Data') != null) {
        $rootScope.displayUsername = JSON.parse(localStorage.getItem('Initial_Data')).EMPL_REC.FNAME + " " +JSON.parse(localStorage.getItem('Initial_Data')).EMPL_REC.LNAME;
    }

    scope.sessionExpire = "";
    scope.enableLoginFlag = true;

    isMobile = {
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        BB: function () {
            return navigator.userAgent.match(/BB/);
        },
        iPhone: function () {
            return navigator.userAgent.match(/iPhone/i);
        },
        iPad: function () {
            return navigator.userAgent.match(/iPad/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    scope.getClientType = function () {
        if (isMobile.iPhone()) return "iPhone";
        else if (isMobile.iPad()) return "iPad";
        else if (isMobile.BlackBerry()) return "BlackBerry";
        else if (isMobile.BB()) return "BlackBerry";
        else return "Other";
    }

    scope.IsValue = function () {
        $rootScope.errorLogMethod("loginCtrl.scope.IsValue");
        if ((scope.username != "") & (scope.password != "")) {
            scope.enableLoginFlag = false;
            $('#loginbtn').removeAttr("disabled")
        }
        else {
            scope.enableLoginFlag = true;
            $('#loginbtn').attr("disabled", true);
        }

    }
    scope.resetField = function () {
        scope.username = "";
        scope.IsValue();
    }

    scope.checkDisable = function () {
        $rootScope.errorLogMethod("loginCtrl.scope.checkDisable");
        return scope.enableLoginFlag;
    }
    scope.getVersion = function () {
        return 'Version: ' + constantService.APPVERSION;
    }

    function getCookie(cname) {
        $rootScope.errorLogMethod("loginCtrl.getCookie");
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    scope.rememberUsername = function () {
        $rootScope.errorLogMethod("loginCtrl.scope.rememberUsername");
        var remember = $('#rmembrChck').is(':checked');
        if (!remember) {


            document.cookie = "savedUsername" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
    var createDate = function (dteStr) {
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }

    var createDateTime = function (dateStr) {
        if (dateStr != undefined && dateStr != null) {
            dateStr = dateStr.trim();
            var parts = dateStr.split("-");
            var day = parts[2].split(' ');
            var time = day[1].split(':')
            return new Date(parts[0], parts[1] - 1, day[0], time[0], time[1], time[2]);
        }
        else
            return new Date();
    }

    var updateInitialData = function () {
        var date = new Date();
        var cDate = $filter('date')(date, "yyyy-MM-dd");
        var cDteFinal = createDate(cDate);
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, cDate, function (response) {
            var revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
            var selObj = null;
            if (revMnthRange != null) {
                for (var i = 0; i < revMnthRange.length; i++) {
                    if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                        if (cDteFinal >= createDate(revMnthRange[i].STRTDTE) && cDteFinal <= createDate(revMnthRange[i].ENDDTE)) {
                            selObj = revMnthRange[i];
                            break;
                        }
                    }
                }
                if (selObj != null) {
                    var tEBillData = $rootScope.GetInitialDetail(false, true);
                    tEBillData.REVM_REC.REVM = selObj.REVM;
                    tEBillData.REVM_REC.STRTDTE = selObj.STRTDTE;
                    tEBillData.REVM_REC.ENDDTE = selObj.ENDDTE;
                    tEBillData.REVM_REC.TECUTTOFF = selObj.TECUTTOFF;
                    localStorage.setItem('Initial_Data', JSON.stringify(tEBillData));
                }
            }


        })

    }
    scope.loadRevenueMonths = function () {
        $rootScope.errorLogMethod("loginCtrl.scope.loadRevenueMonths");
        var cDate = new Date();
        cDate = $filter('date')(cDate, "yyyy-MM-dd");
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, cDate, function (response) {
            var revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
            localStorage.setItem('Revenue_Months', JSON.stringify(revMnthRange));
        })
    }
    scope.login = function () {
        $rootScope.errorLogMethod("loginCtrl.scope.login");
        $rootScope.expandedEntries = [];
        $rootScope.collapsedEntries =[];
        $rootScope.cntrExpandCollapse = 0;
        var usernameChanged = escape(scope.username);
        $rootScope.globals = $cookieStore.get('globals') || {};
        if (localStorage.getItem("isLoggedIn") != null && localStorage.getItem("isLoggedIn") == "true" && localStorage.getItem('Login_Detail') != null && $rootScope.globals.currentUser && $rootScope.globals.currentUser.username.toLowerCase() != usernameChanged.toLowerCase()) {
            scope.message = "Can not proceed further as another user is already logged in.";
            return;
        }
        loginService.ClearCredentials();
        $rootScope.ClearLocalStorage(true);
        var attempts = 0;
        if (localStorage.getItem(scope.username + '_attempts') != null)
            attempts = localStorage.getItem(scope.username + '_attempts');

        localStorage.setItem(scope.username + '_attempts', attempts);
        var uAgent = escape(navigator.userAgent);
        uAgent = uAgent.substring(0, 100);
        loginService.login(usernameChanged, scope.password, scope.getClientType(), scope.applicationVersion, uAgent, function (data) {
            $rootScope.displayUsername = scope.username;
            scope.nonStepupMsg = '';
            scope.message = '';
            if (parseInt(data.LOGIN_OUT_OBJ.RETCD) == 4) {
                maintenanceService.maintenanceNotification(data.LOGIN_OUT_OBJ.ERRMSG);
            }
            else if (parseInt(data.LOGIN_OUT_OBJ.RETCD) == 0) {
                localStorage.removeItem(scope.username + '_attempts');
                //if (angular.lowercase(scope.password) == scope.defaultPassword) {
                //    scope.message = scope.nonADPassError;
                //    loginService.logout(data.LOGIN_OUT_OBJ.SESKEY, uAgent, function (data) {
                //        $rootScope.ClearLocalStorage(true);
                //    });
                //}
                // else {
                localStorage.setItem('Login_Detail', JSON.stringify(data.LOGIN_OUT_OBJ));
                scope.LOGIN_OUT_OBJ = data.LOGIN_OUT_OBJ;

                loginService.retrieveInitialData(data.LOGIN_OUT_OBJ.SESKEY, data.LOGIN_OUT_OBJ.EMPLID).then(function (response) {
                    var isDefaultPassword = (angular.lowercase(scope.password) == scope.defaultPassword);
                    if (!isDefaultPassword && parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                        localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                        localStorage.removeItem('Revenue_Months');
                        scope.loadRevenueMonths();
                        localStorage.setItem('InitialRev_Month', JSON.stringify(response.RETINIT_OUT_OBJ));
                        var startdate = new Date(response.RETINIT_OUT_OBJ.REVM_REC.STRTDTE);
                        var enddate = new Date(response.RETINIT_OUT_OBJ.REVM_REC.ENDDTE);
                        var currDate = new Date();
                        var tEBillData = $rootScope.GetInitialDetail(false, true);
                        var tEBill = tEBillData.COMP_REC.LCKSTAT;
                        if (tEBill == 'Y') {
                            $rootScope.ClearLocalStorage(true);
                            scope.message = "Time Recording is not available at this time.";
                        }
                        else {
                            var remember = $('#rmembrChck').is(':checked');
                            if (remember) {
                                var expires = new Date();
                                expires.setTime(expires.getTime() + 31536000000);  
                                document.cookie = 'savedUsername =' + scope.username + ';expires=' + expires.toUTCString();
                            }
                            else {
                                document.cookie = "savedUsername" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                            }
                            loginService.SetCredentials(usernameChanged, scope.password);
                            localStorage.setItem("isLoggedIn", "true");
                            if (navigator.userAgent.match(/BB/i) || navigator.userAgent.match(/BlackBerry/i))
                                $timeout(function () { $state.go('Main'); }, 1250);
                            else
                                $timeout(function () { $state.go('Main'); }, 500);
                        }

                    }
                    else if (response.RETINIT_OUT_OBJ.ERRMSG.trim() != "") {
                        scope.nonStepupMsg = response.RETINIT_OUT_OBJ.ERRMSG;
                    }
                    else if (isDefaultPassword) {
                            
                        scope.message = scope.nonADPassError;
                        loginService.logout(data.LOGIN_OUT_OBJ.SESKEY, uAgent, function (data) {
                            $rootScope.ClearLocalStorage(true);
                        });
                    }
                });
            }
                // }
            else if (data.LOGIN_OUT_OBJ.ERRMSG.trim() != "") {
                var isInvalidPassword = data.LOGIN_OUT_OBJ.ERRMSG.toLowerCase().indexOf("[52e]") > -1 ? true : false;
                var isAccountLocked = data.LOGIN_OUT_OBJ.ERRMSG.toLowerCase().indexOf("[775]") > -1 ? true : false;
                var attempts1 = localStorage.getItem(scope.username + '_attempts');
                var attemptsCount = parseInt(attempts1);

                if (isInvalidPassword)
                    attemptsCount = (parseInt(attempts) + 1);

                localStorage.removeItem(scope.username + '_attempts');
                localStorage.setItem(scope.username + '_attempts', attemptsCount);

                var lockoutMessage = scope.lockMessage;

                if (isAccountLocked) {
                    localStorage.removeItem(scope.username + '_attempts');
                    localStorage.setItem(scope.username + '_attempts', 0);
                    scope.message = scope.lockedAccountMessage;
                }
                else if (attemptsCount == 1 && isInvalidPassword) {
                    scope.message = lockoutMessage.replace("##count##", "5").replace("##s##", "s");
                }
                else if (attemptsCount == 2 && isInvalidPassword) {
                    scope.message = lockoutMessage.replace("##count##", "4").replace("##s##", "s");
                }
                else if (attemptsCount == 3 && isInvalidPassword) {
                    scope.message = lockoutMessage.replace("##count##", "3").replace("##s##", "s");
                }
                else if (attemptsCount == 4 && isInvalidPassword) {
                    scope.message = lockoutMessage.replace("##count##", "2").replace("##s##", "s");
                }
                else if (attemptsCount == 5 && isInvalidPassword) {
                    scope.message = lockoutMessage.replace("##count##", "1").replace("##s##", "");
                }
                else if (attemptsCount == 6 && isInvalidPassword) {
                    localStorage.removeItem(scope.username + '_attempts');
                    localStorage.setItem(scope.username + '_attempts', 0);
                    scope.message = scope.lockedAccountMessage;
                }
                else {
                    scope.message = data.LOGIN_OUT_OBJ.ERRMSG;
                }
            }
        });
    };
    //Sangeeta -logout functionality
    scope.logout = function () {
        var uAgent = escape(navigator.userAgent);
        uAgent = uAgent.substring(0, 100);
        $rootScope.isPanelOpen = false;
        $rootScope.isCallAtInterval = false;
        $rootScope.expandedEntries = [];
        $rootScope.collapsedEntries = [];
        $rootScope.cntrExpandCollapse = 0;
        $interval.cancel($rootScope.callBroadcastAtInterval);
        $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
        $rootScope.isCallBroadcastAtInterval = false;
        $rootScope.errorLogMethod("loginCtrl.scope.logout");
        var loginDtls = $rootScope.GetLoginDetail(true, true);
        loginService.ClearCredentials();
        loginService.logout(loginDtls.SESKEY, uAgent, function (data) {
            if (parseInt(data.LOGOUT_OUT_OBJ.RETCD) == 0) {
                $rootScope.ClearLocalStorage(true);
                $state.go('login');
            }
            else {
                $rootScope.ClearLocalStorage(true);
                $state.go('login');
            }

        });
    };

    scope.$on("sessionExpire", function (event, args) {
        if ($rootScope.isTimeOut)
        {
            $rootScope.isTimeOut = false;
            $state.go('login');

        }
    });
    scope.$on("maintenanceNotificationBroadcast", function (event, args) {
        $rootScope.errorLogMethod("loginCtrl.scope.$on.maintenanceNotificationBroadcast");
        var msgMaintenance = args.value;
        maintenanceService.maintenanceNotification(msgMaintenance);
    });
    //Sangeeta -logout functionality
    scope.sessionExpireOk = function () {
        if (!$rootScope.isTimeOut) {
            sessionOut();
        }
        $rootScope.isTimeOut = false;
        $state.go('login');
    };

    scope.sessionExpireInit = function () {
        angular.element(document.getElementsByClassName('modal-dialog')).addClass("positionTop");
        angular.element(document.getElementsByClassName('modal-content')).addClass("mcontent");
        if ($rootScope.isTimeOut) {
            scope.sessionExpire = $filter('translate')('msg_SessionExpire');
            $rootScope.isCallAtInterval = false;//"Your session has expired and you will need to login again. Please click OK to be redirected to the login page.";
            sessionOut();
        }
        else {
            $rootScope.isCallAtInterval = false;
            scope.sessionExpire = $filter('translate')('msg_SessionInvalid');//"Your session has become invalid. Please click OK to be redirected to the login page.";
        }

    }

    var sessionOut = function () {

        var uAgent = escape(navigator.userAgent);
        uAgent = uAgent.substring(0, 100);
        $rootScope.isPanelOpen = false;
        $rootScope.errorLogMethod("loginCtrl.scope.logout");
        var loginDtls = $rootScope.GetLoginDetail(true, false); // JSON.parse(localStorage.getItem('Login_Detail'));
        if (loginDtls != null) {
            $interval.cancel($rootScope.callBroadcastAtInterval);
            $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
            $rootScope.isCallBroadcastAtInterval = false;
            loginService.ClearCredentials();
            loginService.logout(loginDtls.SESKEY, uAgent, function (data) {
                if (parseInt(data.LOGOUT_OUT_OBJ.RETCD) == 0) {
                    $rootScope.ClearLocalStorage(true);

                }
                else {
                    $rootScope.ClearLocalStorage(true);

                }

            });
        }
    }

}])

.controller('Preference', ['$rootScope', '$scope', '$modalInstance', '$state', 'selectedData', 'preferencesService', '$filter', 'loginService', function ($rootScope, $scope, $modalInstance, $state, selectedData, preferencesService, $filter, loginService) {

    $scope.popUpName = 'Preference';
    $scope.selectedData = selectedData;

    $scope.ok = function () {
        $rootScope.errorLogMethod("Preference.$scope.ok");
        $modalInstance.close();
    };

    $scope.isfocus = false;

    $scope.cancel = function () {
        $rootScope.errorLogMethod("Preference.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };

    $scope.setFocus = function () {
        isfocus = true;
    }

    $scope.view = {
        selected: null,
        list: []
    };
    $scope.language = {
        selected: null,
        list: []
    };
    $scope.detail = {
        selected: null,
        list: []
    };

    var getUsrPrefObjFrmArray = function (arr, keys) {
        var result = [];
        for (var i = 0; i < keys.length; i++) {
            var obj = $.grep(arr, function (e) {
                return e.KEY == keys[i];
            });
            result.push(obj);
        }
        return result;
    }
    var getUsrPrefObjFrmArray2 = function (arr, keys) {
        var result = [];
        if (arr != null && arr != undefined) {
            if (Object.prototype.toString.call(arr) != '[object Array]') {
                var data = arr;
                arr = [];
                arr.push({ KEY: data.PREF_OBJ.KEY, VAL: data.PREF_OBJ.VAL });
            }
            for (var i = 0; i < keys.length; i++) {
                var obj = angular.fromJson(arr).filter(function (item) {
                    if (item != null) {
                        if (item.KEY == keys[i]) {
                            return true;
                        }
                    }
                });
                if (obj != undefined && obj != null && obj.length > 0)
                    result.push({ KEY: obj[0].KEY, VAL: obj[0].VAL });
            }
        }
        return result;
    }

    var traslateValue = function (item, key) {
        var item = (angular.lowercase(item));
        if (key == 'lang') {
            if (Number(item.indexOf("fr_ca")) >= Number(0)) {
                return $filter('translate')('lbl_French');
            }
            else {
                return $filter('translate')('lbl_English');
            }
        }
        else if (key == 'view') {
            if (item.indexOf("week") < 0) {
                return $filter('translate')('lbl_Daily');
            }
            else {
                return $filter('translate')('lbl_Weekly');
            }
        }
        else if (key == 'prefDetail') {
            if (Number(item.indexOf("collapsed")) >= Number(0)) {
                return $filter('translate')('lbl_Collapsed');
            }
            else {
                return $filter('translate')('lbl_Expanded');
            }
         
        }

        
    }

    $scope.init = function () {
        $rootScope.errorLogMethod("Preference.$scope.init");
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        var keys=["INITIAL_TAB","INITIAL_DETAIL"];
        if ($scope.loginDetail == undefined) return;
        var prefAr = null;
        loginService.retrieveInitialData($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID).then(function (response1) {           
            if (parseInt(response1.RETINIT_OUT_OBJ.RETCD) == 0) {
                prefAr = getUsrPrefObjFrmArray2(response1.RETINIT_OUT_OBJ.PREF_ARR, keys);
            }
       
            preferencesService.loadGlobalPreferences($scope.loginDetail.SESKEY).then(function (response) {
                if (parseInt(response.GLBPREF_OUT_OBJ.RETCD) == 0) {
                    var viewPref = getUsrPrefObjFrmArray(response.GLBPREF_OUT_OBJ.GLBPREF, keys);
                    if (viewPref.length > 0) {
                        for (var i = 0; i < viewPref.length; i++) {
                            if (viewPref[i].length > 0) {
                                var data = viewPref[i];
                                switch (i) {
                                    case 0: {
                                        var obj = getUsrPrefObjFrmArray2(prefAr, [keys[0]])[0];
                                        for (var j = 0; j < data[0].KEYVAL_ARR.length; j++) {
                                            data[0].KEYVAL_ARR[j].KEYVALDESC = traslateValue(data[0].KEYVAL_ARR[j].KEYVAL, 'view')
                                            $scope.view.list.push(data[0].KEYVAL_ARR[j]);
                                            if ($scope.view.selected == null) {
                                                if (obj != undefined && obj != null) {
                                                    if (angular.uppercase(data[0].KEYVAL_ARR[j].KEYVAL) == angular.uppercase(obj.VAL)) {
                                                        $scope.view.selected = data[0].KEYVAL_ARR[j].KEYVAL;
                                                    }
                                                }
                                                else if (angular.uppercase(data[0].KEYVAL_ARR[j].DEF) == "Y") {
                                                    $scope.view.selected = data[0].KEYVAL_ARR[j].KEYVAL;
                                                }
                                            }
                                        }
                                        break;
                                    }
                                        //case 1: {
                                        //    for (var j = 0; j < data[0].KEYVAL_ARR.length; j++) {
                                        //        data[0].KEYVAL_ARR[j].KEYVALDESC = traslateValue(data[0].KEYVAL_ARR[j].KEYVAL, 'lang')
                                        //        $scope.language.list.push(data[0].KEYVAL_ARR[j]);
                                        //        if (angular.uppercase($scope.selectedData.viewPref.language) == angular.uppercase(data[0].KEYVAL_ARR[j].KEYVAL)) {
                                           
                                        //            $scope.language.selected = data[0].KEYVAL_ARR[j].KEYVAL;
                                        //        }
                                        //    }
                                        //    break;
                                        //}
                                    case 1: {
                                        var obj = getUsrPrefObjFrmArray2(prefAr, [keys[1]])[0];
                                        for (var j = 0; j < data[0].KEYVAL_ARR.length; j++) {
                                            data[0].KEYVAL_ARR[j].KEYVALDESC = traslateValue(data[0].KEYVAL_ARR[j].KEYVAL, 'prefDetail')
                                            $scope.detail.list.push(data[0].KEYVAL_ARR[j]);
                                            if ($scope.detail.selected == null) {
                                                if (obj != undefined && obj != null) {
                                                    if (angular.uppercase(data[0].KEYVAL_ARR[j].KEYVAL) == angular.uppercase(obj.VAL)) {
                                                        $scope.detail.selected = data[0].KEYVAL_ARR[j].KEYVAL;
                                                    }
                                                }
                                                else if (angular.uppercase(data[0].KEYVAL_ARR[j].DEF) == "Y") {
                                                    $scope.detail.selected = data[0].KEYVAL_ARR[j].KEYVAL;
                                                }

                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    };
 
 
    $scope.save = function () {
        var viewData = {
            KEY: "INITIAL_TAB",
            VAL: $scope.view.selected
        }

        var detail={
            KEY: "INITIAL_DETAIL",
            VAL: $scope.detail.selected
        }

        var data = [];
        data.push(viewData);
        data.push(detail);

        var dataList = {
            PREF_OBJ: data
        };

        var data = JSON.stringify(dataList);
        preferencesService.savePreferences($scope.loginDetail.SESKEY, data).then(function (response) {
            $scope.ok();

        });
    }

}])

.controller('ErrorPopup', ['$rootScope', '$scope', '$modalInstance', '$state', 'selectedData', function ($rootScope, $scope, $modalInstance, $state, selectedData) {

    $scope.popUpName = 'ErrorPopup';
    $scope.selectedData = selectedData;
    $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
    $scope.ok = function () {
        $rootScope.errorLogMethod("ErrorPopup.$scope.ok");
        $modalInstance.close();
    };


    $scope.cancel = function () {
        $rootScope.errorLogMethod("ErrorPopup.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };
    $scope.isError = false;
    $scope.message = '';
    $scope.init = function () {
        var messageAr = [];
        $rootScope.errorLogMethod("ErrorPopup.$scope.init");
        angular.element(document.getElementsByClassName('modal-dialog')).addClass("positionTop");
        angular.element(document.getElementsByClassName('modal-content')).addClass("mcontent");
        $scope.isError = $scope.selectedData.isError;
        
        if (Object.prototype.toString.call($scope.selectedData.message) !== '[object Array]') {
            messageAr[0] = $scope.selectedData.message;
        }
        else {
            messageAr = $scope.selectedData.message;
        }
        $scope.message = messageAr;
    }
}])

.controller('ConfirmMessage', ['$rootScope', '$scope', '$modalInstance', '$state', 'selectedData', function ($rootScope, $scope, $modalInstance, $state, selectedData) {

    $scope.popUpName = 'ConfirmMessage';

    $scope.selectedData = selectedData;
    $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
    $scope.ok = function () {
        $rootScope.errorLogMethod("ConfirmMessage.$scope.ok");
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $rootScope.errorLogMethod("ConfirmMessage.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };
    $scope.isError = false;
    $scope.message = '';
    $scope.init = function () {
        $rootScope.errorLogMethod("ConfirmMessage.$scope.init");
        angular.element(document.getElementsByClassName('modal-dialog')).addClass("positionTop");
        $scope.isError = $scope.selectedData.isError;
        $scope.message = $scope.selectedData.message;
        $scope.isDailyModeOption = $scope.selectedData.isDailyModeOption;

    }
}])

.controller('DescriptionCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'cepService', '$state', 'selectedData', '$window', 'commonUtilityService', function ($rootScope, $filter, $scope, $modalInstance, cepService, $state, selectedData, $window, commonUtilityService) {
    $scope.popUpName = 'Description';
    $scope.hideValidation = true;
    $scope.hideLngValidMsg = true;
    $scope.maxCharLen = 200;
    $scope.valdMsg = '';
    $scope.LngvaldMsg = '';
    $scope.domainURL = "";
    $scope.loginDetail = null;
    $scope.initialDetail = null;
    $scope.description = [];
    $scope.descriptionList = [];
    $scope.ok = function (selectedItem) {
        var item = JSON.parse(selectedItem);
        var selectedItem = {
            data: item.data,
            fav: $scope.selectedData.IsActivity ? item.fav : false
        }

        $modalInstance.close(selectedItem);
    };
    $scope.defDesc = '';
    $scope.selectedData = selectedData;
    $scope.favDesc = false;

    $scope.cancel = function () {
        $rootScope.errorLogMethod("DescriptionCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.valdMsg = $filter('translate')('msg_DesRequired');
        $scope.LngvaldMsg = 'Description must be between 1 and 200 characters.';
        $rootScope.errorLogMethod("DescriptionCtrl.$scope.init");
        $scope.domainURL = $rootScope.domainURL;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.defDesc = $scope.selectedData.desc == null ? '' : $scope.selectedData.desc;
        if ($scope.selectedData.desc != null) { $scope.setFav($scope.selectedData.desc); }
        $scope.getFavDescription();
    }

    $scope.getFavDescription = function () {
        $rootScope.errorLogMethod("DescriptionCtrl.$scope.getFavDescription");
        $scope.descriptionList = [];
        var desc = (localStorage.getItem('DescFav'));
        if ((desc == '') || (desc == null)) {
            cepService.retrieveDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
                .then(function (response) {
                    if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                        if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                            var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                            response.RETDESCFAV_OUT_OBJ.DESTXT_ARR = [];
                            if (data != null && data.VARCHAR2 != undefined)
                                response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                        }

                        $scope.description = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;


                        if ($scope.description.length > 0) {
                            $scope.description.sort();

                        }
                        for (var i = 0; i < $scope.description.length; i++) {
                            var item = {
                                data: $scope.description[i],
                                fav: true
                            };
                            $scope.descriptionList.push(item);
                        }
                        if ($scope.descriptionList.length == 0) {
                            angular.element(document.getElementById('divNoRecord')).show();
                        }
                        else {
                            angular.element(document.getElementById('divNoRecord')).hide();
                        }

                    }
                    localStorage.setItem('DescFav', JSON.stringify($scope.description));

                });
        }
        else {
            $scope.description = JSON.parse(desc);
            if ($scope.description.length > 0) {
                $scope.description.sort();

            }
            for (var i = 0; i < $scope.description.length; i++) {
                var item = {
                    data: $scope.description[i],
                    fav: true
                };
                $scope.descriptionList.push(item);
            }
            if ($scope.descriptionList.length == 0) {
                angular.element(document.getElementById('divNoRecord')).show();
            }
            else {
                angular.element(document.getElementById('divNoRecord')).hide();
            }

        }

    };

    $scope.rowSelected = function (desc) {
      
        $rootScope.errorLogMethod("DescriptionCtrl.$scope.rowSelected");
        if ($scope.selectedData.IsActivity) {
            $scope.favDesc = desc.fav;
            $scope.sendDescBack(desc);
        }
        else {

            angular.element(document.getElementById("defDesc")).val(desc.data).trigger('input');
            angular.element(document.getElementById("btnOk")).focus();  
           
            // $scope.favDesc = true;
            var isContinue = true;
            for (var i = 0; i < $scope.description.length; i++) {
                if (desc.data == $scope.description[i]) {
                    $scope.favDesc = true;
                    isContinue = false;
                    break;
                }
            }
            if (isContinue) { $scope.favDesc = false; }
        }
    }
    $scope.sendDescBack = function (desc) {
        $rootScope.errorLogMethod("DescriptionCtrl.$scope.sendDescBack");
        if ((desc.data != null) && (desc.data.trim() != "")) {
            $scope.ok(JSON.stringify(desc));
        }
    }

    $scope.sendDesc = function (desc) {
        $rootScope.errorLogMethod("DescriptionCtrl.$scope.sendDesc");
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
    // Code for desc Fav 
    $scope.setFav = function (val) {
        if (typeof val == 'undefined') {
            val = angular.element(document.getElementById("defDesc")).val().trim();
        }

        if (val.length == 0) $scope.favDesc = false;
        if (val.length > 0) {
            val=$scope.defDesc = removeEmoji(val);
            if (!checkDescFav(val, false)) {
                $scope.favDesc = false;
            }
            if (val.length < 200) {
                $scope.hideLngValidMsg = true;
            }
        }
    }

    // Check if desc already exist in desc fav list
    var checkDescFav = function (val, isList) {
        if (($scope.description.length == 0) && ($scope.descriptionList.length == 0)) {
            $scope.getFavDescription();
        }
        var isContinue = false;
        for (var i = 0; i < $scope.description.length; i++) {
            if (val == $scope.description[i]) {
                if (!isList)
                { $scope.favDesc = true; }
                isContinue = true;
                break;
            }
        }
        return isContinue;
    }

    // Add description
    $scope.addDescriptionFavorite = function (isList, des, $event) {
        var val = '';
        if (!isList) {
            val = angular.element(document.getElementById("defDesc")).val().trim();
            val=commonUtilityService.removeSpecialCharFromStr(val, 0);
        }
        else {
            val = des.data.trim();
        }
        if (val.length == 0)
            return;
        $event.preventDefault();
        $event.stopPropagation();
        if (!checkDescFav(val, isList)) {
            cepService.addDescriptionFavorite($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify(val)).then(function (response) {
                if (response.ADDDESCFAV_OUT_OBJ.RETCD == 0) {
                    localStorage.removeItem('DescFav');

                    if (!isList) {
                        $scope.getFavDescription();
                        $scope.favDesc = true;
                    }
                    else {
                        $scope.description.push(des.data);
                        localStorage.setItem('DescFav', JSON.stringify($scope.description));
                        des.fav = true;
                        if ((!$scope.selectedData.IsActivity) && (angular.element(document.getElementById("defDesc")).val() != "")) {
                            $scope.setFav();
                        }
                    }

                }
            });
        }
        else {
            var msg = $filter('translate')('msg_DuplicateDescription');
        }
    };

    // Remove description
    $scope.removeDescriptionFavorites = function (isList, des, $event, $index) {
        var val = '';
        if (!isList) {
            val = angular.element(document.getElementById("defDesc")).val().trim();
            val = commonUtilityService.removeSpecialCharFromStr(val, 0);
        }
        else {
            val = des.data;
        }
        if (val.length == 0)
            return;
        var data = {
            "VARCHAR2": [val]
        };
        $event.preventDefault();
        $event.stopPropagation();
        var destxt_arr = JSON.stringify(data);
        if (checkDescFav(val, isList)) {
            cepService.removeDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, destxt_arr).then(function (response) {

                if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                    localStorage.removeItem('DescFav');
                    if (!isList) {
                        $scope.getFavDescription();
                        $scope.favDesc = false;
                    }
                    else {

                        for (var i = 0; i < $scope.description.length; i++) {
                            if ($scope.description[i] == val) {
                                $scope.description.splice(i, 1);
                            }
                        }


                        localStorage.setItem('DescFav', JSON.stringify($scope.description));
                        des.fav = false;
                        if ((!$scope.selectedData.IsActivity) && (angular.element(document.getElementById("defDesc")).val() != "")) {
                            $scope.setFav();
                        }

                    }
                }
            });
        }
        else {
            $scope.favDesc = false;
        }
    };


}])



.controller('ActivityCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'activityService', '$state', '$timeout', 'selectedData', function ($rootScope, $filter, $scope, $modalInstance, activityService, $state, $timeout, selectedData) {

    $scope.popUpName = 'Activity';
    $scope.isFavActivityOn = true;

    $scope.domainURL = "";
    $scope.loginDetail = null;
    $scope.initialDetail = null;
    $scope.activityList = [];
    $scope.favActivityObj = [];
    $scope.selectedData = selectedData;
    $scope.isSameCompany = false;
    $scope.ActivityFavList = [];
    $scope.isLoaded = false;
    $scope.ok = function (selectedItem) {
        $modalInstance.close(selectedItem);
    };

    $scope.cancel = function () {
        $rootScope.errorLogMethod("ActivityCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };

    $scope.initActivity = function () {
        $rootScope.errorLogMethod("ActivityCtrl.$scope.initActivity");
        $scope.domainURL = $rootScope.domainURL;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        if ($scope.selectedData.compId == $scope.initialDetail.COMP_REC.COMPID) {
            $scope.isSameCompany = true;
            $scope.isFavActivityOn = false;
            $scope.getFavActivity();
        }
        else {
            $scope.isFavActivityOn = true;
            $scope.isSameCompany = false;
            $scope.getAllActivity();
        }
    }


    //Get the favourite cep code from API
    $scope.getFavActivity = function () {
        $rootScope.errorLogMethod("ActivityCtrl.$scope.getFavActivity");

        if ($scope.selectedData.compId == $scope.initialDetail.COMP_REC.COMPID) {
            $scope.isSameCompany = true;
            activityService.retrieveActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
                .then(function (response) {
                    $scope.isFavActivityOn = true;
                    $scope.isLoaded = true;
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
                    var itemArLen = 0;
                    $scope.favActivityObj = [];
                    $scope.ActivityFavList = [];
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].STAT == 'Y') {

                                items[i].index = itemArLen;
                                items[i].fav = true;
                                $scope.favActivityObj.push(items[i]);
                                $scope.ActivityFavList.push(items[i]);
                                itemArLen++;
                            }
                        }
                    }
                    if ($scope.ActivityFavList.length == 0) angular.element(document.getElementById('divNoRecord')).show();
                    else { angular.element(document.getElementById('divNoRecord')).hide(); }
                    localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));
                });

        }
        else {
            $scope.isFavActivityOn = true;
            $scope.favActivityObj = [];
            $scope.ActivityFavList = [];
            angular.element(document.getElementById('divNoRecord')).show();

        }

    };

    $scope.sendFavDataBack = function (index) {
        $rootScope.errorLogMethod("ActivityCtrl.$scope.sendFavDataBack");
        $scope.ok(($scope.favActivityObj[index]));
    }

    $scope.getAllActivity = function () {
        $rootScope.errorLogMethod("ActivityCtrl.$scope.getAllActivity");
        activityService.searchActivityCode($scope.loginDetail.SESKEY, $scope.selectedData.compId, $scope.domainURL).then(function (response) {
            if (response.LOADACTI_OUT_OBJ.RETCD == 0) {
                $scope.isFavActivityOn = false;
                $scope.isLoaded = true;
                if (response.LOADACTI_OUT_OBJ.ACTI_ARR != null) {
                    if (Object.prototype.toString.call(response.LOADACTI_OUT_OBJ.ACTI_ARR) != '[object Array]') {
                        var data = response.LOADACTI_OUT_OBJ.ACTI_ARR;
                        response.LOADACTI_OUT_OBJ.ACTI_ARR = [];
                        if (data != null)
                            response.LOADACTI_OUT_OBJ.ACTI_ARR.push(data.ACTI_OBJ);
                    }
                }
                var items = response.LOADACTI_OUT_OBJ.ACTI_ARR;
                var itemArLen = 0;
                $scope.favActivityObj = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].STAT == 'Y') {
                        items[i].index = itemArLen;
                        items[i].fav = checkActivityFac(items[i]);
                        $scope.favActivityObj.push(items[i]);
                        itemArLen++;
                    }
                }

                if ($scope.favActivityObj.length == 0) {
                    angular.element(document.getElementById('divNoRecord')).show();
                }
                else {
                    angular.element(document.getElementById('divNoRecord')).hide();

                }


            }
        });
    }

    // check Activity Fav
    var checkActivityFac = function (activity) {
        var isFind = false;
        if ($scope.isSameCompany) {
            for (var j = 0; j < $scope.ActivityFavList.length; j++) {
                if ($scope.ActivityFavList[j].ACTICD == activity.ACTICD) {
                    isFind = true; break;
                }
            }
        }
        return isFind;
    }


    // Add Activity Fav
    $scope.addActivityFavorited = function (activity, $event) {
        if (activity == null) return;
        var data = {
            "VARCHAR2": [activity.ACTICD.toString()]
        };
        var act_arr = JSON.stringify(data);
        $event.preventDefault();
        $event.stopPropagation();
        if ((!checkActivityFac(activity)) && ($scope.isSameCompany)) {
            activityService.addActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.ADDACTIFAV_OUT_OBJ.RETCD == 0) {
                    activity.fav = true;
                    localStorage.removeItem('ActivityFav');
                    $scope.ActivityFavList.push(activity);
                    localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));
                }

            });
        }
        else {
            activity.fav = true;
        }

    };


    // Remove Activity from Fav

    $scope.removeActivityFavorites = function (activity, $event) {
        if (activity == null) return;
        var data = {
            "VARCHAR2": [activity.ACTICD.toString()]
        };
        var act_arr = JSON.stringify(data);
        $event.preventDefault();
        $event.stopPropagation();
        if ((checkActivityFac(activity)) && ($scope.isSameCompany)) {
            activityService.removeActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.REMACTIFAV_OUT_OBJ.RETCD == 0) {
                    activity.fav = false;
                    localStorage.removeItem('ActivityFav');
                    for (var i = 0; i < $scope.ActivityFavList.length; i++) {
                        if ($scope.ActivityFavList[i].ACTICD == activity.ACTICD) {
                            $scope.ActivityFavList.splice(i, 1);

                        }
                    }
                    localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));

                }

            });
        }
        else {
            activity.fav = true;
        }

    };


}])

.controller('FavSearchCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', 'cepService', 'projectComponetService', 'activityService', 'loadICRates', '$state', '$rootScope', '$timeout', 'selectedData', function ($rootScope, $filter, $scope, $modalInstance, cepService, projectComponetService, activityService, loadICRates, $state, $rootScope, $timeout, selectedData) {
    $scope.popUpName = 'FavSearch';
    $scope.isDesFocused = false;
    $scope.domainURL = "";
    $scope.PageNumber = 1;
    $scope.DataPerPage = 10;
    $scope.TotalPages = 1;
    $scope.loginDetail = null;
    $scope.initialDetail = null;
    $scope.findCepCode = '';
    $scope.selectedData = selectedData;
    $scope.isFavSearchOn = true;
    $scope.showButton = false;
    $scope.ldingData = '';
    $scope.noMoreData = ''

    var SearchRslt = function () {
        this.items = [];
        this.busy = true;
        this.after = '';
        this.pageNumber = 1;
        this.loadMsg = 'Search Results . . .'

    };
    $scope.favCEPlObj = new SearchRslt();
    SearchRslt.prototype.nextPage = function () {
        $rootScope.errorLogMethod("FavSearchCtrl.SearchRslt.prototype.nextPage");
        if (this.busy) { return false; }
        else {

            this.busy = true;
            $timeout(function () { $scope.$broadcast('update_find_result'); }, 1000);
            $scope.searchRslObj.loadMsg = $scope.ldingData;


        }
    };

    $scope.ok = function (selectedItem) {
        $rootScope.errorLogMethod("FavSearchCtrl.$scope.ok");
        $modalInstance.close(selectedItem);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    /*get faourite cep -- start*/

    //on loading template
    $scope.isPageLoaded = false;
    $scope.initGetFavCEP = function () {
        $rootScope.errorLogMethod("FavSearchCtrl.$scope.initGetFavCEP");
        $scope.ldingData = $filter('translate')('msg_LdingData');
        $scope.noMoreData = $filter('translate')('msg_NoMoreData');
        $scope.domainURL = $rootScope.domainURL;
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.findCepCode = $scope.selectedData.cepCode;

        if ($scope.findCepCode.length == 9) {
            $scope.findCepCode = $scope.findCepCode.substring(0, 6) + '-' + $scope.findCepCode.substring(6, 9);
        }
        if ($scope.findCepCode.length > 0) $scope.showButton = true;
        $scope.getFavCEP($scope.findCepCode);
    }

    //call on scroll  -- pagination
    SearchRslt.prototype.getMoreFavCEP = function () {
        $rootScope.errorLogMethod("FavSearchCtrl.SearchRslt.prototype.getMoreFavCEP");
            
        //if (!$scope.isPageLoaded) {            
        //    return;
        //}
        if ($scope.favCEPlObj.pageNumber > $scope.TotalPages)
            this.busy = true;
        if (this.busy) { return false; }
        else {

            this.busy = true;
            if ($scope.isFavSearchOn)
            { $scope.getFavCEP($scope.findCepCode); }
            else
            {
                $scope.getFavCEP('');
            }
            $scope.favCEPlObj.loadMsg = $scope.ldingData;
        }
    };

    var setData = function (itemData, itemArLen) {

        /*Array is returned by api*/
        if (itemData.length > 0) {
            var items = $scope.sortCEP(itemData);
            for (var i = 0; i < items.length; i++) {
                if (items[i].CLIEID != 0) {
                    items[i].index = itemArLen;
                    items[i].fav = items[i].CEPFAV == 'Y' ? true : false;
                    $scope.favCEPlObj.items.push(items[i]);
                    itemArLen++;
                }

            }
        }


        $scope.favCEPlObj.pageNumber = $scope.favCEPlObj.pageNumber + 1;
        var ttlPg = parseInt(localStorage.getItem('TOTFavAVAIL'));
        if (ttlPg > 0) {
            $scope.TotalPages = Math.ceil(ttlPg / $scope.DataPerPage);
        }
        else
            $scope.TotalPages = 0;
        $scope.favCEPlObj.busy = false;

        if ($scope.favCEPlObj.items==null || $scope.favCEPlObj.items.length == 0) {
            angular.element(document.getElementById('divNoRecord')).show();
        }
        else {
            angular.element(document.getElementById('divNoRecord')).hide();
        }
        //if ($scope.isPageLoaded == false) {
        //    $timeout(function () { $scope.isPageLoaded = true }, 1000);            
        //}

    }

    //Get the favourite cep code from API
    $scope.getFavCEP = function (searchData) {
        $rootScope.errorLogMethod("FavSearchCtrl.$scope.getFavCEP");
        if ($scope.favCEPlObj.pageNumber == 1) {
            var favData = JSON.parse(localStorage.getItem('CEPFav'));
            if ((favData != null) && (searchData == '')) {
                var items = favData;
                var itemArLen = $scope.favCEPlObj.items.length;
                setData(items, itemArLen);
                return;
            }
        }

        cepService.getFavCEP($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, searchData, $scope.favCEPlObj.pageNumber, $scope.DataPerPage, '2')
            .then(function (response) {
                if (response.RETCEPFAV_OUT_OBJ.CEP_ARR == undefined || response.RETCEPFAV_OUT_OBJ.CEP_ARR.length == 0) {

                    $scope.favCEPlObj.busy = true;
                    $scope.favCEPlObj.loadMsg = $scope.noMoreData;
                    return;

                }

                if (Object.prototype.toString.call(response.RETCEPFAV_OUT_OBJ.CEP_ARR) != '[object Array]') {
                    var data = response.RETCEPFAV_OUT_OBJ.CEP_ARR;
                    response.RETCEPFAV_OUT_OBJ.CEP_ARR = [];
                    response.RETCEPFAV_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                }

                var items = response.RETCEPFAV_OUT_OBJ.CEP_ARR;
                var itemArLen = $scope.favCEPlObj.items.length;

                if ((items.length > 0) && (searchData == '') && ($scope.favCEPlObj.pageNumber == 1)) {
                    localStorage.removeItem('CEPFav');
                    localStorage.removeItem('TOTFavAVAIL');
                    localStorage.setItem('CEPFav', JSON.stringify(items));
                    localStorage.setItem('TOTFavAVAIL', (response.RETCEPFAV_OUT_OBJ.TOTAVAIL));
                }
                setData(items, itemArLen);
            });

    };

    $scope.getAllFav = function (isAllData) {
        $scope.favCEPlObj = new SearchRslt();
        if (isAllData) {
            $scope.isFavSearchOn = false;

            $scope.getFavCEP('');
        }
        else {
            $scope.isFavSearchOn = true;
            $scope.getFavCEP($scope.findCepCode);
        }
    }

   
    $scope.sortCEP = function (cepDetailObj) {
        $rootScope.errorLogMethod("FavSearchCtrl.$scope.sortCEP");
        for (var i = 0; i < cepDetailObj.length; i++) {
            if (cepDetailObj[i].ENGNO.length == 1)
                cepDetailObj[i].ENGNO = '00' + cepDetailObj[i].ENGNO;
            if (cepDetailObj[i].ENGNO.length == 2)
                cepDetailObj[i].ENGNO = '0' + cepDetailObj[i].ENGNO;

            if (cepDetailObj[i].PRJNO.length == 1)
                cepDetailObj[i].PRJNO = '00' + cepDetailObj[i].PRJNO;
            if (cepDetailObj[i].PRJNO.length == 2)
                cepDetailObj[i].PRJNO = '0' + cepDetailObj[i].PRJNO;
        }
        return $filter('orderBy')(cepDetailObj, ['CLIENO', 'ENGNO', 'PRJNO']);

    }

    //Send back to new entry page
    $scope.sendFavDataBack = function (index) {
        $scope.ok(JSON.stringify($scope.favCEPlObj.items[index]));
    }

    // Handle Fav

    var getCEPFav = function () {
        var favCEPlObj = [];
        var data = (localStorage.getItem('CEPFav'));
        if (data != null) {
            return;
        }
        cepService.getFavCEP($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, '', 1, 10, '2')
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

               /*Array is returned by api*/
               if (items.length > 0) {
                   localStorage.setItem('CEPFav', JSON.stringify(items));
                   localStorage.setItem('TOTFavAVAIL', (response.RETCEPFAV_OUT_OBJ.TOTAVAIL));
               }
           });

    }

    // handle local storage in case of CEP fav
    var handleCEPFav = function () {
        localStorage.removeItem('CEPFav');
        localStorage.removeItem('TOTFavAVAIL');
        getCEPFav();
    }

    /*get faourite cep -- end*/

    $scope.addCEPFavorited = function (isSearch, cepData, $event) {
        var data = {
            "NUMBER": [isSearch == false ? $scope.cpecode.PRJID : cepData.PRJID]
        };
        var prj_arr = JSON.stringify(data);
        if (isSearch) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        cepService.addCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {

            if (!isSearch) {
                $scope.selectCEPFev = true;
                $scope.selectCEPNonFev = false;

            }
            else {
                cepData.fav = true;

                var eng = parseInt(cepData.ENGNO) > 99 ? (parseInt(cepData.ENGNO)).toString() : parseInt(cepData.ENGNO) > 9 ? '0' + (parseInt(cepData.ENGNO)).toString() : '00' + (parseInt(cepData.ENGNO)).toString();
                var pro = parseInt(cepData.PRJNO) > 99 ? (parseInt(cepData.PRJNO)).toString() : parseInt(cepData.PRJNO) > 9 ? '0' + (parseInt(cepData.PRJNO)).toString() : '00' + (parseInt(cepData.PRJNO)).toString();
                var cepEnter = cepData.CLIENO.toString() + '-' + eng + '-' + pro;
                if (cepEnter == $scope.findCepCode) {
                    angular.element(document.getElementById('cepfav')).val(cepData.fav);
                    angular.element(document.getElementById('isChange')).val(true);
                }

            }
            handleCEPFav();

        });

    }

    $scope.removeCEPFavorites = function (isSearch, cepData, $event) {

        var data = {
            "NUMBER": [isSearch == false ? $scope.cpecode.PRJID : cepData.PRJID]
        };
        var prj_arr = JSON.stringify(data);
        if (isSearch) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        cepService.removeCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
            if (!isSearch) {
                $scope.selectCEPFev = false;
                $scope.selectCEPNonFev = true;


            }
            else {
                cepData.fav = false;
                var eng = parseInt(cepData.ENGNO) > 99 ? (parseInt(cepData.ENGNO)).toString() : parseInt(cepData.ENGNO) > 9 ? '0' + (parseInt(cepData.ENGNO)).toString() : '00' + (parseInt(cepData.ENGNO)).toString();
                var pro = parseInt(cepData.PRJNO) > 99 ? (parseInt(cepData.PRJNO)).toString() : parseInt(cepData.PRJNO) > 9 ? '0' + (parseInt(cepData.PRJNO)).toString() : '00' + (parseInt(cepData.PRJNO)).toString();
                var cepEnter = cepData.CLIENO.toString() + '-' + eng + '-' + pro;
                if (cepEnter == $scope.findCepCode) {
                    angular.element(document.getElementById('cepfav')).val(cepData.fav);
                    angular.element(document.getElementById('isChange')).val(true);
                }
            }
            handleCEPFav();
        });
    }

}])

.controller('SearchCtrl', ['$rootScope', '$filter', '$scope', '$modal', 'cepService', 'projectComponetService', 'activityService', 'loadICRates', '$state', '$rootScope', '$timeout', '$window', 'loadRevenueMonthsServices', 'gridDataService', 'dateService', 'futureEntryService', 'commonUtilityService', function ($rootScope, $filter, $scope, $modal, cepService, projectComponetService, activityService, loadICRates, $state, $rootScope, $timeout, $window, loadRevenueMonthsServices, gridDataService, dateService, futureEntryService, commonUtilityService) {
    var isFavChange = false;
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
    $scope.noMoreData = ''
    $scope.scopeObj = {
        selected: null,
        scopeListData: []
    };

    $scope.isSameCompany = false;
    var SearchRslt = function () {
        this.items = [];
        this.busy = true;
        this.after = '';
        this.pageNumber = 1;
        this.loadMsg = 'Search Results . . .';
        this.TotalPages = 1;
        this.DataPerPage = 10;

    };

    $scope.keyPress = function ($event) {
        if ($event.keyCode == 13) {
            $event.preventDefault();
        }
    }

    var removeEmoji = function () {
        var arr = [];
        var char = '';
        var val = angular.element(document.getElementById('description')).val();
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
        catch (err) { console.log(err.message); return val; }
    }
    $scope.descriptionBlur = function () {
        $scope.isDesValid = false;
        $scope.isDesFocused = false;
        if ($scope.description != null) {
            $scope.description = $scope.description.replace(/\n/g, " ");
            if ($scope.description.length > 0) {
                $scope.description=removeEmoji();
                checkDescFav();
            }
        }

    }

    $scope.favChange = function () {
        var val = angular.element(document.getElementById('cepfav')).val();
        if (val == 'true') {
            $scope.selectCEPFev = true;
            $scope.selectCEPNonFev = false;
        }
        else {
            $scope.selectCEPFev = false;
            $scope.selectCEPNonFev = true;
        }
    }

    $scope.setFav = function (val) {
        if (typeof val == 'undefined') {
            val = angular.element(document.getElementById("description")).val();//.trim();
            $scope.description = val;
        }
        if (val.trim().length == 0) $scope.favDesc = false;
        if (val.trim().length > 0) {
            if (!checkDescFav()) {
                $scope.favDesc = false;
            }
        }
    }

    // Check if desc already exist in desc fav list
    var checkDescFav = function () {
        if ($scope.descFav.length == 0) {
            getDescriptionFav(false);
        }
        var isContinue = false;
        for (var i = 0; i < $scope.descFav.length; i++) {
            if ($scope.description.trim() == $scope.descFav[i]) {
                $scope.favDesc = true;
                isContinue = true;
                break;
            }
        }
        return isContinue;
    }

    $scope.startDate = null;

    $scope.selectCEPFev = false;
    $scope.selectCEPNonFev = false;

    $scope.startDate = null;

    SearchRslt.prototype.nextPage = function () {
        $rootScope.errorLogMethod("SearchCtrl.SearchRslt.prototype.nextPage");
        if ($scope.searchRslObj.pageNumber > $scope.searchRslObj.TotalPages) {
            return false;
        }
        if (this.busy) {
            return false;
        }
        else {

            this.busy = true;
            $timeout(function () { $scope.$broadcast('update_find_result'); }, 1000);
            $scope.searchRslObj.loadMsg = $scope.ldingData;

        }
    };

    $scope.InitializeValidationMsg = function () {
        $scope.frmValidationParms.cepMsg = $filter('translate')('msg_ValidCep');
        $scope.frmValidationParms.activityMsg = $filter('translate')('msg_activity');
        $scope.frmValidationParms.invalidHrs = $filter('translate')('msg_InvalidHrs');
        $scope.frmValidationParms.desMsg = $filter('translate')('msg_Description');
        $scope.frmValidationParms.compoMsg = $filter('translate')('msg_Task');
        $scope.frmValidationParms.projectMsg = $filter('translate')('msg_Component');
        $scope.frmValidationParms.scopeMsg = $filter('translate')('msg_Scope');
    }
    $scope.frmValidationParms = {
        maxHours: 200, minHour: -200, isDesReq: false, desMsg: '', cepMsg: '',
        exHour1: '', exHour2: '', invalidHrs: '',
        cnfrmSubmit: true, compoMsg: '', projectMsg: '', activityMsg: '',
        isProjectSelected: false, IsCepCodeSelected: false, isActivitySel: false, activityTitle: '',
        scopeMsg: '', isTaskSelected: false, invalidCEPMsg: '', titleDes: ''
    }

    $scope.findCepCode = '';
    $scope.searchRslObj = new SearchRslt();
    $scope.favCEPlObj = new SearchRslt();
    $scope.revStartDate = null;
    $scope.revEndDate = null;
    $scope.cpecode = {
    };
    $scope.cpeListData = [];

    $scope.cpeList = function ($select) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.cpeList");
        return $scope.cpecodeList;
    }
    $scope.domainURL = "";

    $scope.state = {
        selected: null,
        stateprovlist: []
    };
    $scope.stateprovlist = [];
    $scope.revenueCurrentMonth = null;
    $scope.cpeListData.selected = null;

    var loadRevenueMonth = function () {
        $rootScope.errorLogMethod("SearchCtrl.loadRevenueMonth");
        $scope.revenueCurrentMonth = $scope.initialDetail.REVM_REC;
    }

    var refreshPage = function () {
        $rootScope.errorLogMethod("SearchCtrl.refreshPage");
        if ($rootScope.$stateParams.startDate == null) {
            $state.go('Main');
        }
    }
    $scope.maskTest = '';
    $scope.init = function () {        
        $scope.desFromImportCal=$rootScope.$stateParams.Description;
        localStorage.setItem('enterPress', "0");
        $scope.frmValidationParms.exHour1 = $filter('translate')('msg_ExHrs');
        $scope.frmValidationParms.exHour2 = $filter('translate')('msg_ExMinusHrs');
        $scope.frmValidationParms.activityTitle = $filter('translate')('activity_Title');
        $scope.frmValidationParms.invalidCEPMsg = $filter('translate')('msg_ValidCep');
        $scope.frmValidationParms.titleDes = $filter('translate')('title_Description');
        $scope.ldingData = $filter('translate')('msg_LdingData');

        $scope.noMoreData = $filter('translate')('msg_NoMoreData');
        setRevenueDte();
        $scope.maskTest = String('?*?*?*?*?*?*?-?9?9?9?-?9?9?9');
        $rootScope.errorLogMethod("SearchCtrl.$scope.init");
        $scope.isPageLoad = true;
        $scope.isPostback = true;
        $scope.startDate = $rootScope.$stateParams.startDate;
        refreshPage();
        //web id
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        if ($scope.initialDetail.COMP_REC.RGLW === 'Y') { $scope.isRegulated = true; }
        if ($scope.initialDetail.COMP_REC.UPST === 'Y') { $scope.isUpdPro = true; }
        getCEPFav();
        var st = JSON.parse(localStorage.getItem('StateProv_Data'));

        for (var i = 0; i < st.length; i++) {
            var data = {
                PTXCODE: st[i].PTXCODE,
                PTXNAME: st[i].PTXNAME,
                PRSTID: st[i].PRSTID,
                DEF: st[i].DEF
            };
            $scope.state.stateprovlist.push(data);
            if ($scope.state.stateprovlist[i].DEF == 'Y') {
                $scope.state.selected = JSON.stringify($scope.state.stateprovlist[i]);
            }
        }


        $scope.isDailyMode = $rootScope.$stateParams.isDailyMode;

        if ($rootScope.$stateParams.IsSearch) {
            var data = JSON.parse(localStorage.getItem('Search_Data'));
            $scope.cpeListData.push(JSON.parse(localStorage.getItem('Search_Data')));
            $scope.cpeListData.selected = ($scope.cpeListData[0]);
            var eng = parseInt($scope.cpeListData.selected.ENGNO) > 99 ? (parseInt($scope.cpeListData.selected.ENGNO)).toString() : parseInt($scope.cpeListData.selected.ENGNO) > 9 ? '0' + (parseInt($scope.cpeListData.selected.ENGNO)).toString() : '00' + (parseInt($scope.cpeListData.selected.ENGNO)).toString();
            var pro = parseInt($scope.cpeListData.selected.PRJNO) > 99 ? (parseInt($scope.cpeListData.selected.PRJNO)).toString() : parseInt($scope.cpeListData.selected.PRJNO) > 9 ? '0' + (parseInt($scope.cpeListData.selected.PRJNO)).toString() : '00' + (parseInt($scope.cpeListData.selected.PRJNO)).toString();
            $scope.cepEnter = $scope.cpeListData.selected.CLIENO.toString() + '-' + eng + '-' + pro;
            $scope.cepEnterText = $scope.cpeListData.selected.CLIENO.toString() + eng + pro;

            var len = $scope.cepEnter.length;
            if (len == 14) {

                $scope.loadCEPCode();
            }
            else {
                hardCodedCEP();
            }
            localStorage.removeItem('Search_Data');

        }
        if ($rootScope.$stateParams.IsEditMode) {
            $scope.isPostback = false;
            $scope.isEditMode = true;
            $scope.timeEntry = JSON.parse(localStorage.getItem('Time_Entry'));
            if ((typeof $scope.timeEntry.CEP_REC !== undefined) && (!$rootScope.$stateParams.IsSearch)) {
                $scope.updateHrsInEditMode();
                $scope.cpeListData.push(($scope.timeEntry.CEP_REC));
                $scope.cpeListData.selected = ($scope.cpeListData[0]);
                var eng = parseInt($scope.cpeListData.selected.ENGNO) > 99 ? (parseInt($scope.cpeListData.selected.ENGNO)).toString() : parseInt($scope.cpeListData.selected.ENGNO) > 9 ? '0' + (parseInt($scope.cpeListData.selected.ENGNO)).toString() : '00' + (parseInt($scope.cpeListData.selected.ENGNO)).toString();
                var pro = parseInt($scope.cpeListData.selected.PRJNO) > 99 ? (parseInt($scope.cpeListData.selected.PRJNO)).toString() : parseInt($scope.cpeListData.selected.PRJNO) > 9 ? '0' + (parseInt($scope.cpeListData.selected.PRJNO)).toString() : '00' + (parseInt($scope.cpeListData.selected.PRJNO)).toString();
                $scope.cepEnter = $scope.cpeListData.selected.CLIENO.toString() + '-' + eng + '-' + pro;
                $scope.cepEnterText = $scope.cpeListData.selected.CLIENO.toString() + eng + pro;
                $scope.isSubmit = $scope.timeEntry.TIMSUB == 'Y' ? true : false;
                var len = $scope.cepEnter.length;
                if (len == 14) {

                    $scope.loadCEPCode();
                }
                else {
                    hardCodedCEP();
                }

            }

        }

        if ($rootScope.$stateParams.IsSearch || $rootScope.$stateParams.isCalFlg || $rootScope.$stateParams.isCancelSearch) {
            var isSearch = ($rootScope.$stateParams.IsSearch == true || $rootScope.$stateParams.isCancelSearch == true) ? true : false;
            $scope.updateHrsDesSearch(isSearch);
        }


        loadRevenueMonth();


    }


    $scope.updateHrsDesSearch = function (isSearch) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.updateHrsDesSearch");
        if ($rootScope.$stateParams.isDailyMode) {
            $scope.dailyHour = Number(parseFloat($rootScope.$stateParams.Hours).toFixed(2));
            var unbindWatch = $scope.$watch("dailyHours", function () {
                updateEleValOnEdit("dailyHours", $scope.dailyHour);
            });
        }
        else {
            var weeklyHours = [null, null, null, null, null, null, null];
            if (isSearch == true) {
                weeklyHours = $rootScope.$stateParams.Hours;//JSON.parse(localStorage.getItem('wkHrsBeforeSrch'));
                for (var i = 0; i < 7; i++) {
                    $scope.week[i] = weeklyHours[i];
                }
                if ($rootScope.$stateParams.IsEditMode == true) {
                    var weeklyOldHours = JSON.parse(localStorage.getItem('weeklyhours'));
                    for (var i = 0; i < 7; i++) {
                        $scope.weeklyOld[i] = weeklyOldHours[i];
                    }
                }
            }
            else if ($rootScope.$stateParams.isCalFlg == true) {
                var dayTemp = $rootScope.$stateParams.Hours.split('|')
                var day = dayTemp[1];
                weeklyHours[day] = Number(parseFloat(dayTemp[0]).toFixed(2));
                for (var i = 0; i < 7; i++) {
                    $scope.week[i] = weeklyHours[i];
                }
            }
            /*convert hour correct to 2 decimal place*/
            var unbindWatch = $scope.$watch("week", function () {
                var eleId = "wkHrs";
                for (var i = 0; i < 7; i++) {
                    if (weeklyHours[i] != null) {
                        updateEleValOnEdit(eleId + (i + 1), weeklyHours[i]);
                    }
                }
            });

        }
        $scope.description = $rootScope.$stateParams.Description;
        checkImportDesFavOnInit();

    }

    var checkImportDesFavOnInit = function () {
        $rootScope.errorLogMethod("SearchCtrl.checkImportDesFavOnInit");
        var desc = (localStorage.getItem('DescFav'));
        if ((desc == '') || (desc == null)) {
            cepService.retrieveDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
                .then(function (response) {
                    if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                        if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                            var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                            response.RETDESCFAV_OUT_OBJ.DESTXT_ARR = [];
                            if (data != null && data.VARCHAR2 != undefined)
                                response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                        }

                        $scope.descFav = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                    }
                    localStorage.setItem('DescFav', JSON.stringify($scope.descFav));
                    $scope.favDesc = checkDiscriptionInFavList();
                });
        }
        else {
            $scope.descFav = JSON.parse(desc);
            $scope.favDesc = checkDiscriptionInFavList();
        }

    }
    var checkDiscriptionInFavList = function () {
        $rootScope.errorLogMethod("SearchCtrl.checkDiscriptionInFavList");
        var isContinue = false;
        for (var i = 0; i < $scope.descFav.length; i++) {
            if ($scope.description == $scope.descFav[i]) {
                $scope.favDesc = true;
                isContinue = true;
                break;
            }
        }
        return isContinue;
    }
    var getCEPFav = function () {
        var favCEPlObj = [];
        var data = (localStorage.getItem('CEPFav'));
        if (data != null) {
            return;
        }
        cepService.getFavCEP($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, '', $scope.favCEPlObj.pageNumber, $scope.DataPerPage, '2')
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

               /*Array is returned by api*/
               if (items.length > 0) {
                   localStorage.setItem('CEPFav', JSON.stringify(items));
                   localStorage.setItem('TOTFavAVAIL', (response.RETCEPFAV_OUT_OBJ.TOTAVAIL));
               }
           });

    }

    /*performance improvement : loadRevenueMonths API call*/
    var setRevenueDte = function () {
        $rootScope.errorLogMethod("SearchCtrl.setRevenueDte");
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

    $scope.initSearch = function () {
        localStorage.setItem('enterPress', "0");
        $scope.ldingData = $filter('translate')('msg_LdingData');
        $scope.noMoreData = $filter('translate')('msg_NoMoreData');
        $scope.paceHolderVal = $filter('translate')('placeHolder_CEPSrch');
        $rootScope.errorLogMethod("SearchCtrl.$scope.initSearch");
        $scope.startDate = $rootScope.$stateParams.startDate;
        refreshPage();
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.findCepCode = $rootScope.$stateParams.searchKeyword != null ? $rootScope.$stateParams.searchKeyword : '';
        if ($scope.findCepCode.length == 9) {
            $scope.findCepCode = $scope.findCepCode.substring(0, 6) + '-' + $scope.findCepCode.substring(6, 9);
        }
        if ($scope.findCepCode != '') {
            $scope.mFindCEPCode();
        }

        $rootScope.isRefresh = true;
        $scope.isDailyMode = $rootScope.$stateParams.isDailyMode;
    }
    $scope.entry = {
        "type": "select",
        "name": "Entry",
        "value": "Time",
        "values": ["Time", "IC"]
    };
    $scope.component = {
        selected: null,
        projectListData: []
    };

    $scope.task = {
        selected: null,
        taskListData: []
    };
    $scope.activity = {
        selected: {},
    };

    $scope.icListData = [];
    $scope.PageNumber = 1;
    $scope.DataPerPage = 10;
    $scope.TotalPages = 0;
    $scope.IsSearchDropdown = true;
    $scope.select = '';
    $scope.IsActivity = true;
    $scope.loginDetail = '';
    $scope.initialDetail = '';
    $scope.week = [null, null, null, null, null, null, null];
    $scope.isActivityActive = true;
    $scope.cepEnter = '';
    $scope.isSaving = false;

    $scope.animationsEnabled = true;
    $scope.descriptionText = '';

    $scope.setFocusDescriptionPopUp = function (isOk) {
        var ctrlName = '#description';
        if (!isOk && $scope.task.selected!=null) {
            if (((JSON.parse($scope.task.selected).DESREQ == 'Y') && (!$scope.isScopeReq)) || ($scope.scopeObj.selected!=null && (JSON.parse($scope.scopeObj.selected).DESREQ == 'Y'))) {
                if ($scope.isDailyMode) {
                    ctrlName='#dailyHours';
                }
                else {
                    ctrlName='#wkHrs1';
                }
            }           
        }
        if (ctrlName == '#description') {
            $timeout(function () {
                $('#saveDailyCalFrm').find('textarea').focus();
            }, 0);
        }
        else {
            $(ctrlName).focus();
        }
    }
    $scope.open = function (template, controller, sendData) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.open");
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: template,
            controller: controller,
            resolve: {
                selectedData: function () {
                    return sendData;
                }

            }
        });


        modalInstance.result.then(function (selectedItem) {
            $rootScope.errorLogMethod("SearchCtrl.modalInstance.result");
            switch ($scope.openModalCtrl) {
                case 'FavSearchCtrl':
                    var data = JSON.parse(selectedItem);
                    $scope.clear();
                    $scope.cpeListData.push(JSON.parse(selectedItem));
                    $scope.cpeListData.selected = ($scope.cpeListData[0]);
                    var eng = parseInt($scope.cpeListData.selected.ENGNO) > 99 ? (parseInt($scope.cpeListData.selected.ENGNO)).toString() : parseInt($scope.cpeListData.selected.ENGNO) > 9 ? '0' + (parseInt($scope.cpeListData.selected.ENGNO)).toString() : '00' + (parseInt($scope.cpeListData.selected.ENGNO)).toString();
                    var pro = parseInt($scope.cpeListData.selected.PRJNO) > 99 ? (parseInt($scope.cpeListData.selected.PRJNO)).toString() : parseInt($scope.cpeListData.selected.PRJNO) > 9 ? '0' + (parseInt($scope.cpeListData.selected.PRJNO)).toString() : '00' + (parseInt($scope.cpeListData.selected.PRJNO)).toString();
                    $scope.cepEnter = $scope.cpeListData.selected.CLIENO.toString() + '-' + eng + '-' + pro;
                    $scope.cepEnterText = $scope.cpeListData.selected.CLIENO.toString() + eng + pro;
                    $scope.updateCEPOnSelectFavCEP();
                    $scope.isCepValdMsgOn = false;
                    break;
                case 'ActivityCtrl':
                    $scope.activity.selected = {
                        ACTICD: selectedItem.ACTICD,
                        DES: selectedItem.DES,
                        STAT: selectedItem.STAT,
                        COMPID: selectedItem.COMPID
                    }
                    $scope.AcivityFev = selectedItem.fav;
                    $scope.frmValidationParms.isActivitySel = true;
                    $scope.isActivityActive = $scope.activity.selected.STAT == 'Y' ? true : false;

                    break;
                case 'DescriptionCtrl':

                    $scope.descriptionText = (selectedItem.data);
                    $scope.favDesc = (selectedItem.fav);
                    var desc = (localStorage.getItem('DescFav'));
                    $scope.descFav = JSON.parse(desc);
                    if (($scope.descriptionText != '') && ($scope.descriptionText != null)) {
                        $scope.isDescDisable = false;
                        $scope.textAreaDescription();
                    }
                    $scope.setFocusDescriptionPopUp(true);                   
                    break;
                case 'ErrorPopup':
                    if ($scope.isPartitionErr) {
                        loadHomePage();
                    }

                    else {                       
                        var noPopUp = $scope.noOfwarningPopup - 1;
                        $scope.noOfwarningPopup = ((noPopUp < 0) ? 0 : noPopUp);
                        
                        if (($scope.saveOn || $scope.enterPress || $scope.isFormValid) && ($scope.noOfwarningPopup == 0) && (!$scope.cancelFlag)) {
                            if (($scope.json != null) && $scope.isFormValid) {
                                $scope.finalSaveCall = true;
                                $('#btnEntrySave').focus();
                                
                                $scope.saveOn = false;
                                $scope.finalSave($scope.json, $scope.deleteEntry);
                            }
                        }
                        if (noPopUp == 0) {
                            $scope.saveOn = false;
                            $scope.enterPress = false;
                        }
                    }
                    break;
            }

        }, function () {
           
            switch ($scope.openModalCtrl) {
                case 'FavSearchCtrl':
                    var val = angular.element(document.getElementById('isChange')).val();
                    if ((val == 'true')) {
                        $scope.favChange();
                    }
                    angular.element(document.getElementById('isChange')).val(false);

                    break;
                case 'ActivityCtrl':

                    if ($scope.activity.selected.DES == 'Select an activity.....')
                        $scope.activity.selected = {};
                    $scope.ActivityFavList = [];
                    if ($scope.activity.selected != null)
                        $scope.AcivityFev = checkActivityFac($scope.activity.selected);
                    break;
                case 'DescriptionCtrl':

                    $scope.descFav = [];
                    $scope.setFav();
                    $scope.setFocusDescriptionPopUp(false);
                    break;
                case 'ErrorPopup':
                    $scope.isFormValid =false;
                    if ($scope.isPartitionErr) {
                        loadHomePage();
                    }
                    else {
                        //angular.element(document.getElementById("defDesc")).val(desc.data).trigger('input');
                        $scope.cancelFlag = true;
                        var noPopUp = $scope.noOfwarningPopup - 1;
                        $scope.noOfwarningPopup = ((noPopUp < 0) ? 0 : noPopUp);
                       
                        $scope.is24HourMsgShown = false;
                        $scope.isRoundingMsgShown = false;
                        
                        if (noPopUp == 0) {
                            if ($scope.enterPress && $scope.fucusedItemName.indexOf("wkHrs") == 0) {
                               
                                $('#' + $scope.fucusedItemName).focus();
                            }
                           
                            $timeout(function () {                               
                                $scope.saveOn = false;
                                $scope.enterPress = false; }, 100);
                        }
                    }
                    break;
            }
        });
    };

    $scope.cancelFlag = false;

    $scope.toggleAnimation = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.toggleAnimation");
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.descCorssClick = function () {
        $scope.description = '';
        $scope.favDesc = false;

    }


    $scope.refreshResults = function (search) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.refreshResults");
        $scope.select = search;
        var search = search;
        if (search.length > 0) {
            if ($scope.IsSearchDropdown) {
                $scope.PageNumber = 1;
            }

            cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, $scope.PageNumber, $scope.DataPerPage, '2,5,8', $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
                if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                    var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;
                    var b = leg !== undefined;
                    if (b) {

                        $scope.cpeListData = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                        $scope.TotalPages = parseInt(parseInt(response.LOOKCEP_OUT_OBJ.TOTAVAIL) / $scope.DataPerPage);
                        $scope.childDataTransfer();
                    }
                }

            });
        }
        else {
            if (!$rootScope.$stateParams.IsSearch) {
                $scope.cpeListData = [];
            }

        }
    }

    $scope.timeEntry = {
    };

    $scope.mrefreshResults = function ($select) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.mrefreshResults");
        if ($rootScope.$stateParams.IsEditMode) {
            $scope.timeEntry = JSON.parse(localStorage.getItem('Time_Entry'));
            if (typeof $scope.timeEntry.CEP_REC !== undefined) {
                $select.search = $scope.timeEntry.CEP_REC.CLIENO.toString() + '-' + $scope.timeEntry.CEP_REC.ENGNO.toString() + '-' + $scope.timeEntry.CEP_REC.PRJNO.toString();
            }
        }
        $scope.select = $select.search;
        $scope.component.projectListData = [];
        $scope.activity.activityListData = [];
        var search = $select.search;
        if (search.length > 0) {
            if ($scope.IsSearchDropdown) {
                $scope.PageNumber = 1;
            }
            cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, $scope.PageNumber, $scope.DataPerPage, '2,5,8', $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
                if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                    var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;

                    response.LOOKCEP_OUT_OBJ.CEP_ARR.splice(leg - 1, 1);

                    var b = leg !== undefined;
                    if (b) {
                        $scope.cpeListData = [];
                        $scope.cpeListData = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                        $scope.TotalPages = parseInt(parseInt(response.LOOKCEP_OUT_OBJ.TOTAVAIL) / $scope.DataPerPage);
                        $select.items = $scope.cpeListData;
                        if ($rootScope.$stateParams.IsEditMode) {
                            $scope.EditMode();
                        }

                    }
                }

            });
        }
        else {
            if (!$rootScope.$stateParams.IsSearch) {


                $scope.cpeListData = [];
                $select.items = $scope.cpeListData;
            }
        }

    }

    $scope.warningPopup = false;
    $scope.noOfwarningPopup = 0;
    $scope.validateCEPCode = function (cep_detail, isLoadCEP) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.validateCEPCode");
        // Charge Bases to block 
        var blockcharges = $scope.initialDetail.COMP_REC.BCHB;
        var isContinue = true;

        if (($rootScope.$stateParams.IsEditMode) && (isLoadCEP)) {
            if (($scope.timeEntry.CEP_REC.CLIEID == cep_detail.CLIEID) && ($scope.timeEntry.CEP_REC.ENGID == cep_detail.ENGID) && ($scope.timeEntry.CEP_REC.PRJID == cep_detail.PRJID)) {
                isContinue = false;
            }
        }

        if (isContinue) {
            if ((blockcharges != null) && (blockcharges != '')) {
                for (var i = 0; i < blockcharges.length; i++) {
                    if (cep_detail.CHARBASIS == blockcharges.charAt(i)) {
                        $scope.loadErrorPopup(true, $filter('translate')('msg_CEPChargeBasisErr', { values: blockcharges }));
                        //'Time entry not allowed on ' + blockcharges + ' charge basis engagements.');
                        return false;
                    }
                }
            }
            if (cep_detail.CLIEACTIVE != 'Y') {
                $scope.loadErrorPopup(true, $filter('translate')('msg_InActiveCep')); return false;
            }
            if (cep_detail.ENGACTIVE != 'Y') {
                $scope.loadErrorPopup(true, $filter('translate')('msg_InActiveCep')); return false;
            }
            if (cep_detail.ENGTIMFLAG != 'Y') {
                $scope.loadErrorPopup(true, $filter('translate')('msg_SelectAnotherEng')); return false;
            }
            if (cep_detail.PRJACTIVE != 'Y') {
                $scope.loadErrorPopup(true, $filter('translate')('msg_InActiveCep')); return false;
            }

            if ((cep_detail.PRJTIMFLAG != 'Y')) {
                $scope.loadErrorPopup(true, $filter('translate')('msg_SelectAnotherPrj')); return false;
            }
        }

        if (((cep_detail.RENPRJNO != null) && (cep_detail.RENPRJNO != ' ')) && (typeof cep_detail.RENPRJNO != 'undefined') && (!$scope.isSubmit)) {
            var pro = parseInt(cep_detail.RENPRJNO) > 99 ? (parseInt(cep_detail.RENPRJNO)).toString() : parseInt(cep_detail.RENPRJNO) > 9 ? '0' + (parseInt(cep_detail.RENPRJNO)).toString() : '00' + (parseInt(cep_detail.RENPRJNO)).toString();
            var cepcode = cep_detail.CLIENO + '-' + cep_detail.ENGNO + '-' + cep_detail.PRJNO;
            $scope.loadErrorPopup('z', $filter('translate')('msg_ProjectRenewedPaste', { pName: pro, cepProject: cepcode }));
            if (!isLoadCEP) {
                $scope.warningPopup = true;
                $scope.noOfwarningPopup = $scope.noOfwarningPopup + 1;
            }
            return true;
        }
        return true;
    }


    var isInvalidFutureEntry = function (time_Obj) {        
        $rootScope.errorLogMethod("SearchCtrl.var.isInvalidFutureEntry");
        var isFutureEntry = futureEntryService.futureEntry(time_Obj);
        return isFutureEntry;
    }
    // Only for Save and Paste
    $scope.validateHours = function (time_Obj) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.validateHours");
        if ((time_Obj.ACTI_REC.ACTICD == null) || (time_Obj.ACTI_REC.ACTICD == '') || time_Obj.ACTI_REC.ACTICD == undefined)
            return false;

        if (parseFloat(time_Obj.HRS) > 200) {
            $scope.loadErrorPopup(true, $scope.frmValidationParms.exHour1); return false;
        }
        if (parseFloat(time_Obj.HRS) < -200) {
            $scope.loadErrorPopup(true, $scope.frmValidationParms.exHour2); return false;
        }



        if ((time_Obj.ACTI_REC.STAT != 'Y') && (time_Obj.ACTI_REC.ACTICD != null) && ((time_Obj.ACTI_REC.ACTICD != ''))) {
            $scope.loadErrorPopup(true, $filter('translate')('msg_InActiveActivity')); return false;
        }


        //For Billing 
        // Billing Rate Date Validations


        var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
        var parts = billingDate.split("-");
        var day = parts[2].split(' ');
        var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
        if (dateService.createDate(time_Obj.DTE) < nstartDate) {
            var show = nstartDate.toString().split(' ');
            var date = show[2] + '-' + show[1] + '-' + show[3];
            $scope.loadErrorPopup(true, $filter('translate')('msg_TimePriorToBillingStartDate', { dateVal: date })); return false;

        }

        //Billing Rate Validations.

        if ($scope.initialDetail.EMPL_REC.BRATE.toString() == "222")
        { $scope.loadErrorPopup(true, $filter('translate')('msg_InvaildBillingRate')); return false; }

        if (isInvalidFutureEntry(time_Obj)) {
            $scope.loadErrorPopup(true, $filter('translate')('msg_FutureTimeEntry'));
            return false;
        }



        if (parseFloat(time_Obj.HRS) < 0) {

            switch (time_Obj.CEP_REC.CHARBASIS) {
                case 'N': if ($scope.initialDetail.COMP_REC.NTIM != 'Y') {
                    $scope.loadErrorPopup(true, $filter('translate')('msg_NegativeHrs'));
                    return false;
                }
                    break;
                case 'T': if ($scope.initialDetail.COMP_REC.NBTM != 'Y') {
                    $scope.loadErrorPopup(true, $filter('translate')('msg_BillingNegativeHrs'));
                    return false;
                }
                    break;
                case 'S':
                case 'C':
                    if ($scope.initialDetail.COMP_REC.NBTM != 'Y') {
                        $scope.loadErrorPopup(true, $filter('translate')('msg_NegativeHrs'));
                        return false;
                    }
                    break;

            }
        }
        return true;
    }

    $scope.loadCEPCode = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.loadCEPCode");


        var search = $scope.cepEnter;

        if (search.length > 0) {
            cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, $scope.PageNumber, $scope.DataPerPage, '2,5,8', $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
                if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                    var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;
                    /*if no result is returned from api*/
                    if ((response.LOOKCEP_OUT_OBJ.TOTAVAIL === '0')) {
                        if (!$rootScope.$stateParams.IsEditMode) {
                            $scope.selectCEPFev = $scope.selectCEPNonFev = false;
                            $scope.loadErrorPopup(true, $scope.frmValidationParms.invalidCEPMsg);
                            $scope.frmValidationParms.cnfrmSubmit = false;
                            $scope.frmValidationParms.IsCepCodeSelected = false;
                            return;
                        }
                        else {
                            var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
                            var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
                            var timeCEP = $scope.timeEntry.CEP_REC.CLIENO.toString() + '-' + eng + '-' + pro;
                            if (search.toUpperCase().trim() == timeCEP) {
                                $scope.EditMode();
                            }
                            else {
                                $scope.selectCEPFev = $scope.selectCEPNonFev = false;
                                $scope.loadErrorPopup(true, $filter('translate')('msg_ValidCep'));
                                $scope.clearNoCEPDesc();
                            }
                        }
                    }


                    $scope.frmValidationParms.cnfrmSubmit = true;
                    if (Object.prototype.toString.call(response.LOOKCEP_OUT_OBJ.CEP_ARR) != '[object Array]') {
                        var data = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                        response.LOOKCEP_OUT_OBJ.CEP_ARR = [];
                        response.LOOKCEP_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                    }
                    for (var i = 0; i < response.LOOKCEP_OUT_OBJ.CEP_ARR.length; i++) {
                        if (response.LOOKCEP_OUT_OBJ.CEP_ARR[i].CLIEID == 0) {
                            response.LOOKCEP_OUT_OBJ.CEP_ARR.splice(i, 1);
                            i--;
                        }
                    }

                    var b = leg !== undefined;
                    if ((b)) {
                        var searchResponse = response.LOOKCEP_OUT_OBJ.CEP_ARR[0];
                        cepService.loadCEPDetail($scope.loginDetail.SESKEY, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].CLIEID, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].ENGID, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].PRJID, $scope.domainURL).then(function (response) {
                            if (parseInt(response.LOADCEP_OUT_OBJ.RETCD) == 0) {
                                $scope.clear();
                                if ($scope.validateCEPCode(response.LOADCEP_OUT_OBJ.CEP_REC, true)) {

                                    $scope.cpeListData = [];
                                    $scope.cpeListData.push(response.LOADCEP_OUT_OBJ.CEP_REC);
                                    $scope.cpeListData.selected = $scope.cpeListData[0];
                                    if ($rootScope.$stateParams.IsEditMode) {
                                        $scope.EditMode();
                                    }
                                    else {
                                        $scope.onSelectCEPCode($scope.cpeListData.selected);
                                    }
                                    // CEP Fev section
                                    if (searchResponse.CEPFAV == 'Y') {
                                        $scope.selectCEPFev = true;
                                        $scope.selectCEPNonFev = false;
                                    }
                                    else {
                                        $scope.selectCEPFev = false;
                                        $scope.selectCEPNonFev = true;
                                    }
                                }
                            }
                            else {

                                if ($rootScope.$stateParams.IsEditMode) {
                                    var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
                                    var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
                                    var timeCEP = $scope.timeEntry.CEP_REC.CLIENO.toString() + '-' + eng + '-' + pro;
                                    if (search.toUpperCase().trim() == timeCEP) {
                                        $scope.EditMode();
                                    }
                                    else {
                                        $scope.selectCEPFev = $scope.selectCEPNonFev = false;
                                        $scope.loadErrorPopup(true, $filter('translate')('msg_ValidCep'));
                                        $scope.clearNoCEPDesc();
                                    }
                                }
                                else {
                                    $scope.selectCEPFev = $scope.selectCEPNonFev = false;
                                    $scope.loadErrorPopup(true, $filter('translate')('msg_ValidCep'));
                                }
                            }

                        });
                    }
                }

            });
        }
        else {
            if (!$rootScope.$stateParams.IsSearch) {


                $scope.cpeListData = [];
                $select.items = $scope.cpeListData;
            }
        }

    }

    $scope.cepEnterText = null;
    $scope.clearCep = function () {

        $scope.isClear = true;
        $scope.cepEnterText = '';
        $scope.cepEnter = '';
        $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
        $scope.frmValidationParms.IsCepCodeSelected = false;
        $scope.frmValidationParms.isProjectSelected = false;
        $scope.clear();
        $scope.frmValidationParms.IsCepCodeSelected = false;
        $scope.frmValidationParms.isProjectSelected = false;
        $scope.isClear = true;
    }

    $scope.updateCEPOnSelectFavCEP = function () {
        if ($scope.cepEnter != 'undefined') {
            var len = $scope.cepEnter.length;
            if (len == 14) {
                $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
                $scope.loadCEPCode();
            }
            else {
                if (!hardCodedCEP()) {
                    $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
                    $scope.clear();
                    $scope.frmValidationParms.IsCepCodeSelected = false;

                }
            }
        }
    }
    $scope.onCEPEnter = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.loadCEPCode");
        localStorage.setItem('cepFocus', "0");
        $scope.isSet = false;

        if ($scope.oldCep == $scope.cepEnterText || $scope.isClear) { $scope.isClear = false; return; }

        else
        {
            if ((typeof $scope.cepEnterText != 'undefined') && ($scope.cepEnterText != '') && ($scope.cepEnterText != null)) {
                if ($scope.cepEnterText.length == 12) {
                    $scope.cepEnter = $scope.cepEnterText.substring(0, 6) + '-' +$scope.cepEnterText.substring(6, 9) + '-' +$scope.cepEnterText.substring(9, 12);
                }
                else
                    $scope.cepEnter = $scope.cepEnterText;
            }
            else {
                $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
                $scope.frmValidationParms.IsCepCodeSelected = false;
                $scope.frmValidationParms.isProjectSelected = false;
                $scope.cepEnter = '';
                $scope.isClear = false;
                $scope.selectCEPFev = false;
                $scope.selectCEPNonFev = false;
                return;
            }
            $scope.frmValidationParms.isDesReq = false;
            if ($scope.cepEnter != 'undefined') {
                var len = $scope.cepEnter.length;
                if (len == 14) {

                    $scope.loadCEPCode();
                }
                else {
                    if (!hardCodedCEP()) {
                        $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
                        $scope.clear();
                        $scope.frmValidationParms.IsCepCodeSelected = false;

                    }
                }
            }
            else {
                $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
                $scope.clear();
            }
        }
    }

    $scope.cepdelete = function ($event) {

        if ($scope.cepEnterText.length == 0) {
            $scope.maskTest = '?*?*?*?*?*?*?-?9?9?9?-?9?9?9';
            $scope.selectCEPFev = $scope.selectCEPNonFev = false;
        }
        else {
            $scope.isClear = false;

        }
        if ($event.keyCode == 13) {
            $('#' + 'cepTextBox').blur();
        }
    }

    var hardCodedCEP = function () {        
        if ((String($scope.cepEnterText.substring(0, 3)).toUpperCase().trim() == String('MRT')) && (!isNaN($scope.cepEnterText.substring(3, $scope.cepEnterText.length)))) {

            $scope.maskTest = String('?*?*?*-?9?9?9?-?9?9?9');
            if ($scope.cepEnterText.length == 9) {
                $scope.cepEnter = $scope.cepEnterText.substring(0, 3) + '-' + $scope.cepEnterText.substring(3, 6) + '-' + $scope.cepEnterText.substring(6, 9);
                $scope.loadCEPCode();

            }
            return true;
        }
        if ((String($scope.cepEnterText.substring(0, 5)).toUpperCase().trim() == String('LEARN')) && (!isNaN($scope.cepEnterText.substring(5, $scope.cepEnterText.length)))) {
            $scope.maskTest = '?*?*?*?*?*-?9?9?9?-?9?9?9';
            if ($scope.cepEnterText.length == 11) {
                $scope.cepEnter = $scope.cepEnterText.substring(0, 5) + '-' + $scope.cepEnterText.substring(5, 8) + '-' + $scope.cepEnterText.substring(8, 11);
                $scope.loadCEPCode();

            }
            return true;
        }
        if ((String($scope.cepEnterText.substring(0, 5)).toUpperCase().trim() == String('MT000')) && (!isNaN($scope.cepEnterText.substring(5, $scope.cepEnterText.length)))) {
            $scope.maskTest = '?*?*?*?*?*-?9?9?9?-?9?9?9';
            if ($scope.cepEnterText.length == 11) {
                $scope.cepEnter = $scope.cepEnterText.substring(0, 5) + '-' + $scope.cepEnterText.substring(5, 8) + '-' + $scope.cepEnterText.substring(8, 11);
                $scope.loadCEPCode();
            }
            return true;
        }
        return false;
    }

    $scope.clear = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.clear");
        $scope.cpeListData = [];
        $scope.component.projectListData = [];
        $scope.component.selected = null;
        $scope.activity.activityListData = [];
        $scope.activity.selected = {
        };
        $scope.task.taskListData = [];
        $scope.task.selected = null;
        $scope.descriptionText = '';
        $scope.scopeObj.selected = null;

        $scope.selectCEPFev = false;
        $scope.selectCEPNonFev = false;
        $scope.isSameCompany = false;
    }

    $scope.clearNoCEP = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.clearNoCEP");
        $scope.component.projectListData = [];
        $scope.component.selected = null;
        $scope.activity.activityListData = [];
        $scope.activity.selected = {
        };
        $scope.task.taskListData = [];
        $scope.task.selected = null;
        $scope.descriptionText = '';
        $scope.scopeObj.selected = null;
    }

    $scope.clearNoCEPDesc = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.clearNoCEP&Desc");
        var desc = $scope.description;
        $scope.component.projectListData = [];
        $scope.component.selected = null;
        $scope.activity.activityListData = [];
        $scope.activity.selected = {
        };
        $scope.task.taskListData = [];
        $scope.task.selected = null;

        $scope.scopeObj.selected = null;

        if ($rootScope.$stateParams.isCalFlg)
            $scope.description = desc;
    }

    $scope.clearNoComponent = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.clearNoComponent");
        $scope.task.taskListData = [];
        $scope.task.selected = null;
        $scope.scopeObj.selected = null;
    }

    $scope.weeklyOld = [null, null, null, null, null, null, null]
    $scope.isAnyChange = true;
    var validateForOldData = function () {
        $rootScope.errorLogMethod("SearchCtrl.validateForOldData");
        $scope.isAnyChange = true;
        var isContinue = false;
        if (($rootScope.$stateParams.IsEditMode)) {
            var cep_rec = $scope.cpeListData.selected;
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
                if (($scope.timeEntry.CMPTID != JSON.parse($scope.component.selected).CMPTID) || ($scope.timeEntry.TSKID != JSON.parse($scope.task.selected).TSKID)) {
                    isContinue = true; return;
                }
                if ($scope.isScopeReq === true) {
                    if ($scope.timeEntry.SCOID != JSON.parse($scope.scopeObj.selected).SCOPID) {
                        isContinue = true; return;
                    };
                }
            }
            if ((!$rootScope.$stateParams.isDailyMode)) {
                for (var i = 0; i < 7; i++) {
                    if (($scope.weeklyOld[i] != null) && ($scope.week[i] != null)) {
                        if ($scope.week[i] != $scope.weeklyOld[i]) {
                            isContinue = true; return;
                        }
                    }
                    if (($scope.weeklyOld[i] == null) && ($scope.week[i] != null)) {
                        isContinue = true; return;
                    }
                    if (($scope.weeklyOld[i] != null) && ($scope.week[i] == null)) {
                        isContinue = true; return;
                    }
                }
            }
            else {
                if ($scope.timeEntry.HRS != parseFloat($scope.dailyHour)) {
                    isContinue = true; return;
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
                if ($scope.timeEntry.PRSTCD != (JSON.parse($scope.state.selected)).PTXCODE) {
                    isContinue = true; return;
                }
            }
            $scope.isAnyChange = isContinue;
            if (!isContinue)
                $scope.cancel();

        }
    }
    var updateEleValOnEdit = function (eleId, val) {
        $rootScope.errorLogMethod("SearchCtrl.updateEleValOnEdit");
        var val = parseFloat(val).toFixed(2);
        angular.element(document.getElementById(eleId)).val(val).trigger('input');
    }
    $scope.EditMode = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.EditMode");

        if ($scope.cpeListData.selected.COMPID == $scope.initialDetail.COMP_REC.COMPID) { $scope.isSameCompany = true; }

        if ($scope.timeEntry !== undefined) {

            $scope.onSelectCEPCode($scope.cpeListData.selected);
            /*hide validation message auto*/
            $scope.isDesValMsgOn = false;
            $scope.isValidHrs = true;

            $scope.isSubmit = $scope.timeEntry.TIMSUB == 'Y' ? true : false;
            $scope.isRegulatedChkd = ($scope.timeEntry.REGFLAG == 'Y') ? true : false;
            var isFound = false;
            for (var i = 0; i < $scope.state.stateprovlist.length; i++) {
                if ($scope.state.stateprovlist[i].PTXCODE == $scope.timeEntry.PRSTCD) {
                    var data = {
                        PTXCODE: $scope.state.stateprovlist[i].PTXCODE,
                        PTXNAME: $scope.state.stateprovlist[i].PTXNAME,
                        PRSTID: $scope.state.stateprovlist[i].PRSTID,
                        DEF: $scope.state.stateprovlist[i].DEF
                    };
                    isFound = true;
                    $scope.state.selected = JSON.stringify(data);
                }
            }
            if (!isFound) {
                $scope.state.selected = null;
            }

        }
        $scope.isPostback = true;
    }
    $scope.updateHrsInEditMode = function () {
        if ($rootScope.$stateParams.isCancelSearch==true) return;
        $scope.description = $scope.timeEntry.DES;
        $scope.descriptionText = $scope.timeEntry.CTDESC;
        $scope.setFav($scope.description);
        if ($rootScope.$stateParams.isDailyMode) {
            $scope.dailyHour = Number(parseFloat($scope.timeEntry.HRS).toFixed(2));
            /*on edit mode convert hour correct to 2 decimal place*/
            var unbindWatch = $scope.$watch("dailyHours", function () {
                updateEleValOnEdit("dailyHours", $scope.timeEntry.HRS);
            });

        }
        else {
            var weeklyHours = JSON.parse(localStorage.getItem('weeklyhours'));
            for (var i = 0; i < 7; i++) {
                $scope.week[i] = weeklyHours[i];
                $scope.weeklyOld[i] = weeklyHours[i];
            }
            /*convert hour correct to 2 decimal place*/
            var unbindWatch = $scope.$watch("week", function () {
                var eleId = "wkHrs";
                for (var i = 0; i < 7; i++) {
                    if (weeklyHours[i] != null) {
                        updateEleValOnEdit(eleId + (i + 1), weeklyHours[i]);
                    }
                }
            });
        }
    }
    $scope.childDataTransfer = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.childDataTransfer");
        $scope.$broadcast('update_child_controller', $scope.TotalPages, $scope.PageNumber, $scope.DataPerPage);

    }
    $scope.$on("update_parent_controller", function (event, pageNumber) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.$on.update_parent_controller");
        $scope.PageNumber = pageNumber;
        $scope.refreshResults($scope.select);
    });

    $scope.setCurrent = function (pageNumber) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.setCurrent");
        $scope.PageNumber = pageNumber;
        $scope.IsSearchDropdown = false;
        $scope.childDataTransfer();
        $scope.refreshResults($scope.select);

    }
    /*scope -- */
    $scope.bindScope = function (resObj, isEditMode) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.bindScope");
        var scopeList = {
            PSCOP_OBJ: []
        }
        if (Object.prototype.toString.call(resObj.ARR_PSCOP) != '[object Array]') {
            var data = resObj.ARR_PSCOP;
            resObj.ARR_PSCOP = [];
            resObj.ARR_PSCOP.push(data.PSCOP_OBJ);
        }

        $scope.scopeObj.scopeListData = resObj.ARR_PSCOP;
        var activeList = [];
        var inactiveList = [];
        for (var i = 0; i < $scope.scopeObj.scopeListData.length; i++) {
            var data = {
                SCOPID: $scope.scopeObj.scopeListData[i].SCOPID,
                SCOPCD: $scope.scopeObj.scopeListData[i].SCOPCD,
                DES: $scope.scopeObj.scopeListData[i].DES,
                ACTIVE: $scope.scopeObj.scopeListData[i].ACTIVE,
                DESREQ: $scope.scopeObj.scopeListData[i].DESREQ
            };
            if ($scope.scopeObj.scopeListData[i].ACTIVE == 'Y') {
                activeList.push(data);
            }
            else
                inactiveList.push(data);
        }
        $scope.scopeObj.scopeListData = activeList;
        var isFind = false;
        if (isEditMode) {
            for (var i = 0; i < $scope.scopeObj.scopeListData.length; i++) {
                if ($scope.scopeObj.scopeListData[i].SCOPID == $scope.timeEntry.SCOID) {
                    isFind = true;
                    $scope.populateDefScope($scope.timeEntry.SCOID);
                }
            }
            if (!isFind) {
                var cep = ($scope.timeEntry.CEP_REC.CLIENO);
                var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
                var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
                var cep_data = cep + '-' + eng + '-' + pro;
                if ($filter('uppercase')($scope.cepEnter) == $filter('uppercase')(cep_data)) {
                    for (var i = 0; i < inactiveList.length; i++) {
                        if (inactiveList[i].SCOPID == $scope.timeEntry.SCOID) {
                            $scope.scopeObj.scopeListData.push(inactiveList[i]);
                            $scope.populateDefScope($scope.timeEntry.SCOID);
                        }
                    }
                }
            }
        }
    }
    $scope.populateDefScope = function (scopeId) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.populateDefScope");
        var result = $.grep($scope.scopeObj.scopeListData, function (e) {
            return e.SCOPID == scopeId;
        });
        if (result.length > 0) {
            $scope.scopeObj.selected = angular.toJson(result[0]);
            if ($scope.isEditMode && $scope.isPageLoad)
                $scope.isPageLoad = false;
            else
                $scope.retrieveScopeDescription();
            $scope.isScopeValdMsgOn = false;
        }
        else {
            $scope.scopeObj.selected = null;
        }
    }
    $scope.onSelectTaskCode = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.onSelectTaskCode");
        $scope.frmValidationParms.isTaskSelected = false;
        if ($scope.task.selected != null && $scope.task.selected != "") {
            var task = JSON.parse($scope.task.selected);
            $scope.populateDefScope(task.DEFSCOPID);
            $scope.frmValidationParms.isTaskSelected = true;
        }
        else {
            $scope.scopeObj.selected = null;
        }
    }
    $scope.onSelectCEPCode = function (c) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.onSelectCEPCode");
        $scope.isScopeReq = false;
        $scope.frmValidationParms.IsCepCodeSelected = true;

        $scope.cpecode = c;
        if (($rootScope.$stateParams.IsEditMode) && (($scope.timeEntry.CEP_REC.CLIEID == c.CLIEID) && ($scope.timeEntry.CEP_REC.ENGID == c.ENGID) && ($scope.timeEntry.CEP_REC.PRJID == c.PRJID))) {
            activityService.searchActivityCode($scope.loginDetail.SESKEY, c.COMPID, $scope.domainURL).then(function (response) {
                if (parseInt(response.LOADACTI_OUT_OBJ.RETCD) == 0) {
                    for (var i = 0; i < response.LOADACTI_OUT_OBJ.ACTI_ARR.length; i++) {
                        if (response.LOADACTI_OUT_OBJ.ACTI_ARR[i].ACTICD == $scope.timeEntry.ACTI_REC.ACTICD) {
                            $scope.activity.selected = (response.LOADACTI_OUT_OBJ.ACTI_ARR[i]);
                            $scope.frmValidationParms.isActivitySel = true;
                            /*hide validation message auto*/
                            $scope.isActValdMsgOn = false;
                            $scope.AcivityFev = checkActivityFac($scope.activity.selected);

                            $scope.isActivityActive = $scope.activity.selected.STAT == 'Y' ? true : false;

                        }
                    }
                }
            });
        }

        if ((typeof c.CATID !== 'undefined')) {
            if (parseInt(c.CATID) > 0) {
                $scope.IsActivity = false;
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

                        var activeList = [];
                        var inactiveList = [];

                        $scope.component.projectListData = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR;
                        for (var j = 0; j < $scope.component.projectListData.PCAT_OBJ.ARR_PCOM.length; j++) {
                            var data = {
                                CMPTID: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].CMPTID,
                                CMPTCD: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].CMPTCD,
                                DES: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].DES,
                                ACTIVE: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTIVE,
                                DESREQ: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].DESREQ,
                                DEFDES: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].DEFDES,
                                ACTICD: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTICD,
                                ORD: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].ORD,
                                ARR_PTSK: $scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].ARR_PTSK

                            };

                            if ($scope.component.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTIVE == 'Y') {
                                activeList.push(data);
                            }
                            else {
                                inactiveList.push(data);
                            }
                        }

                        $scope.component.projectListData.PCAT_OBJ.ARR_PCOM = activeList;
                        if (!$rootScope.$stateParams.IsEditMode) {

                        }
                        else {
                            var cep = ($scope.timeEntry.CEP_REC.CLIENO);
                            var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
                            var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
                            var cep_data = cep + '-' + eng + '-' + pro;
                            if ($filter('uppercase')($scope.cepEnter) == $filter('uppercase')(cep_data)) {
                                $scope.descriptionText = $scope.timeEntry.CTDESC;

                            }
                            var isFind = false;
                            for (var i = 0; i < $scope.component.projectListData.PCAT_OBJ.ARR_PCOM.length; i++) {
                                if ($scope.component.projectListData.PCAT_OBJ.ARR_PCOM[i].CMPTID == $scope.timeEntry.CMPTID) {
                                    isFind = true;
                                    $scope.component.selected = JSON.stringify($scope.component.projectListData.PCAT_OBJ.ARR_PCOM[i]);
                                    /*hide validation message auto*/
                                    $scope.isCompoValMsgOn = false;
                                    break;


                                }
                            }
                            if ((!isFind)) {

                                var cep = ($scope.timeEntry.CEP_REC.CLIENO);
                                var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
                                var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
                                var cep_data = cep + '-' + eng + '-' +pro;
                                if ($filter('uppercase')($scope.cepEnter) == $filter('uppercase')(cep_data)) {
                                    for (var i = 0; i < inactiveList.length; i++) {
                                        if (inactiveList[i].CMPTID == $scope.timeEntry.CMPTID) {
                                            isFind = true;
                                            $scope.component.projectListData.PCAT_OBJ.ARR_PCOM.push(inactiveList[i]);
                                            $scope.component.selected = JSON.stringify(inactiveList[i]);
                                            /*hide validation message auto*/
                                            $scope.isCompoValMsgOn = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        $scope.component.projectListData.PCAT_OBJ.ARR_PCOM.sort(function (a, b) {
                            return a.ORD - b.ORD
                        });

                        $scope.onSelectComponentCode();
                        /*code for scope*/
                        if (response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.SCOREQ === 'Y') {
                            $scope.isScopeReq = true;
                            $scope.bindScope(response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ, $rootScope.$stateParams.IsEditMode);
                        }

                        /*---------end-------*/
                    }
                });
            }
            else {
                $scope.IsActivity = true;
                $scope.frmValidationParms.IsCepCodeSelected = true;
            }
        }
        else {
            $scope.IsActivity = true;
            $scope.frmValidationParms.IsCepCodeSelected = true;
        }
        if ($rootScope.$stateParams.IsEditMode && $scope.IsActivity) {
            var cep = ($scope.timeEntry.CEP_REC.CLIENO);
            var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
            var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
            var cep_data = cep + '-' + eng + '-' + pro;
            if ($filter('uppercase')($scope.cepEnter) == $filter('uppercase')(cep_data)) {
                $scope.descriptionText = $scope.timeEntry.CTDESC;

            }

        }
    }

    $scope.onSelectComponentCode = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.onSelectComponentCode");
        $scope.frmValidationParms.isTaskSelected = false;
        if ($scope.component.selected != null && $scope.component.selected != undefined && $scope.component.selected != "")
            $scope.frmValidationParms.isProjectSelected = true;
        else
            $scope.frmValidationParms.isProjectSelected = false;
        $scope.clearNoComponent();
        if ($scope.component.selected != null) {
            var component = JSON.parse($scope.component.selected);

            if (Object.prototype.toString.call(component.ARR_PTSK) != '[object Array]') {
                var data = component.ARR_PTSK;
                component.ARR_PTSK = [];
                component.ARR_PTSK.push(data.PTSK_OBJ);
            }

            if (component.ARR_PTSK.length > 0) {
                component.ARR_PTSK.sort(function (a, b) {
                    return a.ORD - b.ORD
                });
                $scope.task.taskListData = component.ARR_PTSK;
                if (!$rootScope.$stateParams.IsEditMode) {
                }
            }
        }

        var activeList = [];
        var inactiveList = [];
        for (var i = 0; i < $scope.task.taskListData.length; i++) {
            var data = {
                TSKID: $scope.task.taskListData[i].TSKID,
                TSKCD: $scope.task.taskListData[i].TSKCD,
                DES: $scope.task.taskListData[i].DES,
                ACTIVE: $scope.task.taskListData[i].ACTIVE,
                DESREQ: $scope.task.taskListData[i].DESREQ,
                DEFDES: $scope.task.taskListData[i].DEFDES,
                DEFSCOPID: $scope.task.taskListData[i].DEFSCOPID,
                ACTICD: $scope.task.taskListData[i].ACTICD,
                ORD: $scope.task.taskListData[i].ORD
            };
            if ($scope.task.taskListData[i].ACTIVE == 'Y') {
                activeList.push(data);
            }
            else
                inactiveList.push(data);
        }
        $scope.task.taskListData = activeList;
        if ($rootScope.$stateParams.IsEditMode) {
            var cep = ($scope.timeEntry.CEP_REC.CLIENO);
            var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
            var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
            var cep_data = cep + '-' + eng + '-' + pro;
            if ($filter('uppercase')($scope.cepEnter) == $filter('uppercase')(cep_data)) {
                $scope.descriptionText = $scope.timeEntry.CTDESC;
            }
            var isFind = false;
            for (var i = 0; i < $scope.task.taskListData.length; i++) {
                if ($scope.task.taskListData[i].TSKID == $scope.timeEntry.TSKID) {
                    isFind = true;
                    $scope.frmValidationParms.isTaskSelected = true;
                    $scope.task.selected = JSON.stringify($scope.task.taskListData[i]);
                    /*hide validation message auto*/
                    $scope.isTaskValdMsgOn = false;
                    break;
                }
            }
            if (!isFind) {
                var cep = ($scope.timeEntry.CEP_REC.CLIENO);
                var eng = parseInt($scope.timeEntry.CEP_REC.ENGNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : parseInt($scope.timeEntry.CEP_REC.ENGNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.ENGNO)).toString();
                var pro = parseInt($scope.timeEntry.CEP_REC.PRJNO) > 99 ? (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : parseInt($scope.timeEntry.CEP_REC.PRJNO) > 9 ? '0' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString() : '00' + (parseInt($scope.timeEntry.CEP_REC.PRJNO)).toString();
                var cep_data = cep + '-' + eng + '-' + pro;
                if ($filter('uppercase')($scope.cepEnter) == $filter('uppercase')(cep_data)) {
                    for (var i = 0; i < inactiveList.length; i++) {
                        if (inactiveList[i].TSKID == $scope.timeEntry.TSKID) {
                            isFind = true;
                            $scope.task.taskListData.push(inactiveList[i]);
                            $scope.frmValidationParms.isTaskSelected = true;
                            $scope.task.selected = JSON.stringify($scope.task.taskListData[i]);
                            /*hide validation message auto*/
                            $scope.isTaskValdMsgOn = false;
                            break;
                        }

                    }
                }
            }
            if ($scope.task.taskListData.length > 0) {
                $scope.task.taskListData.sort(function (a, b) {
                    $rootScope.errorLogMethod("SearchCtrl.$scope.task.taskListData.sort");
                    return a.ORD - b.ORD
                });
            }
            if (!$scope.frmValidationParms.isTaskSelected) { $scope.task.selected = null; $scope.scopeObj.selected = null; }
        }


    };

    $scope.isDescDisable = false;
   
    $scope.retrieveDescription = function () {

        $rootScope.errorLogMethod("SearchCtrl.$scope.retrieveDescription");
        $scope.onSelectTaskCode();
        if (($scope.component.selected == null) || ($scope.task.selected == null))
            return;
        if ((JSON.parse($scope.task.selected).DESREQ == 'Y') && (!$scope.isScopeReq)) {
            $scope.isDescDisable = true;
            if (!$rootScope.$stateParams.isCalFlg) {
                $scope.description = null;
            }
            $scope.loadDescription();
        }
        else {
            $scope.isDescDisable = false;
            if ((!$scope.isScopeReq) )
                $scope.textAreaDescription();
        }


    };

    $scope.retrieveScopeDescription = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.retrieveScopeDescription");
        if (($scope.component.selected == null) || ($scope.task.selected == null) || ($scope.scopeObj.selected == null))
            return;
        if ((JSON.parse($scope.scopeObj.selected).DESREQ == 'Y')) {
            $scope.isDescDisable = true;
            if (!$rootScope.$stateParams.isCalFlg) {
                $scope.description = null;
            }
            $scope.loadDescription();
        }
        else{
            $scope.isDescDisable = false;
            $scope.textAreaDescription();
        }

    };

    $scope.textAreaDescription = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.textAreaDescription");
        var desc = $scope.description;

        if (!$scope.IsActivity) {
            if (($scope.component.selected == null) && ($scope.task.selected == null)) {
                return;
            }
            if (($scope.isScopeReq) && ($scope.scopeObj.selected == null))
                return;
            $scope.description = JSON.parse($scope.component.selected).DES + ' > ' + JSON.parse($scope.task.selected).DES;
            if ($scope.isScopeReq)
                $scope.description = $scope.description + ' > ' + JSON.parse($scope.scopeObj.selected).DES;
            if ($scope.descriptionText != '' || $rootScope.$stateParams.isCalFlg) {
                if ($rootScope.$stateParams.isCalFlg && $scope.descriptionText == '') {
                    $scope.description = $scope.description + ' : ' + $scope.desFromImportCal;
                }
                else {
                    $scope.description = $scope.description + ' : ' + $scope.descriptionText;
                }
                $scope.setFav($scope.description);
            }

            else {
                if (JSON.parse($scope.task.selected).DEFDES.length > 0) {
                    $scope.description = $scope.description + ' : ' + JSON.parse($scope.task.selected).DEFDES;
                    return;
                }
                if (JSON.parse($scope.component.selected).DEFDES.length > 0) {
                    $scope.description = $scope.description + ' : ' + JSON.parse($scope.component.selected).DEFDES;
                }

            }
        }
        else {
            $scope.description = $scope.descriptionText;
        }


    };

    //to do for the Desktop IC service call
    $scope.entryChange = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.entryChange");
        if ($scope.entry.value == 'IC') {
            loadICRates.loadICRate($scope.loginDetail.SESKEY, $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
                if (parseInt(response.LOADICRT_OUT_OBJ.RETCD) == 0) {
                    $scope.icListData = response.LOADICRT_OUT_OBJ.ICRATE_ARR;
                }
            });
        }
        else {
            $scope.icListData = [];
        }
    }
    $scope.dailyHour = null;
    $scope.description = '';
    $scope.isCancelCall = false;
    $scope.cancel = function () {
        if ($scope.isCancelCall) return;
        $scope.finalSaveCall = true;
        var isLoginValid = $rootScope.GetLoginDetail(false, true);
        if (isLoginValid != null && isLoginValid != undefined) {
            $scope.isCancelCall = true;
            $rootScope.errorLogMethod("SearchCtrl.$scope.cancel");
            $state.go('Main', {
                "loadDate": $rootScope.$stateParams.startDate,
                "isDailyMode": $rootScope.$stateParams.isDailyMode,
                "currentDate": $rootScope.$stateParams.currentDate
            });
        }
    }

    $scope.TimeId = 1;

    $scope.revDisable = function (rowNo) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.revDisable");
        if (!$scope.isDailyMode) {
            var isDisable = false;
            var startDate = $filter('date')($scope.revenueCurrentMonth.STRTDTE, 'yyyy-MM-dd');
            var parts = startDate.split("-");
            var day = parts[2].split(' ');
            var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
            var currentDate = new Date($rootScope.$stateParams.startDate.valueOf());
            var date = currentDate.setDate(currentDate.getDate() + rowNo);
            if (new Date(nstartDate.valueOf()) > new Date(date.valueOf()))
                isDisable = true;
            if (isDisable === false) {
                var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
                isDisable = $rootScope.isDatePriorToBillingDate(billingDate, date);
            }
            return isDisable
        }
    }

    $scope.isSet = false;
    $scope.isHourSet = false;
    $scope.hourId = '';
    $scope.hourNumber = 0;
    $scope.setValue = function () {
        $scope.isSet = true;
    }

    $scope.setHourValue = function (hourId, hourNumber) {
        $scope.isHourSet = true;
        $scope.hourId = hourId;
        $scope.hourNumber = hourNumber;
        $scope.is24HourMsgShown = false;
        $scope.isRoundingMsgShown = false;
        //$scope.saveOn = false;
        //$scope.enterPress =false;
    }

    var chkHrsBadinput = function () {
        var iscontinue = true;
        for (var i = 1; i <= 7; i++) {
            var a = angular.element(document.getElementById('wkHrs' + i))[0];
            if (a.validity.badInput) {
                iscontinue = false;
                break;
            }
        }

        return iscontinue;
    }
    /*Hide validation message on focus*/
    $scope.onFocusCep = function () {
        $scope.isSet = true;
        $scope.isCepValdMsgOn = false;
        $scope.oldCep = $scope.cepEnterText;
        localStorage.setItem('cepFocus', "1");

    }
    $scope.onFocusActivity = function () {

        if ($scope.frmValidationParms.IsCepCodeSelected || $scope.cepEnterText != null || $scope.cepEnterText.length > 0)
            $scope.isActValdMsgOn = false;
    }
    $scope.onFocusComponent = function () {
        $scope.isCompoValMsgOn = false;
    }
    $scope.onFocusTask = function () {
        $scope.isTaskValdMsgOn = false;
    }
    $scope.onFocusScope = function () {
        $scope.isScopeValdMsgOn = false;
    }

    $scope.isDesValid = false;
    $scope.onFocusDescrption = function () {
        var val = angular.element(document.getElementById('txthidden')).val();
        if (val != 'true') {
            $scope.isDesValMsgOn = false;
            $scope.isDesFocused = true;
            $scope.isDesValid = true;
        }

    }
    $scope.removeTabKey = function ($event) {
        //$event.stopPropagation();
        $timeout(function(){
            $scope.description = $scope.description.replace(/\n/g, " ");
            $scope.description = $scope.description.replace(/\t/g, " ");
            checkDescFav();
        });        
    }
    var validateWeeklyHrs = function () {
        var iscontinue = true;
        var isAnyHrsEntered = false;
        for (var i = 1; i <= 7; i++) {
            var a = angular.element(document.getElementById('wkHrs' + i))[0];
            if (a.validity.badInput) {
                iscontinue = false;
                break;
            }
        }

        //check for is any hour entered
        if (iscontinue) {
            iscontinue = false;
            for (var i = 0; i <= 6; i++) {
                if ($scope.week[i] != null && $scope.week[i].toString() != "") {
                    iscontinue = true;
                    break;
                }
            }
        }
        return iscontinue;
    }

    $scope.isCepValdMsgOn = false;
    $scope.isActValdMsgOn = false;
    $scope.isDesValMsgOn = false;
    $scope.isCompoValMsgOn = false;
    $scope.isTaskValdMsgOn = false;
    $scope.isScopeValdMsgOn = false;
    var showInlneValidationOnSveBtn = function () {
        var isContinue = true;
        $scope.isValidHrs = true;
        $scope.isScopeValdMsgOn = $scope.isTaskValdMsgOn = $scope.isCompoValMsgOn = $scope.isDesValMsgOn = $scope.isActValdMsgOn = $scope.isCepValdMsgOn = false;
        if ($scope.cepEnterText == null || $scope.cepEnterText.trim().length == 0 || !$scope.frmValidationParms.IsCepCodeSelected) {
            $scope.isCepValdMsgOn = true;
            if ($scope.IsActivity)
                $scope.isActValdMsgOn = true;
            else {
                $scope.isCompoValMsgOn = true;
                $scope.isTaskValdMsgOn = true
                $scope.isScopeValdMsgOn = $scope.isScopeReq;
            }
            isContinue = false;
        }
        else if ($scope.frmValidationParms.IsCepCodeSelected) {
            if ($scope.IsActivity) {
                if ($scope.activity.selected.DES == null || $scope.activity.selected.DES.trim().length == 0) {
                    $scope.isActValdMsgOn = true;
                    isContinue = false;
                }
            }
                //check component/task/scope
            else {
                if (!$scope.frmValidationParms.isProjectSelected) { $scope.isCompoValMsgOn = true; isContinue = false; }
                if (!$scope.frmValidationParms.isTaskSelected) { $scope.isTaskValdMsgOn = true; isContinue = false; }
                if ($scope.isScopeReq === true && ($scope.scopeObj.selected == null || $scope.scopeObj.selected == "")) { $scope.isScopeValdMsgOn = true; isContinue = false; }
            }
        }

        /*for description*/
        if ($scope.description == null || $scope.description.trim().length == 0) {
            $scope.isDesValMsgOn = true;
            isContinue = false;
        }
        //show validation message for hours

        if ($scope.isDailyMode) {
            var time = parseFloat($scope.dailyHour);
            if (isNaN(time)) {
                isContinue = false;
                $scope.isValidHrs = false;
            }
        }
        else {
            $scope.isValidHrs = validateWeeklyHrs();
            if ($scope.isValidHrs == false)
                isContinue = false;
        }
        if (!isContinue) {
            angular.element(document.getElementById('txthidden')).val(true);
        }
        return isContinue;
    }

    $scope.setValue = function () {
        $scope.isValidHrs = true;
        $scope.isSet = true;
    }

    $scope.saveOn = false;

    $scope.enterPress = false;
    $scope.save = function () {       
        $scope.fucusedItemName = angular.element(window.document.activeElement).attr('id');
        var hrsNo = $scope.hourNumber;       
        $scope.enterPress = localStorage.getItem('enterPress');
        if ($scope.enterPress == "1")
            $scope.enterPress = true;
        else
            $scope.enterPress = false;

        $scope.isFormValid = showInlneValidationOnSveBtn();
        $scope.isFormProcess = $scope.isFormValid;
        var hrsValid = $scope.isValidHrs;
        $scope.isPartitionErr = false;
        $scope.InitializeValidationMsg();
        $scope.noOfwarningPopup = 0;
        $scope.saveOn = true; $scope.cancelFlag = false; $scope.finalSaveCall = false;
        $scope.is24HourMsgShown = false; $scope.isRoundingMsgShown = false;
        if ($scope.isSet && !$scope.enterPress)
            return;
        var callHours = false;
        if ($scope.isHourSet && $scope.isFormValid) {
            if ($scope.hourId != '') {
                $scope.checkHours($scope.hourId, $scope.hourNumber);
                if (!hrsValid) $scope.isValidHrs = false;
                $scope.isHourSet = true;
            }
            else if (!$scope.enterPress)
                return;
        }
        if ($scope.isDesValid) {
            $scope.descriptionBlur();
        }

        if ($scope.isFormValid) {
            if ($rootScope.$stateParams.startDate == undefined) {
                dateVal = new Date();
            }
            //set the date in the api formate 
            var startDate = $filter('date')($rootScope.$stateParams.startDate, 'yyyy-MM-dd');

            var taskSelected = JSON.parse($scope.task.selected);
            var componentSelected = JSON.parse($scope.component.selected);
            var scopeId = '0';
            if ($scope.isScopeReq === true) {
                var scopeSelected = JSON.parse($scope.scopeObj.selected);
                scopeId = scopeSelected.SCOPID;
            }
            var deleteEntry = '';
            validateForOldData();
            if (!$scope.isAnyChange) return;
            cepService.loadCEPDetail($scope.loginDetail.SESKEY, $scope.cpecode.CLIEID, $scope.cpecode.ENGID, $scope.cpecode.PRJID, $scope.domainURL).then(function (response) {
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
                    var activity = {
                    };
                    // Get activity associated with Component
                    if (response.LOADCEP_OUT_OBJ.CEP_REC.CATID != 0) {
                        activity = {
                            ACTICD: componentSelected.ACTICD,
                            DES: '',
                            STAT: 'Y',
                            COMPID: 0
                        }
                    }
                    else {
                        activity = ($scope.activity.selected);
                    }

                    var enteries = 1;

                    if (!$scope.isDailyMode) {
                        enteries = 7
                    }
                    var json = [];

                    var teid_data = [];
                    if ($rootScope.$stateParams.IsEditMode) {
                        teid_data = JSON.parse(localStorage.getItem('teid_data'));
                    }
                    var isDelete = false;
                    for (var i = 0; i < enteries; i++) {

                        var currentDate = new Date($rootScope.$stateParams.startDate.valueOf());
                        var time;
                        var timeEntered = true;
                        //var time = $scope.isDailyMode ? parseFloat($scope.dailyHour) : parseFloat($scope.week[i].toString().length > 0 ? $scope.week[i] : 0);
                        if ($scope.isDailyMode) {
                            time = parseFloat($scope.dailyHour);
                            if (isNaN(time))
                                timeEntered = false;
                            else {
                                if ((time > 24) && (time < 200)) {                                  
                                
                                    if ((!callHours && ($scope.isHourSet || $scope.fucusedItemName == 'dailyHours'))) {
                                        consfirmSave(0);
                                        callHours = true;
                                    }
                                }
                            }
                        }
                        else {
                            if ($scope.week[i] != null) {
                                time = parseFloat($scope.week[i]);

                            }
                            else {

                                timeEntered = false;
                                if ($rootScope.$stateParams.IsEditMode) {
                                    if (($scope.weeklyOld[i] != null) && ($scope.week[i] == null)) {
                                        isDelete = true;
                                    }
                                }
                            }
                        }




                        //var date = $filter('date')((currentDate.getDate() + i), 'yyyy-MM-dd');
                        var date = currentDate.setDate(currentDate.getDate() + i);
                        date = $filter('date')(date, 'yyyy-MM-dd');

                        var teid = $rootScope.$stateParams.IsEditMode ? $scope.timeEntry.TEID : 0;
                        if (($rootScope.$stateParams.IsEditMode) && (!$rootScope.$stateParams.isDailyMode)) {


                            teid = teid_data[i];
                            var del = null;
                            if (teid.toString().split(',').length > 1) {
                                var arr = teid.toString().split(',');
                                var del = arr[0].toString();
                                for (var j = 1; j < arr.length; j++) {
                                    var del = del + "," + arr[j].toString();                                 

                                }


                            }
                            else {
                                if (teid.toString().split(',').length == 1) {
                                    var arr = teid.toString().split(',');
                                    var del = arr[0].toString();
                                }
                            }

                            if (del != null) {
                                deleteEntry = deleteEntry == '' ? del : deleteEntry + ',' + del;
                                teid = 0;
                            }
                        }

                        if (timeEntered) {
                            var time_obj = {
                                TEID: teid,
                                DTE: date,
                                CEP_REC: response.LOADCEP_OUT_OBJ.CEP_REC,
                                ACTI_REC: activity,
                                ICRTCD: "",
                                ICDESC: "",
                                ICCHRGE: 0,
                                HRS: time,
                                DES: $scope.description, //$scope.IsActivity ? activityData.DES + ':' + $scope.description : componentSelected.DES + '/ ' + taskSelected.DES + ': ' + $scope.description,
                                CTDESC: $scope.descriptionText,// $scope.IsActivity ? activityData.DES + ':' + $scope.description : componentSelected.DES + '/ ' + taskSelected.DES + ': ' + $scope.description,
                                CMPTID: $scope.IsActivity ? 0 : componentSelected.CMPTID,
                                CATID: $scope.IsActivity ? 0 : $scope.cpecode.CATID,
                                TSKID: $scope.IsActivity ? 0 : taskSelected.TSKID,
                                SCOID: scopeId,
                                REGFLAG: ($scope.isRegulatedChkd === true ? "Y" : "N"),//"N",
                                PRSTCD: ($scope.state.selected == null) || ($scope.state.selected == '') ? '' : (JSON.parse($scope.state.selected)).PTXCODE

                            }

                            var j = JSON.stringify(time_obj);
                            json.push(j);
                        }
                    }                                       
                    if ((!$scope.isDailyMode)) {                        
                        var hrs = $scope.week[hrsNo];
                        if ((hrs > 24) && (!callHours) && $scope.isHourSet) {                            
                            consfirmSave(0);
                        }
                    }
                    if (json.length == 0 && timeEntered == false)
                        $scope.isValidHrs = false;
                    /*save to DB if form is valid*/
                    if ((json.length > 0) && (validateTimeEntry(componentSelected, $scope.IsActivity, response.LOADCEP_OUT_OBJ.CEP_REC, json))) {
                        $scope.callSave(json, deleteEntry);

                    }
                    else {
                        $scope.saveOn = false;
                        $scope.isFormProcess = false;
                       
                    }
                }
            });
            localStorage.save = true;
        }
        else {
            if ($scope.isHourSet) {
                if ($scope.hourId != '') {
                    $scope.checkHours($scope.hourId, $scope.hourNumber);
                    $scope.isFormProcess = true;
                    if (!hrsValid) $scope.isValidHrs = false;
                    $scope.isHourSet = false;                   
                    if ($scope.noOfwarningPopup == 0) {
                        $scope.enterPress = false; $scope.saveOn = false;
                    }
                  
                }
                else if (!$scope.enterPress) {  $scope.saveOn = false;  return; }
                  
            }
        }
        localStorage.setItem('enterPress', "0");
    }
    var chkWeeklyHourFor24 = function () {
        for (var i = 0; i <= 6; i++) {
            if ($scope.week[i] != null && $scope.week[i].toString() != "") {
                if ($scope.week[i] > 24) {
                    // $scope.isMoreThan24HMsgDisplayed
                    return true;
                }
            }
        }
        return false;
    }
    var showRoundPopUp = function () {
        var tintVal = $scope.initialDetail.COMP_REC.TINT;
        for (var i = 0; i < $scope.arrFlagRound.length; i++) {
            if ($scope.arrFlagRound[i] == true) {
                var msg = $filter('translate')('msg_HoursRound', { TINT: tintVal });

                $scope.isRoundingMsgShown = true;
                $scope.loadErrorPopup(false, msg);
                $scope.warningPopup = true;
                $scope.noOfwarningPopup = $scope.noOfwarningPopup + 1;
                if ($scope.noOfwarningPopup > 1 && $scope.enterPress && $scope.fucusedItemName.indexOf("wkHrs") == 0) {
                    $('#' + $scope.fucusedItemName).trigger('blur');
                }
                break;
            }
        }
        $scope.isRoundingMsgShown = true;
        
    }

    $scope.callSave = function (json, deleteEntry) {
        if (!$rootScope.$stateParams.isDailyMode && !$scope.isRoundingMsgShown) {
            showRoundPopUp();
        }

        $rootScope.errorLogMethod("SearchCtrl.$scope.callSave");
        
        if ($scope.noOfwarningPopup == 0) {
            $scope.enterPress = false;
            $scope.saveOn = false;
            $scope.finalSave(json, deleteEntry);
        }
        else {
            $scope.json = json;
            $scope.deleteEntry = deleteEntry;
        }
    }

    var loadHomePage = function () {
        $rootScope.errorLogMethod("SearchCtrl.loadHomePage");
        $state.go('Main', {
            "loadDate": $rootScope.$stateParams.startDate,
            "isDailyMode": $rootScope.$stateParams.isDailyMode,
            "currentDate": $rootScope.$stateParams.currentDate
        });
    }

    $scope.finalSave = function (json, deleteEntry) {
        cepService.saveTimeSheet($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, json[0], $scope.domainURL).then(function (response) {
            if (parseInt(response.SAVTIM_OUT_OBJ.RETCD) == 0) {
                json.splice(0, 1);
                if (json.length > 0) {
                    $scope.finalSave(json, deleteEntry);
                }
                else {
                    if (deleteEntry != null && deleteEntry.trim().length > 0) {
                        gridDataService.deleteTimeEntries($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, deleteEntry).then(function (response) {
                            if (parseInt(response.DELTIM_OUT_OBJ.RETCD) == 0) {
                                loadHomePage();
                            }
                            else {
                                $scope.loadErrorPopup(true, response.DELTIM_OUT_OBJ.ERRMSG);
                            }
                        })
                    }
                    else {
                        loadHomePage();
                    }
                }
            }
            else {
                if (!chekForDBPartitionError(response.SAVTIM_OUT_OBJ.ERRMSG, json, deleteEntry))
                    $scope.loadErrorPopup(true, response.SAVTIM_OUT_OBJ.ERRMSG);
            }

        });
    }

    var chekForDBPartitionError = function (errMsg, json, deleteEntry) {
        $rootScope.errorLogMethod("SearchCtrl.chekForDBPartitionError");
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
                    var msg = $filter('translate')('msg_DBParttionEr', { dateValue: dates });
                    if ($rootScope.$stateParams.isDailyMode)
                        $scope.loadErrorPopup(true, msg);
                    else
                        $scope.loadErrorPopup(true, msg);
                    $scope.callDeleteAPI(deleteEntry, false, false)

                }

            }
        }
        return $scope.isPartitionErr;
    }


    $scope.callDeleteAPI = function (deleteEntry, isGoToHome, isShowErr) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.callDeleteAPI");
        if (deleteEntry != null && deleteEntry.trim().length > 0) {
            gridDataService.deleteTimeEntries($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, deleteEntry).then(function (response) {
                if (parseInt(response.DELTIM_OUT_OBJ.RETCD) == 0) {
                    if (isGoToHome)
                        loadHomePage();
                }
                else {
                    if (isShowErr)
                        $scope.loadErrorPopup(true, response.DELTIM_OUT_OBJ.ERRMSG);
                }

            })
        }
    }
    $scope.isValidHrs = true;

    $scope.finalSaveCall = false;   
    $scope.checkHours = function (id, addDay) {        
        $rootScope.errorLogMethod("SearchCtrl.$scope.checkHours");        
        if (!$scope.isHourSet || $scope.finalSaveCall) {
            return;
        }
        $scope.isHourSet = false;
        $scope.hourId = '';
        $scope.hourNumber = 0;
        var focused = document.activeElement;


        $scope.isValidHrs = true;
        if ($scope.isDailyMode) {
            var a = angular.element(document.getElementById(id))[0];
            if (a.validity.badInput) {
                $scope.isValidHrs = false; return;
            }
        }
        else {
            for (var i = 1; i <= 7; i++) {
                var a = angular.element(document.getElementById('wkHrs' + i))[0];
                if (a.validity.badInput) {
                    $scope.isValidHrs = false;
                    break;
                }
            }

        }
        var val = angular.element(document.getElementById(id)).val();
        if ((val != null) && (val != '')) {
            Number(val);

            var tintVal = $scope.initialDetail.COMP_REC.TINT;
            val = getNearestMultple(val, tintVal, addDay);
            if (!$scope.isDailyMode) {
                $scope.weekOldData[addDay] = val;
            }
            angular.element(document.getElementById(id)).val(val).trigger('input');
            if ($rootScope.$stateParams.IsEditMode && $scope.isDailyMode) {

                if ($scope.isRoundingMsgShown && $scope.noOfwarningPopup==0) {
                    if ($scope.saveOn) {
                        validateForOldData();
                        if (!$scope.isAnyChange) return;
                    }

                    var msg = $filter('translate') ('msg_HoursRound', {
                        TINT: tintVal
                    });
                    $scope.loadErrorPopup(false, msg);
                    //if ($scope.saveOn) {
                    $scope.warningPopup = true;
                    $scope.noOfwarningPopup = $scope.noOfwarningPopup +1;
                }
            }
           
            if ((!$scope.saveOn && !$scope.enterPress) || !$scope.isFormProcess) {
                if (!$scope.isDailyMode && !$scope.saveOn && !$scope.enterPress && $scope.noOfwarningPopup > 0) {                    
                    return;
                }
                if (val > 200) {
                    $scope.loadErrorPopup(true, $scope.frmValidationParms.exHour1); return;
                }
                if (val < -200) {
                    $scope.loadErrorPopup(true, $scope.frmValidationParms.exHour2); return;
                }
                if ((val > 24) && (val < 200)) consfirmSave(addDay);
                
            }

        }
        else {
            $scope.week[addDay] = null;           
            $('#' + $scope.fucusedItemName).trigger('focus');
        }

    }

    var checkEachTEFrmJson = function (json, msgAr) {
        var erObj = { bilingDteEr: "", inValidFutureTEEr: "", negHrsMsg: "", excHrsMsg: "", excNegHrsMsg: "" };
        var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
        var parts = billingDate.split("-");
        var day = parts[2].split(' ');
        var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);       
        for (var i = 0; i < json.length; i++) {
            var time_Obj = JSON.parse(json[i]);

            if (parseFloat(time_Obj.HRS) > 200 && erObj.excHrsMsg =="") {
                erObj.excHrsMsg= $scope.frmValidationParms.exHour1;
            }
            if (parseFloat(time_Obj.HRS) < -200 && erObj.excNegHrsMsg == "") {
                erObj.excNegHrsMsg = $scope.frmValidationParms.exHour2;
            }

            if (erObj.bilingDteEr == "" && (dateService.createDate(time_Obj.DTE) < nstartDate)) {
                var show = nstartDate.toString().split(' ');
                var date = show[2] + '-' + show[1] + '-' + show[3];
                erObj.bilingDteEr= $filter('translate')('msg_TimePriorToBillingStartDate', { dateVal: date });
            }
            if (erObj.inValidFutureTEEr == "" && isInvalidFutureEntry(time_Obj)) {               
                erObj.inValidFutureTEEr = $filter('translate')('msg_FutureTimeEntry');
            }
            if (erObj.negHrsMsg==="" && parseFloat(time_Obj.HRS) < 0) {
                erObj.negHrsMsg = commonUtilityService.validateTENegValue(time_Obj, $scope.initialDetail, true);               
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

    /*save form validation -- start*/
    var validateTimeEntry = function (componentSelected, isActivity, cep_detail, json) {
        $rootScope.errorLogMethod("SearchCtrl.validateTimeEntry");
        var time_Obj = JSON.parse(json[0]);
        var msgEr = [];
        var blockcharges = $scope.initialDetail.COMP_REC.BCHB;
        var componentSelected = JSON.parse($scope.component.selected);
        var taskSelected = JSON.parse($scope.task.selected);

        var scopeSelected = JSON.parse($scope.scopeObj.selected);

        if (cep_detail.CLIEACTIVE != 'Y' || cep_detail.ENGACTIVE != 'Y' || cep_detail.PRJACTIVE != 'Y') {            
            $scope.loadErrorPopup(true, $filter('translate')('msg_InActiveCep')); return false;
        }
        if (cep_detail.ENGTIMFLAG != 'Y') {
            msgEr.push($filter('translate')('msg_SelectAnotherEng'));           
        }

        if ((cep_detail.PRJTIMFLAG != 'Y')) {
            msgEr.push($filter('translate')('msg_SelectAnotherPrj'));           
        }
        if ((blockcharges != null) && (blockcharges != '')) {
            for (var i = 0; i < blockcharges.length; i++) {
                if (cep_detail.CHARBASIS == blockcharges.charAt(i)) {
                    msgEr.push($filter('translate')('msg_CEPChargeBasisErr'));                    
                }
            }
        }
        if ((time_Obj.ACTI_REC.STAT != 'Y') && (time_Obj.ACTI_REC.ACTICD != null) && ((time_Obj.ACTI_REC.ACTICD != ''))) {            
            msgEr.push($filter('translate')('msg_InActiveActivity'));
        }
        if ((time_Obj.ACTI_REC.ACTICD == null) || (time_Obj.ACTI_REC.ACTICD == '') || time_Obj.ACTI_REC.ACTICD == undefined)
            return false;
        checkEachTEFrmJson(json, msgEr);

        if ((componentSelected != null) && (componentSelected != '') && (taskSelected != null) && (taskSelected != '')) {
            if ((componentSelected.ACTIVE != 'Y') || (taskSelected.ACTIVE != 'Y')) {                
                msgEr.push($filter('translate')('msg_invalidProjectComponent'));
            }
        }
        if ((scopeSelected != null) && (scopeSelected != '')) {
            if ((scopeSelected.ACTIVE != 'Y')) {                
                msgEr.push($filter('translate')('msg_PrjScopNotValid'));
            }
        }       
       
        //if ($scope.initialDetail.EMPL_REC.BRATE.toString() == "222")
        //{           
        //    msgEr.push($filter('translate')('msg_InvaildBillingRate'));
        //}
        
        $scope.frmValidationParms.isDesReq = true;
        $scope.saveDailyCalFrm.cepDes.$touched = true;
        if (($scope.description == '') || ($scope.description == null)) {           
            return false;
        }
               
        if (msgEr.length > 0) {
            if (msgEr.length > 2) {
                msgEr = msgEr.slice(0, 2);
                msgEr[2] = $filter('translate')('msg_TEMultipleErr');
            }
            if (msgEr.length > 1) {
                msgEr[0] = "- " + msgEr[0];
                msgEr[1] = "- " + msgEr[1];
            }
            $scope.loadErrorPopup(true,msgEr);
            return false;
        }
        if (((cep_detail.RENPRJNO != null) && (cep_detail.RENPRJNO != ' ')) && (typeof cep_detail.RENPRJNO != 'undefined') && (!$scope.isSubmit)) {
            var pro = parseInt(cep_detail.RENPRJNO) > 99 ? (parseInt(cep_detail.RENPRJNO)).toString() : parseInt(cep_detail.RENPRJNO) > 9 ? '0' + (parseInt(cep_detail.RENPRJNO)).toString() : '00' + (parseInt(cep_detail.RENPRJNO)).toString();
            var cepcode = cep_detail.CLIENO + '-' + cep_detail.ENGNO + '-' + cep_detail.PRJNO;
            $scope.loadErrorPopup('z', $filter('translate')('msg_ProjectRenewedPaste', { pName: pro, cepProject: cepcode }));
            $scope.warningPopup = true;
            $scope.noOfwarningPopup = $scope.noOfwarningPopup + 1;
            return true;
        }
        /**/
        return true;

    }
    /*save form validation -- end*/
    $scope.weekOldData = [null, null, null, null, null, null, null];
    $scope.arrFlagRound = [false, false, false, false, false, false, false];
    var getNearestMultple = function (hrsVal, tintVal, addDay) {
        // tintVal = '0';
        $rootScope.errorLogMethod("SearchCtrl.getNearestMultple");
        var result = 0;
        if (tintVal == '0') {
            result = parseFloat(hrsVal).toFixed(2);
            return result;
        }
        var val1 = (hrsVal % tintVal)
        if (val1 != 0) {

            if ($scope.isDailyMode) {
                $scope.isRoundingMsgShown = true;                             
                if (!$rootScope.$stateParams.IsEditMode) {
                    var msg = $filter('translate')('msg_HoursRound', {
                        TINT: tintVal
                    });
                    $scope.loadErrorPopup(false, msg);
                    //if ($scope.saveOn) {
                    $scope.warningPopup = true;
                    $scope.noOfwarningPopup = $scope.noOfwarningPopup + 1;
                }
                // }
            }
            else {
                $scope.arrFlagRound[addDay] = true;
            }
        }
        else {
            if ((!$scope.isDailyMode)) {

                if (($scope.weekOldData[addDay] == null)) {
                    $scope.arrFlagRound[addDay] = false;
                }
                else {
                    if ($scope.weekOldData[addDay] != hrsVal) {
                        $scope.arrFlagRound[addDay] = false;
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
    var consfirmSave = function (addDay) {

        $rootScope.errorLogMethod("SearchCtrl.consfirmSave");
        var dteVal = new Date($rootScope.$stateParams.startDate);
        var msg = $filter('date')(dteVal, 'dd-MMM-yyyy');

        if ($scope.isDailyMode)
            msg = $filter('translate')('msg_24HrsDay', { dateVal: msg });//'You have entered more than 24 hrs for this day, ' + msg + '?';
        else
            msg = $filter('translate')('msg_24HrsWeek', { dateVal: msg });//'You have entered more than 24 hrs for one or more days during the week of ' + msg + '.';
        $scope.loadErrorPopup(false, msg);
        // if ($scope.saveOn && $scope.isFormValid) {
        $scope.warningPopup = true;
        $scope.noOfwarningPopup = $scope.noOfwarningPopup + 1;
        $scope.is24HourMsgShown = true;
        //}

    }
    $scope.sortCEP = function (cepDetailObj) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.sortCEP");
        return cepDetailObj.sort(function (a, b) {
            return a.ENGNO - b.ENGNO
        });
    }

    $scope.sortCEPSrch = function (cepDetailObj) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.sortCEP");
        for (var i = 0; i < cepDetailObj.length; i++) {
            if (cepDetailObj[i].ENGNO.length == 1)
                cepDetailObj[i].ENGNO = '00' + cepDetailObj[i].ENGNO;
            if (cepDetailObj[i].ENGNO.length == 2)
                cepDetailObj[i].ENGNO = '0' + cepDetailObj[i].ENGNO;
            if (cepDetailObj[i].PRJNO.length == 1)
                cepDetailObj[i].PRJNO = '00' + cepDetailObj[i].PRJNO;
            if (cepDetailObj[i].PRJNO.length == 2)
                cepDetailObj[i].PRJNO = '0' + cepDetailObj[i].PRJNO;
        }
        //return $filter('orderBy')(cepDetailObj, ['CLIENO', 'ENGNO', 'PRJNO']);
        return cepDetailObj;
    }

    $scope.Search = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.Search");

        if ($scope.isSet)
            return;
        var hrs = '', des = '', isCalFlag = $rootScope.$stateParams.isCalFlg;
        if ($rootScope.$stateParams.isDailyMode)
            hrs = $scope.dailyHour;
        else {
            hrs = $scope.week;
        }
        des = $scope.description;
        $state.go('mSearch', {
            "startDate": $rootScope.$stateParams.startDate, "searchKeyword": $scope.cepEnter, 'isDailyMode': $rootScope.$stateParams.isDailyMode, 'IsEditMode': $rootScope.$stateParams.IsEditMode, 'currentDate': $rootScope.$stateParams.currentDate, 'Hours': hrs, 'Description': des, 'isCalFlg': isCalFlag
        });
    }

    $scope.isNoMoreData = false;
    $scope.mFindCEPCode = function () {
        //blackberry issue MP 333       

        var txtVal = angular.element(document.getElementById("txtSrch")).val();

        if (txtVal != $scope.findCepCode && txtVal != null && txtVal != '') {
            $scope.findCepCode = txtVal;
        }
        $scope.isNoMoreData = false;
        $rootScope.errorLogMethod("SearchCtrl.$scope.mFindCEPCode");
        $scope.searchRslObj.pageNumber = 1;
        $scope.searchRslObj.items.splice(0);
        $scope.$broadcast('update_find_result');
        angular.element(document.getElementById("btnSearch")).focus();
    };
    $scope.$on("update_find_result", function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.$on.update_find_result");       
        var sortOrderFavCepFirst = "38 DESC,2,5,8";
        $scope.findCepCodeList = [];
        var dataPerPage = $scope.searchRslObj.DataPerPage;
        var pageNo = $scope.searchRslObj.pageNumber;        
        if (isFavChange) { 
            dataPerPage = $scope.searchRslObj.pageNumber * dataPerPage;
            pageNo = 1;           
        }
        cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, $scope.findCepCode, pageNo, dataPerPage, sortOrderFavCepFirst, $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL)
            .then(function (response) {
                if (response.LOOKCEP_OUT_OBJ.CEP_ARR == undefined || response.LOOKCEP_OUT_OBJ.CEP_ARR.length == 0 || response.LOOKCEP_OUT_OBJ.CEP_ARR.length == undefined) {
                    $scope.searchRslObj.busy = true;
                    $scope.searchRslObj.loadMsg = $scope.noMoreData;
                    $scope.isNoMoreData = true;

                    return;

                }
                $scope.isSearchClick = true;
                if (Object.prototype.toString.call(response.LOOKCEP_OUT_OBJ.CEP_ARR) != '[object Array]') {
                    var data = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                    response.LOOKCEP_OUT_OBJ.CEP_ARR = [];
                    response.LOOKCEP_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                }
                var items = $scope.sortCEPSrch(response.LOOKCEP_OUT_OBJ.CEP_ARR);
                if (isFavChange)
                {
                    $scope.searchRslObj.items = [];
                    isFavChange = false;
                }
                var itemArLen = $scope.searchRslObj.items.length;

                for (var i = 0; i < items.length; i++) {
                    if (items[i].CLIENO === "000000") {
                        continue;
                    }
                    items[i].index = itemArLen;
                    items[i].fav = items[i].CEPFAV == 'Y' ? true : false;
                    $scope.searchRslObj.items.push(items[i]);                   
                    itemArLen++;

                }

                var ttlPg = parseInt(parseInt(response.LOOKCEP_OUT_OBJ.TOTAVAIL));
                if (ttlPg > 0) {
                    $scope.searchRslObj.TotalPages = Math.ceil(ttlPg / $scope.DataPerPage);
                }
                else
                    $scope.TotalPages = 0;
                $scope.searchRslObj.pageNumber = $scope.searchRslObj.pageNumber +1;
                $scope.TotalPages = parseInt(parseInt(response.LOOKCEP_OUT_OBJ.TOTAVAIL));
                $scope.searchRslObj.busy = false;



            });

    });

    $scope.cancelSearch = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.cancelSearch");
        $rootScope.isRefresh = false;
        //$rootScope.importViewed = false;
        var hrs = '', des = '', isCalFlag = $rootScope.$stateParams.isCalFlg;
        hrs = $rootScope.$stateParams.Hours, des = $rootScope.$stateParams.Description;
        $state.go('mNewEntry', {
            "startDate": $rootScope.$stateParams.startDate,
            "IsSearch": false,
            'isDailyMode': $rootScope.$stateParams.isDailyMode,
            'IsEditMode': $rootScope.$stateParams.IsEditMode,
            'currentDate': $rootScope.$stateParams.currentDate,
            'Hours': hrs,
            'Description': des,
            'isCalFlg': isCalFlag,
            'isCancelSearch': true
        });
    }



    $scope.sendDataBack = function (index) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.sendDataBack");
        localStorage.setItem('Search_Data', JSON.stringify($scope.searchRslObj.items[index]));

        $rootScope.isRefresh = false;
        var hrs = '', des = '', isCalFlag = $rootScope.$stateParams.isCalFlg;
        hrs = $rootScope.$stateParams.Hours, des = $rootScope.$stateParams.Description;
        $state.go('mNewEntry', {
            "startDate": $rootScope.$stateParams.startDate,
            "IsSearch": true,
            'isDailyMode': $rootScope.$stateParams.isDailyMode,
            'IsEditMode': $rootScope.$stateParams.IsEditMode,
            'currentDate': $rootScope.$stateParams.currentDate,
            'Hours': hrs,
            'Description': des,
            'isCalFlg': isCalFlag
        });
    }

    $scope.loadErrorPopup = function (isError, message) {
        $rootScope.errorLogMethod("SearchCtrl.$scope.loadErrorPopup");
        var sendData = {
            isError: isError,
            message: message
        };
        $scope.openModalCtrl = 'ErrorPopup';
        $scope.open('templates/ErrorPopup.html', 'ErrorPopup', sendData);
    }

    /*get faourite cep -- start*/
    $scope.loadFavCEP = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.loadFavCEP");
        if ($scope.isSet)
            return;
        var sendData = {
            cepCode: $scope.cepEnter
        };
        $scope.openModalCtrl = 'FavSearchCtrl';
        $scope.open('templates/FavCEP.html', 'FavSearchCtrl', sendData);
    }

    $scope.loadActivity = function () {
        $rootScope.errorLogMethod("SearchCtrl.$scope.loadActivity");
        if ($scope.isSubmit) {
            return;
        }
        if ($scope.frmValidationParms.IsCepCodeSelected) {
            $scope.isActValdMsgOn = false;
            if ($scope.frmValidationParms.isActivitySel === false) {
                $scope.activity.selected = {
                    DES: $scope.frmValidationParms.activityTitle
                };
            }
            var sendData = {
                compId: $scope.cpecode.COMPID
            }
            if ($scope.cpecode.COMPID == $scope.initialDetail.COMP_REC.COMPID) { $scope.isSameCompany = true; }



            $scope.openModalCtrl = 'ActivityCtrl';
            $scope.open('templates/Activity.html', 'ActivityCtrl', sendData);
        }
    }

    $scope.ActivityFavList = [];

    //Get the favourite cep code from API
    var getFavActivity = function () {
        if ($scope.cpecode.COMPID == $scope.initialDetail.COMP_REC.COMPID) {
            $scope.isSameCompany = true;
            $scope.ActivityFavList = JSON.parse(localStorage.getItem('ActivityFav'));
            if ($scope.ActivityFavList != null) {
                if ($scope.ActivityFavList.length > 0) return;
            }
            activityService.retrieveActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
                .then(function (response) {

                    if (response.RETACTIFAV_OUT_OBJ.RETCD == 0) {
                        $scope.activityList = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;

                        if (Object.prototype.toString.call(response.RETACTIFAV_OUT_OBJ.ACTI_ARR) != '[object Array]') {
                            var data = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                            response.RETACTIFAV_OUT_OBJ.ACTI_ARR = [];
                            if (data != null && data.ACTI_OBJ != null && data.ACTI_OBJ != undefined)
                                response.RETACTIFAV_OUT_OBJ.ACTI_ARR.push(data.ACTI_OBJ);
                        }


                        var items = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                        var itemArLen = 0;

                        $scope.ActivityFavList = [];
                        if (items != null) {
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].STAT == 'Y') {

                                    items[i].index = itemArLen;
                                    items[i].fav = true;

                                    $scope.ActivityFavList.push(items[i]);
                                    itemArLen++;
                                }
                            }
                        }
                        localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));
                    }
                });
        }
        else {

            $scope.ActivityFavList = [];
        }

    };

    // Add Activity Fav
    $scope.addActivityFavorited = function () {
        if ($scope.activity.selected.ACTICD == null) return;
        var data = {
            "VARCHAR2": [$scope.activity.selected.ACTICD.toString()]
        };
        var act_arr = JSON.stringify(data);
        if ((!checkActivityFac($scope.activity.selected)) && ($scope.isSameCompany)) {
            activityService.addActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.ADDACTIFAV_OUT_OBJ.RETCD == 0) {
                    $scope.AcivityFev = true;
                    localStorage.removeItem('ActivityFav');
                    $scope.ActivityFavList.push($scope.activity.selected);
                    localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));
                }

            });
        }
        else {
            $scope.AcivityFev = false;
            $scope.loadErrorPopup(false, $filter('translate')('msg_ActivityExistAsFav'))//'This Activity already exists in your Acitvity Favorites.');
        }

    };


    // Remove Activity from Fav

    $scope.removeActivityFavorites = function () {
        if ($scope.activity.selected == null) return;
        var data = {
            "VARCHAR2": [$scope.activity.selected.ACTICD.toString()]
        };
        var act_arr = JSON.stringify(data);
        if ((checkActivityFac($scope.activity.selected)) && ($scope.isSameCompany)) {
            activityService.removeActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.REMACTIFAV_OUT_OBJ.RETCD == 0) {
                    $scope.AcivityFev = false;
                    localStorage.removeItem('ActivityFav');
                    for (var i = 0; i < $scope.ActivityFavList.length; i++) {
                        if ($scope.ActivityFavList[i].ACTICD == $scope.activity.selected.ACTICD) {
                            $scope.ActivityFavList.splice(i, 1);

                        }
                    }
                    localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));

                }

            });
        }
        else {
            $scope.AcivityFev = true;
        }

    };

    // check Activity Fav
    var checkActivityFac = function (activity) {
        var isFind = false;
        if ($scope.ActivityFavList.length == 0) {
            getFavActivity();
        }

        if ($scope.isSameCompany) {
            for (var j = 0; j < $scope.ActivityFavList.length; j++) {
                if ($scope.ActivityFavList[j].ACTICD == activity.ACTICD) {
                    isFind = true; break;
                }
            }
        }
        return isFind;
    }

    var validateHrsBeforeLdingDes = function (id) {
        $rootScope.errorLogMethod("SearchCtrl.validateHrsBeforeLdingDes");
        var val = angular.element(document.getElementById(id)).val();
        if ((val != null) && (val != '')) {
            Number(val);
            var tintVal = $scope.initialDetail.COMP_REC.TINT;
            var valAftrRounding = findNearestMultiple(val, tintVal);
            if (valAftrRounding < -200 || valAftrRounding > 200) {
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
        //tintVal = '0.25';
        $rootScope.errorLogMethod("SearchCtrl.findNearestMultiple");
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
    $scope.loadDescription = function () {
        if ($scope.isHourSet && $scope.hourId != '') {
            if (validateHrsBeforeLdingDes($scope.hourId) == false)
                return;
        }

        $rootScope.errorLogMethod("SearchCtrl.$scope.loadDescription");
        if ($scope.isSubmit) {
            return;
        }
        var defaultDesc = null;
        if (!$scope.IsActivity) {
            if ($rootScope.$stateParams.isCalFlg) {
                if ($scope.descriptionText == null || $scope.descriptionText == '') {
                    $scope.descriptionText = $scope.desFromImportCal;
                }
                defaultDesc = $scope.descriptionText;
            }
            else {
                if ($scope.task.selected != null && JSON.parse($scope.task.selected).DEFDES.trim().length > 0) {
                    defaultDesc = JSON.parse($scope.task.selected).DEFDES;
                    defaultDesc = defaultDesc.replace(/\n/g, " ");
                    defaultDesc = defaultDesc.replace(/\t/g, " ");
                }
                else {
                    if ($scope.component.selected != null && JSON.parse($scope.component.selected).DEFDES.trim().length > 0) {
                        defaultDesc = JSON.parse($scope.component.selected).DEFDES;
                        defaultDesc = defaultDesc.replace(/\n/g, " ");
                        defaultDesc = defaultDesc.replace(/\t/g, " ");
                    }
                }
                if ($rootScope.$stateParams.IsEditMode) {
                    defaultDesc = $scope.descriptionText;
                }
                else {
                    if (($scope.descriptionText != null) && ($scope.descriptionText != ''))
                        defaultDesc = $scope.descriptionText;
                }
            }

        }

        var sendData = {
            IsActivity: $scope.IsActivity,
            desc: defaultDesc
        }

        $scope.openModalCtrl = 'DescriptionCtrl';
        $scope.open('templates/Description.html', 'DescriptionCtrl', sendData);
    }

    // handle local storage in case of CEP fav
    var handleCEPFav = function () {
        localStorage.removeItem('CEPFav');
        localStorage.removeItem('TOTFavAVAIL');
        getCEPFav();
    }

    $scope.addCEPFavorited = function (isSearch, cepData, $event) {
        var data = {
            "NUMBER": [isSearch == false ? $scope.cpecode.PRJID : cepData.PRJID]
        };
        var prj_arr = JSON.stringify(data);
        if (isSearch) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        cepService.addCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
            if (parseInt(response.ADDCEPFAV_OUT_OBJ.RETCD) == 0) {
                isFavChange = true;
                if (!isSearch) {
                    $scope.selectCEPFev = true;
                    $scope.selectCEPNonFev = false;
                }
                else {
                    cepData.fav = true;
                }
                handleCEPFav();
            }
        });

    }
    
    $scope.removeCEPFavorites = function (isSearch, cepData, $event) {
              
        var data = {
            "NUMBER": [isSearch == false ? $scope.cpecode.PRJID : cepData.PRJID]
        };
        var prj_arr = JSON.stringify(data);
        if (isSearch) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        cepService.removeCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
            isFavChange = true;
            if (parseInt(response.REMCEPFAV_OUT_OBJ.RETCD) == 0) {
                if (!isSearch) {
                    $scope.selectCEPFev = false;
                    $scope.selectCEPNonFev = true;
                }
                else {
                    cepData.fav = false;
                }
                handleCEPFav();
            }
        });
    }


    // Get Description Fav list

    $scope.descFav = [];

    var getDescriptionFav = function (alwaysGet) {
        $rootScope.errorLogMethod("SearchCtrl.getFavDescription");
        if (alwaysGet) {
            localStorage.removeItem('DescFav');
        }

        var desc = (localStorage.getItem('DescFav'));
        if ((desc == '') || (desc == null)) {
            cepService.retrieveDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID)
                .then(function (response) {
                    if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                        if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                            var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                            response.RETDESCFAV_OUT_OBJ.DESTXT_ARR = [];
                            if (data != null && data.VARCHAR2 != undefined)
                                response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                        }

                        $scope.descFav = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                    }
                    localStorage.setItem('DescFav', JSON.stringify($scope.descFav));

                });
        }
        else {
            $scope.descFav = JSON.parse(desc);
        }

    };

    // Add description
    $scope.addDescriptionFavorite = function () {
        $scope.description = $scope.description.trim();
        if ($scope.description.length == 0)
            return;
        if (!checkDescFav()) {
            cepService.addDescriptionFavorite($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify($scope.description)).then(function (response) {
                if (response.ADDDESCFAV_OUT_OBJ.RETCD == 0) {
                    getDescriptionFav(true);
                    $scope.favDesc = true;
                }
            });
        }
        else {
            var msg = $filter('translate')('msg_DuplicateDescription');
            $scope.loadErrorPopup(false, msg);
        }
    };

    // Remove description
    $scope.removeDescriptionFavorites = function () {
        if ($scope.description.length == 0)
            return;
        var data = {
            "VARCHAR2": [$scope.description]
        };
        var destxt_arr = JSON.stringify(data);
        if (checkDescFav()) {
            cepService.removeDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, destxt_arr).then(function (response) {

                if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                    getDescriptionFav(true);
                    $scope.favDesc = false;
                }
            });
        }
        else {
            $scope.favDesc = false;
        }
    };

}])


.controller('HomeCtrl', '$rootScope', ['$scope', function ($scope, $rootScope) {
    $scope.TotalPages = 0;
    $scope.PageNumber = 0;
    $scope.DataPerPage = 0;

    $scope.$on("update_child_controller", function (event, totalPage, pageNumber, dataPerPage) {
        $rootScope.errorLogMethod("HomeCtrl.$scope.$on.update_child_controller");
        $scope.TotalPages = totalPage;
        $scope.PageNumber = pageNumber;
        $scope.DataPerPage = dataPerPage;


    });

}])

.controller('DailyTimeGridCtrl', ['$scope', '$filter', 'uiGridConstants', '$http', 'gridDataService', 'cepService', 'projectComponetService', '$timeout', 'loadRevenueMonthsServices', 'broadcastService', 'loginService', 'preferencesService', '$rootScope', '$state', '$modal', '$q', '$window', 'dateService', 'constantService', '$locale', '$translate', '$interval', 'broadcastMessageServices', 'activityService', 'futureEntryService', 'timeEntryNextRevenueService', 'commonUtilityService', 'retrieveSharedService', function ($scope, $filter, uiGridConstants, $http, gridDataService, cepService, projectComponetService, $timeout, loadRevenueMonthsServices, broadcastService, loginService, preferencesService, $rootScope, $state, $modal, $q, $window, dateService, constantService, $locale, $translate, $interval, broadcastMessageServices, activityService, futureEntryService, timeEntryNextRevenueService, commonUtilityService, retrieveSharedService) {
    $scope.monthlyTtlHrs = 0.00;
    $rootScope.isNonADLogin = false;
    if($rootScope.isCalOpen==undefined)
        $rootScope.isCalOpen = false;
    $scope.getWeeklyDayDate = function (weeklySDate, numDay) {
        var tempDate = new Date(weeklySDate.valueOf());
        tempDate.setDate(tempDate.getDate() + numDay);
        return tempDate;
    }
      

    $scope.expandEntry = function (teClass,rowIndex) {
        var cls = 'fa fa-plus', isOpen =false;
        if ($rootScope.cntrExpandCollapse == 2)
            $rootScope.cntrExpandCollapse = 1;
        if ($("." + teClass).css("display") == "none") {
            $("." + teClass).css("display", "block");
            $(".weekly-details.task-container." + teClass.replace("exp", "")).css("padding-bottom", "28px");
            $scope.autoToggleExpandAllButton(-1, 1);
            if ($scope.expandEntryToggle(teClass)) {
                cls = 'fa fa-minus';
                isOpen =true;              
            }
            
        }
        else {
            $("." +teClass).css("display", "none");
            $(".weekly-details.task-container." + teClass.replace("exp", "")).css("padding-bottom", "11px");
            $scope.autoToggleExpandAllButton(1, -1);
            if ($scope.expandEntryToggle(teClass)) {
                cls = 'fa fa-minus';
                isOpen =true;            
            }            
        }
        if ($scope.isDailyMode) {
            $scope.gridData[rowIndex].class = cls;
            $scope.gridData[rowIndex].isOpen = isOpen;
        }
        else {
            $scope.itemsDataFinal1[rowIndex].data.class = cls;
            $scope.itemsDataFinal1[rowIndex].data.isOpen = isOpen;
        }
    }
    $scope.autoToggleExpandAllButton = function (offsetPlus, offsetMinus) {
        var nodePath='.tab1 ul li i';
        if($scope.isDailyMode == false) {
            nodePath = '.tab2 ul li i'; }
        var expandedCnt = ($(nodePath).filter('.fa-minus').length) +offsetMinus;
        var collapsedCnt = ($(nodePath).filter('.fa-plus').length) + offsetPlus;
        if (collapsedCnt <= 0) {
            console.log('all item expanded');
            $scope.expandClass = 'fa fa-minus'
            $scope.expandAllText = "Collapse All";
        }
        if (expandedCnt <= 0) {
            console.log('all item collapsed');
            $scope.expandClass = 'fa fa-plus'
            $scope.expandAllText = "Expand All";
        }
    }
    $scope.expandEntryWeekBlock = function (dis, teClass) {
        if (dis == "block")
            $("#week" + teClass).css("padding-bottom", "28px");
        else
            $("#week" + teClass).css("padding-bottom", "11px");
        return dis;
    }
    if ($rootScope.cntrExpandCollapse == null || $rootScope.cntrExpandCollapse==undefined)
        $rootScope.cntrExpandCollapse = 0;
    $scope.expandEntryToggle = function (teClass) {

        var retVal = false;
        //$scope.expandClass = '';        
        if ($rootScope.expandedEntries.length != undefined) {
            for (var i = 0; i < $rootScope.expandedEntries.length; i++) {
                if ($rootScope.expandedEntries.indexOf(teClass) > -1) {
                    retVal = true;
                    break;
                }
            }
        }
        if ($("." + teClass).css("display") == undefined && !retVal) {
            if ($scope.isDefaultExpanded) {
                if ($rootScope.expandedEntries.indexOf(teClass) == -1 && $rootScope.cntrExpandCollapse != 2){
                    $rootScope.expandedEntries.push(teClass);
                    $rootScope.collapsedEntries.splice($rootScope.collapsedEntries.indexOf(teClass), 1);
                    retVal = true;
                }
            }
        }
        else if ($("." + teClass).css("display") == "none") {
            if ($rootScope.expandedEntries.indexOf(teClass) > -1) {
                $rootScope.expandedEntries.splice($rootScope.expandedEntries.indexOf(teClass), 1);
            }
            if ($rootScope.collapsedEntries.indexOf(teClass) < 0) {
                $rootScope.collapsedEntries.push(teClass);
            }
            retVal = false;
        }
        else {
            if ($rootScope.expandedEntries.indexOf(teClass) == -1 && $rootScope.cntrExpandCollapse != 2) {
                $rootScope.expandedEntries.push(teClass);
                $rootScope.collapsedEntries.splice($rootScope.collapsedEntries.indexOf(teClass), 1);
            }
            retVal = true;
        }
        if ($rootScope.cntrExpandCollapse == 0) {
            if ($scope.isDefaultExpanded) {
                $scope.expandAllText = "Collapse All";
                $scope.expandClass = 'fa fa-minus';
                $(".weekly-details.task-container").css("padding-bottom", "28px");
            }
            else {
                $scope.expandAllText = "Expand All";
                $scope.expandClass = 'fa fa-plus';
                $(".weekly-details.task-container").css("padding-bottom", "11px");
            }
            if ($rootScope.cntrExpandCollapse == 2)
                $rootScope.cntrExpandCollapse = 2;
            else
                $rootScope.cntrExpandCollapse = 1;
        }
        else if ($rootScope.cntrExpandCollapse == 2) {
            if ($rootScope.expandedEntries.indexOf(teClass) < 0 && $rootScope.collapsedEntries.indexOf(teClass) < 0) {
                retVal = false;
                if ($rootScope.lastExpandClass == 'fa fa-minus') {
                    retVal = true;
                }
            }
            $scope.expandAllText = $rootScope.lastExpandAllText;
            $scope.expandClass = $rootScope.lastExpandClass;
        }
        return retVal;
    }

    if ($rootScope.isCallAtInterval == undefined || !$rootScope.isCallAtInterval) {
        callAtInterval();
        $rootScope.isCallAtInterval = true;
    }
    $scope.isSbmtOpen = true;
    $scope.prjScopeNoValidMsg = 'Project Scope is no longer valid.';
    $scope.isPasteClickedExists = false;
    if ($rootScope.isPasteClicked != undefined && $rootScope.isPasteClicked != null)
        $scope.isPasteClickedExists = true;
    else
        $rootScope.isPasteClicked = false;

    $scope.weeklyMaxTEIDCommon = 0;
    $scope.isWeeklyMaxTEIDExists = false;
    if ($rootScope.weeklyMaxTEID != undefined && $rootScope.weeklyMaxTEID != null)
        $scope.isWeeklyMaxTEIDExists = true;
    else
        $rootScope.weeklyMaxTEID = [];

    localStorage.SelectedCalendardate = null;
    var usrPreference = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.usrPreference");
        this.viewPref = {
            isDailymode: true, isFetch: false,detail:null
        };
    };
    $scope.objUsrPreference = new usrPreference();

    $scope.onSubmitMsg = "Submitted {xyz} time entries between {sdate} and {edate}.";



    // When ready...
    window.addEventListener("load", function () {
        // Set a timeout...
        setTimeout(function () {
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);
    });

    var pgHeight = $(document).height();
    var navHeight = $(window).height();
    var pgWidth = $(".container-fluid").width();
    $(".navigation").height(navHeight);
    $(".overlay").height(pgHeight);
    $(".overlay").width(pgWidth);
    var widthNav = $(".navigation").width();
    $(".navigation").css("left", -(widthNav));

    $(".page_header .menu").click(function () {
        $(".navigation").animate({
            left: "0"
        }, 500);
        $(".overlay").fadeIn(500);

        var pgHeight = $(document).height();
        var navHeight = $(window).height();
        var pgWidth = $(".container-fluid").width();
        $(".navigation").height(navHeight);
        $(".overlay").height(pgHeight);
        $(".overlay").width(pgWidth);
        var widthNav = $(".navigation").width();
        $(".navigation").css("left", -(widthNav));
    })
    $(".overlay").click(function () {
        $(".navigation").animate({
            left: -(widthNav)
        }, 500);

        $(".overlay").fadeOut(500);
    })
    var winWidth = $(window).width();
    var positionLeft = (parseInt(winWidth) - 300) / 2
    $(".nav-back").click(function () {
        $(".navigation").animate({
            left: -(widthNav)
        }, 500);
        $(".overlay").fadeOut(500);
    });
    $(".import-cal").click(function () {
        $(".navigation").animate({
            left: -(widthNav)
        }, 500);
        $(".overlay").fadeOut(500);
    });
    $(".cal-icon").click(function () {});
    $(".well-sm").click(function () {
        $(".calender-container").css("display", "none");
        $(".overlay").css("display", "none");
    });
    $(".overlay").click(function () {
        $(".calender-container").css("display", "none");
        $(".overlay").css("display", "none");
    })
    $(".bottom-footer .submit").click(function () {
        $(".sub_popup").css("display", "block");
        $(".overlay").css("display", "block");
    });
    $(".bottom-footer ul li a").click(function () {
        $(".bottom-footer ul li a").removeClass("btn-grd2");
        $(this).addClass("btn-grd2");
    });

    $(".bottom-footer ul li a").click(function () {
        $(".bottom-footer ul li a").removeClass("btn-grd2");
        $(this).addClass("btn-grd2");
    });
    $(".overlay").click(function () {
        $(".sub_popup").css("display", "none");
        $(".overlay").css("display", "none");
        //$(".sub_popup-action ul").css("display", "block");
        $(".bottom-footer ul li a").removeClass("btn-grd2");
    });
    $(".okay").click(function () {
        $(".sub_popup").css("display", "none");
        $(".overlay").css("display", "none");
        $(".bottom-footer ul li a").removeClass("btn-grd2");
    });
    $(".cancel_").click(function () {
        $(".sub_popup").css("display", "none");
        $(".overlay").css("display", "none");
        $(".bottom-footer ul li a").removeClass("btn-grd2");
    });

    $scope.expandCollapseAllClick = function () {
        if ($(".expandCollapseAll > .expandCollapse > .fa").attr("class").indexOf("fa-plus") > -1) {
            $(".task-details").css("display", "block");
            $(".weekly-hours").css("display", "block");
            $(".top-show-hrs.weekly-hours").css("display", "block");
            $(".weekly-details.task-container").css("padding-bottom", "28px");
            $scope.expandClass = 'fa fa-minus'
            $rootScope.expandedEntries = [];
            $rootScope.collapsedEntries = [];
            $rootScope.cntrExpandCollapse = 1;
            $scope.expandAllText = "Collapse All";
            $scope.resetArrayOnExpandAllClick($scope.isDailyMode,true);
        }
        else {
            $rootScope.expandedEntries = [];
            $rootScope.collapsedEntries = [];
            $rootScope.cntrExpandCollapse = 1;
            $(".task-details").css("display", "none");
            $(".weekly-hours").css("display", "none");
            $(".weekly-details.task-container").css("padding-bottom", "11px");
            $(".top-show-hrs.weekly-hours").css("display", "block");
            $scope.expandClass = 'fa fa-plus'
            $scope.expandAllText = "Expand All";
            $scope.resetArrayOnExpandAllClick($scope.isDailyMode,false);

        }
    }
    $scope.resetArrayOnExpandAllClick = function (isDailyMode, isExpandAll) {
        var temp = 'exp', teClass = '';
        if (isDailyMode) {
            for (var i = 0; i < $scope.gridData.length; i++) {
                teClass = temp + $scope.gridData[i].TEID;
                if (isExpandAll) {
                    $rootScope.expandedEntries.push(teClass);
                    $scope.gridData[i].class = 'fa fa-minus';
                    $scope.gridData[i].isOpen = true;
                }
                else {
                    $rootScope.collapsedEntries.push(teClass);
                    $scope.gridData[i].class = 'fa fa-plus';
                    $scope.gridData[i].isOpen = false;
                }
            }
        }
        else {
            temp = 'expw';
            for (var i = 0; i < $scope.itemsDataFinal1.length; i++) {
                teClass = temp + $scope.itemsDataFinal1[i].data.TEID;
                if (isExpandAll) {
                    $rootScope.expandedEntries.push(teClass);
                    $scope.itemsDataFinal1[i].data.class = 'fa fa-minus';
                    $scope.itemsDataFinal1[i].data.isOpen = true;
                }
                else {
                    $rootScope.collapsedEntries.push(teClass);
                    $scope.itemsDataFinal1[i].data.class = 'fa fa-plus';
                    $scope.itemsDataFinal1[i].data.isOpen = false;
                }
            }
        }
    }
    $(".sub_popup-action .dots").click(function () {
        //if ($(".sub_popup-action").attr("class").indexOf("isCancel") < 0) {
        $rootScope.isPanelOpen = true;
        $(".show-dayWeek").css("display", "block");
        $(".dots").css("display", "none");
        $(".cancel-cross").css("display", "block");
        //}
        //else
        //    $rootScope.isPanelOpen = false;
        $(".sub_popup-action").removeClass("isCancel");
    });
    $(".sub_popup-action .cancel-cross").click(function () {
        $(".sub_popup-action").addClass("isCancel");
        $rootScope.isPanelOpen = false;
        $(".show-dayWeek").css("display", "none");
        $(".dots").css("display", "block");
        $(".cancel-cross").css("display", "none");
        $scope.IsSelectedForAll = false;
        $scope.selectedForDelete = false;
        $scope.$apply();
    });
    $(".sub_popup-action .more").click(function () {
        checkAfterCuttOff();
        $(".show-dayWeek").css("display", "none");
        $(".expand-footer").css("display", "block");
        $(".cancel-cross").css("display", "none");
        $(".sub_popup-action .cancel-cross-left").css("display", "block");
    });
    $(".sub_popup-action .cancel-cross-left").click(function () {
        $(".show-dayWeek").css("display", "block");
        $(".expand-footer").css("display", "none");
        $(".cancel-cross").css("display", "block");
        $(".sub_popup-action .cancel-cross-left").css("display", "none");
    });

    if ($rootScope.isPanelOpen) {
        $(".show-dayWeek").css("display", "block");
        $(".dots").css("display", "none");
        $(".cancel-cross").css("display", "block");
    }

    if ($rootScope.isCallBroadcastAtInterval != true) {
        $rootScope.callBroadcastAtInterval = $interval(callAtInterval, 1000 * 60 * 30);
        $rootScope.callMonthEndAtIntervalMobile = $interval(callMonthEndAtIntervalMobile, 1000 * 60 * 60);
        $rootScope.isCallBroadcastAtInterval = true;
    }

    function callAtInterval() {
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        broadcastMessageServices.getBroadcastMessage(loginDetail.SESKEY, constantService.CURRENTLANGUAGE)
        .then(function (response) {
            if(parseInt(response.RETBROAD_OUT_OBJ.RETCD) == 0) {
                if (response.RETBROAD_OUT_OBJ.MSG_ARR != undefined || response.RETBROAD_OUT_OBJ.MSG_ARR.length != 0) {
                    var broadcastarray = response.RETBROAD_OUT_OBJ.MSG_ARR;
                    if (broadcastarray.length >0) {
                        for (var i = 0; i < broadcastarray.length; i++) {
                            var msgid = broadcastarray[i].MSGID;
                            var msg = broadcastarray[i].MSG;
                            var senddata = {
                                message: msg,
                                issubmit: false,
                                isCancelBtnOn: true,
                                messageid: msgid

                            };
                            $scope.openmodalctrl = 'ConfirmBroadcastMessage';
                            $scope.open('templates/ConfirmBroadcastMessage.html', 'ConfirmBroadcastMessage', senddata);
                        }
                    } else {
                        if (typeof response.RETBROAD_OUT_OBJ.MSG_ARR == "object") {
                            if (response.RETBROAD_OUT_OBJ.MSG_ARR.MSG_OBJ.MSGID != 0) {
                                var msgid = response.RETBROAD_OUT_OBJ.MSG_ARR.MSG_OBJ.MSGID;
                                var msg = response.RETBROAD_OUT_OBJ.MSG_ARR.MSG_OBJ.MSG;
                                var senddata = {
                                    message: msg,
                                    issubmit: false,
                                    isCancelBtnOn: true,
                                    messageid: msgid

                                };
                                $scope.openmodalctrl = 'ConfirmBroadcastMessage';
                                $scope.open('templates/ConfirmBroadcastMessage.html', 'ConfirmBroadcastMessage', senddata);
                            }
                        }
                    }
                }

            }

        });

    }

    $scope.checkRevMonthFlag = true;

    function convertMonthNameToNumber(monthName) {
        var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
        var monthDigit = myDate.getMonth();
        return isNaN(monthDigit) ? 0 : (monthDigit + 1);
    }
    var createDate = function (dteStr) {
        // $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.createDate");
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }
    $scope.loadCalender = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.loadCalender");
        $rootScope.lastCurrentDate = $filter('date') ($scope.currentDate, 'yyyy-MM-dd');
        //$scope.closedmonth = '';
        var sendData = { currentDateValue: $scope.currentDate };
        $scope.open('templates/Calendar.html', 'calController', sendData);        
    }
    ///////////////////Start Revamp Main Calendar
    calHeaderBtnClick = function () {
        $("#calender-container .calendarOver.mobileCalOver .yearContainerinner #firstColYear li").remove();
        var yearNo = parseInt(new Date("sessiontimeout").getFullYear() - 1);
        function GetCalYearValues() {
            for (i = 0; i <= 2; i++) {
                $("#calender-container .calendarOver.mobileCalOver .yearContainerinner #firstColYear").append("<li><a href='javascript:void(0)'>" + yearNo + "</a></li>");
                yearNo = yearNo + 1;
            }
        }
        GetCalYearValues();
        function GetCurrentSelectedMonthYear(currentDate) {
            var revRange = commonUtilityService.getRevStartEndDateBySelDate($filter('date')(currentDate, "yyyy-MM-dd"));
            if (revRange != null) {
                var startDate = createDate(revRange.revStartDate);
                var endDate = createDate(revRange.revEndDate);
                currentMonth = parseInt(endDate.getMonth()) + 1;
                currentYear = endDate.getFullYear();
            }
            $('#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner').each(function () {
                $(this).find("li").each(function () {
                    if ($(this).text() == currentYear)
                        $(this).children().addClass("liActive")
                });
            });
            $('#dvdatepicker .calendarOver.mobileCalOver .monthContainer').each(function () {
                $(this).find("li").each(function () {
                    if (convertMonthNameToNumber($(this).text()) == currentMonth)
                        $(this).children().addClass("liActive")
                });
            });
        }

        $(".calendarOver.mobileCalOver").fadeIn();
        $("#dvdatepicker .calendarOver.mobileCalOver .monthContainer ul li a").removeClass("liActive");
        $("#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner ul li a").removeClass("liActive");
        GetCurrentSelectedMonthYear($scope.currentDate);

        $(".calendarOver.mobileCalOver .selectOC ul li .cancelCalPopup").click(function () {
            $(".calendarOver.mobileCalOver").fadeOut();
        });
        $(".calendarOver.mobileCalOver .selectOC ul li .selectCalDate").click(function () {
            $(".calendarOver.mobileCalOver").fadeOut();
        });
        $("#dvdatepicker .calendarOver.mobileCalOver .monthContainer ul li a").click(function () {
            $("#dvdatepicker .calendarOver.mobileCalOver .monthContainer ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
        $("#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner ul li a").click(function () {
            $("#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });

    }
    $scope.$on("calHeaderButtonClick", function (event, args) {
        $rootScope.errorLogMethod("DatepickerController.$scope.$on.calHeaderButtonClick");
        calHeaderBtnClick();
    });
    /////////////////end Revamp Main Calendar
    var getWeekStartDate = function () {

        var cdate = new Date();
        var selObj = null;
        var selObj = $rootScope.chekRevDateInLocalStorage(cdate, $filter('translate') ('msg_invalidSession'), true);//chekRevDateInLocalStorage(cdate);
        var revStartDate = createDate(selObj.STRTDTE);
        var dateToCompare =$scope.weeklyStartDate;
        if (dateToCompare.setHours(0, 0, 0, 0) < revStartDate.setHours(0, 0, 0, 0)) {
            var currentTimezone = revStartDate.getTimezoneOffset();
            revStartDate.setMinutes(revStartDate.getMinutes() -(currentTimezone));
            return revStartDate;
        }
        return $scope.weeklyStartDate;

    }
    $scope.loadImportCalEntriesRev = function () {
        if (timePriorToBillingStartDate()) {
            $rootScope.importViewed = false;
            var cDate = new Date($scope.currentDate.valueOf());
            cDate = $filter('date') (cDate, "yyyy-MM-dd");
            var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months'));
            var revRangeDate = null;
            if (revMnthRange != null) {
                var updDate = new Date(cDate);
                updDate = new Date(updDate.getTime() +(updDate.getTimezoneOffset() * 60 * 1000));
                revRangeDate = angular.fromJson(revMnthRange).filter(function (item) {
                    if (item != null) {
                        if (updDate >= createDate(item.STRTDTE) && updDate <= createDate(item.ENDDTE)) {
                            return true;
                        }
                    }
                });
            }
            if (revRangeDate != null && revRangeDate != undefined && revRangeDate.length != 0) {
                $scope.revStartDate = revRangeDate[0].STRTDTE;
                $scope.revEndDate = revRangeDate[0].ENDDTE;
                localStorage.setItem('Revenue_Months_ImportCal', JSON.stringify(revMnthRange));
                $scope.loadImportCalEntries();
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, cDate, function (response) {
                    var revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                    localStorage.setItem('Revenue_Months_ImportCal', JSON.stringify(revMnthRange));
                    $scope.loadImportCalEntries();
                })
            }

        }      
    }
    $scope.loadImportCalEntries = function () {
        $rootScope.isCalOpen = true;
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.loadImportCalEntries");
        $(".navigation").animate({
            left: -(widthNav)
        }, 500);
        $(".overlay").fadeOut(500);
        var nonADFlagObject = JSON.parse(localStorage.getItem('Login_Detail'));
        var weekStartDate = null;
        if (!$scope.isDailyMode)
            weekStartDate = getWeekStartDate();
        if (nonADFlagObject.ISNONAD == "Y" && localStorage.getItem('nonADLogin') ==null) {
            var sendData = {
                domain: "mercer",
                currentDate: $scope.currentDate,
                isDailyMode: $scope.isDailyMode,
                weekCurrentDate: weekStartDate,
                weekStartDate: $scope.weeklyStartDate,
                lastExpandAllText: $scope.expandAllText,
                lastExpandClass: $scope.expandClass
            };
            $scope.openModalCtrl = 'importCalLoginCtrl';
            $scope.open('templates/ImportCalLogin.html', 'importCalLoginCtrl', sendData);
        }
        else {
            var weekStartDate = null;
            if (!$scope.isDailyMode)
                weekStartDate = getWeekStartDate();
            var cDate = new Date($scope.currentDate.valueOf());
            cDate = $filter('date') (cDate, "yyyy-MM-dd");
            var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months_ImportCal'));
            var revRangeDate = null;
            if (revMnthRange != null) {
                var updDate = new Date(cDate);
                updDate = new Date(updDate.getTime() +(updDate.getTimezoneOffset() * 60 * 1000));
                revRangeDate = angular.fromJson(revMnthRange).filter(function (item) {
                    if (item != null) {
                        if (updDate >= createDate(item.STRTDTE) && updDate <= createDate(item.ENDDTE)) {
                            return true;
                        }
                    }
                });
            }
            if (revRangeDate != null && revRangeDate != undefined && revRangeDate.length != 0) {
                $scope.revStartDate = revRangeDate[0].STRTDTE;
                $scope.revEndDate = revRangeDate[0].ENDDTE;
            }
            var sendData = {
                currentDate: $scope.currentDate,
                isDailyMode: $scope.isDailyMode,
                weekCurrentDate: weekStartDate,
                weekStartDate: $scope.weeklyStartDate,
                flag: nonADFlagObject.ISNONAD == "Y" ? "Y": "N",
                encKey: null,
                revStartDate: $scope.revStartDate,
                revEndDate: $scope.revEndDate,
                lastExpandAllText: $scope.expandAllText,
                lastExpandClass: $scope.expandClass
            };
            $scope.openModalCtrl = 'importCalCtrl';
            $scope.open('templates/ImportCalEntries.html', 'importCalCtrl', sendData);
        }

    }

    var createDate = function (dteStr) {
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1]-1, day[0]);
        }
        else return null;
    }

    var createDateTime = function (dateStr) {
        if (dateStr != undefined && dateStr != null) {
            dateStr = dateStr.trim();
            var parts = dateStr.split("-");
            var day = parts[2].split(' ');
            var time = day[1].split(':')
            return new Date(parts[0], parts[1]-1, day[0], time[0], time[1], time[2]);
        }
        else
            return new Date();
    }

    var enableDisableSubmitBtn = function () {
        var selObj = null;
        var selDate = $scope.currentDate;
        selDate = createDate($filter('date') (selDate, "yyyy-MM-dd"));
        var cDate = new Date();
        var reveueDates = {
            sDte: null, eDte: null
        };
        cDate.setHours(0, 0, 0, 0);
        cDate = $filter('date')(new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate()), "yyyy-MM-dd");
        var updDate = new Date(cDate);
        updDate = new Date(updDate.getTime() +(updDate.getTimezoneOffset() * 60 * 1000));
        selObj = $rootScope.chekRevDateInLocalStorage(updDate, $filter('translate') ('msg_invalidSession'), false);;//chekRevDateInLocalStorage(updDate);
        if (selObj != null) {
            if (selObj != null && selObj != undefined) {
                reveueDates.sDte = createDate(selObj.STRTDTE);
                reveueDates.eDte = createDate(selObj.ENDDTE);
            }

            if (reveueDates.sDte > selDate) {
                $scope.isSbmtOpen = false;

            }
            else {
                $scope.isSbmtOpen = true;

            }
        }
    }

    $scope.animationsEnabled = true;

    var loadHomePage = function (isLoad) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.loadHomePage");
        if (isLoad)
            $state.go('Main', {
                "loadDate": $rootScope.$stateParams.startDate,
                "isDailyMode": $rootScope.$stateParams.isDailyMode,
                "currentDate": $rootScope.$stateParams.currentDate
            });
    }

    $scope.open = function (template, controller, sendData) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.open");
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: template,
            controller: controller,
            resolve: {
                selectedData: function () {
                    return sendData;
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $rootScope.errorLogMethod("DailyTimeGridCtrl.modalInstance.result");

            switch ($scope.openModalCtrl) {

                case 'ErrorPopup':

                    $(".overlay").css("display", "none");
                    if (sendData != undefined && sendData.isReloadPage != undefined && sendData.isReloadPage != null)
                        loadHomePage(sendData.isReloadPage);
                    $(".bottom-footer ul li a").removeClass("btn-grd2");
                    break;
                    /*submit time entries on user confirmation*/
                case 'submitConfirm':
                    callApiToSubmitEntries(sendData.sesKey, sendData.empId, sendData.selDte, sendData.ttlRcd, sendData.revSDteOriginal, sendData.selDteOriginal);
                    break;
                case 'Preference':
                    $timeout(function () { $scope.loadErrorPopup(false, $filter('translate') ('msg_PrefSave'))
                    }, 400);
                    break;
                case 'deleteConfirm':
                    $scope.deleteTimeEntriesClicked(sendData.isDailyModeOption);
                    break;
                case 'pasteAdvanced':
                    $scope.pasteMultiple(selectedItem);
            }

        }, function () {
            $(".overlay").css("display", "none");
            $(".bottom-footer ul li a").removeClass("btn-grd2");
            $scope.openModalCtrl = '';
            if ($rootScope.importViewed == undefined)
                $rootScope.importViewed = false;
            if ($scope.openModalCtrl == 'importCalCtrl' && !$rootScope.importViewed) {
                $rootScope.isCalOpen = false;
            }


        })
    };

    $scope.toggleAnimation = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.toggleAnimation");
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    $scope.checkRevMonthTime = function (dateval) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.checkRevMonthTime");
        var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, false);
        if (jsonSFromloginDetail == undefined || jsonSFromloginDetail ==null) return;
        var revStrDteAr = jsonSFromloginDetail.REVM_REC.STRTDTE.split("-");
        var revEndDteAr = jsonSFromloginDetail.REVM_REC.ENDDTE.valueOf().split("-");

        //revenue start and end date
        var revSDte = null;
        if (revStrDteAr != undefined && revEndDteAr != undefined) {
            revSDte = new Date(revStrDteAr[0], revStrDteAr[1]-1, revStrDteAr[2].split(" ")[0]);
            var revEDte = new Date(revEndDteAr[0], revEndDteAr[1]-1, revEndDteAr[2].split(" ")[0]);
        }
        var selDte = new Date(dateval.valueOf());
        selDte.setHours(0, 0, 0, 0);
        if (selDte < revSDte)
            $scope.checkRevMonthFlag = false;
        else
            $scope.checkRevMonthFlag = true;

    }

    $(".edit-delete").click(function () {

        $(".sub-overlay").css("display", "block");
    });
    $(".sub-overlay").click(function () {
        $(".sub-overlay").css("display", "none");
    });

    $scope.gridNoEntryMessage = 0;

    $scope.ttlHrs = 0.00;
    $scope.icChrge = 0;
    $scope.loginDetail = '';
    $scope.initialDetail = '';
    $scope.domainURL = "";
    $scope.stateProv =[];

    var getUsrPrefObjFrmArray = function (arr, keys) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.getUsrPrefObjFrmArray");
        var result =[];
        for (var i = 0; i < keys.length; i++) {
            var obj = $.grep(arr, function (e) {
                return e.KEY == keys[i];
            });
            result.push(obj);
        }
        return result;
    }

    var fetchPrefereneces = function (pref_arr) {
        var pref_tab =["INITIAL_TAB", "LANG", "INITIAL_DETAIL"];
        var result = getUsrPrefObjFrmArray(pref_arr, pref_tab);

        if (result.length > 0) {
            var isContinue = true;
            for (var i = 0; i < result.length; i++) {
                if (result[i] != null && result[i].length >0) {
                    isContinue = false;
                    var data = result[i];
                    switch (i) {
                        case 0: {
                            $scope.objUsrPreference.viewPref.isFetch = true;
                            if (angular.uppercase(data[0].VAL) == "DAILY") {
                                $scope.objUsrPreference.viewPref.isDailymode = true;
                            }
                            else {
                                $scope.objUsrPreference.viewPref.isDailymode = false;
                            }
                            break;
                        }

                        case 1: {
                            $scope.objUsrPreference.viewPref.language = data[0].VAL;
                            break;
                        }
                        case 2: {
                            constantService.ISCOLLPSED = true;
                            $scope.expandAllText = "Collapse All";
                            $scope.objUsrPreference.viewPref.detail = data[0].VAL;
                            if (($scope.objUsrPreference.viewPref.detail.KEYVAL != undefined && angular.uppercase($scope.objUsrPreference.viewPref.detail.KEYVAL) == "EXPANDED") || ($scope.objUsrPreference.viewPref.detail != undefined && angular.uppercase($scope.objUsrPreference.viewPref.detail) == "EXPANDED")) {
                                constantService.ISCOLLPSED = false;
                                $scope.expandAllText = "Expand All";
                            }

                            $scope.isDefaultExpanded = !constantService.ISCOLLPSED;
                            if ($scope.isDefaultExpanded) {
                                $scope.expandAllText = "Collapse All";
                                $scope.expandClass = 'fa fa-minus';
                            }
                            else {
                                $scope.expandAllText = "Expand All";
                                $scope.expandClass = 'fa fa-plus';
                            }
                            break;
                        }
                    }
                }
                else
                    isContinue = true;
            }
            if (isContinue) {
                $scope.loadGlobalPreferences(result);
            }
        }
        else {
            $scope.loadGlobalPreferences(null);
        }
    }



    var setLanguageResourse = function (langKey) {
        constantService.CURRENTLANGUAGE = constantService.ENGLISHLANGUAGEKEY;
        $translate.use(constantService.ENGLISHLANGUAGEKEY);

    }
    var setLocale = function () {
        if (constantService.CURRENTLANGUAGE == constantService.FRENCHLANGUAGEKEY) {
            angular.copy(locales['fr'], $locale);
        }
        else {
            angular.copy(locales['en'], $locale);
        }
    }

    $scope.getFavActivities = function (loginDetail) {
        var activityFav = (localStorage.getItem('ActivityFav'));
        if ((activityFav == '') || (activityFav == null)) {
            activityService.retrieveActivityFavorites(loginDetail.SESKEY, loginDetail.EMPLID)
                 .then(function (response) {
                     if (response.RETACTIFAV_OUT_OBJ.RETCD == 0) {
                         if (Object.prototype.toString.call(response.RETACTIFAV_OUT_OBJ.ACTI_ARR) != '[object Array]') {
                             var data = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                             response.RETACTIFAV_OUT_OBJ.ACTI_ARR =[];
                             if (data != null && data.ACTI_OBJ != null && data.ACTI_OBJ != undefined)
                                 response.RETACTIFAV_OUT_OBJ.ACTI_ARR.push(data.ACTI_OBJ);
                         }

                         var items = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                         var itemArLen = 0;
                         $scope.ActivityFavList =[];
                         if (items != null) {
                             for (var i = 0; i < items.length; i++) {
                                 if (items[i].STAT == 'Y') {
                                     items[i].index = itemArLen;
                                     items[i].fav = true;
                                     $scope.ActivityFavList.push(items[i]);
                                     itemArLen++;
                                 }
                             }
                         }
                         localStorage.setItem('ActivityFav', JSON.stringify($scope.ActivityFavList));
                     }
                 });
        }
    }
    $scope.getFavDescription = function (loginDetail) {
        var desc = (localStorage.getItem('DescFav'));
        if ((desc == '') || (desc == null)) {
            cepService.retrieveDescriptionFavorites(loginDetail.SESKEY, loginDetail.EMPLID)
                    .then(function (response) {
                        if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                            if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                                var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                                response.RETDESCFAV_OUT_OBJ.DESTXT_ARR =[];
                                if (data != null && data.VARCHAR2 != undefined)
                                    response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                            }
                            localStorage.setItem('DescFav', JSON.stringify(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR));
                        }
                    });
        }
    }
    /*update for performance improvement : calling loadRevenueMonths API after check*/
    $scope.init = function () {
        try {
            $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.init");
            $scope.renewalMessage =[];
            $scope.expandAllText = "Collapse All";
            $scope.isDefaultExpanded = true;
            $scope.prjScopeNoValidMsg = $filter('translate') ('msg_PrjScopNotValid');
            $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
            $scope.getFavDescription($scope.loginDetail);
            $scope.getFavActivities($scope.loginDetail);
            /*read initial_data to fetch user preference */
            var jsonInitialDetail = $rootScope.GetInitialDetail(false, true);
            if (jsonInitialDetail.PREF_ARR != null && jsonInitialDetail.PREF_ARR.length > 0) {
                fetchPrefereneces(jsonInitialDetail.PREF_ARR);
                setLanguageResourse($scope.objUsrPreference.viewPref.language);

            }
            else {
                $scope.loadGlobalPreferences(null);
            }
            loginService.loadStateProv($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, $scope.domainURL).then(function (response) {
                if(parseInt(response.LOADSTATPROV_OUT_OBJ.RETCD) == 0) {

                    if (Object.prototype.toString.call(response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR) != '[object Array]') {
                        var data = response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR;
                        response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR =[];
                        response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR.push(data.STATPROV_OBJ);
                    }

                    for (var i = 0; i < response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR.length; i++) {
                        $scope.stateProv.push(response.LOADSTATPROV_OUT_OBJ.STATPROV_ARR[i]);
                    }
                    localStorage.setItem('StateProv_Data', JSON.stringify($scope.stateProv));

                }
                if (($rootScope.$stateParams.currentDate != null) && ($rootScope.$stateParams.currentDate != '')) {
                    var year = parseInt($filter('date') ($rootScope.$stateParams.currentDate, 'yyyy'));
                    var mn = parseInt($filter('date') ($rootScope.$stateParams.currentDate, 'MM'));
                    var day = parseInt($filter('date') ($rootScope.$stateParams.currentDate, 'dd'));
                    var currentDate = new Date(year, mn -1, day);
                    $scope.currentDate = new Date(currentDate.valueOf());
                    localStorage.removeItem('currentDate');
                    localStorage.removeItem('startDate');
                    localStorage.removeItem('isDailyMode');



                }
                else {
                    var data = localStorage['currentDate'];
                    if (data != null) {


                        $rootScope.$stateParams.currentDate = data;
                        $rootScope.$stateParams.loadDate = localStorage['startDate'];
                        $rootScope.$stateParams.isDailyMode = localStorage['isDailyMode'] == "true" ? true: false;
                        localStorage.removeItem('currentDate');
                        localStorage.removeItem('startDate');
                        localStorage.removeItem('isDailyMode');


                        var currentDate = new Date($rootScope.$stateParams.currentDate);
                        $scope.currentDate = new Date(currentDate.valueOf());
                    }
                    else {
                        setLocale();
                        var initrevmnth = JSON.parse(localStorage.getItem("InitialRev_Month"));
                        var strtdate = createDateTime(initrevmnth.REVM_REC.STRTDTE);
                        var enddate = createDateTime(initrevmnth.REVM_REC.ENDDTE);
                        var currDate = new Date();
                        if (currDate.getTimezoneOffset() > 0) {
                            currDate = new Date("sessiontimeout");
                        }
                        currDate.setHours(0, 0, 0, 0);
                        if (!(currDate >= strtdate && currDate <= enddate)) {
                            $scope.currentDate = strtdate;
                        }
                        else {
                            var tempTodayDate = new Date();
                            var currentTimezone = tempTodayDate.getTimezoneOffset();
                            tempTodayDate.setMinutes(tempTodayDate.getMinutes() -(currentTimezone));
                            $scope.currentDate = tempTodayDate;
                        }


                    }
                }
                if ($rootScope.lastCurrentDate != $filter('date') ($scope.currentDate, 'yyyy-MM-dd')) {
                    $rootScope.expandedEntries =[];
                    $rootScope.collapsedEntries =[];
                    $rootScope.cntrExpandCollapse = 0;
                }

                if ($rootScope.$stateParams.isDailyMode != null) {
                    $scope.isDailyMode = $rootScope.$stateParams.isDailyMode;
                }
                else {
                    $scope.isDailyMode = $scope.objUsrPreference.viewPref.isDailymode;
                }

                $scope.weekDayToggle($scope.isDailyMode, "N");

                $scope.WeeklyDataCopied = false;
                $scope.DailyDataCopied = false;

                if (localStorage.getItem("DailyDataCopied") != undefined && localStorage.getItem("DailyDataCopied") !== null)
                    $scope.DailyDataCopied = true;
                if (localStorage.getItem("WeeklyDataCopied") != undefined && localStorage.getItem("WeeklyDataCopied") !== null)
                    $scope.WeeklyDataCopied = true;
                $scope.selectedForDelete = false;
                $scope.IsSelectedForAll = false;
                $scope.IsTodayCopied = false;
                $scope.IsWeekCopied = false;
                $scope.IsClone = false;
                $scope.IspasteAdvance = false;
                try {
                    if (!$scope.isDailyMode)

                        $(".week_").click();
                    else ($scope.isDailyMode)
                    $(".day_").click();
                }
                catch (err) {
                }

                var revMnthRange = undefined;

                var CurrDate = new Date();
                var SelDate = new Date($scope.currentDate.valueOf());
                SelDate = $filter('date')(new Date(SelDate.getFullYear(), SelDate.getMonth(), SelDate.getDate()), "yyyy-MM-dd");
                var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var selObj = null;
                var pdate = $filter('date') ($scope.currentDate.valueOf(), "yyyy-MM-dd");
                var selecteddate = new Date($scope.currentDate.valueOf());
                pdate = createDate(pdate);
                //check in local storage before calling API
                selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate') ('msg_invalidSession'), true); //chekRevDateInLocalStorage(pdate);
                if (selObj != null) {
                    checkCloseMonth(selObj, CurrDate, monthNames, selecteddate);
                }
                else {
                    var loginDetail = $rootScope.GetLoginDetail(false, true);
                    loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                        revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                        if (revMnthRange != undefined && revMnthRange != "undefined") {
                            for (var i = 0; i < revMnthRange.length; i++) {
                                if (revMnthRange[i] != null && revMnthRange[i]!= undefined && revMnthRange[i].STRTDTE != undefined) {
                                    if (pdate >= createDate(revMnthRange[i].STRTDTE) && pdate <= createDate(revMnthRange[i].ENDDTE)) {
                                        selObj = revMnthRange[i];
                                        break;
                                    }
                                }
                            }

                        }
                        if (selObj != null) {
                            checkCloseMonth(selObj, CurrDate, monthNames, selecteddate);
                        }
                    });
                }
                if ($rootScope.isCalOpen && $rootScope.importViewed) {
                    $scope.loadImportCalEntriesRev();
                }
                // }
            });
       
        }
        catch (err) {
            $('.my-cloak').removeClass('my-cloak'); console.log("init" +err); console.log(err.message);
        }
        $timeout(function () { callMonthEndAtIntervalMobile(); },500);
        $timeout(function () { callMonthEndAtIntervalMobile(); },1000);
    }


    $scope.loadGlobalPreferences = function (preResult) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.loadGlobalPreferences");
        preferencesService.loadGlobalPreferences($scope.loginDetail.SESKEY).then(function (response) {
            if(parseInt(response.GLBPREF_OUT_OBJ.RETCD) == 0) {
                var viewPref = getUsrPrefObjFrmArray(response.GLBPREF_OUT_OBJ.GLBPREF, ["INITIAL_TAB", "LANG", "INITIAL_DETAIL"]);
                var defViewPref = {
                };
                if (viewPref.length > 0) {
                    for (var i = 0; i < viewPref.length; i++) {
                        if (viewPref[i].length > 0) {
                            var data = viewPref[i];
                            var isContinue = preResult == null ? true: false;
                            if (!isContinue) {
                                if (preResult[i] != null && preResult[i].length > 0)
                                    isContinue = false;
                                else
                                    isContinue = true;
                            }
                            if (isContinue) {
                                switch (i) {
                                    case 0: {
                                        for (var j = 0; j < data[0].KEYVAL_ARR.length; j++) {
                                            if (angular.uppercase(data[0].KEYVAL_ARR[j].DEF) == "Y");
                                            defViewPref = data[0].KEYVAL_ARR[j];
                                            break;
                                        }

                                        if (angular.uppercase(defViewPref.KEYVAL) == "DAILY") {
                                            $scope.objUsrPreference.viewPref.isDailymode = true;
                                        }
                                        else {
                                            $scope.objUsrPreference.viewPref.isDailymode = false;
                                        }
                                        break;
                                    }
                                    case 1: {
                                        for (var j = 0; j < data[0].KEYVAL_ARR.length; j++) {
                                            if (angular.uppercase(data[0].KEYVAL_ARR[j].DEF) == "Y");
                                            $scope.objUsrPreference.viewPref.language = data[0].KEYVAL_ARR[j].KEYVAL;
                                            setLanguageResourse($scope.objUsrPreference.viewPref.language);
                                            break;
                                        }
                                        break;
                                    }
                                    case 2: {
                                        constantService.ISCOLLPSED = true;
                                        $scope.expandAllText = "Collapse All";
                                        for (var j = 0; j < data[0].KEYVAL_ARR.length; j++) {
                                            if (angular.uppercase(data[0].KEYVAL_ARR[j].DEF) == "Y") {
                                                $scope.objUsrPreference.viewPref.detail = data[0].KEYVAL_ARR[j].KEYVAL;
                                                if (angular.uppercase($scope.objUsrPreference.viewPref.detail) == "EXPANDED") {
                                                    constantService.ISCOLLPSED = false;
                                                    $scope.expandAllText = "Expand All";
                                                }
                                                break;
                                            }
                                        }
                                        $scope.isDefaultExpanded = !constantService.ISCOLLPSED;
                                        if ($scope.isDefaultExpanded) {
                                            $scope.expandAllText = "Collapse All";
                                            $scope.expandClass = 'fa fa-minus';
                                        }
                                        else {
                                            $scope.expandAllText = "Expand All";
                                            $scope.expandClass = 'fa fa-plus';
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    }

    //catch broadcast event/notification
    $scope.$on("updateUiGrid", function (event, args) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.$on.updateUiGrid");
        $scope.currentDate = new Date(args.value.valueOf());

        var resDate = new Date(args.value.valueOf());

        resDate.setDate(resDate.getDate() +1);

        resDate.setDate(resDate.getDate() -7);
        for (var i = 0; i < 7; i++) {
            if (resDate.getDay() == 0)
                break;
            resDate.setDate(resDate.getDate() +1);
        }
        $scope.weeklyStartDate = new Date(resDate.valueOf());

        if ($scope.isDailyMode)
            $scope.GetData($scope.isDailyMode, args.value.valueOf());
        else
            $scope.GetData($scope.isDailyMode, resDate.valueOf());
    });
    $scope.isDailyMode = true;

    var showHideTab = function (isDailyMode) {

        if (isDailyMode) {
            $(".tab1").css("display", "block");
            $(".tab2").css("display", "none");
        }
        else {
            $(".tab2").css("display", "block");
            $(".tab1").css("display", "none");
        }
    }
    $scope.weekDayToggle = function (isDailyMode, isResetExpandCollapse) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.weekDayToggle");
        if (isResetExpandCollapse == "Y") {
            $rootScope.expandedEntries =[];
            $rootScope.collapsedEntries =[];
            $rootScope.cntrExpandCollapse = 0;
        }
        $scope.gridData =[];
        $scope.itemsDataFinal1 =[];
        showHideTab(isDailyMode);
        $scope.isDailyMode = isDailyMode;
        localStorage.isDailyMode = $scope.isDailyMode;
        if (isDailyMode) {
            $scope.GetData($scope.isDailyMode, $scope.currentDate);
            $(".showInDay").css("display", "inline-block");
            $(".showInWeek").css("display", "none");
            $(".week_.ui-gradient").css("display", "block");
            $(".day_.ui-gradient").css("display", "none");
        }
        else {
            var resDate = new Date($scope.currentDate.valueOf());

            resDate.setDate(resDate.getDate() +1);

            resDate.setDate(resDate.getDate() -7);
            for (var i = 0; i < 7; i++) {
                if (resDate.getDay() == 0)
                    break;
                resDate.setDate(resDate.getDate() +1);
            }
            $scope.weeklyStartDate = new Date(resDate.valueOf());
            $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);

            $(".showInDay").css("display", "none");
            $(".showInWeek").css("display", "inline-block");
            if ($(".expand-footer").css("display") == "block") {
                $(".expand-footer").css("display", "none");
                $(".show-dayWeek").css("display", "block");
                $(".sub_popup-action .cancel-cross-left").css("display", "none");
                $(".sub_popup-action .cancel-cross").css("display", "block");
            }
            $(".week_.ui-gradient").css("display", "none");
            $(".day_.ui-gradient").css("display", "block");
        }
    }

    $scope.addPropertyForExpandCollapse = function (isDailyMode) {
        var ttlOpen = 0, ttlTEs = 0;
        if (isDailyMode) {
            ttlTEs = $scope.gridData.length;
            for (var i = 0; i < $scope.gridData.length; i++) {
                $scope.gridData[i].rowIndex = i;
                var isOpen = $scope.expandEntryToggle('exp' +$scope.gridData[i].TEID);
                if (isOpen) {
                    ttlOpen = ttlOpen +1;
                    $scope.gridData[i].class = 'fa fa-minus';
                    $scope.gridData[i].isOpen = true;
                }
                else {
                    $scope.gridData[i].class = 'fa fa-plus';
                    $scope.gridData[i].isOpen = false;
                }
            }

        }
        else {
            ttlTEs = $scope.itemsDataFinal1.length;
            for (var i = 0; i < $scope.itemsDataFinal1.length; i++) {
                $scope.itemsDataFinal1[i].data.rowIndex = i;
                var isOpen = $scope.expandEntryToggle('expw' +$scope.itemsDataFinal1[i].data.TEID);
                if (isOpen) {
                    ttlOpen = ttlOpen +1;
                    $scope.itemsDataFinal1[i].data.class = 'fa fa-minus';
                    $scope.itemsDataFinal1[i].data.isOpen = true;
                }
                else {
                    $scope.itemsDataFinal1[i].data.class = 'fa fa-plus';
                    $scope.itemsDataFinal1[i].data.isOpen = false;
                }
            }
        }
        if (ttlOpen == 0) {
            $scope.expandClass = 'fa fa-plus';
            $scope.expandAllText = "Expand All";
        }
        else if (ttlOpen == ttlTEs) {
            $scope.expandClass = 'fa fa-minus';
            $scope.expandAllText = "Collapse All";
        }
    }

    $scope.GetData = function (isDailyMode, dateVal) {
        if ($rootScope.expandedEntries == undefined)
            $rootScope.expandedEntries =[];
        if ($rootScope.collapsedEntries == undefined)
            $rootScope.collapsedEntries =[];

        if (($rootScope.weekStateCurrentDate != $filter('date') ($scope.currentDate, 'yyyy-MM-dd')) || isDailyMode) {
            if ($rootScope.isPasteClicked == true)
                $rootScope.isPasteClicked = false;
            if ($rootScope.weeklyMaxTEID.length > 0)
                $rootScope.weeklyMaxTEID =[];
        }
        if ($rootScope.lastCurrentDate != undefined && $rootScope.lastCurrentDate != $filter('date') ($scope.currentDate, 'yyyy-MM-dd')) {
            $rootScope.expandedEntries =[];
            $rootScope.collapsedEntries =[];
            $rootScope.cntrExpandCollapse = 0;
        }
        try {
            enableDisableSubmitBtn();
        }
        catch (err) {
        }
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.GetData");
        //$scope.closedmonth = '';
        $scope.selectedForDelete = false;
        $scope.IsSelectedForAll = false;
        $scope.IsTodayCopied = false;
        $scope.IsWeekCopied = false;
        $scope.IsClone = false;
        $scope.IspasteAdvance = false;
        $scope.gridNoEntryMessage = 0;
        if (dateVal == undefined) {
            dateVal = new Date();
        }
        // $('.my-cloak').removeClass('my-cloak');
        //set the date in the api formate 
        var startDate = $filter('date')(new Date(dateVal.valueOf()), 'yyyy-MM-dd HH:mm:ss');
        var endDate = new Date(dateVal.valueOf());
        if (isDailyMode) {
            endDate = endDate.setDate(endDate.getDate());

        }
        else {
            endDate.setDate(endDate.getDate() +7);
            for (var i = 0; i < 7; i++) {
                if (endDate.getDay() == 6)
                    break;
                endDate.setDate(endDate.getDate() -1);
            }
        }
        $scope.checkRevMonthTime($scope.currentDate);
        $scope.afterTecuttOff = false;
        checkAfterCuttOff();
        endDate = $filter('date') (endDate, 'yyyy-MM-dd HH:mm:ss');

        var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
        // Call Service to get time data
        var itemsDataFinal =[];
        var itemsDataFinal1 =[];
        var itemsDataTotal =[];
        $scope.itemsDataFinal1 = "";
        $scope.itemsDataTotal = "";
        if (jsonSFromloginDetail)
            gridDataService.getData(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, startDate, endDate, $filter('date') ($scope.currentDate, 'yyyy-MM-dd HH:mm:ss')).then(function (data) {
                if (data.RETTIM_OUT_OBJ.RETCD == 0 && (data.RETTIM_OUT_OBJ.TIME_ARR == null || data.RETTIM_OUT_OBJ.TIME_ARR.length == 0)) {
                    $scope.gridData = JSON.parse('[]');
                    $scope.gridNoEntryMessage = 1;
                    $scope.ttlHrs = 0.00;
                    $scope.ttlHrs = $scope.ttlHrs.toFixed(2);
                    $scope.weeklyTtlHours = 0.00;
                    $scope.weeklyTtlHours = $scope.weeklyTtlHours.toFixed(2);
                    $scope.monthlyTtlHrs = parseFloat(data.RETTIM_OUT_OBJ.TIME_SUMM.MTOTTIME);
                    $scope.monthlyTtlHrs = $scope.monthlyTtlHrs.toFixed(2);
                    $scope.nonSubmittedEntries = data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTED;
                    if ($rootScope.cntrExpandCollapse == 0) {
                        if ($scope.isDefaultExpanded) {
                            $scope.expandAllText = "Collapse All";
                            $scope.expandClass = 'fa fa-minus';
                            $(".weekly-details.task-container").css("padding-bottom", "28px");
                        }
                        else {
                            $scope.expandAllText = "Expand All";
                            $scope.expandClass = 'fa fa-plus';
                            $(".weekly-details.task-container").css("padding-bottom", "11px");
                        }
                    }
                }
                else if (data.RETTIM_OUT_OBJ.RETCD == 2) {
                    $scope.gridNoEntryMessage = 2;
                    $scope.errorMessage = "";
                    $scope.monthlyTtlHrs = 0.00;
                    var data = {
                        RETCD: 2,
                        ERRMSG: $filter('translate') ('msg_invalidSession')
                    }
                    $rootScope.sessionInvalid(data);
                }
                else {
                    $scope.monthlyTtlHrs = parseFloat(data.RETTIM_OUT_OBJ.TIME_SUMM.MTOTTIME);
                    $scope.monthlyTtlHrs = $scope.monthlyTtlHrs.toFixed(2);
                    $scope.nonSubmittedEntries = data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTED;
                    if (!isDailyMode) {
                        data.RETTIM_OUT_OBJ.TIME_ARR.sort(function (a, b) {
                            var nameA = parseFloat(a.TEID), nameB = parseFloat(b.TEID)
                            if (nameA > nameB)
                                return 1
                            if (nameA < nameB)
                                return -1
                            return 0
                        });
                        $scope.weeklyMaxTEIDCommon = data.RETTIM_OUT_OBJ.TIME_ARR[data.RETTIM_OUT_OBJ.TIME_ARR.length -1].TEID;

                        if ($rootScope.isPasteClicked) {
                            $rootScope.weeklyMaxTEID[$rootScope.weeklyMaxTEID.length]= $scope.weeklyMaxTEIDCommon;
                        }
                        else {
                            $rootScope.weeklyMaxTEID =[];
                            $rootScope.weeklyMaxTEID[0]= $scope.weeklyMaxTEIDCommon;
                        }
                    }

                    if (isDailyMode) {
                        itemsDataFinal1 =[];
                        data.RETTIM_OUT_OBJ.TIME_ARR.sort(function (a, b) {
                            var nameA = a.CEP_REC.CLIENO.toLowerCase(), nameB = b.CEP_REC.CLIENO.toLowerCase()
                            if (nameA < nameB)
                                return -1
                            if (nameA > nameB)
                                return 1
                            if (nameA = nameB) {
                                if (a.CEP_REC.ENGNO < b.CEP_REC.ENGNO)
                                    return -1
                                if (a.CEP_REC.ENGNO > b.CEP_REC.ENGNO)
                                    return 1
                                if (a.CEP_REC.ENGNO = b.CEP_REC.ENGNO) {
                                    if (a.CEP_REC.PRJNO < b.CEP_REC.PRJNO)
                                        return -1
                                    if (a.CEP_REC.PRJNO > b.CEP_REC.PRJNO)
                                        return 1
                                }
                            }

                            return 0

                        });
                        $scope.gridData = JSON.parse(JSON.stringify(data.RETTIM_OUT_OBJ.TIME_ARR));
                        $scope.addPropertyForExpandCollapse(true);
                    }
                    else {
                        $scope.gridData =[];
                        var itemsData = data.RETTIM_OUT_OBJ.TIME_ARR;
                        var maxIdRevisedArray =[];
                        for (var i = 0; i < itemsData.length; i++) {
                            var ttlHrsWeek = 0;
                            var d = new Date(itemsData[i].DTE.substring(0, itemsData[i].DTE.indexOf(' ')));
                            d = new Date(d.getTime() +(d.getTimezoneOffset() * 60 * 1000));
                            var day = d.getDay() +1;

                            var TEIDArray =[];
                            var cepDescrption;
                            if (itemsData[i].CATID == 0 || itemsData[i].CATID == undefined)
                                cepDescrption = itemsData[i].ACTI_REC.DES;
                            else
                                cepDescrption = itemsData[i].CTSDESC;
                            var computeIndex = itemsDataFinal.indexOf(itemsData[i].CEP_REC.CLIENO + "|"
                            +itemsData[i].CEP_REC.ENGNO + "|" +itemsData[i].CEP_REC.PRJNO + "|"
                            + cepDescrption + "|" + itemsData[i].DES + "|" +itemsData[i].TIMSUB + "|" +itemsData[i].REGFLAG + "|" +itemsData[i].PRSTCD + "|" + "0");
                            if (computeIndex == -1 && parseFloat(itemsData[i].TEID) <= parseFloat($rootScope.weeklyMaxTEID[0])) {
                                ttlHrsWeek += parseFloat(itemsData[i].HRS, 10);
                                itemsDataFinal.push(itemsData[i].CEP_REC.CLIENO + "|"
                            +itemsData[i].CEP_REC.ENGNO + "|" +itemsData[i].CEP_REC.PRJNO + "|"
                                + cepDescrption + "|" + itemsData[i].DES + "|" +itemsData[i].TIMSUB + "|" +itemsData[i].REGFLAG + "|" +itemsData[i].PRSTCD + "|" + "0");


                                itemsDataFinal1.push({
                                    CLIENO: itemsData[i].CEP_REC.CLIENO, ENGNO: itemsData[i].CEP_REC.ENGNO, PRJNO: itemsData[i].CEP_REC.PRJNO, CTDESC: itemsData[i].CTDESC, DES: itemsData[i].DES, Hrs1: null, Hrs2: null, Hrs3: null, Hrs4: null, Hrs5: null, Hrs6: null, Hrs7: null, HrsTotal: ttlHrsWeek
                                , TEID_data: itemsData[i].TEID, data: itemsData[i]
                                });

                                itemsDataFinal1[itemsDataFinal1.length - 1]["Hrs" +day]= parseFloat(itemsData[i].HRS, 10);
                                itemsDataFinal1[itemsDataFinal1.length - 1]["TEID" +day]= itemsData[i].TEID;
                            }
                            else if (parseFloat(itemsData[i].TEID) > parseFloat($rootScope.weeklyMaxTEID[0]) && $rootScope.isPasteClicked && $rootScope.weeklyMaxTEID.length > 1) {
                                var maxTEID = $rootScope.weeklyMaxTEID[$rootScope.weeklyMaxTEID.length - 2] + "--" +$rootScope.weeklyMaxTEID[$rootScope.weeklyMaxTEID.length -1];
                                for (var z = 0; z < ($rootScope.weeklyMaxTEID.length -1); z++) {
                                    if (parseFloat(itemsData[i].TEID) > parseFloat($rootScope.weeklyMaxTEID[z]) && parseFloat(itemsData[i].TEID) <= parseFloat($rootScope.weeklyMaxTEID[z +1])) {
                                        maxTEID = $rootScope.weeklyMaxTEID[z] + "--" +$rootScope.weeklyMaxTEID[z +1];
                                        break;
                                    }
                                }
                                var isFoundInMultiCopy = false;
                                for (var q = maxIdRevisedArray.length -1; q > -1; q--) {
                                    computeIndex = itemsDataFinal.indexOf(itemsData[i].CEP_REC.CLIENO + "|"
                                                                    +itemsData[i].CEP_REC.ENGNO + "|" +itemsData[i].CEP_REC.PRJNO + "|"
                                                                        + cepDescrption + "|" + itemsData[i].DES + "|" +itemsData[i].TIMSUB + "|" +itemsData[i].REGFLAG + "|" +itemsData[i].PRSTCD + "|" +maxIdRevisedArray[q]);
                                    if (computeIndex > -1) {
                                        isFoundInMultiCopy = true;
                                        break;
                                    }
                                }
                                if (!isFoundInMultiCopy)
                                    computeIndex = itemsDataFinal.indexOf(itemsData[i].CEP_REC.CLIENO + "|"
                                                                +itemsData[i].CEP_REC.ENGNO + "|" +itemsData[i].CEP_REC.PRJNO + "|"
                                                                + cepDescrption + "|" + itemsData[i].DES + "|" +itemsData[i].TIMSUB + "|" +itemsData[i].REGFLAG + "|" +itemsData[i].PRSTCD + "|" +maxTEID);
                                if (computeIndex == -1) {
                                    ttlHrsWeek += parseFloat(itemsData[i].HRS, 10);
                                    itemsDataFinal.push(itemsData[i].CEP_REC.CLIENO + "|"
                                +itemsData[i].CEP_REC.ENGNO + "|" +itemsData[i].CEP_REC.PRJNO + "|"
                                    + cepDescrption + "|" + itemsData[i].DES + "|" +itemsData[i].TIMSUB + "|" +itemsData[i].REGFLAG + "|" +itemsData[i].PRSTCD + "|" +maxTEID);


                                    itemsDataFinal1.push({
                                        CLIENO: itemsData[i].CEP_REC.CLIENO, ENGNO: itemsData[i].CEP_REC.ENGNO, PRJNO: itemsData[i].CEP_REC.PRJNO, CTDESC: itemsData[i].CTDESC, DES: itemsData[i].DES, Hrs1: null, Hrs2: null, Hrs3: null, Hrs4: null, Hrs5: null, Hrs6: null, Hrs7: null, HrsTotal: ttlHrsWeek
                                    , TEID_data: itemsData[i].TEID, data: itemsData[i]
                                    });

                                    itemsDataFinal1[itemsDataFinal1.length - 1]["Hrs" +day]= parseFloat(itemsData[i].HRS, 10);
                                    itemsDataFinal1[itemsDataFinal1.length - 1]["TEID" +day]= itemsData[i].TEID
                                }
                                else if (computeIndex > -1) {
                                    if (itemsDataFinal1[computeIndex]["Hrs" +day] != null && parseFloat(itemsData[i].TEID) > parseFloat($rootScope.weeklyMaxTEID[0])) {
                                        var maxTEIDMultiple = maxTEID + " -- " +i;
                                        maxIdRevisedArray.push(maxTEIDMultiple);
                                        ttlHrsWeek += parseFloat(itemsData[i].HRS, 10);
                                        itemsDataFinal.push(itemsData[i].CEP_REC.CLIENO + "|"
                                    +itemsData[i].CEP_REC.ENGNO + "|" +itemsData[i].CEP_REC.PRJNO + "|"
                                        + cepDescrption + "|" + itemsData[i].DES + "|" +itemsData[i].TIMSUB + "|" +itemsData[i].REGFLAG + "|" +itemsData[i].PRSTCD + "|" +maxTEIDMultiple);


                                        itemsDataFinal1.push({
                                            CLIENO: itemsData[i].CEP_REC.CLIENO, ENGNO: itemsData[i].CEP_REC.ENGNO, PRJNO: itemsData[i].CEP_REC.PRJNO, CTDESC: itemsData[i].CTDESC, DES: itemsData[i].DES, Hrs1: null, Hrs2: null, Hrs3: null, Hrs4: null, Hrs5: null, Hrs6: null, Hrs7: null, HrsTotal: ttlHrsWeek
                                        , TEID_data: itemsData[i].TEID, data: itemsData[i]
                                        });
                                        computeIndex = -1;
                                        itemsDataFinal1[itemsDataFinal1.length - 1]["Hrs" +day]= parseFloat(itemsData[i].HRS, 10);
                                        itemsDataFinal1[itemsDataFinal1.length - 1]["TEID" +day]= itemsData[i].TEID
                                    }
                                }
                            }
                            if (computeIndex > -1) {
                                if (itemsDataFinal1[computeIndex]["Hrs" +day]== null) {
                                    itemsDataFinal1[computeIndex]["Hrs" +day]= 0;
                                }

                                itemsDataFinal1[computeIndex]["Hrs" +day]= parseFloat(itemsDataFinal1[computeIndex]["Hrs" + day], 10) +parseFloat(itemsData[i].HRS, 10);
                                itemsDataFinal1[computeIndex]["HrsTotal"]= parseFloat(itemsDataFinal1[computeIndex]["HrsTotal"], 10) +parseFloat(itemsData[i].HRS, 10);
                                itemsDataFinal1[computeIndex]["TEID" +day]= itemsDataFinal1[computeIndex]["TEID" +day]!= undefined ? itemsDataFinal1[computeIndex]["TEID" + day] + ',' +parseInt(itemsData[i].TEID, 10): parseInt(itemsData[i].TEID, 10);
                            }
                        }
                        itemsDataTotal["HrsGrandTotalSum"]= 0;
                        for (var j = 1; j <= 7; j++) {
                            var totSum = 0;
                            var checkIndex = false;
                            for (var i = 0; i < itemsDataFinal1.length; i++) {
                                if (itemsDataFinal1[i]["Hrs" +j]== null) {
                                    continue;
                                }
                                checkIndex = true;
                                totSum += parseFloat(itemsDataFinal1[i]["Hrs" +j], 10);
                                itemsDataTotal["HrsTotalSum" +j]= totSum;
                            }
                            if (!checkIndex) {
                                itemsDataTotal["HrsTotalSum" +j]= 0;
                                continue;
                            }
                            itemsDataTotal["HrsGrandTotalSum"]= parseFloat(itemsDataTotal["HrsGrandTotalSum"], 10) +parseFloat(itemsDataTotal["HrsTotalSum" +j], 10);
                        }
                        itemsDataFinal1.sort(function (a, b) {
                            var nameA = a.CLIENO.toLowerCase(), nameB = b.CLIENO.toLowerCase()
                            if (nameA < nameB)
                                return -1
                            if (nameA > nameB)
                                return 1
                            if (nameA = nameB) {
                                if (a.ENGNO < b.ENGNO)
                                    return -1
                                if (a.ENGNO > b.ENGNO)
                                    return 1
                                if (a.ENGNO = b.ENGNO) {
                                    if (a.PRJNO < b.PRJNO)
                                        return -1
                                    if (a.PRJNO > b.PRJNO)
                                        return 1
                                }
                            }

                            return 0

                        });
                        $scope.itemsDataFinal1 = itemsDataFinal1;
                        $scope.itemsDataTotal = itemsDataTotal;
                        $scope.weeklyTtlHours = itemsDataTotal["HrsGrandTotalSum"]
                        $scope.weeklyTtlHours = $scope.weeklyTtlHours.toFixed(2);
                        $scope.addPropertyForExpandCollapse(false);
                    }

                    if ($scope.gridData != undefined) {
                        $scope.ttlHrs = $scope.icChrge = 0.00;
                        $.each($scope.gridData, function (index, value) {
                            $scope.ttlHrs += parseFloat($scope.gridData[index].HRS);
                            $scope.icChrge += parseInt($scope.gridData[index].ICCHRGE, 10);

                        });
                        $scope.ttlHrs = $scope.ttlHrs.toFixed(2);
                        $scope.icChrge = $scope.icChrge.toFixed(2);
                    }
                }
                var revMnthRange = undefined;
                var CurrDate = new Date();
                var SelDate = new Date($scope.currentDate.valueOf());
                SelDate = $filter('date')(new Date(SelDate.getFullYear(), SelDate.getMonth(), SelDate.getDate()), "yyyy-MM-dd");
                var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var selObj = null;
                var pdate = $filter('date') ($scope.currentDate.valueOf(), "yyyy-MM-dd");
                var selecteddate = new Date($scope.currentDate.valueOf());

                pdate = createDate(pdate);
                //check from local
                selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate') ('msg_invalidSession'), true);//chekRevDateInLocalStorage(pdate);

                if (selObj != null) {
                    checkCloseMonth(selObj, CurrDate, monthNames, selecteddate);
                }
                else {
                    var loginDetail = $rootScope.GetLoginDetail(false, true);
                    loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                        revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                        if (revMnthRange != undefined && revMnthRange != "undefined") {
                            for (var i = 0; i < revMnthRange.length; i++) {
                                if (revMnthRange[i] != null && revMnthRange[i]!= undefined && revMnthRange[i].STRTDTE != undefined) {
                                    if (pdate >= createDate(revMnthRange[i].STRTDTE) && pdate <= createDate(revMnthRange[i].ENDDTE)) {
                                        selObj = revMnthRange[i];
                                        break;
                                    }
                                }
                            }
                        }
                        if (selObj != null) {
                            checkCloseMonth(selObj, CurrDate, monthNames, selecteddate);
                        }
                    });
                }
                $('.my-cloak').removeClass('my-cloak');
            })

        .catch(function (failure) {
            $('.my-cloak').removeClass('my-cloak');
            $scope.loadErrorPopup(true, $filter('translate') ('lbl_Error') + ":" +failure);
        });
    }

    $scope.deleteTimeEntries = function (isDailyMode, timeEntryIds, invalidCount, selectedCount, isTEInOpenREVWeekExist) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.deleteTimeEntries");
        var succnt = 0, messages = "";
        var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
        gridDataService.deleteTimeEntries(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, '"' +timeEntryIds.join('","') + '"').then(function (data) {
            if (data.DELTIM_OUT_OBJ.RETCD != 0)
                $timeout(function () { $scope.loadErrorPopup(true, data.DELTIM_OUT_OBJ.ERRMSG);
                }, 200);
            else {
                if (data.DELTIM_OUT_OBJ.TEID_ARR != undefined && data.DELTIM_OUT_OBJ.TEID_ARR != null) {
                    var deletedCount = data.DELTIM_OUT_OBJ.TEID_ARR.length != undefined ? data.DELTIM_OUT_OBJ.TEID_ARR.length: 1;
                    var unsuccessCount = 0;
                    if (isDailyMode)
                        unsuccessCount = selectedCount -deletedCount;
                    else
                        unsuccessCount = invalidCount;

                    succnt = selectedCount -unsuccessCount;
                    if (succnt > 0)
                        messages += 'Deleted' + ' ' + succnt + ' record(s) successfully.';
                    if (unsuccessCount > 0) {
                        if (messages != "")
                            messages += "<br/>";
                        messages += unsuccessCount + ' ' + ' Deletion unsuccessful – unable to delete submitted record(s).';
                    }
                    $(".del").removeClass("active");
                    $scope.GetData(isDailyMode, (isDailyMode ? $scope.currentDate : $scope.weeklyStartDate));
                    $scope.loadErrorPopup(false, messages);
                }
                else {
                    $(".del").removeClass("active");
                    showMessageOnDeleteFailure(isTEInOpenREVWeekExist, isDailyMode);                        
                }
            }

        })

    }
    var showMessageOnDeleteFailure = function (isTEInOpenREVWeekExist, isDailyMode) {
        if (isDailyMode) {
            if ($scope.checkRevMonthFlag)
                $scope.loadErrorPopup(false, $filter('translate')('lbl_cantDlt'));
            else
                $scope.loadErrorPopup(false,$filter('translate') ('msg_dltFaild'));

        }
        else {
            if (isTEInOpenREVWeekExist)
                $scope.loadErrorPopup(false,$filter('translate') ('lbl_cantDlt'));
            else
                $scope.loadErrorPopup(false,$filter('translate') ('msg_dltFaild'));
        }
    }
    $scope.loadPreferences = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.loadPreferences");
        $(".navigation").animate({ left: -(widthNav)
        }, 500);
        $(".overlay").fadeOut(500);
        var sendData = {
            viewPref: $scope.objUsrPreference.viewPref
        }

        $scope.openModalCtrl = 'Preference';
        $scope.open('templates/Preference.html', 'Preference', sendData);
    }

    /*submit entry*/
    /*performance improvement : loadRevenueMonths API call*/
    $scope.submitTimeEntries = function () {
        $(".navigation").animate({ left: -(widthNav)
        }, 500);
        $(".overlay").fadeOut(500);
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.submitTimeEntries");
        var revMnthRange = undefined;
        var CurrDate = new Date();
        var SelDate = new Date($scope.currentDate.valueOf());
        SelDate = $filter('date')(new Date(SelDate.getFullYear(), SelDate.getMonth(), SelDate.getDate()), "yyyy-MM-dd");

        var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var selObj = null;
        var pdate = $filter('date') ($scope.currentDate.valueOf(), "yyyy-MM-dd");
        pdate = createDate(pdate);
        selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate') ('msg_invalidSession'), false);// chekRevDateInLocalStorage(pdate);
        if (selObj != null) {
            submitTimeEntriesCheck(selObj, CurrDate, monthNames);
        }
        else {
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                if (revMnthRange != undefined && revMnthRange != "undefined") {

                    for (var i = 0; i < revMnthRange.length; i++) {
                        if (revMnthRange[i] != null && revMnthRange[i]!= undefined && revMnthRange[i].STRTDTE != undefined) {
                            if (pdate >= createDate(revMnthRange[i].STRTDTE) && pdate <= createDate(revMnthRange[i].ENDDTE)) {
                                selObj = revMnthRange[i];
                                break;
                            }
                        }
                    }
                }
                if (selObj != null) {
                    submitTimeEntriesCheck(selObj, CurrDate, monthNames);
                }

            });
        }
    }
    var submitTimeEntriesCheck = function (selObj, CurrDate, monthNames) {
        var revEndDateCutoff = null;
        if (selObj.TECUTTOFF.split(" ")) {
            revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
        }
        var selectedDate = new Date($scope.currentDate.valueOf());
        selectedDate = $filter('date')(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()), "yyyy-MM-dd");
        var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var revEndDateCutoffdate = new Date(revEndDateCutoff);
        revEndDateCutoffdate.setHours(0, 0, 0, 0);

        if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
            //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
            $scope.checkRevMonthFlag = false;
            $scope.isSbmtOpen = false;
        }
        else {
            var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, true);
            var revStrDteAr = jsonSFromloginDetail.REVM_REC.STRTDTE.split("-");
            var revEndDteAr = jsonSFromloginDetail.REVM_REC.ENDDTE.valueOf().split("-");

            //revenue start and end date
            var revSDte = new Date(revStrDteAr[0], revStrDteAr[1]-1, revStrDteAr[2].split(" ")[0]);
            var revEDte = new Date(revEndDteAr[0], revEndDteAr[1]-1, revEndDteAr[2].split(" ")[0]);
            revSDte = new Date(revSDte.getTime() +(revSDte.getTimezoneOffset() * 60 * 1000));
            revEDte = new Date(revEDte.getTime() +(revEDte.getTimezoneOffset() * 60 * 1000));
            var selDte = new Date($scope.currentDate.valueOf());
            var revSDteOriginal = revSDte;
            var selDteOriginal = selDte;
            selDte.setHours(0, 0, 0, 0);
            revSDte.setHours(0, 0, 0, 0)
            //date is falling in the current revenue month then only call submit
            if (selDte >= revSDte) {
                var ttlRcrdToSmt = parseInt($scope.nonSubmittedEntries);
                console.log("ttlRcrdToSmt==" +ttlRcrdToSmt);
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                selDte = $filter('date')(new Date(selDte.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                if (ttlRcrdToSmt > 0) {
                    $scope.submitIfConfirm($scope.currentDate.valueOf(), loginDetail.SESKEY, loginDetail.EMPLID, selDte, ttlRcrdToSmt, revSDteOriginal, selDteOriginal);
                }
                else {
                    $scope.loadErrorPopup(false, $filter('translate') ('msg_NoTEntryToSubmit'), false, false);
                }
            }
        }
    }

    $scope.loadErrorPopup = function (isError, message, isReloadPage, isCancelBtnOn) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.loadErrorPopup");
        var sendData = {
            isError: isError,
            message: message,
            isReloadPage: isReloadPage,
            isCancelBtnOn: isCancelBtnOn,

        };
        $scope.openModalCtrl = 'ErrorPopup';
        $scope.open('templates/ErrorPopup.html', 'ErrorPopup', sendData);
    }

    $scope.submitIfConfirm = function (curDte, ses, eId, dte, recrd, revSDteOrig, selDteOrig) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.submitIfConfirm");
        var msg = $filter('translate') ('msg_SubmitTimeMsg', { date: $filter('date') (curDte, 'dd-MMM-yyyy')
        });
        var sendData = {
            message: msg,
            isSubmit: true,
            empId: eId,
            sesKey: ses,
            selDte: dte,
            ttlRcd: recrd,
            revSDteOriginal: revSDteOrig,
            selDteOriginal: selDteOrig,
            isCancelBtnOn: true

        };

        $scope.openModalCtrl = 'submitConfirm';
        $scope.open('templates/ConfirmMessage.html', 'ConfirmMessage', sendData);

    }

    var callApiToSubmitEntries = function (ssKey, empId, toDte, ttlEntries, revSDteOriginal, selDteOriginal) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.callApiToSubmitEntries");
        gridDataService.submitTimeEntries("N", ssKey, empId, toDte, function (data) {
            $scope.loadErrorPopup(false, data.SUBTIM_OUT_OBJ.ERRMSG, true, false);
            if ($scope.isDailyMode)
                $scope.GetData($scope.isDailyMode, $scope.currentDate);
            else
                $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
        });
    }

    $scope.editTimeEntry = function (gridEditData) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.editTimeEntry");
        var isDailyMode = $scope.isDailyMode;
        var sendDate;
        if (isDailyMode) {
            localStorage.setItem('Time_Entry', JSON.stringify(gridEditData));
            sendDate = new Date($scope.currentDate.valueOf());
        }
        else {
            localStorage.setItem('Time_Entry', JSON.stringify(gridEditData.data));
            var weeklyhours =[];
            weeklyhours[0]= gridEditData.Hrs1;
            weeklyhours[1]= gridEditData.Hrs2;
            weeklyhours[2]= gridEditData.Hrs3;
            weeklyhours[3]= gridEditData.Hrs4;
            weeklyhours[4]= gridEditData.Hrs5;
            weeklyhours[5]= gridEditData.Hrs6;
            weeklyhours[6]= gridEditData.Hrs7;
            localStorage.setItem('weeklyhours', JSON.stringify(weeklyhours));

            var teid_data =[];
            teid_data[0]= typeof gridEditData.TEID1 != 'undefined' ? gridEditData.TEID1: 0;
            teid_data[1]= typeof gridEditData.TEID2 != 'undefined' ? gridEditData.TEID2: 0;
            teid_data[2]= typeof gridEditData.TEID3 != 'undefined' ? gridEditData.TEID3: 0;
            teid_data[3]= typeof gridEditData.TEID4 != 'undefined' ? gridEditData.TEID4: 0;
            teid_data[4]= typeof gridEditData.TEID5 != 'undefined' ? gridEditData.TEID5: 0;
            teid_data[5]= typeof gridEditData.TEID6 != 'undefined' ? gridEditData.TEID6: 0;
            teid_data[6]= typeof gridEditData.TEID7 != 'undefined' ? gridEditData.TEID7: 0;
            localStorage.setItem('teid_data', JSON.stringify(teid_data));
            sendDate = new Date($scope.weeklyStartDate.valueOf());

        }
        $scope.NewClick(sendDate, $scope.currentDate.valueOf(), isDailyMode, true);
    }
    function datedifference(date1, date2) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.fn.datedifference");

        var dayDiff = parseInt((date1 - date2) / (1000 * 60 * 60 * 24));
        var minDiff = parseInt(Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60) % 60);
        var hDiff = parseInt(Math.abs(date1 - date2) / (1000 * 60 * 60) % 24);
        var milliSec = date1.getTime() - date2.getTime();
        var dayhrsmin = {
        };
        dayhrsmin.day = dayDiff;
        dayhrsmin.hours = hDiff;
        dayhrsmin.minutes = minDiff;
        dayhrsmin.milliSec = milliSec;
        return dayhrsmin;
    }
    var getMonthName = function (v) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.var.getMonthName");
        var n = {
            0: $filter('translate')('lbl_Mnth1'), 1: $filter('translate')('lbl_Mnth2'), 2: $filter('translate')('lbl_Mnth3'),
            3: $filter('translate')('lbl_Mnth4'), 4: $filter('translate')('lbl_Mnth5'), 5: $filter('translate')('lbl_Mnth6'),
            6: $filter('translate')('lbl_Mnth7'),
            7: $filter('translate')('lbl_Mnth8'), 8: $filter('translate')('lbl_Mnth9'), 9: $filter('translate')('lbl_Mnth10'),
            10: $filter('translate')('lbl_Mnth11'), 11: $filter('translate')('lbl_Mnth12')
        };
        return n[v]
    }
    var getRevenueMonthAndYear = function (revenddate, reduceMnth) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.var.getRevenueMonthAndYear");
        var closemnth = "";
        var cuttOffYear = revenddate.getFullYear();
        if (revenddate.getMonth() != 0)
            closemnth = parseInt(revenddate.getMonth()) - reduceMnth;
        else {
            closemnth = (reduceMnth == 1 ? 11 : 0);
            cuttOffYear = parseInt(cuttOffYear) - reduceMnth;
        }
        var revenuedate = {
        };
        revenuedate.monthname = getMonthName(closemnth);
        revenuedate.year = cuttOffYear;
        return revenuedate;
    }
    function callMonthEndAtIntervalMobile() {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.fn.callMonthEndAtIntervalMobile");
        var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        var revenueMonthsCountdown = JSON.parse(localStorage.getItem("MonthEndCountdownRevenueMonth"));
        var countdownRevRangeDate = null;
        if (revenueMonthsCountdown != null && revenueMonthsCountdown.length != 0) {
            var tempTodayDate1 = $filter('date')(new Date(), "yyyy-MM-dd");
            var offsetDate = new Date();
            if (offsetDate.getTimezoneOffset() > 0) {
                tempTodayDate1 = $filter('date')(new Date("sessiontimeout"), "yyyy-MM-dd");
            }
            for (var i = 0; i < revenueMonthsCountdown.length; i++) {
                if (revenueMonthsCountdown[i] != null && revenueMonthsCountdown[i] != undefined && revenueMonthsCountdown[i].STRTDTE != undefined) {
                    if (createDate(tempTodayDate1) >= createDate(revenueMonthsCountdown[i].STRTDTE) && createDate(tempTodayDate1) <= createDate(revenueMonthsCountdown[i].ENDDTE)) {
                        countdownRevRangeDate = revenueMonthsCountdown[i];
                        break;
                    }
                }
            }
        }
        var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, false);
        var tecuttoff = jsonSFromloginDetail.REVM_REC.TECUTTOFF;
        if (countdownRevRangeDate != undefined && countdownRevRangeDate != null && countdownRevRangeDate.length != 0) {
            tecuttoff = countdownRevRangeDate.TECUTTOFF;

            tecuttoff = createDateTime(tecuttoff);
            var revstdate = createDateTime(countdownRevRangeDate.STRTDTE);
            var revenddate = createDateTime(countdownRevRangeDate.ENDDTE);
            var initialRevEndDate = createDateTime(jsonSFromloginDetail.REVM_REC.ENDDTE);
            var revmnthyeardata = getRevenueMonthAndYear(initialRevEndDate, 1);
            var currentdate = new Date();
            var todayDate = new Date();
            if (localStorage.getItem('CutOff_Occured') != "1")
                $scope.closedmonth = "";
            if (((revstdate.getFullYear() + '-' +revstdate.getMonth() + '-' + revstdate.getDate()) == (todayDate.getFullYear() + '-' +todayDate.getMonth() + '-' +todayDate.getDate()))) {
                $scope.closedmonth = revmnthyeardata.monthname + " " +revmnthyeardata.year + $filter('translate') ('msg_nwClosed');
            }
            else if ((tecuttoff.getTime() +10000) > currentdate.getTime()) {
                var dayhrsmin = [];
                dayhrsmin = datedifference(tecuttoff, currentdate);
                if (dayhrsmin.milliSec < 0) {
                    var revmnthyeardataCutOff = getRevenueMonthAndYear(initialRevEndDate, 0);
                    $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
                    $rootScope.callMonthEndAtIntervalMobile = $interval(callMonthEndAtIntervalMobile, 1000 * 60);
                    if ((tecuttoff.getFullYear() + '-' + tecuttoff.getMonth() + '-' + tecuttoff.getDate()) == (currentdate.getFullYear() + '-' + currentdate.getMonth() + '-' + currentdate.getDate())) {
                        if (localStorage.getItem('CutOff_Occured') != "1")
                            $scope.closedmonth = revmnthyeardataCutOff.monthname + " " + revmnthyeardataCutOff.year + $filter('translate')('msg_nwClosed');
                        var tempTodayDate = new Date();
                        var currentTimezone = tempTodayDate.getTimezoneOffset();
                        tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));

                        var currdt = angular.copy($scope.currentDate);
                        currdt.setHours(0, 0, 0, 0);

                        if (currdt >= revstdate && currdt <= revenddate) {
                            if (!$scope.monthendcheck) {
                                loginService.retrieveInitialData($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID).then(function (response) {
                                    if (parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                                        localStorage.setItem('CutOff_Occured', "1");
                                        localStorage.setItem('InitialMobile_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                                        localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                                    }
                                });
                                $scope.monthendcheck = true;
                            }
                        }
                    }
                    $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
                    if (localStorage.getItem('CutOff_Occured') != "1")
                        $scope.closedmonth = revmnthyeardataCutOff.monthname + " " + revmnthyeardataCutOff.year + $filter('translate')('msg_nwClosed');
                    $scope.checkRevMonthFlag = false;
                    $scope.isSbmtOpen = false;
                }
                else {
                    //if (dayhrsmin.day < 5) {
                    if (dayhrsmin.day == 0 && dayhrsmin.hours < 2) {
                        $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
                        $rootScope.callMonthEndAtIntervalMobile = $interval(callMonthEndAtIntervalMobile, 1000 * 60 * 1);
                        if (dayhrsmin.milliSec < 60000) {
                            $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
                            $rootScope.callMonthEndAtIntervalMobile = $interval(callMonthEndAtIntervalMobile, 1000 * 5);
                        }
                        else if (dayhrsmin.milliSec < 120000) {
                            $interval.cancel($rootScope.callMonthEndAtIntervalMobile);
                            $rootScope.callMonthEndAtIntervalMobile = $interval(callMonthEndAtIntervalMobile, 1000 * 10);
                        }
                    }
                    //}
                }
            }
            else if (tecuttoff.getTime() < currentdate.getTime()) {
                $scope.checkRevMonthFlag = false;
                $scope.isSbmtOpen = false;
                $scope.closedmonth = revmnthyeardata.monthname + " " + revmnthyeardata.year + $filter('translate')('msg_nwClosed');
            }
        }
    }
    var checkCloseMonth = function (selObj, CurrDate, monthNames, selecteddate) {
        var revEndDateCutoff = null;
        if (selObj.TECUTTOFF.split(" ")) {
            revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
        }
        selecteddate = $filter('date') (new Date(selecteddate.getFullYear(), selecteddate.getMonth(), selecteddate.getDate()), "yyyy-MM-dd");
        var chkcurdate = $filter('date') (new Date(), "yyyy-MM-dd");
        var revEndDateCutoffdate = new Date(revEndDateCutoff);
        revEndDateCutoffdate.setHours(0, 0, 0, 0);
        if (CurrDate.getTime() >= revEndDateCutoff.getTime() && (selecteddate >= selObj.STRTDTE.substring(0, 10) && selecteddate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
            //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
            $scope.checkRevMonthFlag = false;
            $scope.isSbmtOpen = false;
        }
    }
    var redirectToNewEntryPage = function (selObj, currentDate, CurrDate, SelDate, isEditMode, sendDate, isDailyMode) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.redirectToNewEntryPage");
        var datetime = $locale.DATETIME_FORMATS;
        var monthNames = datetime.MONTH;
        if (selObj.TECUTTOFF.split(" ")) {
            var revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
        }
        var selectedDate = $filter('date') (currentDate, "yyyy-MM-dd");
        var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var revEndDateCutoffdate = new Date(revEndDateCutoff);
        revEndDateCutoffdate.setHours(0, 0, 0, 0);

        if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
            $scope.checkRevMonthFlag = false;
            //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
            $scope.isSbmtOpen = false;
            if (SelDate) {
                var timeEntry = JSON.parse(localStorage.getItem('Time_Entry'));
                timeEntry.TIMSUB = "Y";
                localStorage.setItem('Time_Entry', JSON.stringify(timeEntry));
                if (isEditMode) {
                    $state.go('mNewEntry', {
                        "startDate": sendDate, "isDailyMode": isDailyMode, "IsEditMode": isEditMode, "currentDate": currentDate
                    });
                }
            }
        }
        else {
            if ($scope.checkRevMonthFlag || isEditMode) {
                $state.go('mNewEntry', {
                    "startDate": sendDate, "isDailyMode": isDailyMode, "IsEditMode": isEditMode, "currentDate": currentDate
                });
            }
        }
    }
    /*Performance improvement : loadRevenueMonths API call*/
    $scope.NewClick = function (sendDate, currentDate, isDailyMode, isEditMode) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.NewClick");
        if (timePriorToBillingStartDate()) {
            $rootScope.lastCurrentDate = $filter('date') (currentDate, "yyyy-MM-dd");
            $rootScope.lastExpandAllText = $scope.expandAllText;
            $rootScope.lastExpandClass = $scope.expandClass;
            $rootScope.cntrExpandCollapse = 2;
            if (!isDailyMode) {
                $rootScope.isPasteClicked = true;
                $rootScope.weekStateCurrentDate = $filter('date') (currentDate, "yyyy-MM-dd");
            }
            var revMnthRange = undefined;
            var selObj = null;
            var CurrDate = new Date();
            var SelDate = $filter('date') (currentDate, "yyyy-MM-dd");
            var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var pdate = $filter('date') (currentDate, "yyyy-MM-dd");
            pdate = createDate(pdate);
            selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate') ('msg_invalidSession'), false);
            if (selObj != null) {
                redirectToNewEntryPage(selObj, currentDate, CurrDate, SelDate, isEditMode, sendDate, isDailyMode)
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                    revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                    if (revMnthRange != undefined && revMnthRange != "undefined") {
                        var pdate = $filter('date') (currentDate, "yyyy-MM-dd");
                        pdate = createDate(pdate);
                        for (var i = 0; i < revMnthRange.length; i++) {
                            if (revMnthRange[i] != null && revMnthRange[i]!= undefined && revMnthRange[i].STRTDTE != undefined) {
                                if (pdate >= createDate(revMnthRange[i].STRTDTE) && pdate <= createDate(revMnthRange[i].ENDDTE)) {
                                    selObj = revMnthRange[i];
                                    break;
                                }
                            }
                        }

                    }
                    if (selObj != null) {
                        redirectToNewEntryPage(selObj, currentDate, CurrDate, SelDate, isEditMode, sendDate, isDailyMode)
                    }
                });
            }
        }

    }
    var timePriorToBillingStartDate = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.var.timePriorToBillingStartDate");
        var initialDetail = $rootScope.GetInitialDetail(false, true);
        var isDtaeBeforeBillDate = false;
        var firstWeekDate =$scope.isDailyMode?$scope.currentDate: getWeekFirstDate();
        var startDate = $scope.currentDate;
        if (!$scope.isDailyMode) {
            startDate = firstWeekDate.setDate(firstWeekDate.getDate() + 6);
            startDate = new Date(startDate.valueOf());
        }
        var billingDate = $filter('date')(initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
        isDtaeBeforeBillDate = $rootScope.isDatePriorToBillingDate(billingDate, startDate);
        if (isDtaeBeforeBillDate) {
            var parts = billingDate.split("-");
            var day = parts[2].split(' ');
            var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
            var show = nstartDate.toString().split(' ');
            var date = show[2] + '-' + show[1] + '-' + show[3];
            $scope.loadErrorPopup(true, $filter('translate')('msg_TimePriorToBillingStartDate', {
                dateVal: date
            }));
            return false;
        }
        else {
            return true;
        }
    }
    var getWeekFirstDate = function () {
        //        $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getWeekFirstDate");
        //        var resDate = new Date($scope.currentDate.valueOf());
        //        resDate.setDate(resDate.getDate() + 1);
        //        resDate.setDate(resDate.getDate() - 7);
        //        for (var i = 0; i < 7; i++) {
        //            if (resDate.getDay() == 0)
        //                break;
        //            resDate.setDate(resDate.getDate() + 1);
        //}    
        return  new Date($scope.weeklyStartDate.valueOf());
    }
    var createDate = function (dteStr) {
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1]-1, day[0]);
        }
        else return null;
    }

    var createDateTime = function (dateStr) {
        if (dateStr != undefined && dateStr != null) {
            dateStr = dateStr.trim();
            var parts = dateStr.split("-");
            var day = parts[2].split(' ');
            var time = day[1].split(':')
            return new Date(parts[0], parts[1]-1, day[0], time[0], time[1], time[2]);
        }
        else
            return new Date();
    }
    /*Performance improvement : loadRevenueMonths API call*/
    $scope.prevDate = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.prevDate");
        $rootScope.expandedEntries =[];
        $rootScope.collapsedEntries =[];
        $rootScope.cntrExpandCollapse = 0;
        var dayOfWeek = 0;
        //$scope.closedmonth = '';
        var revMnthRange =[];
        var isDailyMode = $scope.isDailyMode;
        var CurrDate = new Date();
        var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (isDailyMode) {
            var resDate = new Date($scope.currentDate.valueOf());
            resDate.setDate(resDate.getDate() -1);
            var dailyprevDate = new Date(resDate.valueOf());
            var updDate = $filter('date')(new Date(dailyprevDate.getFullYear(), dailyprevDate.getMonth(), 1), "yyyy-MM-dd");
            var pdate = $filter('date') (dailyprevDate, "yyyy-MM-dd");
            var selObj = null;
            pdate = createDate(pdate)
            selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate') ('msg_invalidSession'), false);
            if (selObj != null) {
                $scope.currentDate = new Date(resDate.valueOf());
                localStorage.setItem('updDate', $scope.currentDate);
                localStorage.SelectedCalendardate = $scope.currentDate;
                broadcastService.notifyDateTimeSlider($scope.currentDate);
                $scope.GetData(isDailyMode, $scope.currentDate);

                var revEndDateCutoff = null;
                if (selObj.TECUTTOFF.split(" ")) {
                    revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
                }
                var selectedDate = $filter('date')(new Date(resDate.getFullYear(), resDate.getMonth(), resDate.getDate()), "yyyy-MM-dd");
                var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
                var revEndDateCutoffdate = new Date(revEndDateCutoff);
                revEndDateCutoffdate.setHours(0, 0, 0, 0);

                if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                    //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
                    $scope.checkRevMonthFlag = false;
                    $scope.isSbmtOpen = false;
                }
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, updDate, function (response) {
                    localStorage.setItem('REV_MON_RANGE', JSON.stringify(response.LOADREVM_OUT_OBJ.REVM_ARR));
                    revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                    if (revMnthRange != undefined && revMnthRange != "undefined" && revMnthRange != null) {
                        for (var i = 0; i < revMnthRange.length; i++) {
                            if (revMnthRange[i] != null && revMnthRange[i]!= undefined && revMnthRange[i].STRTDTE != undefined) {
                                if (pdate >= createDate(revMnthRange[i].STRTDTE) && pdate <= createDate(revMnthRange[i].ENDDTE)) {
                                    selObj = revMnthRange[i];
                                    break;
                                }
                            }
                        }
                        if (selObj != null) {
                            $scope.currentDate = new Date(resDate.valueOf());
                            localStorage.setItem('updDate', $scope.currentDate);
                            localStorage.SelectedCalendardate = $scope.currentDate;
                            broadcastService.notifyDateTimeSlider($scope.currentDate);
                            $scope.GetData(isDailyMode, $scope.currentDate)
                        }
                        else {
                            var prevDailyDate = $filter('date') (pdate, "dd-MMM-yyyy");
                            $scope.loadErrorPopup(true, $filter('translate') ('msg_RevenueMonth', { dateVal: prevDailyDate
                            }));

                        }
                    }

                    if (selObj != null) {
                        var revEndDateCutoff = null;
                        if (selObj.TECUTTOFF.split(" ")) {
                            revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
                        }
                        var selectedDate = $filter('date')(new Date(resDate.getFullYear(), resDate.getMonth(), resDate.getDate()), "yyyy-MM-dd");
                        var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
                        var revEndDateCutoffdate = new Date(revEndDateCutoff);
                        revEndDateCutoffdate.setHours(0, 0, 0, 0);

                        if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                            //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
                            $scope.checkRevMonthFlag = false;
                            $scope.isSbmtOpen = false;
                        }
                    }

                });
            }


        }
        else {
            dayOfWeek = $scope.currentDate.getDay();
            var resDate = new Date($scope.weeklyStartDate.valueOf());
            resDate.setDate(resDate.getDate() -13);
            for (var i = 0; i < 7; i++) {
                if (resDate.getDay() == 0)
                    break;
                resDate.setDate(resDate.getDate() +1);
            }
            var weeklyprevDate = new Date(resDate.valueOf());
            var updDate = $filter('date')(new Date(weeklyprevDate.getFullYear(), weeklyprevDate.getMonth(), 1), "yyyy-MM-dd");
            var pweekdate = $filter('date') (weeklyprevDate, "yyyy-MM-dd");
            pweekdate = createDate(pweekdate);
            var selObj = null;
            selObj = $rootScope.chekRevDateInLocalStorage(pweekdate, $filter('translate') ('msg_invalidSession'), false);
            if (selObj != null) {
                $scope.weeklyStartDate = new Date(resDate.valueOf());
                var tempDate = new Date(resDate.valueOf());
                tempDate.setDate(tempDate.getDate() +dayOfWeek);
                $scope.currentDate = new Date(tempDate.valueOf());
                localStorage.setItem('updDate', $scope.weeklyStartDate);
                localStorage.SelectedCalendardate = $scope.currentDate;
                broadcastService.notifyDateTimeSlider($scope.currentDate);
                $scope.GetData(isDailyMode, $scope.weeklyStartDate);

                var revEndDateCutoff = null;
                if (selObj.TECUTTOFF.split(" ")) {
                    revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
                }
                var selectedDate = $filter('date') ($scope.currentDate, "yyyy-MM-dd");
                var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
                var revEndDateCutoffdate = new Date(revEndDateCutoff);
                revEndDateCutoffdate.setHours(0, 0, 0, 0);
                if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                    //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
                    $scope.checkRevMonthFlag = false;
                    $scope.isSbmtOpen = false;
                }
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, updDate, function (response) {
                    localStorage.setItem('REV_MON_RANGE', JSON.stringify(response.LOADREVM_OUT_OBJ.REVM_ARR));
                    revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                    if (revMnthRange != undefined && revMnthRange != "undefined" && revMnthRange != null) {
                        for (var i = 0; i < revMnthRange.length; i++) {
                            if (revMnthRange[i] != null && revMnthRange[i]!= undefined && revMnthRange[i].STRTDTE != undefined) {
                                if (pweekdate >= createDate(revMnthRange[i].STRTDTE) && pweekdate <= createDate(revMnthRange[i].ENDDTE)) {
                                    selObj = revMnthRange[i];
                                    break;
                                }
                            }
                        }
                        if (selObj != null) {
                            $scope.weeklyStartDate = new Date(resDate.valueOf());
                            var tempDate = new Date(resDate.valueOf());
                            tempDate.setDate(tempDate.getDate() +dayOfWeek);
                            $scope.currentDate = new Date(tempDate.valueOf());
                            localStorage.setItem('updDate', $scope.weeklyStartDate);
                            localStorage.SelectedCalendardate = $scope.currentDate;
                            broadcastService.notifyDateTimeSlider($scope.currentDate);
                            $scope.GetData(isDailyMode, $scope.weeklyStartDate)
                        }
                        else {
                            var prevWeeklyDate = $filter('date')(new Date(pweekdate), "dd-MMM-yyyy");
                            $scope.loadErrorPopup(true, $filter('translate') ('msg_RevenueMonth', { dateVal: prevWeeklyDate
                            }));
                        }
                    }

                    if (selObj != null) {
                        var revEndDateCutoff = null;
                        if (selObj.TECUTTOFF.split(" ")) {
                            revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
                        }
                        var selectedDate = $filter('date') ($scope.currentDate, "yyyy-MM-dd");
                        var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
                        var revEndDateCutoffdate = new Date(revEndDateCutoff);
                        revEndDateCutoffdate.setHours(0, 0, 0, 0);
                        if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                            //$scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' +revEndDateCutoff.getFullYear() + ' is now closed';
                            $scope.checkRevMonthFlag = false;
                            $scope.isSbmtOpen = false;
                        }
                    }
                });
            }

        }
        $rootScope.isPasteClicked = false;
        $rootScope.weeklyMaxTEID =[];

    }
    /*performance improvement : loadRevenueMonths API call*/
    $scope.nextDate = function () {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.nextDate");
        var dayOfWeek = 0;
        $rootScope.expandedEntries =[];
        $rootScope.collapsedEntries =[];
        $rootScope.cntrExpandCollapse = 0;
        //$scope.closedmonth = '';
        var CurrDate = new Date();
        var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var isDailyMode = $scope.isDailyMode;
        var revMnthRnge =[];
        if (isDailyMode) {
            var resDate = new Date($scope.currentDate.valueOf());
            resDate.setDate(resDate.getDate() +1);
            var dailynextDate = new Date(resDate.valueOf());
            var updDate = $filter('date')(new Date(dailynextDate.getFullYear(), dailynextDate.getMonth(), 1), "yyyy-MM-dd");
            var cdate = $filter('date') (dailynextDate, "yyyy-MM-dd");
            var selObj = null;
            cdate = createDate(cdate);
            selObj = $rootScope.chekRevDateInLocalStorage(cdate, $filter('translate') ('msg_invalidSession'), false);// chekRevDateInLocalStorage(cdate);
            if (selObj != null) {
                $scope.currentDate = new Date(resDate.valueOf());
                localStorage.setItem('updDate', $scope.currentDate);
                localStorage.SelectedCalendardate = $scope.currentDate;
                broadcastService.notifyDateTimeSlider($scope.currentDate);
                $scope.GetData(isDailyMode, $scope.currentDate);
                checkCloseMonth(selObj, CurrDate, monthNames, resDate);
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, updDate, function (response) {
                    localStorage.setItem('REV_MON_RANGE', JSON.stringify(response.LOADREVM_OUT_OBJ.REVM_ARR));
                    revMnthRnge = response.LOADREVM_OUT_OBJ.REVM_ARR;

                    if (revMnthRnge != undefined && revMnthRnge != "undefined" && revMnthRnge != null) {
                        for (var i = 0; i < revMnthRnge.length; i++) {
                            if (revMnthRnge[i] != null && revMnthRnge[i]!= undefined && revMnthRnge[i].STRTDTE != undefined) {
                                if (cdate >= createDate(revMnthRnge[i].STRTDTE) && cdate <= createDate(revMnthRnge[i].ENDDTE)) {
                                    selObj = revMnthRnge[i];
                                    break;
                                }
                            }
                        }
                        if (selObj != null) {
                            $scope.currentDate = new Date(resDate.valueOf());
                            localStorage.setItem('updDate', $scope.currentDate);
                            localStorage.SelectedCalendardate = $scope.currentDate;
                            broadcastService.notifyDateTimeSlider($scope.currentDate);
                            $scope.GetData(isDailyMode, $scope.currentDate);
                        }
                        else {
                            var nextDailyDate = $filter('date') (cdate, "dd-MMM-yyyy");
                            $scope.loadErrorPopup(true, $filter('translate') ('msg_RevenueMonth', {
                                dateVal: nextDailyDate
                            }));
                        }

                    }

                    if (selObj != null) {
                        checkCloseMonth(selObj, CurrDate, monthNames, resDate);
                    }
                });
            }
        }
        else {
            var resDate = new Date($scope.weeklyStartDate.valueOf());
            dayOfWeek = $scope.currentDate.getDay();
            resDate.setDate(resDate.getDate() +7);
            for (var i = 0; i < 7; i++) {
                if (resDate.getDay() == 0)
                    break;
                resDate.setDate(resDate.getDate() -1);
            }
            var weeknextDate = new Date(resDate.valueOf());
            var updDate = $filter('date')(new Date(weeknextDate.getFullYear(), weeknextDate.getMonth(), 1), "yyyy-MM-dd");
            var cweekdate = $filter('date') (weeknextDate, "yyyy-MM-dd");
            var selObj = null;
            cweekdate = createDate(cweekdate);
            selObj = $rootScope.chekRevDateInLocalStorage(cweekdate, $filter('translate') ('msg_invalidSession'), false);// chekRevDateInLocalStorage(cweekdate);
            if (selObj != null) {
                $scope.weeklyStartDate = new Date(resDate.valueOf());
                var tempDate = new Date(resDate.valueOf());
                tempDate.setDate(tempDate.getDate() +dayOfWeek);
                $scope.currentDate = new Date(tempDate.valueOf());
                localStorage.setItem('updDate', $scope.weeklyStartDate);
                localStorage.SelectedCalendardate = $scope.currentDate;
                broadcastService.notifyDateTimeSlider($scope.currentDate);
                $scope.GetData(isDailyMode, $scope.weeklyStartDate);

                checkCloseMonth(selObj, CurrDate, monthNames, $scope.currentDate);
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, updDate, function (response) {
                    localStorage.setItem('REV_MON_RANGE', JSON.stringify(response.LOADREVM_OUT_OBJ.REVM_ARR));
                    revMnthRnge = response.LOADREVM_OUT_OBJ.REVM_ARR;
                    if (revMnthRnge != undefined && revMnthRnge != "undefined" && revMnthRnge != null) {

                        for (var i = 0; i < revMnthRnge.length; i++) {
                            if (revMnthRnge[i] != null && revMnthRnge[i]!= undefined && revMnthRnge[i].STRTDTE != undefined) {
                                if (cweekdate >= createDate(revMnthRnge[i].STRTDTE) && cweekdate <= createDate(revMnthRnge[i].ENDDTE)) {
                                    selObj = revMnthRnge[i];
                                    break;
                                }
                            }
                        }
                        if (selObj != null) {
                            $scope.weeklyStartDate = new Date(resDate.valueOf());
                            var tempDate = new Date(resDate.valueOf());
                            tempDate.setDate(tempDate.getDate() +dayOfWeek);
                            $scope.currentDate = new Date(tempDate.valueOf());
                            localStorage.setItem('updDate', $scope.weeklyStartDate);
                            localStorage.SelectedCalendardate = $scope.currentDate;
                            broadcastService.notifyDateTimeSlider($scope.currentDate);
                            $scope.GetData(isDailyMode, $scope.weeklyStartDate);
                        }
                        else {
                            var nextWeeklyDate = $filter('date') (cweekdate, "dd-MMM-yyyy");
                            $scope.loadErrorPopup(true, $filter('translate') ('msg_RevenueMonth', {
                                dateVal: nextWeeklyDate
                            }));
                        }

                        if (selObj != null) {
                            checkCloseMonth(selObj, CurrDate, monthNames, $scope.currentDate);
                        }
                    }
                });
            }
        }
        $rootScope.isPasteClicked = false;
        $rootScope.weeklyMaxTEID =[];
    }
    $scope.copyRecords = function (isDailyMode) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.copyRecords");
        var chkEntries = document.getElementsByName("chkEntries");
        var selectedEntries =[];
        var isSelected = false;
        for (var i = 0; i < chkEntries.length; i++) {
            if (chkEntries[i].checked == true) {
                var obj = JSON.parse(chkEntries[i].value);
                if (isDailyMode) {
                    delete obj.class;
                    delete obj.isOpen;
                    delete obj.rowIndex;
                }
                else {
                    delete obj.data.class;
                    delete obj.data.isOpen;
                    delete obj.data.rowIndex;
                }

                selectedEntries.push(JSON.stringify(obj));
                isSelected = true;
                //break;
            }
        }
        if (isSelected) {
            var isNegativeEntryAllowed = true;
            for (var i = 0; i < selectedEntries.length; i++) {
                var tempSelected = JSON.parse(selectedEntries[i]);
                var tempEntry = JSON.parse(JSON.stringify(tempSelected));
                var weekEntryHours = JSON.parse(JSON.stringify(tempEntry));
                if (!isDailyMode)
                    tempEntry = tempEntry.data;
                if (tempEntry.CEP_REC.CHARBASIS == 'T' || tempEntry.CEP_REC.CHARBASIS == 'S' || tempEntry.CEP_REC.CHARBASIS == 'C') {
                    if (isDailyMode && parseFloat(tempEntry.HRS) < 0) {
                        isNegativeEntryAllowed = false;
                        break;
                    }
                    else if (!isDailyMode && (parseFloat(weekEntryHours.Hrs1) < 0 || parseFloat(weekEntryHours.Hrs2) < 0 || parseFloat(weekEntryHours.Hrs3) < 0 || parseFloat(weekEntryHours.Hrs4) < 0 || parseFloat(weekEntryHours.Hrs5) < 0 || parseFloat(weekEntryHours.Hrs6) < 0 || parseFloat(weekEntryHours.Hrs7) < 0)) {
                        isNegativeEntryAllowed = false;
                        break;
                    }
                }
            }
            if (isNegativeEntryAllowed) {
                $scope.moveEntryToClipBoard(isDailyMode, selectedEntries);
                return true;
            }
            else {
                $(".copyToday").removeClass("active");
                $(".copyWeek").removeClass("active");
                $(".clone").removeClass("active");
                $scope.loadErrorPopup(true, 'You cannot copy a record with negative hours.');
                return false;
            }
        }
        return false;
    }
    $scope.SelectedID = "";
    $scope.selectedTEIDs =[];


    $scope.entryCheckedUnchecked = function (isDailyMode, radTEID) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.entryCheckedUnchecked");
        $scope.afterTecuttOff = false;
        $scope.IsClone = false;
        $scope.IsTodayCopied = false;
        $scope.IsWeekCopied = false;
        var chkEntries = document.getElementsByName("chkEntries");
        var selectedEntries = null;
        var isChecked = false;
        var isCheckedCopy = false;
        var timeSub = "";
        for (var i = 0, j = 0; i < chkEntries.length; i++) {
            if (isDailyMode)
                timeSub = JSON.parse(chkEntries[i].value).TIMSUB.toUpperCase();
            else
                timeSub = JSON.parse(chkEntries[i].value).data.TIMSUB.toUpperCase();
            if (chkEntries[i].checked == true && timeSub == 'N') {
                isChecked = true;
                isCheckedCopy = true;
                break;
            }
            else if (chkEntries[i].checked == true && !isCheckedCopy) {
                isCheckedCopy = true;
            }
        }

        $scope.selectedForDelete = isChecked;
        $scope.IsSelectedForAll = isCheckedCopy;

        checkAfterCuttOff();
        var isSelected = false;
        var selectedEntries = null;
        var selRad = document.getElementById(radTEID);
        if (selRad != null && selRad != undefined && selRad != "undefined") {
            isSelected = true;
            selectedEntries = JSON.parse(selRad.value);
            $scope.SelectedID = radTEID;
            if (isDailyMode) {
                if ($('#' +radTEID).is(":checked"))
                    $("#d" +radTEID).addClass("selected");
                else
                    $("#d" +radTEID).removeClass("selected");
            }
            else {
                if ($('#' +radTEID).is(":checked"))
                    $("#week" +radTEID.substring(1)).addClass("selected");
                else
                    $("#week" +radTEID.substring(1)).removeClass("selected");

                radTEID = radTEID.substring(1);
            }
            $scope.selectedTEIDs.push(radTEID);
        }
        else {
            isSelected = false;
            $timeout(function () {
                var chkEntries = document.getElementsByName("chkEntries");
                var selectedEntries = null;
                for (var i = 0, j = 0; i < chkEntries.length; i++) {
                    chkEntries[i].checked = false;
                }
                $scope.SelectedID = "";
            }, 100);
        }

        $(".dots").css("display", "none");
        $(".bottom-footer").css("display", "none");
        $(".sub_popup-action .show-dayWeek").css("display", "block");
        $(".content").css("padding-bottom", "84px");
        $(".sub_popup-action .cancel-cross").css("display", "block");
        $(".sub_popup-action .dots").css("display", "none");
        $(".expand-footer").css("display", "none");
        $(".sub_popup-action .cancel-cross-left").css("display", "none");
        $rootScope.isPanelOpen = true;

        $(".sub_popup-action .cancel-cross").click(function () {
            $rootScope.isPanelOpen = false;
            $(".sub_popup-action .show-dayWeek").css("display", "none");
            $(".content").css("padding-bottom", "60px");
            $(".task-container.selected").removeClass("selected");
            $(".sub_popup-action .dots").css("display", "block");
            $("input:checkbox[class^=checked]").each(function (i) {
                this.checked = false;
            });
            $scope.IsSelectedForAll = false;
            $scope.selectedForDelete = false;
            $(".bottom-footer").css("display", "block");
            $(".sub_popup-action .cancel-cross").css("display", "none");
            $("#dv_sub_popup").remove();
            $(".sub_popup-action").append("<div id='dv_sub_popup' class='sub_popup-action-inner' onclick='$(\".sub_popup-action .show-dayWeek\").css(\"display\", \"block\");$(\".sub_popup-action .cancel-cross\").css(\"display\", \"block\");$(\".sub_popup-action .dots\").css(\"display\", \"none\");'></div>")
        });
        $(".sub_popup-action .more").click(function () {
            $(".show-dayWeek").css("display", "none");
            $(".expand-footer").css("display", "block");
            $(".cancel-cross").css("display", "none");
            $(".sub_popup-action .cancel-cross-left").css("display", "block");
        });
        $(".sub_popup-action .cancel-cross-left").click(function () {
            $(".show-dayWeek").css("display", "block");
            $(".expand-footer").css("display", "none");
            $(".cancel-cross").css("display", "block");
            $(".sub_popup-action .cancel-cross-left").css("display", "none");
        });
    }
    var chekCopyTodayWeekDate = function () {
        var currDate = new Date(); var tecutoff = null;
        var currentTimezone = currDate.getTimezoneOffset();
        currDate.setMinutes(currDate.getMinutes() -(currentTimezone));
        var revObj = $rootScope.chekRevDateInLocalStorage(currDate, $filter('translate') ('msg_invalidSession'), false);
        if (revObj != null) {
            var tecutoff = revObj.TECUTTOFF;
        }
        return tecutoff;
    }

    checkAfterCuttOff = function () {
        //var teCuttoff = new Date(chekCopyTodayWeekDate());
        var teCuttoff = createDateTime(chekCopyTodayWeekDate());
        var chkcurrDate = new Date();
        if ($scope.checkRevMonthFlag || ($scope.isDailyMode && teCuttoff > chkcurrDate) || (!$scope.isDailyMode && ((teCuttoff > chkcurrDate && chkcurrDate.getDay() == 6) || chkcurrDate.getDay() != 6))) {
            $scope.afterTecuttOff = true;
        }

        //var todaydate = chkcurrDate.setHours(0, 0, 0, 0);
        if (teCuttoff > chkcurrDate || teCuttoff.setHours(0, 0, 0, 0) != chkcurrDate.setHours(0, 0, 0, 0)) {
            $scope.afterTecuttOff = true;
        }
        else {
            $scope.afterTecuttOff = false;
        }
        var tecuttoffdateOnly = teCuttoff.setHours(0, 0, 0, 0);
        if ($scope.currentDate > tecuttoffdateOnly)
            $scope.afterTecuttOffWeek = true;
        else
            $scope.afterTecuttOffWeek = false;
    }
    var isInvalidFutureEntry = function (time_Obj) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.var.isInvalidFutureEntry");
        var isFutureEntry = futureEntryService.futureEntry(time_Obj);
        return isFutureEntry;
    }
    $scope.checkPasteMulCnt = 0;
    $scope.pasteRecords = function (isDailyMode, pasteMultipleCount) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.pasteRecords");
        var mobileInitialDetail = JSON.parse(localStorage.getItem('Initial_Data'))
        var billingDate = mobileInitialDetail.EMPL_REC.BRSTDTE;
        var parts = billingDate.split("-");
        var day = parts[2].split(' ');
        var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
        var pasteContinueCount = 0;
        $scope.highestWeekRecordNumber = 0; $scope.totalDailyPastedHours = 0; $scope.totalWeeklyPastedHours = [0, 0, 0, 0, 0, 0, 0];
        $scope.exceedHrs = []; $rootScope.totalPastedHrs = 0;
        $rootScope.lastExpandAllText = $scope.expandAllText;
        $rootScope.lastExpandClass = $scope.expandClass;
        $rootScope.cntrExpandCollapse = 2;
        if (!$scope.IspasteAdvance)
            $scope.renewalMessage =[];
        var messageText = "";
        var messageSuccessText = "";
        if ($scope.IsTodayCopied || $scope.IsWeekCopied) {
            messageText = "Copy";
            messageSuccessText = "Copied";
        }
        else if ($scope.IsClone) {
            messageText = "Clone";
            messageSuccessText = "Cloned";
        }
        else {
            messageText = "Paste";
            messageSuccessText = "Pasted";
        }
        $scope.checkDbPartition = 0;
        $(".copy").removeClass("active");
        var teCuttoff = createDateTime(chekCopyTodayWeekDate());
        var chkcurrDate = new Date();
        if (($scope.checkRevMonthFlag || ($scope.IsTodayCopied && isDailyMode && teCuttoff > chkcurrDate) || ($scope.IsWeekCopied && !isDailyMode && ((teCuttoff > chkcurrDate && chkcurrDate.getDay() == 6) || chkcurrDate.getDay() != 6)) || $scope.IspasteAdvance) && ((($scope.afterTecuttOff || (!isDailyMode && ($scope.afterTecuttOff || $scope.afterTecuttOffWeek))) && ($scope.IsTodayCopied || $scope.IsWeekCopied)) || (!$scope.IsTodayCopied && !$scope.IsWeekCopied))) {
            if ((!$scope.IsTodayCopied && !$scope.IsWeekCopied && !$scope.IspasteAdvance && !$scope.IsClone) && ((localStorage.getItem("DailyDataCopied") !== null && isDailyMode) || (localStorage.getItem("WeeklyDataCopied") !== null && !isDailyMode)))
                $(".paste").addClass("active");

            $scope.round = false;
            $("input:checkbox[class^=checked]").each(function (i) {
                this.checked = false;
            });
            $scope.IsSelectedForAll = false;
            $(".task-container.selected").removeClass("selected");

            var chkEntriesChecked = document.getElementsByName("chkEntries");
            for (var i = 0, j = 0; i < chkEntriesChecked.length; i++) {
                chkEntriesChecked[i].checked = false;
            }
            var count = 0;
            var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, true);
            if (jsonSFromloginDetail == undefined || jsonSFromloginDetail == null) {
                $(".paste").removeClass("active");
                $(".copyToday").removeClass("active");
                $(".copyWeek").removeClass("active");
                $(".clone").removeClass("active");
                return;
            }
            //revenue start and end date
            var revSDte = new Date(jsonSFromloginDetail.REVM_REC.STRTDTE.split(" ")[0]);
            var revEDte = new Date(jsonSFromloginDetail.REVM_REC.ENDDTE.split(" ")[0]);
            revSDte = new Date(revSDte.getTime() +(revSDte.getTimezoneOffset() * 60 * 1000));
            revEDte = new Date(revEDte.getTime() +(revEDte.getTimezoneOffset() * 60 * 1000));
            revSDte.setHours(0, 0, 0, 0);
            if (isDailyMode) {
                var dailyDate = null;
                if ($scope.IsTodayCopied) {
                    var tempTodayDate = new Date();
                    var currentTimezone = tempTodayDate.getTimezoneOffset();
                    tempTodayDate.setMinutes(tempTodayDate.getMinutes() -(currentTimezone));
                    dailyDate = tempTodayDate;

                }
                else if ($scope.IspasteAdvance) {
                    dailyDate = $scope.pasteAdvanceDate;
                }
                else {
                    dailyDate = $scope.currentDate.valueOf();
                }

                if (localStorage.getItem("DailyDataCopied") !== null) {
                    var copiedRecords = JSON.parse(localStorage.getItem("copiedRecordsDaily"));
                    for (var i = 0; i < copiedRecords.length; i++) {
                        if ((dailyDate < new Date(nstartDate.valueOf())) && !$scope.isPriorToBillingDate) {
                            var show = nstartDate.toString().split(' ');
                            var date = show[2] + '-' + show[1] + '-' + show[3];
                            $scope.loadErrorPopup(true, $filter('translate')('msg_TimePriorToBillingStartDate', { dateVal: date }));
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                            if ($scope.IspasteAdvance)
                                $scope.isPriorToBillingDate = true;
                            return false;
                        }
                        copiedRecords[i].DTE = $filter('date')(new Date(dailyDate), 'yyyy-MM-dd HH:mm:ss');
                        var dateToCompare = new Date(dailyDate);
                        var tempGMTTodayDate = new Date();
                        tempGMTTodayDate.setHours(0, 0, 0, 0);
                        var tempTodayDate = new Date();
                        var currentTimezone = tempTodayDate.getTimezoneOffset();
                        tempTodayDate.setMinutes(tempTodayDate.getMinutes() -(currentTimezone));
                        tempTodayDate.setHours(0, 0, 0, 0);
                        //if ((dateToCompare.setHours(0, 0, 0, 0) > revEDte.setHours(0, 0, 0, 0) && copiedRecords[i].CEP_REC.CHARBASIS != "N") || (tempGMTTodayDate < revSDte && tempTodayDate <= tempGMTTodayDate && copiedRecords[i].CEP_REC.CHARBASIS != "N"))
                        //    copiedRecords[i].HRS = 0;
                        if (isInvalidFutureEntry(copiedRecords[i]))
                            copiedRecords[i].HRS = 0;
                    }
                    if (copiedRecords.length == 1 && pasteMultipleCount == 1) {
                        var isValid = $scope.validateEntries(isDailyMode, copiedRecords[0], null, dailyDate, false);
                        if (!isValid) {
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                        }

                        var entryToValidate = copiedRecords[0];
                        projectComponetService.searchPRCCode($scope.loginDetail.SESKEY, entryToValidate.CEP_REC.CATID, entryToValidate.CEP_REC.PRJID).then(function (response) {
                            var isValidPT = true;
                            if(parseInt(response.LOADPCOMTSK_OUT_OBJ.RETCD) == 0) {
                                var compFound = false;
                                var taskFound = false;
                                var scopeFound = false;
                                var componentArray = null;
                                var taskArray = null;
                                var scopeArray = null;

                                componentArray = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM;

                                for (var i = 0; i < componentArray.length; i++) {
                                    if (componentArray[i].CMPTID == entryToValidate.CMPTID) {
                                        if (componentArray[i].ACTIVE != 'Y') {
                                            compFound = true;
                                            break;
                                        }
                                        if ((typeof componentArray[i].ARR_PTSK.PTSK_OBJ != 'undefined') && componentArray[i].ARR_PTSK.PTSK_OBJ != undefined && componentArray[i].ARR_PTSK.PTSK_OBJ != null) {
                                            if (componentArray[i].ARR_PTSK.PTSK_OBJ.TSKID == entryToValidate.TSKID && componentArray[i].ARR_PTSK.PTSK_OBJ.ACTIVE != 'Y') {
                                                taskFound = true
                                                break;
                                            }
                                        }
                                        else {
                                            for (var j = 0; j < componentArray[i].ARR_PTSK.length; j++) {
                                                if (componentArray[i].ARR_PTSK[j].TSKID == entryToValidate.TSKID && componentArray[i].ARR_PTSK[j].ACTIVE != 'Y') {
                                                    taskFound = true
                                                    break;
                                                }
                                            }
                                        }

                                    }
                                    if (taskFound)
                                        break;
                                }

                                if (response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP != undefined && response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP != null) {
                                    for (var i = 0; i < response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP.length; i++) {
                                        if (response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP[i].SCOPID == entryToValidate.SCOID && response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP[i].ACTIVE != 'Y') {
                                            scopeFound = true;
                                            break;
                                        }
                                    }
                                }
                                if ((compFound) || (taskFound)) {
                                    if (isValid) {
                                        $(".copy").removeClass("active");
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                        $scope.loadErrorPopup(true, $filter('translate') ('msg_invalidProjectComponent'));
                                        isValidPT = false;
                                    }
                                }
                                else if (scopeFound) {
                                    if (isValid) {
                                        $(".copy").removeClass("active");
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                        $scope.loadErrorPopup(true, $scope.prjScopeNoValidMsg);
                                        isValidPT = false;
                                    }
                                }


                            }
                            if (isValid && isValidPT) {
                                $scope.selectedRecordArray =[];
                                $scope.highestRecordNum = null;
                                $scope.highestRecordNumTemp = null;
                                $scope.pasteSave(copiedRecords, false, pasteMultipleCount, 0, 0);
                            }
                        });
                    }
                    else {
                        $scope.selectedRecordArray =[];
                        $scope.highestRecordNum = null;
                        $scope.highestRecordNumTemp = null;
                        var multipleFilteredCopiedRecords = []; $scope.totalDailyPastedHours = 0;
                        $scope.exceedHrs = [];
                        var failedCount = 0;
                        var z = 0;
                        for (var i = 0; i < copiedRecords.length; i++) {
                            if (!$scope.validateEntries(isDailyMode, copiedRecords[i], null, dailyDate, true))
                                failedCount++;
                            else {
                                multipleFilteredCopiedRecords[z]= JSON.parse(JSON.stringify(copiedRecords[i]));
                                z++;
                            }
                        }
                        if (failedCount > 0 && multipleFilteredCopiedRecords.length < 1) {
                            messages = (pasteMultipleCount * failedCount) + ' ' + messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                            if ($scope.checkPasteMulCnt == 0) {
                                $scope.loadErrorPopup(false, messages);
                            }
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                        }
                        else if (multipleFilteredCopiedRecords.length > 0)
                            $scope.pasteSave(multipleFilteredCopiedRecords, true, pasteMultipleCount, failedCount, 0);
                    }
                    $scope.SelectedID = "";
                }
            }
            else {
                var weekstartdate = $scope.weeklyStartDate.valueOf();
                if ($scope.IsWeekCopied == true) {
                    var tempTodayDate = new Date();
                    var currentTimezone = tempTodayDate.getTimezoneOffset();
                    tempTodayDate.setMinutes(tempTodayDate.getMinutes() -(currentTimezone));
                    weekstartdate = tempTodayDate;
                    weekstartdate.setDate(weekstartdate.getDate() +1);
                    weekstartdate.setDate(weekstartdate.getDate() -7);


                    for (var i = 0; i < 7; i++) {
                        if (weekstartdate.getDay() == 0)
                            break;
                        weekstartdate.setDate(weekstartdate.getDate() +1);
                    }
                }
                var filteredCopiedRecords = []; var timeEntry = null; $rootScope.selRecordNumber = 1; var revenueStartDate = angular.copy(revSDte);
                if (localStorage.getItem("WeeklyDataCopied") !== null) {
                    var copiedRecords = JSON.parse(localStorage.getItem("copiedRecordsWeekly"));
                    var highestRow = 0;
                    var highestRowTemp = 0;
                    for (var i = 0, j = 0; i < copiedRecords.length; i++) {
                        if (copiedRecords[i].selectedRecordNumber > highestRowTemp) {
                            highestRowTemp = copiedRecords[i].selectedRecordNumber;
                            highestRow++;
                        }
                        var sendDate = new Date(weekstartdate);
                        sendDate = new Date(sendDate.setDate(sendDate.getDate() +copiedRecords[i].DTECount));
                        var tempGMTTodayDate = new Date();
                        tempGMTTodayDate.setHours(0, 0, 0, 0);
                        var tempTodayDate = new Date();
                        var currentTimezone = tempTodayDate.getTimezoneOffset();
                        tempTodayDate.setMinutes(tempTodayDate.getMinutes() -(currentTimezone));
                        tempTodayDate.setHours(0, 0, 0, 0);
                        copiedRecords[i].DTE = $filter('date') (new Date(sendDate.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                        //if ((sendDate.setHours(0, 0, 0, 0) > revEDte.setHours(0, 0, 0, 0) && copiedRecords[i].CEP_REC.CHARBASIS != "N") || (tempGMTTodayDate < revSDte && tempTodayDate <= tempGMTTodayDate && copiedRecords[i].CEP_REC.CHARBASIS != "N" && sendDate.setHours(0, 0, 0, 0) >= revSDte.setHours(0, 0, 0, 0)))
                        //    copiedRecords[i].HRS = 0;
                        revenueStartDate.setHours(sendDate.getHours(), sendDate.getMinutes(), sendDate.getSeconds(), sendDate.getMilliseconds());
                        timeEntry = timeEntryNextRevenueService.timeEntryToNextRevenue(sendDate, revSDte, copiedRecords, i, revenueStartDate);
                        if (timeEntry != null) {
                            delete timeEntry.DTECount;
                            filteredCopiedRecords[j] = timeEntry;
                            j++;
                        }

                        if (isInvalidFutureEntry(copiedRecords[i]))
                            copiedRecords[i].HRS = 0;
                        if (sendDate.setHours(0, 0, 0, 0) < revSDte.setHours(0, 0, 0, 0)) {
                            pasteContinueCount++;
                            continue;
                        }
                        if (sendDate < new Date(nstartDate.valueOf())) {
                            var show = nstartDate.toString().split(' ');
                            var date = show[2] + '-' + show[1] + '-' + show[3];
                            $scope.loadErrorPopup(true, $filter('translate')('msg_TimePriorToBillingStartDate', { dateVal: date }));
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                            return false;
                        }
                        delete copiedRecords[i].DTECount;
                        filteredCopiedRecords[j]= copiedRecords[i];
                        j++;
                    }
                    count = filteredCopiedRecords.length;
                    if (filteredCopiedRecords.length > 0 && highestRow == 1) {
                        var isValid = $scope.validateEntries(isDailyMode, filteredCopiedRecords[0], filteredCopiedRecords, weekstartdate, false);
                        var entryToValidate = filteredCopiedRecords[0];
                        projectComponetService.searchPRCCode($scope.loginDetail.SESKEY, entryToValidate.CEP_REC.CATID, entryToValidate.CEP_REC.PRJID).then(function (response) {
                            var isValidPT = true;
                            if(parseInt(response.LOADPCOMTSK_OUT_OBJ.RETCD) == 0) {
                                var compFound = false;
                                var taskFound = false;
                                var scopeFound = false;
                                var componentArray = null;
                                var taskArray = null;
                                var scopeArray = null;

                                componentArray = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM;

                                for (var i = 0; i < componentArray.length; i++) {
                                    if (componentArray[i].CMPTID == entryToValidate.CMPTID) {
                                        if (componentArray[i].ACTIVE != 'Y') {
                                            compFound = true;
                                            break;
                                        }
                                        if ((typeof componentArray[i].ARR_PTSK.PTSK_OBJ != 'undefined') && componentArray[i].ARR_PTSK.PTSK_OBJ != undefined && componentArray[i].ARR_PTSK.PTSK_OBJ != null) {
                                            if (componentArray[i].ARR_PTSK.PTSK_OBJ.TSKID == entryToValidate.TSKID && componentArray[i].ARR_PTSK.PTSK_OBJ.ACTIVE != 'Y') {
                                                taskFound = true
                                                break;
                                            }
                                        }
                                        else {
                                            for (var j = 0; j < componentArray[i].ARR_PTSK.length; j++) {
                                                if (componentArray[i].ARR_PTSK[j].TSKID == entryToValidate.TSKID && componentArray[i].ARR_PTSK[j].ACTIVE != 'Y') {
                                                    taskFound = true
                                                    break;
                                                }
                                            }
                                        }

                                    }
                                    if (taskFound)
                                        break;
                                }

                                if (response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP != undefined && response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP != null) {
                                    for (var i = 0; i < response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP.length; i++) {
                                        if (response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP[i].SCOPID == entryToValidate.SCOID && response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PSCOP[i].ACTIVE != 'Y') {
                                            scopeFound = true;
                                            break;
                                        }
                                    }
                                }
                                if ((compFound) || (taskFound)) {
                                    if (isValid) {
                                        $(".copy").removeClass("active");
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                        $scope.loadErrorPopup(true, $filter('translate') ('msg_invalidProjectComponent'));
                                        isValidPT = false;
                                    }
                                }
                                else if (scopeFound) {
                                    if (isValid) {
                                        $(".copy").removeClass("active");
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                        $scope.loadErrorPopup(true, $scope.prjScopeNoValidMsg);
                                        isValidPT = false;
                                    }
                                }


                            }
                            if (isValid && isValidPT) {
                                $scope.selectedRecordArray =[];
                                $scope.highestRecordNum = null;
                                $scope.highestRecordNumTemp = null;
                                var multipleFilteredCopiedRecords =[];
                                var selectedRecNumber = 0;
                                var failedCount = 0;
                                var isValidMultipleEntry = true;
                                var z = 0; $scope.totalWeeklyPastedHours = [0, 0, 0, 0, 0, 0, 0];
                                $scope.exceedHrs = [];
                                for (var i = 0; i < filteredCopiedRecords.length; i++) {
                                    if (JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber != selectedRecNumber) {
                                        var tempRecNum = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                        var tempFilteredCopiedRecords =[];
                                        var k = 0;
                                        for (var j = 0; j < filteredCopiedRecords.length; j++) {
                                            if (tempRecNum == JSON.parse(JSON.stringify(filteredCopiedRecords[j])).selectedRecordNumber) {
                                                tempFilteredCopiedRecords[k]= JSON.parse(JSON.stringify(filteredCopiedRecords[j]));
                                                k++;
                                            }
                                        }
                                        if (!$scope.validateEntries(isDailyMode, filteredCopiedRecords[i], tempFilteredCopiedRecords, weekstartdate, true)) {
                                            failedCount = failedCount +tempFilteredCopiedRecords.length;
                                            isValidMultipleEntry = false;
                                        }
                                        else
                                            isValidMultipleEntry = true;
                                        selectedRecNumber = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                    }
                                    if (isValidMultipleEntry) {
                                        multipleFilteredCopiedRecords[z]= JSON.parse(JSON.stringify(filteredCopiedRecords[i]));
                                        z++;
                                    }
                                }
                                if (failedCount > 0 && multipleFilteredCopiedRecords.length < 1) {
                                    messages = (pasteMultipleCount * failedCount) + ' ' +messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                                    if ($scope.checkPasteMulCnt == 0)
                                        $scope.loadErrorPopup(false, messages);
                                    $(".paste").removeClass("active");
                                    $(".copyToday").removeClass("active");
                                    $(".copyWeek").removeClass("active");
                                    $(".clone").removeClass("active");
                                }
                                else if (multipleFilteredCopiedRecords.length > 0)
                                    $scope.pasteSave(multipleFilteredCopiedRecords, false, pasteMultipleCount, failedCount, pasteContinueCount);
                            }
                            else {
                                $(".paste").removeClass("active");
                                $(".copyToday").removeClass("active");
                                $(".copyWeek").removeClass("active");
                                $(".clone").removeClass("active");
                            }
                        });
                        $scope.SelectedID = "";
                    }
                    else if (filteredCopiedRecords.length > 0 && highestRow > 1) {
                        $scope.selectedRecordArray =[];
                        $scope.highestRecordNum = null;
                        $scope.highestRecordNumTemp = null;
                        var multipleFilteredCopiedRecords =[];
                        var selectedRecNumber = 0;
                        var failedCount = 0;
                        var isValidMultipleEntry = true;
                        var z = 0; $scope.totalDailyPastedHours = 0; $scope.totalWeeklyPastedHours = [0, 0, 0, 0, 0, 0, 0];
                        $scope.exceedHrs = [];
                        for (var i = 0; i < filteredCopiedRecords.length; i++) {
                            if (JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber != selectedRecNumber) {
                                var tempRecNum = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                var tempFilteredCopiedRecords =[];
                                var k = 0;
                                for (var j = 0; j < filteredCopiedRecords.length; j++) {
                                    if (tempRecNum == JSON.parse(JSON.stringify(filteredCopiedRecords[j])).selectedRecordNumber) {
                                        tempFilteredCopiedRecords[k]= JSON.parse(JSON.stringify(filteredCopiedRecords[j]));
                                        k++;
                                    }
                                }
                                if (!$scope.validateEntries(isDailyMode, filteredCopiedRecords[i], tempFilteredCopiedRecords, weekstartdate, true)) {
                                    failedCount = failedCount +tempFilteredCopiedRecords.length;
                                    isValidMultipleEntry = false;
                                }
                                else
                                    isValidMultipleEntry = true;
                                selectedRecNumber = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                            }
                            if (isValidMultipleEntry) {
                                multipleFilteredCopiedRecords[z]= JSON.parse(JSON.stringify(filteredCopiedRecords[i]));
                                z++;
                            }
                        }
                        if (failedCount > 0 && multipleFilteredCopiedRecords.length < 1) {
                            messages = ((pasteMultipleCount * failedCount) + pasteContinueCount) + ' ' +messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                            if ($scope.checkPasteMulCnt == 0)
                                $scope.loadErrorPopup(false, messages);
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                        }
                        else if (multipleFilteredCopiedRecords.length > 0)
                            $scope.pasteSave(multipleFilteredCopiedRecords, true, pasteMultipleCount, failedCount, pasteContinueCount);
                    }
                    else {
                        if (pasteContinueCount > 0) {
                            var continueMessage = pasteContinueCount + ' ' + messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                            $scope.loadErrorPopup(false, continueMessage);
                        }
                        $(".paste").removeClass("active");
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                    }
                }

            }

        }
        else {
            $(".paste").removeClass("active");
            $(".copyToday").removeClass("active");
            $(".copyWeek").removeClass("active");
            $(".clone").removeClass("active");
        }
    }

    $scope.moveEntryToClipBoard = function (isDailyMode, selectedEntries) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.moveEntryToClipBoard");
        if (isDailyMode) {
            var jsonEntry =[];
            for (var i = 0; i < selectedEntries.length; i++) {
                jsonEntry[i]= JSON.parse(selectedEntries[i]);
                jsonEntry[i].TEID = 0;
                jsonEntry[i].TIMSUB = 'N';
            }
            localStorage.setItem("copiedRecordsDaily", JSON.stringify(jsonEntry));
            localStorage.setItem("DailyDataCopied", true);
            $scope.DailyDataCopied = true;
        }
        else {
            var jsonFinalEntries =[];
            var jsonEntriesString =[];
            var i = 0;
            for (var k = 0; k < selectedEntries.length; k++) {
                var jsonRawEntries = JSON.parse(selectedEntries[k]);
                if (jsonRawEntries.Hrs1 != null) {

                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 0;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs1;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }

                if (jsonRawEntries.Hrs2 != null) {
                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 1;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs2;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }

                if (jsonRawEntries.Hrs3 != null) {
                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 2;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs3;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }

                if (jsonRawEntries.Hrs4 != null) {
                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 3;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs4;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }

                if (jsonRawEntries.Hrs5 != null) {
                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 4;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs5;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }

                if (jsonRawEntries.Hrs6 != null) {
                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 5;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs6;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }

                if (jsonRawEntries.Hrs7 != null) {
                    jsonRawEntries.data.TEID = 0;
                    jsonRawEntries.data.DTECount = 6;
                    jsonRawEntries.data.selectedRecordNumber = k +1;
                    jsonRawEntries.data.TIMSUB = 'N';
                    jsonRawEntries.data.HRS = jsonRawEntries.Hrs7;
                    jsonEntriesString[i]= JSON.parse(JSON.stringify(jsonRawEntries.data));
                    i++;
                }
            }
            var jsonEntries = JSON.parse(JSON.stringify(jsonEntriesString));
            localStorage.setItem("copiedRecordsWeekly", JSON.stringify(jsonEntries));
            localStorage.setItem("WeeklyDataCopied", true);
            $scope.WeeklyDataCopied = true;
        }
        $(".copy").addClass("active");
        $timeout(function () { $(".copy").removeClass("active");
        }, 400);
    }
    var get24HourMessageWithPaste = function (message) {
        var msg =[]; var splitmsg=[];
        if ($scope.exceedHrs.length > 0) {
            splitmsg = message.split(' ');
            message ='Pasted '+splitmsg[1]+' entry/ies successfully. Note, you have entered more than 24 hours on one or more days.'
            msg.push(message);
        }
        else
            msg.push(message);
        return msg;
    }
    $scope.pasteSave = function (json, isErrorSuppress, pasteMultipleDateCount, failedCount, pasteContinueFailed) {
        var recordNum = 1;
        var tempFailedCount = failedCount;
        if ($scope.IspasteAdvance && failedCount > 0)
            tempFailedCount = failedCount * pasteMultipleDateCount;
        if ($scope.highestRecordNum == null)
            $scope.highestRecordNum = 0;
        if ($scope.highestRecordNumTemp == null)
            $scope.highestRecordNumTemp = 0;

        if (parseFloat(json.length) > parseFloat($scope.highestRecordNum) || (json.length == 0 && tempFailedCount > 0))
            $scope.highestRecordNum = json.length;

        //if (!$scope.isDailyMode) {
        //    recordNum = json[0].selectedRecordNumber;
        //}
        //else {
        recordNum = json.length;
        //}
        if (json.length > 0)
            delete json[0].selectedRecordNumber;
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.pasteSave");
        var messageText = "";
        var messageSuccessText = "";
        messageText = "Paste";
        messageSuccessText = "Pasted";
        if ($scope.IsTodayCopied || $scope.IsWeekCopied || $scope.IsClone) {
            $scope.pasteMultipleCount = 0;
        }
        else {
            if (!$scope.IspasteAdvance)
                $scope.pasteMultipleCount = 0;
        }
        cepService.saveTimeSheet($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify(json[0]), '').then(function (response) {
            if(parseInt(response.SAVTIM_OUT_OBJ.RETCD) == 0) {
                json.splice(0, 1);
                if (json.length > 0) {
                    $scope.pasteSave(json, isErrorSuppress, pasteMultipleDateCount, failedCount, pasteContinueFailed);
                }
                if (json.length == 0 && $scope.pasteMultipleCount != undefined && $scope.pasteMultipleCount > 0) {
                    $scope.pasteMultipleCount--;
                }
                if (json.length == 0 && ($scope.pasteMultipleCount == undefined || $scope.pasteMultipleCount == 0)) {
                    var messages = "";
                    var successCnt = (($scope.highestRecordNum + failedCount) -($scope.selectedRecordArray != undefined ? $scope.selectedRecordArray.length : 0)) * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount: 1);
                    successCnt = successCnt -$scope.checkDbPartition;
                    successCnt = successCnt -tempFailedCount;
                    if (successCnt > 0)
                        messages += messageSuccessText + ' ' + successCnt +(successCnt > 1 ? ' entries' : ' entry') + ' successfully.';
                    var failedCnt = $scope.selectedRecordArray.length * pasteMultipleDateCount;
                    failedCnt = failedCnt +$scope.checkDbPartition;
                    failedCnt = failedCnt +tempFailedCount;
                    if (messages != "")
                        messages += "<br/>";
                    failedCnt = failedCnt + pasteContinueFailed;
                    if (failedCnt > 0)
                        messages += failedCnt + ' ' + messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                    // }
                    $scope.loadErrorPopup(false, get24HourMessageWithPaste(messages));

                    if (!$scope.isDailyMode) {
                        $rootScope.isPasteClicked = true;
                        $rootScope.weekStateCurrentDate = $filter('date') ($scope.currentDate, "yyyy-MM-dd");
                        $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                    }
                    else
                        $scope.GetData($scope.isDailyMode, $scope.currentDate);

                    $(".paste").removeClass("active");
                    $(".copyToday").removeClass("active");
                    $(".copyWeek").removeClass("active");
                    $(".clone").removeClass("active");
                }
            }
            else {
                if (json.length == 0 && $scope.pasteMultipleCount != undefined && $scope.pasteMultipleCount > 0) {
                    $scope.pasteMultipleCount--;
                }
                if (json.length == 0 && ($scope.pasteMultipleCount == undefined || $scope.pasteMultipleCount == 0)) {
                    var messages = "";
                    var successCnt = (($scope.highestRecordNum + failedCount) -($scope.selectedRecordArray != undefined ? $scope.selectedRecordArray.length : 0)) * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount: 1);
                    successCnt = successCnt -tempFailedCount;
                    if (successCnt > 0)
                        messages += messageSuccessText + ' ' + successCnt +(successCnt > 1 ? ' entries' : ' entry') + ' successfully.';
                    var failedCnt = tempFailedCount;
                    if (messages != "")
                        messages += "<br/>";
                    failedCnt = failedCnt + pasteContinueFailed;
                    if (failedCnt > 0)
                        messages += failedCnt + ' ' + messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                    // }
                    $scope.loadErrorPopup(false, get24HourMessageWithPaste(messages));

                    if (!$scope.isDailyMode) {
                        $rootScope.isPasteClicked = true;
                        $rootScope.weekStateCurrentDate = $filter('date') ($scope.currentDate, "yyyy-MM-dd");
                        $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                    }
                    else
                        $scope.GetData($scope.isDailyMode, $scope.currentDate);
                    $(".paste").removeClass("active");
                    $(".copyToday").removeClass("active");
                    $(".copyWeek").removeClass("active");
                    $(".clone").removeClass("active");
                }
                if (!isErrorSuppress) {
                    if (!chekForDBPartitionError(response.SAVTIM_OUT_OBJ.ERRMSG, json)) {
                        $scope.loadErrorPopup(true, response.SAVTIM_OUT_OBJ.ERRMSG);
                        $(".paste").removeClass("active");
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                    }
                }
                else if (isErrorSuppress) {
                    //if ($scope.IspasteAdvance && chekForDBPartitionErrorPasteAdvance(response.SAVTIM_OUT_OBJ.ERRMSG, json)) {
                    if (chekForDBPartitionErrorPasteAdvance(response.SAVTIM_OUT_OBJ.ERRMSG, json)) {
                        //if ($scope.isDailyMode)
                        $scope.checkDbPartition = $scope.checkDbPartition +1;
                        //else {
                        //    if ($scope.highestRecordNum != $scope.highestWeekRecordNumber) {
                        //        $scope.checkDbPartition = $scope.checkDbPartition + 1;
                        //        $scope.highestWeekRecordNumber = $scope.highestRecordNum;
                        //    }
                        //}
                    }
                    else {
                        //find index of recordnum 
                        var index = $scope.selectedRecordArray.indexOf(recordNum)
                        if (index == '-1') {
                            $scope.selectedRecordArray.push(recordNum);
                        }
                    }
                    json.splice(0, 1);
                    if (json.length > 0) {
                        $scope.pasteSave(json, isErrorSuppress, pasteMultipleDateCount, failedCount, pasteContinueFailed);
                    }
                    if (json.length == 0 && $scope.pasteMultipleCount != undefined && $scope.pasteMultipleCount > 0) {
                        $scope.pasteMultipleCount--;
                    }
                    if (json.length == 0 && $scope.round == false && $scope.highestRecordNum != 0 && ($scope.pasteMultipleCount == undefined || $scope.pasteMultipleCount == 0)) {
                        $scope.round = true;
                        var failedMsg = "";
                        var successCnt = (($scope.highestRecordNum + failedCount) -($scope.selectedRecordArray != undefined ? $scope.selectedRecordArray.length : 0)) * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount: 1);
                        //if ($scope.checkDbPartition > 0 && $scope.IspasteAdvance)
                        successCnt = successCnt -$scope.checkDbPartition;
                        successCnt = successCnt -tempFailedCount;
                        if (successCnt > 0)
                            failedMsg += messageSuccessText + ' ' + successCnt +(successCnt > 1 ? ' entries' : ' entry') + ' successfully.';
                        if ($scope.selectedRecordArray != undefined && $scope.selectedRecordArray.length > 0 || $scope.checkDbPartition > 0) {
                            var failedCnt = $scope.selectedRecordArray.length * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount: 1);
                            //if ($scope.checkDbPartition > 0 && $scope.IspasteAdvance)
                            failedCnt = failedCnt +$scope.checkDbPartition;
                            failedCnt = failedCnt +tempFailedCount;
                            if (failedMsg != "")
                                failedMsg += "<br/>";
                            failedCnt = failedCnt + pasteContinueFailed;
                            if (failedCnt > 0)
                                failedMsg += failedCnt + ' ' + messageText + ' unsuccessful – record(s) no longer valid for new time entry.';
                            $scope.loadErrorPopup(false, failedMsg);
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                        }
                        if (!$scope.isDailyMode) {
                            $rootScope.isPasteClicked = true;
                            $rootScope.weekStateCurrentDate = $filter('date') ($scope.currentDate, "yyyy-MM-dd");
                            $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                        }
                        else {
                            $scope.GetData($scope.isDailyMode, $scope.currentDate);
                        }
                    }

                }
            }
        });
    }
    var chekForDBPartitionError = function (errMsg, json) {
        var result = false;
        $rootScope.errorLogMethod("DailyTimeGridCtrl.chekForDBPartitionError");
        if (errMsg != null && errMsg != '') {
            errMsg = errMsg.toLowerCase();
            var index = (errMsg.indexOf("database partition"));

            if (index > 0) {
                var dates = '';
                for (var i = 0; i < json.length; i++) {
                    var jsonData = json[i];
                    var dte = dateService.createDate(jsonData.DTE);
                    dte = $filter('date') (dte, "dd-MMM-yyyy");
                    dates = (dates == '' ? dte : dates + ',' +dte);
                }
                if (dates != '') {
                    result = true;
                    var msg = $filter('translate') ('msg_DBParttionEr', { dateValue: dates
                    });
                    if ($scope.isDailyMode)
                        $scope.loadErrorPopup(true, msg);
                    else
                        $scope.loadErrorPopup(true, msg);
                    $(".paste").removeClass("active");
                    $(".copyToday").removeClass("active");
                    $(".copyWeek").removeClass("active");
                    $(".clone").removeClass("active");
                    if ($scope.isDailyMode) {
                        $scope.GetData($scope.isDailyMode, $scope.currentDate);
                    }
                    else if (!$scope.isDailyMode) {
                        $rootScope.isPasteClicked = true;
                        $rootScope.weekStateCurrentDate = $filter('date') ($scope.currentDate, "yyyy-MM-dd");
                        $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                    }
                }
            }
        }
        return result;
    }
    var chekForDBPartitionErrorPasteAdvance = function (errMsg, json) {
        var result = false;
        $rootScope.errorLogMethod("DailyTimeGridCtrl.chekForDBPartitionErrorPasteAdvance");
        if (errMsg != null && errMsg != '') {
            errMsg = errMsg.toLowerCase();
            var index = (errMsg.indexOf("database partition"));

            if (index > 0) {
                var dates = '';
                for (var i = 0; i < json.length; i++) {
                    var jsonData = json[i];
                    var dte = dateService.createDate(jsonData.DTE);
                    dte = $filter('date') (dte, "dd-MMM-yyyy");
                    dates = (dates == '' ? dte : dates + ',' +dte);
                }
                if (dates != '') {
                    result = true;
                }
            }
        }
        return result;
    }
    var getCurrentWeekFirstLastDate = function () {
        var resDate = new Date(); var dates = [];
        var currentTimezone = resDate.getTimezoneOffset();
        resDate.setMinutes(resDate.getMinutes() - (currentTimezone));
        resDate.setDate(resDate.getDate() + 1);

        resDate.setDate(resDate.getDate() - 7);
        for (var i = 0; i < 7; i++) {
            if (resDate.getDay() == 0)
                break;
            resDate.setDate(resDate.getDate() + 1);
        }
        dates[0] = new Date(resDate.valueOf());
        resDate.setDate(resDate.getDate() + 6);
        dates[1] = resDate;
        return dates;
    }
    var verifyPastedHrs = function (hrs, entryDate) {
        var is24Hrs = false;
        if(!$scope.IsTodayCopied && !$scope.IsWeekCopied && !$scope.IspasteAdvance) {
            if ($scope.isDailyMode) {
                if (hrs > 24)
                    is24Hrs = true;
                else {
                    $scope.totalDailyPastedHours = (parseFloat($scope.totalDailyPastedHours) == 0 ? parseFloat($scope.ttlHrs) : parseFloat($scope.totalDailyPastedHours)) + parseFloat(hrs)
                    console.log('MOBILE DAILY HOURS--' + $scope.totalDailyPastedHours);
                    if ($scope.totalDailyPastedHours > 24)
                        is24Hrs = true;
                }
            }
            else {
                var hrsSumDayWise = [0, 0, 0, 0, 0, 0, 0]; var weekStartDate = angular.copy($scope.weeklyStartDate);
                weekStartDate.setHours(0, 0, 0, 0);
                entryDate = createDate(entryDate);
                entryDate.setHours(0, 0, 0, 0)
                if (hrs > 24) {
                    is24Hrs = true;
                    console.log('MOBILE WEEKLY HOURS--' + hrs + ' entryDate--' + entryDate);
                }
                else {
                    hrsSumDayWise[0] = parseFloat($scope.itemsDataTotal.HrsTotalSum1 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum1)
                    hrsSumDayWise[1] = parseFloat($scope.itemsDataTotal.HrsTotalSum2 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum2)
                    hrsSumDayWise[2] = parseFloat($scope.itemsDataTotal.HrsTotalSum3 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum3)
                    hrsSumDayWise[3] = parseFloat($scope.itemsDataTotal.HrsTotalSum4 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum4)
                    hrsSumDayWise[4] = parseFloat($scope.itemsDataTotal.HrsTotalSum5 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum5)
                    hrsSumDayWise[5] = parseFloat($scope.itemsDataTotal.HrsTotalSum6 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum6)
                    hrsSumDayWise[6] = parseFloat($scope.itemsDataTotal.HrsTotalSum7 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum7)
                    var dayDiff = parseInt((entryDate - weekStartDate) / (1000 * 60 * 60 * 24));
                    $scope.totalWeeklyPastedHours[dayDiff] = (parseFloat($scope.totalWeeklyPastedHours[dayDiff]) == 0 ? parseFloat(hrsSumDayWise[dayDiff]) : parseFloat($scope.totalWeeklyPastedHours[dayDiff])) + parseFloat(hrs);
                    if ($scope.totalWeeklyPastedHours[dayDiff] > 24)
                        is24Hrs = true;
                    console.log('MOBILE WEEKLY HOURS--' + $scope.totalWeeklyPastedHours[dayDiff] + '--dayDiff--' + dayDiff);
                }


            }

        }
        else {
            if ($scope.IsTodayCopied) {
                $scope.totalTodayHrs = parseFloat($scope.totalTodayHrs) + parseFloat(hrs);
                if ($scope.totalTodayHrs > 24)
                    is24Hrs = true;
                console.log('MOBILE today HOURS--' + $scope.totalTodayHrs);
            }
            else if ($scope.IsWeekCopied) {
                var weekDates = getCurrentWeekFirstLastDate();
                var weekStartDate = angular.copy(weekDates[0]);
                weekStartDate.setHours(0, 0, 0, 0);
                entryDate = createDate(entryDate);
                entryDate.setHours(0, 0, 0, 0);
                var dayDiff = parseInt((entryDate - weekStartDate) / (1000 * 60 * 60 * 24));
                $scope.totalWeeklyPastedHours[dayDiff] = (parseFloat($scope.totalWeeklyPastedHours[dayDiff]) == 0 ? parseFloat($scope.weekTotalHrs[dayDiff]) : parseFloat($scope.totalWeeklyPastedHours[dayDiff])) + parseFloat(hrs);
                if ($scope.totalWeeklyPastedHours[dayDiff] > 24)
                    is24Hrs = true;
                console.log('MOBILE COPY TO THIS WEEK $scope.totalWeeklyPastedHours[dayDiff]--' + $scope.totalWeeklyPastedHours[dayDiff] + '--dayDiff--' + dayDiff);
            }
        }
        return is24Hrs;
    }
    $scope.validateEntries = function (isDailyMode, entryToValidate, entries, passedDate, isMultiple) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.validateEntries");
        if (entryToValidate.CEP_REC.CLIEACTIVE != "Y") {
            if (!isMultiple)
                $scope.loadErrorPopup(true, $filter('translate') ('msg_InActiveCep'));
            return false;
        }
        if (entryToValidate.CEP_REC.ENGACTIVE != "Y") {
            if (!isMultiple)
                $scope.loadErrorPopup(true, $filter('translate') ('msg_InActiveCep'));
            return false;
        }
        if (entryToValidate.CEP_REC.ENGTIMFLAG != "Y") {
            if (!isMultiple)
                $scope.loadErrorPopup(true, $filter('translate') ('msg_SelectAnotherEng'));

            return false;
        }
        if (entryToValidate.CEP_REC.PRJACTIVE != "Y") {
            if (!isMultiple)
                $scope.loadErrorPopup(true, $filter('translate') ('msg_InActiveCep'));
            return false;
        }
        if (entryToValidate.CEP_REC.PRJTIMFLAG != "Y") {
            if (!isMultiple)
                $scope.loadErrorPopup(true, $filter('translate') ('msg_SelectAnotherPrj'));
            return false;
        }

        var initialDetail = $rootScope.GetInitialDetail(false, true);
        if (entryToValidate.ACTI_REC.STAT != "Y" && parseInt(entryToValidate.CEP_REC.CATID) == 0) {
            if (!isMultiple)
                $scope.loadErrorPopup(true, $filter('translate') ('msg_InActiveActivity'));
            return false;
        }

        var initialDetail = null;
        var loginDetail = $rootScope.GetLoginDetail(false, true);


        loginService.retrieveInitialData(loginDetail.SESKEY, loginDetail.EMPLID).then(function (response) {
            if(parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                initialDetail = $rootScope.GetInitialDetail(false, true);
            }
        });

        initialDetail = $rootScope.GetInitialDetail(false, true);

        var isMoreThan24H = false;
        if (isDailyMode) {
            if (parseFloat(entryToValidate.HRS) < 0) {
                var isValid = $scope.validateEntryHours(entryToValidate, initialDetail, isMultiple);
                if (!isValid)
                    return false;
            }
            else if (verifyPastedHrs(parseFloat(entryToValidate.HRS), entryToValidate.DTE))//////check pasted hrs
                isMoreThan24H = true;
        }
        else {
            for (var i = 0; i < entries.length; i++) {
                if (parseFloat(entries[i].HRS) < 0) {
                    var isValid = $scope.validateEntryHours(entries[i], initialDetail, isMultiple);
                    if (!isValid) {
                        return false;
                        break;
                    }
                }
                else if (verifyPastedHrs(parseFloat(entries[i].HRS), entries[i].DTE))//////check pasted hrs
                    isMoreThan24H = true;
            }
        }

        if (isMoreThan24H) {
            maxHourMsg = $filter('translate')('msg_24HrsPaste');
            if ($scope.exceedHrs.length == 0) {
                $scope.exceedHrs.push(maxHourMsg);
            }
        }

        if (((entryToValidate.CEP_REC.RENPRJNO != null) && (entryToValidate.CEP_REC.RENPRJNO != ' ')) && (typeof entryToValidate.CEP_REC.RENPRJNO != 'undefined')) {
            var pro = parseInt(entryToValidate.CEP_REC.RENPRJNO) > 99 ?(parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString(): parseInt(entryToValidate.CEP_REC.RENPRJNO) > 9 ? '0' +(parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString() : '00' +(parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString();
            var cepcode = entryToValidate.CEP_REC.CLIENO + '-' +entryToValidate.CEP_REC.ENGNO + '-' +entryToValidate.CEP_REC.PRJNO;
            if ($scope.renewalMessage.indexOf(cepcode) == -1) {
                $scope.renewalMessage.push(cepcode);
                $scope.loadErrorPopup('z', $filter('translate') ('msg_ProjectRenewedPaste', { pName: pro, cepProject: cepcode
                }));
            }
        }

        return true;
    }
    $scope.validateEntryHours = function (entryToValidate, initialDetail, isMultiple) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.validateEntryHours");
        switch (entryToValidate.CEP_REC.CHARBASIS) {
            case 'N': if (initialDetail.COMP_REC.NTIM != 'Y') {
                if (!isMultiple)
                    $scope.loadErrorPopup(true, $filter('translate') ('msg_NegativeHrs'));
                return false;
            }
                break;
            case 'T': if (initialDetail.COMP_REC.NBTM != 'Y') {
                if (!isMultiple)
                    $scope.loadErrorPopup(true, $filter('translate') ('msg_BillingNegativeHrs'));
                return false;
            }
                break;
            case 'S':
            case 'C':
                if (!isMultiple)
                    $scope.loadErrorPopup(true, $filter('translate') ('msg_NegativeHrs'));
                return false;

                break;
        }
        return true;
    }
    $scope.deleteTimeEntriesConfirm = function (isDailyMode) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.deleteTimeEntriesConfirm");
        var count = 0;
        var isSelected = false;
        var chkEntries = document.getElementsByName("chkEntries");
        for (var i = 0, j = 0; i < chkEntries.length; i++) {
            if (chkEntries[i].checked == true) {
                var entry = JSON.parse(chkEntries[i].value);
                if (isDailyMode)
                    count++;
                else {
                    if (entry.Hrs1 != null) {
                        count++;
                    }
                    if (entry.Hrs2 != null) {
                        count++;
                    }
                    if (entry.Hrs3 != null) {
                        count++;
                    }
                    if (entry.Hrs4 != null) {
                        count++;
                    }
                    if (entry.Hrs5 != null) {
                        count++;
                    }
                    if (entry.Hrs6 != null) {
                        count++;
                    }
                    if (entry.Hrs7 != null) {
                        count++;
                    }
                }
                if (!isSelected) {
                    if ((isDailyMode && entry.TIMSUB == "N") || (!isDailyMode && entry.data.TIMSUB == "N")) {
                        JSON.parse(chkEntries[i].value)
                        isSelected = true;
                    }
                }
            }
        }
        if (count > 0 && isSelected) {
            var msg = "Do you wish to delete " + count + " record(s)?";
            var sendData = {
                message: msg,
                isCancelBtnOn: true,
                isDailyModeOption: isDailyMode
            };
            $scope.openModalCtrl = 'deleteConfirm';
            $scope.open('templates/ConfirmMessage.html', 'ConfirmMessage', sendData);
        }
    }
    $scope.deleteTimeEntriesClicked = function (isDailyMode) {
        $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.deleteTimeEntriesClicked");
        $(".del").addClass("active");
        if ($scope.selectedForDelete) {
            var chkEntries = document.getElementsByName("chkEntries");
            var selectedEntries =[];
            var isSelected = false;
            for (var i = 0, j = 0; i < chkEntries.length; i++) {
                if (chkEntries[i].checked == true) {
                    selectedEntries.push(chkEntries[i].value);
                    isSelected = true;
                    //break;
                }
            }
            if (isSelected) {
                var timeEntryIds =[];
                $rootScope.lastExpandAllText = $scope.expandAllText;
                $rootScope.lastExpandClass = $scope.expandClass;
                $rootScope.cntrExpandCollapse =2;
                if (isDailyMode) {
                    var dailyInvalidCount = 0;
                    for (var i = 0; i < selectedEntries.length; i++) {
                        if (JSON.parse(selectedEntries[i]).TIMSUB.toUpperCase() != "Y")
                            timeEntryIds.push(parseFloat(JSON.parse(selectedEntries[i]).TEID));
                        else
                            dailyInvalidCount++;
                    }
                    $scope.deleteTimeEntries(isDailyMode, timeEntryIds, dailyInvalidCount, selectedEntries.length);
                }
                else {
                    var tEIdsStrFinal = "";
                    var count = 0;
                    var invalidCount = 0;
                    var weekSdate = new Date($scope.weeklyStartDate.valueOf());
                    weekSdate.setHours(0, 0, 0, 0);
                    var weekDayOnOffStatus = commonUtilityService.getWkDayOnOpenCloseRevStatus(weekSdate);
                    var isTEInOpenREVWeekExist =false;
                    for (var i = 0; i < selectedEntries.length; i++) {
                        var selRec = JSON.parse(selectedEntries[i]);
                        if (JSON.parse(selectedEntries[i]).data.TIMSUB.toUpperCase() != "Y") {
                            var obj = commonUtilityService.getDeleteTeIdObj(selRec, weekDayOnOffStatus);
                            isTEInOpenREVWeekExist = (isTEInOpenREVWeekExist ? true : obj.isTEInOpenREVWeekExist);
                            tEIdsStrFinal += (tEIdsStrFinal == "" ? "" : ",") + obj.tEIdsStr;
                            invalidCount = invalidCount + obj.invalidCount;
                            count = count + commonUtilityService.countNoOfTimeEntry(selRec);
                        }
                        else {
                            var ttlSelTE = commonUtilityService.countNoOfTimeEntry(selRec);
                            count = count +ttlSelTE;
                            invalidCount = invalidCount +ttlSelTE;
                        }

                    }
                    $scope.deleteTimeEntries(isDailyMode, tEIdsStrFinal.split(","), invalidCount, count, isTEInOpenREVWeekExist);
                }
            }
        }
    }
    ///////////////////////////////////////////////////Multidatepicker///////////////////////////////////////////////////
    
    $scope.pasteAdvance = function (isDailyMode) {
        $scope.renewalMessage =[];
        var isLoginValid = $rootScope.GetLoginDetail(false, true);
        if (isLoginValid != null && isLoginValid != undefined) {
            if ($scope.DailyDataCopied || $scope.IsTodayCopied || $scope.IsClone) {
                $scope.round =false;
                $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.pasteAdvance");
                $scope.openModalCtrl = 'pasteAdvanced';
                var sendData = { currentDateValue: $scope.currentDate };
                $scope.open('templates/Multidatepicker.html', 'multidatepickerCtrl', sendData);
            }
        } 
    }
    $scope.CopytoToday = function (isDailyMode) {
        if (isDailyMode && $scope.IsSelectedForAll) {
            $(".copyToday").addClass("active");
            $scope.IsTodayCopied = true; $scope.totalTodayHrs = 0;
            var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
            var tempTodayDate = new Date();
            var currentTimezone = tempTodayDate.getTimezoneOffset();
            tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
            tempTodayDate = $filter('date')(tempTodayDate, 'yyyy-MM-dd HH:mm:ss');
            commonUtilityService.copyToTodayCopyToWeekService(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, tempTodayDate, tempTodayDate, $filter('date')($scope.currentDate, 'yyyy-MM-dd HH:mm:ss')).then(function (data) {
                if (data.RETTIM_OUT_OBJ.RETCD == 0) {
                    for (var i = 0; i < data.RETTIM_OUT_OBJ.TIME_ARR.length; i++) {
                        $scope.totalTodayHrs = parseFloat($scope.totalTodayHrs) + parseFloat(data.RETTIM_OUT_OBJ.TIME_ARR[i].HRS);
                }
                    if ($scope.copyRecords(isDailyMode))
                        $scope.pasteRecords(isDailyMode, 1);
                    else
                        $scope.IsTodayCopied = false;
            }
            });

    }
    }
    $scope.CopytoThisWeek = function (isDailyMode) {
    if (!isDailyMode && $scope.IsSelectedForAll) {
            $(".copyWeek").addClass("active");
            $scope.IsWeekCopied = true;
            var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
            $scope.IsWeekCopied = true; $scope.weekTotalHrs = [0, 0, 0, 0, 0, 0, 0];
            var weekDates = getCurrentWeekFirstLastDate();
            $scope.currentWeekStartDate = weekDates[0];
            commonUtilityService.copyToTodayCopyToWeekService(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, $filter('date')(weekDates[0], 'yyyy-MM-dd HH:mm:ss'), $filter('date')(weekDates[1], 'yyyy-MM-dd HH:mm:ss'), $filter('date')($scope.currentDate, 'yyyy-MM-dd HH:mm:ss')).then(function (data) {
                if (data.RETTIM_OUT_OBJ.RETCD == 0) {
                    for (var j = 0; j < 7; j++) {
                        for (var i = 0; i < data.RETTIM_OUT_OBJ.TIME_ARR.length; i++) {
                            weekDates[0].setHours(0, 0, 0, 0);
                            if ($filter('date')(weekDates[0], 'yyyy-MM-dd HH:mm:ss') == $filter('date')(data.RETTIM_OUT_OBJ.TIME_ARR[i].DTE, 'yyyy-MM-dd'))
                                $scope.weekTotalHrs[j] = parseFloat($scope.weekTotalHrs[j]) + parseFloat(data.RETTIM_OUT_OBJ.TIME_ARR[i].HRS);

                    }
                        weekDates[0].setDate(weekDates[0].getDate() + 1);
                }
                    console.log('MOBILE $scope.weekTotalHrs--' + JSON.stringify($scope.weekTotalHrs));
                    if ($scope.copyRecords(isDailyMode))
                        $scope.pasteRecords(isDailyMode, 1);
                    else
                        $scope.IsWeekCopied = false;
            }
            });
    }

    }
    $scope.Clone = function (isDailyMode) {
        if ($scope.IsSelectedForAll && $scope.checkRevMonthFlag) {
            $(".clone").addClass("active");
            $scope.IsClone = true;
            if ($scope.copyRecords(isDailyMode))
                $scope.pasteRecords(isDailyMode, 1);
            else
                $scope.IsClone = false;
    }

    }
    $scope.pasteMultiple = function (selectedItem) {
        var cnt = selectedItem.length;
        $scope.pasteMultipleCount = cnt;
        $scope.isPriorToBillingDate = false;
        for (var i = 0; i < cnt; i++) {
            if (!$scope.isPriorToBillingDate) {
                var dt = new Date(selectedItem[i]);
                $scope.IspasteAdvance = true;
                $scope.pasteAdvanceDate = dt;
                $scope.pasteRecords(true, cnt);
                $scope.checkPasteMulCnt = i + 1;
        }
    }
        $scope.isPriorToBillingDate = false;
        $scope.checkPasteMulCnt = 0;
    }

    $scope.showWeeks = false;

    $scope.loadErrorPopup = function (isError, message) {
    $rootScope.errorLogMethod("DailyTimeGridCtrl.$scope.loadErrorPopup");
        var sendData = {
                isError: isError,
                message: message
    };
        $scope.openModalCtrl = 'ErrorPopup';
        $scope.open('templates/ErrorPopup.html', 'ErrorPopup', sendData);
    }

}])

.controller('InfoController', ['$scope', '$rootScope', '$modal', '$modalInstance', '$filter', '$interval', 'selectedRow',
    function ($scope, $rootScope, $modal, $modalInstance, $filter, $interval, selectedRow) {

        $scope.selectedRow = selectedRow;

        $scope.ok = function () {
            $rootScope.errorLogMethod("InfoController.$scope.ok");
            $scope.selectedRow = null;
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $rootScope.errorLogMethod("InfoController.$scope.cancel");
            $scope.selectedRow = null;
            $modalInstance.dismiss('cancel');
        };
    }
])

.controller('deviceCtrl', ["$scope", "deviceDetector",
    function ($scope, deviceDetector) {
        $scope.name = 'World';
        $scope.deviceDetector = deviceDetector;
    }])

.controller('calController', ['$scope', '$rootScope', '$filter', '$localStorage', 'broadcastService', 'loadRevenueMonthsServices', '$modalInstance', 'selectedData', 'retrieveSharedService', 'commonUtilityService', function ($scope, $rootScope, $filter, $localStorage, broadcastService, loadRevenueMonthsServices, $modalInstance, selectedData, retrieveSharedService, commonUtilityService) {
    $scope.dateArray = [];
    $scope.dateSubmitArray = [];
    datesHighError = [];
    $scope.direction = [];
    var revMnthRange = [];
    $scope.arguments = selectedData;
    $scope.init = function () {
        $rootScope.errorLogMethod("calController.$scope.init");
        $scope.currentDateValue = angular.copy($scope.arguments.currentDateValue);
    }
    var createDate = function (dteStr) {
        $rootScope.errorLogMethod("calController.var.createDate");
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }
    if ($localStorage.dateVal != undefined) {

        $scope.dateSubmitArray = null;
        $scope.dateSubmitArray = angular.fromJson($localStorage.dateVal);
        $scope.dateSubmitArray.formats = 'dd/MM/yyyy';
    }
    $scope.currdate = function () {

        $rootScope.errorLogMethod("calController.$scope.currdate");
        $localStorage.SelectedCalendardate = null;
        $localStorage.CalDate = null;
        var tempTodayDate = new Date();
        var currentTimezone = tempTodayDate.getTimezoneOffset();
        tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
        $scope.dt = tempTodayDate;

        $localStorage.SelectedCalendardate = $scope.dt;
        $localStorage.currDate = $scope.dt;
        $localStorage.todayClicked = "1";
        angular.element(document.getElementById('selectedValue'))[0].value = $scope.dt;
        angular.element(document.getElementById('selectedValue')).triggerHandler('change');
        $scope.ok();
    }

    $scope.today = function () {
        $rootScope.errorLogMethod("calController.$scope.today");
        var date = angular.element(document.getElementById('txtcurrentDate'))[0].value;
        if ((date != '') && (date != null)) {
            var startDate = new Date(date);

            var year = parseInt($filter('date')(startDate, 'yyyy'));
            var mn = parseInt($filter('date')(startDate, 'MM'));
            var day = parseInt($filter('date')(startDate, 'dd'));
            $scope.dt = new Date(year, mn - 1, day);
        }
        else
            $scope.dt = new Date();
    };
    $scope.today();

    $scope.$on("updateUiCalSelectedDate", function (event, args) {
        $rootScope.errorLogMethod("calController.$scope.$on.updateUiCalSelectedDate");
        $scope.dt = new Date(args.value.valueOf());
    });

    function convertMonthNameToNumber(monthName) {
        $rootScope.errorLogMethod("calController.convertMonthNameToNumber");
        var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
        var monthDigit = myDate.getMonth();
        return isNaN(monthDigit) ? 0 : (monthDigit + 1);
    }
    function GetCurrentSelectedMonthYear(currentDate) {
        var revRange = commonUtilityService.getRevStartEndDateBySelDate($filter('date')(currentDate, "yyyy-MM-dd"));
        if (revRange != null) {
            var startDate = createDate(revRange.revStartDate);
            var endDate = createDate(revRange.revEndDate);
            currentMonth = parseInt(endDate.getMonth()) + 1;
            currentYear = endDate.getFullYear();
        }
        $('#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner').each(function () {
            $(this).find("li").each(function () {
                if ($(this).text() == currentYear)
                    $(this).children().addClass("liActive")
            });
        });
        $('#dvdatepicker .calendarOver.mobileCalOver .monthContainer').each(function () {
            $(this).find("li").each(function () {
                if (convertMonthNameToNumber($(this).text()) == currentMonth)
                    $(this).children().addClass("liActive")
            });
        });
    }
    function isValidDate(year, month, day) {
        var d = new Date(year, month, day);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    }
    $scope.selectCalendarDate = function () {
        var yearValue = $("#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner .liActive").text();
        var monthValue = $("#dvdatepicker .calendarOver.mobileCalOver .monthContainer .liActive").text();
        var selectedDate = angular.copy($scope.currentDateValue);
        while (!(isValidDate(parseInt(yearValue.substring(0, 4)), (parseInt(convertMonthNameToNumber(monthValue)) - 1), selectedDate.getDate()))) {
            selectedDate.setDate(selectedDate.getDate() - 1);
        }
        selectedDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), selectedDate.getDate());
        var revRange = commonUtilityService.getRevStartEndDateBySelDate($filter('date')(selectedDate, "yyyy-MM-dd"));
        if (revRange != null) {
            if (parseInt(createDate(revRange.revEndDate).getMonth()) != (parseInt(convertMonthNameToNumber(monthValue)) - 1))
            selectedDate.setDate(createDate(revRange.revStartDate).getDate() - 1);
            broadcastService.notifyYearUpCalendar(selectedDate, true);
            GetCurrentSelectedMonthYear(selectedDate);
        }
        else {
            var cDate = $filter('date')(selectedDate, "yyyy-MM-dd");
            var cDteFinal = createDate(cDate);
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, cDate, function (response) {
                var revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                var selObj = null;
                if (revMnthRange != null) {
                    for (var i = 0; i < revMnthRange.length; i++) {
                        if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                            if (cDteFinal >= createDate(revMnthRange[i].STRTDTE) && cDteFinal <= createDate(revMnthRange[i].ENDDTE)) {
                                selObj = revMnthRange[i];
                                break;
                            }
                        }
                    }
                    if (parseInt(createDate(selObj.ENDDTE).getMonth()) != (parseInt(convertMonthNameToNumber(monthValue)) - 1))
                    selectedDate.setDate(createDate(selObj.STRTDTE).getDate() - 1);
                    broadcastService.notifyYearUpCalendar(selectedDate, true);
                    GetCurrentSelectedMonthYear(selectedDate);
                }
            });
        }
        $("#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner ul li a").click(function () {
            $("#dvdatepicker .calendarOver.mobileCalOver .yearContainerinner ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
    }
    $scope.Chkhours = function () {
        $rootScope.errorLogMethod("calController.$scope.Chkhours");
        $scope.dateSubmitArray.splice($scope.dateSubmitArray.indexOf($scope.dt.setHours(0, 0, 0, 0)), 1);
        $scope.dateSubmitArray.push({
            date: $scope.dt.setHours(0, 0, 0, 0), hours: $scope.hours
        });
        $localStorage.dateVal = $scope.dateSubmitArray;
        $scope.dateSubmitArray.formats = 'dd/MM/yyyy';
        $scope.hours = '';
        $window.location.reload('/Mercer.MyTime.Web/Calendar.html');
    }
    var initialDetail = $rootScope.GetInitialDetail(false, true);
    var hrs = initialDetail.EMPL_REC.REQHRS;

    //Function for showing dates red  
    $scope.dateError = function (date, mode) {
        $rootScope.errorLogMethod("calController.$scope.dateError");
        for (var i = 0; i < $scope.dateSubmitArray.length; i++) {
            if (parseFloat($scope.dateSubmitArray[i].HRS) < parseFloat(hrs)) {
                var formatDateSub = new Date($scope.dateSubmitArray[i].DTE.substring(0, $scope.dateSubmitArray[i].DTE.indexOf(' '))).setHours(0, 0, 0, 0);
                var formattedCurrentDate = new Date(date).setHours(0, 0, 0, 0);
                if (formatDateSub == formattedCurrentDate) {
                    return true;
                }

            }
        }

    };
    //Function for showing dates bold 
    $scope.dateHighlight = function (date, mode) {
        $rootScope.errorLogMethod("calController.$scope.dateHighlight");
        for (var i = 0; i < $scope.dateSubmitArray.length; i++) {
            if (parseFloat($scope.dateSubmitArray[i].HRS) >= parseFloat(hrs)) {
                var formatDateSub = new Date($scope.dateSubmitArray[i].DTE.substring(0, $scope.dateSubmitArray[i].DTE.indexOf(' '))).setHours(0, 0, 0, 0);
                var formattedCurrentDate = new Date(date).setHours(0, 0, 0, 0);
                if (formatDateSub == formattedCurrentDate) {
                    return true;
                }
            }
        }

    };
    $scope.dateChange = function () {
        $rootScope.errorLogMethod("calController.$scope.dateChange");
        $scope.dt = new Date(angular.element(document.getElementById('selectedValue'))[0].value);
        if (localStorage.calendarchange != "true") {
            $scope.ok();
        }

    };
    $scope.showWeeks = false;
    $scope.toggleWeeks = function () {
        $rootScope.errorLogMethod("calController.$scope.toggleWeeks");
        $scope.showWeeks = !$scope.showWeeks;
    };

    $scope.clear = function () {
        $rootScope.errorLogMethod("calController.$scope.clear");
        $scope.dt = null;
    };

    $scope.open = function ($event) {
        $rootScope.errorLogMethod("calController.$scope.open");
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;

    };


    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];

    /*updating the daily grid*/
    $scope.$watch('dt', function () {
        var SelDate = $filter('date')(new Date($scope.dt), "yyyy-MM-dd");
        var revRangeDate = [], revMnthRange = [];

        if (localStorage.revnotsetup == "null" && localStorage.revnotsetup != undefined) {
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                if (revMnthRange != undefined && revMnthRange != "undefined") {
                    updDate = new Date(SelDate);
                    updDate = new Date(updDate.getTime() + (updDate.getTimezoneOffset() * 60 * 1000));
                    revRangeDate = angular.fromJson(revMnthRange).filter(function (item) {
                        if (item != null) {
                            if (item.REVM === updDate.getFullYear().toString() + ("0" + (updDate.getMonth() + 1)).slice(-2).toString()) {
                                return true;
                            }
                        }
                    });

                    if (revRangeDate != undefined && revRangeDate.length != 0) {
                        if (revRangeDate[0].STRTDTE != undefined && revRangeDate[0].STRTDTE != "undefined") {
                            if ($localStorage.currDate != "null" && $localStorage.currDate != undefined) {
                                $scope.dt = new Date($localStorage.currDate);

                            }
                            else if (localStorage.SelectedCalendardate != "null" && localStorage.SelectedCalendardate != undefined) {
                                $scope.dt = new Date(localStorage.SelectedCalendardate);
                            }
                            broadcastService.notifyUiGrid($scope.dt)
                            localStorage.revnotsetup = $scope.dt;

                        }
                    }
                    else {
                        localStorage.SelectedCalendardate = null;
                    }
                }
                $localStorage.currDate = null;
            });
        }
        if ($localStorage.currDate != "null" && $localStorage.currDate != undefined) {
            $scope.dt = $localStorage.currDate;
            localStorage.SelectedCalendardate = $scope.dt;
        }
    });

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])

.controller('importCalCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', '$state', '$rootScope', '$timeout', '$window', 'constantService', 'importCalService', 'selectedData', function ($rootScope, $filter, $scope, $modalInstance, $state, $rootScope, $timeout, $window, constantService, importCalService, selectedData) {
    var createDate = function (dteStr) {
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }

    var createDateTime = function (dateStr) {
        if (dateStr != undefined && dateStr != null) {
            dateStr = dateStr.trim();
            var parts = dateStr.split("-");
            var day = parts[2].split(' ');
            var time = day[1].split(':')
            return new Date(parts[0], parts[1] - 1, day[0], time[0], time[1], time[2]);
        }
        else
            return new Date();
    }

    var importCalRslt = function () {
        this.items = [];
        this.busy = true;
        this.loadMsg = 'Search Results . . .'

    };
    $scope.importCalObj = new importCalRslt();
    $scope.currentDate = "";

    $scope.callClick = function (id) {
        id = createDateTime(id);
        var currentTimezone = id.getTimezoneOffset();
        id.setMinutes(id.getMinutes() - (currentTimezone));
        id = $filter('date')(id, 'yyyy-MM-dd');
        if ($(".i" + id).attr("class").indexOf('fa fa-minus') > -1) {
            $(".c" + id).hide();
            $(".i" + id).removeClass("fa fa-minus");
            $(".i" + id).addClass("fa fa-plus");
        }
        else {
            $(".c" + id).show();
            $(".i" + id).removeClass("fa fa-plus");
            $(".i" + id).addClass("fa fa-minus");
        }
    }
    $scope.CalNoEntryMessage = 0;

    $scope.initGetCalImport = function () {
        $rootScope.errorLogMethod("importCalCtrl.$scope.initGetCalImport");
        $scope.checkVisibilityFlag = true;
        var tempDateVal = selectedData.isDailyMode ? selectedData.currentDate : selectedData.weekStartDate;
        tempDateVal.setHours(0, 0, 0, 0);
        var endDateCheck = createDate(selectedData.revEndDate.substring(0, 10));
        var startDateCheck = createDate(selectedData.revStartDate.substring(0, 10));
        endDateCheck.setHours(0, 0, 0, 0);
        startDateCheck.setHours(0, 0, 0, 0);

        var dateVal = new Date(tempDateVal.valueOf());
        var endDate = new Date(dateVal.valueOf());
        if (selectedData.isDailyMode) {
            endDate = endDate.setDate(endDate.getDate());

        }
        else {
            endDate.setDate(endDate.getDate() + 7);
            for (var i = 0; i < 7; i++) {
                if (endDate.getDay() == 6)
                    break;
                endDate.setDate(endDate.getDate() - 1);
            }
            $scope.weeklyStartDate = selectedData.weekStartDate;
        }
        
        var tempEndDate = endDate;
        var tempStartDate = tempDateVal;
        if (endDate > endDateCheck && (!selectedData.isDailyMode)) {
            endDate = new Date(endDateCheck.valueOf());
        }

        if (tempDateVal < startDateCheck) {
            tempDateVal = new Date(startDateCheck.valueOf());
            dateVal = new Date(tempDateVal.valueOf());
            endDate = tempEndDate;
        }
        if (!selectedData.isDailyMode) {
            if (selectedData.currentDate.setHours(0, 0, 0, 0) > endDateCheck && (selectedData.weekStartDate.setHours(0, 0, 0, 0) < endDateCheck)) {
                tempDateVal = new Date(endDateCheck.valueOf());
                tempDateVal.setDate(tempDateVal.getDate() + 1);
                dateVal = new Date(tempDateVal.valueOf());
                endDate = tempEndDate;
            }
            //alert(tempDateVal);
            if (selectedData.currentDate.setHours(0, 0, 0, 0) < endDateCheck && (selectedData.weekStartDate.setHours(0, 0, 0, 0) < endDateCheck) && (endDate > endDateCheck)) {
                tempDateVal = new Date(selectedData.weekStartDate.valueOf());
                dateVal = new Date(tempDateVal.valueOf());
                endDate = new Date(endDateCheck.valueOf());
            }
            if (selectedData.currentDate.setHours(0, 0, 0, 0) > endDateCheck && (selectedData.weekStartDate.setHours(0, 0, 0, 0) >= endDateCheck)) {
                tempDateVal = tempStartDate;
                dateVal = new Date(tempDateVal.valueOf());
                endDate = tempEndDate;
            }
        }

        $scope.isDailyMode = selectedData.isDailyMode;
        endDate = new Date(endDate);
        dateVal.setHours(0, 0, 0, 0);
        currentTimezone = dateVal.getTimezoneOffset();
        dateVal.setMinutes(dateVal.getMinutes() + (currentTimezone));
        endDate.setHours(24, 0, 0, 0);
        currentTimezone = endDate.getTimezoneOffset();
        endDate.setMinutes(endDate.getMinutes() + (currentTimezone));
        var startDate = $filter('date')(dateVal, 'yyyy-MM-dd HH:mm:ss');
        endDate = $filter('date')(endDate, 'yyyy-MM-dd HH:mm:ss');
        $scope.currentDate = selectedData.currentDate;
        var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
        var jsonSFromInitialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.CalImportData = [];
        var domain = constantService.DOMAINNAME;
        if (selectedData.flag == "Y") {
            if (localStorage.getItem("calENCKEY") == null || localStorage.getItem("calENCKEY") == undefined)
                localStorage.setItem("calENCKEY", selectedData.encKey);
            if (localStorage.getItem("nonADDomain") == null || localStorage.getItem("nonADDomain") == undefined)
                localStorage.setItem("nonADDomain", selectedData.domain);
            domain = localStorage.getItem("nonADDomain");
        }
        else
            localStorage.setItem("calENCKEY", jsonSFromloginDetail.ENCKEY);
        //alert( startDate+ endDate);
        
        importCalService.getCalImportEntries(jsonSFromloginDetail.SESKEY, localStorage.getItem("calENCKEY"), domain, startDate, endDate, jsonSFromInitialDetail.EMPL_REC.EMAIL, jsonSFromInitialDetail.EMPL_REC.EMAIL)
            .then(function (response) {
                if (parseInt(response.RETCALENT_OUT_OBJ.RETCD) == 0) {
                    if (response.RETCALENT_OUT_OBJ.CALI_ARR == undefined || response.RETCALENT_OUT_OBJ.CALI_ARR.length == 0) {

                        $scope.importCalObj.busy = true;
                        $scope.importCalObj.loadMsg = $filter('translate') ('msg_NoMoreData');
                        $scope.CalNoEntryMessage = 1;
                        return;
                    }
                    if (Object.prototype.toString.call(response.RETCALENT_OUT_OBJ.CALI_ARR) != '[object Array]') {
                        var data = response.RETCALENT_OUT_OBJ.CALI_ARR;
                        response.RETCALENT_OUT_OBJ.CALI_ARR =[];
                        response.RETCALENT_OUT_OBJ.CALI_ARR.push(data.CALI_OBJ);
                    }
                    var items = response.RETCALENT_OUT_OBJ.CALI_ARR;
                    var itemArLen = $scope.importCalObj.items.length;
                    /*Array is returned by api*/
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].CALID != 0) {                                
                                items[i].index = itemArLen;
                                $scope.importCalObj.items.push(items[i]);
                                itemArLen++;
                            }
                        }

                    }
                    else {
                        if (typeof response.RETCALENT_OUT_OBJ.CALI_ARR == "object") {
                            if (response.RETCALENT_OUT_OBJ.CALI_ARR.CALI_OBJ.CALID != 0) {
                                response.RETCALENT_OUT_OBJ.CALI_ARR.CALI_OBJ.index = itemArLen;
                                $scope.importCalObj.items.push(response.RETCALENT_OUT_OBJ.CALI_ARR.CALI_OBJ);
                            }
                        }
                    }

                }
                else (response.RETCALENT_OUT_OBJ.ERRMSG.trim() != "")
                {
                    $scope.CalNoEntryMessage = 2;
                    $scope.message = response.RETCALENT_OUT_OBJ.ERRMSG;
                }
            });
    }


    $scope.timediff = function (a, b) {
        var tempStartDate = createDateTime(a);
        var currentTimezone = tempStartDate.getTimezoneOffset();
        tempStartDate.setMinutes(tempStartDate.getMinutes() - (currentTimezone));
        var tempEndDate = createDateTime(b);
        var currentTimezone = tempEndDate.getTimezoneOffset();
        tempEndDate.setMinutes(tempEndDate.getMinutes() - (currentTimezone));
        
        var diff = tempEndDate.getTime() - tempStartDate.getTime();
        var hours = diff / 1000 / 60 / 60;
        return hours.toFixed(2);
    }
    $scope.formatDates = function (date) {
        var startDate = createDateTime(date);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        var hours = startDate.getHours();
        var minutes = startDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }    
    
    $scope.viewEntry = function (itemId, hours, descr, date) {      
        $rootScope.importViewed = true;
            descr = (descr == null ? "" : descr);
            descr = descr.replace(/\n/g, " ");
            descr = descr.replace(/\t/g, " ");
            $rootScope.lastCurrentDate = $filter('date')(selectedData.currentDate, "yyyy-MM-dd");
            $rootScope.lastExpandAllText = selectedData.lastExpandAllText;
            $rootScope.lastExpandClass = selectedData.lastExpandClass;
            $rootScope.cntrExpandCollapse = 2;
            if (!selectedData.isDailyMode) {
                $rootScope.isPasteClicked = true;
                $rootScope.weekStateCurrentDate = $filter('date')(selectedData.currentDate, "yyyy-MM-dd");
            }
            var calDetail = [];
            var sendDate;
            var startDate = createDateTime(date);
            var currentTimezone = startDate.getTimezoneOffset();
            startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
            var day = startDate.getDay();
            if ($scope.isDailyMode)
                hours = hours;
            else
                hours = hours + "|" + day;
            calDetail.push({
                itemId: itemId, Hours: hours, Description: descr
            });
            localStorage.setItem('calDetail_Entry', JSON.stringify(calDetail));
            sendDate = $scope.currentDate;
            $rootScope.isRefresh = false;
            $state.go('mNewEntry', {
                "startDate": (selectedData.isDailyMode ? selectedData.currentDate : selectedData.weekStartDate), "isDailyMode": selectedData.isDailyMode, "IsEditMode": false, "currentDate": sendDate, "Hours": hours, "Description": descr, "isCalFlg": true
            }); 
    }
    var startTimeTemp=0;
    $scope.checkVisibility = function (startTime, index) {
        if(index == 0)
            startTimeTemp = 0;
        var startDate = createDateTime(startTime);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        var date = startDate.getDate();
        if (date == startTimeTemp) {
            $scope.checkVisibilityFlag = false;
            return '';
        }
        else {
            startTimeTemp = date;
            $scope.checkVisibilityFlag = true;
            var cDate = $filter('date')(startDate, "yyyy-MM-dd HH:mm:ss");
            cDate = createDateTime(cDate);
            return cDate;
        }
    }

    $scope.getStartTime = function (startTime) {
        var startDate = createDateTime(startTime);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        startDate = $filter('date')(startDate, 'yyyy-MM-dd');
        return startDate.substring(0, 10);
    }
    $scope.cancel = function () {
        $rootScope.isCalOpen = false;
        $modalInstance.dismiss('cancel');
    };
}])

.controller('ConfirmBroadcastMessage', ['$rootScope', '$scope', '$modalInstance', '$state', 'selectedData', 'broadcastMessageServices', function ($rootScope, $scope, $modalInstance, $state, selectedData, broadcastMessageServices) {

    $scope.popUpName = 'ConfirmBroadcastMessage';

    $scope.selectedData = selectedData;
    $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
    $scope.ok = function () {
        $rootScope.errorLogMethod("ConfirmBroadcastMessage.$scope.ok");
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        broadcastMessageServices.dismissBroadcastMessage(loginDetail.SESKEY, selectedData.messageid)
               .then(function (response) {
                   if (parseInt(response.DISBROADM_OUT_OBJ.RETCD == 0)) {
                   }


               });
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $rootScope.errorLogMethod("ConfirmBroadcastMessage.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };
    $scope.isError = false;
    $scope.message = '';
    $scope.init = function () {
        $rootScope.errorLogMethod("ConfirmBroadcastMessage.$scope.init");
        $scope.isError = $scope.selectedData.isError;
        $scope.message = $scope.selectedData.message;

    }
}])
.controller('multidatepickerCtrl', ['$rootScope', '$scope', '$filter', '$modalInstance', 'broadcastService', 'selectedData', '$timeout', 'retrieveSharedService', function ($rootScope, $scope, $filter, $modalInstance, broadcastService, selectedData, $timeout, retrieveSharedService) {
    $scope.IspasteEnabled = false;
    $scope.activeDate = new Date().setHours(0, 0, 0, 0);
    $scope.selectedDates = [];
    $scope.arguments = selectedData;
    var createDate = function (dteStr) {
        // $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.createDate");
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }
    function convertMonthNameToNumber(monthName) {
        var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
        var monthDigit = myDate.getMonth();
        return isNaN(monthDigit) ? 0 : (monthDigit + 1);
    }
    $scope.init = function () {
        $scope.currentDateValue = angular.copy($scope.arguments.currentDateValue);
        ///////////////////Start Revamp Paste Advance Calendar      

        $timeout(function () {
            var yearNo = parseInt(new Date("sessiontimeout").getFullYear() - 1);
            function GetPasteCalYearValues() {
                for (i = 0; i <= 2; i++) {
                    $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .yearContainerinner #firstColYear").append("<li><a href='javascript:void(0)'>" + yearNo + "</a></li>");
                    yearNo = yearNo + 1;
                }
            }
            GetPasteCalYearValues();
            function GetPasteAdvCurrentSelMonthYear(currentMonth, currentYear) {
                var localDate = new Date("sessiontimeout");
                var countdownRevRangeDate = retrieveSharedService.getCurrentRevenueStartEndDate();
                var currentMonthValue = currentMonth;
                if ((parseInt(localDate.getMonth()) + 1) > currentMonth && localDate.getFullYear() == currentYear) {
                    currentMonthValue = parseInt(createDate(countdownRevRangeDate.STRTDTE).getMonth() + 1);
                }
                //if ((localDate.getFullYear() == currentYear) && (createDate(countdownRevRangeDate.STRTDTE).getMonth() != createDate(countdownRevRangeDate.ENDDTE).getMonth())) {
                //    currentMonth = parseInt(createDate(countdownRevRangeDate.STRTDTE).getMonth() + 1);
                //}
                if (localDate.getFullYear() == currentYear) {
                    currentMonth = parseInt(createDate(countdownRevRangeDate.STRTDTE).getMonth() + 1);
                }
                $('.pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .yearContainerinner').each(function () {
                    $(this).find("li").each(function () {
                        if ($(this).text() == currentYear)
                            $(this).children().addClass("liActive")

                        if (parseInt($(this).text()) < parseInt(currentYear) && localDate.getFullYear() > parseInt($(this).text()))
                            $(this).children().addClass("liDisabled")
                    });
                });
                $('.pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer').each(function () {
                    $(this).find("li").each(function () {
                        if (convertMonthNameToNumber($(this).text()) == currentMonthValue)
                            $(this).children().addClass("liActive")
                        if (localDate.getFullYear() == currentYear && convertMonthNameToNumber($(this).text()) < currentMonth)
                            $(this).children().addClass("liDisabled")
                        else if (convertMonthNameToNumber($(this).text()) < parseInt(currentMonth) && localDate.getFullYear() > parseInt(currentYear))
                            $(this).children().addClass("liDisabled")
                    });
                });
            }
            function GetRevenueYearMonthDetail(dateVal) {
                var selObj = $rootScope.chekRevDateInLocalStorage(dateVal, $filter('translate')('msg_invalidSession'), false);
                if (selObj != null) {
                    var enddt = createDate(selObj.ENDDTE);
                    GetPasteAdvCurrentSelMonthYear((parseInt(enddt.getMonth()) + 1), enddt.getFullYear());
                }
                else {
                    GetPasteAdvCurrentSelMonthYear(parseInt(dateVal.getMonth()) + 1, dateVal.getFullYear());
                }
            }
            $(".datepicker-modal-container .pasteAdvCalendar .btn.btn-default.btn-sm.btnMultiDatePickerCal").click(function () {
                $(".calendarOver.mobileCalOver.pasteAdvCalOver").fadeIn();
                var yearMnthValue = $(".btnMultiDatePickerCal .ng-binding").text().split(" ");              
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer ul li a").removeClass("liActive");
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .yearContainerinner ul li a").removeClass("liActive");
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer ul li a").removeClass("liDisabled");
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .yearContainerinner ul li a").removeClass("liDisabled");
                GetRevenueYearMonthDetail(new Date(yearMnthValue[1], (parseInt(convertMonthNameToNumber(yearMnthValue[0])) -1), 1));
            });

            $(".calendarOver.mobileCalOver.pasteAdvCalOver .selectOC ul li .cancelCalPopup").click(function () {
                $(".calendarOver.mobileCalOver.pasteAdvCalOver").fadeOut();
            });
            $(".calendarOver.mobileCalOver.pasteAdvCalOver .selectOC .selectCalDate").click(function () {
                $(".calendarOver.mobileCalOver.pasteAdvCalOver").fadeOut();
            });
            $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer ul li a").click(function () {
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer ul li a").removeClass("liActive");
                $(this).addClass("liActive");
            });
            $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthYearCont .yearContainer .yearContainerinner #firstColYear li a").click(function () {
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthYearCont .yearContainer .yearContainerinner #firstColYear li a").removeClass("liActive");
                $(this).addClass("liActive");
                var yearValue = $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .yearContainerinner .liActive").text();
                var monthValue = $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer .liActive").text();
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer ul li a").removeClass("liActive");
                $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer ul li a").removeClass("liDisabled");
                GetRevenueYearMonthDetail(new Date(yearValue, (parseInt(convertMonthNameToNumber(monthValue)) - 1), 1))
            });
        }, 100);
        /////////////////end Revamp Paste Advance Calendar
    }
    $scope.paste = function (selectedDates) {
        if (selectedDates.length > 0) {
            $scope.IsPasteEnabled = true;
            $modalInstance.close(selectedDates);

        }
    }

    $scope.reset = function (selectedDates) {
        var cnt = selectedDates.length;
        for (var i = 0; i < cnt; i++) {
            var dt = new Date(selectedDates[i]);
            selectedDates.splice(selectedDates.indexOf(dt), 1);
            $('.paste-btn').addClass("pasteadvance");
            $('.re-btn').addClass("resetadvance");
        }
    }    
    $scope.multidateChange = function (selectedDates) {
        if (selectedDates.length != 0) {
            $scope.IsPasteEnabled = true;
            $('.paste-btn').removeClass("pasteadvance");
             $('.re-btn').removeClass("resetadvance");
        }
        else{
        $('.paste-btn').addClass("pasteadvance");
        $('.re-btn').addClass("resetadvance");
        }
        $rootScope.selDates = selectedDates;
    }
    $scope.btnMobilePasteAdvOk = function () {
        var yearValue = $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthYearCont .yearContainer .yearContainerinner #firstColYear .liActive").text();
        var monthValue = $(".pasteAdvCalendar .calendarOver.mobileCalOver.pasteAdvCalOver .monthContainer .liActive").text();
        var selectedDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), $scope.currentDateValue.getDate());
        broadcastService.notifyMultidatepickerSelect(selectedDate);
        GetRevenueYearMonthDetail(selectedDate);
    }
}])

.controller('importCalLoginCtrl', ['$rootScope', '$filter', '$scope', '$modal', 'loginService', 'constantService', 'selectedData', function ($rootScope, $filter, scope, $modal, loginService, constantService,selectedData) {
    scope.username = "";
    scope.domain = "mercer";
    scope.password = "";
    scope.loginNote = "Login using your network username and password.";
    scope.popUpName = 'importCalLoginCtrl';
    scope.enableLoginFlag = true;
    scope.animationsEnabled = true;
    var createDate = function (dteStr) {
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }
    scope.open = function (template, controller, sendData) {
        $rootScope.errorLogMethod("importCalLoginCtrl.$scope.open");
        var modalInstance = $modal.open({
            animation: scope.animationsEnabled,
            templateUrl: template,//'templates/calendar.html',
            controller: controller,//'calController',
            resolve: {
                selectedData: function () {
                    return sendData;
                }

            }
        });
    }


    scope.IsValue = function () {
        $rootScope.errorLogMethod("importCalLoginCtrl.scope.IsValue");
        if ((scope.username != "") && (scope.password != "") && (scope.domain != "")) {
            scope.enableLoginFlag = false;
            $('#loginbtnImport').removeAttr("disabled")
        }
        else {
            scope.enableLoginFlag = true;
            $('#loginbtnImport').attr("disabled", true);
        }

    }
    scope.resetField = function (value) {
        if (value == "dom")
            scope.domain = "";
        else
            scope.username = "";
        scope.IsValue();
    }

    scope.checkDisable = function () {
        $rootScope.errorLogMethod("importCalLoginCtrl.scope.checkDisable");
        return scope.enableLoginFlag;
    }



    scope.cancel = function () {
        scope.$close();
    };

   

    scope.login = function () {
        $rootScope.errorLogMethod("importCalLoginCtrl.scope.login");
        var nonADFlagObject = JSON.parse(localStorage.getItem('Login_Detail'));
        var sendData = {
            currentDate: selectedData.currentDate,
            isDailyMode: selectedData.isDailyMode,
            weekCurrentDate: selectedData.weeklyStartDate
        };
        var usernameChanged = escape(scope.username);
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        var cDate = new Date(selectedData.currentDate.valueOf());
            cDate = $filter('date') (cDate, "yyyy-MM-dd");
            var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months_ImportCal'));
            var revRangeDate = null;
            if (revMnthRange != null) {
                var updDate = new Date(cDate);
                updDate = new Date(updDate.getTime() +(updDate.getTimezoneOffset() * 60 * 1000));
                revRangeDate = angular.fromJson(revMnthRange).filter(function (item) {
                    if (item != null) {
                        if (updDate >= createDate(item.STRTDTE) && updDate <= createDate(item.ENDDTE)) {
                            return true;
        }
                        }
                    });
                                }
            if (revRangeDate != null && revRangeDate != undefined && revRangeDate.length != 0) {
                scope.revStartDate = revRangeDate[0].STRTDTE;
                scope.revEndDate = revRangeDate[0].ENDDTE;
            }
            loginService.nonADlogin(loginDetail.SESKEY, usernameChanged, scope.password, scope.domain, function (data) {
                if (parseInt(data.GETENCRYPT_OUT_OBJ.RETCD) == 0) {
                    if (data.GETENCRYPT_OUT_OBJ.CCMAIL == JSON.parse(localStorage.getItem('Initial_Data')).EMPL_REC.EMAIL) {
                        localStorage.setItem('nonADLogin', "Y");
                        scope.$close();
                        var sendData = {
                            currentDate: selectedData.currentDate,
                            isDailyMode: selectedData.isDailyMode,
                            weekCurrentDate: selectedData.weekCurrentDate,//$scope.weeklyStartDate
                            weekStartDate: selectedData.weekStartDate,
                            flag: nonADFlagObject.ISNONAD == "Y" ? "Y" : "N",
                            encKey: data.GETENCRYPT_OUT_OBJ.ENCKEY,
                            revStartDate: scope.revStartDate,
                            revEndDate: scope.revEndDate,
                            lastExpandAllText: selectedData.lastExpandAllText,
                            lastExpandClass: selectedData.lastExpandClass,
                            domain: scope.domain
                        };
                        scope.openModalCtrl = 'importCalCtrl';
                        scope.open('templates/ImportCalEntries.html', 'importCalCtrl', sendData);
                    }
                    else {
                        scope.message = constantService.SHAREDCALMSG1 + data.GETENCRYPT_OUT_OBJ.CCMAIL + constantService.SHAREDCALMSG2;
                    }
                }
                else if (data.GETENCRYPT_OUT_OBJ.ERRMSG.trim().toLowerCase().indexOf("invalid credentials") > -1 || data.GETENCRYPT_OUT_OBJ.ERRMSG.trim().toLowerCase().indexOf("invalid login") > -1 || data.GETENCRYPT_OUT_OBJ.ERRMSG.trim().toLowerCase().indexOf("invalid user credentials") > -1) {
                    scope.message = constantService.nonADinvalidMsg;
                }
                else if (data.GETENCRYPT_OUT_OBJ.ERRMSG.trim() != "") {
                    scope.message = data.GETENCRYPT_OUT_OBJ.ERRMSG;
                }

            });
        };

}])