"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { OrderSummary } from "@/lib/trello";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "@/components/ui/Table";

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  const router = useRouter();

  return (
    <div className="card overflow-hidden">
      <Table>
        <TableHead>
          <TableRow>
            <Th>PO#</Th>
            <Th>Order</Th>
            <Th>Stage</Th>
            <Th>Progress</Th>
            <Th>Due</Th>
            <Th align="right">Files</Th>
            <Th align="right">Notes</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <Td>
                <span className="font-medium text-[var(--text-primary)]">
                  {order.poNumber}
                </span>
              </Td>
              <Td>
                <span className="text-[var(--text-primary)]">{order.customerText}</span>
                {order.labels.filter((l) => l.name).length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {order.labels
                      .filter((l) => l.name)
                      .slice(0, 2)
                      .map((label) => (
                        <span key={label.id} className="badge badge-muted">
                          {label.name}
                        </span>
                      ))}
                  </div>
                )}
              </Td>
              <Td>
                <span className="badge badge-navy">{order.stageName}</span>
              </Td>
              <Td>
                <div className="flex min-w-[5rem] items-center gap-2">
                  <div className="progress-track flex-1">
                    <div
                      className="progress-fill"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                  <span className="text-[0.8rem] tabular-nums text-[var(--text-muted)]">
                    {order.progress}%
                  </span>
                </div>
              </Td>
              <Td>{formatDate(order.due)}</Td>
              <Td align="right">{order.attachmentCount}</Td>
              <Td align="right">{order.commentCount}</Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
