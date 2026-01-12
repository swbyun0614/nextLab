$(function() {
    // 서브메뉴 슬라이드 제어
    $('.gnb, .lnb_bg').mouseenter(function(){
        $('.lnb, .lnb_bg').stop().slideDown(200); 
    });

    $('header').mouseleave(function(){
        $('.lnb, .lnb_bg').stop().slideUp(200);
    });

    /* (선택사항) 이미지 교체를 스크립트로 더 확실하게 하고 싶을 경우 */
    /*
    $('.blog a').hover(function(){
        $(this).find('img').attr('src', 'images/btn_go_hover.png');
    }, function(){
        $(this).find('img').attr('src', 'images/btn_go.png');
    });
    */
});