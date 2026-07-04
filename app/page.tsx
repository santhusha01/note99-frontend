'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${API_URL}/api/notes`);
    const data = await res.json();
    setNotes(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/api/notes/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      setEditingId(null);
    } else {
      await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle('');
    setContent('');
    fetchNotes();
  };

  const handleEdit = (note: any) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Anjana's Note App - v1.0.7</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-black"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-4 border rounded h-32 text-black"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
        </form>

        <div className="grid gap-4">
          {notes.map((note: any) => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2 text-black">{note.title}</h2>
              <p className="text-gray-700 mb-4">{note.content}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(note)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Edit NOte
                </button>
                <button onClick={() => handleDelete(note.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                  Delete NOTe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
