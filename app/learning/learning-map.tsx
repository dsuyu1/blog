"use client";

import { useEffect, useRef } from "react";

/* Learning-map data. Edit an item's `status` to "done", "learning", or
   "planned", or add/remove nodes, to update progress. */
const data = {
  name: "Multi-Cloud & Hybrid Architecture",
  status: "root",
  children: [
    {
      name: "Cloud Platforms",
      status: "category",
      children: [
        { name: "AWS (Solutions Architect Associate)", status: "done" },
        { name: "AWS Security Specialty", status: "learning" },
        { name: "Azure (AZ-104 / SC-100)", status: "planned" },
        { name: "GCP (Associate Cloud Engineer)", status: "planned" },
      ],
    },
    {
      name: "Networking & Connectivity",
      status: "category",
      children: [
        { name: "BGP", status: "learning" },
        { name: "OSPF", status: "planned" },
        { name: "VPN / IPSec site-to-site", status: "planned" },
        { name: "Direct Connect / ExpressRoute / Interconnect", status: "learning" },
        { name: "Transit Gateway / Virtual WAN / NCC", status: "planned" },
        { name: "SD-WAN (Viptela, VeloCloud, Fortinet, Prisma)", status: "planned" },
        { name: "SASE (Zscaler, Netskope, Cloudflare)", status: "planned" },
      ],
    },
    {
      name: "Containers & Orchestration",
      status: "category",
      children: [
        { name: "Docker", status: "learning" },
        { name: "Kubernetes", status: "learning" },
        { name: "EKS / AKS / GKE", status: "planned" },
        { name: "OpenShift / Anthos / Azure Arc / Rancher", status: "planned" },
        { name: "Service Mesh (Istio, Linkerd, Consul)", status: "planned" },
      ],
    },
    {
      name: "Infrastructure as Code",
      status: "category",
      children: [
        { name: "Terraform", status: "learning" },
        { name: "Pulumi", status: "planned" },
        { name: "CloudFormation / ARM / Deployment Manager", status: "planned" },
      ],
    },
    {
      name: "Data Layer",
      status: "category",
      children: [
        { name: "Cassandra (DataStax)", status: "learning" },
        { name: "Kafka (Confluent)", status: "learning" },
      ],
    },
    {
      name: "Identity & Secrets",
      status: "category",
      children: [
        { name: "Azure AD / Entra ID", status: "learning" },
        { name: "Okta / Ping Identity", status: "planned" },
        { name: "HashiCorp Vault", status: "planned" },
        { name: "CyberArk (PAM)", status: "planned" },
      ],
    },
    {
      name: "Security & Perimeter",
      status: "category",
      children: [
        { name: "Palo Alto Networks", status: "learning" },
        { name: "Fortinet", status: "planned" },
        { name: "Cisco", status: "planned" },
        { name: "CNAPP (Wiz, Prisma Cloud, Orca, Aqua)", status: "planned" },
      ],
    },
    {
      name: "Observability",
      status: "category",
      children: [
        { name: "Splunk", status: "learning" },
        { name: "Prometheus / Grafana", status: "planned" },
        { name: "OpenTelemetry", status: "planned" },
        { name: "ELK / OpenSearch", status: "learning" },
      ],
    },
    {
      name: "CI/CD & GitOps",
      status: "category",
      children: [
        { name: "Jenkins / GitHub Actions / GitLab CI", status: "planned" },
        { name: "ArgoCD / Flux", status: "planned" },
      ],
    },
    {
      name: "Policy & Governance",
      status: "category",
      children: [
        { name: "OPA / Kyverno", status: "planned" },
        { name: "AWS Config / Azure Policy / GCP Org Policy", status: "planned" },
        { name: "HashiCorp Sentinel", status: "planned" },
      ],
    },
  ],
};

const STATUS = [
  { key: "done", label: "Done", color: "#10b981" },
  { key: "learning", label: "Learning now", color: "#f59e0b" },
  { key: "planned", label: "Planned", color: "#71717a" },
];

/* Node fill by status. Root/category resolve to CSS variables so they follow
   the light/dark theme; status colors are fixed mid-tones legible on both. */
function colorFor(status: string): string {
  const map: Record<string, string> = {
    root: "var(--map-text)",
    category: "#3b82f6",
    done: "#10b981",
    learning: "#f59e0b",
    planned: "#71717a",
  };
  return map[status] || "#71717a";
}

/* Load D3 once from CDN (kept out of the bundle — no npm dependency). */
let d3Promise: Promise<any> | null = null;
function loadD3(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const w = window as any;
  if (w.d3) return Promise.resolve(w.d3);
  if (!d3Promise) {
    d3Promise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>("script[data-d3]");
      if (existing) {
        existing.addEventListener("load", () => resolve(w.d3));
        existing.addEventListener("error", reject);
        return;
      }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js";
      s.async = true;
      s.dataset.d3 = "true";
      s.onload = () => resolve(w.d3);
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  return d3Promise;
}

function buildMap(d3: any, container: HTMLElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g").attr("transform", `translate(140,${height / 2})`);

  svg.call(
    d3.zoom().scaleExtent([0.3, 2]).on("zoom", (event: any) => {
      g.attr("transform", event.transform);
    }),
  );

  const root = d3.hierarchy(data);
  root.x0 = height / 2;
  root.y0 = 0;

  // Start collapsed one level down so only the category branches show.
  root.children.forEach(collapse);

  function collapse(d: any) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  const treeLayout = d3.tree().nodeSize([28, 240]);
  let i = 0;

  function update(source: any) {
    const treeData = treeLayout(root);
    const nodes = treeData.descendants();
    const links = treeData.links();

    nodes.forEach((d: any) => {
      d.y = d.depth * 240;
    });

    const node = g.selectAll("g.node").data(nodes, (d: any) => d.id || (d.id = ++i));

    const nodeEnter = node
      .enter()
      .append("g")
      .attr(
        "class",
        (d: any) =>
          "node" + (d.depth === 0 ? " root" : d.depth === 1 ? " category" : ""),
      )
      .attr("transform", () => `translate(${source.y0},${source.x0})`)
      .on("click", (_event: any, d: any) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      });

    nodeEnter
      .append("circle")
      .attr("r", 1e-6)
      .style("fill", (d: any) => colorFor(d.data.status))
      .style("stroke", "var(--map-bg)");

    nodeEnter
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d: any) => (d.children || d._children ? -12 : 12))
      .attr("text-anchor", (d: any) => (d.children || d._children ? "end" : "start"))
      .text((d: any) => d.data.name);

    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate
      .transition()
      .duration(300)
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);
    nodeUpdate
      .select("circle")
      .attr("r", (d: any) => (d.depth === 0 ? 7 : d.depth === 1 ? 6 : 5))
      .style("fill", (d: any) => colorFor(d.data.status));

    const nodeExit = node
      .exit()
      .transition()
      .duration(300)
      .attr("transform", () => `translate(${source.y},${source.x})`)
      .remove();
    nodeExit.select("circle").attr("r", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);

    const link = g.selectAll("path.link").data(links, (d: any) => d.target.id);

    const linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", () => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    linkEnter
      .merge(link)
      .transition()
      .duration(300)
      .attr("d", (d: any) => diagonal(d.source, d.target));

    link
      .exit()
      .transition()
      .duration(300)
      .attr("d", () => {
        const o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function diagonal(s: any, d: any) {
    return `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
  }

  update(root);
}

const mapCss = `
.learning-map { --map-bg: #ffffff; --map-text: #18181b; --map-link: #e4e4e7; }
.dark .learning-map { --map-bg: #09090b; --map-text: #e4e4e7; --map-link: #27272a; }
.learning-map .node circle { stroke-width: 2px; cursor: pointer; }
.learning-map .node text {
  font-size: 12px;
  fill: var(--map-text);
  paint-order: stroke;
  stroke: var(--map-bg);
  stroke-width: 3px;
}
.learning-map .node.root text, .learning-map .node.category text {
  font-size: 13px;
  font-weight: 600;
}
.learning-map .link { fill: none; stroke: var(--map-link); stroke-width: 1.5px; }
`;

export default function LearningMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const container = ref.current;
    loadD3()
      .then((d3) => {
        if (cancelled || !d3 || !container) return;
        container.innerHTML = "";
        buildMap(d3, container);
      })
      .catch(() => {
        /* CDN unavailable — the page still renders without the map. */
      });
    return () => {
      cancelled = true;
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className="learning-map space-y-6">
      <style>{mapCss}</style>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Multi-Cloud &amp; Hybrid Cloud Architecture</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          What I&apos;m learning, tool by tool — click a branch to expand.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        {STATUS.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div
          ref={ref}
          className="w-full cursor-grab active:cursor-grabbing"
          style={{ height: "calc(100vh - 16rem)", minHeight: 520, background: "var(--map-bg)" }}
        />
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Drag to pan, scroll to zoom, click any node to expand or collapse.
      </p>
    </div>
  );
}
