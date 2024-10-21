import DataContextProvider from "../client/DataContextProvider"

async function DataProvider({ children }) {
    let cat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?num=4`)
    cat = await cat.json()
    return (
        <DataContextProvider data={cat}>
            {children}
        </DataContextProvider>
    )
}

export default DataProvider