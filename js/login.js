'use strict';

$(function() {

    $("input[type='password'][data-eye]").each(function(i) {
        var $this = $(this),
            id = 'eye-password-' + i,
            el = $('#' + id);

        $this.wrap($("<div/>", {
            style: 'position:relative',
            id: id
        }));

        $this.css({
            paddingRight: 60
        });
        $this.after($("<div/>", {
            html: 'Show',
            class: 'btn btn-primary btn-sm',
            id: 'passeye-toggle-' + i,
        }).css({
            position: 'absolute',
            right: 10,
            top: ($this.outerHeight() / 2) - 12,
            padding: '2px 7px',
            fontSize: 12,
            cursor: 'pointer',
        }));

        $this.after($("<input/>", {
            type: 'hidden',
            id: 'passeye-' + i
        }));

        var invalid_feedback = $this.parent().parent().find('.invalid-feedback');

        if (invalid_feedback.length) {
            $this.after(invalid_feedback.clone());
        }

        $this.on("keyup paste", function() {
            $("#passeye-" + i).val($(this).val());
        });
        $("#passeye-toggle-" + i).on("click", function() {
            if ($this.hasClass("show")) {
                $this.attr('type', 'password');
                $this.removeClass("show");
                $(this).removeClass("btn-outline-primary");
                $(this).html('show');
            } else {
                $this.attr('type', 'text');
                $this.val($("#passeye-" + i).val());
                $this.addClass("show");
                $(this).addClass("btn-outline-primary");
                $(this).html('hide');
            }
        });
    });

    $(".my-login-validation").submit(function() {
        var form = $(this);
        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.addClass('was-validated');
    });

    $('#password[data-register], #confirm_password[data-register]').on('keyup', function() {

        if ($('#password').val() == $('#confirm_password').val()) {

            if ($('#password').val() == '') {
                $('#confirm_password')[0].setCustomValidity('Password required');
                $('#message').html('');
            } else {
                $('#message').html('Matching').css('color', 'green');
                $('#confirm_password')[0].setCustomValidity('');
            }

        } else {
            $('#message').html('Not Matching').css('color', 'red');
            $('#confirm_password')[0].setCustomValidity('Passwords must match');
        }

    });

});

$('input[name=password][data-register], input[name=new_password][data-register]').keyup(function(e) {
    var strength = document.getElementById('strength');
    var strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{9,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
    var pwd = this;
    if (pwd.value.length == 0) {
        strength.innerHTML = '';
        pwd.setCustomValidity('Password must contain 6 characters');
    } else if (false == enoughRegex.test(pwd.value)) {
        strength.innerHTML = 'More Characters';
        pwd.setCustomValidity('Password must contain 6 characters');
    } else if (strongRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:green">Strong!</span>';
        pwd.setCustomValidity('');
    } else if (mediumRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:orange">Medium!</span>';
        pwd.setCustomValidity('');
    } else {
        strength.innerHTML = '<span style="color:red">Weak!</span>';
        pwd.setCustomValidity('');
    }
});