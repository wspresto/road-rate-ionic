angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope'];


function RoadCtrl ($scope) {
    var vm = this;
    vm.showVotingSheet = showVotingSheet;


    function showVotingSheet () {
        $ionicActionSheet.show({
            destructiveText: 'Hate it',
            buttons: [
                {
                    text: 'This is nice'
                },
            ],            
            titleText: 'Rate this road',
            cancelText: 'Nevermind',
            cancel: function() {
                // add cancel code..
                },
            buttonClicked: function(index) {
            return true;
            }
        });
    }
}