var userid;
var rate = 1.75;
var currentBill;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var userDiv = document.getElementById("user_div");
        if (userDiv != null) {
            document.getElementById("user_div").style.display = "block";
            document.getElementById("login_div").style.display = "none";
        }

        var user = firebase.auth().currentUser;

        if (user != null) {

            var email_id = user.email;
            var currentReading = 0;
            userid = user.uid;
            var userParaDiv = document.getElementById("user_para");
            if (userParaDiv != null)
                userParaDiv.innerHTML = "Welcome : " + email_id;

            firebase.database().ref('/Users/' + userid + '/CurrentReading/').once('value').then((snapshot) => {
                currentReading = snapshot.val();
                var currentReadingDiv = document.getElementById("current_reading");
                if (currentReadingDiv != null) {
                    currentReadingDiv.innerHTML = currentReading + " Kw/h";
                }
                currentBill = addZeroes(currentReading * rate);
                document.getElementById("current_bill").innerHTML = currentBill + " AUD";
            });


        }

    } else {
        // No user is signed in.
        var userDiv = document.getElementById("user_div");
        if (userDiv != null) {
            userDiv.style.display = "none";
            document.getElementById("login_div").style.display = "block";
        }


    }
});

function login() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error : " + errorMessage);

        // ...
    });

}

function logout() {
    firebase.auth().signOut();
}

function addZeroes(num) {
    return num.toFixed(2);
}

function gotoPayment() {
    window.location = "payment.html";
}

function pay() {
    var name = document.getElementById("name").value;
    var cardNumber = document.getElementById("cardnumber").value;
    var expirationdate = document.getElementById("expirationdate").value;
    var securitycode = document.getElementById("securitycode").value;
    var timestamp = new Date();
    firebase.database().ref('Users/' + userid + '/Card').set({
        username: name,
        cardnumber: cardNumber,
        expirationdate: expirationdate,
        securitycode: securitycode
    });

    firebase.database().ref('Users/' + userid + '/Payments/' + timestamp).set({
        cardnumber: cardNumber,
        amount: currentBill + " AUD"
    });

    firebase.database().ref('/Users/' + userid).update({
        CurrentReading: 0
    });
    alert("Payment Completed ");
    window.location = "index.html";
}