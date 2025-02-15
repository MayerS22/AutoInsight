export default function AboutUs() {
  return (
    <section id="aboutUs" className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-8 text-center">
          About Us
        </h2>

        {/* Section Content */}
        <p className="text-lg md:text-xl text-purple-800 leading-relaxed">
          Auto Insight was created to empower companies with the tools they need
          to make informed decisions during challenging times, such as workforce
          reductions. Our platform provides a seamless blend of data analysis,
          forecasting, and machine learning, enabling businesses to quickly
          extract insights without extensive manual work.
        </p>
        <br />

        <p className="text-lg md:text-xl text-purple-800 leading-relaxed mt-6">
          Our mission is to support companies by offering a mutually beneficial
          solution that maintains productivity and reduces costs associated with
          layoffs. With Auto Insight, organizations can navigate transitions
          confidently, leveraging automated insights to stay resilient and
          forward-thinking.
        </p>
      </div>
    </section>
  );
}