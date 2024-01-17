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