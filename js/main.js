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
       let aux;
       let data_ticket = [];
       result.forEach((element)=> {
         
         if(element.archived == 0){
           data_ticket.push(element)
         }
       })

       data_ticket.forEach( (element, index) => {

           var row = table.insertRow(index);
           var length_ticket = (Object.keys(element).length) -1;
           for( var i = 0; i < length_ticket; i++ ){
               var current_column = row.insertCell(i);
               var key = Object.keys(element)[i];
               current_column.innerHTML = element[key];
           }
            var current_column = row.insertCell(8);
            let id = element.id;
            let status = element.status;
            console.log(status);
            if( status === "Not Started"){
             current_column.innerHTML = '<td><div class="row"><div class="col"><button class="bg-transparent border-0" onclick="Delete('+id+')"><i class="bi bi-trash3"></i></button><button class="bg-transparent border-0" onclick="Edit('+id+')"><i class="bi bi-pencil-square"></i></button>'+
                 '<button class="bg-transparent border-0" onclick="ChangeStatus('+id+', `On Going`)"><i class="bi bi-play-fill"></i></button></div></td>';
            } else if ( status === "On Going"){
             current_column.innerHTML = '<td><div class="row"><div class="col"><button class="bg-transparent border-0" onclick="Delete('+id+')"><i class="bi bi-trash3"></i></button><button class="bg-transparent border-0" onclick="Edit('+id+')"><i class="bi bi-pencil-square"></i></button>'+
               '<button class="bg-transparent border-0 " onclick="ChangeStatus('+id+',`Done`)"><i class="bi bi-check-circle-fill"></i></button></div></div></td>' +
               '<button class="bg-transparent border-0 " onclick="ChangeStatus('+id+', `Pause`)"><i class="bi bi-pause-circle-fill"></i></button></div></div></td>';
            } else if ( status === "Pause"){
             current_column.innerHTML = '<td><div class="row"><div class="col"><button class="bg-transparent border-0" onclick="Delete('+id+')"><i class="bi bi-trash3"></i></button><button class="bg-transparent border-0" onclick="Edit('+id+')"><i class="bi bi-pencil-square"></i></button>'+
               '<button class="bg-transparent border-0 " onclick="ChangeStatus('+id+',`Done`)"><i class="bi bi-check-circle-fill"></i></button></div></div></td>' +
               '<button class="bg-transparent border-0 " onclick="ChangeStatus('+id+', `On Going`)"><i class="bi bi-play-fill"></i></i></button></div></div></td>';
            } else {
             current_column.innerHTML = '<td><div class="row"><div class="col"><button class="bg-transparent border-0" onclick="Delete('+id+')"><i class="bi bi-trash3"></i></button><button class="bg-transparent border-0" onclick="Edit('+id+')"><i class="bi bi-pencil-square"></i></button>'+
               '<button class="bg-transparent border-0 " onclick="Archive('+id+')"><i class="bi bi-folder-fill"></i></button></div></div></td>';
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

function Add(){
 Swal.fire({
   title: '<strong>Add ticket</strong>',
   html:
     '<div class="form-group text-start mb-2"><label class="mb-1" >Ticket Name</label><input type="text" class="form-control"  id="name" aria-describedby="emailHelp" placeholder="Nombre"></div>' +
     '<div class="form-group text-start mb-2"><label class="mb-1" >Descripction</label><input type="text" class="form-control"  id="description" aria-describedby="emailHelp" placeholder="Description"></div>' +
     '<div class="form-group text-start mb-2"><label class="mb-1" >Priority</label><select  class="form-control" id="priority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>'+
     '<div class="form-group text-start mb-2"><label class="mb-1" >Deadline</label><input type="datetime-local" class="form-control" id="deadline" aria-describedby="emailHelp" placeholder="Deadline"></div>' +
     '<div class="form-group text-start mb-2"><label class="mb-1" >Assignee</label><select class="form-control" id="assignee"></select></div>',
     howCloseButton: true,
     showCancelButton: true,
     focusConfirm: false,
     didOpen: function(ele){
    $.ajax({
       type: "GET",
       url: "http://127.0.0.1:8000/user/",
       contentType: 'application/json; charset=utf-8',
       headers : { "Authorization":  token},
       success: function (res) {
         let options = "";
         res.forEach( (val) =>{
         options = options + '<option value="'+ val.id +'">'+  val.username +'</option>'
       })
       $(ele).find('#assignee').append(options);
                     
     },
     error: function(error){
      let message = JSON.parse(error.responseText)

      Swal.fire(message.message, '', 'error')
      if(error.status == 401) {
        document.location.href = "./login.html"
      }
     }
   })
                 
    },
     confirmButtonText:'Send',
     confirmButtonAriaLabel: 'Thumbs up, great!',
     cancelButtonText: 'Cancel',
     cancelButtonAriaLabel: 'Thumbs down'  
   }).then( (r) =>{
     if (r.isConfirmed) {

       let data_ticket ={};
       data_ticket.name = document.getElementById("name").value
       data_ticket.description = document.getElementById("description").value
       data_ticket.priority = document.getElementById("priority").value
       data_ticket.status = "Not Started"
       data_ticket.deadline = document.getElementById("deadline").value
       data_ticket.assignee = document.getElementById("assignee").value
       data_ticket.archived = 0,
       data_ticket.creation_date = new Date();


       $.ajax({
       type: "POST",
       url: "http://127.0.0.1:8000/ticket/" ,
       contentType: 'application/json; charset=utf-8',
       headers : { "Authorization":  token},
       data: JSON.stringify(data_ticket),
       success: function ( result){
         
         getTickets();
         Swal.fire('Saved!', '', 'success')

       },
       error: function( error){
        let message = JSON.parse(error.responseText)

        Swal.fire(message.message, '', 'error')
         if(error.status == 401) {
               document.location.href = "./login.html"
           }
       }
   })

     } else if (r.isDenied) {
       Swal.fire('Changes are not saved', '', 'info')
     }
   }
   )   
}



function ChangeStatus(id, status){


 Swal.fire({
 title: 'Confirm to mark as '+ status +' ?',
 showCancelButton: true,
 confirmButtonText: 'Yes',
 }).then((result) => {
   if (result.isConfirmed) {

     $.ajax({
       type: "GET",
       url: "http://127.0.0.1:8000/ticket/" + id ,
       contentType: 'application/json; charset=utf-8',
       headers : { "Authorization":  token},
       success: function (result, s) {

         let data_ticket ={};
       data_ticket.name = result.name
       data_ticket.description = result.description
       data_ticket.priority = result.priority
       data_ticket.status = status
       data_ticket.deadline = result.deadline
       data_ticket.assignee = result.assignee
       data_ticket.archived = result.archived
       data_ticket.creation_date = result.creation_date

         $.ajax({
           type: "PUT",
           url: "http://127.0.0.1:8000/ticket/" + id ,
           contentType: 'application/json; charset=utf-8',
           headers : { "Authorization":  token},
           data: JSON.stringify(data_ticket),
           success: function (r) {
               getTickets();
               Swal.fire('Changed status!', '', 'success')
           },
     error: function(  error, sta){
      let message = JSON.parse(error.responseText)

      Swal.fire(message.message, '', 'error')
         if(error.sta == 401) {
             document.location.href = "./login.html"
         }
     }
 })
       },
       error: function (error){
        let message = JSON.parse(error.responseText)

        Swal.fire(message.message, '', 'error')
         if(error.status == 401) {
             document.location.href = "./login.html"
         }
       }

 })

} else if (result.isDenied) {
 Swal.fire('Changes are not saved', '', 'info')
}
})
 
}

function Archive(id){

 Swal.fire({
 title: 'Confirm to archive this ticket ?',
 showCancelButton: true,
 confirmButtonText: 'Yes',
 }).then((result) => {
   if (result.isConfirmed) {

     $.ajax({
       type: "GET",
       url: "http://127.0.0.1:8000/ticket/" + id ,
       contentType: 'application/json; charset=utf-8',
       headers : { "Authorization":  token},
       success: function (result, s) {

         let data_ticket ={};
       data_ticket.name = result.name
       data_ticket.description = result.description
       data_ticket.priority = result.priority
       data_ticket.status = result.status
       data_ticket.deadline = result.deadline
       data_ticket.assignee = result.assignee
       data_ticket.archived = 1
       data_ticket.creation_date = result.creation_date

         $.ajax({
           type: "PUT",
           url: "http://127.0.0.1:8000/ticket/" + id ,
           contentType: 'application/json; charset=utf-8',
           headers : { "Authorization":  token},
           data: JSON.stringify(data_ticket),
           success: function (r) {
               getTickets();
               Swal.fire('Archived!', '', 'success')
           },
     error: function(  error, sta){
      let message = JSON.parse(error.responseText)

      Swal.fire(message.message, '', 'error')
         if(error.sta == 401) {
             document.location.href = "./login.html"
         }
     }
 })
       },
       error: function (error){
        let message = JSON.parse(error.responseText)

        Swal.fire(message.message, '', 'error')
         if(error.status == 401) {
             document.location.href = "./login.html"
         }
       }

 })

} else if (result.isDenied) {
 Swal.fire('Changes are not saved', '', 'info')
}
})

}

function Delete(id){

 Swal.fire({
 title: 'Do you want to delete ticket?',
 showCancelButton: true,
 confirmButtonText: 'Yes',
}).then((result) => {
 /* Read more about isConfirmed, isDenied below */
 if (result.isConfirmed) {

   $.ajax({
       type: "DELETE",
       url: "http://127.0.0.1:8000/ticket/" + id ,
       contentType: 'application/json; charset=utf-8',
       headers : { "Authorization":  token},
       success: function (result, status) {
            getTickets();
            Swal.fire('Deleted!', '', 'success')
       },
       error: function(  error, status){
            let message = JSON.parse(error.responseText)

            Swal.fire(message.message, '', 'error')
           if(error.status == 401) {
               document.location.href = "./login.html"
           }
       }
   })

 } else if (result.isDenied) {
   Swal.fire('Changes are not saved', '', 'info')
 }
})
   

}


function Edit(id){

   $.ajax({
       type: "GET",
       url: "http://127.0.0.1:8000/ticket/" + id ,
       contentType: 'application/json; charset=utf-8',
       headers : { "Authorization":  token},
       success: function (result, status) {
            Swal.fire({
                 title: '<strong>Editar ticket</strong>',
                 html:
                   '<div class="form-group text-start mb-2"><label class="mb-1" >Ticket Name</label><input type="text" class="form-control" value="'+ result.name+'" id="name" aria-describedby="emailHelp" placeholder="Nombre"></div>' +
                   '<div class="form-group text-start mb-2"><label class="mb-1" >Descripction</label><input type="text" class="form-control" value="'+ result.description+'" id="description" aria-describedby="emailHelp" placeholder="Description"></div>' +
                   '<div class="form-group text-start mb-2"><label class="mb-1" >Priority</label><select  class="form-control" id="priority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>'+
                   '<div class="form-group text-start mb-2"><label class="mb-1" >Deadline</label><input type="datetime-local" class="form-control" value="'+ result.deadline+'" id="deadline" aria-describedby="emailHelp" placeholder="Deadline"></div>' +
                   '<div class="form-group text-start mb-2"><label class="mb-1" >Assignee</label><select class="form-control" id="assignee"></select></div>',
                 showCloseButton: true,
                 showCancelButton: true,
                 focusConfirm: false,
                 didOpen: function(ele){
                  $(ele).find('#priority').val(result.priority)
                  $.ajax({
                    type: "GET",
                    url: "http://127.0.0.1:8000/user/",
                    contentType: 'application/json; charset=utf-8',
                    headers : { "Authorization":  token},
                    success: function (res) {
                     let options = "";
                     res.forEach( (val) =>{
                       options = options + '<option value="'+ val.id +'">'+  val.username +'</option>'
                     })
                     $(ele).find('#assignee').append(options);
                     $(ele).find('#assignee').val(result.assignee)
                    },
                    error: function(error){
                      let message = JSON.parse(error.responseText)

                    Swal.fire(message.message, '', 'error')
                      if(error.status == 401) {
                        document.location.href = "./login.html"
                      }
                    }
                   })
                 
                 },
                 confirmButtonText:
                         'Aceptar',
                 confirmButtonAriaLabel: 'Thumbs up, great!',
                 cancelButtonText:
                         'Cancelar',
                 cancelButtonAriaLabel: 'Thumbs down'  
             }).then((r) => {
                 if (r.isConfirmed) {
                      let data_ticket ={};
                      data_ticket.id = result.id
                      data_ticket.name = document.getElementById("name").value
                      data_ticket.description = document.getElementById("description").value
                      data_ticket.priority = document.getElementById("priority").value
                      data_ticket.status = result.status;
                      data_ticket.deadline = document.getElementById("deadline").value
                       data_ticket.creation_date = result.creation_date;
                       data_ticket.archived = result.archived;
                      data_ticket.assignee = parseInt(document.getElementById("assignee").value)

                     $.ajax({
                       type: "PUT",
                       url: "http://127.0.0.1:8000/ticket/"+ result.id,
                       contentType: 'application/json; charset=utf-8',
                       data: JSON.stringify(data_ticket),
                       headers : { "Authorization":  token},
                       success: function (info) {
                           getTickets();
                           Swal.fire('Saved!', '', 'success')
                       },
                       error: function (error, status){
                        let message = JSON.parse(error.responseText)

                        Swal.fire(message.message, '', 'error')
                       if(error.status == 401) {
                        document.location.href = "./login.html"
                      }
                       }
                     })

                 } else if (r.isDenied) {
                      Swal.fire('Changes are not saved', '', 'info')
                 }
             })
       },
       error: function (error, status) {
                let message = JSON.parse(error.responseText)

                Swal.fire(message.message, '', 'error')
            if(error.status == 401) {
               document.location.href = "./login.html"
           }
       }
   });

   
}