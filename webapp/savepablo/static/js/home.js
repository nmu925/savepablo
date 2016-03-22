var mps = 1; 
var yeezy = {name:"yeezy",mps:1};
var kim = {name:"yeezy",mps:10};
var tidle = {name:"yeezy",mps:100};
var gfm = {name:"yeezy",mps:1000};
var mark = {name:"yeezy",mps:10000};
var dict = {};
dict['yeezy'] = yeezy; 
dict['kim'] = kim; 
dict['tidle'] = tidle; 
dict['gfm'] = gfm; 
dict['mark'] = mark; 



var g = function() {
    var t = document.getElementById('money');
    var x = parseInt(t.innerHTML);
    t.innerHTML = x + mps + "";
}

function updateMPS(num){
  var t = document.getElementById('mps');
  mps += num; 
  t.innerHTML = mps + "";
}

$(document).ready(function(){
  $("#kanye").click(function() {
    g(); 
  });
  $('.hover').click(function(event){
    console.log("testing\n");
    var hoverElem = event.target;
    var obj = dict[hoverElem.id];
    updateMPS(obj.mps);
    console.log(hoverElem.id + '\n');
    var par = hoverElem.parentNode.parentNode;
    console.log(par.className + '\n');
    var p = par.querySelector(".text");
    console.log(p.className + '\n');
    var oC = p.querySelector("#owned");
    var pC = p.querySelector("#price");
    oC.innerHTML = parseInt(oC.innerHTML) + 1;
    pC.innerHTML = (parseInt(pC.innerHTML) * 1.5).toFixed(1);
    
    
  });
});

setInterval(g,1000)
