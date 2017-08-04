angular.module('Search', ['ui.select', 'ngSanitize'])
.controller('SearchCtrl', function ($scope) {
    $scope.cpecode = {};
    $scope.cpeListData = [];
    $scope.cpecodeList = [
        { code: 'A', description: 'df' },
        { code: 'AB', description: 'asd' },
        { code: 'B', description: 'sdsd' },
        { code: 'C', description: 'dfdsfdf' },
        { code: 'D', description: 'ddfdfwef' },
        { code: 'E', description: 'ddssdgfghf' }
    ];
    $scope.cpeList = function () {
        return
        $scope.cpecodeList;
    }

    $scope.refreshResults = function ($select) {
        var search = $select.search;
            alert(search);
            if (search.length > 0) {

                                    $scope.cpeListData = $scope.cpecodeList;
                                }
                                else
                                {
                                    $scope.cpeListData = [];
            }
            $select.items = cpeListData;
    }

    //function refreshResults($select) {
    //    alert('wewe')
    //    //var search = $select.search;
    //    //alert(search);
    //    //if (search.length > 0) {
    //    //                        scope.cpeListData = scope.cpecodeList;
    //    //                    }
    //    //                    else
    //    //                    {
    //    //                        scope.cpeListData = [];
    //    //}
    //    //$select.items = cpeListData;

    //}
})
;
//.directive('searchAfter', function () {
//    return {
//        restrict: 'A',
//        //scope: {
//        //    elemToFocus: '@'
//        //},
//        link: function (scope, elem, attrs) {

          
//           // var elementToFocus = document.getElementById(scope.elemToFocus);

//            elem.on('keyup', function () {
//                var search = $select.search;
//                alert(search)
//                //if (search.length > 0 ) {
//                //    scope.cpeListData = scope.cpecodeList;
//                //}
//                //else
//                //{
//                //    scope.cpeListData = [];
//                //}
//            });
//        }
//    };
//});