import { FC, ReactNode } from "react";
import styles from './styles.module.css';

export type ButtonProps = {
  name?: string;
  type?: "button" | "reset" | "submit";
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  buttonProps?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
}

export const Button: FC<ButtonProps> = ({ name, type = 'button', children, onClick, disabled = false, ...buttonProps }) => {
  return (
    <button
      id={name}
      name={name}
      type={type}
      className={`${styles["button"]} ${disabled ? '' : styles["active-button"]}`}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
