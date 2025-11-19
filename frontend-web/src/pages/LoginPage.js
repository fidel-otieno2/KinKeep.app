import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    const result = await login(values);
    
    if (!result.success) {
      setError(result.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KinKeep</h1>
          <p className="text-gray-600 text-sm">
            Preserve your family stories
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4">
        
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
                <div className="space-y-3">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="input-field"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                  
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="input-field"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? 'Signing in...' : 'Log in'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        
        {/* Sign up link */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <Link to="/register" className="font-medium text-sm hover:underline" style={{color: '#0095f6'}}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;