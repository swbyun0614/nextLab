// 1. gnbAction 함수 정의 (CSS 클래스 제어 방식)
function gnbAction() {
    $('header').on({
        'mouseenter': function() {
            $(this).addClass('on');
        },
        'mouseleave': function() {
            $(this).removeClass('on');
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

    // 3) 섹션 3 슬라이더 (자동 재생 추가 버전)
    if ($('.sec3Swiper').length > 0) {
        new Swiper(".sec3Swiper", {
            effect: "coverflow",
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 4500, // 4.5초마다 전환
                disableOnInteraction: false, // 사용자 클릭 후에도 자동 재생 유지
            },
            coverflowEffect: {
                rotate: 0,
                stretch: -200, // 슬라이드 간 간격
                depth: 200,
                modifier: 1,
                slideShadows: false // 그림자가 너무 진하면 false로 변경 가능
            }
        });
    }

    /* 5. TOP 버튼 */
    $('.btnTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });
});