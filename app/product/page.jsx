import Products from '../../components/client/Products'

async function page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
  const productList = await res.json();
  const brandList = Array.from(new Set(productList.map(d => d.brand_name)));
  return (
    <Products productList={productList} brands={brandList} />
  )
}

export default page;