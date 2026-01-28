import "./WinToast.css"

type WinTier = 'small' | 'medium' | 'big'

interface WinToastProps {
    amount: number
    multiplier: number
}

const WinToast: React.FC<WinToastProps> = ({ amount, multiplier }) => {
    // Determine win tier based on multiplier
    const getWinTier = (): WinTier => {
        if (multiplier >= 10) return 'big'      // 10x+ bet
        if (multiplier >= 5) return 'medium'     // 5-10x bet
        return 'small'                           // 1-5x bet
    }

    const tier = getWinTier()

    // Format number
    const formatAmount = (num: number): string => {
        return num.toLocaleString('en-US')  // e.g. "1,250"
    }

     return (
        <div className={`win-toast win-toast--${tier}`}>
            <div className="win-toast__details">
                <div className="win-toast__label">
                    {tier === 'big' && 'BIG WIN!'}
                    {tier === 'medium' && 'NICE WIN!'}
                    {tier === 'small' && 'WIN!'}
                </div>
                <div className="win-toast__amount">
                    {formatAmount(amount)}
                </div>
                {multiplier >= 5 && (
                <div className="win-toast__multiplier">
                    {multiplier.toFixed(1)}x
                </div>
                )}
            </div>
        </div>
    )
}

export default WinToast