import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { getValueFromPath, validateNumberonly } from "../../utils";

const TextInput = ({
  control,
  errors,
  type,
  name,
  validate,
  onKeyDownData,
  textLable,
  placeholderName,
  labelMandatory,
  requiredMsg,
  inputProps,
  onInput,
  style,
  multiline,
  rows,
  icon,
  endIcon,
  startIcon, // ⭐ new
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const hasError = errors?.[name];
  const errorMessage = hasError
    ? errors[name]?.message
    : name?.includes(".")
      ? getValueFromPath(errors, `${name}.message`)
      : "";

  return (
    <div className="space-y-2" style={style}>
      {/* Label */}
      {textLable && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {icon && icon}
          {textLable} {labelMandatory && "*"}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: requiredMsg,
          validate: {
            trim: (value) => {
              if (
                requiredMsg &&
                (!value || value.toString().trim().length === 0)
              ) {
                return requiredMsg;
              }
              if (
                !requiredMsg &&
                value &&
                value.toString().trim().length === 0
              ) {
                return "Please enter valid details";
              }
              return true;
            },
            ...(typeof validate === "function"
              ? { custom: validate }
              : validate),
          },
        }}
        render={({ field }) => (
          <div className="relative w-full">
            {/* Start Icon */}
            {/* START ICON BLOCK */}
            {startIcon && (
              <div className="absolute left-0 top-0 h-full flex items-center px-4">
                {startIcon}
              </div>
            )}
            {/* If multiline → use Textarea */}
            {multiline ? (
              <Textarea
                {...field}
                id={name}
                rows={rows}
                placeholder={placeholderName}
                aria-invalid={!!hasError}
                className={
                  "text-sm pr-12 " +
                  (hasError
                    ? "border-destructive focus-visible:ring-destructive"
                    : "")
                }
                onKeyDown={(e) => {
                  if (onKeyDownData) {
                    onKeyDownData(e);
                  } else if (inputProps?.maxLength || inputProps?.minLength) {
                    validateNumberonly(e);
                  }
                }}
                onInput={onInput}
                {...inputProps}
              />
            ) : (
              <Input
                {...field}
                id={name}
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                placeholder={placeholderName}
                aria-invalid={!!hasError}
                className={
                  `text-sm pr-12 ${startIcon ? "pl-12" : ""} ` +
                  (hasError
                    ? "border-destructive focus-visible:ring-destructive"
                    : "")
                }
                style={{ paddingLeft: startIcon ? "48px" : "" }}
                onKeyDown={(e) => {
                  if (onKeyDownData) {
                    onKeyDownData(e);
                  } else if (inputProps?.maxLength || inputProps?.minLength) {
                    validateNumberonly(e);
                  }
                }}
                onInput={onInput}
                {...inputProps}
              />
            )}

            {/* Password show/hide OR end icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {type === "password" ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              ) : (
                endIcon && (
                  <div className="text-muted-foreground">{endIcon}</div>
                )
              )}
            </div>
          </div>
        )}
      />

      {/* Error Message */}
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default TextInput;
