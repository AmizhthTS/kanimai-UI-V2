import { Controller } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { TimePicker } from "@/components/ui/time-picker";
import React from "react";
const TimeRangePicker = ({
  control,
  name,
  textLable,
  placeholderName,
  labelMandatory,
  onChange = () => {},
  requiredMsg = "",
  disabled = false,
  minTime,
  maxTime,
  icon,
}) => {
  return (
    <Box className="input-section">
      {textLable && (
        <Typography variant="subtitle2" className="input-label">
          {icon}
          {`${textLable}${labelMandatory ? " *" : ""}`}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: requiredMsg,
          validate: {
            min: (val) => {
              if (minTime && val && val < minTime)
                return `Time must be after ${minTime}`;
              return true;
            },
            max: (val) => {
              if (maxTime && val && val > maxTime)
                return `Time must be before ${maxTime}`;
              return true;
            },
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <TimePicker
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                onChange(name, val);
              }}
              disabled={disabled}
              className={error ? "border-red-500" : ""}
            />

            {error && <p className="text-xs text-red-500">{error.message}</p>}

            {minTime && maxTime && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                Note: Time must be between <strong>{minTime}</strong> and{" "}
                <strong>{maxTime}</strong>
              </Typography>
            )}
          </>
        )}
      />
    </Box>
  );
};

export default TimeRangePicker;
