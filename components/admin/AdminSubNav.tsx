import Link from "next/link";

type AdminSubNavProps = {
  activeTab: string;
};

export function AdminSubNav({ activeTab }: AdminSubNavProps) {
  const tabs = [
    { id: "overview", label: "Dashboard Overview", href: "/superadmin" },
    { id: "producers", label: "Pending Producers", href: "/dashboard/admin/pending-users" },
    { id: "destinations", label: "Manage Destinations", href: "/dashboard/admin/destinations" },
    { id: "articles", label: "Manage Articles", href: "/dashboard/admin/articles" }
  ];

  return (
    <div className="flex border-b border-earth-bark/10 mt-6 mb-6 overflow-x-auto gap-6 scrollbar-none">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
            activeTab === tab.id
              ? "border-green-700 text-green-700 font-bold"
              : "border-transparent text-earth-ink/75 hover:text-earth-clay hover:border-earth-clay/40"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
