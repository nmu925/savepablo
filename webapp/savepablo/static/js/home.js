var mps = 1; 
var yeezy = {name:"yeezy",mps:1,count:0};
var kim = {name:"kim",mps:10, count:0};
var tidal = {name:"tidle",mps:100,count:0};
var gfm = {name:"gfm",mps:1000,count:0};
var mark = {name:"mark",mps:10000,count:0};
var dict = {};
dict['yeezy'] = yeezy; 
dict['kim'] = kim; 
dict['tidal'] = tidal; 
dict['gfm'] = gfm; 
dict['mark'] = mark; 



function getCSRFToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("csrftoken=")) {
            return cookies[i].substring("csrftoken=".length, cookies[i].length);
        }
    }
    return "unknown";
}

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
function updateMoney(num){
  var t = document.getElementById('money');
  t.innerHTML = num + "";
} 


$(document).ready(function(){
  /* Handles logic when you click Kanye */ 
  $("#kanye").click(function() {
    g(); 
  });
  /* Handles logic when items is bought*/
  $('.img').not('#kanye').click(function(event){
    console.log("testing\n");
    var hoverElem = event.target;
    var obj = dict[hoverElem.id];
    console.log(hoverElem.id + '\n');
    var par = hoverElem.parentNode.parentNode;
    console.log(par.className + '\n');
    var p = par.querySelector(".text");
    console.log(p.className + '\n');
    var currentMoney = parseInt(document.getElementById('money').innerHTML);
    var oC = p.querySelector("#owned");
    var pC = p.querySelector("#price");
    var currentPrice = parseInt(pC.innerHTML);
    if(currentPrice < currentMoney){
      updateMPS(obj.mps);
      obj.count++;
      updateMoney(currentMoney - currentPrice);
      oC.innerHTML = parseInt(oC.innerHTML) + 1;
      pC.innerHTML = (parseInt(pC.innerHTML) * 1.5).toFixed(1);
    }

  });
});

window.onload = function(){ 
  /* Sends ajax request to save game */
  var save = document.getElementById('save');
  save.onclick = function(){
  console.log('clicked\n');
  var dictJ = JSON.stringify(dict);
  
  $.ajax({
    url: "/savepablo/save",
    
    data:{csrfmiddlewaretoken: getCSRFToken(), 
          items : dictJ},
    type: "POST",
    datatype:"json", 

    success: function(json){
      console.log('success\n');
      var success = document.getElementsByClassName('alertsuccess')[0];
      var newE = document.createElement('div');
      newE.className = 'alert alert-success';
      newE.innerHTML = "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Success saving!</strong>";
      success.appendChild(newE);
      
    }
         
  })
  return false;
  }

}

setInterval(g,1000)
