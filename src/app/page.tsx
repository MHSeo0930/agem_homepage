import Hero from "@/components/Hero";
import Research from "@/components/Research";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import News from "@/components/News";
import WithContent from "@/components/WithContent";

export default function Home() {
  return (
    <WithContent keys={["hero", "research", "news", "newsData", "journalPublications", "publications", "contact"]}>
    <div className="flex flex-col">
      <Hero />
      <Research />
      <News />
      <Publications />
      <Contact />
    </div>
    </WithContent>
  );
}




