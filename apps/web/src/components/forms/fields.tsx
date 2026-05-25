import { MenuItem, TextField as MuiTextField, type TextFieldProps } from '@mui/material';
export const TextField = (props: TextFieldProps) => (
  <MuiTextField fullWidth size="small" {...props} />
);
export const PasswordField = (props: TextFieldProps) => (
  <MuiTextField fullWidth size="small" type="password" {...props} />
);
export const SearchField = (props: TextFieldProps) => (
  <MuiTextField fullWidth size="small" type="search" {...props} />
);
export function SelectField({
  options,
  ...props
}: TextFieldProps & { options: Array<{ label: string; value: string }> }) {
  return (
    <MuiTextField fullWidth select size="small" {...props}>
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </MuiTextField>
  );
}
