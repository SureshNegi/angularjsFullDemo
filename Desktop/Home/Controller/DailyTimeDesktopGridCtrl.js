(function () {
    var app = angular.module('MyTimeApp');
    var DailyTimeDesktopGridCtrlFun = function ($scope, $filter, uiGridConstants, $http, gridDataService, cepService, projectComponetService, $timeout, loadRevenueMonthsServices, broadcastService, loginService, preferencesService, $rootScope, $state, $modal, $q, $window, dateService, constantService, $locale, $translate, $interval, broadcastMessageServices, activityService, sharedService, $document, uiGridGridMenuService, designateService, empSharedService, cepSharedService, importCalService, descFavService, activityFavService, $modalStack, gridLayoutService, appConstants, futureEntryService, timeEntryNextRevenueService, commonUtilityService, retrieveSharedService) {
        var customLayouts = { daily: null, weekly: null };
        $scope.hourIndexList = [];
        $rootScope.isLineClicked = true;
        $scope.ttlHrs = 0.00;
        $scope.ttlHrs = $scope.ttlHrs.toFixed(2);
        $scope.weeklyTtlHours = 0.00;
        $scope.weeklyTtlHours = $scope.weeklyTtlHours.toFixed(2);
        $scope.isDesigPanelDisabled = false;
        $rootScope.isLoginUsrGloCord = false;
        $scope.ChartCtrlActive = true;
        var windowElement = angular.element($window);
        var heightOffsetDaily = 235;
        var heightOffsetWeekly = 285;
        var heightOffsetDailyFilter = heightOffsetDaily + 26;
        var heightOffsetWeeklyFilter = heightOffsetWeekly + 26;
        var cepWidth = 120;
        var widthHoursWeek = 45;
        var widthHours = 65;
        var widthCB = 47
        windowElement.on('beforeunload', function (event) {
            event.preventDefault();
        });
        $('#loadingWidgetDesktop').bind('contextmenu', function (e) {
            return false;
        });
        var userContainer = $(".user-container-inner").width();

        var widthDecrease = parseInt($(".sidebar").width()) + parseInt($(".colapse-bar").width());
        var mainWidth = parseInt(userContainer) - parseInt(widthDecrease) - 17;
        angular.element($window).bind('resize', function () {
            var userContainer = $(".user-container-inner").width();
            var widthDecrease = parseInt($(".sidebar").width()) + parseInt($(".colapse-bar").width());
            mainWidth = parseInt(userContainer) - parseInt(widthDecrease) - 20;
            if ($(".sidebar").css("left") == "-200px") {
                mainWidth = parseInt(userContainer) - parseInt(widthDecrease) - 34 + parseInt($(".sidebar").width());
            }

            $(".main-area").width(mainWidth);
            var pageHeight = $(window).height();
            $(".mytime-bar").height(pageHeight - 9);
            $(".mytime-bar-inner").height(pageHeight - 50);
            $(".user-container").height(pageHeight - 54);
            $(".user-container-inner").height(pageHeight - 90);
            $(".sidebar-inner").height(pageHeight - 136);
            $(".sidebarSide").height(pageHeight - 96);
            $(".colapse-bar").height(pageHeight - 96);
            $(".right-section").height(pageHeight - 96);
            $(".main-area").height(pageHeight - 94);
            $(".main-area-wrapper").height(pageHeight - 139);
            $(".main-area-wrapperInner").height(pageHeight - 149);
            $(".main-area-inner").height(pageHeight - 201);
            if ($(".right-section").css("right") == "3px") {
                if ($(".colapse-bar").css("right") == "-25px") {
                    $(".main-area").css("width", (mainWidth - 270));
                }
                else {
                    $(".main-area").css("width", (mainWidth));
                }
            }
            else if ($(".sidebar").css("left") == "0px") {
                if ($(".sidebarSide").css("left") == "0px") {
                    $(".main-area").css("width", (parseInt(userContainer) - parseInt(widthDecrease) - 34 + parseInt($(".sidebar").width())));
                }
                else {
                    $(".main-area").css("width", (parseInt(userContainer) - parseInt(widthDecrease) - 20));
                }
            }

            if ($scope.isDailyMode) {
                localStorage.gridViewportHeight = (pageHeight - (localStorage.FilterFlag == "1" ? heightOffsetDailyFilter : heightOffsetDaily));
            }
            else {
                localStorage.gridViewportHeight = (pageHeight - (localStorage.FilterFlag == "1" ? heightOffsetWeeklyFilter : heightOffsetWeekly));
            }

        });
        var createDate = function (dteStr) {
            // $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.createDate");
            if (dteStr != undefined) {
                var parts = dteStr.split("-");
                var day = parts[2].split(' ');
                return new Date(parts[0], parts[1] - 1, day[0]);
            }
            else return null;
        }
        var createDateTime = function (dateStr) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.createDateTime");
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

        $(".main-area").width(mainWidth);
        var pageHeight = $(window).height();
        $(".mytime-bar").height(pageHeight - 9);
        $(".mytime-bar-inner").height(pageHeight - 50);
        $(".user-container").height(pageHeight - 54);
        $(".user-container-inner").height(pageHeight - 90);
        $(".sidebar-inner").height(pageHeight - 136);
        $(".sidebarSide").height(pageHeight - 96);
        $(".colapse-bar").height(pageHeight - 96);
        $(".right-section").height(pageHeight - 96);
        $(".main-area").height(pageHeight - 94);
        $(".main-area-wrapper").height(pageHeight - 139);
        $(".main-area-wrapperInner").height(pageHeight - 149);
        $(".main-area-inner").height(pageHeight - 201);
        if ($scope.isDailyMode) {
            localStorage.gridViewportHeight = (pageHeight - heightOffsetDaily);
        }
        else {
            localStorage.gridViewportHeight = (pageHeight - heightOffsetWeeklyFilter);
        }

        var cordinates = { x: 0, y: 0 };
        $document.on('mousemove', function (event) {
            localStorage.pointy = event.pageY;
            localStorage.pointx = event.pageX;
            //$timeout(function () { xyPosition(); });
        });
        $scope.xyPosition = function (event) {
            var margin = 270;
            var leftMargin = 215;
            if ($(".sidebarSide").css("left") == "0px")
                leftMargin = 40;
            var leftToSet = parseInt(localStorage.pointx) - leftMargin;
            var marginFromRight = (window.innerWidth - leftToSet);
            if (marginFromRight < 600 && $('.right-section').is('[disabled=disabled]'))
                leftToSet = leftToSet - 325;
            else if (marginFromRight < 875 && !$('.right-section').is('[disabled=disabled]'))
                leftToSet = leftToSet - 325;

            $(".tooltiptext1").css("cssText", "left: " + leftToSet + "px !important;");
            if (localStorage.pointy > window.innerHeight - margin) {
                $(event.target.children[0]).removeClass('addMargin');
            }
            else {
                $(event.target.children[0]).addClass('addMargin');
            }
        }
        //$("#grid1").height(pageHeight - 201);
        $scope.lockImgurl = "img/submit_lock.png";
        $scope.deleteImgurl = "img/cross.jpg";
        $scope.monthlyTtlHrs = 0.00;
        $rootScope.isNonADLogin = false;
        $scope.refreshGridMain = false;
        $scope.isDraggingFlag = false;
        $scope.clearGrouping = false;
        $scope.getWeeklyDayDate = function (weeklySDate, numDay) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getWeeklyDayDate");
            var tempDate = new Date(weeklySDate.valueOf());
            tempDate.setDate(tempDate.getDate() + numDay);
            return $filter('date')(tempDate, 'd');
        }
        $scope.getWeeklyDateTooltip = function (weeklySDate, numDay) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getWeeklyDayDate");
            var tempDate = new Date(weeklySDate.valueOf());
            tempDate.setDate(tempDate.getDate() + numDay);
            return $filter('date')(tempDate, 'MMMM dd, yyyy');
        }

        $(".right-section").attr('disabled', 'disabled');
        $(".leftbarBtn").click(function () {
            $(".leftbarBtn").css("display", "block");
            if ($(".right-section").css("right") == "3px") {
                if ($(".sidebar").css("margin-left") == "23px") {
                    $(".sidebar").animate({
                        left: "-200px", marginLeft: "0"
                    });
                }
                else {
                    $(".sidebar").removeClass("slideSide");
                    $(".verticalBar").removeClass("slideSide");
                    $(".sidebar").animate({ left: "-200px" }, 300, function () {
                        $(".verticalBar").css("display", "block");
                        $(".sidebarSide").animate({ left: "0px" }, 100);
                    });

                    $(".main-area").animate({ marginLeft: "25px", width: mainWidth - 93 });
                    $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("overflow-y", "hidden");
                }

                $(".right-section").removeAttr('disabled');
            }
            else if ($(".right-section").css("right") == "-298px") {
                if ($(".sidebar").css("margin-left") == "23px") {
                    $(".sidebar").animate({
                        left: "-200px", marginLeft: "0"
                    });
                }
                else {
                    $(".sidebar").removeClass("slideSide");
                    $(".verticalBar").removeClass("slideSide");
                    $(".sidebar").animate({ left: "-200px" }, 300, function () {
                        $(".verticalBar").css("display", "block");
                        $(".sidebarSide").animate({ left: "0px" }, 100);
                    });

                    $(".main-area").animate({ marginLeft: "25px", width: mainWidth + 180 });
                    $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("overflow-y", "hidden");
                }
                $(".right-section").attr('disabled', 'disabled');
            }

            $timeout(function () { $scope.refreshUIGridMainOnPane(); $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("overflow-y", "scroll"); }, 500);
        });

        $(".openLeftBar").click(function () {
            $(".leftbarBtn").css("display", "block");
            if ($(".right-section").css("right") == "3px") {
                if ($(".sidebar").css("margin-left") == "23px") {

                    $(".sidebar").removeClass("slideSide");
                    $(".verticalBar").removeClass("slideSide");
                    $(".sidebarSide").css("left", "-22px");
                    $(".main-area").animate({ marginLeft: "205px", width: (mainWidth - 274) });
                    $(".sidebar").animate({ left: "3px", marginLeft: "0" });

                }
                else {

                    $(".sidebar").removeClass("slideSide");
                    $(".verticalBar").removeClass("slideSide");
                    $(".sidebar").animate({ left: "3px" });
                    $(".sidebarSide").css("left", "-22px");
                    $(".main-area").animate({
                        marginLeft: "205px", width: (mainWidth - 274)
                    });
                    $timeout(function () { $scope.refreshUIGridMainOnPane(); }, 500);
                }
                $(".right-section").removeAttr('disabled');
            }
            else if ($(".right-section").css("right") == "-298px") {
                if ($(".sidebar").css("margin-left") == "23px") {

                    $(".sidebar").removeClass("slideSide");
                    $(".verticalBar").removeClass("slideSide");
                    $(".sidebarSide").css("left", "-22px");
                    $(".main-area").animate({ marginLeft: "205px", width: mainWidth });
                    $(".sidebar").animate({ left: "3px", marginLeft: "0" });

                }
                else {
                    var userContainer = $(".user-container-inner").width();
                    var widthDecrease = parseInt($(".sidebar").width()) + parseInt($(".colapse-bar").width());
                    mainWidth = parseInt(userContainer) - parseInt(widthDecrease) - 17;
                    $(".sidebar").removeClass("slideSide");
                    $(".verticalBar").removeClass("slideSide");
                    $(".sidebar").animate({ left: "3px" });
                    $(".sidebarSide").css("left", "-22px");
                    $(".main-area").animate({ marginLeft: "205px", width: mainWidth });
                    $timeout(function () { $scope.refreshUIGridMainOnPane(); }, 500);
                }

                $(".right-section").attr('disabled', 'disabled');
            }


        });

        $(".verticalBar").click(function () {

            $(".leftbarBtn").css("display", "none");

            if ($(".sidebar").css("left") == "-200px") {
                $(".sidebar").addClass("slideSide");
                $(".verticalBar").addClass("slideSide");
                $(".sidebar").animate({ left: "0px", marginLeft: "23px" }, 300, function () {
                    $(".verticalBar.slideSide").hover(function () {
                        if ($(".sidebar").css("margin-left") == "23px") {
                            $(".sidebar").css("left", "0px");
                            $(".sidebar").css("margin-left", "23px");
                        }
                    });

                    $(".sidebar.slideSide").hover(function () {
                        if ($(".sidebar").css("margin-left") == "23px") {
                            $(".sidebar").css("left", "0px");
                            $(".sidebar").css("margin-left", "23px");
                        }
                    }, function () {
                        $(".sidebar.slideSide").animate({
                            left: "-200px", marginLeft: "0"
                        }, 300);
                        $(".sidebar").removeClass("slideSide");
                        $(".verticalBar").removeClass("slideSide");
                    }
    );
                });
            }

            else if ($(".sidebar").css("left") == "0px") {
                $(".sidebar").animate({
                    left: "-200px", marginLeft: "0"
                }, 300);

            }

        });

        $(".rightbarBtn").click(function () {
            $(".right-section").attr('disabled', 'disabled');
            $(".rightbarBtn").css("display", "block");
            if ($(".sidebar").css("left") == "3px") {

                if ($(".right-section").css("margin-right") == "25px") {
                    $(".right-section").animate({
                        right: "-298px", marginRight: "0"
                    });
                }
                else {
                    $(".right-section").removeClass("slideSideRight");
                    $(".verticalBarRight").removeClass("slideSideRight");
                    $(".main-area").animate({ width: mainWidth }, 300);
                    $(".right-section").animate({ right: "-298px" }, 300, function () {
                        // $(".verticalBarRight").css("display", "block");
                        $(".colapse-bar").animate({ right: "0px" }, 100);

                    });


                    $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("overflow-y", "hidden");
                }
            }

            else if ($(".sidebar").css("left") == "-200px") {

                if ($(".right-section").css("margin-right") == "25px") {
                    $(".right-section").animate({
                        right: "-298px", marginRight: "0"
                    });
                }
                else {
                    $(".right-section").removeClass("slideSideRight");
                    $(".verticalBarRight").removeClass("slideSideRight");
                    $(".main-area").animate({ width: mainWidth + 182 }, 300);
                    $(".right-section").animate({
                        right: "-298px"
                    }, 300, function () {
                        // $(".verticalBarRight").css("display", "block");
                        $(".colapse-bar").animate({
                            right: "0px"
                        }, 100);

                    });


                    $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("overflow-y", "hidden");
                }

            }

            $timeout(function () { $scope.refreshUIGridMainOnPane(); $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("overflow-y", "scroll"); }, 500);

            angular.element('.helpBtn').focus();

        });
        $(".open-close").click(function () {
            broadcastService.notifyrightClickbroadcast();
            $rootScope.showRightMenuFlag = false;
            $(".right-section").removeAttr('disabled');
            $(".rightbarBtn").css("display", "block");
            if ($(".sidebar").css("left") == "3px") {

                if ($(".right-section").css("margin-right") == "25px") {

                    $(".right-section").removeClass("slideSideRight");
                    $(".verticalBarRight").removeClass("slideSideRight");
                    // $(".verticalBarRight").css("right", "0px");
                    $(".colapse-bar").css("right", "-25px");
                    $(".main-area").animate({ width: (mainWidth - 274) });
                    $(".right-section").animate({
                        right: "3px", marginRight: "0"
                    });
                    $(".right-section").removeAttr('disabled');


                }
                else {

                    $(".right-section").removeClass("slideSideRight");
                    $(".verticalBarRight").removeClass("slideSideRight");
                    $(".right-section").animate({ right: "3px" });
                    $(".colapse-bar").css("right", "-25px");
                    $(".main-area").animate({
                        width: (mainWidth - 274)
                    });
                    $(".right-section").removeAttr('disabled');
                }
            }
            else if ($(".sidebar").css("left") == "-200px") {

                if ($(".right-section").css("margin-right") == "25px") {

                    $(".right-section").removeClass("slideSideRight");
                    $(".verticalBarRight").removeClass("slideSideRight");
                    $(".colapse-bar").css("right", "-25px");
                    $(".main-area").animate({ width: (mainWidth - 93) });
                    $(".right-section").animate({
                        right: "3px", marginRight: "0"
                    });
                    $(".right-section").removeAttr('disabled');

                }
                else {
                    var userContainer = $(".user-container-inner").width();
                    var widthDecrease = parseInt($(".sidebar").width()) + parseInt($(".colapse-bar").width());
                    mainWidth = parseInt(userContainer) - parseInt(widthDecrease) - 17;
                    $(".right-section").removeClass("slideSideRight");
                    $(".verticalBarRight").removeClass("slideSideRight");
                    $(".right-section").animate({ right: "3px" });
                    $(".colapse-bar").css("right", "-25px");
                    $(".main-area").animate({
                        width: (mainWidth - 93)
                    });
                    $(".right-section").removeAttr('disabled');
                }

            }
            $timeout(function () {
                $scope.refreshUIGridMainOnPane();
            }, 500);
            angular.element('.helpBtn').focus();

        });

        $(".verticalBarRight").click(function () {

            $(".right-section").removeAttr('disabled');

            $(".rightbarBtn").css("display", "none");

            if ($(".right-section").css("right") == "3px") {
                $(".right-section").animate({
                    right: "-298px", marginRight: "0"
                }, 300);
                //   $(".right-section").attr('disabled', 'disabled');
                angular.element('.helpBtn').focus();
            }


            else if ($(".right-section").css("right") == "-298px") {
                $(".right-section").addClass("slideSideRight");
                $(".verticalBarRight").addClass("slideSideRight");
                $(".right-section").animate({ right: "3px", marginRight: "25px" }, 300, function () {
                    $(".right-section").removeAttr('disabled');
                    $(".right-section.slideSideRight").hover(function () {
                        if ($(".right-section").css("margin-right") == "25px") {
                            $(".right-section").css("right", "3px");
                            $(".right-section").css("margin-right", "25px");
                            $(".right-section").removeAttr('disabled');
                            angular.element('.helpBtn').focus();
                        }
                    }, function () {
                        $(".right-section.slideSideRight").animate({
                            right: "-298px", marginRight: "0"
                        }, 300, function () {
                            $(".right-section").attr('disabled', 'disabled');
                            //$(".datepick-popup").hide();
                        });

                        $(".right-section").removeClass("slideSideRight");
                        $(".verticalBarRight").removeClass("slideSideRight");
                        angular.element('.helpBtn').focus();
                    }
);
                    $(".verticalBarRight.slideSideRight").hover(function () {
                        if ($(".right-section").css("margin-right") == "25px") {
                            $(".right-section").css("right", "3px");
                            $(".right-section").css("margin-right", "25px");
                            $(".right-section").removeAttr('disabled');
                        }
                        // $(".right-section").removeAttr('disabled');
                    });


                });
            }
            angular.element('.helpBtn').focus();
        });
        ///////////////////Start Revamp Main Calendar
        function convertMonthNameToNumber(monthName) {
            var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
            var monthDigit = myDate.getMonth();
            return isNaN(monthDigit) ? 0 : (monthDigit + 1);
        }
        var yearNo = parseInt(new Date("sessiontimeout").getFullYear() - 1);
        function GetYearValues() {
            for (i = 0; i <= 2; i++) {
                $(".sidebar .yearContainerinner #firstColYear").append("<li><a href='javascript:void(0)'>" + yearNo + "</a></li>");
                yearNo = yearNo + 1;
            }
        }
        GetYearValues();
        function GetCurrentSelectedDates(currentDate) {
            var revRange = commonUtilityService.getRevStartEndDateBySelDate($filter('date')(currentDate, "yyyy-MM-dd"));
            if (revRange != null) {
                var startDate = createDate(revRange.revStartDate);
                var endDate = createDate(revRange.revEndDate);
                currentMonth = parseInt(endDate.getMonth()) + 1;
                currentYear = endDate.getFullYear();
            }
            $('.sidebar .yearContainerinner').each(function () {
                $(this).find("li").each(function () {
                    if ($(this).text() == currentYear)
                        $(this).children().addClass("liActive")
                });
            });
            $('.sidebar .monthContainer').each(function () {
                $(this).find("li").each(function () {
                    if (convertMonthNameToNumber($(this).text()) == currentMonth)
                        $(this).children().addClass("liActive")
                });
            });
        }
        $timeout(function () {
            GetCurrentSelectedDates($scope.currentDate);
            $(".sidebar .calendar .btn.btn-default.btn-sm.btn-block.btnPopupCal").click(function () {
                $(".sidebar .calendarOver").animate({ top: "0px" }, 300);
                var yearNo = parseInt(new Date().getFullYear() - 1);
                $(".sidebar .monthContainer ul li a").removeClass("liActive");
                $(".sidebar .yearContainerinner ul li a").removeClass("liActive");
                GetCurrentSelectedDates($scope.currentDate);
            });
            $(".sidebar .calendar .cancelCalPopup").click(function () {
                $(".sidebar .calendarOver").animate({ top: "-212px" }, 300);
            });
            $(".sidebar .calendar .selectCalDate").click(function () {
                $(".sidebar .calendarOver").animate({ top: "-212px" }, 300);
            });
            $(".sidebar .monthContainer ul li a").click(function () {
                $(".sidebar .monthContainer ul li a").removeClass("liActive");
                $(this).addClass("liActive");
            });
            $(".sidebar .yearContainerinner ul li a").click(function () {
                $(".sidebar .yearContainerinner ul li a").removeClass("liActive");
                $(this).addClass("liActive");
            });

        });
        $(".sidebar .yearContainerinner ul li a").click(function () {
            $(".sidebar .yearContainerinner ul li a").removeClass("liActive");
            $(this).addClass("liActive");
        });
        function isValidDate(year, month, day) {
            var d = new Date(year, month, day);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        }
        $scope.selectCalDate = function () {
            var yearValue = $(".sidebar .yearContainerinner .liActive").text();
            var monthValue = $(".sidebar .monthContainer .liActive").text();
            var selectedDate = angular.copy($scope.currentDate);
            while (!(isValidDate(parseInt(yearValue.substring(0, 4)), (parseInt(convertMonthNameToNumber(monthValue)) - 1), selectedDate.getDate()))) {
                selectedDate.setDate(selectedDate.getDate() - 1);
            }
            selectedDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), selectedDate.getDate());
            var revRange = commonUtilityService.getRevStartEndDateBySelDate($filter('date')(selectedDate, "yyyy-MM-dd"));
            if (revRange != null) {
                if (parseInt(createDate(revRange.revEndDate).getMonth()) != (parseInt(convertMonthNameToNumber(monthValue)) - 1))
                    selectedDate.setDate(createDate(revRange.revStartDate).getDate() - 1);
                broadcastService.notifyYearUpCalendar(selectedDate);
                GetCurrentSelectedDates(selectedDate);
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
                        broadcastService.notifyYearUpCalendar(selectedDate);
                        GetCurrentSelectedDates(selectedDate);
                    }
                });

            }
            $(".sidebar .yearContainerinner ul li a").click(function () {
                $(".sidebar .yearContainerinner ul li a").removeClass("liActive");
                $(this).addClass("liActive");
            });
        }
        ///////////////////End Revamp Main Calendar
        var bindTabEvent = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.bindTabEvent");
            $(".favTab").click(function () {
                $(".favTabDesc").slideUp();
                $(".favTab").removeClass("upArrow");
                var tabName = $(this).attr("clsName");

                if ($("#" + tabName).css("display") == "none") {
                    $(this).addClass("upArrow");
                    $("#" + tabName).slideDown(function () {
                        if (tabName == "innerTab1") {
                            if ($scope.isCEPFavPaneOn == false || $scope.isCEPFavPaneOn == undefined)
                                $scope.$apply(function () {
                                    $scope.isCEPFavPaneOn = true;
                                });
                        }

                        if (tabName == "innerTab2") {
                            if ($scope.isActivityFavPaneOn == false || $scope.isActivityFavPaneOn == undefined)
                                $scope.$apply(function () {
                                    $scope.isActivityFavPaneOn = true;
                                });
                        }

                        if (tabName == "innerTab3") {
                            if ($scope.isDescFavPaneOn == false || $scope.isDescFavPaneOn == undefined)
                                $scope.$apply(function () {
                                    $scope.isDescFavPaneOn = true;
                                });
                        }

                    });
                }
                $timeout(function () {
                    $scope.refreshUIGridMainOnPane();
                }, 500);
            });
        }
        $(".desigName h4").click(function () {
            $(".desigName h4 span").toggleClass("openDrop");
        });

        $(".bottomPopup ul li span").click(function () {
            $(".main-area-bottom .bottomPopup ul li span").removeClass("prevActive");
            $(".main-area-bottom .bottomPopup ul li span.active").addClass('prevActive');
            $(".bottomPopup ul li span").removeClass("active");
            $(this).addClass("active");

        });
        var resetActClsToSelectedColView = function () {
            $(".bottomPopup ul li span").removeClass("active");
            $(".main-area-bottom .bottomPopup ul li span.prevActive").addClass("active");
        }

        var bindExpandEvent = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.bindExpandEvent");
            var liLenght = $(".sections li .expandableDiv");
            $(liLenght[0]).addClass("activecont");
            $("#acc1").css("display", "block");
            $(".sections li .expandableDiv").unbind("click");
            $(".sections li .expandableDiv").on("click", function (event) {

                var id = event.target.id;

                //if click on designate div in disable mode
                if ($scope.isDesigPanelDisabled && (id == "designateDiv" || id == "designatePlusBtn")) {
                    return false;
                }
                if ($scope.isDesigPanelDisabled && (id == "acc3Cont" || id == "prfBtn")) {
                    return false;
                }
                $(".sections li .expandableDiv").removeClass("activecont")
                $(".sections li .listingDesc").slideUp();
                var nameClass = $(this).attr("clsName");
                if ($("#" + nameClass).css("display") == "block") {
                    $(".sections li .listingDesc").slideUp();
                    $(".sections li .expandableDiv").removeClass("activecont")
                }
                    //expand
                else {
                    if (nameClass === "acc3")
                        $scope.$apply(function () {
                            $scope.isPrefGrid = true; $scope.isCstmLayoutGrid = true;
                        });
                    if (nameClass === "acc4") {
                        if ($scope.isCEPFavPaneOn === false || $scope.isCEPFavPaneOn === undefined) {
                            $scope.$apply($timeout(function () { $scope.isCEPFavPaneOn = true; }));
                            bindTabEvent();
                        }
                    }
                    if (nameClass === "acc6")
                        $scope.$apply(function () { $scope.isCstmLayoutGrid = true });
                    $("#" + nameClass).slideDown();
                    $(this).addClass("activecont")


                }

            });
        }
        bindExpandEvent();

        if ($rootScope.isCallBroadcastAtInterval != true) {
            $rootScope.callBroadcastAtInterval = $interval(callAtInterval, constantService.intrvlTmng);
            $rootScope.callMonthEndAtInterval = $interval(callMonthEndAtInterval, 1000 * 60 * 5);
            $rootScope.isCallBroadcastAtInterval = true;
        }
        $scope.is24HrsLeft = false;
        function datedifference(date1, date2) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.datedifference");

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
        var getPrefBeforeCuttOff = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getPrefBeforeCuttOff");
            $scope.state = $scope.gridApi.saveState.save();
            $scope.cuttOffColumnDef = true;
            $scope.cuttOffSaveState = true;
            var columnDefNumber = 1;
            if ($scope.gridOptions != undefined) {
                switch ($scope.gridOptions.columnDefs[0].headerCellClass) {
                    case "monthendClass1": columnDefNumber = 1;
                        break;
                    case "monthendClass2": columnDefNumber = 2;
                        break;
                    case "monthendClass3": columnDefNumber = 3;
                        break;
                    case "monthendClass4": columnDefNumber = 4;
                        break;
                    case "monthendClass5": columnDefNumber = 5;
                        break;
                    case "monthendClass6": columnDefNumber = 6;
                        break;
                    case "monthendClass7": columnDefNumber = 7;
                        break;
                    case "monthendClass8": columnDefNumber = 8;
                        break;
                }
            }
            $scope.cutoffColumnDefNumber = columnDefNumber;
            $scope.cutoffColumnDefNumberDay = $scope.optionDaily;
            $scope.cutoffColumnDefNumberWeek = $scope.optionWeekly;
        }

        var getMonthName = function (v) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getMonthName");
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
        $scope.isMonthEndCutOff = false;
        function callMonthEndAtInterval() {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.callMonthEndAtInterval");
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
                //tecuttoff = new Date("2016-10-20T11:46");
                var revstdate = createDateTime(countdownRevRangeDate.STRTDTE);
                var revenddate = createDateTime(countdownRevRangeDate.ENDDTE);
                var initialRevEndDate = createDateTime(jsonSFromloginDetail.REVM_REC.ENDDTE);
                var revmnthyeardata = getRevenueMonthAndYear(initialRevEndDate, 1);
                var currentdate = new Date();
                var todayDate = new Date();
                if (localStorage.getItem('CutOff_Occured') != "1")
                    $scope.monthEndCutOff = "";
                if (((revstdate.getFullYear() + '-' + revstdate.getMonth() + '-' + revstdate.getDate()) == (todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()))) {
                    $scope.isMonthEndCutOff = true;
                    $scope.is24HrsLeft = true;
                    $scope.monthEndCutOff = revmnthyeardata.monthname + " " + revmnthyeardata.year + $filter('translate')('msg_nwClosed');
                    //console.log("MESSAGE IS CLOSED 1");
                }
                else if ((tecuttoff.getTime() + 10000) > currentdate.getTime()) {
                    var dayhrsmin = [];
                    dayhrsmin = datedifference(tecuttoff, currentdate);
                    //console.log("ml seconds -- " +dayhrsmin.milliSec);
                    if (dayhrsmin.milliSec < 0) {
                        var revmnthyeardataCutOff = getRevenueMonthAndYear(initialRevEndDate, 0);
                        $interval.cancel($rootScope.callMonthEndAtInterval);
                        $rootScope.callMonthEndAtInterval = $interval(callMonthEndAtInterval, 1000 * 60);
                        //console.log('ME tecuttoff--' + tecuttoff + 'currentdate--' + currentdate + 'dayhrsmin.milliSec--' + dayhrsmin.milliSec + 'dayhrsmin.minutes--' + dayhrsmin.minutes + '$scope.monthendcheck--' + $scope.monthendcheck + 'revstdate--' + revstdate + 'revenddate--' + revenddate);
                        if ((tecuttoff.getFullYear() + '-' + tecuttoff.getMonth() + '-' + tecuttoff.getDate()) == (currentdate.getFullYear() + '-' + currentdate.getMonth() + '-' + currentdate.getDate())) {
                            $scope.isMonthEndCutOff = true;
                            $scope.is24HrsLeft = true;
                            ////////////set calendar to new revenue month
                            if (localStorage.getItem('CutOff_Occured') != "1")
                                $scope.monthEndCutOff = revmnthyeardataCutOff.monthname + " " + revmnthyeardataCutOff.year + $filter('translate')('msg_nwClosed');
                            //broadcastService.cutoffBroadcast(tecuttoff);
                            //console.log("MESSAGE IS CLOSED 2");
                            var tempTodayDate = new Date();
                            var currentTimezone = tempTodayDate.getTimezoneOffset();
                            tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));

                            var currdt = angular.copy($scope.currentDate);
                            currdt.setHours(0, 0, 0, 0);

                            if (currdt >= revstdate && currdt <= revenddate) {
                                if (!$scope.monthendcheck) {
                                    //$modalStack.dismissAll();
                                    loginService.retrieveInitialData($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID).then(function (response) {
                                        if (parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                                            localStorage.setItem('CutOff_Occured', "1");
                                            if ($rootScope.designateOfEmp !== undefined && $rootScope.designateOfEmp !== null && $rootScope.designateOfEmp.EMPLID !== "0" && $rootScope.designateOfEmp.EMPLID != $rootScope.designateOfEmp.loginEmpId) {
                                                $rootScope.designateOfEmp.initialDetail = JSON.parse(JSON.stringify(response.RETINIT_OUT_OBJ));
                                            }
                                            else {
                                                localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                                            }
                                            broadcastService.cutoffBroadcast(tecuttoff);
                                            //console.log('ME Initial_Data--' + JSON.stringify(response.RETINIT_OUT_OBJ));
                                            var cDate = new Date($scope.currentDate.valueOf());
                                            cDate = $filter('date')(new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate()), "yyyy-MM-dd");
                                            loadRevenueMonthsServices.loadRevenueMonths($scope.loginDetail.SESKEY, cDate, function (loadRevApiResp) {
                                                var revMnthRange = loadRevApiResp.LOADREVM_OUT_OBJ.REVM_ARR;
                                                localStorage.setItem('Revenue_Months', JSON.stringify(revMnthRange));
                                                getPrefBeforeCuttOff();
                                                $scope.init();
                                            });
                                        }
                                    });
                                    $scope.monthendcheck = true;
                                }
                            }
                        }
                        $interval.cancel($rootScope.callMonthEndAtInterval);
                        if (localStorage.getItem('CutOff_Occured') != "1")
                            $scope.monthEndCutOff = revmnthyeardataCutOff.monthname + " " + revmnthyeardataCutOff.year + $filter('translate')('msg_nwClosed');
                        //console.log("MESSAGE IS CLOSED 3");
                    }
                    else {
                        var revmnthyeardataCutOff = getRevenueMonthAndYear(initialRevEndDate, 0);
                        if (dayhrsmin.day < 5) {
                            $scope.isMonthEndCutOff = true;
                            if (dayhrsmin.day == 1)
                                $scope.monthEndCutOff = dayhrsmin.day + ' ' + $filter('translate')('msg_day');

                            if (dayhrsmin.day > 1)
                                $scope.monthEndCutOff = dayhrsmin.day + ' ' + $filter('translate')('msg_days');

                            if (dayhrsmin.hours == 1)
                                $scope.monthEndCutOff = $scope.monthEndCutOff + ' ' + dayhrsmin.hours + ' ' + $filter('translate')('lbl_HrMonthEnd') + ' '

                            if (dayhrsmin.hours > 1)
                                $scope.monthEndCutOff = $scope.monthEndCutOff + ' ' + dayhrsmin.hours + ' ' + $filter('translate')('lbl_HrsMonthEnd') + ' '

                            if (dayhrsmin.hours != 0 && dayhrsmin.minutes != 0)
                                $scope.monthEndCutOff = $scope.monthEndCutOff + $filter('translate')('lbl_and');

                            if (dayhrsmin.milliSec > 0)
                                $scope.monthEndCutOff = $scope.monthEndCutOff + ' ' + (dayhrsmin.minutes <= 0 ? 1 : dayhrsmin.minutes) + (dayhrsmin.minutes > 1 ? $filter('translate')('msg_minutes') : $filter('translate')('msg_minute')) + $filter('translate')('msg_leftCutOff') + revmnthyeardataCutOff.monthname + " " + revmnthyeardataCutOff.year;
                            else
                                $scope.monthEndCutOff = $scope.monthEndCutOff + ' ' + $filter('translate')('msg_leftCutOff') + revmnthyeardataCutOff.monthname + " " + revmnthyeardataCutOff.year;
                            if (dayhrsmin.day == 0 && dayhrsmin.hours < 24)
                                $scope.is24HrsLeft = true;

                            if (dayhrsmin.day == 0 && dayhrsmin.hours < 2) {
                                $interval.cancel($rootScope.callMonthEndAtInterval);
                                $rootScope.callMonthEndAtInterval = $interval(callMonthEndAtInterval, 1000 * 60 * 1);
                                if (dayhrsmin.milliSec < 60000) {
                                    //console.log('60--')
                                    $interval.cancel($rootScope.callMonthEndAtInterval);
                                    $rootScope.callMonthEndAtInterval = $interval(callMonthEndAtInterval, 1000 * 5);
                                }
                                else if (dayhrsmin.milliSec < 120000) {
                                    //console.log('120--')
                                    $interval.cancel($rootScope.callMonthEndAtInterval);
                                    $rootScope.callMonthEndAtInterval = $interval(callMonthEndAtInterval, 1000 * 10);
                                }
                            }
                        }
                    }
                }
                else if (tecuttoff.getTime() < currentdate.getTime()) {
                    $scope.isMonthEndCutOff = true;
                    $scope.is24HrsLeft = true;
                    $scope.monthEndCutOff = revmnthyeardata.monthname + " " + revmnthyeardata.year + $filter('translate')('msg_nwClosed');
                    // console.log("MESSAGE IS CLOSED 4");
                }
            }
        }
        function callAtInterval() {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.callAtInterval");
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            var langAPIString = constantService.ENGLISHLANGUAGEKEY;
            if (constantService.CURRENTLANGUAGE == constantService.FRENCHLANGUAGEKEY)
                langAPIString = constantService.FRENCHLANGUAGEKEYAPISTRING;
            broadcastMessageServices.getBroadcastMessage(loginDetail.SESKEY, langAPIString)
            .then(function (response) {
                if (parseInt(response.RETBROAD_OUT_OBJ.RETCD) == 0) {
                    if (response.RETBROAD_OUT_OBJ.MSG_ARR != undefined || response.RETBROAD_OUT_OBJ.MSG_ARR.length != 0) {
                        var broadcastarray = response.RETBROAD_OUT_OBJ.MSG_ARR;
                        if (broadcastarray.length > 0) {
                            for (var i = 0; i < broadcastarray.length; i++) {
                                var msgid = broadcastarray[i].MSGID;
                                var msg = broadcastarray[i].MSG;
                                var sendData = {
                                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')],
                                    isProjectTaskInvalid: true
                                };
                                var sendData = {
                                    message: msg,
                                    issubmit: false,
                                    isCancelBtnOn: true,
                                    messageid: msgid,
                                    popUpName: "ConfirmBroadcastMessagePopup"

                                };
                                $scope.openmodalctrl = 'ConfirmBroadcastMessageDesktop';
                                sharedService.openModalPopUp('Desktop/BroadcastMessage/templates/ConfirmBroadcastMessageDesktop.html', 'ConfirmBroadcastMessageDesktopCtrl', sendData);
                            }
                        } else {
                            if (typeof response.RETBROAD_OUT_OBJ.MSG_ARR == "object") {
                                if (response.RETBROAD_OUT_OBJ.MSG_ARR.MSG_OBJ.MSGID != 0) {
                                    var msgid = response.RETBROAD_OUT_OBJ.MSG_ARR.MSG_OBJ.MSGID;
                                    var msg = response.RETBROAD_OUT_OBJ.MSG_ARR.MSG_OBJ.MSG;
                                    var sendData = {
                                        message: msg,
                                        issubmit: false,
                                        isCancelBtnOn: true,
                                        messageid: msgid,
                                        popUpName: "ConfirmBroadcastMessagePopup"

                                    };
                                    $scope.openmodalctrl = 'ConfirmBroadcastMessageDesktop';
                                    sharedService.openModalPopUp('Desktop/BroadcastMessage/templates/ConfirmBroadcastMessageDesktop.html', 'ConfirmBroadcastMessageDesktopCtrl', sendData);
                                }
                            }
                        }
                    }

                }

            });

        }
        $scope.chartsRenderingFlag = false;
        $scope.filterFlag = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.filterFlag");
            var classTemp = $scope.isDailyMode ? "gridblankdataDaily" : "gridblankdata";

            if (localStorage.FilterFlag == "1")
                classTemp += " filterActive";
            return classTemp;
        }
        $scope.showCharts = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showCharts");
            $rootScope.currentDateForCharts = new Date($scope.currentDate.valueOf());
            $scope.chartsSectionVisible = true;
            $scope.chartsRenderingFlag = true;
            broadcastService.updateMonthlyChart();
        }
        var getWeekFirstDate = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getWeekFirstDate");
            var resDate = new Date($scope.currentDate.valueOf());
            resDate.setDate(resDate.getDate() + 1);
            resDate.setDate(resDate.getDate() - 7);


            for (var i = 0; i < 7; i++) {
                if (resDate.getDay() == 0)
                    break;
                resDate.setDate(resDate.getDate() + 1);

            }
            return resDate;
        }
        $scope.customNumberFilter = function (val) {
            if (val === undefined || val === null) return val;
            else
                return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        function getSummaryData(summarydata) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.getSummaryData");
            if (summarydata != undefined) {
                //DAILY 
                $scope.billableHrsDaily = parseFloat(summarydata.DBILLABLE);
                $scope.chargeableHrsDaily = parseFloat(summarydata.DCHARGEABLE);
                $scope.nonbillableHrsDaily = parseFloat(summarydata.DNONBILLABLE);

                //WEEKLY
                $scope.billableHrsWeekly = parseFloat(summarydata.WBILLABLE);
                $scope.chargeableHrsWeekly = parseFloat(summarydata.WCHARGEABLE);
                $scope.nonbillableHrsWeekly = parseFloat(summarydata.WNONBILLABLE);

                //MONTHLY                      
                $scope.billableHrsMonthly = parseFloat(summarydata.MBILLABLE);
                $scope.chargeableHrsMonthly = parseFloat(summarydata.MCHARGEABLE);
                $scope.nonbillableHrsMonthly = parseFloat(summarydata.MNONBILLABLE);
                //ICENTRY

                $scope.icDaily = parseFloat(summarydata.DTOTIC);
                $scope.icWeekly = parseFloat(summarydata.WTOTIC);
                $scope.icMonthly = parseFloat(summarydata.MTOTIC);

                $scope.totalDailyHrs = parseFloat(summarydata.DTOTTIME);
                $scope.totalWeeklyHrs = parseFloat(summarydata.WTOTTIME);
                $scope.totalMonthlyHrs = parseFloat(summarydata.MTOTTIME);

                $scope.billableHrsDaily = $scope.billableHrsDaily.toFixed(2);
                $scope.chargeableHrsDaily = $scope.chargeableHrsDaily.toFixed(2);
                $scope.nonbillableHrsDaily = $scope.nonbillableHrsDaily.toFixed(2);
                $scope.billableHrsWeekly = $scope.billableHrsWeekly.toFixed(2);
                $scope.chargeableHrsWeekly = $scope.chargeableHrsWeekly.toFixed(2);
                $scope.nonbillableHrsWeekly = $scope.nonbillableHrsWeekly.toFixed(2);
                $scope.billableHrsMonthly = $scope.billableHrsMonthly.toFixed(2);
                $scope.chargeableHrsMonthly = $scope.chargeableHrsMonthly.toFixed(2);
                $scope.nonbillableHrsMonthly = $scope.nonbillableHrsMonthly.toFixed(2);
                $scope.totalDailyHrs = $scope.totalDailyHrs.toFixed(2);
                $scope.totalWeeklyHrs = $scope.totalWeeklyHrs.toFixed(2);
                $scope.totalMonthlyHrs = $scope.totalMonthlyHrs.toFixed(2);
                //$scope.icDaily = $scope.icDaily.toFixed(2);
                //$scope.icWeekly = $scope.icWeekly.toFixed(2);
                //$scope.icMonthly = $scope.icMonthly.toFixed(2);
                $scope.ischartShow = true;
            }

        }
        $scope.showSummary = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showSummary");
            $scope.chartsSectionVisible = false;
            $scope.chartsRenderingFlag = false;
        }
        $scope.showSummary();
        $scope.isSubmitIC = false;
        $scope.isShowSubmitMenu = false;
        $scope.isShowSubCal = false;
        $scope.IsshowProjComponent = false;
        var selectedDates = []; previousSelectedDates = [];
        var showSubmitCalandar = function (scope) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.showSubmitCalandar");
            var maxDateRange = $rootScope.GetInitialDetail(false, true);
            var maxDate = createDate(maxDateRange.COMP_REC.MAXREVMDATE);
            var startDate = createDate(maxDateRange.REVM_REC.STRTDTE);
            $('.datepick-week').hide();
            //localisation
            var language = constantService.CURRENTLANGUAGE;
            if (constantService.CURRENTLANGUAGE == "en")
                language = "";
            $("#datepicker").datepicker("option",
                    $.datepick.setDefaults($.datepick.regionalOptions[language]));

            $('#inlineDatepicker').datepick({
                onSelect: scope.showDate,
                showOtherMonths: true,
                monthsToShow: 1, fixedWeeks: true, dateFormat: 'yyyy-mm-dd',
                //onDate: $.datepick.noWeekends,
                showTrigger: '#calImg', selectOtherMonths: true,
                renderer: $.datepick.weekOfYearRenderer,
                firstDay: 0, onShow: $.datepick.selectWeek,
                rangeSelect: false,
                multiSelect: 3,
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                //  changeMonth: false,
                minDate: startDate, maxDate: maxDate,
                prevText: '<i class="fa fa-caret-left"></i>', nextText: '<i class="fa fa-caret-right"></i>',
                dayNamesMin: [$filter('translate')('lbl_WkDy1'), $filter('translate')('lbl_WkDy2'), $filter('translate')('lbl_WkDy3'), $filter('translate')('lbl_WkDy4'), $filter('translate')('lbl_WkDy5'), $filter('translate')('lbl_WkDy6'), $filter('translate')('lbl_WkDy7')],
                showOnFocus: false,

            })
            /*bind event on previous/next nevigation*/
            //$("#inlineDatepicker").off("mouseup", "div div.datepick-nav", subCalNev);
            //$('#inlineDatepicker').on('mouseup', 'div div.datepick-nav', subCalNev);

        }
        //function subCalNev(event) {
        //    var ele = $(event.target);
        //    console.log(event.target);
        //    if (ele.hasClass("datepick-cmd-prev") || ele.hasClass("fa-caret-left")) {
        //        var yearMnthValue = $(".datepick #submitDtId .ng-binding").text().split(" ");
        //        var prevDate = new Date(yearMnthValue[1], (parseInt(convertMonthNameToNumberValues(yearMnthValue[0])) - 1), 1);
        //        var maxDateRange = $rootScope.GetInitialDetail(false, true);
        //        prevDate.setMonth(parseInt(prevDate.getMonth()) - 1);
        //        console.log('prevDate--' + prevDate);
        //        if ((prevDate < createDate(maxDateRange.REVM_REC.STRTDTE)) && (createDate(maxDateRange.REVM_REC.STRTDTE).getMonth() != prevDate.getMonth())) {
        //            showMessagePopUp([$filter('translate')('msg_CalendarDate')], $filter('translate')('lbl_Error'), false);
        //            return;
        //        }
        //    }
        //below code is commented as next click is handled in jquery.datepick.js in changeMonth function

        //else if (ele.hasClass("datepick-cmd-next") || ele.hasClass("fa-caret-right")) {
        //    var yearMnthValue = $(".datepick #submitDtId .ng-binding").text().split(" ");
        //    var nextDate = new Date(yearMnthValue[1], (parseInt(convertMonthNameToNumberValues(yearMnthValue[0])) - 1), 1);
        //    nextDate.setMonth(parseInt(nextDate.getMonth()) + 1);
        //    var yearVal = parseInt(nextDate.getFullYear());
        //    var yearNo = [];
        //    yearNo[0] = parseInt(new Date("sessiontimeout").getFullYear());
        //    yearNo[1] = parseInt(yearNo[0] - 1);
        //    yearNo[2] = parseInt(yearNo[0] + 1);
        //    if (yearVal != yearNo[0] && yearVal != yearNo[1] && yearVal != yearNo[2]) {
        //        showMessagePopUp([$filter('translate')('msg_CalendarYear')], $filter('translate')('lbl_Error'), false);
        //        return;
        //    }
        //}
        //}
        function convertMonthNameToNumberValues(monthName) {
            var myDate = new Date(retrieveSharedService.getMonthName(monthName) + " 1, 2000");
            var monthDigit = myDate.getMonth();
            return isNaN(monthDigit) ? 0 : (monthDigit + 1);
        }
        /////////////////Start Revamp Code for submit calendar 
        showSubmitRevampCalendar = function () {
            var yearMnthValue = $(".datepick #submitDtId .ng-binding").text().split(" ");
            $(".main-area .monthContainer ul li a").removeClass("liActive");
            $(".main-area .yearContainerinner ul li a").removeClass("liActive");
            $(".main-area .monthContainer ul li a").removeClass("liDisabled");
            $(".main-area .yearContainerinner ul li a").removeClass("liDisabled");
            GetSubmitCalRevenueYearMonthDetail(new Date(yearMnthValue[1], (parseInt(convertMonthNameToNumber(yearMnthValue[0])) - 1), 1));
            $scope.selectSubmitOkClick = false;
            $(".calendarOver.submitOver").animate({ top: "0px" }, 300, function () {

                $(".submitOver .cancelCalPopup").click(function () {

                    $(".calendarOver.submitOver").animate({ top: "-229px" }, 200);
                    $scope.$apply(function () {
                        $timeout(function () {
                            $scope.isShowSubmitMenu = true;
                            $scope.isShowSubCal = true;
                        });
                    });
                });

            });

            $(".calendarOver.submitOver").animate({
                top: "0px"
            }, 300, function () {

                $(".submitOver .selectCalDate").click(function () {

                    $(".calendarOver.submitOver").animate({
                        top: "-229px"
                    }, 200);
                    $scope.$apply(function () {
                        $timeout(function () {
                            $scope.isShowSubmitMenu = true;
                            $scope.isShowSubCal = true;
                        });
                    });
                });

            });
        }
        var currentDate = new Date("sessiontimeout");
        var yearSubmitNo = parseInt(currentDate.getFullYear() - parseInt(1));
        $(".main-area.calendarOver").click(function () {
            $scope.$apply(function () {
                $timeout(function () {
                    $scope.isShowSubmitMenu = true;
                    $scope.isShowSubCal = true;
                });
            });
        });
        function GetYearValuesSubmit() {
            for (i = 0; i <= 2; i++) {
                $(".main-area .yearContainerinner #submitYearFirst").append("<li><a href='javascript:void(0)'>" + yearSubmitNo + "</a></li>");
                yearSubmitNo = yearSubmitNo + 1;
            }


        }
        GetYearValuesSubmit();
        function GetCurrentSelectedDatesSubmit(currentMonth, currentYear) {
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
            $('.main-area .submitOver .yearContainerinner #submitYearFirst').each(function () {
                $(this).find("li").each(function () {
                    if ($(this).text() == currentYear)
                        $(this).children().addClass("liActive")

                    if (parseInt($(this).text()) < parseInt(currentYear) && localDate.getFullYear() > parseInt($(this).text()))
                        $(this).children().addClass("liDisabled")
                });
            });
            $('.main-area .submitOver .monthContainer ul').each(function () {
                $(this).find("li").each(function () {
                    if (convertMonthNameToNumber($(this).text()) == currentMonthValue)
                        $(this).children().addClass("liActive")
                    if (localDate.getFullYear() == currentYear && convertMonthNameToNumber($(this).text()) < (currentMonth))
                        $(this).children().addClass("liDisabled")
                    else if (convertMonthNameToNumber($(this).text()) < parseInt(currentMonth) && localDate.getFullYear() > parseInt(currentYear))
                        $(this).children().addClass("liDisabled")
                });
            });
        }
        function GetSubmitCalRevenueYearMonthDetail(dateVal) {
            var selObj = $rootScope.chekRevDateInLocalStorage(dateVal, $filter('translate')('msg_invalidSession'), false);
            if (selObj != null) {
                var enddt = createDate(selObj.ENDDTE);
                GetCurrentSelectedDatesSubmit(parseInt(enddt.getMonth()) + 1, enddt.getFullYear());
            }
            else {
                GetCurrentSelectedDatesSubmit(parseInt(dateVal.getMonth()) + 1, dateVal.getFullYear());
            }
        }
        $timeout(function () {
            $(".main-area .yearContainerinner ul li a").click(function () {
                if ($(this).hasClass("liDisabled"))
                    return;
                $(".main-area .yearContainerinner ul li a").removeClass("liActive");
                $(this).addClass("liActive");
                var inlineDate = $('#inlineDatepicker').datepick('getDate');
                if (inlineDate.length == 0) {
                    var yearValue = $(".main-area .yearContainerinner .liActive").text();
                    var monthValue = $(".main-area .monthContainer .liActive").text();
                    inlineDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), 1);
                }
                $(".main-area .monthContainer ul li a").removeClass("liDisabled");
                $(".main-area .monthContainer ul li a").removeClass("liActive");
                GetSubmitCalRevenueYearMonthDetail(inlineDate)

                $scope.$apply(function () {
                    $timeout(function () {
                        $scope.isShowSubmitMenu = true;
                        $scope.isShowSubCal = true;
                    });
                });
            });
            $(".main-area .monthContainer ul li a").click(function () {
                $(".main-area .monthContainer ul li a").removeClass("liActive");
                $(this).addClass("liActive");
                $scope.$apply(function () {
                    $timeout(function () {
                        $scope.isShowSubmitMenu = true;
                        $scope.isShowSubCal = true;
                    });
                });
            });

        });
        selectSubmitCalDate = function () {
            var yearValue = $(".main-area .yearContainerinner .liActive").text();
            var monthValue = $(".main-area .monthContainer .liActive").text();
            var inlineDate = $('#inlineDatepicker').datepick('getDate');
            inlineDate = new Date(yearValue.substring(0, 4), (parseInt(convertMonthNameToNumber(monthValue)) - 1), 1);
            $(".main-area .monthContainer ul li a").removeClass("liActive");
            $(".main-area .yearContainerinner ul li a").removeClass("liActive");
            $(".main-area .monthContainer ul li a").removeClass("liDisabled");
            $(".main-area .yearContainerinner ul li a").removeClass("liDisabled");

            GetSubmitCalRevenueYearMonthDetail(inlineDate)
            $scope.selectSubmitOkClick = true;
            $scope.$apply(function () {
                $('#inlineDatepicker').datepick('showMonth', yearValue, convertMonthNameToNumber(monthValue));
                $scope.selectSubmitOkClick = false;
            });

        }
        /////////////////End Revamp Code for submit calendar 
        $scope.editMenuConfig = { isDeletedOff: false, isEditOff: false, isCopyOff: false, isMultiple: false };
        $scope.mainDivClick = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.mainDivClick");
            resetDesignateDisplay();
        }



        var resetDesignateDisplay = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.resetDesignateDisplay");
            if ($scope.designateConfig.designateOfEmp != null && $scope.designateConfig.designateOfEmp.UIDISPNAME !== undefined) {
                $scope.designateConfig.displayName = $scope.designateConfig.designateOfEmp.UIDISPNAME.trim();
            } else {
                $scope.designateConfig.displayName = "";
            }
            $scope.designateConfig.showBecomeDesignate = false;
        }

        var getPopUpDesignateMsg = function (designateOf, logedUseDetail) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getPopUpDesignateMsg");
            var msgList = [];
            var msg = "";
            var sep = "";
            if (designateOf.initialDetail.EMPL_REC.STATUS === "INACTIVE") {
                msg = $filter('translate')('msg_InActiveDesignateSelected', {
                    DOT: designateOf.initialDetail.EMPL_REC.TERMDTE
                });
                msgList.push(msg);
                sep = "- ";
            }

            var name = logedUseDetail.EMPL_REC.FNAME + " " + logedUseDetail.EMPL_REC.LNAME;
            var desigName = designateOf.initialDetail.EMPL_REC.FNAME;
            if (designateOf.initialDetail.EMPL_REC.MINIT !== undefined && designateOf.initialDetail.EMPL_REC.MINIT !== null)
                desigName = desigName + " " + designateOf.initialDetail.EMPL_REC.MINIT;
            if (designateOf.initialDetail.EMPL_REC.LNAME !== undefined && designateOf.initialDetail.EMPL_REC.LNAME !== null)
                desigName = desigName + " " + designateOf.initialDetail.EMPL_REC.LNAME;
            msg = sep + $filter('translate')('msg_DesignateChange', {
                name1: name, name2: desigName
            });
            msgList.push(msg);

            if (msgList.length > 1) {
                msgList[0] = sep + msgList[0];
            }

            return msgList;
        }

        var updateDesignateListOnSelectCDAUser = function (empArr, logedInEmpId, displayName, loginUserAsDesignate, displayName) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateDesignateListOnSelectCDAUser");
            var list = empArr;
            var designate = null;
            $scope.allDesignateOfList = [];
            if (list != null) {
                if (Object.prototype.toString.call(list) != '[object Array]') {
                    var data = list.DESIG_OBJ;
                    list = [];
                    if (data != null)
                        list.push(data);
                }
                if (list.length > 0) {
                    list.forEach(function (item) {
                        item.UIDISPNAME = item.DISPNAME.trim();
                        item.LwrName = item.UIDISPNAME.toLowerCase();
                    });
                    $scope.allDesignateOfList = list;
                }
            }
            designate = {
                EMPLID: logedInEmpId, UIDISPNAME: ' ' + $filter('translate')('msg_Me') + ' - (' + $scope.loginDetail.loginUsrDisplayName + ')'
            }
            designate.LwrName = designate.UIDISPNAME.toLowerCase().trim();
            $scope.allDesignateOfList.push(designate);
            $scope.allDesignateOfList = $filter('orderBy')($scope.allDesignateOfList, ['UIDISPNAME']);
        }


        var updateDesignateList = function (designateOf, isLoginUsrOfficeCDA) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateDesignateList");
            var logedInEmpId = $scope.loginDetail.empLoggedInId;
            var loginUserAsDesignate = $scope.allDesignateOfList.filter(function (item) {
                return (item.EMPLID === logedInEmpId)
            });
            //13.7)	When a CDA becomes the Designate of another CDA, the CDA will be able to become the designate of employees 
            //which the other CDA can access.  The Designate list will not be merged. For the CDA to view their own designate list, 
            //they will have to “Become Me” and go back to designates to view their list 

            if (isLoginUsrOfficeCDA === true && typeof designateOf.initialDetail.EMPL_REC.HASCDA !== 'undefined' && designateOf.initialDetail.EMPL_REC.HASCDA === "Y") {
                designateService.loadBecomeDesignate($scope.loginDetail.SESKEY, designateOf.EMPLID).then(function (resp) {
                    if (parseInt(resp.LOADBECOMEDESIG_OUT_OBJ.RETCD) === 0) {
                        //alert('cda user');
                        updateDesignateListOnSelectCDAUser(resp.LOADBECOMEDESIG_OUT_OBJ.EMPL_ARR, logedInEmpId, $scope.loginDetail.loginUsrDisplayName, loginUserAsDesignate);
                    }
                });

            }
            else {
                var designate = null;
                //Add login user to designation dropdown list
                if (loginUserAsDesignate.length === 0) {
                    designate = {
                        EMPLID: logedInEmpId, UIDISPNAME: ' ' + $filter('translate')('msg_Me') + ' - (' + $scope.loginDetail.loginUsrDisplayName + ')'
                    };
                    designate.LwrName = designate.UIDISPNAME.toLowerCase().trim();
                    $scope.allDesignateOfList.push(designate);
                }
                    //login user is already added change the display name on select non CDA user
                else {
                    designate = loginUserAsDesignate[0];
                    designate.UIDISPNAME = ' ' + $filter('translate')('msg_Me') + ' - (' + $scope.loginDetail.loginUsrDisplayName + ')';
                    designate.LwrName = designate.UIDISPNAME.toLowerCase().trim();
                }



            }
        }
        var updateGlobalPrefForDesignate = function (layouts) {
            if (layouts === null || layouts === undefined) layouts = [];
            if (layouts.length > 0) {
                var globalPrefObj = JSON.parse(localStorage.getItem('globalPref'));
                for (var i = 0; i < layouts.length; i++) {
                    if (layouts[i].GMODE === appConstants.LAYOUTMODE.Daily) {
                        globalPrefObj[0].KEYVAL_ARR[4] = { DEF: "N", KEYVAL: "customlayout", KEYVALDESC: layouts[i].GNAME }
                    }
                    else if (layouts[i].GMODE === appConstants.LAYOUTMODE.Weekly) {
                        globalPrefObj[1].KEYVAL_ARR[2] = { DEF: "N", KEYVAL: "customlayout", KEYVALDESC: layouts[i].GNAME }
                    }
                }

                localStorage.setItem('globalPref', JSON.stringify(globalPrefObj));
            }


        }
        $scope.becomeDesignateOf = function (selectedItem) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.becomeDesignateOf");
            if (!$rootScope.columnBlank) {
                localStorage.removeItem("retrieveTimeEntriesDataSaved");
                localStorage.removeItem("savedTimeEntriesRevDates");
                localStorage.removeItem("RevMonthDetails");
                localStorage.removeItem("ImportData");
                localStorage.removeItem('nonADLogin');
                localStorage.removeItem('calENCKEY');
                if (localStorage.getItem('isMainGridLayoutChange') == "1") {
                    if ((!$rootScope.dailyCustomFlag && localStorage['isDailyMode'] == "true") || (!$rootScope.weeklyCustomFlag && localStorage['isDailyMode'] == "false"))
                        var sendData = {
                            msgList: [$filter('translate')('msg_cfrmMainGridSveLayOut')],
                            isCancelBtnOn: true,
                            okBtnText: $filter('translate')('btn_Yes'),
                            noBtnTxt: $filter('translate')('btn_No'),
                            popUpName: 'ConfrmSaveMainGrdLayout',
                            methodName: 'becomeDesignateOf'
                        };
                    else
                        var sendData = {
                            msgList: [$filter('translate')('msg_overrideMainGridSveLayOut')],
                            isCancelBtnOn: true,
                            okBtnText: $filter('translate')('btn_Yes'),
                            noBtnTxt: $filter('translate')('btn_No'),
                            popUpName: 'OverrideSaveMainGrdLayout',
                            methodName: 'becomeDesignateOf'
                        };
                    localStorage.setItem('designateObj', JSON.stringify(selectedItem));
                    sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
                }
                else {
                    $rootScope.enableSaveLayout = false;
                    $rootScope.countmove = 0;
                    $scope.monthendcheck = false;
                    $scope.is24HrsLeft = false;
                    var designateOf = JSON.parse(JSON.stringify(selectedItem));
                    var prevDesignate = $rootScope.designateOfEmp;
                    var isShowMsg = false;
                    var msgList = [];
                    loginService.retrieveInitialData($scope.loginDetail.SESKEY, designateOf.EMPLID).then(function (response) {
                        if (parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                            try {
                                localStorage.setItem('InitialRev_Month', JSON.stringify(response.RETINIT_OUT_OBJ));
                                updateGlobalPrefForDesignate(response.RETINIT_OUT_OBJ.LAYOUT_ARR);
                                weeklyCustomcolumnDefs = [];
                                dailyCustomcolumnDefs = [];
                                getSummaryData(response.RETINIT_OUT_OBJ.TIME_SUMM);
                                $rootScope.designateOfEmp = JSON.parse(JSON.stringify(designateOf));
                                $rootScope.designateOfEmp.initialDetail = JSON.parse(JSON.stringify(response.RETINIT_OUT_OBJ));
                                var cDate = new Date($scope.currentDate.valueOf());
                                cDate = $filter('date')(new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate()), "yyyy-MM-dd");
                                loadRevenueMonthsServices.loadRevenueMonths($scope.loginDetail.SESKEY, cDate, function (loadRevApiResp) {
                                    var revMnthRange = loadRevApiResp.LOADREVM_OUT_OBJ.REVM_ARR;
                                    localStorage.setItem('Revenue_Months', JSON.stringify(revMnthRange));
                                    if (designateOf.EMPLID === $scope.loginDetail.empLoggedInId) {
                                        localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                                        var logedInEmpId = $scope.loginDetail.empLoggedInId;
                                        $scope.designateConfig.designateOfEmp = designateOf;
                                        $scope.designateConfig.displayName = designateOf.UIDISPNAME.trim();
                                        $rootScope.designateOfEmp = designateOf;
                                        $rootScope.designateOfEmp.initialDetail = $scope.initialDetail.loginUsrInitialDetail;
                                        var loginUserAsDesignate = $scope.allDesignateOfList.filter(function (item) {
                                            return (item.EMPLID === logedInEmpId)
                                        });
                                        //load the designate of the login user
                                        $scope.allDesignateOfList = loginUserAllDesignate.slice(0);
                                        $scope.allDesignateOfList.push({
                                            LwrName : loginUserAsDesignate[0].UIDISPNAME.toLowerCase(),EMPLID: logedInEmpId, UIDISPNAME: loginUserAsDesignate[0].UIDISPNAME
                                        });
                                        $scope.allDesignateOfList = $filter('orderBy')($scope.allDesignateOfList, ['UIDISPNAME']);
                                        $scope.isDesigPanelDisabled = false;
                                        $('#designateLi > div').addClass('expandableDiv');
                                        $('#preferenceContDiv > div').addClass('expandableDiv');
                                    }
                                    else {
                                        var isLoginUsrOfficeCDA = ($scope.initialDetail.loginUsrInitialDetail.EMPL_REC.HASCDA === "Y") ? (true) : (false);
                                        $scope.designateConfig.designateOfEmp = designateOf;
                                        $scope.designateConfig.displayName = designateOf.UIDISPNAME;
                                        $rootScope.designateOfEmp = designateOf;
                                        $rootScope.designateOfEmp.initialDetail = response.RETINIT_OUT_OBJ;

                                        if (designateOf.EMPLID !== $scope.loginDetail.empLoggedInId) {
                                            var loogedUseDetail = $scope.initialDetail.loginUsrInitialDetail;
                                            msgList = getPopUpDesignateMsg(designateOf, loogedUseDetail);
                                            updateDesignateList($rootScope.designateOfEmp, isLoginUsrOfficeCDA);
                                        }
                                        $scope.allDesignateOfList = $filter('orderBy')($scope.allDesignateOfList, ['UIDISPNAME']);
                                        $scope.isDesigPanelDisabled = true;
                                        $('#designateLi > div').removeClass('expandableDiv');
                                        $('#designateLi > div').removeClass('activecont');
                                        $('#preferenceContDiv > div').removeClass('expandableDiv');
                                        $('#preferenceContDiv > div').removeClass('activecont');
                                        $(".sections li #acc2").slideUp();
                                        $(".sections li #acc3").slideUp();

                                        if (msgList.length > 0) {
                                            $timeout(function () {
                                                showMessagePopUp(msgList);
                                            }, 1000);
                                        }
                                    }
                                    // clearSessionStorage();
                                    // broadcastService.updateDataSource(constantService.BroadCastUpdate.updateAll);                                
                                    clearGraphOnDesignate();
                                    $scope.init();
                                    localStorage.setItem("DailyDataCopied", false);
                                    localStorage.setItem("WeeklyDataCopied", false);
                                });
                            } catch (ex) {
                                $rootScope.designateOfEmp = prevDesignate;
                            }
                        }
                        else {
                            //showMessagePopUp('unable to set designate');
                        }


                    });
                }
            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
        var clearGraphOnDesignate = function () {
            if ($("#mychartExcludeWeekend>div").length > 0)
                $("#mychartExcludeWeekend>div").remove();
            if ($("#mychartBarExcludeWeekend>div").length > 0)
                $("#mychartBarExcludeWeekend>div").remove();
            if ($("#mychart>div").length > 0)
                $("#mychart>div").remove();
            if ($("#mychart1>div").length > 0)
                $("#mychart1>div").remove();
        }
        $scope.checkDesignateInputFocus = function (event) {
            // $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.checkDesignateInputFocus");
            event.stopPropagation();
        }
        String.prototype.lTrim = function () {
            return this.replace(/^\s+/, "");
        }
        
        $scope.designateItemMouseOver = function (event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.designateItemMouseOver");
            $(".designatedropdown li").removeClass("selected");
            $(event.target).addClass("selected");
        }

        $scope.clearDesignateSrch = function (event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.clearDesignateSrch");
            $scope.designateConfig.displayName = "";
            $scope.designateConfig.showBecomeDesignate = false;
            $timeout(function () {
                angular.element('#designateSrchInput').focus();
            });
        }
       
        $scope.showEditTitle = function () {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showEditTitle");
            if ($scope.checkRevMonthFlag) {
                if (($scope.isDailyMode && $scope.isDailyFlag) || (!$scope.isDailyMode && $scope.isWeeklyFlag))
                    $scope.pasteMsg = $scope.pasteCopiedSlctdEntry;
                else if ($scope.isDailyMode && !$scope.isDailyFlag && $scope.WeeklyDataCopied)
                    $scope.pasteMsg = $scope.pasteDailyWeekly;
                else if (!$scope.isDailyMode && !$scope.isWeeklyFlag && $scope.DailyDataCopied)
                    $scope.pasteMsg = $scope.pasteWeeklyDaily;
                else
                    $scope.pasteMsg = $scope.noPaste;
            }
            else {
                $scope.pasteMsg = $scope.revClosed;
            }
        }

        $scope.showEditMenu = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showEditMenu");
            $scope.showEditTitle();

            $scope.showMenuOutsideGrid = false;
            $scope.isShowSubmitMenu = false;
            $rootScope.showRightMenuFlag = false;
            $scope.showNewFlag = false;

            $scope.copytoTodayCuttOff = false;
            $scope.afterTecuttOff = false;
            checkAfterCuttOff();

            $scope.showEditFlag = !$scope.showEditFlag;

            //$scope.$apply();
            menuFlag = $scope.showEditFlag;
            if ($scope.showEditFlag) {
                $scope.editMenuConfig.isCopyOff = $scope.editMenuConfig.isEditOff = $scope.editMenuConfig.isDeletedOff = false;
                var selectedItem = $scope.gridApi.selection.getSelectedRows();
                if (selectedItem.length > 0) {
                    var submittedEntry = selectedItem.filter(function (item) {
                        return item.TIMSUB.toUpperCase() == "N"
                    });
                    if (submittedEntry.length < 1) {
                        $scope.editMenuConfig.isDeletedOff = true;
                        $scope.dltdFalseTitle = $filter('translate')('lbl_entrySubmtd');
                    }


                }
                else {
                    $scope.editMenuConfig.isCopyOff = $scope.editMenuConfig.isDeletedOff = $scope.editMenuConfig.isEditOff = true;
                    $scope.dltdFalseTitle = $filter('translate')('lbl_noSelected');
                }
                if (selectedItem.length > 1) {
                    $scope.editMenuConfig.isEditOff = true;
                    $scope.editMenuConfig.isMultiple = true;
                    $scope.multiSelected = $filter('translate')('lbl_notMulEntries');
                }

            }

        }
        $scope.showNewMenu = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showNewMenu");
            $rootScope.showRightMenuFlag = false;
            $scope.showEditFlag = false;
            $scope.showMenuOutsideGrid = false;
            $scope.isShowSubmitMenu = false;
            $scope.showNewFlag = !$scope.showNewFlag;
            menuFlag = $scope.showNewFlag;
        }
        function createObject(propName, propValue) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.createObject");
            this[propName] = propValue;
        }
        $scope.editEntry = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.editEntry");
            if (!$rootScope.columnBlank) {
                $rootScope.showRightMenuFlag = false;
                $scope.showMenuOutsideGrid = false;
                $scope.isShowSubmitMenu = false;
                $scope.showEditFlag = false;
                var selectedItem = $scope.gridApi.selection.getSelectedRows();
                $rootScope.rowIndex = selectedItem[0];
                if (selectedItem.length == 1) {
                    $rootScope.showRightMenuFlag = false;
                    $scope.editTimeEntry(angular.copy(selectedItem[0]));
                }
                //    else {
                //        showMessagePopUp([$filter('translate')('lbl_notMulEntries')]);
                //}
            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
        var menuFlag = false;
        $scope.onMouseEnterToDteSubmit = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.onMouseEnterToDteSubmit");
            //alert($scope.checkRevMonthFlag);
            if (!$rootScope.columnBlank) {

                if ($scope.checkRevMonthFlag) {
                    $scope.isShowSubCal = true;
                    $timeout(function () { $(".datepick-dow-1").focus(); });
                    $(".entryItem .menu #startDateId").css("display", "none");
                    $(".entryItem .menu #endDateId").css("display", "none");
                }
                else {
                    $scope.isShowSubCal = false;
                    $(".entryItem .menu #startDateId").css("display", "block");
                    $(".entryItem .menu #endDateId").css("display", "block");
                }
            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
        $scope.toggleSummitMenu = function () {
            $rootScope.showRightMenuFlag = false;
            $scope.showEditFlag = false;
            $scope.showNewFlag = false;
            $scope.showMenuOutsideGrid = false;



            showSubmitCalandar($scope);
            $(".datepick-cmd-today").unbind("click");
            $('.datepick-cmd-today').on('click', function () {

                $scope.showDate(true);
            });
            $scope.isShowSubmitMenu = !$scope.isShowSubmitMenu;
            menuFlag = $scope.isShowSubmitMenu;
        }
        $scope.submitCalDivClick = function ($event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.submitCalDivClick");
            menuFlag = true;
        }
        $document.on('click', function (event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$document.on.click");
            if ($(event.target).attr("disabled") != "disabled") {
                if ($scope.isShowSubmitMenu || $scope.isShowSubCal || $scope.showEditFlag || $rootScope.showRightMenuFlag || $scope.showMenuOutsideGrid || $scope.showNewFlag) {
                    if (!menuFlag) {
                        $scope.$apply(function () {
                            closeAllDropDown();
                            $rootScope.showRightMenuFlag = $scope.showMenuOutsideGrid;
                        });
                    }
                    menuFlag = false;
                }
                $(".searchCep.ng-scope").css("display", "none");
            }
        });
        $scope.$on("rightClickbroadcast", function () {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope..$on.rightClickbroadcast");
            if (angular.isDefined($scope.gridApi)) {
                var selectedItem = $scope.gridApi.selection.getSelectedRows();

                if (selectedItem.length > 1) {
                    $scope.editMenuConfig.isMultiple = true;
                    $scope.multiSelected = $filter('translate')('lbl_notMulEntries');
                }
                else
                    $scope.editMenuConfig.isMultiple = false;

                $scope.showEditTitle();
                $scope.showEditFlag = false;
                $scope.showMenuOutsideGrid = false;
                $scope.isShowSubmitMenu = false;
                $scope.showNewFlag = false;
                checkAfterCuttOff();
            }
        });
        var closeAllDropDown = function () {
            $scope.isShowSubmitMenu = $scope.isShowSubCal = $scope.showEditFlag = $scope.showNewFlag = false;
        }
        $scope.showDate = function (isToday) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showDate");
            var dates = [];
            if ($scope.selectSubmitOkClick)
                return;
            if (isToday == true) {
                var tempTodayDate = new Date();
                var currentTimezone = tempTodayDate.getTimezoneOffset();
                tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
                dates[0] = tempTodayDate;
            }
            else {
                dates = $('#inlineDatepicker').datepick('getDate');
                $('#inlineDatepicker').datepick('setDate', [])
            }
            $scope.isShowSubmitMenu = false;
            $scope.submitTimeEntries(dates[0]);

        }
        $scope.expandEntry = function (teClass, flag) {
            if ($rootScope.cntrExpandCollapse == 2)
                $rootScope.cntrExpandCollapse = 1;
            if ($("." + teClass).css("display") == "none" || flag == "N") {
                $("." + teClass).css("display", "block");
                $(".weekly-details.task-container." + teClass.replace("exp", "")).css("padding-bottom", "28px");
            }
            else {
                $("." + teClass).css("display", "none");
                $(".weekly-details.task-container." + teClass.replace("exp", "")).css("padding-bottom", "11px");
            }
        }

        $scope.expandEntryWeekBlock = function (dis, teClass) {
            if (dis == "block")
                $("#week" + teClass).css("padding-bottom", "28px");
            else
                $("#week" + teClass).css("padding-bottom", "11px");
            return dis;
        }
        if ($rootScope.cntrExpandCollapse == null || $rootScope.cntrExpandCollapse == undefined)
            $rootScope.cntrExpandCollapse = 0;
        $scope.expandEntryToggle = function (teClass) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.expandEntryToggle");
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
                    if ($rootScope.expandedEntries.indexOf(teClass) == -1 && $rootScope.cntrExpandCollapse != 2) {
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
        $scope.prjScopeNoValidMsg = $filter('translate')('msg_PrjScopNotValid');
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
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.usrPreference");
            this.viewPref = {
                isDailymode: true, isFetch: false, detail: null
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
        $(".cal-icon").click(function () {
        });
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



        $scope.refreshUIGridMainOnPane = function () {
            $(".grid.ui-grid .ui-grid-render-container-body .ui-grid-viewport").css("width", "auto");
            $scope.gridApi.core.handleWindowResize();
            //$(".ui-grid-viewport").css("width", "auto");
            //$(".ui-grid-header-viewport").css("width", "auto");
            //$scope.gridApi.core.handleWindowResize();
        }
        $scope.checkRevMonthFlag = true;
        $scope.loadCalender = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadCalender");
            $rootScope.lastCurrentDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');
            //$scope.closedmonth = '';
            $scope.open('templates/Calendar.html', 'calController');
        }
        var getWeekStartDate = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getWeekStartDate");

            var cdate = new Date();
            var selObj = null;
            var selObj = $rootScope.chekRevDateInLocalStorage(cdate, $filter('translate')('msg_invalidSession'), true);//chekRevDateInLocalStorage(cdate);
            var revStartDate = createDate(selObj.STRTDTE);
            var dateToCompare = $scope.weeklyStartDate;
            if (dateToCompare.setHours(0, 0, 0, 0) < revStartDate.setHours(0, 0, 0, 0)) {
                var currentTimezone = revStartDate.getTimezoneOffset();
                revStartDate.setMinutes(revStartDate.getMinutes() - (currentTimezone));
                return revStartDate;
            }
            return $scope.weeklyStartDate;

        }

        $scope.loadImportCalEntriesRev = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadImportCalEntriesRev");
            $rootScope.showRightMenuFlag = false;
            var initialDetail = $rootScope.GetInitialDetail(false, true);
            var termCompareDte = $scope.currentDate;
            if (!$scope.isDailyMode) {
                termCompareDte = getWeekStartDate();
            }
            if (!empSharedService.checkTerminationDate(initialDetail.EMPL_REC.TERMDTE, termCompareDte)) {
                var msg = $filter('translate')('msg_InActiveDesignateSelected', {
                    DOT: initialDetail.EMPL_REC.TERMDTE
                });
                showMessagePopUp([msg]);
                return false;
            }
            if (!$rootScope.columnBlank) {
                $rootScope.importViewed = false;
                var cDate = new Date($scope.currentDate.valueOf());
                cDate = $filter('date')(cDate, "yyyy-MM-dd");
                var revMnthRange = JSON.parse(localStorage.getItem('Revenue_Months'));
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

            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
        $scope.loadImportCalEntries = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadImportCalEntries");
            if (timePriorToBillingStartDate()) {
                var nonADFlagObject = JSON.parse(localStorage.getItem('Login_Detail'));
                var weekStartDate = null;
                if (!$scope.isDailyMode)
                    weekStartDate = getWeekStartDate();
                if (nonADFlagObject.ISNONAD == "Y" && localStorage.getItem('nonADLogin') == null) {
                    var sendData = {
                        domain: "mercer",
                        currentDate: $scope.currentDate,
                        isDailyMode: $scope.isDailyMode,
                        weekCurrentDate: weekStartDate,
                        weekStartDate: $scope.weeklyStartDate,
                        lastExpandAllText: $scope.expandAllText,
                        lastExpandClass: $scope.expandClass,
                        weekData: $scope.itemsDataTotal,
                        totalHrs: $scope.ttlHrs,
                    };
                    $scope.openModalCtrl = 'importCalDesktopLoginCtrl';
                    sharedService.openModalPopUp('Desktop/CalendarImport/templates/ImportCalDesktopLogin.html', 'importCalDesktopLoginCtrl', sendData);
                }
                else {
                    var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
                    var encKeyNew;
                    if (localStorage.getItem("encKeyNew") == null)
                        encKeyNew = jsonSFromloginDetail.ENCKEY;
                    else
                        encKeyNew = localStorage.getItem("encKeyNew");
                    var domain = constantService.DOMAINNAME;
                    var jsonSFromInitialDetail = $rootScope.GetInitialDetail(false, true);
                    var tempDateVal = $scope.currentDate;
                    tempDateVal.setHours(0, 0, 0, 0);
                    var dateVal = new Date(tempDateVal.valueOf());
                    var startDate = $filter('date')(dateVal, 'yyyy-MM-dd HH:mm:ss');
                    if (localStorage.getItem("ImportData") == null) {
                        importCalService.getCalImportEntries(jsonSFromloginDetail.SESKEY, encKeyNew, domain, startDate, startDate, jsonSFromInitialDetail.EMPL_REC.EMAIL, jsonSFromInitialDetail.EMPL_REC.EMAIL)
                            .then(function (response) {
                                $scope.loadImportCalEntriesTemp(response);
                                localStorage.setItem("ImportData", JSON.stringify(response));

                            });
                    }
                    else
                        $scope.loadImportCalEntriesTemp(JSON.parse(localStorage.getItem("ImportData")));
                }
            }
        }

        $scope.loadImportCalEntriesTemp = function (response) {
            var errMsg = "";
            var nonADFlagObject = JSON.parse(localStorage.getItem('Login_Detail'));
            if (parseInt(response.RETCALENT_OUT_OBJ.RETCD) == 2 && response.RETCALENT_OUT_OBJ.ERRMSG.trim() != "") {
                errMsg = response.RETCALENT_OUT_OBJ.ERRMSG;
                var sendData = {
                    errorList: [errMsg]
                };
                $scope.openModalCtrl = 'importExchangeErrorCtrl';
                sharedService.openModalPopUp('Desktop/CalendarImport/templates/ImportExchangeError.html', 'importExchangeErrorCtrl', sendData);

            }
            else {

                var weekStartDate = null;
                if (!$scope.isDailyMode)
                    weekStartDate = getWeekStartDate();
                var cDate = new Date($scope.currentDate.valueOf());
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
                    $scope.revStartDate = revRangeDate[0].STRTDTE;
                    $scope.revEndDate = revRangeDate[0].ENDDTE;
                }
                var sendData = {
                    currentDate: $scope.currentDate,
                    isDailyMode: $scope.isDailyMode,
                    weekCurrentDate: weekStartDate,
                    weekStartDate: $scope.weeklyStartDate,
                    flag: nonADFlagObject.ISNONAD == "Y" ? "Y" : "N",
                    encKey: null,
                    revStartDate: $scope.revStartDate,
                    revEndDate: $scope.revEndDate,
                    lastExpandAllText: $scope.expandAllText,
                    lastExpandClass: $scope.expandClass,
                    weekData: $scope.itemsDataTotal,
                    totalHrs: $scope.ttlHrs,
                    popUpName: "importCalPopUp"
                };
                $scope.openModalCtrl = 'importCalDesktopCtrl';

                sharedService.openModalPopUp('Desktop/CalendarImport/templates/ImportCalDesktopEntries.html', 'importCalDesktopCtrl', sendData);
            }
        }


        var enableDisableSubmitBtn = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.enableDisableSubmitBtn");
            var selObj = null;
            var selDate = $scope.currentDate;
            selDate = createDate($filter('date')(selDate, "yyyy-MM-dd"));
            var cDate = new Date();
            var reveueDates = {
                sDte: null, eDte: null
            };
            cDate.setHours(0, 0, 0, 0);
            cDate = $filter('date')(new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate()), "yyyy-MM-dd");
            var updDate = new Date(cDate);
            updDate = new Date(updDate.getTime() + (updDate.getTimezoneOffset() * 60 * 1000));
            selObj = $rootScope.chekRevDateInLocalStorage(updDate, $filter('translate')('msg_invalidSession'), false);;//chekRevDateInLocalStorage(updDate);
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
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.loadHomePage");
            if (isLoad)
                $state.go('MainDesktop', {
                    "loadDate": $rootScope.$stateParams.startDate,
                    "isDailyMode": $rootScope.$stateParams.isDailyMode,
                    "currentDate": $rootScope.$stateParams.currentDate
                });
        }

        $scope.open = function (template, controller, sendData) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.open");
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
                $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.modalInstance.result");
                isPasteOnProgress = false;
                switch ($scope.openModalCtrl) {
                    case 'submitConfirm':
                        var isSubmitIc = $scope.isSubmitIC
                        callApiToSubmitEntries(sendData.sesKey, sendData.empId, sendData.selDte, isSubmitIc);
                        break;
                    case 'submitAPIConfirm':
                        callApiToSubmitEntries(sendData.sesKey, sendData.empId, sendData.selDte, true);
                        break;
                    case 'pasteAdvanced':
                        $scope.pasteMultiple(selectedItem);
                        break;
                }

            }, function () {
                $(".overlay").css("display", "none");
                $(".bottom-footer ul li a").removeClass("btn-grd2");
                $scope.openModalCtrl = '';
            })
        };

        $scope.toggleAnimation = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.toggleAnimation");
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

        $scope.checkRevMonthTime = function (dateval) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.checkRevMonthTime");
            var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, false);
            if (jsonSFromloginDetail == undefined || jsonSFromloginDetail == null) return;
            var revStrDteAr = jsonSFromloginDetail.REVM_REC.STRTDTE.split("-");
            var revEndDteAr = jsonSFromloginDetail.REVM_REC.ENDDTE.valueOf().split("-");

            //revenue start and end date
            var revSDte = null;
            if (revStrDteAr != undefined && revEndDteAr != undefined) {
                revSDte = new Date(revStrDteAr[0], revStrDteAr[1] - 1, revStrDteAr[2].split(" ")[0]);
                var revEDte = new Date(revEndDteAr[0], revEndDteAr[1] - 1, revEndDteAr[2].split(" ")[0]);
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
        $scope.icChrge = 0.00;
        // $scope.loginDetail = '';
        $scope.initialDetail = '';
        $scope.domainURL = "";
        $scope.stateProv = [];

        var getUsrPrefObjFrmArray = function (arr, keys) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getUsrPrefObjFrmArray");
            var result = [];
            for (var i = 0; i < keys.length; i++) {
                var obj = $.grep(arr, function (e) {
                    return e.KEY == keys[i];
                });
                result.push(obj);
            }
            return result;
        }

        var setLocale = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.setLocale");
            if (constantService.CURRENTLANGUAGE == constantService.FRENCHLANGUAGEKEY) {
                angular.copy(locales['fr'], $locale);
            }
            else {
                angular.copy(locales['en'], $locale);
            }
        }

        $scope.getFavActivities = function (loginDetail) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getFavActivities");
            activityService.retrieveActivityFavorites(loginDetail.SESKEY, loginDetail.EMPLID)
                 .then(function (response) {
                     if (response.RETACTIFAV_OUT_OBJ.RETCD == 0) {
                         if (Object.prototype.toString.call(response.RETACTIFAV_OUT_OBJ.ACTI_ARR) != '[object Array]') {
                             var data = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                             response.RETACTIFAV_OUT_OBJ.ACTI_ARR = [];
                             if (data != null && data.ACTI_OBJ != null && data.ACTI_OBJ != undefined)
                                 response.RETACTIFAV_OUT_OBJ.ACTI_ARR.push(data.ACTI_OBJ);
                         }

                         var items = response.RETACTIFAV_OUT_OBJ.ACTI_ARR;
                         $scope.ActivityFavList = [];
                         if (items != null) {
                             for (var i = 0; i < items.length; i++) {
                                 if (items[i].STAT == 'Y') {
                                     items[i].fav = true;
                                     $scope.ActivityFavList.push(items[i]);
                                 }
                             }
                         }
                         sessionStorage.setItem('FavActivityArray', JSON.stringify($scope.ActivityFavList));
                     }
                 });

        }
        $scope.getFavDescription = function (loginDetail) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getFavDescription");
            cepService.retrieveDescriptionFavorites(loginDetail.SESKEY, loginDetail.EMPLID)
                    .then(function (response) {
                        if (response.RETDESCFAV_OUT_OBJ.RETCD == 0) {
                            if (Object.prototype.toString.call(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR) != '[object Array]') {
                                var data = response.RETDESCFAV_OUT_OBJ.DESTXT_ARR;
                                response.RETDESCFAV_OUT_OBJ.DESTXT_ARR = [];
                                if (data != null && data.VARCHAR2 != undefined)
                                    response.RETDESCFAV_OUT_OBJ.DESTXT_ARR.push(data.VARCHAR2);
                            }
                            sessionStorage.setItem('DescFav', JSON.stringify(response.RETDESCFAV_OUT_OBJ.DESTXT_ARR));
                        }
                    });

        }
        /*update for performance improvement : calling loadRevenueMonths API after check*/
        $scope.currentDate = new Date();
        var updateCalDateToCurrentDate = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateCalDateToCurrentDate");
            var tempTodayDate = new Date();
            var currentTimezone = tempTodayDate.getTimezoneOffset();
            tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
            $scope.currentDate = tempTodayDate;
            localStorage.SelectedCalendardate = angular.copy($scope.currentDate);
            broadcastService.notifyDateTimeSlider($scope.currentDate);
            //broadcastService.notifyRefreshCalendar();
        }

        var preferenceObj = function (key) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.preferenceObj");
            this.key = key;
        }
        var empCurrentPreference = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.empCurrentPreference");
            this.viewMode = new preferenceObj('INITIAL_TAB');
            this.langMode = new preferenceObj('LANG');
            this.columnViewDaily = new preferenceObj('COLUMN_VIEW_DAILY');
            this.columnViewWeekly = new preferenceObj('COLUMN_VIEW_WEEKLY');
            this.policyEmail = new preferenceObj('POLICY_EMAIL_PREFERENCE');
            this.feeAdjEmail = new preferenceObj('FEE_ADJ_EMAIL_PREFERENCE');
        }

        var getSelectedMode = function (keyVal, initialDetailPref, options) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getSelectedMode");
            var selected = null;

            var obj = [];
            if (initialDetailPref !== null) {
                obj = initialDetailPref.filter(function (item) {
                    return item.KEY === keyVal
                });
            }
            //set from initial detail
            if (obj.length > 0) {
                var arr = options.filter(function (item) {
                    return item.KEYVAL == obj[0].VAL
                });

                selected = {
                    key: obj[0].KEY
                };
                if (arr[0] != undefined) {
                    selected.val = arr[0].KEYVALDESC;
                    selected.keyVal = arr[0].KEYVAL;
                }
            }
                //set from global preference
            else {
                obj = options.filter(function (item) {
                    return item.DEF == "Y"
                });
                if (obj.length > 0)
                    selected = {
                        key: keyVal, val: (obj[0].KEYVALDESC), keyVal: obj[0].KEYVAL
                    };
            }

            return selected;
        }
        $scope.empCurrentPrefeObj = null;
        $scope.prefereceList = [];
        var updateOptionForColumnView = function (options, selected, isDailyPref) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateOptionForColumnView");
            for (var i = 0; i < options.length; i++) {
                if (options[i].KEYVAL == "time") {
                    options[i].order = 1;
                }
                else if (options[i].KEYVAL == "timeIncl") {
                    options[i].order = 2;
                }
                else if (options[i].KEYVAL == "ic") {
                    options[i].order = 3;
                }
                else if (options[i].KEYVAL == "icIncl") {
                    options[i].order = 4;
                }
                else if (options[i].KEYVAL == "customlayout") {
                    options[i].order = 5;
                }
                if (options[i].KEYVAL === selected) {
                    if (isDailyPref)
                        $scope.optionDaily = options[i].order;
                    else
                        $scope.optionWeekly = options[i].order;
                }

            }
        }
        var setPreferenceSettings = function (initialDetailPref, globalPref) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.setPreferenceSettings");
            $scope.prefereceList = [];
            $scope.empCurrentPrefeObj = new empCurrentPreference();
            var allKeys = globalPref.map(function (a) {
                return a.KEY;
            });
            //["COLUMN_VIEW", "FEE_ADJ_EMAIL_PREFERENCE", "LANG", "POLICY_EMAIL_PREFERENCE", "INITIAL_TAB", "INITIAL_DETAIL"]
            for (i = 0; i < allKeys.length; i++) {
                switch (allKeys[i]) {
                    //Set Daily-Weekly mode              
                    case $scope.empCurrentPrefeObj.columnViewDaily.key:
                        var prefObj = new preferenceObj(allKeys[i]);
                        prefObj.name = globalPref[i].KEYDESC;
                        prefObj.displayOrder = 0;
                        prefObj.options = globalPref[i].KEYVAL_ARR;
                        prefObj.selected = getSelectedMode(allKeys[i], initialDetailPref, globalPref[i].KEYVAL_ARR);
                        prefObj.value = prefObj.selected.val;
                        prefObj.keyVal = prefObj.selected.keyVal;
                        updateOptionForColumnView(prefObj.options, prefObj.keyVal, true);
                        $scope.prefereceList.push(prefObj);
                        break;
                    case $scope.empCurrentPrefeObj.columnViewWeekly.key:
                        var prefObj = new preferenceObj(allKeys[i]);
                        prefObj.name = globalPref[i].KEYDESC;
                        prefObj.displayOrder = 1;
                        prefObj.options = globalPref[i].KEYVAL_ARR;
                        prefObj.selected = getSelectedMode(allKeys[i], initialDetailPref, globalPref[i].KEYVAL_ARR);
                        prefObj.value = prefObj.selected.val;
                        prefObj.keyVal = prefObj.selected.keyVal;
                        updateOptionForColumnView(prefObj.options, prefObj.keyVal, false);
                        $scope.prefereceList.push(prefObj);
                        break;
                    case $scope.empCurrentPrefeObj.feeAdjEmail.key:
                        var prefObj = new preferenceObj(allKeys[i]);
                        prefObj.name = globalPref[i].KEYDESC;
                        prefObj.displayOrder = 2;
                        prefObj.options = globalPref[i].KEYVAL_ARR;
                        prefObj.selected = getSelectedMode(allKeys[i], initialDetailPref, globalPref[i].KEYVAL_ARR);
                        prefObj.value = prefObj.selected.val;
                        prefObj.keyVal = prefObj.selected.keyVal;
                        $scope.prefereceList.push(prefObj);
                        break;
                    case $scope.empCurrentPrefeObj.langMode.key:
                        var prefObj = new preferenceObj(allKeys[i]);
                        prefObj.name = globalPref[i].KEYDESC;
                        prefObj.displayOrder = 3;
                        prefObj.options = globalPref[i].KEYVAL_ARR;
                        prefObj.selected = getSelectedMode(allKeys[i], initialDetailPref, globalPref[i].KEYVAL_ARR);
                        prefObj.value = prefObj.selected.val;
                        prefObj.keyVal = prefObj.selected.keyVal;
                        $scope.prefereceList.push(prefObj);
                        prefObj.currentLanguage = prefObj.keyVal;
                        var languageKey = prefObj.keyVal;
                        break;
                    case $scope.empCurrentPrefeObj.policyEmail.key:
                        var prefObj = new preferenceObj(allKeys[i]);
                        prefObj.name = globalPref[i].KEYDESC;
                        prefObj.displayOrder = 4;
                        prefObj.options = globalPref[i].KEYVAL_ARR;
                        prefObj.selected = getSelectedMode(allKeys[i], initialDetailPref, globalPref[i].KEYVAL_ARR);
                        prefObj.value = prefObj.selected.val;
                        prefObj.keyVal = prefObj.selected.keyVal;
                        $scope.prefereceList.push(prefObj);
                        break;
                    case $scope.empCurrentPrefeObj.viewMode.key:
                        var prefObj = new preferenceObj(allKeys[i]);
                        prefObj.name = globalPref[i].KEYDESC;
                        prefObj.displayOrder = 5;
                        prefObj.options = globalPref[i].KEYVAL_ARR;
                        prefObj.selected = getSelectedMode(allKeys[i], initialDetailPref, globalPref[i].KEYVAL_ARR);
                        prefObj.value = prefObj.selected.val;
                        prefObj.keyVal = prefObj.selected.keyVal;
                        if (angular.uppercase(prefObj.keyVal) == "DAILY") {
                            $scope.empCurrentPrefeObj.viewMode.isDailymode = true;
                        }
                        else {
                            $scope.empCurrentPrefeObj.viewMode.isDailymode = false;
                        }
                        $scope.prefereceList.push(prefObj);
                        break;
                }
            }
            $scope.prefereceList = $filter('orderBy')($scope.prefereceList, ['displayOrder']);
            $scope.gridPrefOptions.data = $scope.prefereceList;

        }
        var getPreferenceSettings = function (initialDetail) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getPreferenceSettings");
            try {
                if (initialDetail.PREF_ARR !== undefined && initialDetail.PREF_ARR !== null && Object.prototype.toString.call(initialDetail.PREF_ARR) != '[object Array]') {
                    var data = initialDetail.PREF_ARR;
                    initialDetail.PREF_ARR = [];
                    initialDetail.PREF_ARR.push({ KEY: data.PREF_OBJ.KEY, VAL: data.PREF_OBJ.VAL });
                }
                var globalPref = JSON.parse(localStorage.getItem('globalPref'));
                if (globalPref !== null) {
                    setPreferenceSettings(initialDetail.PREF_ARR, globalPref);
                }
            }
            catch (err) {
                console.log("Error on getPreferenceSettings=" + err.message);
            }
        }
        var checkCstmLayoutVisible = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.checkCstmLayoutVisible");
            if ($rootScope.dailyCustomFlag)
                $('#spnClmDailyViewCustomLayout').show();
            else {
                delete $scope.prefereceList[0].options[4];
                $('#spnClmDailyViewCustomLayout').hide();
            }

            if ($rootScope.weeklyCustomFlag)
                $('#spnClmWeeklyViewCustomLayout').show();
            else {
                delete $scope.prefereceList[1].options[2];
                $('#spnClmWeeklyViewCustomLayout').hide();
            }
        }
        var getCstmLayout = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getCstmLayout");
            try {
                layOutNameList = { Daily: "", Weekly: "" }
                localStorage.removeItem('searchLayout');
                //API call to get the layout info
                var resp = gridLayoutService.getCustomLayout();
                if (resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR !== null && resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR !== undefined && resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR.length > 0) {
                    var mode = "0";
                    for (var i = 0; i < resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR.length; i++) {
                        mode = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i].GMODE;
                        if (mode === "1") {
                            customLayouts.daily = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i];
                            customLayouts.daily.parentColumnViewId = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i].GPARENTCOLUMNVIEWID;
                            $scope.dailyViewCustomLayout = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i].GNAME;
                            $rootScope.dailyCustomFlag = true;
                        }
                        else if (mode === "2") {
                            customLayouts.weekly = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i];
                            customLayouts.weekly.parentColumnViewId = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i].GPARENTCOLUMNVIEWID;
                            $scope.weeklyViewCustomLayout = resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i].GNAME;
                            $rootScope.weeklyCustomFlag = true;
                        }
                        else if (mode === "3") {
                            localStorage.setItem('searchLayout', JSON.stringify(resp.LOADCUSTOMLAYOUT_OBJ.LAYOUT_ARR[i]));
                        }

                    }

                    $scope.gridDatacstm = [];
                    if ($scope.dailyViewCustomLayout != "") {
                        layOutNameList.Daily = $scope.dailyViewCustomLayout;
                        $scope.gridDatacstm.push({
                            layoutMode: appConstants.LAYOUTMODE.Daily, Layoutname: $scope.dailyViewCustomLayout, mode: '(' + $filter('translate')('lbl_Daily') + ')'
                        });
                    }
                    if ($scope.weeklyViewCustomLayout != "") {
                        layOutNameList.Weekly = $scope.weeklyViewCustomLayout;
                        $scope.gridDatacstm.push({
                            layoutMode: appConstants.LAYOUTMODE.Weekly, Layoutname: $scope.weeklyViewCustomLayout, mode: '(' + $filter('translate')('lbl_Weekly') + ')'
                        });
                    }
                    $scope.gridCstmLayoutOptions.data = $scope.gridDatacstm;
                }
                else {
                    $scope.gridCstmLayoutOptions.data = [];
                }
                /*API call end*/
                checkCstmLayoutVisible();
            }
            catch (err) {
                console.log("Error on custom Layout" + err.message);
            }
        }
        var gridPrefColumnDefs = [
                  {
                      field: 'name', maxWidth: 300, name: 'displayText', suppressRemoveSort: true, sort: {
                          direction: uiGridConstants.ASC, priority: 0,
                      }, width: '50%', groupingShowAggregationMenu: false, enableColumnMenu: true, visible: true, displayName: $filter('translate')('lbl_Name'), enableCellEdit: false,
                      allowCellFocus: true, enableColumnResizing: true

                  },
                  {
                      field: 'value', name: 'value', enableSorting: false, width: '60%', groupingShowAggregationMenu: false, enableColumnMenu: true, visible: true, displayName: $filter('translate')('lbl_Value'), enableCellEdit: true,
                      enableColumnResizing: true,
                      cellTemplate: '<div class="prefVal">{{COL_FIELD}}</div>',
                      editableCellTemplate: '<div class="prefeSection select-input-container dropdownContainer"><input ng-readonly="true" class="hideIEClearBtn select-input" style="width:100% !important; height:20px;" type="INPUT_TYPE"  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.showHidePrefOption($event)" ng-keydown="grid.appScope.prefInputKeyDown($event)" /><strong  class="clickIcon" ng-mousedown="grid.appScope.showHidePrefOption($event)"></strong> <ul ng-show="grid.appScope.isPrefDropDownOn" class="ul-select dropdownList reportingDropdown"><li  ng-mouseover="grid.appScope.prefItemMouseOver($event)" ng-repeat="item in row.entity.options" ng-mousedown="grid.appScope.inlineEditPref(row.entity,item)" key="{{item.KEYVAL}}"  ng-class=\"{\'selected\': $first}\" value="{{item.KEYVALDESC}}">{{item.KEYVALDESC}}</li></ul></div>'
                      //editableCellTemplate: '<div class="prefeSection select-input-container dropdownContainer"><input class="hideIEClearBtn select-input" style="width:100%;" type="INPUT_TYPE"  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keydown="grid.appScope.prefInputKeyDown($event)" /></div>'

                  }
        ];
        var gridCstmLayoutColumnDefs = [
                  {
                      field: 'Delete', enableSorting: false, enableColumnMenu: false, displayName: '', enableColumnResizing: false, enableFiltering: false, width: '30', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, cellTemplate: '<div class="icon-edit ui-grid-cell-contents" title="{{grid.appScope.dltTitle}}"><input class="entry-delete" ng-click="grid.appScope.deleteCstmLayout(row.entity)" type="image" id="imgGridDeleteEdit" /></div>'

                  },
                  {
                      suppressRemoveSort: true, field: 'Layoutname', name: 'Layoutname', groupingShowAggregationMenu: false, enableColumnMenu: false, displayName: $filter('translate')('lbl_Layout'), enableCellEdit: false, width: '254',
                      cellTemplate: '<div class="ui-grid-cell">{{(row.entity.Layoutname)}} {{(row.entity.mode)}}</div>', allowCellFocus: true,

                  }
        ];
        var updateInitDataAfterSavePref = function () {
            if ($scope.designateConfig.designateOfEmp.EMPLID == "0" || $scope.designateConfig.designateOfEmp.EMPLID === $scope.loginDetail.empLoggedInId) {
                loginService.retrieveInitialData($scope.loginDetail.SESKEY, $scope.loginDetail.empLoggedInId).then(function (response) {
                    if (parseInt(response.RETINIT_OUT_OBJ.RETCD) == 0) {
                        localStorage.setItem('Initial_Data', JSON.stringify(response.RETINIT_OUT_OBJ));
                    }
                });
            }

        }
        $scope.showHidePrefOption = function ($event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showHidePrefOption");
            $event.stopPropagation();
            $scope.isPrefDropDownOn = !$scope.isPrefDropDownOn;
        }
        var updateLayoutNameListOnDelete = function (mode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateLayoutNameListOnDelete");
            if (mode == appConstants.LAYOUTMODE.Daily) {
                layOutNameList.Daily = "";
            }
            else if (mode == appConstants.LAYOUTMODE.Weekly) {
                layOutNameList.Weekly = "";
            }
        }
        $scope.deleteCstmLayout = function (entity) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.deleteCstmLayout");
            if (!$rootScope.columnBlank) {
                $scope.gridDatacstm = [];
                var mode = entity.layoutMode;

                gridLayoutService.removeGridLayout($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, mode).then(function (resp) {
                    if (resp.REMOVEGRIDLAYOUT_OUT_OBJ.RETCD === "0") {
                        updateLayoutNameListOnDelete(mode);
                        if (entity.mode == "(" + $filter('translate')('lbl_Weekly') + ")") {
                            $scope.weeklyViewCustomLayout = "";
                            $rootScope.weeklyCustomFlag = false;
                            $scope.overrideFlag = true;
                            $scope.prefereceList[1].keyVal = "time";
                            $scope.prefereceList[1].value = "Time";
                            delete $scope.prefereceList[1].options[2];
                            $('#spnClmWeeklyViewCustomLayout').hide();
                        }
                        else {
                            $scope.dailyViewCustomLayout = "";
                            $rootScope.dailyCustomFlag = false;
                            $scope.overrideFlag = true;
                            $scope.prefereceList[0].keyVal = "time";
                            $scope.prefereceList[0].value = "Time";
                            delete $scope.prefereceList[0].options[4];
                            $('#spnClmDailyViewCustomLayout').hide();
                        }

                        if ($scope.dailyViewCustomLayout != "")
                            $scope.gridDatacstm.push({
                                layoutMode: appConstants.LAYOUTMODE.Daily, Layoutname: $scope.dailyViewCustomLayout, mode: '(' + $filter('translate')('lbl_Daily') + ')'
                            });
                        if ($scope.weeklyViewCustomLayout != "")
                            $scope.gridDatacstm.push({
                                layoutMode: appConstants.LAYOUTMODE.Weekly, Layoutname: $scope.weeklyViewCustomLayout, mode: '(' + $filter('translate')('lbl_Weekly') + ')'
                            });
                        $timeout(function () {
                            $scope.gridCstmLayoutOptions.data = $scope.gridDatacstm;
                            $scope.gridPrefOptions.data = $scope.prefereceList;
                            if (entity.layoutMode == appConstants.LAYOUTMODE.Weekly && !$scope.isDailyMode) {
                                if ($scope.optionWeekly == 5) {
                                    localStorage.setItem('isMainGridLayoutChange', 0);
                                    $scope.optionWeekly = 1;
                                    $scope.colPrefMenuTemp($scope.optionWeekly);
                                }

                            }
                            else if (entity.layoutMode == appConstants.LAYOUTMODE.Weekly && $scope.isDailyMode) {
                                if ($scope.optionWeekly == 5) {
                                    $scope.optionWeekly = 1;
                                }
                            }

                            else if (entity.layoutMode == appConstants.LAYOUTMODE.Daily && $scope.isDailyMode) {
                                if ($scope.optionDaily == 5) {
                                    localStorage.setItem('isMainGridLayoutChange', 0);
                                    $scope.optionDaily = 1;
                                    $scope.colPrefMenuTemp($scope.optionDaily);

                                }
                            }
                            else if (entity.layoutMode == appConstants.LAYOUTMODE.Daily && !$scope.isDailyMode) {
                                if ($scope.optionDaily == 5) {
                                    $scope.optionDaily = 1;

                                }
                            }
                        });
                    }
                    else {
                        //show the pop up for error massage
                    }
                });
            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
        var savePreferences = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.savePreferences");
            var msg = $filter('translate')('msg_PrefSaveExLang');
            var dataAr = [];
            $scope.prefereceList.forEach(function (pref) {
                if (pref.displayOrder == 3) {
                    //language is changed
                    if (pref.currentLanguage !== pref.keyVal) {
                        msg = $filter('translate')('msg_PrefSave');
                    }
                }
                dataAr.push({
                    KEY: pref.key, VAL: pref.keyVal
                });

            });
            var dataList = {
                PREF_OBJ: dataAr
            };
            var data = JSON.stringify(dataList);
            preferencesService.savePreferences($scope.loginDetail.SESKEY, data, $scope.loginDetail.EMPLID).then(function (response) {
                if (parseInt(response.SAVPREF_OUT_OBJ.RETCD) == 0) {
                    showMessagePopUp([msg]);
                    updateInitDataAfterSavePref();
                    $scope.prefereceList[3].currentLanguage = $scope.prefereceList[3].keyVal;
                }
            });
        }
        $scope.btnSavePreferenece = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.btnSavePreferenece");
            savePreferences();
        }
        var prefRowSelected = null;
        $scope.isPrefGrid = false;
        $scope.isCstmLayoutGrid = false;
        $scope.gridPrefOptions = {
            enableColumnMoving: false,
            enableColumnMenus: false,
            disCardCellNavigateOnEnterKey: true,
            rowHeight: 22,
            showHeader: true,
            enableGridMenu: false,
            enableVerticalScrollbar: 0,
            enableHorizontalScrollbar: 0,
            enableCellSelection: false,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: false,
            treeRowHeaderAlwaysVisible: false,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: true,
            canSelectRows: false,
            columnDefs: gridPrefColumnDefs,
            onRegisterApi: function (gridApi) {
                $scope.gridPrefApi = gridApi;
                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef) {
                    $scope.isPrefDropDownOn = true;
                    prefRowSelected = (rowEntity);
                });
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue == oldValue) {
                    }
                    //  alert('hi');
                });
            }
            // rowTemplate: "<div ng-dblclick=\"grid.appScope.onGridRowDblClick(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

        };

        $scope.gridCstmLayoutOptions = {
            enableColumnMoving: false,
            enableColumnMenus: false,
            disCardCellNavigateOnEnterKey: true,
            rowHeight: 22,
            showHeader: true,
            enableGridMenu: false,
            enableVerticalScrollbar: 0,
            enableHorizontalScrollbar: 0,
            enableCellSelection: false,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: false,
            treeRowHeaderAlwaysVisible: false,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: true,
            canSelectRows: false,
            columnDefs: gridCstmLayoutColumnDefs,
            onRegisterApi: function (gridApi) {
                $scope.gridPrefApi = gridApi;
                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef) {
                    $scope.isPrefDropDownOn = true;
                    prefRowSelected = (rowEntity);
                });
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue == oldValue) {
                    }
                    //  alert('hi');
                });
            }
            // rowTemplate: "<div ng-dblclick=\"grid.appScope.onGridRowDblClick(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

        };

        $scope.inlineEditPref = function (entity, prefObj) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.inlineEditPref");
            var obj = entity;
            entity.value = prefObj.KEYVALDESC;
            entity.keyVal = prefObj.KEYVAL;
            $timeout(function () {
                $('#prefGrid').focus();
            });
        }
        $scope.prefItemMouseOver = function (event) {
            $(".dropdownList li").removeClass("selected");
            $(event.target).addClass("selected");
        }
        $scope.prefInputKeyDown = function (e) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.prefInputKeyDown");
            var selNode = "#prefGrid .dropdownList li.selected";
            var liNode = "#prefGrid .dropdownList li";
            // enter key press
            if (e.keyCode == 13) {
                var selected = $(selNode);
                var keyVal = angular.element(selected).attr('key');
                if (keyVal !== undefined && prefRowSelected !== undefined) {
                    var option = prefRowSelected.options.filter(function (item) {
                        return item.KEYVAL === keyVal
                    });
                    if (option.length > 0) {
                        $scope.inlineEditPref(prefRowSelected, option[0]);
                    }
                }

            }
            if (e.keyCode == 40) { // down
                var selected = $(selNode);
                $(liNode).removeClass("selected");
                if (selected.next().length == 0) {
                    selected.siblings().first().addClass("selected");
                } else {
                    selected.next().addClass("selected");
                }
            }
            if (e.keyCode == 38) { // up
                var selected = $(selNode);
                $(liNode).removeClass("selected");
                if (selected.prev().length == 0) {
                    selected.siblings().last().addClass("selected");
                } else {
                    selected.prev().addClass("selected");
                }
            }

        }

        var translateScopeVariables = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.translateScopeVariables");
            try {
                $scope.prjScopeNoValidMsg = $filter('translate')('msg_PrjScopNotValid');
                $scope.newTitle = $filter('translate')('lbl_NewEntryTitle');
                $scope.newTitle2 = $filter('translate')('lbl_NewEntry');
                $scope.revClosedTitle = $filter('translate')('lbl_revClosed');
                $scope.timeEntryTitle = $filter('translate')('lbl_timeEntry');
                $scope.calTimeEntryTitle = $filter('translate')('lbl_calTimeEntry');
                $scope.editTitle = $filter('translate')('lbl_editEntry');
                $scope.editTitle2 = $filter('translate')('lbl_editSelectedEntry');
                $scope.noSelected = $filter('translate')('lbl_noSelected');
                $scope.EditSelected = $filter('translate')('lbl_editSelectedEntry');
                $scope.copySelected = $filter('translate')('lbl_copySelectedEntry');
                $scope.pasteCopiedEntry = $filter('translate')('lbl_pasteCopiedEntry');
                $scope.pasteCopiedSlctdEntry = $filter('translate')('lbl_pasteCopiedSlctdEntry');
                $scope.noPaste = $filter('translate')('lbl_noPaste');
                $scope.revClosed = $filter('translate')('lbl_revClosed');
                $scope.cpyPstClnSlcted = $filter('translate')('lbl_cpyPstClnSlcted');
                $scope.dltSlctdTitle = $filter('translate')('lbl_dltSlctd');
                $scope.copyTodayTitle = $filter('translate')('lbl_copyTo', {
                    copyTo: $scope.copyWeekTodayDate
                });
                $scope.sbmtTimeICuptoTitle = $filter('translate')('msg_sbmtTimeICupto', {
                    sbmtTimeICupto: $filter('date')($scope.currentDate, 'dd-MMM-yyyy')
                });
                $scope.copyWeekTitle = $filter('translate')('msg_copyWeekTitle', {
                    copyWeekTodayDateVar: $scope.copyWeekTodayDate
                });
                $scope.sbmtDateTimeICuptoTitle = $filter('translate')('msg_sbmtDateTimeICupto');
                $scope.chckbxICTitle = $filter('translate')('msg_chckbxIC');
                $scope.submitEntry = $filter('translate')('msg_submitEntryTitle');
                $scope.submitEntry2 = $filter('translate')('msg_submitEntryTitle2');
                $scope.rptNotSlctd = $filter('translate')('msg_rptNotSlctd');
                $scope.srchEmpl = $filter('translate')('msg_srchEmpl');
                $scope.srchByNameID = $filter('translate')('msg_srchByNameID');
            } catch (ex) { }
        }
        var clearSessionStorage = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.clearSessionStorage");
            sessionStorage.setItem('allICItems', "");
            sessionStorage.setItem('DescFav', null);
            sessionStorage.removeItem('FavActivityArray');
        }
        var isPageInit = true;
        $scope.init = function () {
            try {
                $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.init");
                var isPasteOnProgress = false;
                $scope.msgEr = [];
                $scope.msgFutureTime = [];
                $rootScope.summaryGridValue = [];
                //custom layout name           
                $scope.dailyViewCustomLayout = '';
                $scope.weeklyViewCustomLayout = '';
                $rootScope.dailyCustomFlag = false;
                $rootScope.weeklyCustomFlag = false;
                localStorage.setItem('isMainGridLayoutChange', 0);
                $rootScope.enableSaveLayout = false;
                $scope.langType = $scope.isEnglishLang == "true" ? "EN" : "FR";
                $scope.isDailyFlag = false;
                $scope.isWeeklyFlag = false;
                $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
                $scope.isDescriptionPopupLoad = false;
                $scope.cepfavourite = false;
                $scope.isNegativeAllowed = false;
                $scope.isGridFocus = false;
                $rootScope.showRightMenuFlag = false;
                $scope.showMenuOutsideGrid = false;
                $scope.showEditFlag = false;
                $scope.isPastebyDrag = false;
                $rootScope.ctrlFlag = false;
                $rootScope.shiftFlag = false;
                $rootScope.columnBlank = false;
                $rootScope.popupload = false;
                $scope.beginEdit = false;
                $scope.isSearchGrid = false;
                $scope.isProjectTask = null;
                $scope.maskTest = String('?*?*?*?*?*?*?-?9?9?9?-?9?9?9');
                $scope.renewalMessage = [];
                $scope.expandAllText = "Collapse All";
                $scope.isDefaultExpanded = true;
                var jsonInitialDetail = $rootScope.GetInitialDetail(false, true);
                getPreferenceSettings(jsonInitialDetail);
                $scope.pasteMsg = $scope.noPaste;
                clearSessionStorage();
                isPageInit = true;
                //$scope.getFavDescription($scope.loginDetail);
                //$scope.getFavActivities($scope.loginDetail);
                var layOutNameList = { Daily: "", Weekly: "" }
                getCstmLayout();

                //If loading first time
                if ($scope.designateConfig === undefined) {
                    $scope.designateConfig = {
                        becomeDesignateList: [], showBecomeDesignate: false, displayName: "", placeHolderVal: $filter('translate')('msg_notDsgnt')
                    }
                    $scope.designateConfig.designateOfEmp = {
                        EMPLID: "0", DISPNAME: ""
                    }

                }

                    //Loading after selecting designate
                else {
                    updateCalDateToCurrentDate();
                    $timeout(function () { broadcastService.updateDataSource(constantService.BroadCastUpdate.updateAll) }, 500);
                }
                if ($scope.allDesignateOfList === undefined) {
                    $scope.allDesignateOfList = [];
                    getBecomeDesignateList($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, true);
                }
                $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
                $scope.DOCURL = $scope.initialDetail.COMP_REC.DOCURL;
                $scope.GOCURL = $scope.initialDetail.COMP_REC.GOCURL;
                $scope.HLPURL = $scope.initialDetail.COMP_REC.HELPURL;

                if ($scope.initialDetail.loginUsrInitialDetail.EMPL_REC.HASGCRL !== undefined && $scope.initialDetail.loginUsrInitialDetail.EMPL_REC.HASGCRL === 'Y') {

                    $rootScope.isLoginUsrGloCord = true;
                }

                /*read initial_data to fetch user preference */
                if (($rootScope.$stateParams.currentDate != null) && ($rootScope.$stateParams.currentDate != '')) {
                    var year = parseInt($filter('date')($rootScope.$stateParams.currentDate, 'yyyy'));
                    var mn = parseInt($filter('date')($rootScope.$stateParams.currentDate, 'MM'));
                    var day = parseInt($filter('date')($rootScope.$stateParams.currentDate, 'dd'));
                    var currentDate = new Date(year, mn - 1, day);
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
                        $rootScope.$stateParams.isDailyMode = localStorage['isDailyMode'] == "true" ? true : false;
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
                            tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
                            $scope.currentDate = tempTodayDate;
                        }
                        $rootScope.currentSelectedDate = angular.copy($scope.currentDate);

                    }
                }
                if ($rootScope.lastCurrentDate != $filter('date')($scope.currentDate, 'yyyy-MM-dd')) {
                    $rootScope.expandedEntries = [];
                    $rootScope.collapsedEntries = [];
                    $rootScope.cntrExpandCollapse = 0;
                }

                //if ($rootScope.$stateParams.isDailyMode != null) {
                //    $scope.isDailyMode = $rootScope.$stateParams.isDailyMode;
                //}
                //else {
                //    $scope.isDailyMode = $scope.empCurrentPrefeObj.viewMode.isDailymode;
                //}
                try {
                    $scope.isDailyMode = $scope.empCurrentPrefeObj.viewMode.isDailymode;
                } catch (ex) {
                    $scope.isDailyMode = true;
                }
                if ($scope.cuttOffColumnDef === true) {
                    $scope.cuttOffColumnDef = false;
                    if (($scope.cutoffColumnDefNumber > 4 && $scope.cutoffColumnDefNumber != 7) || ($scope.cutoffColumnDefNumber == 8)) {
                        $scope.isDailyMode = false;
                        if ($scope.cutoffColumnDefNumber == 5)
                            $scope.cutoffColumnDefNumber = 1;
                        else if ($scope.cutoffColumnDefNumber == 8)
                            $scope.cutoffColumnDefNumber = 5;
                        else
                            $scope.cutoffColumnDefNumber = 2;
                        $scope.optionDaily = $scope.cutoffColumnDefNumberDay;
                        $scope.optionWeekly = $scope.cutoffColumnDefNumber;
                    }
                    else {
                        if ($scope.cutoffColumnDefNumber == 7)
                            $scope.cutoffColumnDefNumber = 5;
                        $scope.optionDaily = $scope.cutoffColumnDefNumber;
                        $scope.optionWeekly = $scope.cutoffColumnDefNumberWeek;
                        $scope.isDailyMode = true;
                    }
                }
                localStorage.isDailyMode = $scope.isDailyMode;
                $scope.weekDayToggle(true, $scope.isDailyMode, "N");
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
                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var selObj = null;
                var pdate = $filter('date')($scope.currentDate.valueOf(), "yyyy-MM-dd");
                var selecteddate = new Date($scope.currentDate.valueOf());
                pdate = createDate(pdate);
                //check in local storage before calling API
                selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate')('msg_invalidSession'), true); //chekRevDateInLocalStorage(pdate);
                if (selObj != null) {
                    checkCloseMonth(selObj, CurrDate, monthNames, selecteddate);
                }
                else {
                    var loginDetail = $rootScope.GetLoginDetail(false, true);
                    loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                        revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                        if (revMnthRange != undefined && revMnthRange != "undefined") {
                            for (var i = 0; i < revMnthRange.length; i++) {
                                if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
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
                // }
                // });


            }
            catch (err) {
                $('.my-cloak').removeClass('my-cloak'); console.log("init" + err); console.log(err.message);
            }
            callMonthEndAtInterval();
            $timeout(function () { callMonthEndAtInterval(); }, 2000);

        }
        var loginUserAllDesignate = [];
        var getBecomeDesignateList = function (sessKey, empId, isLoginUser) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getBecomeDesignateList");
            $scope.allDesignateOfList = [];
            var list = [];
            designateService.loadBecomeDesignate(sessKey, empId).then(function (resp) {
                if (parseInt(resp.LOADBECOMEDESIG_OUT_OBJ.RETCD) === 0) {
                    list = resp.LOADBECOMEDESIG_OUT_OBJ.EMPL_ARR;                   
                    if (list != null) {
                        if (Object.prototype.toString.call(list) != '[object Array]') {
                            var data = list.DESIG_OBJ;
                            list = [];
                            if (data != null)
                                list.push(data);
                        }
                    }                    
                    if (list !== null && list.length > 0) {
                        var cnt = -1, removeItemIndex = -1;
                        list.forEach(function (item) {
                            cnt++;
                            if (item.EMPLID != $scope.loginDetail.empLoggedInId) {
                                item.UIDISPNAME = item.DISPNAME.trim();
                                item.LwrName = item.UIDISPNAME.toLowerCase();
                            }
                            else {
                                removeItemIndex = cnt;
                            }
                        });
                        $scope.designateConfig.placeHolderVal = $filter('translate')('msg_DsgntPlcHldr');
                        //if (removeItemIndex > -1)
                           // list.splice(removeItemIndex, 1);
                        list = $filter('orderBy')(list, ['UIDISPNAME']);
                        if (isLoginUser) {
                            loginUserAllDesignate = JSON.parse(JSON.stringify(list));
                            $scope.allDesignateOfList = JSON.parse(JSON.stringify(list));
                        }
                        else {
                            $scope.allDesignateOfList = list;
                        }

                    }                    
                }
                else {
                    if (isLoginUser) {
                        loginUserAllDesignate = list;
                        $scope.allDesignateOfList = list;
                    }
                    else {
                        $scope.allDesignateOfList = list;
                    }
                }
                alert(list.length);
                $scope.designateConfig.becomeDesignateList = list.slice(0,500);
            });
        }


        //catch broadcast event/notification
        $scope.$on("updateUiGrid", function (event, args) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.updateUiGrid");
            if ($scope.gridApi != undefined && localStorage.clearGroupingDateChanged == "1") {
                $scope.clearGrouping = true;
                localStorage.clearGroupingDateChanged = "0";
            }
            $scope.currentDate = new Date(args.value.valueOf());

            var resDate = new Date(args.value.valueOf());

            resDate.setDate(resDate.getDate() + 1);

            resDate.setDate(resDate.getDate() - 7);
            for (var i = 0; i < 7; i++) {
                if (resDate.getDay() == 0)
                    break;
                resDate.setDate(resDate.getDate() + 1);
            }
            $scope.weeklyStartDate = new Date(resDate.valueOf());
            if (localStorage.isDailyMode == "true")
                $scope.isDailyMode = true;
            else if (localStorage.isDailyMode == "false")
                $scope.isDailyMode = false;

            if ($scope.isDailyMode)
                $scope.GetData($scope.isDailyMode, args.value.valueOf());
            else
                $scope.GetData($scope.isDailyMode, resDate.valueOf());
            angular.element('#divdatepicker').focus();
        });

        $scope.isDailyMode = true;

        var showHideTab = function (isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.showHideTab");
            $rootScope.pastedRecords = false;
            $rootScope.rowIndex = undefined;
            $(".tab1").css("display", "block");
            if (isDailyMode) {
                $scope.pasteDailyWeekly = $filter('translate')('lbl_pasteDailyWeekly');
                if ($scope.countDay != 1)
                    localStorage.setItem('AllcolumnHidden', -1)
                try {
                    if ($scope.optionDaily != undefined)
                        $scope.bottomColPrefMenu($scope.optionDaily);
                    else
                        $scope.bottomColPrefMenu(1);
                }
                catch (err) {
                }
            }
            else {
                $scope.pasteWeeklyDaily = $filter('translate')('lbl_pasteWeeklyDaily');
                if ($scope.countWeek != 1)
                    localStorage.setItem('AllcolumnHidden', -1)
                try {
                    if ($scope.optionWeekly != undefined)
                        $scope.bottomColPrefMenu($scope.optionWeekly);
                    else
                        $scope.bottomColPrefMenu(1);
                }
                catch (err) {
                }

            }

        }

        $scope.weekDayToggle = function (isLoad, isDailyMode, isResetExpandCollapse, istoggle) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.weekDayToggle");
            if (localStorage.getItem('isMainGridLayoutChange') == "1") {
                if ((!$rootScope.dailyCustomFlag && localStorage['isDailyMode'] == "true") || (!$rootScope.weeklyCustomFlag && localStorage['isDailyMode'] == "false"))
                    var sendData = {
                        msgList: [$filter('translate')('msg_cfrmMainGridSveLayOut')],
                        isCancelBtnOn: true,
                        okBtnText: $filter('translate')('btn_Yes'),
                        noBtnTxt: $filter('translate')('btn_No'),
                        popUpName: 'ConfrmSaveMainGrdLayout',
                        methodName: 'wkDayToggle'
                    };
                else
                    var sendData = {
                        msgList: [$filter('translate')('msg_overrideMainGridSveLayOut')],
                        isCancelBtnOn: true,
                        okBtnText: $filter('translate')('btn_Yes'),
                        noBtnTxt: $filter('translate')('btn_No'),
                        popUpName: 'OverrideSaveMainGrdLayout',
                        methodName: 'wkDayToggle'
                    };
                sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
            }
            else {
                $scope.multiSelectFlag = false;
                if (istoggle) {
                    $scope.showEditFlag = false;
                    $scope.showMenuOutsideGrid = false;
                    $scope.isShowSubmitMenu = false;
                    $rootScope.showRightMenuFlag = false;
                    $scope.showNewFlag = false;
                }


                if ((isDailyMode == $scope.isDailyMode) && !isLoad)
                    return;
                if (!$rootScope.columnBlank) {
                    $scope.refreshGridMain = true;
                    if (isResetExpandCollapse == "Y") {
                        $rootScope.expandedEntries = [];
                        $rootScope.collapsedEntries = [];
                        $rootScope.cntrExpandCollapse = 0;
                    }
                    $scope.gridData = [];
                    $scope.itemsDataFinal1 = [];
                    $scope.isDailyMode = isDailyMode;
                    localStorage.isDailyMode = isDailyMode;
                    showHideTab(isDailyMode);
                    $scope.isDailyMode = isDailyMode;
                    localStorage.isDailyMode = $scope.isDailyMode;
                    if (isDailyMode) {
                        //localStorage.setItem("WeeklyDataCopied", false);
                        //$scope.isWeeklyFlag = false;
                        //$timeout(function () {
                        //    $scope.GetData($scope.isDailyMode, $scope.currentDate);
                        //}, 100);

                        $(".showInDay").css("display", "inline-block");
                        $(".showInWeek").css("display", "none");
                        $(".week_.ui-gradient").css("display", "block");
                        $(".day_.ui-gradient").css("display", "none");
                        //broadcastService.notifyRefreshCalendar();

                    }
                    else {
                        //localStorage.setItem("DailyDataCopied", false);
                        //$scope.isDailyFlag = false;
                        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
                        var resDate = new Date($scope.currentDate.valueOf());

                        resDate.setDate(resDate.getDate() + 1);

                        resDate.setDate(resDate.getDate() - 7);
                        for (var i = 0; i < 7; i++) {
                            if (resDate.getDay() == 0)
                                break;
                            resDate.setDate(resDate.getDate() + 1);
                        }
                        $scope.weeklyStartDate = new Date(resDate.valueOf());
                        //$timeout(function () {
                        //    $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                        //}, 100);
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
                        //broadcastService.notifyRefreshCalendar();
                    }
                }
                else {
                    var sendData = {
                        errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                    };
                    $scope.openModalCtrl = 'showValidationMsg';
                    sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                }
                if (istoggle)
                    $rootScope.countmove = 0;
            }

        }
        $scope.showCEPFavourites = function (row) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showCEPFavourites");
            //$timeout(function () {
            $(".searchCep.ng-scope").css("display", "none");
            $scope.cepfavourite = true;
            var cepSrchStr = row.entity.CEP_REC.CLIENO;
            var sendData = {
                sessionKey: $scope.loginDetail.SESKEY,
                empId: $scope.loginDetail.EMPLID,
                cepCode: "",
                //cepCode: cepSrchStr === null ? "" : cepSrchStr,
                reordPerPage: 50,
                popUpName: "CEPFavPopUp",
                isSearchMode: false,
                companyId: $scope.initialDetail.COMP_REC.COMPID,
                domainURL: $scope.domainURL,
                isBroadcast: true,
                rowDetail: row.entity
            }
            sharedService.openModalPopUp('Desktop/NewEntry/templates/CEPCodeFavorites.html', 'CEPCodeFavDesktopCtrl', sendData);
            //}, 600);
        }
        $rootScope.ctrlFlag = false;


        $scope.showProjComponentPopup = function (timeEntery, isSelected) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.showProjComponentPopup");
            if ($scope.IsshowProjComponent) {
                return
            };
            $scope.saveOnCancelPopUp = $scope.isRowEdit;
            if ($rootScope.columnBlank)
                timeEntery = null;
            if (($scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity != $scope.selctProjCmp) && ($scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity != $filter('translate')('activity_Title'))) {
                $rootScope.columnBlank = false;
            }


            var sendData = {
                components: $scope.projectListData, isSelected: isSelected, defaultDesc: (timeEntery != null ? timeEntery.CTDESC : ""), isEditMode: false, timeEntery: timeEntery, isBroadcast: true
            }
            $scope.IsshowProjComponent = true;
            $scope.openModalCtrl = 'ProjectComponentCtrl';
            $scope.open('Desktop/NewEntry/templates/ComponentTask.html', 'ProjectComponentCtrl', sendData);
            $scope.saveFlag = false;
        }
        $scope.gridActComplete = function (entity, id) {
        }
        $scope.loadActivity = function (row) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadActivity");
            if ($scope.IsshowProjComponent) {
                return
            };
            $scope.saveOnCancelPopUp = $scope.isRowEdit;
            $scope.isSameCompany = false;
            // if ($scope.frmParm.IsCepSelected) {      
            //if ($scope.cepObj.selected != null && $scope.cepObj.selected.COMPID == $scope.initialDetail.COMP_REC.COMPID) {
            //            $scope.isSameCompany = true;
            //        }
            if (($scope.cepObj.selected != null) ? ($scope.cepObj.selected.COMPID == $scope.initialDetail.COMP_REC.COMPID) : (row.COMPID == $scope.initialDetail.COMP_REC.COMPID)) {
                $scope.isSameCompany = true;
            }
            var sendData = {
                isSameCompany: $scope.isSameCompany, cepCompId: $scope.cepObj.selected == null ? null : $scope.cepObj.selected.COMPID, isCepValid: true, compRecCompId: $scope.initialDetail.COMP_REC.COMPID, isBroadcast: true
            }

            //var sendData = {
            //    isSameCompany: $scope.isSameCompany, cepCompId: $scope.cepObj.selected == null ? null : $scope.cepObj.selected.COMPID, isCepValid: $scope.frmParm.IsCepSelected, compRecCompId: $scope.initialDetail.COMP_REC.COMPID
            //}
            $scope.IsshowProjComponent = true;
            $scope.openModalCtrl = 'ActivityCtrl';
            $scope.open('Desktop/NewEntry/templates/Activity.html', 'ActivityDesktopCtrl', sendData);
            $scope.saveFlag = false;
            // }
        }
        $scope.$on("loadDesktopActivityProject", function (event, args) {
            $scope.loadDesktopActivityProject($scope.row, true);
        });
        $scope.loadDesktopActivityProject = function (row, chkstatus) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadDesktopActivityProject");
            $scope.cepObj.selected = angular.copy($scope.cepObj.selectedBegin);
            $scope.isProjectTask = $scope.isProjectTaskBegin;
            //$timeout(function () {
            $scope.isScopeReq = false; var timeEntery = null; var isSelected = false;
            if (row != undefined && row.entity != undefined) {
                timeEntery = {
                    CMPTID: row.entity.CMPTID, TSKID: row.entity.TSKID, CTDESC: row.entity.CTDESC
                }
                if (row.entity.SCOID != null && row.entity.SCOID != 0 && row.entity.SCOID != "") {
                    timeEntery.SCOPID = row.entity.SCOID;
                }
            }
            if ($scope.row != undefined)
                row = $scope.row;
            if (row != undefined && row.entity != undefined)
                $scope.cepObj.selected = row.entity.CEP_REC;
            else if ((row != undefined && ($scope.cellNavigate || $scope.cepfavourite)))
                $scope.cepObj.selected = angular.copy(row);

            if (($scope.cepObj.selected != null ? (typeof $scope.cepObj.selected.CATID !== 'undefined') : false)) {
                $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
                if (parseInt($scope.cepObj.selected.CATID) > 0) {
                    $scope.IsActivity = false;
                    projectComponetService.searchPRCCode($scope.loginDetail.SESKEY, $scope.cepObj.selected.CATID, $scope.cepObj.selected.PRJID).then(function (response) {
                        if (parseInt(response.LOADPCOMTSK_OUT_OBJ.RETCD) == 0) {
                            if (Object.prototype.toString.call(response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM) != '[object Array]') {
                                var data = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM;
                                response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM = [];
                                response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM.push(data.PCOM_OBJ);
                            }

                            response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR.PCAT_OBJ.ARR_PCOM.sort(function (a, b) {
                                return a.ORD - b.ORD
                            });

                            var comArr = [];
                            $scope.projectListData = response.LOADPCOMTSK_OUT_OBJ.PCAT_ARR;
                            for (var j = 0; j < $scope.projectListData.PCAT_OBJ.ARR_PCOM.length; j++) {
                                var data = {
                                    CMPTID: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].CMPTID,
                                    CMPTCD: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].CMPTCD,
                                    DES: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].DES,
                                    ACTIVE: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTIVE,
                                    DESREQ: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].DESREQ,
                                    DEFDES: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].DEFDES,
                                    ACTICD: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ACTICD,
                                    ORD: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ORD,
                                    ARR_PTSK: $scope.projectListData.PCAT_OBJ.ARR_PCOM[j].ARR_PTSK

                                };

                                comArr.push(data);
                            }

                            $scope.projectListData.PCAT_OBJ.ARR_PCOM = comArr;
                            $scope.projectListData.PCAT_OBJ.ARR_PCOM.sort(function (a, b) {
                                return a.ORD - b.ORD
                            });
                            var cepcode = $scope.cepObj.selected.CLIENO.toString() + '-' + $scope.cepObj.selected.ENGNO.toString() + '-' + $scope.cepObj.selected.PRJNO.toString();
                            if ($scope.oldCepEntry == cepcode) {
                                isSelected = true;
                            }
                            if ($scope.cellNavigate || chkstatus || $scope.cepfavourite) {
                                $scope.beginEdit = false;
                                $scope.showProjComponentPopup(timeEntery, isSelected);
                            }

                            // }

                            /*---------end-------*/
                        }
                    });
                }
                else {
                    $scope.IsActivity = true;
                    if ($scope.cellNavigate || chkstatus || $scope.cepfavourite) {
                        $scope.beginEdit = false;
                        $scope.loadActivity(row);
                    }
                }
            }
            //else {
            //    $scope.IsActivity = true;           
            //    $scope.loadActivity(row);
            //}
            //}, 600);
        }

        $scope.cepObj = {
            selected: null
        }
        $scope.cpeList = function ($select) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.cpeList");
            return $scope.cpecodeList;
        }
        $scope.mrefreshResults = function ($select) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.mrefreshResults");
            if ($rootScope.$stateParams.IsEditMode) {
                $scope.timeEntry = JSON.parse(localStorage.getItem('Time_Entry'));
                if (typeof $scope.timeEntry.CEP_REC !== undefined) {
                    $select.search = $scope.timeEntry.CEP_REC.CLIENO.toString() + '-' + $scope.timeEntry.CEP_REC.ENGNO.toString() + '-' + $scope.timeEntry.CEP_REC.PRJNO.toString();
                }
            }
            $scope.select = $select.search;

            $scope.activity.activityListData = [];
            var search = $select.search;
            if (search.length > 0) {
                if ($scope.IsSearchDropdown) {
                    $scope.PageNumber = 1;
                }
                cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, $scope.PageNumber, $scope.DataPerPage, "", $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
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
        $scope.closeSearchGridCep = function (row) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.closeSearchGridCep");
            $(".searchCep.ng-scope").css("display", "none");
            $scope.beginEdit = false;
            $scope.cellNavigate = true;
            $scope.loadDesktopActivityProject(row.CEP_REC, true);
        }
        $scope.searchGridCep = function (row) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.searchGridCep");
            if (row.isSelected && $scope.beginEdit && $scope.isSearchGrid && ($scope.colDefName == "CEP_REC.CLIENO" || $scope.colDefName == "data.CEP_REC.CLIENO"))
                return true;
            else
                return false;
        }
        $scope.gridCepComplete = function (entity, id, row) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.gridCepComplete");
            //if saving in progress return
            if (isGridLock) return false;
            if ($scope.cepEditCodeWithoutMask != undefined && $scope.cepEditCodeWithoutMask.toLowerCase() !== entity.CEP_REC.CLIENO.replace(/-/g, '').toLowerCase() && id !== null) {
                //console.log("test==" +id);
                $scope.cepMasking = "?*?*?*?*?*?*?-?9?9?9?-?9?9?9";
            }
            $scope.isCepFavSet = false;
            if (row != undefined)
                $rootScope.gridrow = row;
            var excptnClientCode = "", ex = "";
            //alert('$rootScope.gridrow---'+JSON.stringify($scope.gridrow));
            $scope.getCurrentFocus();
            $scope.isProjectTaskBegin = null;
            //&& $scope.currentFocused.COLUMNNAME == "CEP_REC.CLIENO") || $scope.currentFocused.COLUMNNAME != "CEP_REC.CLIENO"     
            //if ((($scope.currentFocused.COLUMNNAME != "CEP_REC.CLIENO") && ($scope.currentFocused.COLUMNNAME != "data.CEP_REC.CLIENO"))) {
            //if (($scope.currentFocused.COLUMNNAME == "CEP_REC.CLIENO" && (id != null ? (document.getElementById(id).value.indexOf("_") == "-1") : true)) || ($scope.currentFocused.COLUMNNAME == "data.CEP_REC.CLIENO" && (id != null ? (document.getElementById(id).value.indexOf("_") == "-1") : true)) || ($scope.currentFocused.COLUMNNAME != "CEP_REC.CLIENO") || ($scope.currentFocused.COLUMNNAME != "data.CEP_REC.CLIENO")) {
            // alert(JSON.stringify(entity));
            $scope.PageNumber = 1;
            $scope.DataPerPage = 10;
            var clientNumber = entity.CEP_REC.CLIENO.toUpperCase().trim();
            if (entity.CEP_REC.CLIENO.length == 12) {
                clientNumber = entity.CEP_REC.CLIENO.substring(0, 6) + '-' + entity.CEP_REC.CLIENO.substring(6, 9) + '-' + entity.CEP_REC.CLIENO.substring(9, 12);
                //alert('clientNumber--' + clientNumber);
                entity.CEP_REC.CLIENO = clientNumber.toUpperCase().trim();
            }
            else {
                ex = entity.CEP_REC.CLIENO.toUpperCase().trim().split('-');
                if (ex != "" && ex != undefined && ex.length > 2) {
                    ex = (ex[0].toString() + ex[1].toString() + ex[2].toString());
                    if (ex.length > 8)
                        excptnClientCode = cepSharedService.isExcepCepCode(ex);
                }
                else {
                    if (clientNumber.length > 8)
                        excptnClientCode = cepSharedService.isExcepCepCode(clientNumber);
                }
                if (excptnClientCode.isExpCep)
                    clientNumber = excptnClientCode.cepWithMask;
                else
                    $scope.cnt = 1;
            }
            if (clientNumber.length < 8 && id != null) {
                $scope.cnt = 1;
            }
            if (clientNumber.length == 14 || (excptnClientCode != "" && excptnClientCode.isExpCep)) {
                $scope.cnt = null;
                cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, clientNumber, $scope.PageNumber, $scope.DataPerPage, "", $scope.initialDetail.COMP_REC.COMPID, constantService.DOMAINURL).then(function (response) {
                    if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                        /*if no result is returned from api*/
                        $scope.gridOptions.data[$scope.currentFocused.rowIndex].CEP_REC.CHARBASIS = response.LOOKCEP_OUT_OBJ.CEP_ARR[0].CHARBASIS;
                        var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;
                        var b = leg !== undefined;
                        if (b) {
                            $scope.cepListDetails = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            $scope.cepListDetails = $scope.cepListDetails.filter(function (item) {
                                return item.CLIENO !== '000000';
                            });
                        }
                        //convert object to array
                        if (Object.prototype.toString.call(response.LOOKCEP_OUT_OBJ.CEP_ARR) != '[object Array]') {
                            var data = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            response.LOOKCEP_OUT_OBJ.CEP_ARR = [];
                            response.LOOKCEP_OUT_OBJ.CEP_ARR.push(data.CEP_DET_OBJ);
                        }
                        //remove CLIEID =0 record
                        for (var i = 0; i < response.LOOKCEP_OUT_OBJ.CEP_ARR.length; i++) {
                            if (response.LOOKCEP_OUT_OBJ.CEP_ARR[i].CLIEID == 0) {
                                response.LOOKCEP_OUT_OBJ.CEP_ARR.splice(i, 1);
                                i--;
                            }
                        }
                        if (response.LOOKCEP_OUT_OBJ.CEP_ARR[0] != undefined) {
                            var cepDetail = response.LOOKCEP_OUT_OBJ.CEP_ARR[0];
                            if (cepDetail.CEPFAV == 'Y') {
                                $scope.ISINLINECEPFAV = true;
                                $scope.isCepFavSet = true;
                            }
                            else {
                                $scope.ISINLINECEPFAV = false;
                                $scope.isCepFavSet = true;
                            }
                            //alert($scope.ISINLINECEPFAV);
                            cepService.loadCEPDetail($scope.loginDetail.SESKEY, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].CLIEID, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].ENGID, response.LOOKCEP_OUT_OBJ.CEP_ARR[0].PRJID, $scope.domainURL).then(function (response) {
                                if (parseInt(response.LOADCEP_OUT_OBJ.RETCD) == 0) {
                                    //$(".searchGrid").css("display", "block");  
                                    $scope.gridOptions.data[$scope.currentFocused.rowIndex].CEP_REC.CHARBASIS = response.LOADCEP_OUT_OBJ.CEP_REC.CHARBASIS;
                                    $scope.cpeListData = [];
                                    $scope.cpeListData.push(response.LOADCEP_OUT_OBJ.CEP_REC);
                                    $scope.row = response.LOADCEP_OUT_OBJ.CEP_REC;

                                    //alert(' $scope.cpeListData--' + $scope.cpeListData);
                                    $scope.cepObj.selectedBegin = $scope.cpeListData[0];
                                    if (id != null) {
                                        $scope.isSearchGrid = true;
                                        $scope.loadDesktopActivityProject(row, '');
                                    }
                                    if (response.LOADCEP_OUT_OBJ.CEP_REC.CATID > 0) {
                                        $scope.isProjectTaskBegin = true;
                                    }
                                    else {
                                        $scope.isProjectTaskBegin = false;
                                    }
                                }

                            });
                        }
                        else {
                            if (row != undefined)
                                $scope.cepObj.selectedBegin = row.CEP_REC;
                        }
                    }
                    if (response.LOOKCEP_OUT_OBJ.CEP_ARR.length == 0 && $scope.cnt == null && id != null) {
                        $.growl({
                            title: "Message", message: $filter('translate')('msg_noMatch')
                        });
                        $scope.cnt = 1;
                    }

                });
            }
        }
        $scope.rightClickObj = "";
        $scope.pasteByCtrlClick = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteByCtrlClick");
            try {
                var selectedRowsTemp = $scope.gridApi.selection.getSelectedRows();
                if ($scope.checkRevMonthFlag) {
                    if ($scope.isDailyMode && !$scope.isDailyFlag && $scope.WeeklyDataCopied && selectedRowsTemp.length != 0 && $scope.isNegativeAllowed) { showMessagePopUp([$filter('translate')('lbl_pasteDailyWeekly')], "Message", true); }
                    else if (!$scope.isWeeklyFlag && !$scope.isDailyMode && $scope.DailyDataCopied && selectedRowsTemp.length != 0 && $scope.isNegativeAllowed) { showMessagePopUp([$filter('translate')('lbl_pasteWeeklyDaily')], "Message", true); }
                    else {
                        if ((($scope.isDailyMode && localStorage.getItem("DailyDataCopied") == "true") || (!$scope.isDailyMode && localStorage.getItem("WeeklyDataCopied") == "true") && $scope.isNegativeAllowed)) {
                            if (!isPasteOnProgress) {
                                isPasteOnProgress = true;
                                $scope.pasteRecords($scope.isDailyMode, 1);
                            }
                        }
                        else
                            showMessagePopUp([$scope.noPaste], "Message", true);
                    }

                }
                else
                    showMessagePopUp([$filter('translate')('lbl_revClosed')], "Message", true);

                $rootScope.showRightMenuFlag = false;
            } catch (err) {
                isPasteOnProgress = false;
            }
        }
        $scope.deleteByRightClick = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.deleteByRightClick");
            $scope.selectedRows = [];
            var isDeleteAllowed = true;
            var selectedRowsTemp = $scope.gridApi.selection.getSelectedRows();
            var selectedRows = angular.copy(selectedRowsTemp);
            var submittedEntry = selectedRows.filter(function (item) {
                return item.TIMSUB.toUpperCase() == "N"
            });
            if (submittedEntry.length < 1)
                isDeleteAllowed = false;

            var tEIdsStrFinal = "";
            var count = 0;
            var invalidCount = 0;
            if (isDeleteAllowed) {
                for (var i = 0; i < selectedRows.length; i++) {
                    $scope.selectedRows.push(selectedRows[i]);
                }
                if ($scope.selectedRows == null || $scope.selectedRows.length == 0) {
                    $scope.selectedRows.push($scope.rightClickObj);
                }
                if ($scope.selectedRows != null) {
                    var timeEntryIds = [];
                    var isTEInOpenREVWeekExist = false;
                    var weekDayOnOffStatus = null;
                    if (!$scope.isDailyMode) {
                        var weekSdate = new Date($scope.weeklyStartDate.valueOf());
                        weekSdate.setHours(0, 0, 0, 0);
                        weekDayOnOffStatus = commonUtilityService.getWkDayOnOpenCloseRevStatus(weekSdate);
                    }
                    for (var i = 0; i < $scope.selectedRows.length; i++) {
                        if ($scope.isDailyMode) {
                            count++;
                            if ($scope.selectedRows[i].TIMSUB.toUpperCase() != "Y")
                                timeEntryIds.push(parseFloat($scope.selectedRows[i].TEID));
                            else
                                invalidCount++;
                        }
                        else {
                            if ($scope.selectedRows[i].data.TIMSUB.toUpperCase() != "Y") {
                                var selRec = $scope.selectedRows[i];
                                var obj = commonUtilityService.getDeleteTeIdObj(selRec, weekDayOnOffStatus);
                                isTEInOpenREVWeekExist = isTEInOpenREVWeekExist ? true : obj.isTEInOpenREVWeekExist;
                                tEIdsStrFinal += (tEIdsStrFinal == "" ? "" : ",") + obj.tEIdsStr;
                                invalidCount = invalidCount + obj.invalidCount;
                                count = count + commonUtilityService.countNoOfTimeEntry(selRec);
                            }
                            else {
                                var selRec = $scope.selectedRows[i];
                                var ttlSelTE = commonUtilityService.countNoOfTimeEntry(selRec);
                                count = count + ttlSelTE;
                                invalidCount = invalidCount + ttlSelTE;

                            }
                        }
                    }
                    $scope.deleteTimeEntries($scope.isDailyMode, ($scope.isDailyMode ? timeEntryIds : tEIdsStrFinal.split(",")), invalidCount, count, isTEInOpenREVWeekExist);
                }
                //else if ($scope.selectedRows != null && !$scope.checkRevMonthFlag) {
                //    var isNonSubmittedEntry = false;
                //    for (var i = 0; i < $scope.selectedRows.length; i++) {
                //        if ($scope.isDailyMode) {
                //            if ($scope.selectedRows[i].TIMSUB.toUpperCase() != "Y") {
                //                isNonSubmittedEntry = true;
                //                break;
                //            }
                //        }
                //        else {
                //            if ($scope.selectedRows[i].data.TIMSUB.toUpperCase() != "Y") {
                //                isNonSubmittedEntry = true;
                //                break;
                //            }
                //        }
                //    }
                //    if (isNonSubmittedEntry)
                //        showMessagePopUp([$filter('translate')('msg_dltFaild')]);
                //}
                $rootScope.showRightMenuFlag = false;
            }
        }

        $scope.pasteAdvancedDatePicker = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteAdvancedDatePicker");
            $rootScope.showRightMenuFlag = false;
            $("#pasteAdv").css("display", "block");
        }

        $scope.keyUpGrid = function (event) {
            $rootScope.ctrlFlag = false;
            $rootScope.shiftFlag = false;
        }
        var menuObj = { menuWidth: 218, leftSecWidth: 240, menuHeight: 66 };
        $scope.rightClick = function (event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.rightClick");
            menuObj.leftSecWidth = 240;
            $scope.showEditTitle();
            $scope.showNewFlag = false;
            $scope.showEditFlag = false;
            $scope.copytoTodayCuttOff = false;
            $scope.afterTecuttOff = false;
            checkAfterCuttOff();
            $scope.rightClickObj = event.target;
            $scope.showEditFlag = false;
            $scope.isShowSubmitMenu = false;
            $rootScope.showRightMenuFlag = false;

            $(".edit_MenuOutsideGrid").css("display", "block");
            menuObj.mainGridWidth = parseInt($('.main-area').width());
            menuObj.mainGridHeight = parseInt($('.main-area').height());
            if ($(".sidebarSide").css("left") == "0px") {
                menuObj.leftSecWidth = 60;
            }
            var xOffset = event.pageX - menuObj.leftSecWidth + 10;
            var yMargin = $scope.isDailyMode ? 150 : 120;
            var topMargin = event.pageY - yMargin;
            var temp = menuObj.mainGridWidth - menuObj.menuWidth;
            if (xOffset > (temp)) {
                xOffset = xOffset - (menuObj.menuWidth);
            }
            temp = (menuObj.mainGridHeight - menuObj.menuHeight);
            if (topMargin >= temp) {
                topMargin = topMargin - menuObj.menuHeight;
            }
            $(".edit_MenuOutsideGrid").css({
                left: xOffset + 'px', top: topMargin + 'px'
            });
            $scope.showMenuOutsideGrid = true;
            event.preventDefault();
            event.stopPropagation();
        }
        $scope.checkClick = function (event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.checkClick");
            $scope.showColViewMenu = false;
            $rootScope.showRightMenuFlag = false;
            $scope.showMenuOutsideGrid = false;
            $("#pasteAdv").css("display", "none");
            if ($scope.isShowSubmitMenu) {
                $(".edit_Menu.submitMainMenu").css("display", "block");
                $scope.isShowSubmitMenu = false;
            }
            else {
                $(".edit_Menu.submitMainMenu").css("display", "block");
                $scope.isShowSubmitMenu = false;
            }
        }

        $scope.colViewVar = 1;
        $scope.colprefBtnText = "Column View: Time";
        var getAvailablewidth = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getAvailablewidth");
            var userContainer = $(".user-container-inner").width();
            return userContainer;
        }
        var showHideGridColumns = function (columndefs, commaSeparatedColumnName, separator) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.showHideGridColumns");
            var isLowSpace = false;
            if ((($(".right-section").css("right") == "3px") && ($(".sidebar").css("left") == "3px")) || window.innerWidth < 950) {
                isLowSpace = true
            }
            // var mainWidth =getAvailablewidth();
            for (var i = 0; i < columndefs.length; i++) {
                if (columndefs[i].enableHiding == false)
                    continue;
                if (commaSeparatedColumnName.indexOf((separator + columndefs[i].name.toLowerCase() + separator)) > -1)
                    columndefs[i].visible = true;
                else
                    columndefs[i].visible = false;
                if (columndefs[i].visible) {
                    if (columndefs[i].name == "ProjectActivity" && isLowSpace && !$scope.isDailyMode) {
                        columndefs[i].width = "2%";
                    }
                }
            }

        }
        var updateColWidthOnSelectCustomLayout = function (columndefs) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateColWidthOnSelectCustomLayout");
            var isLowSpace = false;
            if ((($(".right-section").css("right") == "3px") && ($(".sidebar").css("left") == "3px")) || window.innerWidth < 950) {
                isLowSpace = true
            }
            if (isLowSpace) {
                for (var i = 0; i < columndefs.length; i++) {
                    if (columndefs[i].visible) {
                        if (columndefs[i].name == "ProjectActivity") {
                            columndefs[i].width = "2%";
                            break;
                        }
                    }
                }
            }

        }

        $scope.colPrefMenuTemp = function (options) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.colPrefMenuTemp");
            switch (options) {
                case 1:
                    $(".main-area-bottom .bottomPopup ul li span").removeClass("active");
                    $scope.colprefBtnText = $filter('translate')('lbl_colView') + $filter('translate')('lbl_Time');
                    if ($scope.isDailyMode) {
                        $scope.countDay = 3;
                        $scope.optionDaily = 1;
                        showHideGridColumns(columnDefs1, "#cep_rec.charbasis#projectactivity#hrs#des#", "#");
                        //$scope.gridOptions.columnDefs = []
                        //$timeout(function () {
                        $scope.gridOptions.columnDefs = columnDefs1;
                        //});
                    }
                    else {
                        //showHideGridColumns(columnDefsWeek1, "#data.cep_rec.charbasis#projectactivity#hrs1#hrs2#hrs3#hrs4#hrs5#hrs6#hrs7#hrstotal#des#", "#");
                        //$scope.gridOptions.columnDefs = []
                        //$timeout(function () {
                        $scope.gridOptions.columnDefs = columnDefsWeek1;
                        //});
                        $scope.colViewType = "Time";
                        $scope.countWeek = 3;
                        $scope.optionWeekly = 1;
                        $scope.calTotalView(3);
                    }
                    $("#spnClmDailyViewTime").addClass("active");
                    break;
                case 2:
                    $(".main-area-bottom .bottomPopup ul li span").removeClass("active");
                    $scope.colprefBtnText = $filter('translate')('lbl_colView') + $filter('translate')('lbl_TimeIncCT');
                    if ($scope.isDailyMode) {
                        $scope.countDay = 4;
                        $scope.optionDaily = 2;
                        showHideGridColumns(columnDefs2, "#cep_rec.charbasis#component#task#scope#hrs#", "#");
                        $scope.gridOptions.columnDefs = []
                        $timeout(function () {
                            $scope.gridOptions.columnDefs = columnDefs2;
                        });
                    }
                    else {
                        showHideGridColumns(columnDefsWeek2, "#data.cep_rec.charbasis#component#task#scope#hrs1#hrs2#hrs3#hrs4#hrs5#hrs6#hrs7#hrstotal#", "#");
                        $scope.gridOptions.columnDefs = []
                        $timeout(function () {
                            $scope.gridOptions.columnDefs = columnDefsWeek2;
                        });
                        $scope.colViewType = "TimeCT";
                        $scope.countWeek = 5;
                        $scope.optionWeekly = 2;
                        $scope.calTotalView(5);
                    }
                    $("#spnClmDailyViewTimeIC").addClass("active");

                    break;
                case 3:
                    $(".main-area-bottom .bottomPopup ul li span").removeClass("active");
                    $scope.colprefBtnText = $filter('translate')('lbl_colView') + $filter('translate')('lbl_IC');
                    $scope.countDay = 4;
                    $scope.optionDaily = 3;
                    showHideGridColumns(columnDefs3, "#cep_rec.charbasis#projectactivity#icdesc#icchrge#des#", "#");
                    $scope.gridOptions.columnDefs = []
                    $timeout(function () {
                        $scope.gridOptions.columnDefs = columnDefs3;
                    });
                    $("#spnClmDailyViewIC").addClass("active");
                    break;
                case 4:
                    $(".main-area-bottom .bottomPopup ul li span").removeClass("active");
                    $scope.colprefBtnText = $filter('translate')('lbl_colView') + $filter('translate')('lbl_ICIncCT');
                    $scope.countDay = 5;
                    $scope.optionDaily = 4;
                    showHideGridColumns(columnDefs4, "#cep_rec.charbasis#component#task#scope#icdesc#icchrge#", "#");
                    $scope.gridOptions.columnDefs = []
                    $timeout(function () {
                        $scope.gridOptions.columnDefs = columnDefs4;
                    });
                    $("#spnClmDailyViewICNCT").addClass("active");
                    break;
                case 5:
                    $(".main-area-bottom .bottomPopup ul li span").removeClass("active");
                    if ($scope.isDailyMode) {
                        $scope.optionDaily = 5;
                        $scope.colprefBtnText = $filter('translate')('lbl_colView') + $scope.dailyViewCustomLayout;
                        if (dailyCustomcolumnDefs.length === 0) {
                            var parentColumnDef = JSON.parse(JSON.stringify(columnDefs1));
                            if (customLayouts.daily.parentColumnViewId === "2") {
                                parentColumnDef = JSON.parse(JSON.stringify(columnDefs2));
                            }
                            else if (customLayouts.daily.parentColumnViewId === "3") {
                                parentColumnDef = JSON.parse(JSON.stringify(columnDefs3));
                            }
                            else if (customLayouts.daily.parentColumnViewId === "4") {
                                parentColumnDef = JSON.parse(JSON.stringify(columnDefs4));
                            }
                            dailyCustomcolumnDefs = gridLayoutService.getColumnDef(parentColumnDef, customLayouts.daily.GCOLUMNS);
                            dailyCustomcolumnDefs[0].cellClass = "gridMainGrid";
                            dailyCustomcolumnDefs[0].headerCellClass = "monthendClass7";
                            $scope.countDay = $rootScope.countColumn;
                        }
                        var menuItemsNew = [
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-ok',
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return this.grid.options.enableFiltering;
                            }
                        },
                                {
                                    title: $filter('translate')('msg_Filter'),
                                    icon: 'ui-grid-icon-cancel',
                                    order: 0,
                                    action: function ($event) {
                                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                    },
                                    shown: function () {
                                        return !this.grid.options.enableFiltering;
                                    }
                                }];
                        for (var i = 0; i < dailyCustomcolumnDefs.length; i++) {
                            dailyCustomcolumnDefs[i].menuItems = menuItemsNew;
                        }
                        $scope.gridOptions.columnDefs = [];
                        $timeout(function () {
                            $scope.gridOptions.columnDefs = dailyCustomcolumnDefs;
                        });
                        $("#spnClmDailyViewCustomLayout").addClass("active");
                    }
                    else {
                        $scope.optionWeekly = 5;
                        $scope.colprefBtnText = $filter('translate')('lbl_colView') + $scope.weeklyViewCustomLayout;
                        if (weeklyCustomcolumnDefs.length === 0) {
                            var parentColumnDef = JSON.parse(JSON.stringify(columnDefsWeek1));
                            if (customLayouts.weekly.parentColumnViewId === "2") {
                                parentColumnDef = JSON.parse(JSON.stringify(columnDefsWeek2));
                            }
                            weeklyCustomcolumnDefs = gridLayoutService.getColumnDef(parentColumnDef, customLayouts.weekly.GCOLUMNS);
                            weeklyCustomcolumnDefs[0].cellClass = "gridMainGrid";
                            weeklyCustomcolumnDefs[0].headerCellClass = "monthendClass8";
                            $scope.countWeek = $rootScope.countColumn;
                        }
                        var menuItemsWeekNew = [
                                           {
                                               title: $filter('translate')('msg_Filter'),
                                               icon: 'ui-grid-icon-ok',
                                               action: function ($event) {
                                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                               },
                                               shown: function () {
                                                   return this.grid.options.enableFiltering;
                                               }
                                           },
                                                   {
                                                       title: $filter('translate')('msg_Filter'),
                                                       icon: 'ui-grid-icon-cancel',
                                                       order: 0,
                                                       action: function ($event) {
                                                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                                       },
                                                       shown: function () {
                                                           return !this.grid.options.enableFiltering;
                                                       }
                                                   }];
                        for (var i = 0; i < weeklyCustomcolumnDefs.length; i++) {
                            weeklyCustomcolumnDefs[i].menuItems = menuItemsWeekNew;
                        }
                        $scope.gridOptions.columnDefs = []
                        updateColWidthOnSelectCustomLayout(weeklyCustomcolumnDefs);
                        $timeout(function () {
                            $scope.gridOptions.columnDefs = weeklyCustomcolumnDefs;
                        });
                        $("#spnClmWeeklyViewCustomLayout").addClass("active");
                    }

                    break;
            }
            if ($scope.countDay != 1)
                localStorage.setItem('AllcolumnHidden', -1)

            $scope.showColViewMenu = false;
            //localStorage.removeItem("retrieveTimeEntriesDataSaved");
            //localStorage.removeItem("savedTimeEntriesRevDates");
            //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
           // $scope.refreshGridMain = false;
            $(window).resize();
            $scope.gridApi.core.refresh();
            $timeout(function () {
                $(window).resize();
                $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate), 2);
                //alert('hi');
            }, 0);
        }
        $scope.colPrefMenu = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.colPrefMenu");
            if (!$rootScope.columnBlank) {
                if (localStorage.isDailyMode == "true") {
                    if ($rootScope.dailyCustomFlag)
                        $scope.colViewVarTemp = 5;
                    else
                        $scope.colViewVarTemp = 4;
                    //$rootScope.weeklyCustomFlag = false;
                    if ($scope.optionDaily != undefined)
                        $scope.colViewVar = $scope.optionDaily
                    if ($scope.colViewVar == $scope.colViewVarTemp)
                        $scope.colViewVar = 1;
                    else
                        $scope.colViewVar += 1;
                }
                else {
                    if ($scope.optionWeekly != undefined)
                        $scope.colViewVar = $scope.optionWeekly
                    if ($scope.colViewVar == 4)
                        $scope.colViewVar = 1;
                    if ($rootScope.weeklyCustomFlag) {
                        if ($scope.colViewVar == 5)
                            $scope.colViewVar = 1;
                        else if ($scope.colViewVar == 2)
                            $scope.colViewVar = 5;
                        else
                            $scope.colViewVar += 1;
                    }
                    else {
                        if ($scope.colViewVar == 2)
                            $scope.colViewVar = 1;
                        else
                            $scope.colViewVar += 1;
                    }

                }
                if (localStorage.getItem('isMainGridLayoutChange') == "1") {
                    if ((!$rootScope.dailyCustomFlag && localStorage['isDailyMode'] == "true") || (!$rootScope.weeklyCustomFlag && localStorage['isDailyMode'] == "false"))
                        var sendData = {
                            msgList: [$filter('translate')('msg_cfrmMainGridSveLayOut')],
                            isCancelBtnOn: true,
                            okBtnText: $filter('translate')('btn_Yes'),
                            noBtnTxt: $filter('translate')('btn_No'),
                            popUpName: 'ConfrmSaveMainGrdLayout',
                            methodName: 'colViewToggle',
                            option: $scope.colViewVar
                        };
                    else
                        var sendData = {
                            msgList: [$filter('translate')('msg_overrideMainGridSveLayOut')],
                            isCancelBtnOn: true,
                            okBtnText: $filter('translate')('btn_Yes'),
                            noBtnTxt: $filter('translate')('btn_No'),
                            popUpName: 'OverrideSaveMainGrdLayout',
                            methodName: 'colViewToggle',
                            option: $scope.colViewVar
                        };
                    sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
                }
                else {
                    $scope.colPrefMenuTemp($scope.colViewVar);
                }
            }

            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }

        }

        $scope.showColViewMenu = false;
        $scope.colPrefShowMenu = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.colPrefShowMenu");
            if (!$rootScope.columnBlank) {
                $scope.showColViewMenu = !$scope.showColViewMenu
                if ($scope.showColViewMenu)
                    angular.element('#changedMenu').addClass("bgActive");
                else
                    angular.element('#changedMenu').removeClass("bgActive");

            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }

        }

        var item = $filter('translate')('lbl_item');
        var items = $filter('translate')('lbl_items');
        $scope.getHeader = function (row) {
            var tempGroupVal = row.treeNode.aggregations[0].groupVal;
            if ((row.treeNode.aggregations[0].col.name == "Component" || row.treeNode.aggregations[0].col.name == "ICCHRGE" || row.treeNode.aggregations[0].col.name == "ICDESC") && row.treeNode.aggregations[0].groupVal.trim() == "")
                tempGroupVal = "Null";
            return row.treeNode.aggregations[0].col.displayName + ": " + tempGroupVal + " (" + row.treeNode.aggregations[0].value + (row.treeNode.aggregations[0].value > 1 ? " " + items + ")" : " " + item + ")");
        }
        $scope.colViewType = "";
        $scope.bottomColPrefMenu = function (option, isFromUi) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.bottomColPrefMenu");
            if (isFromUi) {
                var mode = (localStorage.isDailyMode == "true") ? $scope.optionDaily : $scope.optionWeekly;
                if (mode === option) {
                    $scope.showColViewMenu = false; return;
                }
            }
            angular.element('#changedMenu').removeClass("bgActive");
            if ($scope.countDay == undefined)
                $scope.countDay = 3;
            if (localStorage.getItem('isMainGridLayoutChange') == "1") {
                if ((!$rootScope.dailyCustomFlag && localStorage['isDailyMode'] == "true") || (!$rootScope.weeklyCustomFlag && localStorage['isDailyMode'] == "false"))
                    var sendData = {
                        msgList: [$filter('translate')('msg_cfrmMainGridSveLayOut')],
                        isCancelBtnOn: true,
                        okBtnText: $filter('translate')('btn_Yes'),
                        noBtnTxt: $filter('translate')('btn_No'),
                        popUpName: 'ConfrmSaveMainGrdLayout',
                        methodName: 'colViewToggle',
                        option: option
                    };
                else
                    var sendData = {
                        msgList: [$filter('translate')('msg_overrideMainGridSveLayOut')],
                        isCancelBtnOn: true,
                        okBtnText: $filter('translate')('btn_Yes'),
                        noBtnTxt: $filter('translate')('btn_No'),
                        popUpName: 'OverrideSaveMainGrdLayout',
                        methodName: 'colViewToggle',
                        option: option
                    };
                sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
            }
            else {
                $scope.colPrefMenuTemp(option);
            }

        }

        $scope.onFocusCep = function (entity) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.onFocusCep");
            // $scope.isCepValdMsgOn = false;
            $scope.oldCep = entity.CEP_REC.CLIENO;
        }

        $scope.items = {
            "name": "Alabama",
            "abbreviation": "AL"
        };
        $scope.refreshResults = function (search) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.refreshResults");
            $scope.select = search.replace("-", " ").trim();
            var search = search;
            search = search.replace("-", " ").trim();
            if (search.length > 0) {
                if ($scope.IsSearchDropdown) {
                    $scope.PageNumber = 1;
                }

                cepService.searchCEPCode($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, search, $scope.PageNumber, $scope.DataPerPage, "", $scope.initialDetail.COMP_REC.COMPID, $scope.domainURL).then(function (response) {
                    if (parseInt(response.LOOKCEP_OUT_OBJ.RETCD) == 0) {
                        var leg = response.LOOKCEP_OUT_OBJ.CEP_ARR.length;
                        var b = leg !== undefined;
                        if (b) {
                            $scope.cpeListData = response.LOOKCEP_OUT_OBJ.CEP_ARR;
                            $scope.cpeListData = $scope.cpeListData.filter(function (item) {
                                return item.CLIENO !== '000000';
                            });
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
        $scope.name = ''; // This will hold the selected item
        $scope.onItemSelected = function () { // this gets executed when an item is selected
        };
        $scope.openEntryTitle = $filter('translate')('lbl_openEntry');
        $scope.dltTitle = $filter('translate')('btn_Delete');
        $scope.sbmtdTitle = $filter('translate')('lbl_entrySubmtd');
        $scope.nonBill = 'Non ' + $filter('translate')('lbl_entrySubmtd') + 'able';

        $scope.addFavActInline = function (activity) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.addFavActInline");
            $scope.searchText = '';
            var activityAr = [activity.ACTICD];
            var data = {
                "VARCHAR2": activityAr
            };
            var act_arr = JSON.stringify(data);
            activityService.addActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.ADDACTIFAV_OUT_OBJ.RETCD == 0) {
                    activityFavService.updateFavActLclStorage(true, [activity], 1);
                }
            });

        }
        $scope.removeFavActInline = function (activity) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.removeFavActInline");
            var data = {
                VARCHAR2: []
            }
            //remove the activity from the favourite list
            if (activity != null) {
                data.VARCHAR2 = [activity.ACTICD]
            }
            var act_arr = JSON.stringify(data);
            activityService.removeActivityFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, act_arr).then(function (response) {
                if (response.REMACTIFAV_OUT_OBJ.RETCD == 0) {
                    //remove the activity from the favourite list when showing only favourite activity
                    activityFavService.updateFavActLclStorage(false, [activity], 1);
                }
            })
        }
        /*add-remove favourites*/
        $scope.isFavDescription = function (val, favList) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.isFavDescription");
            if (favList == undefined) {
                favList = JSON.parse(sessionStorage.getItem('DescFav'));
            }
            if (val.length > 0) {
                var isExist = descFavService.isDescInFavList(val, favList);
                if (isExist) {
                    $scope.IsInlineDescFav = true;
                }
                else {
                    $scope.IsInlineDescFav = false;
                }
            }
        }
        $scope.addFavDescInline = function (description) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.addFavDescInline");
            if (description.trim().length > 0) {
                description = description.replace(/\t/g, " ");
                var favList = JSON.parse(sessionStorage.getItem('DescFav'));
                var isExist = descFavService.isDescInFavList(description, favList);
                if (isExist) {
                    //var duplicateDesc = $filter('translate')('msg_DuplicateDescription');
                    //showValidationMsg([duplicateDesc]);
                    return;
                }
                cepService.addDescriptionFavorite($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify(description)).then(function (response) {
                    if (response.ADDDESCFAV_OUT_OBJ.RETCD == 0) {
                        var updateDesc = response.ADDDESCFAV_OUT_OBJ.DESCOUT;
                        descFavService.updateFavDescLocalStorage(true, [updateDesc], false, 2);
                    }
                });
            }
        }

        $scope.removeFavDescInline = function (description) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.removeFavDescInline");
            if (description.trim().length > 0) {
                var favList = JSON.parse(sessionStorage.getItem('DescFav'));
                var data = {
                    "VARCHAR2": [description]
                };
                var destxt_arr = JSON.stringify(data);

                cepService.removeDescriptionFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, destxt_arr).then(function (response) {
                    if (response.REMDESCFAV_OUT_OBJ.RETCD == 0) {
                        descFavService.updateFavDescLocalStorage(false, [description], false, 2);
                    }
                });
            }
        }

        $scope.removeCepInlineFav = function (cepObj) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.removeCepInlineFav");
            var data = {
                "NUMBER": [cepObj.entity.CEP_REC.PRJID]
            };
            var prj_arr = JSON.stringify(data);
            cepService.removeCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
                if (parseInt(response.REMCEPFAV_OUT_OBJ.RETCD) == 0) {
                    broadcastService.updateDataSource(constantService.BroadCastUpdate.updateFavCep);
                    $scope.ISINLINECEPFAV = false;

                }
            });
        }
        $scope.addCepInlineFav = function (cepObj) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.addCepInlineFav");
            var data = {
                "NUMBER": [cepObj.entity.CEP_REC.PRJID]
            };
            var prj_arr = JSON.stringify(data);
            cepService.addCEPFavorites($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, prj_arr).then(function (response) {
                if (parseInt(response.ADDCEPFAV_OUT_OBJ.RETCD) == 0) {
                    $scope.ISINLINECEPFAV = true;
                    broadcastService.updateDataSource(constantService.BroadCastUpdate.updateFavCep);
                }
            });
        }
        var cepTemplate = '<div class="editShow" ng-repeat="c in grid.appScope.cepListDetails">  <section class="cep-heading"><strong class="cepCodeH">{{c.CLIENO + "-" + (c.ENGNO.length==1?"00":(c.ENGNO.length==2?"0":"")) + c.ENGNO + "-" + (c.PRJNO.length==1?"00":(c.PRJNO.length==2?"0":"")) + c.PRJNO}}</strong> {{" " + c.OCOMP + " " + (c.CHARBASIS=="N"?Billable:"Billable") + " -" + c.CHARBASIS}}</section>' +
                                          '  <section class="cep-category">' +
                                         '        <ul class="cep-subcategoryLeft">' +
                                                '    <li><b>{{::grid.appScope.RMTitle}}</b> <span> {{c.RMGR}}</span></li>' +
                                                   ' <li><b>{{::grid.appScope.EMTitle}}</b> <span> {{c.ENGCON}}</span></li>' +
                                                   ' <li><b>{{::grid.appScope.PMTitle}}</b> <span> {{c.PRJM}}</span></li>' +
                                               ' </ul>' +
                                               ' <ul class="cep-subcategoryRight">' +
                                                   ' <li><b>{{ ::"lbl_client" | translate }}</b> <span> {{c.CLIENAME}}</span></li>' +
                                                   ' <li><b>{{ ::"lbl_engmnt" | translate }}</b> <span> {{c.ENGNAME}}</span></li>' +
                                                  '  <li><b>{{ ::"lbl_Project" | translate }}</b> <span> {{c.PRJNAME}}</span></li>' +
                                               ' </ul>' +
                                                   ' </section></div>';
        var myHeaderCellTemplateDaily = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
         " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
         "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus \" col-index=\"renderIndex\" title=\"TOOLTIP\">" +
         "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\" title=\"{{grid.appScope.chrgBsTitle}}\">{{ col.displayName CUSTOM_FILTERS }}" +
         "</span> <span class=\"hideSortArrow\"  ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
                 "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var columnDefs2 = [
                {
                    name: 'Delete', cellClass: "gridMainGrid", headerCellClass: "monthendClass2", enableSorting: false, enableColumnMenu: false, displayName: '', width: '1.5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{((row.entity.TIMSUB | uppercase) == \'Y\') ?grid.appScope.sbmtdTitle:grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.deleteEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                },
                    {
                        field: 'Edit', enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '1.5%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-edit ui-grid-cell-contents" title="{{::grid.appScope.openEntryTitle}}"><input class="entry-edit" ng-click="grid.appScope.editTimeEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                    },
            {
                name: 'TYPE', suppressRemoveSort: true, displayName: $filter('translate')('lbl_type'), enableHiding: true, enableAgg: false, groupingShowAggregationMenu: false, visible: false, enableColumnResizing: false, width: '*', enableCellEdit: false, enableColumnResizing: true, cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.TYPE}}"><span ng-if="!row.groupHeader">{{row.entity.TYPE}}</span></div>', allowCellFocus: false,
                menuItems: [
                     {
                         title: $filter('translate')('msg_Filter'),
                         icon: 'ui-grid-icon-ok',
                         action: function ($event) {
                             this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                             this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                         },
                         shown: function () {
                             return this.grid.options.enableFiltering;
                         }
                     },
                            {
                                title: $filter('translate')('msg_Filter'),
                                icon: 'ui-grid-icon-cancel',
                                order: 0,
                                action: function ($event) {
                                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                },
                                shown: function () {
                                    return !this.grid.options.enableFiltering;
                                }
                            }]
            },
            {
                field: 'CEP_REC.CLIENO', width: cepWidth, enableHiding: false, enableAgg: false, sort: {
                    direction: uiGridConstants.ASC, priority: 0,
                }, groupingShowAggregationMenu: false, enableColumnResizing: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: true,
                cellTooltip: function (row, col) {
                    return row.entity.CEP_REC.CLIENO
                },
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],

                enableCellEditOnFocus: true,
                //cellTooltip:  function (row, col) {
                //    return row.entity.CEP_REC.CLIENO
                //},
                //cellTemplate:'Desktop/NewEntry/templates/CepToolTip.html',
                cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%">' + '<div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div>' +
               '<div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-mouseover="grid.appScope.xyPosition($event)" ng-if="!row.groupHeader"><div class="tooltip1 ui-grid-cell-contents"><div class="tooltiptext1"><div class="tooltip-heading"><ul><li><h4>{{row.entity.CEP_REC.CLIENAME}}</h4> <span class="flRight firstRight">{{row.entity.CEP_REC.OCOMP}}</span></li><li><span class="flLeft">{{row.entity.CEP_REC.CLIENO}}</span><span class="flRight"><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'C\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'S\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'R\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'N\') > -1"> Non {{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'T\') > -1" >{{::grid.appScope.BillableVar}}</span></span></li></ul></div> <div class="tooltip-desc"><ul><li><span class="flLeft">{{ ::"lbl_Project" | translate }}:</span> <span class="flRight">{{row.entity.CEP_REC.PRJNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_engmnt" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.ENGNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_prgrm" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.PROG}}</span></li><li><span class="flLeft">{{ ::"lbl_bsns" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.GLOBBUSI}}</span></li></ul></div></div> {{COL_FIELD}} </div></div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-cepFav"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.TEID}}" ui-mask="{{grid.appScope.cepMasking}}" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity, \'txtgridcep\' + row.entity.TEID)" />' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV!=true && grid.appScope.isCepFavSet\'><i class=\'fa fa-star-o\'></i></button>' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV==true && grid.appScope.isCepFavSet\' ><i class=\'fa fa-star\'></i></button>' +
                                        '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)"></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
            },
            {
                name: 'CEP_REC.CHARBASIS', width: widthCB, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('msg_CB'), enableCellEdit: false, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplateDaily,
                cellTemplate: '<div class="ui-grid-cell" style="width:100%;height:100%"><span ng-if="!row.groupHeader">{{row.entity.CEP_REC.CHARBASIS}}</span></div>', allowCellFocus: false,
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],
            },
            {
                name: 'ProjectActivity', width: '23%', suppressRemoveSort: true, displayName: $filter('translate')('msg_activityProjCNT'), groupingShowAggregationMenu: false, enableCellEdit: true, visible: false,

                cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.ProjectActivity}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ProjectActivity}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-Act"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridact\' + row.entity.TEID)" />' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                        '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i><!--<img ng-click="grid.appScope.loadDesktopActivityProject(row,true)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],
            },
            {
                name: 'Component', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Component'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true,

                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Component}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Component}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridcomponent\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridcomponent\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],
            },
            {
                name: 'Task', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Task'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableCellEditOnFocus: true,

                cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.Task}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Task}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridtask\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridtask\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i> <!--<img ng-click="grid.appScope.loadDesktopActivityProject(row,true)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
            {
                title: $filter('translate')('msg_Filter'),
                icon: 'ui-grid-icon-ok',
                action: function ($event) {
                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                },
                shown: function () {
                    return this.grid.options.enableFiltering;
                }
            },
        {
            title: $filter('translate')('msg_Filter'),
            icon: 'ui-grid-icon-cancel',
            order: 0,
            action: function ($event) {
                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            },
            shown: function () {
                return !this.grid.options.enableFiltering;
            }
        }],
            },
                      {
                          name: 'Scope', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Scope'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableCellEditOnFocus: true,
                          cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Scope}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader" >{{row.entity.Scope}}</div></div>',
                          editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridscope\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridscope\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',

                          cellEditableCondition: function ($scope) {
                              if ($scope.row.entity.TIMSUB == "Y") {
                                  //showMessagePopUp([submitMessage]);
                                  return 0;
                              } return 1
                          },
                          menuItems: [
                           {
                               title: $filter('translate')('msg_Filter'),
                               icon: 'ui-grid-icon-ok',
                               action: function ($event) {
                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                               },
                               shown: function () {
                                   return this.grid.options.enableFiltering;
                               }
                           },
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-cancel',
                                        order: 0,
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return !this.grid.options.enableFiltering;
                                        }
                                    }],
                      },
                      {
                          name: 'HRS', width: widthHours, suppressRemoveSort: true, displayName: $filter('translate')('lbl_HrsFull'), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, type: 'number',
                          cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                              var cellValue = grid.getCellValue(row, col);
                              if (cellValue >= -200 && cellValue < 0)
                                  return 'grid-cell-negative';
                              else
                                  return 'grid-cell-nonnegative';
                          },
                          cellTemplate: '<div  class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" class="rightAligRightPaddng" ng-if="!row.groupHeader" >{{row.entity.HRS |decimal}}</div></div>',
                          editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                          cellEditableCondition: function ($scope) {
                              if ($scope.row.entity.TIMSUB == "Y") {
                                  //showMessagePopUp([submitMessage]);
                                  return 0;
                              } return 1
                          },
                          menuItems: [
                           {
                               title: $filter('translate')('msg_Filter'),
                               icon: 'ui-grid-icon-ok',
                               action: function ($event) {
                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                               },
                               shown: function () {
                                   return this.grid.options.enableFiltering;
                               }
                           },
                                  {
                                      title: $filter('translate')('msg_Filter'),
                                      icon: 'ui-grid-icon-cancel',
                                      order: 0,
                                      action: function ($event) {
                                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                      },
                                      shown: function () {
                                          return !this.grid.options.enableFiltering;
                                      }
                                  }],
                      },
            {
                name: 'ICDESC', suppressRemoveSort: true, displayName: $filter('translate')('lbl_IcItem'), width: '*', groupingShowAggregationMenu: false, visible: false, enableCellEdit: true,
                cellTemplate: '<div class="ui-grid-cell" ng-attr-title="{{row.entity.ICDESC == \' \'?\'\':row.entity.ICDESC}}" style="width:100%;height:100"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader" >{{row.entity.ICDESC}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridicdesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadICItems()" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],
            },

            {
                name: 'DES', suppressRemoveSort: true, displayName: 'Description', groupingShowAggregationMenu: false, enableCellEdit: true, visible: false,
                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.DES}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.DES}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-desc"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgriddesc\' + row.entity.TEID)" />' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                        '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDescription(row.entity)" ></i></div>',
                // cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell"  tooltip = "{{row.entity.DES}}" tooltip-append-to-body="true"><span>{{row.entity.DES}}</span></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
             {
                 title: $filter('translate')('msg_Filter'),
                 icon: 'ui-grid-icon-ok',
                 action: function ($event) {
                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                 },
                 shown: function () {
                     return this.grid.options.enableFiltering;
                 }
             },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],
            }

        ];
        $scope.filterValue = function ($event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.filterValue");
            if (isNaN(String.fromCharCode($event.keyCode)) && $event.keyCode != 45 && $event.keyCode != 46) {
                $event.preventDefault();
            }
        };
        var submitMessage = $filter('translate')('lbl_entrySubmtd');;
        $scope.RMTitle = $filter('translate')('msg_RMTitle');
        $scope.EMTitle = $filter('translate')('msg_EMTitle');
        $scope.PMTitle = $filter('translate')('msg_PMTitle');
        $scope.initialDetail = $rootScope.GetInitialDetail(false, true);
        $scope.BillableVar = $filter('translate')('msg_BillableVar');
        $scope.chrgBsTitle = $filter('translate')('lbl_chrgBs2');
        var dailyCustomcolumnDefs = [];
        var weeklyCustomcolumnDefs = [];
        var columnDefs1 = [
            {
                name: 'Delete', cellClass: "gridMainGrid", headerCellClass: "monthendClass1", enableSorting: false, enableColumnMenu: false, displayName: '', width: '1.5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{((row.entity.TIMSUB | uppercase) == \'Y\') ?grid.appScope.sbmtdTitle:grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.deleteEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
            },
                    {
                        field: 'Edit', name: 'Edit', enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '1.5%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-edit ui-grid-cell-contents" title="{{::grid.appScope.openEntryTitle}}"><input class="entry-edit" ng-click="grid.appScope.editTimeEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                    },
                    {
                        name: 'TYPE', suppressRemoveSort: true, displayName: $filter('translate')('lbl_type'), enableHiding: true, enableAgg: false, groupingShowAggregationMenu: false, visible: false, enableColumnResizing: false, width: '*', enableCellEdit: false, enableColumnResizing: true, cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.TYPE}}"><span ng-if="!row.groupHeader">{{row.entity.TYPE}}</span></div>', allowCellFocus: false,
                        menuItems: [
                             {
                                 title: $filter('translate')('msg_Filter'),
                                 icon: 'ui-grid-icon-ok',
                                 action: function ($event) {
                                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                 },
                                 shown: function () {
                                     return this.grid.options.enableFiltering;
                                 }
                             },
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-cancel',
                                        order: 0,
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return !this.grid.options.enableFiltering;
                                        }
                                    }]
                    },
          {
              name: 'TEID', displayName: 'TEID', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, enableColumnResizing: false, allowCellFocus: false,
          },
        {
            name: 'CEP_REC', displayName: 'CEP_REC', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
        },
                      {
                          name: 'ACTI_REC', displayName: 'ACTI_REC', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                      },
                          {
                              name: 'CMPTID', displayName: 'CMPTID', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                          },
                              {
                                  name: 'TSKID', displayName: 'TSKID', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                              },
                      {
                          name: 'SCOID', displayName: 'SCOID', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                      },
                      {
                          name: 'REGFLAG', displayName: 'REGFLAG', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                      },
            {
                name: 'CEP_REC.CLIENO', field: 'CEP_REC.CLIENO', minWidth: cepWidth, width: cepWidth, enableHiding: false, enableAgg: false, sort: {
                    direction: uiGridConstants.ASC, priority: 0,
                }, groupingShowAggregationMenu: false, headerCellClass: 'cep_hover', enableColumnResizing: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: true,
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
          {
              title: $filter('translate')('msg_Filter'),
              icon: 'ui-grid-icon-ok',
              action: function ($event) {
                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              },
              shown: function () {
                  return this.grid.options.enableFiltering;
              }
          },
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-cancel',
                     order: 0,
                     action: function ($event) {
                         //$('.ui-grid-filter-input').val('');
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return !this.grid.options.enableFiltering;
                     }
                 }],

                enableCellEditOnFocus: true,
                //cellTooltip: function (row, col) {
                //    return row.entity.CEP_REC.CLIENO
                //},
                cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%">' + '<div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div>' +
'<div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-mouseover="grid.appScope.xyPosition($event)" ng-if="!row.groupHeader"><div class="tooltip1 ui-grid-cell-contents"><div class="tooltiptext1"><div class="tooltip-heading"><ul><li><h4>{{row.entity.CEP_REC.CLIENAME}}</h4> <span class="flRight firstRight">{{row.entity.CEP_REC.OCOMP}}</span></li><li><span class="flLeft">{{row.entity.CEP_REC.CLIENO}}</span><span class="flRight"><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'C\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'S\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'R\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'N\') > -1"> Non {{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'T\') > -1" >{{::grid.appScope.BillableVar}}</span></span></li></ul></div> <div class="tooltip-desc"><ul><li><span class="flLeft">{{ ::"lbl_Project" | translate   }}:</span> <span class="flRight">{{row.entity.CEP_REC.PRJNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_engmnt" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.ENGNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_prgrm" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.PROG}}</span></li><li><span class="flLeft">{{ ::"lbl_bsns" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.GLOBBUSI}}</span></li></ul></div></div> {{COL_FIELD}} </div></div>',
                // editableCellTemplate: '<div class="ui-grid-edit" style="width:100%;height:100%"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.TEID}}" ui-mask="?*?*?*?*?*?*?-?9?9?9?-?9?9?9" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor  ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity, \'txtgridcep\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-cepFav" style="width:100%;height:100%"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.TEID}}" ui-mask="{{grid.appScope.cepMasking}}" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor  ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity, \'txtgridcep\' + row.entity.TEID)" />' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV!=true && grid.appScope.isCepFavSet\'><i class=\'fa fa-star-o\'></i></button>' +
                                       '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV==true && grid.appScope.isCepFavSet\' ><i class=\'fa fa-star\'></i></button>' +
                                        '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
            },
            {
                name: 'CEP_REC.CHARBASIS', width: widthCB, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('msg_CB'), enableCellEdit: false, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplateDaily,
                //cellTemplate: '<div class="ui-grid-cell-contents  ui-grid-cell">{{row.entity.CEP_REC.CHARBASIS}}</div>', allowCellFocus: false,
                cellTemplate: '<div class="ui-grid-cell-nav" style="width:100%;height:100%"><span ng-if="!row.groupHeader">{{row.entity.CEP_REC.CHARBASIS}}</span></div>', allowCellFocus: false,

                menuItems: [
             {
                 title: $filter('translate')('msg_Filter'),
                 icon: 'ui-grid-icon-ok',
                 action: function ($event) {
                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                 },
                 shown: function () {
                     return this.grid.options.enableFiltering;
                 }
             },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],


            },
            {
                name: 'ProjectActivity', width: '23%', suppressRemoveSort: true, displayName: $filter('translate')('msg_activityProjCNT'), groupingShowAggregationMenu: false, enableCellEdit: true, visible: true,
                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.ProjectActivity}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader"  >{{row.entity.ProjectActivity}}</div></div>',
                // editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridact\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)"></i></div>',

                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-Act"><input class="favSpace" style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridact\' + row.entity.TEID)" />' +
                                                '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                                '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                            '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)"></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],
            },

            {
                name: 'Component', width: '*', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Component'), groupingShowAggregationMenu: false, visible: false, enableCellEdit: true,
                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Component}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader" >{{row.entity.Component}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridcomponent\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridcomponent\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],
            },
            {
                name: 'Task', width: '*', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Task'), groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, enableCellEditOnFocus: true,

                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Task}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader" >{{row.entity.Task}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridtask\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridtask\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
            {
                title: $filter('translate')('msg_Filter'),
                icon: 'ui-grid-icon-ok',
                action: function ($event) {
                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                },
                shown: function () {
                    return this.grid.options.enableFiltering;
                }
            },
        {
            title: $filter('translate')('msg_Filter'),
            icon: 'ui-grid-icon-cancel',
            order: 0,
            action: function ($event) {
                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            },
            shown: function () {
                return !this.grid.options.enableFiltering;
            }
        }],
            },
                      {
                          name: 'Scope', width: '*', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Scope'), groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, allowCellFocus: true, enableCellEditOnFocus: true,
                          cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Scope}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader" >{{row.entity.Scope}}</div></div>',
                          editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridscope\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"/><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                          cellEditableCondition: function ($scope) {
                              if ($scope.row.entity.TIMSUB == "Y") {
                                  //showMessagePopUp([submitMessage]);
                                  return 0;
                              } return 1


                          },
                          menuItems: [
                           {
                               title: $filter('translate')('msg_Filter'),
                               icon: 'ui-grid-icon-ok',
                               action: function ($event) {
                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                               },
                               shown: function () {
                                   return this.grid.options.enableFiltering;
                               }
                           },
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-cancel',
                                        order: 0,
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return !this.grid.options.enableFiltering;
                                        }
                                    }],
                      },
                      {
                          name: 'HRS', width: widthHours, suppressRemoveSort: true, displayName: $filter('translate')('lbl_HrsFull'), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, type: 'number',
                          cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                              var cellValue = grid.getCellValue(row, col);
                              if (cellValue >= -200 && cellValue < 0)
                                  return 'grid-cell-negative';
                              else
                                  return 'grid-cell-nonnegative';
                          },
                          cellTemplate: '<div  class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" class="rightAligRightPaddng" ng-if="!row.groupHeader" >{{row.entity.HRS |decimal}}</div></div>',
                          editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                          cellEditableCondition: function ($scope) {
                              if ($scope.row.entity.TIMSUB == "Y") {
                                  //showMessagePopUp([submitMessage]);
                                  return 0;
                              } return 1
                          },
                          menuItems: [
                           {
                               title: $filter('translate')('msg_Filter'),
                               icon: 'ui-grid-icon-ok',
                               action: function ($event) {
                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                               },
                               shown: function () {
                                   return this.grid.options.enableFiltering;
                               }
                           },
                                  {
                                      title: $filter('translate')('msg_Filter'),
                                      icon: 'ui-grid-icon-cancel',
                                      order: 0,
                                      action: function ($event) {
                                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                      },
                                      shown: function () {
                                          return !this.grid.options.enableFiltering;
                                      }
                                  }],
                      },
                              {
                                  name: 'ICDESC', suppressRemoveSort: true, displayName: $filter('translate')('lbl_IcItem'), width: '*', groupingShowAggregationMenu: false, visible: false, enableCellEdit: true,
                                  cellTemplate: '<div class="ui-grid-cell" style="width:100%;height:100" ng-attr-title="{{row.entity.ICDESC == \' \'?\'\':row.entity.ICDESC}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ICDESC}}</div></div>', allowCellFocus: true,
                                  editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridicdesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadICItems()" ></i></div>',

                                  cellEditableCondition: function ($scope) {
                                      if ($scope.row.entity.TIMSUB == "Y") {
                                          //showMessagePopUp([submitMessage]);
                                          return 0;
                                      } return 1
                                  },
                                  menuItems: [
                                   {
                                       title: $filter('translate')('msg_Filter'),
                                       icon: 'ui-grid-icon-ok',
                                       action: function ($event) {
                                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                       },
                                       shown: function () {
                                           return this.grid.options.enableFiltering;
                                       }
                                   },
                                        {
                                            title: $filter('translate')('msg_Filter'),
                                            icon: 'ui-grid-icon-cancel',
                                            order: 0,
                                            action: function ($event) {
                                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                            },
                                            shown: function () {
                                                return !this.grid.options.enableFiltering;
                                            }
                                        }],
                              },

                                          {
                                              name: 'DES', width: '*', suppressRemoveSort: true, displayName: 'Description', groupingShowAggregationMenu: false, enableCellEdit: true,
                                              cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.DES}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader"  >{{row.entity.DES}}</div></div>',
                                              //editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgriddesc\' + row.entity.TEID)" /><i ng-click="grid.appScope.loadDescription(row.entity)" class="glyphicon glyphicon-triangle-bottom"></i><!--<img ng-click="grid.appScope.showInfo(row)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                                              editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-desc"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change=\'grid.appScope.isFavDescription(row.entity.DES.trim())\' ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgriddesc\' + row.entity.TEID)" />' +
                                                                    '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                                                     '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                                                    '<i ng-click="grid.appScope.loadDescription(row.entity)" class="glyphicon glyphicon-triangle-bottom"></i><!--<img ng-click="grid.appScope.showInfo(row)" src="img/arrow.png" alt="" width="15" height="12">--></div>',

                                              // cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell"  tooltip = "{{row.entity.DES}}" tooltip-append-to-body="true"><span>{{row.entity.DES}}</span></div>',
                                              cellEditableCondition: function ($scope) {
                                                  if ($scope.row.entity.TIMSUB == "Y") {
                                                      //showMessagePopUp([submitMessage]);
                                                      return 0;
                                                  } return 1
                                              },

                                              menuItems: [
                                           {
                                               title: $filter('translate')('msg_Filter'),
                                               icon: 'ui-grid-icon-ok',
                                               action: function ($event) {
                                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                               },
                                               shown: function () {
                                                   return this.grid.options.enableFiltering;
                                               }
                                           },
                                                  {
                                                      title: $filter('translate')('msg_Filter'),
                                                      icon: 'ui-grid-icon-cancel',
                                                      order: 0,
                                                      action: function ($event) {
                                                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                                      },
                                                      shown: function () {
                                                          return !this.grid.options.enableFiltering;
                                                      }
                                                  }],
                                          }


        ];
        //$scope.day = "";
        var myHeaderCellTemplateNoHours = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
        " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
        "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"TOOLTIP\">" +
        "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small class=\"blankSpaceWeekNonHours\" ng-bind=\" \"></small></span>" +
        "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
             "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";
        var myHeaderCellTemplateCB = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
            " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
            "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"TOOLTIP\">" +
            "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small class=\"blankSpaceWeekNonHours\" ng-bind=\" \"></small></span>" +
            "</span> <span class=\"hideSortArrow\" ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
                 "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";


        var myHeaderCellTemplate1 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
        " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
        "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 0)}}\">" +
        "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 0)\"></small></span>" +
        "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
                "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var myHeaderCellTemplate2 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
     " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
     "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 1)}}\">" +
     "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 1)\"></small></span>" +
     "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
             "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var myHeaderCellTemplate3 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
     " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
    "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 2)}}\">" +
    "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 2)\"></small></span>" +
    "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
            "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";


        var myHeaderCellTemplate4 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
     " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
    "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 3)}}\">" +
    "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 3)\"></small></span>" +
    "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
            "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var myHeaderCellTemplate5 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
     " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
    "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 4)}}\">" +
    "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 4)\"></small></span>" +
    "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
            "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var myHeaderCellTemplate6 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
     " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
    "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 5)}}\">" +
    "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 5)\"></small></span>" +
    "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
            "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var myHeaderCellTemplate7 = "<div role=\"columnheader\" ng-class=\"{ 'sortable': sortable, 'sortActive' :(col.footerCellClass=='removeSortClass'?false:(col.sort.direction == asc?true:(col.sort.direction == desc?true:false))) }\" ui-grid-one-bind-aria-labelledby-grid=\"col.uid + '-header-text '+col.uid + '-sortdir-text'\"" +
     " aria-sort=\"{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}\">" +
    "<div role=\"button\" tabindex=\"0\" class=\"ui-grid-cell-contents ui-grid-header-cell-primary-focus textAlignCenter\" col-index=\"renderIndex\" title=\"{{grid.appScope.getWeeklyDateTooltip(grid.appScope.weeklyStartDate, 6)}}\">" +
    "<span class=\"ui-grid-header-cell-label\" ui-grid-one-bind-id-grid=\"col.uid + '-header-text'\"><span>{{ col.displayName CUSTOM_FILTERS }}<small ng-bind=\"grid.appScope.getWeeklyDayDate(grid.appScope.weeklyStartDate, 6)\"></small></span>" +
    "</span> <span ui-grid-one-bind-id-grid=\"col.uid + '-sortdir-text'\" ui-grid-visible=\"col.sort.direction\" aria-label=\"{{getSortDirectionAriaLabel()}}\">" +
            "<i ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\" title=\"{{col.sort.priority ? i18n.headerCell.priority + ' ' + col.sort.priority : null}}\" aria-hidden=\"true\"></i> <sub class=\"ui-grid-sort-priority-number\">{{col.sort.priority}}</sub></span></div><div role=\"button\" tabindex=\"0\" ui-grid-one-bind-id-grid=\"col.uid + '-menu-button'\" class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\" ui-grid-one-bind-aria-label=\"i18n.headerCell.aria.columnMenuButtonLabel\" aria-haspopup=\"true\"><i class=\"ui-grid-icon-angle-down\" aria-hidden=\"true\">&nbsp;</i></div><div ui-grid-filter></div></div>";

        var columnDefsWeek1 = [
           {
               name: 'Delete', isWeek: true, cellClass: "gridMainGrid", headerCellClass: "monthendClass5", enableSorting: false, enableColumnMenu: false, displayName: '', width: '1%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-delete ui-grid-cell-contents" title="{{((row.entity.TIMSUB | uppercase) == \'Y\') ?grid.appScope.sbmtdTitle:grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.deleteEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
           },
                    {
                        field: 'Edit', enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '1%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-edit ui-grid-cell-contents"  title="{{::grid.appScope.openEntryTitle}}"><input class="entry-edit" ng-click="grid.appScope.editTimeEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                    },

          {
              name: 'TEID', displayName: 'TEID', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
          },
        {
            name: 'CEP_REC', displayName: 'CEP_REC', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
        },
                      {
                          name: 'ACTI_REC', displayName: 'ACTI_REC', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                      },
                          {
                              name: 'CMPTID', displayName: 'CMPTID', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                          },
                              {
                                  name: 'TSKID', displayName: 'TSKID', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                              },
                      {
                          name: 'SCOID', displayName: 'SCOID', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                      },
                      {
                          name: 'REGFLAG', displayName: 'REGFLAG', width: 0, enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false, allowCellFocus: false
                      },
            {
                field: 'data.CEP_REC.CLIENO', minWidth: cepWidth, width: cepWidth, enableColumnResizing: false, enableHiding: false, enableAgg: false, sort: {
                    direction: uiGridConstants.ASC, priority: 0,
                }, headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: true,
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
          {
              title: $filter('translate')('msg_Filter'),
              icon: 'ui-grid-icon-ok',
              action: function ($event) {
                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              },
              shown: function () {
                  return this.grid.options.enableFiltering;
              }
          },
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-cancel',
                     order: 0,
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return !this.grid.options.enableFiltering;
                     }
                 }],

                enableCellEditOnFocus: true,
                //cellTooltip: function (row, col) {
                //    return row.entity.CEP_REC.CLIENO
                //},
                cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%">' + '<div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div>' +
    '<div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-mouseover="grid.appScope.xyPosition($event)" ng-if="!row.groupHeader"><div class="tooltip1 ui-grid-cell-contents"><div class="tooltiptext1"><div class="tooltip-heading"><ul><li><h4>{{row.entity.data.CEP_REC.CLIENAME}}</h4> <span class="flRight firstRight">{{row.entity.data.CEP_REC.OCOMP}}</span></li><li><span class="flLeft">{{row.entity.data.CEP_REC.CLIENO}}</span><span class="flRight"><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'N\') > -1"> Non {{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'T\') > -1" >{{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'C\') > -1"> Chargeable</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'S\') > -1"> Chargeable</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'R\') > -1"> Chargeable</span></span></li></ul></div> <div class="tooltip-desc"><ul><li><span class="flLeft">{{ ::"lbl_Project" | translate }}:</span> <span class="flRight">{{row.entity.data.CEP_REC.PRJNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_engmnt" | translate }}:</span><span class="flRight">{{row.entity.data.CEP_REC.ENGNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_prgrm" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.PROG}}</span></li><li><span class="flLeft">{{ ::"lbl_bsns" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.GLOBBUSI}}</span></li></ul></div></div> {{COL_FIELD}} </div></div>',
                //editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.data.TEID}}" ui-mask="?*?*?*?*?*?*?-?9?9?9?-?9?9?9" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity.data, \'txtgridcep\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-cepFav"><input style="width:1000%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.data.TEID}}" ui-mask="{{grid.appScope.cepMasking}}" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity.data, \'txtgridcep\' + row.entity.data.TEID)" />' +
                                             '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV!=true && grid.appScope.isCepFavSet\'><i class=\'fa fa-star-o\'></i></button>' +
                                            '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV==true && grid.appScope.isCepFavSet\' ><i class=\'fa fa-star\'></i></button>' +
                                             ' <i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
            },
            {
                name: 'data.CEP_REC.CHARBASIS', minWidth: 30, width: 47, headerCellTemplate: myHeaderCellTemplateCB, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('msg_CB'), enableCellEditOnFocus: false, enableCellEdit: false, enableColumnResizing: false,
                cellTemplate: '<div style="width:100%;height:100%"><span ng-if="!row.groupHeader">{{row.entity.data.CEP_REC.CHARBASIS}}</span></div>', allowCellFocus: false,

                menuItems: [
             {
                 title: $filter('translate')('msg_Filter'),
                 icon: 'ui-grid-icon-ok',
                 action: function ($event) {
                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                 },
                 shown: function () {
                     return this.grid.options.enableFiltering;
                 }
             },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],


            },
            {
                name: 'ProjectActivity', width: 140, suppressRemoveSort: true, displayName: $filter('translate')('msg_activityProjCNT'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, enableCellEdit: true, visible: true,
                cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.ProjectActivity}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ProjectActivity}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-Act"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridact\' + row.entity.data.TEID)" />' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                        '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)"></i><!--<img ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],
            },

            {
                name: 'Component', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Component'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, visible: false, enableCellEdit: true,

                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Component}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Component}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridcomponent\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridcomponent\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],
            },
            {
                name: 'Task', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Task'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, enableCellEditOnFocus: true,

                cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.Task}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Task}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridtask\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridtask\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
            {
                title: $filter('translate')('msg_Filter'),
                icon: 'ui-grid-icon-ok',
                action: function ($event) {
                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                },
                shown: function () {
                    return this.grid.options.enableFiltering;
                }
            },
        {
            title: $filter('translate')('msg_Filter'),
            icon: 'ui-grid-icon-cancel',
            order: 0,
            action: function ($event) {
                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            },
            shown: function () {
                return !this.grid.options.enableFiltering;
            }
        }],
            },
                      {
                          name: 'Scope', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Scope'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, enableCellEditOnFocus: true,
                          cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Scope}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Scope}}</div></div>',
                          editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridscope\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridscope\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',

                          cellEditableCondition: function ($scope) {
                              if ($scope.row.entity.TIMSUB == "Y") {
                                  //showMessagePopUp([submitMessage]);
                                  return 0;
                              } return 1
                          },
                          menuItems: [
                           {
                               title: $filter('translate')('msg_Filter'),
                               icon: 'ui-grid-icon-ok',
                               action: function ($event) {
                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                               },
                               shown: function () {
                                   return this.grid.options.enableFiltering;
                               }
                           },
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-cancel',
                                        order: 0,
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return !this.grid.options.enableFiltering;
                                        }
                                    }],
                      },

                           {
                               name: 'Hrs1', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy1').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate1, type: 'number',
                               cellTemplate: '<div class="ui-grid-cell rightAlig" ><div ng-click="grid.appScope.stopEditOnCtrlClick($event,0)" class="rightAligRightPaddng" ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs1==null?row.entity.Hrs1:(row.entity.Hrs1|decimal)}}</div></div>',
                               editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs1\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                               cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                   var cellValue = grid.getCellValue(row, col);
                                   if (cellValue >= -200 && cellValue < 0)
                                       return 'grid-cell-negative';
                                   else
                                       return 'grid-cell-nonnegative';
                               },
                               cellEditableCondition: function ($scope) {
                                   if ($scope.row.entity.TIMSUB == "Y") {
                                       //showMessagePopUp([submitMessage]);
                                       return 0;
                                   }
                                   else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                       var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                       tempDate.setDate(tempDate.getDate() + 0);
                                       if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                           return 0;
                                       }
                                   }
                                   return 1
                               },
                               menuItems: [
                                {
                                    title: $filter('translate')('msg_Filter'),
                                    icon: 'ui-grid-icon-ok',
                                    action: function ($event) {
                                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                    },
                                    shown: function () {
                                        return this.grid.options.enableFiltering;
                                    }
                                },
                                     {
                                         title: $filter('translate')('msg_Filter'),
                                         icon: 'ui-grid-icon-cancel',
                                         order: 0,
                                         action: function ($event) {
                                             this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                             this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                         },
                                         shown: function () {
                                             return !this.grid.options.enableFiltering;
                                         }
                                     }],
                           },

                           {
                               name: 'Hrs2', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy2').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate2, type: 'number',
                               cellTemplate: '<div class="ui-grid-cell rightAlig" ><div ng-click="grid.appScope.stopEditOnCtrlClick($event,1)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs2==null?row.entity.Hrs2:(row.entity.Hrs2|decimal)}}</div></div>',
                               editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs2\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                               cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                   var cellValue = grid.getCellValue(row, col);
                                   if (cellValue >= -200 && cellValue < 0)
                                       return 'grid-cell-negative';
                                   else
                                       return 'grid-cell-nonnegative';
                               },
                               cellEditableCondition: function ($scope) {
                                   if ($scope.row.entity.TIMSUB == "Y") {
                                       //showMessagePopUp([submitMessage]);
                                       return 0;
                                   }
                                   else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                       var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                       tempDate.setDate(tempDate.getDate() + 1);
                                       if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                           return 0;
                                       }
                                   }
                                   return 1
                               },
                               menuItems: [
                                {
                                    title: $filter('translate')('msg_Filter'),
                                    icon: 'ui-grid-icon-ok',
                                    action: function ($event) {
                                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                    },
                                    shown: function () {
                                        return this.grid.options.enableFiltering;
                                    }
                                },
                                     {
                                         title: $filter('translate')('msg_Filter'),
                                         icon: 'ui-grid-icon-cancel',
                                         order: 0,
                                         action: function ($event) {
                                             this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                             this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                         },
                                         shown: function () {
                                             return !this.grid.options.enableFiltering;
                                         }
                                     }],
                           },
                            {
                                name: 'Hrs3', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy3').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate3, type: 'number',
                                cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,2)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs3==null?row.entity.Hrs3:(row.entity.Hrs3|decimal)}}</div></div>',
                                editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs3\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                    var cellValue = grid.getCellValue(row, col);
                                    if (cellValue >= -200 && cellValue < 0)
                                        return 'grid-cell-negative';
                                    else
                                        return 'grid-cell-nonnegative';
                                },
                                cellEditableCondition: function ($scope) {
                                    if ($scope.row.entity.TIMSUB == "Y") {
                                        //showMessagePopUp([submitMessage]);
                                        return 0;
                                    }
                                    else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                        var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                        tempDate.setDate(tempDate.getDate() + 2);
                                        if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                            return 0;
                                        }
                                    }
                                    return 1
                                },
                                menuItems: [
                                 {
                                     title: $filter('translate')('msg_Filter'),
                                     icon: 'ui-grid-icon-ok',
                                     action: function ($event) {
                                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                     },
                                     shown: function () {
                                         return this.grid.options.enableFiltering;
                                     }
                                 },
                                      {
                                          title: $filter('translate')('msg_Filter'),
                                          icon: 'ui-grid-icon-cancel',
                                          order: 0,
                                          action: function ($event) {
                                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                          },
                                          shown: function () {
                                              return !this.grid.options.enableFiltering;
                                          }
                                      }],
                            },
                             {
                                 name: 'Hrs4', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy4').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate4, type: 'number',
                                 cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,3)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs4==null?row.entity.Hrs4:(row.entity.Hrs4|decimal)}}</div></div>',
                                 editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs4\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                 cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                     var cellValue = grid.getCellValue(row, col);
                                     if (cellValue >= -200 && cellValue < 0)
                                         return 'grid-cell-negative';
                                     else
                                         return 'grid-cell-nonnegative';
                                 },
                                 cellEditableCondition: function ($scope) {
                                     if ($scope.row.entity.TIMSUB == "Y") {
                                         //showMessagePopUp([submitMessage]);
                                         return 0;
                                     }
                                     else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                         var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                         tempDate.setDate(tempDate.getDate() + 3);
                                         if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                             return 0;
                                         }
                                     }
                                     return 1
                                 },
                                 menuItems: [
                                  {
                                      title: $filter('translate')('msg_Filter'),
                                      icon: 'ui-grid-icon-ok',
                                      action: function ($event) {
                                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                      },
                                      shown: function () {
                                          return this.grid.options.enableFiltering;
                                      }
                                  },
                                       {
                                           title: $filter('translate')('msg_Filter'),
                                           icon: 'ui-grid-icon-cancel',
                                           order: 0,
                                           action: function ($event) {
                                               this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                               this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                           },
                                           shown: function () {
                                               return !this.grid.options.enableFiltering;
                                           }
                                       }],
                             },
                              {
                                  name: 'Hrs5', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy5').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate5, type: 'number',
                                  cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,4)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs5==null?row.entity.Hrs5:(row.entity.Hrs5|decimal)}}</div></div>',
                                  editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs5\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                  cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                      var cellValue = grid.getCellValue(row, col);
                                      if (cellValue >= -200 && cellValue < 0)
                                          return 'grid-cell-negative';
                                      else
                                          return 'grid-cell-nonnegative';
                                  },
                                  cellEditableCondition: function ($scope) {
                                      if ($scope.row.entity.TIMSUB == "Y") {
                                          //showMessagePopUp([submitMessage]);
                                          return 0;
                                      }
                                      else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                          var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                          tempDate.setDate(tempDate.getDate() + 4);
                                          if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                              return 0;
                                          }
                                      }
                                      return 1
                                  },

                                  menuItems: [
                                   {
                                       title: $filter('translate')('msg_Filter'),
                                       icon: 'ui-grid-icon-ok',
                                       action: function ($event) {
                                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                       },
                                       shown: function () {
                                           return this.grid.options.enableFiltering;
                                       }
                                   },
                                        {
                                            title: $filter('translate')('msg_Filter'),
                                            icon: 'ui-grid-icon-cancel',
                                            order: 0,
                                            action: function ($event) {
                                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                            },
                                            shown: function () {
                                                return !this.grid.options.enableFiltering;
                                            }
                                        }],
                              },
                              {
                                  name: 'Hrs6', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy6').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate6, type: 'number',
                                  cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,5)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs6==null?row.entity.Hrs6:(row.entity.Hrs6|decimal)}}</div></div>',
                                  editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs6\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                  cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                      var cellValue = grid.getCellValue(row, col);
                                      if (cellValue >= -200 && cellValue < 0)
                                          return 'grid-cell-negative';
                                      else
                                          return 'grid-cell-nonnegative';
                                  },
                                  cellEditableCondition: function ($scope) {
                                      if ($scope.row.entity.TIMSUB == "Y") {
                                          //showMessagePopUp([submitMessage]);
                                          return 0;
                                      }
                                      else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                          var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                          tempDate.setDate(tempDate.getDate() + 5);
                                          if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                              return 0;
                                          }
                                      }
                                      return 1
                                  },
                                  menuItems: [
                                   {
                                       title: $filter('translate')('msg_Filter'),
                                       icon: 'ui-grid-icon-ok',
                                       action: function ($event) {
                                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                       },
                                       shown: function () {
                                           return this.grid.options.enableFiltering;
                                       }
                                   },
                                        {
                                            title: $filter('translate')('msg_Filter'),
                                            icon: 'ui-grid-icon-cancel',
                                            order: 0,
                                            action: function ($event) {
                                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                            },
                                            shown: function () {
                                                return !this.grid.options.enableFiltering;
                                            }
                                        }],
                              },
                               {
                                   name: 'Hrs7', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy7').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate7, type: 'number',
                                   cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,6)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs7==null?row.entity.Hrs7:(row.entity.Hrs7|decimal)}}</div></div>',
                                   editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs7\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                   cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                       var cellValue = grid.getCellValue(row, col);
                                       if (cellValue >= -200 && cellValue < 0)
                                           return 'grid-cell-negative';
                                       else
                                           return 'grid-cell-nonnegative';
                                   },
                                   cellEditableCondition: function ($scope) {
                                       if ($scope.row.entity.TIMSUB == "Y") {
                                           //showMessagePopUp([submitMessage]);
                                           return 0;

                                       }
                                       else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                           var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                           tempDate.setDate(tempDate.getDate() + 6);
                                           if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                               return 0;
                                           }
                                       }
                                       return 1
                                   },
                                   menuItems: [
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-ok',
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return this.grid.options.enableFiltering;
                                        }
                                    },
                                         {
                                             title: $filter('translate')('msg_Filter'),
                                             icon: 'ui-grid-icon-cancel',
                                             order: 0,
                                             action: function ($event) {
                                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                             },
                                             shown: function () {
                                                 return !this.grid.options.enableFiltering;
                                             }
                                         }],
                               },
                                     {
                                         name: 'HrsTotal', width: 52, suppressRemoveSort: true, displayName: $filter('translate')('lbl_Total'), enableHiding: false, headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: false, enableCellEditOnFocus: false, enableColumnResizing: false, type: 'number', allowCellFocus: false,
                                         cellTemplate: '<div class="ui-grid-cell rightAlig"><span class="ctrlReadOnly rightAligRightPaddng" ng-if="!row.groupHeader">{{grid.appScope.weekHrsTotal(row.entity)}}</span></div>',
                                         cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                             var cellValue = grid.getCellValue(row, col);
                                             if (cellValue < 0)
                                                 return 'grid-cell-negative';
                                             else
                                                 return 'grid-cell-nonnegative';
                                         },
                                         menuItems: [
                                       {
                                           title: $filter('translate')('msg_Filter'),
                                           icon: 'ui-grid-icon-ok',
                                           action: function ($event) {
                                               this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                               this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                           },
                                           shown: function () {
                                               return this.grid.options.enableFiltering;
                                           }
                                       },
                                            {
                                                title: $filter('translate')('msg_Filter'),
                                                icon: 'ui-grid-icon-cancel',
                                                order: 0,
                                                action: function ($event) {
                                                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                                },
                                                shown: function () {
                                                    return !this.grid.options.enableFiltering;
                                                }
                                            }],
                                     },

                                          {
                                              name: 'DES', width: '*', suppressRemoveSort: true, displayName: 'Description', headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, enableCellEdit: true,
                                              cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.DES}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.DES}}</div></div>',
                                              editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-desc"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" />' +
                                                                    '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                                                    '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                                                     '<i ng-click="grid.appScope.loadDescription(row.entity)" class="glyphicon glyphicon-triangle-bottom"></i></div>',
                                              // cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell"  tooltip = "{{row.entity.data.DES}}" tooltip-append-to-body="true"><span>{{row.entity.data.DES}}</span></div>',
                                              cellEditableCondition: function ($scope) {
                                                  if ($scope.row.entity.TIMSUB == "Y") {
                                                      //showMessagePopUp([submitMessage]);
                                                      return 0;
                                                  } return 1
                                              },
                                              menuItems: [
                                           {
                                               title: $filter('translate')('msg_Filter'),
                                               icon: 'ui-grid-icon-ok',
                                               action: function ($event) {
                                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                               },
                                               shown: function () {
                                                   return this.grid.options.enableFiltering;
                                               }
                                           },
                                                  {
                                                      title: $filter('translate')('msg_Filter'),
                                                      icon: 'ui-grid-icon-cancel',
                                                      order: 0,
                                                      action: function ($event) {
                                                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                                      },
                                                      shown: function () {
                                                          return !this.grid.options.enableFiltering;
                                                      }
                                                  }],
                                          }

        ];

        var columnDefsWeek2 = [
           {
               allowCellFocus: false, name: 'Delete', isWeek: true, cellClass: "gridMainGrid", headerCellClass: "monthendClass6", enableSorting: false, enableColumnMenu: false, displayName: '', width: '1.5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader"  class="icon-delete ui-grid-cell-contents" title="{{((row.entity.TIMSUB | uppercase) == \'Y\') ?grid.appScope.sbmtdTitle:grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.deleteEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>'
           },
                    {
                        allowCellFocus: false, field: 'Edit', enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '1.5%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-edit ui-grid-cell-contents"  title="{{::grid.appScope.openEntryTitle}}"><input class="entry-edit" ng-click="grid.appScope.editTimeEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>'
                    },

          {
              name: 'TEID', displayName: 'TEID', width: '*', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
          },
        {
            name: 'CEP_REC', displayName: 'CEP_REC', width: '20%', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
        },
                      {
                          name: 'ACTI_REC', displayName: 'ACTI_REC', width: '20%', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
                      },
                          {
                              name: 'CMPTID', displayName: 'CMPTID', width: '20%', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
                          },
                              {
                                  name: 'TSKID', displayName: 'TSKID', width: '*', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
                              },
                      {
                          name: 'SCOID', displayName: 'SCOID', width: '*', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
                      },
                      {
                          name: 'REGFLAG', displayName: 'REGFLAG', width: '*', enableHiding: false, groupingShowAggregationMenu: false, visible: false, enableCellEdit: false, enableColumnResizing: false
                      },
            {
                field: 'data.CEP_REC.CLIENO', width: cepWidth, enableHiding: false, enableAgg: false, sort: {
                    direction: uiGridConstants.ASC, priority: 0,
                }, headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, enableColumnResizing: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: true,
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
          {
              title: $filter('translate')('msg_Filter'),
              icon: 'ui-grid-icon-ok',
              action: function ($event) {
                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              },
              shown: function () {
                  return this.grid.options.enableFiltering;
              }
          },
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-cancel',
                     order: 0,
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return !this.grid.options.enableFiltering;
                     }
                 }],

                enableCellEditOnFocus: true,
                //cellTooltip: function (row, col) {
                //    return row.entity.CEP_REC.CLIENO
                //},
                cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%">' + '<div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div>' +
        '<div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-mouseover="grid.appScope.xyPosition($event)" ng-if="!row.groupHeader"><div class="tooltip1 ui-grid-cell-contents"><div class="tooltiptext1"><div class="tooltip-heading"><ul><li><h4>{{row.entity.data.CEP_REC.CLIENAME}}</h4> <span class="flRight firstRight">{{row.entity.data.CEP_REC.OCOMP}}</span></li><li><span class="flLeft">{{row.entity.data.CEP_REC.CLIENO}}</span><span class="flRight"><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'N\') > -1"> Non {{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'T\') > -1" >{{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'C\') > -1"> Chargeable</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'S\') > -1"> Chargeable</span><span ng-if="row.entity.data.CEP_REC.CHARBASIS.indexOf(\'R\') > -1"> Chargeable</span></span></li></ul></div> <div class="tooltip-desc"><ul><li><span class="flLeft">{{ ::"lbl_Project" | translate }}:</span> <span class="flRight">{{row.entity.data.CEP_REC.PRJNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_engmnt" | translate }}:</span><span class="flRight">{{row.entity.data.CEP_REC.ENGNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_prgrm" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.PROG}}</span></li><li><span class="flLeft">{{ ::"lbl_bsns" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.GLOBBUSI}}</span></li></ul></div></div> {{COL_FIELD}} </div></div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-cepFav"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.data.TEID}}" ui-mask="{{grid.appScope.cepMasking}}" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity.data, \'txtgridcep\' + row.entity.data.TEID)" />' +
                                            '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV!=true && grid.appScope.isCepFavSet\'><i class=\'fa fa-star-o\'></i></button>' +
                                            '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV==true && grid.appScope.isCepFavSet\' ><i class=\'fa fa-star\'></i></button>' +
                                            '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',

            },
            {
                name: 'data.CEP_REC.CHARBASIS', minWidth: 30, width: 47, headerCellTemplate: myHeaderCellTemplateCB, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('msg_CB'), enableCellEdit: false, enableColumnResizing: false,
                cellTemplate: '<div class="ui-grid-cell" style="width:100%;height:100%"><span ng-if="!row.groupHeader">{{row.entity.data.CEP_REC.CHARBASIS}}</span></div>', allowCellFocus: false,
                menuItems: [
             {
                 title: $filter('translate')('msg_Filter'),
                 icon: 'ui-grid-icon-ok',
                 action: function ($event) {
                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                 },
                 shown: function () {
                     return this.grid.options.enableFiltering;
                 }
             },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],


            },
            {
                name: 'ProjectActivity', width: 140, suppressRemoveSort: true, displayName: $filter('translate')('msg_activityProjCNT'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, enableCellEdit: true, visible: false,
                cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.ProjectActivity}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ProjectActivity}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-Act"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridact\' + row.entity.data.TEID)" />' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                        '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                        '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)"></i><!--<img ng-model="MODEL_COL_FIELD" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-cancel',
                            order: 0,
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return !this.grid.options.enableFiltering;
                            }
                        }],
            },

            {
                name: 'Component', width: "*", suppressRemoveSort: true, displayName: $filter('translate')('lbl_Component'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, visible: true, enableCellEdit: true,

                cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Component}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Component}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridcomponent\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridcomponent\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
                    {
                        title: $filter('translate')('msg_Filter'),
                        icon: 'ui-grid-icon-cancel',
                        order: 0,
                        action: function ($event) {
                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        },
                        shown: function () {
                            return !this.grid.options.enableFiltering;
                        }
                    }],
            },
            {
                name: 'Task', width: "*", suppressRemoveSort: true, displayName: $filter('translate')('lbl_Task'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableCellEditOnFocus: true,

                cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.Task}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Task}}</div></div>',
                editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridtask\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridtask\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                cellEditableCondition: function ($scope) {
                    if ($scope.row.entity.TIMSUB == "Y") {
                        //showMessagePopUp([submitMessage]);
                        return 0;
                    } return 1
                },
                menuItems: [
            {
                title: $filter('translate')('msg_Filter'),
                icon: 'ui-grid-icon-ok',
                action: function ($event) {
                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                },
                shown: function () {
                    return this.grid.options.enableFiltering;
                }
            },
        {
            title: $filter('translate')('msg_Filter'),
            icon: 'ui-grid-icon-cancel',
            order: 0,
            action: function ($event) {
                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            },
            shown: function () {
                return !this.grid.options.enableFiltering;
            }
        }],
            },
                      {
                          name: 'Scope', width: "*", suppressRemoveSort: true, displayName: $filter('translate')('lbl_Scope'), headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableCellEditOnFocus: true,
                          cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Scope}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Scope}}</div></div>',
                          editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridscope\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgridscope\' + row.entity.data.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',

                          cellEditableCondition: function ($scope) {
                              if ($scope.row.entity.TIMSUB == "Y") {
                                  //showMessagePopUp([submitMessage]);
                                  return 0;
                              } return 1
                          },
                          menuItems: [
                           {
                               title: $filter('translate')('msg_Filter'),
                               icon: 'ui-grid-icon-ok',
                               action: function ($event) {
                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                               },
                               shown: function () {
                                   return this.grid.options.enableFiltering;
                               }
                           },
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-cancel',
                                        order: 0,
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return !this.grid.options.enableFiltering;
                                        }
                                    }],
                      },

                           {
                               name: 'Hrs1', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy1').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate1, type: 'number',
                               cellTemplate: '<div class="ui-grid-cell rightAlig" ><div ng-click="grid.appScope.stopEditOnCtrlClick($event,0)" class="rightAligRightPaddng" ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs1==null?row.entity.Hrs1:(row.entity.Hrs1|decimal)}}</div></div>',
                               editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs1\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                               cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                   var cellValue = grid.getCellValue(row, col);
                                   if (cellValue >= -200 && cellValue < 0)
                                       return 'grid-cell-negative';
                                   else
                                       return 'grid-cell-nonnegative';
                               },
                               cellEditableCondition: function ($scope) {
                                   if ($scope.row.entity.TIMSUB == "Y") {
                                       //showMessagePopUp([submitMessage]);
                                       return 0;
                                   }
                                   else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                       var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                       tempDate.setDate(tempDate.getDate() + 0);
                                       if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                           return 0;
                                       }
                                   }
                                   return 1
                               },
                               menuItems: [
                                {
                                    title: $filter('translate')('msg_Filter'),
                                    icon: 'ui-grid-icon-ok',
                                    action: function ($event) {
                                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                    },
                                    shown: function () {
                                        return this.grid.options.enableFiltering;
                                    }
                                },
                                     {
                                         title: $filter('translate')('msg_Filter'),
                                         icon: 'ui-grid-icon-cancel',
                                         order: 0,
                                         action: function ($event) {
                                             this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                             this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                         },
                                         shown: function () {
                                             return !this.grid.options.enableFiltering;
                                         }
                                     }],
                           },

                           {
                               name: 'Hrs2', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy2').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate2, type: 'number',
                               cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,1)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs2==null?row.entity.Hrs2:(row.entity.Hrs2|decimal)}}</div></div>',
                               editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs2\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                               cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                   var cellValue = grid.getCellValue(row, col);
                                   if (cellValue >= -200 && cellValue < 0)
                                       return 'grid-cell-negative';
                                   else
                                       return 'grid-cell-nonnegative';
                               },
                               cellEditableCondition: function ($scope) {
                                   if ($scope.row.entity.TIMSUB == "Y") {
                                       //showMessagePopUp([submitMessage]);
                                       return 0;
                                   } else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                       var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                       tempDate.setDate(tempDate.getDate() + 1);
                                       if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                           return 0;
                                       }
                                   }
                                   return 1
                               },
                               menuItems: [
     {
         title: $filter('translate')('msg_Filter'),
         icon: 'ui-grid-icon-ok',
         action: function ($event) {
             this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
             this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
         },
         shown: function () {
             return this.grid.options.enableFiltering;
         }
     },
          {
              title: $filter('translate')('msg_Filter'),
              icon: 'ui-grid-icon-cancel',
              order: 0,
              action: function ($event) {
                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              },
              shown: function () {
                  return !this.grid.options.enableFiltering;
              }
          }],
                           },
                            {
                                name: 'Hrs3', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy3').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate3, type: 'number',
                                cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,2)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs3==null?row.entity.Hrs3:(row.entity.Hrs3|decimal)}}</div></div>',
                                editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs3\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                    var cellValue = grid.getCellValue(row, col);
                                    if (cellValue >= -200 && cellValue < 0)
                                        return 'grid-cell-negative';
                                    else
                                        return 'grid-cell-nonnegative';
                                },
                                cellEditableCondition: function ($scope) {
                                    if ($scope.row.entity.TIMSUB == "Y") {
                                        //showMessagePopUp([submitMessage]);
                                        return 0;
                                    }
                                    else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                        var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                        tempDate.setDate(tempDate.getDate() + 2);
                                        if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                            return 0;
                                        }
                                    }
                                    return 1
                                },
                                menuItems: [
                                 {
                                     title: $filter('translate')('msg_Filter'),
                                     icon: 'ui-grid-icon-ok',
                                     action: function ($event) {
                                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                     },
                                     shown: function () {
                                         return this.grid.options.enableFiltering;
                                     }
                                 },
                                      {
                                          title: $filter('translate')('msg_Filter'),
                                          icon: 'ui-grid-icon-cancel',
                                          order: 0,
                                          action: function ($event) {
                                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                          },
                                          shown: function () {
                                              return !this.grid.options.enableFiltering;
                                          }
                                      }],
                            },
                             {
                                 name: 'Hrs4', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy4').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate4, type: 'number',
                                 cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,3)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs4==null?row.entity.Hrs4:(row.entity.Hrs4|decimal)}}</div></div>',
                                 editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs4\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                 cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                     var cellValue = grid.getCellValue(row, col);
                                     if (cellValue >= -200 && cellValue < 0)
                                         return 'grid-cell-negative';
                                     else
                                         return 'grid-cell-nonnegative';
                                 },
                                 cellEditableCondition: function ($scope) {
                                     if ($scope.row.entity.TIMSUB == "Y") {
                                         //showMessagePopUp([submitMessage]);
                                         return 0;
                                     }
                                     else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                         var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                         tempDate.setDate(tempDate.getDate() + 3);
                                         if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                             return 0;
                                         }
                                     }
                                     return 1
                                 },
                                 menuItems: [
     {
         title: $filter('translate')('msg_Filter'),
         icon: 'ui-grid-icon-ok',
         action: function ($event) {
             this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
             this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
         },
         shown: function () {
             return this.grid.options.enableFiltering;
         }
     },
          {
              title: $filter('translate')('msg_Filter'),
              icon: 'ui-grid-icon-cancel',
              order: 0,
              action: function ($event) {
                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              },
              shown: function () {
                  return !this.grid.options.enableFiltering;
              }
          }],
                             },
                              {
                                  name: 'Hrs5', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy5').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate5, type: 'number',
                                  cellTemplate: '<div class="ui-grid-cell rightAlig" ><div ng-click="grid.appScope.stopEditOnCtrlClick($event,4)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs5==null?row.entity.Hrs5:(row.entity.Hrs5|decimal)}}</div></div>',
                                  editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs5\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                  cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                      var cellValue = grid.getCellValue(row, col);
                                      if (cellValue >= -200 && cellValue < 0)
                                          return 'grid-cell-negative';
                                      else
                                          return 'grid-cell-nonnegative';
                                  },
                                  cellEditableCondition: function ($scope) {
                                      if ($scope.row.entity.TIMSUB == "Y") {
                                          //showMessagePopUp([submitMessage]);
                                          return 0;
                                      }
                                      else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                          var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                          tempDate.setDate(tempDate.getDate() + 4);
                                          if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                              return 0;
                                          }
                                      }
                                      return 1
                                  },
                                  menuItems: [
                                   {
                                       title: $filter('translate')('msg_Filter'),
                                       icon: 'ui-grid-icon-ok',
                                       action: function ($event) {
                                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                       },
                                       shown: function () {
                                           return this.grid.options.enableFiltering;
                                       }
                                   },
                                        {
                                            title: $filter('translate')('msg_Filter'),
                                            icon: 'ui-grid-icon-cancel',
                                            order: 0,
                                            action: function ($event) {
                                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                            },
                                            shown: function () {
                                                return !this.grid.options.enableFiltering;
                                            }
                                        }],
                              },
                              {
                                  name: 'Hrs6', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy6').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate6, type: 'number',
                                  cellTemplate: '<div class="ui-grid-cell rightAlig"><div ng-click="grid.appScope.stopEditOnCtrlClick($event,5)" class="rightAligRightPaddng"  ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs6==null?row.entity.Hrs6:(row.entity.Hrs6|decimal)}}</div></div>',
                                  editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs6\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                  cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                      var cellValue = grid.getCellValue(row, col);
                                      if (cellValue >= -200 && cellValue < 0)
                                          return 'grid-cell-negative';
                                      else
                                          return 'grid-cell-nonnegative';
                                  },
                                  cellEditableCondition: function ($scope) {
                                      if ($scope.row.entity.TIMSUB == "Y") {
                                          //showMessagePopUp([submitMessage]);
                                          return 0;
                                      }
                                      else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                          var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                          tempDate.setDate(tempDate.getDate() + 5);
                                          if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                              return 0;
                                          }
                                      }
                                      return 1
                                  },
                                  menuItems: [
                                   {
                                       title: $filter('translate')('msg_Filter'),
                                       icon: 'ui-grid-icon-ok',
                                       action: function ($event) {
                                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                       },
                                       shown: function () {
                                           return this.grid.options.enableFiltering;
                                       }
                                   },
                                        {
                                            title: $filter('translate')('msg_Filter'),
                                            icon: 'ui-grid-icon-cancel',
                                            order: 0,
                                            action: function ($event) {
                                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                            },
                                            shown: function () {
                                                return !this.grid.options.enableFiltering;
                                            }
                                        }],
                              },
                               {
                                   name: 'Hrs7', width: widthHoursWeek, suppressRemoveSort: true, displayName: $filter('translate')('lbl_FulWkDy7').substring(0, 3), enableHiding: false, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: true, enableCellEditOnFocus: true, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplate7, type: 'number',
                                   cellTemplate: '<div class="ui-grid-cell rightAlig" ><div ng-click="grid.appScope.stopEditOnCtrlClick($event,6)" class="rightAligRightPaddng" ng-if="!row.groupHeader">&nbsp;{{row.entity.Hrs7==null?row.entity.Hrs7:(row.entity.Hrs7|decimal)}}</div></div>',
                                   editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs7\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                                   cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                       var cellValue = grid.getCellValue(row, col);
                                       if (cellValue >= -200 && cellValue < 0)
                                           return 'grid-cell-negative';
                                       else
                                           return 'grid-cell-nonnegative';
                                   },
                                   cellEditableCondition: function ($scope) {
                                       if ($scope.row.entity.TIMSUB == "Y") {
                                           //showMessagePopUp([submitMessage]);
                                           return 0;
                                       }
                                       else if ($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                                           var tempDate = new Date($scope.grid.appScope.weeklyStartDate.valueOf());
                                           tempDate.setDate(tempDate.getDate() + 6);
                                           if (!validateTerminationDate($scope.grid.appScope.initialDetail.EMPL_REC.TERMDTE, tempDate)) {
                                               return 0;
                                           }
                                       }
                                       return 1
                                   },
                                   menuItems: [
{
    title: $filter('translate')('msg_Filter'),
    icon: 'ui-grid-icon-ok',
    action: function ($event) {
        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    },
    shown: function () {
        return this.grid.options.enableFiltering;
    }
},
  {
      title: $filter('translate')('msg_Filter'),
      icon: 'ui-grid-icon-cancel',
      order: 0,
      action: function ($event) {
          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
      },
      shown: function () {
          return !this.grid.options.enableFiltering;
      }
  }],
                               },
                                     {
                                         name: 'HrsTotal', width: 52, suppressRemoveSort: true, displayName: $filter('translate')('lbl_Total'), enableHiding: false, headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, enableCellEdit: false, enableCellEditOnFocus: true, enableColumnResizing: false, type: 'number',
                                         cellTemplate: '<div class="ui-grid-cell rightAlig"><span class="rightAligRightPaddng" ng-if="!row.groupHeader">{{grid.appScope.weekHrsTotal(row.entity)}}</span></div>', allowCellFocus: false,
                                         cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                             var cellValue = grid.getCellValue(row, col);
                                             if (cellValue < 0)
                                                 return 'grid-cell-negative';
                                             else
                                                 return 'grid-cell-nonnegative';
                                         },
                                         menuItems: [
                          {
                              title: $filter('translate')('msg_Filter'),
                              icon: 'ui-grid-icon-ok',
                              action: function ($event) {
                                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                              },
                              shown: function () {
                                  return this.grid.options.enableFiltering;
                              }
                          },
                               {
                                   title: $filter('translate')('msg_Filter'),
                                   icon: 'ui-grid-icon-cancel',
                                   order: 0,
                                   action: function ($event) {
                                       this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                       this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                   },
                                   shown: function () {
                                       return !this.grid.options.enableFiltering;
                                   }
                               }],
                                     },

                                          {
                                              name: 'DES', width: "*", suppressRemoveSort: true, displayName: 'Description', headerCellTemplate: myHeaderCellTemplateNoHours, groupingShowAggregationMenu: false, enableCellEdit: true, visible: false,
                                              editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-desc"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.data.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity.data, \'txtgriddesc\' + row.entity.data.TEID)" />' +
                                                                    '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                                                    '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                                                    '<i ng-click="grid.appScope.loadDescription(row.entity)" class="glyphicon glyphicon-triangle-bottom"></i><!--<img ng-click="grid.appScope.showInfo(row)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                                              // cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell"  tooltip = "{{row.entity.data.DES}}" tooltip-append-to-body="true"><span>{{row.entity.data.DES}}</span></div>',

                                              cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.DES}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.DES}}</div></div>',
                                              cellEditableCondition: function ($scope) {
                                                  if ($scope.row.entity.TIMSUB == "Y") {
                                                      //showMessagePopUp([submitMessage]);
                                                      return 0;
                                                  } return 1
                                              },
                                              menuItems: [
                                           {
                                               title: $filter('translate')('msg_Filter'),
                                               icon: 'ui-grid-icon-ok',
                                               action: function ($event) {
                                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                               },
                                               shown: function () {
                                                   return this.grid.options.enableFiltering;
                                               }
                                           },
                                                  {
                                                      title: $filter('translate')('msg_Filter'),
                                                      icon: 'ui-grid-icon-cancel',
                                                      order: 0,
                                                      action: function ($event) {
                                                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                                      },
                                                      shown: function () {
                                                          return !this.grid.options.enableFiltering;
                                                      }
                                                  }],
                                          }

        ];


        $scope.calTotalView = function (countView) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.calTotalView");
            if (countView == 1) {
                localStorage.setItem('AllcolumnHidden', 1)
            }
            var widthView = $scope.colWidth;
            var headerWidth = parseInt($(".ui-grid-header-cell-wrapper").css("width"));
            var colWidth;
            if (countView == 2) {
                $scope.visibleflag1 = false;
                $scope.visibleflag2 = false;
                $scope.visibleflag3 = false;
                $scope.visibleflag4 = true;
                colWidth = headerWidth * 0.0653
                $(".bottomWeeklyCalcTotal").width(colWidth);
                $(".bottomWeeklyCalcEmptyTotal").width(widthView);
            }
            if (countView == 4) {
                $scope.visibleflag1 = true;
                $scope.visibleflag2 = false;
                $scope.visibleflag3 = false;
                $scope.visibleflag4 = false;
                colWidth = headerWidth * 0.06141
                $(".bottomWeeklyCalcTotal").width(colWidth);
                $(".bottomWeeklyCalcEmptyTotal").width(widthView);
            }
            else if (countView == 5) {
                $scope.visibleflag1 = true;
                $scope.visibleflag2 = true;
                $scope.visibleflag3 = false;
                $scope.visibleflag4 = false;
                colWidth = headerWidth * 0.05731
                $(".bottomWeeklyCalcTotal").width(colWidth);
                $(".bottomWeeklyCalcEmptyTotal").width(widthView);

            }
            else if (countView == 6) {
                $scope.visibleflag1 = true;
                $scope.visibleflag2 = true;
                $scope.visibleflag3 = true;
                $scope.visibleflag4 = false;
                colWidth = headerWidth * 0.05220
                $(".bottomWeeklyCalcTotal").width(colWidth);
                $(".bottomWeeklyCalcEmptyTotal").width(widthView);
            }
            else if (countView == 3) {
                $scope.visibleflag1 = false;
                $scope.visibleflag2 = false;
                $scope.visibleflag3 = false;
                $scope.visibleflag4 = false;
                colWidth = headerWidth * 0.0736
                $(".bottomWeeklyCalcTotal").width(colWidth);
                $(".bottomWeeklyCalcEmptyTotal").width(widthView);
            }
            //var colcount = parseInt(localStorage.getItem('AllcolumnHidden'));
            //alert(colcount);
        }


        $scope.visibleflag1, $scope.visibleflag2, $scope.visibleflag3 = false;
        $scope.visibleflag4 = false;
        $scope.dataTemp = "";

        $scope.$on('columnVisibilityChangedNew', function (event, data) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.columnVisibilityChangedNew");
            localStorage.setItem('AllcolumnHidden', -1)
            if (localStorage.isDailyMode == "true")
                $scope.countDay += 1;
            else if (localStorage.isDailyMode == "false") {
                $scope.countWeek += 1;
                $timeout(function () {
                    $scope.colWidth = ($(".ui-grid-col" + data).css("min-width"))
                }, 100);
                $scope.calTotalView($scope.countWeek);
            }
        });

        $scope.$on('columnHiddenDay', function (event, data) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.columnHiddenDay");
            if ($scope.countDay != 1) {
                $scope.countDay -= 1;
                localStorage.setItem('AllcolumnHidden', -1);
            }
            if ($scope.countDay == 1) {
                localStorage.setItem('AllcolumnHidden', 1)
            }
        });

        $scope.$on('columnHiddenWeek', function (event, data) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.columnHiddenWeek");
            if ($scope.countWeek >= 1) {
                $scope.countWeek -= 1;
                localStorage.setItem('AllcolumnHidden', -1);
            }
            $timeout(function () {
                $scope.colWidth = ($(".ui-grid-col" + data).css("min-width"))
            }, 100);
            $scope.calTotalView($scope.countWeek);
        });
        var navigatedCell = "";
        var isRowToggleAfterEdit = function (grid, currRowId) {
            var flag = false;
            flag = (grid.options.prevEiditedRow !== -1 && grid.options.prevEiditedRow !== currRowId);
            //if (flag) {
            //    //console.log("row will not be selected");
            //}
            return flag;
        }
        var gridTimeOutHandle = null;
        $scope.onGridRowMouseUp = function (item, grid, event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.onGridRowMouseUp");
            if (isRowToggleAfterEdit(grid, item.entity.rowId)) {
                if (gridTimeOutHandle) {
                    $timeout.cancel(gridTimeOutHandle);
                }
                gridTimeOutHandle = $timeout(function () {
                    //console.log("focus=="+angular.element(window.document.activeElement).attr('type'));
                    if (angular.element(window.document.activeElement).attr('type') == "number") {
                        $('#loadingWidgetDesktop').hide();
                    }
                    grid.options.prevEiditedRow = -1
                }, 1000);
                if ($scope.isRowEdit) {
                    $('#loadingWidgetDesktop').show();
                }
                return false;
            }
            if (item.groupHeader !== true) {
                var ctrlFlag = event.ctrlKey;
                var rows = grid.api.selection.getSelectedRows();
                //if (rows.length > 1 && item.isSelected == true && event.which != 3 && ctrlFlag == true)
                //    item.isSelected = false;
                if (event.shiftKey == false && ctrlFlag == false && $scope.selectedRows > 0 && (event.which != 3 || (event.which == 3 && item.isSelected != true))) {
                    grid.api.selection.clearSelectedRows();
                }
                if (item.groupHeader === undefined && !$scope.isDraggingFlag && ctrlFlag == false && event.which != 3) {
                    item.isSelected = true;
                }

                if (rows.length > 1)
                    $scope.multiSelectFlag = true;
                else
                    $scope.multiSelectFlag = false;
                $scope.isDraggingFlag = false;

                $rootScope.shiftFlag = event.shiftKey;
                if (event.target.nodeName == "SPAN") {
                    $scope.itemSel = item;
                    if (item.isSelected == false)
                        $timeout(function () { $scope.itemSel.isSelected = false; });
                }
            }
            else {
                var rows = grid.api.selection.getSelectedRows();
                $interval(function () {
                    try {
                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(rows[0])]);
                    } catch (ex) {
                    }
                }, 0, 1);

            }
        }
        //$scope.selectedRowsOnMouseDown = [];
        $scope.stopEditOnCtrlClick = function (event, numDay) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.stopEditOnCtrlClick");
            if (event.ctrlKey || event.shiftKey) {
                event.preventDefault();
                event.stopPropagation();
                $(event.currentTarget).focus();
            }
            else if (numDay !== undefined && $scope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                var tempDate = new Date($scope.weeklyStartDate.valueOf());
                tempDate.setDate(tempDate.getDate() + numDay);
                if (!validateTerminationDate($scope.initialDetail.EMPL_REC.TERMDTE, tempDate))
                    return false;
            }
        }
        $scope.onGridRowMouseDown = function (item, grid, event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.onGridRowMouseDown");
            $scope.gridApi.grid.options.curretnRowClick = item.entity.rowId;
            if (isRowToggleAfterEdit(grid, item.entity.rowId)) {
                return;
            }
            grid.options.prevEiditedRow = item.entity.rowId;
            //console.log("onGridRowMouseDown==" + $scope.gridApi.grid.options.curretnRowClick);
            if (item.groupHeader !== true) {
                var visibleRowsTemp = $scope.gridApi.core.getVisibleRows();
                var visibleRows = [];
                for (var i = 0; i < visibleRowsTemp.length; i++) {
                    if (visibleRowsTemp[i].groupHeader == true)
                        visibleRows.push(null);
                    else
                        visibleRows.push(visibleRowsTemp[i].entity);
                }
                closeAllDropDown();
                var ctrlFlag = event.ctrlKey;
                // deselect all the row and select the current row.
                //$(".edit_Menu").css("display", "none");
                var rows = grid.api.selection.getSelectedRows();
                if (rows.length > 1)
                    $scope.multiSelectFlag = true;
                else
                    $scope.multiSelectFlag = false;
                var startRowIndex = visibleRows.indexOf(rows[0]);
                var endRowIndex = visibleRows.indexOf(item.entity);
                if (startRowIndex > endRowIndex) {
                    startRowIndex = visibleRows.indexOf(rows[rows.length - 1]);
                }
                $scope.selectedRows = grid.api.selection.getSelectedRows().length;
                if (item.isSelected != true && ctrlFlag == false && $scope.selectedRows > 0 && event.which != 3) {
                    grid.api.selection.clearSelectedRows();
                }
                if (ctrlFlag == true && $scope.selectedRows > 1 && item.isSelected == true && event.which != 3) {
                    item.isSelected = false;

                }
                else if (item.groupHeader === undefined && event.which != 3) {
                    item.isSelected = true;
                }
                $scope.selectedRows = grid.api.selection.getSelectedRows().length;
                if (event.shiftKey) {
                    grid.api.selection.clearSelectedRows();
                    if (startRowIndex < endRowIndex) {
                        for (var r = startRowIndex; r <= endRowIndex; r++)
                            $scope.gridApi.selection.selectRowByVisibleIndex(r);
                    }
                    else {
                        for (var r = startRowIndex; r >= endRowIndex; r--)
                            $scope.gridApi.selection.selectRowByVisibleIndex(r);
                    }
                }
                $scope.selectedRowsOnMouseDown = grid.api.selection.getSelectedRows();
                if (event.which == 3) {
                    var submittedEntry = $scope.selectedRowsOnMouseDown.filter(function (item) {
                        return item.TIMSUB.toUpperCase() == "N"
                    });
                    if (submittedEntry.length < 1)
                        $rootScope.isDeletedRightClickOff = true;
                    else
                        $rootScope.isDeletedRightClickOff = false;
                }
            }
        }
        var getHoursIndex = function (name) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getHoursIndex");
            var hrsIndex = -1;
            if (name == 'HRS' || name === 'Hrs1') {
                hrsIndex = 0;
            }
            else if (name === 'Hrs2') {
                hrsIndex = 1;
            }
            else if (name === 'Hrs3') {
                hrsIndex = 2;
            }
            else if (name === 'Hrs4') {
                hrsIndex = 3;
            }
            else if (name === 'Hrs5') {
                hrsIndex = 4;
            }
            else if (name === 'Hrs6') {
                hrsIndex = 5;
            }
            else if (name === 'Hrs7') {
                hrsIndex = 6;
            }
            return hrsIndex;
        }

        var isFavActivity = function () {

        }
        var isDesignateEmployee = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.isDesignateEmployee");
            var isDesignate = false;
            if ($rootScope.designateOfEmp.EMPLID !== "0" && $rootScope.designateOfEmp.EMPLID != $rootScope.designateOfEmp.loginEmpId) {
                isDesignate = true;
            }
            return isDesignate;
        }
        var isGridLock = false;
        var lockGrid = function (lockGrid) {
            isGridLock = lockGrid;
            $('#loadingWidgetDesktop').show();
        }
        var unLockGrid = function () {
            $scope.isRowEdit = false;
            isGridLock = false;
            $('#loadingWidgetDesktop').hide();
        }
        $scope.gridOptions1 = {
            rowHeight: 19,
            excessRows: 100,
            gridName: 'MainGrid',
            rowEditWaitInterval: 200,
            dicardTabNavigation: false,
            showHeader: true,
            showGridFooter: false,
            showColumnFooter: true,
            enableGridMenu: true,
            enableCellSelection: true,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: true,
            treeRowHeaderAlwaysVisible: false,
            enableRowHeaderSelection: false,
            multiSelect: true,
            noUnselect: true,
            excessColumns: 100,
            modifierKeysToMultiSelect: true,
            columnDefs: columnDefs1,
            canSelectRows: false,
            rowTemplate: "<div  ng-mousedown=\"grid.appScope.onGridRowMouseDown(row,grid,$event)\" ng-mouseup=\"grid.appScope.onGridRowMouseUp(row,grid,$event)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            onRegisterApi: function (gridApi) {
                $scope.maskTest = String('?*?*?*-?9?9?9?-?9?9?9');
                $scope.gridApi = gridApi;
                gridApi.rowEdit.on.saveRow($scope, function (rowEntity) {
                    //console.log("saveRow==" + isGridLock);
                    var promise = $q.defer();
                    if (isGridLock) {
                        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
                        promise.resolve();
                        unlockGrid();
                        return false;
                    }
                    $rootScope.pastedRecords = false;
                    $rootScope.rowIndex = rowEntity;
                    $rootScope.rowIndexTemp = $scope.gridOptions.data.indexOf(rowEntity);
                    $scope.gridOptions.dicardTabNavigation = true;
                    if ($scope.isRowEdit && !$rootScope.columnBlank) {
                        //start saviing row, prevent the row from edit now.
                        lockGrid(true);
                        $scope.isRowEditTemp = $scope.isRowEdit;
                        $scope.isRowEdit = false;
                        var indexHours = angular.copy($scope.hourIndexList);
                        var time_record = angular.copy($scope.time_record);
                        $scope.saveInlineEntry(time_record, gridApi, indexHours);
                    }
                    $scope.hourIndexList = [];

                    $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
                    promise.resolve();
                    //$scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);

                });
                gridApi.grouping.on.groupingChanged($scope, function () {
                    //if(!$scope.gridApi.grid.columns[0].visible)
                    if ($scope.gridApi.grouping.getGrouping().grouping.length > 0 && $scope.gridApi.grid.rows.length > 0)
                        $rootScope.hideUiGridOnGridGrouping("#grid1");
                });
                gridApi.colMovable.on.columnPositionChanged($scope, function (colDef, originalPosition, newPosition) {
                    if (!isDesignateEmployee() && (originalPosition != newPosition)) {
                        localStorage.setItem('isMainGridLayoutChange', 1);
                        $rootScope.enableSaveLayout = true;
                    }

                    $scope.gridApi.grid.getColumn("ProjectActivity").width = "*";
                    $scope.gridApi.grid.getColumn("Component").width = "*";
                    $scope.gridApi.grid.getColumn("Task").width = "*";
                    $scope.gridApi.grid.getColumn("Scope").width = "*";
                    if (!$scope.gridApi.grid.options.columnDefs[0].isWeek) {
                        $scope.gridApi.grid.getColumn("TYPE").width = "*";
                    }
                })
                gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                    if (!isDesignateEmployee()) {
                        localStorage.setItem('isMainGridLayoutChange', 1);
                        $rootScope.enableSaveLayout = true;
                    }

                    $scope.gridApi.grid.getColumn("ProjectActivity").width = "*";
                    $scope.gridApi.grid.getColumn("Component").width = "*";
                    $scope.gridApi.grid.getColumn("Task").width = "*";
                    $scope.gridApi.grid.getColumn("Scope").width = "*";
                    if (!$scope.gridApi.grid.options.columnDefs[0].isWeek) {
                        $scope.gridApi.grid.getColumn("TYPE").width = "*";
                    }

                });
                gridApi.core.on.rowsRendered($scope, function () {
                    if ($scope.cuttOffSaveState === true) {
                        $scope.cuttOffSaveState = false;
                        $scope.gridApi.saveState.restore($scope, $scope.state);
                    }
                    if ($scope.gridApi.grid.treeBase.tree instanceof Array) {
                        $timeout(function () {
                            var heightView = $("#tab1List .ui-grid-render-container-body .ui-grid-viewport").height();
                            $("#tab1List .ui-grid-pinned-container .ui-grid-viewport").height(heightView - 2);

                        });
                        if ($scope.isAutoGroup) {
                            $scope.isAutoGroup = false;
                            $scope.gridApi.grouping.groupColumn('TYPE');
                            localStorage.GroupingCalled = "1";
                        }
                        if (localStorage.GroupingCalled == "1") {
                            $scope.gridApi.treeBase.expandAllRows();
                            $timeout(function () {
                                $rootScope.showUiGridAfterGrouping("#grid1");
                                // if ($scope.isDailyMode)
                                $scope.bindGridEvents();
                                localStorage.GroupingCalled = "0";
                            }, 100);
                        }
                    }
                });
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    $scope.gridApi.grid.isRowSet = false;
                    $scope.cepObj.selected = angular.copy($scope.cepObj.selectedBegin);
                    $scope.isProjectTask = $scope.isProjectTaskBegin;
                    if (colDef.name == navigatedCell) {
                        $scope.gridApi.grid.options.prevEiditedRow = -1;
                    }
                    navigatedCell = "";
                    // console.log("afterCellEdit==" + $scope.gridApi.grid.options.prevEiditedRow + "  " + navigatedCell);
                    $rootScope.pastedRecords = false;
                    $('#txtgridcep' + rowEntity.TEID).parent().hide();
                    $scope.isCepFavSet = false;
                    $scope.isSameCompny = false;
                    if (newValue !== oldValue) {
                        if ($scope.isValiddata && $scope.beginCellEditFlag) {
                            if ($scope.isDescriptionPopupLoad)
                                $scope.saveFlag = false;
                            else
                                $scope.saveFlag = true;
                            var hrsIndex = 0;
                            hrsIndex = getHoursIndex(colDef.name);
                            var weeklyHour = rowEntity.HRS;

                            var teid_data = rowEntity.TEID;
                            if (!$scope.isDailyMode) {
                                weeklyHour = [rowEntity.Hrs1, rowEntity.Hrs2, rowEntity.Hrs3, rowEntity.Hrs4, rowEntity.Hrs5, rowEntity.Hrs6, rowEntity.Hrs7];
                                teid_data = new Array(7);
                                teid_data[0] = typeof rowEntity.TEID1 != 'undefined' ? rowEntity.TEID1 : 0;
                                teid_data[1] = typeof rowEntity.TEID2 != 'undefined' ? rowEntity.TEID2 : 0;
                                teid_data[2] = typeof rowEntity.TEID3 != 'undefined' ? rowEntity.TEID3 : 0;
                                teid_data[3] = typeof rowEntity.TEID4 != 'undefined' ? rowEntity.TEID4 : 0;
                                teid_data[4] = typeof rowEntity.TEID5 != 'undefined' ? rowEntity.TEID5 : 0;
                                teid_data[5] = typeof rowEntity.TEID6 != 'undefined' ? rowEntity.TEID6 : 0;
                                teid_data[6] = typeof rowEntity.TEID7 != 'undefined' ? rowEntity.TEID7 : 0;
                            }
                            if (rowEntity.DES == "")
                                rowEntity.DES = $scope.previousData.DES;

                            if ($scope.isDailyMode) {
                                $scope.time_record = {
                                    teId: teid_data,
                                    cepCode: rowEntity.CEP_REC.CLIENO.toUpperCase().trim(),
                                    hrs: weeklyHour,
                                    description: rowEntity.DES,
                                    cepRec: rowEntity.CEP_REC,
                                    actRec: rowEntity.ACTI_REC,
                                    cmptId: rowEntity.CMPTID,
                                    tskId: rowEntity.TSKID,
                                    scopId: rowEntity.SCOID,
                                    regFlag: rowEntity.REGFLAG,
                                    stateCode: rowEntity.PRSTCD,
                                    icrtcd: rowEntity.ICRTCD,
                                    icdesc: rowEntity.ICDESC,
                                    icchrge: rowEntity.ICCHRGE,
                                    CTDESC: rowEntity.CTDESC
                                }
                                if (colDef.name.substring(0, 3).toLowerCase() == "hrs") {
                                    var date1 = new Date($scope.currentDate.valueOf());
                                    date1 = $filter('date')(date1, 'yyyy-MM-dd');
                                    var objFutureTimeEntry = {
                                        DTE: date1, HRS: $scope.time_record.hrs, CEP_REC: {
                                            CHARBASIS: rowEntity.CEP_REC.CHARBASIS
                                        }

                                    }
                                    var isFutureEntry = isInvalidFutureEntry(objFutureTimeEntry);
                                    //show pop up and set hours to old hours
                                    if (isFutureEntry) {
                                        $scope.time_record.hrs = oldValue;
                                        $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].HRS = oldValue;
                                        //showValidationMsg([$filter('translate')('msg_FutureTimeEntry')], $filter('translate')('lbl_Error'), false);
                                        $scope.msgFutureTime.push($filter('translate')('msg_FutureTimeEntry'));
                                    }
                                }
                                else if (colDef.name == "CEP_REC.CLIENO" || colDef.name == "data.CEP_REC.CLIENO") {
                                    var date1 = new Date($scope.currentDate.valueOf());
                                    date1 = $filter('date')(date1, 'yyyy-MM-dd');
                                    var objFutureTimeEntry = {
                                        DTE: date1, HRS: $scope.time_record.hrs, CEP_REC: {
                                            CHARBASIS: ($scope.cepObj.selected != null && $scope.cepObj.selected != undefined) ? $scope.cepObj.selected.CHARBASIS : $rootScope.gridrow.CEP_REC.CHARBASIS
                                        }

                                    }
                                    var isFutureEntry = isInvalidFutureEntry(objFutureTimeEntry);
                                    //show pop up and set hours to old hours
                                    if (isFutureEntry) {
                                        $scope.saveFlag = false;
                                        $scope.time_record.hrs = 0;
                                        $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].HRS = 0;
                                    }
                                }
                            }
                            else {
                                $scope.time_record = {
                                    rowId: rowEntity.rowId,
                                    teId: teid_data,
                                    cepCode: rowEntity.CEP_REC.CLIENO.toUpperCase().trim(),
                                    hrs: weeklyHour,
                                    description: rowEntity.DES,
                                    cepRec: rowEntity.CEP_REC,
                                    actRec: rowEntity.ACTI_REC,
                                    cmptId: rowEntity.CMPTID,
                                    tskId: rowEntity.TSKID,
                                    scopId: rowEntity.SCOID,
                                    regFlag: rowEntity.data.REGFLAG,
                                    stateCode: rowEntity.data.PRSTCD,
                                    icrtcd: rowEntity.ICRTCD,
                                    icdesc: rowEntity.ICDESC,
                                    icchrge: rowEntity.ICCHRGE,
                                    CTDESC: rowEntity.CTDESC
                                }
                                if (colDef.name.substring(0, 3).toLowerCase() == "hrs") {
                                    var currentDate = new Date($scope.weeklyStartDate.valueOf());
                                    var date = currentDate.setDate(currentDate.getDate() + hrsIndex);
                                    date = $filter('date')(date, 'yyyy-MM-dd');
                                    var objFutureTimeEntry = {
                                        DTE: date, HRS: $scope.time_record.hrs[hrsIndex], CEP_REC: {
                                            CHARBASIS: rowEntity.CEP_REC.CHARBASIS
                                        }

                                    }
                                    var isFutureEntry = isInvalidFutureEntry(objFutureTimeEntry);
                                    //show pop up and set hours to old hours
                                    if (isFutureEntry) {
                                        $scope.time_record.hrs[hrsIndex] = oldValue;
                                        $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)]["Hrs" + (hrsIndex + 1)] = oldValue;
                                        //showValidationMsg([$filter('translate')('msg_FutureTimeEntry')], $filter('translate')('lbl_Error'), false);
                                        $scope.msgFutureTime.push($filter('translate')('msg_FutureTimeEntry'));
                                    }
                                }
                                else if (colDef.name == "CEP_REC.CLIENO" || colDef.name == "data.CEP_REC.CLIENO") {
                                    var currentDate = new Date($scope.weeklyStartDate.valueOf());
                                    var isfutureEntry = false;
                                    for (var x = 0; x < weeklyHour.length; x++) {
                                        var date = currentDate.setDate(currentDate.getDate() + x);
                                        date = $filter('date')(date, 'yyyy-MM-dd');
                                        var objFutureTimeEntry = {
                                            DTE: date, HRS: $scope.time_record.hrs[x], CEP_REC: {
                                                CHARBASIS: $scope.cepObj.selected.CHARBASIS
                                            }

                                        }
                                        var isFutureEntry = isInvalidFutureEntry(objFutureTimeEntry);
                                        //show pop up and set hours to old hours
                                        if (isFutureEntry && $scope.time_record.hrs[x] != null) {
                                            $scope.saveFlag = false;
                                            isfutureEntry = true
                                            $scope.time_record.hrs[x] = 0;
                                        }
                                    }


                                }

                            }
                            //updateHrsField($scope.time_record, $scope.isDailyMode);
                            if (($rootScope.popupload || (colDef.name.substring(0, 3).toLowerCase() == "hrs") || colDef.name == "DES" || colDef.name == "ICCHRGE")) {
                                if ((colDef.name.substring(0, 3).toLowerCase() == "hrs") || colDef.name == "DES" || colDef.name == "ICCHRGE") {

                                    $scope.isRowEdit = true;
                                    if (hrsIndex != -1 && $scope.hourIndexList.indexOf(hrsIndex) < 0) {
                                        $scope.isValidHour = checkHoursAfterCellEdit($scope.time_record, hrsIndex);
                                        $scope.hourIndexList.push(hrsIndex);
                                    }
                                }
                                else {
                                    $scope.isRowEdit = false;
                                    var indexHours = angular.copy($scope.hourIndexList);
                                    $scope.hourIndexList = [];
                                    $scope.saveInlineEntry($scope.time_record, gridApi, indexHours);
                                }
                                if (colDef.name == "ICCHRGE" && $scope.isDailyMode && (rowEntity.ICRTCD != null && rowEntity.ICRTCD.trim() != "")) {
                                    if (rowEntity.ICCHRGE === null || rowEntity.ICCHRGE === undefined) {
                                        rowEntity.ICCHRGE = $scope.oldEntry;
                                        $scope.isRowEdit = false
                                    }
                                    // if (rowEntity.ICCHRGE === undefined) $scope.isRowEdit = false;
                                }
                            }
                            else {
                                $scope.isRowEdit = false;
                                if ($scope.cnt == null) {
                                    if (rowEntity.CEP_REC.CLIENO.trim() != null && rowEntity.CEP_REC.CLIENO.trim() != "") {
                                        if ($scope.isProjectTask != null) {
                                            if ($scope.isProjectTask)
                                                broadcastService.notifyGridFocus("ProjectComponent");
                                            else
                                                broadcastService.notifyGridFocus("Activity");
                                        }
                                    }
                                    else {
                                        if (colDef.name == "CEP_REC.CLIENO")
                                            $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].CEP_REC.CLIENO = $scope.oldEntry;
                                        if (colDef.name == "data.CEP_REC.CLIENO")
                                            $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].data.CEP_REC.CLIENO = $scope.oldEntry;
                                    }
                                }
                                else {
                                    if (colDef.name == "CEP_REC.CLIENO")
                                        $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].CEP_REC.CLIENO = $scope.oldEntry;
                                    if (colDef.name == "data.CEP_REC.CLIENO")
                                        $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].data.CEP_REC.CLIENO = $scope.oldEntry;
                                    $scope.oldCepEntry = angular.copy($scope.oldEntry);
                                }
                            }

                            if ($scope.time_record.cepRec.CLIENO.length == 6)
                                $scope.time_record.cepRec.CLIENO = $scope.time_record.cepRec.CLIENO + '-' + ("0" + $scope.time_record.cepRec.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.time_record.cepRec.PRJNO).slice(-3).toString();

                            if ($scope.time_record.cepRec.CLIENO.length > 8) {
                                var excptnClientCode = cepSharedService.isExcepCepCode($scope.time_record.cepRec.CLIENO);
                                if (excptnClientCode.isExpCep)
                                    $scope.time_record.cepRec.CLIENO = excptnClientCode.cepWithMask.toUpperCase().trim();
                            }
                            enableCellEditOnFocus: false;
                            //$scope.beginEdit=false;
                            //$scope.cpeListData=[];
                            if (!$scope.isContinue && $scope.isContinue != undefined || (!$rootScope.popupload && !$scope.isSearchGrid && (!$scope.isRowEdit || $scope.isValidHour === false))) {
                                //$scope.getCurrentFocus();                    
                                $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)][colDef.name] = $scope.oldEntry;
                                $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)]);
                                if (colDef.name == "CEP_REC.CLIENO")
                                    $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].CEP_REC.CLIENO = $scope.oldEntry;
                                if (colDef.name == "data.CEP_REC.CLIENO")
                                    $scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)].data.CEP_REC.CLIENO = $scope.oldEntry;
                            }
                            $scope.isGridFocus = false;
                        }
                        gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    }
                    $('#loadingWidgetDesktop').hide();
                    $rootScope.rowIndex = rowEntity;
                });
                $scope.startSelectedRowIndex = 0;
                $scope.selctProjCmp = $filter('translate')('msg_selctProjCmp');

                gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef) {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.beginCellEdit");
                    $scope.lastRowEntry = angular.copy(rowEntity);
                    $scope.gridApi.selection.clearSelectedRows();
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(rowEntity)]);
                    if (colDef.name == "CEP_REC.CLIENO" || colDef.name == "data.CEP_REC.CLIENO")
                        $('#txtgridcep' + rowEntity.TEID).parent().show();
                    $scope.renewalMessage = [];
                    $scope.IsInlineActFav = false;
                    $scope.isSameCompny = false;
                    //check description is fav or not if description is edit
                    if (colDef.name == "DES") {
                        $scope.isFavDescription(rowEntity.DES);
                    }

                    else if (colDef.name == "ProjectActivity") {
                        if (rowEntity.CEP_REC.CATID <= 0) {
                            var activityName = rowEntity.ProjectActivity;
                            var isValidActivity = (activityName == $filter('translate')('activity_Title') ? false : true);
                            if (isValidActivity) {
                                isValidActivity = (activityName == $filter('translate')('msg_selctProjCmp') ? false : true);
                            }
                            if (rowEntity.CEP_REC.COMPID == $scope.initialDetail.COMP_REC.COMPID && isValidActivity && rowEntity.ACTI_REC.STAT == 'Y') {
                                $scope.isSameCompny = true;
                                var falActList = JSON.parse(sessionStorage.getItem('FavActivityArray'))
                                $scope.IsInlineActFav = activityFavService.isActivityInFavList(rowEntity.ACTI_REC, falActList);
                            }
                        }
                    }
                    $scope.isCepFavSet = false;
                    $scope.colDefname = colDef.name;
                    $scope.beginCellEditFlag = true;

                    var selectedRows = gridApi.selection.getSelectedRows();
                    $scope.cellNavigate = false;
                    if ($scope.previousData == undefined || $scope.previousData == "") {
                        if ($scope.isDailyMode)
                            $scope.previousData = angular.copy(rowEntity);
                        else
                            $scope.previousData = angular.copy(rowEntity);
                    }

                    if ((colDef.name == "Component" || colDef.name == "Task" || colDef.name == "Scope") && (parseInt(rowEntity.CEP_REC.CATID) <= 0)) {
                        showMessagePopUp([$filter('translate')('lbl_CEPAssPCT')], "Message", true);
                        $scope.oldEntry = "";
                        return;
                    }
                    if ((colDef.name == "ICDESC" || colDef.name == "ICCHRGE") && (rowEntity.ICRTCD == null || rowEntity.ICRTCD.trim() == "")) {
                        showMessagePopUp([$filter('translate')('lbl_ICModify')], "Message", true);
                        $scope.oldEntry = "";
                        return;
                    }
                    if ((rowEntity.ICRTCD != null && rowEntity.ICRTCD.trim() != "") && (colDef.name.substring(0, 3).toLowerCase() == "hrs")) {
                        showMessagePopUp([$filter('translate')('lbl_ICcantModify')], "Message", true);
                        $scope.oldEntry = "";
                        return;
                    }

                    $scope.cnt = null;
                    if ($scope.oldRowEntry == undefined || $scope.oldRowEntry == "") {
                        if ($scope.isDailyMode)
                            $scope.oldRowEntry = rowEntity.HRS;
                        else
                            $scope.oldRowEntry = [rowEntity.Hrs1, rowEntity.Hrs2, rowEntity.Hrs3, rowEntity.Hrs4, rowEntity.Hrs5, rowEntity.Hrs6, rowEntity.Hrs7];
                    }
                    //alert("hi beginCellEdit ");
                    $scope.oldEntry = "";
                    if ($rootScope.columnBlank && ((colDef.name != "ProjectActivity" && $rootScope.columnBlankTEID == rowEntity.TEID) || $rootScope.columnBlankTEID != rowEntity.TEID)) {
                        var sendData = {
                            errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')],
                            isProjectTaskInvalid: true
                        };
                        $scope.openModalCtrl = 'showValidationMsg';
                        sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                        $scope.isValiddata = false;
                    }
                    else {
                        $scope.isValiddata = true;
                        if (colDef.name == "CEP_REC.CLIENO" || $scope.oldCepEntry == undefined || $scope.oldCepEntry == "" || colDef.name == "data.CEP_REC.CLIENO") {
                            if ($scope.isDailyMode) {
                                $scope.oldCepEntry = rowEntity.CEP_REC.CLIENO.toUpperCase().trim();
                            }
                            else {
                                $scope.oldCepEntry = rowEntity.data.CEP_REC.CLIENO.toUpperCase().trim();
                            }
                        }
                        $scope.oldEntry = rowEntity[colDef.name];
                        if (colDef.name == "CEP_REC.CLIENO")
                            $scope.oldEntry = rowEntity.CEP_REC.CLIENO;
                        if (colDef.name == "data.CEP_REC.CLIENO")
                            $scope.oldEntry = rowEntity.data.CEP_REC.CLIENO;
                        //}
                        $scope.isSearchGrid = false;
                        $scope.colDefName = colDef.name;
                        if (colDef.name == "CEP_REC.CLIENO" || colDef.name == "data.CEP_REC.CLIENO")
                            $scope.beginEdit = true;
                        //else
                        //    $scope.cellNavigate = false;

                        if ((colDef.name.substring(0, 3).toLowerCase() != "hrs") && colDef.name != "DES")
                            $scope.gridCepComplete(rowEntity, null, rowEntity);
                        else
                            $rootScope.gridrow = rowEntity;

                        if (rowEntity.CEP_REC.CATID > 0) {
                            $scope.isProjectTaskBegin = true;
                        }
                        else {
                            $scope.isProjectTaskBegin = false;
                        }


                        $scope.showColViewMenu = false;
                        $rootScope.rowIndex = rowEntity;
                    }
                });
                $scope.cepMasking = "?*?*?*?*?*?*?-?9?9?9?-?9?9?9";
                gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.gridApi.cellNav.on.navigate");
                    $scope.gridApi.grid.options.prevEiditedRow = newRowCol.row.entity.rowId;
                    navigatedCell = newRowCol.col.name;
                    //console.log("navigate==" + $scope.gridApi.grid.options.prevEiditedRow);
                    $scope.gridApi.grid.isRowSet = true;
                    $scope.gridApi.selection.clearSelectedRows();
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(newRowCol.row.entity)]);
                    if (newRowCol.row.entity.TIMSUB == "Y") {
                        showMessagePopUp([submitMessage]);
                        return;
                    }
                    //if(!newRowCol.isSelected)
                    //newRowCol.isSelected = true;
                    //set masking for cep code before edit
                    if (newRowCol.col.colDef.name === "CEP_REC.CLIENO" || newRowCol.col.colDef.name === "data.CEP_REC.CLIENO") {
                        //console.log(newRowCol.row.entity.CEP_REC.CLIENO);
                        $scope.cepMasking = "?*?*?*?*?*?*?-?9?9?9?-?9?9?9";
                        var currentCepCode = newRowCol.row.entity.CEP_REC.CLIENO;
                        $scope.cepEditCodeWithoutMask = currentCepCode.replace(/-/g, '');
                        if (currentCepCode !== "" && currentCepCode.length > 10 && currentCepCode.length < 14) {
                            var cepCode = currentCepCode.toUpperCase().trim().split('-');
                            if (cepCode != "" && cepCode != undefined && cepCode.length > 2) {
                                cepCode = (cepCode[0] + cepCode[1] + cepCode[2]);
                                var resp = cepSharedService.isExcepCepCode(cepCode);
                                if (resp.isExpCep) {
                                    $scope.cepMasking = resp.masking;
                                }
                            }
                        }
                    }
                    $(".searchCep.ng-scope").css("display", "none");
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    var selectedRows = gridApi.selection.getSelectedRows();
                    if (selectedRows.length == 0)
                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[$scope.gridOptions.data.indexOf(row.entity)]);
                    var submittedEntry = selectedRows.filter(function (item) {
                        return item.TIMSUB.toUpperCase() == "N"
                    });
                    if (submittedEntry.length < 1)
                        $rootScope.isDeletedRightClickOff = true;
                    else
                        $rootScope.isDeletedRightClickOff = false;
                });
                gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                    $scope.columnChanged = {
                        name: changedColumn.colDef.name, visible: changedColumn.colDef.visible
                    };
                });

                $scope.$on("gridFocus", function (event, args) {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.gridFocus");
                    $scope.IsshowProjComponent = false;
                    $scope.getCurrentFocus();
                    if (($scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity == $scope.selctProjCmp) || ($scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity == $filter('translate')('activity_Title'))) {
                        $rootScope.columnBlank = true;
                        $rootScope.columnBlankTEID = $scope.currentFocused.COLUMNTEID;
                    }

                    if ($scope.colDefname == "Scope" && $scope.saveOnCancelPopUp === true && !$rootScope.columnBlank) {
                        broadcastService.notifyRefreshGrid(getComponent());
                    }

                    if ($scope.colDefname != "Scope" && $scope.currentFocused != undefined && $scope.gridOptions.data[$scope.currentFocused.rowIndex].CEP_REC.CLIENO != $scope.oldCepEntry && $scope.oldCepEntry != "") {

                        if (args.value == "ProjectComponent") {
                            if ($scope.saveOnCancelPopUp === true && !$rootScope.columnBlank) {
                                broadcastService.notifyRefreshGrid(getComponent());
                            }
                            else {
                                $scope.saveOnCancelPopUp = false;
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity = $scope.selctProjCmp;
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].Component = "";
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].Scope = "";
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].Task = "";
                                $rootScope.isCategory = true;
                            }
                        }
                        else {
                            if ($scope.saveOnCancelPopUp === true && !$rootScope.columnBlank) {
                                broadcastService.notifyRefreshGrid(getActivityObj());
                            }
                            else {
                                $scope.saveOnCancelPopUp = false;
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity = $filter('translate')('activity_Title');
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].Component = "";
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].Scope = "";
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].Task = "";
                                $rootScope.isCategory = false;
                            }
                        }
                        $rootScope.columnBlank = true;
                        $rootScope.columnBlankTEID = $scope.currentFocused.COLUMNTEID;
                    }
                    $scope.oldCepEntry = "";
                    $scope.isDescriptionPopupLoad = false;
                });
                $scope.$on("CEPCodefavourite", function (event, args) {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.CEPCodefavourite");
                    var cepdetails = args.value;
                    cepService.loadCEPDetail($scope.loginDetail.SESKEY, cepdetails.CLIEID, cepdetails.ENGID, cepdetails.PRJID, $scope.domainURL).then(function (response) {
                        if (parseInt(response.LOADCEP_OUT_OBJ.RETCD) == 0 && $rootScope.IsshowCEPCodefavourite) {
                            $rootScope.IsshowCEPCodefavourite = false;
                            var isValiddata = true;
                            var cep_detail = angular.copy(response.LOADCEP_OUT_OBJ.CEP_REC);
                            var blockcharges = $scope.initialDetail.COMP_REC.BCHB;

                            if (blockcharges !== undefined && (blockcharges !== null) && (blockcharges != '') && blockcharges.toUpperCase() != "NO" && blockcharges.toUpperCase() != "N") {
                                for (var i = 0; i < blockcharges.length; i++) {
                                    if (cep_detail.CHARBASIS == blockcharges.charAt(i)) {
                                        showValidationMsg([$filter('translate')('msg_CEPChargeBasisErr', {
                                            values: blockcharges
                                        })]);
                                        return false;

                                    }
                                }
                            }
                            if (cep_detail.CLIEACTIVE != 'Y' || cep_detail.ENGACTIVE != 'Y' || cep_detail.PRJACTIVE != 'Y') {
                                showValidationMsg([$filter('translate')('msg_InActiveCep')], false, $filter('translate')('lbl_Error'));
                                return false;
                            }
                            if (cep_detail.ENGTIMFLAG != 'Y') {
                                showValidationMsg([$filter('translate')('msg_SelectAnotherEng')], false, $filter('translate')('lbl_Error'));
                                event.preventDefault();
                                return false;
                            }

                            if ((cep_detail.PRJTIMFLAG != 'Y')) {
                                showValidationMsg([$filter('translate')('msg_SelectAnotherPrj')], false, $filter('translate')('lbl_Error'));
                                return false;
                            }

                            if (((cep_detail.RENPRJNO != null) && (cep_detail.RENPRJNO != ' ')) && (typeof cep_detail.RENPRJNO != 'undefined')) {
                                var pro = parseInt(cep_detail.RENPRJNO) > 99 ? (parseInt(cep_detail.RENPRJNO)).toString() : parseInt(cep_detail.RENPRJNO) > 9 ? '0' + (parseInt(cep_detail.RENPRJNO)).toString() : '00' + (parseInt(cep_detail.RENPRJNO)).toString();
                                var cepcode = cep_detail.CLIENO + '-' + cep_detail.ENGNO + '-' + cep_detail.PRJNO;
                                showValidationMsg([$filter('translate')('msg_ProjectRenewedPaste', {
                                    pName: pro, cepProject: cepcode
                                })], "Warning", 'z');
                                cep_detail.IsProjRenewd = true;

                            }


                            $scope.getCurrentFocus();
                            if ($scope.isDailyMode)
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].CEP_REC.CLIENO = args.value.cepCodeWithMask;
                            else
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].data.CEP_REC.CLIENO = args.value.cepCodeWithMask;
                            $scope.previousData = angular.copy($scope.row);
                            $scope.row = angular.copy(args.value);
                            $scope.loadDesktopActivityProject(args.value);


                        }
                    });

                });
                $scope.$on("refreshGrid", function (event, args) {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.refreshGrid");
                    if ($scope.beginCellEditFlag) {
                        $scope.beginCellEditFlag = false;
                        $scope.IsshowProjComponent = false;
                        $scope.saveFlag = true;
                        if ($rootScope.gridrow != undefined) {

                            if ($scope.cepfavourite) {
                                $rootScope.gridrow.CEP_REC = angular.copy($scope.row);
                                delete $rootScope.gridrow.CEP_REC.CEPCODE;
                                delete $rootScope.gridrow.CEP_REC.CEPFAV;
                                delete $rootScope.gridrow.CEP_REC.RMGR;
                                delete $rootScope.gridrow.CEP_REC.cepCodeWithMask;
                                delete $rootScope.gridrow.CEP_REC.cepCodeWithOutMask;
                                if ($rootScope.gridrow.CEP_REC.CATID > 0)
                                    $scope.isProjectTask = true;
                                else
                                    $scope.isProjectTask = false;
                            }


                            if (args.value === null && !$scope.saveOnCancelPopUp) {
                                return;
                            }
                            var selectedItem = args.value === null ? null : args.value.valueOf();
                            var weeklyHour = $rootScope.gridrow.HRS;

                            var teid_data = $rootScope.gridrow.TEID;
                            if (!$scope.isDailyMode) {
                                weeklyHour = [$rootScope.gridrow.Hrs1, $rootScope.gridrow.Hrs2, $rootScope.gridrow.Hrs3, $rootScope.gridrow.Hrs4, $rootScope.gridrow.Hrs5, $rootScope.gridrow.Hrs6, $rootScope.gridrow.Hrs7];
                                teid_data = new Array(7);
                                teid_data[0] = typeof $rootScope.gridrow.TEID1 != 'undefined' ? $rootScope.gridrow.TEID1 : 0;
                                teid_data[1] = typeof $rootScope.gridrow.TEID2 != 'undefined' ? $rootScope.gridrow.TEID2 : 0;
                                teid_data[2] = typeof $rootScope.gridrow.TEID3 != 'undefined' ? $rootScope.gridrow.TEID3 : 0;
                                teid_data[3] = typeof $rootScope.gridrow.TEID4 != 'undefined' ? $rootScope.gridrow.TEID4 : 0;
                                teid_data[4] = typeof $rootScope.gridrow.TEID5 != 'undefined' ? $rootScope.gridrow.TEID5 : 0;
                                teid_data[5] = typeof $rootScope.gridrow.TEID6 != 'undefined' ? $rootScope.gridrow.TEID6 : 0;
                                teid_data[6] = typeof $rootScope.gridrow.TEID7 != 'undefined' ? $rootScope.gridrow.TEID7 : 0;
                            }
                            if (selectedItem !== null && selectedItem != undefined && selectedItem.scopeObj == null && $rootScope.gridrow.SCOID == null)
                                $rootScope.gridrow.SCOID = 0;
                            if ($scope.isProjectTask) {
                                //alert('$scope.time_record isProjectTask refreshGrid--' +JSON.stringify(selectedItem));

                                $scope.time_record = {
                                    teId: teid_data,
                                    cepCode: $rootScope.gridrow.CEP_REC.CLIENO,
                                    hrs: weeklyHour,
                                    description: selectedItem !== null && selectedItem != undefined ? ((selectedItem.componentTaskText != undefined) ? (selectedItem.componentTaskText + ' ' + selectedItem.descriptionText) : (selectedItem.data != undefined ? selectedItem.data : selectedItem.DES)) : $rootScope.gridrow.DES,
                                    cepRec: $rootScope.gridrow.CEP_REC,
                                    actRec: selectedItem !== null && selectedItem != undefined && selectedItem.component != undefined ? {
                                        "ACTICD": selectedItem.component.selected.ACTICD, "DES": selectedItem.descriptionText, "STAT": $rootScope.gridrow.ACTI_REC.STAT
                                    } : $rootScope.gridrow.ACTI_REC,
                                    cmptId: selectedItem !== null && selectedItem != undefined && selectedItem.component != undefined ? selectedItem.component.selected.CMPTID : $rootScope.gridrow.CMPTID,
                                    tskId: selectedItem !== null && selectedItem != undefined && selectedItem.component != undefined ? selectedItem.task.selected.TSKID : $rootScope.gridrow.TSKID,
                                    scopId: selectedItem !== null && selectedItem != undefined && selectedItem.scopeObj != undefined ? selectedItem.scopeObj.SCOPID : $rootScope.gridrow.SCOID,
                                    regFlag: $scope.isDailyMode ? $rootScope.gridrow.REGFLAG : $rootScope.gridrow.data.REGFLAG,
                                    stateCode: $scope.isDailyMode ? $rootScope.gridrow.PRSTCD : $rootScope.gridrow.data.PRSTCD,
                                    icrtcd: selectedItem !== null && selectedItem != undefined && selectedItem.ICRTCD != null && selectedItem.ICRTCD.trim() != "" ? selectedItem.ICRTCD : $rootScope.gridrow.ICRTCD,
                                    icdesc: selectedItem !== null && selectedItem != undefined && selectedItem.ICRTCD != null && selectedItem.ICRTCD.trim() != "" ? selectedItem.DES : $rootScope.gridrow.ICDESC,
                                    icchrge: selectedItem !== null && selectedItem != undefined && selectedItem.ICRTCD != null && selectedItem.ICRTCD.trim() != "" ? selectedItem.CHRG : $rootScope.gridrow.ICCHRGE,
                                    CTDESC: selectedItem !== null && selectedItem != undefined && selectedItem.descriptionText !== undefined ? selectedItem.descriptionText : $rootScope.gridrow.CTDESC

                                }
                            }
                            else {
                                $scope.time_record = {
                                    teId: teid_data,
                                    DTE: $scope.currentDate,
                                    cepRec: $rootScope.gridrow.CEP_REC,
                                    actRec: selectedItem !== null && selectedItem != undefined && selectedItem.ACTICD != undefined ? {
                                        "ACTICD": selectedItem.ACTICD, "DES": selectedItem.DES, "STAT": selectedItem.STAT, "COMPID": selectedItem.COMPID
                                    } : $rootScope.gridrow.ACTI_REC,
                                    icrtcd: selectedItem !== null && selectedItem != undefined && selectedItem.ICRTCD != null && selectedItem.ICRTCD.trim() != "" ? selectedItem.ICRTCD : $rootScope.gridrow.ICRTCD,
                                    icdesc: selectedItem !== null && selectedItem != undefined && selectedItem.ICRTCD != null && selectedItem.ICRTCD.trim() != "" ? selectedItem.DES : $rootScope.gridrow.ICDESC,
                                    icchrge: selectedItem !== null && selectedItem != undefined && selectedItem.ICRTCD != null && selectedItem.ICRTCD.trim() != "" ? selectedItem.CHRG : $rootScope.gridrow.ICCHRGE,
                                    cepCode: $rootScope.gridrow.CEP_REC.CLIENO,
                                    hrs: weeklyHour,
                                    description: (selectedItem !== null && selectedItem != undefined && selectedItem.data != undefined) ? selectedItem.data : $rootScope.gridrow.DES,
                                    //description: selectedItem != undefined ? ((selectedItem.DES != undefined) ? selectedItem.DES: (selectedItem.data != undefined ? selectedItem.data: selectedItem.DES)): $rootScope.gridrow.DES,
                                    CTDESC: "",
                                    cmptId: 0,
                                    CATID: 0,
                                    tskId: 0,
                                    scopId: 0,
                                    regFlag: $scope.isDailyMode ? $rootScope.gridrow.REGFLAG : $rootScope.gridrow.data.REGFLAG,
                                    stateCode: $scope.isDailyMode ? $rootScope.gridrow.PRSTCD : $rootScope.gridrow.data.PRSTCD,

                                }
                            }

                            if ($scope.isDailyMode) {
                                var date1 = new Date($scope.currentDate.valueOf());
                                date1 = $filter('date')(date1, 'yyyy-MM-dd');
                                var objFutureTimeEntry = {
                                    DTE: date1, HRS: $scope.time_record.hrs, CEP_REC: {
                                        CHARBASIS: ($scope.cepObj.selected != null && $scope.cepObj.selected != undefined) ? $scope.cepObj.selected.CHARBASIS : $rootScope.gridrow.CEP_REC.CHARBASIS
                                    }

                                }
                                var isFutureEntry = isInvalidFutureEntry(objFutureTimeEntry);
                                //show pop up and set hours to old hours
                                if (isFutureEntry) {
                                    $scope.time_record.hrs = 0;
                                    //showValidationMsg([$filter('translate')('msg_FutureTimeEntry')], $filter('translate')('lbl_Error'), false);
                                }

                            }
                            else {
                                var currentDate = new Date($scope.weeklyStartDate.valueOf());
                                var isfutureEntry = false;
                                for (var x = 0; x < weeklyHour.length; x++) {
                                    var date = currentDate.setDate(currentDate.getDate() + x);
                                    date = $filter('date')(date, 'yyyy-MM-dd');
                                    var objFutureTimeEntry = {
                                        DTE: date, HRS: $scope.time_record.hrs[x], CEP_REC: {
                                            CHARBASIS: ($scope.cepObj.selected != null && $scope.cepObj.selected != undefined) ? $scope.cepObj.selected.CHARBASIS : $rootScope.gridrow.CEP_REC.CHARBASIS
                                        }

                                    }
                                    var isFutureEntry = isInvalidFutureEntry(objFutureTimeEntry);
                                    //show pop up and set hours to old hours
                                    if (isFutureEntry && $scope.time_record.hrs[x] != null) {
                                        isfutureEntry = true
                                        $scope.time_record.hrs[x] = 0;
                                    }
                                }
                                //if (isfutureEntry) {
                                //    showValidationMsg([$filter('translate')('msg_FutureTimeEntry')], $filter('translate')('lbl_Error'), false);
                                //}

                            }



                            $scope.cellNavigate = false;
                            $scope.isGridFocus = true;
                            updateHrsField($scope.time_record, $scope.isDailyMode);
                            $scope.saveInlineEntry($scope.time_record, gridApi, -1, true);
                            //$scope.isDescriptionPopupLoad =false;
                        }
                    }
                });
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.gridApi.core.on.sortChanged");
                    if (sortColumns.length == 3) {
                        for (var x = 0; x < 3; x++) {
                            if (sortColumns[x].grouping.groupPriority == 0) {
                                if (sortColumns[x].visible == false)
                                    localStorage.UnsortApplied = "0";
                                sortColumns[x].footerCellClass = "removeSortClass";
                            }
                            else
                                sortColumns[x].footerCellClass = "";
                        }
                    }
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
                            if (sortColumns[i].grouping.groupPriority == 0) {
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
                });
            },
            //appScopeProvider: $scope.myAppScopeProvider,

        };
        var getActivityObj = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getActivityObj");
            var activity = {};
            activity.ACTICD = $rootScope.gridrow.ACTI_REC.ACTICD;
            activity.DES = $rootScope.gridrow.ACTI_REC.DES;
            activity.STAT = $rootScope.gridrow.ACTI_REC.STAT;
            activity.COMPID = $rootScope.gridrow.ACTI_REC.COMPID;
            return activity;
        }
        var getComponent = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getComponent");
            var isScope = false;
            if ($rootScope.gridrow.SCOPID !== "" && $rootScope.gridrow.SCOPID !== "0" && $rootScope.gridrow.SCOPID !== undefined)
                isScope = true;
            var seprator = ": ";
            var selectedComTaskObj = {
            };
            selectedComTaskObj.component = {
                selected: {}
            }
            selectedComTaskObj.task = {
                selected: {}
            }
            selectedComTaskObj.DES = $rootScope.gridrow.DES;
            selectedComTaskObj.scopeObj = (isScope) ? { SCOPID: $rootScope.gridrow.SCOPID } : null;
            selectedComTaskObj.component.selected = {
                "ACTIVE": $rootScope.gridrow.ACTI_REC.STAT, "ACTICD": $rootScope.gridrow.ACTI_REC.ACTICD, "CMPTID": $rootScope.gridrow.CMPTID
            };
            selectedComTaskObj.task.selected = {
                "ACTIVE": $rootScope.gridrow.ACTI_REC.STAT, "TSKID": $rootScope.gridrow.TSKID
            };

            return selectedComTaskObj;
        }
        $scope.currentFocused = [];

        $scope.getCurrentFocus = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getCurrentFocus");
            var rowCol = $scope.gridApi.cellNav.getFocusedCell();
            if (rowCol !== null && !$rootScope.columnBlank) {
                if (!$scope.isDailyMode) {
                    rowCol.row.entity.TEID = rowCol.row.entity.TEID_data;
                }
                var rowIndex = $scope.gridOptions.data.indexOf(rowCol.row.entity);
                if (rowIndex != "-1")
                    $scope.currentFocused = {
                        'COLUMNTEID': rowCol.row.entity.TEID, 'COLUMNNAME': rowCol.col.colDef.name, 'rowIndex': rowIndex
                    };
            }
        };

        var updateHrsField = function (timeEntery, isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateHrsField");
            if (isDailyMode) {
                $scope.dailyHour = Number(parseFloat(timeEntery.HRS).toFixed(2));
            }
            else {
                $scope.weeklyHours = timeEntery.hrs;
            }
        }
        var updateTEIdToDelete = function (teid, isIncludeAll) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.updateTEIdToDelete");
            var dataAr = [];
            var idStr = null;
            var maxTeId = 0;
            var idArray = teid.toString().split(',');
            if (!isIncludeAll && !$rootScope.isPasteClicked) {
                idArray.sort().map(Number);
                maxTeId = idArray[idArray.length - 1];
                idArray.splice(idArray.length - 1, 1);
                idStr = "";
            }
            if (idArray.length > 1) {
                var idStr = idArray[0].toString();
                for (var j = 1; j < idArray.length; j++) {
                    idStr = idStr + "," + idArray[j].toString();
                }
            }
            else {
                if (idArray.length == 1) {
                    idStr = idArray[0].toString();
                }
            }
            if (idStr != null) {
                teid = maxTeId;
            }
            dataAr = [teid, idStr];
            return dataAr;
        }
        var columnDefs3 = [
                 {
                     name: 'Delete', cellClass: "gridMainGrid", headerCellClass: "monthendClass3", enableSorting: false, enableColumnMenu: false, displayName: '', width: '1.5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{((row.entity.TIMSUB | uppercase) == \'Y\') ?grid.appScope.sbmtdTitle:grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.deleteEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                 },
                           {
                               field: 'Edit', enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '1.5%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-edit ui-grid-cell-contents"  title="{{::grid.appScope.openEntryTitle}}"><input class="entry-edit" ng-click="grid.appScope.editTimeEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                           },
                           {
                               name: 'TYPE', suppressRemoveSort: true, displayName: $filter('translate')('lbl_type'), enableHiding: true, enableAgg: false, groupingShowAggregationMenu: false, visible: false, enableColumnResizing: false, width: '*', enableCellEdit: false, enableColumnResizing: true, cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.TYPE}}"><span ng-if="!row.groupHeader">{{row.entity.TYPE}}</span></div>', allowCellFocus: false,
                               menuItems: [
                                    {
                                        title: $filter('translate')('msg_Filter'),
                                        icon: 'ui-grid-icon-ok',
                                        action: function ($event) {
                                            this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                            this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        },
                                        shown: function () {
                                            return this.grid.options.enableFiltering;
                                        }
                                    },
                                           {
                                               title: $filter('translate')('msg_Filter'),
                                               icon: 'ui-grid-icon-cancel',
                                               order: 0,
                                               action: function ($event) {
                                                   this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                   this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                               },
                                               shown: function () {
                                                   return !this.grid.options.enableFiltering;
                                               }
                                           }]
                           },
                 {
                     field: 'CEP_REC.CLIENO', width: cepWidth, enableHiding: false, enableAgg: false, sort: {
                         direction: uiGridConstants.ASC, priority: 0,
                     }, groupingShowAggregationMenu: false, enableColumnResizing: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: true,
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
               {
                   title: $filter('translate')('msg_Filter'),
                   icon: 'ui-grid-icon-ok',
                   action: function ($event) {
                       this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                       this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                   },
                   shown: function () {
                       return this.grid.options.enableFiltering;
                   }
               },
                      {
                          title: $filter('translate')('msg_Filter'),
                          icon: 'ui-grid-icon-cancel',
                          order: 0,
                          action: function ($event) {
                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                          },
                          shown: function () {
                              return !this.grid.options.enableFiltering;
                          }
                      }],

                     enableCellEditOnFocus: true,
                     //cellTooltip: function (row, col) {
                     //    return row.entity.CEP_REC.CLIENO
                     // },
                     cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%">' + '<div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div>' +
 '<div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-mouseover="grid.appScope.xyPosition($event)" ng-if="!row.groupHeader"><div class="tooltip1 ui-grid-cell-contents"><div class="tooltiptext1"><div class="tooltip-heading"><ul><li><h4>{{row.entity.CEP_REC.CLIENAME}}</h4> <span class="flRight firstRight">{{row.entity.CEP_REC.OCOMP}}</span></li><li><span class="flLeft">{{row.entity.CEP_REC.CLIENO}}</span><span class="flRight"><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'C\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'S\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'R\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'N\') > -1"> Non {{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'T\') > -1" >{{::grid.appScope.BillableVar}}</span></span></li></ul></div> <div class="tooltip-desc"><ul><li><span class="flLeft">{{ ::"lbl_Project" | translate }}:</span> <span class="flRight">{{row.entity.CEP_REC.PRJNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_engmnt" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.ENGNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_prgrm" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.PROG}}</span></li><li><span class="flLeft">{{ ::"lbl_bsns" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.GLOBBUSI}}</span></li></ul></div></div> {{COL_FIELD}} </div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-cepFav"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.TEID}}" ui-mask="{{grid.appScope.cepMasking}}" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity, \'txtgridcep\' + row.entity.TEID)" />' +
                                                     '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV!=true && grid.appScope.isCepFavSet\'><i class=\'fa fa-star-o\'></i></button>' +
                                                     '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV==true && grid.appScope.isCepFavSet\' ><i class=\'fa fa-star\'></i></button>' +
                                                     '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
                 },
                 {
                     name: 'CEP_REC.CHARBASIS', width: widthCB, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('msg_CB'), enableCellEdit: false, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplateDaily,
                     cellTemplate: '<div class="ui-grid-cell"  style="width:100%;height:100%"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.CEP_REC.CHARBASIS}}</div></div>', allowCellFocus: false,
                     menuItems: [
                  {
                      title: $filter('translate')('msg_Filter'),
                      icon: 'ui-grid-icon-ok',
                      action: function ($event) {
                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                      },
                      shown: function () {
                          return this.grid.options.enableFiltering;
                      }
                  },
                         {
                             title: $filter('translate')('msg_Filter'),
                             icon: 'ui-grid-icon-cancel',
                             order: 0,
                             action: function ($event) {
                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                             },
                             shown: function () {
                                 return !this.grid.options.enableFiltering;
                             }
                         }],
                 },

                 {
                     name: 'ProjectActivity', width: '23%', suppressRemoveSort: true, displayName: $filter('translate')('msg_activityProjCNT'), groupingShowAggregationMenu: false, enableCellEdit: true,
                     cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.ProjectActivity}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ProjectActivity}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-Act"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridact\' + row.entity.TEID)" />' +
                                             '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                             '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                             '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                  {
                      title: $filter('translate')('msg_Filter'),
                      icon: 'ui-grid-icon-ok',
                      action: function ($event) {
                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                      },
                      shown: function () {
                          return this.grid.options.enableFiltering;
                      }
                  },
                         {
                             title: $filter('translate')('msg_Filter'),
                             icon: 'ui-grid-icon-cancel',
                             order: 0,
                             action: function ($event) {
                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                             },
                             shown: function () {
                                 return !this.grid.options.enableFiltering;
                             }
                         }],
                 },

                 {
                     name: 'Component', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Component'), groupingShowAggregationMenu: false, visible: false, enableCellEdit: true,

                     cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Component}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Component}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridcomponent\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridcomponent\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                      {
                          title: $filter('translate')('msg_Filter'),
                          icon: 'ui-grid-icon-ok',
                          action: function ($event) {
                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                          },
                          shown: function () {
                              return this.grid.options.enableFiltering;
                          }
                      },
                         {
                             title: $filter('translate')('msg_Filter'),
                             icon: 'ui-grid-icon-cancel',
                             order: 0,
                             action: function ($event) {
                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                             },
                             shown: function () {
                                 return !this.grid.options.enableFiltering;
                             }
                         }],
                 },
                 {
                     name: 'Task', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Task'), groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, enableCellEditOnFocus: true,
                     cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.Task}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Task}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridtask\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridtask\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                 {
                     title: $filter('translate')('msg_Filter'),
                     icon: 'ui-grid-icon-ok',
                     action: function ($event) {
                         this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                         this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                     },
                     shown: function () {
                         return this.grid.options.enableFiltering;
                     }
                 },
             {
                 title: $filter('translate')('msg_Filter'),
                 icon: 'ui-grid-icon-cancel',
                 order: 0,
                 action: function ($event) {
                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                 },
                 shown: function () {
                     return !this.grid.options.enableFiltering;
                 }
             }],
                 },
                           {
                               name: 'Scope', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Scope'), groupingShowAggregationMenu: false, visible: false, enableCellEdit: true, enableCellEditOnFocus: true,
                               cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Scope}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Scope}}</div></div>',
                               editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridscope\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridscope\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',

                               cellEditableCondition: function ($scope) {
                                   if ($scope.row.entity.TIMSUB == "Y") {
                                       //showMessagePopUp([submitMessage]);
                                       return 0;
                                   }
                                   return 1
                               },
                               menuItems: [
                                {
                                    title: $filter('translate')('msg_Filter'),
                                    icon: 'ui-grid-icon-ok',
                                    action: function ($event) {
                                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                    },
                                    shown: function () {
                                        return this.grid.options.enableFiltering;
                                    }
                                },
                                         {
                                             title: $filter('translate')('msg_Filter'),
                                             icon: 'ui-grid-icon-cancel',
                                             order: 0,
                                             action: function ($event) {
                                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                             },
                                             shown: function () {
                                                 return !this.grid.options.enableFiltering;
                                             }
                                         }],
                           },

                 {
                     name: 'ICDESC', suppressRemoveSort: true, displayName: $filter('translate')('lbl_IcItem'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true,
                     cellTemplate: '<div class="ui-grid-cell" ng-attr-title="{{row.entity.ICDESC == \' \'?\'\':row.entity.ICDESC}}" style="width:100%;height:100%"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ICDESC}}</div></div>', allowCellFocus: true,
                     editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridicdesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadICItems()" ></i></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                      {
                          title: $filter('translate')('msg_Filter'),
                          icon: 'ui-grid-icon-ok',
                          action: function ($event) {
                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                          },
                          shown: function () {
                              return this.grid.options.enableFiltering;
                          }
                      },
                             {
                                 title: $filter('translate')('msg_Filter'),
                                 icon: 'ui-grid-icon-cancel',
                                 order: 0,
                                 action: function ($event) {
                                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                 },
                                 shown: function () {
                                     return !this.grid.options.enableFiltering;
                                 }
                             }],
                 },
                 {
                     name: 'ICCHRGE', suppressRemoveSort: true, displayName: $filter('translate')('lbl_IcCharge'), enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableColumnResizing: false, type: 'number',
                     cellTemplate: '<div class="ui-grid-cell rightAlig rightAligPadding" style="width:100%;height:100%"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{((row.entity.ICCHRGE.trim()==="")?(null):(row.entity.ICCHRGE |decimal))}}</div></div>', allowCellFocus: true,
                     //editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" /></div>',
                     editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                  {
                      title: $filter('translate')('msg_Filter'),
                      icon: 'ui-grid-icon-ok',
                      action: function ($event) {
                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                      },
                      shown: function () {
                          return this.grid.options.enableFiltering;
                      }
                  },
                         {
                             title: $filter('translate')('msg_Filter'),
                             icon: 'ui-grid-icon-cancel',
                             order: 0,
                             action: function ($event) {
                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                             },
                             shown: function () {
                                 return !this.grid.options.enableFiltering;
                             }
                         }],
                 },
                 {
                     name: 'DES', width: '*', suppressRemoveSort: true, displayName: 'Description', groupingShowAggregationMenu: false, enableCellEdit: true,
                     cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.DES}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.DES}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-desc"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgriddesc\' + row.entity.TEID)" />' +
                                            '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                          '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                           '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDescription(row.entity)"></i><!--<img ng-click="grid.appScope.showInfo(row)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                      {
                          title: $filter('translate')('msg_Filter'),
                          icon: 'ui-grid-icon-ok',
                          action: function ($event) {
                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                          },
                          shown: function () {
                              return this.grid.options.enableFiltering;
                          }
                      },
                             {
                                 title: $filter('translate')('msg_Filter'),
                                 icon: 'ui-grid-icon-cancel',
                                 order: 0,
                                 action: function ($event) {
                                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                 },
                                 shown: function () {
                                     return !this.grid.options.enableFiltering;
                                 }
                             }],
                 }

        ];

        var columnDefs4 = [
                 {
                     name: 'Delete', cellClass: "gridMainGrid", headerCellClass: "monthendClass4", enableSorting: false, enableColumnMenu: false, displayName: '', width: '1.5%', enableFiltering: false, enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" value={{row.entity}} class="icon-delete ui-grid-cell-contents" title="{{((row.entity.TIMSUB | uppercase) == \'Y\') ?grid.appScope.sbmtdTitle:grid.appScope.dltTitle}}"><input ng-class="(row.entity.TIMSUB | uppercase) == \'Y\' ?\'entry-submit\':\'entry-delete\'" ng-click="grid.appScope.deleteEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                 },
                         {
                             field: 'Edit', enableSorting: false, enableColumnMenu: false, displayName: '', enableFiltering: false, width: '1.5%', enableHiding: false, groupingShowAggregationMenu: false, enableCellEdit: false, enableColumnResizing: false, cellTemplate: '<div ng-if="!row.groupHeader" class="icon-edit ui-grid-cell-contents"  title="{{::grid.appScope.openEntryTitle}}"><input class="entry-edit" ng-click="grid.appScope.editTimeEntry(row.entity)" type="image" id="imgGridDeleteEdit" /></div>', allowCellFocus: false, enableColumnMoving: false
                         },
               {
                   name: 'TYPE', suppressRemoveSort: true, displayName: $filter('translate')('lbl_type'), enableHiding: true, enableAgg: false, groupingShowAggregationMenu: false, visible: false, enableColumnResizing: false, width: '*', enableCellEdit: false, enableColumnResizing: true, cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.TYPE}}"><span ng-if="!row.groupHeader">{{row.entity.TYPE}}</span></div>', allowCellFocus: false,
                   menuItems: [
                        {
                            title: $filter('translate')('msg_Filter'),
                            icon: 'ui-grid-icon-ok',
                            action: function ($event) {
                                this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            },
                            shown: function () {
                                return this.grid.options.enableFiltering;
                            }
                        },
                               {
                                   title: $filter('translate')('msg_Filter'),
                                   icon: 'ui-grid-icon-cancel',
                                   order: 0,
                                   action: function ($event) {
                                       this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                       this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                   },
                                   shown: function () {
                                       return !this.grid.options.enableFiltering;
                                   }
                               }]
               },
              {
                  field: 'CEP_REC.CLIENO', width: cepWidth, enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, sort: {
                      direction: uiGridConstants.ASC, priority: 0,
                  }, enableColumnResizing: false, suppressRemoveSort: true, displayName: $filter('translate')('lbl_CepCode'), enableCellEdit: true,
                  cellEditableCondition: function ($scope) {
                      if ($scope.row.entity.TIMSUB == "Y") {
                          //showMessagePopUp([submitMessage]);
                          return 0;
                      } return 1
                  },
                  menuItems: [
            {
                title: $filter('translate')('msg_Filter'),
                icon: 'ui-grid-icon-ok',
                action: function ($event) {
                    this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                    this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                },
                shown: function () {
                    return this.grid.options.enableFiltering;
                }
            },
                   {
                       title: $filter('translate')('msg_Filter'),
                       icon: 'ui-grid-icon-cancel',
                       order: 0,
                       action: function ($event) {
                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                       },
                       shown: function () {
                           return !this.grid.options.enableFiltering;
                       }
                   }],

                  enableCellEditOnFocus: true,
                  //cellTooltip: function (row, col) {
                  //    return row.entity.CEP_REC.CLIENO
                  //},
                  cellTemplate: '<div id="header" class="ui-grid-cell-contents ui-grid-cell" style="width:100%;height:100%">' + '<div class="myTimeHeaderClass" ng-if="row.groupHeader">{{grid.appScope.getHeader(row)}}</div>' +
 '<div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-mouseover="grid.appScope.xyPosition($event)" ng-if="!row.groupHeader"><div class="tooltip1 ui-grid-cell-contents"><div class="tooltiptext1"><div class="tooltip-heading"><ul><li><h4>{{row.entity.CEP_REC.CLIENAME}}</h4> <span class="flRight firstRight">{{row.entity.CEP_REC.OCOMP}}</span></li><li><span class="flLeft">{{row.entity.CEP_REC.CLIENO}}</span><span class="flRight"><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'C\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'S\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'R\') > -1"> Chargeable</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'N\') > -1"> Non {{::grid.appScope.BillableVar}}</span><span ng-if="row.entity.CEP_REC.CHARBASIS.indexOf(\'T\') > -1">{{::grid.appScope.BillableVar}}</span></span></li></ul></div> <div class="tooltip-desc"><ul><li><span class="flLeft">{{ ::"lbl_Project" | translate }}:</span> <span class="flRight">{{row.entity.CEP_REC.PRJNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_engmnt" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.ENGNAME}}</span></li><li><span class="flLeft">{{ ::"lbl_prgrm" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.PROG}}</span></li><li><span class="flLeft">{{ ::"lbl_bsns" | translate }}:</span><span class="flRight">{{row.entity.CEP_REC.GLOBBUSI}}</span></li></ul></div></div> {{COL_FIELD}} </div></div>',
                  editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-cepFav"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgridcep\' + row.entity.TEID}}" ui-mask="{{grid.appScope.cepMasking}}" placeholder="______-___-___" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridCepComplete(row.entity, \'txtgridcep\' + row.entity.TEID)" />' +
                                '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV!=true && grid.appScope.isCepFavSet\'><i class=\'fa fa-star-o\'></i></button>' +
                                '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeCepInlineFav(row)\' ng-show=\'grid.appScope.ISINLINECEPFAV==true && grid.appScope.isCepFavSet\' ><i class=\'fa fa-star\'></i></button>' +
                                '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.showCEPFavourites(row)" ></i></div><div class="searchCep" ng-click="grid.appScope.closeSearchGridCep(row.entity)" style="position:absolute;z-index:5;background:#fff" ng-if="grid.appScope.searchGridCep(row) == true">' + cepTemplate + '</div>',
              },
               {
                   name: 'CEP_REC.CHARBASIS', width: widthCB, groupingShowAggregationMenu: false, suppressRemoveSort: true, displayName: $filter('translate')('msg_CB'), enableCellEdit: false, enableColumnResizing: false, headerCellTemplate: myHeaderCellTemplateDaily,
                   cellTemplate: '<div class="ui-grid-cell" style="width:100%;height:100%"><span ng-if="!row.groupHeader">{{row.entity.CEP_REC.CHARBASIS}}</span></div>', allowCellFocus: false,
                   menuItems: [
                {
                    title: $filter('translate')('msg_Filter'),
                    icon: 'ui-grid-icon-ok',
                    action: function ($event) {
                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    },
                    shown: function () {
                        return this.grid.options.enableFiltering;
                    }
                },
                       {
                           title: $filter('translate')('msg_Filter'),
                           icon: 'ui-grid-icon-cancel',
                           order: 0,
                           action: function ($event) {
                               this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                               this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                           },
                           shown: function () {
                               return !this.grid.options.enableFiltering;
                           }
                       }],
               },
               {
                   name: 'ProjectActivity', width: '23%', suppressRemoveSort: true, displayName: $filter('translate')('msg_activityProjCNT'), groupingShowAggregationMenu: false, enableCellEdit: true, visible: false,
                   cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.ProjectActivity}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ProjectActivity}}</div></div>',
                   editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-Act"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridact\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridact\' + row.entity.TEID)" />' +
                                           '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                            '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavActInline(row.entity.ACTI_REC)\' ng-show=\'grid.appScope.isSameCompny && grid.appScope.IsInlineActFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                         '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                   cellEditableCondition: function ($scope) {
                       if ($scope.row.entity.TIMSUB == "Y") {
                           //showMessagePopUp([submitMessage]);
                           return 0;
                       } return 1
                   },
                   menuItems: [
                {
                    title: $filter('translate')('msg_Filter'),
                    icon: 'ui-grid-icon-ok',
                    action: function ($event) {
                        this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                        this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    },
                    shown: function () {
                        return this.grid.options.enableFiltering;
                    }
                },
                       {
                           title: $filter('translate')('msg_Filter'),
                           icon: 'ui-grid-icon-cancel',
                           order: 0,
                           action: function ($event) {
                               this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                               this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                           },
                           shown: function () {
                               return !this.grid.options.enableFiltering;
                           }
                       }],
               },

              {
                  name: 'Component', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Component'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true,


                  cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Component}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Component}}</div></div>',
                  editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridcomponent\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridcomponent\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                  cellEditableCondition: function ($scope) {
                      if ($scope.row.entity.TIMSUB == "Y") {
                          //showMessagePopUp([submitMessage]);
                          return 0;
                      } return 1
                  },
                  menuItems: [
                   {
                       title: $filter('translate')('msg_Filter'),
                       icon: 'ui-grid-icon-ok',
                       action: function ($event) {
                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                       },
                       shown: function () {
                           return this.grid.options.enableFiltering;
                       }
                   },
                          {
                              title: $filter('translate')('msg_Filter'),
                              icon: 'ui-grid-icon-cancel',
                              order: 0,
                              action: function ($event) {
                                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                              },
                              shown: function () {
                                  return !this.grid.options.enableFiltering;
                              }
                          }],
              },

                 {
                     name: 'Task', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Task'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableCellEditOnFocus: true,
                     cellTemplate: '<div class="ui-grid-edit"  ng-attr-title="{{row.entity.Task}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Task}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridtask\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridtask\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                  {
                      title: $filter('translate')('msg_Filter'),
                      icon: 'ui-grid-icon-ok',
                      action: function ($event) {
                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                      },
                      shown: function () {
                          return this.grid.options.enableFiltering;
                      }
                  },
                         {
                             title: $filter('translate')('msg_Filter'),
                             icon: 'ui-grid-icon-cancel',
                             order: 0,
                             action: function ($event) {
                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                             },
                             shown: function () {
                                 return !this.grid.options.enableFiltering;
                             }
                         }],
                 },
                 {
                     name: 'Scope', suppressRemoveSort: true, displayName: $filter('translate')('lbl_Scope'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableCellEditOnFocus: true,
                     cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.Scope}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.Scope}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;"  type="INPUT_TYPE" ng-attr-id="{{\'txtgridscope\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgridscope\' + row.entity.TEID)" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDesktopActivityProject(row,true)" ></i></div>',

                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                      {
                          title: $filter('translate')('msg_Filter'),
                          icon: 'ui-grid-icon-ok',
                          action: function ($event) {
                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                          },
                          shown: function () {
                              return this.grid.options.enableFiltering;
                          }
                      },
                             {
                                 title: $filter('translate')('msg_Filter'),
                                 icon: 'ui-grid-icon-cancel',
                                 order: 0,
                                 action: function ($event) {
                                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                 },
                                 shown: function () {
                                     return !this.grid.options.enableFiltering;
                                 }
                             }],
                 },
              {
                  name: 'ICDESC', suppressRemoveSort: true, displayName: $filter('translate')('lbl_IcItem'), groupingShowAggregationMenu: false, visible: true, enableCellEdit: true,
                  cellTemplate: '<div class="ui-grid-cell" ng-attr-title="{{row.entity.ICDESC == \' \'?\'\':row.entity.ICDESC}}" style="width:100%;height:100%"><div  ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.ICDESC}}</div></div>', allowCellFocus: true,
                  editableCellTemplate: '<div class="ui-grid-edit"><input style="width:100%;" readOnly type="INPUT_TYPE" ng-attr-id="{{\'txtgridicdesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" /><i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadICItems()" ></i></div>',
                  cellEditableCondition: function ($scope) {
                      if ($scope.row.entity.TIMSUB == "Y") {
                          //showMessagePopUp([submitMessage]);
                          return 0;
                      } return 1
                  },
                  menuItems: [
                   {
                       title: $filter('translate')('msg_Filter'),
                       icon: 'ui-grid-icon-ok',
                       action: function ($event) {
                           this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                           this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                       },
                       shown: function () {
                           return this.grid.options.enableFiltering;
                       }
                   },
                          {
                              title: $filter('translate')('msg_Filter'),
                              icon: 'ui-grid-icon-cancel',
                              order: 0,
                              action: function ($event) {
                                  this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                  this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                              },
                              shown: function () {
                                  return !this.grid.options.enableFiltering;
                              }
                          }],
              },
                 {
                     name: 'ICCHRGE', suppressRemoveSort: true, displayName: $filter('translate')('lbl_IcCharge'), enableHiding: false, enableAgg: false, groupingShowAggregationMenu: false, visible: true, enableCellEdit: true, enableColumnResizing: false, type: 'number',
                     cellTemplate: '<div class="ui-grid-cell rightAlig rightAligPadding" style="width:100%;height:100%"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{((row.entity.ICCHRGE.trim()==="")?(null):(row.entity.ICCHRGE |decimal))}}</div></div>', allowCellFocus: true,
                     editableCellTemplate: '<div class="ui-grid-edit"><input class="hrsInputGrid hrsTxt" style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txthrs\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keypress="grid.appScope.filterValue($event)"/></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                      {
                          title: $filter('translate')('msg_Filter'),
                          icon: 'ui-grid-icon-ok',
                          action: function ($event) {
                              this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                              this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                          },
                          shown: function () {
                              return this.grid.options.enableFiltering;
                          }
                      },
                             {
                                 title: $filter('translate')('msg_Filter'),
                                 icon: 'ui-grid-icon-cancel',
                                 order: 0,
                                 action: function ($event) {
                                     this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                     this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                 },
                                 shown: function () {
                                     return !this.grid.options.enableFiltering;
                                 }
                             }],
                 },
                 {
                     name: 'DES', suppressRemoveSort: true, displayName: 'Description', groupingShowAggregationMenu: false, enableCellEdit: true, visible: false,
                     cellTemplate: '<div class="ui-grid-edit" ng-attr-title="{{row.entity.DES}}"><div ng-click="grid.appScope.stopEditOnCtrlClick($event)" ng-if="!row.groupHeader">{{row.entity.DES}}</div></div>',
                     editableCellTemplate: '<div class="ui-grid-edit ui-grid-inline-desc"><input style="width:100%;" type="INPUT_TYPE" ng-attr-id="{{\'txtgriddesc\' + row.entity.TEID}}" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-keyup="grid.appScope.gridActComplete(row.entity, \'txtgriddesc\' + row.entity.TEID)" />' +
                                             '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.addFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav!=true\' ><i class=\'fa fa-star-o\'></i></button>' +
                                             '<button class=\'star-fav star-icon\' ng-mousedown=\'grid.appScope.removeFavDescInline(row.entity.DES.trim())\' ng-show=\'row.entity.DES.trim().length>0 && grid.appScope.IsInlineDescFav==true\' ><i class=\'fa fa-star\'></i></button>' +
                                              '<i class="glyphicon glyphicon-triangle-bottom" ng-click="grid.appScope.loadDescription(row.entity)"></i><!--<img ng-click="grid.appScope.showInfo(row)" src="img/arrow.png" alt="" width="15" height="12">--></div>',
                     // cellTemplate: '<div class="ui-grid-cell-contents ui-grid-cell"  tooltip = "{{row.entity.DES}}" tooltip-append-to-body="true"><span>{{row.entity.DES}}</span></div>',
                     cellEditableCondition: function ($scope) {
                         if ($scope.row.entity.TIMSUB == "Y") {
                             //showMessagePopUp([submitMessage]);
                             return 0;
                         } return 1
                     },
                     menuItems: [
                  {
                      title: $filter('translate')('msg_Filter'),
                      icon: 'ui-grid-icon-ok',
                      action: function ($event) {
                          this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                          this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                      },
                      shown: function () {
                          return this.grid.options.enableFiltering;
                      }
                  },
                         {
                             title: $filter('translate')('msg_Filter'),
                             icon: 'ui-grid-icon-cancel',
                             order: 0,
                             action: function ($event) {
                                 this.grid.options.enableFiltering = !this.grid.options.enableFiltering;
                                 this.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                             },
                             shown: function () {
                                 return !this.grid.options.enableFiltering;
                             }
                         }],
                 }

        ];

        var timePriorToBillingStartDate = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.timePriorToBillingStartDate");
            var isDtaeBeforeBillDate = false;
            var firstWeekDate = getWeekFirstDate($scope.currentDate)
            var LastweekDate = new Date(firstWeekDate.getFullYear(), firstWeekDate.getMonth(), firstWeekDate.getDate() + 6);
            var startDate = $scope.isDailyMode ? $scope.currentDate : LastweekDate;
            var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
            isDtaeBeforeBillDate = $rootScope.isDatePriorToBillingDate(billingDate, startDate);
            if (isDtaeBeforeBillDate) {
                var parts = billingDate.split("-");
                var day = parts[2].split(' ');
                var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
                var show = nstartDate.toString().split(' ');
                var date = show[2] + '-' + show[1] + '-' + show[3];
                showValidationMsg([$filter('translate')('msg_TimePriorToBillingStartDate', {
                    dateVal: date
                })], $filter('translate')('lbl_Error'), false);
                return false;
            }
            else {
                return true;
            }
        }

        $scope.$on("rightPanelCEPCodefavourite", function (event, args) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.rightPanelCEPCodefavourite");
            var gridEditData = args.value.valueOf();
            gridEditData.populateCepOnly = true;
            openNewEntryWindowFromCEPFav(gridEditData);
        });

        var openNewEntryWindowFromCEPFav = function (cepCodeObj) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.openNewEntryWindowFromCEPFav");

            if (!$scope.checkRevMonthFlag) {
                showValidationMsg([$scope.revClosed]);
            }
            else if (!timePriorToBillingStartDate()) {
                //
            }
            else {
                var startDate = $scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate;
                cepCodeObj.HRS = 0;
                cepCodeObj.weeklyHour = [0, 0, 0, 0, 0, 0, 0];
                loadNewEnteryWindow(startDate, $scope.isDailyMode, $scope.currentDate, cepCodeObj);
            }
        }
        $scope.openNewEntryWind = function (event) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.openNewEntryWind");
            //disable for close revenue month -- do not open new entry window from short cut key if closed revenue month
            if (!$scope.checkRevMonthFlag) {
                var msg = $filter('translate')('lbl_revClosed');
                showMessagePopUp([msg]);
                return;
            }
            $scope.showNewFlag = false;
            if (!$rootScope.columnBlank) {
                var startDate = $scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate;
                if (timePriorToBillingStartDate()) {
                    $rootScope.showRightMenuFlag = false;
                    $scope.showMenuOutsideGrid = false;
                    $scope.isShowSubmitMenu = false;
                    $scope.showEditFlag = false;
                    $rootScope.newEntryOpened = true;
                    $scope.beginEdit = false;
                    loadNewEnteryWindow(startDate, $scope.isDailyMode, $scope.currentDate, null);
                }
            }

            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }

        var loadNewEnteryWindow = function (startDate, isDailyMode, currentDate, timeEntery) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.loadNewEnteryWindow");
            var hrsTtl = 0;
            var termCompareDte = currentDate
            if (!isDailyMode) {
                termCompareDte = startDate;
            }
            if (!empSharedService.checkTerminationDate($scope.initialDetail.EMPL_REC.TERMDTE, termCompareDte)) {
                var msg = $filter('translate')('msg_InActiveDesignateSelected', {
                    DOT: $scope.initialDetail.EMPL_REC.TERMDTE
                });
                showMessagePopUp([msg]);
                return false;
            }

            //alert(Number(parseFloat(hrsTtl)));
            var hrsSumDayWise = [0, 0, 0, 0, 0, 0, 0];
            var editEntryHrs = [0, 0, 0, 0, 0, 0, 0];
            if (!isDailyMode) {
                $rootScope.isPasteClicked = true;
                $rootScope.weekStateCurrentDate = $filter('date')(currentDate, "yyyy-MM-dd");
                hrsSumDayWise[0] = parseFloat($scope.itemsDataTotal.HrsTotalSum1 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum1)
                hrsSumDayWise[1] = parseFloat($scope.itemsDataTotal.HrsTotalSum2 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum2)
                hrsSumDayWise[2] = parseFloat($scope.itemsDataTotal.HrsTotalSum3 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum3)
                hrsSumDayWise[3] = parseFloat($scope.itemsDataTotal.HrsTotalSum4 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum4)
                hrsSumDayWise[4] = parseFloat($scope.itemsDataTotal.HrsTotalSum5 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum5)
                hrsSumDayWise[5] = parseFloat($scope.itemsDataTotal.HrsTotalSum6 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum6)
                hrsSumDayWise[6] = parseFloat($scope.itemsDataTotal.HrsTotalSum7 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum7)
                if (timeEntery != null)
                    editEntryHrs = timeEntery.weeklyHour.slice(0);
            }
            else {
                hrsSumDayWise[0] = parseFloat($scope.ttlHrs);
                if (timeEntery != null)
                    editEntryHrs[0] = parseFloat(timeEntery.HRS);
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

        $scope.editTimeEntry = function (gridEditData) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.editTimeEntry");
            var selectedItem = $scope.gridApi.selection.getSelectedRows();
            $rootScope.rowIndex = selectedItem[0];
            if (selectedItem.length > 1) {
                showMessagePopUp([$filter('translate')('lbl_notMulEntries')]);
            }
            else {
                $rootScope.newEntryOpened = true;
                var isDailyMode = $scope.isDailyMode;
                var weekStartDate;
                if (isDailyMode) {
                    weekStartDate = new Date($scope.currentDate.valueOf());
                    gridEditData.isICEntry = false;
                    if (gridEditData.ICRTCD != undefined && gridEditData.ICRTCD != null && gridEditData.ICRTCD.trim() != "" && gridEditData.ICRTCD.trim().length) {
                        gridEditData.isICEntry = true;
                    }
                }
                else {
                    weekStartDate = new Date($scope.weeklyStartDate.valueOf());
                    gridEditData.weeklyHour = [gridEditData.Hrs1, gridEditData.Hrs2, gridEditData.Hrs3, gridEditData.Hrs4, gridEditData.Hrs5, gridEditData.Hrs6, gridEditData.Hrs7];

                    var teid_data = new Array(7);
                    teid_data[0] = typeof gridEditData.TEID1 != 'undefined' ? gridEditData.TEID1 : 0;
                    teid_data[1] = typeof gridEditData.TEID2 != 'undefined' ? gridEditData.TEID2 : 0;
                    teid_data[2] = typeof gridEditData.TEID3 != 'undefined' ? gridEditData.TEID3 : 0;
                    teid_data[3] = typeof gridEditData.TEID4 != 'undefined' ? gridEditData.TEID4 : 0;
                    teid_data[4] = typeof gridEditData.TEID5 != 'undefined' ? gridEditData.TEID5 : 0;
                    teid_data[5] = typeof gridEditData.TEID6 != 'undefined' ? gridEditData.TEID6 : 0;
                    teid_data[6] = typeof gridEditData.TEID7 != 'undefined' ? gridEditData.TEID7 : 0;
                    gridEditData.teIdData = teid_data;

                }
                loadNewEnteryWindow(weekStartDate, isDailyMode, $scope.currentDate, gridEditData)
                // $scope.NewClick(sendDate, $scope.currentDate.valueOf(), isDailyMode, true);
            }
        }

        $scope.setMultiSelect = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.setMultiSelect");
            $('#tab1List').multiSelect({
                actcls: 'rowSelected',
                selector: '.ui-grid-row',
                except: [''],
                statics: ['.danger', '[data-no="1"]'],
                callback: function (items) {
                    $scope.selectedRows = items;
                }
            });
        }

        $scope.selectedRows = [];
        $scope.cords = {
            x: 0, y: 0
        };
        $scope.$on("bindGridEvents", function (event, args) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.bindGridEvents");
            // if ($scope.isDailyMode)
            $timeout(function () {
                $scope.bindGridEvents();
            }, 1000);

        });

        var currentDragTimeEntry = null;
        //var dragDropImage = "img/desktop/clone-icon.gif";
        var noDropImg = 'img/no-copy.png';
        var drpImg = 'img/desktop/clone-icon.gif';
        var noDrophtml = '';
        var drophtml = '';
        $scope.bindGridEvents = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.bindGridEvents");
            if ($scope.checkRevMonthFlag) {
                $scope.setDropable();
            }
            $(".ui-grid-row").draggable(
            {
                helper: 'clone',
                revert: 'invalid',
                appendTo: '.page-wrapper',
                start: function (event, ui) {
                    $('#dpmytime td').addClass('highlightCls');
                    var iconImage = "";
                    currentDragTimeEntry = null;
                    $scope.isFromGrid = false;
                    try {
                        try {
                            currentDragTimeEntry = JSON.parse(event.target.childNodes[0].childNodes[1].childNodes[1].attributes['value'].nodeValue);
                            currentDragTimeEntry.isDroppable = true;
                            if (currentDragTimeEntry.CEP_REC.CHARBASIS == 'T' || currentDragTimeEntry.CEP_REC.CHARBASIS == 'S' || currentDragTimeEntry.CEP_REC.CHARBASIS == 'C') {
                                if (parseFloat(currentDragTimeEntry.HRS) < 0) {
                                    currentDragTimeEntry.isDroppable = false;
                                }
                            }
                        } catch (ex) {
                            currentDragTimeEntry = {
                                isDroppable: true
                            }
                        }
                        $scope.selectedRows = [];
                        if (!$scope.isDailyMode) {
                            return false;
                        }
                        $(".page-wrapper").css("overflow", "hidden");
                        if ($scope.checkRevMonthFlag && currentDragTimeEntry.isDroppable) {
                            //$scope.imageName = 'img/desktop/clone-icon.gif';
                            iconImage = drpImg;
                        }
                        else {
                            //$scope.imageName = 'img/no-copy.png';
                            iconImage = noDropImg;
                        }
                        $('.ui-grid-viewport').css('overflow', 'visible');

                        var selectedRows = 0;
                        try {
                            selectedRows = $scope.gridApi.selection.getSelectedRows();
                        } catch (err) {
                            console.log('error in $scope.gridApi.selection.getSelectedRows()')
                        }
                        for (var i = 0; i < selectedRows.length; i++) {
                            $scope.isFromGrid = true;
                            $scope.selectedRows.push(JSON.stringify(selectedRows[i]));
                        }
                        if ($scope.selectedRows == null || $scope.selectedRows.length == 0) {
                            $scope.selectedRows.push(event.target);
                        }
                        var rowCount = $scope.selectedRows.length;
                        $scope.cords.x = event.clientX - 225;
                        noDrophtml = '<div class="dragDrop" style=" z-index:1; font: 11px/16px Trebuchet Ms,tahoma,verdana,helvetica; color: #000;padding:2px 5px 2px 5px;display: inline-block; background:#fff; border: 1px solid #e2e2e2; box-shadow:2px 3px 1px #dddddd;left:' + ($scope.cords.x) + 'px;position: relative;"><img id="imgUiHelper" src=' + noDropImg + ' /> <span>' + (rowCount) + $filter('translate')('msg_slctdCpdEntry') + '</span></div>';
                        //drophtml = '<div class="dragDrop" style="padding:2px 5px 2px 5px; font: 11px/16px Trebuchet Ms,tahoma,verdana,helvetica; color: #000; background:#fff; display: inline-block; border: 1px solid #e2e2e2; box-shadow:2px 3px 1px #dddddd;left:' + ($scope.cords.x) + 'px;position: relative;"><img id="imgUiHelper" src=' + drpImg + ' /> <span>' + (rowCount) + $filter('translate')('msg_slctdCpdEntry') + '</span></div>';
                        drophtml = '<div class="dragDrop" style="position:relative; font: 11px/16px Trebuchet Ms,tahoma,verdana,helvetica; color: #000; display: inline-block; z-index:1;padding:2px 5px 2px 5px; background:#fff; border: 1px solid #e2e2e2; box-shadow:2px 3px 1px #dddddd;left:' + ($scope.cords.x) + 'px;"><img  src=' + iconImage + ' /> <span>' + (rowCount) + $filter('translate')('msg_slctdCpdEntry') + '</span></div>';
                        //var html = '<div class="dragDrop" style="padding:2px 5px 2px 5px; font: 11px/16px Trebuchet Ms,tahoma,verdana,helvetica; color: #000; background:#fff; display: inline-block; border: 1px solid #e2e2e2; box-shadow:2px 3px 1px #dddddd;left:' + ($scope.cords.x) + 'px;position: relative;"><img id="imgUiHelper" src=' + $scope.imageName + ' /> <span>' + (rowCount) + $filter('translate')('msg_slctdCpdEntry') + '</span></div>';
                        ui.helper.html(drophtml);

                    } catch (err) {

                        $(".page-wrapper").css("overflow", "visible");
                        console.log(err.message);
                        return true;
                    }
                },
                stop: function (event, ui) {
                    try {
                        $(".page-wrapper").css("overflow", "visible");
                        $('.ui-grid-viewport').css('overflow', 'scroll');
                        $scope.isCalDrop = false;
                        $scope.draggedTimeEntry = null;
                        $scope.selectedRows = [];
                        $('#dpmytime td').removeClass('highlightCls');
                    }
                    catch (err) {
                        $('#dpmytime td').removeClass('highlightCls');
                        console.log('stop:drag error==' + err.message);
                    }
                }

            }
            )
        }
        $scope.gridOptions = angular.copy($scope.gridOptions1);
        var getNearestMultple = function (hrsVal, tintVal, msgList) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getNearestMultple");
            //tintVal = '0.25';       
            var result = 0;
            if (tintVal == '0') {
                result = parseFloat(hrsVal).toFixed(2);
                return result;
            }
            var val1 = (hrsVal % tintVal)
            if (val1 != 0) {
                //var msg = 'Hours will be rounded to the nearest (higher value) multiple of [' + tintVal + '].'
                var msg = $filter('translate')('msg_HoursRound', {
                    TINT: tintVal
                });
                if ($scope.msgList.indexOf(msg) == -1 && $scope.msgList.indexOf("-" + msg) == -1)
                    $scope.msgList.push(msg);
            }
            if (hrsVal > 0) {

                return (Math.ceil(hrsVal / tintVal) * tintVal).toFixed(2);
            }
            else if (hrsVal < 0) {
                return (Math.floor(hrsVal / tintVal) * tintVal).toFixed(2);
            }
            else return parseFloat(hrsVal).toFixed(2);;
        }

        var showValidationMsg = function (msgList, title, isWarning) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.showValidationMsg");
            var sendData = {
                errorList: msgList,
                title: title,
                isWarning: isWarning
            };
            $scope.openModalCtrl = 'saveValidationAlert';
            $scope.open('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
        };
        var get24HrsMassage = function (dateStr) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.get24HrsMassage");
            var msg = "";
            if ($scope.isDailyMode) {
                msg = $filter('translate')('msg_24HrsDay', {
                    dateVal: dateStr
                });
            }
            else {
                msg = $filter('translate')('msg_24HrsWeek', {
                    dateVal: dateStr
                });
            }
            return msg;
        }
        var isDayHourSumExceed24Hour = function (hrs, hrsindex) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.isDayHourSumExceed24Hour");
            var isExceed = false;
            var ttlHrs = 0
            var hrsSumDayWise = [0, 0, 0, 0, 0, 0, 0];
            var editEntryHrs = [0, 0, 0, 0, 0, 0, 0];
            if (!$scope.isDailyMode) {
                hrsSumDayWise[0] = parseFloat($scope.itemsDataTotal.HrsTotalSum1 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum1)
                hrsSumDayWise[1] = parseFloat($scope.itemsDataTotal.HrsTotalSum2 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum2)
                hrsSumDayWise[2] = parseFloat($scope.itemsDataTotal.HrsTotalSum3 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum3)
                hrsSumDayWise[3] = parseFloat($scope.itemsDataTotal.HrsTotalSum4 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum4)
                hrsSumDayWise[4] = parseFloat($scope.itemsDataTotal.HrsTotalSum5 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum5)
                hrsSumDayWise[5] = parseFloat($scope.itemsDataTotal.HrsTotalSum6 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum6)
                hrsSumDayWise[6] = parseFloat($scope.itemsDataTotal.HrsTotalSum7 == undefined ? 0 : $scope.itemsDataTotal.HrsTotalSum7)
                editEntryHrs = $scope.oldRowEntry;
            }
            else {
                hrsSumDayWise[0] = parseFloat($scope.ttlHrs);
                editEntryHrs[0] = parseFloat($scope.oldRowEntry);
            }
            var weeklyHrsArr = [0, 0, 0, 0, 0, 0, 0];
            if ($scope.isDailyMode) {
                weeklyHrsArr[0] = hrs;
            }
            hrsPerDay = parseFloat(hrs);
            ttlHrs = hrsSumDayWise[hrsindex] - editEntryHrs[hrsindex] + hrsPerDay;
            if (ttlHrs > 24) {
                isExceed = true;
            }
            $scope.oldRowEntry = "";
            return isExceed;
        }
        var checkHours = function (timeEntry, hrsIndex) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.checkHours");
            var hrs = 0, valAfterRounding = "";
            var isContinue = true;
            var tintVal = $scope.initialDetail.COMP_REC.TINT;
            var hrs24Msg = "";
            var isRounded = false;
            var isHrsGt24 = false, sep = "-";
            var entryDate = $scope.startDate;
            var dteVal = new Date($scope.currentDate);
            var dateStr = $filter('date')(dteVal, 'dd-MMM-yyyy');
            var weekdateVal = new Date($scope.weeklyStartDate);
            weekdateVal = $filter('date')(weekdateVal, 'dd-MMM-yyyy');
            var checkHrsVal = ($scope.isDailyMode ? timeEntry.hrs : timeEntry.hrs[hrsIndex]);
            hrs = ($scope.isDailyMode ? timeEntry.hrs : timeEntry.hrs[hrsIndex]);
            hrs = parseFloat(hrs);
            var isNumber = !(isNaN(hrs));

            if (isNumber) {
                if (hrs > 200) {
                    isContinue = false;
                }
                else if (hrs < -200) {
                    isContinue = false;
                }
                valAfterRounding = getNearestMultple(hrs, tintVal, $scope.msgList);
                if ($scope.isDailyMode) {
                    weekDay = 0;
                    hrs24Msg = get24HrsMassage(dateStr);
                }
                else {
                    hrs24Msg = get24HrsMassage(weekdateVal);
                }
                sep = $scope.msgList.length >= 1 ? sep : "";
                if (isDayHourSumExceed24Hour(valAfterRounding, hrsIndex)) {
                    isHrsGt24 = true;
                    if ($scope.msgList.indexOf(sep + hrs24Msg) == -1 && $scope.msgList.indexOf(hrs24Msg) == -1)
                        $scope.msgList.push(sep + hrs24Msg);
                }
                if ($scope.msgList.length > 0) {
                    $scope.msgList[0] = $scope.msgList.length > 1 ? ($scope.msgList[0].indexOf("-") != 0 ? sep + $scope.msgList[0] : $scope.msgList[0]) : $scope.msgList[0];
                }
            }
            else {
                if ($scope.isDailyMode)
                    isContinue = false;

                if (checkHrsVal !== "" && checkHrsVal != null && !$scope.isDailyMode)
                    isContinue = false;

                if (!$scope.isDailyMode) {
                    for (var i = 0; i < 7; i++) {
                        if (timeEntry.hrs[i] !== "" && timeEntry.hrs[i] != null) {
                            isContinue = true; break;
                        }
                        else
                            isContinue = false;
                    }
                }

            }
            if (isContinue) {
                if ($scope.isDailyMode)
                    timeEntry.hrs = valAfterRounding;
                else
                    timeEntry.hrs[hrsIndex] = valAfterRounding;
            }
            return isContinue;
        }
        var checkHoursAfterCellEdit = function (timeEntry, hrsIndex) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.checkHoursAfterCellEdit");
            var hrs = 0, valAfterRounding = "";
            var isContinue = true;
            var tintVal = $scope.initialDetail.COMP_REC.TINT;
            var hrs24Msg = "";
            var isRounded = false;
            var msgList = [];
            var isHrsGt24 = false, sep = "-";
            var entryDate = $scope.startDate;
            var dteVal = new Date($scope.currentDate);
            var dateStr = $filter('date')(dteVal, 'dd-MMM-yyyy');
            var checkHrsVal = ($scope.isDailyMode ? timeEntry.hrs : timeEntry.hrs[hrsIndex]);
            hrs = ($scope.isDailyMode ? timeEntry.hrs : timeEntry.hrs[hrsIndex]);
            hrs = parseFloat(hrs);
            var isNumber = !(isNaN(hrs));

            if (isNumber) {
                if (hrs > 200) {
                    isContinue = false;
                }
                else if (hrs < -200) {
                    isContinue = false;
                }
            }
            else {
                if ($scope.isDailyMode)
                    isContinue = false;

                if (checkHrsVal != "" && !$scope.isDailyMode && timeEntry.hrs[hrsIndex] != null)
                    isContinue = false;

            }
            if (isContinue && !$scope.isDailyMode) {
                if (timeEntry.hrs[hrsIndex] === undefined) {
                    isContinue = false;
                    timeEntry.hrs[hrsIndex] = $scope.oldEntry;
                }
                else {
                    var hrsNull = timeEntry.hrs.filter(function (item) {
                        return item == null;
                    });
                    if (hrsNull.length >= 7) {
                        isContinue = false;
                        timeEntry.hrs[hrsIndex] = $scope.oldEntry;
                    }
                }
            }
            return isContinue;
        }

        $scope.finalSave = function (json, deleteEntry) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.finalSave");
            if ($scope.saveFlag) {
                lockGrid();
                var saveTEObj = JSON.parse(json[0]);
                var hrsIndex = saveTEObj.HRSIndex;
                delete saveTEObj.HRSIndex;
                cepService.saveTimeSheet($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify(saveTEObj), constantService.DOMAINURL).then(function (response) {
                    $scope.saveFlag = false;
                    if ($scope.savedInlineRow !== null)
                        $scope.savedInlineRow.teIdDaywise[hrsIndex] = response.SAVTIM_OUT_OBJ.TIMEID;
                    if (parseInt(response.SAVTIM_OUT_OBJ.RETCD) == 0) {
                        $rootScope.countmove = 0;
                        $scope.cepfavourite = false;
                        $rootScope.popupload = false;
                        $rootScope.columnBlank = false;
                        json.splice(0, 1);
                        if (json.length > 0) {
                            $scope.saveFlag = true;
                            $scope.finalSave(json, deleteEntry);
                        }
                        else {
                            if (deleteEntry != null && deleteEntry.trim().length > 0) {
                                if (deleteEntry != null && deleteEntry.trim().length > 0) {
                                    gridDataService.deleteTimeEntries($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, deleteEntry).then(function (response) {
                                        if (parseInt(response.DELTIM_OUT_OBJ.RETCD) == 0) {
                                            $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate), true);
                                        }
                                        else {
                                            unLockGrid();
                                            showValidationMsg([response.DELTIM_OUT_OBJ.ERRMSG], $filter('translate')('lbl_Error'), false);
                                        }
                                    })
                                }
                            }
                            else {
                                $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate), true);
                            }
                        }
                        //broadcastService.notifyRefreshCalendar();

                    }
                    else {
                        $rootScope.rowIndex = angular.copy($scope.lastRowEntry);
                        //To fix : MTD-722
                        if (response.SAVTIM_OUT_OBJ.ERRMSG == $filter('translate')('msg_FutureTimeEntry')) {
                            if (deleteEntry != null && deleteEntry.trim().length > 0) {
                                gridDataService.deleteTimeEntries($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, deleteEntry).then(function (response) {
                                    if (parseInt(response.DELTIM_OUT_OBJ.RETCD) == 0) {
                                        $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate));
                                    }
                                    else {
                                        unLockGrid();
                                        showValidationMsg([response.DELTIM_OUT_OBJ.ERRMSG], $filter('translate')('lbl_Error'), false);
                                    }
                                })
                            }
                        }
                        $scope.cepfavourite = false;
                        if ($scope.previousData != "" && $scope.previousData.CLIENO != undefined) {
                            if ($scope.previousData.CLIENO != undefined ? ($scope.previousData.CLIENO.length != 14) : false)
                                $scope.previousData.CLIENO = $scope.previousData.CLIENO + '-' + ("0" + $scope.previousData.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.previousData.PRJNO).slice(-3).toString();
                            $scope.time_record.cepRec.CLIENO = $scope.previousData.CLIENO; $rootScope.columnBlank = false;

                        }
                        else if ($scope.previousData.cepRec != undefined) {
                            if ($scope.previousData.cepRec.CLIENO.length != 14)
                                $scope.previousData.cepRec.CLIENO = $scope.previousData.cepRec.CLIENO + '-' + ("0" + $scope.previousData.cepRec.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.previousData.cepRec.PRJNO).slice(-3).toString();
                            $scope.time_record.cepRec.CLIENO = $scope.previousData.cepRec.CLIENO;
                            $rootScope.columnBlank = false;
                        }
                        else if ($scope.previousData.CEP_REC != undefined) {
                            if ($scope.previousData.CEP_REC.CLIENO.length != 14)
                                $scope.previousData.CEP_REC.CLIENO = $scope.previousData.CEP_REC.CLIENO + '-' + ("0" + $scope.previousData.CEP_REC.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.previousData.CEP_REC.PRJNO).slice(-3).toString();
                            $scope.time_record.cepRec.CLIENO = $scope.previousData.CEP_REC.CLIENO;
                            $scope.getCurrentFocus();
                            if ($scope.previousData.CEP_REC.CATID > 0)
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity = $scope.previousData.CTSDESC;
                            else
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity = $scope.previousData.ACTI_REC.DES;

                            $rootScope.columnBlank = false;
                        }
                        //$scope.time_record.cepRec.CLIENO = $scope.time_record.cepRec.CLIENO + '-' + ("0" + $scope.time_record.cepRec.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.time_record.cepRec.PRJNO).slice(-3).toString();

                        if (!chekForDBPartitionError(response.SAVTIM_OUT_OBJ.ERRMSG, json, deleteEntry)) {
                            unLockGrid();
                            showValidationMsg([response.SAVTIM_OUT_OBJ.ERRMSG], $filter('translate')('lbl_Error'), false);
                        }
                        if ($scope.isRowEditTemp == true || $scope.isDescriptionPopupLoad)
                            $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate));
                        // else
                        //  $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate: $scope.weeklyStartDate));
                        $scope.isRowEditTemp = false;
                        $scope.previousData = "";
                    }
                    if (!$scope.gridApi.grid.isRowSet) {
                        $scope.oldCepEntry = "";
                        $scope.savedInlineRow = null;
                    }
                    if (json.length == 0) {
                        $scope.previousData = "";
                        $scope.isRowEditTemp = false;
                        resetWindow();
                    }
                    $scope.isDescriptionPopupLoad = false;
                });
            }
            else {
                $scope.isDescriptionPopupLoad = false;
                unLockGrid();
            }
            $scope.oldRowEntry = "";
        }
        var resetWindow = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.resetWindow");
            $scope.cpeListData = [];
            $scope.IsActivity = true;
            $scope.dailyHour = null;
            $scope.weeklyHours = [null, null, null, null, null, null, null];

        }
        $scope.loadDescription = function (entity) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadDescription");
            $scope.saveOnCancelPopUp = $scope.isRowEdit;
            var defaultDesc = entity.DES.trim();
            var sendData = {
                IsActivity: $scope.IsActivity,
                desc: defaultDesc, isBroadcast: true,

            }
            $scope.openModalCtrl = 'DescriptionCtrl';
            $scope.open('Desktop/NewEntry/templates//Description.html', 'DescriptionDesktopCtrl', sendData);
            $scope.isDescriptionPopupLoad = true;
            $scope.saveFlag = false;
            //},600)
        }
        $scope.loadICItems = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadICItems");
            //$timeout(function () {
            var sendData = {
                sessionKey: $scope.loginDetail.SESKEY,
                compId: $scope.initialDetail.COMP_REC.COMPID,
                domainURL: $scope.domainURL,
                selectedICItem: null,
                isBroadcast: true
            }
            $scope.openModalCtrl = 'ICItemCtrl';
            sendData.popUpName = 'ICItemCtrl';
            $scope.open('Desktop/NewEntry/templates/ICItem.html', 'ICItemCtrl', sendData);
            //},600)
        }

        var isInvalidFutureEntry = function (time_Obj) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.isInvalidFutureEntry");
            var isFutureEntry = futureEntryService.futureEntry(time_Obj);
            return isFutureEntry;
        }
        $scope.saveInlineEntry = function (timeEntryGrid, gridApi, hrsIndex, refreshGrid) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.saveInlineEntry");
            var timeEntry = angular.copy(timeEntryGrid);
            $scope.isContinue = true;
            var isActivity = true, deleteEntry = '', json = [];
            $scope.msgList = [];
            try {
                if (hrsIndex.length > 0) {
                    for (var i = 0; i < hrsIndex.length; i++) {
                        isContinue = checkHours(timeEntry, hrsIndex[i]);
                        if (!isContinue)
                            break;
                    }
                    if ($scope.msgList.length > 0) {
                        showValidationMsg($scope.msgList);
                        $scope.msgList = [];
                    }
                    $scope.isContinue = isContinue;
                }
                updateHrsField(timeEntry, $scope.isDailyMode);
                if ($scope.isContinue) {
                    if ($scope.cepfavourite) {
                        delete $scope.cepObj.selected.CEPCODE;
                        delete $scope.cepObj.selected.CEPFAV;
                        delete $scope.cepObj.selected.RMGR;
                        delete $scope.cepObj.selected.cepCodeWithMask;
                        delete $scope.cepObj.selected.cepCodeWithOutMask;
                        delete $scope.cepObj.selected.PRJO;
                        delete $scope.cepObj.selected.ENGCON;
                        delete $scope.cepObj.selected.ENGO;
                        delete $scope.cepObj.selected.PRJM;
                        $scope.cepObj.selected.ENGNO = ("00" + $scope.cepObj.selected.ENGNO).slice(-3).toString();
                        $scope.cepObj.selected.PRJNO = ("00" + $scope.cepObj.selected.PRJNO).slice(-3).toString();
                        $scope.cepObj.selected = {
                            CLIEID: $scope.cepObj.selected.CLIEID,
                            CLIENO: $scope.cepObj.selected.CLIENO, CLIENAME: $scope.cepObj.selected.CLIENAME, CLIEACTIVE: $scope.cepObj.selected.CLIEACTIVE, ENGID: $scope.cepObj.selected.ENGID, ENGNO: $scope.cepObj.selected.ENGNO, ENGNAME: $scope.cepObj.selected.ENGNAME, ENGACTIVE: $scope.cepObj.selected.ENGACTIVE, ENGTIMFLAG: $scope.cepObj.selected.ENGTIMFLAG, PRJID: $scope.cepObj.selected.PRJID, PRJNO: $scope.cepObj.selected.PRJNO, PRJNAME: $scope.cepObj.selected.PRJNAME, PRJACTIVE: $scope.cepObj.selected.PRJACTIVE, PRJTIMFLAG: $scope.cepObj.selected.PRJTIMFLAG, PROG: $scope.cepObj.selected.PROG, GLOBBUSI: $scope.cepObj.selected.GLOBBUSI, OCOMP: $scope.cepObj.selected.OCOMP, CHARBASIS: $scope.cepObj.selected.CHARBASIS, COMPID: $scope.cepObj.selected.COMPID, RENPRJNO: $scope.cepObj.selected.RENPRJNO, CRSBRD: $scope.cepObj.selected.CRSBRD, RECTIM: $scope.cepObj.selected.RECTIM, CATID: $scope.cepObj.selected.CATID
                        }
                    }
                    timeEntry.cepRec.PROG = "";
                    timeEntry.cepRec.GLOBBUSI = "";
                    var ceid = timeEntry.cepRec.CLIEID; enteries = $scope.isDailyMode ? 1 : 7;
                    var activity = {
                    };
                    if ($scope.isProjectTask) {
                        isActivity = false;
                        activity = {
                            ACTICD: timeEntry.actRec.ACTICD,
                            DES: '',
                            STAT: 'Y',
                            COMPID: 0
                        }
                    }
                    else {
                        activity = (timeEntry.actRec);
                    }
                    var timeEntryClientNo = timeEntry.cepRec.CLIENO;
                    if (timeEntryClientNo.length > 6) {
                        timeEntry.cepRec.CLIENO = timeEntryClientNo.substring(0, 6);
                        timeEntry.cepRec.ENGNO = timeEntryClientNo.substring(7, 10);
                        timeEntry.cepRec.PRJNO = timeEntryClientNo.substring(11, 14);
                    }
                    var teidArrayPassToAPi = [0, 0, 0, 0, 0, 0, 0];
                    var newTeidIndex = [];
                    $rootScope.rowIndex.CEP_REC = ($scope.cepObj.selected != null && $scope.isGridFocus == true ? $scope.cepObj.selected : timeEntry.cepRec);
                    $rootScope.rowIndex.ACTI_REC = activity;
                    $rootScope.rowIndex.DES = timeEntry.description;
                    $rootScope.rowIndex.CEP_REC = JSON.parse(JSON.stringify($rootScope.rowIndex.CEP_REC));
                    var cep_rec = $rootScope.rowIndex.CEP_REC;
                    $rootScope.rowIndex.CEP_REC.CLIENO = cep_rec.CLIENO + '-' + ("0" + cep_rec.ENGNO).slice(-3).toString() + '-' + ("0" + cep_rec.PRJNO).slice(-3).toString();

                    for (var i = 0; i < enteries; i++) {
                        var time;
                        var teid = timeEntry.teId;
                        if ($scope.isDailyMode) {
                            time = timeEntry.hrs; var currentDate = new Date($scope.currentDate.valueOf());
                            date = $filter('date')(currentDate, 'yyyy-MM-dd');
                        }
                        else {
                            var currentDate = new Date($scope.weeklyStartDate.valueOf());
                            var date = currentDate.setDate(currentDate.getDate() + i);
                            date = $filter('date')(date, 'yyyy-MM-dd');
                            if ($scope.weeklyHours[i] === "" && $scope.weeklyHours[i] !== 0)
                                $scope.weeklyHours[i] = null;
                            var dataAr = updateTEIdToDelete(timeEntry.teId[i], ($scope.weeklyHours[i] == null));
                            teid = dataAr[0];
                            if (dataAr[1] != "")
                                deleteEntry = ((deleteEntry == '') ? dataAr[1] : deleteEntry + ',' + dataAr[1]);


                            if ($scope.weeklyHours[i] == null)
                                continue;
                            else {
                                time = parseFloat($scope.weeklyHours[i]);
                                teidArrayPassToAPi[i] = teid;
                            }
                        }


                        var time_obj = {
                            HRSIndex: i,
                            TEID: teid,
                            DTE: date,
                            CEP_REC: $scope.cepObj.selected != null && $scope.isGridFocus == true ? $scope.cepObj.selected : timeEntry.cepRec,
                            ACTI_REC: activity,
                            ICRTCD: timeEntry.icrtcd,
                            ICDESC: timeEntry.icdesc,
                            ICCHRGE: timeEntry.icchrge,
                            HRS: time,
                            DES: timeEntry.description, //$scope.IsActivity ? activityData.DES + ':' + $scope.description : componentSelected.DES + '/ ' + taskSelected.DES + ': ' + $scope.description,
                            CTDESC: timeEntry.CTDESC,// $scope.IsActivity ? activityData.DES + ':' + $scope.description : componentSelected.DES + '/ ' + taskSelected.DES + ': ' + $scope.description,
                            CMPTID: isActivity ? 0 : timeEntry.cmptId,
                            CATID: isActivity ? 0 : $scope.cepObj.selected != null && $scope.isGridFocus == true ? $scope.cepObj.selected.CATID : timeEntry.cepRec.CATID,
                            TSKID: isActivity ? 0 : timeEntry.tskId,
                            SCOID: timeEntry.scopId,
                            REGFLAG: timeEntry.regFlag,
                            PRSTCD: timeEntry.stateCode//($scope.state.selected == null) || ($scope.state.selected == '') ? '' : (JSON.parse($scope.state.selected)).PTXCODE

                        }
                        var j = JSON.stringify(time_obj, function (key, value) {
                            if (key === "$$hashKey") {
                                return undefined;
                            }

                            return value;
                        });
                        json.push(j);
                    }
                    var isContinue = true;
                    $scope.saveInlineEntryFlag = true;
                    for (var i = 0; i < json.length; i++) {
                        var entries = [];
                        entries = [json[i]];
                        isContinue = $scope.validateEntries($scope.isDailyMode, JSON.parse(json[i]), entries, date, false, true);
                        if (!isContinue)
                            break;
                    }
                    $scope.saveInlineEntryFlag = false;
                    if (isContinue) {
                        $scope.savedInlineRow = null;
                        if (!refreshGrid)
                            $scope.savedInlineRow = {
                                rowId: timeEntryGrid.rowId, teIdDaywise: teidArrayPassToAPi
                            };
                        $scope.finalSave(json, deleteEntry);
                    }
                    else {
                        $rootScope.rowIndex = angular.copy($scope.lastRowEntry);
                        $scope.cnt = 1;
                        if ($scope.previousData != "" && $scope.previousData["CEP_REC"] != undefined) {
                            $scope.time_record.cepRec.CLIENO = $scope.previousData["CEP_REC"].CLIENO;
                            $scope.getCurrentFocus();
                            if ($scope.previousData["CEP_REC"].CATID > 0)
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity = $scope.previousData.CTSDESC;
                            else
                                $scope.gridOptions.data[$scope.currentFocused.rowIndex].ProjectActivity = $scope.previousData.ACTI_REC.DES;
                            $rootScope.columnBlank = false;
                        }
                        if ($scope.isRowEditTemp == true || $scope.isDescriptionPopupLoad) {
                            $scope.GetData($scope.isDailyMode, ($scope.isDailyMode ? $scope.currentDate : $scope.weeklyStartDate));
                            $scope.isRowEditTemp = false;
                        }
                        $scope.isDescriptionPopupLoad = false;
                        unLockGrid();
                    }
                    $scope.details = [];
                    //}
                }
                else {
                    unLockGrid();
                }
            }
            catch (ex) {
                unLockGrid();
                console.log('error in $scope.saveInlineEntry==' + ex.message);
            }
        }


        $scope.isCalDrop = false;
        $scope.isDrop = true;
        $scope.setDropable = function () {
            // $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.setDropable");
            $('.tab1').droppable(
                {
                    accept: '.ui-grid-row',
                    tolerance: 'pointer',
                    over: function (event, ui) {
                        var html = noDrophtml;
                        if ($scope.checkRevMonthFlag && currentDragTimeEntry.isDroppable) {
                            $scope.isDraggingFlag = true;
                            html = drophtml;
                        }
                        $timeout(function () {
                            ui.helper.html(html);
                        });
                    },
                    out: function (event, ui) {
                        ui.helper.html(noDrophtml);
                    },
                    drop: function (event, ui) {
                        try {
                            $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
                            if ($scope.currentDate == undefined) {
                                alert(undefined);
                                alert($rootScope.$stateParams.currentDate);
                            }
                            var selectedEntries = [];
                            if ($scope.selectedRows != null) {
                                for (var i = 0; i < $scope.selectedRows.length; i++) {
                                    var draggedTimeEntry = null;
                                    if ($scope.isFromGrid) {
                                        draggedTimeEntry = JSON.parse($scope.selectedRows[i]);
                                    }
                                    else {
                                        draggedTimeEntry = JSON.parse($scope.selectedRows[i].childNodes[0].childNodes[1].childNodes[1].attributes['value'].nodeValue);
                                    }
                                    selectedEntries.push(angular.copy(draggedTimeEntry));
                                }
                                $scope.pasteByDrag(selectedEntries);
                            }
                        } catch (err) {
                            console.log('error on drop to tab1==' + err.message);
                        }

                    }

                }
                );
            $('#dvdatepicker').droppable(
                                    {
                                        accept: '.ui-grid-row',
                                        tolerance: 'pointer',
                                        out: function (event, ui) {
                                            ui.helper.html(noDrophtml);
                                        }
                                    });
            $('#dpmytime td button').droppable(
                                    {
                                        accept: '.ui-grid-row',
                                        tolerance: 'pointer',
                                        over: function (event, ui) {
                                            $scope.isDrop = ($(event.target).hasClass('dt-available'));
                                            if (currentDragTimeEntry.isDroppable && $scope.isDrop) {
                                                ui.helper.html(drophtml);
                                            }
                                            else {
                                                ui.helper.html(noDrophtml);
                                            }
                                        },
                                        out: function (event, ui) {
                                            ui.helper.html(noDrophtml);

                                        },
                                        drop: function (event, ui) {
                                            try {
                                                if ($scope.isDrop) {
                                                    var obj = $(this);
                                                    var calDateObject = localStorage.getItem('dragableCalDate');
                                                    if (calDateObject != null) {
                                                        calDateObject = JSON.parse(calDateObject);
                                                        $scope.isCalDrop = true;
                                                        $scope.calDropDate = new Date(calDateObject.date);
                                                        $scope.loginDetail = $rootScope.GetLoginDetail(false, true);
                                                        var selectedEntries = [];
                                                        if ($scope.selectedRows != null && $scope.selectedRows.length > 0) {
                                                            for (var i = 0; i < $scope.selectedRows.length; i++) {
                                                                var draggedTimeEntry = null;
                                                                if ($scope.isFromGrid) {
                                                                    draggedTimeEntry = JSON.parse($scope.selectedRows[i]);
                                                                }
                                                                else {
                                                                    draggedTimeEntry = JSON.parse($scope.selectedRows[i].childNodes[0].childNodes[1].childNodes[1].attributes['value'].nodeValue);
                                                                }
                                                                selectedEntries.push(angular.copy(draggedTimeEntry));
                                                            }
                                                            $scope.pasteByDrag(selectedEntries);
                                                        }

                                                    }
                                                }
                                            }
                                            catch (err) {
                                                console.log('error on drop to calandar==' + err.message);
                                            }

                                        }

                                    }
                               );
        }
        $scope.pasteByDrag = function (selectedEntries) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteByDrag");
            var isNegativeEntryAllowed = true;
            for (var i = 0; i < selectedEntries.length; i++) {

                var tempSelected = selectedEntries[i];
                var tempEntry = JSON.parse(JSON.stringify(tempSelected));
                var weekEntryHours = JSON.parse(JSON.stringify(tempEntry));
                if (!$scope.isDailyMode)
                    tempEntry = tempEntry.data;
                if (tempEntry.CEP_REC.CHARBASIS == 'T' || tempEntry.CEP_REC.CHARBASIS == 'S' || tempEntry.CEP_REC.CHARBASIS == 'C') {
                    if ($scope.isDailyMode && parseFloat(tempEntry.HRS) < 0) {
                        isNegativeEntryAllowed = false;
                        break;
                    }
                    else if (!$scope.isDailyMode && (parseFloat(weekEntryHours.Hrs1) < 0 || parseFloat(weekEntryHours.Hrs2) < 0 || parseFloat(weekEntryHours.Hrs3) < 0 || parseFloat(weekEntryHours.Hrs4) < 0 || parseFloat(weekEntryHours.Hrs5) < 0 || parseFloat(weekEntryHours.Hrs6) < 0 || parseFloat(weekEntryHours.Hrs7) < 0)) {
                        isNegativeEntryAllowed = false;
                        break;
                    }
                }
            }
            //termination date validation   
            if ($scope.initialDetail.EMPL_REC.TERMDTE !== undefined && $scope.initialDetail.EMPL_REC.TERMDTE !== null && $scope.initialDetail.EMPL_REC.TERMDTE.trim() !== "") {
                var calDate = null;
                if ($scope.isCalDrop) {
                    calDate = $scope.calDropDate;
                }
                else {
                    calDate = $scope.currentDate;
                }
                if (!validateTerminationDate($scope.initialDetail.EMPL_REC.TERMDTE, calDate))
                    return false;
            }
            if (isNegativeEntryAllowed) {
                $scope.isPastebyDrag = true;
                $scope.moveEntryToClipBoard($scope.isDailyMode, selectedEntries);
                $scope.pasteRecords($scope.isDailyMode, 1, true);
                $scope.isPastebyDrag = false;
            }
            else {
                showMessagePopUp([$filter('translate')('msg_cpyNgtv')], $filter('translate')('lbl_Error'), false);
            }

        }
        var validateTerminationDate = function (termDate, selectedDate) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.validateTerminationDate");
            if (!empSharedService.checkTerminationDate(termDate, selectedDate)) {
                var msg = $filter('translate')('msg_InActiveDesignateSelected', {
                    DOT: $scope.initialDetail.EMPL_REC.TERMDTE
                });
                showMessagePopUp([msg], "", false);
                return false;
            }
            else return true;
        }
        $scope.weekHrsTotal = function (row) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.weekHrsTotal");
            var total = 0;
            for (i = 1; i <= 7; i++) {
                if (row["Hrs" + i] != null)
                    total += row["Hrs" + i]
            }
            row.HrsTotal = total.toFixed(2);
            return row.HrsTotal;
        }
        $scope.deleteEntry = function (entry) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.deleteEntry");
            if ($scope.isDailyMode) {
                var timeentry = [];
                timeentry[0] = entry.TEID;
                if (entry.TIMSUB == "Y") {
                    $scope.editTimeEntry(entry);
                }
                else {
                    $scope.deleteTimeEntries(true, timeentry, 0, 1);
                }
            } else {
                var tEIdsStr = "";
                if (entry.data.TIMSUB.toUpperCase() != "Y") {
                    var invalidCount = 0, count = 0;
                    var selRec = entry;
                    var weekSdate = new Date($scope.weeklyStartDate.valueOf());
                    weekSdate.setHours(0, 0, 0, 0);
                    var weekDayOnOffStatus = commonUtilityService.getWkDayOnOpenCloseRevStatus(weekSdate, selRec);
                    var obj = commonUtilityService.getDeleteTeIdObj(selRec, weekDayOnOffStatus);
                    var isTEInOpenREVWeekExist = obj.isTEInOpenREVWeekExist;
                    tEIdsStr = obj.tEIdsStr;
                    invalidCount = obj.invalidCount;
                    count = commonUtilityService.countNoOfTimeEntry(selRec);
                    $scope.deleteTimeEntries(false, tEIdsStr.split(","), invalidCount, count, isTEInOpenREVWeekExist);

                }
                else
                    $scope.editTimeEntry(entry);

            }
        }
        $scope.getDeleteImageUrl = function (grid, myRow) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.getDeleteImageUrl");
            var deleteImage = '';
            if (myRow.entity.TIMSUB === "Y")
                deleteImage += $scope.lockImgurl;
            else
                deleteImage += $scope.deleteImgurl;

            deleteImage += '';

            return deleteImage;
        }
        function convertWeekNumberToName(weekNo) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.convertWeekNumberToName");
            var weekday = {
                0: $filter('translate')('lbl_FulWkDy1'), 1: $filter('translate')('lbl_FulWkDy2'), 2: $filter('translate')('lbl_FulWkDy3'), 3: $filter('translate')('lbl_FulWkDy4'), 4: $filter('translate')('lbl_FulWkDy5'), 5: $filter('translate')('lbl_FulWkDy6'), 6: $filter('translate')('lbl_FulWkDy7')
            };
            return weekday[weekNo];
        }

        function convertMonthNumberToName(monthNo) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.convertMonthNumberToName");
            var weekMonth = {
                0: $filter('translate')('lbl_Mnth1'), 1: $filter('translate')('lbl_Mnth2'), 2: $filter('translate')('lbl_Mnth3'),
                3: $filter('translate')('lbl_Mnth4'), 4: $filter('translate')('lbl_Mnth5'), 5: $filter('translate')('lbl_Mnth6'),
                6: $filter('translate')('lbl_Mnth7'),
                7: $filter('translate')('lbl_Mnth8'), 8: $filter('translate')('lbl_Mnth9'), 9: $filter('translate')('lbl_Mnth10'),
                10: $filter('translate')('lbl_Mnth11'), 11: $filter('translate')('lbl_Mnth12')
            };
            return weekMonth[monthNo];
        }
        function rowSelectionAfterGrouping() {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.rowSelectionAfterGrouping");
            if (($scope.gridApi.grid.treeBase.tree instanceof Array) && ($scope.gridApi.grid.treeBase.tree[0].aggregations.length > 0)) {
                $scope.gridApi.selection.selectRowByVisibleIndex(1);
                var rows = $scope.gridApi.core.getVisibleRows();
                if (rows.length > 1 && rows[1].groupHeader != true) {
                    $timeout(function () { $scope.gridApi.selection.selectRowByVisibleIndex(1); });
                }
                else {
                    $timeout(function () { rowSelectionAfterGrouping(); }, 500);
                }
            }
        }

        $scope.GetData = function (isDailyMode, dateVal, isAfterInlineSave) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.GetData");
            if (!isAfterInlineSave) {
                $scope.savedInlineRow = null;
            }
            else {
                lockGrid();
            }
            if (isPageInit) {
                translateScopeVariables();
                isPageInit = false;
            }
            if ($scope.gridApi !== undefined) {
                $scope.gridApi.grid.options.prevEiditedRow = -1;
            }

            var weekName = convertWeekNumberToName(new Date($scope.currentDate).getDay());
            var monthName = convertMonthNumberToName(new Date($scope.currentDate).getMonth());
            $scope.calDate = weekName.substring(0, 3) + ', ' + monthName.substring(0, 3) + ' ' + $filter('date')(new Date($scope.currentDate), 'dd, yyyy');


            $scope.blankfiltermessage = "";
            //alert('date--'+$filter('date')(dateVal, 'yyyy-MM-dd'));
            if ($rootScope.expandedEntries == undefined)
                $rootScope.expandedEntries = [];
            if ($rootScope.collapsedEntries == undefined)
                $rootScope.collapsedEntries = [];

            if (($rootScope.weekStateCurrentDate != $filter('date')($scope.currentDate, 'yyyy-MM-dd')) || isDailyMode) {
                if ($rootScope.isPasteClicked == true)
                    $rootScope.isPasteClicked = false;
                if ($rootScope.weeklyMaxTEID.length > 0)
                    $rootScope.weeklyMaxTEID = [];
            }
            if ($rootScope.lastCurrentDate != undefined && $rootScope.lastCurrentDate != $filter('date')($scope.currentDate, 'yyyy-MM-dd')) {
                $rootScope.expandedEntries = [];
                $rootScope.collapsedEntries = [];
                $rootScope.cntrExpandCollapse = 0;
            }
            try {
                enableDisableSubmitBtn();
            }
            catch (err) {
            }
            $scope.closedmonth = '';
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

            var startDate = $filter('date')(new Date(dateVal.valueOf()), 'yyyy-MM-dd HH:mm:ss');
            var endDate = new Date(dateVal.valueOf());
            if (isDailyMode) {
                endDate = endDate.setDate(endDate.getDate());
                $scope.blankfiltermessage = $filter('translate')('lbl_NoTEntryForDay');
            }
            else {
                endDate.setDate(endDate.getDate() + 7);
                for (var i = 0; i < 7; i++) {
                    if (endDate.getDay() == 6)
                        break;
                    endDate.setDate(endDate.getDate() - 1);
                }
                $scope.blankfiltermessage = $filter('translate')('lbl_NoTEntryForWeek');
            }

            $scope.checkRevMonthTime($scope.currentDate);
            $scope.copytoTodayCuttOff = false;
            $scope.afterTecuttOff = false;
            checkAfterCuttOff();
            endDate = $filter('date')(endDate, 'yyyy-MM-dd HH:mm:ss');
            var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
            // Call Service to get time data
            var itemsDataFinal = [];
            var itemsDataFinal1 = [];
            var itemsDataTotal = [];
            $scope.itemsDataFinal1 = "";
            $scope.itemsDataTotal = "";
             if (jsonSFromloginDetail)
                gridDataService.getData(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, startDate, endDate, $filter('date')($scope.currentDate, 'yyyy-MM-dd HH:mm:ss')).then(function (data) {                   
                        if (isAfterInlineSave)
                        lockGrid();
                    else if (!$scope.savedInlineRow)
                        broadcastService.notifyDateTimeSlider($scope.currentDate);
                    $rootScope.number = 0;
                    if ($scope.gridOptions.dicardTabNavigation == true)
                        $timeout(function () {
                            $scope.gridOptions.dicardTabNavigation = false;
                        }, 200);
                    if ($scope.refreshGridMain) {
                        if ($scope.isDailyMode) {
                            localStorage.gridViewportHeight = ($(window).height() - (localStorage.FilterFlag == "1" ? heightOffsetDailyFilter : heightOffsetDaily));
                        }
                        else {
                            localStorage.gridViewportHeight = ($(window).height() - (localStorage.FilterFlag == "1" ? heightOffsetWeeklyFilter : heightOffsetWeekly));
                        }
                        $scope.refreshGridMain = false;
                    }
                    $scope.multiSelectFlag = false;
                    if (data.RETTIM_OUT_OBJ.RETCD == 0 && (data.RETTIM_OUT_OBJ.TIME_ARR == null || data.RETTIM_OUT_OBJ.TIME_ARR.length == 0)) {
                        $scope.summaryGridData = data.RETTIM_OUT_OBJ.TIME_SUMM;
                        $rootScope.summaryGridValue[0] = data.RETTIM_OUT_OBJ.TIME_SUMM.MBITMAP;
                        $rootScope.summaryGridValue[1] = $filter('date')($scope.currentDate, 'yyyy-MM-dd'); // done for calendar performance issue
                        $rootScope.summaryGridValue[2] = data.RETTIM_OUT_OBJ.TIME_SUMM.ICMBITMAP;
                        $scope.gridData = JSON.parse('[]');
                        $scope.gridOptions.data = JSON.parse('[]');
                        if (isDailyMode)
                            $scope.gridOptions.showColumnFooter = false;
                        else
                            $scope.gridOptions.showColumnFooter = true;
                        $scope.gridNoEntryMessage = 1;
                        $scope.ttlHrs = 0.00;
                        $scope.ttlHrs = $scope.ttlHrs.toFixed(2);
                        $scope.weeklyTtlHours = 0.00;
                        $scope.weeklyTtlHours = $scope.weeklyTtlHours.toFixed(2);
                        $scope.monthlyTtlHrs = parseFloat(data.RETTIM_OUT_OBJ.TIME_SUMM.MTOTTIME);
                        $scope.monthlyTtlHrs = $scope.monthlyTtlHrs.toFixed(2);
                        $scope.nonSubmittedICEntries = data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTEDIC;
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
                            ERRMSG: $filter('translate')('msg_invalidSession')
                        }
                        $rootScope.sessionInvalid(data);
                    }
                    else {
                        $scope.summaryGridData = data.RETTIM_OUT_OBJ.TIME_SUMM;
                        $rootScope.summaryGridValue[0] = data.RETTIM_OUT_OBJ.TIME_SUMM.MBITMAP;
                        $rootScope.summaryGridValue[1] = $filter('date')($scope.currentDate, 'yyyy-MM-dd'); // done for calendar performance issue
                        $rootScope.summaryGridValue[2] = data.RETTIM_OUT_OBJ.TIME_SUMM.ICMBITMAP;
                        $scope.monthlyTtlHrs = parseFloat(data.RETTIM_OUT_OBJ.TIME_SUMM.MTOTTIME);
                        $scope.monthlyTtlHrs = $scope.monthlyTtlHrs.toFixed(2);
                        $scope.nonSubmittedICEntries = data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTEDIC;
                        $scope.nonSubmittedEntries = data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTED;
                        data.RETTIM_OUT_OBJ.TIME_ARR.sort(function (a, b) {
                            var nameA = parseFloat(a.TEID), nameB = parseFloat(b.TEID)
                            if (nameA > nameB)
                                return 1
                            if (nameA < nameB)
                                return -1
                            return 0
                        });
                        if (!isDailyMode) {
                            $scope.weeklyMaxTEIDCommon = data.RETTIM_OUT_OBJ.TIME_ARR[data.RETTIM_OUT_OBJ.TIME_ARR.length - 1].TEID;

                            if ($rootScope.isPasteClicked) {
                                $rootScope.weeklyMaxTEID[$rootScope.weeklyMaxTEID.length] = $scope.weeklyMaxTEIDCommon;
                            }
                            else {
                                $rootScope.weeklyMaxTEID = [];
                                $rootScope.weeklyMaxTEID[0] = $scope.weeklyMaxTEIDCommon;
                            }
                        }

                        if (isDailyMode) {
                            //localStorage.setItem('getDataForUndoDaily', JSON.stringify(data.RETTIM_OUT_OBJ.TIME_ARR[data.RETTIM_OUT_OBJ.TIME_ARR.length -1]));
                            itemsDataFinal1 = [];
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
                            if (!$scope.savedInlineRow)
                                $scope.gridOptions.data = $scope.gridData;
                            if ($scope.clearGrouping) {
                                $scope.gridApi.grouping.clearGrouping();
                                $scope.clearGrouping = false;
                            }
                            $scope.gridOptions.showColumnFooter = false;
                            $scope.isAutoGroup = false;
                            var typeOfEntry = {
                                isTime: false, isIc: false
                            }
                            for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                                $scope.gridOptions.data[i].rowId = i;
                                if ($scope.gridOptions.data[i].ICRTCD == null || (typeof $scope.gridOptions.data[i].ICRTCD == 'undefined') || ($scope.gridOptions.data[i].ICRTCD == " ")) {
                                    $scope.gridOptions.data[i].TYPE = $filter('translate')('lbl_Time');
                                    $scope.gridOptions.data[i].ICCHRGE = "";
                                    typeOfEntry.isTime = true;
                                }
                                else {
                                    typeOfEntry.isIc = true;
                                    localStorage.GroupingCalled = "1";
                                    $scope.gridOptions.data[i].TYPE = $filter('translate')('lbl_IC');
                                    $scope.gridOptions.data[i].ICCHRGE = Number(parseFloat($scope.gridOptions.data[i].ICCHRGE).toFixed(2));
                                }
                                $scope.gridOptions.data[i].HRS = Number(parseFloat($scope.gridOptions.data[i].HRS).toFixed(2));
                            }
                            if ((typeOfEntry.isTime && typeOfEntry.isIc) || (typeOfEntry.isIc)) {
                                $scope.isAutoGroup = true;
                            }

                            $timeout(function () {
                                $scope.bindGridEvents();
                            }, 2000)
                            if ($rootScope.pastedRecords) {
                                var getdata = $scope.gridData;
                                var teid = 0; var k = 0;
                                for (var i = 0; i < getdata.length; i++) {

                                    if (teid < getdata[i].TEID) {
                                        teid = getdata[i].TEID;
                                        k = i;
                                    }
                                }
                                $rootScope.rowIndexNew = k;
                                $interval(function () {
                                    try {
                                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[$rootScope.rowIndexNew]);
                                    } catch (ex) {
                                    }
                                }, 0, 1);
                                //$rootScope.pastedRecords = false;
                            }
                            else if (!$scope.savedInlineRow && $rootScope.rowIndex != undefined && !$rootScope.shiftFlag)
                                $interval(function () {
                                    try {
                                        var dataDaily = $scope.gridOptions.data;
                                        var indexDaily;
                                        for (var i = 0; i < dataDaily.length; i++) {

                                            if ($rootScope.rowIndex.TEID == dataDaily[i].TEID) {
                                                indexDaily = i;
                                                break;
                                            }
                                        }
                                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[indexDaily]);
                                    } catch (ex) {
                                    }
                                }, 0, 1);
                            else if (!$scope.savedInlineRow)
                                $interval(function () {
                                    try {
                                        if (($scope.gridApi.grid.treeBase.tree instanceof Array) && ($scope.gridApi.grid.treeBase.tree[0].aggregations.length > 0)) {
                                            rowSelectionAfterGrouping();
                                        }
                                        else
                                            $scope.gridApi.selection.selectRowByVisibleIndex(0);
                                    } catch (ex) {
                                    }
                                }, 500, 1);

                            //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);

                            //$rootScope.rowIndex = undefined;
                        }
                        else {
                            $scope.gridData = [];
                            var itemsData = data.RETTIM_OUT_OBJ.TIME_ARR;
                            if (itemsData != undefined) {
                                $scope.icChrge = 0.00;
                                $.each(itemsData, function (index, value) {
                                    $scope.icChrge += parseFloat(itemsData[index].ICCHRGE, 10);
                                });
                            }
                            //$scope.icChrge = $scope.icChrge.toFixed(2);
                            $scope.chartDataNew = JSON.parse(JSON.stringify(data.RETTIM_OUT_OBJ.TIME_ARR));
                            var maxIdRevisedArray = [];
                            for (var i = 0; i < itemsData.length; i++) {
                                if (itemsData[i].ICRTCD != null && itemsData[i].ICRTCD.trim() != "") {
                                    itemsData.splice(i, 1);
                                    i = i - 1;
                                    if (i > itemsData.length - 1)
                                        break;
                                }
                            }

                            for (var i = 0; i < itemsData.length; i++) {
                                var ttlHrsWeek = 0;
                                var d = new Date(itemsData[i].DTE.substring(0, itemsData[i].DTE.indexOf(' ')));
                                d = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));
                                var day = d.getDay() + 1;

                                var TEIDArray = [];
                                var cepDescrption;
                                if (itemsData[i].CATID == 0 || itemsData[i].CATID == undefined)
                                    cepDescrption = itemsData[i].ACTI_REC.DES;
                                else
                                    cepDescrption = itemsData[i].CTSDESC;
                                var computeIndex = itemsDataFinal.indexOf(itemsData[i].CEP_REC.CLIENO + "|"
                                + itemsData[i].CEP_REC.ENGNO + "|" + itemsData[i].CEP_REC.PRJNO + "|"
                                + cepDescrption + "|" + itemsData[i].DES + "|" + itemsData[i].TIMSUB + "|" + itemsData[i].REGFLAG + "|" + itemsData[i].PRSTCD + "|" + "0");
                                if (computeIndex == -1 && parseFloat(itemsData[i].TEID) <= parseFloat($rootScope.weeklyMaxTEID[0])) {
                                    ttlHrsWeek += parseFloat(itemsData[i].HRS, 10);
                                    itemsDataFinal.push(itemsData[i].CEP_REC.CLIENO + "|"
                                + itemsData[i].CEP_REC.ENGNO + "|" + itemsData[i].CEP_REC.PRJNO + "|"
                                    + cepDescrption + "|" + itemsData[i].DES + "|" + itemsData[i].TIMSUB + "|" + itemsData[i].REGFLAG + "|" + itemsData[i].PRSTCD + "|" + "0");

                                    itemsDataFinal1.push({
                                        rowId: itemsDataFinal1.length, CLIENO: itemsData[i].CEP_REC.CLIENO, ENGNO: itemsData[i].CEP_REC.ENGNO, PRJNO: itemsData[i].CEP_REC.PRJNO, CTDESC: itemsData[i].CTDESC, DES: itemsData[i].DES, Hrs1: null, Hrs2: null, Hrs3: null, Hrs4: null, Hrs5: null, Hrs6: null, Hrs7: null, HrsTotal: ttlHrsWeek
                                        , TEID_data: itemsData[i].TEID, data: itemsData[i], TIMSUB: itemsData[i].TIMSUB
                                    });

                                    itemsDataFinal1[itemsDataFinal1.length - 1]["Hrs" + day] = parseFloat(itemsData[i].HRS, 10);
                                    itemsDataFinal1[itemsDataFinal1.length - 1]["TEID" + day] = itemsData[i].TEID;
                                }
                                else if (parseFloat(itemsData[i].TEID) > parseFloat($rootScope.weeklyMaxTEID[0]) && $rootScope.isPasteClicked && $rootScope.weeklyMaxTEID.length > 1) {
                                    var maxTEID = $rootScope.weeklyMaxTEID[$rootScope.weeklyMaxTEID.length - 2] + "--" + $rootScope.weeklyMaxTEID[$rootScope.weeklyMaxTEID.length - 1];
                                    for (var z = 0; z < ($rootScope.weeklyMaxTEID.length - 1) ; z++) {
                                        if (parseFloat(itemsData[i].TEID) > parseFloat($rootScope.weeklyMaxTEID[z]) && parseFloat(itemsData[i].TEID) <= parseFloat($rootScope.weeklyMaxTEID[z + 1])) {
                                            maxTEID = $rootScope.weeklyMaxTEID[z] + "--" + $rootScope.weeklyMaxTEID[z + 1];
                                            break;
                                        }
                                    }
                                    var isFoundInMultiCopy = false;
                                    for (var q = maxIdRevisedArray.length - 1; q > -1; q--) {
                                        computeIndex = itemsDataFinal.indexOf(itemsData[i].CEP_REC.CLIENO + "|"
                                                                        + itemsData[i].CEP_REC.ENGNO + "|" + itemsData[i].CEP_REC.PRJNO + "|"
                                                                            + cepDescrption + "|" + itemsData[i].DES + "|" + itemsData[i].TIMSUB + "|" + itemsData[i].REGFLAG + "|" + itemsData[i].PRSTCD + "|" + maxIdRevisedArray[q]);
                                        if (computeIndex > -1) {
                                            isFoundInMultiCopy = true;
                                            break;
                                        }
                                    }
                                    if (!isFoundInMultiCopy)
                                        computeIndex = itemsDataFinal.indexOf(itemsData[i].CEP_REC.CLIENO + "|"
                                                                    + itemsData[i].CEP_REC.ENGNO + "|" + itemsData[i].CEP_REC.PRJNO + "|"
                                                                    + cepDescrption + "|" + itemsData[i].DES + "|" + itemsData[i].TIMSUB + "|" + itemsData[i].REGFLAG + "|" + itemsData[i].PRSTCD + "|" + maxTEID);
                                    if (computeIndex == -1) {
                                        ttlHrsWeek += parseFloat(itemsData[i].HRS, 10);
                                        itemsDataFinal.push(itemsData[i].CEP_REC.CLIENO + "|"
                                    + itemsData[i].CEP_REC.ENGNO + "|" + itemsData[i].CEP_REC.PRJNO + "|"
                                        + cepDescrption + "|" + itemsData[i].DES + "|" + itemsData[i].TIMSUB + "|" + itemsData[i].REGFLAG + "|" + itemsData[i].PRSTCD + "|" + maxTEID);

                                        itemsDataFinal1.push({
                                            rowId: itemsDataFinal1.length, CLIENO: itemsData[i].CEP_REC.CLIENO, ENGNO: itemsData[i].CEP_REC.ENGNO, PRJNO: itemsData[i].CEP_REC.PRJNO, CTDESC: itemsData[i].CTDESC, DES: itemsData[i].DES, Hrs1: null, Hrs2: null, Hrs3: null, Hrs4: null, Hrs5: null, Hrs6: null, Hrs7: null, HrsTotal: ttlHrsWeek
                                            , TEID_data: itemsData[i].TEID, data: itemsData[i], TIMSUB: itemsData[i].TIMSUB
                                        });
                                        itemsDataFinal1[itemsDataFinal1.length - 1]["Hrs" + day] = parseFloat(itemsData[i].HRS, 10);
                                        itemsDataFinal1[itemsDataFinal1.length - 1]["TEID" + day] = itemsData[i].TEID
                                    }
                                    else if (computeIndex > -1) {
                                        if (itemsDataFinal1[computeIndex]["Hrs" + day] != null && parseFloat(itemsData[i].TEID) > parseFloat($rootScope.weeklyMaxTEID[0])) {
                                            var maxTEIDMultiple = maxTEID + " -- " + i;
                                            maxIdRevisedArray.push(maxTEIDMultiple);
                                            ttlHrsWeek += parseFloat(itemsData[i].HRS, 10);
                                            itemsDataFinal.push(itemsData[i].CEP_REC.CLIENO + "|"
                                    + itemsData[i].CEP_REC.ENGNO + "|" + itemsData[i].CEP_REC.PRJNO + "|"
                                            + cepDescrption + "|" + itemsData[i].DES + "|" + itemsData[i].TIMSUB + "|" + itemsData[i].REGFLAG + "|" + itemsData[i].PRSTCD + "|" + maxTEIDMultiple);


                                            itemsDataFinal1.push({
                                                rowId: itemsDataFinal1.length, CLIENO: itemsData[i].CEP_REC.CLIENO, ENGNO: itemsData[i].CEP_REC.ENGNO, PRJNO: itemsData[i].CEP_REC.PRJNO, CTDESC: itemsData[i].CTDESC, DES: itemsData[i].DES, Hrs1: null, Hrs2: null, Hrs3: null, Hrs4: null, Hrs5: null, Hrs6: null, Hrs7: null, HrsTotal: ttlHrsWeek
                                                , TEID_data: itemsData[i].TEID, data: itemsData[i], TIMSUB: itemsData[i].TIMSUB
                                            });
                                            computeIndex = -1;
                                            itemsDataFinal1[itemsDataFinal1.length - 1]["Hrs" + day] = parseFloat(itemsData[i].HRS, 10);
                                            itemsDataFinal1[itemsDataFinal1.length - 1]["TEID" + day] = itemsData[i].TEID
                                        }
                                    }
                                }
                                if (computeIndex > -1) {
                                    if (itemsDataFinal1[computeIndex]["Hrs" + day] == null) {
                                        itemsDataFinal1[computeIndex]["Hrs" + day] = 0;
                                    }

                                    itemsDataFinal1[computeIndex]["Hrs" + day] = parseFloat(itemsDataFinal1[computeIndex]["Hrs" + day], 10) + parseFloat(itemsData[i].HRS, 10);
                                    itemsDataFinal1[computeIndex]["HrsTotal"] = parseFloat(itemsDataFinal1[computeIndex]["HrsTotal"], 10) + parseFloat(itemsData[i].HRS, 10);
                                    itemsDataFinal1[computeIndex]["TEID" + day] = itemsDataFinal1[computeIndex]["TEID" + day] != undefined ? itemsDataFinal1[computeIndex]["TEID" + day] + ',' + parseInt(itemsData[i].TEID, 10) : parseInt(itemsData[i].TEID, 10);
                                }
                            }
                            itemsDataTotal["HrsGrandTotalSum"] = 0;
                            for (var j = 1; j <= 7; j++) {
                                var totSum = 0;
                                var checkIndex = false;
                                for (var i = 0; i < itemsDataFinal1.length; i++) {
                                    if (itemsDataFinal1[i]["Hrs" + j] == null) {
                                        continue;
                                    }
                                    checkIndex = true;
                                    totSum += parseFloat(itemsDataFinal1[i]["Hrs" + j], 10);
                                    itemsDataTotal["HrsTotalSum" + j] = totSum;
                                }
                                if (!checkIndex) {
                                    itemsDataTotal["HrsTotalSum" + j] = 0;
                                    continue;
                                }
                                itemsDataTotal["HrsGrandTotalSum"] = parseFloat(itemsDataTotal["HrsGrandTotalSum"], 10) + parseFloat(itemsDataTotal["HrsTotalSum" + j], 10);
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
                            if (!$scope.savedInlineRow) {
                                $scope.gridOptions.data = $scope.itemsDataFinal1;
                                for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                                    $scope.gridOptions.data[i].Hrs1 = $scope.gridOptions.data[i].Hrs1 == null ? $scope.gridOptions.data[i].Hrs1 : Number(parseFloat($scope.gridOptions.data[i].Hrs1).toFixed(2));
                                    $scope.gridOptions.data[i].Hrs2 = $scope.gridOptions.data[i].Hrs2 == null ? $scope.gridOptions.data[i].Hrs2 : Number(parseFloat($scope.gridOptions.data[i].Hrs2).toFixed(2));
                                    $scope.gridOptions.data[i].Hrs3 = $scope.gridOptions.data[i].Hrs3 == null ? $scope.gridOptions.data[i].Hrs3 : Number(parseFloat($scope.gridOptions.data[i].Hrs3).toFixed(2));
                                    $scope.gridOptions.data[i].Hrs4 = $scope.gridOptions.data[i].Hrs4 == null ? $scope.gridOptions.data[i].Hrs4 : Number(parseFloat($scope.gridOptions.data[i].Hrs4).toFixed(2));
                                    $scope.gridOptions.data[i].Hrs5 = $scope.gridOptions.data[i].Hrs5 == null ? $scope.gridOptions.data[i].Hrs5 : Number(parseFloat($scope.gridOptions.data[i].Hrs5).toFixed(2));
                                    $scope.gridOptions.data[i].Hrs6 = $scope.gridOptions.data[i].Hrs6 == null ? $scope.gridOptions.data[i].Hrs6 : Number(parseFloat($scope.gridOptions.data[i].Hrs6).toFixed(2));
                                    $scope.gridOptions.data[i].Hrs7 = $scope.gridOptions.data[i].Hrs7 == null ? $scope.gridOptions.data[i].Hrs7 : Number(parseFloat($scope.gridOptions.data[i].Hrs7).toFixed(2));
                                    $scope.gridOptions.data[i].HrsTotal = $scope.gridOptions.data[i].HrsTotal == null ? $scope.gridOptions.data[i].HrsTotal : Number(parseFloat($scope.gridOptions.data[i].HrsTotal).toFixed(2));
                                }
                                if ($scope.clearGrouping) {
                                    $scope.gridApi.grouping.clearGrouping();
                                    $scope.clearGrouping = false;
                                }
                                $scope.gridOptions.showColumnFooter = true;
                                $timeout(function () {
                                    $scope.bindGridEvents();
                                }, 2000);
                                if ($rootScope.pastedRecords) {
                                    setMaxTEIDRowSelectd($scope.itemsDataFinal1);
                                }
                                else if ($rootScope.rowIndex != undefined)
                                    $interval(function () {
                                        setGridSelectedRow($scope.itemsDataFinal1);
                                    }, 0, 1);
                                else
                                    $interval(function () {
                                        try {
                                            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
                                        } catch (ex) {
                                        }
                                    }, 0, 1);
                            }
                            else {
                                synchTEIDAfterInineSave();
                            }
                            for (var i = 0; i < $scope.itemsDataFinal1.length; i++) {
                                //$scope.gridData[i].CEP_REC.CLIENO = $scope.gridData[i].CEP_REC.CLIENO + '-' +("0" +$scope.gridData[i].CEP_REC.PRJNO).slice(-3).toString() + '-' +("0" +$scope.gridData[i].CEP_REC.ENGNO).slice(-3).toString();
                                $scope.itemsDataFinal1[i].data.CEP_REC.CLIENO = $scope.itemsDataFinal1[i].data.CEP_REC.CLIENO + '-' + ("0" + $scope.itemsDataFinal1[i].data.CEP_REC.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.itemsDataFinal1[i].data.CEP_REC.PRJNO).slice(-3).toString();
                                if ($scope.itemsDataFinal1[i].data.CTSDESC != null) {
                                    var taskcomponent = $scope.itemsDataFinal1[i].data.CTSDESC.split(">");
                                    $scope.itemsDataFinal1[i].Component = taskcomponent[0];
                                    $scope.itemsDataFinal1[i].Task = taskcomponent[1];

                                }
                                if ($scope.itemsDataFinal1[i].data.CATID > 0)
                                    $scope.itemsDataFinal1[i].ProjectActivity = $scope.itemsDataFinal1[i].data.CTSDESC;
                                else
                                    $scope.itemsDataFinal1[i].ProjectActivity = $scope.itemsDataFinal1[i].data.ACTI_REC.DES;

                                $scope.itemsDataFinal1[i].CEP_REC = $scope.itemsDataFinal1[i].data.CEP_REC;
                                $scope.itemsDataFinal1[i].ACTI_REC = $scope.itemsDataFinal1[i].data.ACTI_REC;
                                $scope.itemsDataFinal1[i].CMPTID = $scope.itemsDataFinal1[i].data.CMPTID;
                                $scope.itemsDataFinal1[i].TSKID = $scope.itemsDataFinal1[i].data.TSKID;
                                $scope.itemsDataFinal1[i].CTSDESC = $scope.itemsDataFinal1[i].data.CTSDESC;
                                $scope.itemsDataFinal1[i].SCOID = $scope.itemsDataFinal1[i].data.SCOID;
                                if ($scope.itemsDataFinal1[i].SCOID > 0) {
                                    var arrScope = $scope.itemsDataFinal1[i].CTSDESC.split(">");
                                    $scope.itemsDataFinal1[i].Scope = arrScope[2];
                                }
                            }
                            $timeout(function () { $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL); });
                            $scope.itemsDataTotal = itemsDataTotal;
                            $scope.weeklyTtlHours = itemsDataTotal["HrsGrandTotalSum"]
                            $scope.weeklyTtlHours = $scope.weeklyTtlHours.toFixed(2);
                            if (isNaN($scope.weeklyTtlHours))
                                $scope.weeklyTtlHours = 0.00;



                        }
                        if ($scope.gridData != undefined && $scope.gridData !== null && $scope.gridData.length > 0) {
                            $scope.ttlHrs = 0.00;
                            $scope.icChrge = 0.00;
                            $.each($scope.gridData, function (index, value) {
                                $scope.ttlHrs += parseFloat($scope.gridData[index].HRS);
                                if ($scope.isDailyMode) {
                                    var tempIcCharge = parseFloat($scope.gridData[index].ICCHRGE, 10);
                                    if (!isNaN(tempIcCharge)) {
                                        $scope.icChrge += tempIcCharge;
                                    }
                                }
                            });
                            $scope.ttlHrs = $scope.ttlHrs.toFixed(2);
                            if (!$scope.isDailyMode)
                                $scope.icChrge = 0.00;
                            if (isNaN($scope.ttlHrs))
                                $scope.ttlHrs = 0.00;
                            for (var i = 0; i < $scope.gridData.length; i++) {
                                $scope.gridData[i].CEP_REC.CLIENO = $scope.gridData[i].CEP_REC.CLIENO + '-' + ("0" + $scope.gridData[i].CEP_REC.ENGNO).slice(-3).toString() + '-' + ("0" + $scope.gridData[i].CEP_REC.PRJNO).slice(-3).toString();
                                if ($scope.gridData[i].CTSDESC != null) {
                                    var taskcomponent = $scope.gridData[i].CTSDESC.split(">");
                                    $scope.gridData[i].Component = taskcomponent[0];
                                    $scope.gridData[i].Task = taskcomponent[1];
                                    if ($scope.gridData[i].SCOID > 0)
                                        $scope.gridData[i].Scope = taskcomponent[2];

                                }
                                if ($scope.gridData[i].CATID > 0)
                                    $scope.gridData[i].ProjectActivity = $scope.gridData[i].CTSDESC;
                                else
                                    $scope.gridData[i].ProjectActivity = $scope.gridData[i].ACTI_REC.DES;

                            }
                        }
                    }
                    $timeout(function () { broadcastService.notifyRefreshCalendar() });
                    var revMnthRange = undefined;
                    var CurrDate = new Date();
                    var SelDate = new Date($scope.currentDate.valueOf());
                    SelDate = $filter('date')(new Date(SelDate.getFullYear(), SelDate.getMonth(), SelDate.getDate()), "yyyy-MM-dd");
                    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var selObj = null;
                    var pdate = $filter('date')($scope.currentDate.valueOf(), "yyyy-MM-dd");
                    var selecteddate = new Date($scope.currentDate.valueOf());

                    pdate = createDate(pdate);
                    //check from local
                    selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate')('msg_invalidSession'), true);//chekRevDateInLocalStorage(pdate);
                    if (selObj != null) {
                        checkCloseMonth(selObj, CurrDate, monthNames, selecteddate);
                    }
                    else {
                        var loginDetail = $rootScope.GetLoginDetail(false, true);
                        loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                            revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                            if (revMnthRange != undefined && revMnthRange != "undefined") {
                                for (var i = 0; i < revMnthRange.length; i++) {
                                    if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
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
                    if (!$scope.chartsRenderingFlag) {
                        $scope.showSummary();
                        getSummaryData($scope.summaryGridData);
                    }
                    else {
                        $scope.showCharts();
                        getSummaryData($scope.summaryGridData);
                    }
                    if (isAfterInlineSave)
                        unLockGrid();
                    $scope.savedInlineRow = null;
                })
            .catch(function (failure) {
                unLockGrid();
                $('.my-cloak').removeClass('my-cloak');
                showMessagePopUp([$filter('translate')('lbl_Error') + ":" + failure], $filter('translate')('lbl_Error'), false);
            });

        }
        var synchTEIDAfterInineSave = function (data) {
            var gridRow = $filter('filter')($scope.gridOptions.data, function (d) {
                return d.rowId === $scope.savedInlineRow.rowId;
            });
            if (gridRow.length > 0) {
                gridRow = gridRow[0];
                var teIds = $scope.savedInlineRow.teIdDaywise;
                for (var i = 0; i < 7; i++) {
                    if (i == 0) {
                        gridRow.TEID1 = teIds[0];
                        continue;
                    }
                    else if (i == 1) {
                        gridRow.TEID2 = teIds[1];
                        continue;
                    }
                    else if (i == 2) {
                        gridRow.TEID3 = teIds[2];
                        continue;
                    }
                    else if (i == 3) {
                        gridRow.TEID4 = teIds[3];
                        continue;
                    }
                    else if (i == 4) {
                        gridRow.TEID5 = teIds[4];
                        continue;
                    }
                    else if (i == 5) {
                        gridRow.TEID6 = teIds[5];
                        continue;
                    }
                    else if (i == 6) {
                        gridRow.TEID7 = teIds[6];
                        continue;
                    }
                }
            }
            console.log(gridRow);
        }
        var setGridSelectedRow = function (data) {
            try {
                var dataWeek = data;
                var indexWeekly;
                for (var i = 0; i < dataWeek.length; i++) {
                    //if (((JSON.stringify(dataWeek[i].CEP_REC)) == (JSON.stringify($rootScope.rowIndex.CEP_REC))) && dataWeek[i].DES == $rootScope.rowIndex.DES && dataWeek[i].Hrs1 == $rootScope.rowIndex.Hrs1 && dataWeek[i].Hrs2 == $rootScope.rowIndex.Hrs2 && dataWeek[i].Hrs3 == $rootScope.rowIndex.Hrs3 && dataWeek[i].Hrs4 == $rootScope.rowIndex.Hrs4 && dataWeek[i].Hrs5 == $rootScope.rowIndex.Hrs5 && dataWeek[i].Hrs6 == $rootScope.rowIndex.Hrs6 && dataWeek[i].Hrs7 ==$rootScope.rowIndex.Hrs7) {
                    if (((dataWeek[i].CEP_REC.CLIEID == $rootScope.rowIndex.CEP_REC.CLIEID) && (dataWeek[i].CEP_REC.CATID == $rootScope.rowIndex.CEP_REC.CATID) && (dataWeek[i].CEP_REC.COMPID == $rootScope.rowIndex.CEP_REC.COMPID) && (dataWeek[i].CEP_REC.ENGID == $rootScope.rowIndex.CEP_REC.ENGID) && (dataWeek[i].CEP_REC.PRJID == $rootScope.rowIndex.CEP_REC.PRJID) && dataWeek[i].DES == $rootScope.rowIndex.DES && dataWeek[i].Hrs1 == $rootScope.rowIndex.Hrs1 && dataWeek[i].Hrs2 == $rootScope.rowIndex.Hrs2 && dataWeek[i].Hrs3 == $rootScope.rowIndex.Hrs3 && dataWeek[i].Hrs4 == $rootScope.rowIndex.Hrs4 && dataWeek[i].Hrs5 == $rootScope.rowIndex.Hrs5 && dataWeek[i].Hrs6 == $rootScope.rowIndex.Hrs6 && dataWeek[i].Hrs7 == $rootScope.rowIndex.Hrs7) || ((dataWeek[i].ACTI_REC.STAT == $rootScope.rowIndex.ACTI_REC.STAT) && (dataWeek[i].DES == $rootScope.rowIndex.DES) && dataWeek[i].Hrs1 == $rootScope.rowIndex.Hrs1 && dataWeek[i].Hrs2 == $rootScope.rowIndex.Hrs2 && dataWeek[i].Hrs3 == $rootScope.rowIndex.Hrs3 && dataWeek[i].Hrs4 == $rootScope.rowIndex.Hrs4 && dataWeek[i].Hrs5 == $rootScope.rowIndex.Hrs5 && dataWeek[i].Hrs6 == $rootScope.rowIndex.Hrs6 && dataWeek[i].Hrs7 == $rootScope.rowIndex.Hrs7 && (dataWeek[i].ACTI_REC.ACTICD == $rootScope.rowIndex.ACTI_REC.ACTICD))) {
                        indexWeekly = i;
                        break;
                    }
                }
                if (indexWeekly != undefined && indexWeekly != null && indexWeekly > -1)
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[indexWeekly]);
                else {
                    setMaxTEIDRowSelectd(data);
                }
            } catch (ex) {
            }
        }

        var setMaxTEIDRowSelectd = function (data) {
            var getdata = data;
            var teid = 0; var k = 0;
            for (var i = 0; i < getdata.length; i++) {
                if (teid < getdata[i].data.TEID) {
                    teid = getdata[i].data.TEID;
                    k = i;
                }
            }
            $rootScope.rowIndexNew = k;
            $interval(function () {
                try {
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[$rootScope.rowIndexNew]);
                } catch (ex) {
                }
            }, 0, 1);
        }

        var showMessageOnDeleteFailure = function (isTEInOpenREVWeekExist, isDailyMode) {
            if (isDailyMode) {
                if ($scope.checkRevMonthFlag)
                    showMessagePopUp([$filter('translate')('lbl_cantDlt')]);
                else
                    showMessagePopUp([$filter('translate')('msg_dltFaild')]);

            }
            else {
                //grid showing delete icon still, entry is not deleted by API
                if (isTEInOpenREVWeekExist)
                    showMessagePopUp([$filter('translate')('lbl_cantDlt')]);
                else
                    showMessagePopUp([$filter('translate')('msg_dltFaild')]);
            }
        }
        $scope.deleteTimeEntries = function (isDailyMode, timeEntryIds, invalidCount, selectedCount, isTEInOpenREVWeekExist) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.deleteTimeEntries");
            $rootScope.countmove = 0;
            var succnt = 0, messages = "";
            var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
            gridDataService.deleteTimeEntries(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, '"' + timeEntryIds.join('","') + '"').then(function (data) {
                if (data.DELTIM_OUT_OBJ.RETCD != 0)
                    $timeout(function () {
                        showMessagePopUp([data.DELTIM_OUT_OBJ.ERRMSG], "Message", true);
                    }, 200);
                else {
                    $rootScope.columnBlank = false;
                    if (data.DELTIM_OUT_OBJ.TEID_ARR != undefined && data.DELTIM_OUT_OBJ.TEID_ARR != null) {
                        var deletedCount = data.DELTIM_OUT_OBJ.TEID_ARR.length != undefined ? data.DELTIM_OUT_OBJ.TEID_ARR.length : 1;
                        var unsuccessCount = 0;
                        if (isDailyMode)
                            unsuccessCount = selectedCount - deletedCount;
                        else
                            unsuccessCount = invalidCount;

                        succnt = selectedCount - unsuccessCount;
                        if (succnt > 0)
                            messages += $filter('translate')('msg_dltSucess', {
                                dltSucessVar: succnt
                            });
                        if (unsuccessCount > 0) {
                            if (messages != "")
                                messages += "<br/>";
                            messages += unsuccessCount + ' ' + $filter('translate')('msg_dltUnSucess');
                        }
                        $scope.GetData(isDailyMode, (isDailyMode ? $scope.currentDate : $scope.weeklyStartDate));
                        showMessagePopUp([messages]);
                    }
                    else {
                        showMessageOnDeleteFailure(isTEInOpenREVWeekExist, isDailyMode);
                    }

                }
                //broadcastService.notifyRefreshCalendar();
            })

        }

        /*submit entry*/
        /*performance improvement : loadRevenueMonths API call*/
        $scope.submitTimeEntries = function (submitUpToDate) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.submitTimeEntries");
            if (!$scope.checkRevMonthFlag) {
                $scope.isShowSubmitMenu = false;
                return;
            }
            if (angular.isDefined(submitUpToDate)) {
                if ($scope.initialDetail.EMPL_REC.BRATE.toString() == "222") {
                    showValidationMsg([$filter('translate')('msg_InvaildBillingRate')], $filter('translate')('lbl_Error'), false);
                    return false;
                }
                else {
                    if (!$rootScope.columnBlank) {
                        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        //client's system date
                        var clientSysDate = new Date();
                        var selObj = null;
                        //create date after discarding time from the submitUpToDate

                        var selectedCalDate = $filter('date')(submitUpToDate.valueOf(), "yyyy-MM-dd");
                        selectedCalDate = createDate(selectedCalDate);
                        selObj = $rootScope.chekRevDateInLocalStorage(selectedCalDate, $filter('translate')('msg_invalidSession'), false);// chekRevDateInLocalStorage(pdate);
                        if (selObj != null) {
                            submitTimeEntriesCheck(selObj, clientSysDate, monthNames, submitUpToDate);
                        }
                        else {
                            var revMnthRange = undefined;
                            var SelDate = new Date(submitUpToDate.valueOf());
                            SelDate = $filter('date')(new Date(SelDate.getFullYear(), SelDate.getMonth(), SelDate.getDate()), "yyyy-MM-dd");
                            var loginDetail = $rootScope.GetLoginDetail(false, true);
                            loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                                revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                                if (revMnthRange != undefined && revMnthRange != "undefined") {

                                    for (var i = 0; i < revMnthRange.length; i++) {
                                        if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
                                            if (selectedCalDate >= createDate(revMnthRange[i].STRTDTE) && selectedCalDate <= createDate(revMnthRange[i].ENDDTE)) {
                                                selObj = revMnthRange[i];
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (selObj != null) {
                                    submitTimeEntriesCheck(selObj, clientSysDate, monthNames, submitUpToDate);
                                }

                            });
                        }
                    }
                    else {
                        var sendData = {
                            errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                        };
                        $scope.openModalCtrl = 'showValidationMsg';
                        sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);

                    }
                }
            }
        }

        var isLoadData = function (submitUpToDate) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.isLoadData");
            var isSameDate = false;
            var submitDate = $filter('date')(submitUpToDate, 'yyyy-MM-dd');
            var calDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');
            if (submitDate == calDate) {
                isSameDate = true;
            }
            return isSameDate;
        }
        $scope.$on("SaveMainGridLayout", function (event, result) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.$on.SaveMainGridLayout");
            if (result.args.isSave) {
                $modalStack.dismissAll();
                if (result.args.isOverride != undefined)
                    $scope.overrideFlag = true;
                else
                    $scope.overrideFlag = false;
                if (result.args.methodName == "colViewToggle")
                    resetActClsToSelectedColView();
                $scope.saveLayout();
                $scope.showColViewMenu = false;
            }
            else {

                if (result.args.methodName != "SaveBtn") {
                    localStorage.setItem('isMainGridLayoutChange', 0);
                    $rootScope.enableSaveLayout = false;
                }

                $modalStack.dismissAll();
                if (result.args.methodName == "wkDayToggle")
                    $scope.weekDayToggle(true, !$scope.isDailyMode, "N");
                else if (result.args.methodName == "colViewToggle")
                    $scope.bottomColPrefMenu(result.args.option);
                else if (result.args.methodName == "becomeDesignateOf") {
                    var designateObj = JSON.parse(localStorage.getItem('designateObj'));
                    $scope.becomeDesignateOf(designateObj);
                    localStorage.removeItem('designateObj');
                }
            }
        });

        var getParentColumnDefId = function (isLayoutOverride) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.SaveMainGridLayout");
            var parentId = "1";
            if (!isLayoutOverride) {
                parentId = $scope.isDailyMode ? $scope.optionDaily.toString() : $scope.optionWeekly.toString();
            }
            else if ($scope.isDailyMode && $scope.optionDaily == 5) {
                parentId = customLayouts.daily.parentColumnViewId;
            }
            else if (!$scope.isDailyMode && $scope.optionWeekly == 5) {
                parentId = customLayouts.weekly.parentColumnViewId;
            }
            else {
                parentId = $scope.isDailyMode ? $scope.optionDaily.toString() : $scope.optionWeekly.toString();
            }
            return parentId;
        }
        $scope.saveLayout = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.saveLayout");
            if (localStorage.getItem('isMainGridLayoutChange') == "1") {
                if (!$rootScope.dailyCustomFlag && $scope.isDailyMode || !$rootScope.weeklyCustomFlag && !$scope.isDailyMode || $scope.overrideFlag) {
                    var gridLayout = $scope.gridApi.saveState.save();
                    var mode = $scope.isDailyMode ? constantService.LAYOUTMODE.Daily : constantService.LAYOUTMODE.Weekly;
                    var parentId = getParentColumnDefId($scope.overrideFlag);//$scope.isDailyMode ? $scope.optionDaily.toString(): $scope.optionWeekly.toString();
                    var customLayout = gridLayoutService.createLayoutObj(JSON.parse(JSON.stringify(gridLayout.columns)));
                    var layoutName = "";
                    if ($scope.overrideFlag) {
                        if ($scope.isDailyMode)
                            layoutName = $scope.dailyViewCustomLayout;
                        else
                            layoutName = $scope.weeklyViewCustomLayout;
                    }
                    var sendData = {
                        layout: customLayout.columns,
                        layoutName: layoutName,
                        mode: mode,
                        parentId: parentId,
                        layOutNames: layOutNameList
                    };
                    $scope.overrideFlag = false;
                    $scope.openModalCtrl = 'saveLayoutCtrl';
                    sharedService.openModalPopUp('Desktop/CustumLayout/templates/LayoutSave.html', 'LayoutSaveCtrl', sendData);
                }
                else {
                    var sendData = {
                        msgList: [$filter('translate')('msg_overrideMainGridSveLayOut')],
                        isCancelBtnOn: true,
                        okBtnText: $filter('translate')('btn_Yes'),
                        noBtnTxt: $filter('translate')('btn_No'),
                        popUpName: 'OverrideSaveMainGrdLayout',
                        methodName: 'SaveBtn'
                    };
                    sharedService.openModalPopUp('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
                }
            }

        }
        var submitFinal = function (selObj, CurrDate, monthNames, submitUpToDate, nonSubmittedEntries) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.submitFinal");
            var revEndDateCutoff = null;
            if (selObj.TECUTTOFF.split(" ")) {
                revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
            }
            var selectedDate = new Date(submitUpToDate.valueOf());
            selectedDate = $filter('date')(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()), "yyyy-MM-dd");
            var revEndDateCutoffdate = new Date(revEndDateCutoff);
            revEndDateCutoffdate.setHours(0, 0, 0, 0);

            if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                $scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' + revEndDateCutoff.getFullYear() + $filter('translate')('msg_nwClosed');
                $scope.checkRevMonthFlag = false;
                $scope.isSbmtOpen = false;
            }
            else {
                var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, true);
                var revStrDteAr = jsonSFromloginDetail.REVM_REC.STRTDTE.split("-");
                var revEndDteAr = jsonSFromloginDetail.REVM_REC.ENDDTE.valueOf().split("-");
                var EmpCompanyRecord = {
                    THRS: 'N', ENIC: 'N'
                };
                EmpCompanyRecord.THRS = jsonSFromloginDetail.COMP_REC.THRS;
                EmpCompanyRecord.ENIC = jsonSFromloginDetail.COMP_REC.ENIC;

                //revenue start and end date
                var revSDte = new Date(revStrDteAr[0], revStrDteAr[1] - 1, revStrDteAr[2].split(" ")[0]);
                var revEDte = new Date(revEndDteAr[0], revEndDteAr[1] - 1, revEndDteAr[2].split(" ")[0]);
                revSDte = new Date(revSDte.getTime() + (revSDte.getTimezoneOffset() * 60 * 1000));
                revEDte = new Date(revEDte.getTime() + (revEDte.getTimezoneOffset() * 60 * 1000));
                var selDte = new Date(submitUpToDate.valueOf());
                var revSDteOriginal = revSDte;
                var selDteOriginal = selDte;
                selDte.setHours(0, 0, 0, 0);
                revSDte.setHours(0, 0, 0, 0)
                //date is falling in the current revenue month then only call submit
                if (selDte >= revSDte) {
                    var ttlRcrdToSmt = parseInt(nonSubmittedEntries);
                    var loginDetail = $rootScope.GetLoginDetail(false, true);
                    selDte = $filter('date')(new Date(selDte.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                    if (ttlRcrdToSmt > 0) {
                        $scope.isShowSubmitMenu = false;
                        var msg = "";
                        var msg = $filter('translate')('msg_SubmitTimeMsg', {
                            date: $filter('date')(submitUpToDate.valueOf(), 'dd-MMM-yyyy')
                        });

                        $scope.submitIfConfirm(loginDetail.SESKEY, loginDetail.EMPLID, selDte, msg, "submitConfirm", 0);

                    }
                    else {
                        $scope.isShowSubmitMenu = false;
                        showMessagePopUp([$filter('translate')('msg_NoTEntryToSubmit')]);
                    }
                }
            }
        }
        var submitTimeEntriesCheck = function (selObj, CurrDate, monthNames, submitUpToDate) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.submitTimeEntriesCheck");
            //var isSameDate = isLoadData(submitUpToDate);
            //if (isSameDate == false) {
            submitAfterGetData(selObj, CurrDate, monthNames, submitUpToDate)
            // }
            // else {
            //  var recrdToSubmit = parseInt($scope.nonSubmittedICEntries) + parseInt($scope.nonSubmittedEntries);
            //   submitFinal(selObj, CurrDate, monthNames, submitUpToDate, recrdToSubmit)
            // }
        }

        var submitAfterGetData = function (selObj, CurrDate, monthNames, submitUpToDate) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.submitAfterGetData");
            var nonSubmittedTE = 0, nonSubIc;
            //alert('date--'+$filter('date')(dateVal, 'yyyy-MM-dd'));
            var startDate = $filter('date')(new Date(submitUpToDate.valueOf()), 'yyyy-MM-dd HH:mm:ss');
            var endDate = new Date(submitUpToDate.valueOf());
            endDate = endDate.setDate(endDate.getDate());
            endDate = $filter('date')(endDate, 'yyyy-MM-dd HH:mm:ss');
            var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);

            if (jsonSFromloginDetail) {
                //localStorage.removeItem("retrieveTimeEntriesDataSaved");
                //localStorage.removeItem("savedTimeEntriesRevDates");
                gridDataService.getDataForSubmit(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, startDate, endDate, startDate).then(function (data) {
                    if (parseInt(data.RETTIM_OUT_OBJ.RETCD) == 0) {
                        nonSubmittedTE = parseInt(data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTED);
                        nonSubIc = parseInt(data.RETTIM_OUT_OBJ.TIME_SUMM.NONSUBMITTEDIC);
                    }
                    submitFinal(selObj, CurrDate, monthNames, submitUpToDate, (nonSubmittedTE + nonSubIc));

                })
            }
        }

        $scope.loadErrorPopup = function (isError, message, isReloadPage, isCancelBtnOn) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.loadErrorPopup");
            var sendData = {
                isError: isError,
                message: message,
                isReloadPage: isReloadPage,
                isCancelBtnOn: isCancelBtnOn,

            };
            $scope.openModalCtrl = 'ErrorPopup';
            $scope.open('templates/ErrorPopup.html', 'ErrorPopup', sendData);
        }


        $scope.submitIfConfirm = function (ses, eId, dte, msg, popUpName, step) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.submitIfConfirm");
            var sendData = {
                msgList: [msg],
                isSubmit: true,
                empId: eId,
                sesKey: ses,
                selDte: dte,
                isCancelBtnOn: true
            };
            if (step === 1) {
                sendData.okBtnText = $filter('translate')('btn_Yes');
                sendData.noBtnTxt = $filter('translate')('btn_No');
            }
            $scope.openModalCtrl = popUpName;
            $scope.open('Desktop/Home/templates/ConfirmBox.html', 'ConfirmBoxCtrl', sendData);
        }


        var callApiToSubmitEntries = function (ssKey, empId, toDte, isSubmitIC) {
            var icSubmitFlag = isSubmitIC ? 'Y' : 'N';
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.callApiToSubmitEntries");
            gridDataService.submitTimeEntries(icSubmitFlag, ssKey, empId, toDte, function (data) {
                var respId = parseInt(data.SUBTIM_OUT_OBJ.RETCD);
                if (respId == 0) {
                    showMessagePopUp([data.SUBTIM_OUT_OBJ.ERRMSG]);
                    if ($scope.isDailyMode)
                        $scope.GetData($scope.isDailyMode, $scope.currentDate);
                    else
                        $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                }
                else if (respId == 2) {
                    showMessagePopUp([data.SUBTIM_OUT_OBJ.ERRMSG]);
                }

                    //resend the api call  
                else {
                    $scope.submitIfConfirm(ssKey, empId, toDte, data.SUBTIM_OUT_OBJ.ERRMSG, "submitAPIConfirm", 1);
                }
            });
        }



        var checkCloseMonth = function (selObj, CurrDate, monthNames, selecteddate) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.checkCloseMonth");
            var revEndDateCutoff = null;
            if (selObj.TECUTTOFF.split(" ")) {
                revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
            }
            selecteddate = $filter('date')(new Date(selecteddate.getFullYear(), selecteddate.getMonth(), selecteddate.getDate()), "yyyy-MM-dd");
            var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
            var revEndDateCutoffdate = new Date(revEndDateCutoff);
            revEndDateCutoffdate.setHours(0, 0, 0, 0);
            if (CurrDate.getTime() >= revEndDateCutoff.getTime() && (selecteddate >= selObj.STRTDTE.substring(0, 10) && selecteddate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                $scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' + revEndDateCutoff.getFullYear() + $filter('translate')('msg_nwClosed');
                $scope.checkRevMonthFlag = false;
                $scope.isSbmtOpen = false;
            }
        }
        var redirectToNewEntryPage = function (selObj, currentDate, CurrDate, SelDate, isEditMode, sendDate, isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.redirectToNewEntryPage");
            var datetime = $locale.DATETIME_FORMATS;
            var monthNames = datetime.MONTH;
            if (selObj.TECUTTOFF.split(" ")) {
                var revEndDateCutoff = createDateTime(selObj.TECUTTOFF);
            }
            var selectedDate = $filter('date')(currentDate, "yyyy-MM-dd");
            var chkcurdate = $filter('date')(new Date(), "yyyy-MM-dd");
            var revEndDateCutoffdate = new Date(revEndDateCutoff);
            revEndDateCutoffdate.setHours(0, 0, 0, 0);

            if ((CurrDate.getTime() >= revEndDateCutoff.getTime()) && (selectedDate >= selObj.STRTDTE.substring(0, 10) && selectedDate <= selObj.ENDDTE.substring(0, 10)) && (chkcurdate >= selObj.STRTDTE.substring(0, 10) && chkcurdate <= selObj.ENDDTE.substring(0, 10))) {
                $scope.checkRevMonthFlag = false;
                $scope.closedmonth = monthNames[revEndDateCutoff.getMonth()] + ' ' + revEndDateCutoff.getFullYear() + $filter('translate')('msg_nwClosed');
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
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.NewClick");
            $rootScope.lastCurrentDate = $filter('date')(currentDate, "yyyy-MM-dd");
            $rootScope.lastExpandAllText = $scope.expandAllText;
            $rootScope.lastExpandClass = $scope.expandClass;
            $rootScope.cntrExpandCollapse = 2;
            if (!isDailyMode) {
                $rootScope.isPasteClicked = true;
                $rootScope.weekStateCurrentDate = $filter('date')(currentDate, "yyyy-MM-dd");
            }
            var revMnthRange = undefined;
            var selObj = null;
            var CurrDate = new Date();
            var SelDate = $filter('date')(currentDate, "yyyy-MM-dd");
            var monthNames = {
                0: $filter('translate')('lbl_Mnth1'), 1: $filter('translate')('lbl_Mnth2'), 2: $filter('translate')('lbl_Mnth3'),
                3: $filter('translate')('lbl_Mnth4'), 4: $filter('translate')('lbl_Mnth5'), 5: $filter('translate')('lbl_Mnth6'),
                6: $filter('translate')('lbl_Mnth7'),
                7: $filter('translate')('lbl_Mnth8'), 8: $filter('translate')('lbl_Mnth9'), 9: $filter('translate')('lbl_Mnth10'),
                10: $filter('translate')('lbl_Mnth11'), 11: $filter('translate')('lbl_Mnth12')
            };
            var pdate = $filter('date')(currentDate, "yyyy-MM-dd");
            pdate = createDate(pdate);
            selObj = $rootScope.chekRevDateInLocalStorage(pdate, $filter('translate')('msg_invalidSession'), false);
            if (selObj != null) {
                redirectToNewEntryPage(selObj, currentDate, CurrDate, SelDate, isEditMode, sendDate, isDailyMode)
            }
            else {
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                loadRevenueMonthsServices.loadRevenueMonths(loginDetail.SESKEY, SelDate, function (response) {
                    revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                    if (revMnthRange != undefined && revMnthRange != "undefined") {
                        var pdate = $filter('date')(currentDate, "yyyy-MM-dd");
                        pdate = createDate(pdate);
                        for (var i = 0; i < revMnthRange.length; i++) {
                            if (revMnthRange[i] != null && revMnthRange[i] != undefined && revMnthRange[i].STRTDTE != undefined) {
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
        var createDate = function (dteStr) {
            // $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.createDate");
            if (dteStr != undefined) {
                var parts = dteStr.split("-");
                var day = parts[2].split(' ');
                return new Date(parts[0], parts[1] - 1, day[0]);
            }
            else return null;
        }

        var createDateTime = function (dateStr) {
            //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.createDateTime");
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

        $scope.copyRecords = function (isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.copyRecords");
            if (!$rootScope.columnBlank) {
                var selectedEntries = [];
                selectedEntries = angular.copy($scope.gridApi.selection.getSelectedRows());
                if (selectedEntries.length > 0) {
                    var isNegativeEntryAllowed = true;
                    for (var i = 0; i < selectedEntries.length; i++) {
                        if ($scope.showEditFlag || $rootScope.showRightMenuFlag || $rootScope.ctrlFlag || $scope.IsTodayCopied || $scope.IsWeekCopied)
                            var tempSelected = selectedEntries[i];
                        else
                            var tempSelected = JSON.parse(selectedEntries[i]);
                        var tempEntry = JSON.parse(JSON.stringify(tempSelected));
                        var weekEntryHours = JSON.parse(JSON.stringify(tempEntry));
                        if (!$scope.isDailyMode)
                            tempEntry = tempEntry.data;
                        if (tempEntry.CEP_REC.CHARBASIS == 'T' || tempEntry.CEP_REC.CHARBASIS == 'S' || tempEntry.CEP_REC.CHARBASIS == 'C') {
                            if ($scope.isDailyMode && parseFloat(tempEntry.HRS) < 0) {
                                isNegativeEntryAllowed = false;
                                break;
                            }
                            else if (!$scope.isDailyMode && (parseFloat(weekEntryHours.Hrs1) < 0 || parseFloat(weekEntryHours.Hrs2) < 0 || parseFloat(weekEntryHours.Hrs3) < 0 || parseFloat(weekEntryHours.Hrs4) < 0 || parseFloat(weekEntryHours.Hrs5) < 0 || parseFloat(weekEntryHours.Hrs6) < 0 || parseFloat(weekEntryHours.Hrs7) < 0)) {
                                isNegativeEntryAllowed = false;
                                break;
                            }
                        }
                    }
                    if (isNegativeEntryAllowed) {
                        $scope.isNegativeAllowed = true;
                        $scope.moveEntryToClipBoard($scope.isDailyMode, selectedEntries);
                        return true;
                    }
                    else {
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                        $scope.isNegativeAllowed = false;
                        showMessagePopUp([$filter('translate')('msg_cpyNgtv')], $filter('translate')('lbl_Error'), false);
                        return false;
                    }
                    return false;
                }
                else if ($rootScope.ctrlFlag) {
                    showMessagePopUp(['No entry selected.'], "Message", true); $rootScope.ctrlFlag = false;
                }
            }
            else {
                var sendData = {
                    errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                };
                $scope.openModalCtrl = 'showValidationMsg';
                sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
            }
        }
        $scope.SelectedID = "";
        $scope.selectedTEIDs = [];


        $scope.entryCheckedUnchecked = function (isDailyMode, radTEID) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.entryCheckedUnchecked");
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
                    if ($('#' + radTEID).is(":checked"))
                        $("#d" + radTEID).addClass("selected");
                    else
                        $("#d" + radTEID).removeClass("selected");
                }
                else {
                    if ($('#' + radTEID).is(":checked"))
                        $("#week" + radTEID.substring(1)).addClass("selected");
                    else
                        $("#week" + radTEID.substring(1)).removeClass("selected");

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
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.chekCopyTodayWeekDate");
            var currDate = new Date(); var tecutoff = null;
            var currentTimezone = currDate.getTimezoneOffset();
            currDate.setMinutes(currDate.getMinutes() - (currentTimezone));
            var revObj = $rootScope.chekRevDateInLocalStorage(currDate, $filter('translate')('msg_invalidSession'), false);
            if (revObj != null) {
                var tecutoff = revObj.TECUTTOFF;
            }
            return tecutoff;
        }

        checkAfterCuttOff = function () {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.checkAfterCuttOff");
            //var teCuttoff = new Date(chekCopyTodayWeekDate());
            var teCuttoff = createDateTime(chekCopyTodayWeekDate());
            var teCuttOffNew = angular.copy(teCuttoff);
            var chkcurrDate = new Date();
            var chkcurrDateNew = new Date();
            if ($scope.checkRevMonthFlag || ($scope.isDailyMode && teCuttoff > chkcurrDate) || (!$scope.isDailyMode && ((teCuttoff > chkcurrDate && chkcurrDate.getDay() == 6) || chkcurrDate.getDay() != 6))) {
                $scope.afterTecuttOff = true;
            }
            //if ($scope.checkRevMonthFlag || ($scope.isDailyMode && teCuttoff > chkcurrDate) || (!$scope.isDailyMode && ((teCuttoff > chkcurrDate && chkcurrDate.getDay() == 6) || chkcurrDate.getDay() != 6))) {
            //    $scope.copytoTodayCuttOff = true;
            //}
            //var todaydate = chkcurrDate.setHours(0, 0, 0, 0);

            if (teCuttoff > chkcurrDate || teCuttoff.setHours(0, 0, 0, 0) != chkcurrDate.setHours(0, 0, 0, 0)) {
                $scope.afterTecuttOff = true;
            }
            else {
                $scope.afterTecuttOff = false;
            }
            var offsetDate = new Date();
            //if (offsetDate.getTimezoneOffset() < 0) 
            //chkcurrDateNew = new Date("sessiontimeout");

            if (teCuttOffNew > chkcurrDateNew) {
                $scope.copytoTodayCuttOff = true;
            }
            else {
                $scope.copytoTodayCuttOff = false;
            }

            var tecuttoffdateOnly = teCuttoff.setHours(0, 0, 0, 0);
            var checkselectedDt = angular.copy($scope.currentDate);
            checkselectedDt = checkselectedDt.setHours(0, 0, 0, 0);
            if (checkselectedDt > tecuttoffdateOnly)
                $scope.afterTecuttOffWeek = true;
            else
                $scope.afterTecuttOffWeek = false;
        }

        $scope.checkPasteMulCnt = 0;
        $scope.pasteRecords = function (isDailyMode, pasteMultipleCount) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteRecords");
            $rootScope.pastedRecords = false;
            $rootScope.countmove = 0; $scope.totalDailyPastedHours = 0; $scope.totalWeeklyPastedHours = [0, 0, 0, 0, 0, 0, 0];
            $scope.exceedHrs = []; $rootScope.totalPastedHrs = 0;
            if (($scope.isDailyMode && $scope.isDailyFlag) || ($scope.isWeeklyFlag && !$scope.isDailyMode)) {
                if (!$rootScope.columnBlank) {
                    $scope.failedErrorMessage = [];
                    $scope.prjRenewMessage = [];
                    $scope.showEditFlag = false;
                    $rootScope.showRightMenuFlag = false;
                    $scope.showMenuOutsideGrid = false;
                    var pasteContinueCount = 0;
                    $scope.highestWeekRecordNumber = 0;
                    if (!$scope.IspasteAdvance)
                        $scope.renewalMessage = [];
                    var messageText = "";
                    var messageSuccessText = "";
                    if ($rootScope.isMobileOrTab) {
                        if ($scope.IsTodayCopied || $scope.IsWeekCopied) {
                            messageText = "Copy";
                            messageSuccessText = $filter('translate')('msg_copied');
                        }
                        else if ($scope.IsClone) {
                            messageText = "Clone";
                            messageSuccessText = $filter('translate')('msg_cloned');
                        }
                        else {
                            messageText = "Paste";
                            messageSuccessText = $filter('translate')('msg_pasted');
                        }
                    }
                    else {
                        messageSuccessText = $filter('translate')('msg_pasted');
                    }
                    $scope.checkDbPartition = 0;
                    $(".copy").removeClass("active");
                    var teCuttoff = createDateTime(chekCopyTodayWeekDate());
                    var chkcurrDate = new Date();
                    if (($scope.checkRevMonthFlag || ($scope.IsTodayCopied && isDailyMode && teCuttoff > chkcurrDate) || ($scope.IsWeekCopied && !isDailyMode && ((teCuttoff > chkcurrDate && chkcurrDate.getDay() == 6) || chkcurrDate.getDay() != 6)) || $scope.IspasteAdvance) && ((($scope.afterTecuttOff || (!isDailyMode && ($scope.afterTecuttOff || $scope.afterTecuttOffWeek))) && ($scope.IsTodayCopied || $scope.IsWeekCopied)) || (!$scope.IsTodayCopied && !$scope.IsWeekCopied))) {
                        if ((!$scope.IsTodayCopied && !$scope.IsWeekCopied && !$scope.IspasteAdvance && !$scope.IsClone) && ((localStorage.getItem("DailyDataCopied") !== null && isDailyMode) || (localStorage.getItem("WeeklyDataCopied") !== null && !isDailyMode)))
                            $(".paste").addClass("active");

                        $scope.round = false;
                        $scope.IsSelectedForAll = false;
                        $(".task-container.selected").removeClass("selected");
                        var count = 0;
                        var jsonSFromloginDetail = $rootScope.GetInitialDetail(false, true);
                        if (jsonSFromloginDetail == undefined || jsonSFromloginDetail == null) {
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                            isPasteOnProgress = false;
                            return;
                        }
                        //revenue start and end date
                        var revSDte = new Date(jsonSFromloginDetail.REVM_REC.STRTDTE.split(" ")[0]);
                        var revEDte = new Date(jsonSFromloginDetail.REVM_REC.ENDDTE.split(" ")[0]);
                        revSDte = new Date(revSDte.getTime() + (revSDte.getTimezoneOffset() * 60 * 1000));
                        revEDte = new Date(revEDte.getTime() + (revEDte.getTimezoneOffset() * 60 * 1000));
                        revSDte.setHours(0, 0, 0, 0);
                        if (isDailyMode) {
                            var dailyDate = null;
                            if ($scope.isCalDrop) {
                                dailyDate = $scope.calDropDate;
                            }
                            else if ($scope.IsTodayCopied) {
                                var tempTodayDate = new Date();
                                var currentTimezone = tempTodayDate.getTimezoneOffset();
                                tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
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
                                    copiedRecords[i].DTE = $filter('date')(new Date(dailyDate), 'yyyy-MM-dd HH:mm:ss');
                                    var dateToCompare = new Date(dailyDate);
                                    var tempGMTTodayDate = new Date();
                                    tempGMTTodayDate.setHours(0, 0, 0, 0);
                                    var tempTodayDate = new Date();
                                    var currentTimezone = tempTodayDate.getTimezoneOffset();
                                    tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
                                    tempTodayDate.setHours(0, 0, 0, 0);
                                    if (isInvalidFutureEntry(copiedRecords[i])) {
                                        copiedRecords[i].HRS = 0;
                                    }
                                }
                                if (copiedRecords.length == 1 && pasteMultipleCount == 1) {
                                    var isValid = $scope.validateEntries(isDailyMode, copiedRecords[0], null, dailyDate, false);
                                    if (!isValid) {
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                        $scope.IsClone = false;
                                        $scope.IsTodayCopied = false;
                                        $scope.IsWeekCopied = false;
                                    }

                                    var entryToValidate = copiedRecords[0];
                                    projectComponetService.searchPRCCode($scope.loginDetail.SESKEY, entryToValidate.CEP_REC.CATID, entryToValidate.CEP_REC.PRJID).then(function (response) {
                                        var isValidPT = true;
                                        if (parseInt(response.LOADPCOMTSK_OUT_OBJ.RETCD) == 0) {
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
                                                    showMessagePopUp([$filter('translate')('msg_invalidProjectComponent')], $filter('translate')('lbl_Error'), false);
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
                                                    showMessagePopUp([$scope.prjScopeNoValidMsg], $filter('translate')('lbl_Error'), false);
                                                    isValidPT = false;
                                                }
                                            }


                                        }
                                        //else {
                                        //    isPasteOnProgress = false;
                                        //}
                                        if (isValid && isValidPT) {
                                            $scope.selectedRecordArray = [];
                                            $scope.highestRecordNum = null;
                                            $scope.highestRecordNumTemp = null;
                                            $scope.pasteSave(copiedRecords, false, pasteMultipleCount, 0, 0);
                                        }
                                        else {
                                            isPasteOnProgress = false;
                                        }
                                    });
                                }
                                else {
                                    $scope.selectedRecordArray = [];
                                    $scope.highestRecordNum = null;
                                    $scope.highestRecordNumTemp = null;
                                    var multipleFilteredCopiedRecords = [];
                                    var failedCount = 0;
                                    var z = 0; $scope.totalDailyPastedHours = 0;
                                    $scope.exceedHrs = [];
                                    for (var i = 0; i < copiedRecords.length; i++) {
                                        if (!$scope.validateEntries(isDailyMode, copiedRecords[i], null, dailyDate, true))
                                            failedCount++;
                                        else {
                                            multipleFilteredCopiedRecords[z] = JSON.parse(JSON.stringify(copiedRecords[i]));
                                            z++;
                                        }
                                    }
                                    if (failedCount > 0 && multipleFilteredCopiedRecords.length < 1) {
                                        messages = (pasteMultipleCount * failedCount) + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                                        if ($scope.checkPasteMulCnt == 0) {
                                            showMessagePopUp($scope.failedErrorMessage, $filter('translate')('lbl_Error'), false);
                                        }
                                        isPasteOnProgress = false;
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                    }
                                    else if (multipleFilteredCopiedRecords.length > 0)
                                        $scope.pasteSave(multipleFilteredCopiedRecords, true, pasteMultipleCount, failedCount, 0);
                                    else {
                                        isPasteOnProgress = false;
                                    }
                                }
                                $scope.SelectedID = "";
                            }
                            else {
                                isPasteOnProgress = false;
                            }
                        }
                        else {
                            var weekstartdate = $scope.weeklyStartDate.valueOf();
                            if ($scope.IsWeekCopied == true) {
                                var tempTodayDate = new Date();
                                var currentTimezone = tempTodayDate.getTimezoneOffset();
                                tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
                                weekstartdate = tempTodayDate;
                                weekstartdate.setDate(weekstartdate.getDate() + 1);
                                weekstartdate.setDate(weekstartdate.getDate() - 7);


                                for (var i = 0; i < 7; i++) {
                                    if (weekstartdate.getDay() == 0)
                                        break;
                                    weekstartdate.setDate(weekstartdate.getDate() + 1);
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
                                    sendDate = new Date(sendDate.setDate(sendDate.getDate() + copiedRecords[i].DTECount));
                                    var tempGMTTodayDate = new Date();
                                    tempGMTTodayDate.setHours(0, 0, 0, 0);
                                    var tempTodayDate = new Date();
                                    var currentTimezone = tempTodayDate.getTimezoneOffset();
                                    tempTodayDate.setMinutes(tempTodayDate.getMinutes() - (currentTimezone));
                                    tempTodayDate.setHours(0, 0, 0, 0);
                                    copiedRecords[i].DTE = $filter('date')(new Date(sendDate.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                                    if (isInvalidFutureEntry(copiedRecords[i])) {
                                        copiedRecords[i].HRS = 0;
                                    }

                                    revenueStartDate.setHours(sendDate.getHours(), sendDate.getMinutes(), sendDate.getSeconds(), sendDate.getMilliseconds());
                                    timeEntry = timeEntryNextRevenueService.timeEntryToNextRevenue(sendDate, revSDte, copiedRecords, i, revenueStartDate);
                                    console.log('WEEKLY timeEntry--' + JSON.stringify(timeEntry));
                                    if (timeEntry != null) {
                                        delete timeEntry.DTECount;
                                        filteredCopiedRecords[j] = timeEntry;
                                        j++;
                                    }
                                    if (sendDate.setHours(0, 0, 0, 0) < revSDte.setHours(0, 0, 0, 0)) {
                                        pasteContinueCount++;
                                        continue;
                                    }


                                    delete copiedRecords[i].DTECount;
                                    filteredCopiedRecords[j] = copiedRecords[i];
                                    j++;
                                }
                                count = filteredCopiedRecords.length;
                                if (filteredCopiedRecords.length > 0 && highestRow == 1) {
                                    var isValid = $scope.validateEntries(isDailyMode, filteredCopiedRecords[0], filteredCopiedRecords, weekstartdate, false);
                                    if (!isValid) {
                                        $scope.IsClone = false;
                                        $scope.IsTodayCopied = false;
                                        $scope.IsWeekCopied = false;
                                    }
                                    var entryToValidate = filteredCopiedRecords[0];
                                    projectComponetService.searchPRCCode($scope.loginDetail.SESKEY, entryToValidate.CEP_REC.CATID, entryToValidate.CEP_REC.PRJID).then(function (response) {
                                        var isValidPT = true;
                                        if (parseInt(response.LOADPCOMTSK_OUT_OBJ.RETCD) == 0) {
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
                                                    showMessagePopUp([$filter('translate')('msg_invalidProjectComponent')], $filter('translate')('lbl_Error'), false);
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
                                                    showMessagePopUp([$scope.prjScopeNoValidMsg], $filter('translate')('lbl_Error'), false);
                                                    isValidPT = false;
                                                }
                                            }


                                        }
                                        //else {
                                        //    isPasteOnProgress = false;
                                        //}
                                        if (isValid && isValidPT) {
                                            $scope.selectedRecordArray = [];
                                            $scope.highestRecordNum = null;
                                            $scope.highestRecordNumTemp = null;
                                            var multipleFilteredCopiedRecords = [];
                                            var selectedRecNumber = 0;
                                            var failedCount = 0;
                                            var isValidMultipleEntry = true;
                                            var z = 0; $scope.totalWeeklyPastedHours = [0, 0, 0, 0, 0, 0, 0];
                                            $scope.exceedHrs = [];
                                            for (var i = 0; i < filteredCopiedRecords.length; i++) {
                                                if (JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber != selectedRecNumber) {
                                                    var tempRecNum = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                                    var tempFilteredCopiedRecords = [];
                                                    var k = 0;
                                                    for (var j = 0; j < filteredCopiedRecords.length; j++) {
                                                        if (tempRecNum == JSON.parse(JSON.stringify(filteredCopiedRecords[j])).selectedRecordNumber) {
                                                            tempFilteredCopiedRecords[k] = JSON.parse(JSON.stringify(filteredCopiedRecords[j]));
                                                            k++;
                                                        }
                                                    }
                                                    if (!$scope.validateEntries(isDailyMode, filteredCopiedRecords[i], tempFilteredCopiedRecords, weekstartdate, true)) {
                                                        failedCount = failedCount + tempFilteredCopiedRecords.length;
                                                        isValidMultipleEntry = false;
                                                    }
                                                    else
                                                        isValidMultipleEntry = true;
                                                    selectedRecNumber = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                                }
                                                if (isValidMultipleEntry) {
                                                    multipleFilteredCopiedRecords[z] = JSON.parse(JSON.stringify(filteredCopiedRecords[i]));
                                                    z++;
                                                }
                                            }
                                            if (failedCount > 0 && multipleFilteredCopiedRecords.length < 1) {
                                                messages = (pasteMultipleCount * failedCount) + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                                                if ($scope.checkPasteMulCnt == 0)
                                                    showMessagePopUp($scope.failedErrorMessage, $filter('translate')('lbl_Error'), false);
                                                $(".paste").removeClass("active");
                                                $(".copyToday").removeClass("active");
                                                $(".copyWeek").removeClass("active");
                                                $(".clone").removeClass("active");
                                                isPasteOnProgress = false;
                                            }
                                            else if (multipleFilteredCopiedRecords.length > 0)
                                                $scope.pasteSave(multipleFilteredCopiedRecords, false, pasteMultipleCount, failedCount, pasteContinueCount);
                                        }
                                        else {
                                            isPasteOnProgress = false;
                                            $(".paste").removeClass("active");
                                            $(".copyToday").removeClass("active");
                                            $(".copyWeek").removeClass("active");
                                            $(".clone").removeClass("active");
                                        }
                                    });
                                    $scope.SelectedID = "";
                                }
                                else if (filteredCopiedRecords.length > 0 && highestRow > 1) {
                                    $scope.selectedRecordArray = [];
                                    $scope.highestRecordNum = null;
                                    $scope.highestRecordNumTemp = null;
                                    var multipleFilteredCopiedRecords = [];
                                    var selectedRecNumber = 0;
                                    var failedCount = 0;
                                    var isValidMultipleEntry = true;
                                    var z = 0; $scope.totalDailyPastedHours = 0; $scope.totalWeeklyPastedHours = [0, 0, 0, 0, 0, 0, 0];
                                    $scope.exceedHrs = [];
                                    for (var i = 0; i < filteredCopiedRecords.length; i++) {
                                        if (JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber != selectedRecNumber) {
                                            var tempRecNum = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                            var tempFilteredCopiedRecords = [];
                                            var k = 0;
                                            for (var j = 0; j < filteredCopiedRecords.length; j++) {
                                                if (tempRecNum == JSON.parse(JSON.stringify(filteredCopiedRecords[j])).selectedRecordNumber) {
                                                    tempFilteredCopiedRecords[k] = JSON.parse(JSON.stringify(filteredCopiedRecords[j]));
                                                    k++;
                                                }
                                            }
                                            if (!$scope.validateEntries(isDailyMode, filteredCopiedRecords[i], tempFilteredCopiedRecords, weekstartdate, true)) {
                                                failedCount = failedCount + tempFilteredCopiedRecords.length;
                                                isValidMultipleEntry = false;
                                            }
                                            else
                                                isValidMultipleEntry = true;
                                            selectedRecNumber = JSON.parse(JSON.stringify(filteredCopiedRecords[i])).selectedRecordNumber;
                                        }
                                        if (isValidMultipleEntry) {
                                            multipleFilteredCopiedRecords[z] = JSON.parse(JSON.stringify(filteredCopiedRecords[i]));
                                            z++;
                                        }
                                    }
                                    if (failedCount > 0 && multipleFilteredCopiedRecords.length < 1) {
                                        messages = ((pasteMultipleCount * failedCount) + pasteContinueCount) + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                                        if ($scope.checkPasteMulCnt == 0)
                                            showMessagePopUp($scope.failedErrorMessage, $filter('translate')('lbl_Error'), false);
                                        isPasteOnProgress = false;
                                        $(".paste").removeClass("active");
                                        $(".copyToday").removeClass("active");
                                        $(".copyWeek").removeClass("active");
                                        $(".clone").removeClass("active");
                                    }
                                    else if (multipleFilteredCopiedRecords.length > 0)
                                        $scope.pasteSave(multipleFilteredCopiedRecords, true, pasteMultipleCount, failedCount, pasteContinueCount);
                                    else {
                                        isPasteOnProgress = false;
                                    }
                                }
                                else {
                                    if (pasteContinueCount > 0) {
                                        var continueMessage = pasteContinueCount + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                                        if (count != 0)
                                            showMessagePopUp([$scope.failedErrorMessage], $filter('translate')('lbl_Error'), false);
                                    }
                                    isPasteOnProgress = false;
                                    $(".paste").removeClass("active");
                                    $(".copyToday").removeClass("active");
                                    $(".copyWeek").removeClass("active");
                                    $(".clone").removeClass("active");
                                }
                            }
                            else {
                                isPasteOnProgress = false;
                            }
                        }

                    }
                    else {
                        $(".paste").removeClass("active");
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                        showMessagePopUp(["Pasted 0 entry."], "Message", true);
                    }
                    if ($scope.prjRenewMessage.length != 0) {
                        showMessagePopUp($scope.prjRenewMessage, "Message", true);
                        $scope.prjRenewMessage = [];
                    }

                }
                else {
                    var sendData = {
                        errorList: ($rootScope.isCategory) ? [$filter('translate')('msg_invalidProjectComponent')] : [$filter('translate')('lbl_actvtyNoValid')], isProjectTaskInvalid: true
                    };
                    $scope.openModalCtrl = 'showValidationMsg';
                    sharedService.openModalPopUp('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
                    isPasteOnProgress = false;
                }
            }
            else {
                isPasteOnProgress = false;
            }

        }
        $scope.copyWeekTodayDate = $filter('date')(new Date("sessiontimeout"), "dd-MMM-yyyy");
        $scope.moveEntryToClipBoard = function (isDailyMode, selectedEntries) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.moveEntryToClipBoard");
            if (isDailyMode) {
                var jsonEntry = [];
                for (var i = 0; i < selectedEntries.length; i++) {
                    if ($scope.showEditFlag || $rootScope.showRightMenuFlag || $rootScope.ctrlFlag || $scope.isPastebyDrag || $scope.IsTodayCopied)
                        jsonEntry[i] = (selectedEntries[i]);
                    else
                        jsonEntry[i] = JSON.parse(selectedEntries[i]);
                    jsonEntry[i].TEID = 0;
                    jsonEntry[i].TIMSUB = 'N';
                }
                localStorage.setItem("copiedRecordsDaily", JSON.stringify(jsonEntry));
                localStorage.setItem("DailyDataCopied", true);
                localStorage.setItem("WeeklyDataCopied", false);
                $scope.DailyDataCopied = true;
                $scope.WeeklyDataCopied = false;
                $scope.isDailyFlag = true;
                $scope.isWeeklyFlag = false;
            }
            else {
                var jsonFinalEntries = [];
                var jsonEntriesString = [];
                var i = 0;
                for (var k = 0; k < selectedEntries.length; k++) {
                    if ($scope.showEditFlag || $rootScope.showRightMenuFlag || $rootScope.ctrlFlag || $scope.isPastebyDrag || $scope.IsTodayCopied || $scope.IsWeekCopied)
                        var jsonRawEntries = (selectedEntries[k]);
                    else
                        var jsonRawEntries = JSON.parse(selectedEntries[k]);
                    if (jsonRawEntries.Hrs1 != null) {

                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 0;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs1;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }

                    if (jsonRawEntries.Hrs2 != null) {
                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 1;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs2;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }

                    if (jsonRawEntries.Hrs3 != null) {
                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 2;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs3;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }

                    if (jsonRawEntries.Hrs4 != null) {
                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 3;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs4;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }

                    if (jsonRawEntries.Hrs5 != null) {
                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 4;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs5;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }

                    if (jsonRawEntries.Hrs6 != null) {
                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 5;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs6;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }

                    if (jsonRawEntries.Hrs7 != null) {
                        jsonRawEntries.data.TEID = 0;
                        jsonRawEntries.data.DTECount = 6;
                        jsonRawEntries.data.selectedRecordNumber = k + 1;
                        jsonRawEntries.data.TIMSUB = 'N';
                        jsonRawEntries.data.HRS = jsonRawEntries.Hrs7;
                        jsonEntriesString[i] = JSON.parse(JSON.stringify(jsonRawEntries.data));
                        i++;
                    }
                }
                var jsonEntries = JSON.parse(JSON.stringify(jsonEntriesString));
                localStorage.setItem("copiedRecordsWeekly", JSON.stringify(jsonEntries));
                localStorage.setItem("WeeklyDataCopied", true);
                localStorage.setItem("DailyDataCopied", false);
                $scope.WeeklyDataCopied = true;
                $scope.DailyDataCopied = false;
                $scope.isWeeklyFlag = true;
                $scope.isDailyFlag = false;
            }
            $(".copy").addClass("active");
            $timeout(function () {
                $(".copy").removeClass("active");
            }, 400);
            $scope.showEditFlag = false;
            $rootScope.showRightMenuFlag = false;
        }
        var showMessagePopUp = function (msgList, title, isWarning) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.showMessagePopUp");
            if (msgList.length == 0)
                return;
            var sendData = {
                errorList: msgList,
                title: title,
                isWarning: isWarning

            };
            $scope.openModalCtrl = 'showMessagePopUp';
            $scope.open('Desktop/NewEntry/templates/AlertBoxSave.html', 'ErrorDesktopPopupCtrl', sendData);
        };
        var get24HourMessageWithPaste = function (message) {
            var msg = []; var splitmsg = [];
            if ($scope.exceedHrs.length > 0) {
                if (constantService.CURRENTLANGUAGE == constantService.FRENCHLANGUAGEKEY) {
                    splitmsg = message[0].split(' ');
                    message[0] = $filter('translate')('msg_pasteEntries');
                    message[0] = message[0].replace('#', splitmsg[2]);
                    msg.push(message[0]);
                }
                else {
                    if ((message[0].indexOf($filter('translate')('msg_entries'))) != '-1')
                        message[0] = message[0].replace($filter('translate')('msg_entries'), $filter('translate')('msg_pasteEntries'));
                    else if ((message[0].indexOf($filter('translate')('msg_entry'))) != '-1')
                        message[0] = message[0].replace($filter('translate')('msg_entry'), $filter('translate')('msg_pasteEntries'))
                    msg.push(message[0] + ' ' + $scope.exceedHrs[0]);
                }
            }
            else
                msg.push(message[0]);
            return msg;
        }
        $scope.pasteSave = function (json, isErrorSuppress, pasteMultipleDateCount, failedCount, pasteContinueFailed) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteSave");
            var clientNumber = "";
            if (json.length > 0) {
                clientNumber = json[0].CEP_REC.CLIENO;
                delete json[0].Component;
                delete json[0].Task;
                delete json[0].ProjectActivity;
                delete json[0].TYPE;
                delete json[0].Scope;
                delete json[0].CTSDESC;
                delete json[0].isICEntry;
                delete json[0].isImportCal;
                json[0].CEP_REC.CLIENO = json[0].CEP_REC.CLIENO.substring(0, 6);
                if (json[0]["CEP_REC.CLIENO"] != undefined)
                    delete json[0]["CEP_REC.CLIENO"];
                json[0].CEP_REC.PROG = "";
                json[0].CEP_REC.GLOBBUSI = "";
            }
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
            recordNum = json.length;
            if (json.length > 0)
                delete json[0].selectedRecordNumber;
            var messageText = "";
            var messageSuccessText = "";
            if ($rootScope.isMobileOrTab) {
                if ($scope.IsTodayCopied || $scope.IsWeekCopied) {
                    messageText = "Copy";
                    messageSuccessText = $filter('translate')('msg_copied');
                    $scope.pasteMultipleCount = 0;
                }
                else if ($scope.IsClone) {
                    messageText = "Clone";
                    messageSuccessText = $filter('translate')('msg_cloned');
                    $scope.pasteMultipleCount = 0;
                }
                else {
                    messageText = "Paste";
                    messageSuccessText = $filter('translate')('msg_pasted');
                    if (!$scope.IspasteAdvance)
                        $scope.pasteMultipleCount = 0;
                }
            }
            else {
                messageSuccessText = $filter('translate')('msg_pasted');
                if ($scope.IsTodayCopied || $scope.IsWeekCopied || $scope.IsClone)
                    $scope.pasteMultipleCount = 0;

                else {
                    if (!$scope.IspasteAdvance)
                        $scope.pasteMultipleCount = 0;
                }
            }
            cepService.saveTimeSheet($scope.loginDetail.SESKEY, $scope.loginDetail.EMPLID, JSON.stringify(json[0]), '').then(function (response) {
                if (parseInt(response.SAVTIM_OUT_OBJ.RETCD) == 0) {
                    json.splice(0, 1);
                    if (json.length > 0) {
                        $scope.pasteSave(json, isErrorSuppress, pasteMultipleDateCount, failedCount, pasteContinueFailed);
                    }
                    if (json.length == 0 && $scope.pasteMultipleCount != undefined && $scope.pasteMultipleCount > 0) {
                        $scope.pasteMultipleCount--;
                    }
                    if (json.length == 0 && ($scope.pasteMultipleCount == undefined || $scope.pasteMultipleCount == 0)) {
                        var messages = [];
                        var strMsg = "";
                        var successCnt = (($scope.highestRecordNum + failedCount) - ($scope.selectedRecordArray != undefined ? $scope.selectedRecordArray.length : 0)) * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount : 1);
                        successCnt = successCnt - $scope.checkDbPartition;
                        successCnt = successCnt - tempFailedCount;
                        if (successCnt > 0) {
                            strMsg = messageSuccessText + ' ' + successCnt + (successCnt > 1 ? $filter('translate')('msg_entries') : $filter('translate')('msg_entry')) + $filter('translate')('msg_success');
                            messages.push(strMsg);
                        }
                        var failedCnt = $scope.selectedRecordArray.length * pasteMultipleDateCount;
                        failedCnt = failedCnt + $scope.checkDbPartition;
                        failedCnt = failedCnt + tempFailedCount;
                        //if (messages != "")
                        //    messages += "<br/>";
                        failedCnt = failedCnt + pasteContinueFailed;
                        if (failedCnt > 0) {
                            strMsg = failedCnt + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                            //messages.push(strMsg);
                        }
                        if (isErrorSuppress && $scope.failedErrorMessage.length > 0) {
                            showMessagePopUp($scope.failedErrorMessage, $filter('translate')('lbl_Error'), false);
                        }
                        $rootScope.pastedRecords = true;
                        if (messages.length > 0 && $scope.failedErrorMessage.length == 0)
                            showMessagePopUp(get24HourMessageWithPaste(messages));
                        if (!$scope.isDailyMode) {
                            $rootScope.isPasteClicked = true;
                            $rootScope.weekStateCurrentDate = $filter('date')($scope.currentDate, "yyyy-MM-dd");
                            $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                        }
                        else
                            $scope.GetData($scope.isDailyMode, $scope.currentDate);
                        //broadcastService.notifyRefreshCalendar();
                        $(".paste").removeClass("active");
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                    }
                }
                else {
                    var errMssg = $filter('translate')('msg_cpyFaild') + clientNumber + ':' + response.SAVTIM_OUT_OBJ.ERRMSG;
                    if (response.SAVTIM_OUT_OBJ.ERRMSG != "" && $scope.failedErrorMessage.indexOf(errMssg) < 0)
                        $scope.failedErrorMessage.push(errMssg);
                    if (json.length == 0 && $scope.pasteMultipleCount != undefined && $scope.pasteMultipleCount > 0) {
                        $scope.pasteMultipleCount--;
                    }
                    if (json.length == 0 && ($scope.pasteMultipleCount == undefined || $scope.pasteMultipleCount == 0)) {
                        var messages = [];
                        var strMsg = "";
                        var successCnt = (($scope.highestRecordNum + failedCount) - ($scope.selectedRecordArray != undefined ? $scope.selectedRecordArray.length : 0)) * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount : 1);
                        successCnt = successCnt - tempFailedCount;
                        if (successCnt > 0) {
                            strMsg = messageSuccessText + ' ' + successCnt + (successCnt > 1 ? $filter('translate')('msg_entries') : $filter('translate')('msg_entry')) + $filter('translate')('msg_success');
                            messages.push(strMsg);
                        }
                        var failedCnt = tempFailedCount;
                        if (messages != "")
                            messages += "<br/>";
                        failedCnt = failedCnt + pasteContinueFailed;
                        if (failedCnt > 0) {
                            strMsg = failedCnt + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                            //messages.push(strMsg);
                        }
                        if (isErrorSuppress && $scope.failedErrorMessage.length > 0) {
                            showMessagePopUp($scope.failedErrorMessage, $filter('translate')('lbl_Error'), false);
                        }

                        if (messages.length > 0 && $scope.failedErrorMessage.length == 0)
                            showMessagePopUp(get24HourMessageWithPaste(messages));
                        if (!$scope.isDailyMode) {
                            $rootScope.isPasteClicked = true;
                            $rootScope.weekStateCurrentDate = $filter('date')($scope.currentDate, "yyyy-MM-dd");
                            $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                        }
                        else
                            $scope.GetData($scope.isDailyMode, $scope.currentDate);
                        //broadcastService.notifyRefreshCalendar();
                        $(".paste").removeClass("active");
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                    }
                    if (!isErrorSuppress) {
                        if (!chekForDBPartitionError(response.SAVTIM_OUT_OBJ.ERRMSG, json)) {
                            showMessagePopUp([response.SAVTIM_OUT_OBJ.ERRMSG], $filter('translate')('lbl_Error'), false);
                            $(".paste").removeClass("active");
                            $(".copyToday").removeClass("active");
                            $(".copyWeek").removeClass("active");
                            $(".clone").removeClass("active");
                        }
                    }
                    else if (isErrorSuppress) {
                        var strMsg = "";
                        if (chekForDBPartitionErrorPasteAdvance(response.SAVTIM_OUT_OBJ.ERRMSG, json)) {
                            $scope.checkDbPartition = $scope.checkDbPartition + 1;
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
                            var failedMsg = [];
                            var successCnt = (($scope.highestRecordNum + failedCount) - ($scope.selectedRecordArray != undefined ? $scope.selectedRecordArray.length : 0)) * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount : 1);
                            //if ($scope.checkDbPartition > 0 && $scope.IspasteAdvance)
                            successCnt = successCnt - $scope.checkDbPartition;
                            successCnt = successCnt - tempFailedCount;
                            if (successCnt > 0) {
                                strMsg = messageSuccessText + ' ' + successCnt + (successCnt > 1 ? $filter('translate')('msg_entries') : $filter('translate')('msg_entry')) + $filter('translate')('msg_success');
                                failedMsg.push(strMsg);
                            }
                            if ($scope.selectedRecordArray != undefined && $scope.selectedRecordArray.length > 0 || $scope.checkDbPartition > 0) {
                                var failedCnt = $scope.selectedRecordArray.length * (pasteMultipleDateCount != undefined ? pasteMultipleDateCount : 1);
                                //if ($scope.checkDbPartition > 0 && $scope.IspasteAdvance)
                                failedCnt = failedCnt + $scope.checkDbPartition;
                                failedCnt = failedCnt + tempFailedCount;
                                //if (failedMsg != "")
                                //    failedMsg += "<br/>";
                                failedCnt = failedCnt + pasteContinueFailed;
                                if (failedCnt > 0) {
                                    strMsg = failedCnt + ' ' + messageText + $filter('translate')('msg_RcrdnoValidNewEntry');
                                    //failedMsg.push(strMsg);
                                }
                                if ($scope.failedErrorMessage.length == 0)
                                    showMessagePopUp(failedMsg);
                                if (isErrorSuppress) {
                                    showMessagePopUp($scope.failedErrorMessage, $filter('translate')('lbl_Error'), false);
                                }
                                $(".paste").removeClass("active");
                                $(".copyToday").removeClass("active");
                                $(".copyWeek").removeClass("active");
                                $(".clone").removeClass("active");
                            }
                            if (!$scope.isDailyMode) {
                                $rootScope.isPasteClicked = true;
                                $rootScope.weekStateCurrentDate = $filter('date')($scope.currentDate, "yyyy-MM-dd");
                                $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                                //broadcastService.notifyRefreshCalendar();
                            }
                            else {
                                $scope.GetData($scope.isDailyMode, $scope.currentDate);
                                //broadcastService.notifyRefreshCalendar();
                            }
                        }

                    }
                }


            });
        }
        var chekForDBPartitionError = function (errMsg, json) {
            var result = false;
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.chekForDBPartitionError");
            if (errMsg != null && errMsg != '') {
                errMsg = errMsg.toLowerCase();
                var index = (errMsg.indexOf("database partition"));

                if (index > 0) {
                    var dates = '';
                    for (var i = 0; i < json.length; i++) {
                        var jsonData = json[i];
                        var dte = dateService.createDate(jsonData.DTE);
                        dte = $filter('date')(dte, "dd-MMM-yyyy");
                        dates = (dates == '' ? dte : dates + ',' + dte);
                    }
                    if (dates != '') {
                        result = true;
                        var msg = $filter('translate')('msg_DBParttionEr', {
                            dateValue: dates
                        });
                        if ($scope.isDailyMode)
                            showMessagePopUp([msg], $filter('translate')('lbl_Error'), false);
                        else
                            showMessagePopUp([msg], $filter('translate')('lbl_Error'), false);
                        $(".paste").removeClass("active");
                        $(".copyToday").removeClass("active");
                        $(".copyWeek").removeClass("active");
                        $(".clone").removeClass("active");
                        if ($scope.isDailyMode) {
                            $scope.GetData($scope.isDailyMode, $scope.currentDate);
                        }
                        else if (!$scope.isDailyMode) {
                            $rootScope.isPasteClicked = true;
                            $rootScope.weekStateCurrentDate = $filter('date')($scope.currentDate, "yyyy-MM-dd");
                            $scope.GetData($scope.isDailyMode, $scope.weeklyStartDate);
                        }
                    }
                }
            }
            return result;
        }
        var chekForDBPartitionErrorPasteAdvance = function (errMsg, json) {
            var result = false;
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.chekForDBPartitionErrorPasteAdvance");
            if (errMsg != null && errMsg != '') {
                errMsg = errMsg.toLowerCase();
                var index = (errMsg.indexOf("database partition"));

                if (index > 0) {
                    var dates = '';
                    for (var i = 0; i < json.length; i++) {
                        var jsonData = json[i];
                        var dte = dateService.createDate(jsonData.DTE);
                        dte = $filter('date')(dte, "dd-MMM-yyyy");
                        dates = (dates == '' ? dte : dates + ',' + dte);
                    }
                    if (dates != '') {
                        result = true;
                    }
                }
            }
            return result;
        }
        var getErrorMessage = function (entryToValidate, msg) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.var.getErrorMessage");
            var message = "";
            message = $filter('translate')('msg_cpyFaild') + " " + entryToValidate.CEP_REC.CLIENO + ": " + msg;
            return message;
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
            if (!$scope.IsTodayCopied && !$scope.IsWeekCopied && !$scope.isPastebyDrag && !$scope.IspasteAdvance) {
                if ($scope.isDailyMode) {
                    if (hrs > 24)
                        is24Hrs = true;
                    else if (!$scope.saveInlineEntryFlag) {
                        $scope.totalDailyPastedHours = (parseFloat($scope.totalDailyPastedHours) == 0 ? parseFloat($scope.ttlHrs) : parseFloat($scope.totalDailyPastedHours)) + parseFloat(hrs)
                        console.log('DESKTOP DAILY HOURS--' + $scope.totalDailyPastedHours);
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
                        console.log('DESKTOP WEEKLY HOURS--' + hrs + ' entryDate--' + entryDate);
                    }
                    else if (!$scope.saveInlineEntryFlag) {
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
                        console.log('DESKTOP WEEKLY HOURS--' + $scope.totalWeeklyPastedHours[dayDiff] + '--dayDiff--' + dayDiff);
                    }


                }

            }
            else {
                if ($scope.IsTodayCopied) {
                    $scope.totalTodayHrs = parseFloat($scope.totalTodayHrs) + parseFloat(hrs);
                    if ($scope.totalTodayHrs > 24)
                        is24Hrs = true;
                    console.log('DESKTOP today HOURS--' + $scope.totalTodayHrs);
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
                    console.log('DESKTOP COPY TO THIS WEEK $scope.totalWeeklyPastedHours[dayDiff]--' + $scope.totalWeeklyPastedHours[dayDiff] + '--dayDiff--' + dayDiff);
                }
                else if ($scope.isPastebyDrag)
                    is24Hrs = commonUtilityService.pasteByDragService(entryDate, entryDate, hrs);

            }
            return is24Hrs;
        }

        var validateForInline = function (isDailyMode, entryToValidate, entries, passedDate, isMultiple) {
            var initialDetail = $rootScope.GetInitialDetail(false, true);
            if (entryToValidate.CEP_REC.CLIEACTIVE != "Y" || entryToValidate.CEP_REC.ENGACTIVE != "Y" || entryToValidate.CEP_REC.PRJACTIVE != "Y") {
                //$scope.msgEr.push($filter('translate')('msg_InActiveCep'));                
                showMessagePopUp([$filter('translate')('msg_InActiveCep')], $filter('translate')('lbl_Error'), false);
                return false;
            }

            if (entryToValidate.CEP_REC.ENGTIMFLAG != "Y") {
                $scope.msgEr.push($filter('translate')('msg_SelectAnotherEng'));
            }

            if (entryToValidate.CEP_REC.PRJTIMFLAG != "Y") {
                $scope.msgEr.push($filter('translate')('msg_SelectAnotherPrj'));
            }

            var cep_detail = angular.copy(entryToValidate.CEP_REC);
            var blockcharges = $scope.initialDetail.COMP_REC.BCHB;

            if (blockcharges !== undefined && (blockcharges !== null) && (blockcharges != '') && blockcharges.toUpperCase() != "NO" && blockcharges.toUpperCase() != "N") {
                for (var i = 0; i < blockcharges.length; i++) {
                    if (cep_detail.CHARBASIS == blockcharges.charAt(i)) {
                        $scope.msgEr.push($filter('translate')('msg_CEPChargeBasisErr'));

                    }
                }
            }


            if (entryToValidate.ACTI_REC.STAT != "Y" && parseInt(entryToValidate.CEP_REC.CATID) == 0) {
                $scope.msgEr.push($filter('translate')('msg_InActiveActivity'));
            }

            var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
            var parts = billingDate.split("-");
            var day = parts[2].split(' ');
            var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
            var entrydt = entryToValidate.DTE.split("-");
            var entryday = entrydt[2].split(' ');
            var entrydate = new Date(entrydt[0], entrydt[1] - 1, entryday[0]);
            if ((new Date(entrydate.valueOf()) < new Date(nstartDate.valueOf())) && !$scope.isPriorToBillingDate) {
                var show = nstartDate.toString().split(' ');
                var date = show[2] + '-' + show[1] + '-' + show[3];
                $scope.msgEr.push($filter('translate')('msg_TimePriorToBillingStartDate', { dateVal: date }));
            }

            if ($scope.msgFutureTime.length != 0)
                $scope.msgEr.push($scope.msgFutureTime[0]);

            $scope.msgFutureTime = [];
            var initialDetail = null;
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            initialDetail = $rootScope.GetInitialDetail(false, true);
            var isMoreThan24H = false;
            var isTime = (entryToValidate.ICRTCD == undefined || entryToValidate.ICRTCD == null || entryToValidate.ICRTCD.trim() == "") ? true : false;
            if (isDailyMode) {
                if ((parseFloat(entryToValidate.HRS) < 0) || (parseFloat(entryToValidate.ICCHRGE) < 0)) {
                    var msg = commonUtilityService.validateTENegValue(entryToValidate, initialDetail, isTime);
                    if (msg != "")
                        $scope.msgEr.push(msg);
                }
                else if (verifyPastedHrs(parseFloat(entryToValidate.HRS), entryToValidate.DTE))//////check pasted hrs
                    isMoreThan24H = true;
            }
            else {
                if (entries != null) {
                    for (var i = 0; i < entries.length; i++) {
                        if (entries[i].HRS == undefined) {
                            entries[i] = JSON.parse(entries[i]);
                        }
                        if ((parseFloat(entries[i].HRS) < 0) || (parseFloat(entries[i].ICCHRGE) < 0)) {
                            var msg = commonUtilityService.validateTENegValue(entries[i], initialDetail, isTime);
                            if (msg != "") {
                                $scope.msgEr.push(msg);
                                break;
                            }
                        }
                        else if (verifyPastedHrs(parseFloat(entries[i].HRS), entries[i].DTE))//////check pasted hrs
                            isMoreThan24H = true;
                    }
                }
            }
            //if (($scope.component.selected.ACTIVE != 'Y') || ($scope.task.selected.ACTIVE != 'Y')) {
            //       //$scope.loadErrorPopup(true, $filter('translate')('msg_invalidProjectComponent'));
            //       showValidationMsg([$filter('translate')('msg_invalidProjectComponent')], false, $filter('translate')('lbl_Error'));
            //       return false;
            //}
            //if (($scope.scopeObj.selected != null)) {
            //    if (($scope.scopeObj.selected.ACTIVE != 'Y')) {
            //        showValidationMsg([$filter('translate')('msg_PrjScopNotValid')], false, $filter('translate')('lbl_Error'));
            //        return false;
            //    }
            //}
            if (isMoreThan24H && !$scope.saveInlineEntryFlag && $scope.exceedHrs.length == 0) {
                maxHourMsg = $filter('translate')('msg_24HrsPaste');
                $scope.exceedHrs.push(maxHourMsg);
            }
            if ($scope.msgEr.length > 0) {
                if ($scope.msgEr.length > 2) {
                    $scope.msgEr = $scope.msgEr.slice(0, 2);
                    $scope.msgEr[2] = $filter('translate')('msg_TEMultipleErr');
                }
                if ($scope.msgEr.length > 1) {
                    //$scope.msgEr[0] = "- " + $scope.msgEr[0];
                    //$scope.msgEr[1] = "- " + $scope.msgEr[1];
                    $scope.msgEr[0] = "<span class=\"floatLeftSide\">- </span>" + "<span class=\"floatRightSide\">" + $scope.msgEr[0] + "</span>";
                    $scope.msgEr[1] = "<span class=\"floatLeftSide\">- </span>" + "<span class=\"floatRightSide\">" + $scope.msgEr[1] + "</span>";
                }
                showMessagePopUp($scope.msgEr, $filter('translate')('lbl_Error'), false);
                $scope.msgEr = [];
                return false;
            }
            if (((entryToValidate.CEP_REC.RENPRJNO != null) && (entryToValidate.CEP_REC.RENPRJNO != ' ')) && (typeof entryToValidate.CEP_REC.RENPRJNO != 'undefined')) {
                var pro = parseInt(entryToValidate.CEP_REC.RENPRJNO) > 99 ? (parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString() : parseInt(entryToValidate.CEP_REC.RENPRJNO) > 9 ? '0' + (parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString() : '00' + (parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString();
                if (entryToValidate.CEP_REC.CLIENO.length != 14)
                    var cepcode = entryToValidate.CEP_REC.CLIENO + '-' + entryToValidate.CEP_REC.ENGNO + '-' + entryToValidate.CEP_REC.PRJNO;
                else
                    var cepcode = entryToValidate.CEP_REC.CLIENO;
                if ($scope.renewalMessage.indexOf(cepcode) == -1) {
                    $scope.renewalMessage.push(cepcode);
                    showMessagePopUp([$filter('translate')('msg_ProjectRenewedPaste', {
                        pName: pro, cepProject: cepcode
                    })], "Warning", 'z');

                }
            }
            return true;

        }

        $scope.validateEntries = function (isDailyMode, entryToValidate, entries, passedDate, isMultiple, isFromInline) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.validateEntries");
            if (isFromInline) { return validateForInline(isDailyMode, entryToValidate, entries, passedDate, isMultiple) }
            else {
                if ((entryToValidate.CEP_REC.CLIEACTIVE != "Y") || (entryToValidate.CEP_REC.ENGACTIVE != "Y") || (entryToValidate.CEP_REC.PRJACTIVE != "Y")) {
                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')('msg_InActiveCep')], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveCep'))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveCep')));
                    }
                    return false;
                }
                //if (entryToValidate.CEP_REC.ENGACTIVE != "Y") {
                //    if (!isMultiple)                    
                //        showMessagePopUp([$filter('translate')('msg_InActiveCep')], "Message", true);                
                //    else {
                //        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveCep'))) < 0)
                //            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveCep')));
                //    }
                //    return false;
                //}
                if (entryToValidate.CEP_REC.ENGTIMFLAG != "Y") {
                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')('msg_SelectAnotherEng')], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')('msg_SelectAnotherEng'))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')('msg_SelectAnotherEng')));
                    }

                    return false;
                }
                //if (entryToValidate.CEP_REC.PRJACTIVE != "Y") {
                //    if (!isMultiple)
                //        showMessagePopUp([$filter('translate')('msg_InActiveCep')], "Message", true);
                //    else {
                //        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveCep'))) < 0)
                //            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveCep')));
                //    }
                //    return false;
                //}


                var initialDetail = $rootScope.GetInitialDetail(false, true);
                if (entryToValidate.ACTI_REC.STAT != "Y" && parseInt(entryToValidate.CEP_REC.CATID) == 0) {
                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')('msg_InActiveActivity')], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveActivity'))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')('msg_InActiveActivity')));
                    }
                    return false;
                }
                if (entryToValidate.CEP_REC.PRJTIMFLAG != "Y") {
                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')('msg_SelectAnotherPrj')], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')('msg_SelectAnotherPrj'))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')('msg_SelectAnotherPrj')));
                    }
                    return false;
                }
                var billingDate = $filter('date')($scope.initialDetail.EMPL_REC.BRSTDTE, 'yyyy-MM-dd');
                var parts = billingDate.split("-");
                var day = parts[2].split(' ');
                var nstartDate = new Date(parts[0], parts[1] - 1, day[0]);
                var entrydt = entryToValidate.DTE.split("-");
                var entryday = entrydt[2].split(' ');
                var entrydate = new Date(entrydt[0], entrydt[1] - 1, entryday[0]);
                if ((new Date(entrydate.valueOf()) < new Date(nstartDate.valueOf())) && !$scope.isPriorToBillingDate) {
                    var show = nstartDate.toString().split(' ');
                    var date = show[2] + '-' + show[1] + '-' + show[3];

                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')('msg_TimePriorToBillingStartDate', {
                            dateVal: date
                        })], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, ([$filter('translate')('msg_TimePriorToBillingStartDate', {
                            dateVal: date
                        })]))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, [$filter('translate')('msg_TimePriorToBillingStartDate', {
                                dateVal: date
                            })]));
                    }
                    if ($scope.IspasteAdvance)
                        $scope.isPriorToBillingDate = true;
                    return false;
                }
                var initialDetail = null;
                var loginDetail = $rootScope.GetLoginDetail(false, true);
                initialDetail = $rootScope.GetInitialDetail(false, true);
                var isMoreThan24H = false;
                if (isDailyMode) {
                    if ((parseFloat(entryToValidate.HRS) < 0) || (parseFloat(entryToValidate.ICCHRGE) < 0)) {
                        var isValid = $scope.validateEntryHours(entryToValidate, initialDetail, isMultiple);
                        if (!isValid)
                            return false;
                    }
                    else if (verifyPastedHrs(parseFloat(entryToValidate.HRS), entryToValidate.DTE))//////check pasted hrs
                        isMoreThan24H = true;
                }
                else {
                    if (entries != null) {
                        for (var i = 0; i < entries.length; i++) {
                            if (entries[i].HRS == undefined) {
                                entries[i] = JSON.parse(entries[i]);
                            }
                            if ((parseFloat(entries[i].HRS) < 0) || (parseFloat(entries[i].ICCHRGE) < 0)) {
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
                }

                if (isMoreThan24H && !$scope.saveInlineEntryFlag && $scope.exceedHrs.length == 0) {
                    maxHourMsg = $filter('translate')('msg_24HrsPaste');
                    $scope.exceedHrs.push(maxHourMsg);
                }

                if (((entryToValidate.CEP_REC.RENPRJNO != null) && (entryToValidate.CEP_REC.RENPRJNO != ' ')) && (typeof entryToValidate.CEP_REC.RENPRJNO != 'undefined')) {
                    var pro = parseInt(entryToValidate.CEP_REC.RENPRJNO) > 99 ? (parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString() : parseInt(entryToValidate.CEP_REC.RENPRJNO) > 9 ? '0' + (parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString() : '00' + (parseInt(entryToValidate.CEP_REC.RENPRJNO)).toString();
                    if (entryToValidate.CEP_REC.CLIENO.length != 14)
                        var cepcode = entryToValidate.CEP_REC.CLIENO + '-' + entryToValidate.CEP_REC.ENGNO + '-' + entryToValidate.CEP_REC.PRJNO;
                    else
                        var cepcode = entryToValidate.CEP_REC.CLIENO;
                    if ($scope.renewalMessage.indexOf(cepcode) == -1) {
                        $scope.renewalMessage.push(cepcode);
                        if (!isMultiple) {
                            showMessagePopUp([$filter('translate')('msg_ProjectRenewedPaste', {
                                pName: pro, cepProject: cepcode
                            })], "Warning", 'z');
                        }
                        else {
                            if ($scope.prjRenewMessage.indexOf($filter('translate')('msg_ProjectRenewedPasteMultiple', { pName: pro, cepProject: cepcode })) < 0)
                                $scope.prjRenewMessage.push($filter('translate')('msg_ProjectRenewedPasteMultiple', { pName: pro, cepProject: cepcode }));
                        }

                    }
                }
                return true;
            }
        }
        $scope.validateEntryHours = function (entryToValidate, initialDetail, isMultiple) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.validateEntryHours");
            var msg = "";
            switch (entryToValidate.CEP_REC.CHARBASIS) {
                case 'N': if (initialDetail.COMP_REC.NTIM != 'Y') {
                    msg = ((entryToValidate.ICRTCD == undefined || entryToValidate.ICRTCD == null || entryToValidate.ICRTCD.trim() == "") ? 'msg_NegativeHrs' : 'msg_NegICCharge');
                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')(msg)], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')(msg))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')(msg)));
                    }
                    return false;
                }
                    break;
                case 'T': if (initialDetail.COMP_REC.NBTM != 'Y') {
                    msg = ((entryToValidate.ICRTCD == undefined || entryToValidate.ICRTCD == null || entryToValidate.ICRTCD.trim() == "") ? 'msg_BillingNegativeHrs' : 'msg_NegICCharge');
                    if (!isMultiple)
                        showMessagePopUp([$filter('translate')(msg)], $filter('translate')('lbl_Error'), false);
                    else {
                        if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')(msg))) < 0)
                            $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')(msg)));
                    }
                    return false;
                }
                    break;
                case 'S':
                case 'C':
                    if ($scope.initialDetail.COMP_REC.NBTM != 'Y') {
                        msg = ((entryToValidate.ICRTCD == undefined || entryToValidate.ICRTCD == null || entryToValidate.ICRTCD.trim() == "") ? 'msg_NegativeHrs' : 'msg_NegICCharge');
                        if (!isMultiple)
                            showMessagePopUp([$filter('translate')(msg)], $filter('translate')('lbl_Error'), false);
                        else {
                            if ($scope.failedErrorMessage.indexOf(getErrorMessage(entryToValidate, $filter('translate')(msg))) < 0)
                                $scope.failedErrorMessage.push(getErrorMessage(entryToValidate, $filter('translate')(msg)));
                        }
                        return false;
                    }
                    break;
            }
            return true;
        }
        $scope.deleteTimeEntriesConfirm = function (isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.deleteTimeEntriesConfirm");
            var count = 0;
            var isSelected = false;
            var chkEntries = document.getElementsByName("chkEntries");
            for (var i = 0, j = 0; i < chkEntries.length; i++) {
                if (chkEntries[i].checked == true) {
                    count++;
                    if (!isSelected) {
                        var entry = JSON.parse(chkEntries[i].value);
                        if ((isDailyMode && entry.TIMSUB == "N") || (!isDailyMode && entry.data.TIMSUB == "N")) {
                            JSON.parse(chkEntries[i].value)
                            isSelected = true;
                        }
                    }
                }
            }
            if (count > 0 && isSelected) {
                var msg = "Do you wish to delete " + count + " records?";
                var sendData = {
                    message: msg,
                    isCancelBtnOn: true,
                    isDailyModeOption: isDailyMode
                };
                $scope.openModalCtrl = 'deleteConfirm';
                $scope.open('templates/ConfirmMessage.html', 'ConfirmMessage', sendData);
            }
        }

        ///////////////////////////////////////////////////Multidatepicker///////////////////////////////////////////////////

        $scope.pasteAdvance = function (isDailyMode) {
            if ($scope.DailyDataCopied || $scope.WeeklyDataCopied) {
                $rootScope.showRightMenuFlag = false;


                $scope.renewalMessage = [];
                var isLoginValid = $rootScope.GetLoginDetail(false, true);
                if (isLoginValid != null && isLoginValid != undefined) {
                    $rootScope.pasteAdvancePopup = true;
                    $scope.showEditFlag = false;
                    $scope.showMenuOutsideGrid = false;
                    $scope.isShowSubmitMenu = false;
                    $rootScope.showRightMenuFlag = false;
                    $scope.showNewFlag = false;
                    // if ($scope.DailyDataCopied || $scope.IsTodayCopied || $scope.IsClone) {
                    $scope.round = false;
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteAdvance");
                    var sendData = {
                        currentDateValue: $scope.currentDate
                    };
                    $scope.openModalCtrl = 'pasteAdvanced';
                    $scope.open('templates/Multidatepicker.html', 'multidatepickerCtrlDesktop', sendData);
                    localStorage.setItem("includeweekend", "0");
                    //}                   
                }
            }
            else {
                showMessagePopUp([$scope.noPaste], "Message", true);
            }
        }
        $scope.CopytoToday = function (isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.CopytoToday");
            $(".copyToday").addClass("active");
            if (isDailyMode) {
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
                })

            }
        }
        $scope.CopytoThisWeek = function (isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.CopytoThisWeek");
            $(".copyWeek").addClass("active");
            if (!isDailyMode) {
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
                        console.log('$scope.weekTotalHrs--' + JSON.stringify($scope.weekTotalHrs));
                        if ($scope.copyRecords(isDailyMode))
                            $scope.pasteRecords(isDailyMode, 1);
                        else
                            $scope.IsWeekCopied = false;
                    }
                });

            }
        }
        $scope.Clone = function (isDailyMode) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.Clone");
            $(".clone").addClass("active");
            if ($scope.checkRevMonthFlag) {
                $scope.IsClone = true;
                if ($scope.copyRecords(isDailyMode))
                    $scope.pasteRecords(isDailyMode, 1);
                else
                    $scope.IsClone = false;
            }

        }
        function squash(arr) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.fn.squash");
            var tmp = [];
            for (var i = 0; i < arr.length; i++) {
                if (tmp.indexOf(arr[i]) == -1) {
                    tmp.push(arr[i]);
                }
            }
            return tmp;
        }
        $scope.pasteMultiple = function (selectedItem) {
            $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.pasteMultiple");
            if (selectedItem != undefined) {
                var dt = new Date("1900-01-01");
                var index = selectedItem.indexOf(dt.setHours(0, 0, 0, 0));
                if (index > -1)
                    selectedItem.splice(index, 1);
                selectedItem = squash(selectedItem);
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
                $scope.checkPasteMulCnt = 0;
                $scope.isPriorToBillingDate = false;
            }
        }

        $scope.showWeeks = false;

        $scope.calYearSelclose = function () {
            localStorage.isReportPopUpOpen = "false";
            $(".DailyTimeDesktopGridCtrl").fadeOut();
        }
        $scope.calDateSelclose = function () {
            localStorage.isReportPopUpOpen = "false";
            $(".DailyTimeDesktopCtrlSubmit").fadeOut();
        }
    }
    app.controller('DailyTimeDesktopGridCtrl', ['$scope', '$filter', 'uiGridConstants', '$http', 'gridDataService', 'cepService', 'projectComponetService', '$timeout', 'loadRevenueMonthsServices', 'broadcastService', 'loginService', 'preferencesService', '$rootScope', '$state', '$modal', '$q', '$window', 'dateService', 'constantService', '$locale', '$translate', '$interval', 'broadcastMessageServices', 'activityService', 'openPopUpWindowFactory', '$document', 'uiGridGridMenuService', 'designateService', 'empSharedService', 'cepSharedService', 'importCalService', 'descFavService', 'activityFavService', '$modalStack', 'gridLayoutService', 'constantService', 'futureEntryService', 'timeEntryNextRevenueService', 'commonUtilityService', 'retrieveSharedService', DailyTimeDesktopGridCtrlFun]);
}());