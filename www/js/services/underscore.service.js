angular.module('unisys.onboarding.services')
.factory('_', underscore);

underscore.$inject = [];
function underscore () {
    if (typeof _ === 'function') {    
        return _;
    } else {
        return {};
    }
}