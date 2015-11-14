(function() {
    angular
        .module('soundcloudService', [])
        .factory('Soundcloud', [ 'CONFIG', '$http', function(CONFIG, $http) {

            var soundcloudFactory = {}

            /**
             * Get soundcloud usernames
             *
             */
            soundcloudFactory.getUsers = function() {
                return $http.get(CONFIG.BASE_API + '/soundcloud/');
            };

            /**
             * Get soundcloud user's tracks
             *
             */
            soundcloudFactory.getUserTracks = function(username) {
                return $http.get(CONFIG.BASE_API + '/soundcloud/' + username);
            };

            return soundcloudFactory;
        }]);
})();