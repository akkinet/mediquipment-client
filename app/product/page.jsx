import Products from '../../components/client/Products'
export const dynamic = 'force-dynamic';

async function page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  const productList = await res.json();
  const brandList = Array.from(new Set(productList.map(d => d.brand_name)));
  return (
    <Products productList={productList} brands={brandList} />
  )
}

export default page;