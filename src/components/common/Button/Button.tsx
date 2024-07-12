import  styles from '../../../styles/components/Button/Button.module.scss';
import classNames from 'classnames';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  content: string;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  content,
  className,
}) => {
  return (
    <button
      data-content={content}
      onClick={onClick}
      className={classNames(styles.button_49, className)}
      role="button"
    >
      {children}
    </button>
  );
};

export default Button;