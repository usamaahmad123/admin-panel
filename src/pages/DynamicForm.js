import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form } from 'antd';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
// import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@material-ui/core';
import { LoadingButton, DatePicker } from '@material-ui/lab';
import { Register } from '../utils/Index';
import { lowercaseRegex, uppercaseRegex, numericRegex, specialRegex } from '../utils/constants';
import '../Styles/AntDesignModification.css';

// ----------------------------------------------------------------------
DynamicForm.propTypes = {
  data: PropTypes.array
};
export default function DynamicForm({ data }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 8
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 16
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        {/* {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>} */}
        {msg && <Alert severity="warning">{emailMessage}</Alert>}
        {phone && <Alert severity="warning">{phoneMessage}</Alert>}
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Stack sx={{ my: 2 }} spacing={3}>
            {data
              ? data.map(
                  (item) =>
                    item.included && (
                      <Form.Item
                        name={item.field}
                        rules={[
                          {
                            required: item.required,
                            message: `${item.label} is required.`
                          }
                        ]}
                      >
                        <TextField fullWidth label={item.label} type="text" size="small" />
                      </Form.Item>
                    )
                )
              : null}
          </Stack>
          <LoadingButton
            fullWidth
            size="small"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Form>
      </Stack>
    </>
  );
}
