/* 서브메뉴 슬라이드 제어 */
$(function() {
    $('header').mouseenter(function(){
        $('.lnb, .lnb_bg').stop().slideDown(200); 
    });

    $('header').mouseleave(function(){
        $('.lnb, .lnb_bg').stop().slideUp(200);
    });
});


/* TOP 버튼 */
$('.btnTop').click(function(){
    $('html, body').animate({scrollTop:0}, 500)
    // 보통 html과 body를 같이 씀
});