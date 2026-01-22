// 1. gnbAction 함수 정의 (CSS 클래스 제어 방식) - PC용
function gnbAction() {
    // PC에서만 hover 효과 적용 (768px 초과)
    if ($(window).width() > 768) {
        $('header').on({
            'mouseenter': function() {
                $(this).addClass('on');
            },
            'mouseleave': function() {
                $(this).removeClass('on');
            }
        });
    }
}

// 2. 모바일 메뉴 기능
function mobileMenuAction() {
    // 햄버거 버튼 클릭 시 메뉴 토글
    $('.hamburger').on('click', function(e) {
        e.preventDefault();
        $('header').toggleClass('menu-open');
        
        // 메뉴 열릴 때 body 스크롤 방지
        if ($('header').hasClass('menu-open')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', '');
            // 메뉴 닫힐 때 모든 GNB active 클래스 제거
            $('header .topset .gnb > li').removeClass('active');
        }
    });
    
    // GNB 메뉴 클릭 시 LNB 토글 (모바일)
    $('header .topset .gnb > li > a').on('click', function(e) {
        // 모바일에서만 동작 (768px 이하)
        if ($(window).width() <= 768) {
            e.preventDefault();
            
            var $parentLi = $(this).parent('li');
            
            // 다른 메뉴의 active 클래스 제거
            $('header .topset .gnb > li').not($parentLi).removeClass('active');
            
            // 현재 메뉴 토글
            $parentLi.toggleClass('active');
        }
    });
}

// 3. Swiper 인스턴스 저장 변수 (전역)
var heroSwiper = null;
var sec3Swiper = null;
var sec1MobileSwiper = null;

// 4. 헤더 및 푸터 로드
$(function() {
    // intro.html과 index.html이 모두 최상위에 있으므로 경로는 동일합니다.
    $('header').load('include/header.html', function() {
        gnbAction(); // 로드 완료 후 실행
        mobileMenuAction(); // 모바일 메뉴 기능 초기화
    });

    $('footer').load('include/footer.html');

    /* 5. 라이브러리 초기화 (AOS) */
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

    /* 6. Swiper 슬라이더 제어 */
    // 메인 슬라이더 (요소가 있을 때만 실행하여 에러 방지)
    if ($('.mySwiper').length > 0) {
        heroSwiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            loop: true,
            speed: 1200,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: false
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            on: {
                transitionEnd: function() {
                    if (typeof AOS !== 'undefined') AOS.refresh();
                }
            }
        });
    }

    // 섹션 3 슬라이더 (자동 재생 추가 버전)
    if ($('.sec3Swiper').length > 0) {
        sec3Swiper = new Swiper(".sec3Swiper", {
            effect: "coverflow",
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: false
            },
            coverflowEffect: {
                rotate: 0,
                stretch: -200,
                depth: 200,
                modifier: 1,
                slideShadows: false
            }
        });
    }

    // 섹션 1 모바일 슬라이더 (수동 조작만 가능 - autoplay 제거)
    if ($('.sec1MobileSwiper').length > 0) {
        sec1MobileSwiper = new Swiper(".sec1MobileSwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            speed: 600,
            navigation: {
                nextEl: ".sec1-next",
                prevEl: ".sec1-prev"
            },
            pagination: {
                el: ".sec1-pagination",
                clickable: true
            }
        });
    }

    /* 7. Page Visibility API - 탭 활성화 시 autoplay 재시작 */
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // 탭이 다시 활성화되면 autoplay가 있는 Swiper만 재시작
            if (heroSwiper && heroSwiper.autoplay) {
                heroSwiper.autoplay.start();
            }
            if (sec3Swiper && sec3Swiper.autoplay) {
                sec3Swiper.autoplay.start();
            }
        }
    });

    /* 8. TOP 버튼 */
    $('.btnTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });
    
    /* 9. 윈도우 리사이즈 시 메뉴 상태 초기화 */
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            // PC 사이즈로 변경 시 모바일 메뉴 닫기
            $('header').removeClass('menu-open');
            $('header .topset .gnb > li').removeClass('active');
            $('body').css('overflow', '');
        }
    });
});