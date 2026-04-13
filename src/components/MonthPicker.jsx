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
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="text-brand-stone hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-dark transition text-lg font-bold"
      >
        ‹
      </button>
      <span className="text-white font-semibold text-sm w-36 text-center">
        {months[month - 1]} {year}
      </span>
      <button
        onClick={next}
        className="text-brand-stone hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-dark transition text-lg font-bold"
      >
        ›
      </button>
    </div>
  )
}
