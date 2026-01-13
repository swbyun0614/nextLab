$(function() {
    // 서브메뉴 슬라이드 제어
    $('header').mouseenter(function(){
        $('.lnb, .lnb_bg').stop().slideDown(200); 
    });

    $('header').mouseleave(function(){
        $('.lnb, .lnb_bg').stop().slideUp(200);
    });
});