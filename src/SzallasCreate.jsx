import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import NET from "vanta/dist/vanta.net.min";
import './SzallasList.css';

export const SzallasCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const vantaRef = React.useRef(null);
    const [data, setData] = useState({
        "name": '',
        "hostname": '',
        "location": '',
        "price": 0,
        "minimum_nights": ''
    });

    useEffect(() => {
        const vantaEffect = NET({
            el: vantaRef.current,
            THREE,
            color: 0xff0000,
            backgroundColor: 0xffffff,
            points: 12.0,
            maxDistance: 20.0,
            spacing: 18.0,
          });

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSubmit = event => {
        event.preventDefault();
        const token = localStorage.getItem('jwt');
        if (!token) {
            setError('Nem található JWT token!');
            return;
        }
        axios.post(`https://szallasjwt.sulla.hu/data`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(() => {
            navigate("/SzallasList");
        })
        .catch(error => {
            console.error("Hiba a létrehozás során:", error);
            setError('Hiba történt a kérés feldolgozása közben.');
        });
    };
    
    return (
        <div id="vanta-container" ref={vantaRef} style={{ minHeight: "100vh" }}>
            <div className="p-5 content bg-whitesmoke text-center">
                <h2>Új szállás létrehozása</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group row pb-3">
                        <label className="col-sm-3 col-form-label">Szállás neve:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={data.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group row pb-3">
                        <label className="col-sm-3 col-form-label">Host neve:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="hostname"
                                className="form-control"
                                value={data.hostname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group row pb-3">
                        <label className="col-sm-3 col-form-label">Helyszín:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                value={data.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group row pb-3">
                        <label className="col-sm-3 col-form-label">Ár (Ft):</label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                name="price"
                                className="form-control"
                                value={data.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group row pb-3">
                        <label className="col-sm-3 col-form-label">Minimum éjszakák:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="minimum_nights"
                                className="form-control"
                                value={data.minimum_nights}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">Létrehozás</button>
                </form>
            </div>
        </div>
    );
};