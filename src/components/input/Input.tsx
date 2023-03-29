import { FC, ReactNode } from "react";
import styles from './styles.module.css';

export type InputProps = {
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  children?: ReactNode;
  placehodler?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input: FC<InputProps> = ({ name, type = 'text', children, placehodler = '', ...props }) => {
  return (
    <div className={styles["magic-field"]}>
      <label className={styles["magic-field-label"]} htmlFor={name}>{children}</label>
      <input className={styles["magic-field-input"]} name={name} id={name} type={type} placeholder={placehodler} {...props}/>
    </div>
  );
}