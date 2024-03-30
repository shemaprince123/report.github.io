// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyGr-snvaZbyq5RqUOjOqEX75DAuvCOv8",
  authDomain: "agrilearn-32be3.firebaseapp.com",
  databaseURL: "https://agrilearn-32be3-default-rtdb.firebaseio.com",
  projectId: "agrilearn-32be3",
  storageBucket: "agrilearn-32be3.appspot.com",
  messagingSenderId: "615696635566",
  appId: "1:615696635566:web:318ef141f1da30fc343f3f",
  measurementId: "G-KLFQVTYL4T",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = firebase.database();

// Get reference to 'progress' table
const progressRef = database.ref("progress");

// Retrieve data from Firebase and generate chart
progressRef.on("value", (snapshot) => {
  const allUserData = snapshot.val();
  const allSeasonsData = {};

  // Extract data for all seasons from all users
  for (const userId in allUserData) {
    const userData = allUserData[userId];

    for (const season in userData.data) {
      if (!allSeasonsData[season]) {
        allSeasonsData[season] = [];
      }
      allSeasonsData[season].push(userData.data[season].profitLoss);
    }
  }

  // Sort seasons chronologically
  const seasons = Object.keys(allSeasonsData).sort();

  // Prepare data for chart
  const datasets = [
    {
      label: "Profit/Loss",
      data: seasons.map((season) =>
        allSeasonsData[season].reduce((a, b) => a + b, 0)
      ),
      backgroundColor: "rgba(0, 119, 255, 0.2)",
      borderColor: "rgba(0, 119, 255, 1)",
      borderWidth: 1,
      pointRadius: 5,
      pointHoverRadius: 8,
    },
  ];

  // Generate chart using Chart.js
  const ctx = document.getElementById("myChart").getContext("2d");

  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: seasons,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
