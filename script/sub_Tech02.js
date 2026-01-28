$(document).ready(function() {
    'use strict';

    // ==========================================
    // 변수 선언
    // ==========================================
    var $mobileMenuBtn = $('#mobileMenuBtn');
    var $mainNav = $('#mainNav');
    var $scrollTopBtn = $('#scrollTopBtn');
    var $navLinks = $('.nav-link');

    // ==========================================
    // 모바일 메뉴 토글
    // ==========================================
    if ($mobileMenuBtn.length && $mainNav.length) {
        $mobileMenuBtn.on('click', function(e) {
            e.stopPropagation();
            $mainNav.toggleClass('active');
            var isActive = $mainNav.hasClass('active');
            
            // ARIA 속성 업데이트
            $mobileMenuBtn.attr('aria-expanded', isActive);
            $mobileMenuBtn.attr('aria-label', isActive ? '메뉴 닫기' : '메뉴 열기');
        });
    }

    // ==========================================
    // 링크 클릭 시 모바일 메뉴 닫기
    // ==========================================
    $navLinks.on('click', function() {
        if ($mainNav.hasClass('active')) {
            $mainNav.removeClass('active');
            $mobileMenuBtn.attr('aria-expanded', 'false');
            $mobileMenuBtn.attr('aria-label', '메뉴 열기');
        }
    });

    // ==========================================
    // 외부 클릭 시 모바일 메뉴 닫기
    // ==========================================
    $(document).on('click', function(e) {
        if ($mainNav.length && $mobileMenuBtn.length) {
            if (!$mainNav.is(e.target) && $mainNav.has(e.target).length === 0 &&
                !$mobileMenuBtn.is(e.target) && $mobileMenuBtn.has(e.target).length === 0) {
                if ($mainNav.hasClass('active')) {
                    $mainNav.removeClass('active');
                    $mobileMenuBtn.attr('aria-expanded', 'false');
                    $mobileMenuBtn.attr('aria-label', '메뉴 열기');
                }
            }
        }
    });

    // ==========================================
    // 상단으로 스크롤 버튼
    // ==========================================
    if ($scrollTopBtn.length) {
        $scrollTopBtn.on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            }, 600);
        });

        // 스크롤 위치에 따라 버튼 표시/숨김
        var lastScrollPosition = 0;
        var ticking = false;

        $(window).on('scroll', function() {
            lastScrollPosition = $(window).scrollTop();

            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateScrollTopButton(lastScrollPosition);
                    ticking = false;
                });

                ticking = true;
            }
        });

        function updateScrollTopButton(scrollPos) {
            if (scrollPos > 300) {
                $scrollTopBtn.css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            } else {
                $scrollTopBtn.css({
                    'opacity': '0.5',
                    'pointer-events': 'none'
                });
            }
        }
    }

    // ==========================================
    // 앵커 링크 부드러운 스크롤
    // ==========================================
    $('a[href^="#"]').on('click', function(e) {
        var href = $(this).attr('href');
        
        // href가 "#"만 있으면 건너뛰기
        if (href === '#') {
            e.preventDefault();
            return;
        }

        var targetId = href.substring(1);
        var $targetElement = $('#' + targetId);

        if ($targetElement.length) {
            e.preventDefault();
            
            var $div = $('.div');
            var divHeight = $div.length ? $div.outerHeight() : 0;
            var targetPosition = $targetElement.offset().top - divHeight - 20;

            $('html, body').animate({
                scrollTop: targetPosition
            }, 600);
        }
    });

    // ==========================================
    // ESC 키로 모바일 메뉴 닫기
    // ==========================================
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $mainNav.length && $mainNav.hasClass('active')) {
            $mainNav.removeClass('active');
            if ($mobileMenuBtn.length) {
                $mobileMenuBtn.attr('aria-expanded', 'false');
                $mobileMenuBtn.attr('aria-label', '메뉴 열기');
                $mobileMenuBtn.focus();
            }
        }
    });

    // ==========================================
    // 지연 로딩 이미지 (IntersectionObserver 사용 가능 시)
    // ==========================================
    if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var $img = $(entry.target);
                    var dataSrc = $img.attr('data-src');
                    
                    if (dataSrc) {
                        $img.attr('src', dataSrc);
                        $img.removeAttr('data-src');
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // data-src 속성이 있는 모든 이미지 관찰
        $('img[data-src]').each(function() {
            imageObserver.observe(this);
        });
    }

    // ==========================================
    // 스크롤 시 애니메이션 추가
    // ==========================================
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                $(entry.target).addClass('fade-in');
            }
        });
    }, observerOptions);

    // case-card에 애니메이션 관찰
    $('.tec_case-card').each(function() {
        observer.observe(this);
    });

    // ==========================================
    // 윈도우 리사이즈 처리
    // ==========================================
    var resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // 데스크톱 크기로 리사이즈 시 모바일 메뉴 닫기
            if ($(window).width() > 992 && $mainNav.length && $mainNav.hasClass('active')) {
                $mainNav.removeClass('active');
                if ($mobileMenuBtn.length) {
                    $mobileMenuBtn.attr('aria-expanded', 'false');
                    $mobileMenuBtn.attr('aria-label', '메뉴 열기');
                }
            }
        }, 250);
    });

    // ==========================================
    // 콘솔 정보
    // ==========================================
    console.log('%cNextLab Website', 'color: #f0620a; font-size: 20px; font-weight: bold;');
    console.log('%c안전을 넘어 미래를 설계하다', 'color: #04456f; font-size: 14px;');
    console.log('Version 1.0.0');
});