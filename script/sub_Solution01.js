/* =========================================================
    NEXTLAB - Impact Ring Animation (jQuery 버전)
    ✅ 더 빠르고 부드러운 애니메이션
   ========================================================= */

$(document).ready(function() {
    var $section = $('#impact');
    if (!$section.length) return;

    var $cards = $section.find('.impactCard');
    if (!$cards.length) return;

    // ✅ 속도 조정: 효과가 겹치도록 설정
    var RING_DURATION = 700;  // 400ms - 링 채우는 시간
    var STEP_GAP = -500;      // -200ms - 이전 효과의 절반 지점에서 다음 효과 시작 (겹침)
    var COLOR_TRANSITION = 300; // 300ms - 색상 전환 시간
    
    var ORANGE = '#ff6a00';
    var GREEN = '#28c36a';

    var radius = 46;
    var circumference = 2 * Math.PI * radius;

    // 초기 상태
    $cards.each(function() {
        var $card = $(this);
        $card.addClass('is-idle');
        
        var $circle = $card.find('.ring-progress');
        if ($circle.length) {
            $circle.css({
                'stroke-dasharray': circumference,
                'stroke-dashoffset': circumference,
                'stroke': ORANGE,
                'transition': 'stroke ' + COLOR_TRANSITION + 'ms ease'
            });
        }
    });

    // 순차 실행
    function runSequence() {
        var index = 0;
        
        function animateNext() {
            if (index >= $cards.length) return;
            
            var $card = $cards.eq(index);
            var $circle = $card.find('.ring-progress');
            
            if (!$circle.length) {
                index++;
                animateNext();
                return;
            }

            // 진행 시작
            $card.removeClass('is-idle is-done').addClass('is-animating');
            $circle.css({
                'stroke': ORANGE,
                'transition': 'stroke ' + COLOR_TRANSITION + 'ms ease'
            });

            // 링 채우는 중간에 다음 카드 시작
            var nextCardDelay = RING_DURATION + STEP_GAP; // 400 + (-200) = 200ms 후 다음 카드
            setTimeout(function() {
                index++;
                animateNext();
            }, nextCardDelay);

            // 링 채우기
            animateRing($circle, circumference, RING_DURATION).then(function() {
                // 완료 - 초록색으로 부드럽게 전환
                $card.removeClass('is-animating').addClass('is-done');
                $circle.css({
                    'stroke': GREEN,
                    'stroke-dashoffset': 0
                });
            });
        }
        
        animateNext();
    }

    // 링 애니메이션 (requestAnimationFrame으로 부드럽게)
    function animateRing($circle, circumference, duration) {
        return new Promise(function(resolve) {
            var startTime = performance.now();
            var circle = $circle[0];
            
            function update(currentTime) {
                var elapsed = currentTime - startTime;
                var progress = Math.min(elapsed / duration, 1);
                
                // easing 함수 적용 (부드러운 시작과 끝)
                var eased = easeInOutCubic(progress);
                var offset = circumference * (1 - eased);
                
                $circle.css('stroke-dashoffset', offset);
                
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

    // 스크롤 진입 감지 (1회 실행)
    var played = false;
    
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            $.each(entries, function(i, entry) {
                if (played) return;
                if (entry.isIntersecting) {
                    played = true;
                    runSequence();
                }
            });
        }, { 
            threshold: 0.25 
        });

        observer.observe($section[0]);
    } else {
        // IntersectionObserver를 지원하지 않는 브라우저를 위한 fallback
        $(window).on('scroll', function() {
            if (played) return;
            
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();
            var sectionTop = $section.offset().top;
            
            if (scrollTop + windowHeight > sectionTop + 100) {
                played = true;
                runSequence();
            }
        });
    }
});