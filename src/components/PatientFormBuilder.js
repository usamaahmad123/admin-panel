import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
// material
import { Stack, Container, Typography, IconButton } from '@material-ui/core';
import closeFill from '@iconify/icons-eva/close-fill';
import { Switch } from 'antd';
import Page from './Page';
import '../pages/StyleSheet.css';

export default function PatientFormBuilder() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [basicinfo, setBasicInfo] = React.useState({
    include_name: true,
    required_name: true,
    include_sex: true,
    required_sex: true,
    include_dob: true,
    required_dob: true,
    include_ssn: true,
    required_ssn: true,
    include_refid: true,
    required_refid: true
  });
  useEffect(() => {
    SnacbarViewer('This page is currently in development.', 'warning');
  }, []);
  const SnacbarViewer = (message, Variant) => {
    enqueueSnackbar(message, {
      variant: Variant,
      action: (key) => (
        <IconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </IconButton>
      )
    });
  };
  return (
    <Page title="Patient Registration">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Patient registration form builder
          </Typography>
        </Stack>
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" gutterBottom>
              Basic info
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Name
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_name: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_name: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Sex
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_sex: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_sex: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              DOB
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_dob: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_dob: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Social security number
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_ssn: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled
            />
            <Switch
              checked={basicinfo.required_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_ssn: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
              disabled
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              External reference ID
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
              disabled
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              disabled
              unCheckedChildren="Not Req"
            />
          </Stack>
        </>
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" gutterBottom>
              Contact info
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Patient address
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_name: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_name: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Preffered phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_sex: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_sex: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Other phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_dob: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_dob: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Email address
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_ssn: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_ssn: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Emergency contact name
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Emergency contact phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>{' '}
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Parent / Guardian name
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>{' '}
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Parent / Guardian phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>{' '}
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Other patent name
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Other patent phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_refid: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_refid}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_refid: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
        </>
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" gutterBottom>
              Outside providers
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Referring physician name
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_name: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_name: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Referring physician practice
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_sex: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_sex: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Referring physician phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_dob: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_dob: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              PCP practice
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_ssn: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_ssn: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              PCP practice phone #
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_ssn: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_ssn: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Primary care physician (PCP)
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_ssn: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_ssn}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_ssn: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
        </>
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" gutterBottom>
              Employer
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Occupation
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_name: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_name: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Work status
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_sex: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_sex: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Employer name
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_dob: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_dob: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
        </>
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" gutterBottom>
              Social
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Marital Status
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_name: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_name}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_name: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Share information with spouse?
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_sex: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_sex}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_sex: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              # of children
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_dob: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_dob: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: '60%' }} variant="h7" gutterBottom>
              Share information with adult children?
            </Typography>
            <Switch
              style={{ marginRight: 15 }}
              checked={basicinfo.include_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, include_dob: event })}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
            <Switch
              checked={basicinfo.required_dob}
              onChange={(event) => setBasicInfo({ ...basicinfo, required_dob: event })}
              checkedChildren="Required"
              unCheckedChildren="Not Req"
            />
          </Stack>
        </>
      </Container>
    </Page>
  );
}
