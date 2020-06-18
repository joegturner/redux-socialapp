// Validation - checks if string is empty
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

// Validation - checks if email is valid
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

// validate signup data
exports.validateSignupData = (data) => {
  /** Data validation */
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  else if (!isEmail(data.email)) errors.email = "Must be a valid email address";

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";

  if (isEmpty(data.handle)) errors.handle = "Must not be empty";
  /** End of validation **/

  // Send Validation errors
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// validate user login data
exports.validateLoginData = (user) => {
  /** Data validation */
  let errors = {};

  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";

  // Send Validation errors
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };

  /** End of validation **/
};

// validate user details
exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (!isEmpty(data.website.trim())) {
    // https://website.com save as is
    // website.com save with http://
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }

  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
