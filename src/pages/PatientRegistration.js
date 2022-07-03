import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
// material
import { Stack, Typography, IconButton, Box } from '@material-ui/core';
import { Affix } from 'antd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import closeFill from '@iconify/icons-eva/close-fill';
import Page from '../components/Page';
import BasicInfoForm from '../components/BasicInfoForm';
import OutsideProviders from '../components/OutsideProviders';
import EmployerForm from '../components/EmployerForm';
import SocialForm from '../components/SocialForm';
import PrimaryInsuranceForm from '../components/PrimaryInsuranceForm';
import SecondaryInsuranceForm from '../components/SecondaryInsuranceForm';
import TertiaryInsuranceForm from '../components/TertiaryInsuranceForm';
import PharmacyForm from '../components/PharmacyForm';
import ContactInfoForm from '../components/ContactInfoForm';
import './StyleSheet.css';
import '../Styles/AntDesignModification.css';

// ----------------------------------------------------------------------
export default function PatientRegistration() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const TertiaryRef = useRef(null);
  const SecondaryRef = useRef(null);
  const PrimaryRef = useRef(null);
  const SocialRef = useRef(null);
  const EmployerRef = useRef(null);
  const ProviderRef = useRef(null);
  const PharmacyRef = useRef(null);
  const ContactRef = useRef(null);
  const BasicRef = useRef(null);
  const pathname = window.location.search;
  const [basicInfo, setBasicInfo] = useState(pathname.includes('patientId'));
  const [contactInfo, setContactInfo] = useState(false);
  const [pharmacyInfo, setPharmacyInfo] = useState(false);
  const [providerInfo, setProviderInfo] = useState(false);
  const [employerInfo, setEmployerInfo] = useState(false);
  const [socialInfo, setSocialInfo] = useState(false);
  const [primaryInfo, setPrimaryInfo] = useState(false);
  const [secondaryInfo, setSecondaryInfo] = useState(false);
  const [tertiaryInfo, setTertiaryInfo] = useState(false);
  const top = 60;

  const [id, setId] = useState(
    pathname ? Number(pathname.split('patientId=')[1].split('&id=')[1]) : null
  );
  const [patientId, setPatiendId] = useState(
    pathname ? pathname.split('patientId=')[1].split('&id=')[0] : null
  );
  const [infoCheck, setInfoCheck] = useState(pathname.includes('patientId'));

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
  const onScroll = (reference) => {
    if (reference.current) {
      reference.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return (
    <Page title="Patient Registration">
      <div sx={{ height: '100%', padding: 10 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Patient profile
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Affix offsetTop={top}>
            <div className="Navbar">
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(BasicRef)} variant="subtitle">
                  Basic info
                </Typography>
                {basicInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(ContactRef)} variant="subtitle">
                  Contact info
                </Typography>
                {contactInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(PharmacyRef)} variant="subtitle">
                  Pharmacy
                </Typography>
                {pharmacyInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(ProviderRef)} variant="subtitle">
                  Outside provider
                </Typography>
                {providerInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(EmployerRef)} variant="subtitle">
                  Employer
                </Typography>
                {employerInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(SocialRef)} variant="subtitle">
                  Social
                </Typography>
                {socialInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(PrimaryRef)} variant="subtitle">
                  Primary insurance
                </Typography>
                {primaryInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(SecondaryRef)} variant="subtitle">
                  Secondary insurance
                </Typography>
                {secondaryInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row-reverse">
                <Typography onClick={() => onScroll(TertiaryRef)} variant="subtitle">
                  Tertiary insurance
                </Typography>
                {tertiaryInfo && (
                  <CheckCircleIcon
                    sx={{ py: 'auto' }}
                    style={{
                      color: '#2fa32f',
                      marginRight: 2,
                      width: 18,
                      height: 15,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </Stack>
            </div>
          </Affix>
          <Box>
            <BasicInfoForm
              id={id}
              setBasicInfo={setBasicInfo}
              patientId={patientId}
              SnacbarViewer={SnacbarViewer}
              onSubmittion={(id, patientid) => {
                setId(id);
                setPatiendId(patientid);
                setBasicInfo(true);
                setInfoCheck(true);
              }}
            />
            <ContactInfoForm
              id={id}
              patientId={patientId}
              ContactRef={ContactRef}
              setContactInfo={setContactInfo}
              onSubmittion={() => setContactInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <PharmacyForm
              id={id}
              patientId={patientId}
              PharmacyRef={PharmacyRef}
              setPharmacyInfo={setPharmacyInfo}
              onSubmittion={() => setPharmacyInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <OutsideProviders
              id={id}
              patientId={patientId}
              ProviderRef={ProviderRef}
              setProviderInfo={setProviderInfo}
              onSubmittion={() => setProviderInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <EmployerForm
              id={id}
              patientId={patientId}
              EmployerRef={EmployerRef}
              setEmployerInfo={setEmployerInfo}
              onSubmittion={() => setEmployerInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <SocialForm
              id={id}
              patientId={patientId}
              SocialRef={SocialRef}
              setSocialInfo={setSocialInfo}
              onSubmittion={() => setSocialInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <PrimaryInsuranceForm
              id={id}
              patientId={patientId}
              PrimaryRef={PrimaryRef}
              setPrimaryInfo={setPrimaryInfo}
              onSubmittion={() => setPrimaryInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <SecondaryInsuranceForm
              id={id}
              patientId={patientId}
              SecondaryRef={SecondaryRef}
              setSecondaryInfo={setSecondaryInfo}
              onSubmittion={() => setSecondaryInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
            <TertiaryInsuranceForm
              id={id}
              patientId={patientId}
              TertiaryRef={TertiaryRef}
              setTertiaryInfo={setTertiaryInfo}
              onSubmittion={() => setTertiaryInfo(true)}
              SnacbarViewer={SnacbarViewer}
            />
          </Box>
        </Stack>
      </div>
    </Page>
  );
}
