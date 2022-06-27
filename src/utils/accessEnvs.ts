// Define cache variable for storing env variables
export const cache: { [key: string]: string } = {}

export const accessEnv = (key: string, defaultValue?: string) => {
    if (!(key in process.env) || typeof process.env[key] === undefined) {
        // If key not found or undefined return default value if given
        if (defaultValue) return defaultValue
        // If default value not given throw error
        throw new Error(`${key} not found in process.env`)
    }

    // If key not in the cache then define it in the cache
    if (!(key in cache)) cache[key] = <string>process.env[key]

    // Return cached env key
    return cache[key]
}
