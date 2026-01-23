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

// 3. 현재 페이지에 해당하는 GNB 활성화
function setActiveGnb() {
    var currentPath = window.location.pathname;
    var currentPage = currentPath.split('/').pop(); // 현재 파일명 추출
    
    // GNB와 매칭되는 페이지 패턴 정의
    var gnbPages = {
        0: ['sub_Company'], // 회사 소개
        1: ['sub_Product01', 'sub_Product02', 'sub_Product03', 'sub_Product04', 'sub_Product05'], // 제품 소개
        2: ['sub_Tech01', 'sub_Tech02'], // 핵심 기술
        3: ['sub_Solution01', 'sub_Solution02'] // 솔루션
    };
    
    // 현재 페이지가 어느 GNB에 속하는지 확인
    $('header .topset .gnb > li').each(function(index) {
        var $gnbItem = $(this);
        var pages = gnbPages[index] || [];
        
        // 현재 페이지명이 해당 GNB의 페이지 목록에 포함되는지 확인
        for (var i = 0; i < pages.length; i++) {
            if (currentPage.toLowerCase().indexOf(pages[i].toLowerCase()) !== -1) {
                $gnbItem.addClass('current');
                return false; // each 루프 종료
            }
        }
        
        // LNB 링크의 href와 현재 페이지 비교
        $gnbItem.find('.lnb a').each(function() {
            var linkHref = $(this).attr('href');
            if (linkHref && currentPath.indexOf(linkHref.replace('.html', '')) !== -1) {
                $gnbItem.addClass('current');
                return false;
            }
        });
    });
}

// 4. Swiper 인스턴스 저장 변수 (전역)
var heroSwiper = null;
var sec3Swiper = null;
var sec1MobileSwiper = null;

// 5. 헤더 및 푸터 로드
$(function() {
    $('header').load('include/header.html', function() {
        gnbAction();
        mobileMenuAction();
        setActiveGnb(); // 현재 페이지 GNB 활성화
    });

    $('footer').load('include/footer.html');

    /* 6. 라이브러리 초기화 (AOS) */
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

    /* 7. Swiper 슬라이더 제어 */
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

    /* 8. Page Visibility API */
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            if (heroSwiper && heroSwiper.autoplay) {
                heroSwiper.autoplay.start();
            }
            if (sec3Swiper && sec3Swiper.autoplay) {
                sec3Swiper.autoplay.start();
            }
        }
    });

    /* 9. TOP 버튼 */
    $('.btnTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });
    
    /* 10. 윈도우 리사이즈 시 메뉴 상태 초기화 */
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $('header').removeClass('menu-open');
            $('header .topset .gnb > li').removeClass('active');
            $('body').css('overflow', '');
        }
    });
});

// 제품 상세 갤러리 슬라이더 (서브페이지 전용)
        var prodThumbSwiper = new Swiper('.prodThumbSwiper', {
            spaceBetween: 15,
            slidesPerView: 5,
            watchSlidesProgress: true,
            navigation: {
                nextEl: '.prod-next',
                prevEl: '.prod-prev',
            },
            breakpoints: {
                320: { slidesPerView: 3, spaceBetween: 10 },
                768: { slidesPerView: 4, spaceBetween: 12 },
                1024: { slidesPerView: 5, spaceBetween: 15 }
            }
        });

        var prodMainSwiper = new Swiper('.prodMainSwiper', {
            spaceBetween: 10,
            thumbs: {
                swiper: prodThumbSwiper,
            },
        });