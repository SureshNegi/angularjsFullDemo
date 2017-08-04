 var bind = Function.bind;
var unbind = bind.bind(bind);

function instantiate(constructor, args) {
    return new (unbind(constructor, null).apply(null, args));
}
Date = function (Date) {
    MyDate.prototype = Date.prototype;
    return MyDate;

    function MyDate() {
        var date = instantiate(Date, arguments);

        if (arguments[0]) {
            if (arguments[0] == 'sessiontimeout') {                
                date = new Date();              
                return date;
            }
          else
            return date;
        }
        else {           
            var dateStr = new Date();
            var currentTimezone = dateStr.getTimezoneOffset();
            dateStr.setMinutes(dateStr.getMinutes() + (currentTimezone));
            date = dateStr;
        }
        return date;
    }
}(Date);
var myTimeApp = angular.module('MyTimeApp', ['simple.grid', 'ui.router', 'ngSanitize', 'ui.select', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.bootstrap', 'ui.bootstrap.multidatepicker', 'ui.bootstrap.datepicker', 'gm.datepickerMultiSelect', 'ngStorage', 'infinite-scroll', 'ui.mask', 'ngMessages', 'ng.deviceDetector', 'ngRoute', 'ngCookies', 'pascalprecht.translate', 'treeControl', 'ui.grid.saveState', 'ActivityModule', 'DescModule', 'CepFavModule']);

myTimeApp.factory('httpInterceptor', ['constantService', '$injector', '$q', '$rootScope', '$log', '$window', 'constantService', '$templateCache', 'broadcastService', '$cookieStore', function (constantService, $injector, $q, $rootScope, $log, $window, constantService, $templateCache, broadcastService, $cookieStore) {

    var numLoadings = 0;

    return {
        request: function (config) {
            localStorage.setItem("APIUrl", config.url);
            $rootScope.startTime = new Date().getTime();
            numLoadings++;
            // Show loader
            $('#loadingWidget').show();
            if (!$rootScope.isMobileOrTab && $rootScope.loadingImgHidden != true) {
                $('#loadingWidgetDesktop').show();
            }
            if (config.url.toLowerCase().indexOf('templates/') > -1 && config.url.indexOf(constantService.DOMAINURL) < 0) {
                if ((config.url.toLowerCase().indexOf("login.html") > -1 && !$rootScope.isMobileOrTab) || (config.url.toLowerCase().indexOf("maindesktop.html") > -1 && $rootScope.isFromloginPage !==true)) {
                    $rootScope.isSessionExists = false;
                    $rootScope.globals = $cookieStore.get('globals') || {};
                    if (localStorage.getItem("isLoggedIn") != null && localStorage.getItem("isLoggedIn") == "true" && localStorage.getItem('Login_Detail') != null && $rootScope.globals.currentUser && $rootScope.globals.currentUser.username.length > 1) {
                        $('#loadingWidgetDesktop').hide();
                        $rootScope.isSessionExists = true;
                    }
                }
                $rootScope.currentTemplate = config.url;
                var separator = config.url.indexOf('?') === - 1 ? '?' : '&';
                config.url = config.url + separator + 'c=' + constantService.APPVERSION;
            }
            config.timeout = 300000;
            return config || $q.when(config)
        },
        response: function (response) {
            if ((--numLoadings) === 0) {
                // Hide loader
                //--numLoadings
                $('#loadingWidget').hide();
                if (!$rootScope.isMobileOrTab)
                    $('#loadingWidgetDesktop').hide();
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            var responseEndTime = new Date().getTime();
            if (!navigator.onLine) {
                var windowElement = angular.element($window);
                windowElement.off('beforeunload');
                var urlPage = $rootScope.isMobileOrTab ? 'error.html' : 'errorDesktop.html';
                $window.location.href = urlPage + '?code=' + response.status + '&lan=' + constantService.CURRENTLANGUAGE;
            }            
            if (response.status == 503 || ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) && response.status == -1)) {
                $rootScope.loadingImgHidden = true;
                $('#loadingWidgetDesktop').hide();
                broadcastService.maintenanceNotificationBroadcast("myTime is not available. Scheduled Maintenance in Progress.");
            }
            else if (response.config != undefined && response.config != null && ((responseEndTime - $rootScope.startTime) > response.config.timeout)) {
                $rootScope.loadingImgHidden = true;
                $('#loadingWidgetDesktop').hide();
                broadcastService.transactionTimeout();
                return $q.reject(response);
            }
            else {
                if (!(--numLoadings)) {
                    var serviceUrl = localStorage.getItem("APIUrl");
                    if (serviceUrl.length > 500) {
                        serviceUrl = serviceUrl.substring((serviceUrl.length - 500));
                    }
                    var methodName = $rootScope.methodName;
                    var methodTrace = $rootScope.methodName;
                    if ($rootScope.methodName == undefined || $rootScope.methodName == null) {
                        methodName = "";
                        methodTrace = "";
                    }
                    if (methodName.length > 100)
                        methodName = methodName.substring((methodName.length - 100));
                    var fullUsername,empId,sesKey;
                    var userAgent = escape(navigator.userAgent);
                    userAgent = userAgent.substring(0, 100);
                    var statusText = response.statusText;
                    //CCL 9665
                    empId = 0;
                    if(statusText.length > 450){
                        statusText = statusText.substring((statusText.length - 450));
                    }                    
                    if (localStorage.getItem('Initial_Data') != null) {
                        fullUsername = JSON.parse(localStorage.getItem('Initial_Data')).EMPL_REC.FNAME + " " + JSON.parse(localStorage.getItem('Initial_Data')).EMPL_REC.LNAME;
                        empId = JSON.parse(localStorage.getItem('Initial_Data')).EMPL_REC.EMPLID;
                    }
                    if (localStorage.getItem('Login_Detail') != null)
                        sesKey = JSON.parse(localStorage.getItem('Login_Detail')).SESKEY;

                    var http = $injector.get("$http");
                    // do something with $http
                    var url = constantService.DOMAINURL + constantService.LOGEXCEPTION + "?I_JSON={%22SAVEUIEXCEPT_IN_OBJ%22%20:%20{%22SESKEY%22:%22" + window.encodeURIComponent(sesKey) + "%22,%22EXCEPTDETAIL%22:%22" + window.encodeURIComponent(statusText + "zzzz" + methodTrace + "zzzz" + serviceUrl) + "%22,%22EXCEPTUSERID%22:%22" + window.encodeURIComponent(empId) + "%22,%22EXCEPTUSERNAME%22:%22" + window.encodeURIComponent(fullUsername) + "%22,%22EXCEPTMETHODNAME%22:%22" + window.encodeURIComponent(methodName) + "%22,%22EXCEPTUSERAGENT%22:%22" + window.encodeURIComponent(userAgent) + "%22}}";
                    var urlPage = $rootScope.isMobileOrTab ? 'error.html' : 'errorDesktop.html';
                    http.get(url).success(function (data) {
                        
                        //$injector.get('$state').go('mSearch');
                        //$injector.get('$state').transitionTo('login');
                        //return $q.reject(response);
                        if (parseInt(data.LOGEXCEPTION_OUT_OBJ.RETCD) == 0) {
                            $window.location.href = urlPage+'?code=' + response.status+ '&lan=' + constantService.CURRENTLANGUAGE;
                        }
                        else {
                            $window.location.href = urlPage + '?code=' + response.status + '&lan=' + constantService.CURRENTLANGUAGE;
                        }
                    })
                    .catch(function (failure) {
                        $window.location.href = urlPage + '?code=' + response.status + '&lan=' + constantService.CURRENTLANGUAGE;;
                    });


                    $('#loadingWidget').hide();
                    $('#loadingWidgetDesktop').hide();

                }

                return $q.reject(response);
            }
        }
    };
}])


myTimeApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider) {
    // Push Interceptors
    $httpProvider.interceptors.push('httpInterceptor');
    
   
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            resolve: {
                item: function (maintenanceService) {
                    return maintenanceService.outageCheck();
                }
            }
        })
        .state('SessionExpire', {
            url: '/SessionExpire',
            templateUrl: 'templates/SessionExpire.html'
        })
        .state('Main', {
            url: '/Main',
            templateUrl: 'templates/Main.html',
            params: {
                loadDate: null,
                isDailyMode: null,
                currentDate: null

            }
        })
        .state('MainDesktop', {
            url: '/MainDesktop',
            templateUrl: 'templates/MainDesktop.html',
            params: {
                loadDate: null,
                isDailyMode: null,
                currentDate: null

            }
        })
        .state('NewEntry', {
            url: '/NewEntry',
            templateUrl: 'templates/NewEntry.html',
            controller: 'SearchCtrl'
        })
        .state('mNewEntry', {
            url: '/mNewEntry',
            templateUrl: 'templates/m-NewEntry.html',
            controller: 'SearchCtrl',
            params: {
                startDate: null,
                isDailyMode: true,
                IsEditMode: false,
                IsSearch: false,
                currentDate: null,
                Hours: null,
                Description: null,
                isCalFlg: false,
                isCancelSearch: false
            }
        })
        .state('mSearch', {
            url: '/mmSearch',
            templateUrl: 'templates/m-Search.html',
            controller: 'SearchCtrl',
            params: {
                startDate: null,
                searchKeyword: null,
                isDailyMode: true,
                IsEditMode: false,
                currentDate: null,
                Hours: null,
                Description: null,
                isCalFlg: false
            }
        })
        .state('favCEP', {
            url: '/favCEP',
            templateUrl: 'templates/FavCEP.html',
            controller: 'SearchCtrl',
            params: {
                startDate: null,
                searchKeyword: null
            }
        })
        .state('dirPagination', {
            url: '/dirPagination',
            templateUrl: 'templates/dirPagination.tpl.html',
            controller: 'HomeCtrl',
        })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('fr', translationsFR);
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

})
.run(['$rootScope', '$location', '$cookieStore', '$state', '$stateParams', 'deviceDetector', '$modalStack', '$modal', 'dateService', 'constantService', 'broadcastService', '$timeout', '$document', '$window', '$interval', 'loginService', function ($rootScope, $location, $cookieStore, $state, $stateParams, deviceDetector, $modalStack, $modal, dateService, constants, broadcastService, $timeout, $document, $window, $interval, loginService) {
    // Detect client calling device and set isMobileOrTab value if it is not set   
    if(navigator.userAgent.match(/BB/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i))
        $rootScope.isMobileOrTab = true;
    else
        $rootScope.isMobileOrTab = false;
    
    var isLangEng = localStorage.isEnglishLang;
    if (isLangEng !== null) {
        $rootScope.isEnglishLang =  (localStorage.isEnglishLang == "true"?true:false)
    }
   
    $(window).bind("unload", function() {        
        if ($rootScope.currentTemplate != undefined && $rootScope.currentTemplate.toLowerCase().indexOf("login.html") < 0 && $rootScope.currentTemplate.toLowerCase().indexOf("sessionexpire.html") < 0 && !$rootScope.isMobileOrTab)
        { 
            var loginDtls = $rootScope.GetLoginDetail(false, true);
            loginService.ClearCredentials();
            $rootScope.ClearLocalStorage(true);            
            var uAgent = escape(navigator.userAgent);
            uAgent = uAgent.substring(0, 100);
            $rootScope.transactionTimeout = false;
            $rootScope.loadingImgHidden = false;
            $rootScope.rowIndex = undefined;
            $rootScope.isLineClicked = true;
            $rootScope.changePassword = false;
            $rootScope.isCallAtInterval = false;
            $interval.cancel($rootScope.callBroadcastAtInterval);
            $interval.cancel($rootScope.callMonthEndAtInterval);
            $rootScope.isCallBroadcastAtInterval = false;
            var windowElement = angular.element($window);
            windowElement.off('beforeunload');
            var apiUrl = constants.DOMAINURL + constants.LOGOUTPACKAGENAME + "?I_JSON={%22LOGOUT_IN_OBJ%22%20:%20{%22SESKEY%22:%22" + window.encodeURIComponent(loginDtls.SESKEY) + "%22,%22UAGENT%22:%22" + window.encodeURIComponent(uAgent) + "%22}}";
            $.ajax({
                method: "GET",
                url: apiUrl,
                async: false
            })
            //.done(function (msg) {
                               
            //});
        }
    });
    var rx = /INPUT|SELECT|TEXTAREA/i;
    $(document).bind("keydown keypress", function (e) {
        if (e.which == 8) { // 8 == backspace
            if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                if (window.history != null && window.history != undefined && window.history.length > 1 && !$rootScope.isMobileOrTab) {
                    e.preventDefault();
                    window.history.go(-2);
                }
            }
        }
    });
$rootScope.TimeOut_Thread = Date("sessiontimeout");
var bodyElement = angular.element($document);
angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'],
    function (EventName) {
        bodyElement.bind(EventName, function (e) {
        $rootScope.TimeOut_Resetter(e)
        });
    });

$rootScope.LogoutByTimer = function () {
    broadcastService.myTimeSessionTimeout();
}

$rootScope.TimeOut_Resetter = function (e) {
    var tempDate = Date("sessiontimeout");
    var diff = tempDate.getTime() - $rootScope.TimeOut_Thread.getTime();
    var idleTimeoutToCheck = $rootScope.isMobileOrTab ? constants.IDLETIME : constants.IDLETIMEDESKTOP;
    if (diff > idleTimeoutToCheck) {
        $rootScope.TimeOut_Thread = Date("sessiontimeout");
        $rootScope.LogoutByTimer();
      }
    else
        $rootScope.TimeOut_Thread = Date("sessiontimeout");
    }

    $rootScope.$on('myTimeSessionTimeout', function () {
        if ($location.path() !== '/login' || (!$rootScope.isMobileOrTab && $location.path() == '/login' && $rootScope.changePassword === true)) {
            $modalStack.dismissAll();
            //$interval.cancel($rootScope.timeoutCheckAtInterval);
            $rootScope.isTimeOut = true;
            var timedout = null;
            if ($rootScope.isMobileOrTab)
                timedout = $modal.open({
                    templateUrl: 'timedout-dialog.html',
                    windowClass: 'modal-danger'
                });
            else {
                $timeout(function () { $("#closeBtn").focus(); }, 400);
                $timeout(function () { $("#closeBtn").focus(); }, 800);
                $timeout(function () { $("#closeBtn").focus(); }, 1200);
                timedout = $modal.open({
                    templateUrl: 'timedout-dialogDesktop.html',
                    windowClass: 'modal-danger'
                });
            }
timedout.result.then(function () {
    },
function () {
                    if (!$rootScope.isMobileOrTab)
                    {
                        $rootScope.transactionTimeout = false;
                        $rootScope.rowIndex = undefined;
                        $rootScope.isLineClicked = true;
                        $rootScope.changePassword = false;
                        $rootScope.isCallAtInterval = false;
                        $interval.cancel($rootScope.callBroadcastAtInterval);
                        $interval.cancel($rootScope.callMonthEndAtInterval);
                        $rootScope.isCallBroadcastAtInterval = false;
                        $rootScope.ClearLocalStorage(true);
                        var windowElement = angular.element($window);
                        windowElement.off('beforeunload');
                    }
                    broadcastService.sessionExpire()
    });
    }
                    });

    $rootScope.sessionInvalid = function (data) {
        if ((parseInt(data.RETCD) == 2) && (data.ERRMSG == "Invalid session ID.") && $rootScope.isTimeOut != true) {
            $modalStack.dismissAll();
            if ($location.path() !== '/login') {
                $rootScope.isTimeOut = false;
                var timedout = null;
                if ($rootScope.isMobileOrTab)
                    timedout = $modal.open({
                        templateUrl: 'timedout-dialog.html',
                        windowClass: 'modal-danger'
                    });
                else
                    timedout = $modal.open({
                        templateUrl: 'timedout-dialogDesktop.html',
                        windowClass: 'modal-danger'
                    });
            }
        }
    };
    $rootScope.ClearLocalStorage = function (isPreserveAttempts) {
        delete $rootScope.designateOfEmp;
        if (isPreserveAttempts) {
            var attemptsArrayKeys = []; // Array to hold the keys
            var attemptsArrayValues = [];
            // Iterate over localStorage and insert the keys that meet the condition into arr
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf("_attempts") > -1) {
                    var key = localStorage.key(i);
                    var value = localStorage[key];
                    attemptsArrayKeys.push(key);
                    attemptsArrayValues.push(value);
                }
            }
            localStorage.clear();
            // Iterate over arr
            for (var j = 0; j < attemptsArrayKeys.length; j++) {
                localStorage.setItem(attemptsArrayKeys[j], attemptsArrayValues[j]);
            }

        }
        else
            $rootScope.ClearLocalStorage(true);
    }
    $rootScope.GetLoginDetail = function (isLogout, isPass) {
        var loginDetail = JSON.parse(localStorage.getItem('Login_Detail'));        
        if (loginDetail == null) {
            if (isLogout) {
                $rootScope.ClearLocalStorage(true);
                $state.go('login');
            }
            else
            {
                if (isPass) {
                    var data = {
                        RETCD: 2,
                        ERRMSG: "Invalid session ID."
                    }
                    $rootScope.sessionInvalid(data);
                }
                else{
                    return loginDetail;
                }
            }
        }
        else {
            var initialDetail = null;
            loginDetail.isDesignateSet = false;
            if (!$rootScope.isMobileOrTab) {
                loginDetail.empLoggedInId = loginDetail.EMPLID;                
                $rootScope.designateOfEmp = $rootScope.designateOfEmp === undefined ? ({ EMPLID: "0" }) : $rootScope.designateOfEmp;
                $rootScope.designateOfEmp.loginEmpId = loginDetail.EMPLID;
                if ($rootScope.designateOfEmp.EMPLID !== "0" && $rootScope.designateOfEmp.EMPLID !== loginDetail.EMPLID) {
                    loginDetail.EMPLID = $rootScope.designateOfEmp.EMPLID;
                    loginDetail.isDesignateSet = true;
                }
            }           
            initialDetail = $rootScope.GetInitialDetail(true, false);
            if (!$rootScope.isMobileOrTab) {
                loginDetail.loginUsrDisplayName = initialDetail.loginUsrInitialDetail.EMPL_REC.FNAME + " " + initialDetail.loginUsrInitialDetail.EMPL_REC.LNAME;
                if (loginDetail.isDesignateSet) {
                    initialDetail = $rootScope.designateOfEmp.initialDetail;
                }
            }
            $rootScope.displayUsername = initialDetail.EMPL_REC.FNAME + " " +initialDetail.EMPL_REC.LNAME;
            return loginDetail;
        }

    };
    $rootScope.errorLogMethod = function (msg) {
        $rootScope.methodName += "yy" + msg;
        var tempMethodName = $rootScope.methodName;
        if (tempMethodName.length > 2000) {
            tempMethodName = tempMethodName.substring((tempMethodName.length - 2000));
        }
        $rootScope.methodName = tempMethodName;
    }
    $rootScope.hideUiGridOnGridGrouping = function (gridId) {
        $(gridId+" div.ui-grid-viewport").addClass('my-cloak');
        $(gridId+" ui-grid-footer").addClass('my-cloak');
        $('#loadingWidgetDesktop').show();
    }
    $rootScope.showUiGridAfterGrouping = function (gridId) {
        $(gridId + " div.ui-grid-viewport").removeClass('my-cloak');
        $(gridId + " ui-grid-footer").removeClass('my-cloak');
        $('#loadingWidgetDesktop').hide();
    }
    $rootScope.isDatePriorToBillingDate = function (billingDate, date) {       
        var isDisable = false;        
        var parts = billingDate.split("-");
        var day = parts[2].split(' ');
        var billingDte = new Date(parts[0], parts[1] - 1, day[0]);
        if (new Date(date.valueOf()) < new Date(billingDte.valueOf())) {
            isDisable = true;
        }       
        return isDisable;        
    }
    $rootScope.chekRevDateInLocalStorage = function (pdate, invalidSessionErr, isShowPopUp) {
        var selObj = null;
        var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months'));
        if ((revMnthRange == null || pdate == null)) {
            if (isShowPopUp) {
                var data = {
                RETCD: 2,
            ERRMSG: invalidSessionErr
                }
                $rootScope.sessionInvalid(data);
                }
                else return null;
                }
                else {
                pdate.setHours(0, 0, 0, 0);
                for (var i = 0; i < revMnthRange.length; i++) {
                    if (revMnthRange[i]!= null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                    if (pdate >= dateService.createDate(revMnthRange[i].STRTDTE) && pdate <= dateService.createDate(revMnthRange[i].ENDDTE)) {
                        selObj = revMnthRange[i];
                        break;
                        }
                }
                }
            return selObj;
            }
                }
    $rootScope.GetInitialDetail = function (isLogout, isPass) {
        var loginDetail = JSON.parse(localStorage.getItem('Initial_Data'));
        if (loginDetail == null) {
            if (isLogout) {
                $rootScope.ClearLocalStorage(true);
                $state.go('login');
            }
            else {
                if (isPass) {
                    var data = {
                        RETCD: 2,
                        ERRMSG: "Invalid session ID."
                    }
                    $rootScope.sessionInvalid(data);
                }
                else {
                    return loginDetail;
                }
            }
        }
        else {
            if (!$rootScope.isMobileOrTab) {
                var loggedInUsrDetail = loginDetail;
                $rootScope.designateOfEmp = $rootScope.designateOfEmp === undefined ? ({ EMPLID: "0" }) : $rootScope.designateOfEmp;
                if ($rootScope.designateOfEmp.EMPLID !== "0" && $rootScope.designateOfEmp.EMPLID != $rootScope.designateOfEmp.loginEmpId) {
                    loginDetail = $rootScope.designateOfEmp.initialDetail;
                }
                loginDetail.loginUsrInitialDetail = JSON.parse(localStorage.getItem('Initial_Data'));
            }
            return loginDetail;
        }
    }
   // keep user logged in after page refresh        
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        var abc = 'abc';
    //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line        
}

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
        //alert("hi");

    $rootScope.initialLoadingMessage = constants.DESKTOPINITIALLOADMSG;
    $rootScope.$on('$locationChangeStart', function ($event, next, current) {
        // redirect to login page if not logged in 
        if ($location.path() == '/login') {
            $rootScope.isCallAtInterval = false;
            $interval.cancel($rootScope.callBroadcastAtInterval);
        }
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {

            $location.path('/login');
        }
        else if (localStorage.getItem("isLoggedIn") != null && localStorage.getItem("isLoggedIn") == "true" && $rootScope.globals.currentUser) {
            if ($rootScope.isMobileOrTab)
                $location.path('/Main');
            //else
            //    $location.path('/login');
        }

        var nextData = next.split('#/')[1];
        var currentData = current.split('#/')[1];
        if ((nextData == "Main") && (currentData == 'mNewEntry') || (nextData == "MainDesktop") && (currentData == 'mNewEntryDesktop')) {
            if ((typeof $event.currentScope.$stateParams.startDate != 'undefined') || ($event.currentScope.$stateParams.startDate != null)) {
                var currentDate = new Date($event.currentScope.$stateParams.currentDate.valueOf());
                var startDate = new Date($event.currentScope.$stateParams.startDate.valueOf());
                localStorage.setItem('currentDate', currentDate);
                localStorage.setItem('loadDate', startDate);
                localStorage.setItem('isDailyMode', $event.currentScope.$stateParams.isDailyMode);
        }
        }
        if ((nextData == "mNewEntry") && (currentData == 'mmSearch') && ($rootScope.isRefresh)) {
            if ((typeof $event.currentScope.$stateParams.startDate != 'undefined') || ($event.currentScope.$stateParams.startDate != null)) {
                var currentDate = new Date($event.currentScope.$stateParams.currentDate.valueOf());
                var startDate = new Date($event.currentScope.$stateParams.startDate.valueOf());
                localStorage.setItem('currentDate', currentDate);
                localStorage.setItem('loadDate', startDate);
                localStorage.setItem('isDailyMode', $event.currentScope.$stateParams.isDailyMode);
        }
        }

        if (((nextData == "mmSearch") || (nextData == "mNewEntry")) && (currentData == 'mNewEntry') && ($rootScope.isRefresh)) {
            if ((typeof $event.currentScope.$stateParams.startDate != 'undefined') || ($event.currentScope.$stateParams.startDate != null)) {
                var currentDate = new Date($event.currentScope.$stateParams.currentDate.valueOf());
                var startDate = new Date($event.currentScope.$stateParams.startDate.valueOf());
                localStorage.setItem('currentDate', currentDate);
                localStorage.setItem('loadDate', startDate);
                localStorage.setItem('isDailyMode', $event.currentScope.$stateParams.isDailyMode);
        }
        }

        var openedModal = $modalStack.getTop();
        if (openedModal) {
            if (openedModal.value.modalScope.popUpName != 'ErrorPopup')
                $modalStack.dismiss(openedModal.key);

        }
    });

}])


