angular.module('unisys.onboarding.services')
.factory('esriService', Esri);

Esri.$inject = ['$q'];

function Esri ($q) {
    var service = {
        loadModule: loadModule
    };

    function loadModule (moduleName) {
        var cb = $q.defer();
        require([moduleName], function (module) {
            cb.resolve(module);
        });
        return cb.promise;
    }

    return service;
}