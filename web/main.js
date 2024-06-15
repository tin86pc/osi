"use strict";
import { toast, htnut, ghijson, layDuLieu } from "./1ham.js";
import { option, dljson, moJson } from "./2bieudo.js";
import { send } from "./5sk.js";

layDuLieu("/caidat.json").then((cd) => {
  if (cd != false) {
    if (cd.T != undefined) {
      document.getElementById("ts").value = cd.T;
    }
  }
  else {
    document.getElementById("ts").value = 1000000;
  }
});

document.getElementById("bat").addEventListener("click", (e) => {
  const v = htnut(e.target.id);
  if (v == true) {
    send("bat");
    option("bat")
    return;
  }
  if (v == false) {
    send("tat");
    return;
  }
});

document.getElementById("caidat").addEventListener("click", () => {
  window.open("/s", "_blank");
});

document.getElementById("ok").addEventListener("click", () => {
  const ck = document.getElementById("ts");
  const nck = parseFloat(ck.value);
  if (isNaN(parseFloat(nck))) {
    return;
  }
  send(nck);

  layDuLieu("/caidat.json").then((cd) => {
    cd.T = nck;
    ghijson("caidat.json", cd);
  });
});

document.getElementById("reset_zoom").addEventListener("click", (e) => {
  option("restZoom");
  toast("Reset Zoom");
});

document.getElementById("reset").addEventListener("click", (e) => {
  console.log("Reset");
  location.reload();
});

document.getElementById("zoom").addEventListener("click", (e) => {
  const v = htnut(e.target.id);
  option("zoom", v);
});

document.getElementById("a").addEventListener("click", (e) => {
  const v = htnut(e.target.id);
  option("kenhA", v);
});

document.getElementById("b").addEventListener("click", (e) => {
  const v = htnut(e.target.id);
  option("kenhB", v);
});

document.getElementById("pan").addEventListener("click", (e) => {
  const v = htnut(e.target.id);
  option("pan", v);
});

document.getElementById("luu").addEventListener("click", (e) => {
  toast("Lưu");
  dljson();
});

document.getElementById("mo").addEventListener("click", (e) => {
  toast("Mở");
  moJson();
});
