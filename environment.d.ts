declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            MONGODB: string
            deepai: string
        }
    }
}

export {}
