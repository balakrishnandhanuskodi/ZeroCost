import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { ExpenseInput, EXPENSE_CATEGORIES } from '../../lib/expensesService'

interface ParsedExpense extends ExpenseInput {
  _row?: number
}

interface ImportExpensesModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (expenses: ExpenseInput[]) => Promise<void>
  isLoading?: boolean
}

export default function ImportExpensesModal({ isOpen, onClose, onImport, isLoading = false }: ImportExpensesModalProps) {
  const [pastedText, setPastedText] = useState('')
  const [parsedExpenses, setParsedExpenses] = useState<ParsedExpense[]>([])
  const [step, setStep] = useState<'input' | 'preview'>('input')
  const [errors, setErrors] = useState<string[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editData, setEditData] = useState<ParsedExpense | null>(null)

  const parseExpenses = (text: string) => {
    const lines = text.trim().split('\n').filter(line => line.trim())
    const expenses: ParsedExpense[] = []
    const parseErrors: string[] = []

    lines.forEach((line, idx) => {
      try {
        // Try to parse different formats
        const expense = parseLine(line, idx + 1)
        if (expense) {
          expenses.push(expense)
        }
      } catch (err) {
        parseErrors.push(`Row ${idx + 1}: ${err instanceof Error ? err.message : 'Could not parse'}`)
      }
    })

    setParsedExpenses(expenses)
    setErrors(parseErrors)
    setSelectedIndices(new Set(expenses.map((_, idx) => idx)))

    if (expenses.length > 0) {
      setStep('preview')
    }
  }

  const parseLine = (line: string, rowNum: number): ParsedExpense | null => {
    // Remove extra spaces
    line = line.trim()
    if (!line || line.includes('Logo') || line.includes('Details') || line.includes('•')) return null

    // Try CSV format: date,category,description,amount
    const csvMatch = line.match(/^([^,]+),([^,]+),([^,]+),(.+)$/)
    if (csvMatch) {
      const [, dateStr, category, description, amountStr] = csvMatch
      return {
        date: parseDate(dateStr.trim()),
        category: parseCategory(category.trim()),
        description: description.trim(),
        amount: parseAmount(amountStr.trim()),
        _row: rowNum
      }
    }

    // Try tab-separated: date\tcategory\tdescription\tamount
    const tabMatch = line.split('\t').filter(x => x.trim()).length === 4
    if (tabMatch) {
      const parts = line.split('\t').map(x => x.trim())
      return {
        date: parseDate(parts[0]),
        category: parseCategory(parts[1]),
        description: parts[2],
        amount: parseAmount(parts[3]),
        _row: rowNum
      }
    }

    // Try pipe-separated
    const pipeMatch = line.split('|').filter(x => x.trim()).length === 4
    if (pipeMatch) {
      const parts = line.split('|').map(x => x.trim())
      return {
        date: parseDate(parts[0]),
        category: parseCategory(parts[1]),
        description: parts[2],
        amount: parseAmount(parts[3]),
        _row: rowNum
      }
    }

    // Try Google Pay format: "Sent ₹5000.00 using..." or "Paid ₹20.00 to..."
    const gpayMatch = line.match(/^(Sent|Paid)\s+(₹[\d,]+\.?\d*)\s+(using|to)\s+(.+?)(?:\s+Bank\s+Account|$)/)
    if (gpayMatch) {
      const [, action, amountStr, , description] = gpayMatch
      const category = action === 'Sent' ? 'Transfer' : 'Others'

      return {
        date: new Date().toISOString().split('T')[0], // Use today's date if not specified
        category,
        description: description.trim(),
        amount: parseAmount(amountStr),
        _row: rowNum
      }
    }

    // Try simple format: amount - description
    const simpleMatch = line.match(/^(₹[\d,]+\.?\d*)\s*-\s*(.+)$/)
    if (simpleMatch) {
      const [, amountStr, description] = simpleMatch
      return {
        date: new Date().toISOString().split('T')[0],
        category: 'Others',
        description: description.trim(),
        amount: parseAmount(amountStr),
        _row: rowNum
      }
    }

    throw new Error('Could not parse. Supported: date,category,desc,amount OR "Sent ₹100 using Merchant" OR "₹100 - Description"')
  }

  const parseDate = (dateStr: string): string => {
    // Try various date formats
    const formats = [
      /^(\d{4})-(\d{2})-(\d{2})$/, // 2026-10-01
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // 01/10/2026
      /^(\d{1,2})-(\w{3})-(\d{2,4})$/, // 01-Oct-26
      /^(\d{1,2}) (\w{3}) (\d{2,4})$/, // 01 Oct 26
    ]

    let match = dateStr.match(formats[0])
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`
    }

    match = dateStr.match(formats[1])
    if (match) {
      const [, day, month, year] = match
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    match = dateStr.match(formats[2])
    if (match) {
      const [, day, month, year] = match
      const monthNum = new Date(`${month} 1`).getMonth() + 1
      const fullYear = year.length === 2 ? `20${year}` : year
      return `${fullYear}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    match = dateStr.match(formats[3])
    if (match) {
      const [, day, month, year] = match
      const monthNum = new Date(`${month} 1`).getMonth() + 1
      const fullYear = year.length === 2 ? `20${year}` : year
      return `${fullYear}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    throw new Error(`Invalid date format: ${dateStr}`)
  }

  const parseCategory = (catStr: string): string => {
    const normalized = catStr.trim().toLowerCase()
    const match = EXPENSE_CATEGORIES.find(cat => cat.toLowerCase() === normalized)
    if (match) return match

    // Try to find close match
    if (normalized.includes('food') || normalized.includes('restaurant') || normalized.includes('coffee')) return 'Food'
    if (normalized.includes('shop') || normalized.includes('amazon') || normalized.includes('store')) return 'Shopping'
    if (normalized.includes('travel') || normalized.includes('uber') || normalized.includes('taxi')) return 'Travel'
    if (normalized.includes('petrol') || normalized.includes('fuel') || normalized.includes('gas')) return 'Petrol Expense'
    if (normalized.includes('bill') || normalized.includes('phone') || normalized.includes('internet')) return 'Bills'
    if (normalized.includes('sport') || normalized.includes('gym') || normalized.includes('badminton')) return 'Sports'

    throw new Error(`Unknown category: ${catStr}. Valid: ${EXPENSE_CATEGORIES.join(', ')}`)
  }

  const parseAmount = (amountStr: string): number => {
    const cleaned = amountStr.replace(/[₹,]/g, '').trim()
    const amount = parseFloat(cleaned)
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid amount: ${amountStr}`)
    }
    return amount
  }

  const toggleExpense = (idx: number) => {
    const newSelected = new Set(selectedIndices)
    if (newSelected.has(idx)) {
      newSelected.delete(idx)
    } else {
      newSelected.add(idx)
    }
    setSelectedIndices(newSelected)
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setEditData({ ...parsedExpenses[idx] })
  }

  const saveEdit = () => {
    if (editingIdx !== null && editData) {
      const updated = [...parsedExpenses]
      updated[editingIdx] = editData
      setParsedExpenses(updated)
      setEditingIdx(null)
      setEditData(null)
    }
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setEditData(null)
  }

  const handleImport = async () => {
    const selectedExpenses = parsedExpenses
      .map(({ _row, ...exp }, idx) => selectedIndices.has(idx) ? exp : null)
      .filter((exp): exp is ExpenseInput => exp !== null)

    try {
      await onImport(selectedExpenses)
      setPastedText('')
      setParsedExpenses([])
      setErrors([])
      setSelectedIndices(new Set())
      setEditingIdx(null)
      setEditData(null)
      setStep('input')
      onClose()
    } catch (err) {
      console.error('Import error:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-4">
          Import Expenses
        </h3>

        {step === 'input' ? (
          <>
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-2 block">
                Paste Your Transactions
              </label>
              <p className="text-[11px] text-[var(--muted-foreground)] mb-2">
                Format: date, category, description, amount (one per line)
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] mb-3">
                Example: 2026-10-01, Food, Coffee, 150 or 01-Oct-26 | Shopping | Amazon | 500
              </p>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste transactions here...&#10;2026-10-01, Food, Starbucks, 250&#10;02-Oct-26, Shopping, Amazon, 1500&#10;03/10/2026 | Travel | Uber | 350"
                className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--muted)] text-[var(--foreground)] text-[12px] resize-none h-40 font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2 rounded border border-[var(--border)] text-[12px] font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => parseExpenses(pastedText)}
                disabled={!pastedText.trim()}
                className="flex-1 px-3 py-2 rounded bg-[var(--primary)] text-white text-[12px] font-semibold hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                Preview & Review
              </button>
            </div>
          </>
        ) : (
          <>
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-[11px] font-semibold text-red-700 dark:text-red-400 mb-2">Parsing Errors:</p>
                {errors.map((err, i) => (
                  <p key={i} className="text-[10px] text-red-600 dark:text-red-400">{err}</p>
                ))}
              </div>
            )}

            <div className="mb-4">
              <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-3">
                Preview ({parsedExpenses.length} transactions)
              </p>

              <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
                <table className="w-full text-[11px]">
                  <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
                    <tr>
                      <th className="px-2 py-2 text-center w-6">
                        <input
                          type="checkbox"
                          checked={selectedIndices.size === parsedExpenses.length && parsedExpenses.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIndices(new Set(parsedExpenses.map((_, idx) => idx)))
                            } else {
                              setSelectedIndices(new Set())
                            }
                          }}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                      </th>
                      <th className="px-2 py-2 text-left">Date</th>
                      <th className="px-2 py-2 text-left">Category</th>
                      <th className="px-2 py-2 text-left">Description</th>
                      <th className="px-2 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedExpenses.map((exp, idx) => (
                      <tr key={idx} className={`border-b border-[var(--border)] ${selectedIndices.has(idx) ? 'bg-[var(--muted)]' : 'opacity-50 bg-red-50 dark:bg-red-950/20'}`}>
                        {editingIdx === idx && editData ? (
                          <>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedIndices.has(idx)}
                                onChange={() => toggleExpense(idx)}
                                className="w-4 h-4 rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="date"
                                value={editData.date}
                                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                className="w-full px-1.5 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)] text-[10px]"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <select
                                value={editData.category}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                className="w-full px-1.5 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)] text-[10px]"
                              >
                                {EXPENSE_CATEGORIES.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="text"
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="w-full px-1.5 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)] text-[10px]"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-1 items-center">
                                <input
                                  type="number"
                                  value={editData.amount}
                                  onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
                                  className="w-20 px-1.5 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)] text-[10px] text-right"
                                  step="0.01"
                                  min="0"
                                />
                                <button
                                  onClick={saveEdit}
                                  className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                                  title="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedIndices.has(idx)}
                                onChange={() => toggleExpense(idx)}
                                className="w-4 h-4 rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-2 py-2">{exp.date}</td>
                            <td className="px-2 py-2">{exp.category}</td>
                            <td className="px-2 py-2 truncate max-w-xs">{exp.description}</td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2 items-center justify-end">
                                <span className="font-semibold">₹{exp.amount.toLocaleString('en-IN')}</span>
                                <button
                                  onClick={() => startEdit(idx)}
                                  className="p-1 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                  title="Edit"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 p-2 bg-[var(--muted)] rounded-lg">
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  <span className="font-semibold">Selected:</span> {selectedIndices.size} of {parsedExpenses.length} transactions
                </p>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                  <span className="font-semibold">Total:</span> ₹{parsedExpenses
                    .filter((_, idx) => selectedIndices.has(idx))
                    .reduce((sum, exp) => sum + exp.amount, 0)
                    .toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-3 py-2 rounded border border-[var(--border)] text-[12px] font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={isLoading || selectedIndices.size === 0}
                className="flex-1 px-3 py-2 rounded bg-[var(--primary)] text-white text-[12px] font-semibold hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? 'Importing...' : `Import (${selectedIndices.size})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
