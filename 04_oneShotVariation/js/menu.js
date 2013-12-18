(function Menu($, win, doc, undefined) {
    var self = this;
    this.attachOneShot = function() {
        $(doc).on('click', function(e) {
            self.update('log', 'clicked: ' + ((e.target.id) ? '#' + e.target.id : e.target));
            if (!$(e.target).is('#innerContainer, #innerContainer *')) {
                self.update('ui', 'warning');
                self.toggleMenu('up');
            } else {

                e.stopPropagation();
            }
        });
    };
    this.toggleMenu = function(dir) {
        if (dir === 'down') {
            $('#inner').slideDown(1500);
        }
        if (dir === 'up') {
            $('#inner').slideUp(1000, function() {
                $(document).off('click');
                $('#eTargetStatus label').text('Status :');
                self.update('ui', '');
                self.update('log', 'document-wide click event listener removed');
            });

        }
    };
    this.update = function(type, status, data) {
        switch (type) {
            case 'ui':
                $('body').removeClass('warning error success info').addClass(status);
                $('#eTargetStatus label').text('Status:');
                break;
            case 'log':
                $('#eTargetStatus input').val(status);
                if (data !== 'undefined') {
                    $('#eTargetStatus label').text(data);
                }
                break;
            default:
                break;
        }
    };
    this.init = (function() {
        $('#trigger').on('click', function() {
            self.update('ui', 'info');
            self.toggleMenu('down');
            self.attachOneShot();
        });

        // FORM SUBMISSION
        $('form').submit(function(e) {
            e.preventDefault();
            var d; // data were are going to send via fake POST request
            var input = {
                user: $('input[name=user]').val(),
                pass: $('input[name=pass]').val()
            }; // form inputs

            // check dem form inputs!!!
            if (input['user'] === '' || (input['pass']) === '') {
                self.update('log', 'no input!', 'Error!');
                self.update('ui', 'error');
                return false;
            } else {
                // let's get it on!

                // form attributes
                var form_url = $(this).attr("action");
                var form_method = $(this).attr("method").toUpperCase();

                /* Input form data */
                d = {
                    "json": JSON.stringify({
                        user: $('input[name=user]').val(),
                        pass: $('input[name=pass]').val()
                    }),
                    delay: 1.5 // fake server response delay
                };
                $("#loadImg").show(); // AJAX SPINNER!

                // the main event
                $.ajax({
                    url: form_url,
                    type: form_method,
                    data: d,
                    success: function(data) {
                        $('#loadImg').hide(); // hide spinner!
                        self.update('ui', 'success');
                        self.update('log', JSON.stringify(data), 'Data: ');
                        self.toggleMenu('up');

                    },
                    error: function(e) {
                        self.update('ui', 'error');
                        console.log('error', e);
                    }
                });
            }
        });

    }());

}(jQuery, window, document));
        