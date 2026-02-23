document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");
  const gnb = document.querySelector("header .gnb");
  const subs = Array.from(document.querySelectorAll("header .sub"));
  const hero = document.querySelector(".main_visual"); // ✅ 메인비주얼

  if (!header || !gnb || subs.length === 0) return;

  // hero 높이(없으면 0)
  const getHeroHeight = () => (hero ? hero.offsetHeight : 0);

  // 1) 스크롤: 아래로 숨김 / 위로 보임 + (hero 구간 blur 끄기)
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;

      // 헤더 숨김/노출
      header.style.top = y > lastScrollY ? "-80px" : "0";
      lastScrollY = y;

      // ✅ 메인비주얼 구간에서는 blur 끄기
      // (hero가 끝나기 전까지만)
      const heroH = getHeroHeight();
      if (heroH > 0 && y < heroH - 80) {
        header.classList.add("no-blur");
      } else {
        header.classList.remove("no-blur");
      }
    },
    { passive: true },
  );

  // 초기 1회 실행(새로고침했을 때도 적용되게)
  (() => {
    const y = window.scrollY;
    const heroH = getHeroHeight();
    if (heroH > 0 && y < heroH - 80) header.classList.add("no-blur");
    else header.classList.remove("no-blur");
  })();

  // 2) 메가메뉴 높이(가장 긴 sub 기준) 계산
  const setMegaHeight = () => {
    let maxH = 0;
    subs.forEach((ul) => {
      const h = ul.scrollHeight;
      if (h > maxH) maxH = h;
    });
    header.style.setProperty("--mega-h", `${maxH + 10}px`);
  };

  const openMega = () => {
    setMegaHeight();
    header.classList.add("open");
  };

  const closeMega = () => {
    header.classList.remove("open");
  };

  // gnb에 닿으면 한번에 열기
  gnb.addEventListener("mouseenter", openMega);

  // 헤더 영역 벗어나면 닫기
  header.addEventListener("mouseleave", closeMega);

  // 리사이즈 시 재계산(+ hero 높이도 바뀔 수 있어서 스크롤 한 번 트리거)
  window.addEventListener("resize", () => {
    if (header.classList.contains("open")) setMegaHeight();

    const y = window.scrollY;
    const heroH = getHeroHeight();
    if (heroH > 0 && y < heroH - 80) header.classList.add("no-blur");
    else header.classList.remove("no-blur");
  });
});
