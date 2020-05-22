const defaultLandscape = `
 # # # # #
# . . . . #
 # . . . #
  # . . #
   # # #
 `;

const hexagonWidth = 1.1547005;
const hexagonHeight = 1;

const kindClasses = {
  "#": "barrier",
  ".": "grass"
};

function xyToLeftTop(x, y) {
  return {
    left: `${hexagonWidth * x + (y % 2 ? 0 : hexagonWidth / 2)}em`,
    top: `${hexagonHeight * y}em`
  };
}

function renderLandscapeHexagon(kind, x, y) {
  const { left, top } = xyToLeftTop(x, y);
  const kindClass = kindClasses[kind];
  return `<div id="x${x}y${y}" class="hexagon ${kindClass}" style="left:${left}; top:${top}"></div>`;
}

function renderLandscapeRow(row, y) {
  const hexagons = row
    .replace(/ {2}/g, "X ")
    .split(" ")
    .filter(h => h !== "");
  return hexagons.reduce(
    (html, kind, x) =>
      (html += kind === "X" ? "" : renderLandscapeHexagon(kind, x, y)),
    ""
  );
}

function renderLandscape(landscape) {
  const rows = landscape.split("\n").filter(row => row !== "");
  return rows.reduce(
    (html, row, y) => (html += renderLandscapeRow(row, y)),
    ""
  );
}

const reddy = {
  background: "red",
  id: "reddy",
  x: 1,
  y: 2
};

function renderAvatars(avatar) {
  const { left, top } = xyToLeftTop(avatar.x, avatar.y);
  return `<div id="${
    avatar.id
  }" class="avatar" style="left:${left}; top:${top}; background:${
    avatar.background
  }"><div class="head"></div><div class="torso"></div><div class="left leg"></div><div class="right leg"></div></div>`;
}

document.getElementById("landscape").innerHTML = renderLandscape(
  defaultLandscape
);
document.getElementById("x1y2").classList.add("current");

document.getElementById("avatars").innerHTML = renderAvatars(reddy);

let runningTimeout;

function updateAvatarPosition(avatar, toX, toY) {
  const dx = avatar.x - toX;
  const dy = avatar.y - toY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = 500 * distance; // milliseconds
  avatar.x = toX;
  avatar.y = toY;
  const { left, top } = xyToLeftTop(avatar.x, avatar.y);
  const $avatar = document.getElementById(avatar.id);
  $avatar.style.transition = `left ${duration}ms, top ${duration}ms`;
  $avatar.style.left = left;
  $avatar.style.top = top;
  if (runningTimeout) clearTimeout(runningTimeout);
  $avatar.classList.add("running");
  setTimeout(() => $avatar.classList.remove("running"), duration);
}

function onClick(evt) {
  const { target } = evt;
  if (!target) return;
  if (target.className.includes("grass")) {
    Array.from(document.querySelectorAll(".grass.current")).forEach($div =>
      $div.classList.remove("current")
    );
    const matches = target.id.match(/x(\d+)y(\d+)/);
    updateAvatarPosition(reddy, +matches[1], +matches[2]);
    target.classList.add("current");
  }
}

document.body.addEventListener("click", onClick);
