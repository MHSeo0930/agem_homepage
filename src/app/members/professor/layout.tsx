import WithContent from "@/components/WithContent";

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["professor"]}>{children}</WithContent>;
}
