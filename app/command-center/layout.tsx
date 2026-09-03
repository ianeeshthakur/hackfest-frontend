import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center — ThreadLine",
  description:
    "Owner Command Center for ThreadLine. Real-time view of your textile production units, disruptions, AI actions, and orders.",
};

/**
 * This layout wraps the Command Center in a light-themed container.
 * The root layout applies dark mode globally; we override it here at the
 * page wrapper level so the rest of the app is untouched.
 */
export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="cc-light-root"
      style={{
        // Force light background at the container level, overriding the
        // dark root body styles from the global layout.
        colorScheme: "light",
        background: "#f8fafc",
        color: "#0f172a",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
