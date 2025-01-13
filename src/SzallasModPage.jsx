import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import NET from "vanta/dist/vanta.net.min";
import './SzallasList.css';

export const SzallasModPage = () => {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const vantaRef = useRef(null);
    const [data, setData] = useState({
        "name": '',
        "hostname": '',
        "location": '',
        "price": 0,
        "minimum_nights": ''
    });

    // Adatok lekérése
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('Nem található JWT token!');
                }
                const response = await axios.get(`https://szallasjwt.sulla.hu/data/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(response.data);
            } catch (error) {
                setError('Az adatok lekérése sikertelen. Lehet, hogy nem vagy bejelentkezve?');
                console.error("Hiba az adatok lekérése során: ", error);
            }
        };
        fetchData();
    }, [id]);

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

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                throw new Error('Nem található JWT token!');
            }

            await axios.put(`https://szallasjwt.sulla.hu/data/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate("/SzallasList");
        } catch (error) {
            console.error("Hiba az adatok mentése során:", error);
            setError('Az adatok mentése sikertelen!');
        }
    };

    return (
        <div ref={vantaRef} style={{ minHeight: "100vh" }}>
            <div className="p-5 content bg-whitesmoke text-center">
                <h2>Szállás módosítása</h2>
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
                    <button type="submit" className="btn btn-success">Mentés</button>
                </form>
            </div>
        </div>
    );
};
