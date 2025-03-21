import OrderHistory from '../../components/client/OrderHistory'
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../lib/authOptions';

export const generateMetadata = () => {
  return {
      title: "Order History"
  }
}

const fetchApi = async (email) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${email}`);
  return await res.json();
}


const ProductPage = async () => {
  const session = await getServerSession(authOptions);
  const orders = await fetchApi(session.user.email);
  // console.log("orders and session" , orders , session);
  return <OrderHistory orders={orders} email={session.user.email} />
};

export default ProductPage;
