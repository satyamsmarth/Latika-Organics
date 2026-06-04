"use client";

import { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // 🔥 EMOJI PICKER STATE
  const [showPicker, setShowPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const pickerRef = useRef();

  const emojiList = [
    "🛢️","🌿","🍯","🥥","🌰","🧴",
    "🍃","🌱","🧼","💧","🍶","🥜",
    "🍎","🍋","🍓","🥑","🌾","🌻",
    "🧃","🍫","🍪","🍞","🥛","🍵"
  ];

  useEffect(() => {
    loadCategories();

    // close on outside click
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);

  }, []);

  const loadCategories = async () => {
    const res = await fetch("https://latika-organics-backend.onrender.com/api/categories");
    const data = await res.json();
    setCategories(data || []);
  };

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {

    if (!name.trim()) return;

    setLoading(true);

    const payload = { name, icon };

    if (editId) {
      await fetch(`https://latika-organics-backend.onrender.com/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("https://latika-organics-backend.onrender.com/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    setName("");
    setIcon("");
    setEditId(null);
    loadCategories();
    setLoading(false);

  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    await fetch(`https://latika-organics-backend.onrender.com/api/categories/${id}`, {
      method: "DELETE"
    });

    loadCategories();
  };

  /* ================= DRAG ================= */

  const onDragEnd = (result) => {

    if (!result.destination) return;

    const items = Array.from(categories);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setCategories(items);

  };

  /* ================= FILTER ================= */

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEmoji = emojiList.filter(e =>
    e.includes(emojiSearch)
  );

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-semibold">Categories</h1>
            <p className="text-sm text-gray-500">
              {categories.length} total
            </p>
          </div>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border p-2 rounded-lg"
          />

        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow border space-y-4">

          <p className="font-medium">
            {editId ? "Edit Category" : "Add Category"}
          </p>

          {/* EMOJI PICKER */}
          <div className="relative" ref={pickerRef}>

            <button
              type="button"
              onClick={()=>setShowPicker(!showPicker)}
              className="w-14 h-14 border rounded-xl text-2xl flex items-center justify-center bg-gray-50"
            >
              {icon || "📦"}
            </button>

            {showPicker && (
              <div className="absolute z-10 mt-2 w-64 bg-white border rounded-xl shadow-lg p-3">

                {/* SEARCH */}
                <input
                  placeholder="Search emoji"
                  value={emojiSearch}
                  onChange={(e)=>setEmojiSearch(e.target.value)}
                  className="w-full border p-2 mb-2 rounded"
                />

                {/* EMOJI GRID */}
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">

                  {filteredEmoji.map((e,i)=>(
                    <button
                      key={i}
                      onClick={()=>{
                        setIcon(e);
                        setShowPicker(false);
                      }}
                      className="text-xl p-2 hover:bg-gray-100 rounded"
                    >
                      {e}
                    </button>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* NAME */}
          <div className="flex gap-2">

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Category name"
              className="flex-1 border p-3 rounded-lg"
            />

            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 rounded-lg"
            >
              {editId ? "Update" : "Add"}
            </button>

          </div>

        </div>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow border p-4">

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="categories">

              {(provided)=>(
                <div ref={provided.innerRef} {...provided.droppableProps}>

                  {filtered.map((c,index)=>(
                    <Draggable key={c._id} draggableId={c._id} index={index}>

                      {(provided)=>(
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex justify-between items-center p-3 border rounded-lg mb-2 bg-gray-50"
                        >

                          <div className="flex gap-3 items-center">
                            <span className="text-xl">
                              {c.icon || "📦"}
                            </span>
                            <span>{c.name}</span>
                          </div>

                          <div className="flex gap-2">

                            <button
                              onClick={()=>{
                                setName(c.name);
                                setIcon(c.icon || "");
                                setEditId(c._id);
                              }}
                              className="text-blue-500 text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={()=>deleteCategory(c._id)}
                              className="text-red-500 text-sm"
                            >
                              Delete
                            </button>

                          </div>

                        </div>
                      )}

                    </Draggable>
                  ))}

                  {provided.placeholder}

                </div>
              )}

            </Droppable>
          </DragDropContext>

        </div>

      </div>

    </div>

  );

}