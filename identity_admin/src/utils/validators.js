import Errors from '@/common/errors';

export const addErrorMsg = (validator, key, msg) => {
   let errors = { ...validator.errors };
   errors[key] = [msg];
   validator.setErrors(errors);
}

export const getErrorMsg = (errors, key) => {
   if(errors) {
      return errors.hasOwnProperty(key) ? errors[key][0] : '';
   }
   return  '';
}

export const clearErrors = (errors, keys = []) => {
   keys.forEach(key => {
      if(errors.hasOwnProperty(key)) errors[key] = [];
   })
	return errors;
}
export const isAlphaNumeric = (input) => {
    // Allow letters, numbers, spaces, dashes (-), and underscores (_)
    const regex = /^[a-zA-Z0-9\s-_]+$/;
    return regex.test(input);
}

export const isValidUserName = (input) => {
   var pattern = /^[a-zA-Z0-9_.@]*$/    
   // Using test method of RegExp object to check if input matches the pattern
   return pattern.test(input)
}

export const isValidPhoneNumber = (input) => {
   var regex = /^0\d{9}$/;
   return regex.test(input);
}

export const isValidURL = (str) => {
   const pattern = new RegExp(
      '^' +
        '(https?:\\/\\/)?' + // Optional protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' + // Domain name
        '|localhost|' + // Allow 'localhost'
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4 address
        '(\\:\\d+)?' + // Optional port
        '(\\/[-a-z\\d%_.~+]*)*' + // Optional path
        '(\\?[&a-z\\d%_.~+=-]*)?' + // Optional query string
        '(\\#[-a-z\\d_]*)?$', // Optional fragment
      'i'
   )
   return !!pattern.test(str)
}