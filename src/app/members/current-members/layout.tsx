import WithContent from "@/components/WithContent";

export const metadata = {
  title: "Current Members | Min Ho Seo Lab",
  description: "Current lab members",
};

export default function CurrentMembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["members", "alumni"]}>{children}</WithContent>;
}

