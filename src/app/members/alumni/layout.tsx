import WithContent from "@/components/WithContent";

export const metadata = {
  title: "Alumni | Min Ho Seo Lab",
  description: "Lab alumni",
};

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["alumni", "members"]}>{children}</WithContent>;
}

