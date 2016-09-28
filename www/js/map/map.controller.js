angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService', 'googleMapsService', 'MOCK'];

function RoadCtrl ($scope, $ionicActionSheet, esriRegistry, $timeout, esriService, googleMapsService, MOCK) {
    var vm = this;
    vm.downVote = downVote;
    vm.upVote = upVote;
    vm.voteConfirmationDelay = 5 * 1000;
    vm.map = {
        options: {
            basemap: 'streets',
            center: [MOCK.LONGITUDE, MOCK.LATITUDE],
            zoom: 18,
            sliderStyle: 'small',
            logo: false
        }
    };
    vm.road = {
        short_name: 'Discovering Road..',
    };
    vm.postal = {
        long_name: ''
    }

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
            googleMapsService.discoverRoad(MOCK.LATITUDE, MOCK.LONGITUDE).then(function (details) {
                vm.road = details.road;
                vm.postal = details.postal;
            });
        });

    }    
}