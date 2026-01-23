// 1. gnbAction 함수 정의 (스크립트 최상단에 배치)
function gnbAction() {
    // 서브메뉴(lnb) 제어 로직
    $('header').on({
        'mouseenter': function() {
            $(this).find('.lnb, .lnb_bg').stop().slideDown(200);
        },
        'mouseleave': function() {
            $(this).find('.lnb, .lnb_bg').stop().slideUp(200);
        }
    });
}

// 2. 헤더 및 푸터 로드
$(function() {
    // intro.html과 index.html이 모두 최상위에 있으므로 경로는 동일합니다.
    $('header').load('include/header.html', function() {
        gnbAction(); // 로드 완료 후 실행
    });

    $('footer').load('include/footer.html');

    /* 3. 라이브러리 초기화 (AOS) */
    $(window).on('load', function () {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: false,
                mirror: true,
                offset: 120
            });
        }
    });

    /* 4. Swiper 슬라이더 제어 */
    // 메인 슬라이더 (요소가 있을 때만 실행하여 에러 방지)
    if ($('.mySwiper').length > 0) {
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            loop: true,
            speed: 1200,
            autoplay: { delay: 4500, disableOnInteraction: false },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            pagination: { el: ".swiper-pagination", clickable: true },
            on: { transitionEnd: function() { if(typeof AOS !== 'undefined') AOS.refresh(); } }
        });
    }

    // 섹션 3 슬라이더 (요소가 있을 때만 실행)
    if ($('.sec3Swiper').length > 0) {
        new Swiper(".sec3Swiper", {
            effect: "coverflow",
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            speed: 1200,
            coverflowEffect: { rotate: 0, stretch: -200, depth: 200, modifier: 1, slideShadows: true },
            pagination: { el: ".swiper-pagination", clickable: true },
            on: { transitionEnd: function() { if(typeof AOS !== 'undefined') AOS.refresh(); } }
        });
    }

    /* 5. TOP 버튼 */
    $('.btnTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });
});