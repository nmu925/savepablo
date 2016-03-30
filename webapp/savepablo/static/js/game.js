function getCSRFToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("csrftoken=")) {
            return cookies[i].substring("csrftoken=".length, cookies[i].length);
        }
    }
    return "unknown";
}


function updateMPS(num){
  var t = document.getElementById('mps'); 
  t.innerHTML = num;
}
function updateMoney(num){
  var t = document.getElementById('money');
  t.innerHTML = num;
} 

//Updates count,cost elements of an image elem
function updateView(elem,count,cost){
  //Get corresponding fields
  var par = elem.parentNode.parentNode;
  var p = par.querySelector(".text");
  var oC = p.querySelector("#owned");
  var pC = p.querySelector("#price");
  //update final values shown 
  oC.innerHTML = count;
  pC.innerHTML = cost;

}

//Sends ajax request to server, to update money every second
function updateGame(){
    $.ajax({
    url: "/savepablo/mstep",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "POST",
    datatype:"json",

    success:function(state){
        updateMoney(state['money']);
     }

    })
}

$(document).ready(function(){
  

  /* Sends request to server, which takes care of game logic when clicking
   * on Kanye */ 
  $("#kanye").click(function() {
    $.ajax({
    url: "/savepablo/mclick",
    
    data:{csrfmiddlewaretoken: getCSRFToken()},
    type: "POST",
    datatype:"text/plain", 

    success: function(money){
      updateMoney(money);
    }
         
  })
  });

  /* Handles logic when items is bought*/
  $('.img').not('#kanye').click(function(event){

    var hoverElem = event.target;
    var id = hoverElem.id;

    $.ajax({
      url: "/savepablo/bought",
      
      data:{csrfmiddlewaretoken: getCSRFToken(),
            id : id},
      type: "POST",
      datatype:"json", 

      success: function(data){
        // Not enough money to buy
        if(data.length == 0){
          console.log('not enough money')
        }
        //Update frontend to match server data
        else{
          //Parse data from json
          var count = data['count'];
          var cost = data['cost'];
          var mps = data['mps'];
          var money = data['money'];
          //find correct element to modify 
          var hoverElem = event.target;
          //update final values shown 
          updateMPS(mps);
          updateMoney(money);
          updateView(hoverElem,count,cost)

        }
      }
    })
  });
});
