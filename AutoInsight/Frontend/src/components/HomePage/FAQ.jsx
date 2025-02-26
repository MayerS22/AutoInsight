import React, { useState } from "react";
import openedFAQ from '../../assets/openedFAQ.svg'
import closedFAQ from '../../assets/closedFAQ.svg'

export default function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const questions = [
    {
      question: "What is Auto Insight?",
      answer:
        "Auto Insight is an AI-powered platform that automates data analysis, forecasting, and decision-making. It helps businesses navigate workforce challenges, like layoffs, by providing clear insights without requiring technical expertise.",
    },
    {
      question: "Who can use Auto Insight?",
      answer:
        "Auto Insight is designed for both technical and non-technical users. Data analysts can leverage advanced features, while business professionals can easily generate insights using our intuitive interface.",
    },
    {
      question: "How does Auto Insight help during hiring process?",
      answer:
        "Our platform enables companies to analyze workforce data, predict trends, and optimize decision-making, helping them reduce costs while maintaining productivity.",
    },
    {
      question: "Do I need coding skills to use Auto Insight?",
      answer:
        "No, Auto Insight is designed to be user-friendly. Non-technical users can generate insights with guided steps, while data analysts have access to more advanced customization options.",
    },
    {
      question: " Where can I get support if I have issues?",
      answer:
        "You can reach our support team through email, live chat, or our help center for assistance. Additionally, our AI-powered chatbot is available 24/7 to answer common questions, guide you through features, and provide real-time support whenever you need it.",
    },
  ];

  return (
    <div
      id="faq"
      className=" min-h-screen py-12 pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-left mb-12">
          <h2 className="text-4xl font-extrabold text-purple-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          {questions.map((item, index) => (
            <div
              key={index}
              className="bg-purple-50 rounded-lg shadow-md p-6 cursor-pointer transition duration-300 hover:shadow-lg "
              onClick={() => toggleQuestion(index)}
            >
              {/* Question */}
              <div className="flex items-center justify-start space-x-3 ">
                {/* Custom Arrow Icons (Now on the Left) */}
                <img
                  src={activeQuestion === index ? openedFAQ : closedFAQ}
                  alt="Toggle Arrow"
                  className="w-6 h-6 text-purple-600"
                />

                <h3 className="text-lg font-semibold text-purple-900">
                  {item.question}
                </h3>
              </div>

              {/* Answer */}
              {activeQuestion === index && (
                <p className="mt-4 text-purple-800">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
