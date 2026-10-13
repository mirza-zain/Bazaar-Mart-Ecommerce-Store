import Image from "next/image";
import {data} from "../../testData/testData"
import Link from "next/link";

type Prop = {
    limit?: number
}


export default function Products({limit}: Prop) {
 const products = limit !== undefined && limit > 0 ? data.slice(0, limit) : data

  return (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {
               products.map(items => (
                <Link href={'/'} key={items.id} className="flex flex-col gap-3">
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-100">
                        <Image 
                            src={"/images/img2.jpg"} 
                            alt={items.itemName} 
                            fill
                            className="object-cover object-top hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{items.itemName}</h3>
                        <div className="flex gap-2 text-xs text-gray-500 uppercase">
                            <span>{items.category}</span>
                            <span>•</span>
                            <span>{items.subCategory}</span>
                        </div>
                        <p className="font-medium mt-1">Rs. {items.price}</p>
                    </div>
                </Link>
               )) 
            }
        </div>
    </div>
  )
}
