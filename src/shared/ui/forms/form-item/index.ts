'use client'

import { Caption } from '../caption'
import { Input } from '../input'
import { Label } from '../label'
import { Select } from '../select'
import { Textarea } from '../textarea'

import { FormItem as FormItemRoot } from './FormItem'

type FormItemComponent = typeof FormItemRoot & {
	Label: typeof Label
	Input: typeof Input
	Textarea: typeof Textarea
	Select: typeof Select
	Caption: typeof Caption
}

export const FormItem = FormItemRoot as FormItemComponent

FormItem.Label = Label
FormItem.Input = Input
FormItem.Textarea = Textarea
FormItem.Select = Select
FormItem.Caption = Caption

export { FormItemProvider, useFormItem } from './FormItem.context'
