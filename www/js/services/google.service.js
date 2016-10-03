angular.module('unisys.onboarding.services')
.factory('googleMapsService', googleMapsService);

googleMapsService.$inject = ['$q', '$http', 'GOOGLE_API_URLS', 'GOOGLE_API_KEY', '_'];

function googleMapsService ($q, $http, GOOGLE_API_URLS, GOOGLE_API_KEY, _) {
    var service = {
        discoverRoad: discoverRoad
    };
    function discoverRoad (latitude, longitude) {
        var cb = $q.defer();
        var url = GOOGLE_API_URLS.GEOCODING;
        url += '?key=' + GOOGLE_API_KEY;
        url += '&latlng='  + [latitude, longitude].join(',');
        $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            cb.resolve(extractRouteInformation(response.data.results));
        }, function (err) {
            console.log(err);
        });
        return cb.promise;
    }
    function extractRouteInformation (response) {
        var routeDetails = _.find(response, function (detailObj) {
            return detailObj.types.indexOf('street_address') > -1;
        });
        var roadComponent = _.find(routeDetails.address_components, function (component) {
            return component.types.indexOf('route') > -1;
        }); 
        var postalComponent = _.find(routeDetails.address_components, function (component) {
            return component.types.indexOf('postal_code') > -1;
        });   
        return {
            postal : postalComponent,
            road : roadComponent
        }; 
    }
    return service;
}
