// ===============================================
// 모바일 디버그 패널 (임시)
// ===============================================
(function() {
    var debugDiv = document.createElement('div');
    debugDiv.id = 'mobileDebug';
    debugDiv.style.cssText = 'position:fixed; bottom:0; left:0; right:0; height:150px; background:rgba(0,0,0,0.85); color:#0f0; font-family:monospace; font-size:11px; overflow:auto; z-index:99999; padding:10px; display:block;';
    document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(debugDiv);
    });
    var originalLog = console.log;
    console.log = function() {
        originalLog.apply(console, arguments);
        if (document.getElementById('mobileDebug')) {
            document.getElementById('mobileDebug').innerHTML += Array.from(arguments).join(' ') + '<br>';
            document.getElementById('mobileDebug').scrollTop = document.getElementById('mobileDebug').scrollHeight;
        }
    };
})();

// ===============================================
// 전역 변수
// ===============================================
var heroSwiper = null;
var sec3Swiper = null;
var sec1MobileSwiper = null;
var solu02Swiper = null;

// ===============================================
// 1. gnbAction 함수 정의 (CSS 클래스 제어 방식) - PC용
// ===============================================
function gnbAction() {
    // 기존 이벤트 제거 후 재바인딩
    $('header').off('mouseenter mouseleave');
    
    // PC에서만 hover 효과 적용 (1240px 초과)
    if ($(window).width() > 1240) {
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
            
            // GNB 강제 표시 - 더 강력한 방법
            $('header .topset .gnb').attr('style', 'display: flex !important; flex-direction: column !important; align-items: center !important; width: 100% !important;');
            
            // 서브페이지인 경우 현재 페이지의 GNB를 펼친 상태로 유지
            // 모바일에서 current 클래스가 있는 GNB에 active 클래스 추가
            if ($(window).width() <= 1240) {
                var $currentGnb = $('header .topset .gnb > li.current');
                if ($currentGnb.length > 0) {
                    $currentGnb.addClass('active');
                    console.log('Current GNB opened:', $currentGnb.find('> a').text());
                }
            }
            
            console.log('Menu opened: true');
            console.log('Window width:', $(window).width());
            console.log('GNB display after force:', $('.gnb').css('display'));
            console.log('Current GNB has active:', $('header .topset .gnb > li.current').hasClass('active'));
        } else {
            $('body').css('overflow', '');
            
            // GNB 숨기기
            if ($(window).width() <= 1240) {
                $('header .topset .gnb').css('display', 'none');
            }
            
            // 메뉴 닫힐 때 current가 아닌 GNB의 active 클래스만 제거
            $('header .topset .gnb > li').not('.current').removeClass('active');
            console.log('Menu opened: false');
        }
        
        console.log('GNB count:', $('.gnb > li').length);
    });
    
    // GNB 메뉴 클릭 시 LNB 토글 (모바일)
    $('header .topset .gnb > li > a').on('click', function(e) {
        // 모바일에서만 동작 (1240px 이하)
        if ($(window).width() <= 1240) {
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
    
    // 메인 페이지인 경우 종료
    if (!currentPage || currentPage === 'index.html' || currentPage === '') {
        return;
    }
    
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
                
                // 해당 페이지의 LNB 링크에 current 클래스 추가
                $gnbItem.find('.lnb a').each(function() {
                    var linkHref = $(this).attr('href');
                    if (linkHref && currentPage === linkHref) {
                        $(this).addClass('current');
                    }
                });
                
                return false; // each 루프 종료
            }
        }
        
        // LNB 링크의 href와 현재 페이지 비교
        $gnbItem.find('.lnb a').each(function() {
            var linkHref = $(this).attr('href');
            if (linkHref && currentPage === linkHref) {
                $gnbItem.addClass('current');
                $(this).addClass('current');
                return false;
            }
        });
    });
}

// ===============================================
// 5. 헤더 및 푸터 로드
// ===============================================
$(function() {
    // 먼저 include/ 폴더 시도, 실패하면 루트 시도
    $('header').load('include/header.html', function(response, status, xhr) {
        if (status === "error") {
            console.log("include/header.html 로드 실패, header.html 시도...");
            $('header').load('header.html', function(response2, status2, xhr2) {
                if (status2 === "error") {
                    console.error("헤더 로드 완전 실패:", xhr2.status, xhr2.statusText);
                } else {
                    console.log("header.html 로드 성공");
                    gnbAction();
                    mobileMenuAction();
                    setActiveGnb();
                }
            });
        } else {
            console.log("include/header.html 로드 성공");
            gnbAction();
            mobileMenuAction();
            setActiveGnb();
        }
    });

    $('footer').load('include/footer.html', function(response, status, xhr) {
        if (status === "error") {
            console.log("include/footer.html 로드 실패, footer.html 시도...");
            $('footer').load('footer.html', function(response2, status2, xhr2) {
                if (status2 === "error") {
                    console.error("푸터 로드 완전 실패:", xhr2.status, xhr2.statusText);
                } else {
                    console.log("footer.html 로드 성공");
                }
            });
        } else {
            console.log("include/footer.html 로드 성공");
        }
    });

    /* 6. Swiper 슬라이더 초기화 */
    $(window).on('load', function () {
        console.log('[Action.js] Window loaded');
        console.log('[Action.js] jQuery version:', $.fn.jquery);
        console.log('[Action.js] Sections exist:', {
            hero: $('#hero').length,
            section1: $('#section1').length,
            section2: $('#section2').length,
            section3: $('#section3').length,
            section4: $('#section4').length
        });
        
        // Swiper 초기화
        try {
            initSwipers();
            console.log('[Action.js] Swipers initialized successfully');
        } catch(error) {
            console.error('[Action.js] Swiper 초기화 에러:', error);
        }
        
        // 스크롤 애니메이션 초기화
        checkScrollAnimation();
    });
    
    /* 7. 스크롤 애니메이션 */
    function checkScrollAnimation() {
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        var triggerPoint = windowHeight * 4 / 5; // 화면의 2/3 지점
        
        $('#section1, #section2, #section3, #section4').each(function() {
            var $section = $(this);
            var sectionTop = $section.offset().top;
            var sectionBottom = sectionTop + $section.outerHeight();
            
            // 섹션의 상단이 화면의 2/3 지점에 도달하면 애니메이션
            if (scrollTop + triggerPoint >= sectionTop && scrollTop < sectionBottom) {
                $section.addClass('animate');
            }
        });
    }
    
    // 스크롤 이벤트 리스너
    $(window).on('scroll', function() {
        checkScrollAnimation();
    });
    
    /* 8. Swiper 슬라이더 초기화 함수 */
    function initSwipers() {
        console.log('[Action.js] Initializing Swipers');
        
        
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
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
                on: {
                    init: function() {
                        console.log('[heroSwiper] Initialized');
                        this.update();
                    }
                }
            });
            
            if (heroSwiper) {
                heroSwiper.update();
            }
            console.log('[Action.js] heroSwiper initialized');
        }

        if ($('.sec3Swiper').length > 0) {
            var sec3Slides = $('.sec3Swiper .swiper-slide').length;
            console.log('[Action.js] sec3Swiper slides count:', sec3Slides);
            
            sec3Swiper = new Swiper(".sec3Swiper", {
                effect: "coverflow",
                centeredSlides: true,
                slidesPerView: "auto",
                loop: sec3Slides >= 3,
                loopedSlides: sec3Slides >= 3 ? sec3Slides : 0,
                speed: 1000,
                autoplay: sec3Slides >= 3 ? {
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false
                } : false,
                coverflowEffect: {
                    rotate: 0,
                    stretch: -200,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
                on: {
                    init: function() {
                        console.log('[sec3Swiper] Initialized');
                        this.update();
                    }
                }
            });
            console.log('[Action.js] sec3Swiper initialized (loop:', sec3Slides >= 3, ')');
        }
        
        if ($('.solu02Swiper').length > 0) {
            var solu02Slides = $('.solu02Swiper .swiper-slide').length;
            console.log('[Action.js] solu02Swiper slides count:', solu02Slides);
            
            solu02Swiper = new Swiper(".solu02Swiper", {
                effect: "coverflow",
                centeredSlides: true,
                slidesPerView: "auto",
                loop: solu02Slides >= 3,
                loopedSlides: solu02Slides >= 3 ? solu02Slides : 0,
                speed: 1000,
                autoplay: solu02Slides >= 3 ? {
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false
                } : false,
                coverflowEffect: {
                    rotate: 0,
                    stretch: -200,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
                on: {
                    init: function() {
                        console.log('[solu02Swiper] Initialized');
                        this.update();
                    }
                }
            });
            console.log('[Action.js] solu02Swiper initialized (loop:', solu02Slides >= 3, ')');
        }

        if ($('.sec1MobileSwiper').length > 0) {
            var sec1Slides = $('.sec1MobileSwiper .swiper-slide').length;
            console.log('[Action.js] sec1MobileSwiper slides count:', sec1Slides);
            
            sec1MobileSwiper = new Swiper(".sec1MobileSwiper", {
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 15,
                loop: sec1Slides >= 3,
                loopedSlides: sec1Slides >= 3 ? sec1Slides : 0,
                speed: 600,
                navigation: {
                    nextEl: ".sec1-next",
                    prevEl: ".sec1-prev"
                },
                pagination: {
                    el: ".sec1-pagination",
                    clickable: true
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
                on: {
                    init: function() {
                        console.log('[sec1MobileSwiper] Initialized');
                        this.update();
                    }
                }
            });
            console.log('[Action.js] sec1MobileSwiper initialized (loop:', sec1Slides >= 3, ')');
        }
        
        // 모든 Swiper 초기화 완료 후 레이아웃 업데이트
        console.log('[Action.js] All Swipers initialized, updating layouts...');
        setTimeout(function() {
            if (heroSwiper) {
                heroSwiper.update();
                console.log('[Action.js] heroSwiper updated');
            }
            if (sec3Swiper) {
                sec3Swiper.update();
                console.log('[Action.js] sec3Swiper updated');
            }
            if (solu02Swiper) {
                solu02Swiper.update();
                console.log('[Action.js] solu02Swiper updated');
            }
            if (sec1MobileSwiper) {
                sec1MobileSwiper.update();
                console.log('[Action.js] sec1MobileSwiper updated');
            }
        }, 100);
    }

    // initSwipers를 전역으로 노출 (pageshow 이벤트에서 접근 가능하도록)
    window.initSwipers = initSwipers;

    /* 9. Page Visibility API */
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

    /* 10. TOP 버튼 */
    $('.btnTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600);
    });
    
    /* 10. 윈도우 리사이즈 시 메뉴 상태 초기화 및 Swiper 업데이트 */
    var resizeTimer;
    $(window).on('resize', function() {
        if ($(window).width() > 1240) {
            // PC 화면으로 돌아갈 때
            $('header').removeClass('menu-open');
            
            // current가 아닌 GNB의 active 클래스만 제거
            $('header .topset .gnb > li').not('.current').removeClass('active');
            
            $('body').css('overflow', '');
            
            // 모바일에서 강제로 추가한 인라인 스타일 제거
            $('header .topset .gnb').removeAttr('style');
        }
        
        // 디바운싱: 리사이즈가 끝난 후 실행
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // 헤더 호버 이벤트 재바인딩
            gnbAction();
            
            // Swiper 완전 재계산
            if (heroSwiper) {
                heroSwiper.update();
                heroSwiper.updateSlides();
                heroSwiper.updateProgress();
                heroSwiper.updateSlidesClasses();
                // autoplay 재시작
                if (heroSwiper.autoplay) {
                    heroSwiper.autoplay.start();
                }
            }
            if (sec3Swiper) {
                sec3Swiper.update();
                sec3Swiper.updateSlides();
                sec3Swiper.updateProgress();
                sec3Swiper.updateSlidesClasses();
                // autoplay 재시작
                if (sec3Swiper.autoplay) {
                    sec3Swiper.autoplay.start();
                }
            }
            if (sec1MobileSwiper) {
                sec1MobileSwiper.update();
                sec1MobileSwiper.updateSlides();
                sec1MobileSwiper.updateProgress();
                sec1MobileSwiper.updateSlidesClasses();
                // centeredSlides 재계산
                if (sec1MobileSwiper.params.centeredSlides) {
                    sec1MobileSwiper.slideTo(sec1MobileSwiper.activeIndex, 0);
                }
            }
        }, 250);
    });
    
    // 페이지 로드 후 Swiper 재계산
    $(window).on('load', function() {
        setTimeout(function() {
            if (heroSwiper) {
                heroSwiper.update();
                heroSwiper.updateSlides();
                if (heroSwiper.autoplay) {
                    heroSwiper.autoplay.start();
                }
            }
            if (sec3Swiper) {
                sec3Swiper.update();
                sec3Swiper.updateSlides();
                if (sec3Swiper.autoplay) {
                    sec3Swiper.autoplay.start();
                }
            }
            if (sec1MobileSwiper) {
                sec1MobileSwiper.update();
                sec1MobileSwiper.updateSlides();
                if (sec1MobileSwiper.params.centeredSlides) {
                    sec1MobileSwiper.slideTo(sec1MobileSwiper.activeIndex, 0);
                }
            }
        }, 100);
    });
    
    // 페이지 visibility 변경 시 autoplay 재시작 (탭 전환 등)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(function() {
                if (heroSwiper && heroSwiper.autoplay) {
                    heroSwiper.autoplay.start();
                }
                if (sec3Swiper && sec3Swiper.autoplay) {
                    sec3Swiper.autoplay.start();
                }
            }, 100);
        }
    });
});

// 제품 상세 갤러리 슬라이더 (서브페이지 전용)
var prodThumbSwiper = null;
var prodMainSwiper = null;

$(function() {
    if ($('.prodThumbSwiper').length > 0) {
        prodThumbSwiper = new Swiper('.prodThumbSwiper', {
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
            },
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });

        prodMainSwiper = new Swiper('.prodMainSwiper', {
            spaceBetween: 10,
            thumbs: {
                swiper: prodThumbSwiper,
            },
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });
    }
});

// bfcache 복원 및 모바일 새로고침 시 Swiper 재초기화
window.addEventListener('pageshow', function(event) {
    console.log('[Action.js] pageshow event fired, persisted:', event.persisted);

    // Swiper가 초기화되지 않았으면 초기화 시도
    if (!heroSwiper && $('.mySwiper').length > 0) {
        console.log('[Action.js] Swipers not initialized, calling initSwipers()...');
        if (typeof initSwipers === 'function') {
            initSwipers();
        }
    }

    // prodSwiper 초기화 확인
    if (!prodThumbSwiper && $('.prodThumbSwiper').length > 0) {
        console.log('[Action.js] prodSwiper not initialized, initializing...');
        prodThumbSwiper = new Swiper('.prodThumbSwiper', {
            spaceBetween: 15,
            slidesPerView: 5,
            watchSlidesProgress: true,
            navigation: { nextEl: '.prod-next', prevEl: '.prod-prev' },
            breakpoints: {
                320: { slidesPerView: 3, spaceBetween: 10 },
                768: { slidesPerView: 4, spaceBetween: 12 },
                1024: { slidesPerView: 5, spaceBetween: 15 }
            },
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });
        prodMainSwiper = new Swiper('.prodMainSwiper', {
            spaceBetween: 10,
            thumbs: { swiper: prodThumbSwiper },
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });
    }

    // 이미 초기화된 Swiper 업데이트
    if (event.persisted) {
        console.log('[Action.js] Page restored from bfcache, updating Swipers...');
        if (prodThumbSwiper) prodThumbSwiper.update();
        if (prodMainSwiper) prodMainSwiper.update();
        if (heroSwiper) heroSwiper.update();
        if (sec3Swiper) sec3Swiper.update();
        if (sec1MobileSwiper) sec1MobileSwiper.update();
    }
});



// Solution 02 갤러리 페이지네이션 및 상단 이미지 변경 기능

$(function() {
    /************************************************************
     * ✅ 데이터 설정값 (여기만 수정)
     ************************************************************/
    const TOTAL_IMAGES = 60;           // 전체 이미지 개수
    const IMG_PATH = "images/solution02_gridData/img_";    // 이미지 경로 및 앞부분 파일명
    const IMG_EXT = ".png";            // 이미지 확장자
    const PER_PAGE = 12;               // 한 페이지당 보여줄 개수
    const PAGE_WINDOW = 5;             // 페이지네이션 범위

    let currentPage = 1;
    let selectedId = null;

    // 데이터 자동 생성 (img_1.jpg, img_2.jpg... 형식)
    const items = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
        const n = i + 1;
        return {
            id: n,
            img: `${IMG_PATH}${n}${IMG_EXT}`
        };
    });
    // 제이쿼리 객체 캐싱
    const $grid = $("#grid");
    const $pager = $("#pager");
    const $heroImg = $("#heroImg");
    const $heroCaption = $("#heroCaption");

    /************************************************************
     * ✅ 핵심 기능 함수
     ************************************************************/

    function getTotalPages() {
        return Math.ceil(items.length / PER_PAGE);
    }

    // 상단 메인 이미지 변경 (타이틀 제외, 파일명 등으로 대체 가능)
    function setHero(item) {
        if (!item) return;
        
        // 현재 이미지의 src 확인
        const currentSrc = $heroImg.attr('src');
        
        // 같은 이미지면 변경하지 않음
        if (currentSrc === item.img) return;
        
        // 페이드 아웃
        $heroImg.css('opacity', '0.3');
        
        // 이미지 변경 및 페이드 인
        setTimeout(function() {
            $heroImg.attr({ "src": item.img, "alt": `이미지 ${item.id}` });
            
            // 이미지 로드 후 페이드 인
            $heroImg.css('opacity', '1');
        }, 100);
    }

    // 그리드 렌더링
    function renderGrid(page) {
        const start = (page - 1) * PER_PAGE;
        const pageItems = items.slice(start, start + PER_PAGE);

        const html = pageItems.map((it) => `
            <article class="card" data-id="${it.id}" tabindex="0" role="button">
                <div class="thumb">
                    <img src="${it.img}" alt="이미지 ${it.id}" loading="lazy">
                </div>
            </article>
        `).join("");

        $grid.html(html);

        // 카드 클릭 이벤트
        $grid.find(".card").on("click keydown", function(e) {
            if (e.type === "keydown" && e.key !== "Enter") return;
            
            const id = $(this).data("id");
            const item = items.find(x => x.id === id);
            selectedId = id;
            
            // 모든 카드에서 selected 클래스 제거
            $grid.find(".card").removeClass("selected");
            // 현재 클릭한 카드에 selected 클래스 추가
            $(this).addClass("selected");
            
            setHero(item);
        });

        // 처음 로드하거나 페이지 이동 시 hero 유지 로직
        if (selectedId === null && pageItems.length) {
            selectedId = pageItems[0].id;
            setHero(pageItems[0]);
        } else {
            const selectedItem = items.find(x => x.id === selectedId);
            if (selectedItem) setHero(selectedItem);
        }
        
        // 현재 선택된 카드에 selected 클래스 적용
        if (selectedId !== null) {
            $grid.find(`.card[data-id="${selectedId}"]`).addClass("selected");
        }
    }

    // 페이지네이션 렌더링
    function renderPager(page) {
        const total = getTotalPages();
        const start = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
        const end = Math.min(start + PAGE_WINDOW - 1, total);

        let pagerHtml = `
            <button type="button" data-action="first" ${page === 1 ? "disabled" : ""}><img src="images/sub_solu02_pagi_fst.png" alt="첫 페이지"></button>
            <button type="button" data-action="prev" ${page === 1 ? "disabled" : ""}><img src="images/sub_solu02_pagi_prev.png" alt="이전 페이지"></button>
        `;

        for (let p = start; p <= end; p++) {
            pagerHtml += `<button type="button" class="num ${p === page ? "active" : ""}" data-page="${p}">${p}</button>`;
        }

        pagerHtml += `
            <button type="button" data-action="next" ${page === total ? "disabled" : ""}><img src="images/sub_solu02_pagi_next.png" alt="다음 페이지"></button>
            <button type="button" data-action="last" ${page === total ? "disabled" : ""}><img src="images/sub_solu02_pagi_last.png" alt="마지막 페이지"></button>
        `;

        $pager.html(pagerHtml);
    }

    function goToPage(page) {
        const total = getTotalPages();
        currentPage = Math.min(Math.max(1, page), total);
        renderGrid(currentPage);
        renderPager(currentPage);
    }

    // 페이지네이션 클릭 이벤트
    $pager.on("click", "button", function() {
        const $btn = $(this);
        const pageNum = $btn.data("page");
        const action = $btn.data("action");

        if (pageNum) goToPage(pageNum);
        else if (action === "first") goToPage(1);
        else if (action === "prev")  goToPage(currentPage - 1);
        else if (action === "next")  goToPage(currentPage + 1);
        else if (action === "last")  goToPage(getTotalPages());
    });

    // 화살표 버튼 클릭 이벤트
    $(".hero-arrow.prev").on("click", function() {
        if (selectedId === null) return;
        
        const currentIndex = items.findIndex(x => x.id === selectedId);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        const prevItem = items[prevIndex];
        
        selectedId = prevItem.id;
        setHero(prevItem);
        
        // 현재 페이지에 해당 아이템이 있는지 확인
        const itemPage = Math.ceil(prevItem.id / PER_PAGE);
        if (itemPage !== currentPage) {
            goToPage(itemPage);
        } else {
            // 같은 페이지면 selected 클래스만 업데이트
            $grid.find(".card").removeClass("selected");
            $grid.find(`.card[data-id="${selectedId}"]`).addClass("selected");
        }
    });
    
    $(".hero-arrow.next").on("click", function() {
        if (selectedId === null) return;
        
        const currentIndex = items.findIndex(x => x.id === selectedId);
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        const nextItem = items[nextIndex];
        
        selectedId = nextItem.id;
        setHero(nextItem);
        
        // 현재 페이지에 해당 아이템이 있는지 확인
        const itemPage = Math.ceil(nextItem.id / PER_PAGE);
        if (itemPage !== currentPage) {
            goToPage(itemPage);
        } else {
            // 같은 페이지면 selected 클래스만 업데이트
            $grid.find(".card").removeClass("selected");
            $grid.find(`.card[data-id="${selectedId}"]`).addClass("selected");
        }
    });

    // 초기 실행
    goToPage(1);
    
});