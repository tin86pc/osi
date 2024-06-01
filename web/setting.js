"use strict";
import { toast, htnut, ghijson } from "./1ham.js";
import { send, skSocket } from "./5sk.js";

let caidat = {};

async function layDuLieu() {
  const response = await fetch("/caidat.json");
  const obj = await response.json();
  caidat = Object.assign(obj);

  Object.keys(caidat).forEach(function (key) {
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

  ghijson("caidat.json", caidat);
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
