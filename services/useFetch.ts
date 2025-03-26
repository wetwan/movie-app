import { useEffect, useState } from "react"

const useFetch = <T>(fecthFuntion: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            const result = await fecthFuntion()
            setData(result)
        } catch (error) {
            // @ts-ignore
            setError(error instanceof Error ? error : new Error('An erroe occurred'))
        } finally {
            setLoading(false)
        }
    }
    const reset = () => {
        setData(null)
        setLoading(false)
        setError(null)
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData()
        }
    }, [])
    return { data, loading, error, refetch: fetchData, reset }
}

export default useFetch

