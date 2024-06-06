"use strict";
import { toast, htnut, ghijson, ngay } from "./1ham.js";
import { option, dljson,moJson } from "./2bieudo.js";
import { send } from "./5sk.js";

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

  toast("Đã lưu tần số lấy mẫu " + nck + " Hz");
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

