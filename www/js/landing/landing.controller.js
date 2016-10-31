angular.module('unisys.onboarding.landing')
.controller('LandingCtrl', LandingCtrl);

LandingCtrl.$inject = ['$scope', '$timeout', 'moment', 'firebaseService'];

function LandingCtrl ($scope, $timeout, moment, firebaseService) {
    var vm = this;
    vm.today = moment();
    vm.messages = [
        {
            "id": "162701077035089920",
            "channel_id": "131391742183342080",
            "author": {},
            "content": "Hey guys!",
            "timestamp": "2016-03-24T23:15:59.605000+00:00",
            "edited_timestamp": null,
            "tts": false,
            "mention_everyone": false,
            "mentions": [],
            "mention_roles": [],
            "attachments": [],
            "embeds": []
        }   
    ];
    vm.message = {
        "id": "162701077035089920",
        "channel_id": "131391742183342080",
        "author": {},
        "content": "Hey guys!",
        "timestamp": "2016-03-24T23:15:59.605000+00:00",
        "edited_timestamp": null,
        "tts": false,
        "mention_everyone": false,
        "mentions": [],
        "mention_roles": [],
        "attachments": [],
        "embeds": []
    };
    vm.sendMessage = sendMessage;
    //init();

    function sendMessage () {
        //TODO: write to firebase
        vm.messages.push(vm.message);
        vm.message = {
            "id": "162701077035089920",
            "channel_id": "131391742183342080",
            "author": {},
            "content": "",
            "timestamp": "2016-03-24T23:15:59.605000+00:00",
            "edited_timestamp": null,
            "tts": false,
            "mention_everyone": false,
            "mentions": [],
            "mention_roles": [],
            "attachments": [],
            "embeds": []
        };
    }
    function init () {

     var db = firebase.database().ref().child('activity/all');
     db.orderByChild('timestamp').on('child_added', function (childNode) {
        $timeout(function () {
            $scope.$apply(function () {         
                vm.activities.unshift(childNode.val());
            });
        }, 0);
     });  
    }
}