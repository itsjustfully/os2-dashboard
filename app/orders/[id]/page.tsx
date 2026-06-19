import Link from "next/link";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { fetchOrderDetail, resolveBoardStageConfig, toStageProgressConfig } from "@/lib/trello";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";
import { StageProgress } from "@/components/orders/StageProgress";
import { CommentSection } from "@/components/orders/CommentSection";
import { AttachmentGallery } from "@/components/orders/AttachmentGallery";
import { formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const order = await fetchOrderDetail(id, session.matchValue!, session.boardId!);
  if (!order) notFound();

  const stageConfig = toStageProgressConfig(
    await resolveBoardStageConfig(session.boardId!)
  );

  return (
    <div className="min-h-screen">
      <AppHeader
        eyebrow={`PO# ${order.poNumber}`}
        title={order.customerText}
        subtitle={`${order.stageName} · Due ${formatDate(order.due)}`}
        actions={
          <>
            <Link
              href="/dashboard"
              className="text-[0.8rem] text-white/55 transition-colors hover:text-white"
            >
              ← All orders
            </Link>
            <LogoutButton />
          </>
        }
      />

      <PageShell className="space-y-5">
        {order.coverUrl && (
          <GlassCard className="overflow-hidden shadow-[var(--shadow-md)]">
            <div className="relative aspect-[21/6] min-h-[160px] bg-[var(--surface-muted)]">
              <Image
                src={order.coverUrl}
                alt={order.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </GlassCard>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <GlassCard className="card-padded">
              <h2 className="mb-5 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Production progress
              </h2>
              <StageProgress currentListId={order.stageId} stageConfig={stageConfig} />
            </GlassCard>

            {order.description && (
              <GlassCard className="card-padded">
                <h2 className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Order details
                </h2>
                <div className="whitespace-pre-wrap text-[0.933rem] leading-relaxed text-[var(--text-secondary)]">
                  {order.description}
                </div>
              </GlassCard>
            )}

            <GlassCard className="card-padded">
              <h2 className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Messages
              </h2>
              <CommentSection orderId={order.id} initialComments={order.comments} />
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard className="card-padded">
              <h2 className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Summary
              </h2>
              <dl className="space-y-3 text-[0.867rem]">
                <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
                  <dt className="text-[var(--text-muted)]">Stage</dt>
                  <dd className="font-medium text-[var(--text-primary)]">{order.stageName}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
                  <dt className="text-[var(--text-muted)]">Due</dt>
                  <dd className="text-[var(--text-primary)]">{formatDate(order.due)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--text-muted)]">Updated</dt>
                  <dd className="text-[var(--text-primary)]">{formatDate(order.lastActivity)}</dd>
                </div>
              </dl>
            </GlassCard>

            <GlassCard className="card-padded">
              <h2 className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Attachments
              </h2>
              <AttachmentGallery orderId={order.id} attachments={order.attachments} />
            </GlassCard>

            {order.labels.length > 0 && (
              <GlassCard className="card-padded">
                <h2 className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {order.labels
                    .filter((l) => l.name)
                    .map((label) => (
                      <span key={label.id} className="badge badge-muted">
                        {label.name}
                      </span>
                    ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </PageShell>
    </div>
  );
}
