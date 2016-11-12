backgroundList = ['oceans.jpg', 'thousandislandlake.jpg'];
$(function() {
    let randIndex = Math.floor(Math.random() * backgroundList.length);
    $('body').css('background-image', 'url(backgrounds/' + backgroundList[randIndex] + ')');
    let fileChooser = $("#fileChooser");
    let selectorButton = fileChooser.find(".selector").first();
    let hidden = fileChooser.find(".fileSelect").first();
    selectorButton.click(function() {
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
            success: function() {
                console.log("succeeded");
            },
            error: function(req, e) {
                console.log(e);
                console.log("error!");
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