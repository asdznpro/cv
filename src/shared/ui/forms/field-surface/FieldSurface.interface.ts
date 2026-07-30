import { FieldStatus } from '../field-status.type'

export default interface FieldSurfaceProps extends React.AllHTMLAttributes<HTMLElement> {
	mode?: 'secondary' | 'outline' | undefined
	status?: FieldStatus

	radius?: 'smooth' | 'rounded' | 'none' | undefined
}
