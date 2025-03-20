import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ title: '', url: '', description: '' });

  useEffect(() => {
    fetchLinks();
  }, []);

  const API_URL = "https://reimagined-space-xylophone-pqqrwx4pr5f6r95-5000.app.github.dev";

  const fetchLinks = async () => {
    const response = await axios.get(`${API_URL}/api/links`);
    setLinks(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/links`, form);
    setForm({ title: '', url: '', description: '' });
    fetchLinks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/links/${id}`);
    fetchLinks();
  };

  return (
    <div>
      <h1>rinku</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add Link</button>
      </form>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
            <p>{link.description}</p>
            <button onClick={() => handleDelete(link.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
