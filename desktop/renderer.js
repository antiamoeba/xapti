// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
$(function() {
    let fileChooser = $("#fileChooser");
    let selectorButton = fileChooser.find(".selector").first();
    let hidden = fileChooser.find(".fileSelect").first();
    selectorButton.click(function() {
        console.log("here!");
        hidden.trigger("click");
    });
    hidden.on('change',function(){
        var fullPath = hidden.val();
        let selected = fileChooser.find(".selected").first();
        selected.text(fullPath);
    });
    let form = $("#upload");
    form.on('submit', function(e) {
        e.preventDefault();
    });
    $(".final").click(function() {
        let formData = new FormData(form[0]);
        $.ajax({
            url: 'upload',
            type: 'POST',
            //Ajax events
            //beforeSend: beforeSendHandler,
            success: function(res, status) {
                if (res.type == "Success") {
                    window.location = res.message;
                    return;
                }

                $("#message").text(res.message);
            },
            error: function(req, err) {
                console.log(err);
            },
            // Form data
            data: formData,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });

    });
});