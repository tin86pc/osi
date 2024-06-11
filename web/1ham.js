function toast(s) {
  var x = document.getElementById("snackbar");
  x.innerHTML = s;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
function htnut(e) {
  const de = document.getElementById(e);

  if (de.classList.contains("bat")) {
    de.classList.remove("bat");
    de.classList.add("tat");

    toast("Tắt " + de.innerHTML);
    return false;
  }

  if (de.classList.contains("tat")) {
    de.classList.add("bat");
    de.classList.remove("tat");

    toast("Bật " + de.innerHTML);
    return true;
  }
}

function ghijson(t, d) {
  const blob = new Blob([JSON.stringify(d)], { type: "application/json" });
  let formData = new FormData();
  formData.append("file", blob, t);

  fetch("/u", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (response.status == 200) {
      toast("lưu thành công");
    }
  });
}

function ngay() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}.${month}.${year}`;
  return currentDate;
}

async function layDuLieu(s) {
  const response = await fetch(s);
  const obj = await response.json();
  return Object.assign(obj);
}



export { toast, htnut, ghijson, ngay, layDuLieu };
