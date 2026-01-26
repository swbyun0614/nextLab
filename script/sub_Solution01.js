(() => {
    "use strict";

    const section = document.querySelector(".impact");
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".impactCard"));
    if (!cards.length) return;

    let played = false;

    const animateOneCard = (card, duration = 1200) => {
        return new Promise((resolve) => {
        const start = performance.now();

        card.classList.add("is-animating");
        // 시작은 "아주 작게" (예: 8deg)
        const minFill = 7; // 작게 시작하는 크기(원하면 4~15 사이로 조절)

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);

            // 1) 링이 "점점 채워지게" (fill 증가)
            const fill = minFill + (360 - minFill) * t;

            // 2) 동시에 "시계방향으로 회전"하는 느낌 (rotate 증가)
            //    회전이 너무 과하면 *0.8, 더 강하면 *1.2
            const rotate = 360 * t;

            card.style.setProperty("--ringFill", `${fill}deg`);
            card.style.setProperty("--ringRotate", `${rotate}deg`);

            if (t < 1) {
            requestAnimationFrame(tick);
            } else {
            // 완료: 오렌지 제거 → 초록 고정
            card.classList.remove("is-animating");
            card.classList.add("is-green");

            // 변수 정리
            card.style.removeProperty("--ringFill");
            card.style.removeProperty("--ringRotate");

            resolve();
            }
        };

        requestAnimationFrame(tick);
        });
    };

    const runSequence = async () => {
        if (played) return;
        played = true;

        // 초기 상태: 링 없음
        cards.forEach((c) => {
        c.classList.remove("is-animating", "is-green");
        c.style.removeProperty("--ringFill");
        c.style.removeProperty("--ringRotate");
        });

        for (const card of cards) {
        await animateOneCard(card, 500);
        // 카드 사이 텀
        await new Promise((r) => setTimeout(r, -500));
        }
    };

    const io = new IntersectionObserver(
        (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
            runSequence();
            io.disconnect();
        }
        },
        { threshold: 0.4 }
    );

    io.observe(section);
})();
