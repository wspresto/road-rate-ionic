angular.module('unisys.onboarding.directives')
.directive('textCloud', function () {
    return {
        controller: 'TextCloudCtrl',
        templateUrl: 'directives/text-cloud.directive.html',
        restrict: 'E',
        transclude: true,
        scope: {
            x: '@x',
            y: '@y'
        },
        link: function (scope, element, attributes) {
            var $div = angular.element(element[0].getElementsByClassName('text-cloud-box'));
            $div.css({'top': attributes.y, 'left': attributes.x});
        }
    }
})
.controller('TextCloudCtrl', TextCloudCtrl);
TextCloudCtrl.$inject = ['$scope'];

function TextCloudCtrl ($scope) {

}