import WithContent from "@/components/WithContent";

export default function GreenEnergyMaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["greenEnergyMaterials"]}>{children}</WithContent>;
}
