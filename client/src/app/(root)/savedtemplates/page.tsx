import img1 from '@/components/images/image1.png'; // Importing the image from the specified path
import Image from 'next/image';
import ImageCard from '@/components/imageCard';
import img2 from '@/components/images/image2.png'

export default function Page() {
    return (
        <div>
            <p className="text-white text-5xl font-semibold mt-10 hover:text-purple-500 hover:cursor-pointer stagger-text ">Saved Templates</p>
            <div className='mt-8 flex flex-wrap gap-8'>

                <ImageCard image1={img1} />
                <ImageCard image1={img1} />
                <ImageCard image1={img1} />
                <ImageCard image1={img1} />
                <ImageCard image1={img2}/>
                
            </div>
        </div>
    );
}
