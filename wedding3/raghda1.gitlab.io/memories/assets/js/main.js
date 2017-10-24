"use strict";

function initialize(e) {
    var a = new google.maps.LatLng(59.32522, 18.07002),
        t = {
            center: a,
            scrollwheel: !1,
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [{
                featureType: "administrative",
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#444444"
                }]
            }, {
                featureType: "administrative.country",
                elementType: "geometry.fill",
                stylers: [{
                    saturation: "17"
                }]
            }, {
                featureType: "landscape",
                elementType: "all",
                stylers: [{
                    color: "#f2f2f2"
                }]
            }, {
                featureType: "poi",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "road",
                elementType: "all",
                stylers: [{
                    saturation: -100
                }, {
                    lightness: 45
                }]
            }, {
                featureType: "road.highway",
                elementType: "all",
                stylers: [{
                    visibility: "simplified"
                }]
            }, {
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "transit",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "water",
                elementType: "all",
                stylers: [{
                    color: "#f8ded9"
                }, {
                    visibility: "on"
                }]
            }]
        },
        i = new google.maps.Map(document.getElementById("map-canvas"), t),
        s = {
            url: "assets/img/theme/icon/map-marker.png"
        };
    new google.maps.Marker({
        position: a,
        map: i,
        title: "welcome to our wedding",
        icon: s
    })
}

function lazyLoadGoogleMap() {
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDI_nP4mzaD9r0GafNS0q90X4mfwcfRwU4&callback=initializeMap").done(function(e, a) {}).fail(function(e, a, t) {})
}

function initializeMap() {
    initialize(params)
}
window.onload = function() {
    $("body").delay(50).css({
        "overflow-y": "visible"
    }), $("#status").fadeOut(), $("#preloader").delay(50).fadeOut("slow"), $("#preloader").delay(100).remove()
}, $(document).ready(function() {
    function e(e) {
        $(".flexslider.fullscreen .slides li").each(function() {
            var e = $(this).attr("data-bg");
            $(this).css("background-image", "url(" + e + ")")
        }), e()
    }

    function a() {
        $("#home-header-slider").flexslider({
            animation: "fade",
            prevText: " ",
            nextText: " ",
            controlNav: !1,
            touch: !0
        }), $("#gallery-header-slider").flexslider({
            animation: "fade",
            prevText: " ",
            nextText: " ",
            controlNav: !1,
            touch: !0
        })
    }
    $("#sidebar-wrapper").mCustomScrollbar({
        theme: "dark"
    }), $(".modal").length && $(".modal").mCustomScrollbar({
        theme: "dark"
    }), $("#menu-close").click(function(e) {
        e.preventDefault(), $("#sidebar-wrapper").toggleClass("active")
    }), $("#menu-toggle").click(function(e) {
        e.preventDefault(), $("#sidebar-wrapper").toggleClass("active")
    }), e(a);
    new Countdown({
        selector: "#countdown",
        msgBefore: "Count down",
        msgAfter: "The wedding with great",
        msgPattern: "<span>{days} days</span><span> {hours} hours</span><span> {minutes} minutes</span> <span>{seconds}seconds</span>",
        dateEnd: new Date("Dec 1, 2018 12:00")
    });
    $("#petals-scene").parallax({
        relativeInput: !1,
        calibrateX: !0,
        calibrateY: !0,
        clipRelativeInput: !0,
        invertX: !1,
        invertY: !1,
        limitX: !1,
        limitY: !1,
        scalarX: 30,
        scalarY: 30,
        frictionX: .8,
        frictionY: .8,
        originX: .5,
        originY: .5
    }), $("#butterfly-scene").parallax({
        calibrateX: !0,
        calibrateY: !0,
        invertX: !1,
        invertY: !1,
        limitX: !1,
        limitY: !1,
        scalarX: 40,
        scalarY: 40,
        frictionX: .8,
        frictionY: .8,
        originX: .5,
        originY: 0
    }), $("#sparkel-scene").parallax({
        calibrateX: !0,
        calibrateY: !0,
        invertX: !1,
        invertY: !1,
        limitX: !1,
        limitY: !1,
        scalarX: 20,
        scalarY: 20,
        frictionX: .5,
        frictionY: .5,
        originX: .5,
        originY: 1
    }), $(".post-img").length && ($(".jumbotron").css("background-image", "url(" + $(".post-img").attr("src") + ")"), $(".footer").css("background-image", "url(" + $(".post-img").attr("src") + ")")), $(".images-parent").magnificPopup({
        delegate: "a",
        type: "image",
        gallery: {
            enabled: !0
        },
        removalDelay: 300,
        mainClass: "mfp-fade",
        retina: {
            ratio: 1,
            replaceSrc: function(e, a) {
                return e.src.replace(/\.\w+$/, function(e) {
                    return "@2x" + e
                })
            }
        }
    }), $("body").scrollspy({
        target: "#nav",
        offset: 600
    }), $("a.page-scroll").on("click", function() {
        if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") && location.hostname === this.hostname) {
            var e = $(this.hash);
            if (e = e.length ? e : $("[name=" + this.hash.slice(1) + "]"), e.length) return $("html,body").animate({
                scrollTop: e.offset().top
            }, 2e3), !1
        }
    }), $("#custom-carousel").on("slide.bs.carousel", function(e) {
        $("#custom-carousel .controls li.active").removeClass("active"), $("#custom-carousel .controls li:eq(" + $(e.relatedTarget).index() + ")").addClass("active")
    }), $(".btn-sound").on("click", function() {
        "hidden" === $(".iframe-wrapper").css("visibility") ? $(".iframe-wrapper").css("visibility", "visible") : $(".iframe-wrapper").css("visibility", "hidden"), "block" === $(".iframe-wrapper").css("display") && "hidden" === $(".iframe-wrapper").css("visibility") ? $(".iframe-wrapper").css("display", "none") : $(".iframe-wrapper").css("display", "block")
    }), $("#photostack-1").length && new Photostack(document.getElementById("photostack-1"), {
        callback: function(e) {}
    }), $("#video-bg").vide({
        mp4: "assets/video/wedding",
        webm: "assets/video/wedding",
        ogv: "assets/video/wedding",
        poster: "assets/video/poster"
    }, {
        volume: 1,
        playbackRate: 1,
        muted: !0,
        loop: !0,
        autoplay: !0,
        position: "50% 50%",
        posterType: "detect",
        resizing: !0,
        bgColor: "#f4f4f4",
        className: ""
    });
    var t = ($("#video-bg").data("vide"), $("#owl-wish"));
    t.owlCarousel({
        items: 1,
        autoPlay: !0,
        lazyLoad: !1,
        autoplayTimeout: 2e3,
        dots: !0,
        dotsEach: 1,
        responsive: {
            0: {
                items: 1,
                nav: !1
            },
            600: {
                items: 1,
                nav: !1
            }
        }
    });
    var t = $("#owl-thum");
    t.owlCarousel({
        items: 3,
        loop: !0,
        autoWidth: !0,
        autoplay: !0,
        lazyLoad: !1,
        autoplayTimeout: 2e3,
        animateOut: "fadOut",
        animateIn: "fadeIn",
        responsive: {
            0: {
                items: 1,
                nav: !0
            },
            600: {
                items: 2,
                nav: !0
            },
            1e3: {
                items: 3,
                nav: !1
            }
        }
    });
    var t = $("#owl-gift");
    t.owlCarousel({
        items: 3,
        autoPlay: !0,
        lazyLoad: !1,
        autoplayTimeout: 2e3,
        responsive: {
            0: {
                items: 1,
                nav: !1
            },
            600: {
                items: 2,
                nav: !1
            },
            1e3: {
                items: 3,
                nav: !1
            }
        }
    }), $(window).stellar({
        horizontalScrolling: !1,
        verticalOffset: 40
    }), $('a[href="#"]').on("click", function(e) {
        e.preventDefault()
    }), $("#toggle-switcher").on("click", function() {
        $(this).hasClass("opened") ? ($(this).removeClass("opened"), $("#style-switcher").animate({
                left: "-222px"
            })) : ($(this).addClass("opened"), $("#style-switcher").animate({
                left: "-10px"
            }))
    }), $.session.get("theme-cookie") && $("#theme").attr("href", "assets/css/" + $.session.get("theme-cookie")), $(".styleswitch").on("click", function(e) {
        var a = $(this).attr("data-rel");
        $.session.set("theme-cookie", a), $("#theme").attr("href", "assets/css/" + $(this).attr("data-rel")), e.preventDefault()
    });
    var i = $(".grid");
    i.imagesLoaded(function() {
        i.masonry({
            itemSelector: ".grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: !0
        })
    }), $(".filtr-container").length && $(".filtr-container").imagesLoaded(function() {
        $(".filtr-container").filterizr({
            delay: 25,
            layout: "sameSize"
        })
    }), $(".simplefilter").length && $(".simplefilter li").click(function() {
        $(".simplefilter li").removeClass("active"), $(this).addClass("active")
    }), document.getElementById("map-canvas") && (window.google && google.maps ? initializeMap() : lazyLoadGoogleMap())
});
var params;
