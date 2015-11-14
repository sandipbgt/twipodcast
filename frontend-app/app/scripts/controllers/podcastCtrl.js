(function() {
    angular
        .module('podcastCtrl', [
            'mgcrea.ngStrap',
            'podcastService',
        ])
        .controller('sendPodcastController', ['$rootScope', '$alert', 'Podcast', function($rootScope, $alert, Podcast) {
            var self = this;
            self.processing = false;
            self.podcastData = {};
            self.podcastData.media_url = $rootScope.podcast_media_url || '';

            self.send = function() {
                self.processing = true;
                Podcast.create(self.podcastData)
                    .success(function(data) {
                        self.processing = false;
                        $alert({
                            content: 'Podcast sent successfully!',
                            placement: 'top-right',
                            animation: 'bounceIn',
                            type: 'success',
                            duration: 3
                        });
                    })
                    .error(function(data) {
                        self.processing = false;
                        $alert({
                              title: 'Error!',
                              content: data.message,
                              animation: 'bounceIn',
                              placement: 'top-right',
                              type: 'danger',
                              duration: 3
                            });
                    });
            };
        }])
        .controller('browsePodcastController', ['podcastUsers', function(podcastUsers) {
            var self = this;
            self.podcastUsers = podcastUsers.data;
        }])
        .controller('podcastDetailController', [
            '$rootScope', '$scope', '$stateParams', '$state', '$alert', 'userTracks',
            function($rootScope, $scope, $stateParams, $state, $alert, userTracks) {
                var self = this;
                self.username = $stateParams.username;
                self.userTracks = userTracks;

                $scope.$on('podcast:copyUrl', function(event, data) {
                    $rootScope.podcast_media_url = data.media_url;
                    $alert({
                        content: 'Podcast url copied!',
                        placement: 'top-right',
                        animation: 'bounceIn',
                        type: 'success',
                        duration: 3
                    });
                    $state.go('sendPodcast');
                });

                self.copyUrl = function(media_url) {
                    $scope.$emit('podcast:copyUrl', {media_url: media_url});
                }
        }]);
 })();