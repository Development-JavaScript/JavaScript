var $window = $(window), smoother;
var main = main || {};
var $Slide = $('.pc_slide'),
    $SlideLIst = $Slide.find('li'),
    SlideSize = $SlideLIst.length,
    $ProgressBox = $('.progressbar_box'),
    progressBoxW = $ProgressBox.width(),
    year = [], // 년도 차이 배열
    startPointYear = [], //시작 슬라이드 년도
    startPointIdx = [], // 년도별 첫 슬라이드 index
    endPointIdx = [], // 년도별 끝 슬라이드 index
    endPointYear = [],
    yearTxt = [],
    SlideListW,
    progress,//끝 슬라이드 년도
    real = 0,
    realIdx,
    swiper;

var $yearBox = $('.year_box'),
    $yearList = $yearBox.find('.year_list'), startLeft, startPadding;

var yearDivH = $('.year div').height(),
    itemH = $('.year span').height();

var zoomflag = true,
    imgslide;

// 하단 프로그래스바 : 1칸 1
function progressWidth(){
    progressSize = [];
    progressBoxW = $ProgressBox.width();
    SlideListW = $('.year_list').find('li').outerWidth(true) / progressBoxW * 10;
    
    $ProgressBox.find('.blank').width(SlideListW + '%');
    for(var i = 0; i < startPointIdx.length; i++){
        i == 0 ? progressSize.push((SlideListW * year[i]) + startPadding) : progressSize.push(SlideListW * year[i]);
        $ProgressBox.find('.progress').eq(i).css('width',progressSize[i] + '%')
    }
}

function listMove(grid){
    var listTransition = gsap.utils.toArray('.pc_slide .swiper-slide'),
          slideTransition = Math.sqrt(Math.pow(Pcswiper.translate, 2));
    // 
    listTransition.forEach(function(item,idx){
        if(slideTransition + ($(window).width() - 0) > grid[idx]){
            $(item).addClass('active');
        }else if(slideTransition + ($(window).width() + 0) < grid[idx]){
            $(item).removeClass('active');
        }
    });
}

main.utils = {
    introMotion:function(){
        ScrollTrigger.matchMedia({
            '(min-width: 1024px)':function(){
                if($('.main').hasClass('not_intro')){
                    $('.transparency_bg').remove();
                    $('.content .pc_slide_wrap').append($('.clock_point'));
                    $('.content .pc_slide_wrap').append($('.clock_wrap'));
                    $('.intro_clock').remove();
                    listMove(Pcswiper.slidesGrid);
                    $('.clock_wrap').find('.txt_box').addClass('active');
                    $(".clock_point .point").css("animationPlayState","running");
                    //초기 세팅
                    SlideListW = $('.year_list').find('li').outerWidth(true) / $('.year_box').outerWidth(true) * 10;
                    progress = (0 - 0) * SlideListW;

                    //왼쪽 패딩 값 구하기 
                    startLeft = $('.year_box').outerWidth(true) - ($('.timeline').outerWidth(true) + $('.timeline').offset().left);
                    startPadding = (100 - ((($('.timeline').outerWidth(true) + startLeft) / $('.year_box').outerWidth(true)) * 100));
                    $('.progressbar').find('span').css('width',(startPadding + progress) + '%');

                    progressWidth();

                }else{
                    // gsap  효과 +  
                    var introMotion = gsap.timeline(),
                    $MotionBox = $('.intro_motion');
                    introMotion.fromTo($MotionBox.find('.intro_bg'),{
                        scale:1,
                    },{
                        scale:1.1,
                        duration: 4
                    })
                    .to($('.clock_wrap'),{
                        scale:1,
                        duration: 1,
                        onStart:function(){
                            $(".hour_bar").css("animationPlayState","running");
                            $(".minute_bar").css("animationPlayState","running");
                            $(".second_bar").css("animationPlayState","running");
                        }
                    },"-=2")
                    .to($('.clock_wrap .clock'), {
                        css:{
                            backgroundImage:'url(/resources/kr/images/main/clock_img.png)'
                        }
                    },"-=2")
                    .to($MotionBox.find('.circle'), {
                        scale:1,
                        duration: 1.5,
                    },"-=2")
                    .to($('.clock_point'), {
                        scale:1,
                        duration: 1,
                    },"-=1.8")
                    .fromTo($('.clock_point'),{
                        rotation:-100,
                    },{
                        rotation:0,
                        duration: 3,
                        ease: "power4.out",
                    },"-=1.5")
                    .to($('.pc_slide_wrap'),{
                        x:0,
                        duration: 1,
                        onStart:function(){
                            setTimeout(function(){
                                $('#header').addClass('header_down');
                            },300);
                        }
                    },"-=1.8")
                    .to($('.clock_wrap .time_inner'), {
                        scale:0,
                        duration: 1,
                        onStart:function(){
                            $(".hour_bar").css("animationPlayState","paused");
                            $(".minute_bar").css("animationPlayState","paused");
                            $(".second_bar").css("animationPlayState","paused");
                        },
                        onComplete:function(){
                            $('.content .pc_slide_wrap').append($('.clock_point'));
                            $('.content .pc_slide_wrap').append($('.clock_wrap'));
                            $('.intro_clock').remove();
                            
                            listMove(Pcswiper.slidesGrid);
                        }
                    },"-=1.8")
                    .to($('#scrollWrap').find('.pc_slide'),{
                        x:0,
                        duration: 1,
                        onComplete:function(){
                            setTimeout(function(){
                                $('.intro_motion').remove();
                                $('.clock_wrap').find('.txt_box').addClass('active');
                                $(".clock_point .point").css("animationPlayState","running");
                                
                                //초기 세팅
                                SlideListW = $('.year_list').find('li').outerWidth(true) / $('.year_box').outerWidth(true) * 10;
                                progress = (0 - 0) * SlideListW;

                                //왼쪽 패딩 값 구하기 
                                startLeft = $('.year_box').outerWidth(true) - ($('.timeline').outerWidth(true) + $('.timeline').offset().left);
                                startPadding = (100 - ((($('.timeline').outerWidth(true) + startLeft) / $('.year_box').outerWidth(true)) * 100));
                                $('.progressbar').find('span').css('width',(startPadding + progress) + '%');

                                progressWidth();

                            },100);
                        }
                    },"-=1")
                }
                
            },
        })
    },

	slide:function(){
        for(var i = 0; i < $Slide.find('.start').length; i++){
            
            startPointIdx.push($Slide.find('.start').eq(i).index());
            startPointYear.push($Slide.find('.start').eq(i).data('start'));

            endPointIdx.push($Slide.find('.end').eq(i).index());
            endPointYear.push($Slide.find('.end').eq(i).data('year'));

            year.push(endPointYear[i] - startPointYear[i]);

            yearTxt.push($Slide.find('.start').eq(i).data('txt'));

            var _html= '';
                _html+='<li class="progress" data-year="'+ startPointYear[i] +'">';
                    _html+='<a href="javascript:void(0);">'+yearTxt[i]+'</a>';
                _html+='</li>';

            var _imgHtml='';
                _imgHtml+='<li class="bg bg'+(i + 1)+'"></li>';

            var _txtHtml='';
                _txtHtml+='<li><strong>'+yearTxt[i]+'</strong></li>'

            $ProgressBox.append(_html);
            if(!(i == $Slide.find('.start').length - 1)){
                $ProgressBox.append('<li class="blank"></li>');
            }
            $('.clock_wrap').find('.top_box').find('ul').append(_txtHtml);
            $('.bg_wrap').find('ul').append(_imgHtml);
        }


        //pc_slide
        Pcswiper = new Swiper($Slide, {
            //보여질 개수
            slidesPerView: "auto",
            speed:500,
            // 터치 좌우 가능 false 시  스크롤만 가능
            allowTouchMove: true,
            // 슬라이드에 고정 위치x 여러개 슬라이드 휙 움직임
            freeMode: true,
            mousewheel: {
                // 휠 마우스 감도
                sensitivity: 5,
                // 스와이퍼 가장자리 위치(시작/끝)에 있을때 스크롤 허용
                releaseOnEdges: true,
            },
            on:{
                init:function(){
                    $('.bg_wrap').find('ul').find('li').css('background-position-x','0%');
                    $('.bg_wrap').find('ul').find('li').eq(0).addClass('active');
                
                    setTimeout(function(){
                        $('.bg_wrap').find('ul').find('li').css('transition','all 3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s');
                    },100);
                    if(smoother){
                        smoother.paused(true);
                    }
                },
                realIndexChange :function(){
                    changeEvent(Pcswiper,true,'.pc_slide .swiper-slide');
                    listMove(Pcswiper.slidesGrid);
                },
            }
        });

        var flag = false;

        // 시계효과 pause
        function timePause(){
            $(".hour_bar").css("animationPlayState","paused");
            $(".minute_bar").css("animationPlayState","paused");
            $(".second_bar").css("animationPlayState","paused");

            setTimeout(function(){
                $('.clock_wrap').removeClass('timenext timeprev');
                //reset
                setTimeout(function(){
                    $(".hour_bar").css('animation','none');
                    $(".minute_bar").css('animation','none');
                    $(".second_bar").css('animation','none');
                    flag = false;
                    Pcswiper.mousewheel.enable();
                    slideWheel();
                },500);
            },500);
        }
        // 시계효과 play
        function timePlay(){
            $(".hour_bar").css("animationPlayState","running");
            $(".minute_bar").css("animationPlayState","running");
            $(".second_bar").css("animationPlayState","running");

            Pcswiper.mousewheel.disable();
            $Slide.off('wheel');
        }

        // 프로그래스 바 오버시 스크롤 금지 + active class 추가
        $('.progressbar_wrap').hover(function(){
            $(this).addClass('active');
            if(smoother){
                smoother.paused(true);
            }
        },function(){
            $(this).removeClass('active');
        });

        // 시작, 중간, 마지막 클릭시 해당 콘텐츠로 이동
        $('.progressbar_box .progress').each(function(idx,item){
            $(item).on('click',function(){
                index = idx;
                if(!flag && Pcswiper.realIndex != startPointIdx[index]){
                    $('.progressbar_box .progress').removeClass('active');
                    $(item).not('.blank').prevAll().addClass('active');
                    $(item).addClass('active');
                    flag = true;
                    
                    real = index;
                    realIdx = index;
    
                    timePlay();
                    // 배경전환 
                    if($SlideLIst.eq(Pcswiper.realIndex).data('year') <= $(item).data('year')){
                        $('.clock_wrap').addClass('timenext');
                        $('.bg_wrap').find('ul').find('li').eq(index).css('background-position-x','30%');
                        $('.bg_wrap').find('ul').find('li').eq(index).prevAll().css('background-position-x','80%');
    
                        $(".hour_bar").css('animation','hourTime 7000ms linear infinite');
                        $(".minute_bar").css('animation','minuteTime 3000ms linear infinite');
                        $(".second_bar").css('animation','secondTime 1000ms linear infinite');
                    }else{
                        $('.clock_wrap').addClass('timeprev');
                        $('.bg_wrap').find('ul').find('li').eq(index).css('background-position-x','0%');
                        $('.bg_wrap').find('ul').find('li').eq(index).nextAll().css('background-position-x','0%');
    
                        $(".hour_bar").css('animation','hourTime 7000ms linear reverse infinite');
                        $(".minute_bar").css('animation','minuteTime 3000ms linear reverse infinite');
                        $(".second_bar").css('animation','secondTime 1000ms linear reverse infinite');
                    }
                    Pcswiper.slideTo(startPointIdx[index]);
                }
            });
        });
        // 리스트 이미지 콘텐츠 hover 시 가운데 시계  actiuve 효과
        $SlideLIst.find('a').hover(function(){
            $('.clock').addClass('active');
        },function(){
            $('.clock').removeClass('active');
        });
        // 가운데 숫자 카운트 
        function yearEvent(el,txtData,array,last){
            $(el).find('div').each(function(idx,item){
                var thisTransform = $(this).parent().css('transform').split(',')[5],
                    currentTransform = Number(thisTransform.split(')')[0]);
                
                $(item).find('span').each(function(idxs,items){
                    if(txtData === $(items).text()){
                        array.push(-(Math.round($(items).position().top)));
                    }
                });
                if(last){
                    if(currentTransform == 0 && array[0] < yearDivH - itemH || currentTransform > array[0]){
                        $(el).css({'transition':'transform .5s','transform':'translateY(' + array[0] + 'px)'});
                    }else{
                        $(el).css({'transition':'transform .5s','transform':'translateY(' + array[1] + 'px)'});
                    }
                }else{
                    if(currentTransform == 0 || currentTransform == array[0] || currentTransform > array[0]){
                        $(el).css({'transition':'transform .5s','transform':'translateY(' + array[0] + 'px)'});
                    }else{
                        $(el).css({'transition':'transform .5s','transform':'translateY(' + array[1] + 'px)'});
                    }
                }
            });
            $(el).on('transitionend',function(){
                $(el).css({'transition':'none','transform':'translateY(' + array[0] + 'px)'});
            });
        }


        function changeEvent(swiper,web,slideList){
            $List = $(slideList);
            if(web){
                if(swiper.realIndex >= startPointIdx[real]){
                    real++;
                }else if(swiper.realIndex < startPointIdx[real - 1]){
                    real--;
                }
    
                realIdx = real-1;

                if(swiper.realIndex == 0){
                    progress = (0 - 0) * SlideListW;
                    $('.progressbar').find('span').css('width',(startPadding + progress) + '%');
                }else if(swiper.progress > 0.98){
                    $('.progressbar').find('span').css('width','100%');
                }else{
                    /* 프로그래스 바 설정 */
                    progress = ($List.eq(swiper.realIndex).data('year') - 0) * SlideListW;
                    $('.progressbar').find('span').css('width',(startPadding + progress) + '%');
                    if(smoother){
                        smoother.paused(true);
                    }
                }


                setTimeout(function(){
                    if($List.eq(swiper.realIndex).data('type') == realIdx){
                        $('.clock_wrap').find('ul').css('transform','translateY(' + (realIdx * (-40)) + 'px)');
                        $('.bg_wrap').find('ul').find('li').removeClass('active').eq(realIdx).addClass('active');
                    }
                },100);

            }else{
                $('.m_slide_wrap').find('.info_box').find('.box').removeClass('active').eq(swiper.realIndex).addClass('active');
                $('.clock_wrap').find('ul').css('transform','translateY(' + (swiper.realIndex * (-40)) + 'px)');
                var idx = 0;
                $('.m_slide').find('.swiper-slide').find('.img_box').find('img').removeClass('zoom');
                $('.m_slide').find('.swiper-slide').eq(swiper.realIndex).find('.img_box').find('img').eq(0).addClass('active zoom');
                clearInterval(imgslide);
                imgslide = setInterval(function(){
                    if(idx < 2){
                        idx++;
                    }else{
                        idx = 0;
                    }
                    $('.m_slide').find('.swiper-slide').find('.img_box').find('img:not(:eq(0))').removeClass('active');
                    $('.m_slide').find('.swiper-slide').find('.img_box').find('img').removeClass('zoom');
                    $('.m_slide').find('.swiper-slide').eq(swiper.realIndex).find('.img_box').find('img').eq(idx).addClass('active zoom');
                },4000);
            }
            // 가운데 시계 카운트
            if($List.eq(swiper.realIndex).data('year')){
                var txt = $List.eq(swiper.realIndex).data('year');
                var datatxt = txt.toString();
                
                var txt1 = datatxt.slice(0,1);
                var txt2 = datatxt.slice(1,2);
                var txt3 = datatxt.slice(2,3);
                var txt4 = datatxt.slice(3,4);

                var array1 = [];
                var array2 = [];
                var array3 = [];
                var array4 = [];

                yearEvent('.year1',txt1,array1);
                yearEvent('.year2',txt2,array2);
                yearEvent('.year3',txt3,array3);
                yearEvent('.year4',txt4,array4,true);
            }

        }

        $('.pc_slide .swiper-wrapper').on('transitionend',function(e){
            if(e.target.className == 'swiper-wrapper'){
                timePause();
                if(Pcswiper.realIndex == SlideSize - 1 || Pcswiper.progress == 1){
                    if(smoother){
                        smoother.paused(false);
                    }
                }
            }
        });


    },

	init: function (){ 
        main.utils.slide();
        main.utils.introMotion();
	}
}
main.utils.init();


