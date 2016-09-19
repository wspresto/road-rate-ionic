angular.module('unisys.onboarding.landing')
.controller('LandingCtrl', LandingCtrl);

LandingCtrl.$inject = ['$scope', 'moment'];

function LandingCtrl ($scope, moment) {
    var vm = this;
    vm.today = moment();
    vm.activities = [
        {
            date: vm.today,
            label: 'You rated Route 7!'
        },
        {
            date: vm.today.subtract(1, 'days'),
            label: 'You rated 66!'
        },
        {
            date: vm.today.subtract(2, 'days'),
            label: 'You rated I-95!'
        },
        {
            date: vm.today.subtract(3, 'days'),
            label: 'You rated I-395!'
        }        

    ]
}