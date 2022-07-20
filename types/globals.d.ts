// Outside process.env because its a boolean
declare const DEBUG: boolean;
// This defines 
declare namespace NodeJS {
  export interface ProcessEnv {
		VERSION: string
		WEBAPP_PATH: string
  }
}



declare module "*.sty" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.style" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.module.css" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.module.scss" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.module.sass" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.mod.css" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.mod.scss" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.mod.sass" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.m.css" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.m.scss" {
	const T : Record<string,string|undefined>
	export default T;
}
declare module "*.m.sass" {
	const T : Record<string,string|undefined>
	export default T;
}

declare module "*.css" {
	export default undefined;
}
declare module "*.scss" {
	export default undefined;
}
declare module "*.sass" {
	export default undefined;
}