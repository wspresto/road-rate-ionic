angular.module('unisys.onboarding.profile')
    .controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', 'firebaseService'];

function ProfileCtrl ($scope, firebaseService) {
    var vm = this;

    vm.userData = [];

    firebaseService.getUser().then(function (user) {
        vm.userData = user.providerData;
    });
}