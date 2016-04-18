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

function set_oMps(num){
  var t = document.getElementById('oMps'); 
  t.innerHTML = num;
}
function set_oMoney(num){
  var t = document.getElementById('oMoney');
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
//Update only cost element of an image elem, used for right column
function updateCost(elem,cost){
  //Get corresponding fields
  var par = elem.parentNode.parentNode;
  var p = par.querySelector(".text");
  var pC = p.querySelector("#price");
  //update final values shown 
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
function getOpp(){
    $.ajax({
    url: "/savepablo/getopp",

    type: "GET",
    datatype:"json",

    success:function(state){
        fields = state[0]['fields']
        money = fields['mPoints']
        mps = fields['mMps']
        set_oMps(mps)
        set_oMoney(money)
     }

    })

}

$(document).ready(function(){

  //Sends ajax request to remove Games with the user as a player. 
  $(window).unload(function(){
    $.ajax({
      type: 'POST',
      //false, since ajax request may be cancelled if window is unloaded
      async: false,
      url: '/savepablo/unload',
      data:{csrfmiddlewaretoken: getCSRFToken()},
      success: function(test){

      } 
    })
  
  })
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
  $('.image').not('#kanye').click(function(event){

    var hoverElem = event.target;
    var id = hoverElem.id;

    $.ajax({
      url: "/savepablo/mbought",
      
      data:{csrfmiddlewaretoken: getCSRFToken(),
            id : id},
      type: "POST",
      datatype:"json", 

      success: function(data){
        $('#hold').empty(); //Remove any messages
        //Reset images to original
        //Necesary since the images may be pirate bay from the debuff
        var elem = document.getElementsByClassName('image');
        if(elem[0].src.indexOf('/static/img/pirate-bay.jpg') != -1 ){
              elem[0].src = '/static/img/yeezys.jpg'
              elem[1].src = '/static/img/kim k.jpg'
              elem[2].src = '/static/img/tidal.jpg'
              elem[3].src = '/static/img/gofundme.png'
              elem[4].src = '/static/img/mark z .jpq'
        }
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
          updateView(hoverElem,count,cost);
        }
       },
        error: function(msg){
          console.log(msg.responseText)
          var strings = msg.responseText.split(" ");
          console.log(strings);
          if(strings[0] == 'debuff'){
              //Set each picture in store to pirate
              var elem = document.getElementsByClassName('image');
              for(i=0; i < elem.length;i++){
                  var e = elem[i];
                  e.src = '/static/img/pirate-bay.jpg';
              }
              //Show message indicating how many seconds left off debuff
             var div = document.createElement('div');
             var a = document.createElement('a');
             var p = document.createElement('p');
             a.innerHTML = "&times";
             a.className = "close";
             a.setAttribute('data-dismiss','alert');
             a.setAttribute('aria-label','close');
             div.className = "alert alert-danger";
             div.appendChild(a);
             p.innerHTML = 
            'You\'re items have been disabled for ' + strings[1] + ' more seconds!';
             div.appendChild(p);
             $('#hold').empty();
             $('#hold').append(div);
          }

        }
    })
  });
  /* Handles logic when debuff is bought*/
  $('.debuff').click(function(event){

    var hoverElem = event.target;
    var id = hoverElem.id;

    $.ajax({
      url: "/savepablo/debuff",
      
      data:{csrfmiddlewaretoken: getCSRFToken(),
            id : id},
      type: "POST",
      datatype:"json", 

      success: function(data){
          if(data.length == 0){
            console.log("not enough money");
            console.log(id);
          }
          else{
          //Parse data from json
          var cost = data['cost'];
          var money = data['money'];
          //find correct element to modify 
          var hoverElem = event.target;
          //update final values shown 
          updateMoney(money);
          updateCost(hoverElem,cost);
          
          }
        }
      })
    })

});
//Temporary interval times for now, may need to decrease time
setInterval(updateGame,1000);
setInterval(getOpp,1000);
