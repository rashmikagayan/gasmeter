from firebase import firebase
firebase = firebase.FirebaseApplication(
    'https://gas-meter-29a5a-default-rtdb.firebaseio.com/', None)

readingValue = "22"
result = firebase.put(
    '/Users/b0G1q1rwCNSguSq1NUwA1pm7pXg2/', "CurrentReading", readingValue)
print(result)
