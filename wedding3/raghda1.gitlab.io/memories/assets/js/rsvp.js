"use strict";
$(document).ready(function() {
    $("#rsvpform").validate({
        rules: {
            guestname: "required",
            guestemail: {
                required: !0,
                email: !0
            },
            guestcoming: "required",
            events: {
                required: "#coming:checked",
                minlength: 1
            },
            guestmessage: "required"
        },
        messages: {
            guestname: "Please enter your name",
            guestemail: {
                required: "please enter your email",
                email: "please, enter valid email address"
            },
            guestcoming: "please choose one",
            events: "Please select at least 1 event",
            guestmessage: "would you leave a message"
        },
        errorPlacement: function(e, s) {
            console.log(s), e.insertBefore(s)
        },
        submitHandler: function(e) {
            return $.ajax({
                type: "POST",
                url: "php/rsvp.php",
                data: $("#rsvpform").serialize(),
                datatype: "html",
                success: function(e, s, a) {
                    alert("success"), console.log(a)
                }
            }), !1
        }
    });
    var e = $("#coming"),
        s = e.is(":checked"),
        a = $("#wedding_events")[s ? "removeClass" : "addClass"]("gray"),
        r = a.find("input").attr("disabled", !s),
        t = $("#no-of-guests").attr("disabled", !s);
    a.hide(), t.parent(".form-group").hide();
    var i = $("input[name=guestcoming]:radio");
    i.on("change", function() {
        "coming" === this.value ? (a.removeClass("gray"), r.removeAttr("disabled"), t.removeAttr("disabled"), a.show("slow"), t.parent(".form-group").show("slow")) : "notcoming" === this.value && (a.hide(700), t.parent(".form-group").hide(700), a.addClass("gray"), r.attr("disabled", "disabled"), r.removeAttr("checked"), $("#events-error").remove(), t.attr("disabled", "disabled"))
    })
});
