import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full flex items-center justify-between px-4 py-3 border-b">
        <h1 className="text-lg font-semibold">FitTrack</h1>
        <ModeToggle />
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
