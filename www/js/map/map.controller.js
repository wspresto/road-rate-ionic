angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicActionSheet'];

function RoadCtrl ($scope, $ionicActionSheet) {
    var vm = this;
    vm.showVotingSheet = showVotingSheet;
    vm.map = {
        options: {
            basemap: 'topo',
            center: [-77.351302, 38.954555],
            zoom: 13,
            sliderStyle: 'small'
        }
    };
    
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