import * as React from "react";

import { autobind } from "core-decorators";

import Keycodes from "@/keycodes";

import { NumberPrecision, clamp } from "@/math";

import connectEditorField, {
  EditorFieldProps,
  InjectedProps
} from "./connect-field";

export interface NumericEditorFieldProps extends EditorFieldProps {
  minValue?: number;
  maxValue?: number;
  precision?: NumberPrecision;
}

type Props = NumericEditorFieldProps & InjectedProps;
interface State {
  editValue: string | null;
  isValid: boolean;
}
class NumericTemplateField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editValue: null,
      isValid: true
    };
  }

  render() {
    const { value, minValue, maxValue } = this.props;
    const { editValue } = this.state;

    const currentValue = editValue || value;
    return (
      <input
        type="number"
        min={minValue}
        max={maxValue}
        value={currentValue !== undefined ? currentValue : null}
        onChange={this._onValueChange}
        onKeyPress={this._onInputKeyPress}
        onBlur={this._onInputBlur}
      />
    );
  }

  @autobind()
  private _onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.valueAsNumber;
    const clampValue = this._clamp(value);
    this.setState({
      editValue: e.target.value,
      isValid: e.target.valueAsNumber === clampValue
    });
  }

  @autobind()
  private _onInputKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.charCode === Keycodes.Enter) {
      this._commitEdit();
    }
  }

  @autobind()
  private _onInputBlur() {
    this._commitEdit();
  }

  private _commitEdit() {
    const { editValue, isValid } = this.state;
    const { onChange } = this.props;

    this.setState({
      editValue: null
    });

    if (!editValue || !isValid) {
      return;
    }

    onChange(editValue);
  }

  private _clamp(value: number): number {
    const { precision = "int32", minValue, maxValue } = this.props;
    value = clamp(precision, value);
    if (maxValue != null) {
      value = Math.min(value, maxValue);
    }
    if (minValue != null) {
      value = Math.max(value, minValue);
    }
    return value;
  }
}
export default connectEditorField()(NumericTemplateField);