self.addEventListener("message", function (e) {
  const { file, url } = e.data;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      self.postMessage({
        status: "success",
        message: "File uploaded successfully",
      });
    } else {
      self.postMessage({ status: "error", message: "Upload failed" });
    }
  };

  xhr.onerror = function () {
    self.postMessage({ status: "error", message: "Upload failed" });
  };

  const formData = new FormData();
  formData.append("file", file);
  xhr.send(formData);
});
