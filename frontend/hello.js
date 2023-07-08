let token
class User {
    constructor() {
    }
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
                    // document.getElementById("tr").innerHTML = `${this.token}`
                    document.getElementById("status").innerHTML = `<h3>Completed</h3>`
                    console.log("token is set.")
                    loggedWindow();
                })
                .catch(err => {
                    console.log(err)
                })
            document.getElementById("status").innerHTML = `<h3>Failed</h3>`
        })
    }
    create() {
        console.log("creating...")
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
            result = await result.json();
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
        const registered_user_id = document.getElementById("userWindow-1-user-id").value
        let result = await fetch(`http://localhost:3000/api/contacts/${registered_user_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        result = await result.json()
        // console.log(result)
        document.getElementById("tablehead").innerHTML = `
            <tr>
                <th>Username </th>
                <th>Email </th>
                <th>Phone </th>
            </tr>`
            document.getElementById("userData").innerHTML = `
            <tr>
                <td>${result.name}</td>
                <td>${result.email}</td>
                <td>${result.phone}</td>
            </tr>`
                
    }
    update() {
        console.log("updating...")
    }
    delete() {
        console.log("deleting...")
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

function loggedWindow(token) {
    // const token = document.getElementById("token-field").values
    // const result = await fetch("http://localhost:3000/api/contacts",{})
    reset();
    document.getElementById("userWindow").innerHTML = `
        <button type="button" class="btn-login" onclick="innerButtonWindow()">Read</button>
        <button type="button" class="btn-login" onclick="add()">Add</button>
        <button type="button" class="btn-login" onclick="updateData()">Update</button>
        <button type="button" class="btn-login" onclick="deleteData()">Delete</button>
        <div id="userWindow-1"></div>`
}
function getTokenOuter() {
    document.getElementById("status").innerHTML = `<h3>Processing</h3>`
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
function updateData() {
    user.update()
}
function deleteData() {
    user.delete()
}