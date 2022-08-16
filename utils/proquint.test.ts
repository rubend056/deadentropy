import { hex2quint, quint2hex } from './proquint'

test('Hex2Quint', () => {
	expect(() => hex2quint('424')).toThrow()
	expect(() => hex2quint('42453')).toThrow()
	expect(() => hex2quint('o4245')).toThrow()
	// expect(hex2quint('4432')).toBeTruthy()
	expect(hex2quint(['4432', '8348'].join(''))).toBeTruthy()
	expect(hex2quint(['4432', '8348', '8841', '8348'].join(''))).toBeTruthy()
})

test('Quint2Hex', () => {
	expect(() => quint2hex('abo')).toThrow()
	expect(() => quint2hex('babol')).toThrow()
	// expect(quint2hex('lobil')).toBeTruthy()
	expect(quint2hex(['lobil', 'balil'].join('-'))).toBeTruthy()
	expect(quint2hex(['lobil', 'balil', 'nanos', 'polas'].join('-'))).toBeTruthy()
	expect(() => quint2hex('4343')).toThrow()
	expect(() => quint2hex('lobi')).toThrow()
})

test('QuintHex-Together', () => {
	let v
	v = ['lobil', 'balil'].join('-')
	expect(hex2quint(quint2hex(v))).toBe(v)
	v = ['lobil', 'balil', 'nanos', 'polas'].join('-')
	expect(hex2quint(quint2hex(v))).toBe(v)
  
  v = ['4432', '8348'].join('')
	expect(quint2hex(hex2quint(v))).toBe(v)
  v = ['4432', '8348', '8841', '8348'].join('')
	expect(quint2hex(hex2quint(v))).toBe(v)
})
