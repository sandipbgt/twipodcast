(function() {
    angular
        .module('podcastService', [])
        .factory('Podcast', ['CONFIG', '$http', function (CONFIG, $http) {

        	var podcastFactory = {};

        	/**
        	 * Create a Podcast
        	 */
        	podcastFactory.create = function(data) {
        		return $http.post(CONFIG.BASE_API + '/calls', data);
        	}

        	return podcastFactory;
        }]);
})();