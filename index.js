// Query selectors for convenience
var qs = document.querySelector.bind(document),
  qsa = document.querySelectorAll.bind(document);

// Remove existing containers if present
existing = qsa(".video_speed_cover, .video_speed_container");
if (existing.length) {
  existing.forEach((el) => el.remove());
}

// Utility to check if media is playing
var isPlaying = function (media) {
  return !media.paused && !media.ended && media.readyState > 2;
};

// Update the playback speed and display the current rate
var update = function (speed) {
  if (!active) {
    return;
  }

  active.playbackRate = speed;
  rate.value = speed.toFixed(2); // Display rounded value in the input box
};

// Auto-select the playing media
for (var i = 0; i < media.length; i++) {
  if (isPlaying(media[i])) {
    setVideo(media[i]);
    select.querySelectorAll("option")[i + 1].selected = "selected";
  }
}

// Set the active video/audio element
var setVideo = function (v) {
  active = v;
  update(v.playbackRate);
};

// Shortcut for creating elements
var ce = document.createElement.bind(document),
  media = qsa("video,audio"),
  active = null,
  body = qs("body"),
  container = ce("div"),
  select = ce("select"),
  options = [],
  range = ce("input"),
  rate = ce("input"), // Changed from span to input for editable speed
  cover = ce("div"),
  buttons = ce("div"),
  rateWrapper = ce("div"); // Wrapper for rate input and +/- buttons

// Add default "choose media" option
var choose = ce("option");
choose.text = "choose media";
select.appendChild(choose);

// Populate the select dropdown with media options
for (var i = 0; i < media.length; i++) {
  var o = ce("option");
  o.value = i;
  var l = media[i].nodeName === "VIDEO" ? "video" : "audio";
  o.text = `${l}: ${i + 1}`;
  options.push(o);
  select.appendChild(o);
}

// Handle media selection change
select.onchange = function () {
  var v = this.value;
  if (v) {
    setVideo(media[v]);
  }
};

// Update playback rate based on range input
range.oninput = function () {
  update(parseFloat(range.value));
};

// Close and remove the overlay
cover.onclick = function () {
  cover.remove();
  container.remove();
};

// Automatically set the first media element
if (media.length) {
  setVideo(media[0]);
  select.value = 0;
  range.value = media[0].playbackRate;
}

// Function to create speed control buttons
var createSpeedButton = function (label, speedOrAction) {
  let button = ce("button");
  button.textContent = label;
  button.style.margin = "5px";
  button.style.padding = "8px 12px";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.backgroundColor = "#007BFF";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  button.onclick = function (e) {
    e.preventDefault();
    if (typeof speedOrAction === "number") {
      update(speedOrAction);
      range.value = speedOrAction;
    } else if (speedOrAction === "start") {
      active.currentTime = 0;
    } else if (speedOrAction === "end") {
      active.currentTime = active.duration;
    } else if (speedOrAction === "increment") {
      update(active.playbackRate + 0.1);
    } else if (speedOrAction === "decrement") {
      update(active.playbackRate - 0.1);
    }
  };
  return button;
};

// Create - and + buttons
let decrementButton = createSpeedButton("-", "decrement");
let incrementButton = createSpeedButton("+", "increment");

// Handle custom playback rate input
rate.onchange = function () {
  let customSpeed = parseFloat(rate.value);
  if (
    customSpeed >= parseFloat(range.min) &&
    customSpeed <= parseFloat(range.max)
  ) {
    update(customSpeed);
    range.value = customSpeed;
  } else {
    alert(`Please enter a value between ${range.min} and ${range.max}.`);
    rate.value = active ? active.playbackRate.toFixed(2) : "1.0";
  }
};

// Append - and + buttons and rate input to the wrapper
rateWrapper.appendChild(createSpeedButton("|<", "start"));
rateWrapper.appendChild(decrementButton);
rateWrapper.appendChild(rate);
rateWrapper.appendChild(incrementButton);
rateWrapper.appendChild(createSpeedButton(">|", "end"));

// Add other buttons
buttons.appendChild(createSpeedButton("0.5", 0.5));
buttons.appendChild(createSpeedButton("0.75", 0.75));
buttons.appendChild(createSpeedButton("1", 1));
buttons.appendChild(createSpeedButton("1.5", 1.5));
buttons.appendChild(createSpeedButton("2", 2));

// Assemble the container
container.appendChild(select);
container.appendChild(rateWrapper); // Add rateWrapper instead of rate directly
container.appendChild(buttons);
body.appendChild(cover);
body.appendChild(container);

// Style `select` (Gunmetal Grey Background)
select.style.backgroundColor = "#2a3439"; // Gunmetal grey
select.style.color = "white";
select.style.padding = "5px 10px";
select.style.border = "none";
select.style.borderRadius = "4px";
select.style.fontSize = "14px";
select.style.marginBottom = "10px";

// Style the rateWrapper
rateWrapper.style.display = "flex";
rateWrapper.style.alignItems = "center";
rateWrapper.style.justifyContent = "center";
rateWrapper.style.gap = "5px";
rateWrapper.style.marginTop = "5px";

// Style the rate input field
rate.type = "number";
rate.step = "0.1";
rate.min = "0";
rate.max = "10";
rate.value = "1.0";
rate.style.textAlign = "center";
rate.style.width = "50px";
rate.style.borderRadius = "4px";
rate.style.border = "1px solid #ccc";
rate.style.padding = "5px";
rate.style.fontSize = "14px";

// Style the buttons container
buttons.style.display = "flex";
buttons.style.justifyContent = "space-evenly";
buttons.style.marginTop = "5px";

// Style the container
container.style.position = "fixed";
container.style.top = "1%";
container.style.right = "1%";
container.style.zIndex = "1000000";
container.style.background = "rgba(42, 52, 57, 0.8)"; // Semi-Transparent Gunmetal grey
container.style.borderRadius = "6px";
container.style.padding = "10px";
container.style.textAlign = "center";
container.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
container.classList.add("video_speed_container");
