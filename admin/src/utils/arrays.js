export const hasIntersection = (arrA, arrB) => arrA.some((val) => arrB.indexOf(val) !== -1)

export const noIntersection = (arrA, arrB) => !hasIntersection(arrA, arrB)

export const arrayEqual = (arrA, arrB) => {
   if(arrA.length !== arrB.length) return false
   for(let i = 0; i < arrB.length; i++) {
      if(arrA[i] !== arrB[i]) return false;
   }
   return true;
}