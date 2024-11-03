import img1 from "@/components/images/image1.png"; // Importing the image from the specified path
import Image from "next/image";
import ImageCard from "@/components/imageCard";
import img2 from "@/components/images/image2.png";

export default function Page() {
	return (
		<div className="flex-1 items-center justify-center">
			<p className="text-foreground text-5xl font-semibold mt-10 hover:text-purple-500 hover:cursor-pointer stagger-text text-center">
				Saved Templates
			</p>
			<div className="mt-8 flex flex-wrap items-center justify-center gap-8">
				<ImageCard image1={img1} />
				<ImageCard image1={img1} />
				<ImageCard image1={img1} />
				<ImageCard image1={img1} />
				<ImageCard image1={img2} />
			</div>
		</div>
	);
}
