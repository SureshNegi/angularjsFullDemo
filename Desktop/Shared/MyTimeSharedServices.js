angular.module('MyTimeApp')
.factory('openPopUpWindowFactory', ['$rootScope', '$modal','$timeout', function (rootScope, $modal, $timeout) {
    return {
        'openModalPopUp': function (template, controller, sendData) {
            rootScope.errorLogMethod("openPopUpWindowFactory.openModalPopUp");
            var modalInstance = $modal.open({               
                backdrop: "static",
                keyboard: false,
               
                templateUrl: template,
                controller: controller,
                resolve: {
                    arguments: function () {
                        return sendData;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                rootScope.errorLogMethod("openPopUpWindowFactory.modalInstance.result");
                $timeout(function () {
                    if ($(".modal").css("display") != "block")
                        angular.element('#divdatepicker').focus();
                }, 400);
                
                //broadcast popup ok
                switch (sendData.popUpName) {
                    case 'DescriptionPopUp':
                        rootScope.$broadcast("updateDescription", {
                                args: {
                                isCancel: false, dataObj: selectedItem
                                }
                            });
                    break; 
                    case 'chartPopUp':
                        rootScope.$broadcast("updateChart", {
                            args: { chartDataObj: selectedItem }
                        });
                        break;
                    case 'CEPFavPopUp':
                        rootScope.$broadcast("updateCEPOnSelFrmCEPFav", {
                            args: { isCancel: false, cepObj: selectedItem }
                        });
                        break;
                    case 'DeleteFavActPopUp':
                        rootScope.$broadcast("deleteAllFavActConfirm", {
                            args: { isConfirm: true}
                        });
                        break;
                    case 'DeleteFavDescPopUp':
                        rootScope.$broadcast("deleteAllFavDescConfirm", {
                            args: { isConfirm: true}
                        });
                        break;
                    case 'SaveTEConfirmPopUp':
                        rootScope.$broadcast("saveTEConfirm", {
                            args: { isConfirm: true}
                        });
                        break;
                    case 'importCalPopUp':
                        rootScope.$broadcast("importCalPopUpConfirm", {
                            args: { calObj: null }
                        });
                        break;
                    case 'DescriptionPopUp':
                        rootScope.$broadcast("updateDescription", {
                            args: {
                                isCancel: false, dataObj: selectedItem
                            }
                        });
                        break;
                    case 'ConfirmBroadcastMessagePopup':
                        rootScope.$broadcast("ConfirmBroadcastMessageDesktopConfirm", {
                            args: { calObj: null }
                        });
                        break;
                    case 'ConfrmSaveMainGrdLayout':
                        rootScope.$broadcast("SaveMainGridLayout", {
                            args: {
                                isSave: true,
                                methodName: sendData.methodName
                            }
                        });                        
                        break;
                    case 'OverrideSaveMainGrdLayout':
                        rootScope.$broadcast("SaveMainGridLayout", {
                            args: {
                                isSave: true,
                                isOverride: true,
                                methodName: sendData.methodName
                            }
                        });
                        break;
                    case 'ConfrmSaveSearchGrdLayout':
                        rootScope.$broadcast("SaveSearchGridLayout", {
                            args: {
                                isSave: true,
                                methodName: sendData.methodName,
                                data: sendData.dataRow
                            }
                        });
                        break;
                        
                }
            }, function () {
                $timeout(function () {
                    if ($(".modal").css("display") != "block")
                        angular.element('#divdatepicker').focus();
                }, 400);
                switch (sendData.popUpName) {
                    case 'DescriptionPopUp':
                        rootScope.$broadcast("updateDescription", {
                                args: {
                                isCancel: true, dataObj: sendData.desc
                                }
                            });
                       break;
                    case 'CEPFavPopUp':                        
                        rootScope.$broadcast("updateCEPOnSelFrmCEPFav", {
                            args: { isCancel: true, cepObj: null,isOpenFrmCep:sendData.isOpenFrmCep }
                        });
                        break;
                    case 'SaveTEConfirmPopUp':
                        rootScope.$broadcast("saveTEConfirm", {
                                args : {
                                isConfirm: true
                            }
                            });
                        break;
                    case 'importCalPopUp':
                        rootScope.$broadcast("importCalPopUpConfirm", {
                            args: { calObj: null }
                        });
                        break;
                    case 'ConfirmBroadcastMessagePopup':
                        rootScope.$broadcast("ConfirmBroadcastMessageDesktopConfirm", {
                            args: { calObj: null }
                        });
                        break;
                    case 'ConfrmSaveMainGrdLayout':
                        rootScope.$broadcast("SaveMainGridLayout", {
                            args: {
                                isSave: false,
                                methodName: sendData.methodName,
                                option: sendData.option
                            }
                        });
                        if (sendData.methodName == "logout")
                            rootScope.$broadcast("LogoutGridLayout");
                        break;
                    case 'OverrideSaveMainGrdLayout':
                        rootScope.$broadcast("SaveMainGridLayout", {
                            args: {
                                isSave: false,
                                methodName: sendData.methodName,
                                option: sendData.option
                            }
                        });
                        if (sendData.methodName == "logout")
                            rootScope.$broadcast("LogoutGridLayout");
                        break;
                    case 'ConfrmSaveSearchGrdLayout':
                        rootScope.$broadcast("SaveSearchGridLayout", {
                            args: {
                                isSave: false,
                                methodName: sendData.methodName,
                                data: sendData.dataRow
                            }
                        });
                        break;
                        
                       
                }
            });
        }
    }
}])
.factory('descFavService', ['broadcastService', '$rootScope', function (broadcastService, $rootScope) {
    return {
        'isDescInFavList': function (descValue, favDescriptionList) {
            //$rootScope.errorLogMethod("descFavService.isDescInFavList");
            var isExist = false;
            for (var i = 0; i < favDescriptionList.length; i++) {
                if (descValue == favDescriptionList[i]) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        },
        'updateFavDescLocalStorage': function (isAdded, dataAray, isDeleteAll, updateFlag) {
            $rootScope.errorLogMethod("descFavService.updateFavDescLocalStorage");
            var allFavDesc = JSON.parse(sessionStorage.getItem('DescFav'));
            if (isAdded) {
                var isAlreadyExist = allFavDesc.filter(function (desc) {
                    return desc === dataAray[0]
                });
                if (isAlreadyExist.length<=0)
                allFavDesc.push(dataAray[0]);               
            }
            else {
                if (isDeleteAll) {
                    allFavDesc=[];
                }
                else {
                    for (var i = 0; i < dataAray.length; i++) {
                        allFavDesc = allFavDesc.filter(function (desc) {
                            return desc !== dataAray[i]
                        });
                    }
                }
            }
            sessionStorage.setItem('DescFav', JSON.stringify(allFavDesc));
            if (updateFlag!==-1 && updateFlag!==undefined)
            broadcastService.updateDataSource(updateFlag);
            return allFavDesc;
        },
        'getUTF8ByteLength': function (s, len) {
            //$rootScope.errorLogMethod("descFavService.getUTF8ByteLength");
            var str = "";            
            var encodedDesc = unescape(encodeURIComponent(s));
            if (encodedDesc.length > len) {
             encodedDesc = encodedDesc.substring(0, len);
            }
            encodedDesc = escape(encodedDesc);
            for (var i = 0; i < encodedDesc.length; i++) {
                try {
                    str = decodeURIComponent(encodedDesc);
                    break;
                } catch (ex) {
                    encodedDesc = encodedDesc.substring(0, encodedDesc.length - 1);
                    console.log('decodeURIComponent error==' + ex.message + " string decoding==" + encodedDesc);
                }
            }
            return str;
        }
    }
}])
.factory('resizeWindowService', ['$rootScope', function ($rootScope) {
        return {
            'getMaxMinSettings': function (outerDivMargin, topHeaderHgt, sec1Hgt, minModeWidth, minModeHgt) {
                $rootScope.errorLogMethod("resizeWindowService.getMaxMinSettings");
                var maxMode = {
                    isRendered: true,
                    width: window.innerWidth,
                    height: window.innerHeight - outerDivMargin, left: 0, top: 0, margin: 0, topHeader: topHeaderHgt,
                    section1Hgt: sec1Hgt
                };
                var minMode = {
                    isRendered: true,
                    width: minModeWidth, topHeader: topHeaderHgt,
                    height: minModeHgt, overflow: 'hidden', left: '50%', top: '50%', margin: '-146px 0px 0px -400px',
                    section1Hgt: sec1Hgt
                };
                return [minMode, maxMode];
            }
        }
    }])
.factory('activityFavService', ['broadcastService', '$rootScope', function (broadcastService, $rootScope) {
        return {
            'isActivityInFavList': function (activity, favActList) {
                $rootScope.errorLogMethod("activityFavService.isActivityInFavList");
                var objArr = favActList.filter(function (item) { return item.ACTICD == activity.ACTICD });
                if (objArr.length > 0) {
                   return true;
                }
                else return false;
            },
            'updateFavActLclStorage': function (isAdded, activityDataArr, updateFlag) {
                $rootScope.errorLogMethod("activityFavService.updateFavActLclStorage");
                var favActivityArr = [];
                favActivityArr = JSON.parse(sessionStorage.getItem('FavActivityArray'));
                if (isAdded) {
                    var obj =null;
                    try {
                         obj = {
                                ACTICD: activityDataArr[0].ACTICD,
                                COMPID: activityDataArr[0].COMPID,
                                DES: activityDataArr[0].DES,
                                fav: true,
                            STAT: activityDataArr[0].STAT
                    };
                    } catch (ex) {
                        obj=activityDataArr[0];
                    }
                        favActivityArr.push(obj);
                        sessionStorage.setItem('FavActivityArray', JSON.stringify(favActivityArr));
                    }
                    else {
                    for (var i = 0; i < activityDataArr.length; i++) {
                        favActivityArr = favActivityArr.filter(function (activity) {
                            return activity.ACTICD !== activityDataArr[i].ACTICD
                        });
                        }
                    sessionStorage.setItem('FavActivityArray', JSON.stringify(favActivityArr));
                }
                if (updateFlag !== - 1 && updateFlag !==undefined)
                broadcastService.updateDataSource(updateFlag);

            }
        }
}])
.factory('arrService', ['$rootScope', function ($rootScope) {
        return {
            'isBlankArray': function (array, valueMatch) {
                $rootScope.errorLogMethod("arrService.isBlankArray");
                if (!valueMatch)
                    valueMatch = [null];               
                
                for (var i = 0; i < array.length; i++) {
                    var val = array[i];
                    if (val === null)
                        continue;
                    if (val === undefined) {
                        return true;
                    }
                }
                   
               blankHrsAr = array.filter(function (item) {
                    return  item == valueMatch[0]
                });
                if (blankHrsAr.length == array.length) {
                    return true;
                }                
                else {
                    return false;
                }
            }
        }
}])
.factory('empSharedService', ['$rootScope', function ($rootScope) {
    return {
        'checkTerminationDate': function (temrMinateDate, currentDate) {
            $rootScope.errorLogMethod("empSharedService.checkTerminationDate");
            //temrMinateDate ="05-Oct-2016";
            var isContinue = true;
            if (typeof temrMinateDate != 'undefined' && temrMinateDate !== null && temrMinateDate.trim() !== "") {             
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
                var mnthIndex = -1;
                //21-Sep- 2015
                var dateParts = temrMinateDate.split("-");
                for (var i = 0; i < months.length; i++) {
                    if (months[i] === dateParts[1]) {
                        mnthIndex = i;
                        break;
                    }
                }
                if (mnthIndex != -1) {
                    var dateObj = {
                        year: parseInt(dateParts[2]), day: parseInt(dateParts[0]), month: parseInt(mnthIndex)
                    }
                    //termination year ==current date year
                    if (currentDate.getFullYear() <= dateObj.year) {
                        isContinue = false;
                        if (currentDate.getFullYear() < dateObj.year)
                            isContinue = true;
                        else if (currentDate.getMonth() < dateObj.month)
                            isContinue = true;
                        else if (currentDate.getMonth() == dateObj.month && currentDate.getDate() <= dateObj.day)
                            isContinue = true;
                    }
                    else
                        isContinue = false;
                }
            }
            return isContinue;
        }
          }

}])
.factory('cepSharedService', ['$rootScope', function ($rootScope) {
    return {
        'isExcepCepCode': function (cepEnterText) {
            $rootScope.errorLogMethod("cepSharedService.isExcepCepCode");
            var exceptionalCep = { MRT: "MRT", LEARN: "LEARN", MT0: "MT000" }
            var resp = {isExpCep:false,cepWithMask:null,masking:null};
            if ((cepEnterText.substring(0, 3).toUpperCase().trim() == exceptionalCep.MRT) && (!isNaN(cepEnterText.substring(3, cepEnterText.length)))) {                              
                if (cepEnterText.length == 9) {
                    resp.masking = "?*?*?*-?9?9?9?-?9?9?9";
                    resp.cepWithMask= cepEnterText.substring(0, 3) + '-' + cepEnterText.substring(3, 6) + '-' + cepEnterText.substring(6, 9);                  
                    resp.isExpCep = true;
                }

            }
           else if ((cepEnterText.substring(0, 5).toUpperCase().trim() == exceptionalCep.LEARN) && (!isNaN(cepEnterText.substring(5, cepEnterText.length)))) {               
                if (cepEnterText.length == 11) {
                    resp.masking = '?*?*?*?*?*-?9?9?9?-?9?9?9';
                    resp.cepWithMask = cepEnterText.substring(0, 5) + '-' + cepEnterText.substring(5, 8) + '-' + cepEnterText.substring(8, 11);                   
                    resp.isExpCep = true;
                }              
            }
           else if ((cepEnterText.substring(0, 5).toUpperCase().trim() == exceptionalCep.MT0) && (!isNaN(cepEnterText.substring(5, cepEnterText.length)))) {
               if (cepEnterText.length == 11) {
                   resp.masking = '?*?*?*?*?*-?9?9?9?-?9?9?9';
                   resp.cepWithMask = cepEnterText.substring(0, 5) + '-' + cepEnterText.substring(5, 8) + '-' + cepEnterText.substring(8, 11);
                   resp.isExpCep = true;
               }
           }
            return resp;
        },
        'convertToMask': function (srchStr, mask) {            
            try {
                srchStr = srchStr.trim();
                srchStr = srchStr.replace(/\-/g, '');
                srchStr=srchStr.replace(/\s/g, '')
                if (mask == "?*?*?*?*?*?*?-?9?9?9?-?9?9?9") {
                    if (srchStr.length > 12) {
                        srchStr = srchStr.substring(0, 12);
                        //var temp = srchStr;
                        //temp = srchStr.substring(0, 6);
                        //if (!isNaN(srchStr.substring(6, 9)))
                        //  temp = temp + srchStr.substring(6, 9);
                        // if (!isNaN(srchStr.substring(6, 9)))
                        //  temp = temp + srchStr.substring(9);
                        // srchStr = temp;

                    }
                }
                else if (mask == "?*?*?*-?9?9?9?-?9?9?9") {
                    if (srchStr.length > 9) {
                        srchStr = srchStr.substring(0, 9);
                    }

                }
                else if (mask == "?*?*?*?*?*-?9?9?9?-?9?9?9") {
                    if (srchStr.length > 11) {
                        srchStr = srchStr.substring(0, 11);
                    }
                }
                return srchStr;
            } catch (err) { return srchStr; }
        }
    }
}])
.factory('retrieveSharedService', ['$filter', '$rootScope', 'constantService', 'dateService', function ($filter, $rootScope, constantService, dateService) {
    return {
        'retrieveColorFromTimeEntries': function (revstartDate, revEndDate, timeEntryBitMap) {
            $rootScope.errorLogMethod("retrieveSharedService.retrieveColorFromTimeEntries");
            if (revstartDate != null && revEndDate!=null) {
                var dateStr = revstartDate.substring(0, 10);
                var revstDate = new Date(dateStr);
                revstDate.setHours(0, 0, 0, 0);
                if (dateStr != undefined) {
                    var parts = dateStr.split("-");
                    var day = parts[2].split(' ');
                    revstDate = Date(parts[0], parts[1] - 1, day[0]);
                }

                dateStr = revEndDate.substring(0, 10);
                var revEdDate = new Date(dateStr);
                revEdDate.setHours(0, 0, 0, 0);
                if (dateStr != undefined) {
                    var parts1 = dateStr.split("-");
                    var day1 = parts1[2].split(' ');
                    revEdDate = Date(parts1[0], parts1[1] - 1, day1[0]);
                }

                var dayDiff = Math.round((revEdDate - revstDate) / (1000 * 60 * 60 * 24));
                var compliantEntry = []; var nonCompliantEntry = [];
                var hrs = $rootScope.GetInitialDetail(false, true).EMPL_REC.REQHRS;
                if (timeEntryBitMap != undefined) {
                    for (var i = 0 ; i <= dayDiff; i++) {
                        if (revstDate.getTime() > revEdDate.getTime())
                            break;
                        var revstartingDate = $filter('date')(angular.copy(revstDate), "yyyy-MM-dd");
                        if (timeEntryBitMap[i] == "Y" || (timeEntryBitMap[i] == "X" && (revstDate.getDay() == 0 || revstDate.getDay() == 6))) {
                            compliantEntry.push({
                                DTE: angular.copy(revstartingDate), HRS: hrs
                            });
                        }
                        else if (timeEntryBitMap[i] == "X") {
                            nonCompliantEntry.push({
                                DTE: angular.copy(revstartingDate), HRS: -50
                            });
                        }

                        revstDate.setDate(revstDate.getDate() + 1);
                    }
                }
                return [compliantEntry, nonCompliantEntry];
            }
        },
        'getMonthName': function (mnthName) {            
            var monthName = { Janvier: 'January', Février: 'February', Mars: 'March', Avril: 'April', Mai: 'May', Juin: 'June', Juillet: 'July', Août: 'August', Septembre: 'September', Octobre: 'October', Novembre: 'November', Décembre: 'December' };
            var monthTitle = { Jan: 'Jan', Fév: 'Feb', Mar: 'Mar', Avr: 'Apr', Mai: 'May', Juin: 'Jun', Juil: 'Jul', Août: 'Aug', Sept: 'Sept', Oct: 'Oct', Nov: 'Nov', Déc: 'Dec' };
                if (angular.isDefined(monthName[mnthName])) {
                    return monthName[mnthName]
                }
                else if (angular.isDefined(monthTitle[mnthName])) {
                    return monthTitle[mnthName]
                }
                else
                    return mnthName;
        },
        'getCurrentRevenueStartEndDate': function () {
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
                        if (dateService.createDate(tempTodayDate1) >= dateService.createDate(revenueMonthsCountdown[i].STRTDTE) && dateService.createDate(tempTodayDate1) <= dateService.createDate(revenueMonthsCountdown[i].ENDDTE)) {
                            countdownRevRangeDate = revenueMonthsCountdown[i];
                            break;
                        }
                    }
                }
            }
            return countdownRevRangeDate;
        }
    }
   
    }])
.value('addRemoveFavMsgs', {
    duplicateDesc: 'This Description already exists in your Description Favorites.'
    });

