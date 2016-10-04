angular.module('unisys.onboarding.firebase.service', [])
    .factory('firebaseService', firebaseService);

    firebaseService.$inject = [];

function firebaseService () {

    var config = {
        apiKey: "AIzaSyDRaQNaGdU0RZNXZEAciKlL2xtmSfMM-_M",
        authDomain: "road-rate.firebaseapp.com",
        databaseURL: "https://road-rate.firebaseio.com",
        storageBucket: "road-rate.appspot.com",
        messagingSenderId: "452486727320"
    };
    firebase.initializeApp(config);

    var utils = {
        user: null,
        initialize: function () {
            this.providers = {
                google: new firebase.auth.GoogleAuthProvider(),
                github: new firebase.auth.GithubAuthProvider()
            };
            utils.user = null;
        },
        setUser: function (user) {
            utils.user = user;
        },
        clearUser: function () {
            utils.user = null;
        },
        signout: function () {
            firebase.auth().signOut();
            this.clearUser();
        },
        toggleLogin: function (chosenProvider, toggleRegisterationForm) {
            
            chosenProvider = chosenProvider || null;
            
            if (!utils.user) {

                if (chosenProvider){
                    var provider = this.providers[chosenProvider];

                    switch (provider.providerId) {
                        case "google.com":
                            provider.addScope('https://www.googleapis.com/auth/plus.login');
                            break;
                        case "github.com":
                            provider.addScope('repo');
                            break;
                        default: 
                            provider = null;
                    }
                }

                if (provider) {
                    firebase.auth().signInWithPopup(provider).then(function(result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        utils.user = result.user;
                        utils.user.token = result.credential.accessToken;

                    }).catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;

                        if (errorCode === 'auth/account-exists-with-different-credential') {
                            alert('You have already signed up with a different auth provider for that email.');
                        } else {
                            console.error(error);
                        }
                    });
                } else if (!toggleRegisterationForm) {
                    var email = document.getElementById('email').value;
                    var password = document.getElementById('password').value;

                    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                    
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        if (errorCode === 'auth/wrong-password') {
                            console.log('Wrong password.');
                        } else {
                            console.log(errorMessage);
                        }
                        console.log(error);
                    });
                } else {
                    this.handleSignUp(toggleRegisterationForm);
                }
                return true;
            }
            return false;
        },
        handleSignUp: function (toggleRegistrationForm) {
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var confirmEmail = document.getElementById('confirm-email').value;
            var confirmPassword = document.getElementById('confirm-password').value;
            if (toggleRegistrationForm) {
                if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
                    return;
                }

                if (password.value !== confirmPassword.value) {
                    return;
                }
            }

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            });
        },
        sendEmailVerification: function () {
            firebase.auth().currentUser.sendEmailVerification().then(function() {
                alert('Email Verification Sent!');
            });
        },
        sendPasswordReset: function () {
            var email = document.getElementById('email').value;
            
            firebase.auth().sendPasswordResetEmail(email).then(function() {
                
                alert('Password Reset Email Sent!');

            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/invalid-email') {
                    alert(errorMessage);
                } else if (errorCode == 'auth/user-not-found') {
                    alert(errorMessage);
                }
                console.log(error);
            });
        }
    };
    utils.initialize();
    return utils;
};