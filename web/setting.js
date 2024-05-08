"use strict";
import { send, skSocket } from "./5sk.js";



let caidat = {
  tf: "0",
  pf: "0",
  tb: "0",
  pb: "0",
  ipf: "0",
  ipb: "0",
  ip: "0",
  p: "0",
};

async function layDuLieu() {
  const response = await fetch("/caidat.json");
  const obj = await response.json();
  caidat = Object.assign(obj);

  Object.keys(caidat).forEach(function (key) {
    // console.log(key, caidat[key]);
    set(key, caidat[key]);
  });
}

layDuLieu();

function get(id) {
  if (document.getElementById(id)) {
    return document.getElementById(id).value;
  }
}

function set(id, v) {
  if (document.getElementById(id)) {
    document.getElementById(id).value = v;
  }
}

document.getElementById("ok").addEventListener("click", (e) => {
  Object.keys(caidat).forEach(function (key) {
    caidat[key] = get(key);
  });

  const blob = new Blob([JSON.stringify(caidat)], { type: "application/json" });
  let formData = new FormData();
  formData.append("file", blob, "caidat.json");

  fetch("/u", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (response.status == 200) {
      alert("lưu thành công");
    }
  });
});

const chonWifi = document.getElementById("chonWifi");

window.onload = (e) => {
  fetch("/w", {
    method: "get",
    headers: {
      "Content-Type": "application/json ",
    },
  })
    .then((response) => response.text())
    .then((response) => {
      // console.log(response);

      response = response.replaceAll("`", '"');

      const obj = JSON.parse(response);
      const wifi = obj.wifi;

      set("ipb", obj.ip);

      wifi.forEach((element) => {
        let ten = Object.getOwnPropertyNames(element)[0];
        let option = document.createElement("option");
        option.value = ten;
        option.text = ten;
        chonWifi.add(option);
      });
    })
    .catch((err) => console.log(err));
};

chonWifi.addEventListener("change", (e) => {
  set("tb", event.target.value);
});
