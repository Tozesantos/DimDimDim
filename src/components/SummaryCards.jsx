import { USERS, USER_COLORS, CATEGORY_COLORS_BORDER } from '../lib/constants'

export default function SummaryCards({ expenses, isCasal = false }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  const byUser = USERS.reduce((acc, u) => {
    acc[u] = expenses.filter((e) => e.user_name === u).reduce((s, e) => s + e.amount, 0)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-3">
      {/* Total card */}
      <div className="bg-brand-navy text-white rounded-xl shadow p-5">
        <p className="text-brand-stone text-xs font-medium uppercase tracking-wide">
          {isCasal ? 'Total Combinado' : 'Total do Mês'}
        </p>
        <p className="text-3xl font-bold mt-1">{total.toFixed(2)} €</p>
        <p className="text-brand-stone text-xs mt-2">
          {expenses.length} despesa{expenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isCasal && (
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs font-semibold text-brand-stone uppercase tracking-wide mb-3">Por Utilizador</p>
          <div className="flex flex-col gap-2">
            {USERS.map((u) => (
              <div key={u} className={`flex justify-between items-center px-3 py-2 rounded-lg ${USER_COLORS[u]}`}>
                <span className="text-sm font-semibold capitalize">{u}</span>
                <span className="text-sm font-semibold">{byUser[u].toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs font-semibold text-brand-stone uppercase tracking-wide mb-3">Por Categoria</p>
          <div className="flex flex-col gap-2">
            {sortedCategories.map(([cat, val]) => (
              <div key={cat} className={`flex justify-between items-center px-3 py-2 rounded-lg border ${CATEGORY_COLORS_BORDER[cat] || CATEGORY_COLORS_BORDER['Outros']}`}>
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
