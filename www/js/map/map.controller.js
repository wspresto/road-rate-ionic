angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicPlatform', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService', 'googleMapsService', 'MOCK', '$cordovaGeolocation'];

function RoadCtrl ($scope, $ionicPlatform, $ionicActionSheet, esriRegistry, $timeout, esriService, googleMapsService, MOCK, $cordovaGeolocation) {
    var vm = this;
    vm.downVote = downVote;
    vm.upVote = upVote;
    vm.voteConfirmationDelay = 5 * 1000;
    vm.gpsPromise = null;
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
    function updateLocation (position) {
            googleMapsService.discoverRoad(position.coords.latitude, position.coords.longitude).then(function (details) {
                vm.road = details.road;
                vm.postal = details.postal;
            });
    }
    function init () {
        $ionicPlatform.ready(function() {
            //fetch gps coordinates
            vm.gpsPromise = $cordovaGeolocation.watchPosition({
                enableHighAccuracy: false,
                timeout: 3000
            });
            vm.gpsPromise.then(null, function (err) {

            }, updateLocation);
        });        
        esriRegistry.get('roadMap').then(function (map) {
            map.on("load", function() {
                map.disablePan();
                map.hideZoomSlider();
                map.disableScrollWheelZoom();
            });
        });

    }    
}