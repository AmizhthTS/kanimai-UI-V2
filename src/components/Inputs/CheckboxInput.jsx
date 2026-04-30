import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { getValueFromPath } from "../../utils";

const CheckboxInput = ({
  control,
  errors,
  name,
  textLable,
  labelMandatory,
  requiredMsg,
  validate,
  style,
  description,
}) => {
  const hasError = errors?.[name];
  const errorMessage = hasError
    ? errors[name]?.message
    : name?.includes(".")
    ? getValueFromPath(errors, `${name}.message`)
    : "";

  return (
    <div className="space-y-2" style={style}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        rules={{
          required: requiredMsg,
          validate: validate,
        }}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={(val) => field.onChange(val)}
            />

            {/* Label + description */}
            <div className="flex flex-col">
              <Label
                htmlFor={name}
                className="flex items-center gap-1 cursor-pointer"
              >
                {textLable} {labelMandatory && "*"}
              </Label>

              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
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

export default CheckboxInput;
