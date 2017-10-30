var mobileCheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

if (mobileCheck()) {
    location.href = 'error.html';
}

"use strict";
$(document).ready(function() {

  //Countdown
  
    $(function(){
			$('#countdown').countdowntimer({
			dateAndTime : "2017/12/16 09:00:00",  // <-- edit yyyy / mm / dd / time
			size : "lg",
			// if the date has over 4 digits in days then add an extra [0-9] in the first field bellow
			regexpMatchFormat: "([0-9][0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})",
			regexpReplaceWith:  " <div class='count'> $1<div class='displayformat'>Дней</div></div> <div class='count'> $2<div class='displayformat'>Часов</div></div> <div class='count'> $3<div class='displayformat'>Минут</div></div> <div class='count'> $4<div class='displayformat'>Секунд</div></div>"
			});
	});
	
    //Smooth Scroll 

    $('.page-scroll a').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 2500, 'easeInOutExpo');
        event.preventDefault();
    });
	
    //	Back Top Link

    var offset = 200;
    var duration = 500;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $('.back-to-top').fadeIn(400);
        } else {
            $('.back-to-top').fadeOut(400);
        }
    });

    //Owl-carousels

    $("#story-carousel").owlCarousel({
        dots: true,
		 margin: 50,
        loop:true,
        autoplay: false,
        nav: true,
		  navText: [
            "<i class='fa fa-chevron-left'></i>",
            "<i class='fa fa-chevron-right'></i>"

        ],
        responsive: {
            1: {
                items: 1,
            },
			600: {
                items: 2,
            },
            1000: {
                items: 3,
            },
        }
    });

 
    $("#owl-attendants1,#owl-attendants2").owlCarousel({
        dots: true,
        loop: true,
        autoplay: false,
        nav: true,
        margin: 20,
        navText: [
                          "<i class='fa fa-chevron-left'></i>",
            "<i class='fa fa-chevron-right'></i>"
        ],
        responsive: {
            1: {
                items: 1,
            },
			600: {
                items: 2,
            },
            991: {
                items: 3,
            },
        }
    });
 
}); // end document ready


// Window scroll function

$(window).scroll(function() {
	
	   // Shrink Navbar on Scroll 	

	  if ($(document).scrollTop() > 50) {
		$('nav').addClass('shrink');
	  } else {
		$('nav').removeClass('shrink');
	  }
	  
});

//On Click  function
	$(document).on('click',function(){
		
		//Navbar toggle
		$('.navbar .collapse').collapse('hide');
		
	})	

// Window load function

$(window).load(function() {

    // Page Preloader 	

    $("#preloader").fadeOut("slow");
	
    // Pretty Photo

    $("a[data-gal^='prettyPhoto']").prettyPhoto({
        hook: 'data-gal'
    });
    ({
        animation_speed: 'normal',
        opacity: 1,
        show_title: true,
        allow_resize: true,
        counter_separator_label: '/',
        theme: 'light_square',
        /* light_rounded / dark_rounded / light_square / dark_square / facebook */
    });

    //Isotope 

    var $container = $('#lightbox');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false,
            layoutMode: 'masonry'
        }

    });
    $(window).smartresize(function() {
        $container.isotope({
            columnWidth: '.col-sm-3'
        });
    });

	//initialize skrollr
    skrollr.init({
        smoothScrolling: true,
		 smoothScrollingDuration: 1000,
		forceHeight: false			
    });

    // disable skrollr if using handheld device
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        skrollr.init().destroy();
    }
			
    //Isotope Nav Filter
	
    $('.category a').on('click', function() {
        $('.category .active').removeClass('active');
        $(this).addClass('active');

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        return false;
    });
	
	 //IE 11 Fix for shaky backgrounds
  
	$('body').on("mousewheel", function () {
	  event.preventDefault();

	  var wheelDelta = event.wheelDelta;

	  var currentScrollPosition = window.pageYOffset;
	  window.scrollTo(0, currentScrollPosition - wheelDelta);
	});
	

}); // end window load
