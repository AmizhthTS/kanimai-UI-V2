import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";

const GalleryMaster = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState(true);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  const fetchGalleries = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getGalleryList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setGalleries(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching gallery list:", error);
      toast.error("Failed to load galleries");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGalleries();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gallery?"))
      return;

    try {
      await masterApi.deleteGallery(id);
      toast.success("Gallery deleted successfully");
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery");
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2.5 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-primary border border-transparent hover:border-slate-100 shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Gallery <span className="text-primary">Master</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Visual Memories & Events
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/master/gallery/add")}
          className="w-full sm:w-auto bg-primary text-white font-black text-[10px] py-4 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Gallery
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="px-6 sm:px-10 py-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-base uppercase tracking-tight">
              Gallery Archive
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Institutional Event Catalog
            </p>
          </div>

          {/* <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Gallery..."
              className="pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold w-full focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div> */}
        </div>

        <div className="flex-1 overflow-hidden">
          {listLoading ? (
            <div className="px-6 py-24 text-center">
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Synchronizing Media...
                </span>
              </div>
            </div>
          ) : galleries.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                        S.No
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Gallery Narrative
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Classification
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Academic Scope
                      </th>
                      <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                        Control
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {galleries.map((gallery, index) => (
                      <tr
                        key={gallery.id}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="px-10 py-5 text-xs font-black text-slate-300">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">
                              {gallery.galleryName}
                            </span>
                            {gallery.galleryDescription && (
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 line-clamp-1 max-w-xs">
                                {gallery.galleryDescription}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10">
                            {gallery.galleryType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                              {gallery.degreeName || "-"}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              {gallery.courseName || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/master/gallery/edit/${gallery.id}`,
                                )
                              }
                              className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-sm rounded-xl transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(gallery.id)}
                              className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-sm rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Minimal Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    className="p-5 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-widest border border-primary/20">
                            {gallery.galleryType}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-slate-800 leading-tight tracking-tight">
                            {gallery.galleryName}
                          </h4>
                          {gallery.galleryDescription && (
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 line-clamp-2">
                              {gallery.galleryDescription}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {gallery.degreeName && (
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-100">
                              {gallery.degreeName}
                            </span>
                          )}
                          {gallery.courseName && (
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                              {gallery.courseName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() =>
                            navigate(`/admin/master/gallery/edit/${gallery.id}`)
                          }
                          className="p-3.5 bg-white border border-slate-100 text-primary rounded-2xl shadow-sm active:scale-95"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(gallery.id)}
                          className="p-3.5 bg-white border border-slate-100 text-rose-400 rounded-2xl shadow-sm active:scale-95"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-10 py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-slate-300">
                <ImageIcon className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold text-sm">
                No visual records found.
              </p>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mt-2">
                Adjust your search parameters or create a new gallery.
              </p>
            </div>
          )}
        </div>

        <div className="px-10 py-6 border-t border-slate-100 flex items-center justify-end bg-white min-h-[80px]">
          {totalCount > rowsPerPage && (
            <CustomPagination
              totalPages={Math.ceil(totalCount / rowsPerPage)}
              page={currentPage - 1}
              onPageChange={(_: any, newPage: number) =>
                setCurrentPage(newPage + 1)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryMaster;
