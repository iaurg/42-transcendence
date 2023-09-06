import { Metadata } from "next";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

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
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
