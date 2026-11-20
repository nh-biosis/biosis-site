const menuBtn = document.querySelector(".menu-btn");
const headerMenu = document.querySelector(".header-menu");
const menuLinks = headerMenu.querySelectorAll("a");

function toggleMenu(force) {
  const isOpen = typeof force === "boolean" ? force : !headerMenu.classList.contains("open");

  menuBtn.classList.toggle("active", isOpen);
  headerMenu.classList.toggle("open", isOpen);

  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");

  headerMenu.inert = !isOpen;
}

// ボタンを押したとき
menuBtn.addEventListener("click", () => {
  toggleMenu();
});

// メニュー内のリンクを押したとき
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggleMenu(false);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 図鑑データ
  const dicData = [
    {
      name: "矢印マシ",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ガブガブ",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ミュルモ",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "双子",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "クルシェル",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ウミミツク",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ぺたん",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "エイ",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ルミィ",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "メタエルモ",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "タン",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
  ];

  // 要素取得
  const popup = document.getElementById("dic-popup");
  const popupImg = popup.querySelector(".dic-popup-img");
  const popupName = popup.querySelector(".dic-popup-name");
  const popupTxt = popup.querySelector(".dic-popup-txt");

  const closeBtn = popup.querySelector(".dic-popup-close");
  const prevBtn = popup.querySelector(".dic-popup-prev");
  const nextBtn = popup.querySelector(".dic-popup-next");

  const icons = document.querySelectorAll(".dic-table .dic-td");

  let currentIndex = 0;

  // POPUP内容更新
  function updatePopup(index) {
    currentIndex = (index + dicData.length) % dicData.length;

    const data = dicData[currentIndex];

    // 既存アイコンの背景画像を取得
    const iconImg = icons[currentIndex].firstElementChild;

    const bgImage = getComputedStyle(iconImg).backgroundImage;

    popupImg.style.backgroundImage = bgImage;

    // 名前と説明
    popupName.textContent = data.name;
    popupTxt.textContent = data.text;
  }

  // POPUPを開く
  function openPopup(index) {
    updatePopup(index);

    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
  }

  // POPUPを閉じる
  function closePopup() {
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
  }

  // アイコンクリック
  icons.forEach((icon, index) => {
    icon.addEventListener("click", () => {
      openPopup(index);
    });
  });

  // 前へ
  prevBtn.addEventListener("click", () => {
    updatePopup(currentIndex - 1);
  });

  // 次へ
  nextBtn.addEventListener("click", () => {
    updatePopup(currentIndex + 1);
  });

  // 閉じる
  closeBtn.addEventListener("click", closePopup);

  // 背景クリックで閉じる
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // キーボード操作
  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;

    if (e.key === "Escape") {
      closePopup();
    }

    if (e.key === "ArrowLeft") {
      updatePopup(currentIndex - 1);
    }

    if (e.key === "ArrowRight") {
      updatePopup(currentIndex + 1);
    }
  });
});



const tableStn = document.querySelector(".table-stn");

let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

// マウスドラッグ
tableStn.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;

  isDragging = true;
  startX = e.clientX;
  startScrollLeft = tableStn.scrollLeft;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  tableStn.scrollLeft =
    startScrollLeft - (e.clientX - startX);
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// ホイール操作
tableStn.addEventListener("wheel", (e) => {
  const maxScroll =
    tableStn.scrollWidth - tableStn.clientWidth;

  if (maxScroll <= 0) return;

  // ホイールの縦方向を横方向に変換
  const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;

  const canScroll =
    (delta > 0 && tableStn.scrollLeft < maxScroll) ||
    (delta < 0 && tableStn.scrollLeft > 0);

  if (canScroll) {
    e.preventDefault();
    tableStn.scrollLeft += delta;
  }
}, { passive: false });

const scrollHint = document.querySelector(".table-scroll-hint");

tableStn.addEventListener("scroll", () => {
  scrollHint.classList.toggle(
    "is-hidden",
    tableStn.scrollLeft > 5
  );
}, { passive: true });






const historyData = [
  {
    img: "img/history01.png",
    txt: "初めてのビオシス<br>が観測される",
    name: "矢印マン",
    date: "2113"
  },
  {
    img: "img/history02.png",
    txt: "BIosis<br>プロトタイプ誕生",
    name: "Gabuga-6u",
    date: "2121"
  },
  {
    img: "img/history03.png",
    txt: "民間用初のビオシス",
    name: "ミュルモ",
    date: "2123.02"
  }
];

// 年表を自動生成
const tableScr = document.querySelector(".table-scr");

tableScr.innerHTML = historyData.map(item => `
  <div class="table-scr-itm">
    <div class="table-itm-img">
      <img src="${item.img}" alt="${item.name}" draggable="false">
    </div>
    <div class="table-itm-txt">${item.txt}</div>
    <div class="table-itm-name">${item.name}</div>
    <div class="table-itm-line"></div>
    <div class="table-itm-date">${item.date}</div>
  </div>
`).join("");
