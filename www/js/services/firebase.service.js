angular.module('unisys.onboarding.firebase.service', [])
    .factory('firebaseService', firebaseService);

    firebaseService.$inject = ['$q'];

function firebaseService ($q) {

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
                github: new firebase.auth.GithubAuthProvider(),
                email: 'email.com'
            };
        },
        setUser: function (user) {
            this.user = user;
        },
        getUser: function () {
            var def = $q.defer();  
            if (utils.user) {
                return utils.user;
            } else {
                firebase.auth().onAuthStateChanged(function (user) {
                    var userData = user;
                    utils.user = user;
                    def.resolve(userData);
                });                
            }
            return def.promise;
        },
        clearUser: function () {
            this.user = null;
        },
        signout: function () {
            firebase.auth().signOut();
            this.clearUser();
        },
        setLocalStorageProvider: function (provider) {
            localStorage.setItem('chosenProvider', JSON.stringify({
                "provider": provider
            }));
        },
        login: function (chosenProvider, toggleRegisterationForm) {
            var localStorageProvider = JSON.parse(localStorage.getItem("chosenProvider")) || null;
            var that = this;
            
            chosenProvider = chosenProvider || null;
            
            if (!this.user) {

                if (chosenProvider){
                    var provider = this.providers[chosenProvider];

                    switch (provider.providerId) {
                        case "google.com":
                            provider.addScope('https://www.googleapis.com/auth/plus.login');
                            this.setLocalStorageProvider(provider.providerId);
                            break;
                        case "github.com":
                            provider.addScope('repo');
                            this.setLocalStorageProvider(provider.providerId);
                            break;
                        default: 
                            this.setLocalStorageProvider(provider);
                    }
                }

                if (provider && provider !== 'email.com') {
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
                } else if (!toggleRegisterationForm) {
                    var email = document.getElementById('email').value;
                    var password = document.getElementById('password').value;
                    var that = this;
                    
                    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                        that.setUser = user;
                    }).catch(function(error) {
                    
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