(function () {
    'use strict';
    angular.module('preferenceManage', ['ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.moveColumns','ui.grid.saveState']);
   
})();
(function () {
    angular.module('preferenceManage').controller('empPrefController', ['$scope', 'uiGridConstants', '$timeout', function (scope, uiGridConstants, $timeout) {
        var ctrl = this;
        ctrl.gridOptions = {
            showHeader: true,
            enableColumnMenus: false,
            rowHeight: 19,
            enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
            showGridFooter: false,
            showColumnFooter: false,
            enableGridMenu: true,
            enableCellSelection: true,
            enableCellEditOnFocus: true,
            enableFiltering: false,
            enableRowSelection: true,
            treeRowHeaderAlwaysVisible: false,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: true,
            gridFooterTemplate: '<div></div>',
            columnDefs:gridColumnDefs,
            canSelectRows: false,
            onRegisterApi: function (gridApi) {
                scope.gridApi = gridApi;
            },
           // rowTemplate: "<div ng-dblclick=\"grid.appScope.onGridRowDblClick(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

        };

        var gridColumnDefs = [
            {
                enableColumnMoving: false, name: 'name', sort: { direction: uiGridConstants.ASC, priority: 0, }, suppressRemoveSort: true, field: 'ICRTCD', enableHiding: false, enableAgg: false, headerCellClass: 'ICCodeHeader', groupingShowAggregationMenu: false, enableColumnResizing: false, headerCellClass: 'activityHeader', width: '20%', displayName: 'name', maxWidth: '55', enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>'
            },
                 {
                     enableColumnMoving: false,  name: 'value', field: 'DES', suppressRemoveSort: true, enableHiding: false, enableAgg: false, headerCellClass: 'ICDescHeader', groupingShowAggregationMenu: false, enableColumnResizing: false, displayName: $filter('translate')('lbl_val'), width: '70%', enableCellEdit: false, cellTemplate: '<span>{{COL_FIELD}}</span>'
                 },
          
        ]
        scope.init1 = function () {
            var data=[{ name: 'View(Default)', value: 'Weekly' }, { name: 'Policy E-mail Preferences', value: 'Daily' }];
            $timeout(function () { ctrl.gridOptions.data = data });
            //alert(JSON.stringify(data));
        }
        
    }])
})();
(function () {
    // Register `managePreference` directive, along with its associated controller and template
    angular.module('preferenceManage')
    .directive('managePreference', function ($parse) {
        //define the directive object
        var directive = {};

        //restrict = E, signifies that directive is Element directive
        directive.restrict = 'E';

        //template replaces the complete element with its text. 
        directive.templateUrl = "Desktop/Preference/preference-template.html";
        directive.controller = 'empPrefController';
        directive.controllerAs = '$select';
        //compile is called during application initialization. AngularJS calls it once when html page is loaded.
        //directive.compile = function(element, attributes) {
        //    element.css("border", "1px solid #cccccc");

        //    //linkFunction is linked with each element with scope to get the element specific data.
        //    var linkFunction = function($scope, element, attributes) {
        //        element.html("Student: <b>"+$scope.student.name +"</b> , Roll No: <b>"+$scope.student.rollno+"</b><br/>");
        //        element.css("background-color", "#ff00ff");
        //    }
        //    return linkFunction;
        //}
        return directive;
       
    })
    
})();

   