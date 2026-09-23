import WithContent from "@/components/WithContent";

export const metadata = {
  title: "Journal Publications | Achievements",
  description: "Journal publications in electrocatalysts, fuel cells, water electrolysis, and energy materials",
};

export default function JournalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["journalPublications", "publications", "journalsPage"]}>{children}</WithContent>;
}

