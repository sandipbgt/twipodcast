(function() {
    angular
        .module('twiPodcastApp', [
            'ngAnimate',
            'app.routes',
            'mainCtrl',
            'podcastCtrl',
            'feedbackCtrl',
        ])
        .constant("CONFIG", {
            "BASE": "http://localhost:5000",
            "BASE_API": "http://localhost:5000/api"
        });
})();