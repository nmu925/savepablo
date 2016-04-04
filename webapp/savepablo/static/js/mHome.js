function getCSRFToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("csrftoken=")) {
            return cookies[i].substring("csrftoken=".length, cookies[i].length);
        }
    }
    return "unknown";
}
//bool that stores if we should should still search
var keepSearching = false;

function sendReadyBegin(){
    $.ajax({
    url: "/savepablo/ready",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "POST",
    datatype:"text/plain",

    success:function(state){
      //Load the game
      setTimeout(function(){window.location.href = "/savepablo/game"}
                  ,3500); 
      console.log("success\n");
     },

    error:function(state){
      //We recieve an error if we cannot find a match
      //We can simply call the function again until we get a success
      console.log('not ready\n');     
      setTimeout(sendReadyBegin,2000);
    }

    })

}
function pingServer(){
    if(keepSearching){
      $.ajax({
      url: "/savepablo/queue",

      data:{csrfmiddlewaretoken: getCSRFToken()},

      type: "POST",
      datatype:"text/plain",

      success:function(state){
        sendReadyBegin(); 
       },

      error:function(state){
        //We recieve an error if we cannot find a match
        //We can simply call the function again until we get a success
        console.log('no match\n');   
        setTimeout(pingServer,3000);
        
      }

      })
    }
}

$(document).ready(function(){
  $('#cancel').click(function(event){
    $.ajax({
    url: "/savepablo/cancel",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "POST",
    datatype:"text/plain",

    success:function(state){
      keepSearching = false; 
      $('#game').show()
      $('#invite').show()
      $('#cancel').hide()
      $('#spinner').hide()

     },
    })
  });

  $('#invite').click(function(event){
   $.ajax({
    url: "/savepablo/invite",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "POST",
    datatype:"text/plain",

    success:function(state){
      $('#game').hide()
      $('#invite').hide()
      $('#cancel').show()
      $('#spinner').show()
      $('#wait').show()
      $('#search').hide()
     },
    })
  });

  $('#game').click(function(event){
    keepSearching = true; 
     //Hide find game buttons, show spinner,cancel button
    $('#game').hide();
    $('#invite').hide();
    $('#cancel').show();
    $('#spinner').show();
    $('#search').show();
    $('#wait').hide()

    //Find game
    pingServer();
    });
});
