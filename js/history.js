let token = (document.cookie).slice(6)
if(!token) document.location.href = "./login.html";

function getTickets(){
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8000/ticket/",
      contentType: 'application/json; charset=utf-8',
      headers : { "Authorization":  token},
      success: function (result, status) {
          table = document.getElementById("tbl_tickets");
          $("#tbl_tickets tr").remove();
        
  
          result.forEach( (element, index) => {
              var row = table.insertRow(index);
              var length_ticket = (Object.keys(element).length) -1;
              for( var i = 0; i < length_ticket; i++ ){
                  var current_column = row.insertCell(i);
                  var key = Object.keys(element)[i];
                  current_column.innerHTML = element[key];
              }
            
        
               
          });
  
      },
      error: function (error, status) {
        let message = JSON.parse(error.responseText)

        Swal.fire(message.message, '', 'error')
          if(error.status == 401) {
            document.location.href = "./login.html"
          }
      }
   })
  }

getTickets();

function logout(){
    document.cookie = "token=; max-age=0";
    document.location.href = "./login.html";
 }