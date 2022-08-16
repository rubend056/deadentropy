import { quint2uint, uint2quint } from "./proquint.imp"
/** 
Converts quint list (dash separated) of arbitrary length to corresponding hex dump prefixed with x
Quint list must contain pairs of quints to align with 32 bit boundary
*/
export function quint2hex(inp: string) {
	var v = ''
	var r = inp
	while (r.length > 0) {
		var c = r.substring(0, 11)
		if (!c.match(/^[bdfghjklmnprstvzaiou]{5}-[bdfghjklmnprstvzaiou]{5}$/)) {
			throw 'Bad quint format: ' + inp
		}
		if (r.length > 12) r = r.substring(12)
		else r = r.substring(11)
		var cx = quint2uint(c).toString(16)
		while (cx.length < 8) cx = '0' + cx
		v += cx
	}
	return v
}

/** 
Converts hex dump (x prefixed) to a list of quints. Hex dump must contain leading zeros when necessary.
Hex dump length must by divisible by 8.
*/
export function hex2quint(hex: string) {
  var v = ''
	// var sep = 
  // Remove 0x or x from beggining, and lowercase it, normalizing it
  hex = hex.replace(/^(0?x)?/i, '').toLowerCase()
  
	if (!hex.match(/^(([0-9a-f]{2}){2}){2,}$/)) {
		throw 'Bad hex length: ' + hex.length
	}
	var r = hex
	while (r.length > 0) {
		if (r.length < 8 && r.length % 8 != 0) {
			throw 'Bad hex length: ' + hex
		}
		var c = r.substring(0, 8)
		r = r.substring(8)
		var currentQuint = uint2quint(parseInt(c, 16) >> 0)
		v += currentQuint
    v += '-'
	}
	if (v.endsWith('-')) v = v.substring(0, v.length - 1)
	return v
}
