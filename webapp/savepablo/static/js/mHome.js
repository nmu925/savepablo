
$(document).ready(function(){
  $('#game').click(function(event){
    var spinner = document.createElement('i')
    spinner.innerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:48px"></i> <p> Searching for game </p>'
    var div = document.getElementById('spinner'); 
    div.appendChild(spinner);
  
  });

});
