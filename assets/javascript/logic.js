// Initialize Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAGbOVN4Kokhrn9MPAf6pRjS8B0bE10g2g",
    authDomain: "traintime-table.firebaseapp.com",
    databaseURL: "https://traintime-table.firebaseio.com/",
    projectId: "traintime-table",
    storageBucket: "traintime-table.appspot.com",
    messagingSenderId: "217321435191",
    appId: "1:217321435191:web:18e788591277533e038fb2",
    measurementId: "G-7XJZS934CN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var trainData = firebase.database();

$("#add-train-btn").on("click", function (event) {
    // Prevent the default form submit behavior
    event.preventDefault();

    // Grabs user input
    var trainName = $("#input-train").val().trim();
    var destination = $("#input-dest").val().trim();
    var firstTrain = $("#input-first-train").val().trim();
    var frequency = $("#input-freq").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    // Uploads train data to the database
    trainData.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#input-name").val("");
    $("#input-dest").val("");
    $("#input-first-train").val("");
    $("#input-freq").val("");
});

trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
        .hours(timeArr[0])
        .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    // If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the current time
        tArrival = moment()
            .add(tMinutes, "m")
            .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add each train's data into the table
    $("#train-table > tbody").append(
        $("<tr>").append(
            $("<td>").text(tName),
            $("<td>").text(tDestination),
            $("<td>").text(tFrequency),
            $("<td>").text(tArrival),
            $("<td>").text(tMinutes)
        )
    );
});