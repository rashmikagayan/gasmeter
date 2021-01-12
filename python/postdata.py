from firebase import firebase
firebase = firebase.FirebaseApplication(
    'https://gas-meter-29a5a-default-rtdb.firebaseio.com/', None)


def updateReading(readingValue, meterNumber):
    for uid in firebase.get('Users', ""):
        fetchMeterNo = firebase.get('Users/'+uid + "/MeterNumber", "")
        if(fetchMeterNo == meterNumber):
            userId = uid
            print(uid)
            break
    updatedata = firebase.put(
        '/Users/'+userId+"/", "CurrentReading", readingValue)

    print(updatedata)


updateReading(45, "225")
