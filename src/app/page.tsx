import Hero from "@/components/Hero";
import Research from "@/components/Research";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import News from "@/components/News";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Research />
      <News />
      <Publications />
      <Contact />
    </div>
  );
}




