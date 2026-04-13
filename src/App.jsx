import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { USERS, USER_COLORS } from './lib/constants'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import SummaryCards from './components/SummaryCards'
import MonthPicker from './components/MonthPicker'

const today = new Date()
const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

const VALID_USERS = [...USERS, 'casal']
const urlUser = new URLSearchParams(window.location.search).get('user')?.toLowerCase().trim() || null

function navigate(user) {
  window.location.search = `?user=${user}`
}

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [month, setMonth] = useState(defaultMonth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isCasal = urlUser === 'casal'

  useEffect(() => {
    if (urlUser && VALID_USERS.includes(urlUser)) fetchExpenses()
  }, [month])

  async function fetchExpenses() {
    setLoading(true)
    setError(null)
    const [year, m] = month.split('-')
    const from = `${year}-${m}-01`
    const nextMonth = new Date(Number(year), Number(m), 1)
    const to = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`

    let query = supabase
      .from('expenses')
      .select('*')
      .gte('date', from)
      .lt('date', to)
      .order('date', { ascending: false })

    if (!isCasal) {
      query = query.eq('user_name', urlUser)
    }

    const { data, error } = await query

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
      .insert([{ ...expense, user_name: urlUser }])
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

  if (!urlUser || !VALID_USERS.includes(urlUser)) {
    return (
      <div className="min-h-screen bg-brand-sand flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full mx-4">
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Dim Dim Dim</h1>
          <p className="text-brand-stone text-sm mb-6">Escolhe o teu perfil</p>
          <div className="flex flex-col gap-3">
            {USERS.map((u) => (
              <button
                key={u}
                onClick={() => navigate(u)}
                className={`w-full py-3 rounded-xl font-semibold text-sm capitalize transition hover:opacity-80 ${USER_COLORS[u]}`}
              >
                {u}
              </button>
            ))}
            <button
              onClick={() => navigate('casal')}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-brand-sand text-brand-navy border border-brand-stone transition hover:opacity-80"
            >
              Casal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-sand pb-32">
      {/* Header */}
      <header className="bg-brand-navy shadow-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-white tracking-tight">Dim Dim Dim</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="md:col-span-1 flex flex-col gap-4">
          {!isCasal && <ExpenseForm onAdd={handleAdd} />}
          <SummaryCards expenses={expenses} isCasal={isCasal} />
        </div>

        <div className="md:col-span-1 lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-brand-stone text-sm">
              A carregar...
            </div>
          ) : (
            <ExpenseList expenses={expenses} onDelete={handleDelete} isCasal={isCasal} />
          )}
        </div>
      </main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-navy z-40 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 pt-2 pb-3 flex flex-col gap-2">
          {/* Month picker */}
          <div className="flex justify-center">
            <MonthPicker value={month} onChange={setMonth} />
          </div>
          {/* User tabs */}
          <div className="flex gap-1 bg-brand-dark rounded-xl p-1">
            {USERS.map((u) => (
              <button
                key={u}
                onClick={() => navigate(u)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                  urlUser === u
                    ? 'bg-brand-amber text-brand-dark shadow-sm'
                    : 'text-brand-stone hover:text-white'
                }`}
              >
                {u}
              </button>
            ))}
            <button
              onClick={() => navigate('casal')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                isCasal
                  ? 'bg-brand-amber text-brand-dark shadow-sm'
                  : 'text-brand-stone hover:text-white'
              }`}
            >
              Casal
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
