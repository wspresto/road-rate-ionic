angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicActionSheet', 'esriRegistry', '$timeout', 'esriService'];

function RoadCtrl ($scope, $ionicActionSheet, esriRegistry, $timeout, esriService) {
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
    vm.road = {
        name: 'US - 267',
        summary: 'You hate this road',
        likes: 4,
        hates: 28
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
            esriService.loadModule('esri/geometry/Point').then(function (Point) {
                esriService.loadModule('esri/SpatialReference').then(function (SpatialReference) {
                    esriService.loadModule('esri/dijit/Search').then(function (Search) {
                        var SearchService = new Search({
                            map: map,
                        }, "blank");
                        var pt = new Point(-77.351302, 38.954555, new SpatialReference({
                            wkid: 4326
                        }));
                        SearchService.search([-77.351168, 38.951265]).then(function(response){
                            console.log(response); 
                        });
                    });
                });            
            });
        });

    }    
}