import Contact from "@/components/Contact";

export const metadata = {
  title: "Map | About Lab",
  description: "Lab location and map",
};

export default function MapPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lab Location
              <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                연구실 위치
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find us at Pukyong National University, Busan Campus.
              <br />
              <span className="text-base text-gray-500">
                부경대학교 부산캠퍼스에서 저희를 찾아보세요.
              </span>
            </p>
          </div>
        </div>
      </section>
      <Contact />
    </div>
  );
}

