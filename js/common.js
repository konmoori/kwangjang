/* global gsap, ScrollTrigger, Swiper */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");
  const gnb = document.querySelector("header .gnb");
  const subs = Array.from(document.querySelectorAll("header .sub"));
  const hero = document.querySelector(".main_visual");
  const topBtn = document.querySelector(".top_btn a");
  const categorySwiper = document.querySelector(".category_swiper");

  // codex수정됨: 탑 버튼 클릭 시 최상단으로 부드럽게 이동
  if (topBtn) {
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // codex수정됨: cat_card hover 시에만 category 루프 애니메이션 정지
  if (categorySwiper) {
    categorySwiper.addEventListener("mouseover", (e) => {
      if (e.target.closest(".cat_card")) {
        categorySwiper.classList.add("is-stop");
      }
    });

    categorySwiper.addEventListener("mouseout", (e) => {
      const fromCard = e.target.closest(".cat_card");
      if (!fromCard) return;
      const toCard = e.relatedTarget && e.relatedTarget.closest
        ? e.relatedTarget.closest(".cat_card")
        : null;
      if (!toCard) {
        categorySwiper.classList.remove("is-stop");
      }
    });

    categorySwiper.addEventListener("mouseleave", () => {
      categorySwiper.classList.remove("is-stop");
    });
  }

  if (!header || !gnb || subs.length === 0) return;

  // hero 높이(없으면 0)
  const getHeroHeight = () => (hero ? hero.offsetHeight : 0);

  // 1) 스크롤 아래로 내리면 숨김 / 위로 올리면 보임 + (hero 구간 blur 끄기)
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;

      // 헤더 숨김/노출
      header.style.top = y > lastScrollY ? "-80px" : "0";
      lastScrollY = y;

      // 메인비주얼 구간에서는 blur 끄기 (hero 끝나기 직전까지)
      const heroH = getHeroHeight();
      if (heroH > 0 && y < heroH - 80) {
        header.classList.add("no-blur");
      } else {
        header.classList.remove("no-blur");
      }
    },
    { passive: true },
  );

  // 초기 1회 실행(새로고침 시에도 상태 반영)
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

  // gnb에 마우스 올리면 서브 전체 열기
  gnb.addEventListener("mouseenter", openMega);
  // 헤더 영역 벗어나면 닫기
  header.addEventListener("mouseleave", closeMega);

  // 리사이즈 시 높이 재계산 + hero 높이 대응
  window.addEventListener("resize", () => {
    if (header.classList.contains("open")) setMegaHeight();

    const y = window.scrollY;
    const heroH = getHeroHeight();
    if (heroH > 0 && y < heroH - 80) header.classList.add("no-blur");
    else header.classList.remove("no-blur");
  });
});

