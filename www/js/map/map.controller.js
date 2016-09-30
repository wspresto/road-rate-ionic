angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicPlatform', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService', 'googleMapsService', 'MOCK', '$cordovaGeolocation', '$interval'];

function RoadCtrl ($scope, $ionicPlatform, $ionicActionSheet, esriRegistry, $timeout, esriService, googleMapsService, MOCK, $cordovaGeolocation, $interval) {
    var vm = this;
    var zoomLevel = 18;    
    var voteConfirmationDelay = 5 * 1000;
    var gpsPollingRate =  30 * 1000;
    var gpsPollingThread = null;
    vm.downVote = downVote;
    vm.upVote = upVote;

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

    function pollGPS () {
       $cordovaGeolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 3000
        }).then( function updateLocation (position) {
            esriService.loadModule('esri/geometry/Point').then(function (Point) {
                var pt = new Point(position.coords.longitude, position.coords.latitude);
                $timeout(function () {vm.map.controller.centerAndZoom(pt, zoomLevel)}, 0); //do not run during $digest
            });
            googleMapsService.discoverRoad(position.coords.latitude, position.coords.longitude).then(function (details) {
                vm.road = details.road;
                vm.postal = details.postal;
            });
        }, function (err) {
            console.log('gps geolocation error..');
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

                    //setup gps polling

                    gpsPollingThread = $interval(function () {
                        console.log('polling gps...'); //TESTING!!!
                        pollGPS();
                    }, gpsPollingRate);

                });
            });            

        });        


    }    
}