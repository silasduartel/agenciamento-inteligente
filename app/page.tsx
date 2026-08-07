"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Bot,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Cloud,
  Cog,
  DatabaseZap,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  Loader2,
  Mail,
  Menu,
  MessageSquare,
  Network,
  PackagePlus,
  PhoneCall,
  Route,
  Search,
  Send,
  ShieldAlert,
  Smartphone,
  Truck,
  Users,
  X
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { atendimentos, campanhas, cargas, chartSeries, filiais, motoristas, oportunidadesRetorno } from "@/data/mock";
import { brl, maskPhone } from "@/lib/utils";
import type { Atendimento, Carga, Motorista, OportunidadeRetorno } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { MetricCard } from "@/components/ui/metric-card";
import { ScoreIndicator } from "@/components/ui/score-indicator";
import { SelectNative } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";

type PageKey = "overview" | "cargas" | "agenciamento" | "motoristas" | "retorno" | "campanhas" | "atendimentos" | "inteligencia" | "integracoes" | "configuracoes";

const navItems = [
  { key: "overview", label: "Visão geral", icon: LayoutDashboard },
  { key: "cargas", label: "Central de cargas", icon: Boxes },
  { key: "agenciamento", label: "Agenciamento", icon: Bot },
  { key: "motoristas", label: "Motoristas", icon: Truck },
  { key: "retorno", label: "Fretes de retorno", icon: Route },
  { key: "campanhas", label: "Campanhas", icon: Send },
  { key: "atendimentos", label: "Atendimentos", icon: MessageSquare },
  { key: "inteligencia", label: "Inteligência operacional", icon: Gauge },
  { key: "integracoes", label: "Integrações", icon: DatabaseZap },
  { key: "configuracoes", label: "Configurações", icon: Cog }
] as const;

const pieColors = ["#17345f", "#0f8f6f", "#f2b84b", "#c2410c", "#64748b"];

const sourceHealth = [
  { fonte: "Operações", canal: "Teams / reuniões semanais", cargas: 86, confianca: 74, pendencias: "perfil de veículo e urgência" },
  { fonte: "FreteBras", canal: "planilha em massa / API", cargas: 112, confianca: 82, pendencias: "bloqueio cadastral" },
  { fonte: "Portal Motz", canal: "portal interno", cargas: 64, confianca: 88, pendencias: "duplicidade eventual" },
  { fonte: "CRM", canal: "base de disparo", cargas: 41, confianca: 69, pendencias: "telefone e opt-in" },
  { fonte: "WhatsApp", canal: "grupos operacionais", cargas: 28, confianca: 55, pendencias: "campos incompletos" },
  { fonte: "Drive / planilhas", canal: "arquivos manuais", cargas: 37, confianca: 61, pendencias: "formato sensível a erro" }
];

const decisionSteps = [
  { title: "Capturar", detail: "Ler cargas de operações, FreteBras, portal, CRM, WhatsApp, e-mail e Drive." },
  { title: "Consolidar", detail: "Unificar o cardápio de fretes, removendo duplicidades e campos conflitantes." },
  { title: "Validar", detail: "Sinalizar valor ausente, veículo pendente, KM inconsistente e motorista bloqueado." },
  { title: "Recomendar", detail: "Priorizar cargas e sugerir motoristas com score explicável." },
  { title: "Antecipar retorno", detail: "Ofertar próxima carga antes do motorista voltar vazio." }
];

export default function Home() {
  const [page, setPage] = useState<PageKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [branch, setBranch] = useState(filiais[0].id);
  const [query, setQuery] = useState("");
  const [selectedCarga, setSelectedCarga] = useState<Carga | null>(null);
  const [selectedMotorista, setSelectedMotorista] = useState<Motorista | null>(null);
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento>(atendimentos[0]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar page={page} setPage={setPage} open={mobileOpen} setOpen={setMobileOpen} />
      <div className="lg:pl-64">
        <Header branch={branch} setBranch={setBranch} query={query} setQuery={setQuery} onMenu={() => setMobileOpen(true)} showToast={showToast} />
        <main className="p-4 sm:p-6">
          {page === "overview" && <Overview setPage={setPage} />}
          {page === "cargas" && <CentralCargas query={query} setSelectedCarga={setSelectedCarga} showToast={showToast} />}
          {page === "agenciamento" && <Agenciamento showToast={showToast} />}
          {page === "motoristas" && <Motoristas setSelectedMotorista={setSelectedMotorista} showToast={showToast} />}
          {page === "retorno" && <FretesRetorno showToast={showToast} />}
          {page === "campanhas" && <Campanhas showToast={showToast} />}
          {page === "atendimentos" && <Atendimentos selected={selectedAtendimento} setSelected={setSelectedAtendimento} showToast={showToast} />}
          {page === "inteligencia" && <Inteligencia />}
          {page === "integracoes" && <Integracoes showToast={showToast} />}
          {page === "configuracoes" && <Configuracoes />}
        </main>
      </div>
      {selectedCarga && <CargaDrawer carga={selectedCarga} onClose={() => setSelectedCarga(null)} showToast={showToast} />}
      {selectedMotorista && <MotoristaDrawer motorista={selectedMotorista} onClose={() => setSelectedMotorista(null)} showToast={showToast} />}
      {toast && <div className="fixed bottom-4 right-4 z-50 rounded-md bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>}
    </div>
  );
}

function Sidebar({ page, setPage, open, setOpen }: { page: PageKey; setPage: (page: PageKey) => void; open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white lg:block">
        <SidebarContent page={page} setPage={setPage} />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <aside className="h-full w-72 bg-white shadow-xl">
            <div className="flex justify-end p-3">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent page={page} setPage={(next) => { setPage(next); setOpen(false); }} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ page, setPage }: { page: PageKey; setPage: (page: PageKey) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary p-2 text-white"><Truck className="h-5 w-5" /></div>
          <div>
            <h1 className="text-base font-semibold">Agenciamento Inteligente</h1>
            <p className="text-xs text-slate-500">Torre de controle comercial</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = page === item.key;
          return (
            <button key={item.key} onClick={() => setPage(item.key)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${active ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100"}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-slate-500">Protótipo frontend, sem integrações reais.</div>
    </div>
  );
}

function Header({ branch, setBranch, query, setQuery, onMenu, showToast }: { branch: string; setBranch: (value: string) => void; query: string; setQuery: (value: string) => void; onMenu: () => void; showToast: (message: string) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}><Menu className="h-5 w-5" /></Button>
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargas, motoristas, rotas ou clientes" className="pl-9" />
        </div>
        <SelectNative value={branch} onChange={(event) => setBranch(event.target.value)} className="w-44">
          {filiais.map((filial) => <option key={filial.id} value={filial.id}>{filial.nome}</option>)}
        </SelectNative>
        <Button variant="outline" size="icon" title="Notificações"><Bell className="h-4 w-4" /></Button>
        <Button onClick={() => showToast("Nova carga criada em rascunho.")}><PackagePlus className="h-4 w-4" /> Nova carga</Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">AT</div>
      </div>
    </header>
  );
}

function PageHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}

function Overview({ setPage }: { setPage: (page: PageKey) => void }) {
  const criticas = cargas.filter((carga) => carga.prioridade === "Crítica" || carga.status === "Com inconsistência").length;
  return (
    <section>
      <PageHeader title="Visão geral" subtitle="Torre de controle para capturar cargas, validar dados, recomendar motoristas e antecipar fretes de retorno." actions={<FilterRow />} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Cargas consolidadas" value={String(cargas.length)} detail="6 fontes simuladas" icon={Network} />
        <MetricCard title="Pendências de dados" value={String(criticas)} detail="Valor, KM, veículo ou duplicidade" icon={AlertTriangle} tone="text-amber-600" />
        <MetricCard title="Motoristas disponíveis" value={String(motoristas.filter((m) => m.elegivel).length)} detail="Elegíveis para reserva" icon={Users} tone="text-emerald-700" />
        <MetricCard title="Motoristas em rota" value="18" detail="Com retorno potencial" icon={Truck} />
        <MetricCard title="Reservas confirmadas" value="64" detail="Hoje até agora" icon={CheckCircle2} tone="text-emerald-700" />
        <MetricCard title="Taxa de conversão" value="31,8%" detail="Contato → reserva" icon={Gauge} />
        <MetricCard title="Retornos/multitrecho" value={String(oportunidadesRetorno.length)} detail="7 acima de 80 de score" icon={Route} />
        <MetricCard title="Margem estimada" value="R$ 148 mil" detail="Carteira aberta" icon={Building2} tone="text-emerald-700" />
      </div>
      <DecisionFlowPanel />
      <SourceConsolidationPanel />
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Cargas recebidas versus agenciadas" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}><AreaChart data={chartSeries.cargasMes}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dia" /><YAxis /><Tooltip /><Area dataKey="recebidas" stroke="#17345f" fill="#dbeafe" /><Area dataKey="agenciadas" stroke="#0f8f6f" fill="#dcfce7" /></AreaChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Conversão por canal">
          <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={chartSeries.canais} dataKey="valor" nameKey="canal" outerRadius={90} label>{chartSeries.canais.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Motoristas ativados">
          <ResponsiveContainer width="100%" height={220}><LineChart data={chartSeries.motoristas}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="semana" /><YAxis /><Tooltip /><Line type="monotone" dataKey="ativados" stroke="#17345f" strokeWidth={3} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Cargas por segmento">
          <ResponsiveContainer width="100%" height={220}><BarChart data={["Inbound", "Outbound", "Novos negócios", "Construção civil", "Agro"].map((name) => ({ name, total: cargas.filter((c) => c.segmento === name).length }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="total" fill="#17345f" /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Retornos identificados versus confirmados">
          <ResponsiveContainer width="100%" height={220}><BarChart data={[{ name: "Identificados", total: 20 }, { name: "Confirmados", total: 8 }]}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="total" fill="#0f8f6f" /></BarChart></ResponsiveContainer>
        </ChartCard>
      </div>
      <ReturnPriorityPanel setPage={setPage} />
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Atenção necessária</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Cargas sem destino", "Outbound com destino definido no carregamento", 4],
              ["Cargas sem valor", "Precisam validação comercial", 4],
              ["Cargas sem tipo de veículo", "Pendentes para campanha", 3],
              ["Cargas próximas do prazo", "Carregamento nas próximas 12h", 9],
              ["Motoristas bloqueados", "Restrição operacional ativa", 3],
              ["Registros com inconsistência", "Duplicidade, KM ou campos ausentes", 7]
            ].map(([title, detail, count]) => (
              <button key={title} onClick={() => setPage("cargas")} className="flex w-full items-center justify-between rounded-md border bg-white p-3 text-left hover:bg-slate-50">
                <span><strong className="block text-sm">{title}</strong><span className="text-xs text-slate-500">{detail}</span></span>
                <Badge tone={Number(count) > 6 ? "red" : "yellow"}>{count}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Atividade recente</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Ana reservou Carlos Henrique para CG-2402", "Campanha Retorno Santos enviada para 154 motoristas", "CG-2411 recebeu alerta de valor não informado", "Rafael Nunes demonstrou interesse em carga agro", "Integração Plataforma de fretes simulou 312 registros"].map((event, index) => (
              <div key={event} className="flex items-center gap-3 rounded-md bg-slate-50 p-3 text-sm"><div className="h-2 w-2 rounded-full bg-primary" /><span>{event}</span><span className="ml-auto text-xs text-slate-500">{12 + index * 7} min</span></div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FilterRow() {
  return (
    <div className="flex flex-wrap gap-2">
      {["Período", "Filial", "Segmento", "Operação"].map((label) => (
        <SelectNative key={label}><option>{label}: todos</option><option>Hoje</option><option>Últimos 7 dias</option></SelectNative>
      ))}
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <Card className={className}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}

function DecisionFlowPanel() {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Esteira do agenciamento inteligente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-5">
          {decisionSteps.map((step, index) => (
            <div key={step.title} className="rounded-md border bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <Badge tone={index < 3 ? "blue" : "green"}>{index + 1}</Badge>
                {index < decisionSteps.length - 1 && <ChevronRight className="hidden h-4 w-4 text-slate-400 lg:block" />}
              </div>
              <p className="text-sm font-semibold text-slate-950">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SourceConsolidationPanel() {
  const icons = [ClipboardList, FileSpreadsheet, DatabaseZap, Send, Smartphone, Cloud];
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Entrada e consolidação das fontes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sourceHealth.map((source, index) => {
            const Icon = icons[index];
            return (
              <div key={source.fonte} className="rounded-md border bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-slate-100 p-2"><Icon className="h-4 w-4 text-primary" /></div>
                    <div>
                      <p className="text-sm font-semibold">{source.fonte}</p>
                      <p className="text-xs text-slate-500">{source.canal}</p>
                    </div>
                  </div>
                  <StatusBadge value={source.confianca >= 80 ? "Confiável" : source.confianca >= 65 ? "Revisar" : "Frágil"} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Info label="Cargas capturadas" value={source.cargas} />
                  <Info label="Confiança" value={`${source.confianca}%`} />
                </div>
                <p className="mt-2 text-xs text-slate-500">Pendência típica: {source.pendencias}.</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ReturnPriorityPanel({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <Card className="mt-5 border-emerald-200 bg-emerald-50">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-950">Frete de retorno como motor de valor</p>
          <p className="mt-1 text-sm text-emerald-800">O sistema prioriza motoristas em rota e sugere uma próxima carga antes que eles voltem vazios.</p>
        </div>
        <Info label="Oportunidades D-1" value="20 identificadas" />
        <Info label="Risco por localização" value="6 com baixa confiança" />
        <Button onClick={() => setPage("retorno")}>Ver multitrecho</Button>
      </CardContent>
    </Card>
  );
}

function CentralCargas({ query, setSelectedCarga, showToast }: { query: string; setSelectedCarga: (carga: Carga) => void; showToast: (message: string) => void }) {
  const [view, setView] = useState<"table" | "cards">("table");
  const [status, setStatus] = useState("Todos");
  const [sort, setSort] = useState<"prioridade" | "valorFrete" | "qualidadeDados">("prioridade");
  const filtered = useMemo(() => cargas
    .filter((carga) => status === "Todos" || carga.status === status)
    .filter((carga) => `${carga.codigo} ${carga.cliente} ${carga.origem} ${carga.destino ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => String(b[sort] ?? "").localeCompare(String(a[sort] ?? ""))), [query, status, sort]);

  return (
    <section>
      <PageHeader title="Central de cargas" subtitle="Cardápio consolidado de fretes, com saneamento de dados antes da oferta ao motorista." actions={<div className="flex gap-2"><Button variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>Tabela</Button><Button variant={view === "cards" ? "default" : "outline"} onClick={() => setView("cards")}>Cards</Button></div>} />
      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-blue-50 p-2"><Network className="h-5 w-5 text-blue-700" /></div>
              <div>
                <p className="text-sm font-semibold">Fontes unificadas</p>
                <p className="text-xs text-slate-500">Operações, FreteBras, portal, CRM, WhatsApp e planilhas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-amber-50 p-2"><ClipboardCheck className="h-5 w-5 text-amber-700" /></div>
              <div>
                <p className="text-sm font-semibold">Validação antes da oferta</p>
                <p className="text-xs text-slate-500">Valor, veículo, destino, KM, duplicidade e bloqueio.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-emerald-50 p-2"><Route className="h-5 w-5 text-emerald-700" /></div>
              <div>
                <p className="text-sm font-semibold">Sinal para retorno</p>
                <p className="text-xs text-slate-500">Carga com potencial de multitrecho já aparece para agenciamento.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-4"><CardContent className="flex flex-wrap gap-2 p-4">
        {["Origem", "Destino", "Segmento", "Tipo de veículo", "Data", "Prioridade", "Fonte"].map((label) => <SelectNative key={label}><option>{label}: todos</option></SelectNative>)}
        <SelectNative value={status} onChange={(e) => setStatus(e.target.value)}><option>Todos</option>{Array.from(new Set(cargas.map((c) => c.status))).map((s) => <option key={s}>{s}</option>)}</SelectNative>
        <SelectNative value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="prioridade">Ordenar: prioridade</option><option value="valorFrete">Ordenar: valor</option><option value="qualidadeDados">Ordenar: qualidade</option></SelectNative>
      </CardContent></Card>
      {filtered.length === 0 ? <EmptyState /> : view === "table" ? <CargasTable cargas={filtered.slice(0, 16)} setSelectedCarga={setSelectedCarga} showToast={showToast} /> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, 12).map((carga) => <CargaCard key={carga.id} carga={carga} onOpen={() => setSelectedCarga(carga)} showToast={showToast} />)}</div>}
    </section>
  );
}

function CargasTable({ cargas: rows, setSelectedCarga, showToast }: { cargas: Carga[]; setSelectedCarga: (carga: Carga) => void; showToast: (message: string) => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="dense-table w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr>{["Código", "Segmento", "Cliente", "Origem", "Destino", "Produto", "Carregamento", "Veículo", "Peso", "Frete", "KM", "Prioridade", "Fonte", "Qualidade", "Compatíveis", "Status", "Responsável", "Ações"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y bg-white">
            {rows.map((carga) => <tr key={carga.id} className="hover:bg-slate-50">
              <td className="px-3 py-3 font-medium">{carga.codigo}</td><td className="px-3 py-3">{carga.segmento}</td><td className="px-3 py-3">{carga.cliente}</td><td className="px-3 py-3">{carga.origem}</td><td className="px-3 py-3">{carga.destino ?? "Destino definido no carregamento"}</td><td className="px-3 py-3">{carga.produto}</td><td className="px-3 py-3">{carga.carregamento}</td><td className="px-3 py-3">{carga.veiculo ?? "Pendente"}</td><td className="px-3 py-3">{carga.peso} t</td><td className="px-3 py-3">{carga.valorFrete ? brl.format(carga.valorFrete) : "Não informado"}</td><td className="px-3 py-3">{carga.distancia}</td><td className="px-3 py-3"><StatusBadge value={carga.prioridade} /></td><td className="px-3 py-3">{carga.fonte}</td><td className="px-3 py-3"><ScoreIndicator score={carga.qualidadeDados} label="Dados" /></td><td className="px-3 py-3">{carga.motoristasCompativeis}</td><td className="px-3 py-3"><StatusBadge value={carga.status} /></td><td className="px-3 py-3">{carga.responsavel}</td>
              <td className="px-3 py-3"><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => setSelectedCarga(carga)}>Abrir</Button><Button size="sm" variant="ghost" onClick={() => showToast(`Campanha criada para ${carga.codigo}.`)}>Campanha</Button></div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t p-3 text-sm text-slate-500"><span>Mostrando {rows.length} de {cargas.length} cargas</span><div className="flex gap-1"><Button size="sm" variant="outline">Anterior</Button><Button size="sm" variant="outline">Próxima</Button></div></div>
    </Card>
  );
}

function CargaCard({ carga, onOpen, showToast }: { carga: Carga; onOpen: () => void; showToast: (message: string) => void }) {
  return (
    <Card><CardContent className="space-y-3 p-4"><div className="flex items-start justify-between"><div><p className="font-semibold">{carga.codigo}</p><p className="text-sm text-slate-500">{carga.cliente}</p></div><StatusBadge value={carga.status} /></div><p className="text-sm">{carga.origem} → {carga.destino ?? "Destino definido no carregamento"}</p><div className="flex flex-wrap gap-2"><Badge tone="blue">{carga.segmento}</Badge><Badge tone="gray">{carga.veiculo ?? "Veículo pendente"}</Badge><StatusBadge value={carga.prioridade} /></div><ScoreIndicator score={carga.qualidadeDados} label="Qualidade dos dados" /><div className="flex gap-2"><Button size="sm" onClick={onOpen}>Abrir detalhes</Button><Button size="sm" variant="outline" onClick={() => showToast(`${carga.codigo} publicada para divulgação.`)}>Publicar</Button></div></CardContent></Card>
  );
}

function CargaDrawer({ carga, onClose, showToast }: { carga: Carga; onClose: () => void; showToast: (message: string) => void }) {
  const [tab, setTab] = useState("Visão geral");
  const suggested = motoristas.slice(0, 8).map((m, i) => ({ ...m, score: 96 - i * 6, distancia: 18 + i * 24 }));
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40">
      <aside className="ml-auto h-full w-full max-w-5xl overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4"><div><h3 className="text-lg font-semibold">{carga.codigo} · {carga.cliente}</h3><p className="text-sm text-slate-500">{carga.origem} → {carga.destino ?? "Destino definido no carregamento"}</p></div><Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button></div>
        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2">{["Visão geral", "Motoristas sugeridos", "Confiabilidade", "Atendimentos", "Histórico", "Dados de origem"].map((item) => <Button key={item} variant={tab === item ? "default" : "outline"} size="sm" onClick={() => setTab(item)}>{item}</Button>)}</div>
          {tab === "Visão geral" && <div className="grid gap-4 md:grid-cols-3"><Info label="Status" value={<StatusBadge value={carga.status} />} /><Info label="Prioridade" value={<StatusBadge value={carga.prioridade} />} /><Info label="Segmento" value={carga.segmento} /><Info label="Produto" value={carga.produto} /><Info label="Peso" value={`${carga.peso} toneladas`} /><Info label="Tipo de veículo" value={carga.veiculo ?? "Tipo de veículo pendente"} /><Info label="Carregamento" value={carga.carregamento} /><Info label="Valor do frete" value={carga.valorFrete ? brl.format(carga.valorFrete) : "Valor não informado"} /><Info label="Distância" value={`${carga.distancia} km`} /><Info label="Responsável" value={carga.responsavel} /><Info label="Fonte" value={carga.fonte} /><Info label="Qualidade dos dados" value={<ScoreIndicator score={carga.qualidadeDados} />} /><div className="md:col-span-3"><Info label="Observações" value={carga.observacoes} /></div></div>}
          {tab === "Motoristas sugeridos" && <div className="space-y-3">{suggested.map((m, index) => <Card key={m.id}><CardContent className="grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"><div><p className="font-semibold">{index + 1}. {m.nome}</p><p className="text-sm text-slate-500">{m.placa} · {m.veiculo} · {m.cidadeAtual}</p><p className="mt-1 text-xs text-slate-500">Motivos: proximidade da origem, histórico na rota, taxa de aceite de {m.taxaAceite}%.</p></div><div className="text-sm"><p>{m.distancia} km até a origem</p><p>Último carregamento: {m.ultimoCarregamento}</p><p>Disponibilidade: imediata</p></div><div><StatusBadge value={m.situacao} /><ScoreIndicator score={m.score} label="Recomendação" /></div><div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => m.situacao === "Bloqueado" ? showToast("Este motorista possui restrição operacional e não pode ser reservado.") : showToast(`${m.nome} reservado para ${carga.codigo}.`)}>Reservar</Button><Button size="sm" variant="outline" onClick={() => showToast("Oferta simulada enviada.")}>Enviar oferta</Button><Button size="sm" variant="ghost">Ignorar</Button></div></CardContent></Card>)}</div>}
          {tab === "Confiabilidade" && <div className="grid gap-4 lg:grid-cols-[1fr_1fr]"><Card><CardHeader><CardTitle>Checklist de saneamento</CardTitle></CardHeader><CardContent className="space-y-2">{["Origem confirmada", carga.destino ? "Destino informado" : "Destino definido no carregamento", carga.valorFrete ? "Valor informado" : "Valor pendente", carga.veiculo ? "Perfil de veículo informado" : "Perfil de veículo pendente", carga.inconsistencias.length ? "Revisão operacional necessária" : "Sem inconsistências críticas"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-md border p-3 text-sm"><span>{item}</span><StatusBadge value={index < 2 || (!item.includes("pendente") && !item.includes("necessária")) ? "OK" : "Revisar"} /></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Decisão recomendada</CardTitle></CardHeader><CardContent className="space-y-3"><ScoreIndicator score={carga.qualidadeDados} label="Confiança para oferta" /><p className="text-sm text-slate-600">{carga.qualidadeDados >= 80 ? "Carga pronta para divulgação e sugestão automática de motoristas." : "Antes de disparar campanha, revisar campos sensíveis para evitar abordagem incorreta ao motorista."}</p><div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">No outbound, destino desconhecido pode ser regra do processo e não bloqueio. O sistema apenas registra a condição para o atendente explicar corretamente.</div></CardContent></Card></div>}
          {tab !== "Visão geral" && tab !== "Motoristas sugeridos" && tab !== "Confiabilidade" && <Card><CardContent className="p-4 text-sm text-slate-600">Registros mockados vinculados a {carga.codigo}, com origem {carga.fonte}, histórico de alterações e conversas recentes.</CardContent></Card>}
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-md border bg-slate-50 p-3"><p className="text-xs font-medium text-slate-500">{label}</p><div className="mt-1 text-sm font-medium text-slate-900">{value}</div></div>;
}

function Agenciamento({ showToast }: { showToast: (message: string) => void }) {
  const [selected, setSelected] = useState(cargas[2]);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState<Motorista[]>(motoristas.slice(2, 7));
  const runMatch = () => {
    setLoading(true);
    window.setTimeout(() => {
      setMatched([...motoristas].filter((m) => m.veiculo === selected.veiculo || m.elegivel).slice(0, 5));
      setLoading(false);
      showToast("Cinco melhores motoristas encontrados.");
    }, 1200);
  };
  return (
    <section>
      <PageHeader title="Agenciamento inteligente" subtitle="Decisão assistida: prioriza a carga, valida a informação, sugere motoristas e preserva a escolha do operador." actions={<Button onClick={runMatch}><Bot className="h-4 w-4" /> Encontrar melhores motoristas</Button>} />
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle>Fila priorizada de cargas</CardTitle></CardHeader><CardContent className="space-y-2">{cargas.slice(0, 10).map((carga) => <button key={carga.id} onClick={() => setSelected(carga)} className={`w-full rounded-md border p-3 text-left text-sm hover:bg-slate-50 ${selected.id === carga.id ? "border-primary bg-blue-50" : "bg-white"}`}><div className="flex items-center justify-between"><strong>{carga.codigo}</strong><StatusBadge value={carga.prioridade} /></div><p className="mt-1 text-slate-500">{carga.origem} → {carga.destino ?? "Destino no carregamento"}</p><p className="mt-1 text-xs text-slate-500">{carga.motoristasCompativeis} sugeridos · aberto há {2 + Number(carga.id.split("-")[1])}h · dados {carga.qualidadeDados}%</p></button>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Motoristas sugeridos para {selected.codigo}</CardTitle></CardHeader><CardContent>{loading ? <LoadingState /> : <div className="space-y-3"><div className="grid gap-3 rounded-md bg-slate-50 p-3 text-sm md:grid-cols-3"><Info label="Fonte da carga" value={selected.fonte} /><Info label="Confiança dos dados" value={`${selected.qualidadeDados}%`} /><Info label="Pendências" value={selected.inconsistencias.length ? selected.inconsistencias.join(", ") : "Sem bloqueio"} /></div>{matched.map((m, i) => <div key={m.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_150px_150px_auto] md:items-center"><div><p className="font-semibold">{m.nome}</p><p className="text-sm text-slate-500">{m.placa} · {m.veiculo} · {m.cidadeAtual}</p><p className="text-xs text-slate-500">Histórico na rota: {m.rotasFrequentes[0]} · Aceite {m.taxaAceite}%</p></div><ScoreIndicator score={94 - i * 7} label="Compatibilidade" /><div className="text-sm text-slate-600"><p>{24 + i * 31} km</p><StatusBadge value={m.situacao} /></div><Button size="sm" onClick={() => m.situacao === "Bloqueado" ? showToast("Este motorista possui restrição operacional e não pode ser reservado.") : showToast(`${m.nome} selecionado para atendimento.`)}>Selecionar</Button></div>)}<div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600"><strong>Composição do score:</strong> 30% proximidade, 20% tipo de veículo, 15% disponibilidade, 15% histórico na rota, 10% taxa de aceite e 10% relacionamento. A decisão final permanece com o usuário.</div></div>}</CardContent></Card>
      </div>
    </section>
  );
}

function Motoristas({ setSelectedMotorista, showToast }: { setSelectedMotorista: (m: Motorista) => void; showToast: (message: string) => void }) {
  const [term, setTerm] = useState("");
  const rows = motoristas.filter((m) => `${m.nome} ${m.placa} ${m.cidadeAtual}`.toLowerCase().includes(term.toLowerCase()));
  return (
    <section>
      <PageHeader title="Motoristas" subtitle="Base comercial com elegibilidade, localização e relacionamento." actions={<Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar motorista" className="w-72" />} />
      <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="dense-table w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr>{["Nome", "Telefone", "Placa", "Veículo", "Cidade atual", "Última localização", "Geo", "Último carregamento", "Dias", "Viagens", "Aceite", "Relacionamento", "Situação", "Elegibilidade", "Engajamento", "Ações"].map((h) => <th className="px-3 py-3" key={h}>{h}</th>)}</tr></thead><tbody className="divide-y bg-white">{rows.map((m) => <tr key={m.id} className="hover:bg-slate-50"><td className="px-3 py-3 font-medium">{m.nome}</td><td className="px-3 py-3">{maskPhone(m.telefone)}</td><td className="px-3 py-3">{m.placa}</td><td className="px-3 py-3">{m.veiculo}</td><td className="px-3 py-3">{m.cidadeAtual}</td><td className="px-3 py-3">{m.ultimaLocalizacao}</td><td className="px-3 py-3">{m.geoAtiva ? <Badge tone="green">Ativa</Badge> : <Badge tone="yellow">Localização estimada</Badge>}</td><td className="px-3 py-3">{m.ultimoCarregamento}</td><td className="px-3 py-3">{m.diasSemCarregar}</td><td className="px-3 py-3">{m.viagens}</td><td className="px-3 py-3">{m.taxaAceite}%</td><td className="px-3 py-3"><StatusBadge value={m.relacionamento} /></td><td className="px-3 py-3"><StatusBadge value={m.situacao} /></td><td className="px-3 py-3">{m.elegivel ? <Badge tone="green">Elegível</Badge> : <Badge tone="red">Inelegível</Badge>}</td><td className="px-3 py-3"><ScoreIndicator score={m.scoreEngajamento} label="Eng." /></td><td className="px-3 py-3"><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => setSelectedMotorista(m)}>Abrir</Button><Button size="sm" onClick={() => m.situacao === "Bloqueado" ? showToast("Este motorista possui restrição operacional e não pode ser reservado.") : showToast(`${m.nome} reservado.`)}>Reservar</Button></div></td></tr>)}</tbody></table></div></Card>
    </section>
  );
}

function MotoristaDrawer({ motorista, onClose, showToast }: { motorista: Motorista; onClose: () => void; showToast: (message: string) => void }) {
  return <div className="fixed inset-0 z-50 bg-slate-950/40"><aside className="ml-auto h-full w-full max-w-2xl overflow-y-auto bg-white shadow-xl"><div className="sticky top-0 flex items-center justify-between border-b bg-white p-4"><div><h3 className="text-lg font-semibold">{motorista.nome}</h3><p className="text-sm text-slate-500">{motorista.placa} · {motorista.veiculo}</p></div><Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button></div><div className="space-y-4 p-4"><div className="grid gap-3 sm:grid-cols-2"><Info label="Cidade atual" value={motorista.cidadeAtual} /><Info label="Última localização" value={`${motorista.ultimaLocalizacao} · confiança ${motorista.confiancaLocalizacao}%`} /><Info label="Situação cadastral" value={<StatusBadge value={motorista.situacao} />} /><Info label="Elegibilidade" value={motorista.elegivel ? "Elegível para reserva" : "Inelegível"} /></div><Card><CardHeader><CardTitle>Rotas frequentes</CardTitle></CardHeader><CardContent className="space-y-2">{motorista.rotasFrequentes.map((rota) => <div key={rota} className="rounded-md bg-slate-50 p-2 text-sm">{rota}</div>)}</CardContent></Card><Card><CardHeader><CardTitle>Cargas disponíveis próximas</CardTitle></CardHeader><CardContent className="space-y-2">{cargas.slice(0, 4).map((c) => <div key={c.id} className="flex items-center justify-between rounded-md border p-2 text-sm"><span>{c.codigo} · {c.origem}</span><Button size="sm" onClick={() => motorista.situacao === "Bloqueado" ? showToast("Este motorista possui restrição operacional e não pode ser reservado.") : showToast(`Oferta enviada para ${motorista.nome}.`)}>Ofertar</Button></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Restrições e atendimentos</CardTitle></CardHeader><CardContent className="text-sm text-slate-600">{motorista.restricoes.length ? motorista.restricoes.join(", ") : "Sem restrições ativas. Histórico de ofertas e conversas disponível para consulta."}</CardContent></Card></div></aside></div>;
}

function FretesRetorno({ showToast }: { showToast: (message: string) => void }) {
  const [modal, setModal] = useState<OportunidadeRetorno | null>(null);
  return (
    <section>
      <PageHeader title="Fretes de retorno e multitrecho" subtitle="Antecipação D-1 para abordar o motorista antes que ele volte vazio." />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <MetricCard title="Motoristas em destino provável" value="123" detail="Base multitrecho simulada" icon={Truck} />
        <MetricCard title="Qualificados para retorno" value="27" detail="Com carga próxima compatível" icon={ClipboardCheck} tone="text-emerald-700" />
        <MetricCard title="Ativação atual" value="1 carga" detail="Gargalo evidenciado no levantamento" icon={AlertTriangle} tone="text-amber-600" />
      </div>
      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">A localização apresentada é estimada e pode estar desatualizada. O operador deve confirmar disponibilidade, destino real e janela antes de reservar.</div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {oportunidadesRetorno.map((o) => {
          const m = motoristas.find((mot) => mot.id === o.motoristaId)!;
          return <Card key={o.id}><CardContent className="space-y-3 p-4"><div className="flex items-start justify-between"><div><p className="font-semibold">{m.nome}</p><p className="text-sm text-slate-500">{o.viagemAtual}</p></div><StatusBadge value={o.status} /></div><Info label="Chegada prevista" value={o.chegada} /><p className="text-sm">Próxima carga sugerida: <strong>{o.cargaRetorno}</strong> · {o.distanciaProximaOrigem} km até a origem</p><div className="grid grid-cols-2 gap-2 text-sm"><span>{brl.format(o.valorEstimado)}</span><span>Margem {brl.format(o.margemEstimada)}</span></div><ScoreIndicator score={o.score} label="Score multitrecho" /><ScoreIndicator score={o.confiancaLocalizacao} label="Confiança localização" /><Button onClick={() => setModal(o)}>Preparar oferta de retorno</Button></CardContent></Card>;
        })}
      </div>
      {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><Card className="w-full max-w-lg"><CardHeader><CardTitle>Oferta de retorno {modal.cargaRetorno}</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm">Mensagem sugerida: Olá, temos uma carga de retorno próxima ao seu destino atual. Deseja conferir os detalhes antes de voltar vazio?</p><Info label="Melhor horário" value="30 minutos após previsão de chegada" /><Info label="Canal" value="WhatsApp simulado" /><Info label="Confiança da localização" value={`${modal.confiancaLocalizacao}%`} /><div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600"><Mail className="mb-2 h-4 w-4" /> A mensagem deve ser personalizada com nome, dias sem carregar, destino provável e carga próxima.</div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={() => { setModal(null); showToast("Oferta de retorno preparada."); }}>Confirmar simulação</Button></div></CardContent></Card></div>}
    </section>
  );
}

function Campanhas({ showToast }: { showToast: (message: string) => void }) {
  const [step, setStep] = useState(1);
  return <section><PageHeader title="Campanhas" subtitle="Criação e acompanhamento de comunicações simuladas." actions={<Button onClick={() => setStep(1)}><Send className="h-4 w-4" /> Nova campanha</Button>} /><div className="grid gap-4 xl:grid-cols-[1fr_420px]"><Card className="overflow-hidden"><div className="overflow-x-auto"><table className="dense-table w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr>{["Nome", "Tipo", "Público", "Destinatários", "Status", "Data", "Leitura", "Interesse", "Conversão"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody className="divide-y bg-white">{campanhas.map((c) => <tr key={c.id}><td className="px-3 py-3 font-medium">{c.nome}</td><td className="px-3 py-3">{c.tipo}</td><td className="px-3 py-3">{c.publico}</td><td className="px-3 py-3">{c.destinatarios}</td><td className="px-3 py-3"><StatusBadge value={c.status} /></td><td className="px-3 py-3">{c.data}</td><td className="px-3 py-3">{c.leitura}%</td><td className="px-3 py-3">{c.interesse}%</td><td className="px-3 py-3">{c.conversao}%</td></tr>)}</tbody></table></div></Card><Card><CardHeader><CardTitle>Fluxo de nova campanha</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2">{["Objetivo", "Público", "Cargas", "Mensagem", "Revisar", "Enviar"].map((s, i) => <Badge key={s} tone={step === i + 1 ? "blue" : "gray"}>{i + 1}. {s}</Badge>)}</div><div className="grid gap-2 sm:grid-cols-2">{["Cidade", "Tipo de veículo", "Dias sem carregar", "Histórico de rotas", "Status", "Geolocalização ativa", "Elegibilidade"].map((f) => <SelectNative key={f}><option>{f}: todos</option></SelectNative>)}</div><div className="rounded-lg bg-[#e7ffe8] p-4 text-sm shadow-inner"><p>Olá, Carlos. Você está há 47 dias sem carregar conosco. Temos novas oportunidades próximas à sua região. Deseja conferir?</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline">Quero carregar</Button><Button size="sm" variant="outline">Ver detalhes</Button><Button size="sm" variant="outline">Não tenho interesse</Button><Button size="sm" variant="outline">Falar com atendente</Button></div></div><div className="flex justify-between"><Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))}>Voltar</Button><Button onClick={() => step === 6 ? showToast("Envio de campanha simulado.") : setStep(step + 1)}>{step === 6 ? "Simular envio" : "Avançar"}</Button></div></CardContent></Card></div></section>;
}

function Atendimentos({ selected, setSelected, showToast }: { selected: Atendimento; setSelected: (a: Atendimento) => void; showToast: (message: string) => void }) {
  const motorista = motoristas.find((m) => m.id === selected.motoristaId)!;
  const carga = cargas.find((c) => c.id === selected.cargaId)!;
  return <section><PageHeader title="Atendimentos" subtitle="CRM operacional com conversas, contexto e respostas rápidas." /><div className="grid h-[calc(100vh-150px)] min-h-[620px] gap-4 xl:grid-cols-[300px_1fr_330px]"><Card className="overflow-y-auto"><CardHeader><CardTitle>Conversas</CardTitle></CardHeader><CardContent className="space-y-2">{atendimentos.map((a) => { const m = motoristas.find((x) => x.id === a.motoristaId)!; return <button key={a.id} onClick={() => setSelected(a)} className={`w-full rounded-md border p-3 text-left text-sm ${selected.id === a.id ? "border-primary bg-blue-50" : "bg-white"}`}><div className="flex justify-between"><strong>{m.nome}</strong><StatusBadge value={a.status} /></div><p className="mt-1 text-xs text-slate-500">{a.canal} · {a.atualizadoEm}</p></button>; })}</CardContent></Card><Card className="flex flex-col"><CardHeader><CardTitle>Conversa com {motorista.nome}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col"><div className="flex-1 space-y-3 overflow-y-auto">{selected.mensagens.map((msg, i) => <div key={i} className={`max-w-[78%] rounded-lg p-3 text-sm ${msg.autor === "Operador" ? "ml-auto bg-primary text-white" : "bg-slate-100"}`}><p>{msg.texto}</p><span className="mt-1 block text-xs opacity-70">{msg.hora}</span></div>)}</div><div className="mt-4 flex flex-wrap gap-2">{["Enviar detalhes da carga", "Confirmar disponibilidade", "Solicitar documentos", "Encaminhar para operação", "Registrar recusa", "Reservar motorista"].map((reply) => <Button key={reply} size="sm" variant="outline" onClick={() => showToast(`${reply}: ação simulada.`)}>{reply}</Button>)}</div></CardContent></Card><Card><CardHeader><CardTitle>Contexto</CardTitle></CardHeader><CardContent className="space-y-3"><Info label="Motorista" value={`${motorista.nome} · ${motorista.placa}`} /><Info label="Carga" value={`${carga.codigo} · ${carga.origem} → ${carga.destino ?? "Destino no carregamento"}`} /><Info label="Responsável" value={selected.responsavel} /><Info label="Situação cadastral" value={<StatusBadge value={motorista.situacao} />} /><Button className="w-full" onClick={() => showToast("Atendimento encaminhado para operações.")}><PhoneCall className="h-4 w-4" /> Encaminhar</Button></CardContent></Card></div></section>;
}

function Inteligencia() {
  return <section><PageHeader title="Inteligência operacional" subtitle="Indicadores executivos, funil e comparação de canais." /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Cargas recebidas", "323"], ["Cargas publicadas", "278"], ["Cargas confirmadas", "164"], ["Cargas expiradas", "22"], ["Tempo médio", "4h12"], ["Motoristas impactados", "1.260"], ["Interessados", "438"], ["Qualificados", "291"], ["Reservados", "164"], ["Recuperados", "54"], ["Margem estimada", "R$ 148 mil"], ["Qualidade dos dados", "86%"]].map(([t, v]) => <MetricCard key={t} title={t} value={v} detail="Últimos 7 dias" icon={Gauge} />)}</div><div className="mt-5 grid gap-4 xl:grid-cols-2"><ChartCard title="Funil comercial"><ResponsiveContainer width="100%" height={320}><FunnelChart><Tooltip /><Funnel dataKey="total" data={chartSeries.funil} fill="#17345f" label /></FunnelChart></ResponsiveContainer></ChartCard><ChartCard title="Comparação por canal"><ResponsiveContainer width="100%" height={320}><BarChart data={[{ canal: "Plataforma de fretes", total: 86 }, { canal: "Campanha", total: 74 }, { canal: "Prospecção ativa", total: 51 }, { canal: "Portal", total: 45 }, { canal: "Frete de retorno", total: 38 }]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="canal" /><YAxis /><Tooltip /><Bar dataKey="total" fill="#0f8f6f" /></BarChart></ResponsiveContainer></ChartCard></div></section>;
}

function Integracoes({ showToast }: { showToast: (message: string) => void }) {
  return <section><PageHeader title="Integrações" subtitle="Cards visuais sem conexão real com sistemas externos." /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{["WhatsApp", "Teams", "E-mail", "Drive", "Plataforma de fretes", "Sistema de gestão de cargas", "CRM", "Data lake"].map((name, i) => <Card key={name}><CardContent className="space-y-3 p-4"><div className="flex items-center justify-between"><strong>{name}</strong><StatusBadge value={i % 3 === 0 ? "Atenção" : "Operacional"} /></div><Info label="Última sincronização" value={`2026-08-06 ${9 + i}:15`} /><Info label="Registros processados" value={String(120 + i * 37)} /><Info label="Erros" value={String(i % 3)} /><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => showToast(`${name}: configuração simulada.`)}>Configurar</Button><Button size="sm" onClick={() => showToast(`${name}: sincronização simulada.`)}>Sincronizar agora</Button><Button size="sm" variant="ghost" onClick={() => showToast(`${name}: logs simulados abertos.`)}>Ver logs</Button></div></CardContent></Card>)}</div></section>;
}

function Configuracoes() {
  return <section><PageHeader title="Configurações" subtitle="Parâmetros visuais para o protótipo operacional." /><div className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle>Regras de agenciamento</CardTitle></CardHeader><CardContent className="space-y-3">{["Bloquear reserva de motorista com restrição operacional", "Exibir destino definido no carregamento para outbound", "Sinalizar localização estimada quando confiança for menor que 60%", "Priorizar cargas críticas na fila"].map((rule) => <label key={rule} className="flex items-center gap-3 rounded-md border p-3 text-sm"><input type="checkbox" defaultChecked className="h-4 w-4" />{rule}</label>)}</CardContent></Card><Card><CardHeader><CardTitle>Alertas</CardTitle></CardHeader><CardContent className="space-y-3"><Info label="Notificações ativas" value="Prazo, inconsistência, bloqueio cadastral e frete de retorno" /><Info label="Perfil" value="Inside sales e agenciamento" /><Button variant="outline"><ShieldAlert className="h-4 w-4" /> Testar alerta simulado</Button></CardContent></Card></div></section>;
}
