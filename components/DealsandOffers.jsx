import DOA from './client/DAO';

const DealsandOffers = async () => {
  let product1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/1728972286827`)
  let product2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/1728971905056`)
  product1 = await product1.json()
  product2 = await product2.json()
  return (
    <DOA product1={product1} product2={product2} />
  );
};
export default DealsandOffers;
