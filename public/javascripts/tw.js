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
