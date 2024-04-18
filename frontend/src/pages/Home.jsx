import { useState, useEffect } from "react";
import api from "../api";
import Tire from "../components/Tire";
import "../styles/Home.css";

function Home() {
    const [tires, setTires] = useState([]);
    const [brand, setBrand] = useState("");
    const [pattern, setPattern] = useState("");

    useEffect(() => {
        getTires();
    }, []);

    const getTires = () => {
        api
            .get("/api/tires/")
            .then((res) => res.data)
            .then((data) => { setTires(data); console.log(data) })
            .catch((err) => alert(err));
    };

    const deleteTire = (id) => {
        api
            .delete(`/api/tires/delete/${id}`)
            .then((res) => {
                if (res.status === 204) alert("Tire deleted!");
                else alert("Failed to delete Tire!");
                getTires();
            }).catch((err) => alert(err))

    };

    const createTire = (e) => {
        e.preventDefault();
        api
            .post("/api/tires/", { brand, pattern })
            .then((res) => {
                if (res.status === 201) alert("Tire created!");
                else alert("Failed to create tire!");
                getTires();
            }).catch((err) => alert(err));
    }

    return <div>
        <div>
            <h2>Tires</h2>
            {tires.map((tire) => (
                <Tire tire={tire} onDelete={deleteTire} key={tire.id} />
            ))}
        </div>
        <h2>Create a Tire</h2>
        <form onSubmit={createTire}>
            <label htmlFor="brand">Brand:</label>
            <br />
            <input
                type="text"
                id="brand"
                name="brand"
                required
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
            />
            <br />
            <label htmlFor="pattern">Pattern:</label>
            <br />
            <input
                type="text"
                id="pattern"
                name="pattern"
                required
                onChange={(e) => setPattern(e.target.value)}
                value={pattern}
            />
            <br />
            <input type="submit" value="Submit"></input>
        </form>
    </div>;
}

export default Home;