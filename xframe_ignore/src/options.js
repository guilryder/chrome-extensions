chrome.storage.sync.get("sites", function (data) {
  const sites = document.getElementById("sites");
  sites.value = data.sites;
});

function logSubmit(event) {
  console.log(`Form Submitted! Time stamp: ${event.timeStamp}`);

  const sites = document.getElementById("sites");

  chrome.storage.sync.set({ sites: sites.value }, function () {
    console.log(sites.value);
  });
  event.preventDefault();
}

const form = document.getElementById("options");
form.addEventListener("submit", logSubmit);
