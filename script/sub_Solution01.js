/* =========================================================
   NEXTLAB - Impact Ring Animation
   ✅ 더 빠르고 부드러운 애니메이션
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#impact");
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".impactCard"));
    if (!cards.length) return;

    // ✅ 속도 조정: 더 빠르게
    const RING_DURATION = 600;  // 600ms (이전 800ms)
    const STEP_GAP = 80;        // 80ms (이전 100ms)
    
    const ORANGE = "#ff6a00";
    const GREEN = "#28c36a";

    const radius = 46;
    const circumference = 2 * Math.PI * radius;

    // 초기 상태
    cards.forEach(card => {
        card.classList.add("is-idle");
        const circle = card.querySelector(".ring-progress");
        if (circle) {
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;
            circle.style.stroke = ORANGE;
        }
    });

    // 순차 실행
    const runSequence = async () => {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const circle = card.querySelector(".ring-progress");
            if (!circle) continue;

            // 진행 시작
            card.classList.remove("is-idle", "is-done");
            card.classList.add("is-animating");
            circle.style.stroke = ORANGE;

            // 링 채우기
            await animateRing(circle, circumference, RING_DURATION);

            // 완료 - 초록색
            card.classList.remove("is-animating");
            card.classList.add("is-done");
            circle.style.stroke = GREEN;
            circle.style.strokeDashoffset = 0;

            // 다음 카드 대기
            await wait(STEP_GAP);
        }
    };

    // 링 애니메이션 (requestAnimationFrame으로 부드럽게)
    function animateRing(circle, circumference, duration) {
        return new Promise(resolve => {
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // easing 함수 적용 (부드러운 시작과 끝)
                const eased = easeInOutCubic(progress);
                const offset = circumference * (1 - eased);
                
                circle.style.strokeDashoffset = offset;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(update);
        });
    }

    // easing 함수 (부드러운 가속/감속)
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // 대기 함수
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 스크롤 진입 감지 (1회 실행)
    let played = false;
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (played) return;
                if (entry.isIntersecting) {
                    played = true;
                    runSequence();
                }
            });
        },
        { threshold: 0.25 }
    );

    observer.observe(section);
});