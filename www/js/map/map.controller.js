angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicPlatform', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService', 'googleMapsService', 'MOCK', '$cordovaGeolocation', '$interval', 'loginUtils', '$q'];

function RoadCtrl ($scope, $ionicPlatform, $ionicActionSheet, esriRegistry, $timeout, esriService, googleMapsService, MOCK, $cordovaGeolocation, $interval, loginUtils, $q) {
    var vm = this;
    var zoomLevel = 18;    
    var voteConfirmationDelay = 5 * 1000;
    var gpsPollingRate =  45 * 1000;
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
        name: 'Discovering Road..',
        postal: '',
        dislikes: 0,
        likes: 0,
        opinion: 'You have not rated this road before.'
    };

    init();
    function getUID () {
        return 'RtglCmnWXJVmaGlIGHikMy9Vz612';
    }
    function getRoadFireBase (path) {
        return firebase.database().ref().child('roads/' + path);
    }
    function downVote () {
        var roadNode = getRoadFireBase(vm.road.name + ':' + vm.road.postal);
        var userID = getUID();   
        var resultText = '';
        roadNode.once('value', function(road) {
            if (road.val()) {
                var details = {
                    dislikes: road.val().dislikes + 1  
                };
                details[userID] = firebase.database.ServerValue.TIMESTAMP;                
                roadNode.update(details, function (err) {
                    if (err) {
                        notify('You can only vote on this road once every day!');
                    } else {
                        vm.road.dislikes++;
                        notify('You hate this road!');
                    }               
                });
            } else {
                var details = {
                    dislikes: 1,
                    likes: 0
                };
                details[userID] = firebase.database.ServerValue.TIMESTAMP;                
                roadNode.set(details, function (err) {
                    vm.road.dislikes++;
                    notify('You hate this road!');
                });
            }
        });
    }
    function upVote () {
        var roadNode = getRoadFireBase(vm.road.name + ':' + vm.road.postal);
        var userID = getUID();        
        roadNode.once('value', function(road) {
            if (road.val()) {
                var details = {
                    likes: road.val().likes + 1 
                };
                details[userID] = firebase.database.ServerValue.TIMESTAMP;             
                roadNode.update(details, function (err) {
                    if (err) {
                        notify('You can only vote on this road once every day!');
                    } else {
                        vm.road.likes++;
                        notify('You like this road!');
                    }                       
                });
            } else {
                var details = {
                    dislikes: 0,
                    likes: 1
                };
                details[userID] = firebase.database.ServerValue.TIMESTAMP;
                roadNode.set(details, function (err) {
                    vm.road.likes++;
                    notify('You like this road!');
                });
            }
        });        
    }
    function notify (text) {
        var close = $ionicActionSheet.show({  
            titleText: text
        });
        $timeout(close, voteConfirmationDelay);               
    }    
    function pollGPS () {
        var cb = $q.defer();
        $cordovaGeolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 3000
        }).then( function updateLocation (position) {
            esriService.loadModule('esri/geometry/Point').then(function (Point) {
                var pt = new Point(position.coords.longitude, position.coords.latitude);
                $timeout(function () {vm.map.controller.centerAndZoom(pt, zoomLevel)}, 0); //do not run during $digest
            });
            googleMapsService.discoverRoad(position.coords.latitude, position.coords.longitude).then(function (details) {
                cb.resolve(details);
            });
        }, function (err) {
            console.log('gps geolocation error..');
        });
        return cb.promise;
    }
    
    function updateRoadDetails (details) {
        vm.road.name = details.road.short_name;
        vm.road.postal = details.postal.short_name;
        var roadNode = getRoadFireBase(vm.road.name + ':' + vm.road.postal);
        roadNode.once('value', function(road) {
            if (road.val()) {
                $timeout(function () {
                    $scope.$apply(function () {
                        vm.road.dislikes = road.val().dislikes;
                        vm.road.likes = road.val().likes;
                        if (vm.road.dislikes > vm.road.likes) {
                            vm.road.opinion = 'You hate this road!';
                        } else if (vm.road.dislikes === vm.road.likes) {
                            vm.road.opinion = 'You have no strong feelings either way for this road!';                            
                        } else {
                            vm.road.opinon = 'You like this road.'
                        }
                    });                

                }, 0);

            } else {
                vm.road.dislikes = 0;
                vm.road.likes = 0;
            }
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
                    pollGPS().then(updateRoadDetails);
                    gpsPollingThread = $interval(function () {
                        console.log('polling gps...'); //TESTING!!!
                        pollGPS().then(updateRoadDetails);
                    }, gpsPollingRate);

                });
            });            
        });    
 

    }    
}