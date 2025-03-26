import AdvancedProductDetail from '../../../components/client/AdvancedProductDetail'
export const dynamic = 'force-dynamic';

export const generateMetadata = () => {
  return {
    title: "Product Detail",
  };
};

const fetchApi = async (id) => {
  let data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
    // next: { revalidate: 60 }, 
  });
  return await data.json();
};

async function ProductDetailPage({ params }) {
  const data = await fetchApi(params.id);

  return <AdvancedProductDetail data={data} />
}

// export async function generateStaticParams() {
//   let data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
//   data = await data.json();
//   return data.map((p) => ({ id: p._id.toString() }));
// }

export default ProductDetailPage;
