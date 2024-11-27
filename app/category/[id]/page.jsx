import ProductByCategory from "../../../components/client/ProductByCategory";
export const dynamic = 'force-dynamic';

async function page({ params }) {
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product?category=${params.id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }
  );
  data = await data.json();
  const brandList = Array.from(new Set(data.map(d => d.brand_name)));
  return <ProductByCategory productList={data} category={data[0].category} brandList={brandList} />;
}

// export async function generateStaticParams() {
//   let data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
//   data = await data.json();
//   return data.map((p) => ({ id: p.name }));
// }

export default page;

export const generateMetadata = () => {
  return {
    title: "Category's Product",
  };
};
