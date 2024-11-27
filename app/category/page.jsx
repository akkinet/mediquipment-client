import Category from '../../components/client/Category'

// Ensure the page is always dynamic
export const dynamic = 'force-dynamic';

const Page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?num=8`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })
  const data = await res.json()
  return <Category category={data} />
}

export default Page

export const generateMetadata = () => {
  return {
    title: "Category"
  }
}