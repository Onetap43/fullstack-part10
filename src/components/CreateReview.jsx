import { useState } from 'react';
import { ScrollView, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';

import { CREATE_REVIEW } from '../graphql/mutations';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5da',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#d73a4a',
  },
  error: {
    color: '#d73a4a',
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
  },
});

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner is required'),
  repositoryName: yup.string().required('Repository name is required'),
  rating: yup.number()
    .transform((value, original) => original === '' ? undefined : value)
    .typeError('Rating must be a number')
    .required('Rating is required')
    .integer('Rating must be a whole number')
    .min(0, 'Minimum rating is 0')
    .max(100, 'Maximum rating is 100'),
  text: yup.string(),
});

const CreateReview = () => {
  const [createReview, { loading }] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      repositoryName: '',
      rating: '',
      text: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError('');

      try {
        const response = await createReview({
          variables: {
            review: {
              ownerName: values.ownerName.trim(),
              repositoryName: values.repositoryName.trim(),
              rating: Number(values.rating),
              text: values.text,
            },
          },
        });

        const repositoryId = response.data?.createReview?.repositoryId;

        if (!repositoryId) {
          throw new Error('Repository ID was not returned');
        }

        navigate(`/repository/${encodeURIComponent(repositoryId)}`, {
          replace: true,
        });
      } catch (error) {
        setServerError(error.message || 'Could not create review');
      }
    },
  });

  const fields = [
    {
      name: 'ownerName',
      placeholder: 'Repository owner username',
    },
    {
      name: 'repositoryName',
      placeholder: 'Repository name',
    },
    {
      name: 'rating',
      placeholder: 'Rating between 0 and 100',
      keyboardType: 'numeric',
    },
    {
      name: 'text',
      placeholder: 'Review (optional)',
      multiline: true,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {fields.map((field) => {
        const hasError = formik.touched[field.name] && formik.errors[field.name];

        return (
          <View key={field.name}>
            <TextInput
              style={[
                styles.input,
                field.multiline && styles.multiline,
                hasError && styles.inputError,
              ]}
              placeholder={field.placeholder}
              value={formik.values[field.name]}
              onChangeText={formik.handleChange(field.name)}
              onBlur={formik.handleBlur(field.name)}
              autoCapitalize="none"
              keyboardType={field.keyboardType || 'default'}
              multiline={field.multiline || false}
            />

            {hasError ? (
              <Text style={styles.error}>{formik.errors[field.name]}</Text>
            ) : null}
          </View>
        );
      })}

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Pressable
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={loading || formik.isSubmitting}
      >
        <Text fontWeight="bold" style={styles.buttonText}>
          {loading ? 'Creating review...' : 'Create a review'}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default CreateReview;
