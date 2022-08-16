/**
 *		.* (0\d_([^.]+).mp4)
 * 		export {default as $2} from "./$1"
 */
const {readdirSync} = require('fs')
const {resolve} = require('path')
// import v_00 from './00_front_idle.mp4'
// import v_01 from './01_front_eye_idle.mp4'
// import v_02 from './02_front_eye_idle_breathe.mp4'
// import v_03 from './03_back_idle.mp4'
// import v_04 from './04_back_chew.mp4'
// import v_05 from './05_back_ball_hit.mp4'
// import v_06 from './06_back_ball_eye.mp4'
// import v_07 from './07_facing_back.mp4'
// import v_08 from './08_facing_back_r.mp4'
// import v_09 from './09_facing_front.mp4'
// import v_10 from './10_facing_front_r.mp4'

// export const states = {
// 	0: { name: 'front_idle', v: v_00 },
// 	1: { name: 'front_eye_idle', v: v_01 },
// 	2: { name: 'front_eye_idle_breathe', v: v_02 },
// 	3: { name: 'back_idle', v: v_03 },
// 	4: { name: 'back_chew', v: v_04 },
// 	5: { name: 'back_ball_hit', v: v_05 },
// 	6: { name: 'back_ball_eye', v: v_06 },
// 	7: { name: 'facing_back', v: v_07 },
// 	8: { name: 'facing_back_r', v: v_08 },
// 	9: { name: 'facing_front', v: v_09 },
// 	10: { name: 'facing_front_r', v: v_10 },
// }

const loader:any = (options, context) => {
	const files = readdirSync(resolve(__dirname))
		.map((f) => f.match(/(\d\d)_(\w+)\.mp(4|3)/))
		.filter((f) => !!f) as RegExpMatchArray[]

	const imports = files.map((f) => `import ${f[3] === '4' ? 'v' : 'a'}_${f[1]} from './${f[0]}'`).join('\n')
	const animations = files
		.reduce((a, f) => {
			const i = Number(f[1])
			let v = a[i]
			if (!v) a[i] = v = {}
			v.name = f[2]
			f[3] === '4' ? (v.v = `v_${f[1]}`) : (v.a = `a_${f[1]}`)

			return a
		}, [] as Animations)
		.map((a) => `{name:"${a.name}", v:${a.v}, a:${a.a}}`)
		.join(',')

	return {
		code: `
	${imports}
	
	const animations = [${animations}]
	export default animations
	`,
	}
}
module.exports = loader
