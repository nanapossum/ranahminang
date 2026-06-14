"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import type { ApprovalStatus, Role } from "@prisma/client";

type PendingUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  approvalStatus: ApprovalStatus;
  createdAt: string;
};

type PendingUsersManagerProps = {
  initialUsers: PendingUser[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function PendingUsersManager({ initialUsers }: PendingUsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function updateApproval(userId: number, status: "APPROVED" | "REJECTED") {
    setActiveUserId(userId);
    setMessage("");

    const response = await fetch(`/api/admin/users/${userId}/approval`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    setActiveUserId(null);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(data?.message || "Failed to update user approval");
      return;
    }

    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    setMessage(status === "APPROVED" ? "Producer account approved." : "Producer account rejected.");
  }

  return (
    <section className="mt-8 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-earth-bark">Producer Requests</h2>
        <span className="rounded-md bg-earth-bark/5 px-3 py-1 text-sm font-semibold text-earth-bark">
          {users.length} pending
        </span>
      </div>

      {message ? <p className="mt-4 text-sm font-medium text-earth-clay">{message}</p> : null}

      {users.length === 0 ? (
        <p className="mt-6 rounded-md border border-earth-bark/10 bg-earth-rice p-4 text-sm text-earth-ink/70">
          No producer registrations are waiting for approval.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="border-b border-earth-bark/10 text-earth-bark">
              <tr>
                <th className="py-3 pr-4 font-semibold">User</th>
                <th className="py-3 pr-4 font-semibold">Role</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Created</th>
                <th className="py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-bark/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-earth-bark">{user.name}</p>
                    <p className="mt-1 text-earth-ink/65">{user.email}</p>
                  </td>
                  <td className="py-4 pr-4 text-earth-ink/75">{user.role}</td>
                  <td className="py-4 pr-4 text-earth-ink/75">{user.approvalStatus}</td>
                  <td className="py-4 pr-4 text-earth-ink/75">{formatDate(user.createdAt)}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(user.id, "APPROVED")}
                        disabled={activeUserId === user.id}
                        className="inline-flex items-center gap-2 rounded-md bg-earth-bark px-3 py-2 font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Check size={16} aria-hidden="true" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateApproval(user.id, "REJECTED")}
                        disabled={activeUserId === user.id}
                        className="inline-flex items-center gap-2 rounded-md border border-earth-bark/15 px-3 py-2 font-semibold text-earth-bark transition hover:border-earth-clay hover:text-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
