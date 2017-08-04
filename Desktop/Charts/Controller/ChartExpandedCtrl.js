(function () {
    var app = angular.module('MyTimeApp');   
    var ChartExpandCtrlFun=function ($scope, sharedService, $modalInstance, $timeout, arguments, $rootScope, resizeWindowService, $filter, $translate, broadcastService, commonUtilityService) {
        $scope.init = function () {
            $rootScope.errorLogMethod("chartExpandedCtrl.$scope.init");
            $scope.isLineClickedExpanded = $rootScope.isLineClicked;
            $scope.isMinimize = true;
            var settings = resizeWindowService.getMaxMinSettings(10, 23, 28, 800, 582);
            $scope.maxMode = settings[1];
            $scope.maxMode.innerHeight = $scope.maxMode.height - $scope.maxMode.topHeader ;
            $scope.maxMode.gridHeight = $scope.maxMode.innerHeight - $scope.maxMode.section1Hgt;
            $scope.maxMode.gridWidth = $scope.maxMode.width;
            $scope.maxMode.isChartRendered = false;

            $scope.minMode = settings[0];
            $scope.minMode.isChartRendered =false;
            $scope.minMode.top = '39%';
            $scope.minMode.left = '53%';
            $scope.minMode.innerHeight = $scope.minMode.height - $scope.minMode.topHeader;
            $scope.minMode.gridHeight = $scope.minMode.innerHeight - $scope.minMode.section1Hgt;
            $scope.minMode.gridWidth = $scope.minMode.width;
            // $scope.minMode.innerHeight1 = $scope.minMode.innerHeight-3;
            $scope.windowConfig = angular.copy($scope.minMode);
            $scope.windowConfig.isChartRendered = true;
            $scope.resizeWindow(0,true);
            bindDraggable();
        }
        /*set the window header title*/
        var monthNo = (arguments.revEndDateCharts.getMonth()) + 1;
        var year = arguments.revEndDateCharts.getFullYear();
        var monthName = $filter('translate')('lbl_Mnth' + (monthNo))+ " " + year;
        $scope.windowTitle = $filter('translate')('lbl_summChart', {
            monthYear: monthName
        });
        $scope.resizeWindow = function (mode, fromInit) {
            $rootScope.errorLogMethod("chartExpandedCtrl.$scope.resizeWindow");
            $scope.windowLayout = {};
            if (mode == 0) {
                $scope.isMinimize = true;
            }
            else {
                $scope.isMinimize = false;
            }
            if ($scope.isMinimize) {
                if (!fromInit)
                    $timeout(function () { $("#mainChartDiv").draggable("enable"); }, 100);
                $scope.windowConfig = angular.copy($scope.minMode);
            }
            else {
                $scope.windowConfig = angular.copy($scope.maxMode);
                $("#mainChartDiv").draggable({ disabled: true
                });
            }
            $timeout(function () { $scope.windowConfig.isChartRendered = true; $timeout(function(){$scope.createCharts();}) });


        }
        var createDate = function (dteStr) {
            //$rootScope.errorLogMethod("chartExpandedCtrl.createDate");
            if (dteStr != undefined) {
                var parts = dteStr.split("-");
                var day = parts[2].split(' ');
                return new Date(parts[0], parts[1] - 1, day[0]);
            }
            else return null;
        }
        $scope.myDataValuesExcludeWeekend = [];
        $scope.myDataValues = arguments.chartDataObj;
        $scope.isDataAvailable = arguments.isDataAvailable;
        for (var i = 0; i < $scope.myDataValues.length; i++) {
            var tempDate = createDate($scope.myDataValues[i].Date);
            if (tempDate.getDay() != 0 && tempDate.getDay() != 6)
                $scope.myDataValuesExcludeWeekend.push(JSON.parse(JSON.stringify($scope.myDataValues[i])));
        }
        $scope.revStartDateCharts = arguments.revStartDateCharts;
        $scope.firstDateSet = false;
        $scope.maxTotal = arguments.maxTotal;
        $scope.minTotal = arguments.minTotal;

        var updateChartConfig = function (yGap, ttlNoOfYPoint, isNegVal, maxHrsValAvailable, minHrsValAvailable) {
            minChartYPoint = 0;
            var val = (yGap * (ttlNoOfYPoint - 1));
            var maxYAxisVal = Math.round(val * 10) / 10;
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
                if (Math.abs(minHrsValAvailable) >= Math.abs(minChartYPoint)) {
                    while (Math.abs(minHrsValAvailable) >= Math.abs(minChartYPoint)) {
                        minChartYPoint = minChartYPoint - yGap;
                        var temp = maxChartYPoint - yGap;
                        if ((temp > maxHrsValAvailable)) {
                            maxChartYPoint = temp;
                        }
                        else {
                            // case : -7.5, 0.5
                            countPeriods = countPeriods + 1;
                        }
                    }
                }
                else if (maxHrsValAvailable >= maxChartYPoint) {
                    while (maxHrsValAvailable >= maxChartYPoint) {
                        maxChartYPoint = maxChartYPoint + yGap;
                        var temp = minChartYPoint + yGap;
                        if ((Math.abs(temp) > Math.abs(minHrsValAvailable))) {
                            minChartYPoint = temp;
                        }
                        else {
                            // case : 7.5, -0.5
                            countPeriods = countPeriods + 1;
                        }
                    }
                }
                //if negative value fall on boundry point   
                //if (minVal == availMinVal) {
                //    countPeriods = countPeriods + 1;
                //    minVal = minVal - yGap;
                //}
            }
            //if positive value fall on boundry point  
            if (maxChartYPoint == maxHrsValAvailable && maxChartYPoint !== 0) {
                countPeriods = countPeriods + 1;
                maxChartYPoint = maxChartYPoint + yGap;
            }
        }
        var isEven = function (n) {
            return n % 2 == 0;
        }
        var calculateTotalYPointsToDraw = function (totalHours, interval, isNegHrs, valMax) {
            //totalHours >= interval * totalInterval
            var temp = totalHours / interval;
            var totalInterval = Math.ceil(temp);
            countPeriods = totalInterval + 1;
            //if both negative and positive hours are present then countPeriods(y points) should be odd
            if (isNegHrs && valMax > 0 && isEven(countPeriods))
                countPeriods++;
        }
        var resetChartSettings = function (totalHours, interval, isNegHrs, valMax, ValMin) {
            countPeriods = commonUtilityService.calculateTotalYPointsToDraw(totalHours, interval, isNegHrs, valMax);
            var settings = commonUtilityService.updateChartConfig(interval, countPeriods, isNegHrs, valMax, ValMin,3,2);
            minChartYPoint = settings[0];
            maxChartYPoint = settings[1];
            countPeriods = settings[2];
        }
        var roundBy = 10;
        var getIntervalForSmallValue = function (totalHours) {
            var interval = 0;
            if (totalHours == 0) {
                roundBy = 10;
                interval = 0.5;
            }
           else if (totalHours <= 0.04) {
                roundBy = 1000;
                interval = .005;
            }
            else if (totalHours <= 0.08) {
                roundBy = 100;
                interval = .01;
            }
            
            else if (totalHours <= 0.09) {
                roundBy = 100;
                interval = .02;
            }
                //totalHours<.3
            else if (totalHours <= 0.4) {
                roundBy = 100;
                interval = .05;
            }
            else if (totalHours <= 0.8) {
                roundBy = 10;
                interval = 0.1;
            }
            else if (totalHours <= 1) {
                roundBy = 10;
                interval = 0.2;
            }
            else if (totalHours <= 4) {
                roundBy = 10;
                interval = 0.5;
            }
            return interval;
        }
        $scope.hoursRoundingMethod = function (valMax, ValMin) {
            $rootScope.errorLogMethod("chartExpandedCtrl.$scope.hoursRoundingMethod");
            var isNegHrs = false, tempVal, tempAdd = 0, interval = 0.1
            roundBy = 10;
            if (ValMin < 0) {
                isNegHrs = true;
                totalHours = valMax - ValMin;
            }
            else
                totalHours = valMax;
            totalHours = (totalHours === "" ? 0 : totalHours);
            if (totalHours <= 4) {
                interval = getIntervalForSmallValue(totalHours);
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }           
            else if (totalHours <= 9) {
                interval = 1;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours < 10) {
                interval = 2;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 19) {
                interval = 3;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 24) {
                interval = 4;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 35) {
                interval = 5;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 48) {
                interval = 8;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours < 60) {
                interval = 10;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 90) {
                interval = 15;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 120) {
                interval = 20;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 180) {
                interval = 30;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 240) {
                interval = 40;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 300) {
                interval = 50;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 360) {
                interval = 60;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours<=1000) {
                interval = 100;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else {
                interval = 200;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            return interval;

        }
        var bindDraggable = function () {
            $rootScope.errorLogMethod("chartExpandedCtrl.bindDraggable");
            try {
                $timeout(function () {
                    $("#mainChartDiv, #innerChartDiv").draggable({
                        start: function (event, ui) {
                            if (event.target.id == "innerChartDiv")
                                return false;
                            else
                                $("#mainChartDiv").css('cursor', 'move');
                        },
                        stop: function () {
                            $("#mainChartDiv").css('cursor', 'default');
                        }
                    });
                }, 100);
            } catch (ex) {
            }
        }
        var countPeriods = 0, minChartYPoint = 0, maxChartYPoint = 0;
        $scope.createCharts = function () {
            $rootScope.errorLogMethod("chartExpandedCtrl.$scope.createCharts");
            YUI().use('charts', function (Y) {
                if (!$scope.isDataAvailable)
                    countPeriods = 3;
                $scope.myAxes = {
                    Totals: {
                        keys: ["Billable", "Chargeable", "Non_Billable", "Total"],
                        position: "left",
                        labelFunction: function (val) {
                            return Math.round(val * roundBy) / roundBy;
                            //var display = Math.ceil(val);
                            //return display;
                        },                        
                        type: "numeric",
                        alwaysShowZero: true,
                        roundingMethod: $scope.hoursRoundingMethod($scope.maxTotal, $scope.minTotal),
                        minimum: minChartYPoint,
                        maximum: maxChartYPoint,
                        styles: {
                            majorUnit: {
                                determinant: "count",
                                count: countPeriods
                            }
                        }
                    },
                    dateRange: {
                        keys: ["Date"],
                        position: "bottom",
                        type: "category",
                        //roundingMethod: Math.ceil(maxTotal / 3),
                        labelFunction: function (val) {
                            var display = "";
                            if (val != undefined) {
                                var tempdate = createDate(val);
                                //show all date on x axis  in maximize mode 
                                if (!$scope.isMinimize || document.getElementById('chkExcludeWeekend').checked)
                                    display = (tempdate.getMonth() + 1) + "/" + tempdate.getDate();
                                    //show alternate date on minimize mode
                                else {
                                    if (tempdate.getDate() == $scope.revStartDateCharts.getDate()) {
                                        $scope.tempdatecalc = new Date(tempdate.valueOf());
                                        display = (tempdate.getMonth() + 1) + "/" + tempdate.getDate();
                                    }
                                    else {
                                        var diff = tempdate.getTime() - $scope.tempdatecalc.getTime();
                                        if (diff > (25 * 60 * 60 * 1000)) {
                                            display = (tempdate.getMonth() + 1) + "/" + tempdate.getDate();
                                            $scope.tempdatecalc = new Date(tempdate.valueOf())
                                        }
                                    }
                                }
                            }
                            return display;
                        },
                        //styles: {
                        //    majorUnit: {
                        //        determinant: "count",
                        //        count: 5,
                        //        distance: 50
                        //    },
                        //}
                    },

                };
                $scope.styleDef = {
                    series: {
                        Billable: {
                            line: {
                                weight: 3,
                                color: "#00B8BF",
                                lineAlpha: .5,

                            },
                            marker: {
                                fill: {
                                    color: "#00B8BF"
                                },
                                width: 5
                            }
                        },
                        Chargeable: {
                            line: {
                                weight: 3,
                                color: "#8DD5E7"
                            },
                            marker: {
                                fill: {
                                    color: "#8DD5E7"
                                },
                                width: 5
                            }
                        },
                        Non_Billable: {
                            line: {
                                weight: 3,
                                color: "#005C7A"
                            },
                            marker: {
                                fill: {
                                    color: "#005C7A"
                                },
                                width: 5
                            }
                        },
                        Total: {
                            line: {
                                weight: 3,
                                color: "#FFA928"
                            },
                            marker: {
                                fill: {
                                    color: "#FFA928"
                                },
                                width: 5
                            }
                        }
                    }
                }
                $scope.excludeIncludeWeekends = function (isChecked) {
                    //bar graph excluding weekends
                    if (isChecked && !$scope.isLineClickedExpanded) {
                        $("#mychartExpanded").css("display", "none");
                        $("#mychartExpandedBar").css("display", "none");
                        $("#mychartExpandedExcludeWeekend").css("display", "none");
                        $("#mychartExpandedBarExcludeWeekend").css("display", "block");
                        if ($("#mychartExpandedBarExcludeWeekend>div").length === 0) {
                            var dataForChart = commonUtilityService.hideZeroOnYUIChart($scope.myDataValuesExcludeWeekend);
                            mychartExpanded = new Y.Chart({
                                dataProvider: dataForChart,
                                render: "#mychartExpandedBarExcludeWeekend",
                                axes: $scope.myAxes,
                                categoryKey: "Date",
                                styles: $scope.styleDef,
                                animationEnabled: true,
                                type: "column",
                                verticalGridlines: false,
                                horizontalGridlines: {
                                    styles: {
                                        line: {
                                            color: "#dad8c9"
                                        }
                                    }
                                },
                                tooltip: getToolTip
                            });
                        }                      
                    }
                        //line graph excluding weekends
                    else if (isChecked && $scope.isLineClickedExpanded) {
                        $("#mychartExpanded").css("display", "none");
                        $("#mychartExpandedBar").css("display", "none");
                        $("#mychartExpandedExcludeWeekend").css("display", "block");
                        $("#mychartExpandedBarExcludeWeekend").css("display", "none");
                        if ($("#mychartExpandedExcludeWeekend>div").length === 0)
                            $scope.mychartExpanded = new Y.Chart({
                                dataProvider: $scope.myDataValuesExcludeWeekend,
                                render: "#mychartExpandedExcludeWeekend",
                                axes: $scope.myAxes,
                                categoryKey: "Date",
                                styles: $scope.styleDef,
                                animationEnabled: true,
                                type: "line",
                                verticalGridlines: false,
                                horizontalGridlines: {
                                    styles: {
                                        line: {
                                            color: "#dad8c9"
                                        }
                                    }
                                }
                            });
                    }
                    else {
                        //line graph including weekends
                        if ($scope.isLineClickedExpanded) {
                            $("#mychartExpanded").css("display", "block");
                            $("#mychartExpandedBar").css("display", "none");
                            $("#mychartExpandedExcludeWeekend").css("display", "none");
                            $("#mychartExpandedBarExcludeWeekend").css("display", "none");
                            if ($("#mychartExpanded>div").length === 0)
                                $scope.mychartExpanded = new Y.Chart({
                                    dataProvider: $scope.myDataValues,
                                    render: "#mychartExpanded",
                                    axes: $scope.myAxes,
                                    categoryKey: "Date",
                                    styles: $scope.styleDef,
                                    animationEnabled: true,
                                    type: "line",
                                    verticalGridlines: false,
                                    horizontalGridlines: {
                                        styles: {
                                            line: {
                                                color: "#dad8c9"
                                            }
                                        }
                                    }
                                });
                        }
                            //bar graph including weekends
                        else {
                            $("#mychartExpanded").css("display", "none");
                            $("#mychartExpandedBar").css("display", "block");
                            $("#mychartExpandedExcludeWeekend").css("display", "none");
                            $("#mychartExpandedBarExcludeWeekend").css("display", "none");
                            if ($("#mychartExpandedBar>div").length === 0) {
                                var dataForChart = commonUtilityService.hideZeroOnYUIChart($scope.myDataValues);
                                mychartExpanded = new Y.Chart({
                                    dataProvider: dataForChart,
                                    render: "#mychartExpandedBar",
                                    axes: $scope.myAxes,
                                    categoryKey: "Date",
                                    styles: $scope.styleDef,
                                    animationEnabled: true,
                                    type: "column",
                                    tooltip: getToolTip,
                                    verticalGridlines: false,
                                    horizontalGridlines: {
                                        styles: {
                                            line: {
                                                color: "#dad8c9"
                                            }
                                        }
                                    }
                                });
                            }                          
                        }
                    }
                };

                if (!$rootScope.chartExcludeWkndFlag)
                    $rootScope.chartExcludeWkndFlag = false;
                else {
                    $("#chartChkBoxContainer").addClass("chkActive");
                    $('#chkExcludeWeekend').attr('checked', true);
                }
                $scope.excludeIncludeWeekends(document.getElementById('chkExcludeWeekend').checked);
                $scope.close = function () {
                    $modalInstance.dismiss('cancel');
                };
                Y.on("click", function (e) {
                    $scope.isLineClickedExpanded = false;
                    $scope.excludeIncludeWeekends(document.getElementById('chkExcludeWeekend').checked);
                }, "#barTypeExpanded");

                Y.on("click", function (e) {
                    $scope.isLineClickedExpanded = true;
                    $scope.excludeIncludeWeekends(document.getElementById('chkExcludeWeekend').checked);
                }, "#lineTypeExpanded");

                Y.on("change", function (e) {
                    if (e._currentTarget.checked) {
                        $rootScope.chartExcludeWkndFlag = true;
                        $("#chartChkBoxContainer").addClass("chkActive");
                    }
                    else {
                        $rootScope.chartExcludeWkndFlag = false;
                        $("#chartChkBoxContainer").removeClass("chkActive");
                    }
                    $scope.excludeIncludeWeekends(e._currentTarget.checked);
                    $rootScope.excWeekndCheck = e._currentTarget.checked;
                    //$scope.$broadcast("myEvent", { excWeekndCheck: e._currentTarget.checked });
                    broadcastService.updateMonthlyChart();
                }, "#chkExcludeWeekend");
            });

        }

        /*custum tool tip*/
        var getToolTip = {

            styles: {
                background: "transparent",
                color: "#000",
                border:'1px solid #faf9f2',
                font: 'normal 11px/16px Trebuchet Ms, tahoma, arial, helvetica, sans-serif',
                textAlign: 'left',
                padding: '0px',
                marginTop:'-10px'

            },
            markerLabelFunction: function (categoryItem, valueItem, itemIndex, series, seriesIndex) {
                //$rootScope.errorLogMethod("chartExpandedCtrl.markerLabelFunction");
                var displayType = valueItem.displayName;
                var msg = document.createElement("div");
                dateTitle = document.createElement("span");
                boldTextBlock = document.createElement("div");
                var date = new Date(categoryItem.value.substring(0, 10));
                var weekName = convertWeekNumberToName(date.getDay());
                var monthName = convertMonthNumberToName(date.getMonth());
                var dateStr = weekName.substring(0, 3) + ', ' + monthName.substring(0, 3) + ', ' + $filter('date')((date), 'dd, yyyy');
                dateTitle.appendChild(document.createTextNode(dateStr));
                displayType = $filter('translate')('chartTile' + valueItem.displayName);
                boldTextBlock.appendChild(document.createTextNode(displayType + ":" + valueItem.value + " hours"));
                msg.appendChild(dateTitle);
                msg.appendChild(document.createElement("br"));
                msg.appendChild(boldTextBlock);
                msg.id = "chartToolTip1";
                try {
                    var divLeftX = $('#mainChartDiv')[0].offsetLeft;
                    if (($scope.isMinimize && (localStorage.pointx - divLeftX) > (650))) {
                        msg.id = "chartToolTip";
                    }
                    else if ((!$scope.isMinimize && localStorage.pointx > ($(window).width() * 9) / 10)) {
                        msg.id = "chartToolTip";
                    }
                } catch (ex) { }

                return msg;
            }
        }
        var convertWeekNumberToName = function (weekNo) {
            //$rootScope.errorLogMethod("chartExpandedCtrl.convertWeekNumberToName");
            var weekday = {
                0: $filter('translate')('lbl_FulWkDy1'), 1: $filter('translate')('lbl_FulWkDy2'), 2: $filter('translate')('lbl_FulWkDy3'), 3: $filter('translate')('lbl_FulWkDy4'), 4: $filter('translate')('lbl_FulWkDy5'), 5: $filter('translate')('lbl_FulWkDy6'), 6: $filter('translate')('lbl_FulWkDy7')
            };
            return weekday[weekNo];
        }
        var convertMonthNumberToName = function (monthNo) {
            //$rootScope.errorLogMethod("chartExpandedCtrl.convertMonthNumberToName");
            var weekMonth = {
                0: $filter('translate')('lbl_Mnth1'), 1: $filter('translate')('lbl_Mnth2'), 2: $filter('translate')('lbl_Mnth3'),
                3: $filter('translate')('lbl_Mnth4'), 4: $filter('translate')('lbl_Mnth5'), 5: $filter('translate')('lbl_Mnth6'),
                6: $filter('translate')('lbl_Mnth7'),
                7: $filter('translate')('lbl_Mnth8'), 8: $filter('translate')('lbl_Mnth9'), 9: $filter('translate')('lbl_Mnth10'),
                10: $filter('translate')('lbl_Mnth11'), 11: $filter('translate')('lbl_Mnth12')
            };
            return weekMonth[monthNo];
        }
    }

    app.controller('chartExpandedCtrl', ['$scope', 'openPopUpWindowFactory', '$modalInstance', '$timeout', 'arguments', '$rootScope', 'resizeWindowService', '$filter', '$translate', 'broadcastService','commonUtilityService', ChartExpandCtrlFun]);
}());
