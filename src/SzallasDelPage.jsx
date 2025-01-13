import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import NET from "vanta/dist/vanta.net.min";
import './SzallasList.css';

export const SzallasDelPage = () => {
    const { dataId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isPending, setPending] = useState(false);
    const vantaRef = useRef(null);

    useEffect(() => {
        setPending(true);
        (async () => {
            try {
                const res = await axios.get(`https://szallasjwt.sulla.hu/data/${dataId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                setData(res.data);
            } catch (error) {
                console.error("Hiba az adat lekérésében:", error);
            } finally {
                setPending(false);
            }
        })();
    }, [dataId]);

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

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            await axios.delete(`https://szallasjwt.sulla.hu/data/${dataId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            navigate("/");
        } catch (error) {
            console.error("Hiba a törlés során:", error);
        }
    };

    return (
        <div id="vanta-container" ref={vantaRef} style={{ minHeight: "100vh" }}>
            <div className="p-5 m-auto text-center content bg-lavender">
                {isPending || !data ? (
                    <div className="spinner-border"></div>
                ) : (
                    <div className="card p-3">
                        <div className="card-body">
                            <h5 className="card-title">Törlendő szállás: {data.name}</h5>
                            <div className="lead">Helyszín: {data.location}</div>
                            <div className="lead">Ár: {data.price} Ft/éj</div>
                            <img
                                alt={data.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: "500px" }}
                                src={data.image_url || "https://via.placeholder.com/400x800"}
                            />
                        </div>
                        <form onSubmit={handleDelete}>
                            <div>
                                <NavLink to="/">
                                    <button type="button" className="btn btn-secondary">
                                        <i className="bi bi-backspace"></i>&nbsp;Mégsem
                                    </button>
                                </NavLink>
                                &nbsp;&nbsp;
                                <button type="submit" className="btn btn-danger">
                                    <i className="bi bi-trash3"></i>&nbsp;Törlés
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
