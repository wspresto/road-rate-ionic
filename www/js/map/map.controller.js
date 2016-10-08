angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicPlatform', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService', 'googleMapsService', 'MOCK', '$cordovaGeolocation', '$interval', '$q', 'firebaseService'];

function RoadCtrl ($scope, $ionicPlatform, $ionicActionSheet, esriRegistry, $timeout, esriService, googleMapsService, MOCK, $cordovaGeolocation, $interval, $q, firebaseService) {
    var vm = this;
    var zoomLevel = 13;    
    var voteConfirmationDelay = 5 * 1000;
    var gpsPollingRate =  45 * 1000;
    var gpsPollingThread = null;
    var userID = null; 
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
        opinion: 'You have not rated this road before.',
        latitude: null,
        longitude: null
    };
    
    init();

    function getRoadFireBase (path) {
        return firebase.database().ref().child('roads/' + path);
    }
    function getDisplayName () {
        return vm.displayName;
    }
    function downVote () {
        if (userID === null)
            return;
        var roadNode = getRoadFireBase(vm.road.name + ':' + vm.road.postal);
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
                        pushToActivityFeed(getDisplayName() + ' hates ' + vm.road.name + '!'); 
                        pushToMarkers(false);                                                 
                    }               
                });
            } else {
                var details = {
                    dislikes: 1,
                    likes: 0
                };
                details[userID] = firebase.database.ServerValue.TIMESTAMP;                
                roadNode.set(details, function (err) {
                    if (err) {
                        notify('You can only vote once per day.');
                    } else {
                        vm.road.dislikes++;
                        notify('You hate this road!');
                        pushToActivityFeed(getDisplayName() + ' hates ' + vm.road.name + '!');     
                        pushToMarkers(false);                                                    
                    }
                });
            }
        });
    }
    function upVote () {
        if (userID === null)
            return;   
        var roadNode = getRoadFireBase(vm.road.name + ':' + vm.road.postal);      
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
                        pushToActivityFeed(getDisplayName() + ' likes ' + vm.road.name + '!');    
                        pushToMarkers(true);                                            
                    }
                });
            } else {
                var details = {
                    dislikes: 0,
                    likes: 1
                };
                details[userID] = firebase.database.ServerValue.TIMESTAMP;
                roadNode.set(details, function (err) {
                    if (err) {
                        notify('You can only vote on this road once per day.');
                    } else {
                        vm.road.likes++;
                        notify('You like this road!');
                        pushToActivityFeed(getDisplayName() + ' likes ' + vm.road.name + '!');
                        pushToMarkers(true);
                    }
                });
            }
        });        
    }
    function pushToMarkers (like) {
        if (userID === null)
            return;            
        var path = 'markers';
        var newKey = firebase.database().ref().child(path).push().key;
        firebase.database().ref(path + '/' + newKey).set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            like: like,
            uid: userID,
            roadCode: vm.road.name + ':' + vm.road.postal,
            longitude: vm.road.longitude,
            latitude: vm.road.latitude
        });
    }    
    function pushToActivityFeed (title) {
        if (userID === null)
            return;            
        var path = 'activity/all';
        var newKey = firebase.database().ref().child(path).push().key;
        firebase.database().ref(path + '/' + newKey).set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            title: title,
            uid: userID,
            roadCode: vm.road.name + ':' + vm.road.postal
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
            enableHighAccuracy: true,
            timeout: 3000
        }).then( function updateLocation (position) {
            esriService.loadModule('esri/geometry/Point').then(function (Point) {
                var pt = new Point(position.coords.longitude, position.coords.latitude);
                $timeout(function () {vm.map.controller.centerAndZoom(pt, zoomLevel)}, 0); //do not run during $digest
            });
            googleMapsService.discoverRoad(position.coords.latitude, position.coords.longitude).then(function (details) {
                details.longitude = position.coords.longitude;
                details.latitude  = position.coords.latitude;
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
        vm.road.longitude = details.longitude;
        vm.road.latitude = details.latitude;
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
        firebaseService.getUser().then(function (user) {
            userID = user.uid;
            vm.displayName = user.email.split('@')[0];
        });
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
                        pollGPS().then(updateRoadDetails);
                    }, gpsPollingRate);
                    //draw markers
                    var db = firebase.database().ref().child('markers');
                    esriService.loadModule('esri/symbols/SimpleMarkerSymbol').then(function (SimpleMarkerSymbol) {
                        esriService.loadModule('esri/geometry/Point').then(function (Point) {
                            esriService.loadModule('esri/graphic').then(function (Graphic) {
                                db.on('child_added', function (childNode) {
                                    var marker = childNode.val();
                                    var symbol = null;
                                    if (marker.like) {
                                        symbol = new SimpleMarkerSymbol();
                                        symbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                                        symbol.setColor([0,255,0,255]);
                                    } else {
                                        symbol = new SimpleMarkerSymbol();
                                        symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
                                        symbol.setColor([255,0,0,255]);
                                    }
                                    map.graphics.add(new Graphic(new Point(marker.longitude, marker.latitude), symbol));
                                });                      
                            });
                        });
                    });                    
                });
            });            
        });    
    }    
}