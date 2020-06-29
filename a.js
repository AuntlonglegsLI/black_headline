let a = [
  {
    id: 3,
    name: 'lily'
  }
]
let b = [
  {
    id: 1,
    name: 'tom'
  },
  {
    id: 2,
    name: 'jack'
  },
  {
    id: 3,
    name: 'lily'
  }
]

let c = []
b.forEach(v => {
  if ( a.findIndex(k=>k.id==v.id) === -1 ) {
    c.push(v)
  }
})

console.log(c)
