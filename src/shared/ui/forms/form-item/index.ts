'use client'

import { Caption } from '../caption'
import { Input } from '../input'
import { Label } from '../label'
import { Textarea } from '../textarea'

import { FormItem as FormItemRoot } from './FormItem'

type FormItemComponent = typeof FormItemRoot & {
	Label: typeof Label
	Input: typeof Input
	Textarea: typeof Textarea
	Caption: typeof Caption
}

export const FormItem = FormItemRoot as FormItemComponent

FormItem.Label = Label
FormItem.Input = Input
FormItem.Textarea = Textarea
FormItem.Caption = Caption

export { FormItemProvider, useFormItem } from './FormItem.context'
