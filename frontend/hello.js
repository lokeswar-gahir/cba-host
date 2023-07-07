class User{
    constructor(token){
        this.token=token
    }
    create(){
        console.log("creating...")
    }
    read(){
        console.log("reading...")
    }
    update(){
        console.log("updating...")
    }
    delete(){
        console.log("deleting...")
    }
}



function reset() {
    document.getElementById("login-window").innerHTML = "";
    document.getElementById("res-div").innerHTML = "";
    document.getElementById("tablehead").innerHTML = "";
    document.getElementById("userData").innerHTML = "";
    document.getElementById("sendingtokenwindow").innerHTML = "";
}

function getToken() {
    const form = document.getElementById("form")
    form.addEventListener("submit",function (e) {
        e.preventDefault()

        // const email = document.getElementById("email").value
        // const password = document.getElementById("password").value

        // fetch("http://localhost:3000/api/users/login", {
        //     method: 'POST',
        //     body: JSON.stringify({ email: email, password: password }),
        //     headers: {
        //         "Content-Type": 'application/json'
        //     }
        // }).then(function (response) {
        //     return response.json()
        // }).then(function (data) {
        //     document.getElementById("res-div").innerHTML = `
        //     Here is the genereted JWS token:<br>
        //     <b><textarea name="result" id="result" cols="30" rows="10">${data.accessToken}</textarea></b>`
        // })

        const formdata = new FormData(form);
        const data = Object.fromEntries(formdata);
        // console.log(data);
        fetch("http://localhost:3000/api/users/login",{
            method:"POST",
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json())
          .then(data=> {
          document.getElementById("res-div").innerHTML = `
          Here is the genereted JWS token:<br>
          <b><textarea name="result" id="result" cols="30" rows="10">${data.accessToken}</textarea></b>`
          }
          )
          .catch(err=>console.log(err))

    })
}

async function allusers() {
    let result = await fetch("http://localhost:3000/api/users/all");
    result = await result.json();
    // console.log(result);
    document.getElementById("tablehead").innerHTML = `
    <tr>
        <td>Id </td>
        <th>Username </th>
        <th>Email </th>
        <th>Password</th>
    </tr>`
    document.getElementById("userData").innerHTML = result
        .map((user) =>
            `<tr>
        <td>${user._id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
    </tr>`
        ).join("");
}

function tokenWindow() {
    document.getElementById("login-window").innerHTML = `
    <div>
        <form id="form" method="post">
        <!-- <form action="/api/users/login" method="post"> -->
            <input type="text" name="email" id="email" placeholder="Enter the Email"><br>
            <input type="text" name="password" id="password" placeholder="Enter the password"><br>
            <button type="submit" onclick="getToken()">Get Token</button>
        </form>
`}

async function sendtoken(){
    const token = document.getElementById("token-field").values
    // const result = await fetch("http://localhost:3000/api/contacts",{})
    reset();
    document.getElementById("sendingtokenwindow").innerHTML = `
        <button type="button" class="btn-login" onclick="read()">Read</button>
        <button type="button" class="btn-login" onclick="()">Add</button>
        <button type="button" class="btn-login" onclick="()">Update</button>
        <button type="button" class="btn-login" onclick="()">Delete</button>`
}

async function read(){
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicGVyc29uMiIsImVtYWlsIjoicGVyc29uMkBnbWFpbC5jb20iLCJpZCI6IjY0YTRlNzg1MjAwZDRjMDU3YmJmZjFmZSJ9LCJpYXQiOjE2ODg3NDA0NTAsImV4cCI6MTY4ODc0MTM1MH0.5TTrORkDty4C2aXO4m1V1kyY_dFAlg3U0icSfPz_S70"
    let result = await fetch("http://localhost:3000/api/contacts",{
            method:"GET",
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
    result = await result.json();
    document.getElementById("tablehead").innerHTML = `
    <tr>
       <th>Username </th>
        <th>Email </th>
        <th>Password</th>
    </tr>`
    document.getElementById("userData").innerHTML = result
        .map((user) =>
            `<tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
    </tr>`
        ).join("");
    
}
