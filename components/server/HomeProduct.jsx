import ProductCategory from '../client/ProductCategory'

async function HomeProduct() {
    let prod = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?category=Oxygen%20Therapy%20Devices&num=6`)
    prod = await prod.json()

    return (
        <ProductCategory prod={prod} />
    )
}

export default HomeProduct