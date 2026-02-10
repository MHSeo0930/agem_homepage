import Contact from "@/components/Contact";

export const metadata = {
  title: "Contact | Min Ho Seo",
  description: "Contact information and location",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                연락처
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get in touch for research collaborations, student inquiries, or general questions.
              <br />
              <span className="text-base text-gray-500">
                연구 협력, 학생 문의 또는 일반 질문이 있으시면 연락 주세요.
              </span>
            </p>
          </div>
        </div>
      </section>
      <Contact />
    </div>
  );
}

