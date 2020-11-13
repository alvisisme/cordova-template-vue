export const to = promise => promise.then(x => [null, x]).catch(e => [e])
