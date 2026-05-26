import {
  Button,
  IconButton as MuiIconButton,
  type ButtonProps,
  type IconButtonProps,
} from '@mui/material';
export const PrimaryButton = (props: ButtonProps) => (
  <Button variant="contained" color="primary" {...props} />
);
export const SecondaryButton = (props: ButtonProps) => (
  <Button variant="outlined" color="secondary" {...props} />
);
export const DangerButton = (props: ButtonProps) => (
  <Button variant="contained" color="error" {...props} />
);
export const IconButton = (props: IconButtonProps) => <MuiIconButton {...props} />;
