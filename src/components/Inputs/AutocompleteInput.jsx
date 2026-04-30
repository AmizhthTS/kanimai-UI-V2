// import { Controller } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandItem,
// } from "@/components/ui/command";
// import { Badge } from "@/components/ui/badge";
// import { ChevronDown } from "lucide-react";
// import React, { useState } from "react";
// import { getValueFromPath } from "../../utils";
// // import { getValueFromPath } from "../../../utils";

// const AutocompleteInput = ({
//   control,
//   errors,
//   name,
//   textLable,
//   placeholderName,
//   requiredMsg,
//   onChangeValue,
//   defaultValue,
//   style,
//   size,
//   multiple,
//   limitTags,
//   options = [],
//   disabled,
//   getOptionDisabled,
//   icon,
// }) => {
//   const [open, setOpen] = useState(false);

//   const getLabel = (option) => {
//     if (typeof option === "string" || typeof option === "number") return option;
//     return (
//       option?.label || option?.industriesName || option?.categoryName || ""
//     );
//   };

//   return (
//     <div className="space-y-2" style={style}>
//       {/* Label */}
//       {textLable && (
//         <Label className="flex items-center gap-1">
//           {icon}
//           {textLable} {requiredMsg && "*"}
//         </Label>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         defaultValue={multiple ? [] : null}
//         rules={{
//           required: requiredMsg,
//         }}
//         render={({ field }) => (
//           <div>
//             <Popover open={open} onOpenChange={setOpen}>
//               <PopoverTrigger asChild disabled={disabled}>
//                 <button
//                   type="button"
//                   aria-invalid={!!errors[name]}
//                   className={`w-full border rounded-md px-3 py-2 flex items-center justify-between text-left ${
//                     errors[name] ? "border-destructive ring-destructive" : "border-input"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2 flex-wrap">
//                     {/* MULTIPLE SELECT */}
//                     {multiple &&
//                     Array.isArray(field.value) &&
//                     field.value.length > 0 ? (
//                       field.value
//                         .slice(0, limitTags || field.value.length)
//                         .map((opt, i) => (
//                           <Badge key={i} variant="secondary">
//                             {getLabel(opt)}
//                           </Badge>
//                         ))
//                     ) : !multiple && field.value ? (
//                       getLabel(field.value)
//                     ) : (
//                       <span className="text-muted-foreground">
//                         {placeholderName}
//                       </span>
//                     )}
//                   </div>

//                   <ChevronDown size={18} className="opacity-50" />
//                 </button>
//               </PopoverTrigger>

//               <PopoverContent className="p-1 w-[300px]">
//                 <Command>
//                   <CommandInput placeholder={placeholderName} />

//                   <CommandList>
//                     <CommandEmpty>No results found.</CommandEmpty>

//                     {options.map((option, idx) => {
//                       const label = getLabel(option);
//                       const isDisabled = getOptionDisabled?.(option);

//                       return (
//                         <CommandItem
//                           key={idx}
//                           disabled={isDisabled}
//                           className={
//                             multiple
//                               ? field.value?.some((v) => getLabel(v) === label)
//                                 ? "bg-gradient-primary text-white mb-1"
//                                 : "mb-1"
//                               : getLabel(field.value) === label
//                               ? "bg-gradient-primary text-white mb-1"
//                               : "mb-1"
//                           }
//                           onSelect={() => {
//                             if (multiple) {
//                               const exists = field.value?.some(
//                                 (v) => getLabel(v) === label
//                               );
//                               let newValue;

//                               if (exists) {
//                                 newValue = field.value.filter(
//                                   (v) => getLabel(v) !== label
//                                 );
//                               } else {
//                                 newValue = [...(field.value || []), option];
//                               }

//                               field.onChange(newValue);
//                               onChangeValue && onChangeValue(newValue);
//                             } else {
//                               field.onChange(option);
//                               onChangeValue && onChangeValue(option);
//                               setOpen(false);
//                             }
//                           }}
//                         >
//                           {label}
//                         </CommandItem>
//                       );
//                     })}
//                   </CommandList>
//                 </Command>
//               </PopoverContent>
//             </Popover>

//             {/* Error */}
//             {getValueFromPath(errors, name)?.message && (
//               <p className="text-xs text-red-500 mt-1">
//                 {getValueFromPath(errors, name)?.message}
//               </p>
//             )}
//           </div>
//         )}
//       />
//     </div>
//   );
// };

// export default AutocompleteInput;
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { getValueFromPath } from "../../utils";

const AutocompleteInput = ({
  control,
  errors,
  name,
  textLable,
  placeholderName,
  requiredMsg,
  onChangeValue,
  defaultValue,
  style,
  size,
  multiple,
  limitTags,
  options = [],
  disabled,
  getOptionDisabled,
  icon,
  renderOption, // ✅ NEW
  getOptionLabel, // ✅ NEW
  getOptionValue, // ✅ NEW (for comparison)
}) => {
  const [open, setOpen] = useState(false);

  // ✅ Label getter
  const getLabel = (option) => {
    if (!option) return "";
    if (typeof option === "string" || typeof option === "number") return option;

    if (getOptionLabel) return getOptionLabel(option);

    return option?.name || option?.label || option?.categoryName || "";
  };

  // ✅ Unique value getter (VERY IMPORTANT FIX)
  const getValue = (option) => {
    if (!option) return null;
    if (getOptionValue) return getOptionValue(option);

    return option?._id || option?.id || getLabel(option);
  };

  // ✅ Check selected
  const isSelected = (value, option) => {
    if (!value) return false;

    if (multiple && Array.isArray(value)) {
      return value.some((v) => getValue(v) === getValue(option));
    }

    return getValue(value) === getValue(option);
  };

  return (
    <div className="space-y-2" style={style}>
      {/* Label */}
      {textLable && (
        <Label className="flex items-center gap-1">
          {icon}
          {textLable} {requiredMsg && "*"}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={multiple ? [] : null}
        rules={{
          required: requiredMsg,
        }}
        render={({ field }) => (
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild disabled={disabled}>
                <button
                  type="button"
                  aria-invalid={!!errors[name]}
                  className={`w-full border rounded-md px-3 py-2 flex items-center justify-between text-left ${
                    errors[name]
                      ? "border-destructive ring-destructive"
                      : "border-input"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* MULTIPLE */}
                    {multiple &&
                    Array.isArray(field.value) &&
                    field.value.length > 0 ? (
                      field.value
                        .slice(0, limitTags || field.value.length)
                        .map((opt, i) => (
                          <Badge key={i} variant="secondary">
                            {getLabel(opt)}
                          </Badge>
                        ))
                    ) : !multiple && field.value ? (
                      getLabel(field.value)
                    ) : (
                      <span className="text-muted-foreground">
                        {placeholderName}
                      </span>
                    )}
                  </div>

                  <ChevronDown size={18} className="opacity-50" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-1 w-[300px]">
                <Command>
                  <CommandInput placeholder={placeholderName} />

                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {options.map((option, idx) => {
                      const selected = isSelected(field.value, option);
                      const isDisabled = getOptionDisabled?.(option);

                      return (
                        <CommandItem
                          key={getValue(option) || idx}
                          disabled={isDisabled}
                          className={`mb-1 ${
                            selected ? "bg-gradient-primary text-white" : ""
                          }`}
                          onSelect={() => {
                            if (multiple) {
                              const exists = isSelected(field.value, option);

                              let newValue;

                              if (exists) {
                                newValue = field.value.filter(
                                  (v) => getValue(v) !== getValue(option),
                                );
                              } else {
                                newValue = [...(field.value || []), option];
                              }

                              field.onChange(newValue);
                              onChangeValue && onChangeValue(newValue);
                            } else {
                              field.onChange(option);
                              onChangeValue && onChangeValue(option);
                              setOpen(false);
                            }
                          }}
                        >
                          {/* ✅ CUSTOM RENDER */}
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <span>{getLabel(option)}</span>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Error */}
            {getValueFromPath(errors, name)?.message && (
              <p className="text-xs text-red-500 mt-1">
                {getValueFromPath(errors, name)?.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AutocompleteInput;
