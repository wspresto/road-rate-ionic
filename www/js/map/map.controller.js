angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicPlatform', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService', 'googleMapsService', 'MOCK', '$cordovaGeolocation'];

function RoadCtrl ($scope, $ionicPlatform, $ionicActionSheet, esriRegistry, $timeout, esriService, googleMapsService, MOCK, $cordovaGeolocation) {
    var vm = this;
    var zoomLevel = 18;    
    var voteConfirmationDelay = 5 * 1000;
    vm.downVote = downVote;
    vm.upVote = upVote;

    vm.gpsPromise = null;
    vm.map = {
        controller: null,
        options: {
            basemap: 'streets',
            center: [MOCK.LONGITUDE, MOCK.LATITUDE],
            zoom: zoomLevel,
            sliderStyle: 'small',
            logo: false
        }
    };
    vm.road = {
        short_name: 'Discovering Road..'
    };
    vm.postal = {
        long_name: ''
    }

    init();
    function downVote () {
        var close = $ionicActionSheet.show({     
            titleText: 'You like this road.',
        });
        $timeout(close, voteConfirmationDelay); 
    }
    function upVote () {
        var close = $ionicActionSheet.show({    
            titleText: 'You hate this road.',
        });
        $timeout(close, voteConfirmationDelay); 
    }
    function updateLocation (position) {
        esriService.loadModule('esri/geometry/Point').then(function (Point) {
            var pt = new Point(position.coords.longitude, position.coords.latitude);
            $timeout(function () {vm.map.controller.centerAndZoom(pt, zoomLevel)}, 0); //do not run during $digest
        });
        googleMapsService.discoverRoad(position.coords.latitude, position.coords.longitude).then(function (details) {
            vm.road = details.road;
            vm.postal = details.postal;
        });
    }
    function init () {
        $ionicPlatform.ready(function() {
            esriRegistry.get('roadMap').then(function (map) {
                map.on("load", function() {
                    vm.map.controller = map;
                    map.disableRubberBandZoom();
                    map.disableShiftDoubleClickZoom();
                    map.disableClickRecenter();
                    map.disableDoubleClickZoom();

                    map.disableScrollWheelZoom();      
                    map.disableSnapping();              
                    map.disablePan();
                    map.disableMapNavigation();                    
                    map.hideZoomSlider();


                    //fetch gps coordinates
                    vm.gpsPromise = $cordovaGeolocation.watchPosition({
                        enableHighAccuracy: false,
                        timeout: 3000
                    });
                    vm.gpsPromise.then(null, function (err) {

                    }, updateLocation);                    
                });
            });            

        });        


    }    
}