import { useEffect, useState } from 'react';
import './index.css';
const API_URL = 'http://localhost:5000/movies';

function App() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: '', director: '', genre: '', release_year: '', rating: '' });
  const [editId, setEditId] = useState(null);

  const fetchMovies = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ title: '', director: '', genre: '', release_year: '', rating: '' });
    setEditId(null);
    fetchMovies();
  };

  const handleEdit = movie => {
    setForm({
      title: movie.title,
      director: movie.director,
      genre: movie.genre,
      release_year: movie.release_year,
      rating: movie.rating
    });
    setEditId(movie.id);
  };

  const handleDelete = async id => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchMovies();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Movie Catalog</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-wrap gap-4 items-center">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-w-[120px]" />
        <input name="director" placeholder="Director" value={form.director} onChange={handleChange} required className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-w-[120px]" />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-w-[120px]" />
        <input name="release_year" type="number" placeholder="Year" value={form.release_year} onChange={handleChange} required className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-24" />
        <input name="rating" type="number" step="0.1" min="0" max="10" placeholder="Rating" value={form.rating} onChange={handleChange} required className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-20" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{editId ? 'Update' : 'Add'} Movie</button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ title: '', director: '', genre: '', release_year: '', rating: '' }); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
        )}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Director</th>
              <th className="py-3 px-4 text-left font-semibold">Genre</th>
              <th className="py-3 px-4 text-left font-semibold">Year</th>
              <th className="py-3 px-4 text-left font-semibold">Rating</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id} className="border-b last:border-none hover:bg-blue-50 transition">
                <td className="py-2 px-4">{movie.title}</td>
                <td className="py-2 px-4">{movie.director}</td>
                <td className="py-2 px-4">{movie.genre}</td>
                <td className="py-2 px-4">{movie.release_year}</td>
                <td className="py-2 px-4">{movie.rating}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleEdit(movie)} className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500 transition">Edit</button>
                  <button onClick={() => handleDelete(movie.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
