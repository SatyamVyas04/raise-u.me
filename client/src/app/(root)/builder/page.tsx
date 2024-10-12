"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useUser } from "@clerk/nextjs";

interface ResumeTemplateProps {
  imageSrc: string;
}

const ResumeTemplate = ({ imageSrc }: ResumeTemplateProps) => (
  <div className="flex-shrink-0 w-48 h-64 bg-foreground rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
    <Image
      src={imageSrc}
      alt="Resume template"
      width={192}
      height={256}
      objectFit="cover"
    />
  </div>
);

const ResumeSlider = () => {
  const templates = [
    "/resume_template.png",
    "/resume_template2.png",
    "/resume_template.png",
    "/resume_template.png",
    "/resume_template2.png",
    "/resume_template2.png",
    "/resume_template2.png",
    "/resume_template2.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTemplates, setVisibleTemplates] = useState(6);

  useEffect(() => {
    const updateVisibleTemplates = () => {
      if (window.innerWidth < 640) {
        setVisibleTemplates(2);
      } else if (window.innerWidth < 768) {
        setVisibleTemplates(3);
      } else if (window.innerWidth < 1024) {
        setVisibleTemplates(4);
      } else {
        setVisibleTemplates(6);
      }
    };

    updateVisibleTemplates();
    window.addEventListener("resize", updateVisibleTemplates);
    return () => window.removeEventListener("resize", updateVisibleTemplates);
  }, []);

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

  return (
    <div className="relative mx-auto max-w-sm min-w-sm sm:max-w-sm md:max-w-md lg:max-w-xl">
      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-foreground rounded-full p-3 shadow-lg transition duration-300 ease-in-out z-10"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-foreground rounded-full p-3 shadow-lg transition duration-300 ease-in-out z-10"
      >
        <ChevronRight size={24} />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex space-x-4 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${
              currentIndex * (100 / visibleTemplates)
            }%)`,
          }}
        >
          {templates
            .concat(templates.slice(0, visibleTemplates))
            .map((template, index) => (
              <ResumeTemplate key={index} imageSrc={template} />
            ))}
        </div>
      </div>
    </div>
  );
};

interface UserData {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  skills: string[];
  education: string[];
  positionsOfResponsibility: string[];
  experience: string[];
  urls: string[];
  resumeUrl: string;
}

interface ResumeData {
  summary: string;
  contactInformation: {
    name: string;
  };
  skills: {
    languages: string[];
    technologies: string[];
    others: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
}

const ResumeDisplay: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{resumeData.contactInformation.name}</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>{resumeData.summary}</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium">Languages</h3>
            <ul className="list-disc list-inside">
              {resumeData.skills.languages.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Technologies</h3>
            <ul className="list-disc list-inside">
              {resumeData.skills.technologies.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Others</h3>
            <ul className="list-disc list-inside">
              {resumeData.skills.others.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-medium">{exp.title} at {exp.company}</h3>
            <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-medium">{edu.degree}</h3>
            <p>{edu.institution}, {edu.location}</p>
            <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            <p>GPA: {edu.gpa}</p>
          </div>
        ))}
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        {resumeData.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-medium">{project.title}</h3>
            <p>{project.description}</p>
            <p className="text-sm">Technologies: {project.technologies.join(', ')}</p>
            <a href={project.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Project Link</a>
          </div>
        ))}
      </section>
    </div>
  );
};

const JobDescriptionUploader = () => {
  const [jobDescriptions, setJobDescriptions] = useState("");
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handleJobDescriptionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescriptions(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!jobDescriptions.trim()) {
      toast.error("Please enter at least one job description.");
      return;
    }

    if (!userData) {
      toast.error("User data is not loaded.");
      return;
    }

    const descriptions = jobDescriptions
      .split("\n")
      .filter((desc) => desc.trim() !== "");

    // Prepare the payload as per backend requirements
    const payload = {
      name: userData.name,
      email: "tanush1852@gmqail.com",
      phone: "8657264290",
      skills: userData.skills.join(", "),
      experience: userData.experience.join("\n"),
      education: userData.education.join("\n"),
      projects: userData.positionsOfResponsibility.join("\n"),
      job_description: descriptions,
    };

    setIsSubmitting(true);
    setResumeData(null); // Reset previous resume data

    try {
      const response = await fetch("http://localhost:5000/build_resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data: ResumeData = await response.json();
        setResumeData(data);
        toast.success("Resume generated successfully!");
        console.log("Generated Resume Data:", data);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "Failed to generate resume. Please try again."
        );
        console.error("Error Response:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the resume.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.username) {
        try {
          const response = await fetch(`/api/user/${user.username}`);
          if (response.ok) {
            const data: UserData = await response.json();
            setUserData(data);
          } else if (response.status !== 404) {
            console.error("Failed to fetch user data");
            toast.error("Failed to fetch user data.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("An error occurred while fetching user data.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">User data not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={jobDescriptions}
          onChange={handleJobDescriptionsChange}
          placeholder="Enter job descriptions (one per line)"
          className="w-full px-4 py-2 rounded-md bg-accent bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[100px]"
          required
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-md transition duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating Resume..." : "Submit"}
        </button>
      </form>

      {resumeData && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-secondary-foreground">
            Generated Resume
          </h3>
          <ResumeDisplay resumeData={resumeData} />
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-full text-foreground">
      <Toaster richColors />
      <div className="container mx-auto px-4 pb-8 pt-14">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Browse Templates
        </h1>

        <ResumeSlider />

        <div className="mt-20 max-w-4xl mx-auto">
          <div className="">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              Build Your Resume
            </h2>
            <JobDescriptionUploader />
          </div>
        </div>
      </div>
    </div>
  );
}