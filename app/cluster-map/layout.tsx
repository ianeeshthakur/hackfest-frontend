import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cluster Map — TextileMesh AI",
  description:
    "Real-time interactive map of textile MSME manufacturing clusters across India. Monitor factory status, disruptions, and operational health.",
};

/**
 * Cluster Map layout — light theme, matching Command Center convention.
 * Overrides the global dark-mode root layout.
 */
export default function ClusterMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="cc-light-root"
      style={{
        colorScheme: "light",
        background: "#f1f5f9",
        color: "#0f172a",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
