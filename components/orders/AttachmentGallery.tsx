"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/ui/GlassButton";
import { formatDate } from "@/lib/utils";

type Attachment = {
  id: string;
  name: string;
  url: string;
  date: string;
  previews?: { url: string; width: number; height: number }[];
};

export function AttachmentGallery({
  orderId,
  attachments,
}: {
  orderId: string;
  attachments: Attachment[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(
    attachments[0]?.previews?.[0]?.url ?? attachments[0]?.url ?? null
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`/api/orders/${orderId}/attachments`, {
      method: "POST",
      body: form,
    });

    if (res.ok) router.refresh();
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      {selected && (
        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)]">
          <Image src={selected} alt="Preview" fill className="object-contain" unoptimized />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {attachments.map((att) => {
          const thumb = att.previews?.find((p) => p.width >= 200)?.url ?? att.url;
          return (
            <button
              key={att.id}
              type="button"
              onClick={() => setSelected(thumb)}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-white text-left transition-all hover:border-[var(--navy)] hover:shadow-[var(--shadow-sm)]"
            >
              <div className="relative aspect-square">
                <Image
                  src={thumb}
                  alt={att.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-2">
                <p className="truncate text-[0.6875rem] text-[var(--text-secondary)]">
                  {att.name}
                </p>
                <p className="text-[0.625rem] text-[var(--text-muted)]">
                  {formatDate(att.date)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <label className="inline-block cursor-pointer">
        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleUpload} />
        <span className="inline-flex">
          <GlassButton variant="ghost" loading={uploading} type="button">
            Upload file
          </GlassButton>
        </span>
      </label>
    </div>
  );
}
