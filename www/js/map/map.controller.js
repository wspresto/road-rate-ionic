angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicActionSheet', 'esriRegistry', '$timeout'];

function RoadCtrl ($scope, $ionicActionSheet, esriRegistry, $timeout) {
    var vm = this;
    vm.downVote = downVote;
    vm.upVote = upVote;
    vm.voteConfirmationDelay = 5 * 1000;
    vm.map = {
        options: {
            basemap: 'streets',
            center: [-77.351302, 38.954555],
            zoom: 13,
            sliderStyle: 'small',
            logo: false
        }
    };
    init();
    function downVote () {
        var close = $ionicActionSheet.show({     
            titleText: 'You like this road.',
        });
        $timeout(close, vm.voteConfirmationDelay); 
    }
    function upVote () {
        var close = $ionicActionSheet.show({    
            titleText: 'You hate this road.',
        });
        $timeout(close, vm.voteConfirmationDelay); 

    }

    function init () {
        esriRegistry.get('roadMap').then(function (map) {
            map.on("load", function() {
                map.disablePan();
                map.hideZoomSlider();
                map.disableScrollWheelZoom();
            });
        });
    }    
}