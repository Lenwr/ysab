type DashboardStatsProps = {
    totalProducts: number;
    availableProducts: number;
    featuredProducts: number;
  };
  
  export default function DashboardStats({
    totalProducts,
    availableProducts,
    featuredProducts,
  }: DashboardStatsProps) {
    const cards = [
      {
        label: "Total produits",
        value: totalProducts,
      },
      {
        label: "Produits disponibles",
        value: availableProducts,
      },
      {
        label: "Produits vedettes",
        value: featuredProducts,
      },
    ];
  
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    );
  }