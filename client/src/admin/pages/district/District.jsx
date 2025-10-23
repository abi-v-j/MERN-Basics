import axios from 'axios';
import React, { useEffect, useState } from 'react';

const District = () => {
  const [value, setValue] = useState('');
  const [districts, setDistricts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => loadDistricts(), []);

  const loadDistricts = () =>
    axios.get('http://localhost:5000/district')
      .then(res => {
        console.log(res.data);

        setDistricts(res.data.data)
      })
      .catch(console.error);

  const handleSave = () => {
    if (editId) {
      axios.put(`http://localhost:5000/district/${editId}`, { name: editName })
        .then(res => { setDistricts(res.data.data); cancelEdit(); })
        .catch(console.error);
    } else {
      axios.post('http://localhost:5000/district', { name: value })
        .then(res => { setDistricts(res.data.data); setValue(''); })
        .catch(console.error);
    }
  };

  const startEdit = d => { setEditId(d.districtId); setEditName(d.districtName); };
  const cancelEdit = () => { setEditId(null); setEditName(''); };

  const handleDelete = id =>
    axios.delete(`http://localhost:5000/district/${id}`)
      .then(res => setDistricts(res.data.data))
      .catch(console.error);

  return (
    <div>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>District</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                placeholder={editId ? 'Edit district' : 'Enter district'}
                value={editId ? editName : value}
                onChange={e => editId ? setEditName(e.target.value) : setValue(e.target.value)}
              />
            </td>
            <td>
              <button onClick={handleSave}>{editId ? 'Update' : 'Save'}</button>
              {editId && <button onClick={cancelEdit} style={{ marginLeft: 4 }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
        {districts.map(d => (
          <tbody key={d.districtId}>
            <tr>
              <td>{d.districtName}</td>
              <td>
                <button onClick={() => startEdit(d)}>Edit</button>
                <button onClick={() => handleDelete(d.districtId)}>Delete</button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default District;