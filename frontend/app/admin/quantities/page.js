"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Quantities() {

  const [quantities, setQuantities] = useState([]);
  const [label, setLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);

  /* LOAD */
  const load = async () => {
    const res = await fetch("https://latika-organics-backend.onrender.com/api/quantities");
    const data = await res.json();
    setQuantities(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  /* ADD */
  const add = async () => {

    if (!label.trim()) return;

    await fetch("https://latika-organics-backend.onrender.com/api/quantities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ label })
    });

    setLabel("");
    load();

  };

  /* DELETE */
  const remove = async (id) => {

    if (!confirm("Delete this quantity?")) return;

    await fetch(`https://latika-organics-backend.onrender.com/api/quantities/${id}`, {
      method: "DELETE"
    });

    load();

  };

  /* EDIT */
  const startEdit = (q) => {
    setEditingId(q._id);
    setEditingValue(q.label);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const saveEdit = async () => {

    await fetch(`https://latika-organics-backend.onrender.com/api/quantities/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editingValue })
    });

    setEditingId(null);
    load();

  };

  /* FILTER */
  const filtered = quantities.filter(q =>
    q.label.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Quantities
            </h1>
            <p className="text-sm text-gray-500">
              Manage product sizes
            </p>
          </div>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />

        </div>

        {/* ADD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex gap-3">

          <input
            value={label}
            onChange={(e)=>setLabel(e.target.value)}
            placeholder="e.g. 500ml"
            className="flex-1 border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={add}
            className="bg-green-600 text-white px-6 rounded-xl hover:bg-green-700 transition shadow-sm"
          >
            Add
          </motion.button>

        </div>

        {/* GRID LIST */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {filtered.map((q, i) => {

            const isEditing = editingId === q._id;

            return (

              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition"
              >

                {isEditing ? (

                  <div className="space-y-3">

                    <input
                      ref={inputRef}
                      value={editingValue}
                      onChange={(e)=>setEditingValue(e.target.value)}
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
                    />

                    <div className="flex gap-3 text-sm">

                      <button
                        onClick={saveEdit}
                        className="text-green-600 font-medium"
                      >
                        Save
                      </button>

                      <button
                        onClick={()=>setEditingId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <>

                    <h2
                      onClick={()=>startEdit(q)}
                      className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-green-600 transition"
                    >
                      {q.label}
                    </h2>

                    <div className="flex justify-between mt-4 text-sm">

                      <button
                        onClick={()=>startEdit(q)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={()=>remove(q._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>

                    </div>

                  </>

                )}

              </motion.div>

            );

          })}

        </div>

      </div>

    </div>

  );

}