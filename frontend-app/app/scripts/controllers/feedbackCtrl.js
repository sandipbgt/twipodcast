(function() {
    angular
        .module('feedbackCtrl', [
                'mgcrea.ngStrap',
                'feedbackService',
        ])
        .controller('sendFeedbackController', ['$alert', 'Feedback', function($alert, Feedback) {
            var self = this;
            self.processing = false;
            self.feedbackData = {}

            self.send = function() {
                self.processing = true;
                Feedback.send(self.feedbackData)
                    .success(function(data) {
                        self.processing = false;
                        $alert({
                            content: 'Feedback sent successfully!',
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
        }]);
 })();