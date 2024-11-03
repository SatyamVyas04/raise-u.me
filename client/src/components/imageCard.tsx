import Image, { StaticImageData } from "next/image";
import path from "path";

interface ImageCardProps {
	image1: StaticImageData | string; // Accepts both StaticImageData or string
}

export default function ImageCard({ image1 }: ImageCardProps) {
	return (
		<div className="relative w-[300px] h-[350px] border border-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:cursor-pointer">
			<Image
				src={image1}
				alt="Description of the image"
				layout="fill"
				objectFit="cover"
			/>
		</div>
	);
}
