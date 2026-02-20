interface Props {

  activeTab: string

}

export default function MarketHeader({ activeTab }: Props) {

  return (

    <header className="mb-12">

      <h2 className="text-4xl font-extrabold">

        {activeTab === 'market'

          ? 'Global Marketplace'

          : 'Your Carbon Inventory'}

      </h2>

      <p className="text-slate-500">

        {activeTab === 'market'

          ? 'Invest in verified environmental projects worldwide.'

          : 'Manage your purchased credits.'}

      </p>

    </header>

  )

}
