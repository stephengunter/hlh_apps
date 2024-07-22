import pluralize from 'pluralize'

export const isNullOrEmpty = (val) =>  (!val || val == undefined || val == '')

export const isNumeric = (val) =>  !isNaN(val)

export const upperFirstLetter = (val) => isNullOrEmpty(val) ? '' : val.charAt(0).toUpperCase() + val.slice(1)

export const pluralization = (val) => isNullOrEmpty(val) ? '' : pluralize(val)


// export const removeHtmlTags = (str) => {
//    if((str === null) || (str === '')) return ''
//    else {
//       str = str.toString()
//       return removeWhiteSpaces(str.replace( /(<([^>]+)>)/ig, ''))
//    }   
// }

export const removeHtmlTags = (str) => {
   if ((str === null) || (str === '')) return ''
   else {
      str = str.toString()
      return str.replace(/(<([^>]+)>)/ig, '').replace(/\n/g, '\n')
   }   
}

export const replaceNewLineWithBR = (text) => {
   if ((text === null) || (text === '')) return ''
   else {
      text = text.toString()
      return text.replace(/\n/g, '<br>')
   } 
}


export const replaceBR = (text) => {
   if ((text === null) || (text === '')) return ''
   else {
      text = text.toString()
      return text.replace(/<br>/g, '\n').replace(new RegExp('<br/>', 'g'), '\n')
   } 
}
  
   
export const removeWhiteSpaces = (strVal) => strVal.replace(/\s/g,'')

export const removeExtraSpaces = (str) => {
   return str.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, '')
}

export const formatNumberWithLeadingZeros = (num, len) => {
   let strNum = num.toString(); // Convert the number to a string
   let paddedStr = strNum.padStart(len, '0'); // Pad with leading zeros to make the length 6
   return paddedStr;
}

