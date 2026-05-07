import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  control: any;
  errors: any;
  name: string;
  label: string;
  labelMandatory?: boolean;
  requiredMsg?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  control,
  errors,
  name,
  label,
  labelMandatory = false,
  requiredMsg = "",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  return (
    <>
      {label && (
        <Label className="flex items-center gap-1 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label} {labelMandatory && <span className="text-rose-500">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required: requiredMsg }}
        render={({ field }) => {
          const onDrop = useCallback(
            (acceptedFiles: File[]) => {
              if (acceptedFiles.length === 0) return;

              const file = acceptedFiles[0];

              // Validate file size (max 10MB)
              if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
              }

              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result as string;
                // Update form state with { fileName, file }
                field.onChange({
                  fileName: file.name,
                  file: base64,
                });
                setPreviewUrl(base64);
              };
              reader.readAsDataURL(file);
            },
            [field]
          );

          const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            multiple: false,
            accept: {
              "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            },
          });

          // Determine what to show as preview
          // field.value could be the object { fileName, file } or a URL string (from edit)
          const getDisplayUrl = () => {
            if (previewUrl) return previewUrl;
            if (field.value) {
              if (typeof field.value === "object" && field.value.file) {
                return field.value.file;
              }
              if (typeof field.value === "string") {
                return field.value;
              }
            }
            return null;
          };

          const displayUrl = getDisplayUrl();

          return (
            <div className="w-full">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all relative min-h-[160px] flex flex-col items-center justify-center
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                  }
                  ${displayUrl ? "border-solid border-slate-100" : ""}
                `}
              >
                <input {...getInputProps()} />

                {displayUrl ? (
                  <div className="relative w-full h-full min-h-[160px]">
                    <img
                      src={displayUrl}
                      alt="preview"
                      className="w-full h-40 object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(null);
                        setPreviewUrl("");
                      }}
                      className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-lg shadow-rose-200 transition-all hover:scale-110 active:scale-95"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {isDragActive ? "Drop to upload" : "Upload Image"}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">
                        JPG, PNG or WEBP (MAX. 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Error Message */}
      {errors[name] && (
        <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">
          {errors[name].message}
        </p>
      )}
    </>
  );
};

export default ImageUpload;
