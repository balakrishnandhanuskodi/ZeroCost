import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import { LogOut } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Cards */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Loans</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">$0</p>
              <p className="text-xs text-gray-500 mt-2">No loans yet</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
              <p className="text-xs text-gray-500 mt-2">Not started</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">$0</p>
              <p className="text-xs text-gray-500 mt-2">No budget set</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">Net Worth</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">$0</p>
              <p className="text-xs text-gray-500 mt-2">Calculate now</p>
            </div>
          </Card>
        </div>

        {/* Welcome Section */}
        <Card title="Getting Started with ZeroCost">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🏦</div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Your Loans</h3>
              <p className="text-sm text-gray-600">
                Start by adding your loans. We'll calculate interest and help you pay them off faster.
              </p>
              <Button variant="primary" className="mt-4 w-full" size="sm">
                Add Loan
              </Button>
            </div>

            <div className="text-center p-4">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Transactions</h3>
              <p className="text-sm text-gray-600">
                Log your daily expenses and income. Categorize them automatically.
              </p>
              <Button variant="primary" className="mt-4 w-full" size="sm">
                Record Transaction
              </Button>
            </div>

            <div className="text-center p-4">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">View Insights</h3>
              <p className="text-sm text-gray-600">
                Get AI-powered recommendations to optimize your finances.
              </p>
              <Button variant="primary" className="mt-4 w-full" size="sm">
                View Reports
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
