///////////////////////////////////////////
///////////////////////////////////////////
// this block of code is to define a new //
// tagname to include html snippets ///////
///////////////////////////////////////////
///////////////////////////////////////////

document.addEventListener("DOMContentLoaded",function(){
    let e=document.getElementsByTagName("include");
    for(var t=0;t<e.length;t++){
        let a=e[t];n(e[t].attributes.src.value,function(e){
            a.insertAdjacentHTML("afterend",e),a.remove()
        }
    )}
    function n(e,t){
        fetch(e).then(e=>e.text()).then(e=>t(e))
    }
});



///////////////////////////////////////////
///////////////////////////////////////////
///////// Rest api call////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

// base api url
const baseEndPoint = 'http://127.0.0.1:8000/api'
// base site url
const siteURL = window.location.protocol + '//' + window.location.host

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//function to get data from the base api url and //////
// insert base on the category and the page location //
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
function geteData(){
    $.ajax({
        type: 'GET',
        headers: {
            "Content-Type": 'application/json'
        },
        url: `${baseEndPoint}/property`,
        success: function(respose){
            
            //product_image.empty()
            for (var i =0; i<respose.length; i++){                
                data = respose[i]
                var product_image = $('#objAppend')
                product_image.append(

                `<div class="col transitecol">
                    <div class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-4 shadow-lg" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.image}); background-size:cover;">
                        <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                            
                            <h2 class="pt-3 mb-4 mt-0 display-6 lh-1 fw-normal">${data.name}</h2>
                            <p>${data.description}</p>
                            <ul class="d-flex list-unstyled mt-auto d-flex justify-content-between">

                                <li class="d-flex align-items-center me-3">                                
                                    <small><i class="fa fa-bed"></i> ${data.bedroom} bedroom</small>
                                </li>
                                <li class="d-flex align-items-center me-3">                                
                                    <small><i class="fa fa-bed"></i> ${data.bathroom} bathroom</small>
                                </li>
                                <li class="d-flex align-items-center me-3">                                
                                    <small><i class="fa fa-bed"></i> ${data.toilet} toilet</small>
                                </li>
                            </ul>
                            <div class=" mt-2 fw-bold h6 text-end"># ${data.price}</div>
                        </div>
                    </div>
                </div>`
                    )
            }
        },
        error: function(error){
        }
    })
    
}

function refreshData(){
    $('#refreshData').click(() =>{
        window.location.reload()
    })
}
///////////////////////////////////////////
///////////////////////////////////////////
// function to validate form ////////
// before sending to server /////////////////
///////////////////////////////////////////
///////////////////////////////////////////
// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = $('.needs-validation')
// Loop over them and prevent submission
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        let errormsg =document.getElementById('errormsg')
        errormsg.innerHTML = ""
        event.preventDefault()
        if (!form.checkValidity()) {
            event.stopPropagation()
        }else{
            let newFormData = new FormData(form)
            let formObj = Object.fromEntries(newFormData)
            $.ajax({
                type: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                url: `${baseEndPoint}/auth/login/`,
                data:JSON.stringify(formObj),
                success:function(respose){
                    access_token = respose.access_token
                    refresh_token = respose.refresh_token
                    
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('refresh_token', refresh_token)
                    // empty the from after a completed process

                    $('#modalLogin').modal('hide', function() {                        
                        clear()
                    })

                    if(window.location.href == `${siteURL}/signup.html`){
                        window.location.replace(`/`)
                    }
                    is_loggedIn()


                    //window.location.reload()
                },
                error: function(error){
                    console.log(error)
                    if (error.responseJSON){
                        non_field_errors = error.responseJSON['non_field_errors']
                        setTimeout(() =>{
                            errormsg.innerHTML = `*${non_field_errors}`
                        }, 3000)
                        
                    }else{
                        alert("server error! try again later")
                    }
                    
                }
            })

        }    

        form.classList.add('was-validated')
    }, false)
})


function is_loggedIn(){
    logged_in = $('#is_loggedIn')
    logged_in.empty()
    if (localStorage.getItem('access_token')){
        logged_in.append(
            `
            <li class="nav-item" id="logout">
                <button class="nav-link btn btn-outline" onclick="logoutModal()">logout</button>
            </li>
            `
        )
    } else{
        logged_in.append(
            `
            <li class="nav-item " id="login">
            <a class="nav-link modalClick" data-bs-toggle="modal" data-bs-target="#modalLogin">Login</a>
            </li>
            <li class="nav-item" id="signup">
            <a class="nav-link" href="signup.html">Register</a>
            </li>
            `
        )
    }
}

///////////////////////////////////////////
///////////////////////////////////////////
// logout user from device ////////////////
///////////////////////////////////////////
///////////////////////////////////////////
function logoutModal(){
    $('#modalLogout').modal('show')
}

function logout(value){
    if (value){
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload()
    }else{
        $('#modalLogout').modal('hide')
    }
}