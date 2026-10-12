import Image from "next/image";

export default function HomePage() {
  const images = [
    '/images/img1.jpg',
    '/images/img2.jpg',
    '/images/img3.jpg',
    '/images/img4.jpg'
  ]

  return (
    <div className="relative flex h-screen w-full items-center overflow-hidden bg-[#f3f0ec]">
        <div className="flex w-max animate-scroll-left gap-4 md:gap-8">
            {/* First Set of Images */}
            {
                images.map((src, index) => (
                    <div key={index} className="relative h-[50vh] w-62.5 shrink-0 sm:w-75 md:h-[60vh] md:w-100 transition-all duration-500 ease-in-out blur-[2px] scale-90 opacity-70 hover:blur-none hover:scale-110 hover:opacity-100 hover:z-20">
                        <Image 
                            src={src}
                            alt={`Fashion ${index}`}
                            fill 
                            className="object-cover shadow-xl rounded-xl"
                        />
                    </div>
                ))
            }

            {/* Second set of images */}
            {
                images.map((src, index) => (
                    <div key={index} className="relative h-[50vh] w-62.5 shrink-0 sm:w-75 md:h-[60vh] md:w-100 transition-all duration-500 ease-in-out blur-[2px] scale-90 opacity-70 hover:blur-none hover:scale-110 hover:opacity-100 hover:z-20">
                        <Image 
                            src={src}
                            alt={`Fashion ${index}`}
                            fill 
                            className="object-cover shadow-xl rounded-xl"
                        />
                    </div>
                ))
            }            
        </div>
        {/* The text center */}
        <h1 className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center font-black leading-[0.9] text-white drop-shadow-lg text-7xl  md:text-[6rem] lg:text-[8rem]">
            Baazar<br />Mart
        </h1>
    </div>
  )
}
