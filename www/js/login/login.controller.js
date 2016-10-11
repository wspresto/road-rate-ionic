angular.module('unisys.onboarding.login')
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$ionicHistory', 'firebaseService'];

function LoginCtrl ($scope, $ionicHistory, firebaseService) {
    var vm = this;

    vm.toggleRegistrationForm = {};
    vm.alreadyRegistered = {};
    vm.error = {};

    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });

    vm.login = function (chosenProvider, toggleRegistrationForm, $event) {
        firebaseService.login(chosenProvider, toggleRegistrationForm).then(function (error) {
            vm.error = error;
        });
    }

    vm.toggleSignUp = function ($event) {
        if (this.toggleRegistrationForm.toggle) {
            this.toggleRegistrationForm.toggle = false;
            $event.currentTarget.innerHTML = 'Register';
        } else {
            this.toggleRegistrationForm.toggle = true;
            $event.currentTarget.innerHTML = 'Cancel';
        }
    }

    vm.toggleLoginProviders = function (test) {
        var chosenProvider = localStorage.getItem("chosenProvider") || {};

        if (chosenProvider.length) {
            this.alreadyRegistered.provider = JSON.parse(chosenProvider).provider;
        }
    }

}