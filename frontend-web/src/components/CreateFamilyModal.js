import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreateFamilySchema = Yup.object().shape({
  name: Yup.string().required('Family name is required'),
  description: Yup.string(),
});

const CreateFamilyModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">New Family</h2>
          <div className="w-6"></div>
        </div>
        
        <div className="p-6">

          <Formik
            initialValues={{ name: '', description: '' }}
            validationSchema={CreateFamilySchema}
            onSubmit={async (values, { setSubmitting }) => {
              await onSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="input-field"
                    placeholder="Family name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="3"
                    className="input-field resize-none"
                    placeholder="Tell us about your family... (optional)"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? 'Creating...' : 'Create Family'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateFamilyModal;