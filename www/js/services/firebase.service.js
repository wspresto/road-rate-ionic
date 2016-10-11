angular.module('unisys.onboarding.firebase.service', [])
    .factory('firebaseService', firebaseService);

    firebaseService.$inject = ['$q', 'FIREBASE_CONFIG'];

function firebaseService ($q, FIREBASE_CONFIG) {
    firebase.initializeApp(FIREBASE_CONFIG);

    var utils = {
        initialize: function () {
            this.user = null;
            this.providers = {
                google: new firebase.auth.GoogleAuthProvider(),
                email: 'email.com'
            };
        },
        setUser: function (user) {
            this.user = user;
        },
        getUser: function () {
            var def = $q.defer();
            var that = this;
            if (this.user) {
                return this.user;
            } else {
                firebase.auth().onAuthStateChanged(function (user) {
                    var userData = user;
                    this.user = user;
                    def.resolve(userData);
                });                
            }
            return def.promise;
        },
        signout: function () {
            firebase.auth().signOut();
            this.setUser(null);
        },
        setLocalStorageProvider: function (provider) {
            localStorage.setItem('chosenProvider', JSON.stringify({
                "provider": provider
            }));
        },
        login: function (chosenProvider, toggleRegisterationForm) {
            var localStorageProvider = JSON.parse(localStorage.getItem("chosenProvider")) || null;
            var def = $q.defer();
            var that = this;
            that.error = {};
            
            chosenProvider = chosenProvider || null;
            
            if (!this.user) {

                if (chosenProvider){
                    var provider = this.providers[chosenProvider];

                    switch (provider.providerId) {
                        case "google.com":
                            provider.addScope('https://www.googleapis.com/auth/plus.login');
                            this.setLocalStorageProvider(provider.providerId);
                            break;
                        default: 
                            this.setLocalStorageProvider(provider);
                    }
                }

                if (provider && provider !== 'email.com') {
                    firebase.auth().signInWithCredential(provider(googleUser.getAuthResponse().id_token)).then(function(result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        that.setUser(result.user);
                        that.user.token = result.credential.accessToken;

                    }).catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;

                        def.resolve(error);
                    });
                } else if (!toggleRegisterationForm) {
                    var email = document.getElementById('email').value;
                    var password = document.getElementById('password').value;
                    var that = this;

                    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                        that.setUser = user;
                    }).catch(function(error) {

                        var errorCode = error.code;
                        var errorMessage = error.message;

                        def.resolve(error);
                    });
                } else {
                    this.handleSignUp(toggleRegisterationForm);
                }
            }
            return def.promise;
        },
        handleSignUp: function (toggleRegistrationForm) {
            var fullName = document.getElementById('full-name').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var confirmEmail = document.getElementById('confirm-email').value;
            var confirmPassword = document.getElementById('confirm-password').value;
            var that = this;

            if (toggleRegistrationForm) {
                if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
                    return;
                }

                if (password.value !== confirmPassword.value) {
                    return;
                }
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (user) {
                    user.providerData.displayName = fullName;
                    that.setUser(user);
                })
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    return error;
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