'use strict';
angular.module('unisys.onboarding.loginUtils', [])
    .factory('loginUtils', loginUtils);

    loginUtils.$inject = [];

function loginUtils () {

    var config = {
        apiKey: "AIzaSyDRaQNaGdU0RZNXZEAciKlL2xtmSfMM-_M",
        authDomain: "road-rate.firebaseapp.com",
        databaseURL: "https://road-rate.firebaseio.com",
        storageBucket: "road-rate.appspot.com",
        messagingSenderId: "452486727320"
    };
    firebase.initializeApp(config);

    var utils = {
        initialize: function () {
            this.providers = {
                google: new firebase.auth.GoogleAuthProvider(),
                github: new firebase.auth.GithubAuthProvider()
            };
            this.user = {};
        },
        isUserValid: firebase.auth().onAuthStateChanged(function () {
            if (firebase.auth().currentUser) {
                return true;
            } else {
                return false;
            }
        }),
        signout: function () {
            firebase.auth().signOut();
            this.user = {};
        },
        toggleLogin: function (chosenProvider) {
            var that = this;
            if (!firebase.auth().currentUser) {
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

                if (provider) {
                    firebase.auth().signInWithPopup(provider).then(function(result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        that.user = result.user;
                        that.user.token = result.credential.accessToken;

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
                } else {
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
                }
                return true;
            }
            return false;
        }
    };
    utils.initialize();
    return utils;
};