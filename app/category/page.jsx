import Category from '../../components/client/Category'

const Page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?num=8`)
  const data = await res.json()
  return <Category category={data} />
}

export default Page

export const generateMetadata = () => {
  return {
    title: "Category"
  }
}