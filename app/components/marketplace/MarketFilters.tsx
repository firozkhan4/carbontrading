import { Search, Filter } from 'lucide-react'

export default function MarketFilters() {

  return (

    <section className="flex gap-4 mb-10">

      <div className="relative flex-1">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />

        <input

          placeholder="Search..."

          className="w-full pl-12 py-3 border rounded-xl"

        />

      </div>

      <button
        className="flex gap-2 border px-6 py-3 rounded-xl"
      >

        <Filter />

        Filters

      </button>

    </section>

  )

}
