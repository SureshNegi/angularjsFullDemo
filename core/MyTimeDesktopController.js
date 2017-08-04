/// <reference path="C:\Release2GOSSMYTIME\Mercer.MyTime\Mercer.MyTime.Web\Scripts/ui-bootstrapmultidatepicker-tpls-0.14.1.js" />
angular.module('MyTimeApp')
.controller('loginDesktopCtrl', ['$rootScope', '$scope', 'loginService', '$state', 'loadRevenueMonthsServices', '$filter', 'constantService', '$modal', '$cookieStore', '$interval', '$window', '$timeout', 'openPopUpWindowFactory', 'preferencesService', '$translate', 'i18nService', '$modalStack', 'maintenanceService', function ($rootScope, scope, loginService, $state, loadRevenueMonthsServices, $filter, constantService, $modal, $cookieStore, $interval, $window, $timeout, sharedService, preferencesService, $translate, i18nService, $modalStack, maintenanceService) {    
    scope.username = getCookie("cookieWindowUserName");
    scope.lgnPlacHolderVal = "<Enter Password>";
    if ($rootScope.isSessionExists == true) {
        $rootScope.isSessionExists = false;
        $state.go('SessionExpire');
        var windowElement = angular.element($window);
        windowElement.off('beforeunload');
    }
    $(window).bind("capsOn", function (event) {
        if ($("#txtLoginPassword:focus").length > 0) {
            document.getElementById('divCapsIndicator').style.visibility = 'visible';
        }
    });
    $(window).bind("capsOff capsUnknown", function (event) {
        document.getElementById('divCapsIndicator').style.visibility = 'hidden';
    });
    $("#txtLoginPassword").bind("focusout", function (event) {
        document.getElementById('divCapsIndicator').style.visibility = 'hidden';
    });
    $("#txtLoginPassword").bind("focusin", function (event) {
        if ($(window).capslockstate("state") === true) {
            document.getElementById('divCapsIndicator').style.visibility = 'visible';
        }
    });
    //prevent right click
    $('#txtLoginUserName').on("contextmenu", function (e) {
        e.preventDefault();
    });
    $('#txtLoginPassword').on("contextmenu", function (e) {
        e.preventDefault();
    });
    $('#txtNewPassword').on("contextmenu", function (e) {
        e.preventDefault();
    });
    $('#txtCnfrmPassword').on("contextmenu", function (e) {
        e.preventDefault();
    });
    scope.timedDisplay = "";
    scope.timerLogin = null;
    scope.loginUsernameWatermarkText = "<Enter Username>";
    if (getCookie("cookieWindowUserName").length > 0) {
        //scope.username = localStorage.getItem("_attempts_windowsUsername");
        $("#txtLoginPassword").focus();
    }
    $rootScope.transactionMessage = "Your transaction has timed out. Please click \"OK\" and try again.";
    scope.password = "";
    scope.message = "";
    scope.previousUsername = "";
    scope.newPswrd = "";
    scope.cnfrmPswrd = "";
    scope.isUsernameSaved = getCookie("cookieWindowUserName").length > 0;

    scope.lockMessage = "Your username and password are the same as your network username and password. Your network account will be locked after ##count## more unsuccessful login attempt##s##. If you need assistance please contact the service desk.";
    scope.lockedAccountMessage = "Your username and password are the same as your network username and password. Your network account is now locked. You must wait 10 minutes before you can try to access your account again. If you need assistance please contact the service desk.";
    scope.loginNote = 'Login using your network username and password.';
    $rootScope.loginMessage = 'Login using your network username and password.';
    scope.clientType = "iPhone";
    scope.defaultPassword = "mercer";
    scope.nonADPassError = "Access Denied. Please change your password on the desktop version of myTime.";
    scope.applicationVersion = constantService.APPVERSION;
    if (localStorage.getItem('Initial_Data') != null) {
        $rootScope.displayUsername = $rootScope.GetInitialDetail(false, true).EMPL_REC.FNAME + " " + $rootScope.GetInitialDetail(false, true).EMPL_REC.LNAME;
    }

    scope.sessionExpire = "";
    scope.enableLoginFlag = true;
    scope.inactivePass = $filter('translate')('msg_inactivePass');

    scope.newPassEmail = $filter('translate')('msg_newPassEmail', {
        nonadusernameVar: $rootScope.nonadusername
    });
    scope.rememberUsername = function () {
        $rootScope.errorLogMethod("loginCtrl.scope.rememberUsername");
        var remember = $('#rmembrChck').is(':checked');
        if (!remember) {
            document.cookie = "cookieWindowUserName" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
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
    scope.closetimeout = function () {
        $timeout(function () {
            $modalStack.dismissAll();
        }, 100);
        if (!$rootScope.isTimeOut) {
            sessionOut();
        }
        if ($rootScope.transactionTimeout)
            $modalStack.dismissAll();
        $rootScope.isTimeOut = false;
        $state.go('login');
    }
    scope.fieldEmpty = $filter('translate')('msg_noUsrNm');
    scope.IsValueMouseOverDiv = function () {
        scope.username = $("#txtLoginUserName").val();
        scope.password = $("#txtLoginPassword").val();
        if ((scope.username == "") & (scope.password != "")) {
            scope.fieldEmpty = 'No username is provided.';
        }
        else if ((scope.username != "") & (scope.password != "")) {
            scope.fieldEmpty = "";
        }
        else if ((scope.username != "") & (scope.password == "")) {
            scope.fieldEmpty = 'No password is provided.';
        }
        else if ((scope.username == "") & (scope.password == "")) {
            scope.fieldEmpty = 'No username is provided.';
        }
    }
    scope.IsValue = function () {
        if ((scope.username == "") & (scope.password != "")) {
            scope.fieldEmpty = 'No username is provided.';
            scope.enableLoginFlag = true;
        }
        else if ((scope.username != "") & (scope.password != "")) {
            scope.fieldEmpty = "";
            scope.enableLoginFlag = false;
        }
        else if ((scope.username != "") & (scope.password == "")) {
            scope.fieldEmpty = 'No password is provided.';
            scope.enableLoginFlag = true;
        }
        else if ((scope.username == "") & (scope.password == "")) {
            scope.fieldEmpty = 'No username is provided.';
            scope.enableLoginFlag = true;
        }
        else {
            scope.enableLoginFlag = true;
        }

    }
    scope.resetField = function () {
        scope.username = "";
        scope.IsValue();
    }
    scope.fieldEmptyChangePswrd = $filter('translate')('msg_noNewPswrd');
    scope.enableCnfrmPswrdFlag = true;
    scope.IsChangeValue = function () {
        if ((scope.newPswrd == "") && (scope.cnfrmPswrd == "")) {
            scope.fieldEmptyChangePswrd = $filter('translate')('msg_noNewPswrd');
            scope.enableCnfrmPswrdFlag = true;
        }
        else if ((scope.newPswrd != "") && (scope.cnfrmPswrd == "")) {
            scope.fieldEmptyChangePswrd = $filter('translate')('msg_noNewCnfrmPswrd');
            scope.enableCnfrmPswrdFlag = true;
        }
        else if ((scope.newPswrd != "") && (scope.cnfrmPswrd != "")) {
            if (scope.cnfrmPswrd == "") {
                scope.fieldEmptyChangePswrd = $filter('translate')('msg_noNewCnfrmPswrd');
                scope.enableCnfrmPswrdFlag = true;
            }

            if ((scope.newPswrd != scope.cnfrmPswrd)) {
                scope.fieldEmptyChangePswrd = $filter('translate')('msg_noPswrdMatch');
                scope.enableCnfrmPswrdFlag = true;
            }
            
            else {
                scope.fieldEmptyChangePswrd = "";
                scope.enableCnfrmPswrdFlag = false;
            }
        }
        else if ((scope.newPswrd != scope.cnfrmPswrd) && (scope.newPswrd == "") && (scope.cnfrmPswrd != "")) {
                scope.fieldEmptyChangePswrd = $filter('translate')('msg_noNewPswrd');
                scope.enableCnfrmPswrdFlag = true;
            }
        else if ((scope.newPswrd != scope.cnfrmPswrd) && (scope.newPswrd != "") && (scope.cnfrmPswrd == "")) {
            scope.fieldEmptyChangePswrd = $filter('translate')('msg_noNewCnfrmPswrd');
            scope.enableCnfrmPswrdFlag = true;
        }


    }
    scope.resetField = function () {
        scope.username = "";
        scope.IsValue();
    }

    scope.checkDisable = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.checkDisable");
        return scope.enableLoginFlag;
    }
    scope.getVersion = function () {
        return 'Version: ' + constantService.APPVERSION;
    }

    function getCookie(cname) {
        $rootScope.errorLogMethod("loginDesktopCtrl.getCookie");
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    var createDate = function (dteStr) {
        //$rootScope.errorLogMethod("loginDesktopCtrl.createDate");
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }

    var createDateTime = function (dateStr) {
        //$rootScope.errorLogMethod("loginDesktopCtrl.createDateTime");
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
        $rootScope.errorLogMethod("loginDesktopCtrl.updateInitialData");
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
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.loadRevenueMonths");
        var cDate = new Date();
        cDate = $filter('date')(cDate, "yyyy-MM-dd");
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, cDate, function (response) {
            var revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
            localStorage.setItem('Revenue_Months', JSON.stringify(revMnthRange));
        })
    }
    scope.Cancel = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.Cancel");
        var usernameChanged = escape(scope.username);
        loginService.SetCredentials(usernameChanged, scope.password);
        localStorage.setItem("isLoggedIn", "true");
        $rootScope.isFromloginPage = true;
        $state.go('MainDesktop');
    }
    scope.login = function () {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if (localStorage.getItem("isLoggedIn") != null && localStorage.getItem("isLoggedIn") == "true" && localStorage.getItem('Login_Detail') != null && $rootScope.globals.currentUser) {
            //$rootScope.globals.currentUser.username = localStorage.sessionUsername;
            $state.go('SessionExpire');
        }
        else {
            $rootScope.initialLoadingMessage = constantService.DESKTOPLOADMESSAGE;
            $rootScope.initialLoadingMessageTemp = constantService.DESKTOPLOADMESSAGE;
            $rootScope.transactionTimeout = false;
            $rootScope.loadingImgHidden = false;
            $rootScope.isChangePasswordCancelButton = false;
            $rootScope.loginMessage = 'Login using your network username and password.';
            $rootScope.resetpaswword = '';
            $rootScope.errorLogMethod("loginDesktopCtrl.scope.login");
            $rootScope.expandedEntries = [];
            $rootScope.collapsedEntries = [];
            $rootScope.cntrExpandCollapse = 0;
            var usernameChanged = escape(scope.username);
            loginService.ClearCredentials();
            $rootScope.ClearLocalStorage(true);
            localStorage.isEnglishLang = true;
            $rootScope.isEnglishLang = true;
            var attempts = 0;
            if (localStorage.getItem(scope.username + '_attempts') != null)
                attempts = localStorage.getItem(scope.username + '_attempts');

            localStorage.setItem(scope.username + '_attempts', attempts);
            var uAgent = escape(navigator.userAgent);
            uAgent = uAgent.substring(0, 100);
            var loginResponse = null;
            loginService.login(usernameChanged, scope.password, scope.getClientType(), scope.applicationVersion, uAgent, function (data) {
                $rootScope.chartExcludeWkndFlag = false;
                if (parseInt(data.LOGIN_OUT_OBJ.RETCD) == 4) {
                    maintenanceService.maintenanceNotification(data.LOGIN_OUT_OBJ.ERRMSG);
                }
                else if (parseInt(data.LOGIN_OUT_OBJ.RETCD) == 0) {
                    loginResponse = data;
                    localStorage.removeItem(scope.username + '_attempts');
                    var windowElement = angular.element($window);
                    windowElement.on('beforeunload', function (event) {
                        event.preventDefault();
                    });
                    localStorage.setItem('Login_Detail', JSON.stringify(data.LOGIN_OUT_OBJ));
                    scope.LOGIN_OUT_OBJ = data.LOGIN_OUT_OBJ;
                    loginService.retrieveInitialData(data.LOGIN_OUT_OBJ.SESKEY, data.LOGIN_OUT_OBJ.EMPLID).then(function (response) {
                        if (parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                            if (data.LOGIN_OUT_OBJ.ISNONAD == "Y")
                                $rootScope.nonADDetailsPassword = angular.copy(scope.password);
                            localStorage.revnotsetup = null;
                            localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                            localStorage.removeItem('Revenue_Months');
                            scope.loadRevenueMonths();
                            localStorage.setItem('InitialRev_Month', JSON.stringify(response.RETINIT_OUT_OBJ));
                            var startdate = new Date(response.RETINIT_OUT_OBJ.REVM_REC.STRTDTE);
                            var enddate = new Date(response.RETINIT_OUT_OBJ.REVM_REC.ENDDTE);
                            var currDate = new Date();
                            var tEBillData = $rootScope.GetInitialDetail(false, true);
                            scope.tEBill = tEBillData.COMP_REC.LCKSTAT;
                            if (scope.tEBill == 'Y') {
                                $rootScope.ClearLocalStorage(true);
                                scope.message = $filter('translate')('msg_TimeNotAv');
                            }
                            else {
                                var initialDataLogin = response.RETINIT_OUT_OBJ.PREF_ARR;
                                var langCode = "EN";
                                preferencesService.loadGlobalPreferences(data.LOGIN_OUT_OBJ.SESKEY).then(function (response) {
                                    if (parseInt(response.GLBPREF_OUT_OBJ.RETCD) == 0) {
                                        var globalPref = response.GLBPREF_OUT_OBJ.GLBPREF;
                                        var langObj = null;
                                        localStorage.setItem('globalPref', JSON.stringify(globalPref));
                                        if (initialDataLogin !== undefined && initialDataLogin !== null && Object.prototype.toString.call(initialDataLogin) != '[object Array]') {
                                            var data = initialDataLogin;
                                            initialDataLogin = [];
                                            initialDataLogin.push({ KEY: data.PREF_OBJ.KEY, VAL: data.PREF_OBJ.VAL });
                                        }
                                        if (initialDataLogin !== null) {
                                            langObj = initialDataLogin.filter(function (item) {
                                                return item.KEY === "LANG"
                                            });
                                        }
                                        if (langObj !== null && langObj.length > 0) {
                                            langCode = langObj[0].VAL;
                                        }
                                        else {
                                            langObj = globalPref.filter(function (item) {
                                                return item.KEY === "LANG"
                                            });
                                            if (langObj.length > 0) {
                                                langObj = langObj[0].KEYVAL_ARR;
                                            }
                                            langObj = langObj.filter(function (item) {
                                                return item.DEF == "Y"
                                            });
                                            langCode = langObj[0].KEYVAL;
                                        }
                                        if (langCode == "EN") {
                                            constantService.CURRENTLANGUAGE = constantService.ENGLISHLANGUAGEKEY;
                                        }
                                        else {
                                            constantService.CURRENTLANGUAGE = constantService.FRENCHLANGUAGEKEY;
                                            localStorage.isEnglishLang = false;
                                        }
                                        $translate.use(constantService.CURRENTLANGUAGE);
                                        i18nService.setCurrentLang(constantService.CURRENTLANGUAGE);
                                    }
                                    if (localStorage.isEnglishLang == "true")
                                        $rootScope.isEnglishLang = true;
                                    else
                                        $rootScope.isEnglishLang = false;
                                    /*redirect to changepassword for non-ad user*/
                                    if (angular.lowercase(scope.password) == scope.defaultPassword || (loginResponse.LOGIN_OUT_OBJ.ISNONAD == "Y" && angular.lowercase(scope.password.substring(0, 6)) == scope.defaultPassword)) {
                                        $rootScope.changePassword = true;
                                        $rootScope.ntwrkMessage = $filter('translate')('msg_chngDfltPass');
                                        setTimeout(function () { document.getElementById("txtNewPassword").focus(); }, 500);
                                        $timeout(function () { $rootScope.msgActive = true; }, 100);
                                        $timeout(function () { $rootScope.msgActive = false; }, 600);
                                        $state.go('login');
                                    }
                                    else if (loginResponse.LOGIN_OUT_OBJ.ISNONAD == "Y" && loginResponse.LOGIN_OUT_OBJ.NONADPASSSTATUS == "EXPIRED(GRACE)") {
                                        $rootScope.changePassword = true;
                                        $rootScope.ntwrkMessage = $filter('translate')('msg_chngDfltPass');
                                        setTimeout(function () { document.getElementById("txtNewPassword").focus(); }, 500);
                                        if (loginResponse.LOGIN_OUT_OBJ.NONADPASSSTATUS == "EXPIRED(GRACE)") {
                                            $rootScope.isChangePasswordCancelButton = true;
                                            $rootScope.ntwrkMessage = $filter('translate')('lbl_pswrdExpr1') + loginResponse.LOGIN_OUT_OBJ.NONADDAYSTOEXPIRE + $filter('translate')('lbl_pswrdExpr2')
                                        }
                                        else { $rootScope.isChangePasswordCancelButton = false; }
                                        $timeout(function () { $rootScope.msgActive = true; }, 100);
                                        $timeout(function () { $rootScope.msgActive = false; }, 600);
                                        $state.go('login');
                                    }
                                    else {
                                        loginService.SetCredentials(usernameChanged, scope.password);
                                        localStorage.setItem("isLoggedIn", "true");
                                        $rootScope.isFromloginPage = true;
                                        /*set cookie for username*/
                                        var remember = $('#rmembrChck').is(':checked');
                                        if (remember) {
                                            var expires = new Date();
                                            expires.setTime(expires.getTime() + 31536000000);
                                            document.cookie = 'cookieWindowUserName =' + scope.username + ';expires=' + expires.toUTCString();
                                        }
                                        else {
                                            document.cookie = "cookieWindowUserName" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                        }
                                        $state.go('MainDesktop');
                                    }
                                });


                            }
                        }
                        else if (response.RETINIT_OUT_OBJ.ERRMSG.trim() != "") {
                            scope.message = response.RETINIT_OUT_OBJ.ERRMSG;
                        }
                    });

                }
                else if (data.LOGIN_OUT_OBJ.ISNONAD == "Y" && data.LOGIN_OUT_OBJ.NONADPASSSTATUS == "INACTIVE") {
                    $rootScope.isInactiveNonADPassword = true;
                    $timeout(function () {
                        document.getElementById("nonadinactiveyes").focus();
                    });
                    $rootScope.nonadusername = data.LOGIN_OUT_OBJ.NONADUSERNAME;
                    $rootScope.nonADDetails = data.LOGIN_OUT_OBJ;
                    var langCode = data.LOGIN_OUT_OBJ.NONADLANG;
                    if (langCode == "EN") {
                        constantService.CURRENTLANGUAGE = constantService.ENGLISHLANGUAGEKEY;
                    }
                    else {
                        constantService.CURRENTLANGUAGE = constantService.FRENCHLANGUAGEKEY;
                        localStorage.isEnglishLang = false;
                    }
                    $translate.use(constantService.CURRENTLANGUAGE);
                    scope.message = ""
                }
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
                else if (data.LOGIN_OUT_OBJ.ERRMSG.trim() == "" && parseInt(response.RETINIT_OUT_OBJ.RETCD) == 2) {
                    scope.message = "";
                }
            });
        }
    };
    scope.visibleNtwrkMsg = true;
    scope.change = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.change");
        scope.visibleNtwrkMsg = false;
        var regularExpression = /^(?=.*?[0-9])/;
        var regularExpression2 = /^[ A-Za-z0-9_@[{}|\\"';:~`<>?,!_\]$%^*()=./#&+-]*$/
        //var regularExpression2 = /^(?=.*[*@!.$#%&()^~{}]).{1,}$/;
        var regularExpression3 = /^(?=.*[A-Z]).{1,}$/;
        if (scope.newPswrd.length < 8)
            scope.confrmMessage = "Password must be at least 8 characters long.";
        else if (!regularExpression.test(scope.newPswrd)) {
            scope.confrmMessage = "Passwords must include at least one numeric (0-9) character";
        }
        else if ((!regularExpression3.test(scope.newPswrd)) & (!regularExpression2.test(scope.newPswrd))) {
            scope.confrmMessage = "Passwords must include at least one punctuation mark, symbol, or alternate case (upper/lower).";
        }
        else {
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            if (loginDetail.ISNONAD == "Y") {
                loginService.changePassword(loginDetail.SESKEY, scope.newPswrd, $rootScope.nonADDetailsPassword, function (data) {
                    if (parseInt(data.CHPW_OUT_OBJ.RETCD) == 0) {
                        var usernameChanged = escape(scope.username);
                        loginService.SetCredentials(usernameChanged, scope.newPswrd);
                        localStorage.setItem("isLoggedIn", "true");
                        $rootScope.isFromloginPage = true;
                        $state.go('MainDesktop');
                    }
                    else if (data.CHPW_OUT_OBJ.ERRMSG.trim() != "") {
                        scope.confrmMessage = data.CHPW_OUT_OBJ.ERRMSG;
                    }

                });
            }
            else {
                loginService.changePassword(loginDetail.SESKEY, scope.newPswrd, scope.defaultPassword, function (data) {
                    if (parseInt(data.CHPW_OUT_OBJ.RETCD) == 0) {
                        var usernameChanged = escape(scope.username);
                        loginService.SetCredentials(usernameChanged, scope.newPswrd);
                        localStorage.setItem("isLoggedIn", "true");
                        $rootScope.isFromloginPage = true;
                        $state.go('MainDesktop');
                    }
                    else if (data.CHPW_OUT_OBJ.ERRMSG.trim() != "") {
                        scope.confrmMessage = data.CHPW_OUT_OBJ.ERRMSG;
                    }

                });
            }
        }
    }
    scope.$on("LogoutGridLayout", function (event, result) {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.$on.LogoutGridLayout");
        scope.logout();
    });    
    scope.$on("maintenanceNotificationBroadcast", function (event, args) {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.$on.maintenanceNotificationBroadcast");
        $modalStack.dismissAll();
        var msgMaintenance = args.value;
        maintenanceService.maintenanceNotification(msgMaintenance);
    });
    //Sangeeta -logout functionality
    scope.logout = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.logout");
        if (localStorage.getItem('isMainGridLayoutChange') == "1") {
            if ((!$rootScope.dailyCustomFlag && localStorage['isDailyMode'] == "true") || (!$rootScope.weeklyCustomFlag && localStorage['isDailyMode'] == "false"))
                var sendData = {
                    msgList: [$filter('translate')('msg_cfrmMainGridSveLayOut')],
                    isCancelBtnOn: true,
                    okBtnText: $filter('translate')('btn_Yes'),
                    noBtnTxt: $filter('translate')('btn_No'),
                    popUpName: 'ConfrmSaveMainGrdLayout',
                    methodName: 'logout'
                };
            else
                var sendData = {
                    msgList: [$filter('translate')('msg_overrideMainGridSveLayOut')],
                    isCancelBtnOn: true,
                    okBtnText: $filter('translate')('btn_Yes'),
                    noBtnTxt: $filter('translate')('btn_No'),
                    popUpName: 'OverrideSaveMainGrdLayout',
                    methodName: 'logout'
                };
            sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
        }
        else {

            if (!$rootScope.columnBlank) {
                $rootScope.transactionTimeout = false;
                $rootScope.loadingImgHidden = false;
                $rootScope.rowIndex = undefined;
                $rootScope.isLineClicked = true;
                $rootScope.changePassword = false;
                var uAgent = escape(navigator.userAgent);
                uAgent = uAgent.substring(0, 100);
                $rootScope.isPanelOpen = false;
                $rootScope.isCallAtInterval = false;
                $rootScope.expandedEntries = [];
                $rootScope.collapsedEntries = [];
                $rootScope.cntrExpandCollapse = 0;
                $interval.cancel($rootScope.callBroadcastAtInterval);
                $interval.cancel($rootScope.callMonthEndAtInterval);
                $rootScope.isCallBroadcastAtInterval = false;
                var loginDtls = $rootScope.GetLoginDetail(true, true);
                loginService.ClearCredentials();
                $rootScope.ClearLocalStorage(true);
                loginService.logout(loginDtls.SESKEY, uAgent, function (data) {
                    $rootScope.ClearLocalStorage(true);
                    var windowElement = angular.element($window);
                    windowElement.off('beforeunload');
                    $state.go('login');
                });
            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')],
                    isProjectTaskInvalid: true
                };
                scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
    };

    scope.$on("sessionExpire", function (event, args) {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.$on.sessionExpire");
        if ($rootScope.isTimeOut) {
            $rootScope.isTimeOut = false;
            $state.go('login');

        }
    });

    scope.$on("transactionTimeout", function (event, args) {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.$on.transactionTimeout");
        $modalStack.dismissAll();
        $rootScope.transactionTimeout = true;
        var timedout = $modal.open({
            templateUrl: 'timedout-dialogDesktop.html',
            windowClass: 'modal-danger'
        });
        timedout.result.then(function () {
        },
        function () {
            $modalStack.dismissAll();
            $state.go('login');
        });
    });

    scope.$on("LogOut", function (event, args) {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.$on.LogOut");
        scope.logout();
    });
    //Sangeeta -logout functionality
    scope.sessionExpireOk = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.sessionExpireOk");
        $timeout(function () { $modalStack.dismissAll(); }, 100);
        if (!$rootScope.isTimeOut) {
            sessionOut();
        }
        if ($rootScope.transactionTimeout)
            $modalStack.dismissAll();
        $rootScope.isTimeOut = false;
        $state.go('login');
    };

    scope.sessionExpireInit = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.sessionExpireInit");
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
    scope.showUntilSeconds = function (seconds) {
        var tempUNDisplay = "";
        var tempPassDisplay = "";
        if (scope.username != undefined && scope.username.length == 0)
            tempUNDisplay = "UN ";
        else
            tempUNDisplay = "";

        if (scope.password.length == 0)
            tempPassDisplay = "PW ";
        else
            tempPassDisplay = "";

        scope.$apply(function () {
            scope.timedDisplay = tempUNDisplay + tempPassDisplay;
        });
        if (scope.timerLogin != null)
            $timeout.cancel(scope.timerLogin);
        scope.timerLogin = $timeout(function () { scope.timedDisplay = ""; }, (parseInt(seconds) * 1000));
    }

    $('.timedDisplay').mouseover(function () {
        scope.showUntilSeconds(constantService.DESKTOPDISPLAYSECONDS);
    });
    $('.timedDisplay').keyup(function () {
        scope.showUntilSeconds(constantService.DESKTOPDISPLAYSECONDS);
    });

    var sessionOut = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.sessionOut");
        var uAgent = escape(navigator.userAgent);
        uAgent = uAgent.substring(0, 100);
        $rootScope.isPanelOpen = false;
        var loginDtls = $rootScope.GetLoginDetail(true, false); // JSON.parse(localStorage.getItem('Login_Detail'));
        if (loginDtls != null) {
            $interval.cancel($rootScope.callBroadcastAtInterval);
            $interval.cancel($rootScope.callMonthEndAtInterval);
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
    $rootScope.initialLoadingMessage = $filter('translate')('msg_wait');
    $rootScope.initialLoadingMessageTemp = $filter('translate')('msg_wait');
    scope.proceed = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.proceed");
        $rootScope.resetpaswword = ""; $rootScope.loginMessage = ""; scope.message = '';
        loginService.resetPassword(parseInt($rootScope.nonADDetails.EMPLID), function (data) {
            if (parseInt(data.RESETPW_OUT_OBJ.RETCD) == 0) {
                $rootScope.resetpaswword = 'Login using your network username and password.';
                $rootScope.resetpaswword += "<br/>";
                $rootScope.resetpaswword += ' Email sent.';
                $rootScope.loginMessage = angular.copy($rootScope.resetpaswword);
                $rootScope.isInactiveNonADPassword = false;
            }
        });

    }
    scope.close = function () {
        $rootScope.errorLogMethod("loginDesktopCtrl.scope.close");
        $rootScope.isInactiveNonADPassword = false;
    }
    //$timeout(function () { $("#txtLoginPassword").focus();}, 200);
}])

//.controller('ErrorPopup', ['$rootScope', '$scope', '$modalInstance', '$state', 'selectedData', function ($rootScope, $scope, $modalInstance, $state, selectedData) {

//    $scope.popUpName = 'ErrorPopup';
//    $scope.selectedData = selectedData;
//    $scope.isCancelBtnOn = selectedData.isCancelBtnOn;
//    $scope.ok = function () {
//        $rootScope.errorLogMethod("ErrorPopup.$scope.ok");
//        $modalInstance.close();
//    };


//    $scope.cancel = function () {
//        $rootScope.errorLogMethod("ErrorPopup.$scope.cancel");
//        $modalInstance.dismiss('cancel');
//    };
//    $scope.isError = false;
//    $scope.message = '';
//    $scope.init = function () {
//        $rootScope.errorLogMethod("ErrorPopup.$scope.init");
//        angular.element(document.getElementsByClassName('modal-dialog')).addClass("positionTop");
//        angular.element(document.getElementsByClassName('modal-content')).addClass("mcontent");
//        $scope.isError = $scope.selectedData.isError;
//        $scope.message = $scope.selectedData.message;
//    }
//}])

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
        $scope.isError = $scope.selectedData.isError;
        $scope.message = $scope.selectedData.message;
        $scope.isDailyModeOption = $scope.selectedData.isDailyModeOption;

    }
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

.controller('calDesktopController', ['$scope', '$rootScope', '$filter', '$localStorage', 'broadcastService', 'loadRevenueMonthsServices', function ($scope, $rootScope, $filter, $localStorage, broadcastService, loadRevenueMonthsServices) {
    $scope.dateSubmitArray = [];
    if ($localStorage.dateVal != undefined) {

        $scope.dateSubmitArray = null;
        $scope.dateSubmitArray = angular.fromJson($localStorage.dateVal);
        $scope.dateSubmitArray.formats = 'dd/MM/yyyy';
    }

    $scope.move = function (direction) {
        $rootScope.errorLogMethod("calDesktopController.$scope.move");
        broadcastService.notifyMoveCalendar(direction);
    }

    $scope.todayNew = function () {
        $rootScope.errorLogMethod("calDesktopController.$scope.todayNew");
        broadcastService.notifyTodayCalendar();
    }

    $scope.yearUp = function () {
        $rootScope.errorLogMethod("calDesktopController.$scope.yearUp");
        var SelDate = $filter('date')(new Date($scope.dt), "yyyy-MM-dd");
        var updDate = new Date(SelDate);
        $scope.dt = new Date($scope.dt);
        $scope.dt.setYear(updDate.getFullYear() + 1);
        $scope.dt.setHours(0, 0, 0, 0)
        broadcastService.notifyYearUpCalendar($scope.dt);
    }

    $scope.yearDown = function () {
        $rootScope.errorLogMethod("calDesktopController.$scope.yearDown");
        var SelDate = $filter('date')(new Date($scope.dt), "yyyy-MM-dd");
        var updDate = new Date(SelDate);
        $scope.dt = new Date($scope.dt);
        $scope.dt.setYear(updDate.getFullYear() - 1);
        $scope.dt.setHours(0, 0, 0, 0)
        broadcastService.notifyYearUpCalendar($scope.dt);
    }
    $scope.today = function () {
        $rootScope.errorLogMethod("calDesktopController.$scope.today");
        if ($rootScope.isMobileOrTab)
            $scope.dt = new Date();
            //else {
            //    var tempTodayDate = new Date();
            //    var currentTimezone = tempTodayDate.getTimezoneOffset();
            //    tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
            //    $scope.dt = tempTodayDate;
            //}
        else
            $scope.dt = angular.copy($rootScope.currentSelectedDate);
    };
    $scope.today();

    $scope.$on("updateUiCalSelectedDate", function (event, args) {
        $rootScope.errorLogMethod("calDesktopController.$scope.$on.updateUiCalSelectedDate");
        $scope.dt = new Date(args.value.valueOf());
    });

    var initialDetail = $rootScope.GetInitialDetail(false, true);
    var hrs = initialDetail.EMPL_REC.REQHRS;
    //Function for showing dates red  
    $scope.dateError = function (date, mode) {
        $rootScope.errorLogMethod("calDesktopController.$scope.dateError");
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
        $rootScope.errorLogMethod("calDesktopController.$scope.dateHighlight");
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
        $rootScope.errorLogMethod("calDesktopController.$scope.dateChange");
        $scope.dt = new Date(angular.element(document.getElementById('selectedValue'))[0].value);
        if (localStorage.calendarchange != "true") {
            // $scope.ok();
        }
        $scope.changeDate = $scope.dt;

    };

    /*updating the daily grid*/
    $scope.$watch('dt', function () {
        $rootScope.errorLogMethod("calDesktopController.$scope.$watch.dt");
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
                            var currentdt = angular.copy($scope.dt);
                            currentdt.setHours(0, 0, 0, 0);
                            if (angular.isUndefined(localStorage.currentdtForGetData) || localStorage.currentdtForGetData != currentdt) {
                                broadcastService.notifyUiGrid($scope.dt)
                                localStorage.currentdtForGetData = currentdt;
                            }
                            localStorage.clearGroupingDateChanged = "1";
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

}])

.controller('deviceCtrl', ["$scope", "deviceDetector",
    function ($scope, deviceDetector) {
        $rootScope.errorLogMethod("deviceCtrl.fn.deviceDetector");
        $scope.name = 'World';
        $scope.deviceDetector = deviceDetector;
    }])


.controller('multidatepickerCtrlDesktop', ['$rootScope', '$scope', '$filter', '$modalInstance', 'arguments', 'broadcastService', '$q', '$timeout', 'retrieveSharedService', function ($rootScope, $scope, $filter, $modalInstance, arguments, broadcastService, $q, $timeout, retrieveSharedService) {
    $scope.IspasteEnabled = false;
    $rootScope.arrdateStart = null;
    $scope.activeDate = new Date().setHours(0, 0, 0, 0);
    $scope.selectedDates = [];
    $scope.selectedWeekendDates = [];
    //$rootScope.IsBroadcastIncludeWeekend = false;
    var dateDisableDeferred = $q.defer();
    $scope.dateDisablePromise = dateDisableDeferred.promise;
    $scope.arguments = arguments;

    var disableModeIsLessThan = true;
    $scope.init = function () {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.init");
        $scope.currentDateValue = angular.copy($scope.arguments.currentDateValue);
    }
    $scope.isDateDisabled = function (date, mode) {
        $rootScope.errorLogMethod("deviceCtrl.$scope.isDateDisabled");
        if (disableModeIsLessThan && mode == "day") {
            if (date.getDay() === 0 || date.getDay() === 6) {
                return true;
            } else {
                return false;
            }
        }
        else {
            return false;
        }

    };

    //$scope.pasteadvTodayDate = function () {
    //    $scope.reset(selectedDates);
    //    var tempTodayDate = new Date();
    //    var currentTimezone = tempTodayDate.getTimezoneOffset();
    //    tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
    //    tempTodayDate.setHours(0, 0, 0, 0, 0);
    //    selectedDates.push(tempTodayDate);
    //    angular.element('#pasteAdvanceDiv').focus();


    //}
    $scope.includeWeekend = function (val, selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.includeWeekend");
        //selectedDates = [];
        //if($('.paste-btn').hasClass("pasteadvance")){
        //$rootScope.IsBroadcastIncludeWeekend = true;
        $scope.$broadcast('includeWeekend');
        // }
        //else{
        //$rootScope.IsBroadcastIncludeWeekend = false; 
        //   $scope.$broadcast('includeWeekend');
        //}
        var chkweek = document.getElementById(val);
        //$(".btn.btn-default.btn-sm").removeClass("btn-info");
        if (chkweek.checked) {
            localStorage.setItem("includeweekend", "1");
            disableModeIsLessThan = false;
        }
        else {
            localStorage.setItem("includeweekend", "0");
            disableModeIsLessThan = true;


        }
        dateDisableDeferred.notify(new Date().getTime());
        var tempSelectedDate = angular.copy(selectedDates);
        selectedDates = [];
        for (var i = 0; i < tempSelectedDate.length; i++) {
            selectedDates.push(tempSelectedDate[i]);
        }
        checkSelectedDates(selectedDates);
    }

    $scope.paste = function (selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.paste");
        if (!$('.paste-btn').hasClass("pasteadvance")) {
            var dt = new Date("1900-01-01");
            for (var i = 0; i < selectedDates.length; i++) {
                var index = selectedDates.indexOf(dt.setHours(0, 0, 0, 0));
                if (index == 0)
                    selectedDates.splice(index, 1);
            }
            if (selectedDates.length > 0) {
                $scope.IspasteEnabled = true;
                $modalInstance.close(selectedDates);

            }
        }
    }

    $scope.reset = function (selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.reset");
        if (!$('.paste-btn').hasClass("pasteadvance")) {
            //$scope.selectedWeekendDates = [];
            var cnt = selectedDates.length;
            for (var i = 0; i < cnt; i++) {
                var dt = new Date(selectedDates[i]);
                selectedDates.splice(selectedDates.indexOf(dt), 1);
                $('.paste-btn').addClass("pasteadvance");
                $('.re-btn').addClass("resetadvance");
            }
            if (cnt > 0)
                $scope.$broadcast('refreshDatepickers');
            $scope.IspasteEnabled = false;
        }
    }
    function checkSelectedDates(selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.fn.checkSelectedDates");
        var dt = new Date("1900-01-01");
        var cnt = selectedDates.length;
        var revobj = JSON.parse(localStorage.getItem('Initial_Data')).REVM_REC;
        for (var i = 0; i < cnt; i++) {
            var index = selectedDates.indexOf(dt.setHours(0, 0, 0, 0));
            if (selectedDates.length == 1 && index >= 0)
                $scope.IspasteEnabled = false;
            else {
                if ((new Date(selectedDates[i]) >= createDate(revobj.STRTDTE))) {                    
                    $scope.IspasteEnabled = true;
                    var dtValue = new Date(selectedDates[i]);
                    if ((dtValue.getDay() == 0 || dtValue.getDay() == 6) && localStorage.getItem("includeweekend") == "0")
                        $scope.IspasteEnabled = false;
                    else {
                        $scope.IspasteEnabled = true;
                        break;
                    }
                }
                else {
                    $scope.IspasteEnabled = false;
                    var dtRemove = new Date(selectedDates[i]);
                    selectedDates.splice(selectedDates.indexOf(dtRemove.setHours(0, 0, 0, 0)), 1);
                }
            }

        }

    }
    $scope.multidateChange = function (selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.multidateChange");
        //    var dt = new Date("1900-01-01");
        //var index = selectedDates.indexOf(dt.setHours(0, 0, 0, 0));
        //if (index == 0)
        //selectedDates.splice(index, 1);
        //$scope.selectedWeekendDates=[];   
        if (selectedDates.length != 0) {
            //for (var i = 0; i < selectedDates.length; i++) {

            //    if ($scope.selectedWeekendDates.indexOf(selectedDates[i]) == -1) {
            //    $scope.selectedWeekendDates.push(selectedDates[i]);
            //    }
            //}
            //if (selectedDates.length == 1 && index >= 0)
            //    $scope.IspasteEnabled = false;
            //else
            //    $scope.IspasteEnabled = true;
            //if (!$rootScope.IsBroadcastIncludeWeekend) {
            //    $('.paste-btn').removeClass("pasteadvance");
            //    $('.re-btn').removeClass("resetadvance");
            checkSelectedDates(selectedDates);

            //}
        }

        else {
            $scope.IspasteEnabled = false;
            $('.paste-btn').addClass("pasteadvance");
            $('.re-btn').addClass("resetadvance");
        }
        //selectedDates = [];
        $rootScope.selectedDates = selectedDates;
    };
    $scope.closeMultidatepicker = function (selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.closeMultidatepicker");
        $rootScope.pasteAdvancePopup = false;
        var cnt = selectedDates.length;
        for (var i = 0; i < cnt; i++) {
            var dt = new Date(selectedDates[i]);
            selectedDates.splice(selectedDates.indexOf(dt), 1);
        }
        // $(".datepicker-modal-container").css("display", "none");
        $modalInstance.close();
    }
    $scope.today = function (selectedDates) {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.today");
        //$scope.reset(selectedDates);      
        //     var tempTodayDate = new Date();
        //    var currentTimezone = tempTodayDate.getTimezoneOffset();
        //    tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));                  
        //    tempTodayDate.setHours(0, 0, 0, 0, 0);
        broadcastService.notifyMultidatepickerTodayCalendar();

    }
    ///////////////////Start Revamp Multidatepicker
    function convertMonthNameToNumber(monthName) {
        var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
        var monthDigit = myDate.getMonth();
        return isNaN(monthDigit) ? 0 : (monthDigit + 1);
    }
    var createDate = function (dteStr) {
        //$rootScope.errorLogMethod("UibDatepickerController.createDate");
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }
    $timeout(function () {
        $("#pasteAdvanceDiv .pasteAdvCalendar .calWeekbtnCont .caltodayCont.multidatecont .datepickerCont .month-head .btnMultiDatePickerCal").click(function () {
            $(".calAdvCalOver.calendarOver").animate({ top: 0 });
            var yearMnthValue = $(".btnMultiDatePickerCal .ng-binding").text().split(" ");
            $(".multidatecont .monthContainer ul li a").removeClass("liActive");
            $(".multidatecont .yearContainerinner ul li a").removeClass("liActive");
            $(".multidatecont .monthContainer ul li a").removeClass("liDisabled");
            $(".multidatecont .yearContainerinner ul li a").removeClass("liDisabled");
            GetRevenueYearMonthDetail(new Date(yearMnthValue[1], (parseInt(convertMonthNameToNumber(yearMnthValue[0])) - 1), 1));
        });
        $("#pasteAdvanceDiv .pasteAdvCalendar .calWeekbtnCont .caltodayCont.multidatecont .calendarOver.calAdvCalOver .cancelCalPopup").click(function () {
            $(".calAdvCalOver.calendarOver").animate({ top: -275 });
        });

        $(".multidatecont .selectOC .cancelCalPopup").click(function () {
            $(".multidatecont .calendarOver").animate({ top: "-276px" }, 300);
        });
        $(".multidatecont .selectOC .selectCalDate").click(function () {
            $(".multidatecont .calendarOver").animate({ top: "-276px" }, 300);
        });
        $(".multidatecont .monthContainer ul li a").click(function () {
            if ($(this).hasClass("liDisabled"))
                return;
            $(".multidatecont .monthContainer ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });

        var yearNo = parseInt(new Date("sessiontimeout").getFullYear() - 1);        
        function GetMultidatepickerCurrentSelectedDates(currentMonth, currentYear) {
            var localDate = new Date("sessiontimeout");
            var countdownRevRangeDate = retrieveSharedService.getCurrentRevenueStartEndDate();
            var currentMonthValue = currentMonth;
            if ((parseInt(localDate.getMonth()) + 1) > currentMonth && localDate.getFullYear() == currentYear) {
                currentMonthValue = parseInt(createDate(countdownRevRangeDate.STRTDTE).getMonth() + 1);
            }
            if (localDate.getFullYear() == currentYear)
                currentMonth = parseInt(createDate(countdownRevRangeDate.STRTDTE).getMonth() + 1);
            //if ((localDate.getFullYear() == currentYear) && (createDate(countdownRevRangeDate.STRTDTE).getMonth() != createDate(countdownRevRangeDate.ENDDTE).getMonth())) {
            //    currentMonth = parseInt(createDate(countdownRevRangeDate.STRTDTE).getMonth() + 1);
            //}          
            
            $('.multidatecont .yearContainerinner').each(function () {
                $(this).find("li").each(function () {
                    if ($(this).text() == currentYear)
                        $(this).children().addClass("liActive")

                    if (parseInt($(this).text()) < parseInt(currentYear) && localDate.getFullYear() > parseInt($(this).text()))
                        $(this).children().addClass("liDisabled")
                });
            });            
            $('.multidatecont .monthContainer').each(function () {
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
        GetRevenueYearMonthDetail = function (dateVal) {
            var selObj = $rootScope.chekRevDateInLocalStorage(dateVal, $filter('translate')('msg_invalidSession'), false);
            if (selObj != null) {
                var enddt = createDate(selObj.ENDDTE);
                GetMultidatepickerCurrentSelectedDates((parseInt(enddt.getMonth()) + 1), enddt.getFullYear());
            }
            else
                GetMultidatepickerCurrentSelectedDates(parseInt(dateVal.getMonth()) + 1, dateVal.getFullYear());
        }
        function GetMultiDatePickerYearValues() {

            for (i = 0; i <= 2; i++) {
                $("#pasteAdvanceDiv .calWeekbtnCont .caltodayCont.multidatecont .calendarOver.calAdvCalOver .monthYearCont .yearContainer .yearContainerinner #firstColYear1").append("<li><a href='javascript:void(0)'>" + yearNo + "</a></li>");
                yearNo = yearNo + 1;
            }
            $("#pasteAdvanceDiv .pasteAdvCalendar.desktopAdvCalendar .calWeekbtnCont .caltodayCont.multidatecont .calendarOver.calAdvCalOver .monthYearCont .yearContainer .yearContainerinner #firstColYear1 li a").click(function () {
                if ($(this).hasClass("liDisabled"))
                    return;
                $("#pasteAdvanceDiv .pasteAdvCalendar.desktopAdvCalendar .calWeekbtnCont .caltodayCont.multidatecont .calendarOver.calAdvCalOver .monthYearCont .yearContainer .yearContainerinner #firstColYear1 li a").removeClass("liActive");
                $(this).addClass("liActive");
                var yearValue = $(".multidatecont .yearContainerinner .liActive").text();
                var monthValue = $(".multidatecont .monthContainer .liActive").text();
                $(".multidatecont .monthContainer ul li a").removeClass("liActive");
                $(".multidatecont .monthContainer ul li a").removeClass("liDisabled");
                GetMultidatepickerCurrentSelectedDates((parseInt(convertMonthNameToNumber(monthValue))), yearValue);
            });
        }

        GetMultiDatePickerYearValues();
    }, 100);
    $scope.btnPasteAdvOk = function () {
        var yearValue = $(".multidatecont .yearContainerinner .liActive").text();
        var monthValue = $(".multidatecont .monthContainer .liActive").text();
        var selectedDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), $scope.currentDateValue.getDate());
        broadcastService.notifyMultidatepickerSelect(selectedDate);
        GetRevenueYearMonthDetail(selectedDate);       
    }
    ///////////////////End Revamp Multidatepicker
}])

.controller('importCalDesktopCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', '$state', '$rootScope', '$timeout', '$window', 'uiGridConstants', 'constantService', 'importCalService', 'arguments', '$modal', '$document', '$interval', 'resizeWindowService', function ($rootScope, $filter, $scope, $modalInstance, $state, $rootScope, $timeout, $window, uiGridConstants, constantService, importCalService, selectedData, $modal, $document, $interval, resizeWindowService) {
    $scope.refreshGridOutlook = true;
    $scope.searchOptions = { sDate: true, eDate: true, hrs: true, subject: true };
    $scope.searchText = "";
    $scope.srchTxt = $filter('translate')('lbl_srchTxt');
    $scope.recTitle = $filter('translate')('lbl_rec');
    var menuFlag = false;
    $scope.isMinimize = true;
    var widthHours = 56;
    var settings = resizeWindowService.getMaxMinSettings(10, 23, 23, 800, 293);
    $scope.maxMode = settings[1];
    $scope.maxMode.innerHeight = $scope.maxMode.height - $scope.maxMode.topHeader - 5;
    $scope.maxMode.gridHeight = $scope.maxMode.innerHeight - $scope.maxMode.section1Hgt - 10;
    $scope.maxMode.gridWidth = $scope.maxMode.width - 10;
    $scope.maxMode.gridViewPortHeight = $scope.maxMode.gridHeight - 24;

    $scope.minMode = settings[0];
    $scope.minMode.innerHeight = $scope.minMode.height - $scope.minMode.topHeader - 5;
    $scope.minMode.gridHeight = $scope.minMode.innerHeight - $scope.minMode.section1Hgt - 10;
    $scope.minMode.gridWidth = $scope.minMode.width - 10;
    $scope.minMode.gridViewPortHeight = $scope.minMode.gridHeight - 24;


    $scope.windowConfig = angular.copy($scope.minMode);
    localStorage.gridImportCalVwportHeight = $scope.windowConfig.gridViewPortHeight;
    $rootScope.isMinimize = true;
    $scope.resizeWindow = function (isMinimize) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.resizeWindow");
        hideOtherDropDown();
        if ($scope.gridApi !== undefined) {
            $scope.sortInfo = $scope.gridApi.grid.getColumnSorting();
            $scope.state = $scope.gridApi.saveState.save();
        }
        $rootScope.isMinimize = isMinimize;
        $scope.isMinimize = isMinimize;
        if ($scope.isMinimize) {
            $scope.minMode.isRendered = false;
            $scope.windowConfig = $scope.minMode;
            $("#importCalPopUp").draggable("enable");
        }
        else {
            $scope.maxMode.isRendered = false;
            $scope.windowConfig = $scope.maxMode;
            $("#importCalPopUp").draggable({
                disabled: true
            });
        }

        localStorage.gridImportCalVwportHeight = $scope.windowConfig.gridViewPortHeight;
        $timeout(function () {
            $scope.windowConfig.isRendered = true;
            $scope.windowConfig.isRefreshGrid = true;
        }, 10)

    }
    var bindGridData = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.var.bindGridData");
        if ($scope.windowConfig.isFavMode) {
            $timeout(function () {
                $scope.gridOptions1.totalItems = $scope.windowConfig.tab1TtlItem;
                $scope.gridOptions1.data = gridDataAr;
                $scope.gridOptions1.enableHorizontalScrollbar = 1;
                localStorage.GroupingCalledCEPFav = "1";
            }, 100);
        }
    }
    $scope.MeetingTitle = $filter('translate')('lbl_MeetingTitle');
    $scope.AptTitle = $filter('translate')('lbl_AptTitle');
    var item = $filter('translate')('lbl_item');
    var items = $filter('translate')('lbl_items');
    $scope.getHeader = function (row) {
        var groupValue = row.treeNode.aggregations[0].groupVal;
        if (row.treeNode.aggregations[0].col.displayName == $filter('translate')('tab_Day'))
            groupValue = $filter('date')(groupValue, 'EEEE, MMMM dd, yyyy')
        else if (row.treeNode.aggregations[0].col.displayName == $filter('translate')('lbl_StartTime') || row.treeNode.aggregations[0].col.displayName == $filter('translate')('lbl_EndTime'))
            groupValue = $filter('date')(groupValue, 'hh:mm a')
        return row.treeNode.aggregations[0].col.displayName + ": " + groupValue + " (" + row.treeNode.aggregations[0].value + (row.treeNode.aggregations[0].value > 1 ? " " + items + ")" : " " + item + ")");
    }
    var columnDefsImport = [
                { cellClass: 'gridImportCalWindow', name: 'View', enableColumnMenu: false, enableSorting: false, suppressRemoveSort: true, displayName: '', width: 40, enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%"><div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div><div ng-if="!row.groupHeader" value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{(row.entity.ISMTG | uppercase) == \'Y\'?grid.appScope.MeetingTitle:grid.appScope.AptTitle}}"><input ng-class="(row.entity.ISMTG | uppercase) == \'Y\'?\'entry-meeting\':\'entry-appointment\'" ng-click="grid.appScope.viewDetail(row.entity)" type="image" id="imgGridDeleteEdit" /></div></div>' },

                {
                    name: 'STRTTIM_Hrs', sort: { direction: uiGridConstants.ASC, priority: 0, }, width: 105, groupingShowAggregationMenu: false, headerCellClass: 'startTimeHeader', suppressRemoveSort: true, displayName: $filter('translate')('lbl_StartTime'), enableCellEdit: false, enableColumnResizing: false,
                    cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell" title="{{(row.entity.STRTTIM_Hrs)| date:\'EEE, MMM dd, yyyy hh:mm a\'}}">{{(row.entity.STRTTIM_Hrs | date:"hh:mm a")}}</div>', allowCellFocus: true,

                },
                        {
                            name: 'ENDTIM_hrs', groupingShowAggregationMenu: false, headerCellClass: 'startTimeHeader', width: 95, suppressRemoveSort: true, displayName: $filter('translate')('lbl_EndTime'), enableCellEdit: false, enableColumnResizing: false,
                            cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell" title="{{(row.entity.STRTTIM_Hrs)| date:\'EEE, MMM dd, yyyy hh:mm a\'}}">{{(row.entity.ENDTIM_hrs | date:"hh:mm a")}}</div>', allowCellFocus: true,

                        },
            {
                name: 'HRS', groupingShowAggregationMenu: false, headerCellClass: 'startTimeHeader', width: 65, suppressRemoveSort: true, displayName: $filter('translate')('lbl_HrsFull'), enableCellEdit: false, enableColumnResizing: false,
                cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell rightAlig" >{{row.entity.HRS}}</div>', allowCellFocus: true,
            },
            {
                name: 'SUBJ', groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_Subject'), enableCellEdit: false, enableColumnResizing: false,
                cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell" title="{{row.entity.SUBJ}}">{{row.entity.SUBJ}}</div>', allowCellFocus: true,
            }

    ];

    var columnDefsImportWeek = [
                {
                    cellClass: 'gridImportCalWindow', name: 'View', suppressRemoveSort: true, enableSorting: false, enableColumnMenu: false, displayName: '', width: 40, enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%"><div class="myTimeHeaderClass" ng-if="row.groupHeader" >{{grid.appScope.getHeader(row)}}</div><div ng-if="!row.groupHeader" value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{(row.entity.ISMTG | uppercase) == \'Y\'?grid.appScope.MeetingTitle:grid.appScope.AptTitle}}"><input ng-class="(row.entity.ISMTG | uppercase) == \'Y\'?\'entry-meeting\':\'entry-appointment\'" ng-click="grid.appScope.viewDetail(row.entity)" type="image" id="imgGridDeleteEdit" /></div></div>'
                },
                { name: 'Recurring', suppressRemoveSort: true, enableSorting: false, enableColumnMenu: false, displayName: '', width: 25, enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div  title="{{grid.appScope.recTitle}}" value={{row.entity}} ng-class="(row.entity.ISREC | uppercase) == \'Y\' ?\'icon-delete ui-grid-cell-contents entry-rec\':\'icon-delete ui-grid-cell-contents\'" ></div>' },
                {
                    name: 'WeekCalDay', sort: { direction: uiGridConstants.ASC, priority: 0, }, field: 'WEEKDAY', enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, enableColumnResizing: false, suppressRemoveSort: true, displayName: $filter('translate')('tab_Day'), enableCellEdit: false, visible: false
                },
                {
                    name: 'STRTTIM_Hrs', enableGrouping: false, sort: { direction: uiGridConstants.ASC, priority: 0, }, width: 105, groupingShowAggregationMenu: false, headerCellClass: 'startTimeHeader', suppressRemoveSort: true, displayName: $filter('translate')('lbl_StartTime'), enableCellEdit: false, enableColumnResizing: false,
                    cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell" title="{{(row.entity.STRTTIM_Hrs)| date:\'EEE, MMM dd, yyyy hh:mm a\'}}">{{(row.entity.STRTTIM_Hrs | date:"hh:mm a")}}</div>', allowCellFocus: true,
                },
                {
                    name: 'ENDTIM_hrs', enableGrouping: false, groupingShowAggregationMenu: false, headerCellClass: 'startTimeHeader', width: 95, suppressRemoveSort: true, displayName: $filter('translate')('lbl_EndTime'), enableCellEdit: false, enableColumnResizing: false,
                    cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell" title="{{(row.entity.STRTTIM_Hrs)| date:\'EEE, MMM dd, yyyy hh:mm a\'}}">{{(row.entity.ENDTIM_hrs | date:"hh:mm a")}}</div>', allowCellFocus: true,
                },
            {
                name: 'HRS', groupingShowAggregationMenu: false, headerCellClass: 'startTimeHeader', width: 65, suppressRemoveSort: true, displayName: $filter('translate')('lbl_HrsFull'), enableCellEdit: false, enableColumnResizing: false,
                cellTemplate: '<div  ng-if="!row.groupHeader" class="ui-grid-cell rightAlig" >{{row.entity.HRS}}</div>', allowCellFocus: true,
            },
            {
                name: 'SUBJ', groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_Subject'), enableCellEdit: false, enableColumnResizing: false,
                cellTemplate: '<div ng-if="!row.groupHeader" class="ui-grid-cell" title="{{row.entity.SUBJ}}">{{row.entity.SUBJ}}</div>', allowCellFocus: true,
            }

    ];

    $scope.multipleRowsSelected = false;

    $scope.srchOptChange = function () {
        $rootScope.errorLogMethod("multidatepickerCtrlDesktop.$scope.srchOptChange");
        menuFlag = true;
    }
    $scope.clearSearch = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.clearSearch");
        $scope.searchText = "";
        $scope.refreshData();
    }
    $scope.refreshData = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.refreshData");
        $scope.gridApi.selection.clearSelectedRows();
        var originalData = [];
        $scope.gridDataSearch = [];
        if ($scope.isAllDayFlag == true) {
            originalData = $scope.importCalObjAll.items;
        }
        else if ($scope.isAllDayFlag == false) {
            originalData = $scope.importCalObj.items;
        }
        //filter by any field
        if (($scope.searchOptions.hrs == true && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == true)) {
            if ($scope.searchText.trim() == "")
                $scope.gridDataSearch = originalData
            else
                $scope.gridDataSearch = originalData.filter(function (item) {
                    if (item.SUBJ !== null)
                        return ((item.HRS.toString().indexOf($scope.searchText) > -1) || (item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) || (item.STRTTIM_ampm.indexOf($scope.searchText) > -1) || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
                });
        }
        if (($scope.searchOptions.hrs == false && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == false)) {
            if ($scope.searchText.trim() == "")
                $scope.gridDataSearch = originalData;
            else {
                $scope.gridDataSearch = [];
            }
        }
        //filter by hours only
        if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = $filter('filter')(originalData, { HRS: $scope.searchText }, undefined);
        }

            //filter by Hours & Sub  only  
        else if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.HRS.toString().indexOf($scope.searchText) > -1) || (item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1))
            });
        }
            //filter by Hours & start time  only  
        else if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                return ((item.HRS.toString().indexOf($scope.searchText) > -1) || (item.STRTTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter by Hours & end time  only  
        else if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                return (item.HRS.toString().indexOf($scope.searchText) > -1 || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter by Hours & sub & start time  only  
        else if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.HRS.toString().indexOf($scope.searchText) > -1) || (item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) || (item.STRTTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter by Hours & sub & end time  only  
        else if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.HRS.toString().indexOf($scope.searchText) > -1) || (item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter by Hours & start time & end time  only  
        else if ((($scope.searchOptions.hrs == true && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                return ((item.HRS.toString().indexOf($scope.searchText) > -1) || (item.STRTTIM_ampm.indexOf($scope.searchText) > -1) || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }

            //filter by SUBJ only  
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1))
            });
        }
            //filter by SUBJ & start time  only  
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) || (item.STRTTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter by SUBJ & end time  only  
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter by SUBJ & start time & end time  only  
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == true && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                if (item.SUBJ !== null)
                    return ((item.SUBJ !== undefined && item.SUBJ.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1) || (item.STRTTIM_ampm.indexOf($scope.searchText) > -1) || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }

            //filter only start time
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == false))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                return (item.STRTTIM_ampm.toString().indexOf($scope.searchText) > -1);
            });
        }
            //filter by start time & end time  only  
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == true && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                return (item.STRTTIM_ampm.toString().indexOf($scope.searchText) > -1 || (item.ENDTIM_ampm.indexOf($scope.searchText) > -1))
            });
        }
            //filter only end time
        else if ((($scope.searchOptions.hrs == false && $scope.searchOptions.subject == false && $scope.searchOptions.sDate == false && $scope.searchOptions.eDate == true))) {
            $scope.gridDataSearch = originalData.filter(function (item) {
                return (item.ENDTIM_ampm.toString().indexOf($scope.searchText) > -1);
            });
        }
        $scope.gridOptions.data = $scope.gridDataSearch;
        $interval(function () {
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
        }, 0, 1);
        if ($scope.gridOptions.data.length == 0)
            $scope.CalNoEntryMessage = 1;
        else
            $scope.CalNoEntryMessage = 0;
        localStorage.GroupingCalled = "1";
    }
    $scope.toggleSrchSelection = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.toggleSrchSelection");
        $scope.showFilterMenu = false;
        $scope.showSrchSelection = !$scope.showSrchSelection;
        menuFlag = $scope.showSrchSelection;
    }

    //Hide the dropdown menu on click on document.
    $document.on('click', function (event) {
        if ($scope.showFilterMenu || $scope.showMenuOutsideGrid || $scope.showSrchSelection || $rootScope.showImpCalRightMenuFlag) {
            if (!menuFlag) {
                $scope.$apply(function () {
                    $scope.showFilterMenu = false;
                    $scope.showMenuOutsideGrid = false;
                    if ($(event.target).attr('class').indexOf('noHideMenu') == -1)
                    $rootScope.showImpCalRightMenuFlag = false;
                    $scope.showSrchSelection = false;
                });
            }
        }
        menuFlag = false;
    });
    $scope.gridOptions = {
        rowHeight: 19,

        showHeader: true,
        enableVerticalScrollbar: uiGridConstants.ALWAYS,
        enableHorizontalScrollbar: 0,
        showGridFooter: true,
        showColumnFooter: false,
        enableGridMenu: true,
        enableCellSelection: true,
        enableCellEditOnFocus: true,
        enableFiltering: false,
        enableRowSelection: true,
        treeRowHeaderAlwaysVisible: false,
        enableRowHeaderSelection: false,
        multiSelect: true,
        modifierKeysToMultiSelect: true,
        noUnselect: true,
        gridFooterTemplate: '<div></div>',
        columnDefs: columnDefsImport,
        rowTemplate: '<div ng-dblclick="grid.appScope.viewEntry(row.entity)" ng-mouseup="grid.appScope.getSelectedRowCount(row,grid,$event)" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ \'ui-grid-row-header-cell\': col.isRowHeader }\" ui-grid-cell></div>',
        onRegisterApi: function (gridApi) {
            $scope.maskTest = String('?*?*?*-?9?9?9?-?9?9?9');
            $scope.gridApi = gridApi;
            gridApi.core.on.rowsRendered($scope, function () {
                if ($scope.windowConfig.isRefreshGrid) {
                    localStorage.GroupingCalled == "1"
                    //var column = $scope.gridApi.grid.getColumn($scope.sortInfo[0].name);
                    //$scope.gridApi.grid.sortColumn(column, $scope.sortInfo[0].sort.direction == 'asc' ? uiGridConstants.ASC : uiGridConstants.DESC, false);
                    $scope.windowConfig.isRestored = true;
                    $scope.gridApi.saveState.restore($scope, $scope.state);
                    $scope.windowConfig.isRefreshGrid = false;
                    $timeout(function () { $scope.gridApi.treeBase.expandAllRows(); });
                }
                if ($scope.gridApi.grid.treeBase.tree instanceof Array) {
                    if (localStorage.GroupingCalled == "1") {
                        localStorage.GroupingCalled = "0";
                        //$scope.gridApi.saveState.restore($scope, $scope.state);
                        $scope.gridApi.treeBase.expandAllRows();
                    }
                    if (localStorage.isWeekAutoGrouping == "1") {
                        localStorage.isWeekAutoGrouping = "0";
                        $scope.gridApi.grouping.groupColumn('WeekCalDay');
                        localStorage.GroupingCalled = "1"
                    }
                }
            });
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                //$scope.selectedIndex = $scope.gridOptions.data.indexOf(row.entity);
                var selectedRows = gridApi.selection.getSelectedRows();
                if (selectedRows.length == 0)
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(row.entity)]);
                else if (selectedRows.length > 1)
                    $scope.multipleRowsSelected = true;
                else if (selectedRows.length == 1)
                    $scope.multipleRowsSelected = false;

            });
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if ($scope.windowConfig.isRestored)
                    $scope.windowConfig.isRestored = false;
                else {
                    if (sortColumns.length == 0) {
                        var column = grid.getColumn(localStorage.ungroupColumnName)
                        if (column)
                            grid.sortColumn(column, localStorage.ungroupColSortDir == "desc" ? uiGridConstants.DESC : uiGridConstants.ASC, false);
                    }
                    if (sortColumns.length == 1)
                        sortColumns[0].footerCellClass = "";
                    if (sortColumns.length > 1 && localStorage.UnsortApplied != "1") {
                        var count1 = null;
                        var count2 = null;
                        for (var i = 0; i < sortColumns.length; i++) {
                            if (sortColumns[i].grouping != undefined && sortColumns[i].grouping.groupPriority == 0) {
                                sortColumns[i].footerCellClass = "removeSortClass";
                                sortColumns[i].sort.priority = 0;
                                if (localStorage.GroupingCalled == "1" && sortColumns[i - 1] != undefined && sortColumns[i - 1] != null) {
                                    sortColumns[i - 1].sort.priority = 1;
                                    count2 = i - 1;
                                }
                                else {
                                    sortColumns[sortColumns.length - 1].sort.priority = 1;
                                    count2 = sortColumns.length - 1;
                                }

                                count1 = i;
                            }
                        }
                        if (count1 != null) {
                            for (var i = 0; i < sortColumns.length; i++) {
                                if (i != count1 && i != count2) {
                                    localStorage.UnsortApplied = "1";
                                    sortColumns[i].unsort();
                                }
                            }
                        }
                        else {
                            sortColumns[1].sort.priority = 0; // have to do this otherwise the priority keeps going up.  
                            localStorage.UnsortApplied = "1";
                            sortColumns[0].unsort();
                        }
                    }
                    else
                        localStorage.UnsortApplied = "0";
                }
            });
        }
    };

    var createDate = function (dteStr) {
        //$rootScope.errorLogMethod("importCalDesktopCtrl.var.createDate");
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }

    var createDateTime = function (dateStr) {
        // $rootScope.errorLogMethod("importCalDesktopCtrl.var.createDateTime");
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
    
    $scope.getSelectedRowCount = function (item, grid, event) {
        if (event.shiftKey) {
            //$scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(item.entity)]);
            var visibleRowsTemp = $scope.gridApi.core.getVisibleRows();
            var visibleRows = [];
            for (var i = 0; i < visibleRowsTemp.length; i++) {
                if (visibleRowsTemp[i].groupHeader == true)
                    visibleRows.push(null);
                else
                    visibleRows.push(visibleRowsTemp[i].entity);
            }
            var rows = grid.api.selection.getSelectedRows();
            var startRowIndex = visibleRows.indexOf(rows[0]);
            var endRowIndex = visibleRows.indexOf(item.entity);
            if (startRowIndex > endRowIndex) {
                startRowIndex = visibleRows.indexOf(rows[rows.length - 1]);
            }
            grid.api.selection.clearSelectedRows();
            var count = 0;
            if (startRowIndex < endRowIndex) {
                for (var r = startRowIndex; r <= endRowIndex; r++) {
                    $scope.gridApi.selection.selectRowByVisibleIndex(r);
                    count++
                }
            }
            else {
                for (var r = startRowIndex; r >= endRowIndex; r--) {
                    $scope.gridApi.selection.selectRowByVisibleIndex(r);
                    count++
                }
            }
            var selectedRows = grid.api.selection.getSelectedRows();

            if (count > 1)
                $scope.multipleRowsSelected = true;
            else
                $scope.multipleRowsSelected = false;

        }
    }
    $scope.importCalObj = new importCalRslt();
    $scope.importCalObjAll = new importCalRslt();
    $scope.importCalObjMeetings = new importCalRslt();
    $scope.importCalObjAllMeetings = new importCalRslt();
    $scope.currentDate = "";

    $scope.CalNoEntryMessage = 0;
    $scope.refreshUIGridOutlook = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.refreshUIGridOutlook");
        $scope.refreshGridOutlook = false;
        $scope.windowConfig.isRendered = false;
        $timeout(function () {
            $scope.windowConfig.isRendered = true;
            $interval(function () {
                try {
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
                } catch (ex) {
                }
            }, 0, 1);
        }, 0);
    }
    $scope.init = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.init");
        $scope.filterTitle = $filter('translate')('lbl_fltrOptns');
        $scope.filterTitle2 = $filter('translate')('lbl_fltrOptnsSCal');
        $scope.ViewDetailTitle = $filter('translate')('lbl_viewDtls');
        $scope.ViewDetailTitle2 = $filter('translate')('lbl_viewDtlsSlctd');
        $scope.refreshTitle = $filter('translate')('lbl_rfrshEntry');
        $scope.refreshTitle2 = $filter('translate')('lbl_rfrshEntryRtrv');
        $scope.selectTitle = $filter('translate')('lbl_slctEntry');
        $scope.selectTitle2 = $filter('translate')('lbl_slctEntryImprt');
        $timeout(function () {
            $("#importCalPopUp, #innerCalDiv").draggable({
                start: function (event, ui) {
                    if (event.target.id == "innerCalDiv")
                        return false;
                }
            });
        }, 0);
        $rootScope.iscalOpen = true;
        $scope.importCalObj.items = [];
        $scope.importCalObjAll.items = [];
        $scope.importCalObjMeetings.items = [];
        $scope.importCalObjAllMeetings.items = [];
        $scope.itemsDataTotal = selectedData.weekData;
        $scope.ttlHrCal = selectedData.totalHrs;
        localStorage.isWeekAutoGrouping = selectedData.isDailyMode ? "0" : "1";
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
            $scope.weeklyStartDate = dateVal.valueOf();
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
        $scope.noCalEntriesDay = $filter('translate')('msg_noCalEntryDay');
        $scope.noCalEntriesWeek = $filter('translate')('msg_noCalEntryWeek');
        $scope.noCalEntriesMsg = $scope.isDailyMode ? $scope.noCalEntriesDay : $scope.noCalEntriesWeek;
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
        importCalService.getCalImportEntries(jsonSFromloginDetail.SESKEY, localStorage.getItem("calENCKEY"), domain, startDate, endDate, jsonSFromInitialDetail.EMPL_REC.EMAIL, jsonSFromInitialDetail.EMPL_REC.EMAIL)
            .then(function (response) {
                if (parseInt(response.RETCALENT_OUT_OBJ.RETCD) == 0) {
                    if (response.RETCALENT_OUT_OBJ.CALI_ARR == undefined || response.RETCALENT_OUT_OBJ.CALI_ARR.length == 0) {
                        $scope.CalNoEntryMessage = 1;
                        $scope.importCalObj.busy = true;
                        $scope.importCalObj.loadMsg = $filter('translate')('msg_NoMoreData');
                        return;
                    }
                    if (Object.prototype.toString.call(response.RETCALENT_OUT_OBJ.CALI_ARR) != '[object Array]') {
                        var data = response.RETCALENT_OUT_OBJ.CALI_ARR;
                        response.RETCALENT_OUT_OBJ.CALI_ARR = [];
                        response.RETCALENT_OUT_OBJ.CALI_ARR.push(data.CALI_OBJ);
                    }
                    var items = response.RETCALENT_OUT_OBJ.CALI_ARR;
                    var itemArLen = $scope.importCalObj.items.length;
                    /*Array is returned by api*/
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].CALID != 0) {
                                if (items[i].SUBJ != null && items[i].SUBJ != undefined) {
                                    items[i].SUBJ = items[i].SUBJ.replace(/\n/g, " ");
                                    items[i].SUBJ = items[i].SUBJ.replace(/\t/g, " ");
                                }
                                items[i].index = itemArLen;
                                if (items[i].ISALDYEV == "N")
                                    $scope.importCalObj.items.push(items[i]);
                                if (items[i].ISMTG == "Y" && items[i].ISALDYEV == "N")
                                    $scope.importCalObjMeetings.items.push(items[i]);
                                if (items[i].ISMTG == "Y")
                                    $scope.importCalObjAllMeetings.items.push(items[i]);
                                $scope.importCalObjAll.items.push(items[i]);
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

                $scope.gridOptions.data = $scope.importCalObj.items;
                $timeout(function () {
                    //var viewPortRqHeight = localStorage.gridViewportHeight;
                    // alert(viewPortRqHeight);

                    var heightView = $("#importCalPopUp .ui-grid-render-container-body .ui-grid-viewport").height();
                    $("#importCalPopUp .ui-grid-pinned-container .ui-grid-viewport").height(heightView);

                    //var heightView = $("#importCalPopUp .ui-grid-render-container-body .ui-grid-viewport .ui-grid-canvas").height();
                    //$("#importCalPopUp .ui-grid-pinned-container .ui-grid-viewport .ui-grid-canvas").height(heightView+50);

                }, 1000);
                if ($scope.gridOptions.data.length == 0)
                    $scope.CalNoEntryMessage = 1;
                else
                    $scope.CalNoEntryMessage = 0;
                for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                    $scope.gridOptions.data[i].WEEKDAY = $scope.formatWeekDay($scope.gridOptions.data[i].STRTTIM);
                    $scope.gridOptions.data[i].HRS = $scope.timediff($scope.gridOptions.data[i].STRTTIM, $scope.gridOptions.data[i].ENDTIM);
                    $scope.gridOptions.data[i].STRTTIM_Hrs = $scope.formatDates($scope.gridOptions.data[i].STRTTIM);
                    $scope.gridOptions.data[i].ENDTIM_hrs = $scope.formatDates($scope.gridOptions.data[i].ENDTIM);
                    var sDate = $filter('date')($scope.gridOptions.data[i].STRTTIM_Hrs, "hh:mm a");
                    var eDate = $filter('date')($scope.gridOptions.data[i].ENDTIM_hrs, "hh:mm a");
                    $scope.gridOptions.data[i].STRTTIM_ampm = sDate;
                    $scope.gridOptions.data[i].ENDTIM_ampm = eDate;
                }

                if (localStorage.isDailyMode == "true") {
                    $scope.gridOptions.columnDefs = columnDefsImport;

                }
                else {
                    $scope.gridOptions.columnDefs = columnDefsImportWeek;
                }
                $scope.refreshUIGridOutlook();
                $interval(function () {
                    //try {
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
                    //} catch (ex) {
                    //}
                }, 0, 1);
            });
    }

    $scope.isAllDayFlag = false;
    $scope.isMeetingOnlyFlag = false;
    $scope.showFilterMenu = false;
    var hideOtherDropDown = function () {
        $rootScope.showImpCalRightMenuFlag = false;
        $scope.showMenuOutsideGrid = false;
    }
    $scope.filterCal = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.filterCal");
        hideOtherDropDown();
        $scope.showSrchSelection = false;
        $scope.showFilterMenu = !$scope.showFilterMenu;
        menuFlag = $scope.showFilterMenu;
    }
    $scope.allDayEventFilter = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.allDayEventFilter");
        $scope.gridApi.selection.clearSelectedRows();
        if ($scope.isAllDayFlag == true && !$scope.isMeetingOnlyFlag) {
            $scope.gridOptions.data = $scope.importCalObjAll.items;

        }
        else if ($scope.isAllDayFlag == true && $scope.isMeetingOnlyFlag) {
            $scope.gridOptions.data = $scope.importCalObjAllMeetings.items;

        }
        else if ($scope.isAllDayFlag == false && !$scope.isMeetingOnlyFlag) {
            $scope.gridOptions.data = $scope.importCalObj.items;
        }
        else if ($scope.isAllDayFlag == false && $scope.isMeetingOnlyFlag) {
            $scope.gridOptions.data = $scope.importCalObjMeetings.items;
        }

        if ($scope.gridOptions.data.length == 0)
            $scope.CalNoEntryMessage = 1;
        else
            $scope.CalNoEntryMessage = 0;
        for (var i = 0; i < $scope.gridOptions.data.length; i++) {
            $scope.gridOptions.data[i].WEEKDAY = $scope.formatWeekDay($scope.gridOptions.data[i].STRTTIM);
            $scope.gridOptions.data[i].HRS = $scope.timediff($scope.gridOptions.data[i].STRTTIM, $scope.gridOptions.data[i].ENDTIM);
            $scope.gridOptions.data[i].STRTTIM_Hrs = $scope.formatDates($scope.gridOptions.data[i].STRTTIM);
            $scope.gridOptions.data[i].ENDTIM_hrs = $scope.formatDates($scope.gridOptions.data[i].ENDTIM);
            var sDate = $filter('date')($scope.gridOptions.data[i].STRTTIM_Hrs, "hh:mm a");
            var eDate = $filter('date')($scope.gridOptions.data[i].ENDTIM_hrs, "hh:mm a");
            $scope.gridOptions.data[i].STRTTIM_ampm = sDate;
            $scope.gridOptions.data[i].ENDTIM_ampm = eDate;

        }
        $interval(function () {
            //try {
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
            //} catch (ex) {
            //}
        }, 0, 1);
        localStorage.GroupingCalled = "1";
    }

    $scope.meetingFilter = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.meetingFilter");
        $scope.gridApi.selection.clearSelectedRows();
        if ($scope.isMeetingOnlyFlag == true && $scope.isAllDayFlag == false) {
            $scope.gridOptions.data = $scope.importCalObjMeetings.items;

        }
        else if ($scope.isMeetingOnlyFlag == true && $scope.isAllDayFlag == true) {
            $scope.gridOptions.data = $scope.importCalObjAllMeetings.items;

        }
        else if ($scope.isMeetingOnlyFlag == false && $scope.isAllDayFlag == true) {
            $scope.gridOptions.data = $scope.importCalObjAll.items;
        }
        else if ($scope.isMeetingOnlyFlag == false && $scope.isAllDayFlag == false) {
            $scope.gridOptions.data = $scope.importCalObj.items;
        }
        if ($scope.gridOptions.data.length == 0)
            $scope.CalNoEntryMessage = 1;
        else
            $scope.CalNoEntryMessage = 0;
        for (var i = 0; i < $scope.gridOptions.data.length; i++) {
            $scope.gridOptions.data[i].WEEKDAY = $scope.formatWeekDay($scope.gridOptions.data[i].STRTTIM);
            $scope.gridOptions.data[i].HRS = $scope.timediff($scope.gridOptions.data[i].STRTTIM, $scope.gridOptions.data[i].ENDTIM);
            $scope.gridOptions.data[i].STRTTIM_Hrs = $scope.formatDates($scope.gridOptions.data[i].STRTTIM);
            $scope.gridOptions.data[i].ENDTIM_hrs = $scope.formatDates($scope.gridOptions.data[i].ENDTIM);
            var sDate = $filter('date')($scope.gridOptions.data[i].STRTTIM_Hrs, "hh:mm a");
            var eDate = $filter('date')($scope.gridOptions.data[i].ENDTIM_hrs, "hh:mm a");
            $scope.gridOptions.data[i].STRTTIM_ampm = sDate;
            $scope.gridOptions.data[i].ENDTIM_ampm = eDate;

        }
        $interval(function () {
            //try {
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
            //} catch (ex) {
            //}
        }, 0, 1);
        localStorage.GroupingCalled = "1";
    }

    var loadNewEnteryWindow = function (startDate, isDailyMode, currentDate, timeEntery) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.var.loadNewEnteryWindow");
        var hrsTtl = 0;
        var hrsSumDayWise = [0, 0, 0, 0, 0, 0, 0];
        var editEntryHrs = [0, 0, 0, 0, 0, 0, 0];
        if (!isDailyMode) {
            $rootScope.weekStateCurrentDate = $filter('date')(currentDate, "yyyy-MM-dd");
            hrsSumDayWise[0] = parseFloat($scope.itemsDataTotal.HrsTotalSum1 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum1)
            hrsSumDayWise[1] = parseFloat($scope.itemsDataTotal.HrsTotalSum2 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum2)
            hrsSumDayWise[2] = parseFloat($scope.itemsDataTotal.HrsTotalSum3 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum3)
            hrsSumDayWise[3] = parseFloat($scope.itemsDataTotal.HrsTotalSum4 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum4)
            hrsSumDayWise[4] = parseFloat($scope.itemsDataTotal.HrsTotalSum5 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum5)
            hrsSumDayWise[5] = parseFloat($scope.itemsDataTotal.HrsTotalSum6 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum6)
            hrsSumDayWise[6] = parseFloat($scope.itemsDataTotal.HrsTotalSum7 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum7)


        }
        else {
            hrsSumDayWise[0] = parseFloat($scope.ttlHrCal);
            //if (timeEntery != null)
            //editEntryHrs[0] = parseFloat(timeEntery.HRS);
        }
        var sendData = {
            "startDate": startDate, "isDailyMode": isDailyMode, "currentDate": currentDate,
            "editTEObj": timeEntery, isClosedRevMonth: !$scope.checkRevMonthFlag, hoursTotalDetail: {
                editEntryHrs: editEntryHrs,
                weeklyHrsSumDayWise: hrsSumDayWise
            }

        };
        $scope.openModalCtrl = 'newEntry';
        $scope.open('Desktop/NewEntry/templates/NewEntry.html', 'NewEntryCtrl', sendData);
    }

    $scope.open = function (template, controller, sendData) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.open");
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: template,
            controller: controller,
            resolve: {
                arguments: function () {
                    return sendData;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            switch ($scope.openModalCtrl) {
                case 'pasteAdvanced':
                    $scope.pasteMultiple(selectedItem);
            }

        }, function () {
            $(".overlay").css("display", "none");
            $(".bottom-footer ul li a").removeClass("btn-grd2");
            $scope.openModalCtrl = '';
        })
    };

    $scope.timediff = function (a, b) {
        //$rootScope.errorLogMethod("importCalDesktopCtrl.$scope.timediff");
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
        //$rootScope.errorLogMethod("importCalDesktopCtrl.$scope.formatDates");
        var startDate = createDateTime(date);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        //var hours = startDate.getHours();
        //var minutes = startDate.getMinutes();
        //var ampm = hours >= 12 ? 'pm' : 'am';
        //hours = hours % 12;
        //hours = hours ? hours : 12; // the hour '0' should be '12'
        //minutes = minutes < 10 ? '0' + minutes : minutes;
        //var strTime = hours + ':' + minutes + ' ' +ampm;
        return startDate;
    }
    $scope.formatWeekDay = function (date) {
        //$rootScope.errorLogMethod("importCalDesktopCtrl.$scope.formatWeekDay");
        var startDate = createDateTime(date);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        startDate.setHours(0, 0, 0, 0);
        return startDate;
        //return $filter('date') (startDate, 'EEEE, MMMM dd, yyyy')
    }

    $scope.viewDetails = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.viewDetails");
        if (!$scope.multipleRowsSelected) {
            hideOtherDropDown();
            var selectedItem = $scope.gridApi.selection.getSelectedRows();
            $scope.viewDetail(selectedItem[0]);

        }
    }
    $scope.viewDetail = function (data) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.viewDetail");
        var domain = constantService.DOMAINNAME;
        $scope.gridApi.selection.clearSelectedRows();
        $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(data)]);
        var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
        var jsonSFromInitialDetail = $rootScope.GetInitialDetail(false, true);
        importCalService.getCalImportEntryDetail(jsonSFromloginDetail.SESKEY, localStorage.getItem("calENCKEY"), domain, jsonSFromInitialDetail.EMPL_REC.EMAIL, data.CALID)
      .then(function (response) {
          if (parseInt(response.RETCALDET_OUT_OBJ.RETCD) == 0) {
              loadCalDetailWindow(response.RETCALDET_OUT_OBJ.CALI_REC);
          }
      });

    }

    var loadCalDetailWindow = function (data) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.var.loadCalDetailWindow");
        var sendData = {
            "sender_from": data.CALI_FROM, "sender_to": data.CALI_TO, "subject": data.SUBJ,
            "location": data.LOC, "mail_body": data.BDY, "start_time": data.STRTTIM, "end_time": data.ENDTIM, "meetingFlag": data.ISMTG

        };
        $scope.openModalCtrl = 'calDetail';
        $scope.open('Desktop/CalendarImport/templates/OutlookTeamMeeting.html', 'importCalDesktopDetailCtrl', sendData);
    }

    $scope.refreshCal = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.refreshCal");
        hideOtherDropDown();
        $scope.init();
    }

    $scope.$on("selectFromDetails", function (event, args) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.$on.selectFromDetails");
        $scope.selectCal();
        //$scope.getMainCategories();
    });

    $scope.viewEntry = function (data) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.viewEntry");
        if (data.CALID === undefined)
            return;
        $rootScope.importViewed = true;
        $rootScope.lastCurrentDate = $filter('date')(selectedData.currentDate, "yyyy-MM-dd");
        $rootScope.lastExpandAllText = selectedData.lastExpandAllText;
        $rootScope.lastExpandClass = selectedData.lastExpandClass;
        $rootScope.cntrExpandCollapse = 2;
        if (!selectedData.isDailyMode) {
            $rootScope.isPasteClicked = true;
            $rootScope.weekStateCurrentDate = $filter('date')(selectedData.currentDate, "yyyy-MM-dd");
        }
        var calDetail = [];
        var weeklyHours = [null, null, null, null, null, null, null];
        $scope.week = [null, null, null, null, null, null, null];
        var sendDate;
        var date = data.STRTTIM;
        var startDate = createDateTime(date);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        var day = startDate.getDay();
        $scope.ttlHrs = 0.00;
        var hours = data.HRS;
        if (!$scope.isDailyMode) {
            weeklyHours[day] = Number(parseFloat(hours).toFixed(2));
            for (var i = 0; i < 7; i++) {
                $scope.week[i] = weeklyHours[i];
                data.weeklyHour = $scope.week;
            }

        }
        else
            $scope.ttlHrs += parseFloat(data.HRS);


        $scope.ttlHrs = $scope.ttlHrs.toFixed(2);

        sendDate = $scope.currentDate;
        $rootScope.isRefresh = false;
        data.isImportCal = true;
        data.CTDESC = "";
        data.DES = data.SUBJ;
        loadNewEnteryWindow(selectedData.isDailyMode ? selectedData.currentDate : selectedData.weekStartDate, selectedData.isDailyMode, sendDate, data)

    }

    $scope.selectCal = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.selectCal");
        if (!$scope.multipleRowsSelected) {
            hideOtherDropDown();
            var selectedItem = $scope.gridApi.selection.getSelectedRows();
            $scope.viewEntry(selectedItem[0]);
        }
    }
    var startTimeTemp = 0;
    $scope.checkVisibility = function (startTime, index) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.checkVisibility");
        if (index == 0)
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
    var getLeftMargin = function (toolTipWidth, relativeX) {
        var gridWidth = ($(".importCaledarPopup").width());//$scope.windowConfig.gridWidth
        var remainWidth = gridWidth - relativeX;
        if (remainWidth < toolTipWidth) {           
            relativeX = relativeX - (toolTipWidth -0);
        }
        return relativeX;
    }
    var getTopMargin = function (relativeY) {
        var toolTipHeight = 40;
        var marginTop=relativeY;       
        var windowHeight = ($("#importCalPopUp").height());
        var  remainHeight = windowHeight - relativeY;
        if (remainHeight < toolTipHeight) {            
            marginTop= relativeY -(toolTipHeight -remainHeight);
        }
        else {
            marginTop = relativeY;
        }
        return marginTop;

    }
    $scope.rightClick = function (event) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.rightClick");
        $scope.rightClickObj = event.target;
        $scope.showEditFlag = false;
        $rootScope.showImpCalRightMenuFlag = false;
        $scope.showMenuOutsideGrid = true;
        var offset = $(".entrypopup.importCaledarPopup").offset();
        var relativeX = (event.pageX - offset.left);
        var relativeY = (event.pageY - offset.top);
        var leftMargin = getLeftMargin(218, relativeX);
        var topMargin = getTopMargin(relativeY);
        $(".edit_MenuCalOutsideGrid").css({ left: leftMargin + 'px', top: topMargin+ 'px' });
        $(".edit_MenuCalOutsideGrid").css("display", "block");
        event.preventDefault();
        event.stopPropagation();

    }

    $scope.getStartTime = function (startTime) {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.getStartTime");
        var startDate = createDateTime(startTime);
        var currentTimezone = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - (currentTimezone));
        startDate = $filter('date')(startDate, 'yyyy-MM-dd');
        return startDate.substring(0, 10);
    }
    $scope.cancel = function () {
        $rootScope.errorLogMethod("importCalDesktopCtrl.$scope.cancel");
        $rootScope.iscalOpen = false;
        $modalInstance.dismiss('cancel');
    };
}])

.controller('importCalDesktopDetailCtrl', ['$rootScope', '$filter', '$scope', '$modalInstance', '$state', '$rootScope', '$timeout', '$window', 'constantService', 'importCalService', 'arguments', '$modal', '$document', '$filter', function ($rootScope, $filter, $scope, $modalInstance, $state, $rootScope, $timeout, $window, constantService, importCalService, selectedData, $modal, $document, $filter) {

    $scope.init = function () {
        $rootScope.errorLogMethod("importCalDesktopDetailCtrl.$scope.init");
        $timeout(function () {
            $("#viewDetailPopUp, #innerDetailDiv").draggable({
                cancel: '#innerDetailDiv'
            });
        }, 0);
        $scope.sender_from = selectedData.sender_from;
        $scope.sender_to = selectedData.sender_to;
        $scope.subject = selectedData.subject == null ? '' : selectedData.subject;
        $scope.subjectTitle = selectedData.subject == null ? '&nbsp;' : selectedData.subject;
        $scope.location = selectedData.location;
        $scope.meetingFlag = selectedData.meetingFlag;
        var startDateTemp = createDateTime(selectedData.start_time);
        var currentTimezone = startDateTemp.getTimezoneOffset();
        startDateTemp.setMinutes(startDateTemp.getMinutes() - (currentTimezone));
        var startDate = $filter('date')(startDateTemp, "EEE, MMM d, y h:mm a");
        $scope.start_time = startDate;
        var endDateTemp = createDateTime(selectedData.end_time);
        var currentTimezone = endDateTemp.getTimezoneOffset();
        endDateTemp.setMinutes(endDateTemp.getMinutes() - (currentTimezone));
        var endDate = $filter('date')(endDateTemp, "EEE, MMM d, y h:mm a");
        $scope.end_time = endDate;
        var decoded = $('<div>').html(selectedData.mail_body).text();
        if (decoded.indexOf("<body>") > -1)
            decoded = decoded.substring((decoded.indexOf("<body>") + 6), (decoded.indexOf("</body>")));
        $('.showEmailContent').append(decoded);
    }

    var createDateTime = function (dateStr) {
        // $rootScope.errorLogMethod("importCalDesktopDetailCtrl.var.createDateTime");
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

    $scope.formatDates = function (date) {
        //$rootScope.errorLogMethod("importCalDesktopDetailCtrl.$scope.formatDates");
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

    $scope.selectMeeting = function () {
        $rootScope.errorLogMethod("importCalDesktopDetailCtrl.$scope.selectMeeting");
        $modalInstance.dismiss('cancel');
        $rootScope.$broadcast('selectFromDetails', {
        });

    }
    //var selectedItem = $scope.gridApi.selection.getSelectedRows();
    $scope.cancel = function () {
        $rootScope.errorLogMethod("importCalDesktopDetailCtrl.$scope.cancel");
        $modalInstance.dismiss('cancel');
    };
}])

.controller('importCalDesktopLoginCtrl', ['$rootScope', '$filter', '$scope', '$modal', 'loginService', 'constantService', 'arguments', 'openPopUpWindowFactory', '$timeout', function ($rootScope, $filter, scope, $modal, loginService, constantService, selectedData, sharedService, $timeout) {
    scope.username = "";
    scope.domain = "mercer";
    scope.password = "";
    scope.loginNote = $filter('translate')('msg_NtwrkIdPswrd');
    scope.popUpName = 'importCalDesktopLoginCtrl';
    scope.enableLoginFlag = true;
    scope.animationsEnabled = true;
    scope.timedDisplay = "";

    $('#txtCalLoginUserName').on("contextmenu", function (e) {
        e.preventDefault();
    });
    $('#txtCalLoginPassword').on("contextmenu", function (e) {
        e.preventDefault();
    });
    var createDate = function (dteStr) {
        if (dteStr != undefined) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);
        }
        else return null;
    }
    scope.open = function (template, controller, sendData) {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.open");
        var modalInstance = $modal.open({
            animation: scope.animationsEnabled,
            templateUrl: template,
            controller: controller,
            resolve: {
                selectedData: function () {
                    return sendData;
                }

            }
        });
    }
    scope.showUntilSeconds = function () {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.showUntilSeconds");
        var tempUNDisplay = "";
        var tempPassDisplay = "";
        if (scope.username.length == 0)
            tempUNDisplay = "UN ";
        else
            tempUNDisplay = "";

        if (scope.password.length == 0)
            tempPassDisplay = "PW ";
        else
            tempPassDisplay = "";
        scope.timedDisplay = tempUNDisplay + tempPassDisplay;
        if (scope.timerLogin != null)
            $timeout.cancel(scope.timerLogin);
        scope.timerLogin = $timeout(function () { scope.timedDisplay = ""; }, (parseInt(constantService.DESKTOPDISPLAYSECONDS) * 1000));
    }

    scope.fieldEmpty = $filter('translate')('msg_noUsrNm');
    scope.IsValue = function () {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.IsValue");
        if ((scope.username != "") && (scope.password != "")) {
            scope.enableLoginFlag = false;
            scope.fieldEmpty = "";
            $('#loginbtnDsktp').removeAttr("disabled")
        }
        else if ((scope.username == "") & (scope.password != "") && (scope.domain != "")) {
            scope.fieldEmpty = $filter('translate')('msg_noUsrNm');
            scope.enableLoginFlag = true;
        }
        else if ((scope.username != "") & (scope.password == "")) {
            scope.fieldEmpty = $filter('translate')('msg_noPswrd');
            scope.enableLoginFlag = true;
        }
        else if ((scope.username == "") & (scope.password == "")) {
            scope.fieldEmpty = $filter('translate')('msg_noUsrNm');
            scope.enableLoginFlag = true;
        }
        else {
            scope.enableLoginFlag = true;
            $('#loginbtnDsktp').attr("disabled", true);
        }

    }
    scope.resetField = function (value) {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.resetField");
        if (value == "dom")
            scope.domain = "";
        else
            scope.username = "";
        scope.IsValue();
    }

    scope.checkDisable = function () {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.checkDisable");
        return scope.enableLoginFlag;
    }



    scope.cancel = function () {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.cancel");
        scope.$close();
    };



    scope.login = function () {
        $rootScope.errorLogMethod("importCalDesktopLoginCtrl.scope.login");
        $rootScope.isLineClicked = true;
        var nonADFlagObject = $rootScope.GetLoginDetail(false, true);
        var sendData = {
            currentDate: selectedData.currentDate,
            isDailyMode: selectedData.isDailyMode,
            weekCurrentDate: selectedData.weeklyStartDate
        };
        var usernameChanged = escape(scope.username);
        var loginDetail = $rootScope.GetLoginDetail(false, true);
        var cDate = new Date(selectedData.currentDate.valueOf());
        cDate = $filter('date')(cDate, "yyyy-MM-dd");
        var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months_ImportCal'));
        var revRangeDate = null;
        if (revMnthRange != null) {
            var updDate = new Date(cDate);
            updDate = new Date(updDate.getTime() + (updDate.getTimezoneOffset() * 60 * 1000));
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
                if (data.GETENCRYPT_OUT_OBJ.CCMAIL == $rootScope.GetInitialDetail(false, true).EMPL_REC.EMAIL) {
                    localStorage.setItem('nonADLogin', "Y");
                    localStorage.setItem('encKeyNew', data.GETENCRYPT_OUT_OBJ.ENCKEY);
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
                        domain: scope.domain,
                        weekData: selectedData.weekData
                    };
                    scope.openModalCtrl = 'importCalDesktopCtrl';
                    sharedService.openModalPopUp('Desktop/CalendarImport/templates/ImportCalDesktopEntries.html', 'importCalDesktopCtrl', sendData);
                }
                else {
                    var emailIdDsply;
                    if (loginDetail.isDesignateSet)
                        emailIdDsply = $rootScope.GetInitialDetail(false, true).EMPL_REC.EMAIL
                    else
                        emailIdDsply = data.GETENCRYPT_OUT_OBJ.CCMAIL

                    scope.message = $filter('translate')('msg_notShared') + emailIdDsply + $filter('translate')('msg_notShared2');
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

