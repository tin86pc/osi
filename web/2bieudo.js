// https://codepen.io/lirik90/pen/rNLqMVg
import { skSocket } from "./5sk.js";
import { ngay } from "./1ham.js";

var ctx = document.getElementById("chart").getContext("2d");

const mauA = "rgb(54, 162, 235)";
const mauB = "rgb(255, 99, 132)";
let offline = false;
// data
let dt = {
  datasets: [
    {
      yAxisID: "A",
      label: "Kênh A",
      type: "line",
      fill: false,
      borderColor: mauA,
    },
    {
      yAxisID: "B",
      label: "Kênh B",
      type: "line",
      fill: false,
      borderColor: mauB,
    },
  ],
};

// option
let os = {
  legend: {
    display: false,
  },
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        type: "linear",
        offset: true,
        scaleLabel: {
          // display: true,
          // labelString: "Thời gian (ms)",
        },
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "black",
        },
      },
    ],
    yAxes: [
      {
        id: "A",
        offset: true,
        position: "left",
        scaleLabel: {
          // display: true,
          // labelString: "Kênh A",
          // fontColor: mauA,
        },
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: mauA,
        },
      },
      {
        id: "B",
        offset: true,
        position: "right",
        scaleLabel: {
          // display: true,
          // labelString: "Kênh B",
          // fontColor: mauB,
        },
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: mauB,
        },
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

        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
      },
    },
  },
};

// config
let cf = {
  data: dt,
  options: os,
};

var chart = new Chart(ctx, cf);
const start = Date.now();

function xuly(s) {
  if (offline) return;
  // kiểm tra chuỗi json hợp lệ
  try {
    JSON.parse(s);
  } catch (error) {
    return false;
  }

  // lấy thời gian
  const obj = JSON.parse(s);
  const end = Date.now();
  let t = (end - start) / 1000;

  let A = obj.A;
  let B = obj.B;

  chart.data.datasets.forEach((dataset) => {
    if (dataset.yAxisID == "A") {
      if (A != "undefined") {
        dataset.data.push({ x: t, y: A });
      }
    }
    if (dataset.yAxisID == "B") {
      if (B != "undefined") {
        dataset.data.push({ x: t, y: B });
      }
    }
  });

  chart.update();
}

skSocket(xuly);

function update() {
  chart.update();
}

function option(s, v) {
  console.log(chart);
  if (s == "restZoom") {
    chart.resetZoom();
  }

  if (s == "pan") {
    chart.options.plugins.zoom.pan.enabled = v;
  }

  if (s == "zoom") {
    chart.options.plugins.zoom.zoom.enabled = v;
  }
  if (s == "kenhA") {
    chart.data.datasets.forEach((dataset) => {
      if (dataset.yAxisID == "A") {
        dataset.hidden = !v;
        return;
      }
    });
  }
  if (s == "kenhB") {
    chart.data.datasets.forEach((dataset) => {
      if (dataset.yAxisID == "B") {
        dataset.hidden = !v;
        return;
      }
    });
  }

  update();
}

function dljson() {
  var obj = { a: dt.datasets[0].data, b: dt.datasets[1].data };
  console.log(obj);

  var dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

  console.log(dataStr);
  var e = document.createElement("a");
  e.setAttribute("href", dataStr);
  e.setAttribute("download", ngay() + ".json");
  document.body.appendChild(e);
  e.click();
  e.remove();
}

function moJson() {
  console.log("mở json");
  offline = true;

  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];

  var input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.addEventListener("change", (event) => {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  });

  input.click();

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    chart.data.datasets[0].data = obj.a;
    chart.data.datasets[1].data = obj.b;
    chart.update();
  }

  chart.resetZoom();
}

export { option, dljson, moJson };
