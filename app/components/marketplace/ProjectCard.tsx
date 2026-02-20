'use client'

import { Project } from '../../types/project'
import { TrendingUp } from 'lucide-react'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {

  return (

    <div
      className="
      group
      bg-white
      border border-zinc-200
      rounded-2xl
      p-6
      transition-all duration-300
      hover:shadow-xl
      hover:border-emerald-300
      hover:-translate-y-0.5
      "
    >

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* LEFT — Project Info */}
        <div className="space-y-1">

          <h4 className="text-lg font-bold text-zinc-900">

            {project.name}

          </h4>

          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">

            {project.type} Project

          </p>

        </div>


        {/* CENTER — Metrics */}
        <div className="flex flex-wrap gap-10">

          {/* Price */}
          <div>

            <p className="text-[11px] uppercase font-bold tracking-wide text-zinc-400">

              Price

            </p>

            <p className="text-xl font-extrabold text-zinc-900">

              ${project.price}

              <span className="ml-1 text-xs font-medium text-zinc-500">

                USDC

              </span>

            </p>

          </div>


          {/* Supply */}
          <div>

            <p className="text-[11px] uppercase font-bold tracking-wide text-zinc-400">

              Available

            </p>

            <p className="text-xl font-extrabold text-zinc-900">

              {project.supply}

              <span className="ml-1 text-xs font-medium text-zinc-500">

                tCO₂e

              </span>

            </p>

          </div>

        </div>


        {/* RIGHT — CTA */}
        <div className="flex items-center gap-4">

          {/* Verified Badge */}
          <div
            className="
            hidden sm:flex
            items-center gap-2
            bg-emerald-50
            text-emerald-700
            px-3 py-1.5
            rounded-lg
            text-sm
            font-semibold
            "
          >

            <TrendingUp size={16} />

            Verified

          </div>

          {/* Buy Button */}
          <button
            aria-label="Buy Carbon Credits"
            className="
            bg-zinc-900
            hover:bg-emerald-600
            text-white
            px-6 py-3
            rounded-xl
            font-bold
            transition-all duration-200
            active:scale-[0.97]
            group-hover:shadow-md
            "
          >

            Buy Credits

          </button>

        </div>

      </div>

    </div>

  )

}
