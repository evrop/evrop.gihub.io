"use strict";
$(document).ready(function() {
    $("#contactform").validate({
        rules: {
            sendername: "required",
            senderemail: {
                required: !0,
                email: !0
            },
            message: "required"
        },
        messages: {
            sendername: "Please enter your name",
            senderemail: {
                required: "please enter your email",
                email: "please, enter valid email address"
            },
            message: "would you leave a message"
        },
        errorPlacement: function(e, a) {
            console.log(a), e.insertBefore(a)
        },
        submitHandler: function(e) {
            return $.ajax({
                type: "POST",
                url: "php/contact_me.php",
                data: $("#contactform").serialize(),
                datatype: "html",
                success: function(e, a, r) {
                    alert("success"), console.log(r)
                }
            }), !1
        }
    })
});
