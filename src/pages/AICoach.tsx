import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot } from 'lucide-react'
import { aiMessages, aiSuggestions } from '../data/mockData'

type Message = {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const aiResponses: Record<string, string> = {
  'Can I buy a car?': "Based on your current finances, buying a car worth ₹8-12L is feasible but requires planning. Your monthly surplus after all expenses and EMIs is only ₹620. I'd recommend saving ₹15,000/month for 12 months before the purchase, and consider a smaller loan of ₹5-6L to keep total EMI below 40% of income. Your current debt-to-income ratio is 39% — adding a car loan will push it to ~50%, which is high. Consider closing your ICICI Personal Loan first (22 months left), then buy the car.",
  'How do I become debt-free faster?': "Great question! Here's your optimal debt-free strategy:\n\n1. **ICICI Personal Loan** (14.5% interest) — Pay extra ₹30,000/month. Closes 18 months earlier. Saves ₹78,000.\n2. **HDFC Home Loan** (8.75%) — Continue regular EMI, invest any surplus in mutual funds instead — the returns likely beat the interest rate.\n\nIf you redirect ₹10,000/month from entertainment and dining to your ICICI loan, you'll be free of personal debt in 14 months instead of 22.",
  'Where am I overspending?': "I found 3 areas where you're overspending this month:\n\n🔴 **Shopping** — Spent ₹12,450 vs budget ₹10,000 (124%)\n🟠 **Entertainment** — ₹4,850 vs ₹4,000 (121%)\n🟡 **Food & Dining** — ₹13,240 vs ₹15,000 (88% — close to limit)\n\nRecommendation: Set a ₹2,000 shopping limit for the remaining month. Cancel one streaming subscription (saves ₹649/month). Order food in instead of delivery 3 times per week — saves ~₹1,800/month.",
  'Should I close my ICICI loan first?': "Yes, absolutely! The ICICI Personal Loan at 14.5% interest rate is your most expensive debt. Every ₹1 lakh extra you pay saves you ₹14,500/year in interest. Your HDFC Home Loan at 8.75% is actually cheaper than many equity returns.\n\nStrategy: Make one bulk payment of ₹50,000 towards ICICI in August. This will:\n• Reduce remaining term from 22 to 15 months\n• Save ₹1,42,500 in total interest\n• Free up ₹18,421 EMI after 15 months for investments",
  'Can I afford a Europe vacation?': "Your Europe vacation goal has ₹87,000 saved of ₹2,50,000 target. At your current savings rate of ₹620/month, it would take 263 months — that's clearly not the plan!\n\nTo afford a Europe trip in March 2027 (8 months away), you need to save ₹20,375/month.\n\nHere's how to find that money:\n• Reduce dining by ₹3,000 → ₹3,000\n• Pause SIP temporarily → ₹12,000 (not recommended long-term)\n• Reduce shopping budget → ₹3,000\n• Monetize a skill (freelance 4 hrs/week) → ₹8,000+\n\nMy recommendation: Delay the trip 3 months (June 2027) and save ₹14,500/month more comfortably.",
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-[var(--muted)] rounded-2xl rounded-tl-sm w-fit">
      <div className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>(aiMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', content: text, time: now }])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      const response = aiResponses[text] || "That's a great question! Based on your financial profile, I'd recommend focusing on your highest-interest debt first while maintaining an emergency fund of at least 3 months' expenses. Would you like me to run a detailed analysis?"
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1500 + Math.random() * 1000)
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-0px)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 md:p-6 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <div className="font-display font-600 text-[var(--foreground)]">FinPilot AI Coach</div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online · Powered by AI
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={13} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary)] text-white rounded-tr-sm'
                    : 'bg-[var(--muted)] text-[var(--foreground)] rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-[var(--muted-foreground)] px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center flex-shrink-0">
              <Bot size={13} className="text-white" />
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 md:px-6 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {aiSuggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-[var(--border)] hover:border-emerald-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 pt-2 pb-20 md:pb-4 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-end gap-3">
          <textarea
            className="flex-1 resize-none bg-[var(--muted)] rounded-2xl px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:ring-2 focus:ring-emerald-200 transition-all border border-transparent focus:border-[var(--primary)] max-h-32"
            placeholder="Ask anything about your finances..."
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center hover:bg-emerald-700 transition-all disabled:opacity-40 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
