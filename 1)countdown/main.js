$({val : 0}).animate({val : 90546.5}, {
    duration: 3000,
    step: function(){
        var num = numberWithCommas(this.val.toFixed(1));
        $(".count").text(num);
    },
    complete: function() {
        var num = numberWithCommas(this.val.toFixed(1));
        $(".count").text(num);
    }
});
function numberWithCommas(x) {
return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}