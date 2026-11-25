const bg = document.getElementById("floating-bg");

const random = (min, max) =>
  Math.random() * (max - min) + min;

// 数値を滑らかに補間する関数
const lerp = (min, max, z) =>
  min + (max - min) * z;


// ===== 全体設定 =====

const count = 11;

// 基本移動速度
const baseSpeed = 0.025;

// 回転角度
const rotation = 15;

// 上下の揺れ幅
const sway = 0.008;

// 奥行き移動の周期（秒）
const depthPeriod = 25;

// 遠景と近景の設定
const far = {
  size: 8,
  opacity: 0.25,
  blur: 2.5,
  speed: 0.5,
};

const near = {
  size: 30,
  opacity: 1,
  blur: 0,
  speed: 2,
};


// ===== キャラクター生成 =====

const objects = Array.from(
  { length: count },
  (_, i) => {
    const img = document.createElement("img");

    img.src = `img/chara${i + 1}.png`;
    img.className = "floating-chara";
    img.alt = "";
    img.draggable = false;

    bg.appendChild(img);

    return {
      element: img,

      // 初期位置
      x: random(0.15, 0.85),
      y: random(0.15, 0.85),

      // 移動方向
      angle: random(0, Math.PI * 2),

      // 動きの個体差
      phase: random(0, Math.PI * 2),
      frequency: random(0.5, 1.2),
      turn: random(0.3, 0.8),
      speed: random(0.8, 1.2),

      // 奥行きの個体差
      depthPhase: random(0, Math.PI * 2),
      depthSpeed: random(0.7, 1.3),
    };
  }
);


// ===== アニメーション =====

let lastTime = null;
let elapsed = 0;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function animate(now) {

  const dt = lastTime === null
    ? 0
    : Math.min((now - lastTime) / 1000, 0.05);

  lastTime = now;

  const step = reducedMotion.matches ? 0 : dt;
  elapsed += step;

  const width = bg.clientWidth;
  const height = bg.clientHeight;
  const unit = Math.min(width, height);

  if (!width || !height) {
    requestAnimationFrame(animate);
    return;
  }

  objects.forEach((obj) => {

    const img = obj.element;

    // 奥行き（0〜1）
    const z = (
      Math.sin(
        elapsed *
        (Math.PI * 2 / depthPeriod) *
        obj.depthSpeed +
        obj.depthPhase
      ) + 1
    ) / 2;


    // ===== 奥行きに応じた変化 =====

    const size = lerp(far.size, near.size, z);

    const opacity = lerp(
      far.opacity, near.opacity, z
    );

    const blur = lerp(far.blur, near.blur, z);

    const speed =
      baseSpeed *
      lerp(far.speed, near.speed, z) *
      obj.speed;

    img.style.width = `${size}%`;
    img.style.opacity = opacity;
    img.style.filter = `blur(${blur}px)`;
    img.style.zIndex = Math.round(z * 100);


    // ===== 上下左右の移動 =====

    obj.angle += Math.sin(
      elapsed * obj.frequency + obj.phase
    ) * obj.turn * step;

    obj.x +=
      Math.cos(obj.angle) *
      speed * step * unit / width;

    obj.y +=
      Math.sin(obj.angle) *
      speed * step * unit / height;


    // ===== 画面端での方向転換 =====

    const halfW = Math.min(
      0.5, img.offsetWidth / width / 2
    );

    const halfH = Math.min(
      0.5, img.offsetHeight / height / 2
    );

    if (obj.x < halfW) {
      obj.x = halfW;

      if (Math.cos(obj.angle) < 0) {
        obj.angle = Math.PI - obj.angle;
      }
    }

    if (obj.x > 1 - halfW) {
      obj.x = 1 - halfW;

      if (Math.cos(obj.angle) > 0) {
        obj.angle = Math.PI - obj.angle;
      }
    }

    if (obj.y < halfH) {
      obj.y = halfH;

      if (Math.sin(obj.angle) < 0) {
        obj.angle = -obj.angle;
      }
    }

    if (obj.y > 1 - halfH) {
      obj.y = 1 - halfH;

      if (Math.sin(obj.angle) > 0) {
        obj.angle = -obj.angle;
      }
    }


    // ===== 揺れと回転 =====

    const rotate =
      Math.sin(
        elapsed * obj.frequency + obj.phase
      ) * rotation;

    const floatY =
      Math.sin(elapsed * 1.2 + obj.phase)
      * unit * sway;


    // ===== 描画 =====

    const x =
      obj.x * width - img.offsetWidth / 2;

    const y =
      obj.y * height - img.offsetHeight / 2
      + floatY;

    img.style.transform = `
      translate3d(${x}px, ${y}px, 0)
      rotate(${rotate}deg)
    `;

  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);








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
      name: "矢印マン",
      caption: "",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ガブガブ",
      caption: "( ガブガシックスユー 通称：がぶがーぶ )",
      text: "Biosisのプロトタイプとして作られた\n最初の個体。\n好奇心旺盛で活発に動き、実験中に他の\nBiosisによくイタズラをしていた。\n愛称は「ガブちゃん」",
    },
    {
      name: "ミュルモ",
      caption: "",
      text: "水槽の中をゆったりと漂う。感情の表れが乏しく、何を考えているのか読み取ることは難しい。身の危険を感じると体の一部が変色し、腕を上げて体を大きく見せようとする。",
    },
    {
      name: "双子",
      caption: "( 学名_Clionce Geminastella )",
      text: "三つのコアを宿し、半透明な双翼で泳ぐ双子のクリオネ。感情に応じてコアの色が変化する特性を持つ。餌を摂取する際は、二体が一つに融合し、頭部の皮膚を開いてコアへ直接餌を取り込む。",
    },
    {
      name: "クルシェル",
      caption: "",
      text: "ヤドカリに似た姿と性質を持ち、気に入った貝や岩に住み続ける。額の目のようなものはほんのり明るく視界を照らし、感情で変色する。本来少しなら泳げるが、背中の甲羅が重くて泳げない。",
    },
    {
      name: "ウミタツノコ",
      caption: "( Infant sea dragon )",
      text: "ウミウシが進化をした姿。ゆっくりとした動きで海底を歩いている。呑気な性格で何をしても滅多に怒ることはないが、怒らせるとかなり怖いとされている。有毒そうな見た目をしているが無毒である。",
    },
    {
      name: "ぺたん",
      caption: "",
      text: "ペンギンのような姿と、花びらのような大きなヒレを持つ。花びらは手のように自由に動き、嬉しいときには大きく広げて感情を表現する。季節によって花の種類や色が変化し、四季折々の姿を見せる。",
    },
    {
      name: "エイ",
      caption: "",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "ルミィ",
      caption: "",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "メタエモル",
      caption: "",
      text: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    },
    {
      name: "タソガレサクラ",
      caption: "( tasogare-sakura )",
      text: "3Dのビオシス発売記念で生み出された。\n巫女のような見た目らしく、たまにおみくじで占ってくれるがいい結果しか出ない。がっかりさせたくないので、こっそり引き直しているのだ。",
    },
  ];

  // 要素取得
  const popup = document.getElementById("dic-popup");
  const popupImg = popup.querySelector(".dic-popup-img");
  const popupName = popup.querySelector(".dic-popup-name");
  const popupCaption = popup.querySelector(".dic-popup-caption");
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
    popupCaption.textContent = data.caption || "";
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

  tableStn.scrollLeft = startScrollLeft - (e.clientX - startX);
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// ホイール操作
tableStn.addEventListener(
  "wheel",
  (e) => {
    const maxScroll = tableStn.scrollWidth - tableStn.clientWidth;

    if (maxScroll <= 0) return;

    // ホイールの縦方向を横方向に変換
    const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;

    const canScroll = (delta > 0 && tableStn.scrollLeft < maxScroll) || (delta < 0 && tableStn.scrollLeft > 0);

    if (canScroll) {
      e.preventDefault();
      tableStn.scrollLeft += delta;
    }
  },
  { passive: false },
);

const scrollHint = document.querySelector(".table-scroll-hint");

tableStn.addEventListener(
  "scroll",
  () => {
    scrollHint.classList.toggle("is-hidden", tableStn.scrollLeft > 5);
  },
  { passive: true },
);

const historyData = [
  {
    img: "img/history01.png",
    txt: "初めてのビオシス\nが観測される",
    name: "矢印マン",
    date: "2113",
  },
  {
    img: "img/history02.png",
    txt: "BIosis\nプロトタイプ誕生",
    name: "Gabuga-6u",
    date: "2121",
  },
  {
    img: "img/history03.png",
    txt: "民間用初ビオシス",
    name: "ミュルモ",
    date: "2123.02",
  },
  {
    img: "img/history03.png",
    txt: "感情表現が分かりやすくなったモデル",
    name: "ステラ",
    date: "2123.08",
  },
  {
    img: "img/history03.png",
    txt: "初の歩行型ビオシス",
    name: "クルシェル",
    date: "2124.01",
  },
  {
    img: "img/history03.png",
    txt: "流動歩行型ビオシス",
    name: "ウミタツノコ",
    date: "2124.06",
  },
  {
    img: "img/history03.png",
    txt: "児童向けビオシス",
    name: "ぺたん",
    date: "2125.04",
  },
  {
    img: "img/history03.png",
    txt: "ハロウィンに生まれた\n怖かわ系ビオシス",
    name: "ミュルモ",
    date: "2125.10",
  },
  {
    img: "img/history03.png",
    txt: "初の人型ビオシス",
    name: "ルミィ",
    date: "2126.05",
  },
  {
    img: "img/history03.png",
    txt: "3Dプロトタイプ",
    name: "メタエモル",
    date: "2126.11",
  },
  {
    img: "img/history03.png",
    txt: "正式版3Dモデル",
    name: "タソガレサクラ",
    date: "2127.01",
  },
];

// 年表を自動生成
const tableScr = document.querySelector(".table-scr");

tableScr.innerHTML = historyData
  .map(
    (item) => `
  <div class="table-scr-itm">
    <div class="table-itm-img">
      <img src="${item.img}" alt="${item.name}" draggable="false">
    </div>
    <div class="table-itm-txt">${item.txt}</div>
    <div class="table-itm-name">${item.name}</div>
    <div class="table-itm-line"></div>
    <div class="table-itm-date">${item.date}</div>
  </div>
`,
  )
  .join("");
