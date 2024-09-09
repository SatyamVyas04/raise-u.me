import img1 from '@/components/images/image.png'; // Importing the image from the specified path
import Image from 'next/image';
export default function Page() {
	return (
		<div>
			<p className="text-white text-5xl font-semibold mt-10">Saved Templates</p>
            <div className='mt-8 flex gap-28 '>
                <Image src={img1} alt="Description of the image" className="w-[215px] h-[297px] hover:cursor-pointer hover:scale-200"  />
                <Image src={img1} alt="Description of the image" className="w-[215px] h-[297px] hover:cursor-pointer hover:scale-200"  />
                <Image src={img1} alt="Description of the image" className="w-[215px] h-[297px] hover:cursor-pointer hover:scale-200"  />
                <Image src={img1} alt="Description of the image" className="w-[215px] h-[297px] hover:cursor-pointer hover:scale-200"  /> {/* Using the imported image */}
            </div>
		</div>
	);
}
