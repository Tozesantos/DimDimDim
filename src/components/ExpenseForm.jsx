import { useState } from 'react'

const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Habitação',
  'Saúde',
  'Lazer',
  'Educação',
  'Vestuário',
  'Outros',
]

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Outros',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    setLoading(true)
    await onAdd({ ...form, amount: parseFloat(form.amount) })
    setForm({
      description: '',
      amount: '',
      category: 'Outros',
      date: new Date().toISOString().split('T')[0],
    })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-700">Nova Despesa</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">Descrição</label>
        <input
          type="text"
          placeholder="Ex: Supermercado"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Valor (€)</label>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Data</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">Categoria</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
      >
        {loading ? 'A guardar...' : '+ Adicionar Despesa'}
      </button>
    </form>
  )
}
