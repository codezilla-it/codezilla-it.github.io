var mr_firstSectionHeight,
    mr_nav,
    mr_navOuterHeight,
    mr_navScrolled = false,
    mr_navFixed = false,
    mr_floatingProjectSections,
    mr_scrollTop = 0;

$(document).ready(function () {
    "use strict";

    // Smooth scroll to inner links

    $('.inner-link').smoothScroll({
        offset: -55,
        speed: 800
    });

    // Update scroll variable for scrolling functions

    addEventListener('scroll', function () {
        mr_scrollTop = window.pageYOffset;
    }, false);

    // Append .background-image-holder <img>'s as CSS backgrounds

    $('.background-image-holder').each(function () {
        var imgSrc = $(this).children('img').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('img').hide();
        $(this).css('background-position', 'initial');
    });

    // Fade in background images

    setTimeout(function () {
        $('.background-image-holder').each(function () {
            $(this).addClass('fadeIn');
        });
    }, 200);

    // Initialize Tooltips

    $('[data-toggle="tooltip"]').tooltip();

    // Checkboxes

    $('.checkbox-option').click(function () {
        $(this).toggleClass('checked');
        var checkbox = $(this).find('input');
        if (checkbox.prop('checked') === false) {
            checkbox.prop('checked', true);
        } else {
            checkbox.prop('checked', false);
        }
    });

    // Radio Buttons

    $('.radio-option').click(function () {
        $(this).closest('form').find('.radio-option').removeClass('checked');
        $(this).addClass('checked');
        $(this).find('input').prop('checked', true);
    });


    // Accordions

    $('.accordion li').click(function () {
        if ($(this).closest('.accordion').hasClass('one-open')) {
            $(this).closest('.accordion').find('li').removeClass('active');
            $(this).addClass('active');
        } else {
            $(this).toggleClass('active');
        }
    });

    // Tabbed Content

    $('.tabbed-content').each(function () {
        $(this).append('<ul class="content"></ul>');
    });

    $('.tabs li').each(function () {
        var originalTab = $(this),
            activeClass = "";
        if (originalTab.is('.tabs li:first-child')) {
            activeClass = ' class="active"';
        }
        var tabContent = originalTab.find('.tab-content').detach().wrap('<li' + activeClass + '></li>').parent();
        originalTab.closest('.tabbed-content').find('.content').append(tabContent);
    });

    $('.tabs li').click(function () {
        $(this).closest('.tabs').find('li').removeClass('active');
        $(this).addClass('active');
        var liIndex = $(this).index() + 1;
        $(this).closest('.tabbed-content').find('.content>li').removeClass('active');
        $(this).closest('.tabbed-content').find('.content>li:nth-of-type(' + liIndex + ')').addClass('active');
    });

    // Progress Bars

    $('.progress-bar').each(function () {
        $(this).css('width', $(this).attr('data-progress') + '%');
    });

    // Navigation

    if (!$('nav').hasClass('fixed') && !$('nav').hasClass('absolute')) {

        // Make nav container height of nav

        $('.nav-container').css('min-height', $('nav').outerHeight(true));

        $(window).resize(function () {
            $('.nav-container').css('min-height', $('nav').outerHeight(true));
        });

        // Compensate the height of parallax element for inline nav

        if ($(window).width() > 768) {
            $('.parallax:nth-of-type(1) .background-image-holder').css('top', -($('nav').outerHeight(true)));
        }

        // Adjust fullscreen elements

        if ($(window).width() > 768) {
            $('section.fullscreen:nth-of-type(1)').css('height', ($(window).height() - $('nav').outerHeight(true)));
        }

    } else {
        $('body').addClass('nav-is-overlay');
    }

    if ($('nav').hasClass('bg-dark')) {
        $('.nav-container').addClass('bg-dark');
    }


    // Fix nav to top while scrolling

    mr_nav = $('body .nav-container nav:first');
    mr_navOuterHeight = $('body .nav-container nav:first').outerHeight();
    window.addEventListener("scroll", updateNav, false);

    // Menu dropdown positioning

    $('.menu > li > ul').each(function () {
        var menu = $(this).offset();
        var farRight = menu.left + $(this).outerWidth(true);
        if (farRight > $(window).width() && !$(this).hasClass('mega-menu')) {
            $(this).addClass('make-right');
        } else if (farRight > $(window).width() && $(this).hasClass('mega-menu')) {
            var isOnScreen = $(window).width() - menu.left;
            var difference = $(this).outerWidth(true) - isOnScreen;
            $(this).css('margin-left', -(difference));
        }
    });

    // Mobile Menu

    $('.mobile-toggle').click(function () {
        $('.nav-bar').toggleClass('nav-open');
        $(this).toggleClass('active');
    });

    $('.menu li').click(function (e) {
        if (!e) e = window.event;
        e.stopPropagation();
        if ($(this).find('ul').length) {
            $(this).toggleClass('toggle-sub');
        } else {
            $(this).parents('.toggle-sub').removeClass('toggle-sub');
        }
    });

    $('.module.widget-handle').click(function () {
        $(this).toggleClass('toggle-widget-handle');
    });

    // Populate filters
    $('.projects').each(function () {

        var filters = "";

        $(this).find('.project').each(function () {

            var filterTags = $(this).attr('data-filter').split(',');

            filterTags.forEach(function (tagName) {
                if (filters.indexOf(tagName) == -1) {
                    filters += '<li data-filter="' + tagName + '">' + capitaliseFirstLetter(tagName) + '</li>';
                }
            });
            $(this).closest('.projects')
                .find('ul.filters').empty().append('<li data-filter="all" class="active">All</li>').append(filters);
        });
    });

    $('.filters li').click(function () {
        var filter = $(this).attr('data-filter');
        $(this).closest('.filters').find('li').removeClass('active');
        $(this).addClass('active');

        $(this).closest('.projects').find('.project').each(function () {
            var filters = $(this).data('filter');

            if (filters.indexOf(filter) == -1) {
                $(this).addClass('inactive');
            } else {
                $(this).removeClass('inactive');
            }
        });

        if (filter == 'all') {
            $(this).closest('.projects').find('.project').removeClass('inactive');
        }
    });

    // Twitter Feed

    $('.tweets-feed').each(function (index) {
        $(this).attr('id', 'tweets-' + index);
    }).each(function (index) {

        function handleTweets(tweets) {
            var x = tweets.length;
            var n = 0;
            var element = document.getElementById('tweets-' + index);
            var html = '<ul class="slides">';
            while (n < x) {
                html += '<li>' + tweets[n] + '</li>';
                n++;
            }
            html += '</ul>';
            element.innerHTML = html;
            return html;
        }

        twitterFetcher.fetch(
            $('#tweets-' + index).attr('data-widget-id'), '', 5, true, true, true, '', true, handleTweets);
    });

    // Instagram Feed

    jQuery.fn.spectragram.accessData = {
        accessToken: '1406933036.fedaafa.feec3d50f5194ce5b705a1f11a107e0b',
        clientID: 'fedaafacf224447e8aef74872d3820a1'
    };

    $('.instafeed').each(function () {
        $(this).children('ul').spectragram('getUserFeed', {
            query: $(this).attr('data-user-name'),
            max: 12
        });
    });

    // Image Sliders

    $('.slider-all-controls').flexslider({
        easing: "swing",
        initDelay: 0,
        animation: "fade",
        direction: "horizontal",
        animationSpeed: 400,
        animationLoop: true,
        slideshow: true,
        slideshowSpeed: 4000,
        touch: true,
        useCSS: true
    });

    $('.slider-paging-controls').flexslider({
        animation: "slide",
        directionNav: false
    });

    $('.slider-arrow-controls').flexslider({
        controlNav: false
    });

    $('.slider-thumb-controls .slides li').each(function () {
        var imgSrc = $(this).find('img').attr('src');
        $(this).attr('data-thumb', imgSrc);
    });

    $('.slider-thumb-controls').flexslider({
        animation: "slide",
        controlNav: "thumbnails",
        directionNav: true
    });

    $('.logo-carousel').flexslider({
        minItems: 1,
        maxItems: 4,
        move: 1,
        itemWidth: 200,
        itemMargin: 0,
        animation: "slide",
        slideshow: true,
        slideshowSpeed: 3000,
        directionNav: false,
        controlNav: false
    });

    // Lightbox gallery titles

    $('.lightbox-grid li a').each(function () {
        var galleryTitle = $(this).closest('.lightbox-grid').attr('data-gallery-title');
        $(this).attr('data-lightbox', galleryTitle);
    });


    // Video Modals
    $('section').closest('body').find('.modal-video[video-link]').remove();

    $('.modal-video-container').each(function (index) {
        $(this).find('.play-button').attr('video-link', index);
        $(this).find('.modal-video').clone().appendTo('body').attr('video-link', index);
    });

    $('.modal-video-container .play-button').click(function () {
        var linkedVideo = $('section').closest('body').find('.modal-video[video-link="' + $(this).attr('video-link') + '"]');
        linkedVideo.toggleClass('reveal-modal');

        if (linkedVideo.find('video').length) {
            linkedVideo.find('video').get(0).play();
        }

        if (linkedVideo.find('iframe').length) {
            var iframe = linkedVideo.find('iframe');
            var iframeSrc = iframe.attr('data-src') + '&autoplay=1';
            iframe.attr('src', iframeSrc);
        }
    });

    $('section').closest('body').find('.close-iframe').click(function () {
        $(this).closest('.modal-video').toggleClass('reveal-modal');
        $(this).siblings('iframe').attr('src', '');
        $(this).siblings('video').get(0).pause();
    });

    // Local Videos

    $('section').closest('body').find('.local-video-container .play-button').click(function () {
        $(this).siblings('.background-image-holder').removeClass('fadeIn');
        $(this).siblings('.background-image-holder').css('z-index', -1);
        $(this).css('opacity', 0);
        $(this).siblings('video').get(0).play();
    });

    // Youtube Videos

    $('section').closest('body').find('.player').each(function () {
        var src = $(this).attr('data-video-id');
        var startat = $(this).attr('data-start-at');
        $(this).attr('data-property', "{videoURL:'http://youtu.be/" + src + "',containment:'self',autoPlay:true, mute:true, startAt:" + startat + ", opacity:1, showControls:false}");
    });

    $('section').closest('body').find(".player").YTPlayer();

    // FS Vid Background

    $(window).resize(function () {
        resizeVid();
    });

    // Interact with Map once the user has clicked (to prevent scrolling the page = zooming the map

    $('.map-holder').click(function () {
        $(this).addClass('interact');
    });

    $(window).scroll(function () {
        if ($('.map-holder.interact').length) {
            $('.map-holder.interact').removeClass('interact');
        }
    });

    // Countdown Timers

    if ($('.countdown').length) {
        $('.countdown').each(function () {
            var date = $(this).attr('data-date');
            $(this).countdown(date, function (event) {
                $(this).text(
                    event.strftime('%D days %H:%M:%S')
                );
            });
        });
    }

    // Get referrer from URL string 
    if (getURLParameter("ref")) {
        $('form.form-email').append('<input type="text" name="referrer" class="hidden" value="' + getURLParameter("ref") + '"/>');
    }

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    // Disable parallax on mobile

    if ((/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        $('section').removeClass('parallax');
    }

    $('[data-js*="contacts"]').on('click', function (e) {
        e.preventDefault();

        $('html, body').stop().animate({
            'scrollTop': $(this.hash).offset().top
        }, 900, 'swing');
    });

    $('[data-js*="mail-decode"]').on('click', function (e) {
        e.stopPropagation();

        var target = $(this).attr('href');
        $(this).attr('href', 'mailto:' + atob(target));
    });

});

$(window).load(function () {
    "use strict";

    // Initialize Masonry

    if ($('.masonry').length) {
        var container = document.querySelector('.masonry');
        var msnry = new Masonry(container, {
            itemSelector: '.masonry-item'
        });

        msnry.on('layoutComplete', function () {

            mr_firstSectionHeight = $('.main-container section:nth-of-type(1)').outerHeight(true);

            // Fix floating project filters to bottom of projects container

            if ($('.filters.floating').length) {
                setupFloatingProjectFilters();
                updateFloatingFilters();
                window.addEventListener("scroll", updateFloatingFilters, false);
            }

            $('.masonry').addClass('fadeIn');
            $('.masonry-loader').addClass('fadeOut');
            if ($('.masonryFlyIn').length) {
                masonryFlyIn();
            }
        });

        msnry.layout();
    }

    // Resize fullscreen video backgrounds to cover parent

    resizeVid();

    // Initialize twitter feed

    var setUpTweets = setInterval(function () {
        if ($('.tweets-slider').find('li.flex-active-slide').length) {
            clearInterval(setUpTweets);
            return;
        } else {
            if ($('.tweets-slider').length) {
                $('.tweets-slider').flexslider({
                    directionNav: false,
                    controlNav: false
                });
            }
        }
    }, 500);

    mr_firstSectionHeight = $('.main-container section:nth-of-type(1)').outerHeight(true);

    // ajax form with formspree
    // --------------------------

    var success = $('#success'),
        success__alert = success.find('.success__alert'),
        success__alert__text = success__alert.find('.success__text'),
        success__overlay = success.find('.success__overlay');

    $("#contact-form").submit(function (e) {

        e.preventDefault();

        $.ajax({
            url: "//formspree.io/hey@codezilla.it",
            method: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function (data) {
                success__alert__text.text("Il tuo messaggio è stato inviato.");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                success__alert__text.text("Ops.. qualcosa è andato storto!");

                if (textStatus === "timeout") {
                    success__alert__text.text("Server timeout.. Houston abbiamo un problema!")
                }
            },
            complete: function () {
                $('#contact-form').trigger("reset");
                success__overlay.show();
                success.removeClass('hide');
            }
        });
    });

    success.on('click', '.close', function (e) {
        e.preventDefault();
        e.stopPropagation();
        success.addClass('hide');
        success__overlay.hide();
    });

});

function resizeVid() {

    $('.fs-vid-background video').each(function () {
        var vid = $(this);
        var ratio = (vid.width() / vid.height());
        var section = vid.closest('section');
        if (section.width() > section.outerHeight()) {
            vid.css('width', (section.width() * ratio));
            vid.css('margin-left', -((section.width() * ratio) / 4));
            vid.css('height', 'auto');
        } else {
            vid.css('width', 'auto');
            vid.css('height', (section.outerHeight() * ratio));
            vid.css('margin-left', 0);
        }
    });

}

function updateNav() {

    var scrollY = mr_scrollTop;

    if (scrollY <= 0) {
        mr_navFixed = false;
        mr_nav.removeClass('scrolled fixed');

        $('.logo-dark').hide();
        $('.logo-light').show();
    }

    else {
        mr_navFixed = true;
        mr_nav.addClass('scrolled fixed');

        $('.logo-light').hide();
        $('.logo-dark').show();
    }
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function masonryFlyIn() {
    var $items = $('.masonryFlyIn .masonry-item');
    var time = 0;

    $items.each(function () {
        var item = $(this);
        setTimeout(function () {
            item.addClass('fadeIn');
        }, time);
        time += 170;
    });
}

function setupFloatingProjectFilters() {
    mr_floatingProjectSections = [];
    $('.filters.floating').closest('section').each(function () {
        var section = $(this);

        mr_floatingProjectSections.push({
            section: section.get(0),
            outerHeight: section.outerHeight(),
            elemTop: section.offset().top,
            elemBottom: section.offset().top + section.outerHeight(),
            filters: section.find('.filters.floating'),
            filersHeight: section.find('.filters.floating').outerHeight(true)
        });
    });
}

function updateFloatingFilters() {
    var l = mr_floatingProjectSections.length;
    while (l--) {
        var section = mr_floatingProjectSections[l];

        if (section.elemTop < mr_scrollTop) {
            section.filters.css({
                position: 'fixed',
                top: '16px',
                bottom: 'auto'
            });
            if (mr_navScrolled) {
                section.filters.css({
                    transform: 'translate3d(-50%,48px,0)'
                });
            }
            if (mr_scrollTop > (section.elemBottom - 70)) {
                section.filters.css({
                    position: 'absolute',
                    bottom: '16px',
                    top: 'auto'
                });
                section.filters.css({
                    transform: 'translate3d(-50%,0,0)'
                });
            }
        } else {
            section.filters.css({
                position: 'absolute',
                transform: 'translate3d(-50%,0,0)'
            });
        }
    }
}