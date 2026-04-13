export default function MonthPicker({ value, onChange }) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  const [year, month] = value.split('-').map(Number)

  const prev = () => {
    const d = new Date(year, month - 2, 1)
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const next = () => {
    const d = new Date(year, month, 1)
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div className="flex items-center gap-4">
      <button onClick={prev} className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2">&lt;</button>
      <span className="text-gray-700 font-semibold text-base w-40 text-center">
        {months[month - 1]} {year}
      </span>
      <button onClick={next} className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2">&gt;</button>
    </div>
  )
}
