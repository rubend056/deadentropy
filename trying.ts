import babel from "@babel/core"
// import map from './map.couchjs'

console.log(babel.transform("var a = null ?? 5", {}))
