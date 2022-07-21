declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_HTTP_PORT: string
    SERVER_HOSTNAME: string
		SERVER_URL_PREFIX:string
    SERVER_JWT_EXPIRATION: string
  }
}
