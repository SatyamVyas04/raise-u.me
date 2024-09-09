import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddYourResume from "@/components/addYourResume";
import img3 from '@/components/images/image.png'
import Image from "next/image";
import { Button } from "@/components/ui/button";
export default function page() {
	return (
		<div className="w-full h-full flex items-center justify-center align-middle flex-col gap-10">
			
			<p className="text-5xl font-semibold hover:text-slate-400 hover:cursor-pointer mt-20">Resume Enhancer</p>
            <div className="w-[600px] h-[300px] bg-gray-600 rounded-2xl">
				<div className="bg-slate-800 h-10 items-center flex justify-center text-xl rounded-md">
					<p className=" text-white rounded-xl px-1 font-semibold">Upload your Resume</p>
				</div>
				<div className="m-10 flex justify-center items-center">
                <Image
                src={img3}
                alt="Description of the image"
                layout="fit"
                objectFit="cover"
				className="h-48 transition-transform duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
                />
				</div>
				<div className="flex items-center justify-center mt-20">
				<Button className="bg-slate-200 w-52 h-12 rounded-md hover:bg-gray-200 ">
					<p className="text-black p-2 text-lg font-semibold">Enhance your Resume</p>
				</Button>
				</div>
			</div>

		
			
			
		</div>
	);
}
