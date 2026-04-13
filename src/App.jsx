import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import SummaryCards from './components/SummaryCards'
import MonthPicker from './components/MonthPicker'

const today = new Date()
const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [month, setMonth] = useState(defaultMonth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExpenses()
  }, [month])

  async function fetchExpenses() {
    setLoading(true)
    setError(null)
    const [year, m] = month.split('-')
    const from = `${year}-${m}-01`
    const to = `${year}-${m}-31`

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false })

    if (error) {
      setError('Erro ao carregar despesas. Verifica as variáveis de ambiente do Supabase.')
    } else {
      setExpenses(data || [])
    }
    setLoading(false)
  }

  async function handleAdd(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single()

    if (!error && data) {
      setExpenses((prev) => [data, ...prev])
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Finanças Pessoais</h1>
          <MonthPicker value={month} onChange={setMonth} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <ExpenseForm onAdd={handleAdd} />
          <SummaryCards expenses={expenses} />
        </div>

        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400 text-sm">
              A carregar...
            </div>
          ) : (
            <ExpenseList expenses={expenses} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  )
}
