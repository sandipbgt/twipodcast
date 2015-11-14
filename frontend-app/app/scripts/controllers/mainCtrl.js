(function() {
    angular
        .module('mainCtrl', ['cfp.loadingBar'])
        .controller('mainController', ['cfpLoadingBar', '$rootScope',
            function(cfpLoadingBar, $rootScope) {
                var self = this;

                $rootScope.$on('$stateChangeStart', function() {
                    cfpLoadingBar.start();
                });

                $rootScope.$on('$stateChangeSuccess', function() {
                    cfpLoadingBar.complete();
                });
            }
        ]);
})();