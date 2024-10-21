export const getBaseURL = (req) => {
    const url = new URL(req.url)
    return `${url.protocol}//${url.hostname}:${url.port}`

    //for only use during development
    // return "http://localhost:3000"
}