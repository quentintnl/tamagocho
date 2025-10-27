interface StateIndicatorProps {
    state: string
}

/**
 * Indicateur d'état de la créature avec couleur correspondante
 */
const StateIndicator = ({state}: StateIndicatorProps): JSX.Element => {
    const getStateColor = (state: string): string => {
        switch (state) {
            case 'happy':
                return 'bg-green-400'
            case 'sad':
                return 'bg-blue-400'
            case 'angry':
                return 'bg-red-400'
            case 'hungry':
                return 'bg-yellow-400'
            default:
                return 'bg-gray-400'
        }
    }

    return (
        <div className="flex justify-end items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 capitalize">{state}</span>
            <div className={`w-3 h-3 rounded-full ${getStateColor(state)}`}></div>
        </div>
    )
}

export default StateIndicator
