(function() {
    angular
        .module('feedbackService', [])
        .factory('Feedback', ['CONFIG', '$http', function (CONFIG, $http) {

        	var feedbackFactory = {};

        	/**
        	 * Send feedback
        	 */
        	feedbackFactory.send = function(data) {
        		return $http.post(CONFIG.BASE_API + '/feedback', data);
        	}

    	   return feedbackFactory;
        }]);
})();