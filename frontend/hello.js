let token
class User {
    getToken() {
        document.getElementById("status").innerHTML = `<h3>Processing</h3>`
        const form = document.getElementById("form")
        form.addEventListener("submit", function (e) {
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
            fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    //   document.getElementById("res-div").innerHTML = `
                    //   Here is the genereted JWS token:<br>
                    //   <b><textarea name="result" id="result" cols="30" rows="10">${data.accessToken}</textarea></b>`
                    if (!data.accessToken) {
                        document.getElementById("status").innerHTML = `<h3>Unauthorized User</h3>`
                        console.warn("Unauthorized User")
                        return
                    }
                    token = data.accessToken
                    document.getElementById("status").innerHTML = `<h3>Completed</h3>`
                    console.log("token is set.")
                    loggedWindow();
                })
                .catch(err => {
                    console.log(err)
                    document.getElementById("status").innerHTML = `<h3>Failed</h3>`
                })
        })
    }
    create() {
        document.getElementById("status").innerHTML = `<h3>Processing</h3>`
        const form = document.getElementById("createForm")
        form.addEventListener("submit", function (e) {
            e.preventDefault()

            const formdata = new FormData(form);
            const data = Object.fromEntries(formdata);
            // console.log(data);
            fetch("http://localhost:3000/api/contacts", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.name) {
                        document.getElementById("status").innerHTML = `<h3>${data.message}</h3>`
                        return
                    }
                    document.getElementById("status").innerHTML = `<h3>Contact Created Successfully with name: ${data.name}</h3>`
                })
                .catch(err => {
                    console.log(err)
                    document.getElementById("status").innerHTML = `<h3>Failed</h3>`
                })
        })
        // console.log("creating...")
    }
    async read() {
        try {
            document.getElementById("status").innerHTML = `<h3>Processing</h3>`
            let result = await fetch("http://localhost:3000/api/contacts", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            result = await result.json()
            if(result.toString().length==0){
                document.getElementById("status").innerHTML = `<h3>No data is added yet</h3>`
                return
            }
            document.getElementById("res-div").innerHTML = `<h4>Data:</h4>`
            document.getElementById("tablehead").innerHTML = `
            <tr>
                <th>Id </th>
                <th>Username </th>
                <th>Email </th>
                <th>Phone</th>
            </tr>`
            document.getElementById("userData").innerHTML = result
                .map((user) => `
            <tr>
                <td>${user._id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
            </tr>`
                ).join("");
            // console.log(result)
            document.getElementById("status").innerHTML = `<h3>Completed</h3>`
        } catch (error) {
            console.log(error)
            document.getElementById("status").innerHTML = `<h3>Failed</h3>`
        }

        // console.log(token)
    }
    async readId() {
        document.getElementById("status").innerHTML = `<h3>Processing...</h3>`
        const registered_user_id = document.getElementById("userWindow-1-user-id").value
        let result = await fetch(`http://localhost:3000/api/contacts/${registered_user_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        result = await result.json()
        if (!result.name) {
            document.getElementById("status").innerHTML = `<h3>${result.message}</h3>`
            return
        }
        // console.log(result)
        document.getElementById("tablehead").innerHTML = `
            <tr>
                <th>ID </th>
                <th>Username </th>
                <th>Email </th>
                <th>Phone </th>
                <th>User ID </th>
            </tr>`
        document.getElementById("userData").innerHTML = `
            <tr>
                <td>${result._id}</td>
                <td>${result.name}</td>
                <td>${result.email}</td>
                <td>${result.phone}</td>
                <td>${result.user_id}</td>
            </tr>`
        document.getElementById("status").innerHTML = `<h3>Completed</h3>`
    }
    async update(id) {
        try {
            document.getElementById("status").innerHTML = `<h3>Processing</h3>`

            const name = document.getElementById("userWindow-1-name").value
            const email = document.getElementById("userWindow-1-email").value
            const phone = document.getElementById("userWindow-1-phone").value
            if (!name && !email && !phone) {
                document.getElementById("status").innerHTML = `<h3>Please provide some data to update !!!</h3>`
                return
            }
            const data = {}
            if (name) {
                data.name = name
            }
            if (email) {
                data.email = email
            }
            if (phone) {
                data.phone = phone
            }
            let result = await fetch(`http://localhost:3000/api/contacts/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            result = await result.json()
            if(result.message){
                document.getElementById("status").innerHTML = `<h3>${result.message}</h3>`
                return
            }
            document.getElementById("res-div").innerHTML = `<h4>Updated data:</h4>`
            document.getElementById("tablehead").innerHTML = `
            
            <tr>
                <th>ID </th>
                <th>Username </th>
                <th>Email </th>
                <th>Phone </th>
                <th>User ID </th>
            </tr>`
            document.getElementById("userData").innerHTML = `
            <tr>
                <td>${result._id}</td>
                <td>${result.name}</td>
                <td>${result.email}</td>
                <td>${result.phone}</td>
                <td>${result.user_id}</td>
            </tr>`

            document.getElementById("status").innerHTML = `<h3>Completed</h3>`
        } catch (error) {
            console.log(error)
            document.getElementById("status").innerHTML = `<h3>Failed</h3>`
        }
    }
    async delete() {
        document.getElementById("status").innerHTML = `<h3>Processing...</h3>`
        const registered_user_id = document.getElementById("userWindow-1-user-id").value
        let result = await fetch(`http://localhost:3000/api/contacts/${registered_user_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        result = await result.json()
        if (result.message) {
            document.getElementById("status").innerHTML = `<h3>${result.message}</h3>`
            return
        }
        // console.log(result)
        document.getElementById("status").innerHTML = `<h3>Contact deleted Successfully with name: ${result.name}</h3>`
    }
}

function reset() {
    document.getElementById("userWindow").innerHTML = "";
    document.getElementById("res-div").innerHTML = "";
    document.getElementById("tablehead").innerHTML = "";
    document.getElementById("userData").innerHTML = "";
    
}

async function allusers() {
    try {
        document.getElementById("status").innerHTML = `<h3>Processing</h3>`
        let result = await fetch("http://localhost:3000/api/users/all")
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
        document.getElementById("status").innerHTML = `<h3>Completed</h3>`
    } catch (error) {
        document.getElementById("status").innerHTML = `<h3>Failed</h3>`
        console.log(error)
    }

}

function loginWindow() {
    document.getElementById("userWindow").innerHTML = `
    <div>
        <form id="form" method="post">
            <input type="text" name="email" id="email" placeholder="Enter the Email"><br>
            <input type="text" name="password" id="password" placeholder="Enter the password"><br>
            <button type="submit" onclick="login()">Get Token</button>
        </form>
    </div>
`}
function loggedWindow() {
    // const token = document.getElementById("token-field").values
    // const result = await fetch("http://localhost:3000/api/contacts",{})
    reset();
    document.getElementById("userWindow").innerHTML = `
        <button type="button" class="btn-login" onclick="innerButtonWindow()">Read</button>
        <button type="button" class="btn-login" onclick="createWindow()">Add</button>
        <button type="button" class="btn-login" onclick="updateWindow1()">Update</button>
        <button type="button" class="btn-login" onclick="deleteWindow()">Delete</button>
        <div id="userWindow-1"></div>`
}
function getTokenOuter() {
    document.getElementById("status").innerHTML = `<h3>Processing...</h3>`
    const form = document.getElementById("form")
    form.addEventListener("submit", function (e) {
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        fetch("http://localhost:3000/api/users/login", {
            method: 'POST',
            body: JSON.stringify({ email: email, password: password }),
            headers: {
                "Content-Type": 'application/json'
            }
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            document.getElementById("res-div").innerHTML = `
                Here is the genereted JWS token:<br>
                <b><textarea name="result" id="result" cols="30" rows="10">${data.accessToken}</textarea></b>`
        })
    })
    document.getElementById("status").innerHTML = `<h3>Completed</h3>`
}
function innerButtonWindow() {
    document.getElementById("userWindow-1").innerHTML = `
            <button type="button" class="btn-login" onclick="read()">Read All</button>
            <button type="button" class="btn-login" onclick="readByIdWindow()">Read by ID</button>
            `
}
function readByIdWindow() {
    document.getElementById("userWindow-1").innerHTML = `
        <div>
            <form id="readIdForm" method="post">
                <input type="text" name="user_id" id="userWindow-1-user-id" placeholder="Enter the ID"><br>
                <button type="button" onclick="readById()">Submit</button>
            </form>
        </div>
        `
}
function createWindow() {
    document.getElementById("userWindow-1").innerHTML = `
        <div>
            <form id="createForm" method="post">
                <input type="text" name="name" id="userWindow-1-name" placeholder="Enter name"><br>
                <input type="text" name="email" id="userWindow-1-email" placeholder="Enter email ID"><br>
                <input type="text" name="phone" id="userWindow-1-phone" placeholder="Enter phone number"><br>
                <button type="submit" onclick="add()">Submit</button>
            </form>
        </div>
        `
}
function updateWindow1() {
    document.getElementById("userWindow-1").innerHTML = `
        <div>
            <form id="updateForm1" method="post">
                <input type="text" name="user_id" id="userWindow-1-user-id" placeholder="Enter the ID"><br>
                <button type="button" onclick="updateWindow2()">Submit</button>
            </form>
        </div>
        `
}
function updateWindow2() {
    const id = document.getElementById("userWindow-1-user-id").value
    document.getElementById("userWindow-1").innerHTML = `
        <div>
            <form id="updateForm2" method="post">
                <input type="text" name="name" id="userWindow-1-name" placeholder="Enter name"><br>
                <input type="text" name="email" id="userWindow-1-email" placeholder="Enter email ID"><br>
                <input type="text" name="phone" id="userWindow-1-phone" placeholder="Enter phone number"><br>
                <button type="button" onclick="updateData(\'${id}\')">Update</button>
            </form>
        </div>
        `
}
function deleteWindow() {
    document.getElementById("userWindow-1").innerHTML = `
        <div>
            <form id="deleteForm" method="post">
                <input type="text" name="user_id" id="userWindow-1-user-id" placeholder="Enter the ID"><br>
                <button type="button" onclick="deleteData()">Delete</button>
            </form>
        </div>
        `
}
function registerWindow() {
    document.getElementById("userWindow").innerHTML = `
    <div>
        <form id="registerForm" method="post">
            <input type="text" name="username" id="username" placeholder="Enter the username"><br>
            <input type="text" name="email" id="email" placeholder="Enter the Email"><br>
            <input type="text" name="password" id="password" placeholder="Enter the password"><br>
            <button type="submit" onclick="register()">Register</button>
        </form>
    </div>
    `
}
function register() {
    document.getElementById("status").innerHTML = `<h3>Processing...</h3>`
    const form = document.getElementById("registerForm")
    form.addEventListener("submit", function (e) {
        e.preventDefault()

        const formdata = new FormData(form);
        const data = Object.fromEntries(formdata);
        // console.log(data);
        fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res=>res.json())
        .then(data=>{
            if(data.message){
                document.getElementById("status").innerHTML = `<h3>${data.message}</h3>`
                console.log(data)
                return
            }
            document.getElementById("status").innerHTML = `<h3>Completed</h3>`
            
        })
        .catch(err=>{
            console.log(err)
            document.getElementById("status").innerHTML = `<h3>Failed</h3>`

        })
    })
}

const user = new User()

function login() {
    user.getToken()
}

function add() {
    user.create()
}
function read() {
    user.read()
}

function readById() {
    user.readId()
}
function updateData(id) {
    user.update(id)
}
function deleteData() {
    user.delete()
}