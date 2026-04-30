import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { Upload, FileText, FileSpreadsheet } from "lucide-react";

const DragDropUploader = ({
  control,
  errors,
  name,
  getImage,
  label,
  labelMandatory,
  requiredMsg,
  handleChange,
  accept,
}) => {
  // Determine if the expected file type is an image based on the accept prop
  const isImageUpload = useMemo(() => {
    if (typeof accept === "string") {
      return accept.startsWith("image/");
    } else if (typeof accept === "object") {
      return Object.keys(accept).some((key) => key.startsWith("image/"));
    }
    return false; // Default to non-image if unknown
  }, [accept]);

  // Sanitize accept prop for react-dropzone
  const dropzoneAccept = useMemo(() => {
    if (typeof accept === "string") {
      // If accept is a string (e.g., "image/*"), react-dropzone expects an object
      // mapping MIME types to extensions like { 'image/*': [] }
      return { [accept]: [] };
    }
    return accept;
  }, [accept]);

  return (
    <div className="space-y-2">
      {label && (
        <Label className="flex items-center gap-1 mb-2">
          {label} {labelMandatory && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={null}
        rules={{ required: requiredMsg }}
        render={({ field }) => {
          const onDrop = useCallback(
            (acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                field.onChange(file);
                handleChange(file);
              }
            },
            [field, handleChange]
          );

          const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            multiple: false,
            accept: dropzoneAccept,
          });

          const previewUrl = getImage
            ? getImage
            : field.value && typeof field.value !== "string"
            ? URL.createObjectURL(field.value)
            : null;

          // Determine existing file name if field.value is a string (URL) or if getImage is string
          const fileName =
            field.value?.name ||
            (typeof getImage === "string"
              ? getImage.split("/").pop()
              : "Uploaded File");

          // Helper to infer file type for preview icon if it's not an image upload
          const isPdf =
            field.value?.type === "application/pdf" ||
            (typeof getImage === "string" && getImage.endsWith(".pdf"));

          const isExcel =
            field.value?.name?.match(/\.(xlsx|xls|csv)$/) ||
            (typeof getImage === "string" &&
              getImage.match(/\.(xlsx|xls|csv)$/));

          return (
            <>
              {/* Upload Box */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors relative overflow-hidden group
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }
                `}
              >
                <input {...getInputProps()} />

                {previewUrl ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px]">
                    {isImageUpload ||
                    (!isPdf &&
                      !isExcel &&
                      !previewUrl.endsWith(".pdf") &&
                      !previewUrl.match(/\.(xlsx|xls|csv)$/)) ? (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="w-full h-48 object-contain rounded-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-8">
                        {isPdf || previewUrl.endsWith(".pdf") ? (
                          <FileText className="h-16 w-16 text-red-500" />
                        ) : isExcel || previewUrl.match(/\.(xlsx|xls|csv)$/) ? (
                          <FileSpreadsheet className="h-16 w-16 text-green-600" />
                        ) : (
                          <FileText className="h-16 w-16 text-primary" />
                        )}
                        <span className="text-sm font-medium text-foreground max-w-[200px] truncate">
                          {field.value?.name ||
                            (typeof getImage === "string"
                              ? "Document Uploaded"
                              : "File Uploaded")}
                        </span>
                        <p className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                          Click or Drop to Replace
                        </p>
                      </div>
                    )}
                    {isImageUpload && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium">
                          Click to Change
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {isDragActive
                        ? "Drop the file here…"
                        : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isImageUpload
                        ? "PNG, JPG, GIF — max 10MB"
                        : "PDF, Excel, Docs — max 10MB"}
                    </p>
                  </div>
                )}
              </div>
            </>
          );
        }}
      />

      {/* Error Message */}
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default DragDropUploader;
