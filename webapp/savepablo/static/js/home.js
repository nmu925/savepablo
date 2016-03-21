var go = 1


var g = function() {
    if (!go) return;
    var t = document.getElementById('money');
    var x = parseInt(t.innerHTML);
    t.innerHTML = x + 1 + "";
}

$(document).ready(function(){
  $("#kanye").click(function() {
    g(); 
  });
});

setInterval(g,1000)
