angular.module('brewskey.controllers')
.controller('TapsCtrl', [
    '$scope', 'Restangular', function($scope, rest) {
        $scope.loading = true;
        rest.all('api/taps').getList().then(function(taps) {
            $scope.taps = taps;
            $scope.loading = false;
        }).catch(function () { $scope.loading = false; });

        $scope.getPercentLeft = function (keg) {
            return (keg.maxOunces - keg.ounces) / keg.maxOunces * 100;
        };
    }
]);