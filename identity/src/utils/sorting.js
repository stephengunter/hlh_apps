export const orderByDesc = (list, key = 'order') => list.sort((a, b) => b[key] - a[key])

export const orderByAsc = (list, key = 'order') => list.sort((a, b) => a[key] - b[key])