const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )
  let token =   getCookieValue("token")
  
  
   if(token){
  
     $.ajax({
          type: "POST",
          url: "http://127.0.0.1:8000/user/auth",
          contentType: 'application/json; charset=utf-8',
          headers : { "Authorization":  token},
          data: [],
          success: function (result, status) {
              document.location.href = "./index.html"
          },
          error: function (error, status) {
         
      }
      })
  } 
  
       function send_data(type, name, email, pass) {
  
          if(type=== 'login'){
              $.ajax({
                  type: "POST",
                  url: "http://127.0.0.1:8000/user/login",
                  contentType: 'application/json; charset=utf-8',
                  data: JSON.stringify({ email: email.value, password: pass.value}),
                  success: function (result, status) {
                      var token = result.token
                      if(token){
                          document.cookie = " token=" + token ;
                          document.location.href = "./index.html";
                      }  else {
                          console.log(result);
                      }
                  },
                  error: function (error, status) {
                    let message = JSON.parse(error.responseText)

                    Swal.fire(message.message, '', 'error')
                   }
              })
          } else if( type === 'signup'){
              console.log(email);
              $.ajax({
                  type: "POST",
                  url: "http://127.0.0.1:8000/user/",
                  contentType: 'application/json; charset=utf-8',
                  data: JSON.stringify({ username: name.value, email: email.value, password: pass.value}),
                  success: function (result, status) {
  
                      console.log(result);
                      Swal.fire({
                          icon: 'success',
                          title: 'Tu usuario ha sido egistrado',
                          showConfirmButton: false,
                          timer: 3000
                      })
                      name.value = "";
                      email.value = "";
                      pass.value = "";
                      document.getElementById('reg-log').click();
                  },
                  error: function (error, status) {
                    let message = JSON.parse(error.responseText)

                    Swal.fire(message.message, '', 'error')
                }
              });
          } 
      }