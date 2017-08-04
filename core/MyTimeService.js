angular.module('MyTimeApp')
// Constant Service to set Constant Variable 
.constant('constantService', {
    APPNAME: "My Time",
    APPVERSION: "1.55",
    LAYOUTMODE: { Daily: '1', Weekly: '2', Search: '3' },
    DOMAINURL: "http://qa.api.mytime.mercer.com:8000/te_html5_htp_pkg",
    RETRIEVETIMEENTRYPACKAGENAME: ".retrieveTimeEntries",
    SUBMITTIMEENTRIESPKGNAME: ".submitTimeEntries",
    DELETETIMEENTRYPACKAGENAME: ".deleteTimeEntries",
    RETRIEVECEPFAVORITESPKGNAME: ".retrieveCEPFavorites",
    LOADREVENUEMONTHSPACKAGENAME: ".loadRevenueMonths?I_JSON=",
    LOADGLOBALPREFERENCES: ".loadGlobalPreferences",
    LOGINPACKAGENAME: ".Login",
    LOGOUTPACKAGENAME: ".Logout",
    RETRIEVEINITIALDATA: ".retrieveInitialData",
    LOADSTATEPROVINCE: ".loadStateProv",
    LOOKUPCEPCODE: ".lookupCEPCode",
    lOADCEPCODEDETAILS: ".loadCEPCodeDetails",
    SAVETIMEENTRY: ".saveTimeEntry",
    RETRIEVEDESCRIPTIONFAVORITES: ".retrieveDescriptionFavorites",
    LOADPROJECTCOMPONENTTASKS: ".loadProjectComponentTasks",
    LOADACTIVITIES: ".loadActivities",
    RETRIEVEACTIVITYFAVORITES: ".retrieveActivityFavorites",
    LOADICRATES: ".loadICRates",
    RETRIEVETIMEENTRIES: ".retrieveTimeEntries",
    LOGEXCEPTION: ".logexception",
    SAVEPREFERENCES: ".savePreferences",
    ADDCEPFAVORITES: ".addCEPFavorites",
    REMOVECEPFAVORITES: ".removeCEPFavorites",
    ADDACTIVITYFAVORITES: ".addActivityFavorites",
    REMOVEACTIVITYFAVORITES: ".removeActivityFavorites",
    ADDDESCRIPTIONFAVORITE: ".addDescriptionFavorite",
    REMOVEDESCRIPTIONFAVORITES: ".removeDescriptionFavorites",
    ENGLISHLANGUAGEKEY: 'en',
    FRENCHLANGUAGEKEY: 'fr',
    FRENCHLANGUAGEKEYAPISTRING: 'FR-CA',
    DOMAINNAME: "mercer",
    RETRIEVECALENTRIES: ".retrieveCalendarEntries",
    RETRIEVECALENTRYDETAIL: ".retrieveCalendarEntryDetail",
    CURRENTLANGUAGE: 'en',
    RETRIEVEBROADCASTMESSAGES: '.retrieveBroadcastMessages',
    RUNREPORT: '.runReport',
    DISMISSBROADCASTMESSAGE: '.dismissBroadcastMessage',
    LOADBECOMEDESIGNATE: '.loadBecomeDesignate',
    LOOKUPEMPLOYEES: '.lookupEmployees',
    ADDDESIGNATE: '.addDesignate',
    LOADDESIGNATE: '.loadDesignates',
    SETGOCMAIL: '.setGocMail',
    REMOVEDESIGNATES: '.removeDesignates',
    CHECKOUTAGE: '.checkOutage',
    SAVEGRIDLAYOUT: '.saveGridLayout',
    REMOVEGRIDLAYOUT: '.removeGridLayout',
    IDLETIME: 3600000,
    IDLETIMEDESKTOP: 28800000,
    TIMEOUT: false,
    ISCOLLPSED: true,
    GETENCRYPTKEY: '.getencryptKey',
    nonADinvalidMsg: 'Login unsuccessful. Please enter valid credentials.',
    SHAREDCALMSG1: 'Calendar is not shared for ',
    SHAREDCALMSG2: '. Please verify and try again.',
    PASSWORDCHANGE: '.changePassword',
    RESETPASSWORD: '.resetpassword',
    DESKTOPINITIALLOADMSG: "myTime is loading, and could take up to 5 minutes depending on your connection speed. Please do not exit this page until myTime has loaded",
    DESKTOPLOADMESSAGE: "Please wait...",
    DESKTOPDISPLAYSECONDS: 5,
    EXCESSIVEHRS: 200,
    EXCESSIVENEGHRS: -200,
    intrvlTmng: 1800000,
    BroadCastUpdate: { updateFavActivity: 1, updateFavDesc: 2, updateFavCep: 3, updateAll: 4 }
})
.factory('commonUtilityService', ['$q', '$http', 'constantService', 'dateService', '$filter', '$rootScope', function (qService, http, constantService, dateService, $filter, $rootScope) {
    return {
        'removeSpecialCharFromStr': function (str, mode) {
            var temp = str;
            if (mode == 0) {
                temp = str.replace(/\t/g, " ");               
            }
           else if (mode == 1) {
                temp = str.replace(/\n/g, " ");               
           }
           else if (mode == 2) {              
               temp = str.replace(/\n/g, " ");
               temp = temp.replace(/\t/g, " ");
           }
            return temp;
         },
        'hideZeroOnYUIChart':function(data){ 
            var newData =JSON.parse(JSON.stringify(data));
            for (var i = 0; i < newData.length; i++) {
                if (newData[i].Billable == 0) {
                    newData[i].Billable = "";
                }
                if (newData[i].Chargeable == 0) {
                    newData[i].Chargeable = "";
                }
                if (newData[i].Non_Billable == 0) {
                    newData[i].Non_Billable = "";
                }
                if (newData[i].Total == 0) {
                    newData[i].Total = "";
                }
            }
            return newData;
        },
        'validateTENegValue': function (time_Obj, initialDetail,isTime) {
            var msg = '';
            switch (time_Obj.CEP_REC.CHARBASIS) {
                case 'N': if (initialDetail.COMP_REC.NTIM != 'Y') {
                    msg = (isTime ? 'msg_NegativeHrs' : 'msg_NegICCharge');                    
                }
                    break;
                case 'T': if (initialDetail.COMP_REC.NBTM != 'Y') {
                    msg = (isTime ? 'msg_BillingNegativeHrs' : 'msg_NegICCharge');                    
                }
                    break;
                case 'S':
                case 'C':
                    if (initialDetail.COMP_REC.NBTM != 'Y') {
                        msg = (isTime ? 'msg_NegativeHrs' : 'msg_NegICCharge');                        
                    }
                    break;

            }
            msg = (msg == "" ? "" : $filter('translate')(msg));
            return msg;
        },

        'getWkDayOnOpenCloseRevStatus': function (weekStartDate) {
            var weekDayOn = [true, true, true, true, true, true, true];
            var isDisable = false;            
            var initialDetail = $rootScope.GetInitialDetail(false, true);
            var currentRevObj = initialDetail.REVM_REC;
            var revStartDate = dateService.createDate(currentRevObj.STRTDTE);
            for (var i = 0; i <= 6; i++) {
                var weekStartingDate = new Date(weekStartDate.valueOf());
                var date = weekStartingDate.setDate(weekStartingDate.getDate() + i);
                var weekDayDate = dateService.createDate($filter('date')(date, 'yyyy-MM-dd'));
                if (weekDayDate < revStartDate) {
                    weekDayOn[i] = false;
                }
                else
                    break;
            }
            return weekDayOn;
        },
        'countNoOfTimeEntry': function (weekTERecord) {
            var count = 0;
            if (weekTERecord.Hrs1 != null) {
                count++;
            }
            if (weekTERecord.Hrs2 != null) {
                count++;
            }
            if (weekTERecord.Hrs3 != null) {
                count++;
            }
            if (weekTERecord.Hrs4 != null) {
                count++;
            }
            if (weekTERecord.Hrs5 != null) {
                count++;
            }
            if (weekTERecord.Hrs6 != null) {
                count++;
            }
            if (weekTERecord.Hrs7 != null) {
                count++;
            }
            return count;
        },
        'getDeleteTeIdObj': function (selRec, weekDayOnOffStatus) {
            var obj = {
                tEIdsStr: "", invalidCount: 0, isTEInOpenREVWeekExist: false
            };      
            for (var i = 1; i <= 7; i++) {
                var teid = "TEID" + i;
                if (selRec[teid] != undefined) {
                    obj.tEIdsStr += (obj.tEIdsStr == "" ? "" : ",") + selRec[teid];
                    obj.invalidCount += (weekDayOnOffStatus[i - 1] === false ? 1 : 0);
                    if (weekDayOnOffStatus[i - 1]) {
                        obj.isTEInOpenREVWeekExist = true;
                    }
                }
            }
            return obj;
        },
        'updateSummaryData': function (timeEntry, summaryData, dataDTE, currDate) {            
            var isSelctedDay = (dataDTE.getTime() === currDate.getTime()) ? true : false;
            var isIcEntry = false;
            if (timeEntry.ICRTCD != undefined && timeEntry.ICRTCD != null && timeEntry.ICRTCD.trim() != "" && timeEntry.ICRTCD.trim().length) {
                isIcEntry = true;
            }
            //update for time entries  summary
            if (!isIcEntry) {
                //update daily and weekly billable , non-billable and chargeble  hours sum
                switch (timeEntry.CEP_REC.CHARBASIS) {
                    case 'N':
                        summaryData.WNONBILLABLE = summaryData.WNONBILLABLE + parseFloat(timeEntry.HRS);
                        summaryData.DNONBILLABLE = (isSelctedDay ? (summaryData.DNONBILLABLE + parseFloat(timeEntry.HRS)) : summaryData.DNONBILLABLE);
                        break;
                        //Billable
                    case 'T':
                        summaryData.WBILLABLE = summaryData.WBILLABLE + parseFloat(timeEntry.HRS);
                        summaryData.DBILLABLE = (isSelctedDay ? (summaryData.DBILLABLE + parseFloat(timeEntry.HRS)) : summaryData.DBILLABLE);
                        break;
                        //Chargable
                    case 'S':
                    case 'C':
                    case 'R':
                        summaryData.WCHARGEABLE = summaryData.WCHARGEABLE + parseFloat(timeEntry.HRS);
                        summaryData.DCHARGEABLE = (isSelctedDay ? (summaryData.DCHARGEABLE + parseFloat(timeEntry.HRS)) : summaryData.DCHARGEABLE);
                        break;
                        //Non billable
                    default:
                        summaryData.WNONBILLABLE = summaryData.WNONBILLABLE + parseFloat(timeEntry.HRS);
                        summaryData.DNONBILLABLE = (isSelctedDay ? (summaryData.DNONBILLABLE +parseFloat(timeEntry.HRS)): summaryData.DNONBILLABLE);
                }
                //update daily and weekly hours total
                summaryData.DTOTTIME = (isSelctedDay ? (summaryData.DTOTTIME + parseFloat(timeEntry.HRS)) : summaryData.DTOTTIME);
                summaryData.WTOTTIME = summaryData.WTOTTIME + parseFloat(timeEntry.HRS);
            }

            //update for IC entries summary 
            else {
                summaryData.WTOTIC = summaryData.WTOTIC + parseFloat(timeEntry.ICCHRGE);
                summaryData.DTOTIC = (isSelctedDay ? (summaryData.DTOTIC + parseFloat(timeEntry.ICCHRGE)): summaryData.DTOTIC);
            }

       },
        'getCachedTimeEntriesByMode': function (startDate, endDate, data, selDate) {
            var strtDate = dateService.createDate(startDate);
                    var endDate = dateService.createDate(endDate);
            var currDate = null;
            var weekStartDate = null;
            var weekEndDate = null;
            if (selDate) {
                currDate = dateService.createDate(selDate);
                weekStartDate = new Date(currDate.valueOf());
                weekStartDate = weekStartDate.setDate(currDate.getDate() - currDate.getDay());

                weekStartDate = new Date(weekStartDate);               
                weekEndDate = new Date(weekStartDate.valueOf());
                weekEndDate = weekEndDate.setDate(weekStartDate.getDate() + 6);
                weekEndDate = new Date(weekEndDate);                
                //Summary variable set to 0, will be recalculated from cache data
                data.RETTIM_OUT_OBJ.TIME_SUMM.WNONBILLABLE = 0;
                data.RETTIM_OUT_OBJ.TIME_SUMM.WCHARGEABLE = 0;
                data.RETTIM_OUT_OBJ.TIME_SUMM.WBILLABLE = 0;

                data.RETTIM_OUT_OBJ.TIME_SUMM.WTOTIC = 0;
                data.RETTIM_OUT_OBJ.TIME_SUMM.DTOTIC = 0;

                data.RETTIM_OUT_OBJ.TIME_SUMM.DNONBILLABLE = 0;
                data.RETTIM_OUT_OBJ.TIME_SUMM.DBILLABLE = 0;
                data.RETTIM_OUT_OBJ.TIME_SUMM.DCHARGEABLE = 0;

                data.RETTIM_OUT_OBJ.TIME_SUMM.DTOTTIME = 0;
                data.RETTIM_OUT_OBJ.TIME_SUMM.WTOTTIME = 0;
            }
            var returnData = [];
            var dataTemp = JSON.parse(JSON.stringify(data.RETTIM_OUT_OBJ.TIME_ARR));
            data.RETTIM_OUT_OBJ.TIME_ARR = [];
            for (var i = 0, len = dataTemp.length; i < len; ++i) {
                var dataDTE = dateService.createDate(dataTemp[i].DTE);
                if (dataDTE >= strtDate && dataDTE <= endDate) {
                    returnData.push(dataTemp[i]);
            }
                //update summary information for week and the selected day
                if (currDate != null && dataDTE >= weekStartDate && weekEndDate >= dataDTE) {
                        this.updateSummaryData(dataTemp[i], data.RETTIM_OUT_OBJ.TIME_SUMM, dataDTE, currDate);

                 }
            }
            data.RETTIM_OUT_OBJ.TIME_ARR = returnData;
            return data;
        },
        'getRevStartEndDateBySelDate': function (selDate) {
            var selObj;
            var revmDte = dateService.createDate(selDate);
            var revMnthRange = null;
            if (localStorage.getItem("RevMonthDetails") != null)
                revMnthRange = JSON.parse(localStorage.getItem("RevMonthDetails")).LOADREVM_OUT_OBJ.REVM_ARR;
            else
                revMnthRange = JSON.parse(localStorage.getItem("Revenue_Months"));
            for (var i = 0, len = revMnthRange.length; i < len; ++i) {
                if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                    var revStartDate = dateService.createDate(revMnthRange[i].STRTDTE);
                    var revEndDate = dateService.createDate(revMnthRange[i].ENDDTE);
                    if (revmDte >= revStartDate && revmDte <= revEndDate) {
                        selObj = revMnthRange[i];
                        break;
                    }
                }
            }
            if (selObj != null) {
                return { revStartDate: selObj.STRTDTE, revEndDate: selObj.ENDDTE };
            }
            else {
                //alert('getRevStartEndDateBySelDate');
            }
        },
        'getRangeDatesByRevDates': function (revStartDate, revEndDate) {
            var startDate = dateService.createDate(revStartDate);
            var endDate = dateService.createDate(revEndDate);
            var rangeStartDate = new Date(startDate.valueOf());
            var rangeEndDate = new Date(endDate.valueOf());
            rangeStartDate.setDate(startDate.getDate() - startDate.getDay());
            rangeEndDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
            var rangeStartDateStr = $filter('date')(rangeStartDate, 'yyyy-MM-dd HH:mm:ss');
            var rangeEndDateStr = $filter('date')(rangeEndDate, 'yyyy-MM-dd HH:mm:ss');
            return { rangeStartDate: rangeStartDateStr, rangeEndDate: rangeEndDateStr }
        },
        'isSelDateInRange': function (selDate) {
            if (localStorage.retrieveTimeEntriesDataSaved != null && localStorage.savedTimeEntriesRevDates != null) {
                if (dateService.createDate(selDate) >= dateService.createDate(JSON.parse(localStorage.savedTimeEntriesRevDates).savedRevStartDate) && dateService.createDate(selDate) <= dateService.createDate(JSON.parse(localStorage.savedTimeEntriesRevDates).savedRevEndDate))
                    return true;
            }
            return false;
        },
        'excludeWeekEndData': function (data) {
            var filteredData = [];
            for (var i = 0; i < data.length - 1; i++) {
                var tempDate = dateService.createDate(data[i].Date);
                if (tempDate.getDay() != 0 && tempDate.getDay() != 6)
                    filteredData.push(JSON.parse(JSON.stringify(data[i])));
            }
            return filteredData;
        },
        'pasteByDragService': function (startDate, endDate, hrs) {
            var is24HrFlag = false; var totalhrs = 0;
            if (angular.isUndefined($rootScope.totalPastedHrs)) $rootScope.totalPastedHrs = 0;
            var data = this.getCachedTimeEntriesByMode(startDate, endDate, JSON.parse(localStorage.retrieveTimeEntriesDataSaved))
            if (data.RETTIM_OUT_OBJ.TIME_ARR.length == 0) {
                if (hrs > 24)
                    is24HrFlag = true;
                else {
                    $rootScope.totalPastedHrs = parseFloat($rootScope.totalPastedHrs) + parseFloat(hrs);
                    if ($rootScope.totalPastedHrs > 24)
                        is24HrFlag = true;
                }
            }
            else if (data.RETTIM_OUT_OBJ.TIME_ARR.length > 0) {
                if ($rootScope.totalPastedHrs == 0) {
                    for (var i = 0; i < data.RETTIM_OUT_OBJ.TIME_ARR.length; i++) {
                        totalhrs = parseFloat(totalhrs) + parseFloat(data.RETTIM_OUT_OBJ.TIME_ARR[i].HRS);
                    }
                }
                $rootScope.totalPastedHrs = ($rootScope.totalPastedHrs == 0 ? parseFloat(totalhrs) : parseFloat($rootScope.totalPastedHrs)) + parseFloat(hrs)
                if ($rootScope.totalPastedHrs > 24)
                    is24HrFlag = true;
            }
            console.log('pasteByDragService--' + $rootScope.totalPastedHrs)
            return is24HrFlag
        },
        'copyToTodayCopyToWeekService': function (sessionKey, empID, startDate, endDate, selDate, success) {
            var includeIC = "N";
            if (!$rootScope.isMobileOrTab)
                includeIC = "Y";
            $rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRYPACKAGENAME;
            var deferred = qService.defer();
            var _selDate = "", _includeIC = "", urlJSON = "";
            var _returnObject = '{"RETTIM_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + sessionKey + '" ,'
            var _empID = '"EMPLID" : "' + empID + '" ,'
            var _startDate = '"STRTDTE":"' + startDate + '" ,'
            var _endDate = '"ENDDTE":"' + endDate + '" ,'
            if (includeIC == "N")
                _selDate = '"SELDATE":"' + selDate + '"}}';
            else {
                _selDate = '"SELDATE":"' + selDate + '" ,'
                _includeIC = '"INCIC":"' + includeIC + '"}}';
            }
            if (includeIC == "N")
                urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate);
            else
                urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate, _includeIC);

            var url = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRYPACKAGENAME + '?I_JSON=' + urlJSON + '&timestamp=' + (new Date()).getTime();

            http.get(url).success(function (data) {
                $rootScope.sessionInvalid(data.RETTIM_OUT_OBJ);
                //Removing IC Data
                if (data.RETTIM_OUT_OBJ.RETCD == 0 && includeIC == "N") {
                    for (var i = 0; i < data.RETTIM_OUT_OBJ.TIME_ARR.length; i++) {
                        if ((typeof data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD != 'undefined') && (data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD != null)) {
                            if ((data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD.trim().length > 0)) {
                                data.RETTIM_OUT_OBJ.TIME_ARR.splice(i, 1);
                                i = i - 1;
                            }
                        }
                    }
                }
                deferred.resolve(data);


            });

            return deferred.promise;



        },        
        'calculateTotalYPointsToDraw': function (totalHours, interval, isNegHrs, valMax) {
            var countPeriods = 4;
            if (totalHours > 0) {
                var temp = totalHours / interval;
                var totalInterval = Math.ceil(temp);
                countPeriods = totalInterval + 1;
                //if both negative and positive hours are present then countPeriods(y points) should be odd
                if (isNegHrs && valMax > 0 && (countPeriods % 2 == 0))
                    countPeriods++;
            }
            return countPeriods;
        },
        'updateChartConfig': function (yGap, countPeriods, isNegVal, maxHrsValAvailable, minHrsValAvailable, minCountPeriods,mode) {
            maxHrsValAvailable = (maxHrsValAvailable === "" ? 0 : maxHrsValAvailable);
            minHrsValAvailable = (minHrsValAvailable === "" ? 0 : minHrsValAvailable);
            var ttlNoOfYPoint = countPeriods;
            var minChartYPoint = 0, maxChartYPoint=0;
            var val = (yGap * (ttlNoOfYPoint - 1));
            var maxYAxisVal = Math.round(val * 100) / 100;
            maxChartYPoint = maxYAxisVal;
            if (isNegVal) {
                //no positive hrs available, start chart from 0 to negative hrs value
                if (maxHrsValAvailable == 0) {
                    maxChartYPoint = 0;
                    minChartYPoint = -maxYAxisVal
                }
                    //divide the y interval in equal +ve and -ve intervals
                else {
                    minChartYPoint = -(maxChartYPoint) / 2;
                    maxChartYPoint = (maxChartYPoint) / 2;
                }
                if (Math.abs(minHrsValAvailable) > Math.abs(minChartYPoint)) {
                    while (Math.abs(minHrsValAvailable) > Math.abs(minChartYPoint)) {
                        minChartYPoint = minChartYPoint - yGap;
                        minChartYPoint = Math.round(minChartYPoint *100) /100;
                        var temp = maxChartYPoint - yGap;
                        if ((temp >= maxHrsValAvailable)) {
                            maxChartYPoint = temp;
                        }
                        else {
                            // case : -7.5, 0.5
                            countPeriods = countPeriods + 1;
                        }
                    }
                }
                else if (maxHrsValAvailable > maxChartYPoint) {
                    while (maxHrsValAvailable > maxChartYPoint) {
                        maxChartYPoint = maxChartYPoint + yGap;
                        maxChartYPoint = Math.round(maxChartYPoint * 100) / 100;
                        var temp = minChartYPoint + yGap;
                        if ((Math.abs(temp) >= Math.abs(minHrsValAvailable))) {
                            minChartYPoint = temp;
                        }
                        else {
                            // case : 7.5, -0.5
                            countPeriods = countPeriods + 1;
                        }
                    }
                }
            }
            //if positive value fall on boundry point  
            if (mode==2 && maxChartYPoint == maxHrsValAvailable && maxChartYPoint !== 0) {
                countPeriods = countPeriods + 1;
                maxChartYPoint = maxChartYPoint + yGap;
            }
            if (mode == 2 && minChartYPoint == minHrsValAvailable && minHrsValAvailable !== 0) {
                countPeriods = countPeriods + 1;
                minChartYPoint = minChartYPoint - yGap;
            }
            if (countPeriods < minCountPeriods) {
                countPeriods++;
                if (maxChartYPoint != 0)
                    maxChartYPoint = maxChartYPoint + yGap;
                else
                    minChartYPoint = minChartYPoint - yGap;
            }
            return [minChartYPoint, maxChartYPoint, countPeriods];
        }

    }

}])
.factory('loginService', ['Base64', '$http', '$cookieStore', '$q', '$rootScope', 'constantService', function (Base64, http, $cookieStore, $q, rootScope, constantService) {
    return {
        'login': function (userName, password, clientType, applicationVersion, userAgent, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOGINPACKAGENAME;
            http.post(constantService.DOMAINURL + constantService.LOGINPACKAGENAME + "?I_JSON={%22LOGIN_IN_OBJ%22%20:%20{%22USRNAME%22:%22" + window.encodeURIComponent(userName) + "%22,%22PW%22:" + window.encodeURIComponent(JSON.stringify(password)) + ",%22CLITYP%22:%22" + window.encodeURIComponent(clientType) + "%22,%22APPVER%22:%22" + window.encodeURIComponent(applicationVersion) + "%22,%22UAGENT%22:%22" + window.encodeURIComponent(userAgent) + "%22}}").success(function (data) {
                rootScope.sessionInvalid(data.LOGIN_OUT_OBJ);
                success(data);
            });
        },
        //Sangeeta -logout functionality
        'logout': function (sesKey, userAgent, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOGOUTPACKAGENAME;
            http.get(constantService.DOMAINURL + constantService.LOGOUTPACKAGENAME + "?I_JSON={%22LOGOUT_IN_OBJ%22%20:%20{%22SESKEY%22:%22" + window.encodeURIComponent(sesKey) + "%22,%22UAGENT%22:%22" + window.encodeURIComponent(userAgent) + "%22}}").success(function (data) {
                success(data);
            });
        },
        'retrieveInitialData': function (sesKey, empId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVEINITIALDATA;
            var def = $q.defer();
            var start = '{"RETINIT_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var em = '"EMPLID" : ' + empId + '} }';
            var dataTest = start.concat(sess, em);
            var url = constantService.DOMAINURL + constantService.RETRIEVEINITIALDATA + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            // alert(url);
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETINIT_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'loadStateProv': function (sesKey, empId, domainURL) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADSTATEPROVINCE;
            var def = $q.defer();
            var start = '{"LOADSTATPROV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var em = '"EMPLID" : ' + empId + '} }';
            var dataTest = start.concat(sess, em);
            var url = constantService.DOMAINURL + constantService.LOADSTATEPROVINCE + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADSTATPROV_OUT_OBJ);
                def.resolve(data);

            })
            return def.promise;
        },
        'SetCredentials': function (username, password) {
            var authdata = Base64.encode(username + ':' + password);
            rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            //http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line            
            $cookieStore.put('globals', rootScope.globals);
            localStorage.sessionUsername = username;
        },
        'ClearCredentials': function () {
            rootScope.globals = {};
            $cookieStore.remove('globals');
            //http.defaults.headers.common.Authorization = 'Basic ';
        },
        'nonADlogin': function (seskey, username, password, domain, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.GETENCRYPTKEY;
            //http.get(constantService.DOMAINURL + constantService.GETENCRYPTKEY + "?I_JSON={%22GETENCRYPT_IN_OBJ%22%20:%20{%22SESKEY%22:%22" + seskey + "%22,%22USRNAME%22:" + window.encodeURIComponent(username) + ",%22PW%22:%22" + window.encodeURIComponent(JSON.stringify(password)) + "%22}}").success(function (data) {
            //    //alert(apiUrl);
            //    success(data);
            //});
            var def = $q.defer();
            var start = '{"GETENCRYPT_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + seskey + '" ,'
            var _username = '"USRNAME" : "' + username + '" ,'
            var _pswrd = '"PW":' + JSON.stringify(password) + ' ,'
            var _domain = '"DOMAIN":"' + domain + '"}}';
            var dataTest = start.concat(_session, _username, _pswrd, _domain);

            var url = constantService.DOMAINURL + constantService.GETENCRYPTKEY + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                success(data);

            })

        },
        'changePassword': function (seskey, newpassword, oldpassword, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.PASSWORDCHANGE;
            var def = $q.defer();
            var start = '{"CHPW_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + seskey + '" ,'
            var _newpswrd = '"NEWPW":' + JSON.stringify(newpassword) + ' ,'
            var _oldpswrd = '"OLDPW":' + JSON.stringify(oldpassword) + '}}';
            var dataTest = start.concat(_session, _newpswrd, _oldpswrd);
            var url = constantService.DOMAINURL + constantService.PASSWORDCHANGE + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                success(data);

            })

        },
        'resetPassword': function (emplId, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RESETPASSWORD;
            var def = $q.defer();
            var start = '{"RESETPW_IN_OBJ": {"EMPLID" : "' + emplId + '"}}';
            var url = constantService.DOMAINURL + constantService.RESETPASSWORD + '?I_JSON=' + window.encodeURIComponent(start) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                success(data);
            })
        }
    }
}])

// Call Retrieve Time Entry Data API
.factory('gridDataService', ['$q', '$http', '$rootScope', 'constantService', 'commonUtilityService', '$timeout', function (qService, http, rootScope, constantService, commonUtilityService, $timeout) {
    return {
        'getDataForSubmit': function (sessionKey, empID, startDate, endDate, selDate, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRYPACKAGENAME;
            var deferred = qService.defer();            
            var includeIC = "Y";
            var _selDate = "", _includeIC = "", urlJSON = "";
            var _returnObject = '{"RETTIM_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + sessionKey + '" ,';
            var _empID = '"EMPLID" : "' + empID + '" ,';
            var _startDate = '"STRTDTE":"' + startDate + '" ,';
            var _endDate = '"ENDDTE":"' + endDate + '" ,';
            _selDate = '"SELDATE":"' + selDate + '" ,'
            _includeIC = '"INCIC":"' + includeIC + '"}}';               
            urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate, _includeIC);
            var url = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRYPACKAGENAME + '?I_JSON=' + urlJSON + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETTIM_OUT_OBJ);
                deferred.resolve(data);
            });
           
            return deferred.promise;
        },
        'getData': function (sessionKey, empID, startDate, endDate, selDate, success) {
            rootScope.apiUrl = constantService.DOMAINURL +constantService.RETRIEVETIMEENTRYPACKAGENAME;
            var deferred = qService.defer();
            if (startDate != null && endDate != null) {
                var includeIC = "N";
                if (!rootScope.isMobileOrTab)
                    includeIC = "Y";
                var _selDate = "", _includeIC = "", urlJSON = "";
                var _returnObject = '{"RETTIM_IN_OBJ":';
                var _session = ' {"SESKEY" : "' + sessionKey + '" ,'
                var _empID = '"EMPLID" : "' + empID + '" ,'
                var _startDate = '"STRTDTE":"' + startDate + '" ,'
                var _endDate = '"ENDDTE":"' + endDate + '" ,'
                if (includeIC == "N")
                    _selDate = '"SELDATE":"' + selDate + '"}}';
                else {
                    _selDate = '"SELDATE":"' + selDate + '" ,'
                    _includeIC = '"INCIC":"' + includeIC + '"}}';
                }
                if (includeIC == "N")
                    urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate);
                else {
                    var revDates = commonUtilityService.getRevStartEndDateBySelDate(selDate);
                    var rangeDates = commonUtilityService.getRangeDatesByRevDates(revDates.revStartDate, revDates.revEndDate);//, revDates.rangeEndDate);
                    _startDate = '"STRTDTE":"' + rangeDates.rangeStartDate + '" ,'
                    _endDate = '"ENDDTE":"' + rangeDates.rangeEndDate + '" ,'
                    urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate, _includeIC);
                }
                var url = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRYPACKAGENAME + '?I_JSON=' + urlJSON + '&timestamp=' + (new Date()).getTime();
                if (rootScope.isMobileOrTab || (localStorage.retrieveTimeEntriesDataSaved == null || !commonUtilityService.isSelDateInRange(selDate))) {
                    http.get(url).success(function (data) {
                        rootScope.sessionInvalid(data.RETTIM_OUT_OBJ);
                        //Removing IC Data
                        if (data.RETTIM_OUT_OBJ.RETCD == 0 && includeIC == "N") {
                            for (var i = 0; i < data.RETTIM_OUT_OBJ.TIME_ARR.length; i++) {
                                if ((typeof data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD != 'undefined') && (data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD != null)) {
                                    if ((data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD.trim().length > 0)) {
                                        data.RETTIM_OUT_OBJ.TIME_ARR.splice(i, 1);
                                        i = i - 1;
                                    }
                                }
                            }
                        }
                        if(!rootScope.isMobileOrTab) {
                            var revDates = commonUtilityService.getRevStartEndDateBySelDate(selDate);
                            localStorage.retrieveTimeEntriesDataSaved = JSON.stringify(data);
                            var entriesRevDates = { savedRevStartDate : revDates.revStartDate, savedRevEndDate : revDates.revEndDate };
                            localStorage.savedTimeEntriesRevDates = JSON.stringify(entriesRevDates);
                            deferred.resolve(commonUtilityService.getCachedTimeEntriesByMode(startDate, endDate, JSON.parse(localStorage.retrieveTimeEntriesDataSaved), selDate));
                        }
                        else{
                            deferred.resolve(data);
                        }

                    });
                }
                else
                {
                    deferred.resolve(commonUtilityService.getCachedTimeEntriesByMode(startDate, endDate, JSON.parse(localStorage.retrieveTimeEntriesDataSaved), selDate));
                }
            }
            return deferred.promise;
        },
        'deleteTimeEntries': function (sessionKey, empID, timeEntryIdArray) {
            localStorage.removeItem("retrieveTimeEntriesDataSaved");
            localStorage.removeItem("savedTimeEntriesRevDates");
            rootScope.apiUrl = constantService.DOMAINURL + constantService.DELETETIMEENTRYPACKAGENAME;
            var deferred = qService.defer();
            if (rootScope.rowIndex == undefined)
                rootScope.pastedRecords = true;
            var _returnObject = '{"DELTIM_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + sessionKey + '" ,';
            var _empID = '"EMPLID" : "' + empID + '" ,';
            var _timeEntries = '"TEID_ARR":{"NUMBER":[' + timeEntryIdArray + ']}}}';
            var urlJSON = _returnObject.concat(_session, _empID, _timeEntries);
            var url = constantService.DOMAINURL + constantService.DELETETIMEENTRYPACKAGENAME + '?I_JSON=' + urlJSON + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.DELTIM_OUT_OBJ);
                deferred.resolve(data);
            })
            return deferred.promise;
        },

        'submitTimeEntries': function (icSubmitFlag, sesKey, empId, selDte, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.SUBMITTIMEENTRIESPKGNAME;
            //var def = qService.defer();
            var _returnObject = '{"SUBTIM_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + sesKey + '" ,'
            var _empID = '"EMPLID" : "' + empId + '" ,'
            var _selDte = '"SELDTE" : "' + selDte + '" ,'
            var _icFlag = '"ICSUBFLAG ":"' + icSubmitFlag + '"}}';

            var urlJSON = _returnObject.concat(_session, _empID, _selDte, _icFlag);
            var url = constantService.DOMAINURL + constantService.SUBMITTIMEENTRIESPKGNAME + '?I_JSON=' + window.encodeURIComponent(urlJSON) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.SUBTIM_OUT_OBJ);
                var respId = parseInt(data.SUBTIM_OUT_OBJ.RETCD);
                if (respId == 0) {
                    localStorage.removeItem("retrieveTimeEntriesDataSaved");
                    localStorage.removeItem("savedTimeEntriesRevDates");
                }
                success(data);
            })

        }
    }
}])

.factory('cepService', ['$http', '$q', '$rootScope', 'constantService', function (http, $q, rootScope, constantService) {
    return {

        'searchCEPCode': function (sesKey, empId, cepSearch, pgNum, rowSpp, srtCol, compId, domainURL) {
            // debugger; 
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOOKUPCEPCODE;
            var def = $q.defer();
            var sortCol = "2,5,8";
            //if (!rootScope.isMobileOrTab) {                
            sortCol = srtCol.length == 0 ? sortCol : srtCol;
            //}            
            var start = '{"LOOKCEP_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"CEPFIND" :"' + cepSearch + '", '
                     + '"PGNUM" :' + pgNum + ', '
                     + '"ROWSPP" : ' + rowSpp + ', '
                      + '"SRTCOL" :"' + sortCol + '", '
                      + '"COMPID" :' + compId
                + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.LOOKUPCEPCODE + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                data.srchFor = cepSearch;
                rootScope.sessionInvalid(data.LOOKCEP_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'getFavCEP': function (sesKey, empId, cepSearch, pgNum, rowSpp, srtCol) {
            // debugger;
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVECEPFAVORITESPKGNAME;
            var sortCol = "2,5,8";
            if (!rootScope.isMobileOrTab) {
                sortCol = srtCol.length == 0 ? sortCol : srtCol;
            }
            var def = $q.defer();
            var start = '{"RETCEPFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"CEPFIND" :"' + cepSearch + '", '
                     + '"PGNUM" :' + pgNum + ', '
                     + '"ROWSPP" : ' + rowSpp + ', '
                      + '"SRTCOL" :"' + sortCol + '"} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.RETRIEVECEPFAVORITESPKGNAME + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();

            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETCEPFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'loadCEPDetail': function (sesKey, clientId, engId, prjId, domainURL) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.lOADCEPCODEDETAILS;
            var def = $q.defer();
            var start = '{"LOADCEP_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"CLIEID" : "' + clientId + '", '

                     + '"ENGID" : "' + engId + '", '
                     + '"PRJID" : "' + prjId + '"'
                + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.lOADCEPCODEDETAILS + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADCEP_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'saveTimeSheet': function (sesKey, empId, time_obj, domainURL) {
            localStorage.removeItem("retrieveTimeEntriesDataSaved");
            localStorage.removeItem("savedTimeEntriesRevDates");
            //For MTR-128
            localStorage.removeItem("currentdtForGetData");
            var timeObj = JSON.parse(time_obj);
            timeObj.CEP_REC.CLIENAME = "";
            timeObj.CEP_REC.ENGNAME = "";
            timeObj.CEP_REC.PRJNAME = "";
            timeObj.CEP_REC.PROG = "";
            timeObj.CEP_REC.GLOBBUSI = "";
            timeObj.DES = timeObj.DES.replace(/\n/g, " ");
            timeObj.DES = timeObj.DES.replace(/\t/g, " ");
            if (timeObj.CTDESC !== null) {
                timeObj.CTDESC = timeObj.CTDESC.replace(/\n/g, " ");
                timeObj.CTDESC = timeObj.CTDESC.replace(/\t/g, " ");
            }
            if (!rootScope.isMobileOrTab && angular.isDefined(timeObj.rowId)) {
                delete timeObj.rowId;
            }
            time_obj = JSON.stringify(timeObj);
            rootScope.apiUrl = constantService.DOMAINURL + constantService.SAVETIMEENTRY;
            var def = $q.defer();
            var start = '{"SAVTIM_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"TIME_REC" :' + (time_obj)
              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.SAVETIMEENTRY + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.SAVTIM_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
        ,
        'retrieveDescriptionFavorites': function (sesKey, empId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVEDESCRIPTIONFAVORITES;
            var def = $q.defer();
            var start = '{"ADDDESCFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId
              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.RETRIEVEDESCRIPTIONFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETDESCFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },

        'addCEPFavorites': function (sesKey, empId, prj_arr) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.ADDCEPFAVORITES;
            var def = $q.defer();
            var start = '{"ADDCEPFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"PRJID_ARR" :' + (prj_arr)

              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.ADDCEPFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.ADDCEPFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'removeCEPFavorites': function (sesKey, empId, prj_arr) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.REMOVECEPFAVORITES;
            var def = $q.defer();
            var start = '{"REMCEPFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"PRJID_ARR" :' + (prj_arr)

              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.REMOVECEPFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.REMCEPFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },

        'addDescriptionFavorite': function (sesKey, empId, destxt) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.ADDDESCRIPTIONFAVORITE;
            var def = $q.defer();
            var start = '{"ADDDESCFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"DESTXT" :' + (destxt)

              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.ADDDESCRIPTIONFAVORITE + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.ADDDESCFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'removeDescriptionFavorites': function (sesKey, empId, destxt) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.REMOVEDESCRIPTIONFAVORITES;
            var def = $q.defer();
            var start = '{"REMDESCFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"DESTXT_ARR" :' + (destxt)

              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.REMOVEDESCRIPTIONFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.REMDESCFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }

    }
}])

.factory('projectComponetService', ['$http', '$q', '$rootScope', 'constantService', function (http, $q, rootScope, constantService) {
    return {
        'searchPRCCode': function (sesKey, pcatid, prjid) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADPROJECTCOMPONENTTASKS;
            // debugger;
            var def = $q.defer();
            var start = '{"LOADPCOMTSK_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"PCATID" : ' + pcatid + ' ,'
                      + '"PROJID" : ' + prjid
                + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.LOADPROJECTCOMPONENTTASKS + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADPCOMTSK_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
    }
}])

.factory('activityService', ['$http', '$q', '$rootScope', 'constantService', function (http, $q, rootScope, constantService) {
    return {
        'searchActivityCode': function (sesKey, compId, domainURL) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADACTIVITIES;
            var def = $q.defer();
            var start = '{"LOADACTI_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"COMPID" : ' + compId + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.LOADACTIVITIES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADACTI_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
        ,
        'retrieveActivityFavorites': function (sesKey, emplId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVEACTIVITYFAVORITES;
            var def = $q.defer();
            var start = '{"RETACTIFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + emplId + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.RETRIEVEACTIVITYFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETACTIFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'addActivityFavorites': function (sesKey, empId, act_arr) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.ADDACTIVITYFAVORITES;
            var def = $q.defer();
            var start = '{"ADDACTIFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"ACTIID_ARR" :' + (act_arr)

              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.ADDACTIVITYFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.ADDACTIFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'removeActivityFavorites': function (sesKey, empId, act_arr) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.REMOVEACTIVITYFAVORITES;
            var def = $q.defer();
            var start = '{"REMACTIFAV_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"EMPLID" : ' + empId + ', '
                     + '"ACTIID_ARR" :' + (act_arr)

              + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.REMOVEACTIVITYFAVORITES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.REMACTIFAV_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }

    }
}])

.factory('loadICRates', ['$http', '$q', '$rootScope', 'constantService', function (http, $q, rootScope, constantService) {
    return {
        'loadICRate': function (sesKey, compId, domainURL) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADICRATES;
            var def = $q.defer();
            var start = '{"LOADICRT_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"COMPID" : ' + compId
                + '} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.LOADICRATES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADICRT_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
    }
}])


.factory('loadRevenueMonthsServices', ['$http', '$q', '$rootScope', '$timeout', 'constantService', '$filter', 'dateService', function (http, $q, rootScope, $timeout, constantService, $filter, dateService) {
    return {
        'loadRevenueMonths': function (sesKey, revmDte, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADREVENUEMONTHSPACKAGENAME;
            var selObj;
            if (!rootScope.isMobileOrTab && localStorage.getItem("RevMonthDetails") != undefined && localStorage.getItem("RevMonthDetails") != null) {
                var revMnthRange = JSON.parse(localStorage.getItem("RevMonthDetails")).LOADREVM_OUT_OBJ.REVM_ARR;
                var revmDteTemp = dateService.createDate(revmDte.substring(0, 10));
                var revMnthRangeSTRTDTEtemp;
                var revMnthRangeENDDTEtemp;
                var i = 0;
                //for (var i = 0; i < revMnthRange.length; i++) {
                if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                    revMnthRangeSTRTDTEtemp = dateService.createDate(revMnthRange[i].STRTDTE.substring(0, 10));
                    revMnthRangeENDDTEtemp = dateService.createDate(revMnthRange[i].ENDDTE.substring(0, 10));
                    if (revmDteTemp.getTime() >= revMnthRangeSTRTDTEtemp.getTime() && revmDteTemp.getTime() <= revMnthRangeENDDTEtemp.getTime()) {
                        selObj = revMnthRange[i];
                        //break;
                    }
                }
                //}

            }
            if (selObj == null) {
                if (!rootScope.isMobileOrTab) {
                    var loginDetail = rootScope.GetLoginDetail(false, true);
                    var _returnObject = '{"LOADREVM_IN_OBJ":';
                    var _session = ' {"SESKEY" : "' + sesKey + '" ,'
                    var _revmDte = '"REVMDTE" : "' + revmDte + '",'
                    var _emplId = '"EMPLID":"' + loginDetail.EMPLID + '"}}';
                    var urlJSON = _returnObject.concat(_session, _revmDte, _emplId);
                }
                else {
                    var _returnObject = '{"LOADREVM_IN_OBJ":';
                    var _session = ' {"SESKEY" : "' + sesKey + '" ,'
                    var _revmDte = '"REVMDTE":"' + revmDte + '"}}';
                    var urlJSON = _returnObject.concat(_session, _revmDte);
                }

                var url = constantService.DOMAINURL + constantService.LOADREVENUEMONTHSPACKAGENAME + window.encodeURIComponent(urlJSON) + '&timestamp=' + (new Date()).getTime();

                http.get(url).success(function (data) {
                    //def.resolve(data);
                    rootScope.sessionInvalid(data.LOADREVM_OUT_OBJ);
                    //var tempTodayLocalDateStr = $filter('date')(new Date("sessiontimeout"), "yyyy-MM-dd");
                    //var tempTodayDateStr = $filter('date')(new Date(), "yyyy-MM-dd");
                    var tempTodayDateStr = new Date();
                    var parts = revmDte.split("-");
                    var day = parts[2].split(' ');
                    var revMTempDate = new Date(parts[0], parts[1] - 1, day[0]);
                    if ((revMTempDate.getMonth() == tempTodayDateStr.getMonth() || revMTempDate.getMonth() == (tempTodayDateStr.getMonth() + 1)) && tempTodayDateStr.getFullYear() == revMTempDate.getFullYear())
                        localStorage.setItem("MonthEndCountdownRevenueMonth", JSON.stringify(data.LOADREVM_OUT_OBJ.REVM_ARR));
                    success(data);
                    localStorage.setItem("RevMonthDetails", JSON.stringify(data));
                })



            }
            else {
                var tEBillData = JSON.parse(localStorage.getItem("RevMonthDetails"));
                success(tEBillData);
            }
        },
        'retrieveTimeEntries': function (sesKey, empId, strtDte, endDte, selDate, success) {
            var includeIC = "N";
            if (!rootScope.isMobileOrTab)
                includeIC = "Y";
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRIES;
            var _selDate = "", _includeIC = "", urlJSON = "";
            var _returnObject = '{"RETTIM_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + sesKey + '" ,'
            var _empID = '"EMPLID" : "' + empId + '" ,'
            var _startDate = '"STRTDTE":"' + strtDte + '" ,'
            var _endDate = '"ENDDTE":"' + endDte + '" ,'
            if (includeIC == "N")
                _selDate = '"SELDATE":"' + selDate + '"}}';
            else {
                _selDate = '"SELDATE":"' + selDate + '" ,'
                _includeIC = '"INCIC":"' + includeIC + '"}}';
            }
            if (includeIC == "N")
                urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate);
            else
                urlJSON = _returnObject.concat(_session, _empID, _startDate, _endDate, _selDate, _includeIC);
            var url = constantService.DOMAINURL + constantService.RETRIEVETIMEENTRIES + '?I_JSON=' + window.encodeURIComponent(urlJSON) + '&timestamp=' + (new Date()).getTime();

            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETTIM_OUT_OBJ);
                //Removing IC Data
                if (data.RETTIM_OUT_OBJ.RETCD == 0 && includeIC == "N") {
                    for (var i = 0; i < data.RETTIM_OUT_OBJ.TIME_ARR.length; i++) {
                        if ((typeof data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD != 'undefined') && (data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD != null)) {
                            if ((data.RETTIM_OUT_OBJ.TIME_ARR[i].ICRTCD.trim().length > 0)) {
                                data.RETTIM_OUT_OBJ.TIME_ARR.splice(i, 1);
                                i = i - 1;
                            }
                        }
                    }
                }

                success(data);
            })
        },
        'loadRevenueMonthsChart': function (sesKey, revmDte, empId, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADREVENUEMONTHSPACKAGENAME;
            var def = $q.defer();
            var selObj;
            if (!rootScope.isMobileOrTab && localStorage.getItem("RevMonthDetails") != undefined && localStorage.getItem("RevMonthDetails") != null) {
                var revMnthRange = JSON.parse(localStorage.getItem("RevMonthDetails")).LOADREVM_OUT_OBJ.REVM_ARR;
                var revmDteTemp = dateService.createDate(revmDte.substring(0, 10));
                var revMnthRangeSTRTDTEtemp;
                var revMnthRangeENDDTEtemp;
                for (var i = 0; i < revMnthRange.length; i++) {
                    if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                        revMnthRangeSTRTDTEtemp = dateService.createDate(revMnthRange[i].STRTDTE.substring(0, 10));
                        revMnthRangeENDDTEtemp = dateService.createDate(revMnthRange[i].ENDDTE.substring(0, 10));
                        if (revmDteTemp.getTime() >= revMnthRangeSTRTDTEtemp.getTime() && revmDteTemp.getTime() <= revMnthRangeENDDTEtemp.getTime()) {
                            selObj = revMnthRange[i];
                            break;
                        }
                    }
                }
            }
            if (selObj == null) {
                var _returnObject = '{"LOADREVM_IN_OBJ":';
                var _session = ' {"SESKEY" : "' + sesKey + '" ,'
                var _revmDte = '"REVMDTE":"' + revmDte + '",';
                var _emplId = '"EMPLID":"' + empId + '"}}';
                var urlJSON = _returnObject.concat(_session, _revmDte, _emplId);
                var url = constantService.DOMAINURL + constantService.LOADREVENUEMONTHSPACKAGENAME + window.encodeURIComponent(urlJSON) + '&timestamp=' + (new Date()).getTime();

                http.get(url).success(function (data) {
                    //def.resolve(data);
                    rootScope.sessionInvalid(data.LOADREVM_OUT_OBJ);
                    def.resolve(data);
                    localStorage.setItem("RevMonthDetails", JSON.stringify(data));
                })
            }
            else {
                var tEBillData = JSON.parse(localStorage.getItem("RevMonthDetails"));
                tEBillData.LOADREVM_OUT_OBJ.REVM_ARR[0]= selObj;
                $timeout(function(){def.resolve(tEBillData)});
            }
            return def.promise;
        }
    }

}])
.factory('preferencesService', ['$http', '$q', '$rootScope', '$timeout', 'constantService', function (http, $q, rootScope, $timeout, constantService) {
    return {
        'loadGlobalPreferences': function (sesKey, success) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADGLOBALPREFERENCES;
            var def = $q.defer();
            var parms = '{"GLBPREF_IN_OBJ": {"SESKEY" : "' + sesKey + '"}}';
            var svcNameWithParm = constantService.LOADGLOBALPREFERENCES + '?I_JSON=' + window.encodeURIComponent(parms) + '&timestamp=' + (new Date()).getTime();

            var url = constantService.DOMAINURL + svcNameWithParm;

            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.GLBPREF_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },

        'savePreferences': function (sesKey, pref_ARR, empId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.SAVEPREFERENCES;
            var def = $q.defer();
            var queryParmStr = '{"SAVPREF_IN_OBJ" : { "SESKEY" : "parm1","PREF_ARR":parm3}}'
            if (!rootScope.isMobileOrTab) {
                queryParmStr = '{"SAVPREF_IN_OBJ" : { "SESKEY" : "parm1","EMPLID":"parm2","PREF_ARR":parm3}}';
                queryParmStr = queryParmStr.replace("parm2", empId);
            }
            queryParmStr = queryParmStr.replace("parm1", sesKey);
            queryParmStr = queryParmStr.replace("parm3", pref_ARR);

            var dataTest = queryParmStr;
            var url = constantService.DOMAINURL + constantService.SAVEPREFERENCES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.SAVPREF_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
    }
}])
.factory('Base64', function () {
    /* jshint ignore:start */
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                }
                else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =            
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4); chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length); return output;
        }
    };      /* jshint ignore:end */
})
.service('broadcastService', function ($rootScope) {
    return {
        cutoffBroadcast: function (cutoffDate) {
            $rootScope.$broadcast("cutoffBroadcast", {
                value: cutoffDate
            });

        },
        updateDataSource: function (updateFlag) {
            $rootScope.$broadcast("updateEmployeeData", {
                value: updateFlag
            });

        },
        updateUiSelectSrchStr: function (val) {
            $rootScope.$broadcast("updateSearchVal", {
                value: val
            });

        },
        cepCodeChangeBySelectJs: function (val) {
            $rootScope.$broadcast("uiSelectCepChange", {
                value: val
            });

        },
        notifyUiGrid: function (dateVal) {
            $rootScope.$broadcast("updateUiGrid", {
                value: dateVal
            });

        },
        notifyDateTimeSlider: function (dateVal) {
            $rootScope.$broadcast("updateUiCalSelectedDate", {
                value: dateVal
            });
        },
        notifyRefreshCalendar: function () {
            $rootScope.$broadcast('refreshCalendar', {
            });
        },
        notifyRefillCalendar: function (isRefill) {
            $rootScope.$broadcast('refillCalendar', {
                value: isRefill
            });
        },
        notifyTodayCalendar: function () {
            $rootScope.$broadcast('todayCalendar', {
            });
        },
        notifyrightClickbroadcast: function () {
            $rootScope.$broadcast('rightClickbroadcast', {
            });
        },
        notifyCalendarRefresh: function () {
            $rootScope.$broadcast('calendarRefreshBroadcast', {
            });
        },
        notifyYearUpCalendar: function (date, isCalOpen) {
            $rootScope.$broadcast('yearUpCalendar', {
                value: date,
                isCalOpen: isCalOpen
            });
        },
        notifyMoveCalendar: function (direction) {
            $rootScope.$broadcast('moveCalendar', {
                value: direction
            });
        },
        notifyMultidatepickerSelect: function (date) {
            $rootScope.$broadcast('multidatePickerselect', {
                value: date
            });
        },
        notifyMultidatepickerTodayCalendar: function (date) {
            $rootScope.$broadcast('multidatePickertoday', {
                value: date
            });
        },
        notifyloadDesktopActivityProject: function () {
            $rootScope.$broadcast('loadDesktopActivityProject');
        },
        notifyRefreshGrid: function (selectedItem) {
            $rootScope.$broadcast('refreshGrid', {
                value: selectedItem
            });
        },
        notifyCEPCodefavourite: function (selectedItem) {
            $rootScope.$broadcast('CEPCodefavourite', {
                value: selectedItem
            });
        },
        notifyGridFocus: function (popupName) {
            $rootScope.$broadcast('gridFocus', {
                value: popupName
            });
        },
        notifyLogOut: function () {
            $rootScope.$broadcast('LogOut', {
            });
        },
        sessionExpire: function () {
            $rootScope.$broadcast("sessionExpire", {
                //pass values here
            });
        },
        transactionTimeout: function () {
            $rootScope.$broadcast("transactionTimeout", {
                //pass values here
            });
        },
        bindGridEvents: function () {
            $rootScope.$broadcast("bindGridEvents", {
                //pass values here
            });
        },
        myTimeSessionTimeout: function () {
            $rootScope.$broadcast("myTimeSessionTimeout", {
                //pass values here
            });
        },
        notifyRightPanelCEPCodefavourite: function (selectedItem) {
            $rootScope.$broadcast('rightPanelCEPCodefavourite', {
                value: selectedItem
            });
        },
        updateMonthlyChart: function () {
            $rootScope.$broadcast("updateMonthlyChart", {
            });
        },
        maintenanceNotificationBroadcast: function (outageMessage) {
            $rootScope.$broadcast('maintenanceNotificationBroadcast', {
                value: outageMessage
            });
        },
        notifyCalHeaderButton: function () {
            $rootScope.$broadcast('calHeaderButtonClick', {
            });
        }
    };

})
.service('dateService', function ($rootScope) {
    return {
        createDate: function (dteStr) {
            var parts = dteStr.split("-");
            var day = parts[2].split(' ');
            return new Date(parts[0], parts[1] - 1, day[0]);

        },
        createDateTime: function (dateStr) {
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

    };
})
.service('futureEntryService', function ($rootScope, dateService) {
    return {
        futureEntry: function (time_Obj) {
            var revRangeDate = [];
            revRangeDate = $rootScope.GetInitialDetail(false, true);
            if ($rootScope.isMobileOrTab && localStorage.getItem('InitialMobile_Data') != null && localStorage.getItem('InitialMobile_Data') != undefined)
                revRangeDate = JSON.parse(localStorage.getItem('InitialMobile_Data'));

            if (revRangeDate != null && revRangeDate != undefined && revRangeDate.length != 0) {
                var revStartDate = revRangeDate.REVM_REC.STRTDTE;
                var revEndDate = revRangeDate.REVM_REC.ENDDTE;
            }
            var timeEntryDate = dateService.createDate(time_Obj.DTE.substring(0, 10));
            var GMTDate = new Date();
            var revenueStartDate = dateService.createDate(revStartDate.substring(0, 10));
            var revenueEndDate = dateService.createDate(revEndDate.substring(0, 10));
            if ((time_Obj.HRS != null && time_Obj.HRS !== "" && (parseFloat(time_Obj.HRS) != 0) && time_Obj.CEP_REC.CHARBASIS != 'N')
            && (GMTDate < revenueStartDate || timeEntryDate > revenueEndDate))
                return true;
            return false;
        }

    };
})
.service('timeEntryNextRevenueService', function ($rootScope, $filter, dateService) {
    return {
        timeEntryToNextRevenue: function (sendDate, revStartDte, copiedRecords, indexno, revenueStartDate) {

            sendDate.setHours(0, 0, 0, 0);
            revStartDte.setHours(0, 0, 0, 0);
            var dayDiff = parseInt((revStartDte -sendDate) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 0) {

                var timeEntry = angular.copy(copiedRecords); var timeWithZeroEntry = [];
                var copySelectedRecords = angular.copy(copiedRecords);

                var daydiffwithindex = parseInt(dayDiff +indexno);
                if (copySelectedRecords[indexno].selectedRecordNumber == $rootScope.selRecordNumber && angular.isUndefined(timeEntry[daydiffwithindex])) {
                    $rootScope.selRecordNumber = $rootScope.selRecordNumber +1;
                    timeWithZeroEntry = angular.copy(copiedRecords[indexno]);
                    timeWithZeroEntry.DTE = $filter('date') (revenueStartDate, 'yyyy-MM-dd HH:mm:ss');
                    timeWithZeroEntry.HRS = 0;
                    return timeWithZeroEntry;
                }
                if (angular.isUndefined(timeEntry[daydiffwithindex]))
                    return null;
                delete timeEntry[daydiffwithindex].HRS;
                delete copySelectedRecords[indexno].HRS;
                delete timeEntry[daydiffwithindex].DTECount;
                delete copySelectedRecords[indexno].DTECount;
                delete timeEntry[daydiffwithindex].DTE;
                delete copySelectedRecords[indexno].DTE;
                if (sendDate.getTime() == revStartDte.getTime()) {
                    $rootScope.selRecordNumber = $rootScope.selRecordNumber +1;
                }
                else if (copySelectedRecords[indexno].selectedRecordNumber == $rootScope.selRecordNumber && !angular.equals(copySelectedRecords[indexno], timeEntry[daydiffwithindex])) {
                    $rootScope.selRecordNumber = $rootScope.selRecordNumber +1;
                    timeWithZeroEntry = angular.copy(copiedRecords[indexno]);
                    timeWithZeroEntry.DTE = $filter('date') (revenueStartDate, 'yyyy-MM-dd HH:mm:ss');
                    timeWithZeroEntry.HRS = 0;
                    return timeWithZeroEntry;

                }
            }
            return null;
        }
    };
})
.factory('importCalService', ['$http', '$q', '$rootScope', 'constantService', 'Base64', function (http, $q, rootScope, constantService, Base64) {
    return {

        'getCalImportEntries': function (sesKey, encKey, dom, startDate, endDate, email, mBoxEmail) {
            // debugger;
            rootScope.apiUrl = constantService.DOMAINURL +constantService.RETRIEVECALENTRIES;
            var def = $q.defer();
            var start = '{"RETCALENT_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"ENCKEY" : "' + encKey + '", '
                     + '"DOM" :"' + dom + '", '
                     + '"STRTDTE" :"' + startDate + '", '
                     + '"ENDDTE" : "' + endDate + '", '
                     + '"EMAIL" : ' + JSON.stringify(email) + ', '
                      + '"MBOXADR" :' + JSON.stringify(mBoxEmail) + ' } }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.RETRIEVECALENTRIES + '?I_JSON=' +window.encodeURIComponent(dataTest) + '&timestamp=' +(new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETCALENT_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'getCalImportEntryDetail': function (sesKey, encKey, dom, email, itemId) {
            // debugger;
            rootScope.apiUrl = constantService.DOMAINURL +constantService.RETRIEVECALENTRYDETAIL;
            var def = $q.defer();
            var start = '{"RETCALDET_IN_OBJ " : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"ENCKEY" : "' + encKey + '", '
                     + '"DOM" :"' + dom + '", '
                     + '"EMAIL" : ' + JSON.stringify(email) + ', '
                      + '"ITEMID" :"' +itemId + '" } }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.RETRIEVECALENTRYDETAIL + '?I_JSON=' +window.encodeURIComponent(dataTest) + '&timestamp=' +(new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETCALDET_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
    }
}])

.factory('broadcastMessageServices', ['$http', '$q', '$rootScope', 'constantService', 'Base64', function (http, $q, rootScope, constantService, Base64) {
    return {

        'getBroadcastMessage': function (sesKey, lang) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RETRIEVEBROADCASTMESSAGES;
            var def = $q.defer();
            var start = '{"RETBROAD_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"LANG" : "' + lang + '"} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.RETRIEVEBROADCASTMESSAGES + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RETBROAD_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'dismissBroadcastMessage': function (sesKey, msgId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.DISMISSBROADCASTMESSAGE;
            var def = $q.defer();
            var start = '{"DISBROADM_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var end = '"MSGID" : "' + msgId + '"} }';
            var dataTest = start.concat(sess, end);
            var url = constantService.DOMAINURL + constantService.DISMISSBROADCASTMESSAGE + '?I_JSON=' + window.encodeURIComponent(dataTest) + '&timestamp=' + (new Date()).getTime();

            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.DISBROADM_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
    }
}])

.factory('maintenanceService', ['$http', '$q', '$rootScope', 'constantService', 'Base64', '$window', 'openPopUpWindowFactory', function (http, $q, rootScope, constantService, Base64, $window, sharedService) {
    return {
        'maintenanceNotification': function (outageMessage) {
            if (rootScope.isMobileOrTab)
                $window.location.href = 'Maintenance.html?maintenanceMsg=' + window.encodeURIComponent(outageMessage);
            else {
                rootScope.showLoginPage = false;
                var sendData = {
                    errorList: [outageMessage]
                };
                sharedService.openModalPopUp('Desktop/NewEntry/templates/maintenanceDesktop.html', 'MaintenanceDesktopPopupCtrl', sendData);
                return false;
            }
            return true;
        },
        'outageCheck': function () {
            var url = constantService.DOMAINURL + constantService.CHECKOUTAGE + '?timestamp=' + (new Date()).getTime();
            rootScope.loadingImgHidden = true;
            $('#loadingWidgetDesktop').hide();
            rootScope.showLoginPage = false;
            rootScope.apiUrl = url;
            http.get(url).success(function (data) {
                rootScope.loadingImgHidden = false;
                rootScope.showLoginPage = true;
                return true;
            })
            return true;
        }
    }
}])
.factory('reportService', ['$http', '$q', '$rootScope', 'constantService', '$window', 'openPopUpWindowFactory', function (http, $q, rootScope, constantService, $window, sharedService) {
    return {

        'runReport': function (sesKey, empId, rparm) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.RUNREPORT;
            var def = $q.defer();
            var start = '{"RUNREP_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) +'","EMPLID":"';
            var empid = String(empId) + '",'
            var rparm = '"RPARM_REC" : ' + rparm + '} }';
            var dataTest = start.concat(sess, empid, rparm);
            //var url = constantService.DOMAINURL + constantService.RUNREPORT.concat('?I_JSON=', window.encodeURIComponent(dataTest), '&timestamp=' + (new Date()).getTime());
            var url = constantService.DOMAINURL + constantService.RUNREPORT.concat('?I_JSON=', dataTest, '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.RUNREP_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
    }
}])

.factory('designateService', ['$http', '$cookieStore', '$q', '$rootScope', 'constantService', function (http, $cookieStore, $q, rootScope, constantService) {
    return {
        'loadBecomeDesignate': function (sesKey, empid) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADBECOMEDESIGNATE;
            var def = $q.defer();
            var parm = '{"LOADBECOMEDESIG_IN_OBJ" : { "SESKEY" : "';
            parm = parm.concat(sesKey, '","EMPLID":"');
            parm = parm.concat(empid, '"}}');
            var url = rootScope.apiUrl.concat('?I_JSON=', window.encodeURIComponent(parm), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADBECOMEDESIG_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'lookupEmployees': function (sesKey, lookUpObj) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOOKUPEMPLOYEES;
            var def = $q.defer();
            //var parm = '{"LOOKEMPL_IN_OBJ" : { "SESKEY" : "';
            var parmStr = '{"LOOKEMPL_IN_OBJ" : { "SESKEY" : "p1", "EMPFIND" : "p2", "PSID" : "p3", "FIRSTNAME" : "p4","LASTNAME" : "p5"}}';
            parmStr = parmStr.replace("p1", sesKey);
            parmStr = parmStr.replace("p2", lookUpObj.empFind);
            parmStr = parmStr.replace("p3", lookUpObj.psid);
            parmStr = parmStr.replace("p4", lookUpObj.firstname);
            parmStr = parmStr.replace("p5", lookUpObj.lastname);
            var url = rootScope.apiUrl.concat('?I_JSON=', window.encodeURIComponent(parmStr), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOOKEMPL_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'addDesignate': function (sesKey, emplId,desgId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.ADDDESIGNATE;
            var def = $q.defer();
            var parm = '{"ADDDESIG_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var emplid = '"EMPLID" : "' + emplId + '",'
            var desgid = '"DESGID" : "' + desgId + '"}}';
            parm = parm.concat(sess, emplid, desgid);
            var url = rootScope.apiUrl.concat('?I_JSON=', window.encodeURIComponent(parm), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.ADDDESIG_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'loadDesignates': function (sesKey,empId) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.LOADDESIGNATE;
            var def = $q.defer();
            var parm = '{"LOADDESIG_IN_OBJ" : { "SESKEY" : "parm1","EMPLID":"parm2"}}';
            parm = parm.replace("parm1", sesKey);
            parm = parm.replace("parm2", empId);
            var url = rootScope.apiUrl.concat('?I_JSON=', window.encodeURIComponent(parm), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.LOADDESIG_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'removeDesignates': function (sesKey,empId, desgIdArr) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.REMOVEDESIGNATES;
            var def = $q.defer();
            var parm = '{"REMDESIG_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,"EMPLID":"'
            var empId = empId + '" ,'
            var desgid = '"DESGID_ARR": { NUMBER :["' + desgIdArr + '"]}}}';
            parm = parm.concat(sess,empId, desgid);
            parm = window.encodeURIComponent(parm);
            var url = rootScope.apiUrl.concat('?I_JSON=', (parm), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.REMDESIG_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'setGocMail': function (sesKey, empId, desgId, gocEmail) {
            rootScope.apiUrl = constantService.DOMAINURL +constantService.SETGOCMAIL;
            var def = $q.defer();
            var parm = '{"SETGOCMAIL_IN_OBJ" : { "SESKEY" : "parm1","EMPLID":"parm2","DESIGID":"parm3", "GOCEMAIL":"parm4"}}';
            parm = parm.replace("parm1", sesKey);
            parm = parm.replace("parm2", empId);
            parm = parm.replace("parm3", desgId);
            parm = parm.replace("parm4", gocEmail);
            var url = rootScope.apiUrl.concat('?I_JSON=', (parm), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.SETGOCMAIL_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        }
    }

}])
.factory('gridLayoutService', ['$http', '$cookieStore', '$q', '$timeout', '$rootScope', 'constantService', function (http, $cookieStore, $q, $timeout, rootScope, constantService) {
    return {
        //mode 1 : daily layout, 2: weekly layout,3 : search layout
        'getCustomLayout': function () {
            var data = {};
            var initialData = rootScope.GetInitialDetail(false, true);
            var layoutTempArray = initialData.LAYOUT_ARR;
            var layout = initialData.LAYOUT_ARR;
            //layout = JSON.parse(layout);                
            data.LOADCUSTOMLAYOUT_OBJ = {};
            data.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR = [];
            data.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR = layout;//[{ mode: "1", name: 'Daily Layout1', layout: [] }, { mode: "3", name: 'Weekly Layout1', layout: [] }];
            return data;
        },
        'createLayoutObj': function (columns) {
            var customLayout = {};
            var columnDetails = [];
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].name !== "treeBaseRowHeaderCol")
                    columnDetails.push({
                        CORDER: i.toString(), CNAME: columns[i].name, CVISIBLE: (columns[i].visible === undefined ? "Y" : (columns[i].visible === true ? "Y":"N"))
                    });
            }
            customLayout.columns = JSON.stringify(columnDetails);
            return customLayout;
        },
        'deleteLayout': function (sesKey, empid,mode) {
            var def = $q.defer();
            $timeout(function () {
                var data = {};
                data.DELTIM_OUT_OBJ = {
                    RETCD:'0'
                };
                def.resolve(data);
            }, 10);
            return def.promise;
        },
        'getColumnDef': function (columnDef, custumLayout) {
            var newColumnDef = [];
            rootScope.countColumn = 0;
            for (var i = 0; i < custumLayout.length; i++) {
                for (var j = 0; j < columnDef.length; j++) {
                    if (custumLayout[i].CNAME == columnDef[j].name || custumLayout[i].CNAME == columnDef[j].field) {
                        var obj = JSON.parse(JSON.stringify(columnDef[j]));
                        obj.visible = (custumLayout[i].CVISIBLE == "Y" || custumLayout[i].CVISIBLE == undefined) ? true : false;
                        if (obj.visible && obj.enableHiding != false)
                            rootScope.countColumn +=1
                        newColumnDef.push(obj);
                        break;
                    }
                }
            }
            return newColumnDef;

        },
        'saveCustomLayout': function (sesKey, empid,layout,mode,parentId,name,changePref) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.SAVEGRIDLAYOUT;
            var def = $q.defer();
            var parm = '{"SAVEGRIDLAYOUT_IN_OBJ" : { "SESKEY" : "';
            var sess = String(sesKey) + '" ,'
            var emplid = '"EMPLID" : "' + empid + '",'
            var gcolumns = '"GCOLUMNS":{"GRID_LAYOUT_COLUMN_OBJ":' + layout + '},'
            var gmode = '"GMODE" : "' + mode + '",'
            var gparentcolumnviewid = '"GPARENTCOLUMNVIEWID" : "' + parentId + '",'
            var gname = '"GNAME" : "' + name + '",'
            var gchangepreference = '"GCHANGEPREFERENCE" : "' + changePref + '"}}';
            parm = parm.concat(sess, emplid, gcolumns, gmode, gparentcolumnviewid, gname, gchangepreference);
            var url = rootScope.apiUrl.concat('?I_JSON=', window.encodeURIComponent(parm), '&timestamp=' + (new Date()).getTime());
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.SAVEGRIDLAYOUT_OUT_OBJ);
                def.resolve(data);
            })
            return def.promise;
        },
        'removeGridLayout': function (sessionKey, empID, gMode) {
            rootScope.apiUrl = constantService.DOMAINURL + constantService.REMOVEGRIDLAYOUT;
            var deferred = $q.defer();
            var _returnObject = '{"REMOVEGRIDLAYOUT_IN_OBJ":';
            var _session = ' {"SESKEY" : "' + sessionKey + '" ,';
            var _empID = '"EMPLID" : "' + empID + '" ,';
            var _gMode = '"GMODE" : "' + gMode + '"}}';
            var urlJSON = _returnObject.concat(_session, _empID, _gMode);
            var url = constantService.DOMAINURL + constantService.REMOVEGRIDLAYOUT + '?I_JSON=' + urlJSON + '&timestamp=' + (new Date()).getTime();
            http.get(url).success(function (data) {
                rootScope.sessionInvalid(data.REMOVEGRIDLAYOUT_OUT_OBJ);
                deferred.resolve(data);
            })
            return deferred.promise;
        }
    }
}])