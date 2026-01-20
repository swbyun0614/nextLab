$(function () {
    /* 1. 라이브러리 초기화 (AOS)
     * 이미지 로딩 등으로 인한 높이 계산 오류를 방지하기 위해 window load 시점에 실행 권장 */
    $(window).on('load', function () {
        AOS.init({
            duration: 800,
            once: false,    // 스크롤 올릴 때 다시 사라지게 설정
            mirror: true,   // 요소 지나칠 때 애니메이션 역재생
            offset: 120
        });
    });

    /* 2. Swiper 슬라이더 제어 */
    
    // 메인 히어로 (Section: Hero)
    let heroSwiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        loop: true,
        speed: 1200,
        spaceBetween: 0,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        // [성능 최적화] 드래그 시 흰색 깜빡임 방지 및 렌더링 안정화
        watchSlidesProgress: true,
        grabCursor: true,
        preventClicks: true,
        observer: true,
        observeParents: true,

        navigation: {
            nextEl: ".mySwiper .swiper-button-next",
            prevEl: ".mySwiper .swiper-button-prev",
        },
        pagination: {
            el: ".mySwiper .swiper-pagination",
            clickable: true,
        },
        on: {
            // 슬라이드 변경 시 AOS 위치 재계산 (충돌 방지)
            transitionEnd: function() {
                AOS.refresh();
            }
        }
    });

    // 섹션 3 제품 구축 사례 (Coverflow Effect 적용)
    let sec3Swiper = new Swiper(".sec3Swiper", {
        effect: "coverflow", // 커버플로우 효과 활성화
        grabCursor: true,
        centeredSlides: true, // 가운데 정렬 필수
        slidesPerView: "auto", // 너비를 CSS에서 조절할 수 있게 auto 설정
        loop: true,
        speed: 1200,
        coverflowEffect: {
            rotate: 0,    // 슬라이드 회전 각도
            stretch: -200,     // 슬라이드 사이 간격 (겹침 정도)
            depth: 200,     // 깊이감 (숫자가 클수록 멀어짐)
            modifier: 1,    // 효과 배수
            slideShadows: true, // 그림자 활성화
        },
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".sec3Swiper .swiper-pagination",
            clickable: true,
        },
        on: {
            transitionEnd: function() {
                AOS.refresh(); // 슬라이드가 넘어갈 때마다 AOS 높이 갱신
            }
        }
    });


    /* 3. UI 컴포넌트 제어 (Header, Buttons) */

    // 헤더 GNB/LNB 슬라이드
    let $header = $('header');
    let $lnb = $('.lnb, .lnb_bg');

    $header.on({
        'mouseenter': function() {
            $lnb.stop().slideDown(200);
        },
        'mouseleave': function() {
            $lnb.stop().slideUp(200);
        }
    });

    // TOP 버튼
    $('.btnTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });
});