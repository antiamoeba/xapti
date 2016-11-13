backgroundList = ['oceans.jpg', 'thousandislandlake.jpg', 'coralreef.jpg'];
$(function() {
    let randIndex = Math.floor(Math.random() * backgroundList.length);
    $('body').css('background-image', 'url(backgrounds/' + backgroundList[randIndex] + ')');
});