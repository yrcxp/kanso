import * as React from 'react'

declare global {
    interface Window {
        toTop: any;
    }
}

export default () => {
    const [isHide, setHide] = React.useState(true)
    React.useEffect(() => {
        const cb = () => {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t <= 148) {
                setHide(true)
            } else {
                setHide(false)
            }
        }
        window.addEventListener("scroll", cb.bind(this))
        return () => { window.removeEventListener("scroll", cb.bind(this)) }
    }, [])
    return (
        <button
            onClick={() => {
                if (document.documentElement.scrollTop) {
                    window.toTop = setInterval(() => {
                        if (document.documentElement.scrollTop === 0) clearInterval(window.toTop)
                        document.documentElement.scrollTop -= 200
                    }, 40);
                } else {
                    window.history.pushState(null, '', '#')//兼容
                }
            }}
            className={`card fixed right-2.5 w-10 h-10 bg-white outline-none border-none transition-all duration-500 hover:bg-[#dcc9c9] ${isHide ? '-bottom-[50px]' : 'bottom-2.5'}`}
        >
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512'>
                <title>ionicons-v5-a</title>
                <polyline
                    points='112 328 256 184 400 328'
                    className={`fill-none stroke-[48px] stroke-round ${isHide ? 'stroke-none' : 'stroke-black'}`}
                />
            </svg>
        </button>
    )
}
