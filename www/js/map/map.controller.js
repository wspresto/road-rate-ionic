angular.module('unisys.onboarding.road')
.controller('RoadCtrl', RoadCtrl);

RoadCtrl.$inject = ['$scope', '$ionicActionSheet', 'esriRegistry'];

function RoadCtrl ($scope, $ionicActionSheet, esriRegistry) {
    var vm = this;
    vm.showVotingSheet = showVotingSheet;
    vm.map = {
        options: {
            basemap: 'streets',
            center: [-77.351302, 38.954555],
            zoom: 13,
            sliderStyle: 'small',
            logo: false
        }
    };
    esriRegistry.get('mapA').then(function (map) {
        map.on("load", function() {
            map.disablePan();
            map.hideZoomSlider();
            map.disableScrollWheelZoom();
        });
    });

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