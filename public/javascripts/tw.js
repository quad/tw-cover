/* Ridiculous rotating text fun. */
$(function() {
    var do_texts_index = 0;
    var do_texts = [
	'write code',
	'dance awkwardly',
	'can be reached at <code>scott@quadhome.com</code> via <a href="gtalk:chat?jid=scott@quadhome.com">GTalk</a> or <a href="xmpp:scott@quadhome.com">XMPP</a>',
	'don\'t take no for an answer'
    ];

    var rotate_do = function() {
	/* Only rotate if we're visible. */
	if ($('#do').is(':visible')) {
	    do_texts_index = (do_texts_index + 1) % do_texts.length;

	    $('#do').fadeOut('slow', function() {
		    $('#do').html(do_texts[do_texts_index]).fadeIn('slow');
	    });
	}
    };

    setInterval(rotate_do, 5000);
});

/* Slide flipping awesomeness. */
$(function() {
    $('.slide').hide();
    $('#control').addClass('active');

    var first_slide = $('#1');
    var next_slide = function() {
	var np = $('.shown').next();

	return np.hasClass('slide') ? np : first_slide;
    }

    var turn = function(target_slide) {
	$('.shown').removeClass('shown').fadeOut('fast', function() {
	    target_slide.addClass('shown').fadeIn('fast', function() {
		$('#control').html((next_slide() == first_slide) ? '&lArr;' : '&rarr;');
		document.location.hash = $(this).attr('id');
	    });
	});
    };

    $('#control').click(function() {
	turn(next_slide());
    });

    /* Load the slide from URL hash. */
    load_slide = $(document.location.hash);
    turn(load_slide.length ? load_slide : first_slide);
});
