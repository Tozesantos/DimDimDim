const CATEGORY_COLORS = {
  'Alimentação': 'bg-green-100 text-green-700',
  'Transporte': 'bg-blue-100 text-blue-700',
  'Habitação': 'bg-yellow-100 text-yellow-700',
  'Saúde': 'bg-red-100 text-red-700',
  'Lazer': 'bg-purple-100 text-purple-700',
  'Educação': 'bg-indigo-100 text-indigo-700',
  'Vestuário': 'bg-pink-100 text-pink-700',
  'Outros': 'bg-gray-100 text-gray-600',
}

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400 text-sm">
        Sem despesas neste mês. Adiciona a tua primeira despesa!
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-left">
            <th className="px-4 py-3 font-medium">Descrição</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3 font-medium text-right">Valor</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-gray-700">{expense.description}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Outros']}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(expense.date + 'T00:00:00').toLocaleDateString('pt-PT')}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-800">
                {expense.amount.toFixed(2)} €
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                  title="Apagar"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
