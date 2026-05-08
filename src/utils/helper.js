// validatePincode
const validatePincode = (value) => {
  if (/^(\d)\1{5}$/.test(value)) {
    return "Pincode cannot be a sequence of six identical digits";
  }
  return true;
};
// validatePassword
const validatePassword = (value) => {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return "Empty Space Not Allow";
  }
  if (trimmedValue.length > 15) {
    return "Password cannot exceed 15 characters";
  }
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(value)) {
    return "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character,Empty Space Not Allow";
  }
};
// isWhitespace
const isWhitespace = (value) => {
  return /^\s*$/.test(value);
};
// validateEmail
const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const isValid = emailRegex.test(value);
  return isValid || "Invalid email address";
};
// validatePhoneNumber
const validatePhoneNumber = (value) => {
  if (value.length !== 10) {
    return "Phone number must be 10 digits";
  }
  const matches = value.match(
    /^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/
  );
  if (matches === null) {
    return "Only numbers allowed";
  }
};
// Amount
const Amount = (value) => {
  if (!/^\d{1,9}$/.test(value)) {
    return "Only numbers allowed";
  }
  return true; // Valid input
};
// validateNumber
const validateNumberonly = (e) => {
  const validKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
  if (!/[0-9]/.test(e.key) && !validKeys.includes(e.key)) {
    e.preventDefault();
  }
};
// validateNumber
const numberAllow = (e) => {
  const validKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];

  // Allow control keys like backspace, arrows, etc.
  if (validKeys.includes(e.key)) return;

  // If not a digit, prevent input
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
    return;
  }

  // If input already has 8 digits, prevent more
  const currentValue = e.target.value;
  if (currentValue.length >= 8) {
    e.preventDefault();
  }
};
// validateAadharNumber
const validateAadharNumber = (value) => {
  if (value.length) {
    if (value.length !== 12) {
      return "Aadhar number must be 12 digits";
    }
  }
};
// validatePANNumber
const validatePANNumber = (value) => {
  const panRegex = /^[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]$/;
  const isValid = panRegex.test(value);
  return isValid || "Please enter a valid PAN number";
};
// checkAlpha
const checkAlpha = (e) => {
  if (!/[A-Za-z\s.]/.test(e.key)) {
    e.preventDefault();
  }
};
// checkAlphanumeric
const checkAlphanumeric = (e) => {
  if (!/[0-9A-Za-z]/.test(e.key)) {
    e.preventDefault();
  }
};
// checkUppernumeric
const checkUppernumeric = (e) => {
  if (!/[0-9A-Za-z]/.test(e.key)) {
    e.preventDefault();
    return;
  }
};
// validateCinOrPanNo
const validateCinOrPanNo = (value) => {
  if (value.length !== 21) {
    return "Input must be exactly 21 characters long.";
  }
  return true;
};
// validateGSTNumber
const validateGSTNumber = (value) => {
  if (value.length) {
    if (value.length !== 15) {
      return "GST number must be 15 digits";
    }
  }
};
// youtubeLink
const youtubeLink = (value) => {
  const regex = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  const match = value.match(regex);
  if (!match) {
    return "Invalid YouTube URL";
  }
};
// checkDomainValidate
const checkDomainValidate = (value) => {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(value)) {
    console.error("Invalid domain name");
    return "Invalid domain name";
  }
};
// isValidURL
const isValidURL = (url) => {
  const pattern =
    /^(https?):\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:[/?#][^\s]*)?$/;
  return pattern.test(url);
};
const validateAlphaNumericOnly = (e) => {
  if (!/[A-Za-z0-9]/.test(e.key)) {
    e.preventDefault();
  }
};
// isEmptyObject
const isEmptyObject = (obj) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};
// checkSize
const checkSize = () => {
  if (window.innerWidth > 1440) {
    return 4;
  } else if (window.innerWidth <= 1440 && window.innerWidth > 1024) {
    return 4;
  } else if (window.innerWidth <= 1024 && window.innerWidth > 992) {
    return 4;
  } else if (window.innerWidth <= 992 && window.innerWidth > 768) {
    return 4;
  } else if (window.innerWidth <= 768 && window.innerWidth > 575) {
    return 4;
  } else {
    return 1;
  }
};
// hasThemePrivilege
const hasThemePrivilege = (requiredLevel) => {
  let Privileges = localStorage.getItem("themePrivileges");
  if (Privileges !== "undefined" && Privileges !== null) {
    const privilegeLevels = JSON.parse(Privileges);
    let value =
      privilegeLevels.indexOf("0") < privilegeLevels.indexOf(requiredLevel);
    return value;
  }
};
// getValueFromPath
function getValueFromPath(object, path) {
  const keys = path.split(".");
  return keys.reduce((acc, key) => (acc ? acc[key] : undefined), object);
}
// handleError
function handleError(error) {
  if (error.response) {
    if (error.response.status === 403) {
      // window.location.assign('/sesstion-timeout');
    }
  } else if (error.message === "Network Error") {
    // window.location.assign('/under-maintenance');
  }
}
// checkSupportStatus
let status;
const checkSupportStatus = (value) => {
  if (value === 1) {
    status = {
      name: "New",
      color: "#f90",
    };
    return status;
  } else if (value === 2) {
    status = {
      name: "In Progress",
      color: "#ff00b2",
    };
    return status;
  } else if (value === 3) {
    status = {
      name: "Resolved",
      color: "#008a00",
    };
    return status;
  } else {
    status = {
      name: "-",
      color: "",
    };
    return status;
  }
};
// tableIndexValue
const tableIndexValue = (listSize, pageNumber, index) => {
  return listSize * pageNumber + index + 1;
};
// formatNumber
const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return "0";

  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k";

  return num.toString();
};
// countryList
const countryList = [
  {
    code: "+91",
    name: "India",
    length: 10,
    flag: "https://flagcdn.com/w40/in.png",
  },
  {
    code: "+971",
    name: "UAE",
    length: 9,
    flag: "https://flagcdn.com/w40/ae.png",
  },
  {
    code: "+1",
    name: "USA",
    length: 10,
    flag: "https://flagcdn.com/w40/us.png",
  },
];
const getStatusColor = (status) => {
  switch (status) {
    case "order placed":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
export {
  validatePincode,
  validatePassword,
  isWhitespace,
  validateEmail,
  validatePhoneNumber,
  Amount,
  validateNumberonly,
  numberAllow,
  validateAadharNumber,
  validatePANNumber,
  checkAlphanumeric,
  checkAlpha,
  checkUppernumeric,
  validateCinOrPanNo,
  youtubeLink,
  isEmptyObject,
  checkSize,
  hasThemePrivilege,
  getValueFromPath,
  handleError,
  tableIndexValue,
  checkDomainValidate,
  checkSupportStatus,
  formatNumber,
  isValidURL,
  countryList,
  getStatusColor,
  validateGSTNumber,
  validateAlphaNumericOnly
};
