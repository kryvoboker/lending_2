$(function () {

	$('.slider__inner, .news__slider-inner').slick({
		nextArrow: '<button type="button" class="slick-btn slick-next"></button>',
		prevArrow: '<button type="button" class="slick-btn slick-prev"></button>',
		infinite: false,
		responsive: [
			{
				breakpoint: 801,
				settings: {
					infinite: true,
					dots: true
				}
			}
		]
	});

	$('select').styler();

	$('.header__btn-menu').on('click', function () {
		$('.header__menu-lists').slideToggle();
	});

});