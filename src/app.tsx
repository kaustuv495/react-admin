import React, { useEffect, useState } from "react";
import User from "./src/user";
import Card from "./src/card";
import "./src/styles.css";

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxB_IU0JohNL9-_jYeoU2kj3RBawqkaFFgTveRPJlt1et2r6seRPZDOLhervjZcg1onw/exec";

function App() {
    const [users, setUsers] = useState<any[]>([]);

    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    async function loadUsers() {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL);
            const data = await response.json();

            const formattedUsers = data.map((item: any, index: number) => {

                let userAge = "";
                let userGender = "";

                if (item.message) {

                    const message = String(item.message);

                    if (message.includes("Age:") && message.includes("Gender:")) {

                        const parts = message.split(", Gender: ");

                        userAge = parts[0].replace("Age: ", "");
                        userGender = parts[1];

                    } else {

                        const match =
                            message.match(/^(\d+)(male|female)$/i);

                        if (match) {
                            userAge = match[1];
                            userGender = match[2];
                        }
                    }
                }

                return {
                    id: index,
                    username: item.name,
                    age: userAge,
                    gender: userGender
                };
            });

            setUsers(formattedUsers);

        } catch (error) {
            console.error("Error loading users:", error);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function addUser(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (username === "" || age === "" || gender === "") {
            alert("Please fill all fields");
            return;
        }

        const newUser = {
            name: username,
            email: "",
            message: `Age: ${age}, Gender: ${gender}`
        };

        try {

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(newUser)
            });

            setUsername("");
            setAge("");
            setGender("");

            alert("User registered successfully!");

            setTimeout(() => {
                loadUsers();
            }, 1000);

        } catch (error) {

            console.error(error);
            alert("Could not connect to Google Sheets");

        }
    }

    return (
        <div className="app">

            <h1>Admin User Management</h1>

            <div className="register-box">

                <h2>Register User</h2>

                <form onSubmit={addUser}>

                    <label>Username</label>

                    <input
                        type="text"
                        value={username}
                        onChange={e =>
                            setUsername(e.target.value)
                        }
                    />

                    <label>Age</label>

                    <input
                        type="number"
                        value={age}
                        onChange={e =>
                            setAge(e.target.value)
                        }
                    />

                    <label>Gender</label>

                    <div className="gender">

                        <label>
                            <input
                                type="radio"
                                value="male"
                                checked={gender === "male"}
                                onChange={e =>
                                    setGender(e.target.value)
                                }
                            />
                            Male
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="female"
                                checked={gender === "female"}
                                onChange={e =>
                                    setGender(e.target.value)
                                }
                            />
                            Female
                        </label>

                    </div>

                    <button type="submit">
                        Register User
                    </button>

                </form>

            </div>

            <div className="user-directory">

                <h2>
                    Number Of Users: {users.length}
                </h2>

                {users.map(user => (
                    <User
                        key={user.id}
                        username={user.username}
                        age={user.age}
                        gender={user.gender}
                    />
                ))}

            </div>

            <div className="mini-project">

                <h2>INTERESTS</h2>

                <Card title="Web Development" />

                <Card title="DSA"/>

                <Card title="AI" />

                <Card title="ML" />

                <Card title="SOFTWARE DEV" />

                



            </div>

        </div>
    );
}

export default App;
