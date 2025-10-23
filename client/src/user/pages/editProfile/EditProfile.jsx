import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const nav = useNavigate();
    const uid = sessionStorage.getItem('uid');
    if (!uid) return null;

    const [fullName, setFullName]   = useState('');
    const [email, setEmail]         = useState('');
    const [districts, setDistricts] = useState([]);
    const [places, setPlaces]       = useState([]);
    const [districtId, setDistrictId] = useState('');
    const [placeId, setPlaceId]     = useState('');

    /* 1. districts */
    useEffect(() => {
        axios.get('http://localhost:5000/district').then(r => setDistricts(r.data.data));
    }, []);

    /* 2. user + current selections */
    useEffect(() => {
        axios.get(`http://localhost:5000/user/${uid}`).then(res => {
            const u = res.data.data;
            setFullName(u.fullName);
            setEmail(u.email);
            setDistrictId(u.districtId);
            setPlaceId(u.placeId);
        });
    }, [uid]);

    /* 3. places when district changes */
    useEffect(() => {
        if (!districtId) return;
        axios.get('http://localhost:5000/place').then(r => {
            setPlaces(r.data.data.filter(p => p.districtId === districtId));
        });
    }, [districtId]);

    /* 4. save */
    const handleSave = () => {
        axios.put(`http://localhost:5000/user/${uid}`, { fullName, email, placeId })
             .then(() => alert('Profile updated'))
             .catch(() => alert('Update failed'));
    };

    /* 5. render */
    return (
        <div style={{ padding: 20 }}>
            <h3>Edit Profile</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td><input value={fullName} onChange={e => setFullName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>District</td>
                        <td>
                            <select value={districtId} onChange={e => setDistrictId(e.target.value)}>
                                <option value="">-- select --</option>
                                {districts.map(d =>
                                    <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Place</td>
                        <td>
                            <select value={placeId} onChange={e => setPlaceId(e.target.value)}>
                                <option value="">-- select --</option>
                                {places.map(p =>
                                    <option key={p.placeId} value={p.placeId}>{p.placeName}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="center"><button onClick={handleSave}>Save</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditProfile;