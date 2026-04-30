import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { uploadApi } from "@/services/api";
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
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  return (
    <>
      {label && (
        <Label className="flex items-center gap-1 mb-2">
          {label} {labelMandatory && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{ required: requiredMsg }}
        render={({ field }) => {
          const onDrop = useCallback(
            async (acceptedFiles: File[]) => {
              if (acceptedFiles.length === 0) return;

              const file = acceptedFiles[0];

              // Validate file size (max 10MB)
              if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
              }

              // Show preview first
              const localPreviewUrl = URL.createObjectURL(file);
              setPreviewUrl(localPreviewUrl);

              try {
                setUploading(true);

                const formData = new FormData();
                formData.append("image", file);

                const response = await uploadApi.uploadImage(formData);

                if (response.data.response.responseStatus === 200) {
                  const uploadedImageUrl = response.data.response.imageUrl;
                  field.onChange(uploadedImageUrl);
                  setPreviewUrl(uploadedImageUrl);
                  toast.success("Image uploaded successfully");
                } else {
                  toast.error("Failed to upload image");
                  field.onChange("");
                  setPreviewUrl("");
                }
              } catch (error: any) {
                console.error("Upload error:", error);
                toast.error(
                  error.response?.data?.response?.responseMessage ||
                    "Failed to upload image"
                );
                field.onChange("");
                setPreviewUrl("");
              } finally {
                setUploading(false);
                URL.revokeObjectURL(localPreviewUrl);
              }
            },
            [field]
          );

          const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            multiple: false,
            accept: {
              "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            },
            disabled: uploading,
          });

          const isValidImageUrl = (str: string) => {
            if (!str) return false;
            try {
              new URL(str);
              return true;
            } catch {
              return false;
            }
          };

          const showImage =
            previewUrl || (field.value && isValidImageUrl(field.value));

          return (
            <>
              {/* Upload Box */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors relative
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }
                  ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input {...getInputProps()} disabled={uploading} />

                {showImage ? (
                  <div className="relative">
                    <img
                      src={previewUrl || field.value}
                      alt="preview"
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        console.error("Image failed to load");
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange("");
                        setPreviewUrl("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload
                      className={`h-8 w-8 mx-auto mb-3 ${
                        uploading
                          ? "text-muted-foreground animate-pulse"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p className="text-sm text-muted-foreground">
                      {uploading
                        ? "Uploading..."
                        : isDragActive
                        ? "Drop the image here…"
                        : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF, WebP — max 10MB
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
    </>
  );
};

export default ImageUpload;
