import React, { useState } from "react";
import { BookOpen, Search, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const LibraryManagement = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([
    { id: "1", title: "Introduction to Machine Learning", author: "Ethem Alpaydin", isbn: "978-0262012430", quantity: 8, location: "Shelf A-4" },
    { id: "2", title: "Compilers: Principles, Techniques, and Tools", author: "Alfred Aho", isbn: "978-0321486813", quantity: 5, location: "Shelf B-2" },
    { id: "3", title: "Computer Networking: A Top-Down Approach", author: "James Kurose", isbn: "978-0133594140", quantity: 12, location: "Shelf C-1" }
  ]);

  const handleAdd = () => {
    toast.success("Add Book catalog form opened!");
  };

  const filtered = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Library Management
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Track book catalogs, track issues, returns & fine details
            </p>
          </div>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> ADD NEW BOOK
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Library Book Catalog</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search book catalog..."
              className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">S.No</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Book Title</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Author</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">ISBN No</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Copies Available</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Rack Location</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">0{idx+1}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-800">{b.title}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{b.author}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">{b.isbn}</td>
                  <td className="px-6 py-4 text-xs font-black text-indigo-600">{b.quantity} Available</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{b.location}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;
