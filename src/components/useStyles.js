import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  notchedOutline: {
    borderWidth: 2,
    borderColor: `${theme.palette.primary.main} !important`
  }
}));
export default useStyles;
