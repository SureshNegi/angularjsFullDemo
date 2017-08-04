angular.module('MyTimeApp')
.directive('draggable', function ($document) {
    "use strict";
    return function (scope, element) {
        var startX = 0,
          startY = 0,
          x = 500,
          y = 500;
        element.css({
            position: 'fixed',
            cursor: 'move'
        });

        element.on('mousedown', function (event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });


        function mousemove(event) {
            y = (event.screenY - startY);
            x = (event.screenX - startX);
            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }
        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    };

})
//submit form on enter key press
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });

        element.on('click', function (event) {
            if (attrs.ngEnter == "filterGridData()") {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    }
})
.directive('textBoxFormatter', function () {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function (scope, element, attrs) {
            //  angular.element($(element).find("input:text")[0]).mask("?******-999-999");

            angular.element($(element).find("input:text")[0]).change(function (event) {
                //  alert(scope.$select.search);
                scope.searchString = scope.$select.search;

                angular.element(document.getElementById('searchString'))[0].value = scope.searchString;
                //var keycode = (event.keyCode ? event.keyCode : event.which);
                //var value = scope.$select.search;
                //var isPropagate = true;
                //switch (value.length) {
                //    case 0:
                //    case 1:
                //    case 2:
                //    case 3:
                //    case 4:
                //    case 5:
                //        break;
                //    case 6:
                //        if (keycode >= 48 && keycode <= 57) {
                //            event.preventDefault();

                //            scope.$select.search = scope.$select.search + '+';
                //            alert(scope.$select.search);    
                //            isPropagate = false;
                //        }
                //        else {

                //            if (keycode === 109 || keycode === 189) {
                //                break;
                //            }
                //            else
                //                isPropagate = false;
                //        }
                //}
                //if (!isPropagate) {
                //    event.preventDefault();
                //}
            }
            );
        }
    };
})

.directive('cepFormatter', function () {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function (scope, element, attrs) {
            $(element).mask("?******-999-999");
            $(element).change(function (event) {
                //alert('df');

            });
        }
    };
})
 .directive('designateList', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
                        // responsible for registering DOM listeners as well as updating the DOM
            link: function (scope, element, attrs) {
                var template = "<input ng-class=\"designateConfig.displayName != '' ? 'textBold' : ''\" ng-model-options=\"{debounce: 500}\" ng-change=\"checkDesignateInput($event)\"  id=\"designateSrchInput\" data-ng-trim=\"false\"     ng-model=\"designateConfig.displayName\"  class=\"hideIEClearBtn designateText\" type=\"text\" ng-attr-placeholder={{designateConfig.placeHolderVal}} ng-click=\"$event.stopPropagation()\">" +
                     "<button class=\"cepTxtCross\" ng-show=\"designateConfig.displayName.length>0\" ng-mousedown=\"clearDesignateSrch($event)\"> x</button>" +
                     "<button id=\"designateDrpBtn\" class=\"designateBtn\" >&nbsp;</button>" +
                     "<ul class=\"designatedropdown\" ng-if=\"designateConfig.showBecomeDesignate\" id=\"dList\">" +
                     "<li ng-attr-id=\"{{ x.EMPLID }}\" ng-mouseover=\"designateItemMouseOver($event)\" ng-click=\"becomeDesignateOf(x)\" ng-class=\"{'selected': $first}\" ng-repeat=\"x in designateConfig.becomeDesignateList track by x.EMPLID\"  >{{ ::x.UIDISPNAME}}</li>" +
                     "</ul>";
                // Clear element contents
                element.empty();
                var dropdownElement = angular.element(template);
                var inputElement = $(dropdownElement[0]);
                var btnDropDwn = $(dropdownElement[2]);
                var ulItem = $(dropdownElement[3]);
                inputElement.on('focus', function (event) {
                    this.select();
                    event.stopPropagation();
                });
               
                btnDropDwn.on('click', function (event) {
                    event.stopPropagation();
                    scope.$apply(function () {
                        scope.designateDropDownClick();
                    });
                });
                inputElement.on('keydown', function (event) {
                    //inputElement.addClass("textBold");
                    scope.$apply(function () {
                        designateInputKeyDown(event);
                    });
                });

                function designateInputKeyDown(e) {
                    //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.designateInputKeyDown");
                    // enter key press
                    if (e.keyCode == 13) {
                        if (scope.designateConfig.showBecomeDesignate) {
                            var selected = $(".designatedropdown li.selected");
                            var selectedId = angular.element(selected).attr('id');
                            if (selectedId !== undefined) {
                                var designate = scope.allDesignateOfList.filter(function (item) {
                                    return (item.EMPLID === selectedId)
                                });
                                if (designate.length === 1) {
                                    scope.designateConfig.showBecomeDesignate = false;
                                    scope.becomeDesignateOf(designate[0]);
                                }
                            }
                        }

                    }
                    if (scope.designateConfig.becomeDesignateList.length > 1) {
                        if (e.keyCode == 40) { // down
                            var selected = $(".designatedropdown li.selected");
                            $(".designatedropdown li").removeClass("selected");
                            if (selected.next().length == 0) {
                                selected.siblings().first().addClass("selected");
                            } else {
                                selected.next().addClass("selected");
                            }
                        }
                        if (e.keyCode == 38) { // up
                            var selected = $(".designatedropdown li.selected");
                            $(".designatedropdown li").removeClass("selected");
                            if (selected.prev().length == 0) {
                                selected.siblings().last().addClass("selected");
                            } else {
                                selected.prev().addClass("selected");
                            }
                        }
                    }
                }


                //var childScope = scope.$new(true);
                // Compile template against child scope                
                $compile(dropdownElement)(scope);
                
                scope.checkDesignateInput = function (event) {
                    //$rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.checkDesignateInput");
                    if (scope.allDesignateOfList.length > 0) {
                        $('#loadingWidgetDesktop').show();
                        scope.designateConfig.showBecomeDesignate = true;
                        var list =[];
                        if (scope.designateConfig.displayName !== null && scope.designateConfig.displayName.trim() != "" && scope.allDesignateOfList.length > 0) {
                            var input = scope.designateConfig.displayName.toLowerCase();
                            var len = input.length;
                            list = scope.allDesignateOfList.filter(function (item) {
                                //var itemSubStr = item.UIDISPNAME.lTrim().substring(0, len).toLowerCase();
                                //return (itemSubStr == input && item.EMPLID !== scope.designateConfig.designateOfEmp.EMPLID)
                                return (item.LwrName.indexOf(input, 0) === 0)
                        });
                    }

                        scope.designateConfig.becomeDesignateList = list.slice(0, 100);
                        if (list.length == 0) {
                            scope.designateConfig.showBecomeDesignate = false;
                    }
                        $('#loadingWidgetDesktop').hide();
                }
            }
                scope.designateDropDownClick = function () {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.designateDropDownClick");
                    angular.element('#designateSrchInput').focus();
                    //scope.designateConfig.showBecomeDesignate = true;
                    //if (scope.allDesignateOfList.length > 0) {
                    //    var liItems="";
                    //    var x = scope.allDesignateOfList;
                    //    var cls = "selected";
                    //    for (var i = 0; i < 2000; i++) {
                    //        liItems = liItems + "<li  id=" + x[i].EMPLID + " ng-mouseover=\"designateItemMouseOver($event)\" ng-click=\"becomeDesignateOf(x[i])\" class='" + cls + "' >" + x[i].UIDISPNAME + "</li>";
                    //        cls = "";
                    //    }

                    //    var temp = $compile(liItems)(scope);
                    //    angular.element(document.getElementById('dList')).append(liItems);


                    //}
                    if (scope.allDesignateOfList.length > 0) {
                        scope.designateConfig.showBecomeDesignate = !scope.designateConfig.showBecomeDesignate;
                        if (scope.designateConfig.showBecomeDesignate) {
                            if (scope.designateConfig.displayName.trim() == "") {
                                scope.designateConfig.displayName = "";
                        }
                            if (scope.designateConfig.becomeDesignateList.length != scope.allDesignateOfList.length) {
                                bindDesignateDropDown();
                        }
                    }
                }
            }
                var bindDesignateDropDown = function () {
                    $rootScope.errorLogMethod("DailyTimeDesktopGridCtrl.$scope.bindDesignateDropDown");
                    var list = scope.allDesignateOfList.filter(function (item) {
                        return (item.EMPLID !== scope.designateConfig.designateOfEmp.EMPLID)
                });
                    scope.designateConfig.becomeDesignateList = list.slice(0, 100);
            }
                element.append(dropdownElement);
            }
        };
    }])
.directive('pagingDirective', function ($compile, $http) {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function (scope, element, attrs) {

            var tpl,

                url = 'templates/dirPagination.tpl.html';
            if (!tpl) {
                $http.get(url).then(function (response) {
                    tpl = $compile(response.data)(scope);
                    angular.element(document.getElementById('space-for-buttons')).append(tpl);
                });
            }


        }
    };
})
.directive('toPrecision', function () {
    return {
        replace: false,
        restrict: 'A',
        link: function (scope, element) {
            var e = angular.element(element);
            e.on('keypress', function (key) {
                try {
                    //getting key code of pressed key
                    var keycode = (key.which) ? key.which : key.keyCode;
                    if (keycode == 13) {
                        // $(this).blur();                    
                        return true;
                    }
                    if (!(keycode == 8 || keycode == 46 || keycode == 45) && (keycode < 48 || keycode > 57)) {
                        return false;
                    }
                    else {

                        //if ((keycode == 46 || keycode == 45) && (e[0].validity.badInput))
                        //    return false;
                        if (keycode == 45) {
                            if (e.val() != '') {
                                angular.element(document.getElementById('oldValue'))[0].value = e.val();
                            }

                        }
                        if (keycode == 46) {
                            if (e.val().indexOf('.') != -1)
                                return false;
                        }
                        if (keycode >= 48 || keycode <= 57) {
                            //var v = String(e.val()).split('.');
                            //if (v[0].length > 1) {
                            if ((String(e.val()).split('.')[0].length > 15)) {
                                return false;
                            }
                        }

                        //var v = String(e.val()).split('.');
                        //if (v.length > 1) {
                        //    if ((String(e.val()).split('.')[1].length > 1) && !(keycode == 8 || keycode == 46))
                        //        return false;
                        //}


                    }

                    return true;
                } catch (err) { console.log(err.message); }
            });

            e.on('input', function () {

                if ((e[0].validity.badInput)) {
                    var val = angular.element(document.getElementById('oldValue')).val();
                    if (!isNaN(parseFloat(val)) && (val != null)) {
                        angular.element(document.getElementById('oldValue'))[0].value = null;
                        e.val(val);
                    }
                }


                var n = e.val(); //parseFloat(e.val());
                if (String(n).split('.').length > 1) {
                    if (parseInt(n, 10) !== n && String(n).split('.')[1].length > 2) {
                        n = n.toString()
                        n = n.slice(0, (n.indexOf(".")) + 3);
                        Number(n);
                        e.val(n);
                    }
                }
            });



        }
    }
})
.directive('checkKeyPress', function () {
    return {
        replace: false,
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.ctrlID = attrs.ctrlId;
            scope.dvID = attrs.dvId;
            var e = angular.element(document.getElementById(scope.dvID));
            e.on('keypress', function (key) {
                var keycode = (key.which) ? key.which : key.keyCode;
                if (keycode == 13) {
                    if (!$('#' + scope.ctrlID).attr('disabled')) {
                        var isCEP = localStorage.getItem('cepFocus');
                        if (isCEP == null || isCEP == "0") {
                            localStorage.setItem('enterPress', "1");
                            $('#' + scope.ctrlID).trigger('click');
                        }
                        return false;
                    }
                }
            });
        }
    }
})

.directive('focusMe', function ($timeout, $parse) {
    return {

        link: function (scope, element, attrs) {
            var e = angular.element(element);
            e.on('touchstart', function (event) {
                $(this).focus();
                event.preventDefault();
                event.stopPropagation();
                //focused = $(this);
            });
        }
    };
})
.directive('autoFocus', function ($timeout) {
    return {
        scope: { trigger: '=isFocus' },
        link: function (scope, element, attrs) {
            scope.trigger = attrs.isFocus;
            var e = angular.element(element);
            scope.$watch('trigger', function (value) {
                if (value === true) {
                    $timeout(function () { e.trigger('focus'); }, 1000)
                    scope.trigger = false;
                }
            });

            //e.on('mousedown', function () {
            //    alert(attrs.isValidCep);
            //});
        }
    };
})
 .directive('focusDrp', function ($timeout, $parse) {
     return {

         link: function (scope, element, attrs) {
             var e = angular.element(element);
             e.on('touchstart', function (event) {
                 $(this).trigger('click');
                 event.stopPropagation();

             });
         }
     };
 })
 .directive('drpChange', function ($timeout, $parse) {
     return {
         link: function (scope, element, attrs) {
             var e = angular.element(element);
             e.on('change', function (event) {
                 $(this).trigger('blur');
                 event.stopPropagation();
             });
         }
     };
 })

.directive('focusDesc', function ($timeout, $parse) {
    return {

        link: function (scope, element, attrs) {
            var e = angular.element(element);
            e.on('touchstart', function (event) {
                angular.element(document.getElementById('txthidden')).val(false);
                //$(this).focus();
            });
        }
    };
})
.directive('dayTab', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var e = angular.element(element);
            e.on('click', function (event) {
                if (e.hasClass('day_')) {
                    $(".tab1").css("display", "block");
                    $(".tab2").css("display", "none");
                }
                else {
                    $(".tab1").css("display", "none");
                    $(".tab2").css("display", "block");
                }
            });
        }
    };
})
.directive('rightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.rightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
})
.directive('executeOnKey', function ($rootScope, $document) {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            $('body').on('keydown', function (evt) {                
                var cls = angular.element(window.document.activeElement).hasClass('hrsTxt');
                if (evt.keyCode == 8) {
                    if ($(".modal").css("display") == "block") {
                        if ((angular.element(window.document.activeElement).attr('type') != "text" || angular.element(window.document.activeElement).attr('readonly') == 'readonly') && !cls)
                            evt.preventDefault();
                    }
                }
                if (((angular.element(window.document.activeElement).attr('type') != "text") || evt.shiftKey) && (evt.ctrlKey || evt.shiftKey || evt.keyCode == 27 || evt.keyCode == 16)) {
                    scope.$apply(function () {
                        if ((angular.element(window.document.activeElement).attr('type') != "text") && (angular.element(window.document.activeElement).attr('type') != "password") && !cls) {
                            if ($(".modal").css("display") != "block") {
                                if (evt.keyCode == 27 || evt.keyCode == 16) {
                                    evt.preventDefault();
                                }
                                if (evt.shiftKey)
                                    $rootScope.shiftFlag = true;
                                if (evt.ctrlKey)
                                    $rootScope.ctrlFlag = true;
                                if (evt.keyCode === 67 && evt.ctrlKey) {
                                    scope.copyRecords();
                                }
                                else if (evt.keyCode === 86 && evt.ctrlKey && !evt.altKey) {
                                    //if (!$rootScope.newEntryOpened)
                                    scope.pasteByCtrlClick();
                                }

                                else if (evt.keyCode === 86 && evt.ctrlKey && evt.altKey) {
                                    if (scope.isDailyMode)
                                        scope.pasteAdvance(scope.isDailyMode);
                                }

                                    //else if (evt.keyCode === 46 && !evt.ctrlKey) {
                                    //    if (!$rootScope.newEntryOpened) {
                                    //        scope.deleteByRightClick();
                                    //    }

                                    //}
                                else if (evt.keyCode === 78 && evt.ctrlKey) {
                                    evt.preventDefault();
                                    scope.openNewEntryWind(scope.currentDate, scope.currentDate, null);
                                }
                            }
                        }
                        else {
                            if (evt.shiftKey)
                                $rootScope.shiftFlag = true;
                        }
                    });
                }
                evt.stopPropagation();
            })
            scope.$eval(attrs.executeOnKey);
        }
    }


})

    .directive('executeCalOnKey', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {
                $('body').on('keydown', function (evt) {
                    var ctrlType = angular.element(window.document.activeElement).attr('type');
                    var ctrlTagName = window.document.activeElement === null ? "Z" : window.document.activeElement.tagName;
                    if (ctrlTagName == undefined || ctrlTagName == null)
                        ctrlTagName = "Z";
                    if (($(".modal").css("display") != "block" || ($rootScope.pasteAdvancePopup && $("#alertDivDesktop").css("display") != "block")) && ctrlType != "text" && ctrlType != "number" && ctrlTagName != "textarea" && (evt.ctrlKey || evt.shiftKey || evt.keyCode == 32) && localStorage.isReportPopUpOpen == "false") {
                        scope.$apply(function () {                           
                            if (evt.ctrlKey)
                                $rootScope.ctrlFlag = true;
                            if (evt.shiftKey && $rootScope.pasteAdvancePopup) {
                                $rootScope.shiftFlagAdvnce = true;
                                evt.preventDefault();
                            }
                            if (evt.keyCode === 39 && evt.ctrlKey) {
                                if (!$rootScope.pasteAdvancePopup)
                                    scope.move("1");
                                else
                                    scope.moveShrtKt("1", "");
                            }
                            else if (evt.keyCode === 37 && evt.ctrlKey) {
                                if (!$rootScope.pasteAdvancePopup)
                                    scope.move("-1");
                                else
                                    scope.moveShrtKt("-1", "");
                            }
                            else if (evt.keyCode === 38 && evt.ctrlKey) {
                                if (!$rootScope.pasteAdvancePopup)
                                    scope.yearUp();
                                else
                                    scope.yearUpCal();
                            }
                            else if (evt.keyCode === 40 && evt.ctrlKey) {
                                if (!$rootScope.pasteAdvancePopup)
                                    scope.yearDown();
                                else
                                    scope.yearDownCal();
                            }
                            else if (evt.keyCode === 32) {
                                evt.preventDefault();
                                if (!$rootScope.pasteAdvancePopup)
                                    scope.todayNew();
                                else {
                                    scope.pasteadvTodayDate();
                                }
                            }
                        });
                    }
                })
                scope.$eval(attrs.executeCalOnKey);
            }
        }


    })

     .directive('executeSaveOnKey', function ($rootScope) {
         return {
             restrict: 'A',
             link: function (scope, el, attrs) {
                 $('body').on('keydown', function (evt) {
                     if (evt.keyCode == 27 || evt.ctrlKey) {
                         console.log(evt.keyCode + " -- " + evt.ctrlKey);
                         scope.$apply(function () {

                             if (evt.ctrlKey)
                                 $rootScope.ctrlFlag = true;
                             if (evt.keyCode == 27) {
                                 evt.preventDefault();
                             }
                             if (evt.keyCode === 83 && evt.ctrlKey) {
                                 evt.preventDefault();
                                 scope.saveTE();
                             }

                         });
                     }
                 })
                 scope.$eval(attrs.executeSaveOnKey);
             }
         }


     })



.directive('jmDpRefreshView', function () {
    var noop = function () { };
    var refreshDpOnNotify = function (dpCtrl) {
        return function () {
            dpCtrl.refreshView();

        };
    };
    return {
        require: 'uib-datepicker',
        link: function (scope, elem, attrs, dpCtrl) {
            var refreshPromise = scope[attrs.jmDpRefreshView];
            refreshPromise.then(noop, noop, refreshDpOnNotify(dpCtrl));
        }
    };
})
.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
})

//.directive('decimalNumbersOnly', function() {
//    return {
//        require : 'ngModel', link : function(scope, element, attrs,  modelCtrl) {
//            modelCtrl.$parsers.push(function(inputValue) {
//                if (inputValue == undefined) {
//                    return ''; 
//                }
//                var transformedInput = inputValue.replace(/[a-z!`~@#$%^&*()_+\=\[\]{};':"\\|,<>\/?]/g, '');                
//                var arr = transformedInput.split('');
//                count = 0; 
//                for ( var i = 0; i < arr.length; i++) {
//                    if (arr[i] == '.') {
//                        count++; 
//                    }
//                }               
//                while (count > 1) {
//                    for ( var i = 0; i < arr.length; i++) {
//                        if (arr[i] == '.') {
//                            arr[i] = '';
//                            count = 0;
//                            break;
//                        }
//                    }
//                }               
//                transformedInput = arr.toString().replace(/,/g, '');

//                if (transformedInput != inputValue) {
//                    modelCtrl.$setViewValue(transformedInput);
//                    modelCtrl.$render();
//                }
//                return transformedInput;
//            });
//        }
//    };
//})
//select the input/textarea text on focus
.directive('selectTxtOnFocus', ['$window', function ($window) {
    // Linker function
    return function (scope, element, attrs) {
        element.bind('focus', function () {
            this.select();
        });
        element.bind('click', function (event) {

            event.stopPropagation();
        });
    };
}])
 .directive('liMouseOver', function () {
     return {
         link: function (scope, element, attrs) {
             //element.bind('wheel', function () {
             //    $(attrs.pId + ">li").removeClass(attrs.activeCls);
             //    //$(this).parent().children().removeClass(attrs.activeCls);
             //    $(this).addClass(attrs.activeCls);
             //});
             element.bind('mouseover', function () {
                 $(attrs.pId + ">li").removeClass(attrs.activeCls);
                 //$(this).parent().children().removeClass(attrs.activeCls);
                 $(this).addClass(attrs.activeCls);
             });

         }
     }
 })
.directive('empPreference', function () {
    return {
        template: '<div class="listingDescInner"><div  style="background-color:#fff;width:284px; height:135px;" id="prefGrid" ui-grid="gridPrefOptions" class="grid" ui-grid-move-columns ui-grid-resize-columns ui-grid-edit ui-grid-cellNav ui-grid-grouping ui-grid-selection>' +
                   '</div><button type="button" class="reportingBtn prefBtn" ng-click="btnSavePreferenece()">{{\'btn_Save\'|translate}}</button></div>'
    };
})
.directive('cstmLayout', function () {
    return {
        template: '<div class="listingDescInner" ><div  style="background-color:#fff;width:284px; height:135px;" id="cstmGrid" ui-grid="gridCstmLayoutOptions" class="grid" ui-grid-move-columns ui-grid-resize-columns ui-grid-edit ui-grid-cellNav ui-grid-grouping ui-grid-selection>' +
                   '<div style="top:42px;" class="gridblankdata" ng-if="!gridCstmLayoutOptions.data.length"><span translate="msg_noCstmLayout"></span></div></div></div>'
    };
})
.filter('decimal', function () {
    return function (input) {
        return parseFloat(input).toFixed(2);
    };
})
.directive('replace', function () {
    return {
        require: 'ngModel',
        scope: {
            regex: '@replace',
            with: '@with'
        },
        link: function (scope, element, attrs, model) {
            model.$parsers.push(function (val) {
                if (!val) { return; }
                var regex = new RegExp(scope.regex);
                var replaced = val.replace(regex, scope.with);
                if (replaced !== val) {
                    model.$setViewValue(replaced);
                    model.$render();
                }
                return replaced;
            });
        }
    };
})





