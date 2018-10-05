// Initialize Firebase
var config = {
    apiKey: "AIzaSyBJlw9b1BiYreaS_p7VRRJExbT9R4mCC88",
    authDomain: "whatever-a91b8.firebaseapp.com",
    databaseURL: "https://whatever-a91b8.firebaseio.com",
    projectId: "whatever-a91b8",
    storageBucket: "whatever-a91b8.appspot.com",
    messagingSenderId: "1093653983034"
};
firebase.initializeApp(config);
var database = firebase.database();

// Add on Click handler for adding train button
$("#addTrainButton").on("click", function (event) {
    event.preventDefault();
    console.log("clicked")

    // Grab admnin input of new train
    var addTrainName = $("#addTrainName").val().trim();
    var addDestination = $("#addDestination").val().trim();
    var addFirstTrain = moment($("#addFirstTrain").val().trim(), "HH:mm").unix();  //unix time formatt 
    var addFrequency = $("#addFrequency").val().trim();

    // save new train as local variable and push to database
    var newTrain = {
        trainName: addTrainName,
        destination: addDestination,
        firstTrain: addFirstTrain,
        frequency: addFrequency
    }
    database.ref().push(newTrain);
    console.log(newTrain);
});

// add firebase watcher 
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // store as variables
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;
    // test ...
    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrain);
    // console.log(frequency);

    // use moment.js to calculate current time, difference, next arrival, and minutes away
    var hhfirstTrain = moment.unix(firstTrain).format("hh:mm A"); //first train time
    console.log('first train ' + hhfirstTrain);
    var currentTime = moment().format("hh:mm A");           //current time
    console.log('current time ' + currentTime);

    var difference = moment().diff(moment(hhfirstTrain, 'hh:mm'), 'minutes');               //difference between 1st train and current time
    var minsAway = frequency - (difference % frequency);                              //minutes until next train
    var nextArrival = moment().add(minsAway, "minutes").format("hh:mm A");      //next arrival time
   
    console.log('difference ' + difference);
    console.log('mins away ' + minsAway);
    console.log('next train ' + nextArrival);

    // var isBeforeFirstTrain;
    //     if (isBeforeFirstTrain){
    //         minsAway = moment();
    //     }

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minsAway)
    );

    // Append new train row to schedule table
    $("#currentSchedule > tbody").append(newRow);


});

//Add current date and time to schedule  
var currentDate = moment().format("MMMM DD, YYYY")      //current date 
var currentTime = moment().format("hh:mm A");           //current time
$("#currentDate").text(currentDate);
$("#currentTime").text(currentTime);