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
        }      
    }
    return service;
}

var mock  = {
   "results" : [
      {
         "address_components" : [
            {
               "long_name" : "Henry G. Shirley Memorial Highway",
               "short_name" : "I-95",
               "types" : [ "route" ]
            },
            {
               "long_name" : "Lorton",
               "short_name" : "Lorton",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Mount Vernon",
               "short_name" : "Mt Vernon",
               "types" : [ "administrative_area_level_3", "political" ]
            },
            {
               "long_name" : "Fairfax County",
               "short_name" : "Fairfax County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "Virginia",
               "short_name" : "VA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            },
            {
               "long_name" : "22079",
               "short_name" : "22079",
               "types" : [ "postal_code" ]
            }
         ],
         "formatted_address" : "Henry G. Shirley Memorial Hwy, Lorton, VA 22079, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 38.7264319,
                  "lng" : -77.2018487
               },
               "southwest" : {
                  "lat" : 38.7152792,
                  "lng" : -77.21646799999999
               }
            },
            "location" : {
               "lat" : 38.7205719,
               "lng" : -77.2088031
            },
            "location_type" : "GEOMETRIC_CENTER",
            "viewport" : {
               "northeast" : {
                  "lat" : 38.7264319,
                  "lng" : -77.2018487
               },
               "southwest" : {
                  "lat" : 38.7152792,
                  "lng" : -77.21646799999999
               }
            }
         },
         "place_id" : "ChIJs2DAizhTtokRFsRXJ34E9iI",
         "types" : [ "route" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "Lorton",
               "short_name" : "Lorton",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Mount Vernon",
               "short_name" : "Mt Vernon",
               "types" : [ "administrative_area_level_3", "political" ]
            },
            {
               "long_name" : "Fairfax County",
               "short_name" : "Fairfax County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "Virginia",
               "short_name" : "VA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Lorton, VA, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 38.733714,
                  "lng" : -77.1929509
               },
               "southwest" : {
                  "lat" : 38.666925,
                  "lng" : -77.2811303
               }
            },
            "location" : {
               "lat" : 38.704282,
               "lng" : -77.2277603
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 38.733714,
                  "lng" : -77.1929509
               },
               "southwest" : {
                  "lat" : 38.666925,
                  "lng" : -77.2811303
               }
            }
         },
         "place_id" : "ChIJoaSgdMNStokRo_WCsliVI68",
         "types" : [ "locality", "political" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "22079",
               "short_name" : "22079",
               "types" : [ "postal_code" ]
            },
            {
               "long_name" : "Lorton",
               "short_name" : "Lorton",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Mount Vernon",
               "short_name" : "Mt Vernon",
               "types" : [ "administrative_area_level_3", "political" ]
            },
            {
               "long_name" : "Fairfax County",
               "short_name" : "Fairfax County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "Virginia",
               "short_name" : "VA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Lorton, VA 22079, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 38.74684,
                  "lng" : -77.12968189999999
               },
               "southwest" : {
                  "lat" : 38.6056169,
                  "lng" : -77.28279390000002
               }
            },
            "location" : {
               "lat" : 38.6679123,
               "lng" : -77.20602409999999
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 38.74684,
                  "lng" : -77.12968189999999
               },
               "southwest" : {
                  "lat" : 38.6056169,
                  "lng" : -77.28279390000002
               }
            }
         },
         "place_id" : "ChIJH_vEcAlTtokR76-cyZepXQo",
         "postcode_localities" : [ "Lorton", "Mason Neck" ],
         "types" : [ "postal_code" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "Mount Vernon",
               "short_name" : "Mt Vernon",
               "types" : [ "administrative_area_level_3", "political" ]
            },
            {
               "long_name" : "Fairfax County",
               "short_name" : "Fairfax County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "Virginia",
               "short_name" : "VA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Mt Vernon, VA, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 38.8003239,
                  "lng" : -77.0415113
               },
               "southwest" : {
                  "lat" : 38.6178238,
                  "lng" : -77.2815083
               }
            },
            "location" : {
               "lat" : 38.6743987,
               "lng" : -77.17152279999999
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 38.8003239,
                  "lng" : -77.0415113
               },
               "southwest" : {
                  "lat" : 38.6178238,
                  "lng" : -77.2815083
               }
            }
         },
         "place_id" : "ChIJ31bgmpqst4kRnAzpk3f7VFE",
         "types" : [ "administrative_area_level_3", "political" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "Fairfax County",
               "short_name" : "Fairfax County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "Virginia",
               "short_name" : "VA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Fairfax County, VA, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 39.0570041,
                  "lng" : -77.0415134
               },
               "southwest" : {
                  "lat" : 38.6178238,
                  "lng" : -77.5367179
               }
            },
            "location" : {
               "lat" : 38.9085472,
               "lng" : -77.2405153
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 39.0570041,
                  "lng" : -77.0415134
               },
               "southwest" : {
                  "lat" : 38.6178238,
                  "lng" : -77.5367179
               }
            }
         },
         "place_id" : "ChIJ0wxG_rFgtokRmRY44U76C30",
         "types" : [ "administrative_area_level_2", "political" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "Washington-Arlington-Alexandria, DC-VA-MD-WV",
               "short_name" : "Washington-Arlington-Alexandria, DC-VA-MD-WV",
               "types" : [ "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Washington-Arlington-Alexandria, DC-VA-MD-WV, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 39.720018,
                  "lng" : -76.38622889999999
               },
               "southwest" : {
                  "lat" : 37.9911599,
                  "lng" : -78.38668199999999
               }
            },
            "location" : {
               "lat" : 39.1289725,
               "lng" : -77.3783789
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 39.720023,
                  "lng" : -76.38622889999999
               },
               "southwest" : {
                  "lat" : 37.9911599,
                  "lng" : -78.38668199999999
               }
            }
         },
         "place_id" : "ChIJy25QE7lFtokRgaAnbc9iMr8",
         "types" : [ "political" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "Virginia",
               "short_name" : "VA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Virginia, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 39.466012,
                  "lng" : -75.2421573
               },
               "southwest" : {
                  "lat" : 36.540759,
                  "lng" : -83.6754151
               }
            },
            "location" : {
               "lat" : 37.4315734,
               "lng" : -78.6568942
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 39.466012,
                  "lng" : -75.2421573
               },
               "southwest" : {
                  "lat" : 36.540759,
                  "lng" : -83.6754151
               }
            }
         },
         "place_id" : "ChIJzbK8vXDWTIgRlaZGt0lBTsA",
         "types" : [ "administrative_area_level_1", "political" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "United States",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 71.3867745,
                  "lng" : -66.9502861
               },
               "southwest" : {
                  "lat" : 18.910677,
                  "lng" : 172.4458955
               }
            },
            "location" : {
               "lat" : 37.09024,
               "lng" : -95.712891
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 49.38,
                  "lng" : -66.94
               },
               "southwest" : {
                  "lat" : 25.82,
                  "lng" : -124.39
               }
            }
         },
         "place_id" : "ChIJCzYy5IS16lQRQrfeQ5K5Oxw",
         "types" : [ "country", "political" ]
      }
   ],
   "status" : "OK"
};