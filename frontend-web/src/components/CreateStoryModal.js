import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreateStorySchema = Yup.object().shape({
  title: Yup.string().required('Story title is required'),
  content: Yup.string().required('Story content is required'),
  type: Yup.string().required('Story type is required'),
  visibility: Yup.string().required('Visibility is required'),
});

const CreateStoryModal = ({ isOpen, onClose, onSubmit, familyId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-900">Add New Story</h2>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-800"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={{ 
            title: '', 
            content: '', 
            type: 'text', 
            visibility: 'family' 
          }}
          validationSchema={CreateStorySchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onSubmit({ ...values, family_id: familyId });
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-amber-900">
                  Story Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="input-field"
                  placeholder="Enter story title"
                />
                <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-amber-900">
                  Story Type
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="input-field"
                >
                  <option value="text">Written Story</option>
                  <option value="audio">Audio Recording</option>
                  <option value="video">Video Recording</option>
                </Field>
                <ErrorMessage name="type" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-amber-900">
                  Story Content
                </label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  rows="6"
                  className="input-field"
                  placeholder="Tell your story..."
                />
                <ErrorMessage name="content" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-amber-900">
                  Who can see this story?
                </label>
                <Field
                  as="select"
                  id="visibility"
                  name="visibility"
                  className="input-field"
                >
                  <option value="private">Only me</option>
                  <option value="family">Family members</option>
                  <option value="public">Everyone</option>
                </Field>
                <ErrorMessage name="visibility" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? 'Adding...' : 'Add Story'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateStoryModal;