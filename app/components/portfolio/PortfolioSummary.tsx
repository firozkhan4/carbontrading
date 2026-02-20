import { TrendingUp, ShieldCheck } from 'lucide-react'

export default function PortfolioSummary() {

  return (

    <div className="grid md:grid-cols-2 gap-8">

      <div className="bg-white p-8 rounded-3xl">

        <TrendingUp />

        <h3>Available Credits</h3>

        <p>45.20 tCO2e</p>

      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl">

        <ShieldCheck />

        <h3>Total Offset</h3>

        <p>120 tCO2e</p>

      </div>

    </div>

  )

}
