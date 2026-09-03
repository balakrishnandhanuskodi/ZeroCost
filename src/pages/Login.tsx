import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import Alert from '../components/UI/Alert'
import { Wallet } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login, error: authError, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-white">
        <div className="text-6xl font-bold mb-4 flex items-center gap-3">
          <Wallet className="w-16 h-16" />
          <span>ZeroCost</span>
        </div>
        <p className="text-xl text-blue-100 max-w-md text-center">
          Smart Financial Management for Everyone
        </p>
        <p className="text-blue-100 text-center max-w-md mt-4">
          Track loans, manage credit cards, and make intelligent financial decisions with AI-powered insights.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 md:pl-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
          {/* Mobile branding */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <Wallet className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ZeroCost</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Sign in to your account to continue</p>

          {(error || authError) && (
            <Alert
              type="error"
              message={error || authError || 'An error occurred'}
              onClose={() => setError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create one now
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 space-y-1">
              <p><strong>Email:</strong> demo@example.com</p>
              <p><strong>Password:</strong> demo123</p>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@example.com')
                  setPassword('demo123')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-2"
              >
                Use demo credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
