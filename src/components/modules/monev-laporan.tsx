"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import {
  hitungPersen,
  statusCapaian,
  STATUS_LABEL,
  STATUS_TONE,
  STATUS_COLOR,
} from "@/lib/monev";

export type LaporanItem = {
  nama: string;
  standar: string;
  satuan: string;
  target: number;
  capaian: number | null;
  periode: string;
};

export function MonevLaporan({ data }: { data: LaporanItem[] }) {
  const periodeList = useMemo(
    () => Array.from(new Set(data.map((d) => d.periode))).sort(),
    [data]
  );
  const [periode, setPeriode] = useState(periodeList[0] ?? "");

  const filtered = useMemo(
    () => data.filter((d) => !periode || d.periode === periode),
    [data, periode]
  );

  const chartData = filtered.map((d) => {
    const persen = d.capaian != null ? hitungPersen(d.capaian, d.target) : 0;
    return {
      nama: d.nama.length > 18 ? d.nama.slice(0, 16) + "…" : d.nama,
      namaPenuh: d.nama,
      Target: d.target,
      Capaian: d.capaian ?? 0,
      persen,
      color: STATUS_COLOR[statusCapaian(persen)],
    };
  });

  function exportCSV() {
    const header = ["Indikator", "Standar", "Target", "Capaian", "Persen", "Status"];
    const rows = filtered.map((d) => {
      const persen = d.capaian != null ? hitungPersen(d.capaian, d.target) : 0;
      return [
        `"${d.nama}"`,
        d.standar,
        d.target,
        d.capaian ?? "",
        `${persen}%`,
        STATUS_LABEL[statusCapaian(persen)],
      ].join(",");
    });
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-monev-${periode || "semua"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="w-auto min-w-[180px]"
        >
          {periodeList.map((p) => (
            <option key={p} value={p}>
              Periode {p}
            </option>
          ))}
        </Select>
        <Button variant="outline" onClick={exportCSV}>
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Capaian vs Target per Indikator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="nama"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  labelFormatter={(_label, payload) =>
                    (payload?.[0]?.payload as { namaPenuh?: string })?.namaPenuh ??
                    ""
                  }
                />
                <Legend />
                <Bar dataKey="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Capaian" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-green-600" /> Tercapai (≥100%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-amber-600" /> Mendekati (75–99%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-red-600" /> Belum tercapai (&lt;75%)
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rincian Capaian</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <THead>
              <TR>
                <TH>Indikator</TH>
                <TH>Standar</TH>
                <TH>Target</TH>
                <TH>Capaian</TH>
                <TH>%</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((d, i) => {
                const persen =
                  d.capaian != null ? hitungPersen(d.capaian, d.target) : 0;
                const status = statusCapaian(persen);
                return (
                  <TR key={i}>
                    <TD className="font-medium text-slate-900">{d.nama}</TD>
                    <TD className="text-xs">{d.standar}</TD>
                    <TD>
                      {d.target} {d.satuan}
                    </TD>
                    <TD>
                      {d.capaian != null ? `${d.capaian} ${d.satuan}` : "—"}
                    </TD>
                    <TD className="font-medium">{persen}%</TD>
                    <TD>
                      <Badge tone={STATUS_TONE[status]}>
                        {STATUS_LABEL[status]}
                      </Badge>
                    </TD>
                  </TR>
                );
              })}
              {filtered.length === 0 && (
                <TR>
                  <TD colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data untuk periode ini.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
