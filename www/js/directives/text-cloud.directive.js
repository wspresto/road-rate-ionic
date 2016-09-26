angular.module('unisys.onboarding.directives')
.directive('textCloud', function () {
    return {
        controller: 'TextCloudCtrl',
        templateUrl: 'directives/text-cloud.directive.html',
        restrict: 'E',
        transclude: true,
        scope: {
            left: '@left',
            top: '@top',
            bottom: '@bottom',
            right: '@right'
        },
        link: function (scope, element, attributes) {
            var $div = angular.element(element[0].getElementsByClassName('text-cloud-box'));
            $div.css({'top': attributes.top, 'left': attributes.left, 'bottom': attributes.bottom, 'right': attributes.right});
        }
    }
})
.controller('TextCloudCtrl', TextCloudCtrl);
TextCloudCtrl.$inject = ['$scope'];

function TextCloudCtrl ($scope) {

}