angular.module('globalModule', []).config(function ($httpProvider) {
    $rootScope.myTimeUrl = "abc";
    //This piece of code show/hide the ajax loading 
    //animation in case of the server side calls.
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                if ($http.pendingRequests.length < 1) {
                    $('#loadingWidget').hide();
                    $('#loadingWidgetDesktop').hide();
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                if ($http.pendingRequests.length < 1) {
                    $('#loadingWidget').hide();
                    $('#loadingWidgetDesktop').hide();
                }
                return $q.reject(response);
            }

            return function (promise) {
                $('#loadingWidget').show();
                $('#loadingWidgetDesktop').show();
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);

    // register the interceptor via an anonymous factory
    $httpProvider.responseInterceptors.push(function ($q) {
        return function (promise) {
            promise.then(function (success) { }, function (error) {
                // if it's a 5XX errorcode then only display alert
                if (error.status >= 500 && error.status < 600) {
                    //alert(angular.toJson(error));
                    alert('Internal server error.');
                }
            });

            // same as above
            return promise;
        }
    });

    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    //$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Tue, 13 Oct 1979 10:10:10 GMT';
});

// This iif filter used for ternary operator in Angular JS
angular.module('ternary', [])
.filter('iif', function () {
    return function (input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});

