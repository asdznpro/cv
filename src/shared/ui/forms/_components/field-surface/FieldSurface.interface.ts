import { FieldStatus } from '../../field-status.type'

export interface FieldSurfaceProps extends React.AllHTMLAttributes<HTMLElement> {
	mode?: 'secondary' | 'outline' | undefined
	status?: FieldStatus

	radius?: 'smooth' | 'rounded' | 'none' | undefined
}
