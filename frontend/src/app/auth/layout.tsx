import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "42 Transcendence",
  description: "Pong multiplayer game with a twist",
};

export default function RootLoginPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
