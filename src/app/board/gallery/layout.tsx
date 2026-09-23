import WithContent from "@/components/WithContent";

export const metadata = {
  title: "Gallery | Board",
  description: "Lab gallery - photos and images",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithContent keys={["gallery"]}>{children}</WithContent>;
}

