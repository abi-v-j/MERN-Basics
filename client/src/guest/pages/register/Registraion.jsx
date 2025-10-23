import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Registration = () => {
    const [fullName, setFullName]   = useState('');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [photo, setPhoto]         = useState(null);
    const [districts, setDistricts] = useState([]);
    const [places, setPlaces]       = useState([]);
    const [districtId, setDistrictId] = useState('');
    const [placeId, setPlaceId]     = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/district').then(r => setDistricts(r.data.data));
    }, []);

    useEffect(() => {
        if (!districtId) { setPlaces([]); setPlaceId(''); return; }
        axios.get(`http://localhost:5000/place`).then(r => {
            setPlaces(r.data.data.filter(p => p.districtId === districtId));
        });
    }, [districtId]);

    const handleSubmit = () => {
        const fd = new FormData();
        fd.append('fullName', fullName);
        fd.append('email', email);
        fd.append('password', password);
        if (photo) fd.append('photo', photo);
        fd.append('placeId', placeId);
        axios.post('http://localhost:5000/user', fd)
             .then(() => alert('User registered'))
             .catch(console.error);
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Registration</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Full Name</td>
                        <td><input value={fullName} onChange={e => setFullName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Photo</td>
                        <td><input type="file" onChange={e => setPhoto(e.target.files[0])} /></td>
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
                            <select value={placeId} onChange={e => setPlaceId(e.target.value)} disabled={!districtId}>
                                <option value="">-- select --</option>
                                {places.map(p =>
                                    <option key={p.placeId} value={p.placeId}>{p.placeName}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="center">
                            <button onClick={handleSubmit}>Register</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Registration;