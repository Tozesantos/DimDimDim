const CATEGORY_COLORS = {
  'Alimentação': 'bg-green-50 border-green-200 text-green-700',
  'Transporte': 'bg-blue-50 border-blue-200 text-blue-700',
  'Habitação': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  'Saúde': 'bg-red-50 border-red-200 text-red-700',
  'Lazer': 'bg-purple-50 border-purple-200 text-purple-700',
  'Educação': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  'Vestuário': 'bg-pink-50 border-pink-200 text-pink-700',
  'Outros': 'bg-gray-50 border-gray-200 text-gray-600',
}

export default function SummaryCards({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-blue-500 text-white rounded-xl shadow p-5">
        <p className="text-blue-100 text-sm">Total do Mês</p>
        <p className="text-3xl font-bold mt-1">{total.toFixed(2)} €</p>
        <p className="text-blue-100 text-xs mt-2">{expenses.length} despesa{expenses.length !== 1 ? 's' : ''}</p>
      </div>

      {sorted.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm font-semibold text-gray-500 mb-3">Por Categoria</p>
          <div className="flex flex-col gap-2">
            {sorted.map(([cat, val]) => (
              <div key={cat} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${CATEGORY_COLORS[cat] || CATEGORY_COLORS['Outros']}`}>
                <span className="text-sm font-medium">{cat}</span>
                <span className="text-sm font-semibold">{val.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
