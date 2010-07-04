/* Ridiculous rotating text fun. */
$(function() {
    var do_texts_index = 0;
    var do_texts = [
	'write code',
	'dance awkwardly',
	'can be found on IM at <code>scott@quadhome.com</code> via <a href="gtalk:chat?jid=scott@quadhome.com">GTalk</a> or <a href="xmpp:scott@quadhome.com">XMPP</a>',
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
		$('#control').attr('href', '#' + next_slide().attr('id'))
		.html((next_slide() == first_slide) ? '&lArr;' : '&rarr;');
	    });
	});
    };

    $.history.init(function(hash) {
	if (hash) {
	    load_slide = $('#' + hash);
	    turn(load_slide.length ? load_slide : first_slide);
	} else {
	    document.location.hash = '#1';
	}
    });
});

/* Epic Sax */
$(function() {
    var SAX_RATE = 2000;

    $('#victim').addClass('inactive');

    $('#victim').focus(function() {
	$(this).val('');
	$('#victim').removeClass('inactive');
    });

    $('#victim').blur(function() {
	/* TODO: Re-entry clears user entered data. Don't care. */
	if ($(this).val() == '') {
	    $(this).val('+1 555 555-1212');

	    $('#victim').addClass('inactive');
	}
    });

    var sax_response = function(message, number) {
	$('#victim').val(message);

	setTimeout(function() {
	    $('#button').removeAttr('disabled');
	    $('#victim').removeAttr('disabled').removeClass('calling').val(number);
	}, SAX_RATE);
    }

    $('#sax').submit(function() {
	var number = $('#victim').val();

	$.ajax({
	    url: '/sax/call',
	    type: 'POST',
	    data: {victim: number},	/* Should sanitize here. But $20 on a prepaid account means I can trust people. */
	    beforeSend: function() {
		$('#button').attr('disabled', 'true');
		$('#victim').attr('disabled', 'true').addClass('calling').val('Calling...');
	    },
	    success: function() {
		sax_response('So smooth.', number);
	    },
	    error: function() {
		sax_response('Wrong number?', number);
	    },
        });

	return false;
    });
});
