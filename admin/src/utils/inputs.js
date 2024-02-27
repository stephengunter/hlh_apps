import pluralize from 'pluralize'

export const isNullOrEmpty = (val) =>  (!val || val == undefined || val == '')

export const upperFirstLetter = (val) => isNullOrEmpty(val) ? '' : val.charAt(0).toUpperCase() + val.slice(1)

export const pluralization = (val) => isNullOrEmpty(val) ? '' : pluralize(val)


export const removeHtmlTags = (str) => {
   if((str === null) || (str === '')) return ''
   else {
      str = str.toString()
      return removeWhiteSpaces(str.replace( /(<([^>]+)>)/ig, ''))
   }   
      
}

export const replaceBR = (text) => 
   text.replace(/<br>/g, '\n').replace(new RegExp('<br/>', 'g'), '\n')
   
export const removeWhiteSpaces = (strVal) => strVal.replace(/\s/g,'')