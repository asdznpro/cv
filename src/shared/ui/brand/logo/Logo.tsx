import type LogoProps from './Logo.interface'

import { Lettering } from './Lettering'
import { Lockup } from './Lockup'
import { Sign } from './Sign'

type LogoPart = React.FC<LogoProps>

interface LogoComponent {
	(props: LogoProps): React.ReactNode
	Lettering: LogoPart
	Lockup: LogoPart
	Sign: LogoPart
}

function LogoRoot(props: LogoProps) {
	const { variant = 'lockupSharp', ...rest } = props

	switch (variant) {
		case 'lettering':
			return <Lettering {...rest} />
		case 'lockup':
			return <Lockup {...rest} />
		case 'sign':
			return <Sign {...rest} />
		default:
			return <Lockup {...rest} />
	}
}

export const Logo = LogoRoot as LogoComponent

Logo.Lettering = Lettering
Logo.Lettering.displayName = 'Logo.Lettering'

Logo.Lockup = Lockup
Logo.Lockup.displayName = 'Logo.Lockup'

Logo.Sign = Sign
Logo.Sign.displayName = 'Logo.Sign'
