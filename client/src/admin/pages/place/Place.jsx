import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Place = () => {
    const [placeName, setPlaceName] = useState('');
    const [districtId, setDistrictId] = useState('');
    const [districts, setDistricts] = useState([]);
    const [places, setPlaces] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDist, setEditDist] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/district').then(r => setDistricts(r.data.data));
        loadPlaces();
    }, []);

    const loadPlaces = () =>
        axios.get('http://localhost:5000/place')
            .then(r => setPlaces(r.data.data))
            .catch(console.error);

    const handleSave = () => {
        if (editId) {
            axios.put(`http://localhost:5000/place/${editId}`, { name: editName, districtId: editDist })
                .then(res => { setPlaces(res.data.data); cancelEdit(); })
                .catch(console.error);
        } else {
            axios.post('http://localhost:5000/place', { name: placeName, districtId })
                .then(res => { setPlaces(res.data.data); setPlaceName(''); setDistrictId(''); })
                .catch(console.error);
        }
    };

    const startEdit = p => {
        setEditId(p.placeId);
        setEditName(p.placeName);
        setEditDist(p.districtId);
    };

    const cancelEdit = () => { setEditId(null); setEditName(''); setEditDist(''); };

    const handleDel = id =>
        axios.delete(`http://localhost:5000/place/${id}`)
            .then(res => setPlaces(res.data.data))
            .catch(console.error);

    return (
        <div style={{ padding: 20 }}>
            <h3>{editId ? 'Edit place' : 'Add new place'}</h3>
            <table border="1" cellPadding="8">
                <thead>
                    <tr><th>District</th><th>Place</th><th>Action</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select value={editId ? editDist : districtId}
                                onChange={e => editId ? setEditDist(e.target.value) : setDistrictId(e.target.value)}>
                                <option value="">-- select --</option>
                                {districts.map(d =>
                                    <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                                )}
                            </select>
                        </td>
                        <td>
                            <input placeholder="Enter place"
                                value={editId ? editName : placeName}
                                onChange={e => editId ? setEditName(e.target.value) : setPlaceName(e.target.value)} />
                        </td>
                        <td>
                            <button onClick={handleSave}>{editId ? 'Update' : 'Save'}</button>
                            {editId && <button onClick={cancelEdit} style={{ marginLeft: 4 }}>Cancel</button>}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3>Existing places</h3>
            <table border="1" cellPadding="8">
                <thead>
                    <tr><th>Place</th><th>District</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {places.map(p => (
                        <tr key={p.placeId}>
                            <td>{p.placeName}</td>
                            <td>{p.districtName}</td>
                            <td>
                                <button onClick={() => startEdit(p)}>Edit</button>
                                <button onClick={() => handleDel(p.placeId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Place;