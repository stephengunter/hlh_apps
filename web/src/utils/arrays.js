export const hasIntersection = (arrA, arrB) => arrA.some((val) => arrB.indexOf(val) !== -1)

export const noIntersection = (arrA, arrB) => !hasIntersection(arrA, arrB)