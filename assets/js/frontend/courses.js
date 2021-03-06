jQuery(function ($) {

    var categorySlug = '';
    var loadingAjax = false;

    $.post(
        lucid_courses_params.ajax_url,
        {
            action  : 'get_all_courses',
            security: lucid_courses_params.get_all_courses_nonce
        },
        function (response) {

            // TODO: handle errors
            if (response) {
                $('.loading-categories').fadeOut(600, function () {
                    $('.loading-categories').after(response);
                    var leng = $('.course-category').length;
                    if (leng > 1) {
                        $(".course-category .expand").toggler({cbMethod: $.fn.loadCoursesCategoryWrap});
                    } else {
                        $(".course-category .expand").shown({cbMethod: $.fn.loadCoursesCategoryWrap});
                    }
                });
            }
        }
    );

    $.fn.loadCoursesCategoryWrap = function(element) {
        if (loadingAjax) {
            return false;
        }
        categorySlug = element.attr('data-category-slug');
        if (element.next('div.collapse').find('article').length === 0) {
            $.fn.loadCoursesCategory(element);
        }
    };

    $.fn.loadCoursesCategory = function(clickedEl) {
        loadingAjax = true;
        $.post(
            lucid_courses_params.ajax_url,
            {
                action      : 'get_category_courses',
                categorySlug: categorySlug,
                security    : lucid_courses_params.get_category_courses_nonce
            },
            function (response) {
                loadingAjax = false;

                // TODO: handle errors
                if (response) {
                    clickedEl.next('div.collapse').fadeOut(600, function () {
                        clickedEl.next('div.collapse').html(response).fadeIn(600);
                    });
                }
            }
        );
    };

	$(document).on('click', '.see-more', function (e) {
		e.preventDefault();

		$(this).parent().find('.excerpt').slideToggle();
	});

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    function remove_cources() {
        $('.lucidlms .type-course').remove();
        $('.lucidlms p.lucidlms-info').remove();

    }

    function hide_cources_with_categories() {
        $('.lucidlms .course-category').hide();
    }
    function show_cources_with_categories() {
        $('.lucidlms .course-category').show();
    }

    $(document).on('click', '#lu-search-submit', search_courses);
    $(document).on('keypress', '#lu-search', function (e) {
        if (e.which == 13) {
            search_courses();
            return false;    //<---- Add this line
        }
    });

    function search_courses() {
        delay(function(){
            hide_cources_with_categories();
            remove_cources();
            $('#reset-search').css("display", "block");
            if (!$('#lu-search').val()){
                remove_cources();
                show_cources_with_categories();
                $('#reset-search').css("display", "none");
            } else{
                $.post(
                    lucid_courses_params.ajax_url,
                    {
                        action  : 'get_searched_courses',
                        security: lucid_courses_params.get_searched_courses_nonce,
                        query   : $('#lu-search').val()
                    },
                    function (response) {

                        if (response) {
                            $('.loading-categories').fadeOut(600, function () {
                                $('.loading-categories').after(response);
                            });
                        }
                    }
                );
            }
        }, 1000 );
    };

    $('#reset-search').click(function(){
        remove_cources();
        $('#lu-search').val('');
        $('#reset-search').css("display", "none");
        show_cources_with_categories();
    });

    // Load and show all courses for one category when page load
    $.fn.shown = function (options) {
        var o = $.extend({}, $.fn.toggler.defaults, options);

        if ($.isFunction(o.cbMethod)) {
            o.cbMethod($(this));
        }
    };
});