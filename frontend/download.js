$(function() {
    $(".download").click(function() {
        window.location = "/file/" + $(this).attr("downloadid");
        var dNum = $(".dNum");
        dNum.text(parseInt(dNum.text())-1);
    });
});