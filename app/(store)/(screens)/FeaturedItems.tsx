import Link from "next/link";
import Products from "../(component)/Product";

export default function FeaturedItems() {
  return (
    <div className="w-full px-5 md:px-16 py-16 mt-10">
        <div className="w-full flex md:flex-row flex-col md:justify-between md:items-center gap-2 md:gap-5">
            <h2 className="text-4xl md:text-5xl font-medium uppercase">Explore items</h2>
            <Link href={'/'} className="w-full md:w-auto text-right underline text-lg text-blue-800 cursor-pointer">Show All</Link>
        </div>
      <Products limit={4} />
    </div>
  )
}
