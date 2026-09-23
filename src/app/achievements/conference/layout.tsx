import WithContent from "@/components/WithContent";

export const metadata = {
  title: "Conference Presentations | Achievements",
  description: "Conference presentations and proceedings",
};

export default function ConferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["conferences", "conferencePage"]}>{children}</WithContent>;
}

