(function () {
  var CATEGORIES = ["전체", "뉴트리라이트", "아티스트리", "홈리빙", "이스프링"];
  var videos = Array.isArray(window.VIDEOS) ? window.VIDEOS : [];
  var active = "전체";
  var query = "";

  var tabsEl = document.getElementById("tabs");
  var gridEl = document.getElementById("grid");
  var countEl = document.getElementById("count");
  var emptyEl = document.getElementById("empty");
  var searchEl = document.getElementById("search");
  var modal = document.getElementById("modal");
  var player = document.getElementById("player");
  var tabsBar = document.querySelector(".tabs-bar");

  function compact(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "");
  }

  function visibleVideos() {
    var needle = compact(query);
    return videos.filter(function (video) {
      if (active !== "전체" && video.category !== active) return false;
      if (!needle) return true;
      return compact(video.title).indexOf(needle) !== -1;
    });
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    CATEGORIES.forEach(function (name) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", name === active ? "true" : "false");
      button.textContent = name;
      button.addEventListener("click", function () {
        active = name;
        renderTabs();
        renderGrid();
      });
      tabsEl.appendChild(button);
    });
  }

  function renderGrid() {
    var list = visibleVideos();
    gridEl.innerHTML = "";
    countEl.textContent = list.length + "개 영상";
    emptyEl.hidden = list.length !== 0;

    list.forEach(function (video) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.setAttribute("aria-label", video.title + " 재생");

      var img = document.createElement("img");
      img.className = "thumb";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.src = "https://i.ytimg.com/vi/" + encodeURIComponent(video.id) + "/hqdefault.jpg";

      var body = document.createElement("div");
      body.className = "card-body";

      var badge = document.createElement("span");
      badge.className = "badge" + (video.type === "데모·실험" ? " demo" : "");
      badge.textContent = video.type;

      var title = document.createElement("h2");
      title.textContent = video.title;

      var channel = document.createElement("p");
      channel.className = "channel";
      channel.textContent = video.channel;

      body.appendChild(badge);
      body.appendChild(title);
      body.appendChild(channel);
      card.appendChild(img);
      card.appendChild(body);
      card.addEventListener("click", function () {
        openModal(video);
      });
      gridEl.appendChild(card);
    });
  }

  function openModal(video) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(video.id)) return;
    document.getElementById("modal-title").textContent = video.title;
    document.getElementById("modal-channel").textContent = video.channel;
    document.getElementById("modal-note").textContent = video.note;
    var typeEl = document.getElementById("modal-type");
    typeEl.textContent = video.type;
    typeEl.className = "badge" + (video.type === "데모·실험" ? " demo" : "");
    var link = document.getElementById("modal-link");
    link.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(video.id);
    player.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(video.id) +
      "?autoplay=1&rel=0";
    if (typeof modal.showModal === "function" && !modal.open) {
      modal.showModal();
    }
  }

  function stopPlayer() {
    player.src = "about:blank";
  }

  function closeModal() {
    stopPlayer();
    if (modal.open) modal.close();
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener("close", stopPlayer);

  searchEl.addEventListener("input", function () {
    query = searchEl.value;
    renderGrid();
  });

  function markStuck() {
    tabsBar.classList.toggle("is-stuck", tabsBar.getBoundingClientRect().top <= 0);
  }
  window.addEventListener("scroll", markStuck, { passive: true });

  renderTabs();
  renderGrid();
  markStuck();
})();
