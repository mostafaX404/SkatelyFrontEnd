
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatError, MatLabel],
  templateUrl: './input-text.html',
  styleUrl: './input-text.scss',
})
export class InputText implements ControlValueAccessor {

    @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public controlDir: NgControl){
    this.controlDir.valueAccessor = this;
  }

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

}

