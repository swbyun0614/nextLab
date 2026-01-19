$(function() {
    // 1. 메인 히어로 Swiper 제어 (속도 및 대기시간 조절)
    var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        loop: true, // 루프 추가 권장
        speed: 1200, // 넘어가는 애니메이션 속도 (느리게)
        autoplay: {
            delay: 4500, // 다음 슬라이드까지 머무는 시간 (4.5초)
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    // 2. 헤더 GNB/LNB 슬라이드 제어
    $('header').on('mouseenter', function(){
        $('.lnb, .lnb_bg').stop().slideDown(200); 
    });
    $('header').on('mouseleave', function(){
        $('.lnb, .lnb_bg').stop().slideUp(200);
    });

    // 3. TOP 버튼 (애니메이션 효과)
    $('.btnTop').on('click', function(e){
        e.preventDefault(); // a 태그 기본 동작 방지
        $('html, body').animate({scrollTop: 0}, 600);
    });
});