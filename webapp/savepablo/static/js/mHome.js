function getCSRFToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("csrftoken=")) {
            return cookies[i].substring("csrftoken=".length, cookies[i].length);
        }
    }
    return "unknown";
}

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
      setTimeout(pingServer,3000)
    }

    })
}

$(document).ready(function(){
  $('#cancel').click(function(event){

    $.ajax({
    url: "/savepablo/cancel",

    data:{csrfmiddlewaretoken: getCSRFToken()},

    type: "POST",
    datatype:"text/plain",

    success:function(state){
      $('#game').show()
      $('#invite').show()
      $('#cancel').hide()
      $('#spinner').hide()
     },
    })
  })

  $('#game').click(function(event){
     //Hide find game buttons, show spinner,cancel button
    $('#game').hide()
    $('#invite').hide()
    $('#cancel').show()
    $('#spinner').show()

    //Find game
    pingServer();
    });
});
