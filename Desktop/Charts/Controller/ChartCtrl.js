(function () {
    var app = angular.module('MyTimeApp');
    var ctrlFun = function ($scope, sharedService, $rootScope, $filter, gridDataService, loadRevenueMonthsServices, broadcastService, commonUtilityService) {
        var chartoptions = {
            series: {
                Billable: {
                    line: {
                        weight: 2,
                        fill: {
                            color: "#00B8BF"
                        },
                        width: 2
                    },
                    marker: {
                        fill: {
                            color: "#00B8BF"
                        },
                        width: 2
                    }
                },
                Chargeable: {
                    line: {
                        weight: 2,
                        color: "#8DD5E7"
                    },
                    marker: {
                        fill: {
                            color: "#8DD5E7"
                        },
                        width: 2
                    }
                },
                Non_Billable: {
                    line: {
                        weight: 2,
                        color: "#005C7A"
                    },
                    marker: {
                        fill: {
                            color: "#005C7A"
                        },
                        width: 2
                    }
                },
                Total: {
                    line: {
                        weight: 2,
                        color: "#FFA928"
                    },
                    marker: {
                        fill: {
                            color: "#FFA928"
                        },
                        width: 2
                    }
                }
            }
        }
        //initialize the chart
        $scope.init = function () {
            $rootScope.errorLogMethod("ChartCtrl.$scope.init");
            broadcastService.updateMonthlyChart();
        }
        $scope.showExpandedChart = function () {
            $rootScope.errorLogMethod("ChartCtrl.$scope.showExpandedChart");
            var sendData = {
                chartDataObj: $scope.myDataValues,
                revStartDateCharts: $scope.revStartDateCharts,
                maxTotal: $scope.maxTotal,
                minTotal: $scope.minTotal,
                isDataAvailable: $scope.isDataAvailable,
                revEndDateCharts: $scope.revEndDateCharts
            };
            $scope.openModalCtrl = 'chartPopUp';
            sharedService.openModalPopUp('Desktop/Charts/templates/chartsExpanded.html', 'chartExpandedCtrl', sendData);
        }
        $rootScope.$on('updateMonthlyChart', function () {
            $rootScope.errorLogMethod("ChartCtrl.$rootScope.$on.updateMonthlyChart");
            createChartAfterSetDataSource();

        });
        var createChartAfterSetDataSource = function () {
            $rootScope.errorLogMethod("ChartCtrl.createChartAfterSetDataSource");
            var cDate = $filter('date')($rootScope.currentDateForCharts, "yyyy-MM-dd");
            var loginDetail = $rootScope.GetLoginDetail(false, true);
            var startDate, endDate;
            loadRevenueMonthsServices.loadRevenueMonthsChart(loginDetail.SESKEY, cDate, loginDetail.EMPLID).then(function (response) {
                $scope.revMnthRange = response.LOADREVM_OUT_OBJ.REVM_ARR;
                var revStartDate = createDate($scope.revMnthRange[0].STRTDTE);
                $scope.revStartDateCharts = createDate($scope.revMnthRange[0].STRTDTE);
                var revENdDate = createDate($scope.revMnthRange[0].ENDDTE);
                $scope.revEndDateCharts = createDate($scope.revMnthRange[0].ENDDTE);
                startDate = $filter('date')(new Date(revStartDate.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                endDate = $filter('date')(new Date(revENdDate.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                var jsonSFromloginDetail = $rootScope.GetLoginDetail(false, true);
                if (jsonSFromloginDetail)
                    gridDataService.getData(jsonSFromloginDetail.SESKEY, jsonSFromloginDetail.EMPLID, startDate, endDate, $filter('date')($rootScope.currentDateForCharts, 'yyyy-MM-dd HH:mm:ss')).then(function (data) {
                        if (data.RETTIM_OUT_OBJ.RETCD == 2) {
                            var data = {
                                RETCD: 2,
                                ERRMSG: $filter('translate')('msg_invalidSession')
                            }
                            $rootScope.sessionInvalid(data);
                        }
                        else {
                            $scope.chartsdata = JSON.parse(JSON.stringify(data.RETTIM_OUT_OBJ.TIME_ARR));
                            $scope.chartsdataTemp = JSON.parse(JSON.stringify(data.RETTIM_OUT_OBJ.TIME_ARR));
                            if ($scope.chartsdata.length <= 0) {
                                $scope.chartsdata = [];
                                $scope.chartsdataTemp = [];
                                $scope.isDataAvailable = false;
                            }
                            else {
                                $scope.isDataAvailable = true;
                            }
                        }
                        for (var d = revStartDate ; d <= revENdDate; d.setDate(d.getDate() + 1)) {
                            for (var j = 0; j < $scope.chartsdataTemp.length; j++) {
                                // var dateTemp = new Date(d.getTime() - (d.getTimezoneOffset() * 60 * 1000));
                                var dateTemp = angular.copy(d);
                                dateTemp.setHours(0, 0, 0, 0)
                                dateTemp = $filter('date')(new Date(dateTemp.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                                if (dateTemp == $scope.chartsdataTemp[j].DTE) {
                                    break;
                                }
                                else {
                                    if (j == $scope.chartsdataTemp.length - 1) {
                                        $scope.chartsdata.push({
                                            DTE: dateTemp
                                        });
                                    }

                                }

                            }

                        }
                        $scope.myDataValuesTemp = [];
                        $scope.myDataValuesDate = [];
                        $scope.myDataValuesExcludeWeekendNew = [];

                        for (var i = 0; i < $scope.chartsdata.length; i++) {
                            var computeIndex = $scope.myDataValuesDate.indexOf($scope.chartsdata[i].DTE);
                            if (computeIndex == -1)
                                $scope.myDataValuesDate.push($scope.chartsdata[i].DTE);
                            var date = $scope.chartsdata[i].DTE;
                            var Total = 0;
                            var billableVar = 0;
                            var ChargeableVar = 0;
                            var Non_BillableVar = 0;
                            if ($scope.chartsdata[i].CEP_REC == undefined) {
                                //continue;
                                $scope.myDataValuesTemp.push({
                                    Date: date, Billable: 0, Chargeable: 0,
                                    Non_Billable: 0, Total: 0
                                });

                            }
                            else {

                                if ($scope.chartsdata[i].CEP_REC.CHARBASIS == "T") {
                                    billableVar = parseFloat($scope.chartsdata[i].HRS);
                                    Total = billableVar;
                                }
                                if ($scope.chartsdata[i].CEP_REC.CHARBASIS == "C" || $scope.chartsdata[i].CEP_REC.CHARBASIS == "S") {
                                    ChargeableVar = parseFloat($scope.chartsdata[i].HRS);
                                    Total = ChargeableVar;
                                }
                                if ($scope.chartsdata[i].CEP_REC.CHARBASIS == "N") {
                                    Non_BillableVar = parseFloat($scope.chartsdata[i].HRS);
                                    Total = Non_BillableVar;
                                }
                                if (computeIndex == -1) {
                                    $scope.myDataValuesTemp.push({
                                        Date: date, Billable: billableVar, Chargeable: ChargeableVar,
                                        Non_Billable: Non_BillableVar, Total: Total
                                    });

                                }
                                else {
                                    $scope.myDataValuesTemp[computeIndex].Billable = (parseFloat($scope.myDataValuesTemp[computeIndex].Billable == undefined ? 0 : $scope.myDataValuesTemp[computeIndex].Billable) + billableVar);
                                    $scope.myDataValuesTemp[computeIndex].Chargeable = (parseFloat($scope.myDataValuesTemp[computeIndex].Chargeable == undefined ? 0 : $scope.myDataValuesTemp[computeIndex].Chargeable) + ChargeableVar);
                                    $scope.myDataValuesTemp[computeIndex].Non_Billable = (parseFloat($scope.myDataValuesTemp[computeIndex].Non_Billable == undefined ? 0 : $scope.myDataValuesTemp[computeIndex].Non_Billable) + Non_BillableVar);
                                    $scope.myDataValuesTemp[computeIndex].Total = (parseFloat($scope.myDataValuesTemp[computeIndex].Total == undefined ? 0 : $scope.myDataValuesTemp[computeIndex].Total) + Total);
                                }

                            }

                        }

                        for (var i = 0; i < $scope.myDataValuesTemp.length ; i++) {
                            if ($scope.myDataValuesTemp[i]['Billable'] == undefined)
                                delete $scope.myDataValuesTemp[i]['Billable'];
                            if ($scope.myDataValuesTemp[i]['Chargeable'] == undefined)
                                delete $scope.myDataValuesTemp[i]['Chargeable'];
                            if ($scope.myDataValuesTemp[i]['Non_Billable'] == undefined)
                                delete $scope.myDataValuesTemp[i]['Non_Billable'];
                        }
                        $scope.myDataValuesTemp.sort(function (a, b) {

                            if (a.Date > b.Date)
                                return 1
                            if (a.Date < b.Date)
                                return -1
                            return 0

                        });
                        if (!$scope.isDataAvailable) {
                            $scope.myDataValuesTemp = chartDataForEmptyMonth($scope.revMnthRange);
                        }
                        if ($rootScope.chartExcludeWkndFlag) {
                            $scope.myDataValuesExcludeWeekendNew = commonUtilityService.excludeWeekEndData($scope.myDataValuesTemp);
                            $scope.tempdatecalcMin = createDate($scope.myDataValuesExcludeWeekendNew[0].Date);
                        }
                        $scope.createCharts();

                    });
            });


        }

        $scope.firstDateSet = false;
        $scope.isDataAvailable = true;
        var resetChartSettings = function (totalHours, interval, isNegHrs, valMax, ValMin) {
            countPeriods = commonUtilityService.calculateTotalYPointsToDraw(totalHours, interval, isNegHrs, valMax);
            var settings = commonUtilityService.updateChartConfig(interval, countPeriods, isNegHrs, valMax, ValMin, 4);
            minChartYPoint = settings[0];
            maxChartYPoint = settings[1];
            countPeriods = settings[2];
        }
        var roundBy = 10;
        var getIntervalForSmallValue = function (totalHours) {
            var interval = 0;
            //totalHours<.1
            if (totalHours <= 0.01) {
                roundBy = 1000;
                interval = .005;
            }
            else if (totalHours <= 0.03) {
                roundBy = 100;
                interval = .01;
            }
            else if (totalHours <= 0.06) {
                roundBy = 100;
                interval = .02;
            }
            else if (totalHours <= 0.09) {
                roundBy = 100;
                interval = .03;
            }
                //totalHours<.3
            else if (totalHours <= 0.16) {
                roundBy = 100;
                interval = .05;
            }
            else if (totalHours <= 0.4) {
                roundBy = 10;
                interval = 0.1;
            }
            return interval;
        }
        $scope.hoursRoundingMethod = function (valMax, ValMin) {
            $rootScope.errorLogMethod("ChartCtrl.$scope.hoursRoundingMethod");

            var isNegHrs = false, interval = 0.5;
            minChartYPoint = 0; maxChartYPoint = 1;
            countPeriods = 3;
            var totalHours = 0;
            roundBy = 10;
            if (ValMin < 0) {
                isNegHrs = true;
                totalHours = Math.round((valMax - ValMin) * 1e12) / 1e12;
            }
            else
                totalHours = valMax;
            totalHours = (totalHours === "" ? 0 : totalHours);
            if (totalHours == 0) {
                interval = 0.5;
                resetChartSettings(0, interval, false, 0, 0);
            }
            else if (totalHours <= 0.4) {
                interval = getIntervalForSmallValue(totalHours);
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }            
            else if (totalHours <= 0.8) {
                interval = 0.2;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 2) {
                interval = 0.5;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 3) {
                interval = 1;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 6) {
                interval = 2;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 9) {
                interval = 3;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 12) {
                interval = 4;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 15) {
                interval = 5;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 18) {
                interval = 6;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 24) {
                interval = 8;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 27) {
                interval = 9;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 30) {
                interval = 10;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 36) {
                interval = 12;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 45) {
                interval = 15;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 60) {
                interval = 20;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 75) {
                interval = 25;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 90) {
                interval = 30;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 120) {
                interval = 40;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 135) {
                interval = 45;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 150) {
                interval = 50;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 180) {
                interval = 60;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 240) {
                interval = 80;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 270) {
                interval = 90;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 300) {
                interval = 100;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else if (totalHours <= 400) {
                interval = 100;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            else {
            interval = 500;
                resetChartSettings(totalHours, interval, isNegHrs, valMax, ValMin);
            }
            return interval;
        }
        var createDate = function (dteStr) {
            //$rootScope.errorLogMethod("ChartCtrl.createDate");
            if (dteStr != undefined) {
                var parts = dteStr.split("-");
                var day = parts[2].split(' ');
                return new Date(parts[0], parts[1] - 1, day[0]);
            }
            else return null;
        }
        $scope.chartsdata = [];


        /*custum tool tip*/
        var getToolTip = {
            styles: {
                background: "transparent",
                color: "#000",
                border: '1px solid #faf9f2',
                font: 'normal 11px/16px Trebuchet Ms, tahoma, arial, helvetica, sans-serif',
                textAlign: 'left',
                padding: '0px'
            },
            markerLabelFunction: function (categoryItem, valueItem, itemIndex, series, seriesIndex) {
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
                if (localStorage.pointx > 100) {
                    msg.id = "chartToolTip";
                }
                return msg;
            }
        }
        var convertWeekNumberToName = function (weekNo) {
            $rootScope.errorLogMethod("ChartCtrl.convertWeekNumberToName");
            var weekday = {
                0: $filter('translate')('lbl_FulWkDy1'), 1: $filter('translate')('lbl_FulWkDy2'), 2: $filter('translate')('lbl_FulWkDy3'), 3: $filter('translate')('lbl_FulWkDy4'), 4: $filter('translate')('lbl_FulWkDy5'), 5: $filter('translate')('lbl_FulWkDy6'), 6: $filter('translate')('lbl_FulWkDy7')
            };
            return weekday[weekNo];
        }
        var convertMonthNumberToName = function (monthNo) {
            $rootScope.errorLogMethod("ChartCtrl.convertMonthNumberToName");
            var weekMonth = {
                0: $filter('translate')('lbl_Mnth1'), 1: $filter('translate')('lbl_Mnth2'), 2: $filter('translate')('lbl_Mnth3'),
                3: $filter('translate')('lbl_Mnth4'), 4: $filter('translate')('lbl_Mnth5'), 5: $filter('translate')('lbl_Mnth6'),
                6: $filter('translate')('lbl_Mnth7'),
                7: $filter('translate')('lbl_Mnth8'), 8: $filter('translate')('lbl_Mnth9'), 9: $filter('translate')('lbl_Mnth10'),
                10: $filter('translate')('lbl_Mnth11'), 11: $filter('translate')('lbl_Mnth12')
            };
            return weekMonth[monthNo];
        }
        var clearChart = function () {
            $(".backDropChart>div").remove();
        }
        var minChartYPoint = 0; maxChartYPoint = 10;
        var countPeriods = 4;
        $scope.createCharts = function () {
            $rootScope.errorLogMethod("ChartCtrl.$scope.createCharts");
            clearChart();
            YUI().use('charts', function (Y) {
                $scope.myDataValues = $scope.myDataValuesTemp;
                var maxTotal = null;
                var minTotal = null;
                if ($scope.myDataValues.length > 0) {
                    maxTotal = $scope.myDataValues[0].Total;
                    minTotal = $scope.myDataValues[0].Total;
                }
                for (var i = 1; i < $scope.myDataValues.length ; i++) {
                    if ($scope.myDataValues[i].Total > maxTotal)
                        maxTotal = $scope.myDataValues[i].Total;
                    else if ($scope.myDataValues[i].Total < minTotal)
                        minTotal = $scope.myDataValues[i].Total;
                }
                $scope.maxTotal = maxTotal;
                $scope.minTotal = minTotal;
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
                        //labelSpacing: 2,
                        type: "numeric",
                        roundingMethod: $scope.hoursRoundingMethod(maxTotal, minTotal),
                        minimum: minChartYPoint,
                        maximum: maxChartYPoint,
                        //alwaysShowZero: true,
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
                        labelFunction: function (val) {
                            var display = "";
                            var tempdate = createDate(val);
                            if (!$scope.firstDateSet) {
                                $scope.firstDateSet = true;
                                display = ($scope.revStartDateCharts.getMonth()) + 1 + "/" + $scope.revStartDateCharts.getDate();
                            }
                            else {
                                if (tempdate != undefined && tempdate != null && tempdate.getDay() == $scope.revStartDateCharts.getDay()) {
                                    display = (tempdate.getMonth() + 1) + "/" + tempdate.getDate();

                                }
                                else if ($rootScope.chartExcludeWkndFlag) {
                                    if (tempdate != undefined && tempdate != null && tempdate.getDay() == $scope.tempdatecalcMin.getDay()) {
                                        display = (tempdate.getMonth() + 1) + "/" + tempdate.getDate();
                                        $scope.tempdatecalcMin = new Date(tempdate.valueOf())
                                    }
                                }
                            }
                            return display;
                        },
                    }
                };
                $scope.styleDef = {
                    series: chartoptions.series
                }
                if ($rootScope.chartExcludeWkndFlag) {
                    if ($rootScope.isLineClicked == true) {
                        $("#mychart").css("display", "none");
                        $("#mychart1").css("display", "none");
                        $("#mychartExcludeWeekend").css("display", "inline-table");
                        $("#mychartBarExcludeWeekend").css("display", "none");
                        if ($("#mychartExcludeWeekend>div").length > 0) $("#mychartExcludeWeekend>div").remove();
                        $scope.mychart = new Y.Chart({
                            dataProvider: $scope.myDataValuesExcludeWeekendNew,
                            render: "#mychartExcludeWeekend",
                            axes: $scope.myAxes,
                            categoryKey: "Date",
                            styles: $scope.styleDef,
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
                        $("#mychart").css("display", "none");
                        $("#mychart1").css("display", "none");
                        $("#mychartExcludeWeekend").css("display", "none");
                        $("#mychartBarExcludeWeekend").css("display", "inline-table");
                        if ($("#mychartBarExcludeWeekend>div").length > 0) $("#mychartBarExcludeWeekend>div").remove();
                        var dataForChart=commonUtilityService.hideZeroOnYUIChart($scope.myDataValuesExcludeWeekendNew);
                        var mychart = new Y.Chart({
                            dataProvider: dataForChart,
                            render: "#mychartBarExcludeWeekend",
                            axes: $scope.myAxes,
                            categoryKey: "Date",
                            styles: $scope.styleDef,
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
                else {
                    if ($rootScope.isLineClicked == true) {
                        $("#mychart").css("display", "inline-table");
                        $("#mychart1").css("display", "none");
                        $("#mychartExcludeWeekend").css("display", "none");
                        $("#mychartBarExcludeWeekend").css("display", "none");
                        if ($("#mychart>div").length > 0) $("#mychart>div").remove();
                        $scope.mychart = new Y.Chart({
                            dataProvider: $scope.myDataValues,
                            render: "#mychart",
                            axes: $scope.myAxes,
                            categoryKey: "Date",
                            styles: $scope.styleDef,
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
                        $("#mychart").css("display", "none");
                        $("#mychart1").css("display", "inline-table");
                        $("#mychartExcludeWeekend").css("display", "none");
                        $("#mychartBarExcludeWeekend").css("display", "none");
                        if ($("#mychart1>div").length > 0) $("#mychart1>div").remove();                        
                        var dataForChart=commonUtilityService.hideZeroOnYUIChart($scope.myDataValues);
                        var mychart = new Y.Chart({
                            dataProvider: dataForChart,
                            render: "#mychart1",
                            axes: $scope.myAxes,
                            categoryKey: "Date",
                            styles: $scope.styleDef,
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



                Y.on("click", function (e) {
                    //execute click event only once if toggling from line graph to bar graph
                    if ($rootScope.isLineClicked) {
                        if ($rootScope.chartExcludeWkndFlag) {
                            $("#mychart").css("display", "none");
                            $("#mychart1").css("display", "none");
                            $("#mychartExcludeWeekend").css("display", "none");
                            $("#mychartBarExcludeWeekend").css("display", "inline-table");
                            $rootScope.isLineClicked = false;
                            if ($("#mychartBarExcludeWeekend>div").length == 0) {
                                var dataForChart = commonUtilityService.hideZeroOnYUIChart($scope.myDataValuesExcludeWeekendNew);
                                var mychart = new Y.Chart({
                                    dataProvider: dataForChart,
                                    render: "#mychartBarExcludeWeekend",
                                    axes: $scope.myAxes,
                                    categoryKey: "Date",
                                    styles: $scope.styleDef,
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
                        else {
                            $("#mychart").css("display", "none");
                            $("#mychart1").css("display", "inline-table");
                            $("#mychartExcludeWeekend").css("display", "none");
                            $("#mychartBarExcludeWeekend").css("display", "none");
                            $rootScope.isLineClicked = false;
                            if ($("#mychart1>div").length == 0) {
                                var dataForChart = commonUtilityService.hideZeroOnYUIChart($scope.myDataValues);
                                var mychart = new Y.Chart({
                                    dataProvider: dataForChart,
                                    render: "#mychart1",
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
                    }
                }, "#barType");

                Y.on("click", function (e) {
                    //execute click event only once if toggling from bar graph to line graph 
                    if (!$rootScope.isLineClicked) {
                        if ($rootScope.chartExcludeWkndFlag) {
                            $("#mychart").css("display", "none");
                            $("#mychart1").css("display", "none");
                            $("#mychartExcludeWeekend").css("display", "inline-table");
                            $("#mychartBarExcludeWeekend").css("display", "none");
                            $rootScope.isLineClicked = true;
                            if ($("#mychartExcludeWeekend>div").length == 0)
                                $scope.mychart = new Y.Chart({
                                    dataProvider: $scope.myDataValuesExcludeWeekendNew,
                                    render: "#mychartExcludeWeekend",
                                    axes: $scope.myAxes,
                                    categoryKey: "Date",
                                    styles: $scope.styleDef,
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
                            $("#mychart1").css("display", "none");
                            $("#mychartExcludeWeekend").css("display", "none");
                            $("#mychartBarExcludeWeekend").css("display", "none");
                            $("#mychart").css("display", "inline-table");
                            $rootScope.isLineClicked = true;
                            if ($("#mychart>div").length == 0)
                                $scope.mychart = new Y.Chart({
                                    dataProvider: $scope.myDataValues,
                                    render: "#mychart",
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
                                    },
                                });
                        }
                    }
                }, "#lineType");
            });
        }



        var chartDataForEmptyMonth = function (revMnthRange) {
            $rootScope.errorLogMethod("ChartCtrl.chartDataForEmptyMonth");
            var myDataValuesTemp = [];
            var revStartDateNew = createDate(revMnthRange[0].STRTDTE);
            var revENdDateNew = createDate(revMnthRange[0].ENDDTE);
            for (var d = revStartDateNew ; d <= revENdDateNew; d.setDate(d.getDate() + 1)) {
                //var dateTemp = new Date(d.getTime() - (d.getTimezoneOffset() * 60 * 1000));
                var dateTemp = angular.copy(d);
                dateTemp.setHours(0, 0, 0, 0)
                dateTemp = $filter('date')(new Date(dateTemp.valueOf()), 'yyyy-MM-dd HH:mm:ss');
                myDataValuesTemp.push({
                    Date: dateTemp, Billable: "", Chargeable: "", Non_Billable: "", Total: ""
                });
            }
            return myDataValuesTemp;
        }
    }
    app.controller('ChartCtrl', ['$scope', 'openPopUpWindowFactory', '$rootScope', '$filter', 'gridDataService', 'loadRevenueMonthsServices', 'broadcastService', 'commonUtilityService', ctrlFun]);
}());
