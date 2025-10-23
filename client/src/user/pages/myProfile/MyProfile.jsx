import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) return;
        axios.get(`http://localhost:5000/user/${uid}`)
             .then(res => setProfile(res.data.data))
             .catch(console.error);
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h3>My Profile</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Photo</td>
                        <td>
                            {profile.photo && (
                                <img src={`http://localhost:5000${profile.photo}`} alt="user" width="120" />
                            )}
                        </td>
                    </tr>
                    <tr><td>Name</td><td>{profile.fullName}</td></tr>
                    <tr><td>Email</td><td>{profile.email}</td></tr>
                    <tr><td>District</td><td>{profile.districtName}</td></tr>
                    <tr><td>Place</td><td>{profile.placeName}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default MyProfile;