var books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    section: "currently-reading",
    genre: "Self-help",
    status: "Ongoing",
    vibe: "Discipline",
    cover: "assets/atomic-cover.jpeg",
    pages: 320,
    year: 2018,
    rating: 0,
    progress: 5,
    mood: "Extreme Happiness & Motivation",
    quote: "Your outcomes are a lagging measure of your habits. Your net worth is a lagging measure of your financial habits. Your weight is a lagging measure of your eating habits. Your knowledge is a lagging measure of your learning habits. Your clutter is a lagging measure of your cleaning habits. You get what you repeat.",
    shortNote: "On my TBR because I want a clean system for discipline that helps me incorporate better habits without feeling overwhelmed.",
    thoughts: "This is one of those books I want to read because I do not just want motivation, I want structure. I like the idea of tiny habits instead of dramatic life overhauls. I feel like it matches the kind of better-version-of-you energy I love, but in a realistic way.",
    review: "I'm only at the beginning of it so far but my gosh is it GOOD! It's so smooth and filled with so much practical advice that actually makes sense as well as evidence and facts.",
    whySave: "For those days when motivation is low and I need systems instead of vibes alone."
  }
];

var demoPlaylist = [
  {
    key: "trailer",
    title: "Trailer: What is The Sae Talk?",
    description: "A tiny intro to the vibe.",
    src: "episodes/trailer.mp3"
  },
  {
    key: "episode1",
    title: "The Story Behind The Sae Talk + Get To Know Me",
    description: "Every podcast has a beginning.",
    src: "episodes/ep1.mp3"
  },
  {
    key: "episode2",
    title: "Episode 2: Romanticize Your Routine",
    description: "Make your habits feel pretty.",
    src: ""
  }
];

var currentProfile = "saesvibe";
var activeSection = "all";
var activeGenre = "all";
var searchValue = "";
var currentTrackIndex = 0;
var isDragging = false;

function $(id) {
  return document.getElementById(id);
}

function showToast(message) {
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  $("toastWrap").appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add("show");
  });

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      toast.remove();
    }, 260);
  }, 2300);
}

function switchProfile(profile) {
  currentProfile = profile;

  $("profileSv").classList.toggle("active", profile === "saesvibe");
  $("profileSt").classList.toggle("active", profile === "saetalk");

  $("brandText").textContent = profile === "saesvibe" ? "saesvibe" : "The Sae Talk";

  $("heroTextSv").style.display = profile === "saesvibe" ? "" : "none";
  $("heroTextSt").style.display = profile === "saetalk" ? "" : "none";

  $("socialSv").style.display = profile === "saesvibe" ? "" : "none";
  $("socialSt").style.display = profile === "saetalk" ? "" : "none";

  $("svContent").style.display = profile === "saesvibe" ? "" : "none";
  $("stContent").style.display = profile === "saetalk" ? "" : "none";

  $("navSv").style.display = profile === "saesvibe" ? "" : "none";
  $("navSt").style.display = profile === "saetalk" ? "" : "none";

  $("mobileNavSv").style.display = profile === "saesvibe" ? "" : "none";
  $("mobileNavSt").style.display = profile === "saetalk" ? "" : "none";

  window.scrollTo({ top: 0, behavior: "smooth" });

  requestAnimationFrame(function () {
    var content = profile === "saesvibe" ? $("svContent") : $("stContent");
    var items = content.querySelectorAll(".reveal:not(.visible)");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("visible");
    }
  });

  showToast(profile === "saesvibe" ? "Switched to saesvibe 💗" : "Switched to The Sae Talk 🎧");
}

$("profileSv").addEventListener("click", function () {
  switchProfile("saesvibe");
});

$("profileSt").addEventListener("click", function () {
  switchProfile("saetalk");
});

/* ===== LOGO UPLOAD ===== */
function setupAvatarUpload(avatarId, inputId, storageKey) {
  var avatar = $(avatarId);
  var input = $(inputId);

  if (!avatar || !input) return;

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved) {
      var img = avatar.querySelector("img");
      if (img) {
        img.src = saved;
        img.style.display = "";
      }
    }
  } catch (e) {}

  avatar.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    input.value = "";
    input.click();
  });

  var lpTimer = null;

  avatar.addEventListener("touchstart", function (e) {
    lpTimer = setTimeout(function () {
      e.preventDefault();
      input.value = "";
      input.click();
    }, 600);
  }, { passive: false });

  avatar.addEventListener("touchend", function () {
    clearTimeout(lpTimer);
  });

  avatar.addEventListener("touchmove", function () {
    clearTimeout(lpTimer);
  });

  input.addEventListener("change", function () {
    var file = input.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (e) {
      var img = avatar.querySelector("img");
      if (img) {
        img.src = e.target.result;
        img.style.display = "";
        img.onerror = null;
      }

      try {
        localStorage.setItem(storageKey, e.target.result);
      } catch (err) {}

      showToast("Logo updated! 💗");
    };

    reader.readAsDataURL(file);
  });
}

setupAvatarUpload("profileSv", "uploadSv", "saesvibe-avatar-logo");
setupAvatarUpload("profileSt", "uploadSt", "saetalk-avatar-logo");

$("scrollTopBtn").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("floatingTopBtn").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("heartSheet").classList.remove("open");
});

function handleScrollTarget(selector) {
  var target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.querySelectorAll("[data-scroll]").forEach(function (button) {
  button.addEventListener("click", function () {
    handleScrollTarget(button.dataset.scroll);

    if ($("heartSheet").classList.contains("open")) {
      $("heartSheet").classList.remove("open");
    }
  });
});

function setTheme(theme, showToastMessage) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("saesvibe-theme", theme);
  $("themeToggle").textContent = theme === "night" ? "☀️" : "🌙";

  if (showToastMessage !== false) {
    showToast(theme === "night" ? "Night mode on 🌙" : "Pink mode on 💗");
  }
}

$("themeToggle").addEventListener("click", function () {
  var currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === "night" ? "pink" : "night");
});

$("copySocialsBtn").addEventListener("click", function () {
  var text =
    "Instagram: https://instagram.com/saesvibe\n" +
    "TikTok: https://tiktok.com/@saesvibee\n" +
    "YouTube: https://youtube.com/@saesvibee\n" +
    "Pinterest: https://pinterest.com/saesvibe\n" +
    "Threads: https://threads.net/@saesvibe\n" +
    "Beacons: https://beacons.ai/saesvibe\n" +
    "Email: saesvibe.collabs@gmail.com";

  navigator.clipboard.writeText(text).then(function () {
    showToast("Socials copied 💗");
  }).catch(function () {
    showToast("Could not copy");
  });
});

$("floatingHeartBtn").addEventListener("click", function () {
  $("heartSheet").classList.toggle("open");
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".floating-heart-wrap")) {
    $("heartSheet").classList.remove("open");
  }
});

if ($("contactForm")) {
  $("contactForm").addEventListener("submit", function () {
    $("contactStatus").textContent = "Your message is on its way to me 💌✨";
  });
}

if ($("contactFormSt")) {
  $("contactFormSt").addEventListener("submit", function () {
    $("stContactStatus").textContent = "Your message is on its way to me 🎧💌✨";
  });
}

function labelizeSection(value) {
  return {
    "currently-reading": "Currently Reading",
    "to-be-read": "To-Be-Read",
    "recently-read": "Recently Read",
    "favorites": "Favorites"
  }[value] || value;
}

function renderBooks() {
  var filtered = books.filter(function (book) {
    return (
      (activeSection === "all" || book.section === activeSection) &&
      (activeGenre === "all" || book.genre === activeGenre) &&
      (!searchValue ||
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue))
    );
  });

  if (!filtered.length) {
    $("booksGrid").innerHTML =
      '<div class="book-empty-state"><div class="book-empty-icon">🌷</div><h4>No books found</h4><p>Try another section, genre, or search.</p></div>';
    return;
  }

  $("booksGrid").innerHTML = filtered.map(function (book) {
    return (
      '<div class="book-grid-card" data-book-id="' + book.id + '">' +
        '<div class="book-grid-cover">' +
          (book.cover ? '<img src="' + book.cover + '" alt="' + book.title + '">' : book.title) +
        '</div>' +
        '<div class="book-grid-info">' +
          '<h4>' + book.title + '</h4>' +
          '<p class="author">by ' + book.author + '</p>' +
          '<div class="book-grid-badges">' +
            '<span class="book-grid-badge">' + labelizeSection(book.section) + '</span>' +
            '<span class="book-grid-badge">' + book.genre + '</span>' +
            (book.progress ? '<span class="book-grid-badge">' + book.progress + '%</span>' : '') +
          '</div>' +
          '<p class="book-grid-note">' + book.shortNote + '</p>' +
        '</div>' +
      '</div>'
    );
  }).join("");

  $("booksGrid").querySelectorAll(".book-grid-card").forEach(function (card) {
    card.addEventListener("click", function () {
      openBookModal(Number(card.dataset.bookId));
    });
  });
}

function openBookModal(id) {
  var book = books.find(function (item) {
    return item.id === id;
  });

  if (!book) return;

  $("bookModalInner").innerHTML =
    '<div class="book-modal-top">' +
      '<div class="book-modal-cover">' +
        (book.cover ? '<img src="' + book.cover + '" alt="' + book.title + '">' : book.title) +
      '</div>' +
      '<div class="book-modal-meta">' +
        '<h4>' + book.title + '</h4>' +
        '<p class="book-modal-author">by ' + book.author + '</p>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
          '<span class="stars" style="--rating:' + (book.rating || 0) + ';--star-size:18px;"></span>' +
          '<span class="rating-number">' + (book.rating ? book.rating + '/5' : 'Not rated yet') + '</span>' +
        '</div>' +
        '<div class="book-modal-badges">' +
          '<span class="detail-meta-pill">' + book.pages + ' pages</span>' +
          '<span class="detail-meta-pill">' + book.year + '</span>' +
          '<span class="detail-meta-pill">' + book.genre + '</span>' +
          '<span class="detail-meta-pill">' + book.status + '</span>' +
        '</div>' +
        '<div class="book-modal-badges">' +
          '<span class="detail-badge">' + labelizeSection(book.section) + '</span>' +
          '<span class="detail-badge">' + book.vibe + '</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="book-modal-box"><h5>Current thoughts</h5><p>' + book.thoughts + '</p></div>' +
    '<div class="book-modal-box"><h5>Mini review</h5><p>' + book.review + '</p></div>' +
    '<div class="book-modal-grid">' +
      '<div class="book-modal-box"><h5>Reading mood</h5><p>' + book.mood + '</p></div>' +
      '<div class="book-modal-box"><h5>Favorite quote</h5><p class="quote-box">' + book.quote + '</p></div>' +
    '</div>' +
    (book.section === "currently-reading"
      ? '<div class="book-modal-box"><h5>Reading progress</h5><div class="progress-wrap"><div class="progress-label">' + book.progress + '% finished</div><div class="progress-bar"><div class="progress-fill" style="width:' + book.progress + '%;"></div></div></div></div>'
      : '') +
    '<div class="book-modal-grid">' +
      '<div class="book-modal-box"><h5>Vibe</h5><p>' + book.vibe + '</p></div>' +
      '<div class="book-modal-box"><h5>Why I saved it</h5><p>' + book.whySave + '</p></div>' +
    '</div>';

  $("bookModalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBookModal() {
  $("bookModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

$("bookModalClose").addEventListener("click", closeBookModal);

$("bookModalOverlay").addEventListener("click", function (e) {
  if (e.target === $("bookModalOverlay")) {
    closeBookModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeBookModal();
  }
});

document.addEventListener("click", function (e) {
  var btn = e.target.closest(".segment-btn");
  if (!btn) return;

  btn.parentElement.querySelectorAll(".segment-btn").forEach(function (button) {
    button.classList.remove("active");
  });

  btn.classList.add("active");

  if (btn.dataset.section) activeSection = btn.dataset.section;
  if (btn.dataset.genre) activeGenre = btn.dataset.genre;

  renderBooks();
});

$("bookSearch").addEventListener("input", function (e) {
  searchValue = e.target.value.trim().toLowerCase();
  renderBooks();
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return Math.floor(seconds / 60) + ":" + Math.floor(seconds % 60).toString().padStart(2, "0");
}

function loadTrack(index, autoPlay) {
  currentTrackIndex = (index + demoPlaylist.length) % demoPlaylist.length;
  var track = demoPlaylist[currentTrackIndex];

  $("mainAudio").pause();
  $("mainAudio").src = track.src;
  $("mainAudio").load();

  $("playerTitleNew").textContent = track.title;
  $("playerDescNew").textContent = track.description;
  $("playerStatusText").textContent = "Ready to play";
  $("currentTimeNew").textContent = "0:00";
  $("durationNew").textContent = "0:00";
  $("progressFillNew").style.width = "0%";
  $("playPauseBtnNew").textContent = "▶";

  if (autoPlay) {
    $("mainAudio").play().then(function () {
      $("playPauseBtnNew").textContent = "❚❚";
      $("playerStatusText").textContent = "Now playing";
    }).catch(function () {
      $("playerStatusText").textContent = "Could not play";
    });
  }
}

$("playPauseBtnNew").addEventListener("click", function () {
  if (!$("mainAudio").src) {
    loadTrack(currentTrackIndex, true);
    return;
  }

  if ($("mainAudio").paused) {
    $("mainAudio").play().then(function () {
      $("playPauseBtnNew").textContent = "❚❚";
      $("playerStatusText").textContent = "Now playing";
    }).catch(function () {
      showToast("Could not play");
    });
  } else {
    $("mainAudio").pause();
    $("playPauseBtnNew").textContent = "▶";
    $("playerStatusText").textContent = "Paused";
  }
});

$("prevBtn").addEventListener("click", function () {
  loadTrack(currentTrackIndex - 1, true);
});

$("nextBtn").addEventListener("click", function () {
  loadTrack(currentTrackIndex + 1, true);
});

$("mainAudio").addEventListener("loadedmetadata", function () {
  $("durationNew").textContent = formatTime($("mainAudio").duration);
});

$("mainAudio").addEventListener("timeupdate", function () {
  var current = $("mainAudio").currentTime || 0;
  var duration = $("mainAudio").duration || 0;

  $("currentTimeNew").textContent = formatTime(current);
  $("durationNew").textContent = formatTime(duration);
  $("progressFillNew").style.width = (duration ? (current / duration) * 100 : 0) + "%";
});

$("mainAudio").addEventListener("play", function () {
  $("playPauseBtnNew").textContent = "❚❚";
  $("playerStatusText").textContent = "Now playing";
});

$("mainAudio").addEventListener("pause", function () {
  if ($("mainAudio").currentTime < $("mainAudio").duration || !Number.isFinite($("mainAudio").duration)) {
    $("playPauseBtnNew").textContent = "▶";
  }
});

$("mainAudio").addEventListener("ended", function () {
  $("playPauseBtnNew").textContent = "▶";
  $("playerStatusText").textContent = "Preview ended";
  $("progressFillNew").style.width = "100%";
});

$("progressBarNew").addEventListener("click", function (e) {
  if (!$("mainAudio").duration) return;

  var rect = $("progressBarNew").getBoundingClientRect();
  var percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  $("mainAudio").currentTime = percent * $("mainAudio").duration;
});

document.addEventListener("click", function (e) {
  if (isDragging) return;

  var btn = e.target.closest(".podcast-load-btn");
  if (!btn) return;

  e.stopPropagation();

  var index = demoPlaylist.findIndex(function (track) {
    return track.key === btn.dataset.audio;
  });

  if (index === -1) return;

  loadTrack(index, true);

  var playerSection = document.querySelector("#player");
  if (playerSection) {
    playerSection.scrollIntoView({ behavior: "smooth" });
  }
});

var podcastTrack = $("podcastTrack");

if (podcastTrack && $("podcastArrowLeft") && $("podcastArrowRight")) {
  var scrollAmount = 324;

  $("podcastArrowRight").addEventListener("click", function () {
    podcastTrack.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  $("podcastArrowLeft").addEventListener("click", function () {
    podcastTrack.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  var isDown = false;
  var startX;
  var scrollLeft;

  podcastTrack.addEventListener("mousedown", function (e) {
    isDown = true;
    isDragging = false;
    podcastTrack.classList.add("dragging");
    startX = e.pageX - podcastTrack.offsetLeft;
    scrollLeft = podcastTrack.scrollLeft;
  });

  podcastTrack.addEventListener("mouseleave", function () {
    isDown = false;
    podcastTrack.classList.remove("dragging");
  });

  podcastTrack.addEventListener("mouseup", function () {
    isDown = false;
    podcastTrack.classList.remove("dragging");
    setTimeout(function () {
      isDragging = false;
    }, 50);
  });

  podcastTrack.addEventListener("mousemove", function (e) {
    if (!isDown) return;

    var walk = (e.pageX - podcastTrack.offsetLeft) - startX;
    if (Math.abs(walk) > 5) isDragging = true;

    e.preventDefault();
    podcastTrack.scrollLeft = scrollLeft - walk * 1.2;
  });

  podcastTrack.addEventListener("touchstart", function (e) {
    startX = e.touches[0].pageX;
    scrollLeft = podcastTrack.scrollLeft;
  });

  podcastTrack.addEventListener("touchmove", function (e) {
    podcastTrack.scrollLeft = scrollLeft - ((e.touches[0].pageX - startX) * 1.2);
  });

  podcastTrack.addEventListener("touchend", function () {
    setTimeout(function () {
      isDragging = false;
    }, 50);
  });
}

var mobileNavScroll = $("mobileNavScroll");

if ($("mobileNavLeft")) {
  $("mobileNavLeft").addEventListener("click", function () {
    if (mobileNavScroll) {
      mobileNavScroll.scrollBy({ left: -200, behavior: "smooth" });
    }
  });
}

if ($("mobileNavRight")) {
  $("mobileNavRight").addEventListener("click", function () {
    if (mobileNavScroll) {
      mobileNavScroll.scrollBy({ left: 200, behavior: "smooth" });
    }
  });
}

var sections = document.querySelectorAll("section[id]");
var navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  var scrollY = window.scrollY + 160;

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];

    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      for (var j = 0; j < navLinks.length; j++) {
        var link = navLinks[j];
        if (link.offsetParent !== null) {
          link.classList.toggle("active", link.dataset.scroll === "#" + section.id);
        }
      }
    }
  }
}

var revealItems = document.querySelectorAll(".reveal");

var revealObserver = new IntersectionObserver(function (entries) {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      entries[i].target.classList.add("visible");
    }
  }
}, { threshold: 0.14 });

for (var i = 0; i < revealItems.length; i++) {
  if (!revealItems[i].classList.contains("visible")) {
    revealObserver.observe(revealItems[i]);
  }
}

setTheme(
  (localStorage.getItem("saesvibe-theme") === "night" || localStorage.getItem("saesvibe-theme") === "pink")
    ? localStorage.getItem("saesvibe-theme")
    : "pink",
  false
);

switchProfile("saesvibe");
renderBooks();
loadTrack(0, false);
updateActiveNav();
window.addEventListener("scroll", updateActiveNav);