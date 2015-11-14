(function() {
    angular
        .module('app.routes', ['ui.router', 'soundcloudService'])
        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('home', {
                        url: '/',
                        templateUrl: 'views/home.html'
                    })
                    .state('sendPodcast', {
                        url: '/sendPodcast',
                        templateUrl: 'views/podcast/sendPodcast.html',
                        controller: 'sendPodcastController',
                        controllerAs: 'sendPodcast'
                    })
                    .state('browsePodcasts', {
                        url: '/browsePodcasts',
                        resolve: {
                            podcastUsers: ['Soundcloud',
                                function(Soundcloud) {
                                    return Soundcloud.getUsers();
                            }]
                        },
                        templateUrl: 'views/podcast/browsePodcast.html',
                        controller: 'browsePodcastController',
                        controllerAs: 'browsePodcast'
                    })
                    .state('podcastDetail', {
                        url: '/podcastDetail/:username',
                        resolve: {
                            userTracks: ['$stateParams', 'Soundcloud',
                                function($stateParams, Soundcloud) {
                                    return Soundcloud.getUserTracks($stateParams.username);
                            }]
                        },
                        templateUrl: 'views/podcast/podcastDetail.html',
                        controller: 'podcastDetailController',
                        controllerAs: 'podcastDetail'
                    })
                    .state('sendFeedback', {
                        url: '/sendFeedback',
                        templateUrl: 'views/sendFeedback.html',
                        controller: 'sendFeedbackController',
                        controllerAs: 'sendFeedback'
                    });

                    $urlRouterProvider.otherwise('/');
            }
        ]);
})();