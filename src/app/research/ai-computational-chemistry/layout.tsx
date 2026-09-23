import WithContent from "@/components/WithContent";

export default function AiComputationalChemistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["aiComputationalChemistry"]}>{children}</WithContent>;
}
