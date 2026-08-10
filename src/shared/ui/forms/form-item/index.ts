'use client'

import { Caption } from '../_components/caption'
import { Combobox } from '../combobox'
import { Input } from '../input'
import { Label } from '../_components/label'
import { Select } from '../select'
import { Textarea } from '../textarea'

import { FormItem as FormItemRoot } from './FormItem'

type FormItemComponent = typeof FormItemRoot & {
	Label: typeof Label
	Input: typeof Input
	Textarea: typeof Textarea
	Select: typeof Select
	Combobox: typeof Combobox
	Caption: typeof Caption
}

export const FormItem = FormItemRoot as FormItemComponent

FormItem.Label = Label
FormItem.Input = Input
FormItem.Textarea = Textarea
FormItem.Select = Select
FormItem.Combobox = Combobox
FormItem.Caption = Caption

export { FormItemProvider, useFormItem } from './FormItem.context'
