import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import Alert from '../components/UI/Alert'
import { Wallet } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const { register, error: authError, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.name) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await register(formData.email, formData.password, formData.name)
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setErrors(prev => ({ ...prev, submit: message }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* Left side - Info */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-white">
        <div className="text-6xl font-bold mb-4 flex items-center gap-3">
          <Wallet className="w-16 h-16" />
          <span>ZeroCost</span>
        </div>
        <p className="text-xl text-blue-100 max-w-md text-center">
          Join thousands managing their finances smarter
        </p>
        <div className="mt-8 space-y-4 text-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-sm">✓</div>
            <span>Track all your loans in one place</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-sm">✓</div>
            <span>Intelligent interest calculations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-sm">✓</div>
            <span>AI-powered financial recommendations</span>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full md:w-1/2 md:pl-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
          {/* Mobile branding */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <Wallet className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ZeroCost</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-6">Join ZeroCost and start managing your finances</p>

          {(errors.submit || authError) && (
            <Alert
              type="error"
              message={errors.submit || authError || 'An error occurred'}
              onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              autoFocus
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <label className="flex items-start gap-2 text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm">
                I agree to the{' '}
                <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500">{errors.acceptTerms}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
