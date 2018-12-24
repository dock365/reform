import * as React from 'react';
import { FormContext, validationRules } from './Form';
import { validationTypes } from '@dock365/validator';

export interface IFieldRenderProps {
  name: string;
  placeholder?: string;
  defaultValue?: string | Date | number | boolean;
  value?: string | number | boolean;
  customProps?: any;
  onChange?: (
    value: number | string | boolean | Date,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  onBlur?: (
    value: number | string | boolean | Date,
    e?: React.MouseEvent<HTMLInputElement>,
  ) => void;
  label?: string;
  validationRules?: validationRules;
  errors?: string[];
}
export interface IFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | Date | number | boolean;
  render: React.ComponentType<IFieldRenderProps>;
  onChange?: (value: string | number | Date | boolean) => void;
  onBlur?: (value: string | number | Date | boolean) => void;
  validationRules?: validationRules;
  customProps?: any;
}
export interface IFieldState {
  shouldUpdate: boolean;
}

export class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);

    this.state = {
      shouldUpdate: false,
    };
  }
  public componentDidUpdate(prevProps: IFieldProps) {
    if (this.props.validationRules !== prevProps.validationRules) {
      debugger;
      this.setState({ shouldUpdate: true });
    }
  }

  public render() {
    return (
      <FormContext.Consumer >
        {({ fields, onChange, onBlur, initialize, showAsteriskOnRequired }) => {
          const field = fields && fields.find((item: any) => item.name === this.props.name);
          if (!field || this.state.shouldUpdate) {
            if (this.state.shouldUpdate)
              this.setState((prevState) => ({ shouldUpdate: !prevState.shouldUpdate }));
            if (initialize) {
              initialize(this.props.name, this.props.label, this.props.validationRules);
            }

            return null;
          }
          if (field && field.value === undefined && this.props.defaultValue !== undefined && onChange) {
            onChange(this.props.defaultValue, this.props.name);
          }

          const type = this.props.validationRules && this.props.validationRules.type;

          return (
            React.createElement(this.props.render, {
              name: this.props.name,
              placeholder: this.props.placeholder,
              defaultValue: this.props.defaultValue,
              value: field && field.value,
              customProps: this.props.customProps,
              onChange: (
                value: number | string | boolean | Date,
                e?: React.MouseEvent<HTMLInputElement>,
              ) => {
                const _value = type === validationTypes.String && typeof value === "number" ?
                  `${value}` : value;
                if (onChange) onChange(_value, this.props.name, e);
                if (this.props.onChange) this.props.onChange(_value);
              },
              onBlur: (
                value: number | string | boolean | Date,
                e?: React.MouseEvent<HTMLInputElement>,
              ) => {
                const _value = type === validationTypes.String && typeof value === "number" ?
                  `${value}` : value;
                if (onBlur) onBlur(_value, this.props.name, e);
                if (this.props.onBlur) this.props.onBlur(_value);
              },
              label: showAsteriskOnRequired && this.props.validationRules && this.props.validationRules.required ?
                `${this.props.label}*` :
                this.props.label,
              validationRules: this.props.validationRules,
              errors: field && field.errors,
            })
          );
        }
        }
      </FormContext.Consumer>
    );
  }
}
