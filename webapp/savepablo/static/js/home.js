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

function updateLeaderboard() {

  $.ajax({
    url: "/savepablo/getBoard",
    type: "GET",
    datatype:"json",

    success:function(state){
      console.log(state);
      $("ol#board").empty();
      for(var i = 0; i < state.length; i++){
        var t = state[i];
        var temp = t['fields'];
        var user = t['user'];
        var username = user['username']
        $("ol#board").append("<li>"+username + " - $" + temp['points']+"</li>");
      }
    },
    error: function(xhr, textStatus, errorThrown){
       console.log(textStatus+ ' - request failed: '+errorThrown);
    }

  });
}

//Sends ajax request to server, to update money every second
function updateGame(){
    $.ajax({
    url: "/savepablo/step",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "POST",
    datatype:"json",

    success:function(state){
        updateMoney(state['money']);
     }

    });
}

$(document).ready(function(){

  //Load the game state from server
  $.ajax({
    url: "/savepablo/load",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "GET",
    datatype:"json",

    success:function(state){
      updateLeaderboard();

      for(var i = 0; i < state.length; i++){
        var obj = state[i];
        var type = obj['model']
        if(type == 'savepablo.item'){
          var fields = obj['fields'];
          var id = fields['name'];
          var count = fields['count'];
          var cost = fields['cost'];
          var elem = document.getElementById(id);
          updateView(elem,count,cost);
        }
        if(type == 'savepablo.myuser'){
          var fields = obj['fields'];
          var money = fields['points'];
          var mps = fields['mps'];
          updateMoney(money);
          updateMPS(mps);
        }
      }
    }
  });


  /* Sends request to server, which takes care of game logic when clicking
   * on Kanye */ 
  $("#kanye").click(function() {
    $.ajax({
    url: "/savepablo/click",
    
    data:{csrfmiddlewaretoken: getCSRFToken()},
    type: "POST",
    datatype:"text/plain", 

    success: function(money){
      updateMoney(money);
    }
         
  });
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
    });
  });
});


setInterval(updateGame,1000)
setInterval(updateLeaderboard, 1000)
