import React from "react";
import Step from "./HomePageComponents/StepComponent";
import UploadImage from "../../assets/UploadImage.svg";
import AutomatedImage from "../../assets/AutomatedImage.svg";
import ExploreImage from "../../assets/ExploreImage.svg";
import DownloadImage from "../../assets/DownloadImage.svg";

export default function HowItWorks() {
    const steps = [
        {
          stepNumber: 1,
          title: "Upload Your Data",
          description:
            "Easily upload datasets in common formats (e.g., CSV, Excel) with guided instructions. No technical expertise required.",
          imageSrc: UploadImage,
          imageAlt: "Upload Data",
          reverse: false,
        },
        {
          stepNumber: 2,
          title: "Automated Insights Generated For You",
          description:
            "Auto Insight processes your data, delivering clear, visual insights that help you make informed decisions quickly.",
          imageSrc: AutomatedImage,
          imageAlt: "Automated Insights",
          reverse: true,
        },
        {
          stepNumber: 3,
          title: "Explore and Customize",
          description:
            "Dive deeper with customizable dashboards. Data analysts can add advanced filters, while non-technical users can explore simplified visuals.",
          imageSrc: ExploreImage,
          imageAlt: "Explore Data",
          reverse: false,
        },
        {
          stepNumber: 4,
          title: "Download Your Results",
          description:
            "Export insights and visualizations in multiple formats, including PDF, PNG, or shareable links, making collaboration seamless.",
          imageSrc: DownloadImage,
          imageAlt: "Download Results",
          reverse: true,
        },
      ];
    
      return (
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-8 text-left">
            <h2 className="text-4xl font-bold text-purple-900 mb-10 text-center">
              How it works
            </h2>
            <div className="space-y-16">
              {steps.map((step) => (
                <Step key={step.stepNumber} {...step} />
              ))}
            </div>
          </div>
        </section>
      );
    }