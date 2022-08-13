declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            MONGODB: string
            deepai: string
            GUILDS: string
            LOGIN: string
            ERROR: string
        }
    }
}

export {}
