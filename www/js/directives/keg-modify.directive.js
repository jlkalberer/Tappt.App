angular.module('brewskey.directives')
    .directive('kegModify', [
    'Restangular', '$ionicModal', 'kegTypes', 'kegSize', '$state',
    function (rest, $ionicModal, kegTypes, kegSize, $state) {
        return {
            link: function (scope, element) {
                scope.kegTypes = kegTypes;

                scope.$watch('query', function (val) {
                    scope.selectedBeer = null;
                    if (!val) {
                        return;
                    }
                    rest.one('api/beer').customGET('search', { query: val }).then(function (response) {
                        if (!response || !response.data) {
                            return null;
                        }

                        scope.beers = response.data;
                    });
                });

                scope.onSelect = function (selectedBeer) {
                    scope.selectedBeer = selectedBeer;

                    var model = scope.model;
                    model.tapId = scope.tapId;
                    model.beerId = selectedBeer.id;
                    model.beerName = selectedBeer.name;
                    model.beerIcon = (selectedBeer.labels || {}).medium || null;
                    model.changed = true;

                    scope.closeModal();
                };

                scope.onKegTypeChange = function () {
                    var model = scope.model;
                    model.changed = true;
                };

                $ionicModal.fromTemplateUrl('templates/modals/beer-selector.html', {
                    scope: scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    scope.modal = modal;
                });
                scope.openModal = function () {
                    scope.modal.show();
                };
                scope.closeModal = function () {
                    scope.modal.hide();
                };
                scope.toggleAdvanced = function() {
                    scope.showAdvanced = !scope.showAdvanced;
                };
                scope.getOunces = function () {
                    if (scope.model.kegType === "undefined") {
                        return 0;
                    }

                    return Math.round(scope.model.startingPercentage * .01 * kegSize[scope.model.kegType]);
                };


                scope.isSending = false;
                scope.submit = function (shouldReplace) {
                    scope.isSending = true;

                    var model = scope.model;
                    model.tapId = scope.tapId;

                    var promise;
                    if (shouldReplace) {
                        promise = rest.all('api/kegs').post(model);
                    } else {
                        promise = rest.restangularizeElement('', model, 'api/kegs').put();
                    }

                    promise.then(function (response) {
                        scope.isSending = false;
                        scope.model.changed = false;
                        scope.onOkay && scope.onOkay(response);

                        scope.$emit('keg-updated', response);

                        // If the sensor hasn't been set up, add one now :(
                        if (!response.flowSensorId) {
                            $state.go('app.tap.set-sensor', { tapId: scope.tapId }, { location: 'replace' });
                        } else {
                            $state.go('app.tap.edit', { tapId: scope.tapId }, { location: 'replace' });
                        }

                    }, function (error) {
                        scope.isSending = false;
                        if (!error.data) {
                            return;
                        }
                        if (error.data.ModelState) {
                            scope.errors = error.data.ModelState;
                        }
                        if (error.data['error_description']) {
                            scope.errorDescription = error.data['error_description'];
                        }
                        if (error.data.Message) {
                            scope.errorDescription = error.data.Message;
                        }
                    });
                };
            },
            restrict: 'E',
            scope: {
                model: '=keg',
                onCancel: '=onCancel',
                onOkay: '=onOkay',
                tapId: '=tapId',
            },
            templateUrl: 'templates/modify-keg.html',
        };
    }]);
