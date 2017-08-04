angular.module('MyTimeApp')
.controller('ReportCtrl', ['$scope', 'reportService', '$window', '$filter', '$rootScope', '$translate', 'constantService', '$timeout', 'retrieveSharedService', function ($scope, reportService, $window, $filter, $rootScope, $translate, constantService, $timeout, retrieveSharedService) {
    $scope.IsReportSelected = false;
    $scope.repnamePlaceholder = "...";
    $scope.isDisableReportName = true;
 $scope.isReportingDropDownOn = false;
 $scope.reportselected = function (report) {
     $rootScope.errorLogMethod("ReportCtrl.$scope.reportselected");
        if (report.repname)
            $scope.IsReportSelected = true;
        $scope.repname = report.repname;
        $scope.repvalue = report.value;
        $scope.isReportingDropDownOn = false;
    }
    $scope.reportnamelist = [{
        repname: $filter('translate')('msg_timeSum'), value: "ausdayr0"
    },
                         {
                             repname: $filter('translate')('msg_emplActRprt'), value: "ausdetr0"
    },
                         {
                             repname: $filter('translate')('msg_emplHrsSum'), value: "aussumr0"
    },
                         { repname: $filter('translate')('msg_prsnlPrjLst'), value: "auslstr0" }];
    $scope.openReportingDropDown = function ($event, isBlur) {
        $rootScope.errorLogMethod("ReportCtrl.$scope.openReportingDropDown");
        $event.stopPropagation();
        $scope.repnamePlaceholder = $scope.isReportingDropDownOn ? "..." : "";
        if (isBlur) {
            $scope.isReportingDropDownOn = false;
        }
        else
        $scope.isReportingDropDownOn = !$scope.isReportingDropDownOn;
        if ($scope.repnamePlaceholder == "...")
            $scope.isDisableReportName = true;
        else
            $scope.isDisableReportName = false;
        if ($scope.isReportingDropDownOn) {
            angular.element('#reportInput').focus();           
        }
        else {
            angular.element('#reportInput').blur();

        }
    }
    
    $scope.reportingBlur = function ($event) {
        $rootScope.errorLogMethod("ReportCtrl.$scope.reportingBlur");
        $event.stopPropagation();       
        $scope.repnamePlaceholder = $scope.isReportingDropDownOn ? "..." : "";
        if ($scope.repnamePlaceholder == "...")
            $scope.isDisableReportName = true;
        else
            $scope.isDisableReportName = false;
        $scope.isReportingDropDownOn = false;
    }
    $scope.reportingItemMouseOver = function (event) {
        $(".reportingDropdown li").removeClass("selected");
        $(event.target).addClass("selected");
    }

    $scope.reportingInputKeyDown = function (e) {
        $rootScope.errorLogMethod("ReportCtrl.$scope.reportingInputKeyDown");
        // enter key press
        if (e.keyCode == 13) {
            var selected = $(".reportingDropdown li.selected");
            var selectedId = angular.element(selected).attr('id');
            if (selectedId !== undefined) {
                var report = $scope.reportnamelist.filter(function (item) {
                    return (item.repname === selectedId)
                });
                if (report.length === 1) {
                    $scope.isReportingDropDownOn = false;
                    $scope.reportselected(report[0]);
                    angular.element('.reportingList').focus();
                }
            }

        }

        if (e.keyCode == 40) { // down
            var selected = $(".reportingDropdown li.selected");
            $(".reportingDropdown li").removeClass("selected");
            if (selected.next().length == 0) {
                selected.siblings().first().addClass("selected");
            } else {
                selected.next().addClass("selected");
            }
        }
        if (e.keyCode == 38) { // up
            var selected = $(".reportingDropdown li.selected");
            $(".reportingDropdown li").removeClass("selected");
            if (selected.prev().length == 0) {
                selected.siblings().last().addClass("selected");
            } else {
                selected.prev().addClass("selected");
            }
        }

    }
    $scope.init = function () {
        $rootScope.errorLogMethod("ReportCtrl.$scope.init");
        localStorage.isReportPopUpOpen = "false";
        $scope.isStartDate = false;
        $scope.isEndDate = false;
        var endDate = new Date();
        var currentTimezone = endDate.getTimezoneOffset();
        endDate.setMinutes(endDate.getMinutes() - (currentTimezone));
        var startDate = angular.copy(endDate);
        startDate.setDate(startDate.getDate() -7);

        $("#startDatepicker").datepick({
             onShow: $.datepick.selectWeek,
             onSelect: selectStartDate,
                selectOtherMonths: true,
                showOtherMonths: true,
                monthsToShow: 1, fixedWeeks: true,
                dayNamesMin: [$filter('translate')('lbl_WkDy1'), $filter('translate')('lbl_WkDy2'), $filter('translate')('lbl_WkDy3'), $filter('translate')('lbl_WkDy4'), $filter('translate')('lbl_WkDy5'), $filter('translate')('lbl_WkDy6'), $filter('translate')('lbl_WkDy7')],
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                multiSelect: 1,
                renderer: $.datepick.weekOfYearRenderer,
                dateFormat: 'mm/dd/yyyy',
                showOnFocus: false,
                showTrigger: '<button type="button" class="trigger"><img src="jquerydatepicker/calendar-green.gif" alt="Popup" ></button>',
                prevText: '<i class="fa fa-caret-left"></i>', nextText: '<i class="fa fa-caret-right"></i>',
            //showButtonPanel: true
        });
        $('#endDatepicker').datepick({
             onShow: $.datepick.selectWeek,
             onSelect: selectEndDate,
                selectOtherMonths: true,
                showOtherMonths: true,
                monthsToShow: 1, fixedWeeks: true,
                dayNamesMin: [$filter('translate')('lbl_WkDy1'), $filter('translate')('lbl_WkDy2'), $filter('translate')('lbl_WkDy3'), $filter('translate')('lbl_WkDy4'), $filter('translate')('lbl_WkDy5'), $filter('translate')('lbl_WkDy6'), $filter('translate')('lbl_WkDy7')],
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                multiSelect: 1,
                renderer: $.datepick.weekOfYearRenderer,
                dateFormat: 'mm/dd/yyyy',
                showOnFocus: false,
                showTrigger: '<button type="button" class="trigger"><img src="jquerydatepicker/calendar-green.gif" alt="Popup" ></button>',
                prevText: '<i class="fa fa-caret-left"></i>', nextText: '<i class="fa fa-caret-right"></i>',
        });

        $('#startDatepicker').datepick('setDate', startDate);
        $('#endDatepicker').datepick('setDate', endDate);
        
        $scope.startingDt = new Date(startDate);
        $scope.endingDt = new Date(endDate);
        $scope.startDate = $filter('date')(new Date(startDate), 'MM/dd/yyyy');
        $scope.endDate = $filter('date')(new Date(endDate), 'MM/dd/yyyy');

    }
        var language = constantService.CURRENTLANGUAGE;
        if (constantService.CURRENTLANGUAGE == "en")
            language = "";
        $("#startDatepicker").datepicker("option",
           $.datepick.setDefaults($.datepick.regionalOptions[language]));
        $("#endDatepicker").datepicker("option",
               $.datepick.setDefaults($.datepick.regionalOptions[language]));
    $("#startDatepicker").datepick({
        onShow: $.datepick.selectWeek,
        onSelect: selectStartDate,
            selectOtherMonths: true,
            showOtherMonths: true, fixedWeeks: true,
            renderer: $.datepick.weekOfYearRenderer,
            dayNamesMin: [$filter('translate')('lbl_WkDy1'), $filter('translate')('lbl_WkDy2'), $filter('translate')('lbl_WkDy3'), $filter('translate')('lbl_WkDy4'), $filter('translate')('lbl_WkDy5'), $filter('translate')('lbl_WkDy6'), $filter('translate')('lbl_WkDy7')],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dateFormat: 'mm/dd/yyyy',
            showOnFocus: false,
            prevText: '<i class="fa fa-caret-left"></i>', nextText: '<i class="fa fa-caret-right"></i>',
            showTrigger: '<button type="button" class="trigger"><img src="jquerydatepicker/calendar-green.gif" alt="Popup" ></button>',
    });
    $("#endDatepicker").datepick({
        onShow: $.datepick.selectWeek,
        onSelect: selectEndDate,
            selectOtherMonths: true,
            showOtherMonths: true, fixedWeeks: true,
            renderer: $.datepick.weekOfYearRenderer,
            dayNamesMin: [$filter('translate')('lbl_WkDy1'), $filter('translate')('lbl_WkDy2'), $filter('translate')('lbl_WkDy3'), $filter('translate')('lbl_WkDy4'), $filter('translate')('lbl_WkDy5'), $filter('translate')('lbl_WkDy6'), $filter('translate')('lbl_WkDy7')],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dateFormat: 'mm/dd/yyyy',
            showOnFocus: false,
            prevText: '<i class="fa fa-caret-left"></i>', nextText: '<i class="fa fa-caret-right"></i>',
            showTrigger: '<button type="button" class="trigger"><img src="jquerydatepicker/calendar-green.gif" alt="Popup" ></button>',
    });

    /////////////////StartDate Revamp Code for calendar
    function convertMonthNameToNumber(monthName) {
        var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
        var monthDigit = myDate.getMonth();
        return isNaN(monthDigit) ? 0 : (monthDigit + 1);
    }
    GetStartDateCalCurrentSelectedDates = function (currentMonth, currentYear) {
        $('.datepick-popup .calendarReportOver.reportStartDate .yearContainerinner').each(function () {
            $(this).find("li").each(function () {
                if ($(this).text() == currentYear)
                    $(this).children().addClass("liActive")
            });
        });
        $('.datepick-popup .calendarReportOver.reportStartDate .monthContainer').each(function () {
            $(this).find("li").each(function () {
                if (convertMonthNameToNumber($(this).text()) == currentMonth)
                    $(this).children().addClass("liActive")
            });
        });
    }

    showStartDateRevampCalendar = function () {
        $(".calendarReportOver.reportStartDate").animate({ top: "0px" }, 300, function () {
            $(".reportStartDate .cancelCalPopup").click(function () {
                $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId").remove();
                $(".calendarReportOver.reportStartDate").animate({ top: "-229px" }, 200);
                $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner").append("<ul id='reportCalYearId'></ul>");
            });

        });

        $(".calendarReportOver.reportStartDate").animate({ top: "0px" }, 300, function () {
            $(".reportStartDate .selectCalDate").click(function () {
                $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId").remove();
                $(".calendarReportOver.reportStartDate").animate({ top: "-229px" }, 200);
                $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner").append("<ul id='reportCalYearId'></ul>");
            });

        });

        function GetStartDateCalendarYear(yearSubmitNo) {
            var currentYear = parseInt(new Date("sessiontimeout").getFullYear());
            var prevSevenYear = parseInt(new Date("sessiontimeout").getFullYear()) - 7;
            var fullYear = parseInt(currentYear) + 1;
            if (yearSubmitNo <= (parseInt(fullYear) - 6))
                fullYear = parseInt(fullYear) - 6;
            else if (yearSubmitNo <= (parseInt(fullYear) - 3))
                fullYear = parseInt(fullYear) - 3;

            yearSubmitNo = parseInt(fullYear) - 2;

            for (i = 0; i <= 2; i++) {
                if (parseInt(prevSevenYear) <= parseInt(yearSubmitNo) && parseInt(yearSubmitNo) <= parseInt(fullYear)) {
                    $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId").append("<li><a href='javascript:void(0)'>" + yearSubmitNo + "</a></li>");
                    yearSubmitNo = yearSubmitNo + 1;
                }
                else {
                    $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId").append("<li class='liDisabled'><a href='javascript:void(0)'>" + yearSubmitNo + "</a></li>");
                    yearSubmitNo = yearSubmitNo + 1;
                }
            }
        }

        var yearMnthValue = $(".datepick #startDtId .ng-binding").text().split(" ");
        GetStartDateCalendarYear(yearMnthValue[1]);

        $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner ul li a").click(function () {
            $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
        $(".datepick-popup .calendarReportOver.reportStartDate .monthContainer ul li a").click(function () {
            $(".datepick-popup .calendarReportOver.reportStartDate .monthContainer ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
        $(".datepick-popup .calendarReportOver.reportStartDate .monthYearCont .navigator #prevStartDateYear").click(function () {
            var valFirst = $(".calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId li:first a").text();
            yearNo = parseInt(valFirst) - 3;
            var checkYear = parseInt(yearNo) + 1;
            var prevSevenYear = parseInt(new Date("sessiontimeout").getFullYear()) - 7;
            if (checkYear >= prevSevenYear) {
                $(".calendarReportOver .yearContainerinner #reportCalYearId li").remove();
                GetStartDateCalendarYear(yearNo);
                $(".calendarReportOver .yearContainerinner ul li a").click(function () {
                    $(".calendarReportOver .yearContainerinner ul li a").removeClass("liActive");
                    $(this).addClass("liActive");
                });
            }
            else {
                localStorage.isReportPopUpOpen = "true";
                showMessagePopUp([$filter('translate')('msg_CalendarYear')], $filter('translate')('lbl_Error'), false);
            }
        });
        $(".datepick-popup .calendarReportOver.reportStartDate .monthYearCont .navigator #nextStartDateYear").click(function () {
            var valFirst = $(".calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId li:first a").text();
            yearNo = parseInt(valFirst) + 3;
            var currentYear = parseInt(new Date("sessiontimeout").getFullYear());
            if (parseInt(yearNo) <= currentYear) {
                $(".calendarReportOver.reportStartDate .yearContainerinner #reportCalYearId li").remove();
                GetStartDateCalendarYear(yearNo);
                $(".calendarReportOver .yearContainerinner ul li a").click(function () {
                    $(".calendarReportOver .yearContainerinner ul li a").removeClass("liActive");
                    $(this).addClass("liActive");
                });
            }
            else {
                localStorage.isReportPopUpOpen = "true";
                showMessagePopUp([$filter('translate')('msg_CalendarYear')], $filter('translate')('lbl_Error'), false);
            }
        });

        $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner ul li a").removeClass("liActive");
        $(".datepick-popup .calendarReportOver.reportStartDate .monthContainer ul li a").removeClass("liActive");
        GetStartDateCalCurrentSelectedDates(parseInt(convertMonthNameToNumber(yearMnthValue[0])), yearMnthValue[1]);
        
    }
    selectStartCalDate = function () {
        var inlineDate = $scope.startingDt;
        var yearValue = $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner .liActive").text();
        var monthValue = $(".datepick-popup .calendarReportOver.reportStartDate .monthContainer .liActive").text();
        var startDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), inlineDate.getDate());
        $('#startDatepicker').datepick('setDate', startDate);
        $(".datepick-popup .calendarReportOver.reportStartDate .yearContainerinner ul li a").removeClass("liActive");
        $(".datepick-popup .calendarReportOver.reportStartDate .monthContainer ul li a").removeClass("liActive");
        GetStartDateCalCurrentSelectedDates(parseInt(convertMonthNameToNumber(monthValue)), yearValue);

    }

    /////////////////End Revamp Code for startdate calendar 

    /////////////////EndDate Revamp Code for calendar 

    showEndDateRevampCalendar = function () {
        $(".calendarReportOver.reportEndDate").animate({ top: "0px" }, 300, function () {

            $(".reportEndDate .cancelCalPopup").click(function () {
                $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId").remove();
                $(".calendarReportOver.reportEndDate").animate({ top: "-229px" }, 200);
                $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner").append("<ul id='reportCalYearId'></ul>");
            });

        });

        $(".calendarReportOver.reportEndDate").animate({ top: "0px" }, 300, function () {

            $(".reportEndDate .selectCalDate").click(function () {
                $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId").remove();
                $(".calendarReportOver.reportEndDate").animate({ top: "-229px" }, 200);
                $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner").append("<ul id='reportCalYearId'></ul>");
            });

        });

        function GetEndDateCalendarYear(yearSubmitNo) {
            var currentYear = parseInt(new Date("sessiontimeout").getFullYear());
            var prevSevenYear = parseInt(new Date("sessiontimeout").getFullYear()) - 7;
            var fullYear = parseInt(currentYear) + 1;
            if (yearSubmitNo <= (parseInt(fullYear) - 6))
                fullYear = parseInt(fullYear) - 6;
            else if (yearSubmitNo <= (parseInt(fullYear) - 3))
                fullYear = parseInt(fullYear) - 3;

            yearSubmitNo = parseInt(fullYear) - 2;
            for (i = 0; i <= 2; i++) {
                if (parseInt(prevSevenYear) <= parseInt(yearSubmitNo) && parseInt(yearSubmitNo) <= parseInt(fullYear)) {
                    $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId").append("<li><a href='javascript:void(0)'>" + yearSubmitNo + "</a></li>");
                    yearSubmitNo = yearSubmitNo + 1;
                }
                else {
                    $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId").append("<li class='liDisabled'><a href='javascript:void(0)'>" + yearSubmitNo + "</a></li>");
                    yearSubmitNo = yearSubmitNo + 1;
                }
            }
        }

        var yearMnthValue = $(".datepick #endDtId .ng-binding").text().split(" ");
        GetEndDateCalendarYear(yearMnthValue[1]);

        GetEndDateCalCurrentSelectedDates = function (currentMonth, currentYear) {
            $('.datepick-popup .calendarReportOver.reportEndDate .yearContainerinner').each(function () {
                $(this).find("li").each(function () {
                    if ($(this).text() == currentYear)
                        $(this).children().addClass("liActive")
                });
            });
            $('.datepick-popup .calendarReportOver.reportEndDate .monthContainer').each(function () {
                $(this).find("li").each(function () {
                    if (convertMonthNameToNumber($(this).text()) == currentMonth)
                        $(this).children().addClass("liActive")
                });
            });
        }       

        $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner ul li a").click(function () {
            $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
        $(".datepick-popup .calendarReportOver.reportEndDate .monthContainer ul li a").click(function () {
            $(".datepick-popup .calendarReportOver.reportEndDate .monthContainer ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
        $(".datepick-popup .calendarReportOver.reportEndDate .monthYearCont .navigator #prevEndDateYear").click(function () {
            var valFirst = $(".calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId li:first a").text();
            yearNo = parseInt(valFirst) - 3;
            var checkYear = parseInt(yearNo) + 1;
            var prevSevenYear = parseInt(new Date("sessiontimeout").getFullYear()) - 7;
            if (checkYear >= prevSevenYear) {
                $(".calendarReportOver.reportEndDate .yearContainerinner li").remove();
                GetEndDateCalendarYear(yearNo);
                $(".calendarReportOver.reportEndDate .yearContainerinner ul li a").click(function () {
                    $(".calendarReportOver.reportEndDate .yearContainerinner ul li a").removeClass("liActive");
                    $(this).addClass("liActive");
                });
            }
            else {
                localStorage.isReportPopUpOpen = "true";
                showMessagePopUp([$filter('translate')('msg_CalendarYear')], $filter('translate')('lbl_Error'), false);
            }
        });
        $(".datepick-popup .calendarReportOver.reportEndDate .monthYearCont .navigator #nextEndDateYear").click(function () {
            var valFirst = $(".calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId li:first a").text();
            yearNo = parseInt(valFirst) + 3;
            var currentYear = parseInt(new Date("sessiontimeout").getFullYear());
            if (parseInt(yearNo) <= currentYear) {
                $(".calendarReportOver.reportEndDate .yearContainerinner #reportCalYearId li").remove();
                GetEndDateCalendarYear(yearNo);
                $(".calendarReportOver.reportEndDate .yearContainerinner ul li a").click(function () {
                    $(".calendarReportOver.reportEndDate .yearContainerinner ul li a").removeClass("liActive");
                    $(this).addClass("liActive");
                });
            }
            else {
                localStorage.isReportPopUpOpen = "true";
                showMessagePopUp([$filter('translate')('msg_CalendarYear')], $filter('translate')('lbl_Error'), false);
            }
        });
        
        $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner ul li a").removeClass("liActive");
        $(".datepick-popup .calendarReportOver.reportEndDate .monthContainer ul li a").removeClass("liActive");
        GetEndDateCalCurrentSelectedDates(parseInt(convertMonthNameToNumber(yearMnthValue[0])), yearMnthValue[1]);
    }
    selectEndCalDate = function () {
        var yearValue = $(".datepick-popup .calendarReportOver.reportEndDate  .yearContainerinner .liActive").text();
        var monthValue = $(".datepick-popup .calendarReportOver.reportEndDate  .monthContainer .liActive").text();
        var endDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), $scope.endingDt.getDate());
        $('#endDatepicker').datepick('setDate', endDate);
        $(".datepick-popup .calendarReportOver.reportEndDate .yearContainerinner ul li a").removeClass("liActive");
        $(".datepick-popup .calendarReportOver.reportEndDate .monthContainer ul li a").removeClass("liActive");
        GetEndDateCalCurrentSelectedDates(parseInt(convertMonthNameToNumber(monthValue)), yearValue);

    }  
    
    $scope.isDate = function (obj) {
        $rootScope.errorLogMethod("ReportCtrl.$scope.isDate");
        return Object.prototype.toString.call(obj) === '[object Date]';
    }
    $scope.checkDateFormat = function (date, type) {
       
        if (date != "") {
            var pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/\d{4}$/;
            if (!pattern.test(date)) {
                if (type == "start") {
                    $scope.startInvalid = true;
                    $scope.startCalSelectionInvalid = false;
                    $(".startdateTxt").addClass("invalid");
                }
                else if (type == "end") {
                    $scope.endInvalid = true;
                    $scope.endCalSelectionInvalid = false;
                    $(".enddateTxt").addClass("invalid");                    
                }
            }
            else {
                var temp = date.split("/");

                var currentYear = parseInt(new Date("sessiontimeout").getFullYear());
                var prevYear = currentYear - 7;
                var futureYear = currentYear + 1;
                var isCondTrue = (parseInt(temp[2]) <= futureYear && parseInt(temp[2]) >= prevYear);

                var tempDate = new Date(parseInt(temp[2]), (parseInt(temp[0]) - 1), parseInt(temp[1]));
                if (tempDate.getDate() == undefined || tempDate.getDate() != parseInt(temp[1])) {
                if (type == "start") {
                    $scope.startInvalid = true;
                    $scope.startCalSelectionInvalid = false;
                    $(".startdateTxt").addClass("invalid");
                    }
                else if (type == "end") {
                    $scope.endInvalid = true;
                    $scope.endCalSelectionInvalid = false;
                    $(".enddateTxt").addClass("invalid");
                    }
                }
                else if (!isCondTrue) {
                    if (type == "start") {
                        $scope.startInvalid = false;
                        $scope.startCalSelectionInvalid = true;
                        $(".startdateTxt").addClass("invalid");
                }
                if (type == "end") {
                        $scope.endCalSelectionInvalid = true;
                        $scope.endInvalid = false;
                        $(".enddateTxt").addClass("invalid");                        
                    }
                }
                else {
                    if (type == "start") {
                        $scope.startCalSelectionInvalid = false;
                        $scope.startInvalid = false;
                        $(".startdateTxt").removeClass("invalid");
                }
                    if (type == "end") {
                        $scope.endCalSelectionInvalid = false;
                        $scope.endInvalid = false;
                        $(".enddateTxt").removeClass("invalid");
                }
                }
            }
        }
        else {
            if (type == "start") {
                $scope.startInvalid = false;
                $scope.startCalSelectionInvalid = false;
                $(".startdateTxt").removeClass("invalid");                
            }
            if (type == "end") {
                $scope.endInvalid = false;
                $scope.endCalSelectionInvalid = false;
                $(".enddateTxt").removeClass("invalid");                
            }
        }
    }
    function selectStartDate() {
       $rootScope.errorLogMethod("ReportCtrl.selectStartDate");
       $scope.isStartDate = false;
       $scope.startingDt = new Date($('#startDatepicker').datepick('getDate'));
       $scope.startDate = $filter('date')($scope.startingDt, 'MM/dd/yyyy');
       $(".startdtcls").hide();   
       //$(".startdateTxt").removeClass("invalid");
       $("#startDatepicker").change();
      
   }
    function selectEndDate() {
        $rootScope.errorLogMethod("ReportCtrl.selectEndDate");
        $scope.isEndDate = false;
        $scope.endingDt = new Date($('#endDatepicker').datepick('getDate'));
        $scope.endDate = $filter('date')($scope.endingDt, 'MM/dd/yyyy');
       $(".enddtcls").hide();     
       //$(".enddateTxt").removeClass("invalid");
       $("#endDatepicker").change();
      }
    $scope.isValidDate = function (obj) {
        $rootScope.errorLogMethod("ReportCtrl.isValidDate");
           return $scope.isDate(obj) && !isNaN(obj.getTime());
    }     
     
    $scope.isValiDate = function () {
          $rootScope.errorLogMethod("ReportCtrl.isValiDate");
          var startdt1 = new Date($('#startDatepicker').val()).getTime();
          var enddt1 = new Date($('#endDatepicker').val()).getTime();
          var dateToCheck = new Date('01/01/1899').getTime();
          var dateToCheckMax = new Date('01/01/9999').getTime();
          
        if (startdt1 > dateToCheck && enddt1 > dateToCheck && startdt1 < dateToCheckMax && enddt1 < dateToCheckMax &&
              $('#startDatepicker').val().trim() != "" && $('#endDatepicker').val().trim() != "" && $('#startDatepicker').val().trim().length == 10 &&
                  $('#endDatepicker').val().trim().length == 10 && $('#startDatepicker').val().substring(2, 3) === '/' && $('#startDatepicker').val().substring(5, 6) === '/'
             && $('#endDatepicker').val().substring(2, 3) === '/' && $('#endDatepicker').val().substring(5, 6) === '/')
          return true;
          else
              return false;
}
    var validateMonth = function (date) {
        $rootScope.errorLogMethod("ReportCtrl.validateMonth");
        var result = true;
        var arr = date.split("/");
        if (arr.length > 0) {
            var m = parseInt(arr[0], 10);            
            if (m > 12 || m < 0)
                result = false;
            else if (arr.length > 1) {
                var d = parseInt(arr[1], 10);
                if(d<0 || d>31)
                    result = false;
            }
        }
        return result;
    }
    
    $scope.checkStartDate = function () {
        $rootScope.errorLogMethod("ReportCtrl.$scope.checkStartDate");
        if ($scope.startDate != "") {
            $scope.isStartDate = false;
            if ($scope.startDate.length == 10)
            $scope.startingDt = new Date($scope.startDate);
        }
        else
            $scope.isStartDate = true;
    }
    $scope.checkEndDate = function () {
        $rootScope.errorLogMethod("ReportCtrl.$scope.checkEndDate");
        if ($scope.endDate != "") {
            $scope.isEndDate = false;
            if ($scope.endDate.length == 10)
            $scope.endingDt = new Date($scope.endDate);
        }
        else
            $scope.isEndDate = true;
    }
    $scope.btnRun = function () {
        $rootScope.errorLogMethod("ReportCtrl.$scope.btnRun");
        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
        var startdt = $scope.startingDt;
       
        if (validateMonth(($('#startDatepicker').val()))==false) {
            showMessagePopUp([$filter('translate')('msg_inldDtFrmt') ], "Message", true);
            return false;
        }
        if (validateMonth(($('#endDatepicker').val())) == false) {
            showMessagePopUp([$filter('translate')('msg_inldDtFrmt') ], "Message", true);
            return false;
        }
        var startdate = $filter('date')(startdt, 'yyyy-MM-dd hh:mm:ss');
        var enddt = $scope.endingDt;
       
        var enddate = $filter('date')(enddt, 'yyyy-MM-dd hh:mm:ss');
       
        if($scope.isValiDate()) {
            if (startdt <= enddt) {
                $scope.runparam = {
                    "REPNM": $scope.repvalue, "STRTDTE": startdate, "ENDDTE": enddate, "CLIENO": $scope.clientno, "ENGNO": $scope.engno, "PROJNO": $scope.prjno
            };
                reportService.runReport($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify($scope.runparam)).then(function (response) {
                    if (response.RUNREP_OUT_OBJ.RETCD == 0) {
                        $window.open(response.RUNREP_OUT_OBJ.PDFURL, '_blank', 'left=100,top=0,width=900,height=500,toolbar=1,resizable=1');
                    }
                    else {
                        if(response.RUNREP_OUT_OBJ.ERRMSG.indexOf("MSG-00110") > -1)
                            showMessagePopUp([$filter('translate')('msg_noMtchInpParm')], $filter('translate')('lbl_Error'), false);
                        else
                            showMessagePopUp([response.RUNREP_OUT_OBJ.ERRMSG], $filter('translate')('lbl_Error'), false);
                        }
                });
            }
            else {
                showMessagePopUp([$filter('translate')('msg_RprtStrtDtGrtr')], "Message", true);
        }
        }
        else {
            showMessagePopUp([$filter('translate')('msg_inldDtFrmt')], "Message", true);
    }

    }
    var showMessagePopUp = function (msgList, title, isWarning) {
        $rootScope.errorLogMethod("ReportCtrl.showMessagePopUp");
        var sendData = {
                errorList: msgList,
                title: title,
                isWarning: isWarning

    };
        $scope.openModalCtrl = 'showMessagePopUp';
        $scope.open('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
    };
}])
