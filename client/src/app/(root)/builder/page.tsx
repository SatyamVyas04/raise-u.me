"use client";

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ResumeTemplate = ({ imageSrc }: { imageSrc: string }) => (
	<div className="flex-shrink-0 w-48 h-64 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
	  <Image src={imageSrc} alt="Resume template" width={192} height={256} objectFit="cover" />
	</div>
  );
  
  const ResumeSlider = () => {
	const templates = [
	  '/resume_template.png',
	  '/resume_template2.png',
	  '/resume_template.png',
	  '/resume_template.png',
	  '/resume_template2.png',
	  '/resume_template2.png',
	  '/resume_template2.png',
	  '/resume_template2.png',
	];
  
	const [currentIndex, setCurrentIndex] = useState(0);
	const visibleTemplates = 6; // Number of templates to show at a time
  
	const handlePrevClick = () => {
	  setCurrentIndex((prevIndex) =>
		prevIndex === 0 ? templates.length - visibleTemplates : prevIndex - 1
	  );
	};
  
	const handleNextClick = () => {
	  setCurrentIndex((prevIndex) =>
		prevIndex === templates.length - visibleTemplates ? 0 : prevIndex + 1
	  );
	};
  
	const getVisibleTemplates = () => {
	  const visibleArray = [];
	  for (let i = 0; i < visibleTemplates; i++) {
		const index = (currentIndex + i) % templates.length;
		visibleArray.push(templates[index]);
	  }
	  return visibleArray;
	};
  
	return (
	  <div className="relative w-full">
		<button
		  onClick={handlePrevClick}
		  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition duration-300 ease-in-out z-10"
		>
		  <ChevronLeft size={24} />
		</button>
  
		<button
		  onClick={handleNextClick}
		  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition duration-300 ease-in-out z-10"
		>
		  <ChevronRight size={24} />
		</button>
  
		<div className="overflow-hidden">
		  <div 
			className="flex space-x-4 transition-transform duration-300 ease-in-out"
			style={{ transform: `translateX(-${currentIndex * (100 / visibleTemplates)}%)` }}
		  >
			{templates.concat(templates.slice(0, visibleTemplates)).map((template, index) => (
			  <ResumeTemplate key={index} imageSrc={template} />
			))}
		  </div>
		</div>
	  </div>
	);
  };
  

export default function Home() {
  return (
    <div className="min-h-full  text-white">
      <div className="container mx-auto px-4 pb-8 pt-14">
        <h1 className="text-4xl font-bold mb-8 text-center">Browse Templates</h1>
        
        <ResumeSlider />
        
        <div className="mt-20 max-w-md mx-auto">
          <div className="">
            <h2 className="text-3xl font-semibold mb-8 text-center">Build Your Resume</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter job description"
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="text-center text-sm">--- OR ---</div>
              <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-md transition duration-300">
                Upload job description
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}