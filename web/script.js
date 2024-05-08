import {} from "./5sk.js";

function genData() {
  var analogData = [];
  var digitalData = [];
  var angle = 1980;
  var limit = 35;
  for (var x = 0; x <= angle; x += 10) {
    var y = Math.sin((x * Math.PI) / 180) * limit;
    analogData.push({ x, y });

    y = x === 0 ? -limit : x === angle ? limit : y;
    if (y === limit || y === -limit) digitalData.push({ x, y: y === -limit });
  }

  return [analogData, digitalData];
}

function createConfig() {
  var [analogData, digitalData] = genData();
  return {
    data: {
      datasets: [
        {
          yAxisID: "A",
          label: "Kênh A",
          type: "line",
          fill: false,
          borderColor: "rgb(54, 162, 235)",
          data: analogData,
        },
        {
          yAxisID: "B",
          label: "Kênh B",
          type: "line",
          fill: false,
          steppedLine: true,
          borderColor: "rgb(255, 99, 132)",
          data: digitalData,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "ESP hiện sóng",
      },
      scales: {
        xAxes: [
          {
            type: "linear",
            offset: true,
            scaleLabel: { display: true, labelString: "x axis" },
          },
        ],
        yAxes: [
          {
            id: "A",
            offset: true,
            position: "left",
            scaleLabel: { display: true, labelString: "Analog" },
          },
          {
            id: "B",
            position: "right",
            scaleLabel: { display: true, labelString: "Digital" },
            ticks: { max: 2, min: -1, stepSize: 1 },
          },
        ],
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "xy",
            overScaleMode: "y",
          },
          zoom: {
            enabled: true,
            mode: "xy",
            overScaleMode: "y",
          },
        },
      },
    },
  };
}

window.onload = function () {
  var ctx = document.getElementById("canvas").getContext("2d");
  var config = createConfig();
  new Chart(ctx, config);
};
