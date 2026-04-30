import { IconButton } from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import React from "react";

const CustomPagination = ({
  totalPages,
  page,
  onPageChange,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CustomTablePaginationActions 
        totalPages={totalPages} 
        page={page} 
        onPageChange={onPageChange} 
      />
    </div>
  );
};

export default CustomPagination;

function CustomTablePaginationActions(props) {
  const { totalPages, page, onPageChange } = props;
  
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, totalPages - 1));
  };

  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0 || totalPages === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0 || totalPages === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      
      <span className="text-sm font-bold text-slate-500 mx-2">
        Page {page + 1} of {totalPages || 1}
      </span>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= totalPages - 1 || totalPages === 0}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= totalPages - 1 || totalPages === 0}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
