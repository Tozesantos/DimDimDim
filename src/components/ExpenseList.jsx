import { CATEGORY_COLORS, USER_COLORS } from '../lib/constants'

export default function ExpenseList({ expenses, onDelete, isCasal }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-brand-stone text-sm">
        Sem despesas neste mês.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-brand-sand text-brand-navy text-left">
              {isCasal && <th className="px-4 py-3 font-semibold">Quem</th>}
              <th className="px-4 py-3 font-semibold">Descrição</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Data</th>
              <th className="px-4 py-3 font-semibold text-right">Valor</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t border-brand-sand hover:bg-brand-sand/50 transition">
                {isCasal && (
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${USER_COLORS[expense.user_name] || 'bg-brand-sand text-brand-navy'}`}>
                      {expense.user_name}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-brand-dark">
                  <span className="flex items-center gap-2">
                    {expense.description}
                    {expense.is_casal && (
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-brand-rust shrink-0"
                        title="Despesa de Casal"
                      />
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Outros']}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-stone">
                  {new Date(expense.date + 'T00:00:00').toLocaleDateString('pt-PT')}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-brand-navy">
                  {expense.amount.toFixed(2)} €
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-brand-stone/50 hover:text-brand-rust transition text-lg leading-none"
                    aria-label="Apagar despesa"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
