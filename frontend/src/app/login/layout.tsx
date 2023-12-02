import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "42 Transcendence",
  description: "Pong multiplayer game with a twist",
};

export default function RootLoginPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
