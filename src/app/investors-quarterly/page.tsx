"use client";

import { loadYears } from "@/data/load";
import DemandGeneratedChart from "@/components/charts/DemandGeneratedChart";
import ProjectInfluenceDemandChart from "@/components/charts/ProjectInfluenceDemandChart";
import PanelInfluenceDemandChart from "@/components/charts/PanelInfluenceDemandChart";
import EwpInfluenceDemandChart from "@/components/charts/EwpInfluenceDemandChart";
import TotalWoodDemandChart from "@/components/charts/TotalWoodDemandChart";
import DemandRealizedChart from "@/components/charts/DemandRealizedChart";
import ProfessionalEducationChart from "@/components/charts/ProfessionalEducationChart";
import OnDemandUniversityEducationChart from "@/components/charts/OnDemandUniversityEducationChart";
import ConurturedProjectFunnelChart from "@/components/charts/ConurturedProjectFunnelChart";
import ConvertedProjectsChart from "@/components/charts/ConvertedProjectsChart";
import ConvertedProjectsStripsChart from "@/components/charts/ConvertedProjectsStripsChart";
import CarbonImpactTable from "@/components/charts/CarbonImpactTable";
import ImpactPyramidCard from "@/components/charts/ImpactPyramidCard";
import CardCallout from "@/components/CardCallout";
import { latestQuarter } from "@/data/airtable";

export default function InvestorsQuarterlyPage() {
  const allData = loadYears();
  if (!allData || allData.length === 0) {
    return <div className="p-6 text-red-700">Error: No data loaded</div>;
  }
  const latest = latestQuarter();

  return (
    <>
      <header className="ar-hero-executive">
        <div className="ar-hero-executive__inner mx-auto max-w-6xl">
          <div className="ar-hero-executive__copy">
            <h1 className="ar-hero-executive__title">
              <span className="ar-hero-executive__line ar-hero-executive__line--white">
                Executive
              </span>
              <span className="ar-hero-executive__line ar-hero-executive__line--green">
                Dashboard
              </span>
            </h1>
            <p className="ar-hero-executive__quarter">
              Program Impact Report for Q{latest.quarter} {latest.year}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/slb_logo_rev.png"
            alt="Softwood Lumber Board"
            className="ar-hero-executive__logo"
          />
        </div>
      </header>

      <section className="ar-section-cream px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-8">
            <div className="ar-chart-panel">
              <DemandGeneratedChart />
              <CardCallout>
                With a quarter to go, 2026 demand (1,554 MM BF) has already surpassed all of 2025 (1,452 MM BF).
              </CardCallout>
            </div>
            <div className="ar-chart-panel">
              <ImpactPyramidCard />
            </div>
            <div className="ar-chart-panel">
              <ProjectInfluenceDemandChart />
              <CardCallout>Best third quarter on record: 253 MM BF, 22% above the previous best Q3.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <PanelInfluenceDemandChart />
              <CardCallout>None at this time.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <EwpInfluenceDemandChart />
              <CardCallout>None at this time.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <TotalWoodDemandChart />
              <CardCallout>None at this time.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <ProfessionalEducationChart />
              <CardCallout>None at this time.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <OnDemandUniversityEducationChart />
              <CardCallout>Faculty engagements have already reached 123% of the 2026 goal (1,217 vs. 993).</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <ConurturedProjectFunnelChart />
              <CardCallout>Leads grew 14% this quarter, more than double last year’s pace.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <ConvertedProjectsChart />
              <CardCallout>321 projects converted YTD. Five straight quarters of 100+.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <ConvertedProjectsStripsChart />
              <CardCallout>Mass timber reached a record 32% of converted projects, the highest share since tracking began in 2015.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <DemandRealizedChart />
              <CardCallout>None at this time.</CardCallout>
            </div>
            <div className="ar-chart-panel">
              <CarbonImpactTable />
              <CardCallout>Best third quarter on record for carbon benefit (1.47 MM t CO₂).</CardCallout>
            </div>
          </div>
        </div>
      </section>

      <footer className="ar-footer px-6 py-8 text-center text-xs">
        Figures reflect SLB program impact analysis. For questions, contact the
        Softwood Lumber Board.
      </footer>
    </>
  );
}
